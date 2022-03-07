import {loadBinding} from "../mockups/crsbinding.mock";
import {ElementMock} from "../mockups/element.mock";

globalThis.DocumentFragment = {};

class TempClass {
    get myValue() {
        return 50;
    }

    doSomething(stringValue) {
        return Number(stringValue) + this.myValue
    }
}

beforeAll(async () => {
    globalThis.HTMLElement = ElementMock;
    await loadBinding();
    await import("./../../src/index.js");
});

test("DomActions - create element target supplied", async () => {
    const context = {}

    await globalThis.crs.intent.dom.perform({
        action: "create_element",
        args: {
            target: "$context.myElement",
            tagName: "div",
            children: [
                {
                    tagName: "div",
                    attributes: {
                        "id": "childDiv"
                    }
                }
            ]
        }
    }, context);

    expect(context.myElement).not.toBeNull();
    expect(context.myElement).toBeInstanceOf<ElementMock>(ElementMock);
    expect(context.myElement.children).toHaveLength(1);
})

test ("DomActions - call_on_element", async () => {
    const element = new ElementMock("div", "div");
    element._custom = new TempClass();
    element._sameLevelFn = (myValue)=> {
        return 10 + Number(myValue);
    }

    const result = await crs.call("dom", "call_on_element", {
        element: element,
        action: "_custom.doSomething",
        parameters: ["$context.value"]
    }, { value: "100" });

    const result2 = await crs.call("dom", "call_on_element", {
        element: element,
        action: "_sameLevelFn",
        parameters: ["$context.value"]
    }, { value: "100" });

    expect(result).toEqual(150);
    expect(result2).toEqual(110);
})