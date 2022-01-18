use std::cmp::Ordering;
use serde_json::Value;
use crate::traits::Eval;
use crate::duration::iso8601_placement;
use crate::evaluators::{Equal, LessThan};
use crate::enums::{Placement, SortDirection};
use crate::enums::Placement::Before;
use crate::enums::SortDirection::Descending;

pub const ASCENDING: &str = "asc";
pub const DESCENDING: &str = "dec";

#[derive(Debug)]
pub struct Field {
    pub name: String,
    pub data_type: Option<String>,
    pub direction: SortDirection
}

impl Field {
    pub fn new(name: String, data_type: Option<&Value>, direction: Option<&Value>) -> Field {
        // https://users.rust-lang.org/t/string-compare-in-some-failing/68181/14

        let data_type = data_type.and_then(Value::as_str).map(str::to_owned);

        let sort_direction = match direction {
            None => SortDirection::Ascending,
            Some(value) => {
                let value_str = value.as_str().unwrap();

                if value_str == ASCENDING {
                    SortDirection::Ascending
                }
                else {
                    SortDirection::Descending
                }
            }
        };

        Field {
            name,
            data_type,
            direction: sort_direction
        }
    }
}

use crate::utils::flood_indexes;

fn sort_eval(a: &usize, b: &usize, fields: &[Field], data: &[Value]) -> Ordering {
    let obj_a = &data[*a];
    let obj_b = &data[*b];

    let result: Placement = place_objects(fields, obj_b, obj_a);

    match result {
        Placement::Before => Ordering::Greater,
        Placement::After => Ordering::Less
    }
}

pub fn sort(intent: &[Value], data: &[Value], rows: Option<Vec<usize>>) -> Vec<usize> {
    let mut rows = match rows {
        Some(array) => array,
        None => flood_indexes(&data)
    };

    let mut fields = sort_intent_to_vec(intent);

    rows.sort_by(|a, b| sort_eval(a, b, &fields, &data));

    return rows;
}

pub fn sort_intent_to_vec(intent: &[Value]) -> Vec<Field> {
    let mut fields: Vec<Field> = Vec::new();
    for field_intent in intent {
        fields.push(Field::new(field_intent["name"].as_str().unwrap().to_string(), field_intent.get("type"), field_intent.get("direction")));
    }
    fields
}

/// Is the evaluator before or after the reference
pub fn place_objects(intent: &[Field], evaluate: &Value, reference: &Value) -> Placement {
    for field in intent {
        let value1: &Value = &evaluate[&field.name];
        let value2: &Value = &reference[&field.name];

        if Equal::evaluate(value1, value2) {
            continue;
        }

        let placement = match &field.data_type {
            None => {
                // value1 < value2
                match LessThan::evaluate(&value1, &value2) {
                    true => Placement::Before,
                    false => Placement::After
                }
            }
            Some(data_type) => {
                if data_type == "duration" {
                    return iso8601_placement(&value1, &value2);
                }

                return Placement::Before;
            }
        };

        if field.direction == Descending {
            if placement == Before {
                return Placement::After;
            }
            return Placement::Before;
        }

        return placement;
    }

    return Placement::Before;
}

#[cfg(test)]
mod test {
    use serde_json::{json, Value};
    use crate::processors::sort::{Placement, place_objects, Field, sort};
    use crate::processors::{ASCENDING, DESCENDING};

    fn get_data() -> Vec<Value> {
        let mut data: Vec<Value> = Vec::new();
        data.push(json!({"id": 0, "code": "A", "value": 10, "isActive": true}));
        data.push(json!({"id": 1, "code": "B", "value": 10, "isActive": false}));
        data.push(json!({"id": 2, "code": "C", "value": 20, "isActive": true}));
        data.push(json!({"id": 3, "code": "D", "value": 20, "isActive": true}));
        data.push(json!({"id": 4, "code": "E", "value": 5, "isActive": false}));
        return data;
    }

    fn smaller(p: Placement) -> bool {
        return match p {
            Placement::Before => true,
            _ => false
        }
    }

    #[test]
    fn test_simple_sort() {
        let data = get_data();
        let mut fields: Vec<Value> = Vec::new();
        fields.push(json!({"name": "value"}));

        let result = sort(&fields, &data, None);
        assert_eq!(result.len(), 5);
        assert_eq!(result[0], 4);
        assert_eq!(result[1], 0);
        assert_eq!(result[2], 1);
        assert_eq!(result[3], 2);
        assert_eq!(result[4], 3);

        let mut fields: Vec<Value> = Vec::new();
        fields.push(json!({"name": "code", "direction": ASCENDING}));
        let result = sort(&fields, &data, None);
        assert_eq!(result.len(), 5);
        assert_eq!(result[0], 0);
        assert_eq!(result[1], 1);
        assert_eq!(result[2], 2);
        assert_eq!(result[3], 3);
        assert_eq!(result[4], 4);

        let mut fields: Vec<Value> = Vec::new();
        fields.push(json!({"name": "isActive"}));
        let result = sort(&fields, &data, None);
        assert_eq!(result.len(), 5);
        assert_eq!(result[0], 1);
        assert_eq!(result[1], 4);
        assert_eq!(result[2], 0);
        assert_eq!(result[3], 2);
        assert_eq!(result[4], 3);

        let mut fields: Vec<Value> = Vec::new();
        fields.push(json!({"name": "code", "direction": DESCENDING}));
        let result = sort(&fields, &data, None);
        assert_eq!(result.len(), 5);
        assert_eq!(result[0], 4);
        assert_eq!(result[1], 3);
        assert_eq!(result[2], 2);
        assert_eq!(result[3], 1);
        assert_eq!(result[4], 0);

    }

    #[test]
    fn test_multi_sort() {
        let data = get_data();
        let mut fields: Vec<Value> = Vec::new();
        fields.push(json!({"name": "value"}));
        fields.push(json!({"name": "isActive"}));
        fields.push(json!({"name": "code"}));
        let result = sort(&fields, &data, None);

        assert_eq!(result.len(), 5);
        assert_eq!(result[0], 4);
        assert_eq!(result[1], 1);
        assert_eq!(result[2], 0);
        assert_eq!(result[3], 2);
        assert_eq!(result[4], 3);
    }

    #[test]
    fn test_multi_directional_sort() {
        let data = get_data();
        let mut fields: Vec<Value> = Vec::new();
        fields.push(json!({"name": "value"}));
        fields.push(json!({"name": "isActive", "direction": DESCENDING}));
        fields.push(json!({"name": "code", "direction": DESCENDING}));

        let result = sort(&fields, &data, None);
        assert_eq!(result.len(), 5);
        assert_eq!(result[0], 4);
        assert_eq!(result[1], 0);
        assert_eq!(result[2], 1);
        assert_eq!(result[3], 3);
        assert_eq!(result[4], 2);
    }

    #[test]
    fn test_duration_collection() {
        let data = [
            json!({"value": "P1Y"}),
            json!({"value": "P1M"}),
            json!({"value": "P1D"}),
            json!({"value": "PT1H"}),
            json!({"value": "PT1M"}),
            json!({"value": "PT1S"}),
            json!({"value": "PT0S"}),
        ];

        let fields = [json!({"name": "value", "type": "duration"})];

        let result = sort(&fields, &data, None);
        assert_eq!(result.len(), 7);
        assert_eq!(result[0], 6);
        assert_eq!(result[1], 5);
        assert_eq!(result[2], 4);
        assert_eq!(result[3], 3);
        assert_eq!(result[4], 2);
        assert_eq!(result[5], 1);
        assert_eq!(result[6], 0);

        let data = [
            json!({"value": "P13DT21H21M45S"}),
            json!({"value": "P0DT21H22M45.97096S"}),
            json!({"value": "P13DT21H23M45S"}),
            Value::Null
        ];

        let result = sort(&fields, &data, None);

        assert_eq!(result.len(), 4);
        assert_eq!(result[0], 3);
        assert_eq!(result[1], 1);
        assert_eq!(result[2], 0);
        assert_eq!(result[3], 2);
    }

    #[test]
    fn test_int_objects() {
        let object1 = json!({"value": 1});
        let object2 = json!({"value": 2});

        let mut fields: Vec<Field> = Vec::new();
        fields.push(Field::new("value".to_string(), None, None));

        let result = place_objects(&fields, &object1, &object2);
        assert_eq!(smaller(result), true);

        let result = place_objects(&fields, &object2, &object1);
        assert_eq!(smaller(result), false);
    }

    #[test]
    fn test_float_objects() {
        let object1 = json!({"value": 1.0});
        let object2 = json!({"value": 1.1});

        let mut fields: Vec<Field> = Vec::new();
        fields.push(Field::new("value".to_string(), None, None));

        let result = place_objects(&fields, &object1, &object2);
        assert_eq!(smaller(result), true);

        let result = place_objects(&fields, &object2, &object1);
        assert_eq!(smaller(result), false);
    }

    #[test]
    fn test_alpha_sort_objects() {
        let object1 = json!({"value": "a"});
        let object2 = json!({"value": "b"});

        let mut fields: Vec<Field> = Vec::new();
        fields.push(Field::new("value".to_string(), None, None));

        let result = place_objects(&fields, &object1, &object2);
        assert_eq!(smaller(result), true);

        let result = place_objects(&fields, &object2, &object1);
        assert_eq!(smaller(result), false);
    }

    #[test]
    fn test_alpha2_sort_objects() {
        let object1 = json!({"value": "*00123"});
        let object2 = json!({"value": "*01123"});

        let mut fields: Vec<Field> = Vec::new();
        fields.push(Field::new("value".to_string(), None, None));

        let result = place_objects(&fields, &object1, &object2);
        assert_eq!(smaller(result), true);

        let result = place_objects(&fields, &object2, &object1);
        assert_eq!(smaller(result), false);
    }

    #[test]
    fn test_duration_sort_objects() {
        let object1 = json!({"value": "10:00"});
        let object2 = json!({"value": "12:24"});

        let mut fields: Vec<Field> = Vec::new();
        fields.push(Field::new("value".to_string(), None, None));

        let result = place_objects(&fields, &object1, &object2);
        assert_eq!(smaller(result), true);

        let result = place_objects(&fields, &object2, &object1);
        assert_eq!(smaller(result), false);
    }

    #[test]
    fn test_date_and_time_sort_objects() {
        let object1 = json!({"value": "2005/04/11 16:35:50.243"});
        let object2 = json!({"value": "2005/12/03 00:00:00.000"});

        let mut fields: Vec<Field> = Vec::new();
        fields.push(Field::new("value".to_string(), None, None));

        let result = place_objects(&fields, &object1, &object2);
        assert_eq!(smaller(result), true);

        let result = place_objects(&fields, &object2, &object1);
        assert_eq!(smaller(result), false);
    }

    #[test]
    fn test_date_sort_objects() {
        let object1 = json!({"value": "2022/06/20"});
        let object2 = json!({"value": "2022/07/20"});

        let mut fields: Vec<Field> = Vec::new();
        fields.push(Field::new("value".to_string(), None, None));

        let result = place_objects(&fields, &object1, &object2);
        assert_eq!(smaller(result), true);

        let result = place_objects(&fields, &object2, &object1);
        assert_eq!(smaller(result), false);
    }

    #[test]
    fn test_time_objects() {
        let object1 = json!({"value": "08:00:00"});
        let object2 = json!({"value": "08:00:01"});

        let mut fields: Vec<Field> = Vec::new();
        fields.push(Field::new("value".to_string(), None, None));

        let result = place_objects(&fields, &object1, &object2);
        assert_eq!(smaller(result), true);

        let result = place_objects(&fields, &object2, &object1);
        assert_eq!(smaller(result), false);
    }

    #[test]
    fn test_bool_objects() {
        let object1 = json!({"value": false});
        let object2 = json!({"value": true});

        let mut fields: Vec<Field> = Vec::new();
        fields.push(Field::new("value".to_string(), None, None));

        let result = place_objects(&fields, &object1, &object2);
        assert_eq!(smaller(result), true);

        let result = place_objects(&fields, &object2, &object1);
        assert_eq!(smaller(result), false);
    }

    #[test]
    fn test_duration_objects() {
        let object1 = json!({"value": "PT010H30M"});
        let object2 = json!({"value": "PT100H30M"});

        let mut fields: Vec<Field> = Vec::new();
        fields.push(Field::new("value".to_string(), Some(&Value::from("duration")),None));

        let result = place_objects(&fields, &object1, &object2);
        assert_eq!(smaller(result), true);

        let result = place_objects(&fields, &object2, &object1);
        assert_eq!(smaller(result), false);
    }

    #[test]
    fn test_duration_miliseconds_objects() {
        let object1 = json!({"value": "PT1.2S"});
        let object2 = json!({"value": "PT1.3S"});

        let mut fields: Vec<Field> = Vec::new();
        fields.push(Field::new("value".to_string(), Some(&Value::from("duration")), None));

        let result = place_objects(&fields, &object1, &object2);
        assert_eq!(smaller(result), true);

        let result = place_objects(&fields, &object2, &object1);
        assert_eq!(smaller(result), false);
    }

    #[test]
    fn test_multi_field() {
        // is object 2 before or after object 1
        let object1 = json!({"value": "PT1.2S", "number": 2});
        let object2 = json!({"value": "PT1.2S", "number": 1});

        let fields = [
            Field::new("value".to_string(), Some(&Value::from("duration")), Some(&Value::from(ASCENDING))),
            Field::new("number".to_string(), None, Some(&Value::from(ASCENDING)))
        ];

        let result = place_objects(&fields, &object1, &object2);
        assert_eq!(smaller(result), false);
    }
}