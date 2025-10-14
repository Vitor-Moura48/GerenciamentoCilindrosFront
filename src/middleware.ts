export { default } from "next-auth/middleware";

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/cylinder-movements/:path*",
    "/estoque/:path*",
    "/sectors/:path*",
    "/autonomy-analyse/:path*",
    "/profile/:path*",
  ],
};