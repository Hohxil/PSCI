/**
 * 会计科目 - 主界面
 * 
 * @author 艾格林门信息服务（大连）有限公司
 * @copyright 2015 - present
 * @license GPL v3
 */
PCL.define("PSI.SLN0002.Subject.MainForm", {
  extend: "PSI.AFX.Form.MainForm",

  /**
   * 初始化组件
   * 
   * @override
   */
  initComponent() {
    const me = this;

    PCL.apply(me, {
      tbar: me.getToolbarCmp(),
      items: [{
        region: "north",
        border: 0,
        height: 2,
      }, {
        id: "companyPanel",
        region: "west",
        width: 300,
        layout: "fit",
        border: 0,
        split: true,
        header: false,
        collapsible: true,
        items: [me.getCompanyGrid()]
      }, {
        region: "center",
        xtype: "panel",
        layout: "border",
        border: 0,
        items: [{
          region: "north",
          height: "40%",
          layout: "fit",
          split: true,
          border: 0,
          items: me.getMainGrid()
        }, {
          region: "center",
          layout: "border",
          border: 1,
          tbar: me.getFmtToolbarCmp(),
          items: [{
            region: "west",
            width: 300,
            layout: "fit",
            split: true,
            border: 0,
            items: me.getFmtPropGrid()
          }, {
            region: "center",
            border: 0,
            layout: "fit",
            items: me.getFmtColsGrid()
          }]
        }]
      }]
    });

    me.callParent(arguments);

    me.refreshCompanyGrid();
  },

  /**
   * @private
   */
  getToolbarCmp() {
    const me = this;
    return [{
      text: "初始化国家标准科目",
      handler: me._onInit,
      scope: me
    }, "-", {
      text: "新建科目",
      handler: me._onAddSubject,
      scope: me
    }, "-", {
      text: "编辑科目",
      handler: me._onEditSubject,
      scope: me
    }, "-", {
      text: "删除科目",
      handler: me._onDeleteSubject,
      scope: me
    }, "-", {
      text: "指南",
      handler() {
        me.focus();
        window.open(me.URL("/Home/Help/index?t=subject"));
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
  getFmtToolbarCmp() {
    const me = this;
    return [{
      text: "初始化科目的标准账样",
      handler: me._onInitFmt,
      scope: me
    }, "-", {
      text: "清空标准账样设置",
      handler: me._onUndoInitFmt,
      scope: me
    }, "-", {
      text: "新建账样列",
      handler: me._onAddFmtCol,
      scope: me
    }, "-", {
      text: "编辑账样列",
      handler: me._onEditFmtCol,
      scope: me
    }, "-", {
      text: "删除账样列",
      handler: me._onDeleteFmtCol,
      scope: me
    }, "-", {
      text: "设置账样列显示次序",
      handler: me._onEditFmtColShowOrder,
      scope: me
    }, "-", {
      text: "启用账样",
      handler: me._onEnableFmt,
      scope: me
    }];
  },

  /**
   * @private
   */
  refreshCompanyGrid() {
    const me = this;
    const el = PCL.getBody();
    const store = me.getCompanyGrid().getStore();
    el.mask(PSI.Const.LOADING);
    const r = {
      url: me.URL("SLN0002/Subject/companyList"),
      callback(options, success, response) {
        store.removeAll();

        if (success) {
          const data = me.decodeJSON(response.responseText);
          store.add(data);
          if (store.getCount() > 0) {
            me.getCompanyGrid().getSelectionModel().select(0);
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
  getCompanyGrid() {
    const me = this;
    if (me._companyGrid) {
      return me._companyGrid;
    }

    const modelName = "PSIModel.PSI.Subject.MainForm.Company";

    PCL.define(modelName, {
      extend: "PCL.data.Model",
      fields: ["id", "code", "name", "orgType"]
    });

    me._companyGrid = PCL.create("PCL.grid.Panel", {
      cls: "PSI-FC",
      header: {
        height: 30,
        title: me.formatGridHeaderTitle("独立核算的组织机构")
      },
      viewConfig: {
        enableTextSelection: true
      },
      tools: [{
        type: "close",
        handler() {
          PCL.getCmp("companyPanel").collapse();
        }
      }],
      forceFit: true,
      columnLines: true,
      columns: [{
        header: "编码",
        dataIndex: "code",
        menuDisabled: true,
        sortable: false,
        width: 70
      }, {
        header: "组织机构名称",
        dataIndex: "name",
        flex: 1,
        menuDisabled: true,
        sortable: false
      }, {
        header: "组织机构性质",
        dataIndex: "orgType",
        width: 100,
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
          fn: me._onCompanyGridSelect,
          scope: me
        }
      }
    });
    return me._companyGrid;
  },

  /**
   * @private
   */
  _onCompanyGridSelect() {
    const me = this;
    me.getFmtPropGrid().setTitle("账样属性");
    me.getFmtPropGrid().getStore().removeAll();
    me.getFmtColsGrid().setTitle("账样列");
    me.getFmtColsGrid().getStore().removeAll();

    me.getMainGrid().setTitle(me.formatGridHeaderTitle("会计科目"));
    const item = me.getCompanyGrid().getSelectionModel().getSelection();
    if (item == null || item.length != 1) {
      return;
    }

    const company = item[0];
    const title = `<span class='PSI-title-keyword'>${company.get("name")}</span> - 会计科目`;
    me.getMainGrid().setTitle(me.formatGridHeaderTitle(title));

    const store = me.getMainGrid().getStore();
    store.load();
  },

  /**
   * @private
   */
  _onAddSubject() {
    const me = this;
    const item = me.getCompanyGrid().getSelectionModel().getSelection();
    if (item == null || item.length != 1) {
      me.showInfo("没有选择公司");
      return;
    }

    const company = item[0];

    const form = PCL.create("PSI.SLN0002.Subject.EditForm", {
      parentForm: me,
      company: company
    });
    form.show();
  },

  /**
   * @private
   */
  _onEditSubject() {
    const me = this;
    let item = me.getCompanyGrid().getSelectionModel().getSelection();
    if (item == null || item.length != 1) {
      me.showInfo("没有选择公司");
      return;
    }

    const company = item[0];

    item = me.getMainGrid().getSelectionModel().getSelection();
    if (item == null || item.length != 1) {
      me.showInfo("没有选择要编辑的科目");
      return;
    }

    const subject = item[0];
    if (!subject.get("id")) {
      me.showInfo("没有获得科目id，请刷新界面");
      return;
    }

    const form = PCL.create("PSI.SLN0002.Subject.EditForm", {
      parentForm: me,
      company: company,
      entity: subject
    });
    form.show();
  },

  /**
   * @private
   */
  _onDeleteSubject() {
    const me = this;
    let item = me.getCompanyGrid().getSelectionModel().getSelection();
    if (item == null || item.length != 1) {
      me.showInfo("没有选择公司");
      return;
    }

    item = me.getMainGrid().getSelectionModel().getSelection();
    if (item == null || item.length != 1) {
      me.showInfo("没有选择要删除的科目");
      return;
    }

    const subject = item[0];
    if (!subject.get("id")) {
      me.showInfo("没有获得科目id，请刷新界面");
      return;
    }

    const code = subject.get("code");
    if (!code) {
      me.showInfo("没有获得科目码，请刷新界面");
      return;
    }
    if (code.length == 4) {
      me.showInfo("一级科目不能删除");
      return;
    }

    const info = "请确认是否删除科目: <span style='color:red'>" + code + "</span>?";
    const funcConfirm = () => {
      const el = PCL.getBody();
      el.mask("正在删除中...");
      const r = {
        url: me.URL("SLN0002/Subject/deleteSubject"),
        params: {
          id: subject.get("id")
        },
        callback(options, success, response) {
          el.unmask();

          if (success) {
            const data = me.decodeJSON(response.responseText);
            if (data.success) {
              me.tip("成功完成删除操作");
              me._onCompanyGridSelect();
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
  getMainGrid() {
    const me = this;
    if (me._mainGrid) {
      return me._mainGrid;
    }

    const modelName = "PSIModel.PSI.Subject.MainForm.SubjectModel";
    PCL.define(modelName, {
      extend: "PCL.data.Model",
      fields: ["id", "code", "name", "category", "leaf",
        "children", "isLeaf"]
    });

    const store = PCL.create("PCL.data.TreeStore", {
      model: modelName,
      proxy: {
        type: "ajax",
        actionMethods: {
          read: "POST"
        },
        url: me.URL("SLN0002/Subject/subjectList")
      },
      listeners: {
        beforeload: {
          fn() {
            store.proxy.extraParams = me.getQueryParamForSubject();
          },
          scope: me
        }
      }
    });

    me._mainGrid = PCL.create("PCL.tree.Panel", {
      cls: "PSI",
      header: {
        height: 30,
        title: me.formatGridHeaderTitle("会计科目")
      },
      store: store,
      rootVisible: false,
      useArrows: true,
      viewConfig: {
        loadMask: true
      },
      columnLines: true,
      columns: {
        defaults: {
          sortable: false,
          menuDisabled: true,
          draggable: false
        },
        items: [{
          xtype: "treecolumn",
          text: "科目码",
          dataIndex: "code",
          width: 200
        }, {
          text: "科目名称",
          dataIndex: "name",
          width: 400
        }, {
          text: "分类",
          dataIndex: "category",
          width: 80,
          renderer(value) {
            if (value == 1) {
              return "资产";
            } else if (value == 2) {
              return "负债";
            } else if (value == 4) {
              return "所有者权益";
            } else if (value == 5) {
              return "成本";
            } else if (value == 6) {
              return "损益";
            } else {
              return "";
            }
          }
        }, {
          text: "末级科目",
          dataIndex: "isLeaf",
          width: 100
        }]
      },
      listeners: {
        select: {
          fn(rowModel, record) {
            me._onMainGridItemSelect(record);
          },
          scope: me
        },
        itemdblclick: {
          fn: me._onEditSubject,
          scope: me
        }
      }
    });

    return me._mainGrid;
  },

  /**
   * @private
   */
  getQueryParamForSubject() {
    const me = this;
    const item = me.getCompanyGrid().getSelectionModel().getSelection();
    if (item == null || item.length != 1) {
      return {};
    }

    const company = item[0];

    const result = {
      companyId: company.get("id")
    };

    return result;
  },

  /**
   * @private
   */
  _onInit() {
    const me = this;
    const item = me.getCompanyGrid().getSelectionModel().getSelection();
    if (item == null || item.length != 1) {
      me.showInfo("请选择要初始化科目的组织机构");
      return;
    }

    const company = item[0];

    const confirmFunc = () => {
      const el = PCL.getBody();
      el.mask("正在操作中...");
      const r = {
        url: me.URL("SLN0002/Subject/init"),
        params: {
          id: company.get("id")
        },
        callback(options, success, response) {
          el.unmask();

          if (success) {
            const data = me.decodeJSON(response.responseText);
            if (data.success) {
              me.tip("成功完成初始化操作", true);
              me._onCompanyGridSelect();
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

    const info = `请确认是否初始化<span style='color:red'>${company.get("name")}</span>的标准会计科目?`;
    me.confirm(info, confirmFunc);
  },

  /**
   * @private
   */
  getFmtPropGrid() {
    const me = this;
    if (me._fmtPropGrid) {
      return me._fmtPropGrid;
    }

    const modelName = "PSIModel.PSI.Subject.MainForm.FMTProp";
    PCL.define(modelName, {
      extend: "PCL.data.Model",
      fields: ["id", "propName", "propValue"]
    });

    me._fmtPropGrid = PCL.create("PCL.grid.Panel", {
      cls: "PSI-HL",
      header: {
        height: 30,
        title: me.formatGridHeaderTitle("账样属性")
      },
      viewConfig: {
        enableTextSelection: true
      },
      columnLines: true,
      columns: {
        defaults: {
          menuDisabled: true,
          sortable: false
        },
        items: [{
          header: "属性名称",
          dataIndex: "propName",
          width: 90
        }, {
          header: "属性值",
          dataIndex: "propValue",
          width: 200
        }]
      },
      store: PCL.create("PCL.data.Store", {
        model: modelName,
        autoLoad: false,
        data: []
      })
    });

    return me._fmtPropGrid;
  },

  /**
   * 初始化标准账样
   * 
   * @private
   */
  _onInitFmt() {
    const me = this;
    let item = me.getCompanyGrid().getSelectionModel().getSelection();
    if (item == null || item.length != 1) {
      me.showInfo("没有选择公司");
      return;
    }

    const company = item[0];

    item = me.getMainGrid().getSelectionModel().getSelection();
    if (item == null || item.length != 1) {
      me.showInfo("没有选择要初始化账样的科目");
      return;
    }

    const subject = item[0];

    const info = `请确认是否初始化科目<span style='color:red'>${subject.get("code")}</span>的账样?`;
    const funcConfirm = () => {
      const el = PCL.getBody();
      el.mask("正在初始化中...");
      const r = {
        url: me.URL("SLN0002/Subject/initFmt"),
        params: {
          id: subject.get("id"),
          companyId: company.get("id")
        },
        callback(options, success, response) {
          el.unmask();

          if (success) {
            const data = me.decodeJSON(response.responseText);
            if (data.success) {
              me.tip("成功完成操作", true);
              me.refreshFmtPropGrid();
              me.refreshFmtColsGrid();
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
   * 启用账样
   * 
   * @private
   */
  _onEnableFmt() {
    const me = this;
    const item = me.getMainGrid().getSelectionModel().getSelection();
    if (item == null || item.length != 1) {
      me.showInfo("没有选择要启用账样的科目");
      return;
    }

    PSI.MsgBox.showInfo("TODO");
  },

  /**
   * @private
   */
  getFmtColsGrid() {
    const me = this;
    if (me._fmtColsGrid) {
      return me._fmtColsGrid;
    }

    const modelName = "PSIModel.PSI.Subject.MainForm.FMTCols";
    PCL.define(modelName, {
      extend: "PCL.data.Model",
      fields: ["id", "showOrder", "caption", "fieldName",
        "fieldType", "fieldLength", "fieldDecimal"]
    });

    me._fmtColsGrid = PCL.create("PCL.grid.Panel", {
      cls: "PSI-HL",
      header: {
        height: 30,
        title: me.formatGridHeaderTitle("账样列")
      },
      viewConfig: {
        enableTextSelection: true
      },
      columnLines: true,
      columns: {
        defaults: {
          menuDisabled: true,
          sortable: false
        },
        items: [{
          header: "排序",
          dataIndex: "showOrder",
          width: 70
        }, {
          header: "列标题",
          dataIndex: "caption",
          width: 200
        }, {
          header: "数据库字段名称",
          dataIndex: "fieldName",
          width: 120
        }, {
          header: "字段类型",
          dataIndex: "fieldType",
          width: 100
        }, {
          header: "字段长度",
          dataIndex: "fieldLength",
          width: 100
        }, {
          header: "字段小数位数",
          dataIndex: "fieldDecimal",
          width: 100
        }]
      },
      store: PCL.create("PCL.data.Store", {
        model: modelName,
        autoLoad: false,
        data: []
      }),
      listeners: {
        itemdblclick: {
          fn: me._onEditFmtCol,
          scope: me
        }
      }
    });

    return me._fmtColsGrid;
  },

  /**
   * @private
   */
  _onMainGridItemSelect(record) {
    const me = this;

    if (!record) {
      me.getFmtPropGrid().setTitle("账样属性");
      me.getFmtColsGrid().setTitle("账样列");
      return;
    }

    const code = record.get("code");
    const name = record.get("name");
    let title = `<span class='PSI-title-keyword'>${code} ${name}</span> - 账样属性`;
    me.getFmtPropGrid().setTitle(title);
    title = `<span class='PSI-title-keyword'>${code} ${name}</span> - 账样列`;
    me.getFmtColsGrid().setTitle(title);

    me.refreshFmtPropGrid();
    me.refreshFmtColsGrid();
  },

  /**
   * @private
   */
  refreshFmtPropGrid() {
    const me = this;
    let item = me.getCompanyGrid().getSelectionModel().getSelection();
    if (item == null || item.length != 1) {
      return;
    }
    const company = item[0];

    item = me.getMainGrid().getSelectionModel().getSelection();
    if (item == null || item.length != 1) {
      return;
    }
    const subject = item[0];

    const grid = me.getFmtPropGrid();
    const el = grid.getEl();
    el && el.mask(PSI.Const.LOADING);

    const r = {
      url: me.URL("SLN0002/Subject/fmtPropList"),
      params: {
        id: subject.get("id"),
        companyId: company.get("id")
      },
      callback(options, success, response) {
        const store = grid.getStore();

        store.removeAll();

        if (success) {
          const data = me.decodeJSON(response.responseText);
          store.add(data);
        }

        el && el.unmask();
      }
    };
    me.ajax(r);
  },

  /**
   * @private
   */
  refreshFmtColsGrid(id) {
    const me = this;
    let item = me.getCompanyGrid().getSelectionModel().getSelection();
    if (item == null || item.length != 1) {
      return;
    }
    const company = item[0];

    item = me.getMainGrid().getSelectionModel().getSelection();
    if (item == null || item.length != 1) {
      return;
    }
    const subject = item[0];

    const grid = me.getFmtColsGrid();
    const el = grid.getEl();
    el && el.mask(PSI.Const.LOADING);

    const r = {
      url: me.URL("SLN0002/Subject/fmtColsList"),
      params: {
        id: subject.get("id"),
        companyId: company.get("id")
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
   * 清空标准账样
   * 
   * @private
   */
  _onUndoInitFmt() {
    const me = this;
    let item = me.getCompanyGrid().getSelectionModel().getSelection();
    if (item == null || item.length != 1) {
      me.showInfo("没有选择公司");
      return;
    }

    const company = item[0];

    item = me.getMainGrid().getSelectionModel().getSelection();
    if (item == null || item.length != 1) {
      me.showInfo("没有选择要清空账样的科目");
      return;
    }

    const subject = item[0];

    const info = `请确认是否清空科目<span style='color:red'>${subject.get("code")}</span>的账样?`;
    const funcConfirm = () => {
      const el = PCL.getBody();
      el.mask("正在操作中...");
      const r = {
        url: me.URL("SLN0002/Subject/undoInitFmt"),
        params: {
          id: subject.get("id"),
          companyId: company.get("id")
        },
        callback(options, success, response) {
          el.unmask();

          if (success) {
            const data = me.decodeJSON(response.responseText);
            if (data.success) {
              me.tip("成功完成操作", true);
              me.refreshFmtPropGrid();
              me.refreshFmtColsGrid();
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
  _onAddFmtCol() {
    const me = this;

    let item = me.getCompanyGrid().getSelectionModel().getSelection();
    if (item == null || item.length != 1) {
      me.showInfo("没有选择公司");
      return;
    }

    const company = item[0];

    item = me.getMainGrid().getSelectionModel().getSelection();
    if (item == null || item.length != 1) {
      me.showInfo("没有选择科目");
      return;
    }

    const subject = item[0];

    if (me.getFmtPropGrid().getStore().getCount() == 0) {
      me.showInfo("还没有初始化标准账样");
      return;
    }

    const form = PCL.create("PSI.SLN0002.Subject.FmtColEditForm", {
      parentForm: me,
      company: company,
      subject: subject
    });
    form.show();
  },

  /**
   * @private
   */
  _onEditFmtCol() {
    const me = this;

    let item = me.getCompanyGrid().getSelectionModel().getSelection();
    if (item == null || item.length != 1) {
      me.showInfo("没有选择公司");
      return;
    }
    const company = item[0];

    item = me.getMainGrid().getSelectionModel().getSelection();
    if (item == null || item.length != 1) {
      me.showInfo("没有选择科目");
      return;
    }
    const subject = item[0];

    if (me.getFmtPropGrid().getStore().getCount() == 0) {
      me.showInfo("还没有初始化标准账样");
      return;
    }

    item = me.getFmtColsGrid().getSelectionModel().getSelection();
    if (item == null || item.length != 1) {
      me.showInfo("没有选择要编辑的账样列");
      return;
    }
    const entity = item[0];

    const form = PCL.create("PSI.SLN0002.Subject.FmtColEditForm", {
      parentForm: me,
      company,
      subject,
      entity,
    });
    form.show();
  },

  /**
   * @private
   */
  _onDeleteFmtCol() {
    const me = this;
    const item = me.getFmtColsGrid().getSelectionModel().getSelection();
    if (item == null || item.length != 1) {
      me.showInfo("没有选择要删除的账样列");
      return;
    }

    const fmtCol = item[0];

    const info = `请确认是否删除账样列: <span style='color:red'>${fmtCol.get("caption")}</span> ?`;
    const funcConfirm = () => {
      const el = PCL.getBody();
      el.mask("正在删除中...");
      const r = {
        url: me.URL("SLN0002/Subject/deleteFmtCol"),
        params: {
          id: fmtCol.get("id")
        },
        callback(options, success, response) {
          el.unmask();

          if (success) {
            const data = me.decodeJSON(response.responseText);
            if (data.success) {
              me.tip("成功完成删除操作", true);
              me.refreshFmtColsGrid();
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
  _onEditFmtColShowOrder() {
    const me = this;
    let item = me.getCompanyGrid().getSelectionModel().getSelection();
    if (item == null || item.length != 1) {
      me.showInfo("没有选择公司");
      return;
    }

    item = me.getMainGrid().getSelectionModel().getSelection();
    if (item == null || item.length != 1) {
      me.showInfo("没有选择科目");
      return;
    }
    const subject = item[0];

    const store = me.getFmtPropGrid().getStore();
    if (store.getCount() == 0) {
      me.showInfo("还没有初始化标准账样");
      return;
    }

    const form = PCL.create("PSI.SLN0002.Subject.FmtColShowOrderEditForm", {
      parentForm: me,
      entity: subject
    });
    form.show();
  }
});
