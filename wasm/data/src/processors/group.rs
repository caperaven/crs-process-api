use serde_json::Value;

pub fn group(intent: &Value, data: &Value) -> Value {
    let fields = intent.as_array().unwrap().iter().map(|x| x.as_str().unwrap()).collect::<Vec<&str>>();

    let mut target = Value::Object(Default::default());
    let mut row_index = 0;

    for row in data.as_array().unwrap() {
        create_object_path(&mut target, &fields, 0, row, row_index);
        row_index += 1;
    }

    target
}

fn add_value_object(target: &mut Value, field: &String) {
    let result = Value::Object(Default::default());
    target[&field] = result;
    target["_count"] = Value::from(1);
}

fn add_value_array(target: &mut Value, field: &String, row_index: usize) {
    add_value_object(target, &field);
    let obj = &mut target[field];

    let mut array: Vec<Value> = Vec::new();
    array.push(Value::from(row_index as i64));
    obj["rows"] = Value::Array(array);
    obj["_count"] = Value::from(1);
}

fn add_row_index_to_array(target: &mut Value, row_index: usize) {
    let mut collection: Vec<Value> = target.as_array().unwrap().to_vec();
    let index_value = Value::from(row_index as i64);
    collection.push(index_value);
}

fn create_object_path(target: &mut Value, fields: &Vec<&str>, field_ind: usize, record: &Value, row_index: usize) {
    let field = fields[field_ind];
    let value_str: String;

    if record[field].is_string() {
        value_str = String::from(record[field].as_str().unwrap())
    }
    else {
        value_str = record[field].to_string();
    }

    match target.get_mut(&value_str) {
        None => {
            if field_ind == fields.len() -1 {
                add_value_array(target, &value_str, row_index);
            }
            else {
                add_value_object(target, &value_str);
                create_object_path(&mut target[&value_str], &fields, field_ind + 1, record, row_index);
            }
        }
        Some(value) => {
            if field_ind == fields.len() - 1 {
                let rows = &mut value["rows"];
                add_row_index_to_array(rows, row_index);
            }
            else {
                create_object_path(&mut target[&value_str], &fields, field_ind + 1, record, row_index);
            }
        }
    }
}

#[cfg(test)]
mod test {
    use serde_json::{json, Value};
    use crate::processors::group::group;

    fn get_data() -> Value {
        return json!([
            {"id": 0, "code": "A", "value": 10, "isActive": true},
            {"id": 1, "code": "B", "value": 10, "isActive": false},
            {"id": 2, "code": "C", "value": 20, "isActive": true},
            {"id": 3, "code": "D", "value": 20, "isActive": true},
            {"id": 4, "code": "E", "value": 5, "isActive": false}
        ]);
    }

    #[test]
    fn group_test() {
        let data = get_data();
        let intent = json!(["value"]);
        let result = group(&intent, &data);
        println!("{:?}", result);
    }

    #[test]
    fn test() {
        let fields = json!(["field1", "field2"]);
        let data = json!([
            {"field1": 10, "field2": "a", "value": 1},
            {"field1": 10, "field2": "b", "value": 2},
            {"field1": 11, "field2": "c", "value": 3},
            {"field1": 10, "field2": "a", "value": 4}
        ]);

        let result = group(&fields, &data);

        println!("{:?}", result.to_string());
    }
}
