// Products/events store a denormalized snapshot of their shop rather than a
// live reference, so Mongoose's schema-level `select: false` on Shop.password
// never applies to it — anything spread into that snapshot is served to the
// public as-is. Only ever pass shop data through this before embedding or
// returning it, never the raw Shop document.
const PUBLIC_SHOP_FIELDS = ["_id", "name", "avatar", "description", "address", "createdAt"];

export const toPublicShop = (shop) => {
  if (!shop) return shop;
  const plain = typeof shop.toObject === "function" ? shop.toObject() : shop;
  const publicShop = {};
  for (const field of PUBLIC_SHOP_FIELDS) {
    if (plain[field] !== undefined) publicShop[field] = plain[field];
  }
  return publicShop;
};

export const toPublicShopList = (docs) =>
  docs.map((doc) => {
    const plain = typeof doc.toObject === "function" ? doc.toObject() : doc;
    if (!plain.shop) return plain;
    return { ...plain, shop: toPublicShop(plain.shop) };
  });
