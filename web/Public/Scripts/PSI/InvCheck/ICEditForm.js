/**
 * 盘点单
 * 
 * @author 艾格林门信息服务（大连）有限公司
 * @copyright 2015 - present
 * @license GPL v3
 */
PCL.define("PSI.InvCheck.ICEditForm", {
  extend: "PSI.AFX.BaseDialogForm",

  initComponent: function () {
    var me = this;
    me.__readonly = false;
    var entity = me.getEntity();
    me.adding = entity == null;

    var title = entity == null ? "新建盘点单" : "编辑盘点单";
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
      defaultFocus: "editWarehouse",
      tbar: [{
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

          PSI.MsgBox.confirm("请确认是否取消当前操作？", function () {
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
          xtype: "hidden",
          id: "hiddenId",
          name: "id",
          value: entity == null ? null : entity.get("id")
        }, {
          id: "editRef",
          fieldLabel: "单号",
          labelWidth: 60,
          labelAlign: "right",
          labelSeparator: "",
          xtype: "displayfield",
          width: 170,
          value: me.toFieldNoteText("保存后自动生成")
        }, {
          id: "editBizDT",
          fieldLabel: "业务日期",
          allowBlank: false,
          blankText: "没有输入业务日期",
          labelWidth: 80,
          width: 200,
          labelAlign: "right",
          labelSeparator: "",
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
          fieldLabel: "盘点仓库",
          labelWidth: 80,
          colspan: 2,
          width: 300,
          labelAlign: "right",
          labelSeparator: "",
          xtype: "psi_warehousefield",
          fid: "2010",
          allowBlank: false,
          blankText: "没有输入盘点仓库",
          beforeLabelTextTpl: PSI.Const.REQUIRED,
          listeners: {
            specialkey: {
              fn: me.onEditWarehouseSpecialKey,
              scope: me
            }
          }
        }, {
          id: "editBizUser",
          fieldLabel: "业务员",
          xtype: "psi_userfield",
          labelWidth: 60,
          width: 170,
          labelAlign: "right",
          labelSeparator: "",
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
          id: "editBillMemo",
          fieldLabel: "备注",
          labelWidth: 80,
          labelAlign: "right",
          labelSeparator: "",
          colspan: 3,
          width: 500,
          xtype: "textfield",
          listeners: {
            specialkey: {
              fn: me.onEditBillMemoSpecialKey,
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
    me.__canEditGoodsPrice = false;
    var el = me.getEl() || PCL.getBody();
    el.mask(PSI.Const.LOADING);
    PCL.Ajax.request({
      url: PSI.Const.BASE_URL + "Home/InvCheck/icBillInfo",
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
          }

          PCL.getCmp("editBizUser").setIdValue(data.bizUserId);
          PCL.getCmp("editBizUser").setValue(data.bizUserName);
          if (data.bizDT) {
            PCL.getCmp("editBizDT").setValue(data.bizDT);
          }
          if (data.warehouseId) {
            PCL.getCmp("editWarehouse").setIdValue(data.warehouseId);
            PCL.getCmp("editWarehouse").setValue(data.warehouseName);
          }

          PCL.getCmp("editBillMemo").setValue(data.billMemo);

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
      url: PSI.Const.BASE_URL + "Home/InvCheck/editICBill",
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
      PCL.getCmp("editBillMemo").focus();
    }
  },

  onEditBillMemoSpecialKey: function (field, e) {
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
    var modelName = "PSIICBillDetail_EditForm";
    PCL.define(modelName, {
      extend: "PCL.data.Model",
      fields: ["id", "goodsId", "goodsCode", "goodsName",
        "goodsSpec", "unitName", "goodsCount",
        "goodsMoney", "memo"]
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
      plugins: [me.__cellEditing],
      columnLines: true,
      columns: [PCL.create("PCL.grid.RowNumberer", {
        text: "#",
        width: 30
      }), {
        header: "物料编码",
        dataIndex: "goodsCode",
        menuDisabled: true,
        draggable: false,
        sortable: false,
        editor: {
          xtype: "psi_goodsfield",
          parentCmp: me,
          showInvCnt: true,
          warehouseEditName: "editWarehouse"
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
        header: "盘点后库存数量",
        dataIndex: "goodsCount",
        menuDisabled: true,
        draggable: false,
        sortable: false,
        align: "right",
        width: 120,
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
        header: "盘点后库存金额",
        dataIndex: "goodsMoney",
        menuDisabled: true,
        sortable: false,
        draggable: false,
        align: "right",
        xtype: "numbercolumn",
        width: 120,
        editor: {
          xtype: "numberfield",
          hideTrigger: true
        }
      }, {
        header: "备注",
        dataIndex: "memo",
        menuDisabled: true,
        sortable: false,
        draggable: false,
        width: 200,
        editor: {
          xtype: "textfield"
        }
      }, {
        header: "",
        align: "center",
        menuDisabled: true,
        draggable: false,
        width: 50,
        xtype: "actioncolumn",
        id: "columnActionDelete",
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
        width: 50,
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
        width: 50,
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

  cellEditingAfterEdit: function (editor, e) {
    var me = this;
    if (e.colIdx == 6) {
      if (!me.__canEditGoodsPrice) {
        var store = me.getGoodsGrid().getStore();
        if (e.rowIdx == store.getCount() - 1) {
          store.add({});
          var row = e.rowIdx + 1;
          me.getGoodsGrid().getSelectionModel().select(row);
          me.__cellEditing.startEdit(row, 1);
        }
      }
    }
  },

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
  },

  getSaveData: function () {
    var result = {
      id: PCL.getCmp("hiddenId").getValue(),
      bizDT: PCL.Date.format(PCL.getCmp("editBizDT").getValue(), "Y-m-d"),
      warehouseId: PCL.getCmp("editWarehouse").getIdValue(),
      bizUserId: PCL.getCmp("editBizUser").getIdValue(),
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
        goodsMoney: item.get("goodsMoney"),
        memo: item.get("memo")
      });
    }

    return PCL.JSON.encode(result);
  },

  setBillReadonly: function () {
    var me = this;
    me.__readonly = true;
    me.setTitle("<span style='font-size:160%'>查看盘点单</span>");
    PCL.getCmp("buttonSave").setDisabled(true);
    PCL.getCmp("buttonCancel").setText("关闭");
    PCL.getCmp("editBizDT").setReadOnly(true);
    PCL.getCmp("editWarehouse").setReadOnly(true);
    PCL.getCmp("editBizUser").setReadOnly(true);
    PCL.getCmp("editBillMemo").setReadOnly(true);
    PCL.getCmp("columnActionDelete").hide();
    PCL.getCmp("columnActionAdd").hide();
    PCL.getCmp("columnActionAppend").hide();
  }
});
