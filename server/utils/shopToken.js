const sendShopToken = (shop, statusCode, res) => {
  const token = shop.getJwtToken();

  const options = {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
  };

  res.status(statusCode).cookie("seller_token", token, options).json({
    success: true,
    seller: shop,
    token,
  });
};

export default sendShopToken;
