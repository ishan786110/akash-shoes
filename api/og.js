// api/og.js
// Dynamic OG metadata for product sharing.
//
// Social bots:
//   /api/og?id=PRODUCT_ID
//   -> returns dynamic OG HTML
//
// Real users:
//   /api/og?id=PRODUCT_ID
//   -> redirects to /product/PRODUCT_ID
//
// This allows WhatsApp/Facebook/etc. to read the product metadata,
// while normal users are sent to the actual React product page.

export const config = {
  runtime: "edge",
};

const FIREBASE_PROJECT_ID = "aakash-shoes";
const SITE_URL = "https://aakashshoes.com";

// Known social media / search engine bots
const BOT_UA_PATTERN =
  /WhatsApp|facebookexternalhit|Facebot|Twitterbot|TelegramBot|LinkedInBot|Slackbot|Discordbot|Googlebot|bingbot|DuckDuckBot|Applebot|Pinterest|Snapchat/i;

export default async function handler(req) {
  const userAgent = req.headers.get("user-agent") ?? "";
  const url = new URL(req.url);

  const id = url.searchParams.get("id");

  // Product ID is required
  if (!id) {
    return new Response("Product ID is required", {
      status: 400,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
      },
    });
  }

  // ============================================================
  // REAL USER
  // ============================================================
  //
  // If a normal user opens the OG URL directly or clicks it,
  // send them to the actual React product page.
  //
  if (!BOT_UA_PATTERN.test(userAgent)) {
    const productUrl = `${SITE_URL}/product/${encodeURIComponent(id)}`;

    return Response.redirect(productUrl, 302);
  }

  // ============================================================
  // SOCIAL MEDIA / SEARCH BOT
  // ============================================================

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

  // ============================================================
  // PRODUCT DATA
  // ============================================================

  const productName =
    product?.name ?? "Aakash Shoes - Premium Footwear";

  const productImage =
    product?.imageUrl ?? `${SITE_URL}/website-ss.png`;

  const productPrice =
    product?.discountPrice ?? product?.originalPrice ?? null;

  const priceText = productPrice
    ? ` - Rs.${productPrice}`
    : "";

  const description =
    "Discover premium footwear at Aakash Shoes. From casual sneakers to formal shoes, boots, and athletic wear. 23+ years of expertise.";

  // IMPORTANT:
  // This is the URL that users should actually visit.
  const pageUrl = `${SITE_URL}/product/${encodeURIComponent(id)}`;

  // ============================================================
  // ESCAPE HTML
  // ============================================================

  const safeProductName = escapeHtml(productName);
  const safeProductImage = escapeHtml(productImage);
  const safeDescription = escapeHtml(description);
  const safePageUrl = escapeHtml(pageUrl);

  // ============================================================
  // DYNAMIC OG HTML
  // ============================================================

  const html = [
    "<!doctype html>",
    '<html lang="en">',
    "  <head>",
    '    <meta charset="UTF-8" />',
    '    <meta name="viewport" content="width=device-width, initial-scale=1.0" />',

    // Title
    `    <title>${safeProductName}${priceText} | Aakash Shoes</title>`,

    // Description
    `    <meta name="description" content="${safeDescription}" />`,

    // Open Graph
    '    <meta property="og:type" content="product" />',
    '    <meta property="og:site_name" content="Aakash Shoes" />',

    `    <meta property="og:title" content="${safeProductName}${priceText} | Aakash Shoes" />`,

    `    <meta property="og:description" content="${safeDescription}" />`,

    `    <meta property="og:image" content="${safeProductImage}" />`,

    '    <meta property="og:image:width" content="800" />',
    '    <meta property="og:image:height" content="800" />',

    `    <meta property="og:url" content="${safePageUrl}" />`,

    // Twitter
    '    <meta name="twitter:card" content="summary_large_image" />',

    `    <meta name="twitter:title" content="${safeProductName}${priceText} | Aakash Shoes" />`,

    `    <meta name="twitter:description" content="${safeDescription}" />`,

    `    <meta name="twitter:image" content="${safeProductImage}" />`,

    "  </head>",

    "  <body>",
    `    <h1>${safeProductName}</h1>`,
    `    <img src="${safeProductImage}" alt="${safeProductName}" />`,
    `    <p>${safeDescription}</p>`,
    `    <a href="${safePageUrl}">View Product</a>`,
    "  </body>",

    "</html>",
  ].join("\n");

  return new Response(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",

      // Cache OG response
      "Cache-Control":
        "public, s-maxage=600, stale-while-revalidate=60",
    },
  });
}

/**
 * Converts Firestore REST API field format
 * into a normal JavaScript object.
 *
 * Example:
 *
 * {
 *   name: {
 *     stringValue: "Nike Air Max"
 *   }
 * }
 *
 * becomes:
 *
 * {
 *   name: "Nike Air Max"
 * }
 */
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

/**
 * Prevent product data from breaking the generated HTML.
 */
function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}