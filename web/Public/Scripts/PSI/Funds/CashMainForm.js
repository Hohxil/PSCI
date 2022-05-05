/**
 * 现金收支查询界面
 * 
 * @author 艾格林门信息服务（大连）有限公司
 * @copyright 2015 - present
 * @license GPL v3
 */
PCL.define("PSI.Funds.CashMainForm", {
  extend: "PSI.AFX.BaseMainExForm",

  initComponent: function () {
    var me = this;

    PCL.apply(me, {
      tbar: [{
        xtype: "displayfield",
        margin: "5 0 0 0",
        value: "业务日期 从"
      }, {
        cls: "PSI-toolbox",
        id: "dtFrom",
        xtype: "datefield",
        format: "Y-m-d",
        width: 100
      }, {
        xtype: "displayfield",
        margin: "5 0 0 0",
        value: " 到 "
      }, {
        cls: "PSI-toolbox",
        id: "dtTo",
        xtype: "datefield",
        format: "Y-m-d",
        width: 100,
        value: new Date()
      }, {
        text: "查询",
        iconCls: "PSI-button-refresh",
        handler: me.onQuery,
        scope: me
      }, "-", {
        text: "关闭",
        handler: function () {
          me.closeWindow();
        }
      }],
      layout: "border",
      border: 0,
      items: [{
        region: "north",
        height: 2,
        border: 0,
      }, {
        region: "center",
        layout: "fit",
        border: 0,
        items: [me.getMainGrid()]
      }, {
        region: "south",
        layout: "fit",
        border: 0,
        split: true,
        height: "50%",
        items: [me.getDetailGrid()]
      }]

    });

    me.callParent(arguments);

    var dt = new Date();
    dt.setDate(dt.getDate() - 7);
    PCL.getCmp("dtFrom").setValue(dt);
  },

  getMainGrid: function () {
    var me = this;
    if (me.__mainGrid) {
      return me.__mainGrid;
    }

    var modelName = "PSICash";
    PCL.define(modelName, {
      extend: "PCL.data.Model",
      fields: ["bizDT", "inMoney", "outMoney", "balanceMoney"]
    });

    var store = PCL.create("PCL.data.Store", {
      model: modelName,
      pageSize: 20,
      proxy: {
        type: "ajax",
        actionMethods: {
          read: "POST"
        },
        url: PSI.Const.BASE_URL + "Home/Funds/cashList",
        reader: {
          root: 'dataList',
          totalProperty: 'totalCount'
        }
      },
      autoLoad: false,
      data: []
    });

    store.on("beforeload", function () {
      PCL.apply(store.proxy.extraParams, {
        dtFrom: PCL.Date.format(PCL.getCmp("dtFrom").getValue(), "Y-m-d"),
        dtTo: PCL.Date.format(PCL.getCmp("dtTo").getValue(), "Y-m-d")
      });
    });

    me.__mainGrid = PCL.create("PCL.grid.Panel", {
      cls: "PSI-FC",
      bbar: ["->", {
        xtype: "pagingtoolbar",
        border: 0,
        store: store
      }],
      columnLines: true,
      columns: [{
        header: "业务日期",
        dataIndex: "bizDT",
        menuDisabled: true,
        sortable: false
      }, {
        header: "收",
        dataIndex: "inMoney",
        menuDisabled: true,
        sortable: false,
        align: "right",
        xtype: "numbercolumn",
        width: 160
      }, {
        header: "支",
        dataIndex: "outMoney",
        menuDisabled: true,
        sortable: false,
        align: "right",
        xtype: "numbercolumn",
        width: 160
      }, {
        header: "余额",
        dataIndex: "balanceMoney",
        menuDisabled: true,
        sortable: false,
        align: "right",
        xtype: "numbercolumn",
        width: 160
      }],
      store: store,
      listeners: {
        select: {
          fn: me.onMainGridSelect,
          scope: me
        }
      }
    });

    return me.__mainGrid;
  },

  getDetailGrid: function () {
    var me = this;
    if (me.__detailGrid) {
      return me.__detailGrid;
    }

    var modelName = "PSICashDetail";
    PCL.define(modelName, {
      extend: "PCL.data.Model",
      fields: ["bizDT", "inMoney", "outMoney", "balanceMoney",
        "refType", "refNumber", "dateCreated"]
    });

    var store = PCL.create("PCL.data.Store", {
      model: modelName,
      pageSize: 20,
      proxy: {
        type: "ajax",
        actionMethods: {
          read: "POST"
        },
        url: PSI.Const.BASE_URL + "Home/Funds/cashDetailList",
        reader: {
          root: 'dataList',
          totalProperty: 'totalCount'
        }
      },
      autoLoad: false,
      data: []
    });

    store.on("beforeload", function () {
      var item = me.getMainGrid().getSelectionModel()
        .getSelection();
      var c;
      if (item == null || item.length != 1) {
        c = null;
      } else {
        c = item[0];
      }

      PCL.apply(store.proxy.extraParams, {
        bizDT: c == null ? null : c.get("bizDT")
      });
    });

    me.__detailGrid = PCL.create("PCL.grid.Panel", {
      cls: "PSI-HL",
      header: {
        height: 30,
        title: me.formatGridHeaderTitle("现金收支流水明细")
      },
      bbar: ["->", {
        xtype: "pagingtoolbar",
        border: 0,
        store: store
      }],
      columnLines: true,
      columns: [{
        header: "业务类型",
        dataIndex: "refType",
        menuDisabled: true,
        sortable: false,
        width: 120
      }, {
        header: "单号",
        dataIndex: "refNumber",
        menuDisabled: true,
        sortable: false,
        width: 120,
        renderer: function (value, md, record) {
          return "<a href='"
            + PSI.Const.BASE_URL
            + "Home/Bill/viewIndex?fid=2024&refType="
            + encodeURIComponent(record
              .get("refType"))
            + "&ref="
            + encodeURIComponent(record
              .get("refNumber"))
            + "' target='_blank'>" + value
            + "</a>";
        }
      }, {
        header: "业务日期",
        dataIndex: "bizDT",
        menuDisabled: true,
        sortable: false
      }, {
        header: "收",
        dataIndex: "inMoney",
        menuDisabled: true,
        sortable: false,
        align: "right",
        xtype: "numbercolumn"
      }, {
        header: "支",
        dataIndex: "outMoney",
        menuDisabled: true,
        sortable: false,
        align: "right",
        xtype: "numbercolumn"
      }, {
        header: "余额",
        dataIndex: "balanceMoney",
        menuDisabled: true,
        sortable: false,
        align: "right",
        xtype: "numbercolumn"
      }, {
        header: "创建时间",
        dataIndex: "dateCreated",
        menuDisabled: true,
        sortable: false,
        width: 140
      }],
      store: store
    });

    return me.__detailGrid;
  },

  onQuery: function () {
    var me = this;
    me.getDetailGrid().getStore().removeAll();

    me.getMainGrid().getStore().loadPage(1);
  },

  onMainGridSelect: function () {
    this.getDetailGrid().getStore().loadPage(1);
  }
});
