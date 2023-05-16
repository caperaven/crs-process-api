use std::borrow::BorrowMut;
use std::collections::HashMap;
use js_sys::{Array, Object, Reflect};
use wasm_bindgen::JsValue;
use uuid::Uuid;

struct Field {
    pub value: String,
    pub child_count: i32,
    pub children: HashMap<String, Field>,
    pub rows: Option<Array>
}

impl Field {
    pub fn new(value: String) -> Field {
        Field {
            value,
            child_count: 0,
            children: HashMap::new(),
            rows: None
        }
    }

    pub fn create_value_object(&mut self, parent: &Object) -> Result<JsValue, JsValue> {
        let result = Object::new();

        let id = Uuid::new_v4().to_string();
        Reflect::set(&result, &JsValue::from("id"), &JsValue::from(id))?;
        Reflect::set(&result, &JsValue::from("value"), &JsValue::from(&self.value))?;

        if self.rows.is_some() {
            let rows = self.rows.as_ref().unwrap();
            Reflect::set(&result, &JsValue::from("rows"), rows)?;
            Reflect::set(&result, &JsValue::from("child_count"), &JsValue::from(rows.length()))?;
        }

        else if !self.children.is_empty() {
            let children = Object::new();

            for child in self.children.iter_mut() {
                child.1.create_value_object(&children)?;
            }

            Reflect::set(&result, &JsValue::from("child_count"), &JsValue::from(self.child_count))?;
            Reflect::set(&result, &JsValue::from("children"), &children)?;
        }

        Reflect::set(parent, &JsValue::from(&self.value), &result)?;

        Ok(JsValue::NULL)
    }
}

pub fn group_data_partial(data: &Array, fields: &Array, rows: Vec<usize>) -> Result<Object, JsValue> {
    let mut root = Field::new(String::from("root"));

    for row in rows.iter() {
        let row_data = data.at(*row as i32);
        process_row(&mut root, &row_data, fields, 0, row);
    }

    let result = Object::new();
    root.create_value_object(&result)?;

    Ok(result)
}

fn process_row(parent: &mut Field, row: &JsValue, fields: &Array, field_index: u32, row_index: &usize) {
    if field_index >= fields.length() {
        return;
    }

    let is_last_field = field_index == fields.length() - 1;

    // Create the group structure
    let field: JsValue = fields.get(field_index);
    let field_name: String = field.as_string().unwrap();

    let value = crate::utils::get_value(row, &field_name);
    let mut value_copy = String::from("none");

    let process_value: String = match value {
        None => String::from("none"),
        Some(value) => {
            if let Some(number_value) = value.as_f64() {
                let number_value = number_value.to_string();
                value_copy = number_value.clone();
                number_value
            } else if let Some(string_value) = value.as_string() {
                let string_value = string_value.clone();
                value_copy = string_value.clone();
                string_value
            } else if let Some(boolean_value) = value.as_bool() {
                let boolean_value = boolean_value.to_string();
                value_copy = boolean_value.clone();
                boolean_value
            } else {
                String::from("none")
            }
        }
    };

    set_group_count(parent, process_value, is_last_field, row_index);

    if !is_last_field {
        let new_parent = parent.children.get_mut(value_copy.as_str()).unwrap();
        process_row(new_parent, row, fields, field_index + 1, row_index);
    }
}

fn set_group_count(parent: &mut Field, value: String, is_last_field: bool, row_index: &usize) {
    match parent.children.get_mut(value.as_str()) {
        None => {
            let mut children = Field::new(value.clone());

            if is_last_field {
                add_row_index(&mut children, *row_index);
            }

            parent.children.insert(value.clone(), children);
            parent.child_count += 1;

        }
        Some(children) => {
            if is_last_field {
                add_row_index(children, *row_index);
            }
        }
    }
}

fn add_row_index(parent: &mut Field, row_index: usize) {
    match parent.rows.borrow_mut() {
        None => {
            let rows = Array::new();
            rows.push(&JsValue::from(row_index));
            parent.rows = Some(rows);
        }
        Some(collection) => {
            collection.push(&JsValue::from(row_index));
        }
    }
}