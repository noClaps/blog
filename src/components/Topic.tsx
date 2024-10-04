import { getCollection } from "../../scripts/utils.ts";
import Link from "./Link";

export default async function Topic(section: string) {
	const posts = await getCollection("posts").then((posts) => {
		return posts.sort((a, b) => {
			if (a.series && b.series) {
				if (a.series > b.series) return 1;
				if (a.series < b.series) return -1;
				return 0;
			}

			const aDate = a.lastmod ?? a.date;
			const bDate = b.lastmod ?? b.date;

			if (aDate > bDate) return -1;
			if (aDate < bDate) return 1;
			return 0;
		});
	});

	return (
		<div class="topic">
			<h2>{section.charAt(0).toUpperCase() + section.slice(1)}</h2>
			<div class="posts">
				{section !== "tech" ? (
					<section>
						{posts.map((post) =>
							post.slug.startsWith(section) ? (
								<Link
									title={post.title}
									description={post.description}
									href={post.slug}
									date={post.lastmod ?? post.date}
									author={post.author.name}
								/>
							) : (
								""
							),
						)}
					</section>
				) : (
					""
				)}
				{section === "tech" ? (
					<>
						<section>
							{posts.map((post) =>
								post.slug.startsWith("tech") &&
								!post.slug.startsWith("tech/psa") &&
								!post.slug.startsWith("tech/inside-e2ee") ? (
									<Link
										title={post.title}
										description={post.description}
										href={post.slug}
										date={post.lastmod ?? post.date}
										author={post.author.name}
									/>
								) : (
									""
								),
							)}
						</section>
						<h3>Inside E2EE</h3>
						<section>
							<div class="links">
								{posts.map((post) =>
									post.slug.startsWith("tech/inside-e2ee") ? (
										<Link
											title={post.title}
											description={post.description}
											href={post.slug}
											date={post.lastmod ?? post.date}
											author={post.author.name}
										/>
									) : (
										""
									),
								)}
							</div>
						</section>
						<h3>Privacy, Security and Anonymity</h3>
						<section>
							<div class="links">
								{posts.map((post) =>
									post.slug.startsWith("tech/psa") ? (
										<Link
											title={post.title}
											description={post.description}
											href={post.slug}
											date={post.lastmod ?? post.date}
											author={post.author.name}
										/>
									) : (
										""
									),
								)}
							</div>
						</section>
					</>
				) : (
					""
				)}
			</div>
		</div>
	);
}
