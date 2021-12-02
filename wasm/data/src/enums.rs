/// Where does this value fit into an array.
/// Smaller values are before larger values.
/// Thus 1 is before 2 and 2 is after 1
pub enum Placement {
    Before,
    After
}