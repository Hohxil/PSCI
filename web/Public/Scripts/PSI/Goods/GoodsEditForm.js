/**
 * 商品 - 新建或编辑界面
 * 
 * @author 艾格林门信息服务（大连）有限公司
 * @copyright 2015 - present
 * @license GPL v3
 */
PCL.define("PSI.Goods.GoodsEditForm", {
  extend: "PSI.AFX.Form.EditForm",

  /**
   * 初始化组件
   */
  initComponent: function () {
    var me = this;
    var entity = me.getEntity();

    var modelName = "PSIGoodsUnit";
    PCL.define(modelName, {
      extend: "PCL.data.Model",
      fields: ["id", "name"]
    });

    me.adding = entity == null;

    var buttons = [];
    if (!entity) {
      buttons.push({
        text: "保存并继续新建",
        formBind: true,
        handler: function () {
          me.onOK(true);
        },
        scope: me
      });
    }

    buttons.push({
      text: "保存",
      formBind: true,
      iconCls: "PSI-button-ok",
      handler: function () {
        me.onOK(false);
      },
      scope: me
    }, {
      text: entity == null ? "关闭" : "取消",
      handler: function () {
        me.close();
      },
      scope: me
    });

    var selectedCategory = null;
    var defaultCategoryId = null;

    if (me.getParentForm()) {
      var selectedCategory = me.getParentForm().getCategoryGrid()
        .getSelectionModel().getSelection();
      var defaultCategoryId = null;
      if (selectedCategory != null && selectedCategory.length > 0) {
        defaultCategoryId = selectedCategory[0].get("id");
      }
    } else {
      // 当 me.getParentForm() == null的时候，本窗体是在其他地方被调用
      // 例如：业务单据中选择商品的界面中，也可以新增商品
    }

    var t = entity == null ? "新建物料" : "编辑物料";
    var logoHtml = me.genLogoHtml(entity, t);

    const width1 = 600;
    const width2 = 295;
    PCL.apply(me, {
      header: {
        title: me.formatTitle(PSI.Const.PROD_NAME),
        height: 40
      },
      width: 650,
      height: 510,
      layout: "border",
      items: [{
        region: "north",
        border: 0,
        height: 70,
        html: logoHtml
      }, {
        region: "center",
        border: 0,
        id: "PSI_Goods_GoodsEditForm_editForm",
        xtype: "form",
        layout: {
          type: "table",
          columns: 2,
          tableAttrs: PSI.Const.TABLE_LAYOUT,
        },
        height: "100%",
        bodyPadding: 5,
        defaultType: 'textfield',
        fieldDefaults: {
          labelWidth: 70,
          labelAlign: "right",
          labelSeparator: "",
          msgTarget: 'side'
        },
        items: [{
          xtype: "hidden",
          name: "id",
          value: entity == null ? null : entity.get("id")
        }, {
          id: "PSI_Goods_GoodsEditForm_editCategory",
          xtype: "psi_goodscategoryfield",
          fieldLabel: "分类",
          allowBlank: false,
          blankText: "没有输入物料分类",
          beforeLabelTextTpl: PSI.Const.REQUIRED,
          listeners: {
            specialkey: {
              fn: me.onEditSpecialKey,
              scope: me
            }
          },
          width: width2,
        }, {
          id: "PSI_Goods_GoodsEditForm_editCategoryId",
          name: "categoryId",
          xtype: "hidden",
          value: defaultCategoryId
        }, {
          id: "PSI_Goods_GoodsEditForm_editCode",
          fieldLabel: "编码",
          width: width2,
          allowBlank: false,
          blankText: "没有输入物料编码",
          beforeLabelTextTpl: PSI.Const.REQUIRED,
          name: "code",
          value: entity == null ? null : entity.get("code"),
          listeners: {
            specialkey: {
              fn: me.onEditSpecialKey,
              scope: me
            }
          }
        }, {
          id: "PSI_Goods_GoodsEditForm_editName",
          fieldLabel: "品名",
          colspan: 2,
          width: width1,
          allowBlank: false,
          blankText: "没有输入品名",
          beforeLabelTextTpl: PSI.Const.REQUIRED,
          name: "name",
          value: entity == null ? null : entity.get("name"),
          listeners: {
            specialkey: {
              fn: me.onEditSpecialKey,
              scope: me
            }
          }
        }, {
          id: "PSI_Goods_GoodsEditForm_editSpec",
          fieldLabel: "规格型号",
          colspan: 2,
          width: width1,
          name: "spec",
          value: entity == null ? null : entity.get("spec"),
          listeners: {
            specialkey: {
              fn: me.onEditSpecialKey,
              scope: me
            }
          }
        }, {
          id: "PSI_Goods_GoodsEditForm_editUnit",
          xtype: "psi_goodsunitfield",
          fieldLabel: "计量单位",
          allowBlank: false,
          blankText: "没有输入计量单位",
          beforeLabelTextTpl: PSI.Const.REQUIRED,
          name: "unitName",
          listeners: {
            specialkey: {
              fn: me.onEditSpecialKey,
              scope: me
            }
          },
          width: width2,
        }, {
          id: "PSI_Goods_GoodsEditForm_editUnitId",
          xtype: "hidden",
          name: "unitId"
        }, {
          id: "PSI_Goods_GoodsEditForm_editBarCode",
          fieldLabel: "条形码",
          width: width2,
          name: "barCode",
          value: entity == null ? null : entity.get("barCode"),
          listeners: {
            specialkey: {
              fn: me.onEditSpecialKey,
              scope: me
            }
          }
        }, {
          id: "PSI_Goods_GoodsEditForm_editBrandId",
          xtype: "hidden",
          name: "brandId"
        }, {
          id: "PSI_Goods_GoodsEditForm_editBrand",
          fieldLabel: "品牌",
          name: "brandName",
          xtype: "PSI_goods_brand_field",
          colspan: 2,
          width: width1,
          listeners: {
            specialkey: {
              fn: me.onEditSpecialKey,
              scope: me
            }
          }
        }, {
          fieldLabel: "销售基准价",
          xtype: "numberfield",
          hideTrigger: true,
          name: "salePrice",
          id: "PSI_Goods_GoodsEditForm_editSalePrice",
          value: entity == null ? null : entity.get("salePrice"),
          listeners: {
            specialkey: {
              fn: me.onEditSpecialKey,
              scope: me
            }
          },
          width: width2,
        }, {
          fieldLabel: "建议采购价",
          xtype: "numberfield",
          width: width2,
          hideTrigger: true,
          name: "purchasePrice",
          id: "PSI_Goods_GoodsEditForm_editPurchasePrice",
          value: entity == null ? null : entity.get("purchasePrice"),
          listeners: {
            specialkey: {
              fn: me.onEditSpecialKey,
              scope: me
            }
          }
        }, {
          fieldLabel: "备注",
          name: "memo",
          id: "PSI_Goods_GoodsEditForm_editMemo",
          value: entity == null ? null : entity.get("memo"),
          listeners: {
            specialkey: {
              fn: me.onLastEditSpecialKey,
              scope: me
            }
          },
          colspan: 2,
          width: width1
        }, {
          id: "PSI_Goods_GoodsEditForm_editRecordStatus",
          xtype: "combo",
          queryMode: "local",
          editable: false,
          valueField: "id",
          fieldLabel: "状态",
          name: "recordStatus",
          store: PCL.create("PCL.data.ArrayStore", {
            fields: ["id", "text"],
            data: [[1000, "启用"], [0, "停用"]]
          }),
          value: 1000,
          width: width2,
        }, {
          id: "PSI_Goods_GoodsEditForm_editTaxRate",
          xtype: "combo",
          queryMode: "local",
          editable: false,
          valueField: "id",
          fieldLabel: "税率",
          store: PCL.create("PCL.data.ArrayStore", {
            fields: ["id", "text"],
            data: [[-1, "[不设定]"],
            [0, "0%"], [1, "1%"],
            [2, "2%"], [3, "3%"],
            [4, "4%"], [5, "5%"],
            [6, "6%"], [7, "7%"],
            [8, "8%"], [9, "9%"],
            [10, "10%"],
            [11, "11%"],
            [12, "12%"],
            [13, "13%"],
            [14, "14%"],
            [15, "15%"],
            [16, "16%"],
            [17, "17%"]]
          }),
          value: -1,
          name: "taxRate",
          width: width2
        }, {
          id: "PSI_Goods_GoodsEditForm_editMType",
          xtype: "combo",
          queryMode: "local",
          editable: false,
          valueField: "id",
          fieldLabel: "物料类型",
          name: "mType",
          store: PCL.create("PCL.data.ArrayStore", {
            fields: ["id", "text"],
            data: [[1000, "原材料"], [2000, "半成品"],
            [3000, "产成品"], [4000, "商品"], [5000, "虚拟件"]]
          }),
          value: 4000,
          width: width2,
        }],
        buttons: buttons
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

    me.editForm = PCL.getCmp("PSI_Goods_GoodsEditForm_editForm");
    me.editCategory = PCL.getCmp("PSI_Goods_GoodsEditForm_editCategory");
    me.editCategoryId = PCL.getCmp("PSI_Goods_GoodsEditForm_editCategoryId");
    me.editCode = PCL.getCmp("PSI_Goods_GoodsEditForm_editCode");
    me.editName = PCL.getCmp("PSI_Goods_GoodsEditForm_editName");
    me.editSpec = PCL.getCmp("PSI_Goods_GoodsEditForm_editSpec");
    me.editUnit = PCL.getCmp("PSI_Goods_GoodsEditForm_editUnit");
    me.editUnitId = PCL.getCmp("PSI_Goods_GoodsEditForm_editUnitId");
    me.editBarCode = PCL.getCmp("PSI_Goods_GoodsEditForm_editBarCode");
    me.editBrand = PCL.getCmp("PSI_Goods_GoodsEditForm_editBrand");
    me.editBrandId = PCL.getCmp("PSI_Goods_GoodsEditForm_editBrandId");
    me.editSalePrice = PCL.getCmp("PSI_Goods_GoodsEditForm_editSalePrice");
    me.editPurchasePrice = PCL.getCmp("PSI_Goods_GoodsEditForm_editPurchasePrice");
    me.editMemo = PCL.getCmp("PSI_Goods_GoodsEditForm_editMemo");
    me.editRecordStatus = PCL.getCmp("PSI_Goods_GoodsEditForm_editRecordStatus");
    me.editTaxRate = PCL.getCmp("PSI_Goods_GoodsEditForm_editTaxRate");
    me.editMType = PCL.getCmp("PSI_Goods_GoodsEditForm_editMType");

    me.__editorList = [
      me.editCategory, me.editCode, me.editName,
      me.editSpec, me.editUnit, me.editBarCode, me.editBrand,
      me.editSalePrice, me.editPurchasePrice, me.editMemo
    ];
  },

  onWindowBeforeUnload: function (e) {
    return (window.event.returnValue = e.returnValue = '确认离开当前页面？');
  },

  onWndShow: function () {
    var me = this;

    PCL.get(window).on('beforeunload', me.onWindowBeforeUnload);

    var editCode = me.editCode;
    editCode.focus();
    var v = editCode.getValue();
    editCode.setValue(null);
    editCode.setValue(v);

    var categoryId = me.editCategoryId.getValue();
    var el = me.getEl();
    el.mask(PSI.Const.LOADING);
    PCL.Ajax.request({
      url: me.URL("Home/Goods/goodsInfo"),
      params: {
        id: me.adding ? null : me.getEntity().get("id"),
        categoryId: categoryId
      },
      method: "POST",
      callback: function (options, success, response) {
        if (success) {
          var data = PCL.JSON.decode(response.responseText);

          if (!me.adding) {
            // 编辑商品信息
            me.editCategory.setIdValue(data.categoryId);
            me.editCategory.setValue(data.categoryName);
            me.editCode.setValue(data.code);
            me.editName.setValue(data.name);
            me.editSpec.setValue(data.spec);
            me.editUnit.setIdValue(data.unitId);
            me.editUnit.setValue(data.unitName);
            me.editSalePrice.setValue(data.salePrice);
            me.editPurchasePrice.setValue(data.purchasePrice);
            me.editBarCode.setValue(data.barCode);
            me.editMemo.setValue(data.memo);
            var brandId = data.brandId;
            if (brandId) {
              var editBrand = me.editBrand;
              editBrand.setIdValue(brandId);
              editBrand.setValue(me.htmlDecode(data.brandFullName));
            }
            me.editRecordStatus.setValue(parseInt(data.recordStatus));
            if (data.taxRate) {
              me.editTaxRate.setValue(parseInt(data.taxRate));
            } else {
              me.editTaxRate.setValue(-1);
            }

            if (data.mType) {
              me.editMType.setValue(parseInt(data.mType));
            }
          } else {
            // 新增商品
            if (data.categoryId) {
              me.editCategory.setIdValue(data.categoryId);
              me.editCategory.setValue(data.categoryName);
              var cmt = parseInt(data.categoryMType);
              if (cmt != -1) {
                // cmt == -1表示分类不限物料类型
                me.editMType.setValue(cmt);
              } else {
                me.editMType.setValue(4000);
              }
            } else {
              me.editMType.setValue(4000);
            }
          }
        }

        el.unmask();
      }
    });
  },

  onOK: function (thenAdd) {
    var me = this;

    var categoryId = me.editCategory.getIdValue();
    me.editCategoryId.setValue(categoryId);

    var unitId = me.editUnit.getIdValue();
    me.editUnitId.setValue(unitId);

    var brandId = me.editBrand.getIdValue();
    me.editBrandId.setValue(brandId);

    var f = me.editForm;
    var el = f.getEl();
    el.mask(PSI.Const.SAVING);
    f.submit({
      url: me.URL("Home/Goods/editGoods"),
      method: "POST",
      success: function (form, action) {
        el.unmask();
        me.__lastId = action.result.id;
        if (me.getParentForm()) {
          me.getParentForm().__lastId = me.__lastId;
        }

        PSI.MsgBox.tip("数据保存成功");
        me.focus();

        if (thenAdd) {
          me.clearEdit();
        } else {
          me.close();
          if (me.getParentForm()) {
            me.getParentForm().freshGoodsGrid();
          }
        }
      },
      failure: function (form, action) {
        el.unmask();
        PSI.MsgBox.showInfo(action.result.msg, function () {
          me.editCode.focus();
        });
      }
    });
  },

  onEditSpecialKey: function (field, e) {
    var me = this;

    if (e.getKey() === e.ENTER) {
      var id = field.getId();
      for (var i = 0; i < me.__editorList.length; i++) {
        var editor = me.__editorList[i];
        if (id === editor.getId()) {
          var edit = me.__editorList[i + 1];
          edit.focus();
          var v = edit.getValue()
          edit.setValue(null);
          edit.setValue(v);
        }
      }
    }
  },

  onLastEditSpecialKey: function (field, e) {
    var me = this;

    if (e.getKey() == e.ENTER) {
      var f = me.editForm;
      if (f.getForm().isValid()) {
        me.onOK(me.adding);
      }
    }
  },

  clearEdit: function () {
    var me = this;

    me.editCode.focus();

    var editors = [me.editCode, me.editName, me.editSpec, me.editSalePrice,
    me.editPurchasePrice, me.editBarCode, me.editMemo];
    for (var i = 0; i < editors.length; i++) {
      var edit = editors[i];
      edit.setValue(null);
      edit.clearInvalid();
    }
  },

  onWndClose: function () {
    var me = this;

    PCL.get(window).un('beforeunload', me.onWindowBeforeUnload);

    if (me.getParentForm()) {
      me.getParentForm().__lastId = me.__lastId;
      me.getParentForm().freshGoodsGrid();
    }
  }
});
