<script lang="ts">
	import type { Post } from './posts';
	import {state} from "./lib/Elegua"
	export let posts: Post[];

	if($state.inputValue === undefined) {
		$state.inputValue = ""
	}
</script>

<svelte:head>
	<title>Blog page</title>
</svelte:head>
<h1>Blog page</h1>
<p>This is a static route</p>

<p>State only for this page</p>
<input bind:value={$state.inputValue}/>

<h2>Posts</h2>
<p>These will be matched using named routes, i.e. <code>/blog/:slug</code>:</p>
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
