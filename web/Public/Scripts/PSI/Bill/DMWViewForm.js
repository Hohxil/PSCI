/**
 * 成品委托生产入库单 - 查看界面
 * 
 * @author 艾格林门信息服务（大连）有限公司
 * @copyright 2015 - present
 * @license GPL v3
 */
Ext.define("PSI.Bill.DMWViewForm", {
  extend: "Ext.window.Window",

  config: {
    ref: null
  },

  initComponent: function () {
    var me = this;

    const fieldProps = {
      xtype: "textfield",
      readOnly: true,
      fieldCls: "PSI-viewBill-field",
      labelSeparator: "",
      labelAlign: "right",
    };

    Ext.apply(me, {
      header: {
        title: "<span style='font-size:160%'>查看成品委托生产入库单</span>",
        height: 40
      },
      modal: true,
      closable: false,
      onEsc: Ext.emptyFn,
      maximized: true,
      width: 1000,
      height: 600,
      layout: "border",
      items: [{
        region: "center",
        layout: "fit",
        border: 0,
        bodyPadding: 10,
        items: [me.getGoodsGrid()]
      }, {
        region: "north",
        id: "editForm",
        layout: {
          type: "table",
          columns: 4
        },
        height: 60,
        bodyPadding: 10,
        border: 0,
        items: [{
          id: "editRef",
          labelWidth: 60,
          fieldLabel: "单号",
          value: me.getRef(),
          ...fieldProps,
        }, {
          id: "editBizDT",
          fieldLabel: "业务日期",
          labelWidth: 60,
          ...fieldProps,
        }, {
          id: "editFactory",
          colspan: 2,
          width: 430,
          labelWidth: 60,
          fieldLabel: "工厂",
          ...fieldProps,
        }, {
          id: "editWarehouse",
          labelWidth: 60,
          fieldLabel: "入库仓库",
          ...fieldProps,
        }, {
          id: "editBizUser",
          labelWidth: 60,
          fieldLabel: "业务员",
          ...fieldProps,
        }]
      }],
      listeners: {
        show: {
          fn: me.onWndShow,
          scope: me
        }
      }
    });

    me.callParent(arguments);
  },

  onWndShow: function () {
    var me = this;

    var el = me.getEl() || Ext.getBody();
    el.mask(PSI.Const.LOADING);
    Ext.Ajax.request({
      url: PSI.Const.BASE_URL + "Home/Bill/dmwBillInfo",
      params: {
        ref: me.getRef()
      },
      method: "POST",
      callback: function (options, success, response) {
        el.unmask();

        if (success) {
          var data = Ext.JSON.decode(response.responseText);

          Ext.getCmp("editFactory").setValue(data.factoryName);
          Ext.getCmp("editWarehouse").setValue(data.warehouseName);
          Ext.getCmp("editBizUser").setValue(data.bizUserName);
          Ext.getCmp("editBizDT").setValue(data.bizDT);

          var store = me.getGoodsGrid().getStore();
          store.removeAll();
          if (data.items) {
            store.add(data.items);
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
    var modelName = "PSIDMWBillDetail_ViewForm";
    Ext.define(modelName, {
      extend: "Ext.data.Model",
      fields: ["id", "goodsId", "goodsCode",
        "goodsName", "goodsSpec", "unitName",
        "goodsCount", "goodsMoney", "goodsPrice",
        "memo"]
    });
    var store = Ext.create("Ext.data.Store", {
      autoLoad: false,
      model: modelName,
      data: []
    });

    me.__goodsGrid = Ext.create("Ext.grid.Panel", {
      cls: "PSI-HL",
      viewConfig: {
        enableTextSelection: true
      },
      columnLines: true,
      columns: [{
        xtype: "rownumberer",
        width: 40,
        text: "序号"
      }, {
        header: "物料编码",
        dataIndex: "goodsCode",
        menuDisabled: true,
        sortable: false
      }, {
        header: "品名",
        dataIndex: "goodsName",
        menuDisabled: true,
        sortable: false,
        width: 200
      }, {
        header: "规格型号",
        dataIndex: "goodsSpec",
        menuDisabled: true,
        sortable: false,
        width: 200
      }, {
        header: "生产入库数量",
        dataIndex: "goodsCount",
        menuDisabled: true,
        sortable: false,
        align: "right",
        width: 100
      }, {
        header: "单位",
        dataIndex: "unitName",
        menuDisabled: true,
        sortable: false,
        width: 60
      }, {
        header: "单价",
        dataIndex: "goodsPrice",
        menuDisabled: true,
        sortable: false,
        align: "right",
        xtype: "numbercolumn",
        width: 100
      }, {
        header: "金额",
        dataIndex: "goodsMoney",
        menuDisabled: true,
        sortable: false,
        align: "right",
        xtype: "numbercolumn",
        width: 120
      }, {
        header: "备注",
        dataIndex: "memo",
        menuDisabled: true,
        sortable: false,
        width: 200
      }],
      store: store
    });

    return me.__goodsGrid;
  }
});
