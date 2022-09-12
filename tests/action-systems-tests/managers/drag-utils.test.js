import { assertEquals } from "https://deno.land/std@0.147.0/testing/asserts.ts";
import { inArea, getScrollAreas } from "../../../src/action-systems/managers/dragdrop-manager/drag-utils.js"

Deno.test("drag-utils - getScrollArea", () => {
    const result = getScrollAreas({
        getBoundingClientRect: () => {
            return {
                left: 0,
                top: 0,
                width: 100,
                height: 100
            }
        }
    }, "hv");

    assertEquals(result.left.x1, 0);
    assertEquals(result.left.x2, 32);
    assertEquals(result.left.y1, 0);
    assertEquals(result.left.y2, 68);

    assertEquals(result.right.x1, 68);
    assertEquals(result.right.x2, 100);
    assertEquals(result.right.y1, 0);
    assertEquals(result.right.y2, 68);

    assertEquals(result.top.x1, 0);
    assertEquals(result.top.x2, 68);
    assertEquals(result.top.y1, 0);
    assertEquals(result.top.y2, 32);

    assertEquals(result.bottom.x1, 0);
    assertEquals(result.bottom.x2, 68);
    assertEquals(result.bottom.y1, 68);
    assertEquals(result.bottom.y2, 100);
})

Deno.test("drag-utils", "inArea", () => {
    assertEquals(inArea(15, 15, {x1: 10, x2: 20, y1: 10, y2: 20}), true);
    assertEquals(inArea(0, 15, {x1: 10, x2: 20, y1: 10, y2: 20}), false);
    assertEquals(inArea(15, 0, {x1: 10, x2: 20, y1: 10, y2: 20}), false);
    assertEquals(inArea(30, 15, {x1: 10, x2: 20, y1: 10, y2: 20}), false);
    assertEquals(inArea(15, 30, {x1: 10, x2: 20, y1: 10, y2: 20}), false);
})