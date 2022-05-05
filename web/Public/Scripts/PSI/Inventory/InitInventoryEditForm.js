/**
 * 库存建账 - 编辑界面
 * 
 * @author 艾格林门信息服务（大连）有限公司
 * @copyright 2015 - present
 * @license GPL v3
 */
PCL.define("PSI.Inventory.InitInventoryEditForm", {
  extend: "PCL.window.Window",
  config: {
    warehouse: null,
    parentForm: null,
  },

  initComponent: function () {
    var me = this;
    var warehouse = me.getWarehouse();
    PCL.define("PSIGoodsCategory", {
      extend: "PCL.data.Model",
      fields: ["id", "name"]
    });
    var storeGoodsCategory = PCL.create("PCL.data.Store", {
      autoLoad: false,
      model: "PSIGoodsCategory",
      data: []
    });
    me.storeGoodsCategory = storeGoodsCategory;

    var logoHtml = "<img style='float:left;margin:10px 10px 0px 10px;width:48px;height:48px;' src='"
      + PSI.Const.BASE_URL
      + "Public/Images/edit-form-update.png'></img>"
      + "<h2 style='margin:20px'>建账仓库：<span style='color:#cf1322'>"
      + warehouse.get("name") + "</span></h2>";

    PCL.apply(me, {
      header: {
        title: "<span style='font-size:160%'>录入建账数据</span>",
        height: 40
      },
      modal: true,
      onEsc: PCL.emptyFn,
      width: 1000,
      height: 600,
      maximized: true,
      layout: "fit",
      items: [{
        id: "editForm",
        layout: "border",
        border: 0,
        bodyPadding: 5,
        items: [{
          xtype: "panel",
          region: "north",
          height: 70,
          border: 0,
          html: logoHtml
        }, {
          xtype: "panel",
          region: "center",
          layout: "border",
          border: 0,
          items: [{
            xtype: "panel",
            region: "center",
            layout: "border",
            border: 0,
            items: [{
              xtype: "panel",
              region: "north",
              height: 40,
              layout: "hbox",
              border: 0,
              items: [{
                xtype: "displayfield",
                margin: 5,
                value: "物料分类"
              }, {
                id: "comboboxGoodsCategory",
                cls: "PSI-toolbox",
                margin: 5,
                xtype: "combobox",
                flex: 1,
                store: storeGoodsCategory,
                editable: false,
                displayField: "name",
                valueField: "id",
                queryMode: "local",
                listeners: {
                  change: function () {
                    me.getGoods();
                  }
                }
              }]
            }, {
              xtype: "panel",
              region: "center",
              layout: "fit",
              items: [this.getGoodsGrid()]
            }]
          }, {
            xtype: "panel",
            region: "east",
            width: 400,
            split: true,
            items: [{
              xtype: "form",
              layout: "form",
              border: 0,
              fieldDefaults: {
                labelWidth: 60,
                labelAlign: "right",
                labelSeparator: "",
                msgTarget: 'side'
              },
              bodyPadding: 5,
              defaultType: 'textfield',
              items: [{
                id: "editGoodsCode",
                fieldLabel: "物料编码",
                xtype: "displayfield"
              }, {
                id: "editGoodsName",
                fieldLabel: "品名",
                xtype: "displayfield"
              }, {
                id: "editGoodsSpec",
                fieldLabel: "规格型号",
                xtype: "displayfield"
              }, {
                id: "editGoodsCount",
                fieldLabel: "期初数量",
                beforeLabelTextTpl: PSI.Const.REQUIRED,
                xtype: "numberfield",
                allowDecimals: PSI.Const.GC_DEC_NUMBER > 0,
                decimalPrecision: PSI.Const.GC_DEC_NUMBER,
                minValue: 0,
                hideTrigger: true
              }, {
                id: "editUnit",
                xtype: "displayfield",
                fieldLabel: "计量单位",
                value: ""
              }, {
                id: "editGoodsMoney",
                fieldLabel: "期初金额",
                xtype: "numberfield",
                allowDecimals: true,
                hideTrigger: true,
                beforeLabelTextTpl: PSI.Const.REQUIRED
              }, {
                id: "editGoodsPrice",
                fieldLabel: "期初单价",
                xtype: "displayfield"
              }]
            }, {
              xtype: "container",
              layout: "hbox",
              items: [{
                xtype: "container",
                flex: 1
              }, {
                id: "buttonSubmit",
                xtype: "button",
                height: 36,
                text: "保存当前物料的建账信息",
                iconCls: "PSI-button-ok",
                flex: 2,
                handler: me.onSave,
                scope: me
              }, {
                xtype: "container",
                flex: 1
              }]
            }, {
              xtype: "container",
              layout: "hbox",
              margin: 10,
              items: [{
                xtype: "container",
                flex: 1
              }, {
                xtype: "checkbox",
                id: "checkboxGotoNext",
                checked: true,
                fieldLabel: "保存后自动跳转到下一条记录",
                labelWidth: 180,
                labelSeparator: ""
              }, {
                xtype: "container",
                flex: 1
              }]
            }, {
              fieldLabel: "说明",
              xtype: "displayfield",
              labelWidth: 60,
              labelAlign: "right",
              labelSeparator: "",
              value: "如果期初数量设置为0，就会清除该物料的建账记录"
            }]
          }]
        }]
      }],
      buttons: [{
        text: "关闭",
        handler: function () {
          me.close();
        }
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
    PCL.getCmp("editGoodsCount").on("specialkey", function (field, e) {
      if (e.getKey() == e.ENTER) {
        PCL.getCmp("editGoodsMoney").focus();
      }
    });
    PCL.getCmp("editGoodsMoney").on("specialkey", function (field, e) {
      if (e.getKey() == e.ENTER) {
        PCL.getCmp("buttonSubmit").focus();
      }
    });
    me.getGoodsCategories();
  },

  onWindowBeforeUnload: function (e) {
    return (window.event.returnValue = e.returnValue = '确认离开当前页面？');
  },

  onWndClose: function () {
    var me = this;

    PCL.get(window).un('beforeunload', me.onWindowBeforeUnload);

    const parentForm = me.getParentForm();
    if (parentForm && parentForm.freshInvGrid) {
      parentForm.freshInvGrid.apply(parentForm);
    }
  },

  onWndShow: function () {
    var me = this;

    PCL.get(window).on('beforeunload', me.onWindowBeforeUnload);
  },

  getGoodsGrid: function () {
    var me = this;
    if (me.__gridGoods) {
      return me.__gridGoods;
    }

    PCL.define("PSIInitInvGoods", {
      extend: "PCL.data.Model",
      fields: ["id", "goodsCode", "goodsName", "goodsSpec",
        "goodsCount", "unitName", "goodsMoney",
        "goodsPrice", "initDate"]
    });
    var store = PCL.create("PCL.data.Store", {
      autoLoad: false,
      model: "PSIInitInvGoods",
      data: [],
      pageSize: 20,
      proxy: {
        type: "ajax",
        actionMethods: {
          read: "POST"
        },
        url: PSI.Const.BASE_URL
          + "Home/InitInventory/goodsList",
        reader: {
          root: 'goodsList',
          totalProperty: 'totalCount'
        }
      },
      listeners: {
        beforeload: {
          fn: function () {
            var comboboxGoodsCategory = PCL.getCmp("comboboxGoodsCategory");
            var categoryId = comboboxGoodsCategory.getValue();
            var warehouseId = me.getWarehouse().get("id");
            PCL.apply(store.proxy.extraParams, {
              categoryId: categoryId,
              warehouseId: warehouseId
            });
          },
          scope: me
        },
        load: {
          fn: function (e, records, successful) {
            if (successful) {
              me.getGoodsGrid().getSelectionModel().select(0);
              PCL.getCmp("editGoodsCount").focus();
            }
          },
          scope: me
        }
      }
    });
    me.__gridGoods = PCL.create("PCL.grid.Panel", {
      cls: "PSI-FC",
      border: 0,
      columnLines: true,
      columns: [PCL.create("PCL.grid.RowNumberer", {
        text: "序号",
        width: 50
      }), {
        header: "物料编码",
        dataIndex: "goodsCode",
        menuDisabled: true,
        sortable: false,
        width: 80
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
        header: "期初数量",
        dataIndex: "goodsCount",
        menuDisabled: true,
        sortable: false,
        align: "right"
      }, {
        header: "单位",
        dataIndex: "unitName",
        menuDisabled: true,
        sortable: false,
        width: 50
      }, {
        header: "期初金额",
        dataIndex: "goodsMoney",
        menuDisabled: true,
        sortable: false,
        align: "right",
        xtype: "numbercolumn"
      }, {
        header: "期初单价",
        dataIndex: "goodsPrice",
        menuDisabled: true,
        sortable: false,
        align: "right",
        xtype: "numbercolumn"
      }],
      bbar: [{
        id: "_pagingToolbar",
        border: 0,
        xtype: "pagingtoolbar",
        store: store
      }, "-", {
        xtype: "displayfield",
        value: "每页显示"
      }, {
        id: "_comboCountPerPage",
        xtype: "combobox",
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
              store.pageSize = PCL.getCmp("_comboCountPerPage").getValue();
              store.currentPage = 1;
              PCL.getCmp("_pagingToolbar").doRefresh();
            },
            scope: me
          }
        }
      }, {
        xtype: "displayfield",
        value: "条记录"
      }],
      store: store,
      listeners: {
        select: {
          fn: me.onGoodsGridSelect,
          scope: me
        }
      }
    });
    return me.__gridGoods;
  },
  getGoodsCategories: function () {
    var store = this.storeGoodsCategory;
    var el = PCL.getBody();
    el.mask(PSI.Const.LOADING);
    PCL.Ajax.request({
      url: PSI.Const.BASE_URL
        + "Home/InitInventory/goodsCategoryList",
      method: "POST",
      callback: function (options, success, response) {
        store.removeAll();
        if (success) {
          var data = PCL.JSON.decode(response.responseText);
          store.add(data);
        }

        el.unmask();
      }
    });
  },

  getGoods: function () {
    var me = this;
    me.getGoodsGrid().getStore().currentPage = 1;
    PCL.getCmp("_pagingToolbar").doRefresh();
  },

  onGoodsGridSelect: function () {
    var me = this;
    var grid = me.getGoodsGrid();
    var item = grid.getSelectionModel().getSelection();
    if (item == null || item.length != 1) {
      return;
    }

    var goods = item[0];
    PCL.getCmp("editGoodsCode").setValue(goods.get("goodsCode"));
    PCL.getCmp("editGoodsName").setValue(goods.get("goodsName"));
    PCL.getCmp("editGoodsSpec").setValue(goods.get("goodsSpec"));
    PCL.getCmp("editUnit").setValue("<strong>" + goods.get("unitName")
      + "</strong>");
    var goodsCount = goods.get("goodsCount");
    if (goodsCount == "0") {
      PCL.getCmp("editGoodsCount").setValue(null);
      PCL.getCmp("editGoodsMoney").setValue(null);
      PCL.getCmp("editGoodsPrice").setValue(null);
    } else {
      PCL.getCmp("editGoodsCount").setValue(goods.get("goodsCount"));
      PCL.getCmp("editGoodsMoney").setValue(goods.get("goodsMoney"));
      PCL.getCmp("editGoodsPrice").setValue(goods.get("goodsPrice"));
    }
  },

  updateAfterSave: function (goods) {
    goods.set("goodsCount", PCL.getCmp("editGoodsCount").getValue());
    goods.set("goodsMoney", PCL.getCmp("editGoodsMoney").getValue());
    var cnt = PCL.getCmp("editGoodsCount").getValue();
    if (cnt == 0) {
      goods.set("goodsPrice", null);
    } else {
      var p = PCL.getCmp("editGoodsMoney").getValue()
        / PCL.getCmp("editGoodsCount").getValue();
      p = PCL.Number.toFixed(p, 2);
      goods.set("goodsPrice", p);
    }
    this.getGoodsGrid().getStore().commitChanges();
    PCL.getCmp("editGoodsPrice").setValue(goods.get("goodsPrice"));
  },

  onSave: function () {
    var me = this;
    var grid = me.getGoodsGrid();
    var item = grid.getSelectionModel().getSelection();
    if (item == null || item.length != 1) {
      PSI.MsgBox.showInfo("请选择一个建账物料");
      return;
    }

    var goods = item[0];
    var goodsCount = PCL.getCmp("editGoodsCount").getValue();
    var goodsMoney = PCL.getCmp("editGoodsMoney").getValue();
    var el = PCL.getBody();
    el.mask(PSI.Const.SAVING);
    PCL.Ajax.request({
      url: PSI.Const.BASE_URL
        + "Home/InitInventory/commitInitInventoryGoods",
      params: {
        goodsId: goods.get("id"),
        goodsCount: goodsCount,
        goodsMoney: goodsMoney,
        warehouseId: me.getWarehouse().get("id")
      },
      method: "POST",
      callback: function (options, success, response) {
        el.unmask();
        if (success) {
          var result = PCL.JSON.decode(response.responseText);
          if (result.success) {
            me.updateAfterSave(goods);
            if (!PCL.getCmp("checkboxGotoNext").getValue()) {
              PSI.MsgBox.showInfo("数据成功保存");
            } else {
              me.gotoNext();
            }
          } else {
            PSI.MsgBox.showInfo(result.msg, function () {
              PCL.getCmp("editGoodsCount").focus();
            });
          }
        }
      }
    });
  },

  gotoNext: function () {
    var me = this;
    if (!PCL.getCmp("checkboxGotoNext").getValue()) {
      return;
    }
    var grid = me.getGoodsGrid();
    var hasNext = grid.getSelectionModel().selectNext();
    if (!hasNext) {
      PCL.getCmp("_pagingToolbar").moveNext();
    }
    var editCount = PCL.getCmp("editGoodsCount");
    editCount.focus();
  }
});
