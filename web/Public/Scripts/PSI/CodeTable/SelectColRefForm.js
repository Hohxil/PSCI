/**
 * 值来源的引用列
 * 
 * @author 艾格林门信息服务（大连）有限公司
 * @copyright 2015 - present
 * @license GPL v3
 */
PCL.define("PSI.CodeTable.SelectColRefForm", {
  extend: "PCL.window.Window",

  mixins: ["PSI.AFX.Mix.Common"],

  config: {
    codeTable: null,
    valueFrom: 2,
    parentForm: null,
  },

  /**
   * @override
   */
  initComponent() {
    const me = this;

    PCL.apply(me, {
      header: {
        title: me.formatTitle(PSI.Const.PROD_NAME),
        height: 40
      },
      modal: true,
      closable: false,
      resizable: false,
      onEsc: PCL.emptyFn,
      width: 1200,
      height: 600,
      layout: "border",
      items: [
        {
          region: "west",
          width: "50%",
          layout: "fit",
          border: 0,
          split: true,
          items: me.getTableGrid(),
        },
        {
          region: "center",
          layout: "border",
          border: 0,
          items: [
            {
              region: "north",
              border: 0,
              height: "50%",
              layout: "fit",
              split: true,
              items: me.getColForKeyGrid(),
            },
            {
              region: "center",
              border: 0,
              layout: "fit",
              items: me.getColForDisplayGrid(),
            }
          ]
        }
      ],
      buttons: [{
        text: "确定",
        handler: me._onOK,
        scope: me
      }, {
        text: "取消",
        handler() {
          me.close();
        },
        scope: me
      }],
      listeners: {
        show: {
          fn: me._onWndShow,
          scope: me
        }
      }
    });

    me.callParent(arguments);

    const editTableName = PCL.getCmp("editTableName");
    editTableName.on("change", () => {
      me.refreshTableGrid()
    });

    me.refreshTableGrid();
  },

  /**
   * @private
   */
  _onWndShow() {
    const me = this;

    const edit = PCL.getCmp("editTableName");
    if (edit) {
      edit.focus();
    }
  },

  /**
   * 显示表的Grid
   * @private
   */
  getTableGrid() {
    const me = this;

    if (me._tableGrid) {
      return me._tableGrid;
    }

    const modelName = "PSIModel.PSI.CodeTable.SelectColRefForm.TableModel";

    PCL.define(modelName, {
      extend: "PCL.data.Model",
      fields: ["name", "caption"]
    });

    me._tableGrid = PCL.create("PCL.grid.Panel", {
      cls: "PSI",
      viewConfig: {
        enableTextSelection: true
      },
      header: false,
      columnLines: true,
      columns: {
        defaults: {
          menuDisabled: true,
          sortable: false,
        },
        items: [{
          header: "数据库表名",
          dataIndex: "name",
          flex: 1,
        }, {
          header: "名称",
          dataIndex: "caption",
          flex: 1,
        }]
      },
      store: PCL.create("PCL.data.Store", {
        model: modelName,
        autoLoad: false,
        data: []
      }),
      listeners: {
        select: {
          fn: me._onTableGridSelect,
          scope: me
        },
      },
      bbar: [{
        id: "labelTableName",
        xtype: "displayfield",
        value: "输入表名可以过滤上面的数据",
      }, {
        id: "editTableName",
        xtype: "textfield",
        width: 200,
      }]
    });

    return me._tableGrid;
  },

  /**
   * 显示关联字段的Grid
   * 
   * @private
   */
  getColForKeyGrid() {
    const me = this;

    if (me._colForKeyGrid) {
      return me._colForKeyGrid;
    }

    const modelName = "PSIModel.PSI.CodeTable.SelectColRefForm.ColForKeyModel";

    PCL.define(modelName, {
      extend: "PCL.data.Model",
      fields: ["caption", "dbFieldName"]
    });

    me._colForKeyGrid = PCL.create("PCL.grid.Panel", {
      cls: "PSI",
      viewConfig: {
        enableTextSelection: true
      },
      header: {
        height: 30,
        title: me.formatGridHeaderTitle("列 - 关联用")
      },
      columnLines: true,
      columns: {
        defaults: {
          menuDisabled: true,
          sortable: false,
        },
        items: [{
          header: "列数据库名",
          dataIndex: "dbFieldName",
          flex: 1,
        }, {
          header: "列标题",
          dataIndex: "caption",
          flex: 1,
        }]
      },
      store: PCL.create("PCL.data.Store", {
        model: modelName,
        autoLoad: false,
        data: []
      }),
    });

    return me._colForKeyGrid;
  },

  /**
   * 显示展示字段的Grid
   * 
   * @private
   */
  getColForDisplayGrid() {
    const me = this;

    if (me._colForDisplayGrid) {
      return me._colForDisplayGrid;
    }

    const modelName = "PSIModel.PSI.CodeTable.SelectColRefForm.ColForDisplayModel";

    PCL.define(modelName, {
      extend: "PCL.data.Model",
      fields: ["caption", "dbFieldName"]
    });

    me._colForDisplayGrid = PCL.create("PCL.grid.Panel", {
      cls: "PSI",
      viewConfig: {
        enableTextSelection: true
      },
      header: {
        height: 30,
        title: me.formatGridHeaderTitle("列 - 显示用")
      },
      columnLines: true,
      columns: {
        defaults: {
          menuDisabled: true,
          sortable: false,
        },
        items: [{
          header: "列数据库名",
          dataIndex: "dbFieldName",
          flex: 1,
        }, {
          header: "列标题",
          dataIndex: "caption",
          flex: 1,
        }]
      },
      store: PCL.create("PCL.data.Store", {
        model: modelName,
        autoLoad: false,
        data: []
      }),
    });

    return me._colForDisplayGrid;

  },

  /**
   * @private
   */
  _onTableGridSelect() {
    const me = this;
    me.refreshColGrid();
  },

  /**
   * @private
   */
  refreshTableGrid() {
    const me = this;

    me.getColForKeyGrid().getStore().removeAll();
    me.getColForDisplayGrid().getStore().removeAll();

    const editTableName = PCL.getCmp("editTableName");
    const valueFrom = me.getValueFrom();
    if (valueFrom == 4) {
      // 引用自身
      const store = me.getTableGrid().getStore();
      store.removeAll();
      const codeTable = me.getCodeTable();
      store.add({
        name: codeTable.get("tableName"),
        caption: codeTable.get("name"),
      });
      editTableName.setVisible(false);
      PCL.getCmp("labelTableName").setVisible(false);
    } else {
      // 从后台查询数据
      const grid = me.getTableGrid();
      const el = grid.getEl() || PCL.getBody();
      el.mask(PSI.Const.LOADING);
      const r = {
        url: me.URL("Home/CodeTable/queryTablesForColRef"),
        params: {
          valueFrom,
          tableName: me.getCodeTable().get("tableName"),
          searchKey: editTableName.getValue(),
        },
        callback(options, success, response) {
          const store = grid.getStore();

          store.removeAll();

          if (success) {
            const data = me.decodeJSON(response.responseText);
            store.add(data);
          }
          el.unmask();

          editTableName.focus();
        }
      };

      me.ajax(r);
    }
  },

  /**
   * @private
   */
  refreshColGrid() {
    const me = this;

    const valueFrom = me.getValueFrom();
    let tableName = "";
    if (valueFrom == 4) {
      tableName = me.getCodeTable().get("tableName");
    } else {
      const item = me.getTableGrid().getSelectionModel().getSelection();
      if (item == null || item.length != 1) {
        return;
      }

      const table = item[0];
      tableName = table.get("name");
    }

    const el = PCL.getBody();
    el.mask(PSI.Const.LOADING);
    const r = {
      url: me.URL("Home/CodeTable/queryColsForColRef"),
      params: {
        valueFrom,
        tableName,
      },
      callback(options, success, response) {
        if (success) {
          const data = me.decodeJSON(response.responseText);
          const store1 = me.getColForKeyGrid().getStore();
          store1.removeAll();
          store1.add(data);

          const store2 = me.getColForDisplayGrid().getStore();
          store2.removeAll();
          store2.add(data);
        }
        el.unmask();
      }
    };

    me.ajax(r);
  },

  /**
   * @private
   */
  _onOK() {
    const me = this;

    let item = me.getTableGrid().getSelectionModel().getSelection();
    if (item == null || item.length != 1) {
      me.showInfo("请选择表");
      return;
    }

    const table = item[0];
    const tableName = table.get("name");

    item = me.getColForKeyGrid().getSelectionModel().getSelection();
    if (item == null || item.length != 1) {
      me.showInfo("请选择关联列");
      return;
    }
    const col1 = item[0];
    const colName = col1.get("dbFieldName");

    item = me.getColForDisplayGrid().getSelectionModel().getSelection();
    if (item == null || item.length != 1) {
      me.showInfo("请选择显示列");
      return;
    }
    const col2 = item[0];
    const colNameDisplay = col2.get("dbFieldName");

    // 回调方法
    const parentForm = me.getParentForm();
    if (parentForm && parentForm._refColCallbackFn) {
      parentForm._refColCallbackFn.apply(parentForm, [{
        tableName, colName, colNameDisplay,
      }]);
    }
    me.close();
  }
});
