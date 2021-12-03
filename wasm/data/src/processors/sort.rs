use std::cmp::Ordering;
use serde_json::Value;
use traits::Eval;
use crate::duration::iso8601_placement;
use crate::evaluators::{GreaterThan, LessThan};
use crate::enums::Placement;

struct Field {
    name: String,
    data_type: Option<String>
}

impl Field {
    pub fn new(name: String, data_type: Option<&Value>) -> Field {
        // let data_type = match data_type {
        //     None => None,
        //     Some(value) => Some(value.to_string())
        // };
        // https://users.rust-lang.org/t/string-compare-in-some-failing/68181/14

        let data_type = data_type.and_then(Value::as_str).map(str::to_owned);

        Field {
            name,
            data_type
        }
    }
}

use crate::utils::flood_indexes;

fn sort_eval(a: &usize, b: &usize, fields: &Vec<Field>, data: &Vec<Value>) -> Ordering {
    Ordering::Less
}

pub fn sort(intent: &Value, data: &Value, rows: Option<Vec<usize>>) -> Vec<usize> {
    let mut rows = match rows {
        Some(array) => array,
        None => flood_indexes(&data)
    };

    let mut fields: Vec<Field> = Vec::new();
    for field_intent in intent.as_array().unwrap() {
        fields.push(Field::new(field_intent["name"].to_string(), field_intent.get("type")));
    }

    let data = data.as_array().unwrap();

    rows.sort_by(|a, b| sort_eval(a, b, &fields, &data));

    return rows;
}

fn place_objects(intent: &Vec<Field>, evaluate: &Value, reference: &Value) -> Placement {
    for field in intent {
        let value1: &Value = &evaluate[&field.name];
        let value2: &Value = &reference[&field.name];

        return match &field.data_type {
            None => {
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
        }
    }

    return Placement::Before;
}

#[cfg(test)]
mod test {
    use serde_json::{json, Value};
    use crate::processors::sort::{Placement, place_objects, Field, sort};

    fn get_data() -> Value {
        return json!([
            {"id": 0, "code": "A", "value": 10, "isActive": true},
            {"id": 1, "code": "B", "value": 10, "isActive": false},
            {"id": 2, "code": "C", "value": 20, "isActive": true},
            {"id": 3, "code": "D", "value": 20, "isActive": true},
            {"id": 4, "code": "E", "value": 5, "isActive": false}
        ]);
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
        let fields = json!([{"name": "value"}]);

        let result = sort(&fields, &data, None);
    }

    #[test]
    fn test_int_objects() {
        let object1 = json!({"value": 1});
        let object2 = json!({"value": 2});

        let mut fields: Vec<Field> = Vec::new();
        fields.push(Field::new("value".to_string(), None));

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
        fields.push(Field::new("value".to_string(), None));

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
        fields.push(Field::new("value".to_string(), None));

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
        fields.push(Field::new("value".to_string(), None));

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
        fields.push(Field::new("value".to_string(), None));

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
        fields.push(Field::new("value".to_string(), None));

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
        fields.push(Field::new("value".to_string(), None));

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
        fields.push(Field::new("value".to_string(), None));

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
        fields.push(Field::new("value".to_string(), None));

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
        fields.push(Field::new("value".to_string(), Some(&Value::from("duration"))));

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
        fields.push(Field::new("value".to_string(), Some(&Value::from("duration"))));

        let result = place_objects(&fields, &object1, &object2);
        assert_eq!(smaller(result), true);

        let result = place_objects(&fields, &object2, &object1);
        assert_eq!(smaller(result), false);
    }
}