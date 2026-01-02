#[macro_export]
macro_rules! unescape_html {
    ($input:expr) => {
        $input
            .replace("&amp;", "&")
            .replace("&quot;", "\"")
            .replace("&#x27;", "'")
            .replace("&lt;", "<")
            .replace("&gt;", ">")
    };
}
