/* --- API地址变量 --- */
const API_BASE = 'https://API地址，不要有尾斜杠';
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
        document.title = currentTitle ? `${currentTitle} | 自定义名称` : "自定义名称";
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
    const savedEmail = localStorage.getItem('auth_email') || '没有找到账户';

    menu.innerHTML = isRootPath ? `
        <h3>帮助支持</h3>
        <div style="height:1px"></div>
        <div class="menu-group">
          <a href="https://账户管理地址" target="_blank">创建通行证</a>
          <a href="https://如果你没有写登录帮助，则可以删除这一条" target="_blank">登录帮助</a>
          <a href="https://如果你没有支持中心，则可以删除这一条" target="_blank">前往Support</a>
        </div>
        <div style="height:1px"></div>
        <p class="menu-copyright" style="margin-top: 15px;">© 2026 FrostPeak Studio</p>
        <!-- 可以自行修改版权信息 -->
      ` : `
          <h3>信息一览</h3>
          <div style="height:1px"></div>
          <div class="menu-group">
            <a href="/overview/">仪表盘</a>
            <a href="/start/">上手指南</a>
            <a href="/traffic/">流量明细</a>
            <a href="/server/">服务器状态</a>
          </div>
          <div style="height:1px"></div>
          <h3>订阅中心</h3>
          <div style="height:1px"></div>
          <div class="menu-group">
            <a href="/plans/">变更订阅</a>
            <a href="/order/">订单记录</a>
            <a href="/checkout/">收银台</a>
          </div>
          <div style="height:1px"></div>
          <h3>帮助支持</h3>
          <div style="height:1px"></div>
          <div class="menu-group">
            <a href="https://自定义功能" target="_blank">自定义功能</a>
          </div>
          <div style="height:1px"></div>
          <div class="menu-account-info">
            <span id="menuAccountEmail">${savedEmail}</span>
          </div>
          <div class="menu-group">
            <a href="https://账户管理地址" target="_blank">管理账户</a>
            <a style="cursor: pointer;"><span id="menuLogoutBtn">切换账号</span></a>
          </div>
          <div class="h10"></div>
          <p class="menu-copyright">© 2026 FrostPeak Studio | Yggdrasil Beta v7.2</p>
          <!-- 可以自行修改版权信息 -->
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
        // 新增：添加过渡效果，让透明度变化更丝滑
        hamburgerLink.style.transition = 'opacity 0.3s';
        hamburgerLink.innerText = '≡';

        menuContainer.appendChild(hamburgerLink);

        hamburgerLink.addEventListener('click', () => {
            menu.classList.toggle('show');
            overlay.classList.toggle('show');
            // 新增：判断菜单状态来改变透明度
            if (menu.classList.contains('show')) {
                hamburgerLink.style.opacity = '0.5';
            } else {
                hamburgerLink.style.opacity = '1';
            }
        });
    }

    overlay.addEventListener('click', () => {
        menu.classList.remove('show');
        overlay.classList.remove('show');
        // 新增：点击遮罩关闭时，恢复汉堡按钮不透明
        const btn = document.getElementById('hamburgerBtn');
        if (btn) btn.style.opacity = '1';
    });

    const logoutBtn = document.getElementById('menuLogoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.clear();
            window.location.href = '/';
        });
    }
}