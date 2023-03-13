#[macro_export]
macro_rules! get_property {
    ($obj:expr, $prop:expr) => {
        js_sys::Reflect::get(&$obj, &JsValue::from($prop)).unwrap()
    }
}

#[macro_export]
macro_rules! expression {
    ($obj:expr) => {
        &js_sys::Reflect::get(&$obj, &JsValue::from("expressions")).unwrap()
    }
}

#[macro_export]
macro_rules! as_string {
    ($obj:expr) => {
        $obj.as_string().unwrap_or("".to_string())
    }
}

#[macro_export]
macro_rules! eval {
    ($obj1: expr, $opr: tt, $obj2: expr) => ({
        if $obj1.js_typeof() == "number" {
            return Ok($obj1.as_f64() $opr $obj2.as_f64());
        }

        if $obj1.js_typeof() == "boolean" {
            return Ok($obj1.as_bool() $opr $obj2.as_bool());
        }

        if $obj1.js_typeof() == "string" {
            return Ok($obj1.as_string() $opr $obj2.as_string());
        }

        Ok(false)
    })
}