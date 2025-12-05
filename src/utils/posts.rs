use highlight::Highlight;
use html::{Node, unescape_html};

pub fn process_post(html: &str, hl: &Highlight) -> String {
    let document: Node = html.parse().unwrap();
    walk(document, hl).to_string()
}

fn walk(node: Node, hl: &Highlight) -> Node {
    match node {
        Node::Root(els) => Node::Root(els.into_iter().map(|el| walk(el, hl)).collect()),
        Node::Element {
            tag_name,
            properties,
            children,
        } => {
            if tag_name != "code" || !properties.contains_key("data-lang") {
                return Node::Element {
                    tag_name: tag_name.clone(),
                    properties: properties.clone(),
                    children: if children.len() > 0 {
                        children.into_iter().map(|c| walk(c, hl)).collect()
                    } else {
                        vec![]
                    },
                };
            }
            let lang = properties.get("data-lang").unwrap();
            let text: String = children
                .iter()
                .filter_map(|c| match c {
                    Node::Text(text) => Some(unescape_html!(text.clone())),
                    Node::Element {
                        tag_name,
                        properties: _,
                        children: _,
                    } => (tag_name == "br").then_some("\n".to_string()),
                    _ => None,
                })
                .collect();
            let highlighted = hl.highlight(&text, &lang);
            match highlighted.parse().unwrap() {
                Node::Root(nodes) => match nodes[0].clone() {
                    Node::Element {
                        tag_name: _,
                        properties: _,
                        children,
                    } => children[0].clone(),
                    _ => unreachable!(),
                },
                _ => unreachable!(),
            }
        }
        _ => node.clone(),
    }
}
