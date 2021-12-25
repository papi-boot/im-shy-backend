export const corsOptions = {
  credentials: true,
  origin: process.env.NODE_ENV === "production" ? "https://www.creative-cookie.studio" : "http://localhost:2209",
  allowedHeaders: [
    "Access-Control-Allow-Credentials",
    "Access-Control-Allow-Headers",
    "Access-Control-Request-Headers",
    "Access-Control-Allow-Origin",
    "Content-Type",
    "Origin",
    "X-Requested-With",
    "Content-Type",
    "Accept",
    "Set-Cookie",
    "Cookie",
  ],
};