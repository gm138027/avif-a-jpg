# AVIF → JPG/PNG Converter

这是一个基于 Next.js 的多语言在线工具，帮你把 AVIF 图片批量转换成 JPG 或 PNG，支持预打包 ZIP 下载，并内置 Google Analytics 事件追踪。

## 功能亮点

- **批量转换**：一次上传多张 AVIF，自动队列处理并显示进度。
- **即时下载**：完成后可单张下载，或使用预打包 ZIP 一键获取全部文件。
- **多语言支持**：默认西班牙语，同时提供英语、法语（基于 next-i18next）。
- **使用分析**：埋点记录上传、转换、下载、语言切换等核心行为，方便监控使用情况。

## 环境要求

- Node.js 18 或以上
- npm（或你偏好的包管理器）

## 开发方式

```bash
npm install       # 安装依赖
npm run dev       # 启动开发服务器 (http://localhost:3000)
```

## 构建与部署

```bash
npm run build     # 生成产物
npm start         # 以生产模式运行
```

## 代码质量

```bash
npm run lint      # 运行 ESLint
npm test         # 运行 Vitest 单元测试
```

当前测试覆盖的核心模块：
- `AppState`：全局视图/模式管理
- `ImageManager`：上传队列与资源释放
- `ConversionManager`：单/批量转换、ZIP 预打包事件
- `DownloadService`：单文件、批量、ZIP 下载与环境校验

## 目录速览

```
components/    页面级与复用组件（MainContainer、Header、DownloadActions 等）
core/          业务核心（转换、下载、错误处理、状态管理）
hooks/         React 适配层，连接 UI 与 core 逻辑
pages/         Next.js 页面（首页、隐私政策、条款、联系我们）
public/        静态资源、SVG 图标、多语言文案
styles/        全局与组件级样式
tests/         Vitest 测试用例
```

## 国际化说明

- 配置见 `next-i18next.config.js`
- 语言资源位于 `public/locales/{es,en,fr}`
- `MultilingualSEO` 组件会自动生成 hreflang 标签

## 分析埋点

- GA ID：`G-4GDFBNVZWK`
- 事件封装在 `utils/analytics.js`，涵盖语言切换、上传、转换、下载。
- `_document.js` 注入必要的 GA 脚本。

## 常见问题

- **支持哪些输入？** 目前仅支持 `image/avif` 类型或 `.avif` 后缀的文件。
- **如何扩展更多格式？** 可在 `ImageConverter` / `ConversionManager` 中添加新格式并同步 UI。
- **为什么会提示浏览器阻止多个下载？** 当批量触发多个下载时，浏览器可能拦截，这是预期提示。

欢迎根据你的使用场景继续扩展功能或补充更多文档 🙌
