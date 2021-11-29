#[macro_use]

mod evaluators;

#[macro_export]
macro_rules! eval {
    ($obj1: expr, $opr: tt, $obj2: expr) => ({
        if $obj1.is_i64() {
            return $obj1.as_i64() $opr $obj2.as_i64();
        }

        if $obj1.is_f64() {
            return $obj1.as_f64() $opr $obj2.as_f64();
        }

        if $obj1.is_boolean() {
            return $obj1.as_bool() $opr $obj2.as_bool();
        }

        if $obj1.is_string() {
            return $obj1.as_str() $opr $obj2.as_str();
        }

        return false;
    })
}