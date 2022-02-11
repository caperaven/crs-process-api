import {loadBinding} from "./../mockups/crsbinding.mock.js";

beforeAll(async () => {
    await loadBinding();
    await import("./../../src/index.js");
})

test("translations - add / get / delete", async () => {
    await crs.intent.translations.add({ args: {
        translations: {
            buttons: {
                ok: "Ok",
                cancel: "Cancel"
            }
        }
    }})

    const bound = await crsbinding.translations.get("buttons.ok");
    expect(bound).toEqual("Ok");

    let translation = await crs.intent.translations.get({ args: {
        key: "buttons.ok"
    }})
})