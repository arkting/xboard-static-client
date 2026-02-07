# xboard-static-client
一个基于 XBoard API 构建的纯静态 HTML 用户端

只有一个 css 和一个 js 和一堆 html ，通过 API 与 xboard 通信。

只需要全局查找替换 “自定义内容” 即可给所有页面换上你的名字，比如我的面板叫 “ABC” ，那就全局查找 “自定义内容” 并替换为 “ABC” .

style.css 最顶部包含了全局颜色变量，但部分样式尚未整理到全局变量中，待后续重新整理。

script.js 最顶部就是API地址，把yourdomain.com改为你自己的API地址即可。

设计有 API 缓存，在得到响应之前先显示缓存数据。

部分内容由 AI 生成，采用 Gemini 3 Pro。注释为 AI 生成，因为我懒得写了。

目前还是beta，功能并不完善，更多内容等待后续补充...
