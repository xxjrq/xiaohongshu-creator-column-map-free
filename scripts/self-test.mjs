import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
const root = resolve(import.meta.dirname, '..');
for (const file of ['SKILL.md','manifest.yaml','agents/openai.yaml','icon-512.png','fixtures/success/public-profile-visible.json','fixtures/failure/profile-restricted.json']) {
  if (!existsSync(resolve(root, file))) throw new Error(`缺少 ${file}`);
}
const run = f => JSON.parse(execFileSync(process.execPath, [resolve(root, 'scripts/analyze-fixture.mjs'), resolve(root, f)], { encoding: 'utf8' }));
const success = run('fixtures/success/public-profile-visible.json');
const failure = run('fixtures/failure/profile-restricted.json');
if (!success.fixture_notice.includes('离线') || !success.columns.every(x => x.sources.length)) throw new Error('成功 fixture 未生成可追溯栏目');
const byTheme = new Map(success.columns.map(column => [column.theme, column]));
for (const theme of ['早餐', '便当', '快手晚餐']) {
  if (!byTheme.has(theme)) throw new Error(`成功 fixture 未按内容主题生成栏目：缺少 ${theme}`);
}
if (byTheme.has('周一') || byTheme.has('一周') || byTheme.has('下班后')) throw new Error('成功 fixture 错把时间前缀当作栏目主题');
const breakfast = byTheme.get('早餐');
if (breakfast.repeated_topics.length !== 1 || breakfast.repeated_topics[0].count !== 2 || breakfast.repeated_topics[0].titles.length !== 2 || !breakfast.repeated_topics[0].titles.every(title => title.includes('早餐'))) {
  throw new Error('重复选题必须输出出现次数及对应题目');
}
for (const theme of ['便当', '快手晚餐']) {
  if (byTheme.get(theme).repeated_topics.length !== 0) throw new Error(`只出现一次的 ${theme} 不得写入 repeated_topics`);
}
if (!failure.limitation.includes('不可见') || failure.columns.length !== 0) throw new Error('失败 fixture 未保留受限状态');
const temp = mkdtempSync(resolve(tmpdir(), 'column-map-'));
try {
  const original = JSON.parse(readFileSync(resolve(root, 'fixtures/success/public-profile-visible.json'), 'utf8'));
  const inputFile = resolve(temp, 'input.json');
  const analyze = input => {
    writeFileSync(inputFile, JSON.stringify(input));
    return JSON.parse(execFileSync(process.execPath, [resolve(root, 'scripts/analyze-fixture.mjs'), inputFile], { encoding: 'utf8', stdio: ['ignore','pipe','pipe'] }));
  };
  for (const limit of [1, 2, 4]) {
    const result = analyze({ ...original, maxNotes: limit });
    const expectedLinks = original.visible_notes.slice(0, limit).map(note => note.url);
    const actualLinks = result.columns.flatMap(column => column.sources);
    if (result.sample_count !== limit || result.requested_max_notes !== limit || result.collection_scope !== `离线模拟资料；可见笔记 ${limit}/${limit}` || result.limitation !== '无') throw new Error('未按实际 maxNotes 输出范围或错误标为样本不足');
    if (actualLinks.length !== limit || actualLinks.some(link => !expectedLinks.includes(link))) throw new Error('越过用户笔记采集上限');
  }
  for (const invalid of [null, 0, 11, 1.5, '2', true]) {
    let rejected = false;
    try { analyze({ ...original, maxNotes: invalid }); } catch { rejected = true; }
    if (!rejected) throw new Error('非法 maxNotes 未被拒绝');
  }
} finally { rmSync(temp, { recursive: true, force: true }); }
const manifest = readFileSync(resolve(root, 'manifest.yaml'), 'utf8');
if (!manifest.includes('icon: icon-512.png') || !manifest.includes('self_test: node scripts/self-test.mjs')) throw new Error('manifest 不完整');
const version = manifest.match(/^version: (\d+\.\d+\.\d+)$/m)?.[1];
if (!version || JSON.parse(readFileSync(resolve(root, 'package.json'), 'utf8')).version !== version) throw new Error('manifest 与 package 语义化版本缺失或不一致');
console.log('PASS: 2 offline fixtures; content-topic columns and auditable repeated topics verified; restricted failure preserves limitation.');
