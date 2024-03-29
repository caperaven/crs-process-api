/**
 * JHR: Skipping these tests for now until I get can my deno fixed.
 */

import {MoveManager} from "../../../src/action-systems/managers/move-manager.js";
import {assertEquals} from "https://deno.land/std@0.147.0/testing/asserts.ts";
import {init} from "./../../mockups/init.js";
import {ElementMock} from "../../mockups/element-mock.js";

await init();

globalThis.requestAnimationFrame = (callback) => callback();

Deno.test("move-manager - clicked element matches the move query", async () => {
    // Arrange
    const element = new ElementMock("div");
    element.bounds = {x: 0, y: 0, width: 100, height: 100};
    element.matches = (query) => true;

    const instance = new MoveManager(element, "header");

    // Act
    await element.performEvent("mousedown", element, {composedPath: () => [{matches: (query) => query === "header"}]});

    // Assert
    assertEquals(document.__events.length, 2);

    // Dispose
    document.__events = [];
    instance.dispose()
});

Deno.test("move-manager - clicked element does not match the move query", async () => {
    // Arrange
    const element = new ElementMock("div");
    element.bounds = {x: 0, y: 0, width: 100, height: 100};

    const instance = new MoveManager(element, "header");

    // Act
    await element.performEvent("mousedown", element, {composedPath: () => [{matches: (query) => query !== "header"}]});

    // Assert
    assertEquals(document.__events.length, 0);

    // Dispose
    document.__events = [];
    instance.dispose();
});

Deno.test("move-manager - move query is null and target == element", async () => {
    // Arrange
    const element = new ElementMock("div");
    element.bounds = {x: 0, y: 0, width: 100, height: 100};

    const instance = new MoveManager(element);

    // Act
    await element.performEvent("mousedown", element, {composedPath: () => [element]});

    // Assert
    assertEquals(document.__events.length, 2);

    // Dispose
    document.__events = [];
    instance.dispose();
});

Deno.test("move-manager - move query is null and target != element", async () => {
    // Arrange
    const element = new ElementMock("div");
    element.bounds = {x: 0, y: 0, width: 100, height: 100};

    const instance = new MoveManager(element);

    // Act
    await element.performEvent("mousedown", element, {composedPath: () => [{}]});

    // Assert
    assertEquals(document.__events.length, 0);

    // Dispose
    document.__events = [];
    instance.dispose();
});

Deno.test("move-manager - clicked element is within the shadow dom", async () => {
    // Arrange
    const element = new ElementMock("div");
    element.bounds = {x: 0, y: 0, width: 100, height: 100};

    const instance = new MoveManager(element, "header");

    // Act
    await element.performEvent("mousedown",element, {
        composedPath: () => [
            {matches: (query) => query !== "header"},
            {matches: (query) => query === "header"}
        ]
    });

    // Assert
    assertEquals(document.__events.length, 2);

    // Dispose
    document.__events = [];
    instance.dispose();
});

Deno.test("move-manager - clicked element is within the shadow dom no move query provided", async () => {
    // Arrange
    const element = new ElementMock("div");
    element.bounds = {x: 0, y: 0, width: 100, height: 100};

    const instance = new MoveManager(element, "move");

    // Act
    await element.performEvent("mousedown", element, {
        composedPath: () => [
            {matches: (query) => query === "header"}
        ]
    });

    // Assert
    assertEquals(document.__events.length, 0);

    // Dispose
    document.__events = [];
    instance.dispose();
});