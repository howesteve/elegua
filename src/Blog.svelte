<script lang="ts">
	import type { Post } from './posts';
	export let posts: Post[];
</script>

<svelte:head>
	<title>Blog page</title>
</svelte:head>
<h1>Blog page</h1>
<p>This is a static route</p>

<h2>Posts</h2>
<p>These will be matched using dynamic routes, i.e. <code>/blog/:slug</code>:</p>
<ul>
	{#each posts as post}
		<li>{post.date.toLocaleDateString()} • <a href={'/blog/' + post.slug}>{post.slug}</a></li>
	{/each}
	<li>
		<b
			>{new Date().toLocaleDateString()} •
			<a href={'/blog/xxxx'}>Fake post - should open error message</a></b
		>
	</li>
</ul>

<style>
	li {
		list-style-type: none;
	}
</style>
