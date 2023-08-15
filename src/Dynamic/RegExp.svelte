<script>
  import { path, match } from '../lib/Elegua';
</script>

<h1>Dynamic RegExp: {$path}</h1>
<ul>
  <li>This route is dynamic</li>
  <li><b>Matched at path:</b> <code>{$path}</code></li>
  <li><b>Defined as:</b> <code>{'{'}/dynamic\/re[0-9]+/{'}'}</code></li>
  <li><b>Value ($match[1]):</b> <code>{$match && $match[1]}</code></li>
</ul>
