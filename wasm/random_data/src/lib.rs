use rand::Rng;
use std::str;
use serde_json::Value;

fn get_random_code() -> String {
    let mut results: Vec<u8> = Vec::new();

    for _i in 0..6 {
        let value = get_random_number(48, 122);
        let u8_value = value as u8;
        results.push(u8_value)
    }

    let s = str::from_utf8(&results).unwrap();
    return s.to_string();
}

fn get_random_number(min: i64, max: i64) -> i64 {
    let mut rng = rand::thread_rng();
    let value = rng.gen_range(min..max);
    return value;
}

fn get_random_date() -> String {
    let year = get_random_number(1980, 2022);
    let month = get_random_number(1,12);
    let day = get_random_number(1, 28);

    let year_str = format!("{}", year);

    let month_str;
    if month < 10 {
        month_str = format!("0{}", month);
    }
    else {
        month_str = format!("{}", month);
    }

    let day_str;
    if day < 10 {
        day_str = format!("0{}", day);
    }
    else {
        day_str = format!("{}", day)
    }

    format!("{}/{}/{}", year_str, month_str, day_str)
}

fn get_random_duration() -> String {
    let hours = get_random_number(0, 23);
    let min = get_random_number(0, 59);
    let seconds = get_random_number(0, 59);

    format!("PT{}H{}M{}S", hours, min, seconds)
}

pub fn generate_data(count: usize) -> Vec<Value> {
    let external_codes = [get_random_code(), get_random_code(), get_random_code(), get_random_code(), get_random_code()];
    let durations = ["PT4H30M11S".to_string(), get_random_duration(), get_random_duration(), get_random_duration(), get_random_duration()];

    let mut result: Vec<Value> = Vec::new();
    for i in 0..count {
        let index = get_random_number(0, 4) as usize;
        let external_code = external_codes[index].clone();
        let duration = durations[index].clone();

        let mut value = Value::Object(Default::default());
        value["id"]             = Value::from(i);
        value["code"]           = Value::from(get_random_code());
        value["description"]    = Value::from(format!("Description for id: {}", i));
        value["number"]         = Value::from(get_random_number(0, 10));
        value["date"]           = Value::from(get_random_date());
        value["duration"]       = Value::from(duration.as_str());
        value["externalCode"]   = Value::from(external_code.as_str());
        result.push(value);
    }
    return result;
}

#[cfg(test)]
mod tests {
    use crate::{generate_data, get_random_code, get_random_date, get_random_duration};

    #[test]
    fn get_random_code_test() {
        let str = get_random_code();
        assert_eq!(str.len(), 6);
    }

    #[test]
    fn get_random_date_test() {
        let str = get_random_date();
        assert_eq!(str.len(), 10);
    }

    #[test]
    fn get_random_duration_test() {
        let str = get_random_duration();
        assert!(str.len() >= 8);
    }

    #[test]
    fn generate_data_test() {
        let data = generate_data(10);
        assert_eq!(data.len(), 10);
    }
}
