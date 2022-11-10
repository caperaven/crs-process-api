import {ClassList} from "./class-list.js";
import {Style} from "./style.js";
import {cloneElementMock} from "./clone-node.js";
import {find, findAll, createQueryFunction} from "./query.js";
import {EventMock} from "./event-mock.js";

export class ElementMock {
    constructor(tag, id, parentElement) {
        mockElement(this, tag, id, parentElement);

        if (parentElement != null) {
            parentElement.appendChild(this);
        }
    }
}

export function mockElement(instance, tag, id) {
    instance.__events = [];
    instance.queryResults = {};

    instance.nodeName = (tag || "div").toUpperCase();
    instance.id = id;
    instance.name = id;

    instance.textContent = "";
    instance.innerText = "";
    instance.attributes = [];
    instance.children = [];
    instance.dataset = {};
    instance.classList = new ClassList();
    instance.style = new Style();

    instance.getAttribute = getAttribute.bind(instance);
    instance.setAttribute = setAttribute.bind(instance);
    instance.removeAttribute = removeAttribute.bind(instance);
    instance.querySelector = querySelector.bind(instance);
    instance.getElementsByTagName = getElementsByTagName.bind(instance);
    instance.querySelectorAll = querySelectorAll.bind(instance);
    instance.cloneNode = cloneNode.bind(instance);
    instance.appendChild = appendChild.bind(instance);
    instance.removeChild = removeChild.bind(instance);
    instance.addEventListener = addEventListener.bind(instance);
    instance.removeEventListener = removeEventListener.bind(instance);
    instance.insertBefore = insertBefore.bind(instance);
    instance.replaceChild = replaceChild.bind(instance);
    instance.dispatchEvent = dispatchEvent.bind(instance);
    instance.performEvent = performEvent.bind(instance);
    instance.attachShadow = attachShadow.bind(instance);
    instance.getBoundingClientRect = getBoundingClientRect.bind(instance);

    Object.defineProperty(instance, "firstElementChild", {
        get() {
            if (this.children.length == 0) return null;
            return this.children[0];
        }
    })

    Object.defineProperty(instance, "nextElementSibling", {
        get() {
            const index = this.parentElement.children.indexOf(this);
            return this.parentElement.children[index + 1];
        }
    })

    Object.defineProperty(instance, "previousElementSibling", {
        get() {
            const index = this.parentElement.children.indexOf(this);
            return this.parentElement.children[index - 1];
        }
    })

    Object.defineProperty(instance, "innerHTML", {
        get() {
            return this._innerHTML || "";
        },

        set(newValue) {
            this._innerHTML = newValue;
            if (newValue.trim().length == 0) {
                this.children.length = 0;
            }
        }
    });

    Object.defineProperty(instance, "content", {
        get() {
            const clone = cloneElementMock(this);
            clone.id = "document-fragment";
            clone.nodeName = "DOCUMENT_FRAGMENT";
            return clone;
        },

        set(newValue) {}
    });

    return instance;
}

export function createMockChildren(instance) {
    if (instance.innerHTML.trim() > 0) {

    }
}

function getAttribute(attr) {
    if (this.attributes.length == 0) return;

    const result = this.attributes.find(item => item.name == attr);
    return result?.value;
}

function setAttribute(attr, value) {
    const attrObj = {
        name: attr,
        value: value,
        ownerElement: this
    };

    const old = this.getAttribute(attr);
    this.attributes.push(attrObj);

    if (this["attributeChangedCallback"] != null) {
        this["attributeChangedCallback"](attr, old.value, value);
    }
}

function removeAttribute (attr) {
    const attrObj = this.attributes.find(item => item.name == attr);

    if (attrObj != null) {
        const index = this.attributes.indexOf(attrObj);
        this.attributes.splice(index, 1);
        attrObj.ownerElement = null;
    }
}

function querySelector(selector) {
    if (this.queryResults[selector] != null) {
        return this.queryResults[selector];
    }

    const callback = createQueryFunction(selector);
    return find(this, callback);
}

function getElementsByTagName(selector) {
    if (this.queryResults[selector] != null) {
        return this.queryResults[selector];
    }

    const result = [];
    for (const child of this.children) {
        if (child.nodeName.toLowerCase() == selector.toLowerCase()) {
            result.push(child);
        }
    }

    return result;
}

function querySelectorAll(selector) {
    const callback = createQueryFunction(selector);
    const result = [];
    findAll(this, callback, result);
    return result;
}

function cloneNode() {
    return cloneElementMock(this);
}

function appendChild(element) {
    this.children.push(element);
    element.parentElement = this;
    return element;

}

function removeChild(child) {
    const index = this.children.indexOf(child);

    if (index != -1) {
        const removed = this.children.splice(index, 1);
        removed.parentElement = null;
        return removed;
    }

    return null;

}

function addEventListener(event, callback) {
    this.__events.push({ event: event, callback: callback });
}

function removeEventListener(event, callback) {
    const index = this.__events.findIndex(item => item.event == event && item.callback == callback);

    if (index != -1) {
        const removed = this.__events.splice(index, 1);
        removed.event = null;
        removed.callback = null;
    }
}

function insertBefore(newElement, oldElement) {
    const index = this.children.indexOf(oldElement);
    this.children.splice(index, 0, newElement);
}

function replaceChild(node, child) {
    const index = this.children.indexOf(child);

    if (index != -1) {
        this.children.splice(index, 1, node);
    }
}

function dispatchEvent(event, args) {
    const events = this.__events.filter(item => {
        event = typeof item.event == "object" ? item.event.event : item.event
        return item.event == event
    }) || [];
    for (let eventItem of events) {
        eventItem.callback(args);
    }
}

function performEvent(event, target, options) {
    const eventObj = new EventMock(target || this, options);
    const events = this.__events.filter(item => item.event == event) || [];
    for (let eventItem of events) {
        eventItem.callback(eventObj);
    }
    return eventObj;
}

function attachShadow(args) {
    this.shadowRoot = new ElementMock("shadow-root");
}

function getBoundingClientRect() {
    if (this.bounds == null) {
        throw new Error("bounds on element mock must be set");
    }
    return this.bounds;
}