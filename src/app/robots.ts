import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/saved",
        "/planner",
        "/shopping-list",
        "/account",
        "/login",
        "/signup",
        "/auth/",
        "/recipes/*/cook",
      ],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
