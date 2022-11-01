/// Where does this value fit into an array.
/// Smaller values are before larger values.
/// Thus 1 is before 2 and 2 is after 1
#[derive(PartialEq)]
pub enum Placement {
    Before,
    After
}

#[derive(Debug)]
pub enum SortDirection {
    Ascending,
    Descending
}

impl PartialEq  for SortDirection {
    fn eq(&self, other: &Self) -> bool {
        let dec1 = match self {
            SortDirection::Ascending => false,
            SortDirection::Descending => true
        };

        let dec2 = match other {
            SortDirection::Ascending => false,
            SortDirection::Descending => true
        };

        dec1 == dec2
    }
}