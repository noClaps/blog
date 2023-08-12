export interface NavData {
    slug: string;
    title: string;
    shortTitle: string;
}

interface TreeItem {
    name?: string;
    title?: string;
    shortTitle?: string;
    slug?: string;
    children?: TreeItem[];
}

export function treeify(data: NavData[]) {
    const map: TreeItem[] = [];
    let currentArr = map;
    data.forEach(link => {
        const pathArr = link.slug.split("/");

        pathArr.forEach((part, index) => {
            if (index === pathArr.length - 1) {
                currentArr.push({
                    title: link.title,
                    shortTitle: link.shortTitle,
                    slug: link.slug
                });

                currentArr = map;

                return;
            }
            if (!currentArr.find(item => item.name === part)) {
                currentArr.push({ name: part, children: [] });
                currentArr = currentArr.find(item => item.name === part)?.children || [];
            } else {
                currentArr = currentArr.find(item => item.name === part)?.children || [];
            }
        });
    });

    return map;
}

export function capitalise(text: string) {
    return text.charAt(0).toUpperCase() + text.slice(1);
}
