use serde_json::Value;
use crate::traits::Eval;

pub struct OneOf {}

impl Eval for OneOf {
    fn evaluate(obj1: &Value, obj2: &Value) -> bool {
        if obj2.is_array() == false {
            return false;
        }

        for value in obj2.as_array().unwrap() {
            if value == obj1 {
                return true;
            }
        }

        return false
    }
}

#[cfg(test)]
mod test {
    use serde_json::{json, Value};
    use crate::traits::Eval;
    use crate::evaluators::OneOf;

    #[test]
    fn is_null_test() {
        let values = json!(["abc", "def", "ghi"]);
        assert_eq!(OneOf::evaluate(&Value::from("abc"), &values), true);
        assert_eq!(OneOf::evaluate(&Value::from("not"), &values), false);
    }
}
