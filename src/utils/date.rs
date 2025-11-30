use std::{fmt::Display, num::ParseIntError, str::FromStr};

#[derive(Clone, Copy, PartialEq, PartialOrd)]
pub struct Date {
    year: u64,
    month: u8,
    day: u8,
}
impl FromStr for Date {
    type Err = ParseIntError;
    fn from_str(s: &str) -> Result<Self, Self::Err> {
        let mut s = s.split('-');

        let year = s.next().unwrap().parse()?;
        let month = s.next().unwrap().parse()?;
        let day = s.next().unwrap().parse()?;

        Ok(Self { year, month, day })
    }
}
impl Default for Date {
    fn default() -> Self {
        Self {
            year: 0,
            month: 0,
            day: 0,
        }
    }
}
impl Display for Date {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(f, "{:0>4}-{:0>2}-{:0>2}", self.year, self.month, self.day)
    }
}
impl Date {
    pub fn fmt_time(&self) -> String {
        format!(
            "{:0>4}-{:0>2}-{:0>2}T00:00:00",
            self.year, self.month, self.day
        )
    }
}
