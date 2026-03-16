import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { SITE_TITLE, SITE_DESCRIPTION } from '../consts';

export const GET: APIRoute = async (context) => {
	const posts = (await getCollection('blog')).sort(
		(a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf(),
	);

	const lines = [
		`# ${SITE_TITLE}`,
		``,
		`> ${SITE_DESCRIPTION}`,
		``,
		`## Blog Posts`,
		...posts.map((post) => {
			const title = post.data.title || post.id.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
			const desc = post.data.description ? `: ${post.data.description}` : '';
			return `- [${title}](${new URL(`/blog/${post.id}/`, context.site)})${desc}`;
		}),
	];

	return new Response(lines.join('\n'), {
		headers: { 'Content-Type': 'text/plain; charset=utf-8' },
	});
};
