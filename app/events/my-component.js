class MyComponent extends HTMLElement {
    onMessage(event) {
        this.textContent = event.message;
    }
}

customElements.define("my-component", MyComponent);