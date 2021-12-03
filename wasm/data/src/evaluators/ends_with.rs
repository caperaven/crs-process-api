use serde_json::Value;
use crate::traits::Eval;

pub struct EndsWith {}

impl Eval for EndsWith {
    fn evaluate(obj1: &Value, obj2: &Value) -> bool {
        let s1 = obj1.as_str().unwrap();
        let s2 = obj2.as_str().unwrap();
        let target_index = s1.len() - s2.len();
        let result = s1.find(s2);

        return match result {
            Some(index) => {
                if index == target_index {
                    return true;
                }
                return false;
            },
            None => false
        }
    }
}

#[cfg(test)]
mod test {
    use serde_json::{Value};
    use crate::traits::Eval;
    use crate::evaluators::EndsWith;

    #[test]
    fn starts_with_test() {
        let values = Value::from("Hello World");
        assert_eq!(EndsWith::evaluate(&values, &Value::from("Hello")), false);
        assert_eq!(EndsWith::evaluate(&values, &Value::from("World")), true);
        assert_eq!(EndsWith::evaluate(&values, &Value::from("Not")), false);
    }
}