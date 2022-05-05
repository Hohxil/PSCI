# 删除旧文件
echo 'Step 1: delete old repo and clone new one'
cd /d/temp
rm -rf /d/temp/PSI

# clone PSI
git clone https://gitee.com/crm8000/PSI.git

# 构建Help
echo 'Step 2: building PSI Help'
cd /d/temp/PSI/doc/help_src
npm install 
npm run build

# 复制Help文件到PSI主目录
rm -rf /d/temp/PSI/help
mkdir /d/temp/PSI/help
cp -r /d/temp/PSI/doc/help_src/docs/.vuepress/dist/* /d/temp/PSI/help


# 删除不用发布的文件
rm -rf /d/temp/PSI/doc
rm -rf /d/temp/PSI/.git
rm -rf /d/temp/PSI/.editorconfig
rm -rf /d/temp/PSI/.gitignore
rm -rf /d/temp/PSI/README.md
rm -rf /d/temp/PSI/wx.jpg
rm -rf /d/temp/PSI/license_files
rm -rf /d/temp/PSI/LICENSE

echo 'Done! Have fun!'
