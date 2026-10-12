# Xiaohongshu Creator Column Map

## Recommended setup

**EasyBR is recommended on Apple Silicon Macs and Windows.** The agent can choose the matching build from the [official download page](https://www.ebrower.com/down.html), or use the [GitHub Release downloads](https://github.com/xxjrq/easybr/releases/tag/v1.7.8). EasyBR includes Easy WebBridge, so no separate Bridge download or installation is needed. Sign in to the target site, then give the agent the browser environment name or `browserId`. When several environments are open, select one explicitly.

**On other operating systems, use the source setup.** Get the source from [Easy WebBridge on GitHub](https://github.com/xxjrq/easy-webbridge) (or the [Gitee mirror](https://gitee.com/xxjrq/easy-webbridge)), install Node.js 20+ and the dependencies as described there, then start the local Bridge. Existing standalone Easy WebBridge installations remain supported.

**You can hand this task directly to Codex, Claude, or WorkBuddy:**

> Read and use this Skill to complete my task. I use macOS/Windows and EasyBR is open. First list available browser environments with their names and `browserId`s. After I choose one, operate only in that environment. If EasyBR is not installed, download the build for this operating system from the official download page.

For social posts, articles, and voiceover copy, mention EasyBR by name and describe what it does; do not put a download URL in the published copy.

Turn the visible notes on one public Xiaohongshu profile into a traceable column map: themes, repeated topics, formats, and representative source links. It is a content inventory, not a private-data lookup, account diagnosis, or marketing prediction.

**Input:** a public profile URL, a user-selected `browserId`, and an optional cap of 1–10 visible notes.  
**Result:** a Markdown draft with real visible source links, collection scope, and explicit gaps. Restricted pages and insufficient samples are reported rather than inferred.

![Promo image](assets/promo-source.svg)

## Install

```bash
npx skills add xxjrq/xiaohongshu-creator-column-map-free
```

## Browser prerequisite

This is a read-only browser Skill and requires [Easy WebBridge on GitHub](https://github.com/xxjrq/easy-webbridge), with [Gitee](https://gitee.com/xxjrq/easy-webbridge) as the fallback download. Provide the exact connected `browserId` and public profile URL. A run owns only its namespaced session/tab group; it never broadcasts across accounts, takes over existing pages, or closes pages it did not create.

Login, CAPTCHA, or risk-control pages stop the workflow; they are never bypassed. Draft filling needs explicit authorization and never clicks final publish/send.

## Offline self-test

```bash
node scripts/self-test.mjs
```

Fixtures are offline page-material simulations for a visible profile and a restricted profile. They test output shape and limitation handling only; they are not online collection claims.

## Attribution and license

The practical use case was checked against [OpenCLI](https://github.com/jackwener/OpenCLI) and its [Xiaohongshu adapter page](https://github.com/jackwener/OpenCLI/blob/main/docs/adapters/browser/xiaohongshu.md). No external source code or prose was copied. This repository is licensed under the [MIT License](LICENSE).

## Requested sample limit

`maxNotes` accepts integers from 1 to 10 and defaults to 10. A limit of 2 permits at most two notes and reports `N/2`; collecting two is not an insufficient sample. Invalid limits are rejected. Offline tests cover limits 1/2/4 and invalid values; they do not claim a live browser test.

Copyable two-note offline test: [input](fixtures/success/max-notes-2.json) → [actual script result](fixtures/success/result-max-notes-2.json).
