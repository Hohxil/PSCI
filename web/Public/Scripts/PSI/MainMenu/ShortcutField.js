/**
 * 菜单快捷访问自定义字段
 * 
 * @author 艾格林门信息服务（大连）有限公司
 * @copyright 2015 - present
 * @license GPL v3
 */
PCL.define("PSI.MainMenu.ShortcutField", {
  extend: "PCL.form.field.Trigger",
  alias: "widget.psi_mainmenushortcutfield",

  config: {
    showModal: true
  },

  initComponent() {
    const me = this;

    me.__idValue = null;

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

  onTriggerClick(e) {
    const me = this;
    const modelName = "PSIMenuShortcutField";
    PCL.define(modelName, {
      extend: "PCL.data.Model",
      fields: ["id", "fid", "caption", "py", "code"]
    });

    const store = PCL.create("PCL.data.Store", {
      model: modelName,
      autoLoad: false,
      data: []
    });
    const lookupGrid = PCL.create("PCL.grid.Panel", {
      cls: "PSI-Lookup",
      columnLines: true,
      border: 1,
      store: store,
      columns: [{
        header: "助记码",
        dataIndex: "py",
        menuDisabled: true,
        width: 100
      }, {
        header: "编码",
        dataIndex: "code",
        menuDisabled: true,
        width: 100
      }, {
        header: "菜单",
        dataIndex: "caption",
        menuDisabled: true,
        flex: 1
      }]
    });
    me.lookupGrid = lookupGrid;
    me.lookupGrid.on("itemdblclick", me.onOK, me);

    const wnd = PCL.create("PCL.window.Window", {
      title: "选择 - 菜单",
      modal: me.getShowModal(),
      header: false,
      border: 0,
      width: 550,
      height: 400,
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
        height: 55,
        layout: "fit",
        border: 0,
        items: [{
          xtype: "form",
          layout: "form",
          bodyPadding: 5,
          bodyCls: "PSI-Field",
          items: [{
            id: "PSI_MainMenu_ShortcutField_editName",
            xtype: "textfield",
            labelWidth: 0,
            labelAlign: "right",
            labelSeparator: ""
          }, {
            xtype: "displayfield",
            fieldLabel: " ",
            value: "输入助记码或编码可以过滤查询",
            labelWidth: 0,
            labelAlign: "right",
            labelSeparator: ""
          },
          ]
        }]
      }],
      buttons: [{
        xtype: "container",
        html: `
          <div class="PSI-lookup-note">
            ↑ ↓ 键改变当前选择项 ；回车键打开模块；ESC键关闭
          </div>
          `
      }, "->", {
        text: "确定",
        handler: me.onOK,
        scope: me
      }, {
        text: "取消",
        handler() {
          wnd.close();
        }
      }]
    });

    if (!me.getShowModal()) {
      wnd.on("deactivate", () => {
        wnd.close();
      });
    }
    me.wnd = wnd;

    const editName = PCL.getCmp("PSI_MainMenu_ShortcutField_editName");
    editName.on("change", () => {
      const store = me.lookupGrid.getStore();
      PCL.Ajax.request({
        url: PSI.Const.BASE_URL + "Home/MainMenu/queryDataForShortcut",
        params: {
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

  // private
  onOK() {
    const me = this;
    const grid = me.lookupGrid;
    const item = grid.getSelectionModel().getSelection();
    if (item == null || item.length != 1) {
      return;
    }

    const menuItem = item[0];

    me.wnd.close();

    const fid = menuItem.get("fid");
    let url = PSI.Const.BASE_URL + "Home/MainMenu/navigateTo/fid/" + fid + "/t/2";
    if (fid == "-9995") {
      url = PSI.Const.BASE_URL + "Home/Help/index" + "/t/fromShortcut";
    }

    window.open(url);
  }
});
