/**
 * 自定义字段 - 仓库
 * 
 * @author 艾格林门信息服务（大连）有限公司
 * @copyright 2015 - present
 * @license GPL v3
 */
PCL.define("PSI.Warehouse.WarehouseField", {
  extend: "PCL.form.field.Trigger",
  alias: "widget.psi_warehousefield",

  config: {
    fid: null,
    showModal: false
  },

  /**
   * 初始化组件
   */
  initComponent: function () {
    var me = this;
    me.__idValue = null;

    me.enableKeyEvents = true;

    me.callParent(arguments);

    me.on("keydown", function (field, e) {
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
      render: function (p) {
        p.getEl().on("dblclick", function () {
          me.onTriggerClick();
        });
      },
      single: true
    });
  },

  /**
   * 单击下拉按钮
   */
  onTriggerClick: function (e) {
    var me = this;

    if (me.readOnly) {
      return;
    }

    var modelName = "PSIWarehouseField";
    PCL.define(modelName, {
      extend: "PCL.data.Model",
      fields: ["id", "code", "name"]
    });

    var store = PCL.create("PCL.data.Store", {
      model: modelName,
      autoLoad: false,
      data: []
    });
    var lookupGrid = PCL.create("PCL.grid.Panel", {
      cls: "PSI-Lookup",
      columnLines: true,
      border: 1,
      store: store,
      viewConfig: {
        enableTextSelection: true
      },
      columns: [{
        header: "编码",
        dataIndex: "code",
        menuDisabled: true
      }, {
        header: "仓库",
        dataIndex: "name",
        menuDisabled: true,
        flex: 1
      }]
    });
    me.lookupGrid = lookupGrid;
    me.lookupGrid.on("itemdblclick", me.onOK, me);

    var wnd = PCL.create("PCL.window.Window", {
      title: "选择 - 仓库",
      modal: me.getShowModal(),
      width: 700,
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
        height: 30,
        layout: "fit",
        border: 0,
        items: [{
          xtype: "form",
          layout: "form",
          bodyPadding: 5,
          bodyCls: "PSI-Field",
          items: [{
            id: "PSI_Warehouse_WarehouseField_editWarehouse",
            xtype: "textfield",
            labelWidth: 0,
            labelAlign: "right",
            labelSeparator: "",
          }
          ]
        }]
      }],
      buttons: [{
        xtype: "container",
        html: `
          <div class="PSI-lookup-note">
            输入编码、仓库名称拼音字头可以过滤查询；
            ↑ ↓ 键改变当前选择项 ；回车键返回
          </div>
          `
      }, "->", {
        text: "确定",
        handler: me.onOK,
        scope: me
      }, {
        text: "取消",
        handler: function () {
          wnd.close();
        }
      }]
    });

    wnd.on("close", function () {
      me.focus();
    });
    if (!me.getShowModal()) {
      wnd.on("deactivate", function () {
        wnd.close();
      });
    }
    me.wnd = wnd;

    var editName = PCL.getCmp("PSI_Warehouse_WarehouseField_editWarehouse");
    editName.on("change", function () {
      var store = me.lookupGrid.getStore();
      PCL.Ajax.request({
        url: PSI.Const.BASE_URL + "Home/Warehouse/queryData",
        params: {
          queryKey: editName.getValue(),
          fid: me.getFid()
        },
        method: "POST",
        callback: function (opt, success, response) {
          store.removeAll();
          if (success) {
            var data = PCL.JSON.decode(response.responseText);
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

    editName.on("specialkey", function (field, e) {
      if (e.getKey() == e.ENTER) {
        me.onOK();
      } else if (e.getKey() == e.UP) {
        var m = me.lookupGrid.getSelectionModel();
        var store = me.lookupGrid.getStore();
        var index = 0;
        for (var i = 0; i < store.getCount(); i++) {
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
        var m = me.lookupGrid.getSelectionModel();
        var store = me.lookupGrid.getStore();
        var index = 0;
        for (var i = 0; i < store.getCount(); i++) {
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

    me.wnd.on("show", function () {
      editName.focus();
      editName.fireEvent("change");
    }, me);
    wnd.showBy(me);
  },

  onOK: function () {
    var me = this;
    var grid = me.lookupGrid;
    var item = grid.getSelectionModel().getSelection();
    if (item == null || item.length != 1) {
      return;
    }

    var data = item[0].getData();

    me.wnd.close();
    me.focus();
    me.setValue(data.name);
    me.focus();

    me.setIdValue(data.id);
  },

  setIdValue: function (id) {
    this.__idValue = id;
  },

  getIdValue: function () {
    return this.__idValue;
  },

  clearIdValue: function () {
    this.setValue(null);
    this.__idValue = null;
  }
});
