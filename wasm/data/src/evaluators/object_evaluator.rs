use serde_json::Value;
use serde_json::Value::Null;
use traits::Eval;

use crate::evaluators::GreaterThan;
use crate::evaluators::GreaterOrEqual;
use crate::evaluators::LessThan;
use crate::evaluators::LessOrEqual;
use crate::evaluators::Equal;
use crate::evaluators::NotEqual;
use crate::evaluators::IsNull;
use crate::evaluators::IsNotNull;
use crate::evaluators::Like;
use crate::evaluators::NotLike;

pub fn evaluate_object(intent: &Value, row: &Value) -> bool {
    let field= intent["field"].as_str().unwrap();
    let operator= intent["operator"].as_str().unwrap();

    let intent_value= &intent["value"];
    let row_value= &row[field];

    return match operator {
        ">"         => GreaterThan::evaluate(&row_value, &intent_value),
        ">="        => GreaterOrEqual::evaluate(&row_value, &intent_value),
        "<"         => LessThan::evaluate(&row_value, &intent_value),
        "<="        => LessOrEqual::evaluate(&row_value, &intent_value),
        "=="        => Equal::evaluate(&row_value, &intent_value),
        "!="        => NotEqual::evaluate(&row_value, &intent_value),
        "is_null"   => IsNull::evaluate(&row_value, &Null),
        "not_null"  => IsNotNull::evaluate(&row_value, &Null),
        "like"      => Like::evaluate(&row_value, &intent_value),
        "not_like"  => NotLike::evaluate(&row_value, &intent_value),
        _       => false
    }
}

#[cfg(test)]
mod test {
    use serde_json::json;
    use crate::evaluate_object;

    #[test]
    fn evaluate_equal_test() {
        let filter = json!({
            "field": "value",
            "operator": "==",
            "value": 10
        });

        let row = json!({"value": 10});
        assert_eq!(evaluate_object(&filter, &row), true);
    }

    #[test]
    fn evaluate_notequal_test() {
        let filter = json!({
            "field": "value",
            "operator": "!=",
            "value": 10
        });

        let row = json!({"value": 10});
        assert_eq!(evaluate_object(&filter, &row), false);
    }
}