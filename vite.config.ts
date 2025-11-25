import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const appsScriptUrl = env.VITE_APPS_SCRIPT_URL;

  const server =
    appsScriptUrl && appsScriptUrl.length > 0
      ? {
          proxy: {
            '/api/apps-script': {
              target: appsScriptUrl,
              changeOrigin: true,
              followRedirects: true,
              rewrite: () => '',
            },
          },
        }
      : undefined;

  return {
    plugins: [react()],
    server,
  };
});
