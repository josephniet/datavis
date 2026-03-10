import { defineConfig } from 'vite'

const baseConfig = { build: {} }
export default defineConfig({
    ...baseConfig,
    build: {
        ...baseConfig.build,
        minify: false,
        outDir: 'dist-readable',
        rollupOptions: {
            preserveEntrySignatures: 'strict',
            output: {
                preserveModules: true,
                entryFileNames: '[name].js',
                chunkFileNames: '[name].js',
            },
        },
    },
})