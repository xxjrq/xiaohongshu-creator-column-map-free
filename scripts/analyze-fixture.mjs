import { readFile } from 'node:fs/promises';

const input = JSON.parse(await readFile(process.argv[2], 'utf8'));
const maxNotes = Object.hasOwn(input, 'maxNotes') ? input.maxNotes : 10;
if (!Number.isInteger(maxNotes) || maxNotes < 1 || maxNotes > 10) throw new Error('maxNotes 必须是 1–10 的整数');
if (!Array.isArray(input.visible_notes)) throw new Error('visible_notes 必须是数组');
const notes = input.visible_notes.slice(0, maxNotes);
// A schedule lead-in (for example "周一" or "下班后") describes timing, not
// the column.  Classify the visible subject of this small offline fixture first.
// Unknown titles deliberately remain an explicit visible-subject bucket instead
// of being invented as a recurring topic.
const topicFor = title => {
  if (/(早餐|燕麦|酸奶|水果杯)/.test(title)) return '早餐';
  if (/(便当|备菜)/.test(title)) return '便当';
  if (/(晚餐|下班后|十五分钟|意面)/.test(title)) return '快手晚餐';
  return '其他可见主题';
};
const groups = new Map();
for (const note of notes) {
  if (!note.title || !note.url || !/^https:\/\//.test(note.url)) throw new Error('笔记缺少真实格式的可见标题或链接');
  const key = topicFor(note.title);
  const item = groups.get(key) || { theme: key, titles: [], formats: new Set(), links: [] };
  item.titles.push(note.title); item.formats.add(note.format || '未见'); item.links.push(note.url); groups.set(key, item);
}
const restricted = input.status === 'restricted';
const result = {
  fixture_notice: input.fixture_notice,
  collection_scope: `离线模拟资料；可见笔记 ${notes.length}/${maxNotes}`,
  requested_max_notes: maxNotes,
  sample_count: notes.length,
  limitation: restricted ? (input.reason || '主页受限') : (notes.length < maxNotes ? '样本不足：仅整理当前模拟的可见笔记' : '无'),
  columns: [...groups.values()].map(g => ({
    theme: g.theme,
    // A topic is "repeated" only when it occurs at least twice.  Keep both the
    // count and the visible titles so the result can be audited.
    repeated_topics: g.titles.length >= 2
      ? [{ topic: g.theme, count: g.titles.length, titles: g.titles }]
      : [],
    content_formats: [...g.formats],
    representative_link: g.links[0],
    sources: g.links
  }))
};
console.log(JSON.stringify(result, null, 2));
