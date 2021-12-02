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
use crate::evaluators::StartsWith;
use crate::evaluators::EndsWith;

pub fn evaluate_object(intent: &Value, row: &Value) -> bool {
    let operator= intent["operator"].as_str().unwrap();

    if operator == "or" || operator == "||" {
        return evaluate_or(&intent["expressions"], &row);
    }

    if operator == "and" || operator == "&&" {
        return evaluate_and(&intent["expressions"], &row);
    }

    if operator == "not" || operator == "!" {
        return evaluate_not(&intent["expressions"], &row);
    }

    let field= intent["field"].as_str().unwrap();
    let intent_value= &intent["value"];
    let row_value= &row[field];

    return match operator {
        ">"         | "gt"  => GreaterThan::evaluate(&row_value, &intent_value),
        ">="        | "ge"  => GreaterOrEqual::evaluate(&row_value, &intent_value),
        "<"         | "lt"  => LessThan::evaluate(&row_value, &intent_value),
        "<="        | "le"  => LessOrEqual::evaluate(&row_value, &intent_value),
        "==" | "="  | "eq"  => Equal::evaluate(&row_value, &intent_value),
        "!=" | "<>" | "ne"  => NotEqual::evaluate(&row_value, &intent_value),
        "is_null"           => IsNull::evaluate(&row_value, &Null),
        "not_null"          => IsNotNull::evaluate(&row_value, &Null),
        "like"              => Like::evaluate(&row_value, &intent_value),
        "not_like"          => NotLike::evaluate(&row_value, &intent_value),
        "in"                => OneOf::evaluate(&row_value, &intent_value),
        "between"           => Between::evaluate(&row_value, &intent_value),
        "startswith"        => StartsWith::evaluate(&row_value, &intent_value),
        "endswith"          => EndsWith::evaluate(&row_value, &intent_value),
        _                   => false
    }
}

pub fn evaluate_and(expressions: &Value, row: &Value) -> bool {
    // as soon as a expression is false, the row fails and we stop the process
    for filter in expressions.as_array().unwrap() {
        let result = evaluate_object(&filter, &row);
        if result == false {
            return false;
        }
    }

    return true;
}

pub fn evaluate_or(expressions: &Value, row: &Value) -> bool {
    // as soon as the expression passes, stop and the row succeeds
    for filter in expressions.as_array().unwrap() {
        let result = evaluate_object(&filter, &row);
        if result == true {
            return true;
        }
    }

    // if none of the succeeded this expression batch fails
    return false;
}

pub fn evaluate_not(expressions: &Value, row: &Value) -> bool {
    let result = evaluate_and(&expressions, &row);
    return !result;
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
        let filter = create_filter("value", "=", Value::from(10));
        let row = json!({"value": 10});
        assert_eq!(evaluate_object(&filter, &row), true);
    }

    #[test]
    fn evaluate_notequal_test() {
        let filter = create_filter("value", "<>", Value::from(20));
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

    #[test]
    fn evaluate_simple_not_test() {
        // !(value == 1)
        let filter = json!({
            "operator": "not",
            "expressions": [
                create_filter("value", "eq", Value::from(1)),
            ]
        });

        let row = json!({ "value": 1});
        assert_eq!(evaluate_object(&filter, &row), false);

        let row = json!({ "value": 2});
        assert_eq!(evaluate_object(&filter, &row), true);
    }

    #[test]
    fn evaluate_simple_and_test() {
        // value == 1 && value2 == 2
        let filter = json!({
            "operator": "and",
            "expressions": [
                create_filter("value", "eq", Value::from(1)),
                create_filter("value2", "eq", Value::from(2)),
            ]
        });

        let row = json!({ "value": 1, "value2": 2 });
        assert_eq!(evaluate_object(&filter, &row), true);

        let row = json!({ "value": 1, "value2": 3 });
        assert_eq!(evaluate_object(&filter, &row), false);
    }

    #[test]
    fn evaluate_simple_or_test() {
        // value == 1 || value2 == 2
        let filter = json!({
            "operator": "or",
            "expressions": [
                create_filter("value", "eq", Value::from(1)),
                create_filter("value2", "eq", Value::from(2)),
            ]
        });

        let row = json!({ "value": 1, "value2": 3 });
        assert_eq!(evaluate_object(&filter, &row), true);

        let row = json!({ "value": 3, "value2": 2 });
        assert_eq!(evaluate_object(&filter, &row), true);

        let row = json!({ "value": 3, "value2": 3 });
        assert_eq!(evaluate_object(&filter, &row), false);
    }

    #[test]
    fn evaluate_composite_and_or_test() {
        // (value == 1 or value == 2) and (value2 == 3)
        let filter = json!({
            "operator": "and",
            "expressions": [
                {
                    "operator": "or",
                    "expressions": [
                        create_filter("value", "eq", Value::from(1)),
                        create_filter("value", "eq", Value::from(2)),
                    ]
                },
                create_filter("value2", "eq", Value::from(3)),
            ]
        });

        let row = json!({ "value": 1, "value2": 3 });
        assert_eq!(evaluate_object(&filter, &row), true);

        let row = json!({ "value": 2, "value2": 3 });
        assert_eq!(evaluate_object(&filter, &row), true);

        let row = json!({ "value": 3, "value2": 3 });
        assert_eq!(evaluate_object(&filter, &row), false);

        let row = json!({ "value": 1, "value2": 1 });
        assert_eq!(evaluate_object(&filter, &row), false);

        let row = json!({ "value": 2, "value2": 1 });
        assert_eq!(evaluate_object(&filter, &row), false);
    }

    #[test]
    fn evaluate_composite_not_and_or_test() {
        // !((value == 1 or value == 2) and (value2 == 3))
        let filter = json!(
            {
                "operator": "not",
                "expressions": [
                    {
                        "operator": "and",
                        "expressions": [
                            {
                                "operator": "or",
                                "expressions": [
                                    create_filter("value", "eq", Value::from(1)),
                                    create_filter("value", "eq", Value::from(2)),
                                ]
                            },
                            create_filter("value2", "eq", Value::from(3)),
                        ]
                    }
                ]
            }
        );

        let row = json!({ "value": 1, "value2": 3 });
        assert_eq!(evaluate_object(&filter, &row), false);

        let row = json!({ "value": 2, "value2": 3 });
        assert_eq!(evaluate_object(&filter, &row), false);

        let row = json!({ "value": 3, "value2": 3 });
        assert_eq!(evaluate_object(&filter, &row), true);

        let row = json!({ "value": 1, "value2": 1 });
        assert_eq!(evaluate_object(&filter, &row), true);

        let row = json!({ "value": 2, "value2": 1 });
        assert_eq!(evaluate_object(&filter, &row), true);
    }

    #[test]
    fn evaluate_startswith_test() {
        let filter = create_filter("value", "startswith", Value::from("Hello"));
        let row = json!({"value": "Hello World"});
        assert_eq!(evaluate_object(&filter, &row), true);

        let row = json!({"value": "Not Hello World"});
        assert_eq!(evaluate_object(&filter, &row), false);
    }

    #[test]
    fn evaluate_endswith_test() {
        let filter = create_filter("value", "endswith", Value::from("World"));
        let row = json!({"value": "Hello World"});
        assert_eq!(evaluate_object(&filter, &row), true);

        let row = json!({"value": "Hello World Not"});
        assert_eq!(evaluate_object(&filter, &row), false);
    }
}