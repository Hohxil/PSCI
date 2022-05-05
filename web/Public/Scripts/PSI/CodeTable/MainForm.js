/**
 * 码表设置 - 主界面
 * 
 * @author 艾格林门信息服务（大连）有限公司
 * @copyright 2015 - present
 * @license GPL v3
 */
PCL.define("PSI.CodeTable.MainForm", {
  extend: "PSI.AFX.Form.MainForm",

  /**
   * @override
   */
  initComponent() {
    const me = this;

    PCL.apply(me, {
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
            items: me.getMainGrid()
          }, {
            region: "south",
            layout: "fit",
            border: 0,
            height: "70%",
            split: true,
            items: [me.getColsGrid()]
          }]
        }, {
          id: "panelCategory",
          xtype: "panel",
          region: "west",
          layout: "fit",
          width: 390,
          split: true,
          collapsible: true,
          header: false,
          border: 0,
          items: [me.getCategoryGrid()]
        }]
      }]
    });

    me.callParent(arguments);

    me.comboSolution = PCL.getCmp("comboSolution");

    me.querySolutionList();
  },

  /**
   * @private
   */
  getToolbarCmp() {
    const me = this;

    const modelName = "PSI_CodeTable_MainForm_PSISolution";
    PCL.define(modelName, {
      extend: "PCL.data.Model",
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
      store: PCL.create("PCL.data.Store", {
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
      text: "新建码表分类",
      handler: me._onAddCategory,
      scope: me
    }, {
      text: "编辑码表分类",
      handler: me._onEditCategory,
      scope: me
    }, {
      text: "删除码表分类",
      handler: me._onDeleteCategory,
      scope: me
    }, "-", {
      text: "新建码表",
      handler: me._onAddCodeTable,
      scope: me
    }, {
      text: "编辑码表",
      handler: me._onEditCodeTable,
      scope: me
    }, {
      text: "删除码表",
      handler: me._onDeleteCodeTable,
      scope: me
    }, "-", {
      text: "工具",
      menu: [{
        text: "把码表转化为系统固有码表",
        scope: me,
        handler: me._onConvertToSys
      }, "-", {
        text: "单个码表的元数据生成SQL语句",
        scope: me,
        handler: me._onGenSQL
      }, "-", {
        text: "整个解决方案的码表生成SQL语句",
        iconCls: "PSI-sql",
        scope: me,
        handler: me._onSolutionGenSQL
      }]
    }, "-", {
      text: "指南",
      handler() {
        me.focus();
        window.open(me.URL("Home/Help/index?t=codetable"));
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

    const modelName = "PSICodeTableCategory";

    PCL.define(modelName, {
      extend: "PCL.data.Model",
      fields: ["id", "code", "name", "isSystem", "isSystemCaption"]
    });

    me._categoryGrid = PCL.create("PCL.grid.Panel", {
      cls: "PSI-FC",
      viewConfig: {
        enableTextSelection: true
      },
      header: {
        height: 30,
        title: me.formatGridHeaderTitle("码表分类")
      },
      tools: [{
        type: "close",
        handler() {
          PCL.getCmp("panelCategory").collapse();
        }
      }],
      columnLines: true,
      columns: {
        defaults: {
          menuDisabled: true,
          sortable: false
        }, items: [{
          header: "分类编码",
          dataIndex: "code",
          width: 100,
        }, {
          header: "码表分类",
          dataIndex: "name",
          width: 200,
        }, {
          header: "系统固有",
          dataIndex: "isSystemCaption",
          width: 80,
          align: "center",
        }]
      },
      store: PCL.create("PCL.data.Store", {
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

    const modelName = "PSICodeTable";

    PCL.define(modelName, {
      extend: "PCL.data.Model",
      fields: ["id", "code", "name", "moduleName", "tableName",
        "memo", "fid", "mdVersion", "isFixed", "isFixedName", "enableParentId",
        "handlerClassName", "editColCnt", "viewPaging", "autoCodeLength", "inputCompany"]
    });

    me._mainGrid = PCL.create("PCL.grid.Panel", {
      cls: "PSI-LC",
      viewConfig: {
        enableTextSelection: true
      },
      header: {
        height: 30,
        title: me.formatGridHeaderTitle("码表")
      },
      columnLines: true,
      columns: {
        defaults: {
          menuDisabled: true,
          sortable: false,
        },
        items: [{
          header: "编码",
          dataIndex: "code",
          width: 120,
          locked: true
        }, {
          header: "码表名称",
          dataIndex: "name",
          width: 200,
          locked: true
        }, {
          header: "模块名称",
          dataIndex: "moduleName",
          width: 200,
        }, {
          header: "数据库表名",
          dataIndex: "tableName",
          width: 200,
        }, {
          header: "fid",
          dataIndex: "fid",
          width: 200,
        }, {
          header: "编辑布局列数",
          dataIndex: "editColCnt",
          width: 100,
          align: "right",
        }, {
          header: "视图分页",
          dataIndex: "viewPaging",
          width: 100,
          align: "center",
        }, {
          header: "自动编码长度",
          dataIndex: "autoCodeLength",
          width: 100,
          align: "right",
        }, {
          header: "版本",
          dataIndex: "mdVersion",
          width: 90,
          align: "rigth",
        }, {
          header: "系统固有",
          dataIndex: "isFixedName",
          width: 80,
          align: "center"
        }, {
          header: "层级数据",
          dataIndex: "enableParentId",
          width: 80,
          align: "center",
          renderer(value) {
            return parseInt(value) == 1 ? "▲" : "";
          }
        }, {
          header: "业务逻辑类名",
          dataIndex: "handlerClassName",
          width: 300,
        }, {
          header: "多公司录入",
          dataIndex: "inputCompany",
          width: 80,
          align: "center",
          renderer(value) {
            return parseInt(value) == 2 ? "▲" : "";
          }
        }, {
          header: "备注",
          dataIndex: "memo",
          width: 300,
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
        },
        itemdblclick: {
          fn: me._onEditCodeTable,
          scope: me
        }
      }
    });

    return me._mainGrid;
  },

  /**
   * @private
   */
  getColsGrid() {
    const me = this;

    if (me._colsGrid) {
      return me._colsGrid;
    }

    const modelName = "PSICodeTableCols";

    PCL.define(modelName, {
      extend: "PCL.data.Model",
      fields: ["id", "caption", "fieldName",
        "fieldType", "fieldLength", "fieldDecimal",
        "valueFrom", "valueFromTableName",
        "valueFromColName", "valueFromColNameDisplay", "mustInput",
        "showOrder", "sysCol", "sysColRawValue", "isVisible",
        "widthInView", "note", "showOrderInView", "editorXtype",
        "colSpan", "defaultValue", "defaultValueExt"]
    });

    me._colsGrid = PCL.create("PCL.grid.Panel", {
      cls: "PSI-LC",
      viewConfig: {
        enableTextSelection: true
      },
      header: {
        height: 30,
        title: me.formatGridHeaderTitle("码表列")
      },
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
      }, "-", {
        text: "调整编辑界面字段顺序",
        handler: me._onChangeEditShowOrder,
        scope: me
      }],
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
          header: "列标题",
          dataIndex: "caption",
          width: 150,
          locked: true,
          renderer(value, metaData, record) {
            if (record.get("sysCol")) {
              return `<span style='color:#520339'>${value}</span>`;
            } else {
              return value;
            }
          },
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
          width: 200
        }, {
          header: "值来源字段(关联用)",
          dataIndex: "valueFromColName",
          width: 150
        }, {
          header: "值来源字段(显示用)",
          dataIndex: "valueFromColNameDisplay",
          width: 150
        }, {
          header: "系统列",
          align: "center",
          dataIndex: "sysCol",
          width: 60
        }, {
          header: "编辑界面中对用户可见",
          align: "center",
          dataIndex: "isVisible",
          width: 150,
          renderer(value) {
            if (value == "不可见") {
              return `<span style='color:gray'>${value}</span>`;
            }
            else {
              return value;
            }
          }
        }, {
          header: "必须录入",
          dataIndex: "mustInput",
          width: 70
        }, {
          header: "编辑器列占位",
          dataIndex: "colSpan",
          width: 100
        }, {
          header: "列视图宽度(px)",
          dataIndex: "widthInView",
          width: 120,
          align: "right"
        }, {
          header: "编辑界面中显示次序",
          dataIndex: "showOrder",
          width: 140,
          align: "right"
        }, {
          header: "视图中显示次序",
          dataIndex: "showOrderInView",
          width: 130,
          align: "right"
        }, {
          header: "编辑器类型",
          dataIndex: "editorXtype",
          width: 130
        }, {
          header: "默认值类型",
          dataIndex: "defaultValue",
          width: 90
        }, {
          header: "默认值",
          dataIndex: "defaultValueExt",
          width: 130
        }, {
          header: "备注",
          dataIndex: "note",
          width: 200
        }]
      },
      store: PCL.create("PCL.data.Store", {
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

    return me._colsGrid;
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

    const form = PCL.create("PSI.CodeTable.CategoryEditForm", {
      parentForm: me,
      slnCode, slnName,
    });

    form.show();
  },

  /**
   * @private
   */
  refreshCategoryGrid(id) {
    const me = this;
    const grid = me.getCategoryGrid();

    const slnCode = me.comboSolution.getValue();

    const el = grid.getEl() || PCL.getBody();
    el.mask(PSI.Const.LOADING);
    const r = {
      url: me.URL("Home/CodeTable/categoryList"),
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
      me.showInfo("请选择要编辑的码表分类");
      return;
    }

    const category = item[0];

    if (category.get("isSystem") == 1) {
      me.showInfo("不能编辑系统分类");
      return;
    }

    const form = PCL.create("PSI.CodeTable.CategoryEditForm", {
      parentForm: me,
      entity: category,
      slnCode, slnName,
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
      me.showInfo("请选择要删除的码表分类");
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

    const info = `请确认是否删除码表分类: <span style='color:red'>${category.get("name")}</span> ?`;

    const funcConfirm = () => {
      const el = PCL.getBody();
      el.mask("正在删除中...");

      const r = {
        url: me.URL("Home/CodeTable/deleteCodeTableCategory"),
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
  refreshMainGrid(id) {
    const me = this;
    me.getColsGrid().setTitle(me.formatGridHeaderTitle("码表列"));
    me.getColsGrid().getStore().removeAll();

    const item = me.getCategoryGrid().getSelectionModel().getSelection();
    if (item == null || item.length != 1) {
      me.getMainGrid().setTitle(me.formatGridHeaderTitle("码表"));
      return;
    }

    const category = item[0];

    const grid = me.getMainGrid();
    grid.setTitle(me.formatGridHeaderTitle(`<span class='PSI-title-keyword'>${category.get("name")}</span> - 码表`));
    const el = grid.getEl() || PCL.getBody();
    el.mask(PSI.Const.LOADING);
    const r = {
      url: me.URL("Home/CodeTable/codeTableList"),
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
  _onAddCodeTable() {
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
      me.showInfo("请选择一个的码表分类");
      return;
    }

    const category = item[0];

    const form = PCL.create("PSI.CodeTable.CodeTableEditForm", {
      parentForm: me,
      category,
      slnCode,
      slnName,
    });
    form.show();
  },

  /**
   * @private
   */
  _onEditCodeTable() {
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
      me.showInfo("请选择要编辑的码表");
      return;
    }

    const codeTable = item[0];

    const form = PCL.create("PSI.CodeTable.CodeTableEditForm", {
      parentForm: me,
      entity: codeTable,
      slnCode,
      slnName,
    });
    form.show();
  },

  /**
   * @private
   */
  _onMainGridSelect() {
    const me = this;
    me.refreshColsGrid();
  },

  /**
   * @private
   */
  refreshColsGrid(id) {
    const me = this;
    const item = me.getMainGrid().getSelectionModel().getSelection();
    if (item == null || item.length != 1) {
      me.getMainGrid().setTitle(me.formatGridHeaderTitle("码表"));
      me.getColsGrid().setTitle(me.formatGridHeaderTitle("码表列"));
      return;
    }

    const codeTable = item[0];

    const grid = me.getColsGrid();
    grid.setTitle(me.formatGridHeaderTitle(`<span class='PSI-title-keyword'>${codeTable.get("name")}</span> - 列`));
    const el = grid.getEl() || PCL.getBody();
    el.mask(PSI.Const.LOADING);
    const r = {
      url: me.URL("Home/CodeTable/codeTableColsList"),
      params: {
        id: codeTable.get("id")
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
  _onDeleteCodeTable() {
    const me = this;
    const item = me.getMainGrid().getSelectionModel().getSelection();
    if (item == null || item.length != 1) {
      me.showInfo("请选择要删除的码表");
      return;
    }

    const codeTable = item[0];

    const store = me.getMainGrid().getStore();
    let index = store.findExact("id", codeTable.get("id"));
    index--;
    let preIndex = null;
    const preItem = store.getAt(index);
    if (preItem) {
      preIndex = preItem.get("id");
    }

    const info = `请确认是否删除码表: <span style='color:red'>${codeTable.get("name")}</span> ?<br /><br />当前操作只删除码表元数据，数据库实际表不会删除`;

    const funcConfirm = () => {
      const el = PCL.getBody();
      el.mask("正在删除中...");

      const r = {
        url: me.URL("Home/CodeTable/deleteCodeTable"),
        params: {
          id: codeTable.get("id")
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
  _onAddCol() {
    const me = this;

    const item = me.getMainGrid().getSelectionModel().getSelection();
    if (item == null || item.length != 1) {
      me.showInfo("请选择要新建列的码表");
      return;
    }

    const codeTable = item[0];

    const form = PCL.create("PSI.CodeTable.CodeTableColEditForm", {
      codeTable: codeTable,
      parentForm: me
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
      me.showInfo("请选择要编辑列的码表");
      return;
    }

    const codeTable = item[0];

    item = me.getColsGrid().getSelectionModel().getSelection();
    if (item == null || item.length != 1) {
      me.showInfo("请选择要编辑的列");
      return;
    }
    const col = item[0];

    const form = PCL.create("PSI.CodeTable.CodeTableColEditForm", {
      codeTable: codeTable,
      entity: col,
      parentForm: me
    });
    form.show();
  },

  /**
   * 删除码表列
   * 
   * @private
   */
  _onDeleteCol() {
    const me = this;
    let item = me.getMainGrid().getSelectionModel().getSelection();
    if (item == null || item.length != 1) {
      me.showInfo("请选择码表");
      return;
    }
    const codeTable = item[0];

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

    const info = "请确认是否删除码表列: <span style='color:red'>"
      + col.get("caption")
      + "</span><br /><br />当前操作只删除码表列的元数据，数据库表的字段不会删除";

    const funcConfirm = () => {
      const el = PCL.getBody();
      el.mask("正在删除中...");

      const r = {
        url: me.URL("Home/CodeTable/deleteCodeTableCol"),
        params: {
          tableId: codeTable.get("id"),
          id: col.get("id")
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
   * @private
   */
  _onConvertToSys() {
    const me = this;
    const item = me.getMainGrid().getSelectionModel().getSelection();
    if (item == null || item.length != 1) {
      me.showInfo("请选择要操作的码表");
      return;
    }

    const codeTable = item[0];

    const info = "请确认是否把码表: <span style='color:red'>"
      + codeTable.get("name")
      + "</span> 转化为系统固有码表?";
    const id = codeTable.get("id");

    const funcConfirm = () => {
      const el = PCL.getBody();
      el.mask("正在处理中...");

      const r = {
        url: me.URL("Home/CodeTable/convertCodeTable"),
        params: {
          id: id
        },
        callback(options, success, response) {
          el.unmask();

          if (success) {
            const data = me.decodeJSON(response.responseText);
            if (data.success) {
              me.tip("成功完成操作", true);
              me.refreshMainGrid(id);
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
   * 调整编辑界面字段显示次序
   * 
   * @private
   */
  _onChangeEditShowOrder() {
    const me = this;

    const item = me.getMainGrid().getSelectionModel().getSelection();
    if (item == null || item.length != 1) {
      me.showInfo("请选择码表");
      return;
    }

    const codeTable = item[0];

    const form = PCL.create("PSI.CodeTable.CodeTableEditColShowOrderForm", {
      codeTable: codeTable,
      parentForm: me
    });
    form.show();
  },

  /**
   * 生成SQL语句
   * 
   * @private
   */
  _onGenSQL() {
    const me = this;
    const item = me.getMainGrid().getSelectionModel().getSelection();
    if (item == null || item.length != 1) {
      me.showInfo("请选择码表");
      return;
    }

    const codeTable = item[0];

    const form = PCL.create("PSI.CodeTable.CodeTableGenSQLForm", {
      codeTable
    });
    form.show();
  },

  /**
   * 解决方案combo选中项改变的时候的事件处理函数
   * @private
   */
  _onComboSolutionSelect() {
    const me = this;

    me.getMainGrid().setTitle(me.formatGridHeaderTitle("码表"));
    me.getMainGrid().getStore().removeAll();
    me.getColsGrid().setTitle(me.formatGridHeaderTitle("码表列"));
    me.getColsGrid().getStore().removeAll();

    me.refreshCategoryGrid();
  },

  /**
   * @private
   */
  querySolutionList() {
    const me = this;
    const el = PCL.getBody();
    const comboCompany = me.comboSolution;
    const store = comboCompany.getStore();
    el.mask(PSI.Const.LOADING);
    const r = {
      url: me.URL("Home/CodeTable/querySolutionList"),
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

  /**
   * 整个解决方案的码表生成SQL语句
   * 
   * @private
   */
  _onSolutionGenSQL() {
    const me = this;

    const slnCode = me.comboSolution.getValue();
    const sln = me.comboSolution.findRecordByValue(slnCode);
    if (!sln) {
      me.showInfo("没有选择解决方案");
      return;
    }

    const form = PCL.create("PSI.CodeTable.CodeTableSolutionGenSQLForm", {
      slnCode
    });
    form.show();
  }
});
