import {assertEquals} from "https://deno.land/std@0.147.0/testing/asserts.ts";
import {ElementMock} from "../mockups/element-mock.js";
import {init} from "./../mockups/init.js";
await init();
let element;

async function beforeEach() {
    element = new ElementMock("div", "grid");
    await crs.call("cssgrid", "init", {element: element});
}

Deno.test("cssgrid - init", async () => {
    await beforeEach();

    await crs.call("cssgrid", "set_columns", {element: element, columns: "1fr 1fr 1fr"});
    await crs.call("cssgrid", "set_rows", {element: element, rows: "2fr, 1fr, 1fr"});

    assertEquals(element.style.display, "grid");
    assertEquals(element.style.gridTemplateColumns, "1fr 1fr 1fr");
    assertEquals(element.style.gridTemplateRows, "2fr, 1fr, 1fr");
})

Deno.test("cssgrid - add column", async () => {
    await beforeEach();

    await crs.call("cssgrid", "add_columns", {element: element, position: "end", width: ["10px", "11px", "12px"]});
    await crs.call("cssgrid", "add_columns", {element: element, position: "front", width: "20px"});
    await crs.call("cssgrid", "add_columns", {element: element, position: 1, width: "30px"});

    assertEquals(element.style.gridTemplateColumns, "20px 30px  10px 11px 12px");
})

Deno.test("cssgrid - add rows", async () => {
    await beforeEach();

    await crs.call("cssgrid", "add_rows", {element: element, position: "end", height: ["10px", "11px", "12px"]});
    await crs.call("cssgrid", "add_rows", {element: element, position: "front", height: "20px"});
    await crs.call("cssgrid", "add_rows", {element: element, position: 1, height: "30px"});

    assertEquals(element.style.gridTemplateRows, "20px 30px  10px 11px 12px");
})