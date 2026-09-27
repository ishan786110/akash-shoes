// api/og.js — Vercel Edge Function
// Intercepts /product/:id requests from social bots and injects
// dynamic Open Graph meta tags (product image, name, price).

export const config = {
  runtime: "edge",
};

const FIREBASE_PROJECT_ID = "aakash-shoes";
const SITE_URL = "https://aakashshoes.vercel.app"; // update to your actual live domain

export default async function handler(req) {
  const url = new URL(req.url);
  const id = url.searchParams.get("id");

  // Fetch product from Firestore REST API (no SDK needed in Edge runtime)
  let product = null;
  try {
    const firestoreUrl =
      `https://firestore.googleapis.com/v1/projects/${FIREBASE_PROJECT_ID}/databases/(default)/documents/products/${id}`;
    const res = await fetch(firestoreUrl);
    if (res.ok) {
      const data = await res.json();
      if (data.fields) {
        product = parseFirestoreDoc(data.fields);
      }
    }
  } catch (e) {
    console.error("Firestore fetch error:", e);
  }

  const productName = product?.name ?? "Aakash Shoes - Premium Footwear";
  const productImage = product?.imageUrl ?? `${SITE_URL}/website-ss.png`;
  const productPrice = product?.discountPrice ?? product?.originalPrice ?? null;
  const priceText = productPrice ? ` - Rs.${productPrice}` : "";
  const description = "Discover premium footwear at aakash shoes. From casual sneakers to formal shoes, boots, and athletic wear. 23+ years of expertise, global shipping.";

  const pageUrl = `${SITE_URL}/product/${id}`;

  const html = [
    "<!doctype html>",
    "<html lang=\"en\">",
    "  <head>",
    "    <meta charset=\"UTF-8\" />",
    "    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\" />",
    `    <title>${productName}${priceText} | Aakash Shoes</title>`,
    `    <meta name="description" content="${description}" />`,
    "    <meta property=\"og:type\" content=\"product\" />",
    "    <meta property=\"og:site_name\" content=\"Aakash Shoes\" />",
    `    <meta property="og:title" content="${productName}${priceText}" />`,
    `    <meta property="og:description" content="${description}" />`,
    `    <meta property="og:image" content="${productImage}" />`,
    "    <meta property=\"og:image:width\" content=\"800\" />",
    "    <meta property=\"og:image:height\" content=\"800\" />",
    `    <meta property="og:url" content="${pageUrl}" />`,
    "    <meta name=\"twitter:card\" content=\"summary_large_image\" />",
    `    <meta name="twitter:title" content="${productName}${priceText}" />`,
    `    <meta name="twitter:description" content="${description}" />`,
    `    <meta name="twitter:image" content="${productImage}" />`,
    `    <script>window.location.href = "${pageUrl}";</script>`,
    `    <noscript><meta http-equiv="refresh" content="0;url=${pageUrl}" /></noscript>`,
    "  </head>",
    "  <body>",
    `    <p>Redirecting to <a href="${pageUrl}">${productName}</a>...</p>`,
    "  </body>",
    "</html>",
  ].join("\n");

  return new Response(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "public, s-maxage=600, stale-while-revalidate=60",
    },
  });
}

/**
 * Converts Firestore REST API field format to a plain JS object.
 * e.g. { name: { stringValue: "Nike Air" } } => { name: "Nike Air" }
 */
function parseFirestoreDoc(fields) {
  const obj = {};
  for (const [key, val] of Object.entries(fields)) {
    if (val.stringValue !== undefined) obj[key] = val.stringValue;
    else if (val.integerValue !== undefined) obj[key] = Number(val.integerValue);
    else if (val.doubleValue !== undefined) obj[key] = Number(val.doubleValue);
    else if (val.booleanValue !== undefined) obj[key] = val.booleanValue;
    else if (val.nullValue !== undefined) obj[key] = null;
  }
  return obj;
}
