import { writable } from 'svelte/store';

export interface Post {
	slug: string;
	date: Date;
	title: string;
	contents: string;
}

export function fakePosts(count: number): Post[] {
	const res: Post[] = [];
	for (let i = 0; i < count; i++) {
		res.push({
			contents: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eget ligula eu lectus lobortis condimentum. Aliquam nonummy auctor massa. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Nulla at risus. Quisque purus magna, auctor et, sagittis ac, posuere eu, lectus. Nam mattis, felis ut adipiscing.`,
			date: new Date(new Date().getTime() - Math.random() * (356 * 24 * 60 * 1000)),
			title: `Fake post #${i}`,
			slug: `fake-post-${i}`
		});
	}
	return res;
}
export default writable(fakePosts(20));
