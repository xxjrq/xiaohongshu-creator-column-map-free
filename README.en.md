# Xiaohongshu Creator Column Map

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
