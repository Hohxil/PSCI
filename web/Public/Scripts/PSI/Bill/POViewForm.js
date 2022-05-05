/**
 * 采购订单 - 查看界面
 * 
 * @author 艾格林门信息服务（大连）有限公司
 * @copyright 2015 - present
 * @license GPL v3
 */
Ext.define("PSI.Bill.POViewForm", {
  extend: "PSI.AFX.BaseDialogForm",

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
        title: me.formatTitle("查看采购订单"),
        height: 40,
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
        height: 120,
        bodyPadding: 10,
        border: 0,
        items: [{
          id: "editRef",
          labelWidth: 70,
          fieldLabel: "单号",
          value: me.getRef(),
          ...fieldProps,
        }, {
          id: "editDealDate",
          fieldLabel: "交货日期",
          labelWidth: 70,
          ...fieldProps,
        }, {
          id: "editSupplier",
          colspan: 2,
          width: 430,
          labelWidth: 70,
          fieldLabel: "供应商",
          ...fieldProps,
        }, {
          id: "editDealAddress",
          labelWidth: 70,
          fieldLabel: "交货地址",
          colspan: 2,
          width: 450,
          ...fieldProps,
        }, {
          id: "editContact",
          labelWidth: 70,
          fieldLabel: "联系人",
          ...fieldProps,
        }, {
          id: "editTel",
          labelWidth: 70,
          fieldLabel: "电话",
          ...fieldProps,
        }, {
          id: "editFax",
          labelWidth: 70,
          fieldLabel: "传真",
          ...fieldProps,
        }, {
          id: "editOrg",
          labelWidth: 70,
          fieldLabel: "组织机构",
          colspan: 2,
          width: 430,
          ...fieldProps,
        }, {
          id: "editBizUser",
          labelWidth: 70,
          fieldLabel: "业务员",
          ...fieldProps,
        }, {
          id: "editPaymentType",
          labelWidth: 70,
          fieldLabel: "付款方式",
          ...fieldProps,
        }, {
          id: "editBillMemo",
          labelWidth: 70,
          fieldLabel: "备注",
          colspan: 3,
          width: 645,
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
      url: PSI.Const.BASE_URL + "Home/Bill/poBillInfo",
      params: {
        ref: me.getRef()
      },
      method: "POST",
      callback: function (options, success, response) {
        el.unmask();

        if (success) {
          var data = Ext.JSON.decode(response.responseText);

          Ext.getCmp("editSupplier").setValue(data.supplierName);
          Ext.getCmp("editBillMemo").setValue(data.billMemo);
          Ext.getCmp("editDealDate").setValue(data.dealDate);
          Ext.getCmp("editDealAddress").setValue(data.dealAddress);
          Ext.getCmp("editContact").setValue(data.contact);
          Ext.getCmp("editTel").setValue(data.tel);
          Ext.getCmp("editFax").setValue(data.fax);

          Ext.getCmp("editBizUser").setValue(data.bizUserName);
          Ext.getCmp("editOrg").setValue(data.orgFullName);

          Ext.getCmp("editPaymentType").setValue(data.paymentType);

          var store = me.getGoodsGrid().getStore();
          store.removeAll();
          store.add(data.items);
        }
      }
    });
  },

  getGoodsGrid: function () {
    var me = this;
    if (me.__goodsGrid) {
      return me.__goodsGrid;
    }
    var modelName = "PSIPOBillDetail_ViewForm";
    Ext.define(modelName, {
      extend: "Ext.data.Model",
      fields: ["id", "goodsId", "goodsCode",
        "goodsName", "goodsSpec", "unitName",
        "goodsCount", "goodsMoney", "goodsPrice",
        "memo", "taxRate", "tax", "moneyWithTax"]
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
        header: "采购数量",
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
        header: "采购单价",
        dataIndex: "goodsPrice",
        menuDisabled: true,
        sortable: false,
        align: "right",
        xtype: "numbercolumn",
        width: 100
      }, {
        header: "采购金额",
        dataIndex: "goodsMoney",
        menuDisabled: true,
        sortable: false,
        align: "right",
        xtype: "numbercolumn",
        width: 120
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
        width: 120
      }, {
        header: "价税合计",
        dataIndex: "moneyWithTax",
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
