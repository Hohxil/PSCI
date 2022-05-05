/**
 * 选择权限
 * 
 * @author 艾格林门信息服务（大连）有限公司
 * @copyright 2015 - present
 * @license GPL v3
 */
PCL.define("PSI.Permission.SelectPermissionForm", {
  extend: "PSI.AFX.Form.EditForm",

  config: {
    // idList是数组
    idList: []
  },

  width: 1200,
  height: 600,
  layout: "border",

  initComponent() {
    const me = this;

    PCL.apply(me, {
      header: {
        height: 40,
        title: me.formatTitle("选择权限")
      },
      padding: 5,
      items: [{
        region: "center",
        layout: "border",
        bodyStyle: "background-color:white",
        border: 0,
        items: [{
          region: "north",
          layout: "border",
          height: "50%",
          border: 1,
          cls: "PSI",
          margin: 5,
          header: {
            height: 30,
            title: me.formatGridHeaderTitle("所有可以选择的权限")
          },
          items: [{
            region: "west",
            width: 200,
            xtype: "container",
            layout: "border",
            border: 0,
            items: [{
              region: "center",
              layout: "fit",
              border: 0,
              bodyPadding: 5,
              items: me.getCategoryGrid()
            }, {
              region: "south",
              height: 40,
              layout: "form",
              border: 0,
              bodyPadding: 5,
              items: [{
                id: "PSI_Permission_SelectPermissionForm_editQuery",
                xtype: "textfield",
                fieldLabel: "分类",
                labelWidth: 30,
                labelAlign: "right",
                labelSeparator: "",
                emptyText: "输入拼音字头过滤分类"
              }]
            }]
          }, {
            region: "center",
            border: 0,
            layout: "fit",
            bodyPadding: 5,
            items: [me.getPermissionGrid()]
          }]
        }, {
          region: "center",
          layout: "fit",
          cls: "PSI",
          border: 0,
          items: [me.getSelectedGrid()]
        }]
      }, {
        region: "south",
        layout: {
          type: "table",
          columns: 3
        },
        border: 0,
        height: 40,
        items: [{
          xtype: "textfield",
          fieldLabel: "数据域",
          margin: "5 5 5 5",
          labelWidth: 40,
          labelAlign: "right",
          labelSeparator: "",
          width: 590,
          readOnly: true,
          id: "editDataOrg"
        }, {
          xtype: "hidden",
          id: "editDataOrgIdList"
        }, {
          xtype: "button",
          text: "选择数据域",
          handler: me.onSelectDataOrg,
          scope: me
        }, {
          text: "数据域应用详解",
          xtype: "button",
          margin: "5 5 5 20",
          iconCls: "PSI-help",
          handler() {
            const url = me.URL("/Home/Help/index?t=dataOrg")
            window.open(url);
          }
        }]
      }],
      buttons: [{
        text: "确定",
        formBind: true,
        iconCls: "PSI-button-ok",
        handler: me.onOK,
        scope: me
      }, {
        text: "取消",
        handler() {
          me.close();
        },
        scope: me
      }],
      listeners: {
        show: me.onWndShow
      }
    });

    me.callParent(arguments);

    me.editQuery = PCL.getCmp("PSI_Permission_SelectPermissionForm_editQuery");

    me.editQuery.on("change", () => {
      me.refreshCategoryGrid();
    });
  },

  refreshCategoryGrid() {
    const me = this;
    const idList = me.getIdList();
    const store = me.getCategoryGrid().getStore();

    const el = me.getCategoryGrid().getEl() || PCL.getBody();
    el.mask("数据加载中...");
    const r = {
      url: me.URL("Home/Permission/permissionCategory"),
      params: {
        queryKey: me.editQuery.getValue(),
      },
      callback(options, success, response) {
        store.removeAll();

        if (success) {
          const data = me.decodeJSON(response.responseText);

          store.add(data);

          if (data.length > 0) {
            me.getCategoryGrid().getSelectionModel().select(0);
            me.editQuery.focus();
          }
        }

        el.unmask();
      }
    };

    me.ajax(r);
  },

  onWndShow() {
    const me = this;
    me.refreshCategoryGrid();
  },

  onOK() {
    const me = this;
    const grid = me.getSelectedGrid();

    if (grid.getStore().getCount() == 0) {
      PSI.MsgBox.showInfo("没有选择权限");

      return;
    }

    const items = [];
    for (let i = 0; i < grid.getStore().getCount(); i++) {
      const item = grid.getStore().getAt(i);
      items.push({
        id: item.get("id"),
        name: item.get("name")
      });
    }

    const dataOrgList = PCL.getCmp("editDataOrgIdList").getValue();
    if (!dataOrgList) {
      PSI.MsgBox.showInfo("没有选择数据域");
      return;
    }

    if (me.getParentForm()) {
      const fullNameList = PCL.getCmp("editDataOrg").getValue();
      me.getParentForm().setSelectedPermission(items, dataOrgList, fullNameList);
    }

    me.close();
  },

  onSelectDataOrg() {
    const me = this;
    const form = PCL.create("PSI.Permission.SelectDataOrgForm", {
      parentForm: me
    });
    form.show();
  },

  setDataOrgList(fullNameList, dataOrgList) {
    PCL.getCmp("editDataOrg").setValue(fullNameList);
    PCL.getCmp("editDataOrgIdList").setValue(dataOrgList);
  },

  /**
   * 所有可以选择的权限的Grid
   */
  getPermissionGrid() {
    const me = this;
    if (me.__permissionGrid) {
      return me.__permissionGrid;
    }

    const modelName = "PSIModel.PSI.Permission.SelectPermissionForm.PermissionModel";
    PCL.define(modelName, {
      extend: "PCL.data.Model",
      fields: ["id", "name", "note"]
    });

    const store = PCL.create("PCL.data.Store", {
      model: modelName,
      autoLoad: false,
      data: []
    });

    me.__permissionGrid = PCL.create("PCL.grid.Panel", {
      cls: "PSI-HL",
      store: store,
      columnLines: true,
      bbar: [{
        text: "全部添加",
        handler: me.addAllPermission,
        scope: me,
        iconCls: "PSI-button-add-all"
      }],
      columns: [{
        header: "权限名称",
        dataIndex: "name",
        width: 300,
        menuDisabled: true,
        renderer(value) {
          return `<div class='PSI-grid-cell-autoWrap'>${value}</div>`;
        }
      }, {
        header: "",
        align: "center",
        menuDisabled: true,
        draggable: false,
        width: 30,
        xtype: "actioncolumn",
        items: [{
          icon: PSI.Const.BASE_URL
            + "Public/Images/icons/add.png",
          handler: me.onAddPermission,
          scope: me
        }]
      }, {
        header: "权限说明",
        dataIndex: "note",
        width: 600,
        menuDisabled: true,
        renderer(value) {
          return `<div class='PSI-grid-cell-autoWrap'>${value}</div>`;
        }
      }]
    });

    return me.__permissionGrid;
  },

  onAddPermission(grid, row) {
    const item = grid.getStore().getAt(row);
    const me = this;
    const store = me.getSelectedGrid().getStore();
    if (store.findExact("id", item.get("id")) == -1) {
      store.add({
        id: item.get("id"),
        name: item.get("name")
      });
    }
  },

  /**
   * 最终用户选择权限的Grid
   */
  getSelectedGrid() {
    const me = this;
    if (me.__selectedGrid) {
      return me.__selectedGrid;
    }

    const modelName = "PSIModel.PSI.Permission.SelectPermissionForm.SelectedPermission";
    PCL.define(modelName, {
      extend: "PCL.data.Model",
      fields: ["id", "name"]
    });

    const store = PCL.create("PCL.data.Store", {
      model: modelName,
      autoLoad: false,
      data: []
    });

    me.__selectedGrid = PCL.create("PCL.grid.Panel", {
      header: {
        height: 30,
        title: me.formatGridHeaderTitle("已经选择的权限")
      },
      cls: "PSI-HL",
      padding: 5,
      store: store,
      columns: [{
        header: "权限名称",
        dataIndex: "name",
        flex: 1,
        menuDisabled: true,
        draggable: false
      }, {
        header: "",
        align: "center",
        menuDisabled: true,
        draggable: false,
        width: 40,
        xtype: "actioncolumn",
        items: [{
          icon: PSI.Const.BASE_URL
            + "Public/Images/icons/delete.png",
          handler(grid, row) {
            grid.getStore().removeAt(row);
          },
          scope: me
        }]
      }]
    });

    return me.__selectedGrid;
  },

  /**
   * 权限分类Grid
   */
  getCategoryGrid() {
    const me = this;
    if (me.__categoryGrid) {
      return me.__categoryGrid;
    }

    const modelName = "PSIModel.PSI.Permission.SelectPermissionForm.PermissionCategory";
    PCL.define(modelName, {
      extend: "PCL.data.Model",
      fields: ["name"]
    });

    const store = PCL.create("PCL.data.Store", {
      model: modelName,
      autoLoad: false,
      data: []
    });

    me.__categoryGrid = PCL.create("PCL.grid.Panel", {
      cls: "PSI-FC",
      store: store,
      columns: [{
        header: "按模块分类",
        dataIndex: "name",
        flex: 1,
        menuDisabled: true
      }],
      listeners: {
        select: {
          fn: me.onCategoryGridSelect,
          scope: me
        }
      }
    });

    return me.__categoryGrid;

  },

  onCategoryGridSelect() {
    const me = this;
    const item = me.getCategoryGrid().getSelectionModel().getSelection();

    if (item == null || item.length != 1) {
      return;
    }

    const category = item[0].get("name");
    const grid = me.getPermissionGrid();
    const store = grid.getStore();
    const el = grid.getEl() || PCL.getBody();

    el.mask("数据加载中...");
    me.ajax({
      url: me.URL("Home/Permission/permissionByCategory"),
      params: {
        category: category
      },
      callback(options, success, response) {
        store.removeAll();

        if (success) {
          const data = me.decodeJSON(response.responseText);
          store.add(data);
        }

        el.unmask();
      }
    });
  },

  addAllPermission() {
    const me = this;
    const store = me.getPermissionGrid().getStore();

    const selectStore = me.getSelectedGrid().getStore();

    const cnt = store.getCount();

    const d = [];

    for (let i = 0; i < cnt; i++) {
      const item = store.getAt(i);

      if (selectStore.findExact("id", item.get("id")) == -1) {
        d.push({
          id: item.get("id"),
          name: item.get("name")
        });
      }
    }

    selectStore.add(d);

    me.getSelectedGrid().focus();
  }
});
