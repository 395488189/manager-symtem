# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

医疗后台管理系统（Vue 3 练习项目），用于展示前端开发能力。

## 常用命令

```bash
npm run dev      # 启动开发服务器 (localhost:5173)
npm run build    # 构建生产版本
npm run preview # 预览生产构建
```

## 技术栈

- **前端框架**: Vue 3 + TypeScript + Vite
- **UI 组件库**: Element Plus
- **图表**: ECharts
- **路由**: Vue Router 4
- **包管理**: pnpm (node_modules 使用 pnpm-lock.yaml)

## 项目结构

```
src/
├── layouts/          # 页面布局组件
│   └── DefaultLayout.vue   # 主布局（侧边栏 + 头部）
├── views/            # 页面组件
│   ├── Dashboard.vue        # 数据可视化（ECharts）
│   ├── Patient/             # 患者管理模块
│   ├── Doctor/              # 医生管理模块
│   ├── Appointment/         # 预约管理模块
│   ├── Department/          # 科室管理模块
│   ├── Medicine/            # 药品管理模块
│   ├── Charge/              # 收费管理模块
│   ├── User/                # 用户管理模块
│   ├── Log/                 # 操作日志模块
│   └── MedicalRecord/       # 就诊记录模块
├── router/           # 路由配置
│   └── index.ts             # 所有路由定义
├── components/        # 通用组件
│   └── DoctorCard.vue       # 医生卡片组件
└── main.ts           # 应用入口
```

## 路由说明

所有业务页面都在 `/` 布局下，通过 `DefaultLayout.vue` 的侧边栏导航：
- `/dashboard` - 数据可视化
- `/patients` - 患者列表
- `/records` - 就诊记录
- `/doctor` - 医生管理
- `/appointments` - 预约管理
- `/departments` - 科室管理
- `/medicines` - 药品管理
- `/charges` - 收费管理
- `/users` - 用户管理
- `/logs` - 操作日志
- `/login` - 登录页（独立布局）

## 开发约定

- 页面组件放在 `src/views/` 对应模块目录下
- 复用组件放在 `src/components/` 目录
- Mock 数据直接写在组件内（后续可抽离到 `src/api/mock.ts`）
- Element Plus 图标从 `@element-plus/icons-vue` 导入

## 后续扩展方向

- 接入后端 API（推荐 FastAPI + MySQL）
- 部署上线（Vercel 前端 + Railway 后端）
- 接入 AI 医疗助手（智谱 GLM / 文心一言 API）
