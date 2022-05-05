/**
 * 成品委托生产订单 - 新增或编辑界面
 * 
 * @author 艾格林门信息服务（大连）有限公司
 * @copyright 2015 - present
 * @license GPL v3
 */
PCL.define("PSI.DMO.DMOEditForm", {
  extend: "PSI.AFX.BaseDialogForm",

  config: {
    showAddGoodsButton: "0",
    showAddFactoryButton: "0"
  },

  mixins: ["PSI.Mix.GoodsPrice"],

  initComponent: function () {
    var me = this;
    me.__readOnly = false;
    var entity = me.getEntity();
    this.adding = entity == null;

    var title = entity == null ? "新建成品委托生产订单" : "编辑成品委托生产订单";
    title = me.formatTitle(title);

    PCL.apply(me, {
      header: {
        title: title,
        height: 40
      },
      maximized: true,
      width: 1000,
      height: 600,
      layout: "border",
      defaultFocus: "editFactory",
      tbar: [{
        text: "保存",
        id: "buttonSave",
        iconCls: "PSI-button-ok",
        handler: me.onOK,
        scope: me
      }, "-", {
        text: "取消",
        id: "buttonCancel",
        handler: function () {
          if (me.__readonly) {
            me.close();
            return;
          }

          PSI.MsgBox.confirm("请确认是否取消当前操作？", function () {
            me.close();
          });
        },
        scope: me
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
          xtype: "hidden",
          id: "hiddenId",
          name: "id",
          value: entity == null ? null : entity
            .get("id")
        }, {
          id: "editRef",
          labelWidth: 60,
          labelAlign: "right",
          labelSeparator: "",
          fieldLabel: "单号",
          xtype: "displayfield",
          value: me.toFieldNoteText("保存后自动生成")
        }, {
          id: "editDealDate",
          fieldLabel: "交货日期",
          labelWidth: 60,
          labelAlign: "right",
          labelSeparator: "",
          allowBlank: false,
          blankText: "没有输入交货日期",
          beforeLabelTextTpl: PSI.Const.REQUIRED,
          xtype: "datefield",
          format: "Y-m-d",
          value: new Date(),
          name: "bizDT",
          listeners: {
            specialkey: {
              fn: me.onEditSpecialKey,
              scope: me
            }
          }
        }, {
          id: "editFactory",
          colspan: 2,
          width: 430,
          labelWidth: 60,
          labelAlign: "right",
          labelSeparator: "",
          xtype: "psi_factoryfield",
          fieldLabel: "工厂",
          allowBlank: false,
          blankText: "没有输入工厂",
          beforeLabelTextTpl: PSI.Const.REQUIRED,
          listeners: {
            specialkey: {
              fn: me.onEditSpecialKey,
              scope: me
            }
          },
          showAddButton: me
            .getShowAddFactoryButton() == "1",
          callbackFunc: me.__setFactoryExtData,
          callbackScope: me
        }, {
          id: "editDealAddress",
          labelWidth: 60,
          labelAlign: "right",
          labelSeparator: "",
          fieldLabel: "交货地址",
          colspan: 2,
          width: 430,
          xtype: "textfield",
          listeners: {
            specialkey: {
              fn: me.onEditSpecialKey,
              scope: me
            }
          }
        }, {
          id: "editContact",
          labelWidth: 60,
          labelAlign: "right",
          labelSeparator: "",
          fieldLabel: "联系人",
          xtype: "textfield",
          listeners: {
            specialkey: {
              fn: me.onEditSpecialKey,
              scope: me
            }
          }
        }, {
          id: "editTel",
          labelWidth: 60,
          labelAlign: "right",
          labelSeparator: "",
          fieldLabel: "电话",
          xtype: "textfield",
          listeners: {
            specialkey: {
              fn: me.onEditSpecialKey,
              scope: me
            }
          }
        }, {
          id: "editFax",
          labelWidth: 60,
          labelAlign: "right",
          labelSeparator: "",
          fieldLabel: "传真",
          xtype: "textfield",
          listeners: {
            specialkey: {
              fn: me.onEditSpecialKey,
              scope: me
            }
          }
        }, {
          id: "editOrg",
          labelWidth: 60,
          labelAlign: "right",
          labelSeparator: "",
          fieldLabel: "组织机构",
          xtype: "psi_orgwithdataorgfield",
          colspan: 2,
          width: 430,
          allowBlank: false,
          blankText: "没有输入组织机构",
          beforeLabelTextTpl: PSI.Const.REQUIRED,
          listeners: {
            specialkey: {
              fn: me.onEditSpecialKey,
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
              fn: me.onEditSpecialKey,
              scope: me
            }
          }
        }, {
          id: "editPaymentType",
          labelWidth: 60,
          labelAlign: "right",
          labelSeparator: "",
          fieldLabel: "付款方式",
          xtype: "combo",
          queryMode: "local",
          editable: false,
          valueField: "id",
          store: PCL.create("PCL.data.ArrayStore", {
            fields: ["id", "text"],
            data: [["0", "记应付账款"]]
          }),
          value: "0",
          listeners: {
            specialkey: {
              fn: me.onEditSpecialKey,
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
          colspan: 3,
          width: 645,
          listeners: {
            specialkey: {
              fn: me.onLastEditSpecialKey,
              scope: me
            }
          }
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

    me.__editorList = ["editDealDate", "editFactory", "editDealAddress",
      "editContact", "editTel", "editFax", "editOrg", "editBizUser",
      "editBillMemo"];
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
      url: me.URL("Home/DMO/dmoBillInfo"),
      params: {
        id: PCL.getCmp("hiddenId").getValue()
      },
      method: "POST",
      callback: function (options, success, response) {
        el.unmask();

        if (success) {
          var data = me.decodeJSON(response.responseText);

          if (data.ref) {
            PCL.getCmp("editRef").setValue(me.toFieldNoteText(data.ref));
            PCL.getCmp("editFactory").setIdValue(data.factoryId);
            PCL.getCmp("editFactory").setValue(data.factoryName);
            PCL.getCmp("editBillMemo").setValue(data.billMemo);
            PCL.getCmp("editDealDate").setValue(data.dealDate);
            PCL.getCmp("editDealAddress").setValue(data.dealAddress);
            PCL.getCmp("editContact").setValue(data.contact);
            PCL.getCmp("editTel").setValue(data.tel);
            PCL.getCmp("editFax").setValue(data.fax);
          }

          PCL.getCmp("editBizUser").setIdValue(data.bizUserId);
          PCL.getCmp("editBizUser").setValue(data.bizUserName);
          if (data.orgId) {
            PCL.getCmp("editOrg").setIdValue(data.orgId);
            PCL.getCmp("editOrg").setValue(data.orgFullName);
          }

          if (data.paymentType) {
            PCL.getCmp("editPaymentType").setValue(data.paymentType);
          }

          var store = me.getGoodsGrid().getStore();
          store.removeAll();
          if (data.items) {
            store.add(data.items);
          }
          if (store.getCount() == 0) {
            store.add({});
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
    PCL.getBody().mask("正在保存中...");
    me.ajax({
      url: me.URL("Home/DMO/editDMOBill"),
      params: {
        adding: me.adding ? "1" : "0",
        jsonStr: me.getSaveData()
      },
      callback: function (options, success, response) {
        PCL.getBody().unmask();

        if (success) {
          var data = me.decodeJSON(response.responseText);
          if (data.success) {
            me.close();
            me.getParentForm().refreshMainGrid(data.id);
            me.tip("成功保存数据");
          } else {
            me.showInfo(data.msg);
          }
        }
      }
    });
  },

  onEditSpecialKey: function (field, e) {
    if (e.getKey() === e.ENTER) {
      var me = this;
      var id = field.getId();
      for (var i = 0; i < me.__editorList.length; i++) {
        var editorId = me.__editorList[i];
        if (id === editorId) {
          var edit = PCL.getCmp(me.__editorList[i + 1]);
          edit.focus();
          edit.setValue(edit.getValue());
        }
      }
    }
  },

  onLastEditSpecialKey: function (field, e) {
    if (this.__readonly) {
      return;
    }

    if (e.getKey() == e.ENTER) {
      var me = this;
      var store = me.getGoodsGrid().getStore();
      if (store.getCount() == 0) {
        store.add({});
      }
      me.getGoodsGrid().focus();
      me.__cellEditing.startEdit(0, 1);
    }
  },

  getGoodsGrid: function () {
    var me = this;
    if (me.__goodsGrid) {
      return me.__goodsGrid;
    }
    var modelName = "PSIDMOBill_EditForm";
    PCL.define(modelName, {
      extend: "PCL.data.Model",
      fields: ["id", "goodsId", "goodsCode", "goodsName",
        "goodsSpec", "unitName", "goodsCount", {
          name: "goodsMoney",
          type: "float"
        }, "goodsPrice", {
          name: "taxRate",
          type: "int"
        }, {
          name: "tax",
          type: "float"
        }, {
          name: "moneyWithTax",
          type: "float"
        }, "memo", "goodsPriceWithTax"]
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
      columns: [{
        xtype: "rownumberer",
        text: "#",
        width: 30
      }, {
        header: "物料编码",
        dataIndex: "goodsCode",
        menuDisabled: true,
        sortable: false,
        draggable: false,
        editor: {
          xtype: "psi_goodsfield",
          parentCmp: me,
          showAddButton: me.getShowAddGoodsButton() == "1"
        }
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
        header: "生产数量",
        dataIndex: "goodsCount",
        menuDisabled: true,
        sortable: false,
        draggable: false,
        align: "right",
        width: 90,
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
        width: 60,
        align: "center"
      }, {
        header: "单价",
        dataIndex: "goodsPrice",
        menuDisabled: true,
        sortable: false,
        draggable: false,
        align: "right",
        xtype: "numbercolumn",
        width: 90,
        editor: {
          xtype: "numberfield",
          hideTrigger: true
        },
        summaryRenderer: function () {
          return "金额合计";
        }
      }, {
        header: "金额",
        dataIndex: "goodsMoney",
        menuDisabled: true,
        sortable: false,
        draggable: false,
        align: "right",
        xtype: "numbercolumn",
        width: 90,
        editor: {
          xtype: "numberfield",
          hideTrigger: true
        },
        summaryType: "sum"
      }, {
        header: "含税价",
        dataIndex: "goodsPriceWithTax",
        menuDisabled: true,
        sortable: false,
        draggable: false,
        align: "right",
        xtype: "numbercolumn",
        width: 90,
        editor: {
          xtype: "numberfield",
          hideTrigger: true
        }
      }, {
        header: "税率(%)",
        dataIndex: "taxRate",
        menuDisabled: true,
        sortable: false,
        draggable: false,
        align: "right",
        format: "0",
        width: 60
      }, {
        header: "税金",
        dataIndex: "tax",
        menuDisabled: true,
        sortable: false,
        draggable: false,
        align: "right",
        xtype: "numbercolumn",
        width: 90,
        editor: {
          xtype: "numberfield",
          hideTrigger: true
        },
        summaryType: "sum"
      }, {
        header: "价税合计",
        dataIndex: "moneyWithTax",
        menuDisabled: true,
        sortable: false,
        draggable: false,
        align: "right",
        xtype: "numbercolumn",
        width: 90,
        editor: {
          xtype: "numberfield",
          hideTrigger: true
        },
        summaryType: "sum"
      }, {
        header: "备注",
        dataIndex: "memo",
        menuDisabled: true,
        sortable: false,
        draggable: false,
        editor: {
          xtype: "textfield"
        }
      }, {
        header: "",
        id: "columnActionDelete",
        align: "center",
        menuDisabled: true,
        draggable: false,
        width: 40,
        xtype: "actioncolumn",
        items: [{
          icon: PSI.Const.BASE_URL
            + "Public/Images/icons/delete.png",
          tooltip: "删除当前记录",
          handler: function (grid, row) {
            var store = grid.getStore();
            store.remove(store.getAt(row));
            if (store.getCount() == 0) {
              store.add({});
            }
          },
          scope: me
        }]
      }, {
        header: "",
        id: "columnActionAdd",
        align: "center",
        menuDisabled: true,
        draggable: false,
        width: 40,
        xtype: "actioncolumn",
        items: [{
          icon: PSI.Const.BASE_URL
            + "Public/Images/icons/insert.png",
          tooltip: "在当前记录之前插入新记录",
          handler: function (grid, row) {
            var store = grid.getStore();
            store.insert(row, [{}]);
          },
          scope: me
        }]
      }, {
        header: "",
        id: "columnActionAppend",
        align: "center",
        menuDisabled: true,
        draggable: false,
        width: 40,
        xtype: "actioncolumn",
        items: [{
          icon: PSI.Const.BASE_URL
            + "Public/Images/icons/add.png",
          tooltip: "在当前记录之后新增记录",
          handler: function (grid, row) {
            var store = grid.getStore();
            store.insert(row + 1, [{}]);
          },
          scope: me
        }]
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

  // 控件 xtype:psi_goodsfield 会回调本方法
  __setGoodsInfo: function (data) {
    var me = this;
    var item = me.getGoodsGrid().getSelectionModel().getSelection();
    if (item == null || item.length != 1) {
      return;
    }
    var goods = item[0];

    goods.set("goodsId", data.id);
    goods.set("goodsCode", data.code);
    goods.set("goodsName", data.name);
    goods.set("unitName", data.unitName);
    goods.set("goodsSpec", data.spec);
    goods.set("taxRate", data.taxRate);

    me.calcMoney(goods);
  },

  cellEditingAfterEdit: function (editor, e) {
    var me = this;

    if (me.__readonly) {
      return;
    }

    var fieldName = e.field;
    var goods = e.record;
    var oldValue = e.originalValue;
    if (fieldName == "memo") {
      var store = me.getGoodsGrid().getStore();
      if (e.rowIdx == store.getCount() - 1) {
        store.add({});
        var row = e.rowIdx + 1;
        me.getGoodsGrid().getSelectionModel().select(row);
        me.__cellEditing.startEdit(row, 1);
      }
    } else if (fieldName == "moneyWithTax") {
      if (goods.get(fieldName) != (new Number(oldValue)).toFixed(2)) {
        me.calcTax(goods);
      }
    } else if (fieldName == "tax") {
      if (goods.get(fieldName) != (new Number(oldValue)).toFixed(2)) {
        me.calcMoneyWithTax(goods);
      }
    } else if (fieldName == "goodsMoney") {
      if (goods.get(fieldName) != (new Number(oldValue)).toFixed(2)) {
        me.calcPrice(goods);
      }
    } else if (fieldName == "goodsCount") {
      if (goods.get(fieldName) != oldValue) {
        me.calcMoney(goods);
      }
    } else if (fieldName == "goodsPrice") {
      if (goods.get(fieldName) != (new Number(oldValue)).toFixed(2)) {
        me.calcMoney(goods);
      }
    } else if (fieldName == "goodsPriceWithTax") {
      if (goods.get(fieldName) != (new Number(oldValue)).toFixed(2)) {
        me.calcMoney2(goods);
      }
    }

    // 上述代码的技术说明
    // 各个calcXXXX函数实现在PSI.Mix.GoodsPrice中
    // 这是利用ExtJS的mix技术
  },

  getSaveData: function () {
    var result = {
      id: PCL.getCmp("hiddenId").getValue(),
      dealDate: PCL.Date.format(PCL.getCmp("editDealDate").getValue(), "Y-m-d"),
      factoryId: PCL.getCmp("editFactory").getIdValue(),
      dealAddress: PCL.getCmp("editDealAddress").getValue(),
      contact: PCL.getCmp("editContact").getValue(),
      tel: PCL.getCmp("editTel").getValue(),
      fax: PCL.getCmp("editFax").getValue(),
      orgId: PCL.getCmp("editOrg").getIdValue(),
      bizUserId: PCL.getCmp("editBizUser").getIdValue(),
      paymentType: PCL.getCmp("editPaymentType").getValue(),
      billMemo: PCL.getCmp("editBillMemo").getValue(),
      items: []
    };

    var store = this.getGoodsGrid().getStore();
    for (var i = 0; i < store.getCount(); i++) {
      var item = store.getAt(i);
      result.items.push({
        id: item.get("id"),
        goodsId: item.get("goodsId"),
        goodsCount: item.get("goodsCount"),
        goodsPrice: item.get("goodsPrice"),
        goodsMoney: item.get("goodsMoney"),
        tax: item.get("tax"),
        taxRate: item.get("taxRate"),
        moneyWithTax: item.get("moneyWithTax"),
        memo: item.get("memo"),
        goodsPriceWithTax: item.get("goodsPriceWithTax")
      });
    }

    return PCL.JSON.encode(result);
  },

  setBillReadonly: function () {
    var me = this;
    me.__readonly = true;
    me.setTitle("<span style='font-size:160%;'>查看成品委托生产订单</span>");
    PCL.getCmp("buttonSave").setDisabled(true);
    PCL.getCmp("buttonCancel").setText("关闭");
    PCL.getCmp("editDealDate").setReadOnly(true);
    PCL.getCmp("editFactory").setReadOnly(true);
    PCL.getCmp("editDealAddress").setReadOnly(true);
    PCL.getCmp("editContact").setReadOnly(true);
    PCL.getCmp("editTel").setReadOnly(true);
    PCL.getCmp("editFax").setReadOnly(true);
    PCL.getCmp("editOrg").setReadOnly(true);
    PCL.getCmp("editBizUser").setReadOnly(true);
    PCL.getCmp("editPaymentType").setReadOnly(true);
    PCL.getCmp("editBillMemo").setReadOnly(true);

    PCL.getCmp("columnActionDelete").hide();
    PCL.getCmp("columnActionAdd").hide();
    PCL.getCmp("columnActionAppend").hide();
  },

  // xtype:psi_factoryfield回调本方法
  __setFactoryExtData: function (data, scope) {
    var me = scope;

    // 从工厂基础数据中调取默认值
    // 如果对应的input中已经有值了，则仍保持当前值不变化，不用默认值覆盖当前值

    const editTel = PCL.getCmp("editTel");
    const tel = editTel.getValue();
    if (!tel) {
      editTel.setValue(data.tel01);
    }

    const editFax = PCL.getCmp("editFax");
    const fax = editFax.getValue();
    if (!fax) {
      editFax.setValue(data.fax);
    }

    const editContact = PCL.getCmp("editContact");
    const contact = editContact.getValue();
    if (!contact) {
      editContact.setValue(data.contact01);
    }
  }
});
