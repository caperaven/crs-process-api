export class LookupActions {
    static async perform(step, context, process, item) {
        return await this[step.action](step, context, process, item);
    }

    static async rest_lookup(step, context, process, item) {
        // 1. rest api
        // 2. field mapping

        let url = step.args.url;
        let field_mapping = step.args.field_mapping;

        // 1. Get data from URL
        // 2. Show data in selection grid
        // 3. Make selection
        // 3.1 If successful copy values as per field_mapping
        // 3.2. If Not you are done
        // 4. perform next_step
    }
}

/**
 * args: {
 *     url: "https://wiki.guildwars2.com/wiki/API:2/traits",
 *     field_mapping: {
 *         id: "$binding.traitId",
 *         name: "$binding.traitCode",
 *         description: "$binding.traitDescription"
 *     }
 * }
 */


// crs.intent.lookup.onkey_lookup = function () {
//     // On Key Lookup stuff
// }

// <button click.process="lookup.onkey_lookup(args: $my_lookup_args)" is="lookup">Lookup</button>