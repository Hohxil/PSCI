/**
 * 码表运行- 主界面
 * 
 * @author 艾格林门信息服务（大连）有限公司
 * @copyright 2015 - present
 * @license GPL v3
 */
PCL.define("PSI.CodeTable.Runtime.MainForm", {
  extend: "PSI.AFX.Form.MainForm",

  config: {
    fid: null,
    pDesignTool: null
  },

  /**
   * @override
   */
  initComponent() {
    const me = this;

    PCL.apply(me, {
      tbar: {
        id: "PSI_CodeTable_RuntimeMainForm_toolBar",
        xtype: "toolbar"
      },
      layout: "border",
      items: [{
        region: "north",
        border: 0,
        height: 2,
      }, {
        region: "west",
        id: "PSI_CodeTable_RuntimeMainForm_panelCompany",
        width: 0,
        border: 0,
        split: true,
        collapsible: true,
        header: false,
        layout: "fit",
        items: []
      }, {
        region: "center",
        id: "PSI_CodeTable_RuntimeMainForm_panelMain",
        layout: "fit",
        border: 0,
        items: []
      }]
    });

    me.callParent(arguments);

    me._toolBar = PCL.getCmp("PSI_CodeTable_RuntimeMainForm_toolBar");
    me._panelMain = PCL.getCmp("PSI_CodeTable_RuntimeMainForm_panelMain");
    me._panelCompany = PCL.getCmp("PSI_CodeTable_RuntimeMainForm_panelCompany");

    me.fetchMeatData();
  },

  /**
   * @private
   */
  getMetaData() {
    return this._md;
  },

  /**
   * 获得元数据
   * 
   * @private
   */
  fetchMeatData() {
    const me = this;
    const el = me.getEl();
    el && el.mask(PSI.Const.LOADING);
    me.ajax({
      url: me.URL("Home/CodeTableRuntime/getMetaDataForRuntime"),
      params: {
        fid: me.getFid()
      },
      callback(options, success, response) {
        if (success) {
          const data = me.decodeJSON(response.responseText);

          me._md = data;

          me.initUI();
        }

        el && el.unmask();
      }
    });
  },

  /**
   * 创建UI
   * 
   * @private
   */
  initUI() {
    const me = this;

    const md = me.getMetaData();
    if (!md) {
      return;
    }

    const name = md.name;
    if (!name) {
      return;
    }

    // 公司
    me._panelCompany.setVisible(md.inputCompany);
    if (md.inputCompany) {
      me._panelCompany.setWidth(350);
      me._panelCompany.add(me.getCompanyGrid());
    }

    // MainGrid
    me._mainGrid = md.treeView ? me.createMainTreeGrid(md) : me.createMainGrid(md);
    me._panelMain.add(me._mainGrid);

    // 按钮
    const toolBar = me._toolBar;
    const buttons = md.buttons;
    buttons.forEach(btn => {
      if (btn.caption == "-") {
        toolBar.add("-");
      } else {
        toolBar.add({
          text: btn.caption,
          handler: me[btn.onClick],
          scope: me
        });
      }
    });

    // 高级按钮
    const advancedButtons = md.advancedButtons;
    if (advancedButtons.length > 0) {
      const menu = [];

      advancedButtons.forEach(btn => {
        menu.push({
          text: btn.caption,
          scope: me,
          handler: me[btn.onClick]
        });
      });
      toolBar.add("-", {
        text: "高级",
        menu,
      });
    }

    if (md.viewPaging == "1") {
      const store = me.getMainGrid().getStore();

      toolBar.add(["-", {
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
        }]);
    }

    // 开发者工具
    if (me.getPDesignTool() == "1") {
      toolBar.add(["-", {
        text: "开发者工具",
        menu: [{
          text: "保存列视图布局",
          scope: me,
          handler: me._onSaveViewLayout
        }]
      }]);
    }

    toolBar.add(["-", {
      text: "关闭",
      handler() {
        me.closeWindow();
      }
    }]);

    if (md.inputCompany) {
      me.refreshCompanyGrid();
    } else {
      me.refreshMainGrid();
    }
  },

  /**
   * 创建非层级码表的Grid
   * 
   * @private
   */
  createMainGrid(md) {
    const me = this;
    const modelName = "PSIModel.PSI.CodeTable.Runtime.MainForm.PSICodeTableRuntime_" + md.tableName;

    const fields = ["id", "record_status_code_int"];
    const cols = [PCL.create("PCL.grid.RowNumberer", {
      text: "#",
      align: "right",
      width: 60
    })];
    md.colsForView.forEach(mdCol => {
      fields.push(mdCol.fieldName);
      const col = {
        header: mdCol.caption,
        dataIndex: mdCol.fieldName,
        width: parseInt(mdCol.widthInView),
        menuDisabled: true,
        sortable: false
      };
      if (mdCol.fieldName == "code" || mdCol.fieldName == "name") {
        PCL.apply(col, {
          renderer(value, metaData, record) {
            if (parseInt(record.get("record_status_code_int")) == 1000) {
              return value;
            } else {
              return `<span class="PSI-record-disabled">${value}</span>`;
            }
          }
        });
      }
      if (mdCol.fieldName == "record_status") {
        PCL.apply(col, {
          renderer(value, metaData, record) {
            if (parseInt(record.get("record_status_code_int")) == 1000) {
              return value;
            } else {
              return `<span style='color:red'>${value}</span>`;
            }
          }
        });
      }

      cols.push(col);
    });// end of forEach

    PCL.define(modelName, {
      extend: "PCL.data.Model",
      fields: fields
    });

    const store = PCL.create("PCL.data.Store", {
      autoLoad: false,
      model: modelName,
      data: [],
      pageSize: 20,
      proxy: {
        type: "ajax",
        actionMethods: {
          read: "POST"
        },
        url: me.URL("Home/CodeTableRuntime/codeTableRecordList"),
        reader: {
          root: 'dataList',
          totalProperty: 'totalCount'
        }
      }
    });
    store.on("beforeload", () => {
      store.proxy.extraParams = me.getQueryParam();
    });
    store.on("load", (e, records, successful) => {
      if (successful) {
        me.gotoMainGridRecord(me._lastId);
      }
    });

    return PCL.create("PCL.grid.Panel", {
      cls: md.inputCompany ? "PSI-HL" : "PSI-FC",
      viewConfig: {
        enableTextSelection: true
      },
      columnLines: true,
      header: md.inputCompany ? {
        height: 30,
        title: me.formatGridHeaderTitle(md.name)
      } : null,
      border: 1,
      columns: cols,
      store,
      listeners: {
        itemdblclick: {
          fn: me._onEditCodeTableRecord,
          scope: me
        }
      }
    });
  },

  /**
   * @private
   */
  getQueryParam() {
    const me = this;

    const md = me.getMetaData();

    const result = {
      fid: md.fid
    };

    if (md.inputCompany) {
      const item = me.getCompanyGrid().getSelectionModel().getSelection();
      if (item == null || item.length != 1) {
        // do nothing
      } else {
        result.companyId = item[0].get("id");
      }
    }

    return result;
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
  createMainTreeGrid(md) {
    const me = this;
    const modelName = "PSIModel.PSI.CodeTable.Runtime.MainForm.PSICodeTableRuntime_" + md.tableName;

    const fields = ["id", "leaf", "children"];
    const cols = [];
    md.colsForView.forEach((mdCol, i) => {
      fields.push(mdCol.fieldName);

      if (i == 0) {
        cols.push({
          xtype: "treecolumn",
          header: mdCol.caption,
          dataIndex: mdCol.fieldName,
          width: parseInt(mdCol.widthInView),
          menuDisabled: true,
          sortable: false
        });
      } else {
        cols.push({
          header: mdCol.caption,
          dataIndex: mdCol.fieldName,
          width: parseInt(mdCol.widthInView),
          menuDisabled: true,
          sortable: false
        });
      }

    });

    PCL.define(modelName, {
      extend: "PCL.data.Model",
      fields: fields
    });

    const store = PCL.create("PCL.data.TreeStore", {
      model: modelName,
      autoLoad: false,
      root: {
        expanded: false
      },
      proxy: {
        type: "ajax",
        actionMethods: {
          read: "POST"
        },
        url: me.URL("Home/CodeTableRuntime/codeTableRecordListForTreeView"),
      },
      listeners: {
        load: {
          fn: me._onTreeStoreLoad,
          scope: me
        }
      }
    });
    store.on("beforeload", () => {
      store.proxy.extraParams = me.getQueryParam();
    });


    return PCL.create("PCL.tree.Panel", {
      cls: "PSI",
      rootVisible: false,
      useArrows: true,
      viewConfig: {
        loadMask: true
      },
      columnLines: true,
      border: 1,
      columns: cols,
      store: store,
      listeners: {
        beforeitemdblclick: {
          fn() {
            me._onEditCodeTableRecord();
            return false;
          }
        },
      }
    });
  },

  /**
   * 组织机构Grid
   * 
   * @private
   */
  getCompanyGrid() {
    const me = this;
    if (me._companyGrid) {
      return me._companyGrid;
    }

    const modelName = "PSIModel.PSI.CodeTable.Runtime.CompanyModel";

    PCL.define(modelName, {
      extend: "PCL.data.Model",
      fields: ["id", "code", "name", "orgType"]
    });

    me._companyGrid = PCL.create("PCL.grid.Panel", {
      cls: "PSI-FC",
      header: {
        height: 30,
        title: me.formatGridHeaderTitle("组织机构")
      },
      tools: [{
        type: "close",
        handler() {
          PCL.getCmp("PSI_CodeTable_RuntimeMainForm_panelCompany").collapse();
        }
      }],
      forceFit: true,
      columnLines: true,
      columns: {
        defaults: {
          menuDisabled: true,
          sortable: false,
        },
        items: [{
          header: "组织机构编码",
          dataIndex: "code",
          width: 100
        }, {
          header: "组织机构名称",
          dataIndex: "name",
          flex: 1,
        }, {
          header: "组织机构性质",
          dataIndex: "orgType",
          width: 100,
        }]
      },
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
  _onTreeStoreLoad() {
    const me = this;
    const md = me.getMetaData();
    if (!md.treeView) {
      return;
    }

    const id = me.__lastRecordId;
    const grid = me.getMainGrid();
    if (id) {
      // 编辑后刷新记录，然后定位到该记录
      const node = grid.getStore().getNodeById(id);
      if (node) {
        grid.getSelectionModel().select(node);
      }
    } else {
      // 首次进入模块
      const root = grid.getRootNode();
      if (root) {
        const node = root.firstChild;
        if (node) {
          grid.getSelectionModel().select(node);
        }
      }
    }
  },

  /**
   * 新增码表记录
   * _onAddCodeTableRecord这个是固定的名称
   * 和表t_code_table_buttons的on_click_frontend对应
   * 
   * @private
   */
  _onAddCodeTableRecord() {
    const me = this;

    const md = me.getMetaData();

    if (md.inputCompany) {
      // 多公司录入
      const item = me.getCompanyGrid().getSelectionModel().getSelection();
      if (item == null || item.length != 1) {
        me.showInfo("请先选择公司");
        return;
      }

      const company = item[0];
      const form = PCL.create("PSI.CodeTable.Runtime.EditForm", {
        parentForm: me,
        metaData: me.getMetaData(),
        company,
      });

      form.show();
    } else {
      const form = PCL.create("PSI.CodeTable.Runtime.EditForm", {
        parentForm: me,
        metaData: me.getMetaData()
      });

      form.show();
    }
  },

  /**
   * 编辑码表记录
   * _onEditCodeTableRecord这个是固定的名称
   * 和表t_code_table_buttons的on_click_frontend对应
   * 
   * @private
   */
  _onEditCodeTableRecord() {
    const me = this;
    const item = me.getMainGrid().getSelectionModel().getSelection();
    if (item == null || item.length != 1) {
      const name = me.getMetaData().name;
      me.showInfo(`请选择要编辑的${name}`);
      return;
    }

    const entity = item[0];

    const md = me.getMetaData();

    if (md.inputCompany) {
      // 多公司录入
      const item = me.getCompanyGrid().getSelectionModel().getSelection();
      if (item == null || item.length != 1) {
        me.showInfo("请先选择公司");
        return;
      }

      const company = item[0];
      const form = PCL.create("PSI.CodeTable.Runtime.EditForm", {
        parentForm: me,
        entity,
        metaData: me.getMetaData(),
        company,
      });

      form.show();
    } else {
      const form = PCL.create("PSI.CodeTable.Runtime.EditForm", {
        parentForm: me,
        entity,
        metaData: me.getMetaData()
      });

      form.show();
    }
  },

  /**
   * 根据当前id查找之前的id，用于删除后定位
   * 
   * @private
   */
  getPreIndexById(id) {
    const me = this;
    const md = me.getMetaData();
    if (md.treeView) {
      const store = me.getMainGrid().getStore();
      const currentNode = store.getNodeById(id);
      if (currentNode) {
        const preNode = currentNode.previousSibling;
        if (preNode) {
          return preNode.data.id;
        } else {
          // 没有同级node，就找上级
          const parentNode = currentNode.parentNode;
          if (parentNode) {
            return parentNode.data.id;
          } else {
            // 什么也没有找到
            return null;
          }
        }
      }
    } else {
      const store = me.getMainGrid().getStore();
      const index = store.findExact("id", id) - 1;

      let result = null;
      const preEntity = store.getAt(index);
      if (preEntity) {
        result = preEntity.get("id");
      }

      return result;
    }

    // 没有找到，或者是bug
    return null;
  },

  /**
   * 删除码表记录
   * _onDeleteCodeTableRecord这个是固定的名称
   * 和表t_code_table_buttons的on_click_frontend对应
   * 
   * @private
   */
  _onDeleteCodeTableRecord() {
    const me = this;
    const md = me.getMetaData();
    const name = md.name;
    const item = me.getMainGrid().getSelectionModel().getSelection();
    if (item == null || item.length != 1) {
      me.showInfo("请选择要删除的" + name);
      return;
    }

    const entity = item[0];
    const info = `请确认是否删除${name} <span style='color:red'>${entity.get("name")}</span> ?`;

    const preIndex = me.getPreIndexById(entity.get("id"));

    const funcConfirm = () => {
      const el = PCL.getBody();
      el && el.mask(PSI.Const.LOADING);
      const r = {
        url: me.URL("Home/CodeTableRuntime/deleteCodeTableRecord"),
        params: {
          id: entity.get("id"),
          fid: md.fid
        },
        callback(options, success, response) {
          el && el.unmask();
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
   * 刷新记录
   * _onRefreshCodeTableRecord这个是固定的名称
   * 和表t_code_table_buttons的on_click_frontend对应
   * 
   * @private
   */
  _onRefreshCodeTableRecord() {
    const me = this;
    const item = me.getMainGrid().getSelectionModel().getSelection();
    let id = null;
    if (item == null || item.length != 1) {
      id = me.__lastRecrodId;
    } else {
      const entity = item[0];
      id = entity.get("id");
    }

    me.refreshMainGrid(id);
  },

  /**
   * @private
   */
  getMainGrid() {
    return this._mainGrid;
  },

  /**
   * @private
   */
  refreshMainGrid(id) {
    const me = this;
    me._lastId = id;

    const md = me.getMetaData();
    if (md.treeView) {
      const store = me.getMainGrid().getStore();
      store.reload();
      store.setRootNode({
        expanded: true
      });
    } else {
      const store = me.getMainGrid().getStore();
      store.reload();
    }
  },

  /**保存列视图布局
   * 
   * @private
   */
  _onSaveViewLayout() {
    const me = this;
    const md = me.getMetaData();

    const grid = me.getMainGrid();
    const cols = grid.columnManager.columns;
    const layout = [];
    // TODO 改为forEach
    for (let i = 0; i < cols.length; i++) {
      const c = cols[i];
      layout.push({ dataIndex: c.dataIndex, width: c.width });
    }
    const json = me.encodeJSON(layout);

    const info = "请确认是否保存视图布局?";

    const funcConfirm = () => {
      const el = PCL.getBody();
      el && el.mask(PSI.Const.LOADING);
      const r = {
        url: me.URL("Home/CodeTableRuntime/saveColViewLayout"),
        params: {
          fid: md.fid,
          json: json
        },
        callback(options, success, response) {
          el && el.unmask();
          if (success) {
            const data = me.decodeJSON(response.responseText);
            if (data.success) {
              me.tip("成功保存列视图布局", true);
            } else {
              me.showInfo(data.msg);
            }
          } else {
            me.showInfo("网络错误");
          }
        }
      };

      me.ajax(r);
    }

    me.confirm(info, funcConfirm);
  },

  /**
   * 导出码表记录，Excel格式
   * _onExcelCodeTableRecord这个是固定的名称
   * 和表t_code_table_buttons的on_click_frontend对应
   * 
   * @private
   */
  _onExcelCodeTableRecord() {
    const me = this;
    const md = me.getMetaData();
    const fid = md.fid;

    const url = `Home/CodeTableRuntime/exportExcel?fid=${fid}`;

    window.open(me.URL(url));

    me.focus();
  },

  /**
   * 修改数据域
   * 
   * @private
   */
  _onEditDataOrg() {
    const me = this;
    const item = me.getMainGrid().getSelectionModel().getSelection();
    if (item == null || item.length != 1) {
      const name = me.getMetaData().name;
      me.showInfo(`请选择要修改数据域的${name}`);
      return;
    }

    const entity = item[0];
    const form = PCL.create("PSI.CodeTable.Runtime.EditDataOrgForm", {
      parentForm: me,
      entity,
      fid: me.getMetaData().fid,
    });

    form.show();
  },

  /**
   * 修改助记码
   * 
   * @private
   */
  _onEditPY() {
    const me = this;
    const item = me.getMainGrid().getSelectionModel().getSelection();
    if (item == null || item.length != 1) {
      const name = me.getMetaData().name;
      me.showInfo(`请选择要修改助记码的${name}`);
      return;
    }

    const entity = item[0];
    const form = PCL.create("PSI.CodeTable.Runtime.EditPyForm", {
      parentForm: me,
      entity,
      fid: me.getMetaData().fid,
    });

    form.show();
  },

  /**
   * 刷新组织机构Grid
   * 
   * @private
   */
  refreshCompanyGrid() {
    const me = this;
    const md = me.getMetaData();

    if (!md.inputCompany) {
      return;
    }

    const fid = md.fid;
    const el = PCL.getBody();
    const store = me.getCompanyGrid().getStore();
    el.mask(PSI.Const.LOADING);
    const r = {
      url: me.URL("Home/CodeTableRuntime/companyList"),
      params: {
        fid,
      },
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
  _onCompanyGridSelect() {
    const me = this;
    const md = me.getMetaData();
    if (!md.inputCompany) {
      return;
    }

    const item = me.getCompanyGrid().getSelectionModel().getSelection();
    if (item == null || item.length != 1) {
      return;
    }

    const company = item[0];
    const title = `<span class='PSI-title-keyword'>${company.get("name")}</span> - ${md.name}`;
    me.getMainGrid().setTitle(me.formatGridHeaderTitle(title));

    me.refreshMainGrid();
  },
});
