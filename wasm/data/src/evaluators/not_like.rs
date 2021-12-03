use serde_json::Value;
use crate::traits::Eval;

pub struct NotLike {}

impl Eval for NotLike {
    fn evaluate(obj1: &Value, obj2: &Value) -> bool {
        if obj1.is_string() {
            let s1 = obj1.as_str().unwrap();
            let s2 = obj2.as_str().unwrap();
            let result = s1.find(s2);

            return match result {
                Some(_value) => false,
                None => true
            }
        }

        false
    }
}

#[cfg(test)]
mod test {
    use serde_json::Value;
    use crate::traits::Eval;
    use crate::evaluators::NotLike;

    #[test]
    fn like_test() {
        assert_eq!(NotLike::evaluate(&Value::from("Hello World"), &Value::from("World")), false);
        assert_eq!(NotLike::evaluate(&Value::from("Hello World"), &Value::from("Test")), true);
    }
}