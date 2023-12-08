import 'scalajs:main.js';

// this is working, the node is correctly replaced
import { createApp, h, defineCustomElement } from "vue";
import Container from "./src/components/Container.vue";
import Embedded from "./src/components/Embedded.vue";

window.customElements.define("demo-container", defineCustomElement(Container));
window.customElements.define("demo-embedded", defineCustomElement(Embedded));

