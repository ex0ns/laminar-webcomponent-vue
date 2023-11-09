import { defineConfig } from "vite";
import vue from '@vitejs/plugin-vue';

export default defineConfig(({ command, mode }) => {
   return {
     build: {
      minify: false
    },
    plugins: [
      vue()
    ]
   };
});
