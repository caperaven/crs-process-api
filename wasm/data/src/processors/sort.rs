use serde_json::Value;
use traits::Eval;
use crate::duration::iso8601_placement;
use crate::evaluators::LessThan;
use crate::enums::Placement;

struct Field {
    name: String,
    data_type: String
}

impl Field {
    pub fn new(name: String, data_type: String) -> Field {
        Field {name, data_type}
    }
}

// use crate::utils::flood_indexes;

// pub fn sort(intent: &Value, data: &Value, rows: Option<Vec<usize>>) -> Vec<usize> {
//     let rows = match rows {
//         Some(array) => array,
//         None => flood_indexes(&data)
//     };
//
//
//
//     let result: Vec<usize> = Vec::new();
//     return result;
// }

fn place_objects(intent: &Vec<Field>, evaluate: &Value, reference: &Value) -> Placement {
    for field in intent {
        let value1: &Value = &evaluate[&field.name];
        let value2: &Value = &reference[&field.name];

        if field.data_type == "duration" {
            return iso8601_placement(&value1, &value2);
        }

        return match LessThan::evaluate(&value1, &value2) {
            true => Placement::Before,
            false => Placement::After
        }
    }

    return Placement::Before;
}

#[cfg(test)]
mod test {
    use serde_json::{json};
    use crate::processors::sort::{Placement, place_objects, Field};

    // fn get_data() -> Value {
    //     return json!([
    //         {"id": 0, "code": "A", "value": 10, "isActive": true},
    //         {"id": 1, "code": "B", "value": 10, "isActive": false},
    //         {"id": 2, "code": "C", "value": 20, "isActive": true},
    //         {"id": 3, "code": "D", "value": 20, "isActive": true},
    //         {"id": 4, "code": "E", "value": 5, "isActive": false}
    //     ]);
    // }

    fn smaller(p: Placement) -> bool {
        return match p {
            Placement::Before => true,
            _ => false
        }
    }

    // #[test]
    // fn test_simple_sort() {
    //     let data = get_data();
    //
    //     let fields = json!(["value"]).as_array().unwrap();
    // }

    #[test]
    fn test_int_objects() {
        let object1 = json!({"value": 1});
        let object2 = json!({"value": 2});

        let mut fields: Vec<Field> = Vec::new();
        fields.push(Field::new("value".to_string(), "".to_string()));

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
        fields.push(Field::new("value".to_string(), "".to_string()));

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
        fields.push(Field::new("value".to_string(), "".to_string()));

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
        fields.push(Field::new("value".to_string(), "".to_string()));

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
        fields.push(Field::new("value".to_string(), "".to_string()));

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
        fields.push(Field::new("value".to_string(), "".to_string()));

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
        fields.push(Field::new("value".to_string(), "".to_string()));

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
        fields.push(Field::new("value".to_string(), "".to_string()));

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
        fields.push(Field::new("value".to_string(), "".to_string()));

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
        fields.push(Field::new("value".to_string(), "duration".to_string()));

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
        fields.push(Field::new("value".to_string(), "duration".to_string()));

        let result = place_objects(&fields, &object1, &object2);
        assert_eq!(smaller(result), true);

        let result = place_objects(&fields, &object2, &object1);
        assert_eq!(smaller(result), false);
    }
}