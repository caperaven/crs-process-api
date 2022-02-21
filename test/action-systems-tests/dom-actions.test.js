import {loadBinding} from "../mockups/crsbinding.mock";
import {ElementMock} from "../mockups/element.mock";

beforeAll(async () => {
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