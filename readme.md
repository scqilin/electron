
## Electron 打包
*npm run make* 命令用于打包 Electron 应用程序。在打包过程中，Electron 会将应用程序的源代码、依赖项和资源文件等打包成一个可执行文件，以便在不同平台上运行。在 Electron 构建项目时，默认会生成两个文件夹，分别是 `out/make/zip/darwin/x64/` 和 `out/my-electron-app-darwin-x64/`，它们之间的差异如下：

1. **`out/make/zip/darwin/x64/`**：
   - 这个文件夹通常包含打包后的 Electron 应用程序的压缩文件（zip 文件）。
   - 在 Electron 打包过程中，会生成不同平台和架构的打包文件，其中 `darwin/x64` 表示 macOS 平台的 64 位版本。
   - 这个文件夹中的压缩文件可以用于发布和分发应用程序。

2. **`out/my-electron-app-darwin-x64/`**：
   - 这个文件夹通常包含打包后的 Electron 应用程序的实际可执行文件。
   - 在 Electron 打包过程中，会生成不同平台和架构的应用程序文件夹，其中 `darwin/x64` 表示 macOS 平台的 64 位版本。
   - 这个文件夹中包含了应用程序的可执行文件、依赖项和资源文件等，可以直接运行应用程序。

所以`out/make/zip/darwin/x64/` 包含了经过压缩的应用程序文件，而 `out/my-electron-app-darwin-x64/` 包含了未压缩的实陃应用程序文件。你可以根据需要选择发布压缩文件或直接使用实际应用程序文件。

## 引入SQLite数据库
在 Electron 应用程序中使用 SQLite 数据库，可以通过 `sqlite3` 模块来实现。`sqlite3` 模块是一个 Node.js 的 SQLite3 驱动程序，可以用于在 Node.js 环境中操作 SQLite 数据库。在 Electron 应用程序中使用 SQLite 数据库，需要先安装 `sqlite3` 模块，然后通过 `sqlite3` 模块来操作 SQLite 数据库。

`npm install better-sqlite3 -D`

这个模块安装后，大概率会报错，因为这个模块是用于 Node.js 环境的，而 Electron 应用程序是在浏览器环境中运行的， Electron 内置的 Node.js 的版本可能与你编译原生模块使用的 Node.js 的版本不同导致的。

解决办法：使用 `electron-rebuild` 模块重新编译原生模块，以适应 Electron 应用程序的 Node.js 版本。

`npm install electron-rebuild -D`

然后在 package.json 文件中添加以下脚本：

```json
"scripts": {
  "rebuild": "electron-rebuild -f -w better-sqlite3"
}
```
然后运行 `npm run rebuild` 命令重新编译原生模块，以适应 Electron 应用程序的 Node.js 版本。

当你的工程下出现了这个文件`node_modules\better-sqlite3\build\Release\better_sqlite3.node`，才证明`better_sqlite3`模块编译成功了，如果上述指令没有帮你完成这项工作，你可以把指令配置到`node_modules\better-sqlite3`模块内部再执行一次，一般就可以编译成功了（如下图所示）。

![rebuild](image.png)

测试是否安装成功，可以在`main.js`(渲染进程和主进程都可以)文件中添加以下代码：

```js
const Database = require("better-sqlite3");
const db = new Database("db.db", { verbose: console.log, nativeBinding: "./node_modules/better-sqlite3/build/Release/better_sqlite3.node" });
```

运行上述代码，如果成功，会在工程目录下生成一个`db.db`文件，这个文件就是你的数据库文件。

## 引入Knex.js
Knex.js 是一个 Node.js 的 SQL 查询构建器，可以用于在 Node.js 环境中构建和执行 SQL 查询。Knex.js 支持多种数据库，包括 MySQL、PostgreSQL、SQLite 等，可以通过 Knex.js 来操作这些数据库。在 Electron 应用程序中使用 Knex.js，可以通过 `knex` 模块来实现。

`npm install knex -D`
