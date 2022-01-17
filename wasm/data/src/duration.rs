use serde_json::Value;
use iso8601_duration::Duration;
use crate::enums::Placement;

pub fn iso8601_to_duration_str(date: &Value) -> String {
    let value = date.as_str().unwrap();
    let result = Duration::parse(value);

    return match result {
        Ok(duration) => {
            format!("{}:{}:{}:{}:{}", duration.month, duration.day, duration.hour, duration.minute, duration.second)
        }
        Err(err) => {
            err.to_string()
        }
    }
}

/// check the evaluate value against the reference value
/// tell me if must come before or after the reference.
/// We evaluate these values ascending so we use the reference object as the base.
/// Does the reference object come before or after the evaluate object
pub fn iso8601_placement(reference: &Value, evaluate: &Value,) -> Placement {
    let evd = Duration::parse(evaluate.as_str().unwrap()).unwrap();
    let rfd = Duration::parse(reference.as_str().unwrap()).unwrap();

    if evd.year != rfd.year {
        return match evd.year > rfd.year {
            true => Placement::Before,
            false => Placement::After
        };
    }

    if evd.month != rfd.month {
        return match evd.month > rfd.month {
            true => Placement::Before,
            false => Placement::After
        };
    }

    if evd.day != rfd.day {
        return match evd.day > rfd.day {
            true => Placement::Before,
            false => Placement::After
        };
    }

    if evd.hour != rfd.hour {
        return match evd.hour > rfd.hour {
            true => Placement::Before,
            false => Placement::After
        };
    }

    if evd.minute != rfd.minute {
        return match evd.minute > rfd.minute {
            true => Placement::Before,
            false => Placement::After
        };
    }

    if evd.second != rfd.second {
        return match evd.second > rfd.second {
            true => Placement::Before,
            false => Placement::After
        };
    }

    Placement::After
}

#[cfg(test)]
mod test {
    use serde_json::Value;
    use crate::duration::{iso8601_placement, iso8601_to_duration_str};
    use crate::enums::Placement;

    #[test]
    fn value_to_date_string_test() {
        let result = iso8601_to_duration_str(&Value::from("PT100H30M"));
        assert_eq!(result, "0:0:100:30:0".to_string());

        let result = iso8601_to_duration_str(&Value::from("PT4.927647S"));
        assert_eq!(result, "0:0:0:0:4.927647".to_string());
    }

    #[test]
    fn iso8601_placement_test() {
        let result = iso8601_placement(&Value::from("PT100H30M"), &Value::from("PT4.927647S"));
        let is_after = match result {
            Placement::Before => false,
            Placement::After => true
        };
        assert_eq!(is_after, true);
    }

    #[test]
    fn iso8601_placement_days_test() {
        let result = iso8601_placement(&Value::from("P0DT21H22M45.97096S"), &Value::from("P13DT21H23M45S"));
        let is_after = match result {
            Placement::Before => false,
            Placement::After => true
        };
        assert_eq!(is_after, false);

        let result = iso8601_placement(&Value::from("P13DT21H23M45S"), &Value::from("P0DT21H22M45.97096S"));
        let is_after = match result {
            Placement::Before => false,
            Placement::After => true
        };
        assert_eq!(is_after, true);
    }
}