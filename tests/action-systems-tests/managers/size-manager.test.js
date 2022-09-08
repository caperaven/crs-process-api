import { assertEquals } from "https://deno.land/std@0.147.0/testing/asserts.ts";
import {SizeManager} from "./../../../src/action-systems/managers/size-manager.js"

Deno.test("size-manager - fill", async () => {
    let updateCalled = false;

    const instance = new SizeManager(() => updateCalled = true);
    instance.fill(10, 100);

    assertEquals(instance._collection.length, 100);
    assertEquals(instance.size, 1000);
    assertEquals(updateCalled, true);
})

Deno.test("size-manager - append", async () => {
    let updateCalled = false;
    const instance = new SizeManager(() => updateCalled = true);

    // 1. append the first set of items to the collection
    instance.append([
        { size: 10, dataIndex: 0 },
        { size: 20, dataIndex: 1 }
    ]);

    // 2. assert first set changes too, place
    assertEquals(instance.size, 30);

    // 4. append the second set of changes
    instance.append([
        { size: 50, dataIndex: 2 }
    ]);

    // 5. assert the second set
    assertEquals(instance.size, 80);
    assertEquals(updateCalled, true);
})