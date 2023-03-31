import { describe, it } from "https://deno.land/std@0.157.0/testing/bdd.ts";
import {assert, assertEquals} from "https://deno.land/std@0.147.0/testing/asserts.ts";
import {init} from "./../../../mockups/init.js";
import {ElementMock} from "../../../mockups/element-mock.js";
import {applyPlaceholder, createPlaceholderElement} from "./../../../../src/action-systems/managers/dragdrop-manager/placeholder.js";

await init();

describe("placeholder tests", () => {
    it ("applyPlaceholder - standard", async () => {
        const element = new ElementMock();
        element.bounds = {width: 100, height: 100};
        const options = {
            drag: {
                placeholderType: "standard"
            }
        }

        const parentElement = new ElementMock();
        element.parentElement = parentElement;

        const placeholder = await applyPlaceholder(element, options);
        assertEquals(placeholder._bounds, {width: 100, height: 100});
        assertEquals(placeholder.style.width, "100px");
        assertEquals(placeholder.style.height, "100px");
        assert(placeholder.classList.contains("placeholder"));
    })

    it ("applyPlaceholder - opacity", async () => {
        const element = new ElementMock();
        element.bounds = {width: 100, height: 100};
        const options = {
            drag: {
                placeholderType: "opacity"
            }
        }

        const parentElement = new ElementMock();
        element.parentElement = parentElement;

        const placeholder = await applyPlaceholder(element, options);
        assertEquals(placeholder._bounds, {width: 100, height: 100});
        assert(placeholder.classList.contains("placeholder") == false);
        assertEquals(placeholder.style.opacity, "0.5");
    })

    it ("applyPlaceholder - none", async () => {
        const element = new ElementMock();
        element.bounds = {width: 100, height: 100};
        element.dataset.value = "10";

        const options = {
            drag: {
                placeholderType: "none"
            }
        }

        const parentElement = new ElementMock();
        element.parentElement = parentElement;

        const placeholder = await applyPlaceholder(element, options);
        assertEquals(placeholder._bounds, {width: 100, height: 100});
        assert(placeholder.classList.contains("placeholder") == false);
        assertEquals(placeholder.dataset.value, "10");
    })

    it ("createPlaceholderElement", async () => {
        const bounds = {width: 100, height: 100};
        const placeholder = await createPlaceholderElement(bounds);
        assertEquals(placeholder.style.width, "100px");
        assertEquals(placeholder.style.height, "100px");
    });
})