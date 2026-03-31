# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

- **Stack**: Vite + React 19 + TypeScript
- **Package manager**: Yarn 4.12.0 (with `node-modules` linker)
- **Routing**: React Router v7
- **Icons**: Lucide React
- **ESLint**: Flat config style (`eslint.config.js`)

## Commands

```bash
yarn install        # 安装依赖
yarn dev            # 启动开发服务器 (http://localhost:5173)
yarn build          # 构建生产版本 (tsc -b && vite build)
yarn preview        # 预览生产构建
yarn lint           # 运行 ESLint
```

## Architecture

```
src/
  types/crop.ts      # 作物数据类型定义
  data/crops.ts      # 作物 Mock 数据（8种作物）
  components/
    Navbar.tsx       # 顶部导航栏
    CropCard.tsx     # 作物卡片组件
    GrowthTimeline.tsx # 生长周期时间轴
    CareGuide.tsx    # 种植要求卡片
    HabitInfo.tsx    # 生长习性展示
  pages/
    Home.tsx         # 首页（作物列表 + 搜索 + 筛选）
    CropDetail.tsx   # 作物详情页
  App.tsx            # 路由配置
  index.css          # 全局样式（CSS 变量）
  App.css            # 组件样式
```

## Key Decisions

- 使用静态 Mock 数据（`src/data/crops.ts`），无需后端即可运行
- 生长周期用垂直时间轴展示，每阶段配图和说明
- 作物分类：蔬菜、粮食、水果、花卉
