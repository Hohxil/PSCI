build_PSI.sh用来构建完整的PSI发布程序，虽然PHP和JS本身不需要编译，但是实施指南HTML文件是需要编译的。

该脚本的主要流程是：

编译环境是Windows，整个操作目录是：D:\temp\PSI

1、用git从gitee repo中下载PSI最新代码

2、编译实施指南HTML文件，把编译后的HTML放置到正确的目录中

> 在代码repo中有编译后的实施指南HTML，但是可能会因为疏忽等原因导致该HTML与指南的最新版不同步，所以用本脚本来构建发布程序是最稳妥的方式

3、删除不需要发布的文件

需要安装git，单击鼠标右键，在右键菜单中用git的Git Bash打开bash命令行，然后执行 bash build_PSI.sh

另外构建实施指南HTML需要先安装好node.js

