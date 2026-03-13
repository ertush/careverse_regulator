import path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react'
import proxyOptions from './proxyOptions';

const dirname = path.dirname(fileURLToPath(import.meta.url))

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],
	base: '/assets/careverse_regulator/compliance-360/',
	server: {
		port: 8080,
		host: '0.0.0.0',
		proxy: proxyOptions
	},
	resolve: {
		alias: {
			'@': path.resolve(dirname, 'src')
		}
	},
	build: {
		outDir: '../careverse_regulator/public/compliance-360',
		emptyOutDir: true,
		target: 'es2015',
		manifest: true,
		sourcemap: true,
		rollupOptions: {
			output: {
				manualChunks: undefined,
			},
		},
	},
});
