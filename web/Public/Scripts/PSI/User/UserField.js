/**
 * 自定义字段 - 用户字段
 * 
 * @author 艾格林门信息服务（大连）有限公司
 * @copyright 2015 - present
 * @license GPL v3
 */
Ext.define("PSI.User.UserField", {
  extend: "Ext.form.field.Trigger",
  alias: "widget.psi_userfield",

  config: {
    showModal: false
  },

  /**
   * 初始化组件
   * 
   * @override
   */
  initComponent() {
    const me = this;
    me._idValue = null;

    me.enableKeyEvents = true;

    me.callParent(arguments);

    me.on("keydown", (field, e) => {
      if (me.readOnly) {
        return;
      }
      if (e.getKey() == e.BACKSPACE) {
        field.setValue(null);
        me.setIdValue(null);
        e.preventDefault();
        return false;
      }

      if (e.getKey() != e.ENTER && !e.isSpecialKey(e.getKey())) {
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

    const modelName = "PSIModel.PSI.User.UserField.UserFieldModel";
    Ext.define(modelName, {
      extend: "Ext.data.Model",
      fields: ["id", "loginName", "name"]
    });

    const store = Ext.create("Ext.data.Store", {
      model: modelName,
      autoLoad: false,
      data: []
    });
    const lookupGrid = Ext.create("Ext.grid.Panel", {
      cls: "PSI-Lookup",
      columnLines: true,
      border: 1,
      store: store,
      viewConfig: {
        enableTextSelection: true
      },
      columns: [{
        header: "登录名",
        dataIndex: "loginName",
        menuDisabled: true
      }, {
        header: "人员",
        dataIndex: "name",
        menuDisabled: true,
        flex: 1
      }]
    });
    me.lookupGrid = lookupGrid;
    me.lookupGrid.on("itemdblclick", me._onOK, me);

    const wnd = Ext.create("Ext.window.Window", {
      title: "选择 - 人员",
      header: false,
      modal: me.getShowModal(),
      border: 0,
      width: 650,
      height: 300,
      layout: "border",
      items: [{
        region: "center",
        xtype: "panel",
        layout: "fit",
        border: 0,
        items: [lookupGrid]
      }, {
        xtype: "panel",
        region: "south",
        height: 30,
        layout: "fit",
        border: 0,
        items: [{
          xtype: "form",
          layout: "form",
          bodyPadding: 5,
          bodyCls: "PSI-Field",
          items: [{
            id: "__editUser",
            xtype: "textfield",
            labelWidth: 0,
            labelAlign: "right",
            labelSeparator: ""
          }]
        }]
      }],
      buttons: [{
        xtype: "container",
        html: `
          <div class="PSI-lookup-note">
            输入登录名可以过滤查询；
            ↑ ↓ 键改变当前选择项 ；回车键返回
          </div>
          `
      }, "->", {
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

    wnd.on("close", () => {
      me.focus();
    });
    wnd.on("deactivate", () => {
      wnd.close();
    });
    me.wnd = wnd;

    const editName = Ext.getCmp("__editUser");
    editName.on("change", () => {
      const store = me.lookupGrid.getStore();
      Ext.Ajax.request({
        url: PSI.Const.BASE_URL + "Home/User/queryData",
        params: {
          queryKey: editName.getValue()
        },
        method: "POST",
        callback(opt, success, response) {
          store.removeAll();
          if (success) {
            const data = Ext.JSON.decode(response.responseText);
            store.add(data);
            if (data.length > 0) {
              me.lookupGrid.getSelectionModel().select(0);
              editName.focus();
            }
          } else {
            PSI.MsgBox.showInfo("网络错误");
          }
        },
        scope: me
      });

    }, me);

    editName.on("specialkey", (field, e) => {
      if (e.getKey() == e.ENTER) {
        me._onOK();
      } else if (e.getKey() == e.UP) {
        const m = me.lookupGrid.getSelectionModel();
        const store = me.lookupGrid.getStore();
        let index = 0;
        for (let i = 0; i < store.getCount(); i++) {
          if (m.isSelected(i)) {
            index = i;
          }
        }
        index--;
        if (index < 0) {
          index = 0;
        }
        m.select(index);
        e.preventDefault();
        editName.focus();
      } else if (e.getKey() == e.DOWN) {
        const m = me.lookupGrid.getSelectionModel();
        const store = me.lookupGrid.getStore();
        let index = 0;
        for (let i = 0; i < store.getCount(); i++) {
          if (m.isSelected(i)) {
            index = i;
          }
        }
        index++;
        if (index > store.getCount() - 1) {
          index = store.getCount() - 1;
        }
        m.select(index);
        e.preventDefault();
        editName.focus();
      }
    }, me);

    me.wnd.on("show", () => {
      editName.focus();
      editName.fireEvent("change");
    }, me);
    wnd.showBy(me);
  },

  /**
   * @private
   */
  _onOK() {
    const me = this;
    const grid = me.lookupGrid;
    const item = grid.getSelectionModel().getSelection();
    if (item == null || item.length != 1) {
      return;
    }

    const data = item[0].getData();

    me.wnd.close();
    me.focus();
    me.setValue(data.name);
    me.focus();

    me.setIdValue(data.id);
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
  },

  /**
   * @public
   */
  clearIdValue() {
    this.setValue(null);
    this._idValue = null;
  }
});
