---
name: xiaohongshu-creator-column-map-free
description: 使用用户明确指定的 Easy WebBridge browserId 与公开小红书主页，读取至多10篇当前可见笔记，制作含栏目主题、重复选题、内容形式、代表链接和缺项的可追溯栏目地图草稿。适用于账号内容盘点；主页受限、登录验证或样本不足时停止采集并标注已见范围，不推断任何私密数据。
---

# 小红书账号栏目地图

把公开主页中**当前可见**的笔记整理成可复核的栏目地图。输入是用户指定的公开主页 URL 和 `browserId`；结果是最多 10 篇笔记的栏目主题、重复选题、内容形式、代表链接、来源与缺项。它不做账号诊断、营销预测或私密数据推断。

## 前置依赖

这是浏览器类 Skill，需安装并连接 [Easy WebBridge](https://github.com/xxjrq/easy-webbridge)；GitHub 下载不可用时使用 [Gitee 备用地址](https://gitee.com/xxjrq/easy-webbridge)。仅使用用户给出的 `browserId`，不得广播到其他环境。

## 输入

- `browserId`：用户指定且已连接的 Easy WebBridge 环境。
- `profileUrl`：一个公开小红书主页 URL。
- 可选 `maxNotes`：1–10 的整数，默认 10。非整数或超出范围时先指出输入错误，不能偷偷改成 10。
- 可选 `draftFillAuthorization`：只有用户明确授权填充草稿时才可填写；始终禁止点击最终发布或发送。

## 执行

1. 先运行 `node /path/to/easy-webbridge/cli/easy-webbridge.mjs --help`，再以用户指定的 `browserId` 建立仅属于本次任务的 session：`xiaohongshu-creator-column-map-free-<run-id>`。不得接管或关闭已有页面；关闭前核对 session 所有权。
2. 用该 session 打开 `profileUrl`，只读取网页可见内容。每次快照显式使用 `snapshot <browserId> <tabId> --text-mode page`，并在页面跳转、滚动或 refs 过期后刷新快照。
3. 首次读取前确认本次 `maxNotes`（未提供时为 10），最多记录 `maxNotes` 篇可见笔记的标题/可见主题、可见形式线索和实际链接；达到上限就停止，不继续打开或采集其他笔记。每一条都保留原始链接；不把演示样例当成在线采集结果。
4. 依标题与可见正文线索归并内容主题，不把“周一”“一周”“下班后”等时间前缀当栏目。仅将出现至少两次的选题列为重复选题，并写明出现次数及对应题目；样本超过边界时分批处理，表格最多 100 行；不能假装读完未见内容。
5. 遇到登录、验证码、风控或主页不可见，立刻停止相应读取，交付已见范围与缺项。样本数少于用户本次指定的 `maxNotes` 时标注实际不足；如果用户指定 2 篇且已经取得 2 篇，不能因为未达到 10 篇而标样本不足。不得绕过限制。

## 输出模板

```markdown
# 账号栏目地图（草稿）
采集范围：公开主页；可见笔记 N/<本次maxNotes>；采集时间：<时间>
限制：<无 / 主页受限 / 加载中断 / 样本不足>

| 栏目主题 | 重复选题 | 内容形式 | 代表链接 | 来源与证据 |
| --- | --- | --- | --- | --- |
| <主题> | <出现次数及题目> | <图文/视频等可见线索> | <实际公开链接> | <可见标题或摘要> |

## 缺项与不确定项
- <未见内容、受限页面或无法确认字段>
```

最终关闭时只执行自己创建的 session。默认只读；即便用户授权草稿填充，也只能停在提交前。

## 离线校验

`node scripts/self-test.mjs` 仅验证离线页面资料模拟的成功和失败 fixture 及输出结构，不代表在线采集或账号登录测试。

## 来源与许可

业务使用方式仅参考 [OpenCLI](https://github.com/jackwener/OpenCLI) 及其 [小红书适配说明](https://github.com/jackwener/OpenCLI/blob/main/docs/adapters/browser/xiaohongshu.md)；本 Skill 的说明、流程与示例为原创，未复制其代码或文本。来源许可证以原仓库为准。
