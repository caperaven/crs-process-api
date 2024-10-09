extern crate core;

mod evaluators;
mod traits;
mod macros;
mod sort;
mod utils;
mod group;
mod aggregate;
mod unique_values;

use js_sys::{Array, Reflect, try_iter};
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn init_panic_hook() {
    console_error_panic_hook::set_once();
}

/**
    Bindings for debugging
**/
#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(js_namespace = console, js_name = log)]
    fn console_log(s: &JsValue);
}

/**
    Utility function to get a value on a object path
    Exposed for testing purposes
**/
#[wasm_bindgen]
pub fn get_value(obj: &JsValue, path: &str) -> JsValue {
    match utils::get_value(obj, path) {
        None => JsValue::NULL,
        Some(value) => value
    }
}

/**
    Check if a object matches the filter intent.
    Based on the filter intent, return true if the object passes evaluation.
    If the object is excluded by the evaluation it returns false.
**/
#[wasm_bindgen]
pub fn in_filter(intent: &JsValue, row: &JsValue, case_sensitive: bool) -> Result<bool, JsValue> {
    evaluators::evaluate_object(intent, row, case_sensitive)
}

/**
    Given an array of objects execute the filter and return an array of indexes of the items that
    passes the filter criteria
**/
#[wasm_bindgen]
pub fn filter(data: &Array, intent: &JsValue, case_sensitive: bool) -> Result<Array, JsValue> {
    let result = Array::new();
    let iterator = data.iter();

    for (index, row) in iterator.enumerate() {
        let pass = in_filter(intent, &row, case_sensitive)?;

        if pass {
            result.push(&JsValue::from(index));
        }
    }

    Ok(result)
}

#[wasm_bindgen]
pub fn fuzzy_filter(data: &Array, intent: &JsValue) -> Result<Array, JsValue> {
    // Extract fields and value from intent
    let fields = Reflect::get(&intent, &JsValue::from("fields"))
        .map_err(|_| JsValue::from("fuzzy_filter - failed to get fields"))?;

    let fields_vec: Vec<JsValue> = try_iter(&fields)?
        .ok_or_else(|| JsValue::from("fuzzy_filter - fields must be an array"))?
        .collect::<Result<Vec<_>, _>>()?;

    let value = Reflect::get(&intent, &JsValue::from("value"))
        .and_then(|v| v.as_string().ok_or_else(|| JsValue::from("fuzzy_filter - value must be a string")))?;
    let value = value.to_lowercase();

    let result = Array::new();
    let iterator = data.iter();

    // Iterate over each row in the data array
    for (index, row) in iterator.enumerate() {
        // Check each field for a fuzzy match
        for field in &fields_vec {
            let field_value = get_property!(&row, field).as_string().unwrap_or_default();
            let field_value = field_value.to_lowercase();

            if field_value.contains(&value) {
                result.push(&JsValue::from(index));
                break;
            }
        }
    }

    Ok(result)
}

/**
    Sort the array of objects based on the sort intent.
    If you only want to sort a subset of the records, pass in an array of indexes for the objects
    that must make up the sort result.
**/
#[wasm_bindgen]
pub fn sort(data: &Array, intent: &Array, rows: Option<Vec<usize>>) -> Result<Vec<usize>, JsValue> {
    if data.length() == 0 {
        let result: Vec<usize> = vec![];
        return Ok(result);
    }

    let result: Result<Vec<usize>, JsValue> = match rows {
        None => sort::sort_all(data, intent),
        Some(rows) => sort::sort_partial(data, intent, rows)
    };

    result
}

/**
    JHR todo: we need to be able to pass in sort data so that the group items can be sorted if a group field matched a sort field.
**/
#[wasm_bindgen]
pub fn group(data: &Array, intent: &Array, rows: Option<Vec<usize>>) -> Result<js_sys::Object, JsValue> {
    if data.length() == 0 {
        return Ok(js_sys::Object::new());
    }

    let result: Result<js_sys::Object, JsValue> = match rows {
        None => group::group_data_all(data, intent),
        Some(rows) => group::group_data_partial(data, intent, rows)
    };

    result
}

/**
    JHR: todo
    We want to pass in sort direction as a parameter that can be
    1. Ascending
    2. Descending
    3. None

    Order the results based on that so that you can see the values in the order you want.

    @Example
    calculate aggregate on asset for the count of work orders on it and pass it back so tha the asset
    with the most work orders is first and the asset the least is last.

    @example
    calculate aggregate on asset for the count of work orders
    pass it back where the assets are sorted alphabetically
**/
#[wasm_bindgen]
pub fn aggregate(data: &Array, intent: Vec<JsValue>, rows: Option<Vec<usize>>) -> Result<JsValue, JsValue> {
    if data.length() == 0 {
        return Ok(JsValue::NULL);
    }

    let result: Result<JsValue, JsValue> = match rows {
        None => aggregate::aggregate_all(data, &intent),
        Some(rows) => aggregate::aggregate_partial(data, &intent, rows)
    };

    result
}

/**
    JHR: todo
    Allow sorting of the unique values.
    1. Ascending
    2. Descending
    3. None

    @example
    Show me the values where the count is the highest to the lowest

    @example
    Show me the values in a ascending order of the value itself
**/
#[wasm_bindgen]
pub fn unique_values(data: &Array, intent: Vec<JsValue>, rows: Option<Vec<usize>>) -> Result<JsValue, JsValue> {
    if data.length() == 0 {
        return Ok(JsValue::NULL);
    }

    let result: Result<JsValue, JsValue> = match rows {
        None => unique_values::unique_values_all(data, &intent),
        Some(rows) => unique_values::unique_values_partial(data, &intent, rows)
    };

    result
}

#[wasm_bindgen]
pub fn get_perspective(data: &Array, intent: JsValue) -> Result<JsValue, JsValue> {
    let filter_def = Reflect::get(&intent, &JsValue::from("filter")).unwrap();
    let fuzzy_filter_def = Reflect::get(&intent, &JsValue::from("fuzzy_filter")).unwrap();
    let sort_def = Reflect::get(&intent, &JsValue::from("sort")).unwrap();
    let group_def = Reflect::get(&intent, &JsValue::from("group")).unwrap();
    let aggregate_def = Reflect::get(&intent, &JsValue::from("aggregate")).unwrap();

    let has_filter = !filter_def.is_undefined() && !filter_def.is_null();
    let has_fuzzy_filter = !fuzzy_filter_def.is_undefined() && !fuzzy_filter_def.is_null();
    let has_sort = !sort_def.is_undefined() && !sort_def.is_null();
    let has_group = !group_def.is_undefined() && !group_def.is_null();
    let has_aggregate = !aggregate_def.is_undefined() && !aggregate_def.is_null();

    let mut rows: Vec<usize> = vec![];

    if has_fuzzy_filter {
        let fuzzy_filter_result = fuzzy_filter(data, &fuzzy_filter_def)?;

        if !has_sort && !has_group && !has_aggregate {
            return Ok(JsValue::from(fuzzy_filter_result));
        }

        rows = fuzzy_filter_result.iter().map(|x| x.as_f64().unwrap() as usize).collect();
    }

    if has_filter {
        let filter_result = filter(data, &filter_def, false)?;

        if !has_sort && !has_group && !has_aggregate {
            return Ok(JsValue::from(filter_result));
        }

        rows = filter_result.iter().map(|x| x.as_f64().unwrap() as usize).collect();
    }

    // if has_fuzzy_filter {
        // this can be a single value that you need to check over all the fields.
        // or this can be an single expression
        // field eq value and field eq value
        // field eq value or field eq value
        // field eq value and (field eq value or field eq value)
    // }

    if has_sort {
        let sort_intent: Array = sort_def.into();
        let sort_result = sort(data, &sort_intent, Some(rows))?;
        rows = sort_result;

        let result: Array = rows.iter().map(|x| JsValue::from(*x)).collect();

        if !has_group && !has_aggregate {
            return Ok(result.into());
        }
    }

    if has_group {
        let group_intent: Array = group_def.into();
        let group_result = group(data, &group_intent, Some(rows))?;
        let result = group_result;

        if !has_aggregate {
            return Ok(result.into());
        }
    }

    Ok(JsValue::NULL)
}
