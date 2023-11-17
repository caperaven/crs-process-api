import {assert, assertEquals} from "https://deno.land/std@0.147.0/testing/asserts.ts";
import { describe, it } from "https://deno.land/std@0.157.0/testing/bdd.ts";
import { beforeAll} from "https://deno.land/std@0.157.0/testing/bdd.ts";
import {init} from "./../mockups/init.js";

import "./../mockups/init.js";

await init();
describe("dom attributes action test", async () => {

    beforeAll(async () => {
        await import("./../../src/action-systems/dom-attributes-action.js");
    });

    describe( "dom attributes action", async () => {
        it("should add an attribute to an element", async () => {
            //Arrange
            const expectedValue = true;
            const element = await crs.call("dom", "create_element", {
                tag_name: "div",
                attributes: {
                    id: "testElement"
                }
            });

            //Act
            await crs.call("dom_attributes", "perform", {
                add: [
                    {
                        element: "#testElement",
                        attr: "hidden",
                        value: true
                    }
                ]
            });
            const actualValue = element.hidden;

            //Assert
            assertEquals(actualValue, expectedValue);
        });
        it("should remove attribute from an element", async () => {
            //Arrange
            const expectedValue = null;
            const element = await crs.call("dom", "create_element", {
                tag_name: "div",
                attributes: {
                    id: "testElement",
                    hidden: true
                }
            });

            //Act
            await crs.call("dom_attributes", "perform", {
               remove: [
                    {
                        element: "#testElement",
                        attr: "hidden",
                    }
                ]
            });

            const actualValue = element.hidden;

            //Assert
            assertEquals(actualValue, expectedValue);
        });

        it ("should set certain elements attributes and remove others", async () => {
            //Arrange
            const expectedValueAdd = true;
            const expectedValueRemove = null;
            const element = await crs.call("dom", "create_element", {
                tag_name: "div",
                attributes: {
                    id: "parentContainer"
                },
                children: [
                    {
                        tag_name: "div",
                        attributes: {
                            id: "addElement"
                        }
                    },
                    {
                        tag_name: "div",
                        attributes: {
                            id: "removeElement",
                            hidden: true
                        }
                    }
                ]
            });

            //act
            await crs.call("dom_attributes", "perform", {
                add:[
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
            assertEquals(element.querySelector("#addElement").hidden, expectedValueAdd);
            assertEquals(element.querySelector("#removeElement").hidden, expectedValueRemove);
        });
    });

    describe( "dom attributes action edge-cases", () => {
        it("should not fail if empty add and remove array is passed through", async () => {
           //Act
            await crs.call("dom_attributes", "perform", {
                add: [],
                remove: []
            });
        });

        it ("should not fail if empty object is passed through", async () => {
            //Act
            await crs.call("dom_attributes", "perform", {});
        });

        it ("should not fail if null is passed through", async () => {
            //Act
            await crs.call("dom_attributes", "perform", null);
        });

        it ("should not fail if remove = null is passed through", async () => {
            //Arrange
            const element = await crs.call("dom", "create_element", {
                tag_name: "div",
                attributes: {
                    id: "testElement",
                }
            });

            //Act
            await crs.call("dom_attributes", "perform", {
                add: [
                    {
                        element: "#testElement",
                        attr: "hidden",
                        value: true
                    }
                ],
                remove: null
            });

            //Assert
            assertEquals(element.hidden, true);
        });

        it ("should not fail if add = null is passed through", async () => {
            //Arrange
            const element = await crs.call("dom", "create_element", {
                tag_name: "div",
                attributes: {
                    id: "testElement",
                    hidden: true
                }
            });

            //Act
            await crs.call("dom_attributes", "perform", {
                add: null,
                remove: [
                    {
                        element: "#testElement",
                        attr: "hidden"
                    }
                ]
            });

            //Assert
            assertEquals(element.hidden, null);
        });
    });
});