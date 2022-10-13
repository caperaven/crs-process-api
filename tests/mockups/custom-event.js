class CustomEvent {
    constructor(event, detail) {
        this.event = event;
        this.detail = detail;
    }
}

globalThis.CustomEvent = CustomEvent;