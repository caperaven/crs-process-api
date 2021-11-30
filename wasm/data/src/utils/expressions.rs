use std::str;
use serde_json::Value;


pub fn parse(exp: &str) -> (&str, &str, Value) {
    let field_data = get_field_data(&exp);
    let operator_data = get_opr_data(&exp, field_data.1);
    let value_data = get_value_data(&exp, operator_data.1);

    return ("", "", Value::from(10))
}

fn get_field_data(expr: &str) -> (&str, i32) {
    return ("", 10);
}

fn get_opr_data(expr: &str, i: i32) -> (&str, i32) {
    return ("", 10);
}

fn get_value_data(expr: &str, i: i32) -> Value {
    Value::from("test")
}

#[cfg(test)]
mod test {
    use crate::utils::expressions::parse;

    #[test]
    fn parse_test() {
        let exp = "field1 = 10";
        let result = parse(&exp);
    }

    #[test]
    fn test() {
        let expr = "test".as_bytes().to_vec();
        let r = expr[0];
        assert_eq!(r, b't');

        let s = String::from_utf8(expr).unwrap();
        assert_eq!(s, String::from("test"));
    }
}