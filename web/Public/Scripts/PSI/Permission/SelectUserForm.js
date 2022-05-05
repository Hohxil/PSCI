/**
 * 选择用户
 * 
 * @author 艾格林门信息服务（大连）有限公司
 * @copyright 2015 - present
 * @license GPL v3
 */
PCL.define("PSI.Permission.SelectUserForm", {
  extend: "PSI.AFX.Form.EditForm",

  config: {
    idList: null, // idList是数组
    parentForm: null
  },

  width: 850,
  height: 570,
  modal: true,
  layout: "border",

  initComponent() {
    const me = this;
    PCL.define("PSIUser_SelectUserForm", {
      extend: "PCL.data.Model",
      fields: ["id", "loginName", "code", "name", "orgFullName"]
    });

    const userStore = PCL.create("PCL.data.Store", {
      model: "PSIUser_SelectUserForm",
      autoLoad: false,
      data: []
    });

    const grid = PCL.create("PCL.grid.Panel", {
      cls: "PSI-HL",
      header: {
        height: 30,
        title: me.formatGridHeaderTitle("可以添加到当前角色的用户(已禁止登录的用户不会出现在列表中)")
      },
      padding: 5,
      selModel: {
        mode: "MULTI"
      },
      selType: "checkboxmodel",
      viewConfig: {
        deferEmptyText: false,
      },
      store: userStore,
      columnLines: true,
      columns: [{
        header: "用户编码",
        dataIndex: "code",
        width: 120,
        menuDisabled: true
      }, {
        header: "用户姓名",
        dataIndex: "name",
        width: 120,
        menuDisabled: true
      }, {
        header: "登录名",
        dataIndex: "loginName",
        width: 120,
        menuDisabled: true
      }, {
        header: "所属组织",
        dataIndex: "orgFullName",
        flex: 1,
        menuDisabled: true
      }]
    });

    me._mainGrid = grid;

    PCL.apply(me, {
      header: {
        height: 40,
        title: me.formatTitle("选择用户")
      },
      items: [{
        region: "center",
        layout: "fit",
        border: 0,
        items: grid
      }, {
        region: "south",
        height: 70,
        border: 0,
        items: [{
          xtype: "form",
          layout: "form",
          border: 0,
          bodyPadding: 5,
          items: [{
            id: "PSI_Permission_SelectUserForm_editUser",
            xtype: "textfield",
            fieldLabel: "用户",
            labelWidth: 30,
            labelAlign: "right",
            labelSeparator: ""
          }, {
            xtype: "displayfield",
            value: "输入人员编码、登录名、拼音字头可以过滤"
          }]
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
        show: {
          fn: me.onWndShow,
          scope: me
        }
      }
    });

    me.callParent(arguments);

    me.editName = PCL.getCmp("PSI_Permission_SelectUserForm_editUser");
    me.editName.on("change", () => {
      me.refreshMainGrid();
    });
  },

  refreshMainGrid() {
    const me = this;
    const idList = me.getIdList();
    const userStore = me._mainGrid.getStore();

    const el = me.getEl() || PCL.getBody();
    el.mask("数据加载中...");
    me.ajax({
      url: me.URL("Home/Permission/selectUsers"),
      params: {
        idList: idList.join(),
        name: me.editName.getValue()
      },
      callback(options, success, response) {
        el.unmask();
        userStore.removeAll();

        if (success) {
          const data = me.decodeJSON(response.responseText);
          userStore.add(data);
        }
      }
    });

  },

  onWndShow() {
    const me = this;
    me.editName.focus();

    me.refreshMainGrid();
  },

  onOK() {
    const me = this;
    const grid = me._mainGrid;

    const items = grid.getSelectionModel().getSelection();
    if (items == null || items.length == 0) {
      me.showInfo("没有选择用户");

      return;
    }

    const parentForm = me.getParentForm();
    if (parentForm) {
      parentForm.setSelectedUsers.apply(parentForm, [items]);
    }

    me.close();
  }
});
