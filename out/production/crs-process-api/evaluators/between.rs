use serde_json::Value;
use crate::traits::Eval;


pub struct Between {}

impl Eval for Between {
    fn evaluate(obj1: &Value, obj2: &Value) -> bool {
        if obj2.is_array() == false {
            return false;
        }

        let values = obj2.as_array().unwrap();

        if obj1.is_i64() {
            let value = obj1.as_i64().unwrap();
            let value1 = values[0].as_i64().unwrap();
            let value2 = values[1].as_i64().unwrap();

            return value1 <= value && value <= value2;
        }

        if obj1.is_f64() {
            let value = obj1.as_f64().unwrap();
            let value1 = values[0].as_f64().unwrap();
            let value2 = values[1].as_f64().unwrap();

            return value1 <= value && value <= value2;
        }

        if obj1.is_string() {
            let value = obj1.as_str().unwrap();
            let value1 = values[0].as_str().unwrap();
            let value2 = values[1].as_str().unwrap();

            return value1 <= value && value <= value2;
        }

        return false;
    }
}

#[cfg(test)]
mod test {
    use serde_json::{json, Value};
    use crate::traits::Eval;
    use crate::evaluators::Between;

    #[test]
    fn is_null_int_test() {
        let values = json!([10, 20]);
        assert_eq!(Between::evaluate(&Value::from(10), &values), true);
        assert_eq!(Between::evaluate(&Value::from(20), &values), true);
        assert_eq!(Between::evaluate(&Value::from(15), &values), true);
        assert_eq!(Between::evaluate(&Value::from(5), &values), false);
        assert_eq!(Between::evaluate(&Value::from(30), &values), false);
    }

    #[test]
    fn is_null_float_test() {
        let values = json!([10., 20.]);
        assert_eq!(Between::evaluate(&Value::from(10.), &values), true);
        assert_eq!(Between::evaluate(&Value::from(20.), &values), true);
        assert_eq!(Between::evaluate(&Value::from(15.), &values), true);
        assert_eq!(Between::evaluate(&Value::from(5.), &values), false);
        assert_eq!(Between::evaluate(&Value::from(30.), &values), false);
    }

    #[test]
    fn is_null_string_test() {
        let values = json!(["d", "f"]);
        assert_eq!(Between::evaluate(&Value::from("d"), &values), true);
        assert_eq!(Between::evaluate(&Value::from("f"), &values), true);
        assert_eq!(Between::evaluate(&Value::from("e"), &values), true);
        assert_eq!(Between::evaluate(&Value::from("a"), &values), false);
        assert_eq!(Between::evaluate(&Value::from("g"), &values), false);
    }
}
