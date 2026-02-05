# Master Template: AI Usage Guide

**Target Audience:** AI Agents (Claude, GPT-4, Gemini) & Developers
**Purpose:** This directory serves as the **Base Scaffold** for creating new Interactive Encyclopedia entries. DO NOT modify this template directly. Instead, copy this entire folder to a new location (e.g., `projects/my-new-topic`) and fill in the "Slots".

## 🏗 Template Architecture

The template uses a responsive, mobile-first Grid layout with a sticky header and three primary sections (Accordion Panels).

### File Structure
```text
my-new-topic/
├── index.html          # ENTRY POINT: Contains the DOM structure and content slots.
├── css/
│   └── style.css       # GLOBAL STYLES: Apple-style accordion, typography, grids.
├── js/
│   ├── script.js       # CORE LOGIC: Accordion switching, event initialization.
│   ├── game.js         # SLOT: GAME LOGIC (Canvas/Three.js code goes here).
│   ├── gallery.js      # SLOT: GALLERY LOGIC (Lightbox, Tilt effects).
│   └── snow-effect.js  # OPTIONAL: Particle effects.
└── assets/             # Place images, videos, sprites here.
```

---

## 🧩 Integration Slots (Fill-in-the-Blanks)

### Slot 1: Hero / Game Canvas (`index.html` > `#game-panel`)
This is the default view. It contains a `<canvas>` element for interactive simulations.

*   **Action**: Locate the `<!-- SLOT: GAME CANVAS -->` comment in `index.html`.
*   **JS target**: `js/game.js`.
*   **Key Function**: `initGame()` inside `game.js`. This is called when the page loads.
*   **Pattern**:
    ```javascript
    // js/game.js
    function initGame() {
        const canvas = document.getElementById('gameCanvas');
        const ctx = canvas.getContext('2d');
        // ... Your Game Loop Here ...
    }
    ```

### Slot 2: Gallery / Equipment (`index.html` > `#gallery-panel`)
A CSS Grid layout for displaying static assets, 3D cards, or diagrams.

*   **Action**: Locate `<!-- SLOT: GALLERY GRID -->`. Replace the placeholder `.gallery-item` divs with your project's cards.
*   **Style**: Use `.gallery-item` for standard cards. Add `.span-2` for wide cards.
*   **Interactivity**: `js/gallery.js` handles Lightbox and Tilt effects automatically for items with specific classes.

### Slot 3: Rules / Knowledge (`index.html` > `#rules-panel`)
A text-heavy section for documentation, rules, or history.

*   **Action**: Locate `<!-- SLOT: RULES CONTENT -->`.
*   **Formatting**: Use standard HTML (`<h2>`, `<p>`, `<ul>`, `<div class="rule-card">`).

---

## 🎨 Styling Guide

The template relies on `css/style.css`.
*   **Do NOT rewrite the logical CSS** (Accordion, Navigation) unless necessary.
*   **DO customize**:
    *   `--primary-color`: Change in `:root` to match the project theme.
    *   `.game-container`: Add specific background images or gradients for the canvas container.

## ⚡ Quick Start Command for AI

When asked to "Create a new project based on the template":

1.  **Copy** `interactive-templates/master-template` to `projects/[project-name]`.
2.  **Read** `playground` components if you need specific UI elements (Buttons, Toggles).
3.  **Inject** your specific game code into `js/game.js`.
4.  **Populate** `index.html` slots with project-specific text and images.
5.  **Verify** `initGame()` is called correctly in `js/script.js`.

---
---

# 通用模板：AI 使用指南 (中文版)

**目标读者**：AI 智能体 (Claude, GPT-4, Gemini) 及 开发者
**用途**：此目录是创建新“交互式百科条目”的**基础脚手架**。请勿直接修改此模板。请将整个文件夹复制到新位置（例如 `projects/my-new-topic`），然后填充其中的“插槽 (Slots)”。

## 🏗 模板架构

该模板使用响应式、移动优先的网格布局，带有置顶标题栏和三个主要部分（手风琴面板）。

### 文件结构
```text
my-new-topic/
├── index.html          # 入口文件：包含 DOM 结构和内容插槽。
├── css/
│   └── style.css       # 全局样式：Apple 风格手风琴、排版、网格。
├── js/
│   ├── script.js       # 核心逻辑：手风琴切换、事件初始化。
│   ├── game.js         # 插槽：游戏逻辑 (Canvas/Three.js 代码放这里)。
│   ├── gallery.js      # 插槽：画廊逻辑 (灯箱、倾斜效果)。
│   └── snow-effect.js  # 可选：粒子特效。
└── assets/             # 存放图片、视频、精灵图的位置。
```

---

## 🧩 集成插槽 (填空题)

### 插槽 1: 主视觉 / 游戏画布 (`index.html` > `#game-panel`)
这是默认视图。包含一个用于交互式模拟的 `<canvas>` 元素。

*   **操作**: 在 `index.html` 中找到 `<!-- SLOT: GAME CANVAS -->` 注释。
*   **JS 目标**: `js/game.js`。
*   **核心函数**: `game.js` 中的 `initGame()`。页面加载时会自动调用此函数。
*   **模式**:
    ```javascript
    // js/game.js
    function initGame() {
        const canvas = document.getElementById('gameCanvas');
        const ctx = canvas.getContext('2d');
        // ... 在这里编写游戏循环 ...
    }
    ```

### 插槽 2: 画廊 / 装备展示 (`index.html` > `#gallery-panel`)
用于展示静态资源、3D 卡片或图表的 CSS 网格布局。

*   **操作**: 找到 `<!-- SLOT: GALLERY GRID -->`。将占位符 `.gallery-item` 替换为您的项目卡片。
*   **样式**: 标准卡片使用 `.gallery-item`。宽卡片添加 `.span-2`。
*   **交互**: `js/gallery.js` 会自动处理具有特定类名的项目的灯箱（Lightbox）和 3D 倾斜（Tilt）效果。

### 插槽 3: 规则 / 知识库 (`index.html` > `#rules-panel`)
文本密集型区域，用于文档、规则或历史介绍。

*   **操作**: 找到 `<!-- SLOT: RULES CONTENT -->`。
*   **格式**: 使用标准 HTML (`<h2>`, `<p>`, `<ul>`, `<div class="rule-card">`)。

---

## 🎨 样式指南

模板依赖 `css/style.css`。
*   **不要重写逻辑 CSS**（如手风琴、导航），除非必要。
*   **可以自定义**:
    *   `--primary-color`: 在 `:root` 中修改以匹配项目主题。
    *   `.game-container`: 为画布容器添加特定的背景图片或渐变。

## ⚡ AI 快速启动指令

当被要求“基于模板创建一个新项目”时：

1.  **复制** `interactive-templates/master-template` 到 `projects/[项目名称]`。
2.  **阅读** `playground` 组件库，如果需要特定的 UI 元素（按钮、开关）。
3.  **注入** 您的特定游戏代码到 `js/game.js`。
4.  **填充** `index.html` 插槽中的项目特定文本和图片。
5.  **验证** `js/script.js` 中是否正确调用了 `initGame()`。
