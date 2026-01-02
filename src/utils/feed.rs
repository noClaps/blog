use crate::unescape_html;

pub fn process_feed(html: &str) -> String {
    let start_index = html.find("<p>").unwrap() + 3;
    let end_index = start_index + html[start_index..].find("</p>").unwrap();
    unescape_html!(&html[start_index..end_index])
}
