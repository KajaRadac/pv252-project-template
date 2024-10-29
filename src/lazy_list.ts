const template = document.createElement("template");
template.innerHTML = `
<style>
#list {
  height: var(--height);
  width: var(--width);  
  border: var(--border);
  padding: var(--padding);
  overflow: scroll;
  scrollbar-width: none;
}
#spacer-top {
  width: 100%;
  height: 0px;
}
#spacer-bottom {
  width: 100%;
  height: 1000px;
}
</style>
<div id="list">
  <div id="spacer-top"></div>
  <slot></slot>
  <div id="spacer-bottom"></div>
</div>
`;

export type Renderer<T> = (item: T) => HTMLElement;

export class LazyList<T> extends HTMLElement {
  // By default, the list renders the items as div-s with strings in them.
  #renderFunction: Renderer<T> = (item) => {
    const element = document.createElement("div");
    element.innerText = JSON.stringify(item);
    return element;
  };

  // These could be useful properties to consider, but not mandatory to use.
  // Similarly, feel free to edit the shadow DOM template in any way you want.

  // By default, the list is empty.
  #data: T[] = [];

  // The index of the first visible data item.
  #visiblePosition: number = 0;

  // The amount of space that needs to be shown before the first visible item.
  #topOffset: number = 0;
  #topOffsetElement: HTMLElement;
  // The amount of space that needs to be shown after the last visible item.
  #bottomOffset: number = 0;
  #bottomOffsetElement: HTMLElement;

  // The container that stores the spacer elements and the slot where items are inserted.
  #listElement: HTMLElement;
  #items: number = 2;
  #itemHeight: number = 350;


  static register() {
    customElements.define("lazy-list", LazyList);
  }

  constructor() {
    super();
  }

  connectedCallback() {
    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(template.content.cloneNode(true));

    this.#topOffsetElement =
      this.shadowRoot.querySelector<HTMLElement>("#spacer-top")!;
    this.#bottomOffsetElement =
      this.shadowRoot.querySelector<HTMLElement>("#spacer-bottom")!;
    this.#listElement = this.shadowRoot.querySelector<HTMLElement>("#list")!;

    this.#listElement.onscroll = () => {
      this.#scrollPositionChanged();
    };

  };


  setData(data: T[]) {
    this.#data = data;
    this.#updateVisibleContent();
  }

  setRenderer(renderer: Renderer<T>) {
    this.#renderFunction = renderer;
  }

  #updateVisibleContent() {

    const visibleItemCount = Math.ceil(this.#listElement.clientHeight / this.#itemHeight) + this.#items;
    const startIndex = Math.max(this.#visiblePosition - this.#items, 0);
    const endIndex = Math.min(startIndex + visibleItemCount, this.#data.length);

    this.#topOffset = startIndex * this.#itemHeight;
    this.#bottomOffset = (this.#data.length - endIndex) * this.#itemHeight;

    this.#topOffsetElement.style.height = `${this.#topOffset}px`;
    this.#bottomOffsetElement.style.height = `${this.#bottomOffset}px`;

    this.innerHTML = '';
    for (let i = startIndex; i < endIndex; i++) {
      const itemElement = this.#renderFunction(this.#data[i]);
      this.appendChild(itemElement);
    }
  }

  #scrollPositionChanged(){

    const scrollTop = this.#listElement.scrollTop;
    const startIndex = Math.floor(scrollTop / this.#itemHeight);
    if (startIndex !== this.#visiblePosition) {
      this.#visiblePosition = startIndex;
      this.#updateVisibleContent();
    }

  }
}
