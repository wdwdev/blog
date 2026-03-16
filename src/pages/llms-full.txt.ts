import type { APIRoute } from 'astro';
import { getCollection, render } from 'astro:content';
import { SITE_TITLE, SITE_DESCRIPTION } from '../consts';

export const GET: APIRoute = async () => {
	const posts = (await getCollection('blog')).sort(
		(a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf(),
	);

	const sections = await Promise.all(
		posts.map(async (post) => {
			const title = post.data.title || post.id.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
			const date = post.data.pubDate.toISOString().split('T')[0];
			return `## ${title}\n\n*${date}*\n\n${post.body}`;
		}),
	);

	const content = [
		`# ${SITE_TITLE}`,
		``,
		`> ${SITE_DESCRIPTION}`,
		``,
		...sections,
	].join('\n\n');

	return new Response(content, {
		headers: { 'Content-Type': 'text/plain; charset=utf-8' },
	});
};
