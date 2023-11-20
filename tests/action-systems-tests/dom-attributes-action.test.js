import {assert, assertEquals} from "https://deno.land/std@0.147.0/testing/asserts.ts";
import {describe, it} from "https://deno.land/std@0.157.0/testing/bdd.ts";
import {beforeAll} from "https://deno.land/std@0.157.0/testing/bdd.ts";
import {init} from "./../mockups/init.js";

import "./../mockups/init.js";

await init();
describe("dom attributes action test", async () => {

    beforeAll(async () => {
        await import("./../../src/action-systems/dom-attributes-action.js");
    });

    describe("dom attributes action", async () => {
        it("should add an attribute to an element", async () => {
            //Arrange
            const expectedValue = true;
            const element = await crs.call("dom", "create_element", {
                tag_name: "div",
                id: "testElementAdd",
            });

            document.children[1].appendChild(element);

            //Act
            await crs.call("dom_attributes", "perform", {
                add: [
                    {
                        element: "#testElementAdd",
                        attr: "hidden",
                        value: true
                    }
                ]
            });
            const actualValue = element.getAttribute("hidden");

            //Assert
            assertEquals(actualValue, expectedValue);
        });

        it("should remove attribute from an element", async () => {
            //Arrange
            const expectedValue = undefined;
            const element = await crs.call("dom", "create_element", {
                tag_name: "div",
                id: "testElementRemove",
                attributes: {
                    hidden: true
                }
            });

            document.children[1].appendChild(element);

            //Act
            await crs.call("dom_attributes", "perform", {
                remove: [
                    {
                        element: "#testElementRemove",
                        attr: "hidden",
                    }
                ]
            });

            const actualValue = element.getAttribute("hidden");

            //Assert
            assertEquals(actualValue, expectedValue);
        });

        it("should set certain elements attributes and remove others", async () => {
            //Arrange
            const expectedValueAdd = true;
            const expectedValueRemove = undefined;
            const element = await crs.call("dom", "create_element", {
                tag_name: "div",
                attributes: {
                    id: "parentContainer"
                },
                children: [
                    {
                        tag_name: "div",
                        id: "addElement"
                    },
                    {
                        tag_name: "div",
                        id: "removeElement",
                        attributes: {
                            hidden: true
                        }
                    }
                ]
            });
            document.children[1].appendChild(element);

            //act
            await crs.call("dom_attributes", "perform", {
                add: [
                    {
                        element: "#addElement",
                        attr: "hidden",
                        value: true
                    }
                ],
                remove: [
                    {
                        element: "#removeElement",
                        attr: "hidden"
                    }
                ]
            });

            //Assert
            assertEquals(element.querySelector("#addElement").getAttribute("hidden"), expectedValueAdd);
            assertEquals(element.querySelector("#removeElement").getAttribute("hidden"), expectedValueRemove);
        });
    });

    describe("dom attributes action edge-cases", () => {
        it("should not fail if empty add and remove array is passed through", async () => {
            //Act
            await crs.call("dom_attributes", "perform", {
                add: [],
                remove: []
            });
        });

        it("should not fail if empty object is passed through", async () => {
            //Act
            await crs.call("dom_attributes", "perform", {});
        });

        it("should not fail if null is passed through", async () => {
            //Act
            await crs.call("dom_attributes", "perform", null);
        });

        it("should not fail if remove = null or one of the values in the add array is null and is passed through", async () => {
            //Arrange
            const element = await crs.call("dom", "create_element", {
                tag_name: "div",
                id: "testAdded",
            });

            document.children[1].appendChild(element);

            //Act
            await crs.call("dom_attributes", "perform", {
                add: [
                    {
                        element: "#testAdded",
                        attr: "hidden",
                        value: true
                    },
                    null
                ],
                remove: null
            });

            //Assert
            assertEquals(element.getAttribute("hidden"), true);
        });

        it("should not fail if remove = null is passed through", async () => {
            //Arrange
            const element = await crs.call("dom", "create_element", {
                tag_name: "div",
                id: "testElementAdded",
            });

            document.children[1].appendChild(element);

            //Act
            await crs.call("dom_attributes", "perform", {
                add: [
                    {
                        element: "#testElementAdded",
                        attr: "hidden",
                        value: true
                    }
                ],
                remove: null
            });

            //Assert
            assertEquals(element.getAttribute("hidden"), true);
        });

        it("should not fail if add = null is passed through", async () => {
            //Arrange
            const expectedValueRemove = undefined;
            const element = await crs.call("dom", "create_element", {
                tag_name: "div",
                id: "testRemoved",
                attributes: {
                    hidden: true
                }
            });

            document.children[1].appendChild(element);

            //Act
            await crs.call("dom_attributes", "perform", {
                add: null,
                remove: [
                    {
                        element: "#testRemoved",
                        attr: "hidden"
                    }
                ]
            });

            //Assert
            assertEquals(element.getAttribute("hidden"), expectedValueRemove);
        });

        it("should not fail if add = null or one of the values in the remove array is null and is passed through", async () => {
            //Arrange
            const expectedValueRemove = undefined;
            const element = await crs.call("dom", "create_element", {
                tag_name: "div",
                id: "removingAttribute",
                attributes: {
                    hidden: true
                }
            });

            document.children[1].appendChild(element);

            //Act
            await crs.call("dom_attributes", "perform", {
                add: null,
                remove: [
                    {
                        element: "#removingAttribute",
                        attr: "hidden"
                    },
                    null
                ]
            });

            //Assert
            assertEquals(element.getAttribute("hidden"), expectedValueRemove);
        });

        it('should not fail if the element passed it does not exist - add', async () => {
            //Arrange
            const expectedValueAdd = undefined;
            const element = await crs.call("dom", "create_element", {
                tag_name: "div",
                id: "existingElement",
            });

            document.children[1].appendChild(element);

            //Act
            await crs.call("dom_attributes", "perform", {
                add: [
                    {
                        element: "#nonExistingElement",
                        attr: "hidden",
                        value: true
                    }
                ]
            });

            //Assert
            assertEquals(element.getAttribute("hidden"), expectedValueAdd);
        });

        it('should not fail if the element passed it does not exist - remove', async () => {
            //Arrange
            const expectedValueAdd = true;
            const element = await crs.call("dom", "create_element", {
                tag_name: "div",
                id: "existingElement",
                attributes: {
                    hidden: true
                }
            });

            document.children[1].appendChild(element);

            //Act
            await crs.call("dom_attributes", "perform", {
                remove: [
                    {
                        element: "#nonExistingElement",
                        attr: "hidden",
                    }
                ]
            });

            //Assert
            assertEquals(element.getAttribute("hidden"), expectedValueAdd);
        });

        it('should not fail if value is undefined and action is add', async () => {
            //Arrange
            const expectedValueAdd = "hidden";
            const element = await crs.call("dom", "create_element", {
                tag_name: "div",
                id: "valueNullProperty",
            });

            document.children[1].appendChild(element);

            //Act
            await crs.call("dom_attributes", "perform", {
                add: [
                    {
                        element: "#valueNullProperty",
                        attr: "hidden",
                        value: null
                    }
                ]
            });

            //Assert
            assertEquals(element.getAttribute("hidden"), expectedValueAdd);
        });

        it('should not fail if value is not present on object and action is add', async () => {
            //Arrange
            const expectedValueAdd = "hidden";
            const element = await crs.call("dom", "create_element", {
                tag_name: "div",
                id: "valueNoneExistentProperty",
            });

            document.children[1].appendChild(element);

            //Act
            await crs.call("dom_attributes", "perform", {
                add: [
                    {
                        element: "#valueNoneExistentProperty",
                        attr: "hidden"
                    }
                ]
            });

            //Assert
            assertEquals(element.getAttribute("hidden"), expectedValueAdd);
        });
    });
});