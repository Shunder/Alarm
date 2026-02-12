# Alarm（中文）

一个轻量、可上线的 Web 应用，提供 **时钟 / 闹钟 / 倒计时 / 计时器**，支持 PWA 与中英文界面切换。

## 功能
- 时钟、闹钟、倒计时、计时器、设置五个页面。
- **多闹钟**：支持启用/禁用、稍后提醒、列表化状态展示。
- **多倒计时**：每个倒计时可独立开始/暂停/继续/重置，列表展示状态。
- **多计时器**：每个计时器可独立操作并记录 lap，列表展示更清晰。
- 主题：深浅色 + 6 种主题色。
- 语言：English / 中文 切换。
- 本地持久化：`localStorage`。
- PWA：manifest + service worker。

## 运行
```bash
npm install
npm run dev
npm run build
npm run preview
```

## 浏览器限制说明
- 浏览器后台/锁屏时可能对定时器节流，导致闹钟/倒计时精度下降。
- 音频播放受自动播放策略影响，需用户先点击“测试声音”解锁。
- 若已授权通知权限，音频不可用时会使用通知提示。

## GitHub Pages 部署
- 工作流：`.github/workflows/deploy-pages.yml`
- 触发：`main` 分支 push 或手动触发。
- 仓库设置中将 Pages 来源设为 **GitHub Actions**。

## English README
- See: [`README.md`](./README.md)
