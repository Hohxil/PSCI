/**
 * 自定义字段 - 组织机构字段,用数据域过滤
 * 
 * @author 艾格林门信息服务（大连）有限公司
 * @copyright 2015 - present
 * @license GPL v3
 */
Ext.define("PSI.User.OrgWithDataOrgField", {
  extend: "Ext.form.field.Trigger",
  alias: "widget.psi_orgwithdataorgfield",

  /**
   * @override
   */
  initComponent() {
    const me = this;

    me._idValue = null;

    me.enableKeyEvents = true;

    me.callParent(arguments);

    me.on("keydown", (field, e) => {
      if (e.getKey() == e.BACKSPACE) {
        field.setValue(null);
        me.setIdValue(null);
        e.preventDefault();
        return false;
      }

      if (e.getKey() !== e.ENTER) {
        me.onTriggerClick(e);
      }
    });
    me.on({
      render(p) {
        p.getEl().on("dblclick", () => {
          me.onTriggerClick();
        });
      },
      single: true
    });
  },

  /**
   * @override
   */
  onTriggerClick(e) {
    const me = this;

    if (me.readOnly) {
      return;
    }

    const modelName = "PSIModel.PSI.User.OrgWithDataOrgField.OrgWithDataOrgFieldModel";
    Ext.define(modelName, {
      extend: "Ext.data.Model",
      fields: ["id", "fullName"]
    });

    const orgStore = Ext.create("Ext.data.Store", {
      model: modelName,
      autoLoad: false,
      data: []
    });

    const orgTree = Ext.create("Ext.grid.Panel", {
      cls: "PSI",
      store: orgStore,
      columns: [{
        header: "组织机构",
        dataIndex: "fullName",
        flex: 1,
        menuDisabled: true,
        sortable: false
      }]
    });
    orgTree.on("itemdblclick", me._onOK, me);
    me.tree = orgTree;

    const wnd = Ext.create("Ext.window.Window", {
      title: "选择组织机构",
      border: 0,
      header: false,
      width: 500,
      height: 400,
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

    wnd.on("deactivate", () => {
      wnd.close();
    });

    wnd.showBy(this);

    me.refreshGrid();
  },

  /**
   * @private
   */
  refreshGrid() {
    const me = this;
    const grid = me.tree;

    const el = grid.getEl() || Ext.getBody();
    el.mask(PSI.Const.LOADING);
    Ext.Ajax.request({
      url: PSI.Const.BASE_URL + "Home/User/orgWithDataOrg",
      method: "POST",
      callback(options, success, response) {
        const store = grid.getStore();

        store.removeAll();

        if (success) {
          const data = Ext.JSON.decode(response.responseText);
          store.add(data);
        }

        el.unmask();
      }
    });
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

    me.setIdValue(data.get("id"));
    me.setValue(data.get("fullName"));
    me.wnd.close();
    me.focus();
  },

  /**
   * @public
   */
  setIdValue(id) {
    this._idValue = id;
  },

  /**
   * @public
   */
  getIdValue() {
    return this._idValue;
  }
});
