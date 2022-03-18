import "./crs-process-api-schema.js"

export async function init() {
    globalThis.crs.validate = globalThis.crs.validate || {};

    /**
     * Load the different providers for validate and process.
     */
    globalThis.crs.api_providers = {
        "action"            : (await import("./providers/action-provider")).default,
        "array"             : (await import("./providers/array-provider")).default,
        "binding"           : (await import("./providers/binding-provider")).default
    }

    /**
     * Load the different validate requirements.
     */
    globalThis.crs.validate.arrayMap = {
        "add"               : (await import("./providers/array-providers/add-rule.js")).default,
        "calculate_paging"  : (await import("./providers/array-providers/calculate-paging-rule.js")).default,
        "change_values"     : (await import("./providers/array-providers/change-values-rule.js")).default,
        "concat"            : (await import("./providers/array-providers/concat-rule.js")).default,
        "field_to_csv"      : (await import("./providers/array-providers/field-to-csv-rule.js")).default,
        "get_range"         : (await import("./providers/array-providers/get-range-rule.js")).default,
        "get_records"       : (await import("./providers/array-providers/get-records-rule.js")).default,
        "get_value"         : (await import("./providers/array-providers/get-value-rule.js")).default,
        "map_objects"       : (await import("./providers/array-providers/map-object-rule.js")).default,
    }

    globalThis.crs.validate.binding = {
        "create_context"    : (await import("./providers/binding-provider/create-context-rule.js")).default,
        "free_context"      : (await import("./providers/binding-provider/free-context-rule.js")).default,
        "get_property"      : (await import("./providers/binding-provider/get-property-rule.js")).default,
        "set_property"      : (await import("./providers/binding-provider/set-property-rule.js")).default,
        "get_data"          : (await import("./providers/binding-provider/get-data-rule.js")).default,
        "set_errors"        : (await import("./providers/binding-provider/set-errors-rule.js")).default,
    }
}