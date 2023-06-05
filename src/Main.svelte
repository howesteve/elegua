<script lang="ts">
	import Router, { path, url, hash, params, searchParams } from './lib/Elegua.svelte';
	import Home from './Home.svelte';
	import About from './About.svelte';
	import OldBlog from './OldBlog.svelte';
	import Blog from './Blog.svelte';
	import posts from './posts';
	import Post from './Post.svelte';
	import Error from './Error.svelte';
	import FileSystem from './FileSystem.svelte';
	import { onMount } from 'svelte';
	import Hash from './Hash.svelte';
	import SearchParams from './SearchParams.svelte';

	let staticPages: Array<{ path: string; html: () => Promise<string> }> = [];
	// static routes
</script>

<header>
	<nav>
		<ul id="menu">
			<li><a href="/" class:selected={$path === '/'}>Home</a></li>
			<li><a href="/blog" class:selected={$path === '/blog'}>Blog</a></li>
			<li>
				<a href="/old_blog" class:selected={$path === '/old_blog'}>Old blog (redirect example)</a>
			</li>
			<li><a href="/hash" class:selected={$path === '/hash'}>Hash demo</a></li>
			<li><a href="/searchparams" class:selected={$path === '/searchparams'}>Search Params</a></li>
			<li><a href="/filesystem" class:selected={$path === '/filesystem'}>Static files</a></li>
			<li><a href="/about" class:selected={$path === '/about'}>About</a></li>
		</ul>
	</nav>
</header>

<main>
	<!-- Fixed route -->
	<Router route="/">
		<Home />
	</Router>
	<!-- Fixed route -->
	<Router route="/about">
		<About />
	</Router>
	<!-- Fixed route -->
	<Router route="/blog">
		<Blog posts={$posts} />
	</Router>
	<!-- Posts -->
	<Router route="/blog/:post">
		<Post id={$params['post']} />
	</Router>
	<!-- Fixed route; redirect example -->
	<Router route="/old_blog">
		<OldBlog />
	</Router>
	<!-- Hash routing -->
	<Router route="/hash">
		<Hash />
	</Router>
	<Router route="/searchparams">
		<SearchParams />
	</Router>
	<!-- Filesystem routing -->
	<Router route="/filesystem">
		<FileSystem pages={staticPages} />
	</Router>
	<!-- Fallback route - will be displayed if nithing else matches -->
	<Router route="*">
		<Error />
	</Router>
</main>

<footer>
	<h2>Router stores</h2>
	<ul>
		<li><b>Current full url ($url.toString()):</b> {$url}</li>
		<li><b>Current path ($path):</b> {$path}</li>
		<li><b>Current hash ($hash):</b> {$hash}</li>
		<li>
			<b>Current searchParams ($searchParams.entries):</b>
			{JSON.stringify(Object.fromEntries([...$searchParams.entries()]))}
		</li>
	</ul>
	<p>History backward/forward should be working all the time.</p>
</footer>

<style>
	:root {
		font-family: 'Roboto', sans-serif;
	}
	a {
		text-decoration: none;
	}
	a:hover {
		text-decoration: underline;
	}
	a:visited {
		color: inherit;
	}
	.selected {
		font-weight: bolder;
	}
	ul#menu li {
		display: inline;
		margin-right: 1em;
	}
	header {
		font-size: large;
	}
	footer {
		margin-top: 2em;
		box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
		padding-top: 1em;
		background-color: lightgrey;
		border-radius: 0.5em;
		padding-top: 0.2em;
		padding-left: 1em;
		padding-right: 1em;
		padding-bottom: 1em;
	}
</style>
