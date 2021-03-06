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

test("DomActions - set_properties_on_element", async () => {
    const element = new ElementMock("my-custom", "myCustom");
    const context = {};
    const process = {data: {element}};
    const args = {
        element: "$process.data.element",
        properties: {
            test1: "1",
            test2: "2"
        }
    }

    await crs.call("dom", "set_properties", args, context, process);

    expect(element.test1).toEqual("1");
    expect(element.test2).toEqual("2");

    args.element = element;
    args.properties = {test3: "3"};
    process.data = {};

    await crs.call("dom", "set_properties", args, context, process);

    expect(element.test1).toEqual("1");
    expect(element.test2).toEqual("2");
    expect(element.test3).toEqual("3");
})

test("DomActions - get_property", async () => {
    const element = new ElementMock("my-custom", "myCustom");
    element.test1 = "1";
    const context = {};
    let process = {data: {element}};
    const args = {
        element: "$process.data.element",
        property: "test1"
    }

    let value = await crs.call("dom", "get_property", args, context, process);
    expect(value).toEqual("1");

    value = null;
    process = {};
    args.element = element;
    value = await crs.call("dom", "get_property", args, context, process);
    expect(value).toEqual("1");
});