/**
 * 采购退货出库单 - 新增或编辑界面
 * 
 * @author 艾格林门信息服务（大连）有限公司
 * @copyright 2015 - present
 * @license GPL v3
 */
PCL.define("PSI.PurchaseRej.PREditForm", {
  extend: "PSI.AFX.BaseDialogForm",

  initComponent: function () {
    var me = this;
    me.__readonly = false;
    var entity = me.getEntity();
    this.adding = entity == null;

    var title = entity == null ? "新建采购退货出库单" : "编辑采购退货出库单";
    title = me.formatTitle(title);

    PCL.apply(me, {
      header: {
        title: title,
        height: 40
      },
      maximized: true,
      width: 1200,
      height: 600,
      tbar: [{
        text: "选择采购入库单",
        handler: me.onSelectPWBill,
        scope: me,
        disabled: me.entity != null
      }, "-", {
        text: "保存",
        iconCls: "PSI-button-ok",
        handler: me.onOK,
        scope: me,
        id: "buttonSave"
      }, "-", {
        text: "取消",
        handler: function () {
          if (me.__readonly) {
            me.close();
            return;
          }
          PSI.MsgBox.confirm("请确认是否取消当前操作?", function () {
            me.close();
          });
        },
        scope: me,
        id: "buttonCancel"
      }, "->", {
        text: "表单通用操作指南",
        iconCls: "PSI-help",
        handler: function () {
          me.focus();
          window.open(me.URL("Home/Help/index?t=commBill"));
        }
      }, "-", {
        fieldLabel: "快捷访问",
        labelSeparator: "",
        margin: "5 5 5 0",
        cls: "PSI-toolbox",
        labelAlign: "right",
        labelWidth: 50,
        emptyText: "双击此处弹出选择框",
        xtype: "psi_mainmenushortcutfield"
      }],
      layout: "border",
      defaultFocus: "editWarehouse",
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
        height: 90,
        bodyPadding: 10,
        border: 0,
        items: [{
          xtype: "hidden",
          id: "hiddenId",
          name: "id",
          value: entity == null ? null : entity
            .get("id")
        }, {
          id: "editSupplier",
          xtype: "displayfield",
          fieldLabel: "供应商",
          labelWidth: 60,
          labelAlign: "right",
          labelSeparator: "",
          colspan: 4,
          width: 830
        }, {
          id: "editSupplierId",
          xtype: "hidden"
        }, {
          id: "editRef",
          labelWidth: 60,
          labelAlign: "right",
          labelSeparator: "",
          fieldLabel: "单号",
          xtype: "displayfield",
          value: me.toFieldNoteText("保存后自动生成")
        }, {
          id: "editBizDT",
          fieldLabel: "业务日期",
          labelWidth: 60,
          labelAlign: "right",
          labelSeparator: "",
          allowBlank: false,
          blankText: "没有输入业务日期",
          beforeLabelTextTpl: PSI.Const.REQUIRED,
          xtype: "datefield",
          format: "Y-m-d",
          value: new Date(),
          name: "bizDT",
          listeners: {
            specialkey: {
              fn: me.onEditBizDTSpecialKey,
              scope: me
            }
          }
        }, {
          id: "editWarehouse",
          labelWidth: 60,
          labelAlign: "right",
          labelSeparator: "",
          fieldLabel: "出库仓库",
          xtype: "psi_warehousefield",
          fid: "2007",
          allowBlank: false,
          blankText: "没有输入出库仓库",
          beforeLabelTextTpl: PSI.Const.REQUIRED,
          listeners: {
            specialkey: {
              fn: me.onEditWarehouseSpecialKey,
              scope: me
            }
          }
        }, {
          id: "editBizUser",
          labelWidth: 60,
          labelAlign: "right",
          labelSeparator: "",
          fieldLabel: "业务员",
          xtype: "psi_userfield",
          allowBlank: false,
          blankText: "没有输入业务员",
          beforeLabelTextTpl: PSI.Const.REQUIRED,
          listeners: {
            specialkey: {
              fn: me.onEditBizUserSpecialKey,
              scope: me
            }
          }
        }, {
          id: "editReceivingType",
          labelWidth: 60,
          labelAlign: "right",
          labelSeparator: "",
          fieldLabel: "收款方式",
          xtype: "combo",
          queryMode: "local",
          editable: false,
          valueField: "id",
          store: PCL.create("PCL.data.ArrayStore", {
            fields: ["id", "text"],
            data: [["0", "记应收账款"],
            ["1", "现金收款"]]
          }),
          value: "0",
          listeners: {
            specialkey: {
              fn: me.onEditReceivingTypeSpecialKey,
              scope: me
            }
          }
        }, {
          id: "editBillMemo",
          labelWidth: 60,
          labelAlign: "right",
          labelSeparator: "",
          fieldLabel: "备注",
          xtype: "textfield",
          listeners: {
            specialkey: {
              fn: me.onEditBillMemoSpecialKey,
              scope: me
            }
          },
          colspan: 3,
          width: 645
        }]
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
    // 加上这个调用是为了解决 #IMQB2 - https://gitee.com/crm8000/PSI/issues/IMQB2
    // 这个只是目前的临时应急方法，实现的太丑陋了
    PCL.WindowManager.hideAll();

    PCL.get(window).un('beforeunload', this.onWindowBeforeUnload);
  },

  onWndShow: function () {
    PCL.get(window).on('beforeunload', this.onWindowBeforeUnload);

    var me = this;

    var el = me.getEl() || PCL.getBody();
    el.mask(PSI.Const.LOADING);
    PCL.Ajax.request({
      url: PSI.Const.BASE_URL + "Home/PurchaseRej/prBillInfo",
      params: {
        id: PCL.getCmp("hiddenId").getValue()
      },
      method: "POST",
      callback: function (options, success, response) {
        el.unmask();

        if (success) {
          var data = PCL.JSON.decode(response.responseText);

          if (data.ref) {
            PCL.getCmp("editRef").setValue(me.toFieldNoteText(data.ref));
            PCL.getCmp("editSupplierId").setValue(data.supplierId);
            PCL.getCmp("editSupplier").setValue(me.toFieldNoteText(data.supplierName + " 采购入库单单号：" + data.pwbillRef));

            PCL.getCmp("editWarehouse").setIdValue(data.warehouseId);
            PCL.getCmp("editWarehouse").setValue(data.warehouseName);
            PCL.getCmp("editBillMemo").setValue(data.billMemo);
          } else {
            // 新建采购退货出库单，第一步就是选择采购入库单
            me.onSelectPWBill();
          }

          PCL.getCmp("editBizUser").setIdValue(data.bizUserId);
          PCL.getCmp("editBizUser").setValue(data.bizUserName);
          if (data.bizDT) {
            PCL.getCmp("editBizDT").setValue(data.bizDT);
          }

          if (data.receivingType) {
            PCL.getCmp("editReceivingType").setValue(data.receivingType);
          }

          me.__billId = data.pwbillId;

          var store = me.getGoodsGrid().getStore();
          store.removeAll();
          if (data.items) {
            store.add(data.items);
          }

          if (data.billStatus && data.billStatus != 0) {
            me.setBillReadonly();
          }
        }
      }
    });
  },

  onOK: function () {
    var me = this;

    if (!me.__billId) {
      me.showInfo("没有选择要退货的采购入库单，无法保存数据");
      return;
    }

    PCL.getBody().mask("正在保存中...");
    PCL.Ajax.request({
      url: PSI.Const.BASE_URL + "Home/PurchaseRej/editPRBill",
      method: "POST",
      params: {
        adding: me.adding ? "1" : "0",
        jsonStr: me.getSaveData()
      },
      callback: function (options, success, response) {
        PCL.getBody().unmask();

        if (success) {
          var data = PCL.JSON.decode(response.responseText);
          if (data.success) {
            me.close();
            me.getParentForm().refreshMainGrid(data.id);
            me.tip("成功保存数据");
          } else {
            PSI.MsgBox.showInfo(data.msg);
          }
        }
      }
    });

  },
  onEditBizDTSpecialKey: function (field, e) {
    if (e.getKey() == e.ENTER) {
      PCL.getCmp("editWarehouse").focus();
    }
  },
  onEditWarehouseSpecialKey: function (field, e) {
    if (e.getKey() == e.ENTER) {
      PCL.getCmp("editBizUser").focus();
    }
  },
  onEditBizUserSpecialKey: function (field, e) {
    if (e.getKey() == e.ENTER) {
      PCL.getCmp("editReceivingType").focus();
    }
  },

  onEditReceivingTypeSpecialKey: function (field, e) {
    if (e.getKey() == e.ENTER) {
      PCL.getCmp("editBillMemo").focus();
    }
  },

  onEditBillMemoSpecialKey: function (field, e) {
    if (e.getKey() == e.ENTER) {
      var me = this;
      me.getGoodsGrid().focus();
      me.__cellEditing.startEdit(0, 3);
    }
  },

  getGoodsGrid: function () {
    var me = this;
    if (me.__goodsGrid) {
      return me.__goodsGrid;
    }
    var modelName = "PSIPRBillDetail_EditForm";
    PCL.define(modelName, {
      extend: "PCL.data.Model",
      fields: ["id", "goodsId", "goodsCode", "goodsName",
        "goodsSpec", "unitName", "goodsCount",
        "goodsMoney", "goodsPrice", "rejCount", "rejPrice",
        {
          name: "rejMoney",
          type: "float"
        }, "memo", "rejPriceWithTax", {
          name: "rejMoneyWithTax",
          type: "float"
        }, "goodsMoneyWithTax", "goodsPriceWithTax", "taxRate"]
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
        enableTextSelection: true,
        markDirty: !me.adding
      },
      features: [{
        ftype: "summary"
      }],
      plugins: [me.__cellEditing],
      columnLines: true,
      columns: [PCL.create("PCL.grid.RowNumberer", {
        text: "#",
        width: 30
      }), {
        header: "物料编码",
        dataIndex: "goodsCode",
        menuDisabled: true,
        sortable: false,
        draggable: false
      }, {
        header: "品名/规格型号",
        dataIndex: "goodsName",
        menuDisabled: true,
        sortable: false,
        draggable: false,
        width: 330,
        renderer: function (value, metaData, record) {
          return record.get("goodsName") + " " + record.get("goodsSpec");
        }
      }, {
        header: "退货数量",
        dataIndex: "rejCount",
        menuDisabled: true,
        sortable: false,
        draggable: false,
        align: "right",
        width: 80,
        editor: {
          xtype: "numberfield",
          allowDecimals: PSI.Const.GC_DEC_NUMBER > 0,
          decimalPrecision: PSI.Const.GC_DEC_NUMBER,
          minValue: 0,
          hideTrigger: true
        }
      }, {
        header: "单位",
        dataIndex: "unitName",
        menuDisabled: true,
        sortable: false,
        draggable: false,
        width: 50,
        align: "center"
      }, {
        header: "退货单价(含税)",
        dataIndex: "rejPriceWithTax",
        menuDisabled: true,
        sortable: false,
        draggable: false,
        align: "right",
        xtype: "numbercolumn",
        width: 100,
        editor: {
          xtype: "numberfield",
          hideTrigger: true
        },
        summaryRenderer: function () {
          return "金额合计";
        }
      }, {
        header: "退货金额(含税)",
        dataIndex: "rejMoneyWithTax",
        menuDisabled: true,
        sortable: false,
        draggable: false,
        align: "right",
        xtype: "numbercolumn",
        width: 100,
        editor: {
          xtype: "numberfield",
          hideTrigger: true
        },
        summaryType: "sum"
      }, {
        header: "退货单价(不含税)",
        dataIndex: "rejPrice",
        menuDisabled: true,
        sortable: false,
        draggable: false,
        align: "right",
        xtype: "numbercolumn",
        width: 110,
        editor: {
          xtype: "numberfield",
          hideTrigger: true
        }
      }, {
        header: "退货金额(不含税)",
        dataIndex: "rejMoney",
        menuDisabled: true,
        sortable: false,
        draggable: false,
        align: "right",
        xtype: "numbercolumn",
        width: 110,
        editor: {
          xtype: "numberfield",
          hideTrigger: true
        },
        summaryType: "sum"
      }, {
        header: "税率(%)",
        dataIndex: "taxRate",
        menuDisabled: true,
        sortable: false,
        draggable: false,
        align: "right",
        xtype: "numbercolumn",
        format: "#",
        width: 60
      }, {
        header: "原采购数量",
        dataIndex: "goodsCount",
        menuDisabled: true,
        sortable: false,
        draggable: false,
        align: "right",
        width: 80
      }, {
        header: "原采购单价(不含税)",
        dataIndex: "goodsPrice",
        menuDisabled: true,
        sortable: false,
        draggable: false,
        align: "right",
        xtype: "numbercolumn",
        width: 120
      }, {
        header: "原采购金额(不含税)",
        dataIndex: "goodsMoney",
        menuDisabled: true,
        sortable: false,
        draggable: false,
        align: "right",
        xtype: "numbercolumn",
        width: 120
      }, {
        header: "原采购单价(含税)",
        dataIndex: "goodsPriceWithTax",
        menuDisabled: true,
        sortable: false,
        draggable: false,
        align: "right",
        xtype: "numbercolumn",
        width: 110
      }, {
        header: "原采购金额(含税)",
        dataIndex: "goodsMoneyWithTax",
        menuDisabled: true,
        sortable: false,
        draggable: false,
        align: "right",
        xtype: "numbercolumn",
        width: 110
      }, {
        header: "备注",
        dataIndex: "memo",
        menuDisabled: true,
        sortable: false,
        draggable: false,
        editor: {
          xtype: "textfield"
        }
      }],
      store: store,
      listeners: {
        cellclick: function () {
          return !me.__readonly;
        }
      }
    });

    return me.__goodsGrid;
  },

  cellEditingAfterEdit: function (editor, e) {
    var me = this;

    var fieldName = e.field;
    var goods = e.record;
    var oldValue = e.originalValue;

    if (fieldName == "rejMoney") {
      if (goods.get(fieldName) != (new Number(oldValue)).toFixed(2)) {
        me.calcPrice(goods);
      }

      var store = me.getGoodsGrid().getStore();
      e.rowIdx += 1;
      me.getGoodsGrid().getSelectionModel().select(e.rowIdx);
      me.__cellEditing.startEdit(e.rowIdx, 1);
    } else if (fieldName == "rejCount") {
      if (goods.get(fieldName) != oldValue) {
        me.calcMoney(goods);
      }
    } else if (fieldName == "rejPrice") {
      if (goods.get(fieldName) != (new Number(oldValue)).toFixed(2)) {
        me.calcMoney(goods);
      }
    } else if (fieldName == "rejPriceWithTax") {
      if (goods.get(fieldName) != (new Number(oldValue)).toFixed(2)) {
        me.calcMoney2(goods);
      }
    } else if (fieldName == "rejMoneyWithTax") {
      if (goods.get(fieldName) != (new Number(oldValue)).toFixed(2)) {
        me.calcPrice2(goods);
      }
    }
  },

  // 因为退货数量或不含税单价变化
  calcMoney: function (goods) {
    if (!goods) {
      return;
    }

    var rejCount = goods.get("rejCount");
    var rejPrice = goods.get("rejPrice");
    var taxRate = goods.get("taxRate") / 100;
    goods.set("rejMoney", rejCount * rejPrice);
    rejPriceWithTax = rejPrice * (1 + taxRate);
    goods.set("rejPriceWithTax", rejPriceWithTax);
    goods.set("rejMoneyWithTax", rejCount * rejPriceWithTax);
  },

  // 因为含税单价变化
  calcMoney2: function (goods) {
    if (!goods) {
      return;
    }

    var rejCount = goods.get("rejCount");
    var rejPriceWithTax = goods.get("rejPriceWithTax");
    var taxRate = goods.get("taxRate") / 100;

    goods.set("rejMoneyWithTax", rejCount * rejPriceWithTax);
    rejPrice = rejPriceWithTax / (1 + taxRate);
    goods.set("rejPrice", rejPrice);
    goods.set("rejMoney", rejCount * rejPrice);
  },

  // 因不含税金额变化
  calcPrice: function (goods) {
    if (!goods) {
      return;
    }
    var rejCount = goods.get("rejCount");
    var rejMoney = goods.get("rejMoney");
    var taxRate = goods.get("taxRate") / 100;
    var rejMoneyWithTax = rejMoney * (1 + taxRate);
    goods.set("rejMoneyWithTax", rejMoneyWithTax);
    if (rejCount && rejCount != 0) {
      goods.set("rejPrice", rejMoney / rejCount);
      goods.set("rejPriceWithTax", rejMoneyWithTax / rejCount);
    }
  },

  // 因含税金额变化
  calcPrice2: function (goods) {
    if (!goods) {
      return;
    }
    var rejCount = goods.get("rejCount");
    var rejMoneyWithTax = goods.get("rejMoneyWithTax");
    var taxRate = goods.get("taxRate") / 100;

    var rejMoney = rejMoneyWithTax / (1 + taxRate);
    goods.set("rejMoney", rejMoney);
    if (rejCount && rejCount != 0) {
      goods.set("rejPrice", rejMoney / rejCount);
      goods.set("rejPriceWithTax", rejMoneyWithTax / rejCount);
    }
  },

  getSaveData: function () {
    var me = this;

    var result = {
      id: PCL.getCmp("hiddenId").getValue(),
      bizDT: PCL.Date
        .format(PCL.getCmp("editBizDT").getValue(), "Y-m-d"),
      warehouseId: PCL.getCmp("editWarehouse").getIdValue(),
      bizUserId: PCL.getCmp("editBizUser").getIdValue(),
      receivingType: PCL.getCmp("editReceivingType").getValue(),
      billMemo: PCL.getCmp("editBillMemo").getValue(),
      pwBillId: me.__billId,
      items: []
    };

    var store = me.getGoodsGrid().getStore();
    for (var i = 0; i < store.getCount(); i++) {
      var item = store.getAt(i);
      result.items.push({
        id: item.get("id"),
        goodsId: item.get("goodsId"),
        goodsCount: item.get("goodsCount"),
        goodsPrice: item.get("goodsPrice"),
        rejCount: item.get("rejCount"),
        rejPrice: item.get("rejPrice"),
        rejMoney: item.get("rejMoney"),
        memo: item.get("memo"),
        taxRate: item.get("taxRate"),
        rejPriceWithTax: item.get("rejPriceWithTax"),
        rejMoneyWithTax: item.get("rejMoneyWithTax"),
        goodsPriceWithTax: item.get("goodsPriceWithTax"),
        goodsMoneyWithTax: item.get("goodsMoneyWithTax")
      });
    }

    return PCL.JSON.encode(result);
  },

  onSelectPWBill: function () {
    var form = PCL.create("PSI.PurchaseRej.PRSelectPWBillForm", {
      parentForm: this
    });
    form.show();
  },

  // PSI.PurchaseRej.PRSelectPWBillForm中调用本方法
  getPWBillInfo: function (id) {
    var me = this;
    me.__billId = id;
    var el = me.getEl() || PCL.getBody();
    el.mask(PSI.Const.LOADING);
    PCL.Ajax.request({
      url: PSI.Const.BASE_URL + "Home/PurchaseRej/getPWBillInfoForPRBill",
      params: {
        id: id
      },
      method: "POST",
      callback: function (options, success, response) {
        if (success) {
          var data = PCL.JSON.decode(response.responseText);
          PCL.getCmp("editSupplier").setValue(me.toFieldNoteText(data.supplierName + " 采购入库单单号: " + data.ref));
          PCL.getCmp("editSupplierId").setValue(data.supplierId);
          PCL.getCmp("editWarehouse").setIdValue(data.warehouseId);
          PCL.getCmp("editWarehouse").setValue(data.warehouseName);

          var store = me.getGoodsGrid().getStore();
          store.removeAll();
          store.add(data.items);
        }

        el.unmask();
      }
    });
  },

  setBillReadonly: function () {
    var me = this;
    me.__readonly = true;
    me.setTitle("<span style='font-size:160%;'>查看采购退货出库单</span>");
    PCL.getCmp("buttonSave").setDisabled(true);
    PCL.getCmp("buttonCancel").setText("关闭");
    PCL.getCmp("editWarehouse").setReadOnly(true);
    PCL.getCmp("editBizUser").setReadOnly(true);
    PCL.getCmp("editBizDT").setReadOnly(true);
    PCL.getCmp("editReceivingType").setReadOnly(true);
    PCL.getCmp("editBillMemo").setReadOnly(true);
  }
});
