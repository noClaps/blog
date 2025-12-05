use html::{Node, unescape_html};

pub fn process_feed(html: &str) -> String {
    let Node::Root(root) = html.parse().unwrap() else {
        unreachable!()
    };
    // <html>
    let Node::Element { children, .. } = root[1].clone() else {
        unreachable!()
    };
    // <body>
    let Node::Element { children, .. } = children[1].clone() else {
        unreachable!()
    };
    // <p>
    let Node::Element { children, .. } = children[0].clone() else {
        unreachable!()
    };
    let Node::Text(text) = children[0].clone() else {
        unreachable!()
    };
    unescape_html!(text)
}
