---
name: AI 助手富文本支持（Markdown 渲染）
overview: 在 AI 助手中引入 Markdown 渲染支持，将 `###`、`**`、`-` 等符号转换为样式丰富的富文本。
todos:
  - id: install-deps
    content: 修改 package.json 添加 react-markdown 和 remark-gfm 依赖
    status: completed
  - id: create-renderer
    content: 新建 src/components/common/MarkdownRenderer.tsx 并配置 Tailwind 样式
    status: completed
    dependencies:
      - install-deps
  - id: update-dashboard-ai
    content: 在 DashboardAIChat.tsx 中引入并使用 MarkdownRenderer 渲染消息内容
    status: completed
    dependencies:
      - create-renderer
  - id: update-assistant-page
    content: 在 AIAssistant.tsx 中引入并使用 MarkdownRenderer 渲染对话流
    status: completed
    dependencies:
      - create-renderer
---

## 用户需求

用户希望将首页及 AI 助手页面的 AI 回复内容从纯文本显示升级为富文本显示，将 Markdown 符号（如标题 `###`、加粗 `**`、列表 `-` 等）渲染为对应的视觉样式，提升阅读体验。

## 核心功能

- **Markdown 渲染**：将 AI 返回的字符串按照 Markdown 规格解析并渲染。
- **视觉样式优化**：为不同级别的标题、加粗文字、列表项目、代码块等提供符合项目整体风格（职场漫画风/现代简约）的 Tailwind CSS 样式。
- **流式兼容**：确保在流式输出过程中，Markdown 能够动态增量渲染，不会出现布局闪烁。

## 视觉效果

- **标题**：更大的字号，加粗，适当的上下间距。
- **加粗**：显眼的颜色或更重的字重。
- **列表**：带有缩进和符号（圆点或数字）的排列。
- **分隔线**：浅灰色的水平线。

## 技术方案

- **Markdown 解析库**：使用 `react-markdown` 作为核心解析引擎，配合 `remark-gfm` 插件支持更丰富的 Markdown 语法（如表格、任务列表）。
- **样式方案**：通过 `react-markdown` 的 `components` 属性，为 HTML 标签（h1-h6, p, ul, ol, li, strong等）注入 Tailwind CSS 类名，实现自定义主题样式。
- **组件封装**：创建一个通用的 `MarkdownRenderer` 组件，统一管理 Markdown 的渲染逻辑和样式配置，提高复用性。

## 实现细节

### 关键组件定义

- **MarkdownRenderer**:
- 输入：`content` (string)
- 处理：调用 `ReactMarkdown` 并配置 `remarkGfm`。
- 样式：针对不同标签定义类名，例如 `h3` 使用 `text-base font-bold my-2`，`strong` 使用 `text-primary-600 font-semibold`。

### 目录结构变动

```
src/
├── components/
│   ├── common/
│   │   └── MarkdownRenderer.tsx  # [NEW] 通用 Markdown 渲染组件
│   └── dashboard/
│       └── DashboardAIChat.tsx   # [MODIFY] 替换原有的文本显示逻辑
└── pages/
    └── AIAssistant.tsx           # [MODIFY] 替换原有的文本显示逻辑
```