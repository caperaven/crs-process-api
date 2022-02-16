use serde_json::Value;
use crate::processors;

pub fn build_perspective(perspective: &Value, data: &[Value]) -> String {
    /*
        1. filter
        2. sort
        3. group or aggregate
    */
    let mut rows = get_rows(perspective, data);

    let sort = perspective.get("sort");
    let group = perspective.get("group");
    let aggregates = perspective.get("aggregates");

    // There was only a filter or nothing at all so just return the filter result
    if sort == None && group == None && aggregates == None {
        return Value::from(rows).to_string();
    }

    match sort {
        None => {}
        Some(def) => {
            rows = processors::sort(def.as_array().unwrap(), data, Some(rows));
        }
    }

    if group == None && aggregates == None {
        return Value::from(rows).to_string();
    }

    match group {
        None => {}
        Some(def) => {
            let group_def = def.as_array().unwrap().iter().map(|value| value.as_str().unwrap()).collect();
            let grouping = processors::group(&group_def, data);
            return grouping.to_string();
        }
    }

    return String::new()
}

fn get_case_sensitive(perspective: &Value) -> bool {
    let result = perspective.get("case_sensitive");

    return match result {
        None => false,
        Some(value) => value.as_bool().unwrap()
    }
}

fn get_rows(perspective: &Value, data: &[Value]) -> Vec<usize> {
    let case_sensitive = get_case_sensitive(perspective);

    let mut result: Vec<usize>;

    let filter = perspective.get("filter");
    return match filter {
        None => {
            result = Vec::new();
            for i in 0..data.len() {
                result.push(i);
            }
            result
        }
        Some(filter_intent) => {
            processors::filter(&filter_intent.as_array().unwrap(), data, case_sensitive)
        }
    }
}

#[cfg(test)]
mod test {
    use serde_json::{json, Value};
    use crate::processors::build_perspective;

    fn get_data() -> Vec<Value> {
        let mut result: Vec<Value> = Vec::new();
        result.push(json!({"id": 0, "code": "A", "value": 10, "isActive": true, "person": {"name": "John"}}));
        result.push(json!({"id": 1, "code": "B", "value": 10, "isActive": false, "person": {"name": "John"}}));
        result.push(json!({"id": 2, "code": "C", "value": 20, "isActive": true, "person": {"name": "Jane"}}));
        result.push(json!({"id": 3, "code": "D", "value": 20, "isActive": true, "person": {"name": "Jane"}}));
        result.push(json!({"id": 4, "code": "E", "value": 5, "isActive": false, "person": {"name": "Andrew"}}));
        return result;
    }

    #[test]
    fn just_filter_test() {
        let data = get_data();

        let intent = json!({});

        let result = build_perspective(&intent, &data);
        assert_eq!(result, "[0,1,2,3,4]");
    }

    #[test]
    fn just_sort_test() {
        let data = get_data();

        let intent1 = json!({
            "sort": [{"name": "code", "direction": "asc"}]
        });

        let intent2 = json!({
            "sort": [{"name": "code", "direction": "dec"}]
        });

        let result = build_perspective(&intent1, &data);
        assert_eq!(result, "[0,1,2,3,4]");

        let result = build_perspective(&intent2, &data);
        assert_eq!(result, "[4,3,2,1,0]");
    }

    #[test]
    fn just_grouping_test() {
        let data = get_data();
        let intent = json!({
            "group": ["value"]
        });

        let result = build_perspective(&intent, &data);
        assert_eq!(result.contains("root"), true);
    }

    #[test]
    fn build_perspective_filter_test() {
        let data = get_data();

        let intent = json!({
            "filter": [{ "field": "value", "operator": "<", "value": 20 }],
            "case_sensitive": false
        });

        let result = build_perspective(&intent, &data);
        assert_eq!(result, "[0,1,4]");
    }

    #[test]
    fn build_perspective_filter_and_sort_test() {
        let data = get_data();

        let intent = json!({
            "filter": [{ "field": "value", "operator": "<", "value": 20 }],
            "case_sensitive": false,
            "sort": [{"name": "code", "direction": "asc"}]
        });

        let result = build_perspective(&intent, &data);
        assert_eq!(result, "[0,1,4]");
    }

}