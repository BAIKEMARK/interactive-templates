/**
 * gallery.js - 图鉴展示逻辑
 * 负责渲染左侧列表，并处理点击切换图片。
 */

// 示例数据配置
const galleryData = [
    {
        id: 'item1',
        title: '示例项目 1',
        desc: '这是一个示例项目的描述。你可以用它来展示角色、装备或者任何收藏品。',
        image: 'assets/ui/baidu.png', // 默认占位
        colorClass: 'active-bg' // 对应 CSS 颜色类
    },
    {
        id: 'item2',
        title: '示例项目 2',
        desc: '第二个示例项目。保持图片清晰，文字简洁。',
        image: '',
        colorClass: 'inactive-bg'
    }
];

document.addEventListener('DOMContentLoaded', () => {
    initGalleryList();
});

/**
 * 初始化渲染左侧列表
 */
function initGalleryList() {
    const listContainer = document.getElementById('galleryList');
    if (!listContainer) return;

    listContainer.innerHTML = ''; // 清空

    galleryData.forEach((item, index) => {
        const div = document.createElement('div');
        div.className = 'eq-item';
        // 默认选中第一个
        if (index === 0) div.classList.add('active');

        div.onclick = (e) => {
            e.stopPropagation(); // Prevent bubbling to parent module (which would toggle/close it)
            selectGalleryItem(index);
        };

        div.innerHTML = `
            <div class="eq-lat"></div>
            <div class="eq-info">
                <div class="eq-name">${item.title}</div>
                <span class="eq-hint hidden-desktop" style="font-size: 0.75rem; color: #9ca3af; margin-top: 2px;">点击查看详情</span>
            </div>
        `;

        listContainer.appendChild(div);
    });

    // 默认展示第一个
    if (galleryData.length > 0) {
        // Init without opening modal (pass false)
        selectGalleryItem(0, false);
    }
}

/**
 * 选中某个图鉴项
 * @param {number} index - 索引
 * @param {boolean} openModal - 是否在移动端自动打开模态 (默认 true)
 */
function selectGalleryItem(index, openModal = true) {
    const item = galleryData[index];
    if (!item) return;

    // 1. 更新列表高亮
    const items = document.querySelectorAll('.eq-item');
    items.forEach((el, i) => {
        if (i === index) el.classList.add('active');
        else el.classList.remove('active');
    });

    // 2. 更新右侧展示区域
    const titleEl = document.getElementById('galleryTitle');
    const descEl = document.getElementById('galleryDesc');
    const imgEl = document.getElementById('galleryImage');

    if (titleEl) titleEl.innerText = item.title;
    if (descEl) descEl.innerText = item.desc;

    if (imgEl) {
        if (item.image) {
            imgEl.src = item.image;
            imgEl.style.display = 'block';
            const placeholder = imgEl.parentElement.querySelector('div');
            if (placeholder) placeholder.style.display = 'none';
        } else {
            imgEl.style.display = 'none';
            const placeholder = imgEl.parentElement.querySelector('div');
            if (placeholder) placeholder.style.display = 'flex';
        }
    }

    // 3. Mobile UX: 打开模态窗口
    if (openModal && window.innerWidth < 768) {
        const visualContainer = document.getElementById('visualContainer');
        if (visualContainer) {
            // 确保先切换到 Gallery 视图(index 1)
            if (typeof updateVisual === 'function') updateVisual(1);
            visualContainer.classList.add('active');
        }
    }
}
