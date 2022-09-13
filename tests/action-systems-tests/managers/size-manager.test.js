import { assertEquals } from "https://deno.land/std@0.147.0/testing/asserts.ts";
import {SizeManager} from "./../../../src/action-systems/managers/size-manager.js";

Deno.test("size-manager - fill", async () => {
    let updateCalled = false;

    const instance = new SizeManager(() => updateCalled = true);
    instance.fill(10, 100);

    assertEquals(instance._collection.length, 100);
    assertEquals(instance.size, 1000);
    assertEquals(updateCalled, true);
})

Deno.test("size-manager - insert", async () =>{
    let updateCalled = false;
    const instance = new SizeManager(() => updateCalled = true);

    instance.fill(10, 5);
    assertEquals(instance.size, 50);
    instance.insert(3, 20, 7);


    assertEquals(instance._collection[3].size, 20);
    assertEquals(updateCalled, true);
    assertEquals(instance.size, 70);
})
Deno.test("size-manager - append", async () => {
    let updateCalled = false;
    const instance = new SizeManager(() => updateCalled = true);

    instance.fill(10, 5);

    instance.append([
        { size: 55, dataIndex: 0 }

    ]);

    assertEquals(instance.size, 105);

    instance.append([
        { size: 18, dataIndex: 2 }
    ]);

    assertEquals(instance.size, 123);
    assertEquals(updateCalled, true);
})

Deno.test("size-manager - at", async () => {
    let updateCalled = false;
    const instance = new SizeManager(() => updateCalled = true);

    instance.fill(10, 5);

    const value = instance.at(4)

    assertEquals(value, instance._collection[4]);
    assertEquals(updateCalled, true);
})

Deno.test("size-manager - update", async () =>{
    let updateCalled = false;
    const instance = new SizeManager(() => updateCalled = true);

    instance.fill(10, 5);
    instance.update(4, 20, 7);

    assertEquals(instance._collection[4].size, 20);

    assertEquals(instance.size, 60);

    instance.update(0, 5, 1);
    assertEquals(instance.size, 55);

})

Deno.test("size-manager - move", async () =>{
    let updateCalled = false;
    const instance = new SizeManager(() => updateCalled = true);

    instance.fill(10, 5);

    instance.append([
        { size: 77, dataIndex: 2 }
    ])

    instance.move(5,0)
    assertEquals(instance._collection[0].size, 77);

    assertEquals(instance.size, 127)

})

Deno.test("size-manager - remove", async () =>{
    let updateCalled = false;
    const instance = new SizeManager(() => updateCalled = true);

    instance.fill(10, 5);
    assertEquals(instance.size, 50)

    instance.remove(2, 1)
    assertEquals(instance.size, 40)

    assertEquals(updateCalled, true);

})

Deno.test("size-manager - recalculate", async () =>{
    let updateCalled = false;
    const instance = new SizeManager(() => updateCalled = true);

    instance.fill(10, 5);
    assertEquals(instance.size, 50);

    instance.append([
        { size: 18, dataIndex: 2 }
    ]);
    assertEquals(instance.size, 68);
    let calSize = instance.recalculate();
    assertEquals(calSize, 68);

    instance.remove(5, 1);
    assertEquals(instance.size, 50);

})