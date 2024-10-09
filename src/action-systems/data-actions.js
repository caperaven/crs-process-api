import init, {
    filter_data,
    sort_data,
    group_data,
    aggregate_rows,
    calculate_group_aggregate,
    iso8601_to_string,
    iso8601_batch,
    in_filter,
    unique_values,
    init_panic_hook,
    evaluate_obj,
    build_perspective
} from "../wasm/data.js";

/**
 * todo: free up the data objects after transactions are done. IDB
 */


await init();


/**
 * @class DataActions - It provides a set of functions that can be used to manipulate data
 *
 * Features:
 * -filter - It filters data based on a set of criteria
 * -sort - It sorts data based on a set of criteria
 * -group - It groups data based on a set of criteria
 * -aggregate - It aggregates data based on a set of criteria
 * -aggregate_group - It aggregates data based on a set of criteria
 * -iso8601_to_string - It converts an ISO8601 date to a string
 * -iso8601_batch - It converts an array of ISO8601 dates to a string
 * -in_filter - It filters data based on a set of criteria
 * -unique_values - It returns an array of unique values
 * -assert_equal - It asserts that two values are equal
 * -perspective - It builds a perspective
 *
 */
export class DataActions {
    static async perform(step, context, process, item) {
        await this[step.action](step, context, process, item);
    }

    static async debug() {
        init_panic_hook();
    }

    /**
     * @method filter - The function takes a JSON string, a source string, and a boolean value. It returns a JSON string
     *
     * @param step {Object} - The step object from the process.
     * @param context {Object} - The context of the current process.
     * @param process {Object} - The process object
     * @param item {Object} - The item that is being processed.
     *
     * @param step.args.source {String} - The source string that will be filtered.
     * @param [step.args.filter = []] {String} - The filter criteria.
     * @param step.args.case_sensitive {Boolean} - A boolean value that determines if the filter is case-sensitive.
     * @param step.args.target {String} - The target where the result will be stored.
     *
     * @example <caption>javascript</caption>
     * const result = await crs.call("data", "filter", {
     *   source: "source string",
     *   filter: "filter criteria",
     *   case_sensitive: true,
     *   target: "@process.result"
     *   });
     *
     * @example <caption>json</caption>
     * {
     *  "action": "filter",
     *  "args": {
     *    "source": "source string",
     *    "filter": "filter criteria",
     *    "case_sensitive": true,
     *    "target": "@process.result"
     *    }
     * }
     *
     * @returns The result of the filter_data function.
     */
    static async filter(step, context, process, item) {
        await crs.call("data", "debug");

        let source = await crs.process.getValue(step.args.source, context, process, item);

        if (typeof source != "string") {
            source = JSON.stringify(source);
        }

        const intent = await crs.process.getValue(step.args.filter, context, process, item) || [];
        const case_sensitive = await crs.process.getValue(step.args.case_sensitive, context, process, item);

        let result = filter_data(JSON.stringify(intent), source, case_sensitive == true);
        if (step.args.target != null) {
            await crs.process.setValue(step.args.target, result, context, process, item);
        }
        return result;
    }

    /**
     * @method sort Sort the data in the source string using the intent and rows
     * @param step {Object} - The step object from the process definition.
     * @param context {Object} - The context of the current process.
     * @param process {Object} - The process object
     * @param item {Object} - The item that is being processed.
     *
     * @param step.args.source {String} - The source string that will be filtered.
     * @param [step.args.sort = []] {String} - The sort criteria.
     * @param [step.args.rows = []] {String} - The rows that will be sorted.
     * @param step.args.target {String} - The target where the result will be stored.
     *
     * @example <caption>javascript</caption>
     * const result = await crs.call("data", "sort", {
     *  source: "source string",
     *  sort: "sort criteria",
     *  rows: "rows that will be sorted",
     *  target: "@process.result"
     *  });
     *
     * @example <caption>json</caption>
     * {
     *  "action": "sort",
     *  "args": {
     *    "source": "source string",
     *    "sort": "sort criteria",
     *    "rows": "rows that will be sorted",
     *    "target": "@process.result"
     *    }
     * }
     *
     * @returns The result of the sort_data function.
     */
    static async sort(step, context, process, item) {
        let source = await crs.process.getValue(step.args.source, context, process, item);

        if (typeof source != "string") {
            source = JSON.stringify(source);
        }

        const intent = await crs.process.getValue(step.args.sort, context, process, item) || [];
        const rows = await crs.process.getValue(step.args.rows, context, process, item) || [];

        let result = sort_data(JSON.stringify(intent), source, rows);
        if (step.args.target != null) {
            await crs.process.setValue(step.args.target, result, context, process, item);
        }
        return result;
    }

    /**
     * @method group The function takes a JSON string, and a string of JSON data, and returns a JSON string of the data grouped by the
     * JSON string
     * @param step {Object} - The step object from the process.
     * @param context {Object} - The context of the current process.
     * @param process {Object} - The process object
     * @param item {Object} - The item that is being processed.
     *
     * @param step.args.source {String} - The source string that will be filtered.
     * @param [step.args.fields = []] {String} - The fields that will be grouped.
     * @param step.args.target {String} - The target where the result will be stored.
     *
     * @example <caption>javascript</caption>
     * const result = await crs.call("data", "group", {
     *  source: "source string",
     *  fields: "fields that will be grouped",
     *  target: "@process.result"
     * });
     *
     * @example <caption>json</caption>
     * {
     *  "action": "group",
     *  "args": {
     *    "source": "source string",
     *    "fields": "fields that will be grouped",
     *    "target": "@process.result"
     *   }
     * }
     *
     * @returns The result of the group_data function.
     */
    static async group(step, context, process, item) {
        let source = await crs.process.getValue(step.args.source, context, process, item);
        const intent = await crs.process.getValue(step.args.fields, context, process, item) || [];

        if (typeof source != "string") {
            source = JSON.stringify(source);
        }

        let result = group_data(JSON.stringify(intent), source);
        result = JSON.parse(result);

        if (step.args.target != null) {
            await crs.process.setValue(step.args.target, result, context, process, item);
        }
        return result;
    }

    /**
     * @method aggregate - It takes a JSON string, a JavaScript string, and an array of rows, and returns a JSON string
     * @param step {Object} - the step object
     * @param context {Object} - The context object that is passed to the process.
     * @param process {Object} - the process object
     * @param item {Object} - the item being processed
     *
     * @param step.args.source {String} - The source string that will be filtered.
     * @param step.args.aggregate {String} - The aggregate intent.
     * @param [step.args.rows = []] {String} - The rows that will be aggregated.
     * @param step.args.target {String} - The target where the result will be stored.
     *
     * @example <caption>javascript</caption>
     * const result = await crs.call("data", "aggregate", {
     *  source: "source string",
     *  aggregate: "aggregate intent",
     *  rows: "rows that will be aggregated",
     *  target: "@process.result"
     * });
     *
     * @example <caption>json</caption>
     * {
     *  "action": "aggregate",
     *  "args": {
     *    "source": "source string",
     *    "aggregate": "aggregate intent",
     *    "rows": "rows that will be aggregated",
     *    "target": "@process.result"
     *   }
     * }
     *
     * @returns The result of the aggregation.
     */
    static async aggregate(step, context, process, item) {
        let source = await crs.process.getValue(step.args.source, context, process, item);

        if (typeof source != "string") {
            source = JSON.stringify(source);
        }

        const intent = await crs.process.getValue(step.args.aggregate, context, process, item);
        const rows = await crs.process.getValue(step.args.rows, context, process, item) || [];

        let result = aggregate_rows(JSON.stringify(intent), source, rows);
        result = JSON.parse(result);

        if (step.args.target != null) {
            await crs.process.setValue(step.args.target, result, context, process, item);
        }
        return result;
    }

    /**
     * @method aggregate_group - It takes a JSON string, a group and an intent, and returns a JSON string
     * @param step {Object} - the step object
     * @param context {Object} - The context object that is passed to the process.
     * @param process {Object} - the process object
     * @param item {Object} - The item that is being processed.
     *
     * @param step.args.source {String} - The source string that will be filtered.
     * @param step.args.group {String} - The group that will be aggregated.
     * @param step.args.aggregate {String} - The aggregate intent.
     * @param step.args.target {String} - The target where the result will be stored.
     *
     * @example <caption>javascript</caption>
     * const result = await crs.call("data", "aggregate_group", {
     *   source: "source string",
     *   group: "group that will be aggregated",
     *   aggregate: "aggregate intent",
     *   target: "@process.result"
     * });
     *
     * @example <caption>json</caption>
     * {
     *  "action": "aggregate_group",
     *  "args": {
     *    "source": "source string",
     *    "group": "group that will be aggregated",
     *    "aggregate": "aggregate intent",
     *    "target": "@process.result"
     *    }
     * }
     *
     * @returns The result of the aggregation.
     */
    static async aggregate_group(step, context, process, item) {
        let source = await crs.process.getValue(step.args.source, context, process, item);

        if (typeof source != "string") {
            source = JSON.stringify(source);
        }

        const group = await crs.process.getValue(step.args.group, context, process, item);
        let intent = await crs.process.getValue(step.args.aggregate, context, process, item);

        let result = calculate_group_aggregate(JSON.stringify(group), JSON.stringify(intent), source);
        result = JSON.parse(result);

        if (step.args.target != null) {
            await crs.process.setValue(step.args.target, result, context, process, item);
        }
        return result;
    }

    /**
     * @method iso8601_to_string - It converts an ISO 8601 date string to a human-readable date string
     * @param step {Object} - The step object from the process definition.
     * @param context {Object} - The context object that is passed to the process.
     * @param process {Object} - The process object
     * @param item {Object} - The item that is being processed.
     *
     * @param step.args.value {String} - The ISO 8601 date string.
     * @param [step.args.target] {String} - The target where the result will be stored.
     *
     * @example <caption>javascript</caption>
     * const result = await crs.call("data", "iso8601_to_string", {
     *   value: "2020-01-01T00:00:00.000Z",
     *   target: "@process.result"
     * });
     *
     * @example <caption>json</caption>
     * {
     *  "action": "iso8601_to_string",
     *  "args": {
     *    "value": "2020-01-01T00:00:00.000Z",
     *    "target": "@process.result"
     *   }
     * }
     *
     * @returns The result of the iso8601_to_string function.
     */
    static async iso8601_to_string(step, context, process, item) {
        const value = await crs.process.getValue(step.args.value, context, process, item);
        const result = iso8601_to_string(value);

        if (step.args.target != null) {
            await crs.process.setValue(step.args.target, result, context, process, item);
        }

        return result;
    }

    /**
     * @method iso8601_batch - It takes a JSON object, and a field name, and returns a new JSON object with the field value converted to a date
     * @param step {Object} - The step object from the process.
     * @param context {Object} - The context object that is passed to the process.
     * @param process {Object} - The process object
     * @param item {Object} - the item being processed
     *
     * @param step.args.value {String} - The JSON object that will be converted.
     * @param step.args.field {String} - The field name that will be converted.
     * @param [step.args.target] {String} - The target where the result will be stored.
     *
     * @example <caption>javascript</caption>
     * const result = await crs.call("data", "iso8601_batch", {
     *    value: {
     *     "date": "2020-01-01T00:00:00.000Z"
     *    },
     *    field: "date",
     *    target: "@process.result"
     *  });
     *
     * @example <caption>json</caption>
     * {
     *  "action": "iso8601_batch",
     *  "args": {
     *    "value": {
     *     "date": "2020-01-01T00:00:00.000Z"
     *     },
     *    "field": "date",
     *    "target": "@process.result"
     *    }
     * }
     *
     * @returns The result of the iso8601_batch function.
     */
    static async iso8601_batch(step, context, process, item) {
        const value = await crs.process.getValue(step.args.value, context, process, item);
        const field = await crs.process.getValue(step.args.field, context, process, item);


        let result = iso8601_batch(JSON.stringify(value), field);
        result = JSON.parse(result);

        if (step.args.target != null) {
            await crs.process.setValue(step.args.target, result, context, process, item);
        }

        return result;
    }

    /**
     * @method in_filter - The `in_filter` function takes a source string, a filter string, and a case_sensitive flag, and returns true if
     * the filter string is found in the source string
     * @param step {Object} - The step object
     * @param context {Object} - The context object that is passed to the process.
     * @param process {Object} - The process object
     * @param item {Object} - The item that is being processed.
     *
     * @param step.args.source {String} - The source string.
     * @param step.args.filter {String} - The filter string.
     * @param [step.args.case_sensitive] {Boolean} - The case-sensitive flag.
     * @param [step.args.target] {String} - The target where the result will be stored.
     *
     * @example <caption>javascript</caption>
     * const result = await crs.call("data", "in_filter", {
     *  source: "This is a test",
     *  filter: "test",
     *  case_sensitive: false,
     *  target: "@process.result"
     *  });
     *
     * @example <caption>json</caption>
     * {
     *  "action": "in_filter",
     *  "args": {
     *    "source": "This is a test",
     *    "filter": "test",
     *    "case_sensitive": false,
     *    "target": "@process.result"
     *   }
     * }
     *
     * @returns The result of the in_filter function.
     */
    static async in_filter(step, context, process, item) {
        let source = await crs.process.getValue(step.args.source, context, process, item);

        if (typeof source != "string") {
            source = JSON.stringify(source);
        }

        const intent = await crs.process.getValue(step.args.filter, context, process, item) || [];
        const case_sensitive = await crs.process.getValue(step.args.case_sensitive, context, process, item);

        const result = in_filter(JSON.stringify(intent), source, case_sensitive == true);
        if (step.args.target != null) {
            await crs.process.setValue(step.args.target, result, context, process, item);
        }
        return result;
    }

    /**
     * @method unique_values - This function takes a JSON string of fields, a JSON string of data, and a JSON string of rows, and returns a JSON
     * string of unique values for each field
     * @param step {Object} - The step object from the process definition.
     * @param context {Object} - The context of the process.
     * @param process {Object} - The process object
     * @param item {Object} - The item that is being processed.
     *
     * @param step.args.fields {String} - The JSON string of fields.
     * @param step.args.source {[Object]} - The JSON string of data.
     * @param [step.args.rows = []] {String} - The JSON string of rows.
     * @param [step.args.target] {String} - The target where the result will be stored.
     *
     * @example <caption>javascript</caption>
     * const result = await crs.call("data", "unique_values", {
     *  fields: ["field1", "field2"],
     *  source: [
     *   {
     *    "field1": "value1",
     *    "field2": "value2"
     *   },
     *   {
     *    "field1": "value1",
     *    "field2": "value3"
     *   }],
     *  target: "@process.result"
     * });
     *
     * @example <caption>json</caption>
     * {
     *   "action": "unique_values",
     *   "args": {
     *   "fields": ["field1", "field2"],
     *   "source": [
     *    {
     *     "field1": "value1",
     *     "field2": "value2"
     *    }],
     *   "target": "@process.result"
     *   }
     * }
     *
     *
     * @returns The unique values of the fields in the source data.
     */
    static async unique_values(step, context, process, item) {
        let source = await crs.process.getValue(step.args.source, context, process, item);
        const rows = await crs.process.getValue(step.args.rows, context, process, item) || [];

        if (typeof source != "string") {
            source = JSON.stringify(source);
        }

        const intent = await crs.process.getValue(step.args.fields, context, process, item);

        let result = unique_values(JSON.stringify(intent), source, rows);
        result = JSON.parse(result);

        if (step.args.target != null) {
            await crs.process.setValue(step.args.target, result, context, process, item);
        }

        return result;
    }

    /**
     * @method assert_equal - The function takes a string, and compares it to a regular expression, and returns true if the string matches the
     * regular expression
     * @param step {Object} - The step object
     * @param context {Object} - The context object that is passed to the process.
     * @param process {Object} - The process object
     * @param item {Object} - The item that is being processed.
     *
     * @param step.args.source {String} - The source string.
     * @param step.args.expr {String} - The regular expression.
     * @param [step.args.case_sensitive] {Boolean} - The case-sensitive flag.
     * @param [step.args.target] {String} - The target where the result will be stored.
     *
     * @example <caption>javascript</caption>
     * const result = await crs.call("data", "assert_equal", {
     *   source: "This is a test",
     *   expr: "This is a test",
     *   case_sensitive: false,
     *   target: "@process.result"
     * });
     *
     * @example <caption>json</caption>
     * {
     *  "action": "assert_equal",
     *  "args": {
     *    "source": "This is a test",
     *    "expr": "This is a test",
     *    "case_sensitive": false,
     *    "target": "@process.result"
     *   }
     * }
     *
     * @returns The result of the evaluation.
     */
    static async assert_equal(step, context, process, item) {
        let source = await crs.process.getValue(step.args.source, context, process, item);

        if (typeof source != "string") {
            source = JSON.stringify(source);
        }

        const intent = await crs.process.getValue(step.args.expr, context, process, item);
        const case_sensitive = await crs.process.getValue(step.args.case_sensitive, context, process, item);

        let result = evaluate_obj(JSON.stringify(intent), source, case_sensitive == true);

        if (step.args.target != null) {
            await crs.process.setValue(step.args.target, result, context, process, item);
        }

        return result;
    }

    /**
     * @method perspective - It takes a JSON string, a source string, and an array of rows, and returns a new JSON string
     * @param step {Object} - The step object from the process definition.
     * @param context {Object} - The context of the process.
     * @param process {Object} - The process object
     * @param item {Object} - The item that is being processed.
     *
     * @param step.args.perspective {String} - The JSON string of the perspective.
     * @param step.args.source {String} - The source string.
     * @param [step.args.rows = []] {String} - The JSON string of rows.
     * @param [step.args.target] {String} - The target where the result will be stored.
     *
     * @example <caption>javascript</caption>
     * const result = await crs.call("data", "perspective", {
     *  perspective: {
     *    "row_pivots": ["field1"],
     *    "columns": ["field2"],
     *   "aggregates": {
     *     "field2": "distinct count"
     *   }
     *  },
     *  source: [
     *   {
     *    "field1": "value1",
     *    "field2": "value2"
     *   }],
     *  target: "@process.result"
     * });
     *
     * @example <caption>json</caption>
     * {
     *  "action": "perspective",
     *  "args": {
     *    "perspective": {
     *      "row_pivots": ["field1"],
     *      "columns": ["field2"],
     *    "aggregates": {
     *      "field2": "distinct count"
     *     }
     *    },
     *    "source": [
     *    {
     *      "field1": "value1",
     *      "field2": "value2"
     *    }],
     *   "target": "@process.result"
     *  }
     * }
     *
     * @returns The result of the perspective function.
     */
    static async perspective(step, context, process, item) {
        const rows = await crs.process.getValue(step.args.rows, context, process, item) || [];
        let source = await crs.process.getValue(step.args.source, context, process, item);

        if (typeof source != "string") {
            source = JSON.stringify(source);
        }

        const perspective = await crs.process.getValue(step.args.perspective, context, process, item);

        let result = build_perspective(JSON.stringify(perspective), source, rows);

        if (step.args.target != null) {
            await crs.process.setValue(step.args.target, result, context, process, item);
        }

        return result;
    }
}

crs.intent.data = DataActions;