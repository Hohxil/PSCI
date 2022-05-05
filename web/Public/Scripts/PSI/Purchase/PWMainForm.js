/**
 * 采购入库 - 主界面
 * 
 * @author 艾格林门信息服务（大连）有限公司
 * @copyright 2015 - present
 * @license GPL v3
 */
PCL.define("PSI.Purchase.PWMainForm", {
  extend: "PSI.AFX.BaseMainExForm",

  config: {
    permission: null
  },

  /**
   * @override
   */
  initComponent() {
    const me = this;

    PCL.apply(me, {
      items: [{
        tbar: me.getToolbarCmp(),
        id: "panelQueryCmp",
        region: "north",
        height: 95,
        layout: "fit",
        border: 0,
        header: false,
        collapsible: true,
        collapseMode: "mini",
        layout: {
          type: "table",
          columns: 5
        },
        items: me.getQueryCmp()
      }, {
        region: "center",
        layout: "border",
        border: 0,
        items: [{
          region: "north",
          height: "40%",
          split: true,
          layout: "fit",
          border: 0,
          items: [me.getMainGrid()]
        }, {
          region: "center",
          layout: "fit",
          border: 0,
          items: [me.getDetailGrid()]
        }]
      }]
    });

    me.callParent(arguments);

    me.refreshMainGrid();
  },

  getToolbarCmp() {
    const me = this;
    return [{
      text: "新建采购入库单",
      hidden: me.getPermission().add == "0",
      id: "buttonAdd",
      scope: me,
      handler: me.onAddBill
    }, {
      hidden: me.getPermission().add == "0",
      xtype: "tbseparator"
    }, {
      text: "编辑采购入库单",
      hidden: me.getPermission().edit == "0",
      scope: me,
      handler: me.onEditBill,
      id: "buttonEdit"
    }, {
      hidden: me.getPermission().edit == "0",
      xtype: "tbseparator"
    }, {
      text: "删除采购入库单",
      hidden: me.getPermission().del == "0",
      scope: me,
      handler: me.onDeleteBill,
      id: "buttonDelete"
    }, {
      hidden: me.getPermission().del == "0",
      xtype: "tbseparator"
    }, {
      text: "提交入库",
      hidden: me.getPermission().commit == "0",
      scope: me,
      handler: me.onCommit,
      id: "buttonCommit"
    }, {
      hidden: me.getPermission().commit == "0",
      xtype: "tbseparator"
    }, {
      hidden: me.getPermission().genPDF == "0",
      text: "导出",
      menu: [{
        text: "单据生成pdf",
        id: "buttonPDF",
        iconCls: "PSI-button-pdf",
        scope: me,
        handler: me.onPDF
      }]
    }, {
      hidden: me.getPermission().genPDF == "0",
      xtype: "tbseparator"
    }, {
      text: "打印",
      hidden: me.getPermission().print == "0",
      menu: [{
        text: "打印预览",
        iconCls: "PSI-button-print-preview",
        scope: me,
        handler: me.onPrintPreview
      }, "-", {
        text: "直接打印",
        iconCls: "PSI-button-print",
        scope: me,
        handler: me.onPrint
      }]
    }, {
      hidden: me.getPermission().print == "0",
      xtype: "tbseparator"
    }, {
      text: "指南",
      handler() {
        me.focus();
        window.open(me.URL("Home/Help/index?t=pwbill"));
      }
    }, "-", {
      text: "关闭",
      handler() {
        me.closeWindow();
      }
    }].concat(me.getPagination());
  },

  getQueryCmp() {
    const me = this;
    return [{
      id: "editQueryBillStatus",
      xtype: "combo",
      queryMode: "local",
      editable: false,
      valueField: "id",
      labelWidth: 60,
      labelAlign: "right",
      labelSeparator: "",
      fieldLabel: "状态",
      margin: "5, 0, 0, 0",
      store: PCL.create("PCL.data.ArrayStore", {
        fields: ["id", "text"],
        data: [[-1, "全部"], [0, "待入库"], [1000, "已入库"],
        [2000, "部分退货"], [3000, "全部退货"]]
      }),
      value: -1
    }, {
      id: "editQueryRef",
      labelAlign: "right",
      labelSeparator: "",
      fieldLabel: "单号",
      margin: "5, 0, 0, 0",
      xtype: "textfield"
    }, {
      id: "editQueryFromDT",
      xtype: "datefield",
      margin: "5, 0, 0, 0",
      format: "Y-m-d",
      labelAlign: "right",
      labelSeparator: "",
      fieldLabel: "业务日期（起）"
    }, {
      id: "editQueryToDT",
      xtype: "datefield",
      margin: "5, 0, 0, 0",
      format: "Y-m-d",
      labelAlign: "right",
      labelSeparator: "",
      fieldLabel: "业务日期（止）"
    }, {
      id: "editQuerySupplier",
      xtype: "psi_supplierfield",
      parentCmp: me,
      showModal: true,
      labelAlign: "right",
      labelSeparator: "",
      labelWidth: 60,
      margin: "5, 0, 0, 0",
      fieldLabel: "供应商"
    }, {
      id: "editQueryWarehouse",
      xtype: "psi_warehousefield",
      parentCmp: me,
      showModal: true,
      labelAlign: "right",
      labelSeparator: "",
      labelWidth: 60,
      margin: "5, 0, 0, 0",
      fieldLabel: "仓库"
    }, {
      id: "editQueryPaymentType",
      labelAlign: "right",
      labelSeparator: "",
      fieldLabel: "付款方式",
      margin: "5, 0, 0, 0",
      xtype: "combo",
      queryMode: "local",
      editable: false,
      valueField: "id",
      store: PCL.create("PCL.data.ArrayStore", {
        fields: ["id", "text"],
        data: [[-1, "全部"], [0, "记应付账款"], [1, "现金付款"],
        [2, "预付款"]]
      }),
      value: -1
    }, {
      id: "editQueryGoods",
      labelAlign: "right",
      labelSeparator: "",
      fieldLabel: "物料",
      margin: "5, 0, 0, 0",
      xtype: "psi_goodsfield",
      showModal: true
    }, {
      xtype: "container",
      colspan: 2,
      items: [{
        xtype: "button",
        text: "查询",
        width: 100,
        height: 26,
        margin: "5 0 0 10",
        handler: me.onQuery,
        scope: me
      }, {
        xtype: "button",
        text: "清空查询条件",
        width: 100,
        height: 26,
        margin: "5, 0, 0, 10",
        handler: me.onClearQuery,
        scope: me
      }, {
        xtype: "button",
        text: "隐藏工具栏",
        width: 130,
        height: 26,
        iconCls: "PSI-button-hide",
        margin: "5 0 0 10",
        handler() {
          PCL.getCmp("panelQueryCmp").collapse();
        },
        scope: me
      }]
    }];
  },

  getMainGrid() {
    const me = this;
    if (me.__mainGrid) {
      return me.__mainGrid;
    }

    const modelName = "PSIPWBill";
    PCL.define(modelName, {
      extend: "PCL.data.Model",
      fields: ["id", "ref", "bizDate", "supplierName",
        "warehouseName", "inputUserName", "bizUserName",
        "billStatus", "billStatusCode", "amount", "dateCreated",
        "paymentType", "billMemo", "expandByBOM",
        "wspBillRef", "tax", "moneyWithTax"]
    });
    const store = PCL.create("PCL.data.Store", {
      autoLoad: false,
      model: modelName,
      data: [],
      pageSize: 20,
      proxy: {
        type: "ajax",
        actionMethods: {
          read: "POST"
        },
        url: PSI.Const.BASE_URL + "Home/Purchase/pwbillList",
        reader: {
          root: 'dataList',
          totalProperty: 'totalCount'
        }
      }
    });
    store.on("beforeload", () => {
      store.proxy.extraParams = me.getQueryParam();
    });
    store.on("load", (e, records, successful) => {
      if (successful) {
        me.gotoMainGridRecord(me.__lastId);
      }
    });

    me.__mainGrid = PCL.create("PCL.grid.Panel", {
      cls: "PSI-FC",
      viewConfig: {
        enableTextSelection: true
      },
      border: 1,
      columnLines: true,
      columns: {
        defaults: {
          menuDisabled: true,
          sortable: false
        },
        items: [{
          xtype: "rownumberer",
          text: "#",
          width: 50
        }, {
          header: "状态",
          dataIndex: "billStatus",
          width: 80,
          renderer(value) {
            if (value == "待入库") {
              return "<span style='color:red'>" + value
                + "</span>";
            } else if (value == "部分退货") {
              return "<span style='color:blue'>" + value
                + "</span>";
            } else if (value == "全部退货") {
              return "<span style='color:green'>" + value
                + "</span>";
            } else {
              return value;
            }
          }
        }, {
          header: "入库单号",
          dataIndex: "ref",
          width: 110
        }, {
          header: "业务日期",
          dataIndex: "bizDate",
          width: 80,
          align: "center"
        }, {
          header: "供应商",
          dataIndex: "supplierName",
          width: 300
        }, {
          header: "采购金额",
          dataIndex: "amount",
          align: "right",
          xtype: "numbercolumn",
          width: 90,
          hidden: me.getPermission().viewPrice == "0"
        }, {
          header: "税金",
          dataIndex: "tax",
          align: "right",
          xtype: "numbercolumn",
          width: 90,
          hidden: me.getPermission().viewPrice == "0"
        }, {
          header: "价税合计",
          dataIndex: "moneyWithTax",
          align: "right",
          xtype: "numbercolumn",
          width: 90,
          hidden: me.getPermission().viewPrice == "0"
        }, {
          header: "付款方式",
          dataIndex: "paymentType",
          width: 100,
          renderer(value) {
            if (value == 0) {
              return "记应付账款";
            } else if (value == 1) {
              return "现金付款";
            } else if (value == 2) {
              return "预付款";
            } else {
              return "";
            }
          }
        }, {
          header: "入库仓库",
          dataIndex: "warehouseName"
        }, {
          header: "业务员",
          dataIndex: "bizUserName"
        }, {
          header: "制单人",
          dataIndex: "inputUserName"
        }, {
          header: "制单时间",
          dataIndex: "dateCreated",
          width: 140
        }, {
          header: "备注",
          dataIndex: "billMemo",
          width: 150
        }, {
          header: "自动拆分?",
          dataIndex: "expandByBOM",
          width: 80,
          align: "center",
          renderer(value) {
            if (parseInt(value) == 1) {
              return "▲";
            } else {
              return "";
            }
          }
        }, {
          header: "拆分单号",
          dataIndex: "wspBillRef",
          width: 140,
          renderer(value) {
            if (value) {
              return "<a href='"
                + PSI.Const.BASE_URL
                + "Home/Bill/viewIndex?fid=2001&refType="
                + encodeURIComponent("存货拆分")
                + "&ref="
                + encodeURIComponent(value)
                + "' target='_blank'>" + value
                + "</a>";
            } else {
              return "";
            }
          }
        }]
      },
      store: store,
      listeners: {
        select: {
          fn: me.onMainGridSelect,
          scope: me
        },
        itemdblclick: {
          fn: me.onEditBill,
          scope: me
        }
      }
    });

    return me.__mainGrid;
  },

  /**
   * 分页
   */
  getPagination() {
    const me = this;
    const store = me.getMainGrid().getStore();
    const result = ["->", {
      cls: "PSI-Pagination",
      id: "pagingToobar",
      xtype: "pagingtoolbar",
      border: 0,
      store
    }, "-", {
        xtype: "displayfield",
        value: "每页显示"
      }, {
        id: "comboCountPerPage",
        cls: "PSI-Pagination",
        xtype: "combobox",
        editable: false,
        width: 60,
        store: PCL.create("PCL.data.ArrayStore", {
          fields: ["text"],
          data: [["20"], ["50"], ["100"], ["300"],
          ["1000"]]
        }),
        value: 20,
        listeners: {
          change: {
            fn() {
              store.pageSize = PCL.getCmp("comboCountPerPage").getValue();
              store.currentPage = 1;
              PCL.getCmp("pagingToobar").doRefresh();
            },
            scope: me
          }
        }
      }, {
        xtype: "displayfield",
        value: "张单据"
      }];

    return result;
  },

  getDetailGrid() {
    const me = this;
    if (me.__detailGrid) {
      return me.__detailGrid;
    }

    const modelName = "PSIPWBillDetail";
    PCL.define(modelName, {
      extend: "PCL.data.Model",
      fields: ["id", "goodsCode", "goodsName", "goodsSpec",
        "unitName", "goodsCount", "goodsMoney",
        "goodsPrice", "memo", "taxRate", "tax",
        "moneyWithTax", "goodsPriceWithTax", "rejGoodsCount", "realGoodsCount"]
    });
    const store = PCL.create("PCL.data.Store", {
      autoLoad: false,
      model: modelName,
      data: []
    });

    me.__detailGrid = PCL.create("PCL.grid.Panel", {
      cls: "PSI-HL",
      header: {
        height: 30,
        title: me.formatGridHeaderTitle("采购入库单明细")
      },
      viewConfig: {
        enableTextSelection: true
      },
      columnLines: true,
      columns: {
        defaults: {
          menuDisabled: true,
          sortable: false
        },
        items: [PCL.create("PCL.grid.RowNumberer", {
          text: "#",
          width: 40
        }), {
          header: "物料编码",
          dataIndex: "goodsCode"
        }, {
          header: "品名/规格型号",
          dataIndex: "goodsName",
          width: 330,
          renderer(value, metaData, record) {
            return record.get("goodsName") + " " + record.get("goodsSpec");
          }
        }, {
          header: "入库数量",
          width: 80,
          dataIndex: "goodsCount",
          align: "right"
        }, {
          header: "退货数量",
          width: 80,
          dataIndex: "rejGoodsCount",
          align: "right"
        }, {
          header: "实际入库数量",
          width: 90,
          dataIndex: "realGoodsCount",
          align: "right"
        }, {
          header: "单位",
          dataIndex: "unitName",
          width: 50,
          align: "center"
        }, {
          header: "采购单价",
          dataIndex: "goodsPrice",
          align: "right",
          xtype: "numbercolumn",
          width: 90,
          hidden: me.getPermission().viewPrice == "0"
        }, {
          header: "采购金额",
          dataIndex: "goodsMoney",
          align: "right",
          xtype: "numbercolumn",
          width: 90,
          hidden: me.getPermission().viewPrice == "0"
        }, {
          header: "税率(%)",
          dataIndex: "taxRate",
          align: "right",
          xtype: "numbercolumn",
          format: "0",
          hidden: me.getPermission().viewPrice == "0",
          width: 60
        }, {
          header: "税金",
          dataIndex: "tax",
          align: "right",
          xtype: "numbercolumn",
          width: 90,
          hidden: me.getPermission().viewPrice == "0"
        }, {
          header: "价税合计",
          dataIndex: "moneyWithTax",
          align: "right",
          xtype: "numbercolumn",
          width: 90,
          hidden: me.getPermission().viewPrice == "0"
        }, {
          header: "含税价",
          dataIndex: "goodsPriceWithTax",
          align: "right",
          xtype: "numbercolumn",
          width: 90,
          hidden: me.getPermission().viewPrice == "0"
        }, {
          header: "备注",
          dataIndex: "memo",
          width: 200
        }]
      },
      store: store
    });

    return me.__detailGrid;
  },

  refreshMainGrid(id) {
    const me = this;

    PCL.getCmp("buttonEdit").setDisabled(true);
    PCL.getCmp("buttonDelete").setDisabled(true);
    PCL.getCmp("buttonCommit").setDisabled(true);

    const gridDetail = me.getDetailGrid();
    gridDetail.setTitle(me.formatGridHeaderTitle("采购入库单明细"));
    gridDetail.getStore().removeAll();

    PCL.getCmp("pagingToobar").doRefresh();
    me.__lastId = id;
  },

  /**
   * 新增采购入库单
   */
  onAddBill() {
    const me = this;

    if (me.getPermission().viewPrice == "0") {
      // 没有查看单价个权限，这个时候就不能新建采购入库单
      const info = "没有赋权[采购入库-采购单价和金额可见]，所以不能新建采购入库单";
      PSI.MsgBox.showInfo(info);
      return;
    }

    const form = PCL.create("PSI.Purchase.PWEditForm", {
      parentForm: me,
      showAddGoodsButton: me.getPermission().showAddGoodsButton,
      viewPrice: me.getPermission().viewPrice == "1"
    });
    form.show();
  },

  /**
   * 编辑采购入库单
   */
  onEditBill() {
    const me = this;
    const item = me.getMainGrid().getSelectionModel().getSelection();
    if (item == null || item.length != 1) {
      me.showInfo("没有选择要编辑的采购入库单");
      return;
    }
    const bill = item[0];

    const form = PCL.create("PSI.Purchase.PWEditForm", {
      parentForm: me,
      entity: bill,
      showAddGoodsButton: me.getPermission().showAddGoodsButton,
      viewPrice: me.getPermission().viewPrice == "1"
    });
    form.show();
  },

  /**
   * 删除采购入库单
   */
  onDeleteBill() {
    const me = this;
    const item = me.getMainGrid().getSelectionModel().getSelection();
    if (item == null || item.length != 1) {
      me.showInfo("请选择要删除的采购入库单");
      return;
    }

    const bill = item[0];

    if (bill.get("billStatus") == "已入库") {
      me.showInfo("当前采购入库单已经提交入库，不能删除");
      return;
    }

    const store = me.getMainGrid().getStore();
    let index = store.findExact("id", bill.get("id"));
    index--;
    let preIndex = null;
    const preItem = store.getAt(index);
    if (preItem) {
      preIndex = preItem.get("id");
    }

    const info = `请确认是否删除采购入库单: <span style='color:red'>${bill.get("ref")}</span> ？`;
    const confirmFunc = () => {
      const el = PCL.getBody();
      el.mask("正在删除中...");

      const r = {
        url: me.URL("Home/Purchase/deletePWBill"),
        params: {
          id: bill.get("id")
        },
        callback(options, success, response) {
          el.unmask();

          if (success) {
            const data = me.decodeJSON(response.responseText);
            if (data.success) {
              me.refreshMainGrid(preIndex);
              me.tip("成功完成删除操作", true);
            } else {
              me.showInfo(data.msg);
            }
          } else {
            me.showInfo("网络错误");
          }
        }
      };
      me.ajax(r);
    };
    me.confirm(info, confirmFunc);
  },

  onMainGridSelect() {
    var me = this;
    me.getDetailGrid().setTitle(me.formatGridHeaderTitle("采购入库单明细"));
    var item = me.getMainGrid().getSelectionModel().getSelection();
    if (item == null || item.length != 1) {
      PCL.getCmp("buttonEdit").setDisabled(true);
      PCL.getCmp("buttonDelete").setDisabled(true);
      PCL.getCmp("buttonCommit").setDisabled(true);

      return;
    }
    var bill = item[0];
    var bsc = parseInt(bill.get("billStatusCode"));
    var commited = bsc > 0;

    var buttonEdit = PCL.getCmp("buttonEdit");
    buttonEdit.setDisabled(false);
    if (commited) {
      buttonEdit.setText("查看采购入库单");
    } else {
      buttonEdit.setText("编辑采购入库单");
    }

    PCL.getCmp("buttonDelete").setDisabled(commited);
    PCL.getCmp("buttonCommit").setDisabled(commited);

    me.refreshDetailGrid();
  },

  refreshDetailGrid(id) {
    var me = this;
    me.getDetailGrid().setTitle(me.formatGridHeaderTitle("采购入库单明细"));
    var item = me.getMainGrid().getSelectionModel().getSelection();
    if (item == null || item.length != 1) {
      return;
    }
    var bill = item[0];

    var grid = me.getDetailGrid();
    grid.setTitle(me.formatGridHeaderTitle("单号: " + bill.get("ref")
      + " 供应商: " + bill.get("supplierName") + " 入库仓库: "
      + bill.get("warehouseName")));
    var el = grid.getEl();
    el.mask(PSI.Const.LOADING);
    me.ajax({
      url: me.URL("Home/Purchase/pwBillDetailList"),
      params: {
        pwBillId: bill.get("id")
      },
      callback(options, success, response) {
        var store = grid.getStore();

        store.removeAll();

        if (success) {
          var data = me.decodeJSON(response.responseText);
          store.add(data);

          if (store.getCount() > 0) {
            if (id) {
              var r = store.findExact("id", id);
              if (r != -1) {
                grid.getSelectionModel().select(r);
              }
            }
          }
        }

        el.unmask();
      }
    });
  },

  /**
   * 提交采购入库单
   */
  onCommit() {
    var me = this;
    var item = me.getMainGrid().getSelectionModel().getSelection();
    if (item == null || item.length != 1) {
      me.showInfo("没有选择要提交的采购入库单");
      return;
    }
    var bill = item[0];

    if (bill.get("billStatus") == "已入库") {
      me.showInfo("当前采购入库单已经提交入库，不能再次提交");
      return;
    }

    var detailCount = me.getDetailGrid().getStore().getCount();
    if (detailCount == 0) {
      me.showInfo("当前采购入库单没有录入物料明细，不能提交");
      return;
    }

    var info = "请确认是否提交单号: <span style='color:red'>" + bill.get("ref")
      + "</span> 的采购入库单?";
    var id = bill.get("id");
    var confirmFunc = () => {
      var el = PCL.getBody();
      el.mask("正在提交中...");
      var r = {
        url: me.URL("Home/Purchase/commitPWBill"),
        params: {
          id: id
        },
        callback(options, success, response) {
          el.unmask();

          if (success) {
            var data = me.decodeJSON(response.responseText);
            if (data.success) {
              me.refreshMainGrid(id);

              me.tip("成功完成提交操作");
            } else {
              me.showInfo(data.msg);
            }
          } else {
            me.showInfo("网络错误");
          }
        }
      };
      me.ajax(r);
    };
    me.confirm(info, confirmFunc);
  },

  gotoMainGridRecord(id) {
    var me = this;
    var grid = me.getMainGrid();
    grid.getSelectionModel().deselectAll();
    var store = grid.getStore();
    if (id) {
      var r = store.findExact("id", id);
      if (r != -1) {
        grid.getSelectionModel().select(r);
      } else {
        grid.getSelectionModel().select(0);
      }
    } else {
      grid.getSelectionModel().select(0);
    }
  },

  onQuery() {
    var me = this;

    me.getMainGrid().getStore().currentPage = 1;
    me.refreshMainGrid();
  },

  onClearQuery() {
    var me = this;

    PCL.getCmp("editQueryBillStatus").setValue(-1);
    PCL.getCmp("editQueryRef").setValue(null);
    PCL.getCmp("editQueryFromDT").setValue(null);
    PCL.getCmp("editQueryToDT").setValue(null);
    PCL.getCmp("editQuerySupplier").clearIdValue();
    PCL.getCmp("editQueryWarehouse").clearIdValue();
    PCL.getCmp("editQueryPaymentType").setValue(-1);
    PCL.getCmp("editQueryGoods").clearIdValue();

    me.onQuery();
  },

  getQueryParam() {
    var me = this;

    var result = {
      billStatus: PCL.getCmp("editQueryBillStatus").getValue()
    };

    var ref = PCL.getCmp("editQueryRef").getValue();
    if (ref) {
      result.ref = ref;
    }

    var supplierId = PCL.getCmp("editQuerySupplier").getIdValue();
    if (supplierId) {
      result.supplierId = supplierId;
    }

    var warehouseId = PCL.getCmp("editQueryWarehouse").getIdValue();
    if (warehouseId) {
      result.warehouseId = warehouseId;
    }

    var fromDT = PCL.getCmp("editQueryFromDT").getValue();
    if (fromDT) {
      result.fromDT = PCL.Date.format(fromDT, "Y-m-d");
    }

    var toDT = PCL.getCmp("editQueryToDT").getValue();
    if (toDT) {
      result.toDT = PCL.Date.format(toDT, "Y-m-d");
    }

    var paymentType = PCL.getCmp("editQueryPaymentType").getValue();
    result.paymentType = paymentType;

    var goodsId = PCL.getCmp("editQueryGoods").getIdValue();
    if (goodsId) {
      result.goodsId = goodsId;
    }

    return result;
  },

  onPDF() {
    var me = this;
    var item = me.getMainGrid().getSelectionModel().getSelection();
    if (item == null || item.length != 1) {
      me.showInfo("没有选择要生成pdf文件的采购入库单");
      return;
    }
    var bill = item[0];

    var url = me.URL("Home/Purchase/pwBillPdf?ref=" + bill.get("ref"));
    window.open(url);
  },

  onPrintPreview() {
    if (PSI.Const.ENABLE_LODOP != "1") {
      PSI.MsgBox.showInfo("请先在业务设置模块中启用Lodop打印");
      return;
    }

    var lodop = getLodop();
    if (!lodop) {
      PSI.MsgBox.showInfo("没有安装Lodop控件，无法打印");
      return;
    }

    var me = this;

    var item = me.getMainGrid().getSelectionModel().getSelection();
    if (item == null || item.length != 1) {
      me.showInfo("没有选择要打印的采购入库单");
      return;
    }
    var bill = item[0];

    var el = PCL.getBody();
    el.mask("数据加载中...");
    var r = {
      url: PSI.Const.BASE_URL + "Home/Purchase/genPWBillPrintPage",
      params: {
        id: bill.get("id")
      },
      callback(options, success, response) {
        el.unmask();

        if (success) {
          var data = response.responseText;
          me.previewPWBill(bill.get("ref"), data);
        }
      }
    };
    me.ajax(r);
  },

  PRINT_PAGE_WIDTH: "200mm",
  PRINT_PAGE_HEIGHT: "95mm",

  previewPWBill(ref, data) {
    var me = this;

    var lodop = getLodop();
    if (!lodop) {
      PSI.MsgBox.showInfo("Lodop打印控件没有正确安装");
      return;
    }

    lodop.PRINT_INIT("采购入库单" + ref);
    lodop.SET_PRINT_PAGESIZE(1, me.PRINT_PAGE_WIDTH, me.PRINT_PAGE_HEIGHT,
      "");
    lodop.ADD_PRINT_HTM("0mm", "0mm", "100%", "100%", data);
    var result = lodop.PREVIEW("_blank");
  },

  onPrint() {
    if (PSI.Const.ENABLE_LODOP != "1") {
      PSI.MsgBox.showInfo("请先在业务设置模块中启用Lodop打印");
      return;
    }

    var lodop = getLodop();
    if (!lodop) {
      PSI.MsgBox.showInfo("没有安装Lodop控件，无法打印");
      return;
    }

    var me = this;

    var item = me.getMainGrid().getSelectionModel().getSelection();
    if (item == null || item.length != 1) {
      me.showInfo("没有选择要打印的采购入库单");
      return;
    }
    var bill = item[0];

    var el = PCL.getBody();
    el.mask("数据加载中...");
    var r = {
      url: PSI.Const.BASE_URL + "Home/Purchase/genPWBillPrintPage",
      params: {
        id: bill.get("id")
      },
      callback(options, success, response) {
        el.unmask();

        if (success) {
          var data = response.responseText;
          me.printPWBill(bill.get("ref"), data);
        }
      }
    };
    me.ajax(r);
  },

  printPWBill(ref, data) {
    var me = this;

    var lodop = getLodop();
    if (!lodop) {
      PSI.MsgBox.showInfo("Lodop打印控件没有正确安装");
      return;
    }

    lodop.PRINT_INIT("采购入库单" + ref);
    lodop.SET_PRINT_PAGESIZE(1, me.PRINT_PAGE_WIDTH, me.PRINT_PAGE_HEIGHT,
      "");
    lodop.ADD_PRINT_HTM("0mm", "0mm", "100%", "100%", data);
    var result = lodop.PRINT();
  }
});
