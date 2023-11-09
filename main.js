import 'scalajs:main.js';

// this is working, the node is correctly replaced
import { createApp, h } from "vue";
import { wrap } from "./src/wrapper/index.ts";
import Counter from "./src/components/Counter.vue";
import Embedded from "./src/components/Embedded.vue";

const counterWebComponent = wrap(Counter, createApp, h);
window.customElements.define("demo-counter", counterWebComponent);

const embeddedWC = wrap(Embedded, createApp, h);
window.customElements.define("demo-embedded", embeddedWC);

