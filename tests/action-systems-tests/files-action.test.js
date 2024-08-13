import {describe, it, beforeAll} from "https://deno.land/std@0.157.0/testing/bdd.ts";
import {assertEquals,assertRejects } from "https://deno.land/std@0.147.0/testing/asserts.ts";
import {init} from "./../mockups/init.js"

describe("File Actions Tests", async () =>{
    await init();
    globalThis.fetch = async (filePath) => {
        const fileContent = await Deno.readFile(new URL("../action-systems-tests/data/sample_data.lic", import.meta.url));
        const blob = new Blob([fileContent]);
        return new Response(blob);
    };

    it("load_as - load a valid format where dialog False and content format is json", async () => {
        const expectedResult = [{
            Licence:"eyJUaHVtYnByaW50IjoiMDQ5MjZDREY5RDJDRkREQzJDOEQ3OTNCMzE0R",
            Certificate:"30820222300D06092A864886F70D01010105000382020F003082020"
        }];

        const result = await crs.call("files", "load_as", {
            dialog: false,
            file_format: "json",
            file_paths: ["../tests/data/sample_data.lic"]
        });

        assertEquals(result, expectedResult);
    });

    it("load_as - load a valid format where dialog False and content format is text", async () => {
        const expectedResult = [
            "{\"Licence\":\"eyJUaHVtYnByaW50IjoiMDQ5MjZDREY5RDJDRkREQzJDOEQ3OTNCMzE0R\",\"Certificate\":\"30820222300D06092A864886F70D01010105000382020F003082020\"}"
        ];

        const result = await crs.call("files", "load_as", {
            dialog: false,
            file_format: "text",
            file_paths: ["../tests/data/sample_data.lic"]
        });

        assertEquals(result, expectedResult);
    });

    it("load_as - load an invalid format where dialog False and content format is xml", async () => {
        const expectedErrorMeassage = "Invalid file format: xml";
        assertRejects(
            async () => {
                await crs.call("files", "load_as", {
                    dialog: false,
                    file_format: "xml"
                });
            },
            Error,
            expectedErrorMeassage);
    });
});