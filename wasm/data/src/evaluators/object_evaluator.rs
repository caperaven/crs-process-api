use serde_json::Value;
use serde_json::Value::Null;
use traits::Eval;

use crate::evaluators::{Between, GreaterThan};
use crate::evaluators::GreaterOrEqual;
use crate::evaluators::LessThan;
use crate::evaluators::LessOrEqual;
use crate::evaluators::Equal;
use crate::evaluators::NotEqual;
use crate::evaluators::IsNull;
use crate::evaluators::IsNotNull;
use crate::evaluators::Like;
use crate::evaluators::NotLike;
use crate::evaluators::OneOf;

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
        "in"        => OneOf::evaluate(&row_value, &intent_value),
        "between"   => Between::evaluate(&row_value, &intent_value),
        _       => false
    }
}

#[cfg(test)]
mod test {
    use serde_json::{json, Value};
    use serde_json::Value::Null;
    use crate::evaluate_object;

    fn create_filter(field: &str, operator: &str, value: Value) -> Value {
        json!({
            "field": field,
            "operator": operator,
            "value": value
        })
    }

    #[test]
    fn evaluate_equal_test() {
        let filter = create_filter("value", "==", Value::from(10));
        let row = json!({"value": 10});
        assert_eq!(evaluate_object(&filter, &row), true);
    }

    #[test]
    fn evaluate_notequal_test() {
        let filter = create_filter("value", "!=", Value::from(20));
        let row = json!({"value": 10});
        assert_eq!(evaluate_object(&filter, &row), true);
    }

    #[test]
    fn evaluate_greater_than_test() {
        let filter = create_filter("value", ">", Value::from(10));
        let row = json!({"value": 20});
        assert_eq!(evaluate_object(&filter, &row), true);
    }

    #[test]
    fn evaluate_greater_or_equal_test() {
        let filter = create_filter("value", ">=", Value::from(10));
        let row = json!({"value": 10});
        assert_eq!(evaluate_object(&filter, &row), true);

        let row = json!({"value": 11});
        assert_eq!(evaluate_object(&filter, &row), true);

        let row = json!({"value": 9});
        assert_eq!(evaluate_object(&filter, &row), false);
    }

    #[test]
    fn evaluate_less_than_test() {
        let filter = create_filter("value", "<", Value::from(20));
        let row = json!({"value": 10});
        assert_eq!(evaluate_object(&filter, &row), true);
    }

    #[test]
    fn evaluate_less_or_equal_test() {
        let filter = create_filter("value", "<=", Value::from(20));
        let row = json!({"value": 20});
        assert_eq!(evaluate_object(&filter, &row), true);

        let row = json!({"value": 19});
        assert_eq!(evaluate_object(&filter, &row), true);

        let row = json!({"value": 21});
        assert_eq!(evaluate_object(&filter, &row), false);
    }

    #[test]
    fn evaluate_is_null_test() {
        let filter = create_filter("value", "is_null", Null);
        assert_eq!(evaluate_object(&filter, &Null), true);

        let row = json!({"value": 21});
        assert_eq!(evaluate_object(&filter, &row), false);
    }

    #[test]
    fn evaluate_is_not_null_test() {
        let filter = create_filter("value", "not_null", Null);
        let row = json!({"value": 21});

        assert_eq!(evaluate_object(&filter, &row), true);
        assert_eq!(evaluate_object(&filter, &Null), false);
    }

    #[test]
    fn evaluate_is_like_test() {
        let filter = create_filter("value", "like", Value::from("hello"));
        let row = json!({"value": "hello world"});
        assert_eq!(evaluate_object(&filter, &row), true);

        let row = json!({"value": "test string"});
        assert_eq!(evaluate_object(&filter, &row), false);
    }

    #[test]
    fn evaluate_not_like_test() {
        let filter = create_filter("value", "not_like", Value::from("test"));
        let row = json!({"value": "hello world"});
        assert_eq!(evaluate_object(&filter, &row), true);

        let row = json!({"value": "test string"});
        assert_eq!(evaluate_object(&filter, &row), false);
    }

    #[test]
    fn evaluate_in_test() {
        let filter = create_filter("value", "in", json!([1, 2, 3]));
        let row = json!({"value": 1});
        assert_eq!(evaluate_object(&filter, &row), true);

        let row = json!({"value": 5});
        assert_eq!(evaluate_object(&filter, &row), false);
    }

    #[test]
    fn evaluate_between_test() {
        let filter = create_filter("value", "between", json!([1, 3]));
        let row = json!({"value": 1});
        assert_eq!(evaluate_object(&filter, &row), true);

        let row = json!({"value": 5});
        assert_eq!(evaluate_object(&filter, &row), false);
    }
}