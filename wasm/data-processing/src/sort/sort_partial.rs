use std::cmp::Ordering;
use js_sys::{Array};
use wasm_bindgen::JsValue;
use crate::{as_string};
use crate::utils::get_value;

struct SortIntent {
    field: String,
    direction: String
}

impl SortIntent {
    pub fn from(def: String) -> SortIntent {
        let mut parts = def.split(':');
        let field = parts.next().unwrap();
        let direction = parts.next().unwrap_or("asc");

        SortIntent {
            field: field.to_string(),
            direction: direction.to_string()
        }
    }
}

pub fn sort_partial(data: &Array, intent: &Array, mut rows: Vec<usize>) -> Result<Vec<usize>, JsValue> {
    rows.sort_by(|a, b| evaluate(*a as i32, *b as i32, data, intent));
    Ok(rows)
}

fn evaluate(a: i32, b: i32, data: &Array, intent: &Array) -> Ordering {
    let obj_a = data.at(a);
    let obj_b = data.at(b);

    let sort_intent_collection = intent_to_sort_intent(intent);

    for sort_intent in sort_intent_collection {
        let value_a = get_value(&obj_a, &sort_intent.field).unwrap_or_else(|| JsValue::from(""));
        let value_b = get_value(&obj_b, &sort_intent.field).unwrap_or_else(|| JsValue::from(""));

        if crate::evaluators::equals::evaluate(&value_a, &value_b).unwrap() {
            continue;
        }

        let is_less = crate::evaluators::less_than::evaluate(&value_a, &value_b).unwrap();

        return if is_less {
            if sort_intent.direction == "asc" {
                Ordering::Less
            } else {
                Ordering::Greater
            }
        } else if sort_intent.direction == "asc" {
            Ordering::Greater
        } else {
            Ordering::Less
        }
    }

    Ordering::Greater
}

fn intent_to_sort_intent(intent: &Array) -> Vec<SortIntent> {
    let mut result: Vec<SortIntent> = Vec::new();

    for i in intent.iter() {
        let str = as_string!(i);
        let sort_intent = SortIntent::from(str);
        result.push(sort_intent);
    }

    result
}