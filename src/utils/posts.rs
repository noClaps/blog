use html::{Node, unescape_html};

use crate::utils::highlight::highlight;

pub fn process_post(html: &str) -> String {
    let document: Node = html.parse().unwrap();
    walk(&document).to_string()
}

fn walk(node: &Node) -> Node {
    match node {
        Node::Root(els) => Node::Root(els.iter().map(|el| walk(el)).collect()),
        Node::Element {
            tag_name,
            properties,
            children,
        } if tag_name == "code" && properties.contains_key("data-lang") => {
            let Some(lang) = properties.get("data-lang") else {
                unreachable!()
            };
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
            let highlighted = format!("<code>{}</code>", highlight(&text, &lang));
            let Node::Root(nodes) = highlighted.parse().unwrap() else {
                unreachable!()
            };
            nodes[0].clone()
        }
        Node::Element {
            tag_name,
            properties,
            children,
        } => Node::Element {
            tag_name: tag_name.clone(),
            properties: properties.clone(),
            children: children.iter().map(|c| walk(c)).collect(),
        },
        _ => node.clone(),
    }
}
