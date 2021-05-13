import "./../src/index.js";
import {getValueOnPath} from "./mockups/binding-mocks.js";
import {loopExample} from "./schemas/loop-example.js";

let logs = {
    log: null
};

beforeAll(() => {
    global.console = {
        log: (msg) => logs.log = msg
    }

    global.crsbinding = {
        expression: {
            compile: (exp) => {
                exp = exp.replace("@context", "context").replace("@process", "context").replace("@item", "context");
                return {
                    function: new Function("context", `return ${exp};`)
                };
            }
        },
        utils: {
            getValueOnPath: getValueOnPath
        }
    };
})

test("ProcessRunner - run", async () => {
    const context = createContext(20);

    const result = await crs.process.run(context, loopExample.distribute_array);
    expect(result).not.toBeUndefined();
    expect(result.min_collection.length).toEqual(11);
    expect(result.max_collection.length).toEqual(9);
})

function createContext(count) {
    const result = [];

    for (let i = 0; i < count; i++) {
        result.push({
            value: i
        })
    }

    return {
        records: result
    };
}