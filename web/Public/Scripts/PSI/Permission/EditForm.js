/**
 * 权限 - 角色新增或编辑界面
 * 
 * @author 艾格林门信息服务（大连）有限公司
 * @copyright 2015 - present
 * @license GPL v3
 */
PCL.define("PSI.Permission.EditForm", {
  extend: "PSI.AFX.Form.EditForm",

  config: {
    roleCopy: null
  },

  /**
   * @override
   */
  initComponent() {
    const me = this;
    const entity = me.getEntity();

    let modelName = "PSIModel.PSI.Permission.EditForm.PermissionModel";
    PCL.define(modelName, {
      extend: "PCL.data.Model",
      fields: ["id", "name", "dataOrg", "dataOrgFullName"]
    });

    const permissionStore = PCL.create("PCL.data.Store", {
      model: modelName,
      autoLoad: false,
      data: []
    });

    const permissionGrid = PCL.create("PCL.grid.Panel", {
      cls: "PSI-HL",
      header: {
        height: 30,
        title: me.formatGridHeaderTitle("角色的权限")
      },
      padding: 5,
      selModel: {
        mode: "MULTI"
      },
      selType: "checkboxmodel",
      store: permissionStore,
      columns: {
        defaults: {
          sortable: false,
          menuDisabled: true,
        }, items: [{
          header: "权限名称",
          dataIndex: "name",
          flex: 2,
          menuDisabled: true
        }, {
          header: "数据域",
          dataIndex: "dataOrg",
          flex: 1,
          menuDisabled: true
        }, {
          header: "操作",
          align: "center",
          menuDisabled: true,
          width: 50,
          xtype: "actioncolumn",
          items: [{
            icon: me.URL("Public/Images/icons/delete.png"),
            handler(grid, row) {
              const store = grid.getStore();
              store.remove(store.getAt(row));
            },
            scope: this
          }]
        }]
      },
      tbar: [{
        text: "添加权限",
        handler: me._onAddPermission,
        scope: me,
      }, "-", {
        text: "移除权限",
        handler: me._onRemovePermission,
        scope: me,
      }, "-", {
        text: "编辑数据域",
        handler: me._onEditDataOrg,
        scope: me,
      }]
    });

    me.permissionGrid = permissionGrid;

    modelName = "PSIModel.PSI.Permission.EditForm.UserModel";
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

    const userGrid = PCL.create("PCL.grid.Panel", {
      cls: "PSI-HL",
      header: {
        height: 30,
        title: me.formatGridHeaderTitle("属于当前角色的用户")
      },
      padding: 5,
      selModel: {
        mode: "MULTI"
      },
      selType: "checkboxmodel",
      store: userStore,
      columns: {
        defaults: {
          sortable: false,
          menuDisabled: true,
        }, items: [{
          header: "用户姓名",
          dataIndex: "name",
          flex: 1
        }, {
          header: "登录名",
          dataIndex: "loginName",
          flex: 1
        }, {
          header: "所属组织",
          dataIndex: "orgFullName",
          flex: 1
        }, {
          header: "操作",
          align: "center",
          menuDisabled: true,
          width: 50,
          xtype: "actioncolumn",
          items: [{
            icon: me.URL("Public/Images/icons/delete.png"),
            handler(grid, row) {
              const store = grid.getStore();
              store.remove(store.getAt(row));
            },
            scope: me
          }]
        }]
      },
      tbar: [{
        text: "添加用户",
        handler: me._onAddUser,
        scope: me
      }, "-", {
        text: "移除用户",
        handler: me._onRemoveUser,
        scope: me
      }]
    });

    me.userGrid = userGrid;

    const t = entity == null ? "新建角色" : "编辑角色";
    const title = me.formatTitle(t);

    PCL.apply(me, {
      header: {
        title,
        height: 40,
      },
      maximized: true,
      width: 700,
      height: 600,
      layout: "border",
      items: [{
        xtype: "panel",
        region: "north",
        layout: "fit",
        height: 40,
        border: 0,
        items: [{
          id: "editForm",
          xtype: "form",
          layout: {
            type: "table",
            columns: 2
          },
          border: 0,
          bodyPadding: 5,
          defaultType: 'textfield',
          fieldDefaults: {
            labelWidth: 60,
            labelAlign: "right",
            labelSeparator: "",
            msgTarget: 'side',
            width: 670,
            margin: "5"
          },
          items: [{
            xtype: "hidden",
            name: "id",
            value: entity == null
              ? null
              : entity.id
          }, {
            id: "editName",
            fieldLabel: "角色名称",
            allowBlank: false,
            blankText: "没有输入角色名称",
            beforeLabelTextTpl: PSI.Const.REQUIRED,
            name: "name",
            value: entity == null
              ? null
              : entity.name,
            listeners: {
              specialkey: {
                fn: me.__onEditSpecialKey,
                scope: me
              }
            }
          }, {
            id: "editCode",
            fieldLabel: "角色编码",
            blankText: "没有输入角色编码",
            allowBlank: false,
            beforeLabelTextTpl: PSI.Const.REQUIRED,
            name: "code",
            value: entity == null
              ? null
              : entity.code,
            width: 200
          }, {
            id: "editPermissionIdList",
            xtype: "hidden",
            name: "permissionIdList"
          }, {
            id: "editDataOrgList",
            xtype: "hidden",
            name: "dataOrgList"
          }, {
            id: "editUserIdList",
            xtype: "hidden",
            name: "userIdList"
          }]
        }]
      }, {
        xtype: "panel",
        region: "center",
        flex: 1,
        border: 0,
        layout: "border",
        items: [{
          region: "center",
          layout: "fit",
          border: 0,
          items: [permissionGrid]
        }]
      }, {
        xtype: "panel",
        region: "south",
        flex: 1,
        border: 0,
        layout: "fit",
        items: [userGrid]
      }],
      tbar: [{
        text: "保存",
        formBind: true,
        iconCls: "PSI-button-ok",
        handler() {
          const me = this;
          me.confirm("请确认是否保存数据?", () => {
            me._onOK();
          });
        },
        scope: me
      }, "-", {
        text: "取消",
        handler() {
          const me = this;
          const info = entity == null ? "新建角色" : "编辑角色";
          me.confirm(`请确认是否取消操作：${info}?`, () => {
            me.close();
          });
        },
        scope: me
      }],
      listeners: {
        show: {
          fn: me._onWndShow,
          scope: me
        },
        close: {
          fn: me._onWndClose,
          scope: me
        }
      }
    });

    me.callParent(arguments);

    me.editName = PCL.getCmp("editName");
    me.editCode = PCL.getCmp("editCode");

    me.__editorList = [me.editName, me.editCode];
  },

  /**
   * @private
   */
  _onWndClose() {
    const me = this;

    PCL.get(window).un('beforeunload', me.__onWindowBeforeUnload);
  },

  /**
   * @private
   */
  loadDataForCopy() {
    const me = this;
    const roleCopy = me.getRoleCopy();

    const roleName = roleCopy.get("name");
    me.editName.setValue(roleName + " - (复制，请修改)");
    me.editCode.setValue(roleCopy.get("code") + " - (复制，请修改)");

    // 获得数据
    const store = me.permissionGrid.getStore();
    const el = me.getEl() || PCL.getBody();
    const roleId = roleCopy.get("id");
    el.mask("数据加载中...");
    me.ajax({
      url: me.URL("Home/Permission/permissionList"),
      params: {
        roleId
      },
      callback(options, success, response) {
        store.removeAll();

        if (success) {
          const data = PCL.JSON.decode(response.responseText);
          store.add(data);
        }

        el.unmask();
      }
    });

    const userGrid = me.userGrid;
    const userStore = userGrid.getStore();
    const userEl = userGrid.getEl() || PCL.getBody();
    userGrid.setTitle("属于角色 [" + roleName + "] 的人员列表");
    userEl.mask("数据加载中...");
    me.ajax({
      url: me.URL("Home/Permission/userList"),
      params: {
        roleId
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
   * @private
   */
  _onWndShow() {
    const me = this;

    me.setFocusAndCursorPosToLast(me.editName);

    PCL.get(window).on('beforeunload', me.__onWindowBeforeUnload);

    const entity = me.getEntity();
    if (!entity) {
      const roleCopy = me.getRoleCopy();
      if (roleCopy) {
        // 以复制方式新建角色
        me.loadDataForCopy();
      }

      return;
    }

    const store = me.permissionGrid.getStore();
    const el = me.getEl() || PCL.getBody();

    el.mask("数据加载中...");
    me.ajax({
      url: me.URL("Home/Permission/permissionList"),
      params: {
        roleId: entity.id
      },
      callback(options, success, response) {
        store.removeAll();

        if (success) {
          const data = PCL.JSON.decode(response.responseText);
          store.add(data);
        }

        el.unmask();
      }
    });

    const userGrid = me.userGrid;
    const userStore = userGrid.getStore();
    const userEl = userGrid.getEl() || PCL.getBody();
    userGrid.setTitle("属于角色 [" + entity.name + "] 的人员列表");
    userEl.mask("数据加载中...");
    me.ajax({
      url: me.URL("Home/Permission/userList"),
      params: {
        roleId: entity.id
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
   * web\Public\Scripts\PSI\Permission\SelectPermissionForm.js中回调本方法
   * @private
   */
  setSelectedPermission(data, dataOrgList, fullNameList) {
    const me = this;

    const store = me.permissionGrid.getStore();

    const cnt = data.length;

    const d = [];

    for (let i = 0; i < cnt; i++) {
      const item = data[i];
      d.push({
        id: item.id,
        name: item.name,
        dataOrg: dataOrgList,
        dataOrgFullName: fullNameList
      });
    }

    store.add(d);
  },

  /**
   * web\Public\Scripts\PSI\Permission\SelectUserForm.js中回调本方法
   * 
   * @private
   */
  setSelectedUsers(data) {
    const me = this;

    const store = me.userGrid.getStore();

    for (let i = 0; i < data.length; i++) {
      const item = data[i];
      store.add({
        id: item.get("id"),
        name: item.get("name"),
        loginName: item.get("loginName"),
        orgFullName: item.get("orgFullName")
      });
    }
  },

  /**
   * @private
   */
  _onOK() {
    const me = this;
    const editName = PCL.getCmp("editName");

    const name = editName.getValue();
    if (name == null || name == "") {
      me.showInfo("没有输入角色名称", () => {
        editName.focus();
      });
      return;
    }
    const editCode = PCL.getCmp("editCode");
    const code = editCode.getValue();
    if (code == null || code == "") {
      me.showInfo("没有输入角色编码", () => {
        editCode.focus();
      });
      return;
    }

    let store = me.permissionGrid.getStore();
    let data = store.data;
    let idList = [];
    const dataOrgList = [];
    for (let i = 0; i < data.getCount(); i++) {
      const item = data.items[i].data;
      idList.push(item.id);
      dataOrgList.push(item.dataOrg);
    }

    const editPermissionIdList = PCL.getCmp("editPermissionIdList");
    editPermissionIdList.setValue(idList.join());

    PCL.getCmp("editDataOrgList").setValue(dataOrgList.join(","));

    store = me.userGrid.getStore();
    data = store.data;
    idList = [];
    for (let i = 0; i < data.getCount(); i++) {
      const item = data.items[i].data;
      idList.push(item.id);
    }

    const editUserIdList = PCL.getCmp("editUserIdList");
    editUserIdList.setValue(idList.join());

    const editForm = PCL.getCmp("editForm");
    const el = this.getEl() || PCL.getBody();
    el.mask("数据保存中...");

    editForm.submit({
      url: me.URL("Home/Permission/editRole"),
      method: "POST",
      success(form, action) {
        el.unmask();
        me.close();
        me.getParentForm().refreshRoleGrid(action.result.id);
        me.tip("数据保存成功", true);
      },
      failure(form, action) {
        el.unmask();
        me.showInfo(action.result.msg, () => {
          editName.focus();
        });
      }
    });
  },

  /**
   * @private
   */
  _onAddPermission() {
    const me = this;

    const store = me.permissionGrid.getStore();
    const data = store.data;
    const idList = [];
    for (let i = 0; i < data.getCount(); i++) {
      const item = data.items[i].data;
      idList.push(item.id);
    }

    const form = PCL.create("PSI.Permission.SelectPermissionForm", {
      idList: idList,
      parentForm: me
    });
    form.show();
  },

  /**
   * @private
   */
  _onRemovePermission() {
    const me = this;

    const grid = me.permissionGrid;

    const items = grid.getSelectionModel().getSelection();
    if (items == null || items.length == 0) {
      me.showInfo("请选择要移除的权限");
      return;
    }

    grid.getStore().remove(items);
  },

  /**
   * @private
   */
  _onAddUser() {
    const me = this;

    const store = me.userGrid.getStore();
    const data = store.data;
    const idList = [];
    for (let i = 0; i < data.getCount(); i++) {
      const item = data.items[i].data;
      idList.push(item.id);
    }

    const form = PCL.create("PSI.Permission.SelectUserForm", {
      idList: idList,
      parentForm: me
    });

    form.show();
  },

  /**
   * @private
   */
  _onRemoveUser() {
    const me = this;

    const grid = me.userGrid;

    const items = grid.getSelectionModel().getSelection();
    if (items == null || items.length == 0) {
      me.showInfo("请选择要移除的人员");
      return;
    }

    grid.getStore().remove(items);
  },

  /**
   * @private
   */
  _onEditDataOrg() {
    const me = this;

    const grid = me.permissionGrid;

    const items = grid.getSelectionModel().getSelection();
    if (items == null || items.length == 0) {
      me.showInfo("请选择要编辑数据域的权限");
      return;
    }

    const form = PCL.create("PSI.Permission.SelectDataOrgForm", {
      editForm: me
    });
    form.show();
  },

  /**
   * PSI.Permission.SelectDataOrgForm中回调本方法
   * 
   * @public
   */
  onEditDataOrgCallback(dataOrg) {
    const me = this;

    const grid = me.permissionGrid;

    const items = grid.getSelectionModel().getSelection();
    if (items == null || items.length == 0) {
      return;
    }

    items.forEach(it => {
      it.set("dataOrg", dataOrg);
    })
  }
});
