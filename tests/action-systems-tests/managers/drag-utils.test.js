import { assertEquals } from "https://deno.land/std@0.147.0/testing/asserts.ts";
import {getScrollAreas} from "../../../src/action-systems/managers/dragdrop-manager/drag-utils.js"

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

    assertEquals(result[0].x1, 0);
    assertEquals(result[0].x2, 32);
    assertEquals(result[0].y1, 0);
    assertEquals(result[0].y2, 68);

    assertEquals(result[1].x1, 68);
    assertEquals(result[1].x2, 100);
    assertEquals(result[1].y1, 0);
    assertEquals(result[1].y2, 68);

    assertEquals(result[2].x1, 0);
    assertEquals(result[2].x2, 68);
    assertEquals(result[2].y1, 0);
    assertEquals(result[2].y2, 32);

    assertEquals(result[3].x1, 0);
    assertEquals(result[3].x2, 68);
    assertEquals(result[3].y1, 68);
    assertEquals(result[3].y2, 100);
})