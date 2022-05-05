/**
 * 权限管理 - 主界面
 * 
 * @author 艾格林门信息服务（大连）有限公司
 * @copyright 2015 - present
 * @license GPL v3
 */
PCL.define("PSI.Permission.MainForm", {
  extend: "PSI.AFX.Form.MainForm",

  config: {
    pAdd: "",
    pEdit: "",
    pDelete: ""
  },

  /**
   * 初始化组件
   * 
   * @override
   */
  initComponent() {
    const me = this;

    PCL.apply(me, {
      items: [{
        tbar: me.getToolbarCmp(),
        id: "panelQueryCmp",
        region: "north",
        border: 0,
        height: 65,
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
        items: [{
          layout: "border",
          border: 0,
          items: [{
            region: "north",
            height: "50%",
            border: 0,
            split: true,
            layout: "fit",
            items: me.getPermissionGrid()
          }, {
            xtype: "panel",
            region: "center",
            border: 0,
            layout: "fit",
            items: [me.getUserGrid()]
          }]
        }]
      }, {
        id: "panelRole",
        region: "west",
        layout: "fit",
        width: 250,
        split: true,
        collapsible: true,
        header: false,
        border: 0,
        items: [me.getRoleGrid()]
      }]
    });

    me.callParent(arguments);

    me.refreshRoleGrid();

    // 查询控件input List
    me.__editorList = [PCL.getCmp("editQueryLoginName"), PCL.getCmp("editQueryName")];
  },

  /**
   * @private
   */
  getQueryCmp() {
    const me = this;
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
      id: "editQueryName",
      labelWidth: 60,
      labelAlign: "right",
      labelSeparator: "",
      fieldLabel: "用户姓名",
      margin: "5, 0, 0, 0",
      xtype: "textfield",
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
        margin: "5, 0, 0, 20",
        handler: me._onQuery,
        scope: me
      }, {
        xtype: "button",
        text: "清空查询条件",
        width: 100,
        height: 26,
        margin: "5, 0, 0, 5",
        handler: me._onClearQuery,
        scope: me
      }, {
        xtype: "button",
        text: "隐藏工具栏",
        width: 130,
        height: 26,
        iconCls: "PSI-button-hide",
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
  getToolbarCmp() {
    const me = this;
    return [{
      text: "新建角色",
      handler: me._onAddRole,
      scope: me,
      disabled: me.getPAdd() == "0"
    }, {
      text: "编辑角色",
      handler: me._onEditRole,
      scope: me,
      disabled: me.getPEdit() == "0"
    }, {
      text: "删除角色",
      handler: me._onDeleteRole,
      scope: me,
      disabled: me.getPDelete() == "0"
    }, "-", {
      disabled: me.getPAdd() == "0",
      text: "工具",
      menu: [{
        text: "以复制当前角色的方式新建角色",
        handler: me._onCopyRole,
        scope: me,
        disabled: me.getPAdd() == "0"
      }]
    }, "-", {
      text: "指南",
      handler() {
        me.focus();
        window.open(me.URL("Home/Help/index?t=permission"));
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
  getRoleGrid() {
    const me = this;
    if (me._roleGrid) {
      return me._roleGrid;
    }

    const modelName = "PSIModel.PSI.Permission.MainForm.RoleModel";
    PCL.define(modelName, {
      extend: "PCL.data.Model",
      fields: ["id", "name", "code"]
    });

    const roleStore = PCL.create("PCL.data.Store", {
      model: modelName,
      autoLoad: false,
      data: []
    });

    me._roleGrid = PCL.create("PCL.grid.Panel", {
      cls: "PSI-FC",
      header: {
        height: 30,
        title: me.formatGridHeaderTitle("角色")
      },
      tools: [{
        type: "close",
        handler() {
          PCL.getCmp("panelRole").collapse();
        }
      }],
      viewConfig: {
        enableTextSelection: true
      },
      store: roleStore,
      columnLines: true,
      columns: {
        defaults: {
          sortable: false,
          menuDisabled: true,
        },
        items: [{
          header: "编码",
          dataIndex: "code",
          width: 100,
        }, {
          header: "角色名称",
          dataIndex: "name",
          flex: 1,
        }]
      },
      listeners: {
        itemdblclick: {
          fn: me._onEditRole,
          scope: me
        },
        select: {
          fn: me._onRoleGridSelect,
          scope: me
        }
      }
    });

    return me._roleGrid;
  },

  /**
   * @private
   */
  getPermissionGrid() {
    const me = this;
    if (me._permissionGrid) {
      return me._permissionGrid;
    }

    const modelName = "PSIModel.PSI.Permission.MainForm.PermissionModel";
    PCL.define(modelName, {
      extend: "PCL.data.Model",
      fields: ["id", "name", "dataOrg", "dataOrgWithName", "note", "category"]
    });

    const permissionStore = PCL.create("PCL.data.Store", {
      model: modelName,
      autoLoad: false,
      data: []
    });

    me._permissionGrid = PCL.create("PCL.grid.Panel", {
      header: {
        height: 30,
        title: me.formatGridHeaderTitle("权限")
      },
      cls: "PSI-HL",
      store: permissionStore,
      columnLines: true,
      viewConfig: {
        enableTextSelection: true
      },
      columns: {
        defaults: {
          sortable: false,
          menuDisabled: true,
        },
        items: [PCL.create("PCL.grid.RowNumberer", {
          text: "#",
          align: "right",
          width: 60
        }), {
          header: "按模块分类",
          dataIndex: "category",
          width: 120,
        }, {
          header: "权限名称",
          dataIndex: "name",
          width: 300,
          renderer(value) {
            return `<div class='PSI-grid-cell-autoWrap'>${value}</div>`;
          }
        }, {
          header: "说明",
          dataIndex: "note",
          flex: 1,
          renderer(value) {
            return `<div class='PSI-grid-cell-autoWrap'>${value}</div>`;
          }
        }, {
          header: "数据域",
          dataIndex: "dataOrgWithName",
          width: 300,
          renderer(value) {
            return `<div class='PSI-grid-cell-autoWrap'>${value}</div>`;
          }
        }]
      },
    });

    return me._permissionGrid;
  },

  /**
   * @private
   */
  getUserGrid() {
    const me = this;
    if (me._userGrid) {
      return me._userGrid;
    }

    const modelName = "PSIModel.PSI.Permission.MainForm.UserModel";
    PCL.define(modelName, {
      extend: "PCL.data.Model",
      fields: ["id", "loginName", "name", "orgFullName",
        "enabled"]
    });

    const userStore = PCL.create("PCL.data.Store", {
      model: modelName,
      autoLoad: false,
      data: []
    });

    me._userGrid = PCL.create("PCL.grid.Panel", {
      header: {
        height: 30,
        title: me.formatGridHeaderTitle("用户")
      },
      viewConfig: {
        enableTextSelection: true
      },
      cls: "PSI-HL",
      store: userStore,
      columnLines: true,
      columns: {
        defaults: {
          sortable: false,
          menuDisabled: true,
        },
        items: [PCL.create("PCL.grid.RowNumberer", {
          text: "#",
          align: "right",
          width: 60
        }), {
          header: "用户姓名",
          dataIndex: "name",
          width: 160
        }, {
          header: "登录名",
          dataIndex: "loginName",
          width: 200
        }, {
          header: "所属组织",
          dataIndex: "orgFullName",
          flex: 1
        }]
      }
    });
    return me._userGrid;
  },

  /**
   * 刷新角色Grid
   * 
   * @private
   */
  refreshRoleGrid(id) {
    const me = this;

    const grid = me.getRoleGrid();
    const store = grid.getStore();

    PCL.getBody().mask("数据加载中...");
    me.ajax({
      url: me.URL("Home/Permission/roleList"),
      params: {
        queryLoginName: PCL.getCmp("editQueryLoginName").getValue(),
        queryName: PCL.getCmp("editQueryName").getValue()
      },
      callback(options, success, response) {
        store.removeAll();

        if (success) {
          const data = me.decodeJSON(response.responseText);
          store.add(data);

          if (data.length > 0) {
            if (id) {
              const r = store.findExact("id", id);
              if (r != -1) {
                grid.getSelectionModel().select(r);
              }
            } else {
              grid.getSelectionModel().select(0);
            }
            me._onRoleGridSelect();
          }
        }

        PCL.getBody().unmask();
      }
    });
  },

  /**
   * @private
   */
  _onRoleGridSelect() {
    const me = this;

    const grid = me.getPermissionGrid();

    const item = me.getRoleGrid().getSelectionModel().getSelection();
    if (item == null || item.length != 1) {
      return;
    }

    const role = item[0];
    const store = grid.getStore();
    grid.setTitle(me.formatGridHeaderTitle(`<span class='PSI-title-keyword'>${role.get("name")}</span> - 权限列表`));

    const el = grid.getEl() || PCL.getBody();

    el.mask("数据加载中...");
    me.ajax({
      url: me.URL("Home/Permission/permissionList"),
      params: {
        roleId: role.get("id")
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

    const userGrid = me.getUserGrid();
    const userStore = userGrid.getStore();
    const userEl = userGrid.getEl() || PCL.getBody();
    userGrid.setTitle(me.formatGridHeaderTitle(`<span class='PSI-title-keyword'>${role.get("name")}</span> - 人员列表`));
    userEl.mask("数据加载中...");
    me.ajax({
      url: me.URL("Home/Permission/userList"),
      params: {
        roleId: role.get("id")
      },
      callback(options, success, response) {
        userStore.removeAll();

        if (success) {
          const data = me.decodeJSON(response.responseText);
          userStore.add(data);
        }

        userEl.unmask();
      }
    });
  },

  /**
   * 新增角色
   * 
   * @private
   */
  _onAddRole() {
    const me = this;
    const form = PCL.create("PSI.Permission.EditForm", {
      parentForm: me
    });

    form.show();
  },

  /**
   * 以复制方式新建角色
   * 
   * @private
   */
  _onCopyRole() {
    const me = this;
    const grid = me.getRoleGrid();
    const items = grid.getSelectionModel().getSelection();

    if (items == null || items.length != 1) {
      me.showInfo("请选择要编辑的角色");
      return;
    }

    const roleCopy = items[0];

    const form = PCL.create("PSI.Permission.EditForm", {
      parentForm: me,
      roleCopy
    });

    form.show();
  },

  /**
   * 编辑角色
   * 
   * @private
   */
  _onEditRole() {
    const me = this;

    const grid = me.getRoleGrid();
    const items = grid.getSelectionModel().getSelection();

    if (items == null || items.length != 1) {
      me.showInfo("请选择要编辑的角色");
      return;
    }

    const role = items[0].data;

    const form = PCL.create("PSI.Permission.EditForm", {
      entity: role,
      parentForm: me
    });

    form.show();
  },

  /**
   * 删除角色
   * 
   * @private
   */
  _onDeleteRole() {
    const me = this;
    const grid = me.getRoleGrid();
    const items = grid.getSelectionModel().getSelection();

    if (items == null || items.length != 1) {
      me.showInfo("请选择要删除的角色");
      return;
    }

    const role = items[0].data;

    const info = `请确认是否删除角色 <span style='color:red'>${role.name}</span> ?`;
    const funcConfirm = () => {
      PCL.getBody().mask("正在删除中...");
      const r = {
        url: me.URL("Home/Permission/deleteRole"),
        params: {
          id: role.id
        },
        callback(options, success, response) {
          PCL.getBody().unmask();

          if (success) {
            const data = PCL.JSON.decode(response.responseText);
            if (data.success) {
              me.refreshRoleGrid();
              me.tip("成功完成删除操作", true);
            } else {
              me.showInfo(data.msg);
            }
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
  _onClearQuery() {
    const me = this;

    PCL.getCmp("editQueryLoginName").setValue(null);
    PCL.getCmp("editQueryName").setValue(null);

    me._onQuery();
  },

  /**
   * @private
   */
  _onQuery() {
    const me = this;

    me.getPermissionGrid().getStore().removeAll();
    me.getPermissionGrid().setTitle("权限列表");
    me.getUserGrid().getStore().removeAll();
    me.getUserGrid().setTitle("用户列表");

    me.refreshRoleGrid();
  }
});
