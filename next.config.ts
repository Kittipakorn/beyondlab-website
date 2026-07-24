import type { NextConfig } from "next";

// Every route in this app is statically generated (no forms, no API routes,
// no per-user data), so a nonce-based CSP isn't usable here: Next.js can only
// inject a nonce into dynamically-rendered pages. A static CSP is the
// documented approach for fully static apps like this one.
// https://nextjs.org/docs/app/guides/content-security-policy#without-nonces
const isDev = process.env.NODE_ENV === "development";

const backendOrigin = process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:4000";

const contentSecurityPolicy = `
  default-src 'self';
  script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""};
  style-src 'self' 'unsafe-inline';
  img-src 'self' blob: data: https://api.qrserver.com;
  font-src 'self';
  connect-src 'self' ${backendOrigin};
  object-src 'none';
  base-uri 'self';
  form-action 'self' ${backendOrigin};
  frame-ancestors 'none';
  upgrade-insecure-requests;
`
  .replace(/\s{2,}/g, " ")
  .trim();

const securityHeaders = [
  { key: "Content-Security-Policy", value: contentSecurityPolicy },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
