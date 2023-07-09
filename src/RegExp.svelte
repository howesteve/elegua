<script lang="ts">
  import { path, resolve } from './lib/Elegua';
</script>

<h1>RegExp routing</h1>

<button on:click|preventDefault={() => path.set('/users/' + Math.floor(Math.random() * 1000).toString())}
  >/users/random()</button
> <b>/users\/([0-9]+)/:</b>
<br /><button on:click|preventDefault={() => $path = '/authors/1'}>/authors/1</button>
<b>/authors\/([a-zA-Z\ 0-9]+)/</b>
<style>
</style>
