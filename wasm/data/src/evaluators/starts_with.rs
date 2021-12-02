use serde_json::Value;
use traits::Eval;

pub struct StartsWith {}

impl Eval for StartsWith {
    fn evaluate(obj1: &Value, obj2: &Value) -> bool {
        if obj1.is_string() {
            let s1 = obj1.as_str().unwrap();
            let s2 = obj2.as_str().unwrap();
            let result = s1.find(s2);

            return match result {
                Some(index) => {
                    if index == 0 {
                        return true;
                    }
                    return false;
                },
                None => false
            }
        }

        return false;
    }
}

#[cfg(test)]
mod test {
    use serde_json::{json, Value};
    use traits::Eval;
    use crate::evaluators::StartsWith;

    #[test]
    fn starts_with_test() {
        let values = Value::from("Hello World");
        assert_eq!(StartsWith::evaluate(&values, &Value::from("Hello")), true);
        assert_eq!(StartsWith::evaluate(&values, &Value::from("World")), false);
        assert_eq!(StartsWith::evaluate(&values, &Value::from("Not")), false);
    }
}
