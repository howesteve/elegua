<script lang="ts">
  import { params } from "$lib/Elegua.svelte";
  // List of tab items with labels, values and assigned components
</script>

<h1>Dynamic Params test</h1>
<p>This route was matched using RegExp: /dynamic/:id</p>
<p>Id value for this url is ($params[0]): {$params[0]}</p>
<p>If you change {$params[0]} in the url above, it will be reflected here as well</p>
