import "./../src/index.js";
import {getValueOnPath} from "./mockups/binding-mocks.js";
import {schema} from "./schemas/schema.js";

let log = null;

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

    const result = await crs.process.run(context, schema.distribute_array);
    expect(result).not.toBeUndefined();
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