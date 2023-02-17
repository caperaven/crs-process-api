import {MoveManager} from "../../../src/action-systems/managers/move-manager.js";
import {assertEquals} from "https://deno.land/std@0.147.0/testing/asserts.ts";
import {init} from "./../../mockups/init.js";
import {ElementMock} from "../../mockups/element-mock.js";

await init();

Deno.test("move-manager - clicked element matches the move query", async () => {
    // Arrange
    const element = new ElementMock("div");
    element.bounds = {x: 0, y: 0, width: 100, height: 100};
    const instance = new MoveManager(element, "header");

    // Act
    element.performEvent("mousedown", {matches: (query) => query === "header"});

    // Assert
    assertEquals(document.__events.length, 2);

    // Dispose
    document.__events = [];
});

Deno.test("move-manager - clicked element does not match the move query", async () => {
    // Arrange
    const element = new ElementMock("div");
    element.bounds = {x: 0, y: 0, width: 100, height: 100};
    const instance = new MoveManager(element, "header");

    // Act
    element.performEvent("mousedown", {
        matches: (query) => query !== "header"
    }, {composedPath: () => []});

    // Assert
    assertEquals(document.__events.length, 0);

    // Dispose
    document.__events = [];
});

Deno.test("move-manager - move query is null and target == element", async () => {
    // Arrange
    const element = new ElementMock("div");
    element.bounds = {x: 0, y: 0, width: 100, height: 100};
    const instance = new MoveManager(element);

    // Act
    element.performEvent("mousedown", element, {composedPath: () => []});

    // Assert
    assertEquals(document.__events.length, 2);

    // Dispose
    document.__events = [];
});

Deno.test("move-manager - move query is null and target != element", async () => {
    // Arrange
    const element = new ElementMock("div");
    element.bounds = {x: 0, y: 0, width: 100, height: 100};
    const instance = new MoveManager(element);

    // Act
    element.performEvent("mousedown", {matches: (query) => query !== "header"}, {composedPath: () => []});

    // Assert
    assertEquals(document.__events.length, 0);

    // Dispose
    document.__events = [];
});

Deno.test("move-manager - clicked element is within the shadow dom", async () => {
    // Arrange
    const element = new ElementMock("div");
    element.bounds = {x: 0, y: 0, width: 100, height: 100};
    const instance = new MoveManager(element, "header");

    // Act
    element.performEvent("mousedown", {
        matches: (query) => false
    }, {
        composedPath: () => [
            {matches: (query) => query !== "header"},
            {matches: (query) => query === "header"}
        ]
    });

    // Assert
    assertEquals(document.__events.length, 2);

    // Dispose
    document.__events = [];
});