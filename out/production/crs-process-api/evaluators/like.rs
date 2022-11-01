use serde_json::Value;
use crate::traits::Eval;

pub struct Like {}

impl Eval for Like {
    fn evaluate(obj1: &Value, obj2: &Value) -> bool {
        if obj1.is_string() {
            let s1 = obj1.as_str().unwrap();
            let s2 = obj2.as_str().unwrap();
            let result = s1.find(s2);

            return match result {
                Some(_value) => true,
                None => false
            }
        }

        false
    }
}

#[cfg(test)]
mod test {
    use serde_json::Value;
    use crate::traits::Eval;
    use crate::evaluators::like::Like;

    #[test]
    fn like_test() {
        assert_eq!(Like::evaluate(&Value::from("Hello World"), &Value::from("World")), true);
        assert_eq!(Like::evaluate(&Value::from("Hello World"), &Value::from("Test")), false);
    }
}