# 燃厚蛋糕 B端管理系统

> **项目代号**：Ranhou-BMS（B端管理系统）
> **版本**：v1.0.0

面向烘焙连锁品牌的智能经营管理平台，以 AI 问答为核心交互方式，为管理者提供决策支持。

## 技术栈

- **前端框架**：React 18 + TypeScript
- **构建工具**：Vite
- **样式**：Tailwind CSS
- **路由**：React Router v6
- **状态管理**：Zustand
- **图表**：ECharts
- **图标**：Lucide React

## 项目结构

```
src/
├── components/     # 通用组件
├── pages/         # 页面组件
├── store/         # 状态管理
├── lib/           # 工具函数
├── data/          # 静态数据
└── App.tsx        # 应用入口
```

## 快速开始

### 环境要求

- Node.js >= 18
- npm / pnpm / yarn

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

访问 http://localhost:5173

### 构建生产版本

```bash
npm run build
```

### 预览生产构建

```bash
npm run preview
```

## 功能模块

- [ ] 数据看板
- [ ] AI 智能问答
- [ ] 预警提醒
- [ ] 地理数据洞察
- [ ] 门店管理

> ⚠️ 项目正在开发中，部分功能待实现

## 许可证

MIT
