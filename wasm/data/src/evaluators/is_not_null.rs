use serde_json::Value;
use crate::traits::Eval;

pub struct IsNotNull {}

impl Eval for IsNotNull {
    fn evaluate(obj1: &Value, _obj2: &Value) -> bool {
        obj1.is_null() == false
    }
}

#[cfg(test)]
mod test {
    use serde_json::Value;
    use serde_json::Value::Null;
    use crate::traits::Eval;
    use crate::evaluators::is_not_null::IsNotNull;

    #[test]
    fn is_null_test() {
        assert_eq!(IsNotNull::evaluate(&Null, &Null), false);
        assert_eq!(IsNotNull::evaluate(&Value::from(10), &Null), true);
    }
}
