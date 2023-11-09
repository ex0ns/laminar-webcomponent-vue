import {
  Component,
  CreateAppFunction,
  ConcreteComponent,
  App,
  ComponentPublicInstance,
  VNode,
  ComponentOptionsWithObjectProps
} from 'vue';

import { toHandlerKey } from '@vue/shared';

import {
  KeyHash,
  toVNodes,
  camelize,
  hyphenate,
  groupBy,
  setInitialProps,
  createCustomEvent,
  convertAttributeValue
} from './utils';

export interface WebComponentOptions {
  connectedCallback?(): void;
}

/**
 * Vue 3 wrapper to convert a Vue component into Web Component. Supports reactive attributes, events & slots.
 */
export function wrap(
  component: Component,
  createApp: CreateAppFunction<Element>,
  h: <P>(type: ConcreteComponent<P> | string, props?: KeyHash, children?: () => unknown) => VNode,
  options?: WebComponentOptions
): CustomElementConstructor {
  const componentObj: ComponentOptionsWithObjectProps = <ComponentOptionsWithObjectProps>component;

  let isInitialized = false;

  let hyphenatedPropsList: string[];
  let camelizedPropsList: string[];
  let camelizedPropsMap: KeyHash;

  function initialize() {
    if (isInitialized) {
      return;
    }

    // extract props info
    const propsList: string[] = Array.isArray(componentObj.props)
      ? componentObj.props
      : Object.keys(componentObj.props || {});
    hyphenatedPropsList = propsList.map(hyphenate);
    camelizedPropsList = propsList.map(camelize);

    const originalPropsAsObject = Array.isArray(componentObj.props) ? {} : componentObj.props || {};
    camelizedPropsMap = camelizedPropsList.reduce((map: KeyHash, key, i) => {
      map[key] = originalPropsAsObject[propsList[i]];
      return map;
    }, {});

    isInitialized = true;
  }

  class CustomElement extends HTMLElement {
    _wrapper?: App;
    _component?: ComponentPublicInstance;

    _props!: KeyHash;
    _slotChildren!: (VNode | null)[];
    _mounted = false;

    constructor() {
      super();

      this._props = {};
      this._slotChildren = [];

      // Use MutationObserver to react to future attribute & slot content change
      const observer = new MutationObserver(mutations => {
        let hasChildrenChange = false;

        for (let i = 0; i < mutations.length; i++) {
          const m = mutations[i];

          if (isInitialized && m.type === 'attributes' && m.target === this) {
            if (m.attributeName) {
              this.syncAttribute(m.attributeName);
            }
          } else {
            hasChildrenChange = true;
          }
        }

        if (hasChildrenChange) {
          // this line is changing everything
          this.syncSlots();
        }
      });

      observer.observe(this, {
        childList: true,
        subtree: true,
        characterData: true,
        attributes: true
      });
    }

    createEventProxies(eventNames: string[] | undefined): {
      [name: string]: (...args: unknown[]) => void;
    } {
      const eventProxies: { [name: string]: (...args: unknown[]) => void } = {};

      if (eventNames) {
        eventNames.forEach(name => {
          const handlerName = toHandlerKey(camelize(name));
          eventProxies[handlerName] = (...args: unknown[]): void => {
            this.dispatchEvent(createCustomEvent(name, args));
          };
        });
      }

      return eventProxies;
    }

    syncAttribute(key: string): void {
      const camelized = camelize(key);
      let value = undefined;

      if (this.hasOwnProperty(key)) {
        value = (<KeyHash>this)[key];
      } else if (this.hasAttribute(key)) {
        value = this.getAttribute(key);
      }

      this._props[camelized] = convertAttributeValue(value, key, camelizedPropsMap[camelized]);

      this._component?.$forceUpdate();
    }

    syncSlots(): void {
      console.log("========= ChildNodes =========")
      console.log(this.childNodes);
      console.log("========= End ChildNodes =========")

      this._slotChildren = toVNodes(this.childNodes, h).filter((t) => t && t.props?.slot);
      this._component?.$forceUpdate();
    }

    syncInitialAttributes(): void {
      this._props = setInitialProps(camelizedPropsList);

      hyphenatedPropsList.forEach(key => {
        this.syncAttribute(key);
      });
    }

    connectedCallback() {
      if (isInitialized) {
        // initialize attributes
        this.syncInitialAttributes();
      }

      const eventProxies = this.createEventProxies(<string[]>componentObj.emits);

      // eslint-disable-next-line @typescript-eslint/no-this-alias
      const self = this;
      this._wrapper = createApp({
        render() {
          const props = Object.assign({}, self._props, eventProxies);
          delete props.dataVApp;

          const slots = groupBy(self._slotChildren, (t) => t.props.slot || "default");
          const slotFunctions = Object.fromEntries(Object.entries(slots).map(([k, v]) => [k, () => v]));
          console.log("========= Slots =========")
          console.log(slots)
          console.log("========= End Slots =========")
          return h(componentObj, props, slotFunctions as unknown);
        },
        mounted() {
          self._mounted = true;
        },
        unmounted() {
          self._mounted = false;
        }
      });

      // initialize children
      this.syncSlots();

      // Mount the component
      this._component = this._wrapper.mount(this);

      if (options?.connectedCallback) {
        options.connectedCallback.bind(this)();
      }
    }

    disconnectedCallback() {
      this._wrapper?.unmount();
    }
  }

  initialize();

  return CustomElement;
}

