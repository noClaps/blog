import type { APIRoute } from "astro";

interface PostData {
    title: string;
    url?: string;
}

interface FilteredPostData extends PostData {
    url: string;
}

export const GET: APIRoute = async () => {
    const postIds = await fetch("https://hacker-news.firebaseio.com/v0/newstories.json").then(r => r.json()) as number[];
    const postPromises = postIds.map(async (id) => {
        return await fetch(`https://hacker-news.firebaseio.com/v0/item/${ id }.json`).then(r => r.json());
    }) as Promise<PostData>[];

    const posts = await Promise.all(postPromises).then(p => filter(p));
    const postsData = posts.map(post => {
        return {
            url: post.url,
            title: post.title,
            domain: new URL(post.url).hostname
        };
    });

    return new Response(
        JSON.stringify(postsData), { status: 200 }
    );
};

const filter = (posts: PostData[]) => {
    return posts.filter(post =>
        post.url
        && !(new URL(post.url).hostname === "twitter.com")) as FilteredPostData[];
};
