/**
* @file data.rs - this file defines the data struct and it's functions
* The DataType is critical for the formatting process.
*/

use wasm_bindgen::prelude::*;

/**
* @enum DataType - what kind of data is in the column
* Options:
* - String - a string of characters
* - Number - a number
* - Date - a date
* - Boolean - a boolean
*/
pub enum DataType {
    String,
    Number,
    Float,
    Date,
    Duration,
    Boolean
}

/**
* @struct Field - a column in the data
* @param name - the name of the column
* @param data_type - the type of data in the column
*/
pub struct Field {
    name: String,
    data_type: DataType
}

/**
* @struct Data - this defines the data and it's structure as a intermediate format between importing and exporting data
* @param data - the data
* @param fields - the columns in the data
*/
pub struct Data {
    data: Vec<JsValue>,
    fields: Vec<Field>
}

impl Data {
    /**
    * @function from_value_array - creates a Data struct from a JsValue array
    * @param value - the JsValue array
    * @returns Data - the Data struct
    */
    pub fn from_value_array(value: JsValue) -> Data {
        // process the array and create the Data struct from it
        Data {
            data: Vec::new(),
            fields: Vec::new()
        }
    }

    /**
    * @function from_excell_data - creates a Data struct from an ExcellData struct
    * @param value - the ExcellData struct
    * @returns Data - the Data struct
    */
    pub fn from_excel_data(value: Vec<u8>) -> Data {
        // load the excel and read the values from it into the data structure
        Data {
            data: Vec::new(),
            fields: Vec::new()
        }
    }


    /**
    * @function to_value_array - creates a JsValue array from the data
    * @returns JsValue - the JsValue array
    */
    pub fn to_value_array(&self) -> JsValue {
        // create a JsValue array from the data and return it
        JsValue::null()
    }

    /**
    * @function to_excel_data - creates an excel file binary from the data
    * @returns Vec<u8> - the excel file binary data
    */
    pub fn to_excel_data(&self) -> Vec<u8> {
        // create an excel file from the data and return it
        let result: Vec<u8> = Vec::new();
        result
    }
}