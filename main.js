import 'scalajs:main.js';

// this is working, the node is correctly replaced
import { createApp, h } from "vue";
import { wrap } from "./src/wrapper/index.ts";
import Container from "./src/components/Container.vue";
import Embedded from "./src/components/Embedded.vue";

const containerWC = wrap(Container, createApp, h);
window.customElements.define("demo-container", containerWC);

const embeddedWC = wrap(Embedded, createApp, h);
window.customElements.define("demo-embedded", embeddedWC);

