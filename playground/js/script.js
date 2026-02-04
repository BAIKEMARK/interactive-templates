/**
 * script.js - 核心交互逻辑
 * 处理左侧手风琴折叠、右侧场景切换、以及响应式布局调整。
 */

// 当前激活的模块ID
let activeModuleId = 0;
// 右侧视图是否被最小化（用于响应式逻辑，可扩展）
let isVisualMinimized = false;

document.addEventListener('DOMContentLoaded', () => {
    // 初始化模块（默认第一个）
    selectModule(0);

    // 绑定窗口大小变化事件，保障响应式体验
    window.addEventListener('resize', handleResize);
    handleResize();
});

/**
 * 切换左侧模块，并更新右侧对应视图
 * @param {number} index 模块索引
 */
function selectModule(index) {
    // 1. 更新全局状态
    activeModuleId = index;

    // 2. 更新左侧手风琴 UI 状态
    // 关闭所有模块
    document.querySelectorAll('.module-item').forEach(item => {
        item.classList.remove('active');
        item.querySelector('.icon-circle').classList.remove('active-bg');
        item.querySelector('.icon-circle').classList.add('inactive-bg');
        item.querySelector('.module-title').classList.remove('active-text');
        item.querySelector('.module-title').classList.add('inactive-text');
        item.querySelector('.expand-icon').classList.remove('hidden');

        // 收起内容区域
        const content = item.querySelector('.module-content-wrapper');
        content.style.height = '0px';
        content.style.opacity = '0';
    });

    // 激活目标模块
    const targetItem = document.querySelector(`.module-item[data-id="${index}"]`);
    if (targetItem) {
        targetItem.classList.add('active');
        targetItem.querySelector('.icon-circle').classList.add('active-bg');
        targetItem.querySelector('.icon-circle').classList.remove('inactive-bg');
        targetItem.querySelector('.module-title').classList.add('active-text');
        targetItem.querySelector('.module-title').classList.remove('inactive-text');
        targetItem.querySelector('.expand-icon').classList.add('hidden');

        // 展开内容区域 (动态计算高度)
        const content = targetItem.querySelector('.module-content-wrapper');
        content.style.height = 'auto';
        // 简单处理：设为 auto 让浏览器计算，或者可以计算 scrollHeight 获得精确动画
        content.style.opacity = '1';
    }

    // 3. 更新右侧 Visual Container 显示内容
    updateVisualContent(index);
}

/**
 * 根据模块索引更新右侧显示内容
 */
function updateVisualContent(index) {
    const gameWrapper = document.getElementById('gameWrapper');
    const galleryWrapper = document.getElementById('galleryWrapper');
    const rulesWrapper = document.getElementById('rulesWrapper');

    // 先隐藏所有视图
    // 先隐藏所有视图
    if (gameWrapper) gameWrapper.style.display = 'none';
    if (galleryWrapper) galleryWrapper.style.display = 'none';
    if (rulesWrapper) rulesWrapper.style.display = 'none';

    // Also hide advanced effects wrapper if it exists (for switching between modules)
    const advEffects = document.getElementById('advancedEffectsWrapper');
    if (advEffects) advEffects.style.display = 'none';

    // 根据索引显示对应视图
    // 根据索引显示对应视图
    if (index === 0 || index === 1 || index === 2) {
        // Module 0 (UI), 1 (Visual), 2 (Overlays) all use the main Game Wrapper
        if (gameWrapper) gameWrapper.style.display = 'flex';
    } else if (index === 3) {
        const advEffects = document.getElementById('advancedEffectsWrapper');
        if (advEffects) advEffects.style.display = 'flex';

        // Init effects when this module is selected
        if (window.initComicViewer) window.initComicViewer();
        if (window.initTiltEffect) window.initTiltEffect();
    }
}

/**
 * 处理窗口 Resize
 */
function handleResize() {
    // 可在此处添加额外的响应式逻辑，如 canvas 重绘等
    const width = window.innerWidth;
    if (width < 768) {
        // 移动端逻辑...
    } else {
        // 桌面端逻辑...
    }
}
