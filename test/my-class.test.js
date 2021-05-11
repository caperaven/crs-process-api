import {MyClass} from "../src/my-class.js";

let instance;

beforeEach(() => {
    instance = new MyClass();
});

afterEach(() => {
    instance.dispose();
});

test("my-class - constructed", () => {
    expect(instance).not.toBeNull();
});