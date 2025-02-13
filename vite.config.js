import { defineConfig } from "vite";

export default defineConfig({
    root: ".",
    build: {
        outDir: "dist"
    },
    base: '/handwriting_to_latex_notes/'
});
