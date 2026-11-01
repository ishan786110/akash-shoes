// api/og.js - Vercel Edge Function
// Dynamically injects product Open Graph meta tags into the real index.html.
//
// 1. Social bots (WhatsApp, Facebook, Twitter, Telegram, Discord, etc.):
//    Parse the injected OG meta tags in <head> and display rich previews
//    with the product image, title, price, and description.
//
// 2. Real users (opening in browser or clicking inside WhatsApp/social apps):
//    Receive the exact same index.html with the full React SPA scripts,
//    which mounts and renders the exact original ProductPage UI.
//
// 3. No infinite redirect loops, no user-agent sniffing bugs, and no stripped-down HTML body.

export const config = {
  runtime: "edge",
};

const FIREBASE_PROJECT_ID = "aakash-shoes";
const SITE_URL = "https://www.aakashshoes.com";

export default async function handler(req) {
  const url = new URL(req.url);
  const id = url.searchParams.get("id");
  const origin =
    url.origin && !url.origin.includes("localhost") ? url.origin : SITE_URL;

  // 1. Fetch the real SPA index.html from origin (or fallback to SITE_URL)
  let indexHtml = "";
  try {
    const res = await fetch(`${origin}/index.html`);
    if (res.ok) {
      indexHtml = await res.text();
    }
  } catch (err) {
    console.error("Error fetching index.html from origin:", err);
  }

  if (!indexHtml && origin !== SITE_URL) {
    try {
      const res = await fetch(`${SITE_URL}/index.html`);
      if (res.ok) {
        indexHtml = await res.text();
      }
    } catch (err) {
      console.error("Error fetching index.html from SITE_URL:", err);
    }
  }

  // If no product ID is present, return index.html as is
  if (!id) {
    return new Response(indexHtml || "Not Found", {
      status: indexHtml ? 200 : 404,
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  }

  // 2. Fetch product data from Firestore REST API
  let product = null;
  try {
    const firestoreUrl =
      `https://firestore.googleapis.com/v1/projects/${FIREBASE_PROJECT_ID}` +
      `/databases/(default)/documents/products/${encodeURIComponent(id)}`;

    const res = await fetch(firestoreUrl);
    if (res.ok) {
      const data = await res.json();
      if (data.fields) {
        product = parseFirestoreDoc(data.fields);
      }
    }
  } catch (error) {
    console.error("Firestore fetch error:", error);
  }

  // If product not found in Firestore, serve index.html directly (React Router will handle loading/not found)
  if (!product) {
    return new Response(indexHtml, {
      status: 200,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=30",
      },
    });
  }

  // 3. Prepare product metadata
  const productName = product.name || "Aakash Shoes - Premium Footwear";
  const productImage = product.imageUrl || `${origin}/website-ss.png`;
  const productPrice =
    product.discountPrice ?? product.originalPrice ?? null;
  const priceText = productPrice ? ` - Rs.${productPrice}` : "";
  const fullTitle = `${productName}${priceText} | Aakash Shoes`;
  const pageUrl = `${SITE_URL}/product/${encodeURIComponent(id)}`;
  const description =
    product.description && product.description.trim().length > 5
      ? product.description.trim()
      : "Discover premium footwear at Aakash Shoes. From casual sneakers to formal shoes, boots, and athletic wear. 23+ years of expertise.";

  // 4. Inject metadata into index.html
  const finalHtml = injectMetadata(indexHtml, {
    title: fullTitle,
    description,
    image: productImage,
    url: pageUrl,
    productName,
  });

  return new Response(finalHtml, {
    status: 200,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "public, s-maxage=300, stale-while-revalidate=60",
    },
  });
}

function injectMetadata(html, { title, description, image, url, productName }) {
  if (!html) {
    // Fallback minimal HTML only if index.html failed to fetch completely
    return `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(title)}</title>
  <meta name="description" content="${escapeHtml(description)}" />
  <link rel="canonical" href="${escapeHtml(url)}" />
  <meta property="og:type" content="product" />
  <meta property="og:site_name" content="Aakash Shoes" />
  <meta property="og:title" content="${escapeHtml(title)}" />
  <meta property="og:description" content="${escapeHtml(description)}" />
  <meta property="og:image" content="${escapeHtml(image)}" />
  <meta property="og:url" content="${escapeHtml(url)}" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${escapeHtml(title)}" />
  <meta name="twitter:description" content="${escapeHtml(description)}" />
  <meta name="twitter:image" content="${escapeHtml(image)}" />
  <script>window.location.replace("${escapeHtml(url)}");</script>
</head>
<body></body>
</html>`;
  }

  // Clean out any default title, canonical, and OG/Twitter tags
  const cleaned = html
    .replace(/<title>[^<]*<\/title>/gi, "")
    .replace(/<link\s+rel=["']canonical["'][^>]*\/?>/gi, "")
    .replace(/<meta\s+name=["']description["'][^>]*\/?>/gi, "")
    .replace(/<meta\s+property=["']og:[^"']+["'][^>]*\/?>/gi, "")
    .replace(/<meta\s+name=["']twitter:[^"']+["'][^>]*\/?>/gi, "");

  const metaTags = [
    `    <title>${escapeHtml(title)}</title>`,
    `    <meta name="description" content="${escapeHtml(description)}" />`,
    `    <link rel="canonical" href="${escapeHtml(url)}" />`,
    `    <meta property="og:type" content="product" />`,
    `    <meta property="og:site_name" content="Aakash Shoes" />`,
    `    <meta property="og:title" content="${escapeHtml(title)}" />`,
    `    <meta property="og:description" content="${escapeHtml(description)}" />`,
    `    <meta property="og:image" content="${escapeHtml(image)}" />`,
    `    <meta property="og:image:secure_url" content="${escapeHtml(image)}" />`,
    `    <meta property="og:image:alt" content="${escapeHtml(productName)}" />`,
    `    <meta property="og:image:width" content="800" />`,
    `    <meta property="og:image:height" content="800" />`,
    `    <meta property="og:url" content="${escapeHtml(url)}" />`,
    `    <meta name="twitter:card" content="summary_large_image" />`,
    `    <meta name="twitter:title" content="${escapeHtml(title)}" />`,
    `    <meta name="twitter:description" content="${escapeHtml(description)}" />`,
    `    <meta name="twitter:image" content="${escapeHtml(image)}" />`,
  ].join("\n");

  if (/<head[^>]*>/i.test(cleaned)) {
    return cleaned.replace(/(<head[^>]*>)/i, `$1\n${metaTags}`);
  }

  return metaTags + cleaned;
}

function parseFirestoreDoc(fields) {
  const obj = {};
  for (const [key, val] of Object.entries(fields)) {
    if (val.stringValue !== undefined) {
      obj[key] = val.stringValue;
    } else if (val.integerValue !== undefined) {
      obj[key] = Number(val.integerValue);
    } else if (val.doubleValue !== undefined) {
      obj[key] = Number(val.doubleValue);
    } else if (val.booleanValue !== undefined) {
      obj[key] = val.booleanValue;
    } else if (val.nullValue !== undefined) {
      obj[key] = null;
    }
  }
  return obj;
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}