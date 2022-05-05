/**
 * 自定义字段 - 上级科目字段
 * 
 * @author 艾格林门信息服务（大连）有限公司
 * @copyright 2015 - present
 * @license GPL v3
 */
Ext.define("PSI.SLN0002.Subject.ParentSubjectField", {
  extend: "Ext.form.field.Trigger",
  alias: "widget.PSI_parent_subject_field",

  config: {
    showModal: false,
    callbackFunc: null,
    callbackScope: null,
    companyId: null
  },

  /**
   * 初始化组件
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
   * 单击下拉按钮
   * 
   * @override
   */
  onTriggerClick(e) {
    const me = this;
    const modelName = "PSIParentSubjectField";
    Ext.define(modelName, {
      extend: "Ext.data.Model",
      fields: ["id", "code", "name"]
    });

    const store = Ext.create("Ext.data.Store", {
      model: modelName,
      autoLoad: false,
      data: []
    });
    const lookupGrid = Ext.create("Ext.grid.Panel", {
      cls: "PSI-Lookup",
      columnLines: true,
      store: store,
      columns: [{
        header: "科目码",
        dataIndex: "code",
        menuDisabled: true
      }, {
        header: "科目名称",
        dataIndex: "name",
        menuDisabled: true,
        flex: 1
      }]
    });
    me.lookupGrid = lookupGrid;
    me.lookupGrid.on("itemdblclick", me.onOK, me);

    const wnd = Ext.create("Ext.window.Window", {
      title: "选择 - 上级科目",
      modal: me.getShowModal(),
      width: 420,
      height: 300,
      header: false,
      border: 0,
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
        height: 40,
        layout: "fit",
        border: 0,
        items: [{
          xtype: "form",
          layout: "form",
          border: 0,
          bodyPadding: 5,
          items: [{
            id: "PSI_Subject_ParentSubjectField_editCode",
            xtype: "textfield",
            fieldLabel: "科目码",
            labelWidth: 50,
            labelAlign: "right",
            labelSeparator: ""
          }]
        }]
      }],
      buttons: [{
        text: "确定",
        handler: me.onOK,
        scope: me
      }, {
        text: "取消",
        handler() {
          wnd.close();
          me.focus();
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

    const editName = Ext.getCmp("PSI_Subject_ParentSubjectField_editCode");
    editName.on("change", () => {
      const store = me.lookupGrid.getStore();
      Ext.Ajax.request({
        url: PSI.Const.BASE_URL + "SLN0002/Subject/queryDataForParentSubject",
        params: {
          queryKey: editName.getValue(),
          companyId: me.getCompanyId()
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
        scope: this
      });

    }, me);

    editName.on("specialkey", (field, e) => {
      if (e.getKey() == e.ENTER) {
        me.onOK();
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

  onOK() {
    const me = this;
    const grid = me.lookupGrid;
    const item = grid.getSelectionModel().getSelection();
    if (item == null || item.length != 1) {
      return;
    }

    const data = item[0].getData();

    me.wnd.close();
    me.focus();
    me.setValue(data.code + " - " + data.name);
    me.setIdValue(data.code);

    const func = me.getCallbackFunc();
    if (func) {
      func.call(me.getCallbackScope() || me, data);
    }

    me.focus();
  },

  setIdValue(id) {
    this._idValue = id;
  },

  getIdValue() {
    return this._idValue;
  },

  clearIdValue() {
    this.setValue(null);
    this._idValue = null;
  }
});
