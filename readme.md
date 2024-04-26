
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