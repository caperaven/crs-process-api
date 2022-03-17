import "./crs-process-api-schema.js"

export async function init() {
    globalThis.crs.validate = globalThis.crs.validate || {};

    /**
     * Load the different providers for validate and process.
     */
    globalThis.crs.api_providers = {
        "array"             : (await import("./providers/array-provider")).default,
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
}