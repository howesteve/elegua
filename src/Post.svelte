<script lang="ts">
  import { get } from 'svelte/store';
  import { params } from './lib/Elegua';
  import posts from './posts';
  export let id = '';
  const r = get(posts).filter((x) => x.slug === id);
  const post = r ? r[0] : undefined;
</script>

<div class="post">
  <p>This was load using a named param:</p>
  <code>{`{#if resolve($path, '/blog/:post')}`}</code>
  <br><code>{`<Post id={$params['post']}`}</code>
  {#if post}
    <h2>{post.slug}</h2>
    <b>$params: {JSON.stringify($params)}</b>
    <p>{post.date.toLocaleString()}</p>
    <div>{post.contents}</div>
  {:else}
    Post "<code>{id}</code>"" not found.
  {/if}
</div>

<style>
  .post {
    border-radius: 0.5em;
    border-color: dimgray;
  }
</style>
