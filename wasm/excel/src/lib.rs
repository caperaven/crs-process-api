mod data;
mod formatters;

use wasm_bindgen::prelude::*;

/**
* @function export_to_excel - exports the data to an excel file
* @param data - the data to export
* @param fields - the columns in the data
* @returns Vec<u8> - the excel file binary data
*/
#[wasm_bindgen]
pub fn export_to_excel(data: JsValue, fields: Vec<JsValue>) -> Result<JsValue, JsValue> {
    Ok(JsValue::null())
}

/**
* @function import_from_excel - imports the data from an excel file
* @param data - the excel file binary data
* @param fields - the columns in the data
* @returns Vec<JsValue> - the data to return to javascript
*/
#[wasm_bindgen]
pub fn import_from_excel(data: Vec<JsValue>, fields: Vec<JsValue>) -> Result<JsValue, JsValue> {
    Ok(JsValue::null())
}
