use serde_json::Value;
use traits::Eval;

pub struct IsNull {}

impl Eval for IsNull {
    fn evaluate(obj1: &Value, _obj2: &Value) -> bool {
        obj1.is_null() == true
    }
}

#[cfg(test)]
mod test {
    use serde_json::Value;
    use serde_json::Value::Null;
    use traits::Eval;
    use crate::evaluators::is_null::IsNull;

    #[test]
    fn is_null_test() {
        assert_eq!(IsNull::evaluate(&Null, &Null), true);
        assert_eq!(IsNull::evaluate(&Value::from(10), &Null), false);
    }
}
