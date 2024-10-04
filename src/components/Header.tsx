import { Rss } from "lucide-static";

export default function Header() {
	return (
		<header>
			<div></div>
			<a class="feed" href="/feed" title="Feed">
				{Rss}
			</a>
		</header>
	);
}
