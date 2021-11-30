use serde_json::Value;
use traits::Eval;

use crate::evaluators::GreaterThan;
use crate::evaluators::GreaterOrEqual;
use crate::evaluators::LessThan;
use crate::evaluators::LessOrEqual;
use crate::evaluators::Equal;
use crate::evaluators::NotEqual;

pub struct FilterItem<'a> {
    field       : &'a str,
    operator    : &'a str,
    value       : &'a Value
}

impl FilterItem<'static> {
    pub fn from(intent: &Value) -> FilterItem {
        FilterItem {
            field    : intent["field"].as_str().unwrap(),
            operator : intent["operator"].as_str().unwrap(),
            value    : &intent["value"]
        }
    }

    /// If the result is false the evaluation failed and this row is not included
    pub fn evaluate(&self, row: &Value) -> bool {
        let value = &row[self.field];

        return match self.operator {
            ">"     => GreaterThan::evaluate(&self.value, &value),
            ">="    => GreaterOrEqual::evaluate(&self.value, &value),
            "<"     => LessThan::evaluate(&self.value, &value),
            "<="    => LessOrEqual::evaluate(&self.value, &value),
            "=="    => Equal::evaluate(&self.value, &value),
            "!="    => NotEqual::evaluate(&self.value, &value),
            _       => false
        }
    }
}

pub fn filters_from_intent(intent: &Value) -> Vec<FilterItem> {
    let mut result: Vec<FilterItem> = Vec::new();

    for filter in intent["filter"].as_array().unwrap() {
        result.push(FilterItem::from(filter));
    }

    return result;
}

#[cfg(test)]
mod test {
    use crate::filter::filter::{FilterItem, filters_from_intent};
    use serde_json::{json, Value};

    #[test]
    fn filter_item_constructor_test() {
        let intent = json!({
            "field": "field1",
            "operator": "==",
            "value": 10
        });

        let filter_item: FilterItem = FilterItem::from(&intent);

        assert_eq!(filter_item.field,       "field1");
        assert_eq!(filter_item.operator,    "==");
        assert_eq!(filter_item.value,       &Value::from(10));
    }

    #[test]
    fn filter_from_intent_test() {
        let intent = json!({
           "filter": [
                {"field": "value", "operator": "<", "value": 20},
                {"field": "value2", "operator": "<=", "value": "Hello World"}
            ]
        });

        let result = filters_from_intent(&intent);
        assert_eq!(&result.len(), &2usize);

        let f1 = &result[0];
        assert_eq!(f1.field,       "value");
        assert_eq!(f1.operator,    "<");
        assert_eq!(f1.value,       &Value::from(20));

        let f2 = &result[1];
        assert_eq!(f2.field,       "value2");
        assert_eq!(f2.operator,    "<=");
        assert_eq!(f2.value,       &Value::from("Hello World"));
    }
}