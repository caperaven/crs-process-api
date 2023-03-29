import { describe, it } from "https://deno.land/std@0.157.0/testing/bdd.ts";
import {assert, assertEquals} from "https://deno.land/std@0.147.0/testing/asserts.ts";
import {init} from "./../../../mockups/init.js";
import {getDraggable} from "./../../../../src/action-systems/managers/dragdrop-manager/drag-utils.js";
import {EventMock} from "../../../mockups/event-mock.js";
import {ElementMock} from "../../../mockups/element-mock.js";

await init();

describe("drag utils tests", () => {
    it ("getDraggable", async () => {
        const target = new ElementMock("div");
        target.setAttribute("draggable", "true");
        target.matches = () => true;

        const event = new EventMock(target);
        const options = {
            drag: {
                query: "[draggable='true']",
                cpIndex: 0
            }
        };
        const draggable = getDraggable(event, options);
        assert(draggable == target);
    });
})