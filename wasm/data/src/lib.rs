use serde_json::Value;
use macros::evaluate;
use traits::Eval;

#[evaluate(>)]
struct GreaterThan {}

#[cfg(test)]
mod test {
    use serde_json::Value;
    use crate::GreaterThan;
    use traits::Eval;

    #[test]
    fn evaluate_test() {
        assert_eq!(GreaterThan::evaluate(Value::from(10), Value::from(20)), false);
    }
}

