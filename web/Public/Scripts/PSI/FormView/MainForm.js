/**
 * 视图开发助手 - 主页面
 * 
 * @author 艾格林门信息服务（大连）有限公司
 * @copyright 2015 - present
 * @license GPL v3
 */
Ext.define("PSI.FormView.MainForm", {
  extend: "PSI.AFX.Form.MainForm",

  /**
   * @override
   */
  initComponent() {
    const me = this;

    Ext.apply(me, {
      tbar: me.getToolbarCmp(),
      items: [{
        region: "north",
        height: 2,
        border: 0,
      }, {
        id: "panelCategory",
        border: 0,
        split: true,
        region: "west",
        width: 370,
        layout: "fit",
        items: me.getCategoryGrid()
      }, {
        border: 0,
        region: "center",
        layout: "border",
        items: [{
          region: "center",
          border: 0,
          layout: "fit",
          items: [me.getMainGrid()]
        }, {
          region: "south",
          border: 0,
          height: "60%",
          split: true,
          layout: "fit",
          xtype: "tabpanel",
          items: [me.getColsGrid(), me.getQcGrid(), me.getButtonGrid(), {
            title: "排序"
          }]
        }]
      }]
    });

    me.callParent();

    me.comboSolution = Ext.getCmp("comboSolution");

    me.querySolutionList();
  },

  /**
   * @private
   */
  getToolbarCmp() {
    const me = this;

    const modelName = "PSI_FormView_MainForm_PSISolution";
    Ext.define(modelName, {
      extend: "Ext.data.Model",
      fields: ["code", "name"]
    });

    return [{
      xtype: "displayfield",
      value: "解决方案"
    }, {
      cls: "PSI-toolbox",
      xtype: "combobox",
      id: "comboSolution",
      queryMode: "local",
      editable: false,
      valueField: "code",
      displayField: "name",
      store: Ext.create("Ext.data.Store", {
        model: modelName,
        autoLoad: false,
        data: []
      }),
      width: 400,
      listeners: {
        select: {
          fn: me._onComboSolutionSelect,
          scope: me
        }
      }
    }, {
      text: "新建视图分类",
      handler: me._onAddCategory,
      scope: me
    }, {
      text: "编辑视图分类",
      handler: me._onEditCategory,
      scope: me
    }, {
      text: "删除视图分类",
      handler: me._onDeleteCategory,
      scope: me
    }, "-", {
      text: "新建视图",
      handler: me._onAddFv,
      scope: me
    }, {
      text: "编辑视图",
      handler: me._onEditFv,
      scope: me
    }, {
      text: "删除视图",
      handler: me._onDeleteFv,
      scope: me
    }, "-", {
      text: "指南",
      handler() {
        me.focus();
        window.open(me.URL("Home/Help/index?t=formview"));
      }
    }, "-", {
      text: "关闭",
      handler() {
        me.closeWindow();
      },
      scope: me
    }];
  },

  /**
   * 视图分类Grid
   * 
   * @private
   */
  getCategoryGrid() {
    const me = this;

    if (me._categoryGrid) {
      return me._categoryGrid;
    }

    const modelName = "PSIFvCategory";

    Ext.define(modelName, {
      extend: "Ext.data.Model",
      fields: ["id", "code", "name", "isSystem", "isSystemCaption"]
    });

    me._categoryGrid = Ext.create("Ext.grid.Panel", {
      cls: "PSI",
      viewConfig: {
        enableTextSelection: true
      },
      header: {
        height: 30,
        title: me.formatGridHeaderTitle("视图分类")
      },
      tools: [{
        type: "close",
        handler() {
          Ext.getCmp("panelCategory").collapse();
        }
      }],
      columnLines: true,
      columns: [{
        header: "分类编码",
        dataIndex: "code",
        width: 80,
        menuDisabled: true,
        sortable: false
      }, {
        header: "视图分类",
        dataIndex: "name",
        width: 200,
        menuDisabled: true,
        sortable: false
      }, {
        header: "系统固有",
        dataIndex: "isSystemCaption",
        menuDisabled: true,
        width: 80,
        align: "center",
        sortable: false
      }],
      store: Ext.create("Ext.data.Store", {
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
   * 视图列Grid
   * 
   * @private
   */
  getColsGrid() {
    const me = this;

    if (me._colsGrid) {
      return me._colsGrid;
    }

    const modelName = "PSIFvCols";

    Ext.define(modelName, {
      extend: "Ext.data.Model",
      fields: ["id", "caption", "showOrder", "width", "valueFromTableName", "valueFromColName",
        "displayFormat"]
    });

    me._colsGrid = Ext.create("Ext.grid.Panel", {
      cls: "PSI",
      viewConfig: {
        enableTextSelection: true
      },
      title: "列",
      tbar: [{
        text: "新建列",
        handler: me._onAddCol,
        scope: me
      }, "-", {
        text: "编辑列",
        handler: me._onEditCol,
        scope: me
      }, "-", {
        text: "删除列",
        handler: me._onDeleteCol,
        scope: me
      }],
      columnLines: true,
      columns: {
        defaults: {
          menuDisabled: true,
          sortable: false
        },
        items: [{
          header: "显示次序",
          dataIndex: "showOrder",
          width: 80
        }, {
          header: "标题",
          dataIndex: "caption",
          width: 200
        }, {
          header: "宽度(px)",
          dataIndex: "width",
          width: 100
        }, {
          header: "取值表名",
          dataIndex: "valueFromTableName",
          width: 200
        }, {
          header: "取值列名",
          dataIndex: "valueFromColName",
          width: 200
        }, {
          header: "显示格式",
          dataIndex: "displayFormat",
          width: 200
        }]
      },
      store: Ext.create("Ext.data.Store", {
        model: modelName,
        autoLoad: false,
        data: []
      })
    });

    return me._colsGrid;
  },

  /**
   * 视图按钮Grid
   * 
   * @private
   */
  getButtonGrid() {
    const me = this;

    if (me._buttonGrid) {
      return me._buttonGrid;
    }

    const modelName = "PSIFvButtons";

    Ext.define(modelName, {
      extend: "Ext.data.Model",
      fields: ["id", "caption"]
    });

    me._buttonGrid = Ext.create("Ext.grid.Panel", {
      cls: "PSI",
      viewConfig: {
        enableTextSelection: true
      },
      title: "业务按钮",
      tbar: [{
        text: "新建按钮",
        handler: me._onAddButton,
        scope: me
      }, "-", {
        text: "编辑按钮",
        handler: me._onEditButton,
        scope: me
      }, "-", {
        text: "删除按钮",
        handler: me._onDeleteButton,
        scope: me
      }],
      columnLines: true,
      columns: {
        defaults: {
          menuDisabled: true,
          sortable: false
        },
        items: [{
          header: "按钮标题",
          dataIndex: "caption",
          width: 200
        }]
      },
      store: Ext.create("Ext.data.Store", {
        model: modelName,
        autoLoad: false,
        data: []
      })
    });

    return me._buttonGrid;
  },

  /**
   * 查询条件Grid
   * 
   * @private
   */
  getQcGrid() {
    const me = this;

    if (me._qcGrid) {
      return me._qcGrid;
    }

    const modelName = "PSIFvQueryCondition";

    Ext.define(modelName, {
      extend: "Ext.data.Model",
      fields: ["id", "caption"]
    });

    me._qcGrid = Ext.create("Ext.grid.Panel", {
      cls: "PSI",
      viewConfig: {
        enableTextSelection: true
      },
      title: "查询条件",
      tbar: [{
        text: "新建查询条件",
        handler: me._onAddQc,
        scope: me
      }, "-", {
        text: "编辑查询条件",
        handler: me._onEditQc,
        scope: me
      }, "-", {
        text: "删除查询条件",
        handler: me._onDeleteQc,
        scope: me
      }],
      columnLines: true,
      columns: {
        defaults: {
          menuDisabled: true,
          sortable: false
        },
        items: [{
          header: "标题",
          dataIndex: "caption",
          width: 200
        }]
      },
      store: Ext.create("Ext.data.Store", {
        model: modelName,
        autoLoad: false,
        data: []
      })
    });

    return me._qcGrid;
  },

  /**
   * 刷新分类Grid中的数据
   * 
   * @param {string} id 如果id不为空，则在数据刷新后，在Grid选中的该id对应的分类
   * 
   * @private
   */
  refreshCategoryGrid(id) {
    const me = this;

    const slnCode = me.comboSolution.getValue();

    const grid = me.getCategoryGrid();
    const el = grid.getEl() || Ext.getBody();
    el.mask(PSI.Const.LOADING);
    const r = {
      url: me.URL("Home/FormView/categoryList"),
      params: {
        slnCode
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
   * 刷新视图Grid中的数据
   * 
   * @param {string} id
   * 
   * @private 
   */
  refreshMainGrid(id) {
    const me = this;

    me.getMainGrid().getStore().reload();
  },

  _onCategoryGridSelect() {
    const me = this;
    me.refreshMainGrid();
  },

  /**
   * 新建分类
   * 
   * @private
   */
  _onAddCategory() {
    const me = this;

    const slnCode = me.comboSolution.getValue();
    const sln = me.comboSolution.findRecordByValue(slnCode);
    if (!sln) {
      me.showInfo("没有选择解决方案");
      return;
    }
    const slnName = sln.get("name");

    const form = Ext.create("PSI.FormView.CategoryEditForm", {
      parentForm: me,
      slnCode, slnName,
    });

    form.show();
  },

  /**
   * 编辑分类
   * 
   * @private
   */
  _onEditCategory() {
    const me = this;

    const slnCode = me.comboSolution.getValue();
    const sln = me.comboSolution.findRecordByValue(slnCode);
    if (!sln) {
      me.showInfo("没有选择解决方案");
      return;
    }
    const slnName = sln.get("name");

    const item = me.getCategoryGrid().getSelectionModel().getSelection();
    if (item == null || item.length != 1) {
      me.showInfo("请选择要编辑的视图分类");
      return;
    }

    const category = item[0];

    if (category.get("isSystem") == 1) {
      me.showInfo("不能编辑系统分类");
      return;
    }

    const form = Ext.create("PSI.FormView.CategoryEditForm", {
      parentForm: me,
      entity: category,
      slnCode, slnName,
    });

    form.show();
  },

  /**
   * 删除分类
   * 
   * @private
   */
  _onDeleteCategory() {
    const me = this;
    const item = me.getCategoryGrid().getSelectionModel().getSelection();
    if (item == null || item.length != 1) {
      me.showInfo("请选择要删除的视图分类");
      return;
    }

    const category = item[0];
    if (category.get("isSystem") == 1) {
      me.showInfo("不能删除系统分类");
      return;
    }

    const store = me.getCategoryGrid().getStore();
    let index = store.findExact("id", category.get("id"));
    index--;
    let preIndex = null;
    const preItem = store.getAt(index);
    if (preItem) {
      preIndex = preItem.get("id");
    }

    const info = `请确认是否删除视图分类: <span style='color:red'>${category.get("name")}</span> ?`;

    const funcConfirm = () => {
      const el = Ext.getBody();
      el.mask("正在删除中...");

      const r = {
        url: me.URL("Home/FormView/deleteViewCategory"),
        params: {
          id: category.get("id")
        },
        callback(options, success, response) {
          el.unmask();

          if (success) {
            const data = me.decodeJSON(response.responseText);
            if (data.success) {
              me.tip("成功完成删除操作", true);
              me.refreshCategoryGrid(preIndex);
            } else {
              me.showInfo(data.msg);
            }
          } else {
            me.showInfo("网络错误");
          }
        }
      };

      me.ajax(r);
    };

    me.confirm(info, funcConfirm);
  },

  /**
   * 视图Grid
   * 
   * @private
   */
  getMainGrid() {
    const me = this;
    if (me._mainGrid) {
      return me._mainGrid;
    }

    const modelName = "PSIGoodsCategory";
    Ext.define(modelName, {
      extend: "Ext.data.Model",
      fields: ["id", "text", "code", "fid", "memo", "mdVersion", "isFixed",
        "moduleName", "leaf", "children", "xtype", "region",
        "widthOrHeight", "layoutType", "dataSourceType", "dataSourceTableName",
        "handlerClassName"]
    });

    const store = Ext.create("Ext.data.TreeStore", {
      model: modelName,
      proxy: {
        type: "ajax",
        actionMethods: {
          read: "POST"
        },
        url: me.URL("Home/FormView/fvList")
      },
      listeners: {
        beforeload: {
          fn() {
            store.proxy.extraParams = me.getQueryParamForMainGrid();
          },
          scope: me
        }
      }

    });

    me._mainGrid = Ext.create("Ext.tree.Panel", {
      cls: "PSI",
      header: {
        height: 30,
        title: me.formatGridHeaderTitle("视图列表")
      },
      store: store,
      rootVisible: false,
      useArrows: true,
      viewConfig: {
        loadMask: true
      },
      columns: {
        defaults: {
          sortable: false,
          menuDisabled: true,
          draggable: true
        },
        items: [{
          xtype: "treecolumn",
          text: "名称",
          dataIndex: "text",
          width: 220
        }, {
          text: "编码",
          dataIndex: "code",
          width: 100
        }, {
          text: "位置",
          dataIndex: "region",
          width: 70
        }, {
          text: "宽度/高度",
          dataIndex: "widthOrHeight",
          align: "right",
          width: 100
        }, {
          text: "布局",
          dataIndex: "layoutType",
          width: 100
        }, {
          text: "数据源",
          dataIndex: "dataSourceType",
          width: 70
        }, {
          text: "数据源表名",
          dataIndex: "dataSourceTableName",
          width: 150
        }, {
          text: "业务逻辑类名",
          dataIndex: "handlerClassName",
          width: 200
        }, {
          text: "版本",
          dataIndex: "mdVersion",
          width: 70
        }, {
          text: "系统固有",
          dataIndex: "isFixed",
          align: "center",
          width: 80
        }, {
          text: "模块名称",
          dataIndex: "moduleName",
          width: 150
        }, {
          text: "xtype",
          dataIndex: "xtype",
          width: 300
        }, {
          text: "fid",
          dataIndex: "fid",
          width: 160
        }, {
          text: "备注",
          dataIndex: "memo",
          width: 200
        }]
      },
      listeners: {
        select: {
          fn(rowModel, record) {
            me._onMainGridNodeSelect(record);
          },
          scope: me
        }
      }
    });

    return me._mainGrid;
  },

  /**
   * @private
   */
  getQueryParamForMainGrid() {
    const me = this;
    const item = me.getCategoryGrid().getSelectionModel().getSelection();
    if (item == null || item.length != 1) {
      return { categoryId: "" };
    }

    const category = item[0];

    return { categoryId: category.get("id") };
  },

  /**
   * @private
   */
  _onMainGridNodeSelect(record) {
    const me = this;

    const fvId = record.get('id');

    me.refreshColsGrid(fvId);
  },

  /**
   * @private
   */
  refreshColsGrid(fvId, colId) {
    const me = this;

    const grid = me.getColsGrid();
    const el = grid.getEl() || Ext.getBody();
    el.mask(PSI.Const.LOADING);
    const r = {
      url: me.URL("Home/FormView/colList"),
      params: {
        fvId: fvId
      },
      callback(options, success, response) {
        const store = grid.getStore();

        store.removeAll();

        if (success) {
          const data = me.decodeJSON(response.responseText);
          store.add(data);

          if (store.getCount() > 0) {
            if (colId) {
              const r = store.findExact("id", colId);
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
   * 新建视图
   * 
   * @private
   */
  _onAddFv() {
    const me = this;
    const slnCode = me.comboSolution.getValue();
    const sln = me.comboSolution.findRecordByValue(slnCode);
    if (!sln) {
      me.showInfo("没有选择解决方案");
      return;
    }
    const slnName = sln.get("name");

    const item = me.getCategoryGrid().getSelectionModel().getSelection();
    if (item == null || item.length != 1) {
      me.showInfo("请选择一个的视图分类");
      return;
    }

    const category = item[0];

    const form = Ext.create("PSI.FormView.FvEditForm", {
      parentForm: me,
      category: category,
      slnCode, slnName,
    });
    form.show();
  },

  /**
   * 编辑视图
   * 
   * @private
   */
  _onEditFv() {
    const me = this;
    const slnCode = me.comboSolution.getValue();
    const sln = me.comboSolution.findRecordByValue(slnCode);
    if (!sln) {
      me.showInfo("没有选择解决方案");
      return;
    }
    const slnName = sln.get("name");

    const item = me.getMainGrid().getSelectionModel().getSelection();
    if (item == null || item.length != 1) {
      me.showInfo("请选择要编辑的视图");
      return;
    }

    const view = item[0];

    const form = Ext.create("PSI.FormView.FvEditForm", {
      parentForm: me,
      entity: view,
      slnCode, slnName,
    });
    form.show();
  },

  /**
   * 删除视图
   * 
   * @private
   */
  _onDeleteFv() {
    const me = this;

    const item = me.getMainGrid().getSelectionModel().getSelection();
    if (item == null || item.length != 1) {
      me.showInfo("请选择要删除的视图");
      return;
    }

    const view = item[0];
    const info = `请确认是否删除视图: <span style='color:red'>${view.get("text")}</span> ？`;

    const funcConfirm = () => {
      const el = Ext.getBody();
      el.mask("正在删除中...");

      const r = {
        url: me.URL("Home/FormView/deleteFv"),
        params: {
          id: view.get("id")
        },
        callback(options, success, response) {
          el.unmask();

          if (success) {
            const data = me.decodeJSON(response.responseText);
            if (data.success) {
              me.tip("成功完成删除操作", true);
              me.refreshMainGrid();
            } else {
              me.showInfo(data.msg);
            }
          } else {
            me.showInfo("网络错误");
          }
        }
      };

      me.ajax(r);
    };

    me.confirm(info, funcConfirm);
  },

  /**
   * 新建列
   * 
   * @private
   */
  _onAddCol() {
    const me = this;

    const item = me.getMainGrid().getSelectionModel().getSelection();
    if (item == null || item.length != 1) {
      me.showInfo("请选择要新建列的视图");
      return;
    }

    const fv = item[0];

    const dsName = fv.get("dataSourceType");
    if (!(dsName == "码表" || dsName == "自定义表单")) {
      me.showInfo("只有码表和自定义表单才能定义视图列");
      return;
    }
    const dsTableName = fv.get("dataSourceTableName");
    if (!dsTableName) {
      me.showInfo("只有设置了数据源表名的视图才能定义视图列");
      return;
    }

    const form = Ext.create("PSI.FormView.FvColEditForm", {
      fv: fv,
      parentForm: me
    });
    form.show();
  },

  /**
   * 编辑列
   * 
   * @private 
   */
  _onEditCol() {
    const me = this;

    let item = me.getMainGrid().getSelectionModel().getSelection();
    if (item == null || item.length != 1) {
      me.showInfo("请选择要编辑列的视图");
      return;
    }

    const fv = item[0];

    item = me.getColsGrid().getSelectionModel().getSelection();
    if (item == null || item.length != 1) {
      me.showInfo("请选择要编辑的列");
      return;
    }
    const col = item[0];

    const form = Ext.create("PSI.FormView.FvColEditForm", {
      fv: fv,
      entity: col,
      parentForm: me
    });
    form.show();
  },

  /**
   * 删除列
   * 
   * @private
   */
  _onDeleteCol() {
    const me = this;
    let item = me.getMainGrid().getSelectionModel().getSelection();
    if (item == null || item.length != 1) {
      me.showInfo("请选择视图");
      return;
    }
    const fv = item[0];

    item = me.getColsGrid().getSelectionModel().getSelection();
    if (item == null || item.length != 1) {
      me.showInfo("请选择要删除的列");
      return;
    }
    const col = item[0];

    const store = me.getColsGrid().getStore();
    let index = store.findExact("id", col.get("id"));
    index--;
    let preIndex = null;
    const preItem = store.getAt(index);
    if (preItem) {
      preIndex = preItem.get("id");
    }

    const info = `请确认是否删除视图列: <span style='color:red'>${col.get("caption")}</span><br /><br />当前操作只删除视图列的元数据，数据库表的字段不会删除`;

    const funcConfirm = () => {
      const el = Ext.getBody();
      el.mask("正在删除中...");

      const r = {
        url: me.URL("Home/FormView/deleteFvCol"),
        params: {
          fvId: fv.get("id"),
          id: col.get("id")
        },
        callback(options, success, response) {
          el.unmask();

          if (success) {
            const data = me.decodeJSON(response.responseText);
            if (data.success) {
              me.tip("成功完成删除操作", true);
              me.refreshColsGrid(fv.get("id"), preIndex);
            } else {
              me.showInfo(data.msg);
            }
          } else {
            me.showInfo("网络错误");
          }
        }
      };

      me.ajax(r);
    };

    me.confirm(info, funcConfirm);
  },

  /**
   * 新建按钮
   * 
   * @private
   */
  _onAddButton() {
    const me = this;
    me.showInfo("TODO")
  },

  /**
   * 编辑按钮
   * 
   * @private
   */
  _onEditButton() {
    const me = this;
    me.showInfo("TODO")
  },

  /**
   * 删除按钮
   * 
   * @private
   */
  _onDeleteButton() {
    const me = this;
    me.showInfo("TODO")
  },

  /**
   * 新建查询条件
   * 
   * @private
   */
  _onAddQc() {
    const me = this;
    me.showInfo("TODO")
  },

  /**
   * 编辑查询条件
   * 
   * @private
   */
  _onEditQc() {
    const me = this;
    me.showInfo("TODO")
  },

  /**
   * 删除查询条件
   * 
   * @private
   */
  _onDeleteQc() {
    const me = this;
    me.showInfo("TODO")
  },

  /**
   *  解决方案combo选中项改变时候的事件处理函数
   * @private
   */
  _onComboSolutionSelect() {
    const me = this;

    me.refreshCategoryGrid();
  },

  /**
   * @private
   */
  querySolutionList() {
    const me = this;
    const el = Ext.getBody();
    const comboCompany = me.comboSolution;
    const store = comboCompany.getStore();
    el.mask(PSI.Const.LOADING);
    const r = {
      url: me.URL("Home/FormView/querySolutionList"),
      callback(options, success, response) {
        el.unmask();
        store.removeAll();

        if (success) {
          const { list, defaultCode } = me.decodeJSON(response.responseText);
          store.add(list);
          if (list.length > 0) {
            if (defaultCode) {
              comboCompany.setValue(defaultCode);
            } else {
              comboCompany.setValue(list[0]["code"]);
            }

            me.refreshCategoryGrid();
          }
        }

      }
    };
    me.ajax(r);
  },
});
