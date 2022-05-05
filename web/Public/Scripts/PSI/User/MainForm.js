/**
 * 用户管理 - 主界面
 * 
 * @author 艾格林门信息服务（大连）有限公司
 * @copyright 2015 - present
 * @license GPL v3
 */

PCL.define("PSI.User.MainForm", {
  extend: "PSI.AFX.Form.MainForm",

  config: {
    pAddOrg: null,
    pEditOrg: null,
    pDeleteOrg: null,
    pAddUser: null,
    pEditUser: null,
    pDeleteUser: null,
    pChangePassword: null
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
        tbar: [{
          text: "新建组织机构",
          disabled: me.getPAddOrg() == "0",
          handler: me._onAddOrg,
          scope: me
        }, {
          text: "编辑组织机构",
          disabled: me.getPEditOrg() == "0",
          handler: me._onEditOrg,
          scope: me
        }, {
          text: "删除组织机构",
          disabled: me.getPDeleteOrg() == "0",
          handler: me._onDeleteOrg,
          scope: me
        }, "-", {
          text: "新建用户",
          disabled: me.getPAddUser() == "0",
          handler: me._onAddUser,
          scope: me
        }, {
          text: "编辑用户",
          disabled: me.getPEditUser() == "0",
          handler: me._onEditUser,
          scope: me
        }, {
          text: "删除用户",
          disabled: me.getPDeleteUser() == "0",
          handler: me._onDeleteUser,
          scope: me
        }, "-", {
          text: "修改用户密码",
          disabled: me.getPChangePassword() == "0",
          handler: me._onEditUserPassword,
          scope: me
        }, "-", {
          text: "指南",
          handler() {
            me.focus();
            window.open(me.URL("/Home/Help/index?t=user"));
          }
        }, "-", {
          text: "关闭",
          handler() {
            me.closeWindow();
          }
        }],
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
        xtype: "panel",
        layout: "fit",
        border: 0,
        items: [me.getUserGrid()]
      }, {
        id: "panelOrg",
        xtype: "panel",
        region: "west",
        layout: "fit",
        width: 510,
        split: true,
        collapsible: true,
        header: false,
        border: 0,
        items: [me.getOrgGrid()]
      }]
    });

    me.callParent(arguments);

    me.orgTree = me.getOrgGrid();

    // 查询控件input List
    me.__editorList = [PCL.getCmp("editQueryLoginName"), PCL.getCmp("editQueryName"), PCL.getCmp("editQueryEnabled")];
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
      fieldLabel: "姓名",
      margin: "5, 0, 0, 0",
      xtype: "textfield",
      listeners: {
        specialkey: {
          fn: me.__onEditSpecialKey,
          scope: me
        }
      }
    }, {
      id: "editQueryEnabled",
      xtype: "combo",
      queryMode: "local",
      editable: false,
      valueField: "id",
      labelWidth: 60,
      labelAlign: "right",
      labelSeparator: "",
      fieldLabel: "状态",
      margin: "5, 0, 0, 0",
      store: PCL.create("PCL.data.ArrayStore", {
        fields: ["id", "text"],
        data: [[-1, "全部"], [1, "允许登录"], [0, "禁止登录"]]
      }),
      value: -1,
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
        handler: function () {
          PCL.getCmp("panelQueryCmp").collapse();
        },
        scope: me
      }]
    }];
  },

  /**
   * @private
   */
  getOrgGrid() {
    const me = this;
    if (me._orgGrid) {
      return me._orgGrid;
    }

    const modelName = "PSIModel.PSI.User.OrgModel";
    PCL.define(modelName, {
      extend: "PCL.data.Model",
      fields: ["id", "text", "fullName", "orgCode", "dataOrg",
        "leaf", "children", "userCount", "orgType"]
    });

    const orgStore = PCL.create("PCL.data.TreeStore", {
      model: modelName,
      proxy: {
        type: "ajax",
        actionMethods: {
          read: "POST"
        },
        url: me.URL("Home/User/allOrgs")
      },
      listeners: {
        beforeload: {
          fn() {
            orgStore.proxy.extraParams = me.getQueryParamForCategory();
          },
          scope: me
        }
      }
    });

    orgStore.on("load", me._onOrgStoreLoad, me);

    const orgTree = PCL.create("PCL.tree.Panel", {
      cls: "PSI",
      header: {
        height: 30,
        title: me.formatGridHeaderTitle("组织机构")
      },
      store: orgStore,
      rootVisible: false,
      useArrows: true,
      viewConfig: {
        loadMask: true
      },
      tools: [{
        type: "close",
        handler() {
          PCL.getCmp("panelOrg").collapse();
        }
      }],
      columns: {
        defaults: {
          sortable: false,
          menuDisabled: true,
          draggable: false
        },
        items: [{
          xtype: "treecolumn",
          text: "名称",
          dataIndex: "text",
          width: 300
        }, {
          text: "编码",
          dataIndex: "orgCode",
          width: 100
        }, {
          text: "数据域",
          dataIndex: "dataOrg",
          width: 100
        }, {
          text: "用户数",
          dataIndex: "userCount",
          width: 80,
          align: "right"
        }, {
          text: "组织机构性质",
          dataIndex: "orgType",
          width: 200
        }]
      }
    });

    orgTree.on("select", (rowModel, record) => {
      me._onOrgTreeNodeSelect(record);
    }, me);

    orgTree.on("beforeitemdblclick", () => { me._onEditOrg(); return false; }, me);

    me._orgGrid = orgTree;

    return me._orgGrid;
  },

  /**
   * @private
   */
  getUserGrid() {
    const me = this;

    if (me._userGrid) {
      return me._userGrid;
    }

    const modelName = "PSIModel.PSI.User.UserModel";
    PCL.define(modelName, {
      extend: "PCL.data.Model",
      fields: ["id", "loginName", "name", "enabled", "orgCode",
        "gender", "birthday", "idCardNumber", "tel",
        "tel02", "address", "dataOrg", "roleName"]
    });
    const storeGrid = PCL.create("PCL.data.Store", {
      autoLoad: false,
      model: modelName,
      data: [],
      pageSize: 20,
      proxy: {
        type: "ajax",
        actionMethods: {
          read: "POST"
        },
        url: me.URL("Home/User/users"),
        reader: {
          root: 'dataList',
          totalProperty: 'totalCount'
        }
      }
    });
    storeGrid.on("beforeload", () => {
      storeGrid.proxy.extraParams = me.getUserParam();
    });

    me._userGrid = PCL.create("PCL.grid.Panel", {
      cls: "PSI-LC",
      header: {
        height: 30,
        title: me.formatGridHeaderTitle("人员列表")
      },
      viewConfig: {
        enableTextSelection: true
      },
      columnLines: true,
      columns: {
        defaults: {
          menuDisabled: true,
          sortable: false,
        },
        items: [PCL.create("PCL.grid.RowNumberer", {
          text: "#",
          width: 40
        }), {
          header: "登录名",
          dataIndex: "loginName",
          locked: true,
          width: 250, // 登录名用这么宽，是因为常用手机号作为登录名
          renderer(value, metaData, record) {
            if (parseInt(record.get("enabled")) == 1) {
              return value;
            } else {
              return `<span class="PSI-record-disabled">${value}</span>`;
            }
          }
        }, {
          header: "姓名",
          dataIndex: "name",
          locked: true,
          renderer(value, metaData, record) {
            if (parseInt(record.get("enabled")) == 1) {
              return value;
            } else {
              return `<span class="PSI-record-disabled">${value}</span>`;
            }
          }
        }, {
          header: "权限角色",
          dataIndex: "roleName",
          width: 200
        }, {
          header: "编码",
          dataIndex: "orgCode",
        }, {
          header: "是否允许登录",
          dataIndex: "enabled",
          renderer(value) {
            return value == 1
              ? "允许登录"
              : "<span style='color:red'>禁止登录</span>";
          }
        }, {
          header: "性别",
          dataIndex: "gender",
          width: 70
        }, {
          header: "生日",
          dataIndex: "birthday",
        }, {
          header: "身份证号",
          dataIndex: "idCardNumber",
          width: 200
        }, {
          header: "联系电话",
          dataIndex: "tel",
        }, {
          header: "备用联系电话",
          dataIndex: "tel02",
        }, {
          header: "家庭住址",
          dataIndex: "address",
          width: 200
        }, {
          header: "数据域",
          dataIndex: "dataOrg",
          width: 100
        }]
      },
      store: storeGrid,
      listeners: {
        itemdblclick: {
          fn: me._onEditUser,
          scope: me
        }
      },
      bbar: ["->", {
        id: "pagingToolbar",
        border: 0,
        xtype: "pagingtoolbar",
        store: storeGrid
      }, "-", {
          xtype: "displayfield",
          value: "每页显示"
        }, {
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
                storeGrid.pageSize = PCL.getCmp("comboCountPerPage").getValue();
                storeGrid.currentPage = 1;
                PCL.getCmp("pagingToolbar").doRefresh();
              },
              scope: me
            }
          }
        }, {
          xtype: "displayfield",
          value: "条记录"
        }]
    });

    return me._userGrid;
  },

  /**
   * 新增组织机构
   * 
   * @private
   */
  _onAddOrg() {
    const me = this;

    const form = PCL.create("PSI.User.OrgEditForm", {
      parentForm: me
    });
    form.show();
  },

  /**
   * 编辑组织机构
   * 
   * @private
   */
  _onEditOrg() {
    const me = this;
    if (me.getPEditOrg() == "0") {
      return;
    }

    const tree = me.getOrgGrid();
    const item = tree.getSelectionModel().getSelection();
    if (item === null || item.length !== 1) {
      me.showInfo("请选择要编辑的组织机构");
      return;
    }

    const org = item[0];

    const form = PCL.create("PSI.User.OrgEditForm", {
      parentForm: me,
      entity: org
    });
    form.show();
  },

  /**
   * 删除组织机构
   * 
   * @private
   */
  _onDeleteOrg() {
    const me = this;
    const tree = me.getOrgGrid();
    const item = tree.getSelectionModel().getSelection();
    if (item === null || item.length !== 1) {
      me.showInfo("请选择要删除的组织机构");
      return;
    }

    const org = item[0].getData();

    const funcConfirm = () => {
      PCL.getBody().mask("正在删除中...");
      const r = {
        url: me.URL("Home/User/deleteOrg"),
        params: {
          id: org.id
        },
        callback(options, success, response) {
          PCL.getBody().unmask();

          if (success) {
            const data = me.decodeJSON(response.responseText);
            if (data.success) {
              me.tip("成功完成删除操作");
              me.freshOrgGrid();
            } else {
              me.showInfo(data.msg);
            }
          }
        }
      };

      me.ajax(r);
    };

    const info = `请确认是否删除组织机构 <span style='color:red'>${org.fullName}</span> ?`;
    me.confirm(info, funcConfirm);
  },

  /**
   * @private
   */
  freshOrgGrid() {
    const me = this;

    me.getOrgGrid().getStore().reload();
  },

  /**
   * @private
   */
  freshUserGrid() {
    const me = this;

    const tree = me.getOrgGrid();
    const item = tree.getSelectionModel().getSelection();
    if (item === null || item.length !== 1) {
      return;
    }

    me._onOrgTreeNodeSelect(item[0]);
  },

  /**
   * 新增用户
   * 
   * @private
   */
  _onAddUser() {
    const me = this;

    const tree = me.getOrgGrid();
    const item = tree.getSelectionModel().getSelection();
    let org = null;
    if (item != null && item.length > 0) {
      org = item[0];
    }

    const form = PCL.create("PSI.User.UserEditForm", {
      parentForm: me,
      defaultOrg: org
    });
    form.show();
  },

  /**
   * 编辑用户
   * 
   * @private
   */
  _onEditUser() {
    const me = this;
    if (me.getPEditUser() == "0") {
      return;
    }

    const item = me.getUserGrid().getSelectionModel().getSelection();
    if (item === null || item.length !== 1) {
      me.showInfo("请选择要编辑的用户");
      return;
    }

    const user = item[0];

    const form = PCL.create("PSI.User.UserEditForm", {
      parentForm: me,
      entity: user
    });
    form.show();
  },

  /**
   * 修改用户密码
   * 
   * @private
   */
  _onEditUserPassword() {
    const me = this;

    const item = me.getUserGrid().getSelectionModel().getSelection();
    if (item === null || item.length !== 1) {
      me.showInfo("请选择要修改密码的用户");
      return;
    }

    const user = item[0].getData();
    const form = PCL.create("PSI.User.ChangeUserPasswordForm", {
      entity: user
    });
    form.show();
  },

  /**
   * 删除用户
   * 
   * @private
   */
  _onDeleteUser() {
    const me = this;
    const item = me.getUserGrid().getSelectionModel().getSelection();
    if (item === null || item.length !== 1) {
      me.showInfo("请选择要删除的用户");
      return;
    }

    const user = item[0].getData();

    const funcConfirm = () => {
      PCL.getBody().mask("正在删除中...");
      const r = {
        url: me.URL("Home/User/deleteUser"),
        params: {
          id: user.id
        },
        callback(options, success, response) {
          PCL.getBody().unmask();

          if (success) {
            const data = me.decodeJSON(response.responseText);
            if (data.success) {
              me.tip("成功完成删除操作", true);
              me.freshUserGrid();
            } else {
              me.showInfo(data.msg);
            }
          }
        }
      };
      me.ajax(r);
    };

    const info = `请确认是否删除用户 <span style='color:red'>${user.name}</span> ?`;
    me.confirm(info, funcConfirm);
  },

  /**
   * @private
   */
  _onOrgTreeNodeSelect(rec) {
    if (!rec) {
      return;
    }

    const org = rec.data;
    if (!org) {
      return;
    }

    const me = this;
    const grid = me.getUserGrid();

    grid.setTitle(me.formatGridHeaderTitle(`<span class='PSI-title-keyword'>${org.fullName}</span> - 人员列表`));

    PCL.getCmp("pagingToolbar").doRefresh();
  },

  /**
   * @private
   */
  _onOrgStoreLoad() {
    const me = this;

    const tree = me.getOrgGrid();
    const root = tree.getRootNode();
    if (root) {
      const node = root.firstChild;
      if (node) {
        tree.getSelectionModel().select(node);
      }
    }
  },

  /**
   * @private
   */
  getUserParam() {
    const me = this;
    const item = me.getOrgGrid().getSelectionModel().getSelection();
    if (item == null || item.length == 0) {
      return {};
    }

    const org = item[0];

    let queryLoginName = null;
    const editLoginName = PCL.getCmp("editQueryLoginName");
    if (editLoginName) {
      queryLoginName = editLoginName.getValue();
    }

    let queryName = null;
    const editQueryName = PCL.getCmp("editQueryName");
    if (editQueryName) {
      queryName = editQueryName.getValue();
    }

    let enabled = -1;
    const edit = PCL.getCmp("editQueryEnabled");
    if (edit) {
      enabled = edit.getValue();
    }

    const orgId = org.get("id");

    return {
      orgId,
      queryLoginName,
      queryName,
      enabled,
    }
  },

  /**
   * @private
   */
  _onClearQuery() {
    const me = this;

    PCL.getCmp("editQueryLoginName").setValue(null);
    PCL.getCmp("editQueryName").setValue(null);
    PCL.getCmp("editQueryEnabled").setValue(-1);

    me._onQuery();
  },

  /**
   * @private
   */
  _onQuery() {
    const me = this;

    me.getUserGrid().getStore().removeAll();

    me.freshOrgGrid();
  },

  /**
   * @private
   */
  getQueryParamForCategory() {
    let queryLoginName = null;
    const editLoginName = PCL.getCmp("editQueryLoginName");
    if (editLoginName) {
      queryLoginName = editLoginName.getValue();
    }

    let queryName = null;
    const editQueryName = PCL.getCmp("editQueryName");
    if (editQueryName) {
      queryName = editQueryName.getValue();
    }

    let enabled = -1;
    const edit = PCL.getCmp("editQueryEnabled");
    if (edit) {
      enabled = edit.getValue();
    }

    return {
      queryLoginName,
      queryName,
      enabled
    };
  }
});
