import {loadBinding} from "../mockups/crsbinding.mock.js";
import {get_file_name, get_files} from "../../src/action-systems/files-action.js";

beforeAll(async () => {
    await loadBinding();
    await import("../../src/index.js");
})

test("get_file_name", async () => {
    const file = await get_file_name("/folder/file1.additional.png");
    expect(file.name).toEqual("file1");
    expect(file.ext).toEqual("png");
})

test("get_files", async() => {
    global.fetch = () => new Promise(resolve => {
        resolve({
            blob: () => {
                return "done"
            }
        })
    })

    const result = await get_files({ args: {
            files: ["/folder/file1.png"]
        }
    })

    expect(result[0].value).toEqual("done");
    expect(result[0].name).toEqual("file1");
    expect(result[0].ext).toEqual("png");
})