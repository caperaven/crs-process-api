use serde_json::Value;

struct FilterItem<'a> {
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
}

#[cfg(test)]
mod test {
    use crate::filter::filter::FilterItem;
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
}