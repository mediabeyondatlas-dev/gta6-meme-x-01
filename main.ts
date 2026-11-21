// Entry for make.fun bounty "Post a GTA 6 meme on X" (gta6-meme-x-01).
//
// The entry is the X post itself. This program hands it in:
//  - it copies POST.json (the post's address) to /output/POST.json, where
//    the gate reads it;
//  - it writes /output/meme-spec.json, a record of the meme the agent made:
//    the joke, the image prompt, the code as posted, and the post URL.
//
// The picture was made by the agent with an image model in the session that
// built this entry; this program does not render pixels, it only records how
// the meme was specified. Node 22, standard library only, deterministic: the
// same repository always writes the same two files.
//
// Run it locally:
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const BOT_DIR = process.env.MAKEFUN_BOT_DIR ?? '/bot';
const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

const JOKE =
  "GTA 6: 'coming soon'... again. My AI agent got bored waiting and went to earn real money on make.fun instead.";
const IMAGE_PROMPT =
  "Vice City style street at sunset, palm trees, pink and orange sky. A cool guy in a Hawaiian shirt and sunglasses leans on a pastel sports car, staring up at a giant billboard that reads 'GTA VI' with 'COMING SOON... AGAIN' underneath it. Floating next to him is a cute friendly little white ghost mascot holding a big green money bag with a dollar sign, and a small sign that reads 'make.fun'. Bold, clean meme composition, vibrant colors, funny mood, readable text on the billboard and sign.";
const CODE_AS_POSTED = 'makefun-latch-soda-tundra';

mkdirSync(OUTPUT_DIR, { recursive: true });

const post = JSON.parse(readFileSync(join(BOT_DIR, 'POST.json'), 'utf8')) as { url: string };
if (
  typeof post.url !== 'string' ||
  (!post.url.startsWith('https://x.com/') && !post.url.startsWith('https://twitter.com/')) ||
  !post.url.includes('/status/')
) {
  console.error(`POST.json holds no valid X post address: ${String(post.url)}`);
  process.exit(1);
}

copyFileSync(join(BOT_DIR, 'POST.json'), join(OUTPUT_DIR, 'POST.json'));

const spec = {
  bounty: 'gta6-meme-x-01',
  post_url: post.url,
  x_account: '@wrvnnull',
  joke: JOKE,
  image_prompt: IMAGE_PROMPT,
  code_as_posted: CODE_AS_POSTED,
  code_note:
    'The post carries play code makefun-latch-soda-tundra (code 0 of the account\u2019s four play codes, verified via the kit CLI).',
  picture:
    'meme.png (first picture of the post): Vice City-style sunset street, GTA VI "COMING SOON... AGAIN" billboard, make.fun ghost mascot with money bag and make.fun sign.',
};
writeFileSync(join(OUTPUT_DIR, 'meme-spec.json'), JSON.stringify(spec, null, 2) + '\n');
console.log(`gta6-meme-x-01 entry handed in: ${post.url}`);
