/**
 * 物料安全库存设置界面
 * 
 * @author 艾格林门信息服务（大连）有限公司
 * @copyright 2015 - present
 * @license GPL v3
 */
PCL.define("PSI.Goods.SafetyInventoryEditForm", {
  extend: "PSI.AFX.BaseDialogForm",

  /**
   * 初始化组件
   */
  initComponent: function () {
    var me = this;
    var entity = me.getEntity();

    PCL.apply(me, {
      header: {
        title: me.formatTitle(PSI.Const.PROD_NAME),
        height: 40
      },
      modal: true,
      onEsc: PCL.emptyFn,
      width: 620,
      height: 400,
      layout: "border",
      items: [{
        region: "center",
        border: 0,
        bodyPadding: 10,
        layout: "fit",
        items: [me.getGoodsGrid()]
      }, {
        region: "north",
        border: 0,
        layout: {
          type: "table",
          columns: 2
        },
        height: 40,
        bodyPadding: 10,
        items: [{
          xtype: "hidden",
          id: "hiddenId",
          name: "id",
          value: entity.get("id")
        }, {
          id: "editRef",
          fieldLabel: "物料",
          labelWidth: 40,
          labelAlign: "right",
          labelSeparator: "",
          xtype: "displayfield",
          value: "<span class='PSI-field-note'>" + entity.get("code") + " "
            + entity.get("name") + " "
            + entity.get("spec") + "</span>"
        }]
      }],
      buttons: [{
        text: "保存",
        iconCls: "PSI-button-ok",
        handler: me.onOK,
        scope: me,
        id: "buttonSave"
      }, {
        text: "取消",
        handler: function () {
          PSI.MsgBox.confirm("请确认是否取消当前操作？",
            function () {
              me.close();
            });
        },
        scope: me,
        id: "buttonCancel"
      }],
      listeners: {
        show: {
          fn: me.onWndShow,
          scope: me
        },
        close: {
          fn: me.onWndClose,
          scope: me
        }
      }
    });

    me.callParent(arguments);
  },

  onWindowBeforeUnload: function (e) {
    return (window.event.returnValue = e.returnValue = '确认离开当前页面？');
  },

  onWndClose: function () {
    var me = this;

    PCL.get(window).un('beforeunload', me.onWindowBeforeUnload);
  },

  onWndShow: function () {
    var me = this;

    PCL.get(window).on('beforeunload', me.onWindowBeforeUnload);

    var el = me.getEl() || PCL.getBody();
    el.mask(PSI.Const.LOADING);
    PCL.Ajax.request({
      url: PSI.Const.BASE_URL + "Home/Goods/siInfo",
      params: {
        id: PCL.getCmp("hiddenId").getValue()
      },
      method: "POST",
      callback: function (options, success, response) {
        el.unmask();

        if (success) {
          var data = PCL.JSON.decode(response.responseText);

          var store = me.getGoodsGrid().getStore();
          store.removeAll();
          store.add(data);
        } else {
          PSI.MsgBox.showInfo("网络错误")
        }
      }
    });
  },

  onOK: function () {
    var me = this;
    PCL.getBody().mask("正在保存中...");
    PCL.Ajax.request({
      url: PSI.Const.BASE_URL + "Home/Goods/editSafetyInventory",
      method: "POST",
      params: {
        jsonStr: me.getSaveData()
      },
      callback: function (options, success, response) {
        PCL.getBody().unmask();

        if (success) {
          var data = PCL.JSON.decode(response.responseText);
          if (data.success) {
            PSI.MsgBox.tip("成功保存数据");
            me.close();
            me.getParentForm().onGoodsSelect();
          } else {
            PSI.MsgBox.showInfo(data.msg);
          }
        }
      }
    });
  },

  getGoodsGrid: function () {
    var me = this;
    if (me.__goodsGrid) {
      return me.__goodsGrid;
    }
    var modelName = "PSIGoodsSafetyInventory_EditForm";
    PCL.define(modelName, {
      extend: "PCL.data.Model",
      fields: ["warehouseId", "warehouseCode", "warehouseName",
        "safetyInventory", "unitName", "inventoryUpper"]
    });
    var store = PCL.create("PCL.data.Store", {
      autoLoad: false,
      model: modelName,
      data: []
    });

    me.__cellEditing = PCL.create("PSI.UX.CellEditing", {
      clicksToEdit: 1,
      listeners: {
        edit: {
          fn: me.cellEditingAfterEdit,
          scope: me
        }
      }
    });

    me.__goodsGrid = PCL.create("PCL.grid.Panel", {
      cls: "PSI-EF",
      viewConfig: {
        enableTextSelection: true
      },
      plugins: [me.__cellEditing],
      columnLines: true,
      columns: [{
        header: "仓库编码",
        dataIndex: "warehouseCode",
        width: 100,
        menuDisabled: true,
        sortable: false
      }, {
        header: "仓库名称",
        dataIndex: "warehouseName",
        width: 120,
        menuDisabled: true,
        sortable: false
      }, {
        header: "库存上限",
        dataIndex: "inventoryUpper",
        width: 120,
        menuDisabled: true,
        sortable: false,
        align: "right",
        xtype: "numbercolumn",
        format: "0",
        editor: {
          xtype: "numberfield",
          allowDecimals: false,
          hideTrigger: true
        }
      }, {
        header: "安全库存量",
        dataIndex: "safetyInventory",
        width: 120,
        menuDisabled: true,
        sortable: false,
        align: "right",
        xtype: "numbercolumn",
        format: "0",
        editor: {
          xtype: "numberfield",
          allowDecimals: false,
          hideTrigger: true
        }
      }, {
        header: "计量单位",
        dataIndex: "unitName",
        width: 80,
        menuDisabled: true,
        sortable: false
      }],
      store: store
    });

    return me.__goodsGrid;
  },

  cellEditingAfterEdit: function (editor, e) {
  },

  getSaveData: function () {
    var result = {
      id: PCL.getCmp("hiddenId").getValue(),
      items: []
    };

    var store = this.getGoodsGrid().getStore();
    for (var i = 0; i < store.getCount(); i++) {
      var item = store.getAt(i);
      result.items.push({
        warehouseId: item.get("warehouseId"),
        invUpper: item.get("inventoryUpper"),
        si: item.get("safetyInventory")
      });
    }

    return PCL.JSON.encode(result);
  }
});
