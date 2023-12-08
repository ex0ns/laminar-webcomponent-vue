import { defineConfig } from "vite";
import vue from '@vitejs/plugin-vue';
import scalaJSPlugin from '@scala-js/vite-plugin-scalajs';

export default defineConfig(({ command, mode }) => {
   return {
     build: {
      minify: false
    },
    plugins: [
      vue({ customElement: true }),
      scalaJSPlugin()
    ]
   };
});
