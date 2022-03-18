import "./crs-process-api-schema.js"

export async function init() {
    globalThis.crs.validate = globalThis.crs.validate || {};

    /**
     * Load the different providers for validate and process.
     */
    globalThis.crs.api_providers = {
        "action"            : (await import("./providers/action-provider.js")).default,
        "array"             : (await import("./providers/array-provider.js")).default,
        "binding"           : (await import("./providers/binding-provider.js")).default,
        "condition"         : (await import("./providers/condition-provider.js")).default,
        "cssgrid"           : (await import("./providers/css-grid-provider.js")).default,
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

    globalThis.crs.validate.bindingMap = {
        "create_context"    : (await import("./providers/binding-provider/create-context-rule.js")).default,
        "free_context"      : (await import("./providers/binding-provider/free-context-rule.js")).default,
        "get_property"      : (await import("./providers/binding-provider/get-property-rule.js")).default,
        "set_property"      : (await import("./providers/binding-provider/set-property-rule.js")).default,
        "get_data"          : (await import("./providers/binding-provider/get-data-rule.js")).default,
        "set_errors"        : (await import("./providers/binding-provider/set-errors-rule.js")).default,
    }

    globalThis.crs.validate.cssGridMap = {
        "init"              : (await import("./providers/css-grid-provider/init-rule.js")).default,
        "set_columns"       : (await import("./providers/css-grid-provider/set-columns-rule.js")).default,
        "set_rows"          : (await import("./providers/css-grid-provider/set-rows-rule.js")).default,
        "add_columns"       : (await import("./providers/css-grid-provider/add-columns-rule.js")).default,
        "remove_columns"    : (await import("./providers/css-grid-provider/remove-columns-rule.js")).default,
        "set_column_width"  : (await import("./providers/css-grid-provider/set-column-width-rule.js")).default,
        "add_rows"          : (await import("./providers/css-grid-provider/add-rows-rule.js")).default,
        "remove_rows"       : (await import("./providers/css-grid-provider/remove-rows-rule.js")).default,
        "set_row_height"    : (await import("./providers/css-grid-provider/set-row-height-rule.js")).default,
        "set_regions"       : (await import("./providers/css-grid-provider/set-regions-rule.js")).default,
        "column_count"      : (await import("./providers/css-grid-provider/column-count-rule.js")).default,
        "row_count"         : (await import("./providers/css-grid-provider/row-count-rule.js")).default
    }
}