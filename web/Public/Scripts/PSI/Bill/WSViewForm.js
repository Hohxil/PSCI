/**
 * 销售出库 - 查看界面
 * 
 * @author 艾格林门信息服务（大连）有限公司
 * @copyright 2015 - present
 * @license GPL v3
 */
Ext.define("PSI.Bill.WSViewForm", {
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
        title: "<span style='font-size:160%'>查看销售出库单</span>",
        height: 40
      },
      modal: true,
      onEsc: Ext.emptyFn,
      closable: false,
      maximized: true,
      width: 1000,
      height: 600,
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
          columns: 4
        },
        height: 60,
        bodyPadding: 10,
        items: [{
          id: "editRef",
          fieldLabel: "单号",
          labelWidth: 60,
          value: me.getRef(),
          ...fieldProps,
        }, {
          id: "editBizDT",
          fieldLabel: "业务日期",
          labelWidth: 60,
          ...fieldProps,
        }, {
          id: "editCustomer",
          fieldLabel: "客户",
          labelWidth: 60,
          colspan: 2,
          width: 430,
          ...fieldProps,
        }, {
          id: "editWarehouse",
          fieldLabel: "出库仓库",
          labelWidth: 60,
          ...fieldProps,
        }, {
          id: "editBizUser",
          fieldLabel: "业务员",
          labelWidth: 60,
          ...fieldProps,
        }, {
          id: "editBillMemo",
          fieldLabel: "备注",
          colspan: 2,
          width: 430,
          labelWidth: 60,
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
      url: PSI.Const.BASE_URL + "Home/Bill/wsBillInfo",
      params: {
        ref: me.getRef()
      },
      method: "POST",
      callback: function (options, success, response) {
        el.unmask();

        if (success) {
          var data = Ext.JSON.decode(response.responseText);

          Ext.getCmp("editCustomer").setValue(data.customerName);
          Ext.getCmp("editWarehouse").setValue(data.warehouseName);
          Ext.getCmp("editBizUser").setValue(data.bizUserName);
          Ext.getCmp("editBizDT").setValue(data.bizDT);
          Ext.getCmp("editBillMemo").setValue(data.memo);

          var store = me.getGoodsGrid().getStore();
          store.removeAll();
          if (data.items) {
            store.add(data.items);
          }
        } else {
          PSI.MsgBox.showInfo("网络错误")
        }
      }
    });
  },

  getGoodsGrid: function () {
    var me = this;
    if (me.__goodsGrid) {
      return me.__goodsGrid;
    }
    var modelName = "PSIWSBillDetail_ViewForm";
    Ext.define(modelName, {
      extend: "Ext.data.Model",
      fields: ["id", "goodsId", "goodsCode",
        "goodsName", "goodsSpec", "unitName",
        "goodsCount", { name: "goodsMoney", type: "float" }, "goodsPrice",
        "sn", "memo", "taxRate", { name: "tax", type: "float" },
        { name: "moneyWithTax", type: "float" }]
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
      features: [{
        ftype: "summary"
      }],
      columnLines: true,
      columns: [Ext.create("Ext.grid.RowNumberer", {
        text: "序号",
        width: 40
      }), {
        header: "商品编码",
        dataIndex: "goodsCode",
        menuDisabled: true,
        sortable: false
      }, {
        header: "商品名称",
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
        header: "销售数量",
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
        header: "销售单价",
        dataIndex: "goodsPrice",
        menuDisabled: true,
        sortable: false,
        align: "right",
        xtype: "numbercolumn",
        width: 100,
        id: "columnGoodsPrice",
        summaryRenderer: function () {
          return "销售金额合计";
        }
      }, {
        header: "销售金额",
        dataIndex: "goodsMoney",
        menuDisabled: true,
        sortable: false,
        align: "right",
        xtype: "numbercolumn",
        width: 120,
        summaryType: "sum"
      }, {
        header: "税率(%)",
        dataIndex: "taxRate",
        menuDisabled: true,
        sortable: false,
        align: "right",
        xtype: "numbercolumn",
        format: "#",
        width: 80
      }, {
        header: "税金",
        dataIndex: "tax",
        menuDisabled: true,
        sortable: false,
        align: "right",
        xtype: "numbercolumn",
        width: 150,
        summaryType: "sum"
      }, {
        header: "价税合计",
        dataIndex: "moneyWithTax",
        menuDisabled: true,
        sortable: false,
        align: "right",
        xtype: "numbercolumn",
        width: 150,
        summaryType: "sum"
      }, {
        header: "序列号",
        dataIndex: "sn",
        menuDisabled: true,
        sortable: false
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
