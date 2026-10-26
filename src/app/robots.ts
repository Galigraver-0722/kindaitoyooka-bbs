import type { MetadataRoute } from "next";

/**
 * Beta stays out of search engines. A school board indexed halfway through
 * testing is hard to undo: posts outlive the test, and the cached snippet can
 * keep showing content that was later removed.
 *
 * Flip this to `allow` (and delete the block) once the site is announced.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", disallow: "/" }],
  };
}
