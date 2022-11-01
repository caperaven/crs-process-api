use serde_json::Value;
use crate::eval;
use crate::traits::Eval;

pub struct Equal {}

impl Eval for Equal {
    fn evaluate(obj1: &Value, obj2: &Value) -> bool {
        eval!(obj1, ==, obj2)
    }
}

#[cfg(test)]
mod test {
    use crate::evaluators::Equal;
    use serde_json::Value;
    use crate::traits::Eval;

    #[test]
    fn test_positive() {
        assert_eq!(Equal::evaluate(&Value::from(20), &Value::from(20)), true);
        assert_eq!(Equal::evaluate(&Value::from(20.0), &Value::from(20.0)), true);
        assert_eq!(Equal::evaluate(&Value::from(true), &Value::from(true)), true);
        assert_eq!(Equal::evaluate(&Value::from("B"), &Value::from("B")), true);
        assert_eq!(Equal::evaluate(&Value::from("100"), &Value::from("100")), true);
    }

    #[test]
    fn test_negative() {
        assert_eq!(Equal::evaluate(&Value::from(10), &Value::from(20)), false);
        assert_eq!(Equal::evaluate(&Value::from(10.0), &Value::from(20.0)), false);
        assert_eq!(Equal::evaluate(&Value::from(false), &Value::from(true)), false);
        assert_eq!(Equal::evaluate(&Value::from("A"), &Value::from("B"), ), false);
        assert_eq!(Equal::evaluate(&Value::from("001"), &Value::from("100")), false);
    }
}