import {assertEquals} from "https://deno.land/std@0.147.0/testing/asserts.ts";
import {getDraggable} from "../../../src/action-systems/managers/dragdrop-manager/drag-utils.js"
import {EventMock} from "../../mockups/event-mock.js";

Deno.test('getDraggable should return null when no draggable element is found', () => {
    const event = new EventMock({});
    event.composedPath = () => [{matches: () => false}];
    const result = getDraggable(event);
    assertEquals(result, null);
});

Deno.test('getDraggable should return the target element when it matches the dragQuery', () => {
    const target = {};
    const event = new EventMock(target);
    event.composedPath = () => [{id: "match", matches: (query) => query === '[draggable="true"]'}];
    const result = getDraggable(event, { dragQuery: '[draggable="true"]' });
    assertEquals(result.id, event.composedPath()[0].id);
});

Deno.test('getDraggable should return the parent element when it matches the dragQuery', () => {
    const target = {
        matches: () => false,
        parentElement: {id: "match", matches: (query) => query === '[draggable="true"]'}
    };
    const event = new EventMock(target);
    event.composedPath = () => [target];
    const result = getDraggable(event, { dragQuery: '[draggable="true"]' });
    assertEquals(result.id, target.parentElement.id);
});

Deno.test('getDraggable should return the first element in composedPath that matches the dragQuery', () => {
    const target = {
        parentElement: {matches: () => false}
    };
    const event = new EventMock(target);
    event.composedPath = () => [
        {id:"match", matches: (query) => query === '[draggable="true"]'},
        {matches: () => false}
    ];
    const result = getDraggable(event, { dragQuery: '[draggable="true"]' });
    assertEquals(result.id, event.composedPath()[0].id);
});

