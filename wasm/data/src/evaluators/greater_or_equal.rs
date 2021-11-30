use serde_json::Value;
use crate::eval;
use traits::Eval;

pub struct GreaterOrEqual {}

impl Eval for GreaterOrEqual {
    fn evaluate(obj1: &Value, obj2: &Value) -> bool {
        eval!(obj1, >=, obj2)
    }
}

#[cfg(test)]
mod test {
    use crate::evaluators::GreaterOrEqual;
    use serde_json::Value;
    use traits::Eval;

    #[test]
    fn test_positive() {
        assert_eq!(GreaterOrEqual::evaluate(&Value::from(20), &Value::from(10)), true);
        assert_eq!(GreaterOrEqual::evaluate(&Value::from(20.0), &Value::from(10.0)), true);
        assert_eq!(GreaterOrEqual::evaluate(&Value::from(true), &Value::from(false)), true);
        assert_eq!(GreaterOrEqual::evaluate(&Value::from("B"), &Value::from("A")), true);
        assert_eq!(GreaterOrEqual::evaluate(&Value::from("100"), &Value::from("001")), true);
    }

    #[test]
    fn test_negative() {
        assert_eq!(GreaterOrEqual::evaluate(&Value::from(10), &Value::from(20)), false);
        assert_eq!(GreaterOrEqual::evaluate(&Value::from(10.0), &Value::from(20.0)), false);
        assert_eq!(GreaterOrEqual::evaluate(&Value::from(false), &Value::from(true)), false);
        assert_eq!(GreaterOrEqual::evaluate(&Value::from("A"), &Value::from("B"), ), false);
        assert_eq!(GreaterOrEqual::evaluate(&Value::from("001"), &Value::from("100")), false);
    }

    #[test]
    fn test_equals() {
        assert_eq!(GreaterOrEqual::evaluate(&Value::from(10), &Value::from(10)), true);
    }
}