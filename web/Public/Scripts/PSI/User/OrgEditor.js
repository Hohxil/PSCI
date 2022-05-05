/**
 * 自定义字段 - 组织机构字段
 * 
 * @author 艾格林门信息服务（大连）有限公司
 * @copyright 2015 - present
 * @license GPL v3
 */
PCL.define("PSI.User.OrgEditor", {
  extend: "PCL.form.field.Trigger",
  alias: "widget.PSI_org_editor",

  config: {
    parentItem: null,
  },

  /**
   * @override
   */
  initComponent() {
    const me = this;

    me.enableKeyEvents = true;

    me.callParent(arguments);

    me.on("keydown", (field, e) => {
      if (e.getKey() === e.BACKSPACE) {
        e.preventDefault();
        return false;
      }

      if (e.getKey() !== e.ENTER) {
        me.onTriggerClick(e);
      }
    });

    me.on("render", (p) => {
      p.getEl().on("dblclick", () => {
        me.onTriggerClick();
      });
    });
  },

  /**
   * @override
   */
  onTriggerClick(e) {
    const me = this;

    const modelName = "PSIModel.PSI.User.OrgEditor.OrgModel";
    PCL.define(modelName, {
      extend: "PCL.data.Model",
      fields: ["id", "text", "fullName", "orgCode",
        "leaf", "children"]
    });

    const orgStore = PCL.create("PCL.data.TreeStore", {
      model: modelName,
      proxy: {
        type: "ajax",
        actionMethods: {
          read: "POST"
        },
        extraParams: {
          enabled: -1
        },
        url: PSI.Const.BASE_URL + "Home/User/allOrgs"
      }
    });

    const orgTree = PCL.create("PCL.tree.Panel", {
      cls: "PSI",
      store: orgStore,
      rootVisible: false,
      useArrows: true,
      viewConfig: {
        loadMask: true
      },
      columns: {
        defaults: {
          flex: 1,
          sortable: false,
          menuDisabled: true,
          draggable: false
        },
        items: [{
          xtype: "treecolumn",
          text: "名称",
          dataIndex: "text",
          flex: 2
        }, {
          text: "编码",
          dataIndex: "orgCode"
        }]
      }
    });
    orgTree.on("itemdblclick", me._onOK, me);
    me.tree = orgTree;

    const wnd = PCL.create("PCL.window.Window", {
      title: "选择组织机构",
      modal: true,
      width: 500,
      height: 300,
      layout: "fit",
      items: [orgTree],
      buttons: [{
        text: "确定",
        handler: me._onOK,
        scope: me
      }, {
        text: "取消",
        handler() {
          wnd.close();
        }
      }]
    });
    me.wnd = wnd;
    wnd.show();
  },

  /**
   * @private
   */
  _onOK() {
    const me = this;

    const tree = me.tree;
    const item = tree.getSelectionModel().getSelection();

    if (item === null || item.length !== 1) {
      PSI.MsgBox.showInfo("没有选择组织机构");

      return;
    }

    const data = item[0];
    const parentItem = me.getParentItem();
    if (parentItem && parentItem.setOrg) {
      const org = {
        id: data.get("id"), fullName:
          data.get("fullName")
      };

      // 回调
      parentItem.setOrg.apply(parentItem, [org]);
    }
    me.wnd.close();
    me.focus();
  }
});
