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
    // arrange
    let updateCalled = false;
    const instance = new SizeManager(() => updateCalled = true);

    // act
    instance.fill(10, 5);
    assertEquals(instance.size, 50);
    instance.insert(3, 20, 7);

    // console.log(instance._collection)

    // assert
    assertEquals(instance._collection[3].size, 20);
    assertEquals(updateCalled, true);
    assertEquals(instance.size, 70);
})
Deno.test("size-manager - append", async () => {
    let updateCalled = false;
    const instance = new SizeManager(() => updateCalled = true);

    instance.fill(10, 5);
    // console.log(instance);

    // 1. append the first set of items to the collection
    instance.append([
        { size: 55, dataIndex: 0 },
        { size: 77, dataIndex: 1 }
    ]);

    // console.log(instance);




    // 2. assert first set changes too, place

    assertEquals(instance.size, 182);

    // 4. append the second set of changes

    instance.append([
        { size: 18, dataIndex: 2 }
    ]);

    // 5. assert the second set

    assertEquals(instance.size, 200);
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