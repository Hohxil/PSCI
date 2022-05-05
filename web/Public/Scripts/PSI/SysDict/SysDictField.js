/**
 * 系统数据字典自定义字段
 * 
 * @author 艾格林门信息服务（大连）有限公司
 * @copyright 2015 - present
 * @license GPL v3
 */
PCL.define("PSI.SysDict.SysDictField", {
  extend: "PCL.form.field.Trigger",
  alias: "widget.psi_sysdictfield",

  config: {
    callbackFunc: null,
    callbackScope: null,
    editRef: null,
    showModal: false,
    // 系统数据字典的数据库表名
    tableName: "",
  },

  /**
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

      if (e.getKey() == e.BACKSPACE || e.getKey() == e.DELETE) {
        field.setValue(null);
        me.setIdValue(null);
        e.preventDefault();

        const func = me.getCallbackFunc();
        if (func) {
          func(null, me.getCallbackScope(), me.getEditRef());
        }

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

    const modelName = "PSIModel.PSI.Fid.FidField.FidModel";
    PCL.define(modelName, {
      extend: "PCL.data.Model",
      fields: ["id", "name", "memo"]
    });

    const store = PCL.create("PCL.data.Store", {
      model: modelName,
      autoLoad: false,
      data: []
    });
    const lookupGrid = PCL.create("PCL.grid.Panel", {
      cls: "PSI-Lookup",
      viewConfig: {
        enableTextSelection: true
      },
      columnLines: true,
      border: 1,
      store: store,
      columns: [{
        header: "编码",
        dataIndex: "id",
        menuDisabled: true,
        width: 150
      }, {
        header: "值",
        dataIndex: "name",
        menuDisabled: true,
        flex: 1
      }, {
        header: "备注",
        dataIndex: "memo",
        menuDisabled: true,
        flex: 1,
        renderer(value) {
          return `<div class='PSI-grid-cell-autoWrap'>${value}</div>`;
        }
      }]
    });
    me.lookupGrid = lookupGrid;
    me.lookupGrid.on("itemdblclick", me._onOK, me);

    const wnd = PCL.create("PCL.window.Window", {
      modal: me.getShowModal(),
      header: false,
      border: 0,
      width: 700,
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
          border: 0,
          layout: "form",
          bodyPadding: 5,
          items: [{
            id: "PSI_SysDict_SysDictField_editCode",
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
            输入编码可以过滤查询；
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
    if (!me.getShowModal()) {
      wnd.on("deactivate", () => {
        wnd.close();
      });
    }
    me.wnd = wnd;

    const editName = PCL.getCmp("PSI_SysDict_SysDictField_editCode");
    editName.on("change", () => {
      const store = me.lookupGrid.getStore();
      PCL.Ajax.request({
        url: PSI.Const.BASE_URL + "Home/SysDict/queryDataForSysDictField",
        params: {
          tableName: me.getTableName(),
          queryKey: editName.getValue()
        },
        method: "POST",
        callback(opt, success, response) {
          store.removeAll();
          if (success) {
            const data = PCL.JSON.decode(response.responseText);
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

    const data = item[0];

    me.wnd.close();
    me.focus();
    me.setValue(data.get("name"));
    me.focus();

    me.setIdValue(data.get("id"));

    const func = me.getCallbackFunc();
    if (func) {
      func(data, me.getCallbackScope(), me.getEditRef());
    }
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
