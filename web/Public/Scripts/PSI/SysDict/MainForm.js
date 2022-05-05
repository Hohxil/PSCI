/**
 * 系统数据字典 - 主界面
 * 
 * @author 艾格林门信息服务（大连）有限公司
 * @copyright 2015 - present
 * @license GPL v3
 */
PCL.define("PSI.SysDict.MainForm", {
  extend: "PSI.AFX.Form.MainForm",

  /**
   * @override
   */
  initComponent() {
    const me = this;

    PCL.apply(me, {
      tbar: me.getToolbarCmp(),
      items: [{
        region: "north",
        border: 0,
        height: 2
      }, {
        region: "center",
        layout: "border",
        border: 0,
        items: [{
          region: "center",
          xtype: "panel",
          layout: "border",
          border: 0,
          items: [{
            region: "center",
            layout: "fit",
            border: 0,
            items: me.getMainGrid()
          }, {
            region: "south",
            layout: "fit",
            border: 0,
            height: "60%",
            split: true,
            items: [me.getDictDataGrid()]
          }]
        }, {
          id: "panelCategory",
          xtype: "panel",
          region: "west",
          layout: "fit",
          width: 300,
          split: true,
          collapsible: true,
          header: false,
          border: 0,
          items: [me.getCategoryGrid()]
        }]
      }]
    });

    me.callParent(arguments);

    me.refreshCategoryGrid();
  },

  /**
   * @private
   */
  getToolbarCmp() {
    const me = this;

    return [{
      text: "指南",
      handler() {
        me.focus();
        window.open(me.URL("Home/Help/index?t=sysdict"));
      }
    }, "-", {
      text: "关闭",
      handler() {
        me.closeWindow();
      }
    }];
  },

  /**
   * @private
   */
  getCategoryGrid() {
    const me = this;

    if (me._categoryGrid) {
      return me._categoryGrid;
    }

    const modelName = "PSIModel.PSI.SysDict.MainForm.SysDictCategory";

    PCL.define(modelName, {
      extend: "PCL.data.Model",
      fields: ["id", "code", "name"]
    });

    me._categoryGrid = PCL.create("PCL.grid.Panel", {
      cls: "PSI-FC",
      viewConfig: {
        enableTextSelection: true
      },
      header: {
        height: 30,
        title: me.formatGridHeaderTitle("系统数据字典分类")
      },
      tools: [{
        type: "close",
        handler() {
          PCL.getCmp("panelCategory").collapse();
        }
      }],
      columnLines: true,
      columns: [{
        header: "分类编码",
        dataIndex: "code",
        width: 100,
        menuDisabled: true,
        sortable: false
      }, {
        header: "分类",
        dataIndex: "name",
        width: 200,
        menuDisabled: true,
        sortable: false
      }],
      store: PCL.create("PCL.data.Store", {
        model: modelName,
        autoLoad: false,
        data: []
      }),
      listeners: {
        select: {
          fn: me._onCategoryGridSelect,
          scope: me
        }
      }
    });

    return me._categoryGrid;
  },

  /**
   * @private
   */
  getMainGrid() {
    const me = this;

    if (me._mainGrid) {
      return me._mainGrid;
    }

    const modelName = "PSIModel.PSI.SysDict.MainForm.SysDictModel";

    PCL.define(modelName, {
      extend: "PCL.data.Model",
      fields: ["id", "code", "name", "tableName", "memo"]
    });

    me._mainGrid = PCL.create("PCL.grid.Panel", {
      cls: "PSI-HL",
      viewConfig: {
        enableTextSelection: true
      },
      header: {
        height: 30,
        title: me.formatGridHeaderTitle("数据字典")
      },
      columnLines: true,
      columns: {
        defaults: {
          menuDisabled: true,
          sortable: false
        },
        items: [{
          header: "编码",
          dataIndex: "code",
          width: 140,
        }, {
          header: "数据字典名称",
          dataIndex: "name",
          width: 200,
        }, {
          header: "数据库表名",
          dataIndex: "tableName",
          width: 300,
        }, {
          header: "备注",
          dataIndex: "memo",
          width: 400,
          renderer(value) {
            return `<div class='PSI-grid-cell-autoWrap'>${value}</div>`;
          }
        }]
      },
      store: PCL.create("PCL.data.Store", {
        model: modelName,
        autoLoad: false,
        data: []
      }),
      listeners: {
        select: {
          fn: me._onMainGridSelect,
          scope: me
        }
      }
    });

    return me._mainGrid;
  },

  /**
   * @private
   */
  getDictDataGrid() {
    const me = this;

    if (me._dataGrid) {
      return me._dataGrid;
    }

    const modelName = "PSIModel.PSI.SysDict.MainForm.SysDictData";

    PCL.define(modelName, {
      extend: "PCL.data.Model",
      fields: ["id", "code", "codeInt", "name", "memo"]
    });

    me._dataGrid = PCL.create("PCL.grid.Panel", {
      cls: "PSI-HL",
      viewConfig: {
        enableTextSelection: true
      },
      header: {
        height: 30,
        title: me.formatGridHeaderTitle("数据")
      },
      columnLines: true,
      columns: {
        defaults: {
          menuDisabled: true,
          sortable: false
        },
        items: [PCL.create("PCL.grid.RowNumberer", {
          text: "#",
          align: "right",
          width: 60
        }), {
          header: "编码(字符类型)",
          dataIndex: "code",
          width: 150
        }, {
          header: "编码(整数类型)",
          dataIndex: "codeInt",
          width: 150,
          align: "right"
        }, {
          header: "值",
          dataIndex: "name",
          width: 250
        }, {
          header: "备注",
          dataIndex: "memo",
          width: 400,
          renderer(value) {
            return `<div class='PSI-grid-cell-autoWrap'>${value}</div>`;
          }
        }]
      },
      store: PCL.create("PCL.data.Store", {
        model: modelName,
        autoLoad: false,
        data: []
      })
    });

    return me._dataGrid;
  },

  /**
   * @private
   */
  refreshCategoryGrid(id) {
    const me = this;
    const grid = me.getCategoryGrid();
    const el = grid.getEl() || PCL.getBody();
    el.mask(PSI.Const.LOADING);
    const r = {
      url: me.URL("Home/SysDict/categoryList"),
      callback(options, success, response) {
        const store = grid.getStore();

        store.removeAll();

        if (success) {
          const data = me.decodeJSON(response.responseText);
          store.add(data);

          if (store.getCount() > 0) {
            if (id) {
              const r = store.findExact("id", id);
              if (r != -1) {
                grid.getSelectionModel().select(r);
              }
            } else {
              grid.getSelectionModel().select(0);
            }
          }
        }

        el.unmask();
      }
    };

    me.ajax(r);
  },

  /**
   * @private
   */
  _onCategoryGridSelect() {
    const me = this;
    me.refreshMainGrid();
  },

  /**
   * @private
   */
  refreshMainGrid(id) {
    const me = this;
    me.getDictDataGrid().getStore().removeAll();
    me.getDictDataGrid().setTitle(me.formatGridHeaderTitle("数据"));

    const item = me.getCategoryGrid().getSelectionModel().getSelection();
    if (item == null || item.length != 1) {
      me.getMainGrid().setTitle(me.formatGridHeaderTitle("数据字典"));
      return;
    }

    const category = item[0];

    const grid = me.getMainGrid();
    grid.setTitle(me.formatGridHeaderTitle(`<span class='PSI-title-keyword'>${category.get("name")}</span> - 数据字典列表`));
    const el = grid.getEl() || PCL.getBody();
    el.mask(PSI.Const.LOADING);
    const r = {
      url: me.URL("Home/SysDict/sysDictList"),
      params: {
        categoryId: category.get("id")
      },
      callback(options, success, response) {
        const store = grid.getStore();

        store.removeAll();

        if (success) {
          const data = me.decodeJSON(response.responseText);
          store.add(data);

          if (store.getCount() > 0) {
            if (id) {
              const r = store.findExact("id", id);
              if (r != -1) {
                grid.getSelectionModel().select(r);
              }
            } else {
              grid.getSelectionModel().select(0);
            }
          }
        }

        el.unmask();
      }
    };

    me.ajax(r);
  },

  /**
   * @private
   */
  _onMainGridSelect() {
    const me = this;
    me.refreshDictDataGrid();
  },

  /**
   * @private
   */
  refreshDictDataGrid(id) {
    const me = this;
    const item = me.getMainGrid().getSelectionModel().getSelection();
    if (item == null || item.length != 1) {
      me.getMainGrid().setTitle(me.formatGridHeaderTitle("数据字典"));
      me.getDictDataGrid().setTitle(me.formatGridHeaderTitle("数据"));
      return;
    }

    const sysDict = item[0];

    const grid = me.getDictDataGrid();
    grid.setTitle(me.formatGridHeaderTitle(`<span class='PSI-title-keyword'>${sysDict.get("name")} ${sysDict.get("tableName")}</span> - 数据`));
    const el = grid.getEl() || PCL.getBody();
    el.mask(PSI.Const.LOADING);
    const r = {
      url: me.URL("Home/SysDict/dictDataList"),
      params: {
        id: sysDict.get("id")
      },
      callback(options, success, response) {
        const store = grid.getStore();

        store.removeAll();

        if (success) {
          const data = me.decodeJSON(response.responseText);
          store.add(data);

          if (store.getCount() > 0) {
            if (id) {
              const r = store.findExact("id", id);
              if (r != -1) {
                grid.getSelectionModel().select(r);
              }
            } else {
              grid.getSelectionModel().select(0);
            }
          }
        }

        el.unmask();
      }
    };

    me.ajax(r);
  }
});
