/**
 * PSI的应用容器：承载主菜单、业务模块的UI
 * 
 * @author 艾格林门信息服务（大连）有限公司
 * @copyright 2015 - present
 * @license GPL v3
 */
PCL.define("PSI.App", {
  config: {
    userName: "",
    productionName: "PSI",
    showCopyright: false,

    // 当 showRecent == false的时候，原来是把常用功能折叠，从2022-4-4起，调整为不创建常用功能Grid
    // 这样就只在首页显示常用功能
    showRecent: false
  },

  /**
   * 构造函数
   */
  constructor(config) {
    const me = this;

    me.initConfig(config);

    me.createMainUI();

    if (config.appHeaderInfo) {
      me._setAppHeader(config.appHeaderInfo);
    }
  },

  /**
   * 构建URL的助手函数
   */
  URL(url) {
    return PSI.Const.BASE_URL + url;
  },

  /**
   * 创建UI：主菜单、常用功能、状态栏、模块主容器
   * 
   * @private
   */
  createMainUI() {
    const me = this;

    // mainPanel中放置各个具体模块的UI
    me._mainPanel = PCL.create("PCL.panel.Panel", {
      border: 0,
      layout: "fit"
    });

    if (me.getShowRecent()) {
      const modelName = "PSIModel.PSI.App.FId";
      PCL.define(modelName, {
        extend: "PCL.data.Model",
        fields: ["fid", "name"]
      });

      const storeRecentFid = PCL.create("PCL.data.Store", {
        autoLoad: false,
        model: modelName,
        data: []
      });

      me.gridRecentFid = PCL.create("PCL.grid.Panel", {
        header: {
          title: "常用功能 - 根据使用频率自动生成",
          height: 28
        },
        border: 0,
        titleAlign: "center",
        cls: "PSI-recent-fid",
        forceFit: true,
        hideHeaders: true,
        tools: [{
          type: "close",
          handler() {
            PCL.getCmp("PSI_Main_RecentPanel").collapse();
          },
          scope: me
        }],
        columns: [{
          dataIndex: "name",
          menuDisabled: true,
          menuDisabled: true,
          sortable: false,
          width: 16,
          renderer(value, metaData, record) {
            const fid = record.get("fid");
            const getFileName = (fid) => {
              const isCodeTable = fid.substring(0, 2) == "ct";
              if (isCodeTable) {
                return "Public/Images/fid/fid_todo.png";
              }

              // TODO 还需要处理LCAP的其他模块

              return `Public/Images/fid/fid${fid}.png`;
            }

            const fileName = getFileName(fid);
            const url = me.URL(fileName);

            return `
            <a href='#' style='text-decoration:none'>
              <img src='${url}' style='vertical-align: middle;margin:0px 5px 0px 5px'></img>
            </a>
            `;
          }
        }, {
          dataIndex: "name",
          menuDisabled: true,
          menuDisabled: true,
          sortable: false,
          renderer(value, metaData, record) {
            return `
            <a href='#' style='text-decoration:none'>
              <span style='vertical-align: middle'>${value}</span>
            </a>
            `;
          }
        }, {
          dataIndex: "name",
          menuDisabled: true,
          menuDisabled: true,
          sortable: false,
          width: 30,
          hidden: PSI.Const.MOT != "0", // 模块打开方式是新窗口打开的时候，不需要显示本列
          renderer(v, m, r) {
            const fileName = me.URL("Public/Images/icons/open_in_new_window.png");
            const name = r.get("name");
            return `
            <a href='#'>
              <img src='${fileName}' style='vertical-align: middle' title='新窗口打开【${name}】'></img>
            </a>
            `;
          }
        }],
        store: storeRecentFid
      });

      me.gridRecentFid.on("cellclick", (me, td, cellIndex, r, tr, rowIndex, e, eOpts) => {
        const fid = r.get("fid");

        const url = `${PSI.Const.BASE_URL}Home/MainMenu/navigateTo/fid/${fid}/t/1`;

        if (fid === "-9999") {
          // TODO 在常用功能里面，应该是没有重新登录这项
          PSI.MsgBox.confirm("请确认是否重新登录", function () {
            location.replace(url);
          });
        } else {
          if (PSI.Const.MOT == "0") {
            // 模块打开方式：原窗口打开
            if (cellIndex == 2) {
              // 新窗口打开
              window.open(url);
              // 清除当前选中项，为了更好的视觉效果
              me.getSelectionModel().deselectAll();
            }
            else {
              location.replace(url);
            }
          } else {
            // 模块打开方式：新窗口打开
            window.open(url);
            // 清除当前选中项，为了更好的视觉效果
            me.getSelectionModel().deselectAll();
          }
        }
      }, me);
    }
    const year = new Date().getFullYear();

    const panelItems = [{
      region: "center",
      border: 0,
      layout: "fit",
      xtype: "panel",
      items: [me._mainPanel]
    }];
    if (me.getShowRecent()) {
      panelItems.push({
        id: "PSI_Main_RecentPanel",
        xtype: "panel",
        region: "east",
        width: 250,
        maxWidth: 250,
        split: true,
        collapsible: true,
        collapseMode: "mini",
        header: false,
        border: 1,
        layout: "border",
        items: [{
          region: "center",
          layout: "fit",
          border: 0,
          items: me.gridRecentFid
        }, {
          region: "south",
          height: 30,
          border: 0,
          layout: "form",
          items: [{
            fieldLabel: "快捷访问",
            labelSeparator: "",
            margin: 5,
            labelAlign: "right",
            labelWidth: 60,
            emptyText: "双击此处弹出选择框",
            xtype: "psi_mainmenushortcutfield"
          }]
        }],
      });
    }
    if (me.getShowCopyright()) {
      panelItems.push({
        xtype: "panel",
        region: "south",
        height: 25,
        border: 0,
        header: {
          cls: "PSI-Copyright",
          titleAlign: "center",
          title: `Copyright &copy; 2015-${year} 艾格林门信息服务（大连）有限公司, All Rights Reserved`
        }
      });

    }

    me._vp = PCL.create("PCL.container.Viewport", {
      layout: "fit",
      items: [{
        id: "_PSITopPanel",
        xtype: "panel",
        border: 0,
        layout: "border",
        header: {
          cls: "PSI-App",
          height: 38,
          tools: []
        },
        items: panelItems,
      }]
    });

    const el = PCL.getBody();
    el.mask("系统正在加载中...");

    PCL.Ajax.request({
      url: me.URL("Home/MainMenu/mainMenuItems"),
      method: "POST",
      callback(opt, success, response) {
        if (success) {
          const data = PCL.JSON.decode(response.responseText);
          me.createMainMenu(data);
          me.refreshRectFidGrid();
        }

        el.unmask();
      },
      scope: me
    });
  },

  /**
   * 刷新常用功能Grid中的数据
   * 
   * @private
   */
  refreshRectFidGrid() {
    const me = this;

    if (!me.getShowRecent()) {
      return;
    }

    const el = me.gridRecentFid.getEl() || PCL.getBody();
    el.mask("系统正在加载中...");
    const store = me.gridRecentFid.getStore();
    store.removeAll();

    PCL.Ajax.request({
      url: me.URL("Home/MainMenu/recentFid"),
      method: "POST",
      callback(opt, success, response) {
        if (success) {
          const data = PCL.JSON.decode(response.responseText);
          store.add(data);
        }
        el.unmask();
      },
      scope: me
    });
  },

  /**
   * 创建主菜单
   * 
   * @private 
   */
  createMainMenu(root) {
    const me = this;

    const menuItemClick = (item) => {
      const fid = item.fid;

      if (fid == "-9995") {
        me._vp.focus();
        window.open(me.URL("Home/Help/index"));
      } else if (fid === "-9999") {
        // 重新登录
        PSI.MsgBox.confirm(`请确认是否重新登录${PSI.Const.PROD_NAME} ?`, function () {
          location.replace(me.URL("Home/MainMenu/navigateTo/fid/-9999"));
        });
      } else {
        me._vp.focus();

        const url = me.URL(`Home/MainMenu/navigateTo/fid/${fid}`);
        if (PSI.Const.MOT == "0") {
          location.replace(url);
        } else {
          window.open(url);
        }
      }
    };

    const mainMenu = [];

    const getIconCls = (fid) => {
      const isCodeTable = fid.substring(0, 2) == "ct";
      if (isCodeTable) {
        return "PSI-fid_todo";
      }

      // TODO 还需要处理LCAP其他模块

      return `PSI-fid${fid}`;
    };

    root.forEach((m1) => {
      const menuItem = PCL.create("PCL.menu.Menu", { plain: true, bodyCls: "PSI-App-MainMenu" });
      m1.children.forEach((m2) => {
        if (m2.children.length === 0) {
          // 只有二级菜单
          if (m2.fid) {
            menuItem.add({
              text: m2.caption,
              fid: m2.fid,
              handler: menuItemClick,
              iconCls: getIconCls(m2.fid)
            });
          }
        } else {
          const menuItem2 = PCL.create("PCL.menu.Menu", { plain: true, bodyCls: "PSI-App-MainMenu" });

          menuItem.add({
            text: m2.caption,
            menu: menuItem2
          });

          // 三级菜单
          m2.children.forEach((m3) => {
            menuItem2.add({
              text: m3.caption,
              fid: m3.fid,
              handler: menuItemClick,
              iconCls: getIconCls(m3.fid)
            });
          });
        }
      });

      if (m1.children.length > 0) {
        mainMenu.push({
          text: m1.caption,
          menu: menuItem
        });
      }
    });

    const mainToolbar = PCL.create("PCL.toolbar.Toolbar", {
      cls: "PSI-App-MainMenu",
      border: 0,
      dock: "top"
    });
    mainToolbar.add(mainMenu);

    const theCmp = me._vp.getComponent(0);
    theCmp.addTool(mainToolbar);
    const spacers = [];
    for (let i = 0; i < 10; i++) {
      spacers.push({
        xtype: "tbspacer"
      });
    }
    theCmp.addTool(spacers);

    // 右上角显示当前登录用户名
    const uname = me.getUserName();
    const index = uname.lastIndexOf("\\");
    const shortName = uname.substring(index + 1);
    theCmp.addTool({
      xtype: "tbtext",
      text: `<span style='color:#8c8c8c;font-weight:bold;font-size:13px' title=${uname}>
                ${shortName}
            </span>"`
    });
  },

  // ===================================================
  // 设置模块的标题
  // 这个方法最初是给View中公开调用的
  // 现在已经在构造函数里面自动调用了，所以可以视为是私有方法了
  // 不再推荐在View中调用
  //
  // 方法名称由setAppHeader改为_setAppHeader
  // ===================================================
  /**
   * 设置模块的标题
   * 
   * @private
   */
  _setAppHeader(header) {
    if (!header) {
      return;
    }
    const me = this;
    const panel = PCL.getCmp("_PSITopPanel");
    const title = `
      <span style='font-size:140%;color:#c7c6c6;font-weight:bold;'>
        ${header.title} - ${me.getProductionName()}
      </span>
      `;

    panel.setTitle(title);
  },

  /**
   * @public
   */
  add(comp) {
    this._mainPanel.add(comp);
  }
});
