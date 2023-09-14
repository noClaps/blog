interface PostData {
    by: string;
    descendants: number;
    id: number;
    kids?: number[];
    score: number;
    text?: string;
    time: number;
    title: string;
    type: 'story';
    url?: string;
}

interface FilteredPosts extends PostData {
    url: string;
}

export async function fetchPosts() {
    const postIds = await fetch("https://hacker-news.firebaseio.com/v0/newstories.json")
        .then(r => r.json()) as number[];

    const posts = await Promise.all(
        postIds.map((id) => fetch(`https://hacker-news.firebaseio.com/v0/item/${ id }.json`)
            .then(r => r.json()) as Promise<PostData>
        )
    );

    return filterPosts(posts);
}

function filterPosts(posts: PostData[]) {
    let filteredPosts = posts
        // Filter out posts that don't have URLs
        .filter(post => post.url
            // Filter out twitter posts
            && !post.url.startsWith("https://twitter.com")) as FilteredPosts[];
    return filteredPosts;
}