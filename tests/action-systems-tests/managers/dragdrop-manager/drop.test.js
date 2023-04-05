import { describe, it } from "https://deno.land/std@0.157.0/testing/bdd.ts";
import {assert, assertEquals} from "https://deno.land/std@0.147.0/testing/asserts.ts";
import {init} from "./../../../mockups/init.js";
import {EventMock} from "../../../mockups/event-mock.js";
import {ElementMock} from "../../../mockups/element-mock.js";
import {allowDrop} from "./../../../../src/action-systems/managers/dragdrop-manager/drop.js";

await init();

describe("drop tests", () => {
    it ("drop", async () => {

    });

    it ("gotoOrigin", async () => {

    });

    it ("gotoTarget", async () => {

    });

    it ("allowDrop - null", async () => {
        const self = {
            composedPath: () => {
                return [];
            }
        }

        const result = await allowDrop.call(self, null);
        assertEquals(result, null);
    });

    it ("allowDrop - placeholder drop", async () => {
        const target = new ElementMock();
        target.classList.add("placeholder");

        const self = {
            composedPath: [target]
        }

        const result = await allowDrop.call(self, target);
        assertEquals(result.target, target);
        assertEquals(result.position, "before");
    });

    it ("allowDrop - parent - css check", async () => {
        const target = new ElementMock();
        const parent = new ElementMock();
        parent.appendChild(target);
        parent.matches = () => {return true};

        const self = {
            composedPath: [target]
        }

        const result = await allowDrop.call(self, target, {
            drop: {
                allowDrop: ".test"
            }
        });

        assertEquals(result.target, parent);
        assertEquals(result.position, "append");
    });

    it("allowDrop - function check", async () => {
        const target = new ElementMock();

        const self = {
            composedPath: [target]
        }

        const result = await allowDrop.call(self, target, {
            drop: {
                allowDrop: () => {
                    return {
                        target,
                        position: "before"
                    }
                }
            }
        });

        assertEquals(result.target, target);
        assertEquals(result.position, "before");
    });
})