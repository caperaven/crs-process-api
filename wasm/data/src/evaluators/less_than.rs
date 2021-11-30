use serde_json::Value;
use crate::eval;
use traits::Eval;

pub struct LessThan {}

impl Eval for LessThan {
    fn evaluate(obj1: &Value, obj2: &Value) -> bool {
        eval!(obj1, <, obj2)
    }
}

#[cfg(test)]
mod test {
    use crate::evaluators::LessThan;
    use serde_json::Value;
    use traits::Eval;

    #[test]
    fn test_positive() {
        assert_eq!(LessThan::evaluate(&Value::from(20), &Value::from(10)), false);
        assert_eq!(LessThan::evaluate(&Value::from(20.0), &Value::from(10.0)), false);
        assert_eq!(LessThan::evaluate(&Value::from(true), &Value::from(false)), false);
        assert_eq!(LessThan::evaluate(&Value::from("B"), &Value::from("A")), false);
        assert_eq!(LessThan::evaluate(&Value::from("100"), &Value::from("001")), false);
    }

    #[test]
    fn test_negative() {
        assert_eq!(LessThan::evaluate(&Value::from(10), &Value::from(20)), true);
        assert_eq!(LessThan::evaluate(&Value::from(10.0), &Value::from(20.0)), true);
        assert_eq!(LessThan::evaluate(&Value::from(false), &Value::from(true)), true);
        assert_eq!(LessThan::evaluate(&Value::from("A"), &Value::from("B"), ), true);
        assert_eq!(LessThan::evaluate(&Value::from("001"), &Value::from("100")), true);
    }
}