/**
 * 自定义表单 - 主界面
 * 
 * @author 艾格林门信息服务（大连）有限公司
 * @copyright 2015 - present
 * @license GPL v3
 */
Ext.define("PSI.Form.MainForm", {
  extend: "PSI.AFX.Form.MainForm",

  /**
   * @overrides
   */
  initComponent() {
    const me = this;

    Ext.apply(me, {
      tbar: me.getToolbarCmp(),
      layout: "border",
      items: [{
        region: "center",
        layout: "border",
        border: 0,
        items: [{
          region: "north",
          height: 2,
          border: 0,
        }, {
          region: "center",
          xtype: "panel",
          layout: "border",
          border: 0,
          items: [{
            region: "center",
            layout: "fit",
            border: 0,
            items: [me.getMainGrid()]
          }, {
            region: "south",
            layout: "fit",
            border: 0,
            height: "60%",
            split: true,
            items: [{
              xtype: "tabpanel",
              border: 0,
              items: [{
                title: "主表列",
                layout: "fit",
                border: 0,
                items: me.getColsGrid()
              }, {
                title: "明细表",
                border: 0,
                layout: "border",
                items: [{
                  region: "west",
                  border: 0,
                  width: 300,
                  layout: "fit",
                  split: true,
                  items: [me.getDetailGrid()]
                }, {
                  region: "center",
                  border: 0,
                  layout: "fit",
                  items: [me.getDetailColsGrid()]
                }]
              }, {
                title: "查询条件",
                border: 0,
                layout: "fit",
                items: []
              }, {
                title: "业务按钮",
                border: 0,
                layout: "fit",
                items: []
              }]
            }]
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

    me.comboSolution = Ext.getCmp("comboSolution");

    me.querySolutionList();
  },

  /**
   * @private
   */
  getToolbarCmp() {
    const me = this;

    const modelName = "PSI_Form_MainForm_PSISolution";
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
      text: "新建表单分类",
      handler: me._onAddCategory,
      scope: me
    }, {
      text: "编辑表单分类",
      handler: me._onEditCategory,
      scope: me
    }, {
      text: "删除表单分类",
      handler: me._onDeleteCategory,
      scope: me
    }, "-", {
      text: "新建表单",
      handler: me._onAddForm,
      scope: me
    }, {
      text: "编辑表单",
      handler: me._onEditForm,
      scope: me
    }, {
      text: "删除表单",
      handler: me._onDeleteForm,
      scope: me
    }, "-", {
      text: "指南",
      handler() {
        me.focus();
        window.open(me.URL("Home/Help/index?t=form"));
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

    if (me.__categoryGrid) {
      return me.__categoryGrid;
    }

    const modelName = "PSIFormCategory";

    Ext.define(modelName, {
      extend: "Ext.data.Model",
      fields: ["id", "code", "name"]
    });

    me.__categoryGrid = Ext.create("Ext.grid.Panel", {
      cls: "PSI",
      viewConfig: {
        enableTextSelection: true
      },
      header: {
        height: 30,
        title: me.formatGridHeaderTitle("表单分类")
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
        header: "表单分类",
        dataIndex: "name",
        width: 200,
        menuDisabled: true,
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
        },
        itemdblclick: {
          fn: me._onEditCategory,
          scope: me
        }
      }
    });

    return me.__categoryGrid;
  },

  /**
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

    const form = Ext.create("PSI.Form.CategoryEditForm", {
      parentForm: me,
      slnCode,
      slnName,
    });

    form.show();
  },

  /**
   * @private
   */
  _onEditCategory() {
    const me = this;

    const item = me.getCategoryGrid().getSelectionModel().getSelection();
    if (item == null || item.length != 1) {
      me.showInfo("请选择要编辑的表单分类");
      return;
    }

    const category = item[0];

    const form = Ext.create("PSI.Form.CategoryEditForm", {
      parentForm: me,
      entity: category
    });

    form.show();
  },

  /**
   * @private
   */
  _onDeleteCategory() {
    const me = this;
    const item = me.getCategoryGrid().getSelectionModel().getSelection();
    if (item == null || item.length != 1) {
      me.showInfo("请选择要删除的表单分类");
      return;
    }

    const category = item[0];

    const store = me.getCategoryGrid().getStore();
    let index = store.findExact("id", category.get("id"));
    index--;
    let preIndex = null;
    const preItem = store.getAt(index);
    if (preItem) {
      preIndex = preItem.get("id");
    }

    const info = `请确认是否删除表单分类: <span style='color:red'>${category.get("name")}</span> ？`;

    const funcConfirm = () => {
      const el = Ext.getBody();
      el.mask("正在删除中...");

      const r = {
        url: me.URL("Home/Form/deleteFormCategory"),
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
   * @private
   */
  _onCategoryGridSelect() {
    const me = this;

    me.refreshMainGrid();
  },

  /**
   * @private
   */
  getMainGrid() {
    const me = this;

    if (me.__mainGrid) {
      return me.__mainGrid;
    }

    const modelName = "PSIForm";

    Ext.define(modelName, {
      extend: "Ext.data.Model",
      fields: ["id", "code", "name", "tableName", "memo", "mdVersion",
        "sysForm", "fid", "moduleName"]
    });

    me.__mainGrid = Ext.create("Ext.grid.Panel", {
      cls: "PSI",
      viewConfig: {
        enableTextSelection: true
      },
      header: {
        height: 30,
        title: me.formatGridHeaderTitle("表单")
      },
      columnLines: true,
      columns: [{
        header: "编码",
        dataIndex: "code",
        width: 80,
        menuDisabled: true,
        sortable: false
      }, {
        header: "表单名称",
        dataIndex: "name",
        width: 200,
        menuDisabled: true,
        sortable: false
      }, {
        header: "数据库表名",
        dataIndex: "tableName",
        width: 200,
        menuDisabled: true,
        sortable: false
      }, {
        header: "fid",
        dataIndex: "fid",
        width: 150,
        menuDisabled: true,
        sortable: false
      }, {
        header: "模块名称",
        dataIndex: "moduleName",
        width: 200,
        menuDisabled: true,
        sortable: false
      }, {
        header: "备注",
        dataIndex: "memo",
        width: 300,
        menuDisabled: true,
        sortable: false
      }, {
        header: "版本",
        dataIndex: "mdVersion",
        width: 90,
        menuDisabled: true,
        sortable: false
      }, {
        header: "系统固有",
        dataIndex: "sysForm",
        width: 80,
        menuDisabled: true,
        sortable: false,
        renderer(value) {
          return parseInt(value) == 1 ? "是" : "否";
        }
      }],
      store: Ext.create("Ext.data.Store", {
        model: modelName,
        autoLoad: false,
        data: []
      }),
      listeners: {
        select: {
          fn: me._onMainGridSelect,
          scope: me
        },
        itemdblclick: {
          fn: me._onEditForm,
          scope: me
        }
      }
    });

    return me.__mainGrid;
  },

  /**
   * @private
   */
  _onMainGridSelect() {
    const me = this;

    me.refreshColsGrid();
    me.refreshDetailGrid();
  },

  /**
   * @private
   */
  refreshMainGrid(id) {
    const me = this;

    me.getColsGrid().getStore().removeAll();
    me.getDetailGrid().getStore().removeAll();
    me.getDetailColsGrid().getStore().removeAll();

    const item = me.getCategoryGrid().getSelectionModel().getSelection();
    if (item == null || item.length != 1) {
      me.getMainGrid().setTitle(me.formatGridHeaderTitle("表单"));
      return;
    }

    const category = item[0];

    const grid = me.getMainGrid();
    grid.setTitle(me.formatGridHeaderTitle(`属于分类[${category.get("name")}]的表单`));
    const el = grid.getEl() || Ext.getBody();
    el.mask(PSI.Const.LOADING);
    const r = {
      url: me.URL("Home/Form/formList"),
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

        el && el.unmask();
      }
    };

    me.ajax(r);
  },

  /**
   * @private
   */
  refreshColsGrid(id) {
    const me = this;
    const item = me.getMainGrid().getSelectionModel().getSelection();
    if (item == null || item.length != 1) {
      return;
    }

    const form = item[0];

    const grid = me.getColsGrid();
    const el = grid.getEl();
    el && el.mask(PSI.Const.LOADING);
    const r = {
      url: me.URL("Home/form/formColList"),
      params: {
        id: form.get("id")
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

        el && el.unmask();
      }
    };

    me.ajax(r);
  },

  /**
   * @private
   */
  refreshDetailGrid(id) {
    const me = this;
    const item = me.getMainGrid().getSelectionModel().getSelection();
    if (item == null || item.length != 1) {
      return;
    }

    const form = item[0];

    const grid = me.getDetailGrid();
    const el = grid.getEl();
    el && el.mask(PSI.Const.LOADING);
    const r = {
      url: me.URL("Home/form/formDetailList"),
      params: {
        id: form.get("id")
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

        el && el.unmask();
      }
    };

    me.ajax(r);
  },

  /**
   * @private
   */
  refreshDetailColsGrid(id) {
    const me = this;
    const item = me.getDetailGrid().getSelectionModel().getSelection();
    if (item == null || item.length != 1) {
      return;
    }

    const formDetail = item[0];

    const grid = me.getDetailColsGrid();
    const el = grid.getEl() || Ext.getBody();
    el.mask(PSI.Const.LOADING);
    const r = {
      url: me.URL("Home/form/formDetailColList"),
      params: {
        id: formDetail.get("id")
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
  _onAddForm() {
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
      me.showInfo("请选择一个的表单分类");
      return;
    }

    const category = item[0];

    const form = Ext.create("PSI.Form.FormEditForm", {
      parentForm: me,
      category: category,
      slnCode,
      slnName,
    });
    form.show();
  },

  /**
   * @private
   */
  _onEditForm() {
    const me = this;

    const slnCode = me.comboSolution.getValue();
    const sln = me.comboSolution.findRecordByValue(slnCode);
    if (!sln) {
      me.showInfo("没有选择解决方案");
      return;
    }
    const slnName = sln.get("name");

    let item = me.getCategoryGrid().getSelectionModel().getSelection();
    if (item == null || item.length != 1) {
      me.showInfo("请选择一个的表单分类");
      return;
    }

    const category = item[0];

    item = me.getMainGrid().getSelectionModel().getSelection();
    if (item == null || item.length != 1) {
      me.showInfo("请选择要编辑的表单");
      return;
    }

    const fm = item[0];

    const form = Ext.create("PSI.Form.FormEditForm", {
      parentForm: me,
      entity: fm,
      category: category,
      slnCode,
      slnName,
    });
    form.show();
  },

  /**
   * 删除表单元数据
   * 
   * @private
   */
  _onDeleteForm() {
    const me = this;
    const item = me.getMainGrid().getSelectionModel().getSelection();
    if (item == null || item.length != 1) {
      me.showInfo("请选择要删除的表单");
      return;
    }

    const form = item[0];

    const store = me.getMainGrid().getStore();
    let index = store.findExact("id", form.get("id"));
    index--;
    let preIndex = null;
    const preItem = store.getAt(index);
    if (preItem) {
      preIndex = preItem.get("id");
    }

    const info = `请确认是否删除表单: <span style='color:red'>${form.get("name")}</span> ？<br /><br />当前操作只删除表单元数据，数据库表不会删除`;

    const funcConfirm = () => {
      const el = Ext.getBody();
      el.mask("正在删除中...");

      const r = {
        url: me.URL("Home/Form/deleteForm"),
        params: {
          id: form.get("id")
        },
        callback(options, success, response) {
          el.unmask();

          if (success) {
            const data = me.decodeJSON(response.responseText);
            if (data.success) {
              me.tip("成功完成删除操作", true);
              me.refreshMainGrid(preIndex);
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
   * @private
   */
  refreshCategoryGrid(id) {
    const me = this;
    const grid = me.getCategoryGrid();

    const slnCode = me.comboSolution.getValue();

    const el = grid.getEl() || Ext.getBody();
    el.mask(PSI.Const.LOADING);
    const r = {
      url: me.URL("Home/Form/categoryList"),
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
   * @private
   */
  getColsGrid() {
    const me = this;

    if (me.__colsGrid) {
      return me.__colsGrid;
    }

    const modelName = "PSIFormCols";

    Ext.define(modelName, {
      extend: "Ext.data.Model",
      fields: ["id", "caption", "fieldName",
        "fieldType", "fieldLength", "fieldDecimal",
        "valueFrom", "valueFromTableName",
        "valueFromColName", "valueFromColNameDisplay", "mustInput",
        "showOrder", "sysCol", "isVisible", "note", "editorXtype",
        "colSpan", "dataIndex", "widthInView", "showOrderInView"]
    });

    me.__colsGrid = Ext.create("Ext.grid.Panel", {
      cls: "PSI",
      viewConfig: {
        enableTextSelection: true
      },
      border: 0,
      tbar: [{
        text: "新建主表列",
        handler: me._onAddCol,
        scope: me
      }, "-", {
        text: "编辑主表列",
        handler: me._onEditCol,
        scope: me
      }, "-", {
        text: "删除主表列",
        handler: me._onDeleteCol,
        scope: me
      }],
      columnLines: true,
      columns: {
        defaults: {
          menuDisabled: true,
          sortable: false
        },
        items: [Ext.create("Ext.grid.RowNumberer", {
          text: "#",
          align: "center",
          width: 60
        }), {
          header: "列标题",
          dataIndex: "caption",
          width: 150,
          locked: true
        }, {
          header: "列数据库名",
          dataIndex: "fieldName",
          width: 150
        }, {
          header: "列数据类型",
          dataIndex: "fieldType",
          width: 80
        }, {
          header: "列数据长度",
          dataIndex: "fieldLength",
          align: "right",
          width: 90
        }, {
          header: "列小数位数",
          dataIndex: "fieldDecimal",
          align: "right",
          width: 90
        }, {
          header: "值来源",
          dataIndex: "valueFrom",
          width: 120
        }, {
          header: "值来源表",
          dataIndex: "valueFromTableName",
          width: 150
        }, {
          header: "值来源字段(关联用)",
          dataIndex: "valueFromColName",
          width: 150
        }, {
          header: "值来源字段(显示用)",
          dataIndex: "valueFromColNameDisplay",
          width: 150
        }, {
          header: "系统字段",
          dataIndex: "sysCol",
          width: 70
        }, {
          header: "对用户可见",
          dataIndex: "isVisible",
          width: 80
        }, {
          header: "必须录入",
          dataIndex: "mustInput",
          width: 70
        }, {
          header: "编辑界面中显示次序",
          dataIndex: "showOrder",
          width: 140,
          align: "right"
        }, {
          header: "编辑器类型",
          dataIndex: "editorXtype",
          width: 130
        }, {
          header: "编辑器列占位",
          dataIndex: "colSpan",
          align: "right",
          width: 130
        }, {
          header: "dataIndex",
          dataIndex: "dataIndex"
        }, {
          header: "列宽度(px)",
          align: "right",
          dataIndex: "widthInView"
        }, {
          header: "视图界面中显示次序",
          dataIndex: "showOrderInView",
          width: 140,
          align: "right"
        }, {
          header: "备注",
          dataIndex: "note",
          width: 200
        }]
      },
      store: Ext.create("Ext.data.Store", {
        model: modelName,
        autoLoad: false,
        data: []
      }),
      listeners: {
        itemdblclick: {
          fn: me._onEditCol,
          scope: me
        }
      }
    });

    return me.__colsGrid;
  },

  /**
   * @private
   */
  getDetailGrid() {
    const me = this;

    if (me.__detailGrid) {
      return me.__detailGrid;
    }

    const modelName = "PSIFormDetail";

    Ext.define(modelName, {
      extend: "Ext.data.Model",
      fields: ["id", "name", "tableName", "fkName", "showOrder"]
    });

    me.__detailGrid = Ext.create("Ext.grid.Panel", {
      cls: "PSI",
      viewConfig: {
        enableTextSelection: true
      },
      border: 0,
      header: {
        height: 30,
        title: me.formatGridHeaderTitle("明细表")
      },
      tbar: [{
        text: "新建明细表",
        handler: me._onAddFormDetail,
        scope: me
      }, "-", {
        text: "编辑明细表",
        handler: me._onEditFormDetail,
        scope: me
      }, "-", {
        text: "删除明细表",
        handler: me._onDeleteFormDetail,
        scope: me
      }],
      columnLines: true,
      columns: [{
        header: "明细表名称",
        dataIndex: "name",
        width: 200,
        menuDisabled: true,
        sortable: false
      }, {
        header: "数据库表名",
        dataIndex: "tableName",
        width: 200,
        menuDisabled: true,
        sortable: false
      }, {
        header: "外键",
        dataIndex: "fkName",
        width: 200,
        menuDisabled: true,
        sortable: false
      }, {
        header: "显示次序",
        dataIndex: "showOrder",
        width: 100,
        align: "right",
        menuDisabled: true,
        sortable: false
      }],
      store: Ext.create("Ext.data.Store", {
        model: modelName,
        autoLoad: false,
        data: []
      }),
      listeners: {
        select: {
          fn: me._onDetailGridSelect,
          scope: me
        }
      }
    });

    return me.__detailGrid;
  },

  /**
   * @private
   */
  _onDetailGridSelect() {
    const me = this;

    me.refreshDetailColsGrid();
  },

  /**
   * @private
   */
  getDetailColsGrid() {
    const me = this;

    if (me.__detailColsGrid) {
      return me.__detailColsGrid;
    }

    const modelName = "PSIFormDetailCols";

    Ext.define(modelName, {
      extend: "Ext.data.Model",
      fields: ["id", "caption", "fieldName",
        "fieldType", "fieldLength", "fieldDecimal",
        "valueFrom", "valueFromTableName",
        "valueFromColName", "valueFromColNameDisplay", "mustInput",
        "showOrder", "sysCol", "isVisible",
        "widthInView", "note", "editorXtype", "dataIndex"]
    });

    me.__detailColsGrid = Ext.create("Ext.grid.Panel", {
      cls: "PSI",
      viewConfig: {
        enableTextSelection: true
      },
      border: 0,
      header: {
        height: 30,
        title: me.formatGridHeaderTitle("明细表列")
      },
      tbar: [{
        text: "新建列",
        handler: me._onAddDetailCol,
        scope: me
      }, "-", {
        text: "编辑列",
        handler: me._onEditDetailCol,
        scope: me
      }, "-", {
        text: "删除列",
        handler: me._onDeleteDetailCol,
        scope: me
      }],
      columnLines: true,
      columns: {
        defaults: {
          menuDisabled: true,
          sortable: false
        },
        items: [Ext.create("Ext.grid.RowNumberer", {
          text: "#",
          align: "center",
          width: 60
        }), {
          header: "列标题",
          dataIndex: "caption",
          width: 150,
          locked: true
        }, {
          header: "列数据库名",
          dataIndex: "fieldName",
          width: 150
        }, {
          header: "列数据类型",
          dataIndex: "fieldType",
          width: 80
        }, {
          header: "列数据长度",
          dataIndex: "fieldLength",
          align: "right",
          width: 90
        }, {
          header: "列小数位数",
          dataIndex: "fieldDecimal",
          align: "right",
          width: 90
        }, {
          header: "值来源",
          dataIndex: "valueFrom",
          width: 120
        }, {
          header: "值来源表",
          dataIndex: "valueFromTableName",
          width: 150
        }, {
          header: "值来源字段(关联用)",
          dataIndex: "valueFromColName",
          width: 150
        }, {
          header: "值来源字段(显示用)",
          dataIndex: "valueFromColNameDisplay",
          width: 150
        }, {
          header: "系统字段",
          dataIndex: "sysCol",
          width: 70
        }, {
          header: "对用户可见",
          dataIndex: "isVisible",
          width: 80
        }, {
          header: "必须录入",
          dataIndex: "mustInput",
          width: 70
        }, {
          header: "列宽度(px)",
          dataIndex: "widthInView",
          width: 120,
          align: "right"
        }, {
          header: "列显示次序",
          dataIndex: "showOrder",
          width: 140,
          align: "right"
        }, {
          header: "编辑器类型",
          dataIndex: "editorXtype",
          width: 130
        }, {
          header: "dataIndex",
          dataIndex: "dataIndex"
        }, {
          header: "备注",
          dataIndex: "note",
          width: 200
        }]
      },
      store: Ext.create("Ext.data.Store", {
        model: modelName,
        autoLoad: false,
        data: []
      })
    });

    return me.__detailColsGrid;
  },

  /**
   * @private
   */
  _onAddCol() {
    const me = this;

    const item = me.getMainGrid().getSelectionModel().getSelection();
    if (item == null || item.length != 1) {
      me.showInfo("请先选择表单");
      return;
    }

    const fm = item[0];

    const form = Ext.create("PSI.Form.FormColEditForm", {
      parentForm: me,
      form: fm
    });
    form.show();
  },

  /**
   * @private
   */
  _onEditCol() {
    const me = this;

    let item = me.getMainGrid().getSelectionModel().getSelection();
    if (item == null || item.length != 1) {
      me.showInfo("请先选择表单");
      return;
    }
    const fm = item[0];

    item = me.getColsGrid().getSelectionModel().getSelection();
    if (item == null || item.length != 1) {
      me.showInfo("请选择要编辑的表单主表列");
      return;
    }
    const col = item[0];

    const form = Ext.create("PSI.Form.FormColEditForm", {
      parentForm: me,
      form: fm,
      entity: col
    });
    form.show();
  },

  /**
   * 删除主表列
   * 
   * @private
   */
  _onDeleteCol() {
    const me = this;
    let item = me.getMainGrid().getSelectionModel().getSelection();
    if (item == null || item.length != 1) {
      me.showInfo("请选择表单");
      return;
    }

    const form = item[0];

    item = me.getColsGrid().getSelectionModel().getSelection();
    if (item == null || item.length != 1) {
      me.showInfo("请选择要删除的表单主表列");
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

    const info = `请确认是否删除表单主表列: <span style='color:red'>${col.get("caption")}</span>?<br /><br />当前操作只删除主表列元数据，数据库表的字段不会删除`;

    const funcConfirm = () => {
      const el = Ext.getBody();
      el.mask("正在删除中...");

      const r = {
        url: me.URL("Home/Form/deleteFormCol"),
        params: {
          id: col.get("id"),
          formId: form.get("id")
        },
        callback(options, success, response) {
          el.unmask();

          if (success) {
            const data = me.decodeJSON(response.responseText);
            if (data.success) {
              me.tip("成功完成删除操作", true);
              me.refreshColsGrid(preIndex);
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
   * 新建明细表
   * 
   * @private
   */
  _onAddFormDetail() {
    const me = this;
    me.showInfo("TODO");
  },

  /**
   * @private
   */
  _onEditFormDetail() {
    const me = this;
    me.showInfo("TODO");
  },

  /**
   * @private
   */
  _onDeleteFormDetail() {
    const me = this;
    me.showInfo("TODO");
  },

  /**
   * 新建明细表的列
   * 
   * @private
   */
  _onAddDetailCol() {
    const me = this;

    const item = me.getDetailGrid().getSelectionModel().getSelection();
    if (item == null || item.length != 1) {
      me.showInfo("请先选择明细表");
      return;
    }

    const fm = item[0];

    const form = Ext.create("PSI.Form.FormDetailColEditForm", {
      parentForm: me,
      form: fm
    });
    form.show();
  },

  /**
   * 编辑明细表的列
   * 
   * @private
   */
  _onEditDetailCol() {
    const me = this;
    let item = me.getDetailGrid().getSelectionModel().getSelection();
    if (item == null || item.length != 1) {
      me.showInfo("请先选择明细表");
      return;
    }

    const fm = item[0];

    item = me.getDetailColsGrid().getSelectionModel().getSelection();
    if (item == null || item.length != 1) {
      me.showInfo("请选择要编辑的明细表列");
      return;
    }
    const col = item[0];

    const form = Ext.create("PSI.Form.FormDetailColEditForm", {
      parentForm: me,
      form: fm,
      entity: col
    });
    form.show();
  },

  /**
   * 删除明细表列
   * 
   * @private
   */
  _onDeleteDetailCol() {
    const me = this;
    let item = me.getDetailGrid().getSelectionModel().getSelection();
    if (item == null || item.length != 1) {
      me.showInfo("请选择明细表");
      return;
    }

    const form = item[0];

    item = me.getDetailColsGrid().getSelectionModel().getSelection();
    if (item == null || item.length != 1) {
      me.showInfo("请选择要删除的明细表列");
      return;
    }

    const col = item[0];

    const store = me.getDetailColsGrid().getStore();
    let index = store.findExact("id", col.get("id"));
    index--;
    let preIndex = null;
    const preItem = store.getAt(index);
    if (preItem) {
      preIndex = preItem.get("id");
    }

    const info = `请确认是否删除明细表列: <span style='color:red'>${col.get("caption")}</span>?<br /><br />当前操作只删除明细表列元数据，数据库表的字段不会删除`;

    const funcConfirm = () => {
      const el = Ext.getBody();
      el.mask("正在删除中...");

      const r = {
        url: me.URL("Home/Form/deleteFormDetailCol"),
        params: {
          id: col.get("id"),
          formId: form.get("id")
        },
        callback(options, success, response) {
          el.unmask();

          if (success) {
            const data = me.decodeJSON(response.responseText);
            if (data.success) {
              me.tip("成功完成删除操作", true);
              me.refreshDetailColsGrid(preIndex);
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
   * 解决方案Combo选择项变动的时候的事件处理函数
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
      url: me.URL("Home/Form/querySolutionList"),
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
