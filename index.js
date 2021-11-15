import {schema as loopSchema} from "./app/schemas/loop-example.js";
import {domExample as domExample} from "./app/schemas/dom-example.js";
import {schema as migrateSchema} from "./app/schemas/data-migrate-example.js";
import {schema as visualNone} from "./app/schemas/visual-non-visual-steps.js";

crs.processSchemaRegistry.add(loopSchema);
crs.processSchemaRegistry.add(domExample);
crs.processSchemaRegistry.add(migrateSchema);
crs.processSchemaRegistry.add(visualNone);
crs.processSchemaRegistry.onError = (error) => {
    console.error(error);
}

const trans = {
    buttons: {
        save: "Save",
        cancel: "Cancel",
        ok: "Ok"
    },
    labels: {
        firstName: "First Name",
        lastName: "Last Name",
        age: "Age"
    }
}

await crsbinding.translations.add(trans);
