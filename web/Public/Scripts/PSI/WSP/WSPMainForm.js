/**
 * 存货拆分 - 主界面
 * 
 * @author 艾格林门信息服务（大连）有限公司
 * @copyright 2015 - present
 * @license GPL v3
 */
PCL.define("PSI.WSP.WSPMainForm", {
  extend: "PSI.AFX.BaseMainExForm",

  config: {
    permission: null
  },

  initComponent: function () {
    var me = this;

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
          columns: 4
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
          xtype: "tabpanel",
          border: 0,
          items: [{
            xtype: "panel",
            title: "拆分单明细",
            layout: "border",
            border: 0,
            items: [{
              region: "center",
              layout: "fit",
              border: 0,
              items: me
                .getDetailGrid()
            }, {
              region: "east",
              layout: "fit",
              border: 0,
              width: "40%",
              split: true,
              items: me
                .getGoodsBOMGrid()
            }]
          }, me.getDetailGridEx()]
        }]
      }]
    });

    me.callParent(arguments);

    me.refreshMainGrid();
  },

  getToolbarCmp: function () {
    var me = this;
    return [{
      text: "新建拆分单",
      id: "buttonAdd",
      hidden: me.getPermission().add == "0",
      scope: me,
      handler: me.onAddBill
    }, {
      hidden: me.getPermission().add == "0",
      xtype: "tbseparator"
    }, {
      text: "编辑拆分单",
      hidden: me.getPermission().edit == "0",
      id: "buttonEdit",
      scope: me,
      handler: me.onEditBill
    }, {
      hidden: me.getPermission().edit == "0",
      xtype: "tbseparator"
    }, {
      text: "删除拆分单",
      hidden: me.getPermission().del == "0",
      id: "buttonDelete",
      scope: me,
      handler: me.onDeleteBill
    }, {
      hidden: me.getPermission().del == "0",
      xtype: "tbseparator"
    }, {
      text: "提交",
      hidden: me.getPermission().commit == "0",
      id: "buttonCommit",
      scope: me,
      handler: me.onCommit
    }, {
      hidden: me.getPermission().commit == "0",
      xtype: "tbseparator"
    }, {
      text: "导出",
      hidden: me.getPermission().genPDF == "0",
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
      xtype: "tbseparator",
      hidden: me.getPermission().print == "0"
    }, {
      text: "指南",
      handler: function () {
        me.focus();
        window.open(me.URL("Home/Help/index?t=wspbill"));
      }
    }, "-", {
      text: "关闭",
      handler: function () {
        me.closeWindow();
      }
    }].concat(me.getPagination());
  },

  getQueryCmp: function () {
    var me = this;
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
        data: [[-1, "全部"], [0, "待拆分"], [1000, "已拆分"]]
      }),
      value: -1
    }, {
      id: "editQueryRef",
      labelWidth: 120,
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
      id: "editQueryFromWarehouse",
      xtype: "psi_warehousefield",
      showModal: true,
      labelAlign: "right",
      labelSeparator: "",
      labelWidth: 60,
      margin: "5, 0, 0, 0",
      fieldLabel: "仓库"
    }, {
      id: "editQueryToWarehouse",
      xtype: "psi_warehousefield",
      showModal: true,
      labelAlign: "right",
      labelSeparator: "",
      labelWidth: 120,
      margin: "5, 0, 0, 0",
      fieldLabel: "拆分后调入仓库"
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
        handler: function () {
          PCL.getCmp("panelQueryCmp").collapse();
        },
        scope: me
      }]
    }];
  },

  onQuery: function () {
    var me = this;

    me.getMainGrid().getStore().currentPage = 1;
    me.refreshMainGrid();
  },

  onClearQuery: function () {
    var me = this;

    PCL.getCmp("editQueryBillStatus").setValue(-1);
    PCL.getCmp("editQueryRef").setValue(null);
    PCL.getCmp("editQueryFromDT").setValue(null);
    PCL.getCmp("editQueryToDT").setValue(null);
    PCL.getCmp("editQueryFromWarehouse").clearIdValue();
    PCL.getCmp("editQueryToWarehouse").clearIdValue();
    PCL.getCmp("editQueryGoods").clearIdValue();

    me.onQuery();
  },

  getQueryParam: function () {
    var me = this;

    var result = {
      billStatus: PCL.getCmp("editQueryBillStatus").getValue()
    };

    var ref = PCL.getCmp("editQueryRef").getValue();
    if (ref) {
      result.ref = ref;
    }

    var fromWarehouseId = PCL.getCmp("editQueryFromWarehouse").getIdValue();
    if (fromWarehouseId) {
      result.fromWarehouseId = fromWarehouseId;
    }

    var toWarehouseId = PCL.getCmp("editQueryToWarehouse").getIdValue();
    if (toWarehouseId) {
      result.toWarehouseId = toWarehouseId;
    }

    var fromDT = PCL.getCmp("editQueryFromDT").getValue();
    if (fromDT) {
      result.fromDT = PCL.Date.format(fromDT, "Y-m-d");
    }

    var toDT = PCL.getCmp("editQueryToDT").getValue();
    if (toDT) {
      result.toDT = PCL.Date.format(toDT, "Y-m-d");
    }

    var goodsId = PCL.getCmp("editQueryGoods").getIdValue();
    if (goodsId) {
      result.goodsId = goodsId;
    }

    return result;
  },

  /**
  * 分页
  */
  getPagination() {
    const me = this;
    const store = me.getMainGrid().getStore();
    const result = ["->", {
      id: "pagingToobar",
      xtype: "pagingtoolbar",
      cls: "PSI-Pagination",
      border: 0,
      store: store
    }, "-", {
        xtype: "displayfield",
        value: "每页显示"
      }, {
        id: "comboCountPerPage",
        xtype: "combobox",
        cls: "PSI-Pagination",
        editable: false,
        width: 60,
        store: PCL.create("PCL.data.ArrayStore", {
          fields: ["text"],
          data: [["20"], ["50"], ["100"],
          ["300"], ["1000"]]
        }),
        value: 20,
        listeners: {
          change: {
            fn: function () {
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

  getMainGrid: function () {
    var me = this;
    if (me.__mainGrid) {
      return me.__mainGrid;
    }

    var modelName = "PSIWSPBill";
    PCL.define(modelName, {
      extend: "PCL.data.Model",
      fields: ["id", "ref", "bizDate", "fromWarehouseName",
        "toWarehouseName", "inputUserName", "bizUserName",
        "billStatus", "dateCreated", "billMemo"]
    });
    var store = PCL.create("PCL.data.Store", {
      autoLoad: false,
      model: modelName,
      data: [],
      pageSize: 20,
      proxy: {
        type: "ajax",
        actionMethods: {
          read: "POST"
        },
        url: PSI.Const.BASE_URL + "Home/WSP/wspbillList",
        reader: {
          root: 'dataList',
          totalProperty: 'totalCount'
        }
      }
    });
    store.on("beforeload", function () {
      store.proxy.extraParams = me.getQueryParam();
    });
    store.on("load", function (e, records, successful) {
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
          width: 60,
          renderer: function (value) {
            return value == 0
              ? "<span style='color:red'>待拆分</span>"
              : "已拆分";
          }
        }, {
          header: "单号",
          dataIndex: "ref",
          width: 140
        }, {
          header: "业务日期",
          dataIndex: "bizDate",
          width: 80,
          align: "center"
        }, {
          header: "仓库",
          dataIndex: "fromWarehouseName",
          width: 150
        }, {
          header: "拆分后入库仓库",
          dataIndex: "toWarehouseName",
          width: 150
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
          width: 300
        }]
      },
      listeners: {
        select: {
          fn: me.onMainGridSelect,
          scope: me
        },
        itemdblclick: {
          fn: me.getPermission().edit == "1"
            ? me.onEditBill
            : PCL.emptyFn,
          scope: me
        }
      },
      store: store,
    });

    return me.__mainGrid;
  },

  onMainGridSelect: function () {
    var me = this;
    me.getDetailGrid().setTitle(me.formatGridHeaderTitle("拆分单明细"));
    var grid = me.getMainGrid();
    var item = grid.getSelectionModel().getSelection();
    if (item == null || item.length != 1) {
      PCL.getCmp("buttonEdit").setDisabled(true);
      PCL.getCmp("buttonDelete").setDisabled(true);
      PCL.getCmp("buttonCommit").setDisabled(true);
      return;
    }
    var bill = item[0];

    var commited = parseInt(bill.get("billStatus")) == 1000;

    var buttonEdit = PCL.getCmp("buttonEdit");
    buttonEdit.setDisabled(false);
    if (commited) {
      buttonEdit.setText("查看拆分单");
    } else {
      buttonEdit.setText("编辑拆分单");
    }

    PCL.getCmp("buttonDelete").setDisabled(commited);
    PCL.getCmp("buttonCommit").setDisabled(commited);

    me.refreshDetailGrid();
    me.refreshDetailGridEx();
  },

  refreshMainGrid: function (id) {
    PCL.getCmp("buttonEdit").setDisabled(true);
    PCL.getCmp("buttonDelete").setDisabled(true);
    PCL.getCmp("buttonCommit").setDisabled(true);

    var me = this;
    var gridDetail = me.getDetailGrid();
    gridDetail.setTitle(me.formatGridHeaderTitle("拆分单明细"));
    gridDetail.getStore().removeAll();

    me.getDetailGridEx().getStore().removeAll();

    PCL.getCmp("pagingToobar").doRefresh();
    me.__lastId = id;
  },

  refreshDetailGrid: function (id) {
    var me = this;
    me.getDetailGrid().setTitle(me.formatGridHeaderTitle("拆分单明细"));
    var grid = me.getMainGrid();
    var item = grid.getSelectionModel().getSelection();
    if (item == null || item.length != 1) {
      return;
    }
    var bill = item[0];

    var grid = me.getDetailGrid();
    grid.setTitle(me.formatGridHeaderTitle("单号: " + bill.get("ref")
      + " 仓库: " + bill.get("fromWarehouseName") + " 拆分后调入仓库: "
      + bill.get("toWarehouseName")));
    var el = grid.getEl();
    el && el.mask(PSI.Const.LOADING);
    me.ajax({
      url: me.URL("Home/WSP/wspBillDetailList"),
      params: {
        id: bill.get("id")
      },
      callback: function (options, success, response) {
        var store = grid.getStore();

        store.removeAll();
        me.getGoodsBOMGrid().getStore().getRootNode()
          .removeAll();

        if (success) {
          var data = PCL.JSON.decode(response.responseText);
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

        el && el.unmask();
      }
    });
  },

  refreshDetailGridEx: function (id) {
    var me = this;
    var grid = me.getMainGrid();
    var item = grid.getSelectionModel().getSelection();
    if (item == null || item.length != 1) {
      return;
    }
    var bill = item[0];

    var grid = me.getDetailGridEx();
    var el = grid.getEl();
    el && el.mask(PSI.Const.LOADING);
    me.ajax({
      url: me.URL("Home/WSP/wspBillDetailExList"),
      params: {
        id: bill.get("id")
      },
      callback: function (options, success, response) {
        var store = grid.getStore();

        store.removeAll();

        if (success) {
          var data = PCL.JSON.decode(response.responseText);
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

        el && el.unmask();
      }
    });
  },

  getDetailGrid: function () {
    var me = this;
    if (me.__detailGrid) {
      return me.__detailGrid;
    }

    var modelName = "PSIWSPBillDetail";
    PCL.define(modelName, {
      extend: "PCL.data.Model",
      fields: ["id", "goodsCode", "goodsName", "goodsSpec",
        "unitName", "goodsCount", "memo"]
    });
    var store = PCL.create("PCL.data.Store", {
      autoLoad: false,
      model: modelName,
      data: []
    });

    me.__detailGrid = PCL.create("PCL.grid.Panel", {
      cls: "PSI-HL",
      viewConfig: {
        enableTextSelection: true
      },
      header: {
        height: 30,
        title: me.formatGridHeaderTitle("拆分单明细")
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
          menuDisabled: true,
          draggable: false,
          sortable: false,
          header: "品名/规格型号",
          dataIndex: "goodsName",
          width: 330,
          renderer: function (value, metaData, record) {
            return record.get("goodsName") + " " + record.get("goodsSpec");
          }
        }, {
          header: "拆分数量",
          dataIndex: "goodsCount",
          width: 90,
          align: "right"
        }, {
          header: "单位",
          dataIndex: "unitName",
          width: 60,
          align: "center"
        }, {
          header: "备注",
          dataIndex: "memo",
          width: 300
        }]
      },
      store: store,
      listeners: {
        select: {
          fn: me.onDetailGridSelect,
          scope: me
        }
      }
    });

    return me.__detailGrid;
  },

  getGoodsBOMGrid: function () {
    var me = this;
    if (me.__goodsBOMGrid) {
      return me.__goodsBOMGrid;
    }

    var modelName = "PSIGoodsBOM";
    PCL.define(modelName, {
      extend: "PCL.data.Model",
      fields: ["id", "text", "goodsName", "goodsSpec",
        "unitName", "bomCount", "goodsCount", "leaf",
        "children", "costWeight", "costWeightNote"]
    });

    var store = PCL.create("PCL.data.TreeStore", {
      model: modelName,
      proxy: {
        type: "ajax",
        actionMethods: {
          read: "POST"
        },
        url: me.URL("Home/WSP/goodsBOM")
      },
      listeners: {
        beforeload: {
          fn: function () {
            store.proxy.extraParams = me.getQueryParamForBOM();
          },
          scope: me
        }
      }
    });

    me.__goodsBOMGrid = PCL.create("PCL.tree.Panel", {
      cls: "PSI",
      header: {
        height: 30,
        title: me.formatGridHeaderTitle("静态BOM")
      },
      store: store,
      rootVisible: false,
      useArrows: true,
      viewConfig: {
        loadMask: true
      },
      columns: {
        defaults: {
          sortable: false,
          menuDisabled: true,
          draggable: false
        },
        items: [{
          xtype: "treecolumn",
          text: "物料编码",
          dataIndex: "text"
        }, {
          menuDisabled: true,
          draggable: false,
          sortable: false,
          header: "品名/规格型号",
          dataIndex: "goodsName",
          width: 330,
          renderer: function (value, metaData, record) {
            return record.get("goodsName") + " " + record.get("goodsSpec");
          }
        }, {
          header: "标准数量",
          dataIndex: "bomCount",
          width: 90,
          align: "right"
        }, {
          header: "拆分数量",
          dataIndex: "goodsCount",
          width: 90,
          align: "right"
        }, {
          header: "单位",
          dataIndex: "unitName",
          width: 60,
          align: "center"
        }, {
          header: "成本分摊权重",
          dataIndex: "costWeight"
        }, {
          header: "成本分摊占比",
          dataIndex: "costWeightNote",
          width: 200
        }]
      }
    });

    return me.__goodsBOMGrid;
  },

  getQueryParamForBOM: function () {
    var me = this;

    var grid = me.getDetailGrid();
    var item = grid.getSelectionModel().getSelection();
    if (item == null || item.length != 1) {
      return {};
    }
    var detailRecord = item[0];

    var result = {
      id: detailRecord.get("id")
    };
    return result;
  },

  getDetailGridEx: function () {
    var me = this;
    if (me.__detailGridEx) {
      return me.__detailGridEx;
    }

    var modelName = "PSIWSPBillDetailEx";
    PCL.define(modelName, {
      extend: "PCL.data.Model",
      fields: ["id", "goodsCode", "goodsName", "goodsSpec",
        "unitName", "goodsCount"]
    });
    var store = PCL.create("PCL.data.Store", {
      autoLoad: false,
      model: modelName,
      data: []
    });

    me.__detailGridEx = PCL.create("PCL.grid.Panel", {
      cls: "PSI-HL",
      viewConfig: {
        enableTextSelection: true
      },
      title: "拆分后物料明细",
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
          menuDisabled: true,
          draggable: false,
          sortable: false,
          header: "品名/规格型号",
          dataIndex: "goodsName",
          width: 330,
          renderer: function (value, metaData, record) {
            return record.get("goodsName") + " " + record.get("goodsSpec");
          }
        }, {
          header: "拆分后入库数量",
          dataIndex: "goodsCount",
          width: 120,
          align: "right"
        }, {
          header: "单位",
          dataIndex: "unitName",
          width: 60,
          align: "center"
        }]
      },
      store: store
    });

    return me.__detailGridEx;
  },

  gotoMainGridRecord: function (id) {
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

  onDetailGridSelect: function () {
    var me = this;
    me.getGoodsBOMGrid().setTitle(me.formatGridHeaderTitle("静态BOM"));

    me.refreshGoodsBomGrid();
  },

  refreshGoodsBomGrid: function () {
    var me = this;

    me.getGoodsBOMGrid().getStore().load();
  },

  onAddBill: function () {
    var me = this;

    var form = PCL.create("PSI.WSP.WSPEditForm", {
      parentForm: me
    });

    form.show();
  },

  onEditBill: function () {
    var me = this;
    var item = me.getMainGrid().getSelectionModel().getSelection();
    if (item == null || item.length != 1) {
      me.showInfo("请选择要编辑的拆分单");
      return;
    }
    var bill = item[0];

    var form = PCL.create("PSI.WSP.WSPEditForm", {
      parentForm: me,
      entity: bill
    });
    form.show();
  },

  onDeleteBill: function () {
    var me = this;
    var item = me.getMainGrid().getSelectionModel().getSelection();
    if (item == null || item.length != 1) {
      me.showInfo("请选择要删除的拆分单");
      return;
    }
    var bill = item[0];

    if (bill.get("billStatus") > 0) {
      me.showInfo("当前拆分单已经提交，不能删除");
      return;
    }

    var store = me.getMainGrid().getStore();
    var index = store.findExact("id", bill.get("id"));
    index--;
    var preIndex = null;
    var preItem = store.getAt(index);
    if (preItem) {
      preIndex = preItem.get("id");
    }

    var info = "请确认是否删除拆分单: <span style='color:red'>" + bill.get("ref")
      + "</span>";

    var confirmFunc = function () {
      var el = PCL.getBody();
      el.mask("正在删除中...");
      var r = {
        url: me.URL("Home/WSP/deleteWSPBill"),
        params: {
          id: bill.get("id")
        },
        callback: function (options, success, response) {
          el.unmask();

          if (success) {
            var data = me.decodeJSON(response.responseText);
            if (data.success) {
              me.getGoodsBOMGrid().getStore().getRootNode().removeAll();

              me.refreshMainGrid(preIndex);
              me.tip("成功完成删除操作");
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

  onCommit: function () {
    var me = this;
    var item = me.getMainGrid().getSelectionModel().getSelection();
    if (item == null || item.length != 1) {
      me.showInfo("没有选择要提交的拆分单");
      return;
    }
    var bill = item[0];

    if (parseInt(bill.get("billStatus")) != 0) {
      me.showInfo("当前拆分单已经提交，不能再次提交");
      return;
    }

    var detailCount = me.getDetailGrid().getStore().getCount();
    if (detailCount == 0) {
      me.showInfo("当前拆分单没有录入物料明细，不能提交");
      return;
    }

    var info = "请确认是否提交单号为: <span style='color:red'>" + bill.get("ref")
      + "</span> 的拆分单?";
    var funcConfirm = function () {
      var el = PCL.getBody();
      el.mask("正在提交中...");
      var r = {
        url: me.URL("Home/WSP/commitWSPBill"),
        params: {
          id: bill.get("id")
        },
        callback: function (options, success, response) {
          el.unmask();

          if (success) {
            var data = me.decodeJSON(response.responseText);
            if (data.success) {
              me.refreshMainGrid(data.id);
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

    me.confirm(info, funcConfirm);
  },

  onPDF: function () {
    var me = this;
    var item = me.getMainGrid().getSelectionModel().getSelection();
    if (item == null || item.length != 1) {
      me.showInfo("没有选择要生成pdf文件的拆分单");
      return;
    }
    var bill = item[0];

    var url = me.URL("Home/WSP/wspBillPdf?ref=" + bill.get("ref"));
    window.open(url);
  },

  onPrintPreview: function () {
    if (PSI.Const.ENABLE_LODOP != "1") {
      PSI.MsgBox.showInfo("请先在业务设置模块中启用Lodop打印");
      return;
    }

    var me = this;

    var lodop = getLodop();
    if (!lodop) {
      me.showInfo("没有安装Lodop控件，无法打印");
      return;
    }

    var item = me.getMainGrid().getSelectionModel().getSelection();
    if (item == null || item.length != 1) {
      me.showInfo("没有选择要打印的拆分单");
      return;
    }
    var bill = item[0];

    var el = PCL.getBody();
    el.mask("数据加载中...");
    var r = {
      url: me.URL("Home/WSP/genWSPBillPrintPage"),
      params: {
        id: bill.get("id")
      },
      callback: function (options, success, response) {
        el.unmask();

        if (success) {
          var data = response.responseText;
          me.previewWSPBill(bill.get("ref"), data);
        }
      }
    };
    me.ajax(r);
  },

  PRINT_PAGE_WIDTH: "200mm",
  PRINT_PAGE_HEIGHT: "95mm",

  previewWSPBill: function (ref, data) {
    var me = this;

    var lodop = getLodop();
    if (!lodop) {
      me.showInfo("Lodop打印控件没有正确安装");
      return;
    }

    lodop.PRINT_INIT("拆分单" + ref);
    lodop.SET_PRINT_PAGESIZE(1, me.PRINT_PAGE_WIDTH, me.PRINT_PAGE_HEIGHT,
      "");
    lodop.ADD_PRINT_HTM("0mm", "0mm", "100%", "100%", data);
    var result = lodop.PREVIEW("_blank");
  },

  onPrint: function () {
    if (PSI.Const.ENABLE_LODOP != "1") {
      PSI.MsgBox.showInfo("请先在业务设置模块中启用Lodop打印");
      return;
    }

    var me = this;

    var lodop = getLodop();
    if (!lodop) {
      me.showInfo("没有安装Lodop控件，无法打印");
      return;
    }

    var item = me.getMainGrid().getSelectionModel().getSelection();
    if (item == null || item.length != 1) {
      me.showInfo("没有选择要打印的拆分单");
      return;
    }
    var bill = item[0];

    var el = PCL.getBody();
    el.mask("数据加载中...");
    var r = {
      url: me.URL("Home/WSP/genWSPBillPrintPage"),
      params: {
        id: bill.get("id")
      },
      callback: function (options, success, response) {
        el.unmask();

        if (success) {
          var data = response.responseText;
          me.printWSPBill(bill.get("ref"), data);
        }
      }
    };
    me.ajax(r);
  },

  printWSPBill: function (ref, data) {
    var me = this;

    var lodop = getLodop();
    if (!lodop) {
      me.showInfo("Lodop打印控件没有正确安装");
      return;
    }

    lodop.PRINT_INIT("拆分单" + ref);
    lodop.SET_PRINT_PAGESIZE(1, me.PRINT_PAGE_WIDTH, me.PRINT_PAGE_HEIGHT,
      "");
    lodop.ADD_PRINT_HTM("0mm", "0mm", "100%", "100%", data);
    var result = lodop.PRINT();
  }
});
