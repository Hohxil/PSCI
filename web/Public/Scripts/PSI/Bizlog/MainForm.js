/**
 * 业务日志 - 主界面
 * 
 * @author 艾格林门信息服务（大连）有限公司
 * @copyright 2015 - present
 * @license GPL v3
 */
PCL.define("PSI.Bizlog.MainForm", {
  extend: "PSI.AFX.Form.MainForm",

  config: {
    // 是否显示单元测试按钮，0 - 不启用； 1 - 启用
    unitTest: "0"
  },

  /**
   * @override
   */
  initComponent() {
    const me = this;

    PCL.apply(me, {
      tbar: me.getToolbarCmp(),
      items: [{
        id: "panelQueryCmp",
        region: "north",
        height: 65,
        layout: "fit",
        border: 0,
        header: false,
        collapsible: true,
        collapseMode: "mini",
        layout: {
          type: "table",
          columns: 4
        },
        items: me.getQueryCmp()
      }, {
        region: "center",
        layout: "fit",
        border: 0,
        items: [me.getMainGrid()]
      }]
    });

    me.callParent();

    me.__editorList =
      [PCL.getCmp("editQueryLoginName"),
      PCL.getCmp("editQueryUser"),
      PCL.getCmp("editQueryFromDT"),
      PCL.getCmp("editQueryToDT"),
      PCL.getCmp("editQueryIP"),
      PCL.getCmp("comboCategory"),];

    me.fetchLogCategory();

    me._onQuery();
  },

  /**
   * @private
   */
  fetchLogCategory() {
    const me = this;

    const r = {
      url: me.URL("Home/Bizlog/getLogCategoryList"),
      callback: function (options, success, response) {
        const combo = PCL.getCmp("comboCategory");
        const store = combo.getStore();

        store.removeAll();

        if (success) {
          const data = me.decodeJSON(response.responseText);
          store.add(data);

          if (store.getCount() > 0) {
            combo.setValue(store.getAt(0).get("id"))
          }
        }
      }
    };
    me.ajax(r);
  },

  /**
   * @private
   */
  getToolbarCmp() {
    const me = this;

    const store = me.getMainGrid().getStore();

    const buttons = [{
      cls: "PSI-toolbox",
      id: "pagingToobar",
      xtype: "pagingtoolbar",
      border: 0,
      store: store
    }, "-", {
      xtype: "displayfield",
      value: "每页显示"
    }, {
      cls: "PSI-toolbox",
      id: "comboCountPerPage",
      xtype: "combobox",
      editable: false,
      width: 60,
      store: PCL.create("PCL.data.ArrayStore", {
        fields: ["text"],
        data: [["20"], ["50"], ["100"], ["300"],
        ["1000"]]
      }),
      value: 20,
      listeners: {
        change: {
          fn() {
            store.pageSize = PCL.getCmp("comboCountPerPage").getValue();
            store.currentPage = 1;
            PCL.getCmp("pagingToobar").doRefresh();
          },
          scope: me
        }
      }
    }, {
      xtype: "displayfield",
      value: "条记录"
    }, "-", {
      text: "指南",
      handler() {
        me.focus();
        window.open(me.URL("Home/Help/index?t=bizlog"));
      }
    }, "-", {
      text: "关闭",
      handler() {
        me.closeWindow();
      }
    }, "->", {
      text: "一键升级数据库",
      scope: me,
      handler: me._onUpdateDatabase
    }];

    if (me.getUnitTest() == "1") {
      buttons.push("-", {
        text: "单元测试",
        handler: me._onUnitTest,
        scope: me
      });
    }

    return buttons;
  },

  /**
   * @private
   */
  getQueryCmp() {
    const me = this;

    const modelName = "PSIModel.PSI.Bizlog.MainForm.LogCategory";
    PCL.define(modelName, {
      extend: "PCL.data.Model",
      fields: ["id", "name"]
    });

    return [{
      id: "editQueryLoginName",
      labelWidth: 60,
      labelAlign: "right",
      labelSeparator: "",
      fieldLabel: "登录名",
      margin: "5, 0, 0, 0",
      xtype: "textfield",
      listeners: {
        specialkey: {
          fn: me.__onEditSpecialKey,
          scope: me
        }
      }
    }, {
      id: "editQueryUser",
      labelWidth: 60,
      labelAlign: "right",
      labelSeparator: "",
      fieldLabel: "姓名",
      margin: "5, 0, 0, 0",
      xtype: "psi_userfield",
      showModal: true,
      listeners: {
        specialkey: {
          fn: me.__onEditSpecialKey,
          scope: me
        }
      }
    }, {
      id: "editQueryFromDT",
      xtype: "datefield",
      margin: "5, 0, 0, 0",
      format: "Y-m-d",
      labelAlign: "right",
      labelSeparator: "",
      fieldLabel: "日志日期（起）",
      listeners: {
        specialkey: {
          fn: me.__onEditSpecialKey,
          scope: me
        }
      }
    }, {
      id: "editQueryToDT",
      xtype: "datefield",
      margin: "5, 0, 0, 0",
      format: "Y-m-d",
      labelAlign: "right",
      labelSeparator: "",
      fieldLabel: "日志日期（止）",
      listeners: {
        specialkey: {
          fn: me.__onEditSpecialKey,
          scope: me
        }
      }
    }, {
      id: "editQueryIP",
      labelWidth: 60,
      labelAlign: "right",
      labelSeparator: "",
      fieldLabel: "IP",
      margin: "5, 0, 0, 0",
      xtype: "textfield",
      listeners: {
        specialkey: {
          fn: me.__onEditSpecialKey,
          scope: me
        }
      }
    }, {
      xtype: "combobox",
      id: "comboCategory",
      queryMode: "local",
      editable: false,
      matchFieldWidth: false,
      labelWidth: 60,
      labelAlign: "right",
      labelSeparator: "",
      fieldLabel: "日志分类",
      margin: "5, 0, 0, 0",
      valueField: "id",
      displayField: "name",
      store: PCL.create("PCL.data.Store", {
        model: modelName,
        autoLoad: false,
        data: []
      }),
      listeners: {
        specialkey: {
          fn: me.__onLastEditSpecialKey,
          scope: me
        }
      }
    }, {
      xtype: "container",
      items: [{
        xtype: "button",
        text: "查询",
        width: 100,
        height: 26,
        margin: "5 0 0 10",
        handler: me._onQuery,
        scope: me
      }, {
        xtype: "button",
        text: "清空查询条件",
        width: 100,
        height: 26,
        margin: "5, 0, 0, 10",
        handler: me._onClearQuery,
        scope: me
      }]
    }, {
      xtype: "container",
      items: [{
        xtype: "button",
        iconCls: "PSI-button-hide",
        text: "隐藏查询条件栏",
        width: 130,
        height: 26,
        margin: "5 0 0 10",
        handler() {
          PCL.getCmp("panelQueryCmp").collapse();
        },
        scope: me
      }]
    }];
  },

  /**
   * @private
   */
  getMainGrid() {
    const me = this;
    if (me._mainGrid) {
      return me._mainGrid;
    }

    const modelName = "PSIModel.PSI.Bizlog.MainForm.LogModel";
    PCL.define(modelName, {
      extend: "PCL.data.Model",
      fields: ["id", "loginName", "userName", "ip", "ipFrom",
        "content", "dt", "logCategory"],
      idProperty: "id"
    });
    const store = PCL.create("PCL.data.Store", {
      model: modelName,
      pageSize: 20,
      proxy: {
        type: "ajax",
        actionMethods: {
          read: "POST"
        },
        url: me.URL("Home/Bizlog/logList"),
        reader: {
          root: 'logs',
          totalProperty: 'totalCount'
        }
      },
      autoLoad: true
    });
    store.on("beforeload", () => {
      store.proxy.extraParams = me.getQueryParam();
    });
    store.on("load", (e, records, successful) => {
      if (successful) {
        me.gotoMainGridRecord(null);
      }
    });

    me._mainGrid = PCL.create("PCL.grid.Panel", {
      cls: "PSI-FC",
      viewConfig: {
        enableTextSelection: true
      },
      loadMask: true,
      columnLines: true,
      columns: {
        defaults: {
          menuDisabled: true,
          sortable: false
        },
        items: [PCL.create("PCL.grid.RowNumberer", {
          text: "#",
          width: 60
        }), {
          text: "登录名",
          dataIndex: "loginName",
          width: 160
        }, {
          text: "姓名",
          dataIndex: "userName",
          width: 80
        }, {
          text: "IP",
          dataIndex: "ip",
          width: 120,
          renderer(value) {
            return `<a href='http://www.baidu.com/s?wd=${encodeURIComponent(value)}' target='_blank'>${value}</a>`;
          }
        }, {
          text: "IP所属地",
          dataIndex: "ipFrom",
          width: 200
        }, {
          text: "日志分类",
          dataIndex: "logCategory",
          width: 150
        }, {
          text: "日志内容",
          dataIndex: "content",
          flex: 1,
          renderer(value) {
            return `<div class='PSI-grid-cell-autoWrap'>${value}</div>`;
          }
        }, {
          text: "日志记录时间",
          dataIndex: "dt",
          width: 140
        }]
      },
      store: store,
      listeners: {
        celldblclick: {
          fn: me._onCellDbclick,
          scope: me
        }
      }
    });

    return me._mainGrid;
  },

  /**
   * @private
   */
  gotoMainGridRecord(id) {
    const me = this;
    const grid = me.getMainGrid();
    grid.getSelectionModel().deselectAll();
    const store = grid.getStore();
    if (id) {
      const r = store.findExact("id", id);
      if (r != -1) {
        grid.getSelectionModel().select(r);
      } else {
        grid.getSelectionModel().select(0);
      }
    } else {
      grid.getSelectionModel().select(0);
    }
  },

  /**
   * @private
   */
  _onCellDbclick(ths, td, cellIndex, record, tr, rowIndex, e, eOpts) {
    const me = this;
    if (cellIndex == 1) {
      PCL.getCmp("editQueryLoginName").setValue(record.get("loginName"));
      me._onQuery();
    } else if (cellIndex == 3) {
      PCL.getCmp("editQueryIP").setValue(record.get("ip"));
      me._onQuery();
    }
  },

  /**
   * 刷新
   * 
   * @private
   */
  _onQuery() {
    const me = this;

    me.getMainGrid().getStore().currentPage = 1;
    PCL.getCmp("pagingToobar").doRefresh();
  },

  /**
   * 升级数据库
   * 
   * @private
   */
  _onUpdateDatabase() {
    const me = this;

    me.confirm("请确认是否升级数据库？", () => {
      const el = PCL.getBody();
      el.mask("正在升级数据库，请稍等......");

      me.ajax({
        url: me.URL("Home/Bizlog/updateDatabase"),
        callback: function (options, success, response) {
          el.unmask();

          if (success) {
            const data = me.decodeJSON(response.responseText);
            if (data.success) {
              me.tip("成功升级数据库", true);
              me._onQuery();
            } else {
              me.showInfo(data.msg);
            }
          } else {
            me.showInfo("网络错误");
          }
        }
      });
    });
  },

  /**
   * @private
   */
  _onUnitTest() {
    const url = PSI.Const.BASE_URL + "UnitTest";
    window.open(url);
  },

  /**
   * @private
   */
  getQueryParam() {
    const result = {
      loginName: PCL.getCmp("editQueryLoginName").getValue(),
      userId: PCL.getCmp("editQueryUser").getIdValue(),
      ip: PCL.getCmp("editQueryIP").getValue(),
      logCategory: PCL.getCmp("comboCategory").getValue()
    };

    const fromDT = PCL.getCmp("editQueryFromDT").getValue();
    if (fromDT) {
      result.fromDT = PCL.Date.format(fromDT, "Y-m-d");
    }

    const toDT = PCL.getCmp("editQueryToDT").getValue();
    if (toDT) {
      result.toDT = PCL.Date.format(toDT, "Y-m-d");
    }

    return result;
  },

  /**
   * @private
   */
  _onClearQuery() {
    const me = this;

    PCL.getCmp("editQueryLoginName").setValue(null);
    PCL.getCmp("editQueryUser").clearIdValue();
    PCL.getCmp("editQueryIP").setValue(null);
    PCL.getCmp("editQueryFromDT").setValue(null);
    PCL.getCmp("editQueryToDT").setValue(null);
    const combo = PCL.getCmp("comboCategory");
    const store = combo.getStore();
    if (store.getCount() > 0) {
      combo.setValue(store.getAt(0).get("id"))
    }

    me.getMainGrid().getStore().currentPage = 1;

    me._onQuery();
  }
});
