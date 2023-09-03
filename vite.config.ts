import {defineConfig, loadEnv, splitVendorChunkPlugin} from 'vite';
import react from '@vitejs/plugin-react';
import {resolve} from 'path';
import {createHtmlPlugin} from "vite-plugin-html";

const ENV_PREFIX = ["REACT_APP_", "SERVER_", "VITE_"];

// https://vitejs.dev/config/
export default defineConfig(({mode}) => {
  const env = loadEnv(mode, "config", ENV_PREFIX);
  
  return {
    envDir: 'config',
    resolve: {
      alias: {
        process: "process/browser",
        '@': `${resolve(__dirname, 'src')}`,
      },
    },
    plugins: [
      react(),
      createHtmlPlugin({
        inject: {
          data: {
            env: {
              NODE_ENV: process.env.NODE_ENV,
              REACT_APP_CLIENT_TOKEN: process.env.REACT_APP_CLIENT_TOKEN,
              REACT_APP_ENV: process.env.REACT_APP_ENV,
              TITLE: env.REACT_APP_TITLE,
            },
          },
        },
        minify: true,
      }),
      splitVendorChunkPlugin(),
    ],
    server: {
      port: 3000,
      open: env.SERVER_OPEN_BROWSER === "true",
    },
    build: {
      assetsDir: 'assets',
      outDir: 'dist/' + env.REACT_APP_NAME,
      emptyOutDir: true,
    },
  }
})
