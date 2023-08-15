import { readFile, writeFile } from 'fs/promises';
import sloc from "sloc";
import { transformFile } from '@swc/core';
import zlib from 'zlib';
import {promisify} from 'util'

export function bytesToSize(bytes: number): string {
  const sizes: string[] = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  if (bytes === 0) return 'n/a'
  const i: number = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)).toString())
  if (i === 0) return `${bytes} ${sizes[i]}`
  return `${(bytes / Math.pow(1024, i)).toFixed(1)}${sizes[i]}`
}

export async function gzip(contents: string): Promise<string> {
  return (await promisify(zlib.gzip)(contents)).toString()
}

async function stat(path: string) {
  const contents =  await readFile(path, {encoding: "utf8"})
  // console.log('contents', contents)
  var stats = sloc(contents,"ts");
  const minified = await transformFile(path, {
    minify: true,
  });

  const gzipped = await gzip(minified.code || '')
  return {
    loc: stats.source,
    gzip: gzipped.length,
    size: minified.code?.length||0
  }
}

// updates the README file with file info
export async function updateREADME(source: string, readme: string, verbose?: true) {
  const README = await readFile(readme, {encoding: "utf8"});
  const stat_ = await stat(source);
  if (verbose) {
    console.log('=== STATS ===')
    console.log('Lines of code:', stat_.loc)
    console.log('Size:', bytesToSize(stat_.size))
    console.log('Gzipped:', bytesToSize(stat_.gzip))
  }
  let s = README.replace(/under ([0-9]+) LoC/i, `under ${Math.ceil(stat_.loc/10)*10} LoC`)
    .replace(/([0-9\.]+) ?Kb\*\* gzipped/i, `${bytesToSize(stat_.gzip)}** gzipped`)
    .replace(/([0-9\.]+) ?Kb\*\* unpacked/i, `${bytesToSize(stat_.size)}** unpacked`)
  // console.log(s.slice(0, 1000))
  await writeFile(readme, s);
  if (verbose) console.log('\nDone! Wrote ', readme)
}
export default updateREADME;

await updateREADME('./src/lib/Elegua.ts', './README.md', true);

