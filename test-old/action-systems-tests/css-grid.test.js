import {loadBinding} from "../mockups/crsbinding.mock.js";
import {ElementMock} from "../mockups/element.mock";

let element;

class DocumentFragmentMock {
}

globalThis.DocumentFragment = DocumentFragmentMock;

beforeAll(async () => {
    globalThis.HTMLElement = ElementMock;
    element = new ElementMock("div", "grid");

    await loadBinding();
    await import("../../src/index.js");
    await import("../../src/action-systems/css-grid-actions.js");

    await crs.call("cssgrid", "init", {element: element});
})

beforeEach(async () => {
    element.style.gridTemplateColumns = "";
    element.style.gridTemplateRows = "";
})

test("cssgrid - init", async () => {
    await crs.call("cssgrid", "set_columns", {element: element, columns: "1fr 1fr 1fr"});
    await crs.call("cssgrid", "set_rows", {element: element, rows: "2fr, 1fr, 1fr"});

    expect(element.style.display).toEqual("grid");
    expect(element.style.gridTemplateColumns).toEqual("1fr 1fr 1fr");
    expect(element.style.gridTemplateRows).toEqual("2fr, 1fr, 1fr");
})

test("cssgrid - add column", async () => {
    await crs.call("cssgrid", "add_columns", {element: element, position: "end", width: ["10px", "11px", "12px"]});
    await crs.call("cssgrid", "add_columns", {element: element, position: "front", width: "20px"});
    await crs.call("cssgrid", "add_columns", {element: element, position: 1, width: "30px"});

    expect(element.style.gridTemplateColumns).toEqual("20px 30px  10px 11px 12px");
})

test("cssgrid - add rows", async () => {
    await crs.call("cssgrid", "add_rows", {element: element, position: "end", height: ["10px", "11px", "12px"]});
    await crs.call("cssgrid", "add_rows", {element: element, position: "front", height: "20px"});
    await crs.call("cssgrid", "add_rows", {element: element, position: 1, height: "30px"});

    expect(element.style.gridTemplateRows).toEqual("20px 30px  10px 11px 12px");
})