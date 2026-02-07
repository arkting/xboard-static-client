/* --- API地址变量 --- */
const API_BASE = 'https://yourdomain.com';
const TOKEN_KEY = 'auth_token';
const authToken = localStorage.getItem(TOKEN_KEY);
const currentPath = window.location.pathname;

const insertPngFavicon = () => {
    const head = document.head;
    let link = document.querySelector("link[rel~='icon']");

    if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        head.appendChild(link);
    }

    link.type = 'image/png';
    link.href = '/favicon.png';
};

insertPngFavicon();

/* --- 带缓存的 API 请求 --- */
window.fetchWithCache = async function (url, options, callback) {
    const cacheKey = `ygg_cache_${url}`;

    // 先读缓存
    const cachedData = localStorage.getItem(cacheKey);
    if (cachedData) {
        try {
            const json = JSON.parse(cachedData);
            // 传回 true 表示来自缓存
            callback(json, true);
        } catch (e) {
            console.warn("Cache parse failed:", e);
        }
    }

    // 后取网络
    try {
        const response = await fetch(url, options);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const json = await response.json();

        // 更新缓存
        localStorage.setItem(cacheKey, JSON.stringify(json));

        // 传回 false 表示来自网络（最新数据）
        callback(json, false);
    } catch (e) {
        console.error("Fetch failed:", url, e);
    }
};

/* --- 重定向逻辑 --- */
document.addEventListener('DOMContentLoaded', () => {
    const path = window.location.pathname;
    if (path === '/' || path === '/index.html') {
        if (authToken) window.location.href = '/overview/';
    } else {
        if (!authToken) {
            window.location.href = '/';
        }
    }
});

/* --- 标题逻辑 --- */
document.addEventListener('DOMContentLoaded', () => {
    const updateTitle = () => {
        const visualTitleEl = document.getElementById('visualTitle');
        const currentTitle = visualTitleEl ? visualTitleEl.innerText.trim() : "";
        document.title = currentTitle ? `${currentTitle} | 自定义内容` : "自定义内容";
    };
    updateTitle();
});

/* --- 菜单 --- */
function injectMenu() {
    const overlay = document.createElement('div');
    overlay.id = 'menuOverlay';
    document.body.appendChild(overlay);

    const menu = document.createElement('div');
    menu.id = 'dynamicMenu';

    const path = (typeof currentPath !== 'undefined') ? currentPath : window.location.pathname;
    const isRootPath = path === '/' || path === '/index.html';
    const savedEmail = localStorage.getItem('auth_email') || '未加载';

    menu.innerHTML = isRootPath ? `
        <h3>帮助支持</h3>
        <div style="height:1px"></div>
        <div class="menu-group">
          <a href="/" target="_blank">自定义按钮</a>
        </div>
        <div style="height:1px"></div>
        <p class="menu-copyright" style="margin-top: 15px;">© 2026 FrostPeak Studio</p>
      ` : `
          <h3>我的信息</h3>
          <div style="height:1px"></div>
          <div class="menu-group">
            <a href="/overview/">仪表盘</a>
          </div>
          <div style="height:1px"></div>
          <h3>订阅中心</h3>
          <div style="height:1px"></div>
          <div class="menu-group">
            <a href="/plans/">变更订阅</a>
            <a href="/checkout/">收银台</a>
          </div>
          <div style="height:1px"></div>
          <h3>帮助支持</h3>
          <div style="height:1px"></div>
          <div class="menu-group">
            <a href="/" target="_blank">自定义按钮</a>
          </div>
          <div style="height:1px"></div>
          <div class="menu-account-info">
            <span id="menuAccountEmail">当前登录: ${savedEmail}</span>
            <span id="menuLogoutBtn" class="text-link-std">切换账号</span>
          </div>
          <div style="height:4px"></div>
          <p class="menu-copyright">Beta v4.3 更多功能敬请期待</p>
          <div style="height:8px"></div>
          <p class="menu-copyright">© 2026 FrostPeak Studio</p>
      `;
    document.body.appendChild(menu);

    const menuContainer = document.getElementById('headerMenuContainer');
    if (menuContainer) {
        const hamburgerLink = document.createElement('a');
        hamburgerLink.id = 'hamburgerBtn';
        hamburgerLink.href = 'javascript:void(0);';
        hamburgerLink.style.fontSize = '28px';
        hamburgerLink.style.textDecoration = 'none';
        hamburgerLink.style.color = 'inherit';
        hamburgerLink.style.lineHeight = '1';
        hamburgerLink.innerText = '≡';

        menuContainer.appendChild(hamburgerLink);

        hamburgerLink.addEventListener('click', () => {
            menu.classList.toggle('show');
            overlay.classList.toggle('show');
        });
    }

    overlay.addEventListener('click', () => {
        menu.classList.remove('show');
        overlay.classList.remove('show');
    });

    const logoutBtn = document.getElementById('menuLogoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.clear();
            window.location.href = '/';
        });
    }
}