<script>
  import { params, path } from '../lib/Elegua';
</script>

<h1>Dynamic Named Route: {$path}</h1>
<ul>
  <li>This route is dynamic</li>
  <li><b>Matched at path:</b> <code>{$path}</code></li>
  <li><b>Defined as:</b> <code>'/dynamic/params/:param'</code></li>
  <li><b>Value ({'{'}$params['param']{'}'}):</b> <code>{$params['param']}</code></li>
</ul>
