# 小红书账号栏目地图

把一个公开小红书主页的可见笔记，快速整理成可复核的「账号栏目地图」：你会得到栏目主题、重复选题、内容形式和代表链接，而不是泛泛的账号诊断或营销预测。

**输入**：用户指定的公开主页 URL、已连接的 `browserId`，以及可选的 1–10 篇笔记上限。  
**结果**：带真实来源链接、样本范围和缺项说明的 Markdown 草稿；主页受限或样本不足时如实标注，绝不推断私密数据。

![小红书账号栏目地图推广图](assets/promo-source.svg)

## 安装

```bash
npx skills add xxjrq/xiaohongshu-creator-column-map-free
```

## 使用方式

这是一个只读浏览器 Skill。请先安装并连接 [Easy WebBridge（GitHub 主下载）](https://github.com/xxjrq/easy-webbridge)；GitHub 访问不稳定时使用 [Gitee 备用地址](https://gitee.com/xxjrq/easy-webbridge)。安装后，由你明确提供目标 `browserId` 和公开主页 URL。

```text
使用 browserId <我指定的环境> 读取这个公开主页：<URL>。
最多整理 10 篇当前可见笔记，输出栏目主题、重复选题、内容形式和代表链接；只读，不要推断私密数据。
```

Skill 只在你指定的环境内工作：每次任务创建并复用自己的 session 标签组，不广播给全部账号，不接管已有页面；关闭时只关闭自己创建的组。出现登录、验证码或风控会暂停，不会尝试绕过。即使你另行授权草稿填充，也绝不会点击最终发布或发送。

## 交付示例

| 栏目主题 | 重复选题 | 内容形式 | 代表链接 |
| --- | --- | --- | --- |
| 早餐 | 出现 2 次：周一早餐：十分钟燕麦碗；周一早餐：酸奶水果杯 | 图文 | 实际可见笔记链接 |
| 快手晚餐 | 无（仅出现 1 次，不列为重复选题） | 视频 | 实际可见笔记链接 |

每条代表链接都来自当前可见页面。无法加载、不可见或没有足够样本时，交付会明确写出采集范围与缺项；不会把离线样例误写成线上结果。

## 本地自检

```bash
node scripts/self-test.mjs
```

自检使用仓库内的离线页面资料模拟，覆盖成功与主页受限两种情况，验证的是输出结构和缺项处理，**不代表在线采集或登录测试**。

## 来源与许可

业务用途参考 [OpenCLI](https://github.com/jackwener/OpenCLI) 和其 [小红书浏览器适配说明](https://github.com/jackwener/OpenCLI/blob/main/docs/adapters/browser/xiaohongshu.md)。本仓库没有复制其源码或说明文本；外部来源许可证以其原仓库为准。此仓库采用 [MIT License](LICENSE)。

English documentation: [README.en.md](README.en.md)

## 自定义采集数量

`maxNotes` 只接受 1–10 的整数，默认 10。用户指定 2 时最多读取 2 篇，结果范围为 `N/2`；已取得 2 篇不标样本不足。非法上限先报输入错误。离线脚本和自检覆盖 1/2/4 篇上限及超限、非整数输入，不代表在线验收。

可复制的 2 篇离线测试：[输入](fixtures/success/max-notes-2.json) → [脚本实际结果](fixtures/success/result-max-notes-2.json)。
