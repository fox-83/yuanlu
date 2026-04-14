# 前端分类项目

此项目为一个简单前端模板，目录结构如下：

- `index.html`：页面入口文件
- `css/style.css`：样式文件
- `js/app.js`：JavaScript 脚本
- `assets/`：静态资源目录，可存放图片、模型、字体等

## 使用方式

1. 直接在浏览器中打开 `index.html`
2. 或者使用本地静态服务器（如 `live-server`、`http-server`）运行
3. 打开 `model.html`，将你的无人机 glTF 文件放在 `assets/drone.gltf`，页面会自动加载并尝试让螺旋桨旋转。

## 注意

- `model.html` 使用 ES 模块加载 Three.js，需要通过 HTTP 服务器访问。
- 若你的 glTF 模型节点名称不是 `propeller` 或 `螺旋桨`，请检查控制台输出并调整 `js/drone-viewer.js` 中的关键词匹配。