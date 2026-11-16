import { defineConfig } from 'astro/config';

// GitHub Pages serves a project repo from /<repo-name>/. When the repo exists,
// set SITE_BASE=/<repo-name> (and `site`) at build time. Locally it stays '/'.
export default defineConfig({
  base: process.env.SITE_BASE || '/',
  server: { port: 4321 },
  devToolbar: { enabled: false },
});
