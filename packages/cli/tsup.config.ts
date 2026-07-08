import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/bin/zenith.ts"],
  format: ["esm"],
  dts: true,
  clean: true,
  minify: true,
  shims: true, // Injects node globals for ESM compatibility
  banner: {
    // Workaround for shebang validation in compiled bundle outputs
    js: "#!/usr/bin/env node",
  },
});
