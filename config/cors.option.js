export const corsOptions = {
  credentials: true,
  origin:
    process.env.NODE_ENV === "production"
      ? ["https://www.im-shy.me", "https://im-shy.me"]
      : "http://localhost:2209",
  allowedHeaders: [
    "Access-Control-Allow-Origin",
    "Access-Control-Allow-Credentials",
    "Access-Control-Allow-Headers",
    "Access-Control-Request-Headers",
    "Content-Type",
    "Origin",
    "X-Requested-With",
    "Content-Type",
    "Accept",
    "Set-Cookie",
    "Cookie",
  ],
};
