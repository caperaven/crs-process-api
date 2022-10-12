import {ElementMock, mockElement} from "./element-mock.js"

globalThis.document = new ElementMock("document");
globalThis.document.head = new ElementMock("head");
globalThis.document.body = new ElementMock("body");

document.appendChild(globalThis.document.head);
document.appendChild(globalThis.document.body);

globalThis.document.createElement = (tag) => {
    if (globalThis.__elementRegistry[tag] != null) {
        return mockElement(new globalThis.__elementRegistry[tag]());
    }
    return new ElementMock(tag);
}

globalThis.document.createDocumentFragment = () => {
    return new ElementMock();
}
