use chrono::DateTime;
use chrono::Duration;

pub fn date_diff_duration(date1: &str, date2: &str) -> Result<Duration, String> {
    let d1 = match DateTime::parse_from_rfc3339(date1) {
        Ok(d) => d,
        Err(e) => return Err(format!("Format error parsing date1 {} : {}", date1, e.to_string()))
    };
    let d2 = match DateTime::parse_from_rfc3339(date2) {
        Ok(d) => d,
        Err(e) => return Err(format!("Format error parsing date2 {} : {}", date2, e.to_string()))
    };

    let res = if d1 < d2 {
        d2.signed_duration_since(d1)
    } else {
        d1.signed_duration_since(d2)
    };

    Ok(res)
}

pub struct DateDiff {
    days: i64,
    hours: i64,
    minutes: i64,
    seconds: i64
}

pub fn date_diff_struct(date1: &str, date2: &str) -> Result<DateDiff, String> {
    let duration = date_diff_duration(date1, date2)?;

    let mut milliseconds = duration.num_milliseconds();
    let days = milliseconds / 86_400_000;
    milliseconds = milliseconds - (days * 86_400_000);
    let hours = milliseconds / 3_600_000;
    milliseconds = milliseconds - (hours * 3_600_000);
    let minutes = milliseconds  / 60000;
    milliseconds = milliseconds - (minutes * 60000);
    let seconds = milliseconds / 1000;
    // milliseconds = milliseconds - (seconds * 1000);

    Ok(DateDiff {
        days,
        hours,
        minutes,
        seconds
    })
}

pub fn date_diff_str(date1: &str, date2: &str) -> Result<String, String> {
    let diff = date_diff_struct(date1, date2)?;
    Ok(format!("{}:{}:{}:{}", diff.days, diff.hours, diff.minutes, diff.seconds))
}

#[test]
fn date_diff_str_1_min_test() {
    let res = date_diff_str("2022-02-01T00:00:00.000Z", "2022-02-01T00:00:01.000Z");
    assert_eq!(res.unwrap(), "0:0:0:1");
}

#[test]
fn date_diff_str_dates_swapped_test() {
    let res = date_diff_str("2022-02-01T02:15:30.000Z", "2022-02-01T00:00:00.000Z");
    assert_eq!(res.unwrap(), "0:2:15:30");
}

#[test]
fn date_diff_str_large_test() {
    let res = date_diff_str("2022-02-01T00:00:00.000Z", "2022-03-15T08:12:15.021Z");
    assert_eq!(res.unwrap(), "42:8:12:15");
}

#[test]
fn date_diff_str_invalid_test() {
    let res = date_diff_str("2022-02-01T00:00:00.000Z", "2022-02-01T00:00:00");
    assert_eq!(res.unwrap_err(), "Format error parsing date2 2022-02-01T00:00:00 : premature end of input");
}