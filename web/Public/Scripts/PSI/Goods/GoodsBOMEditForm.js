/**
 * 物料BOM - 新增或编辑界面
 * 
 * @author 艾格林门信息服务（大连）有限公司
 * @copyright 2015 - present
 * @license GPL v3
 */
PCL.define("PSI.Goods.GoodsBOMEditForm", {
  extend: "PSI.AFX.Form.EditForm",

  config: {
    goods: null
  },

  /**
   * 初始化组件
   */
  initComponent: function () {
    var me = this;

    var goods = me.getGoods();

    var entity = me.getEntity();

    me.adding = entity == null;

    var buttons = [];
    if (!entity) {
      var btn = {
        text: "保存并继续新建",
        formBind: true,
        handler: function () {
          me.onOK(true);
        },
        scope: me
      };

      buttons.push(btn);
    }

    var btn = {
      text: "保存",
      formBind: true,
      iconCls: "PSI-button-ok",
      handler: function () {
        me.onOK(false);
      },
      scope: me
    };
    buttons.push(btn);

    var btn = {
      text: entity == null ? "关闭" : "取消",
      handler: function () {
        me.close();
      },
      scope: me
    };
    buttons.push(btn);

    var t = entity == null ? "新建子件" : "编辑子件";
    var logoHtml = me.genLogoHtml(entity, t);

    const width1 = 600;
    const width2 = 295;
    PCL.apply(me, {
      header: {
        title: me.formatTitle(PSI.Const.PROD_NAME),
        height: 40
      },
      width: 650,
      height: 460,
      layout: "border",
      listeners: {
        show: {
          fn: me.onWndShow,
          scope: me
        },
        close: {
          fn: me.onWndClose,
          scope: me
        }
      },
      items: [{
        region: "north",
        border: 0,
        height: 70,
        html: logoHtml
      }, {
        region: "center",
        border: 0,
        id: "PSI_Goods_GoodsBOMEditForm_editForm",
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
          labelAlign: "right",
          labelSeparator: "",
          msgTarget: 'side',
          margin: "5",
          labelWidth: 85,
        },
        items: [{
          xtype: "hidden",
          name: "id",
          value: goods.get("id")
        }, {
          fieldLabel: "母  件",
          width1: width1,
          colspan: 2,
          xtype: "displayfield",
          value: me.toFieldNoteText(`${goods.get("code")} - ${goods.get("name")} ${goods.get("spec")}`)
        }, {
          fieldLabel: "母件单位",
          readOnly: true,
          colspan: 2,
          value: goods.get("unitName"),
          width: width2
        }, {
          id: "PSI_Goods_GoodsBOMEditForm_editSubGoodsCode",
          fieldLabel: "子件编码",
          width: width1,
          colspan: 2,
          allowBlank: false,
          blankText: "没有输入子件编码",
          beforeLabelTextTpl: entity == null
            ? PSI.Const.REQUIRED
            : "",
          xtype: "psi_subgoodsfield",
          parentCmp: me,
          parentGoodsId: me.goods.get("id"),
          listeners: {
            specialkey: {
              fn: me.onEditCodeSpecialKey,
              scope: me
            }
          }
        }, {
          fieldLabel: "子件品名",
          width: width1,
          readOnly: true,
          colspan: 2,
          id: "PSI_Goods_GoodsBOMEditForm_editSubGoodsName"
        }, {
          fieldLabel: "子件规格型号",
          readOnly: true,
          width: width1,
          colspan: 2,
          id: "PSI_Goods_GoodsBOMEditForm_editSubGoodsSpec"
        }, {
          id: "PSI_Goods_GoodsBOMEditForm_editSubGoodsCount",
          xtype: "numberfield",
          fieldLabel: "子件数量",
          allowDecimals: PSI.Const.GC_DEC_NUMBER > 0,
          decimalPrecision: PSI.Const.GC_DEC_NUMBER,
          minValue: 0,
          hideTrigger: true,
          name: "subGoodsCount",
          beforeLabelTextTpl: PSI.Const.REQUIRED,
          listeners: {
            specialkey: {
              fn: me.onEditCountSpecialKey,
              scope: me
            }
          },
          width: width2,
        }, {
          fieldLabel: "子件单位",
          width: width2,
          readOnly: true,
          id: "PSI_Goods_GoodsBOMEditForm_editSubGoodsUnitName"
        }, {
          id: "PSI_Goods_GoodsBOMEditForm_editCostWeight",
          xtype: "numberfield",
          fieldLabel: "成本分摊权重",
          allowDecimals: false,
          decimalPrecision: 0,
          minValue: 0,
          maxValue: 100,
          hideTrigger: true,
          name: "costWeight",
          beforeLabelTextTpl: PSI.Const.REQUIRED,
          value: 1,
          listeners: {
            specialkey: {
              fn: me.onEditCostWeightSpecialKey,
              scope: me
            }
          },
          width: width2,
        }, {
          text: "成本分摊权重的使用帮助",
          xtype: "button",
          iconCls: "PSI-help",
          handler: function () {
            var url = me
              .URL("/Home/Help/index?t=costWeight")
            window.open(url);
          }
        }, {
          xtype: "hidden",
          id: "PSI_Goods_GoodsBOMEditForm_editSubGoodsId",
          name: "subGoodsId"
        }, {
          xtype: "hidden",
          name: "addBOM",
          value: entity == null ? "1" : "0"
        }],
        buttons: buttons
      }]
    });

    me.callParent(arguments);

    me.editForm = PCL.getCmp("PSI_Goods_GoodsBOMEditForm_editForm");

    me.editSubGoodsCode = PCL.getCmp("PSI_Goods_GoodsBOMEditForm_editSubGoodsCode");
    me.editSubGoodsName = PCL.getCmp("PSI_Goods_GoodsBOMEditForm_editSubGoodsName");
    me.editSubGoodsCount = PCL.getCmp("PSI_Goods_GoodsBOMEditForm_editSubGoodsCount");
    me.editSubGoodsId = PCL.getCmp("PSI_Goods_GoodsBOMEditForm_editSubGoodsId");
    me.editSubGoodsSpec = PCL.getCmp("PSI_Goods_GoodsBOMEditForm_editSubGoodsSpec");
    me.editSubGoodsUnitName = PCL.getCmp("PSI_Goods_GoodsBOMEditForm_editSubGoodsUnitName");
    me.editCostWeight = PCL.getCmp("PSI_Goods_GoodsBOMEditForm_editCostWeight");
  },

  /**
   * 保存
   */
  onOK: function (thenAdd) {
    var me = this;
    var f = me.editForm;
    var el = f.getEl();
    el.mask(PSI.Const.SAVING);
    var sf = {
      url: me.URL("Home/Goods/editGoodsBOM"),
      method: "POST",
      success: function (form, action) {
        me.__lastId = action.result.id;

        el.unmask();

        PSI.MsgBox.tip("数据保存成功");
        me.focus();
        if (thenAdd) {
          me.clearEdit();
        } else {
          me.close();
        }
      },
      failure: function (form, action) {
        el.unmask();
        PSI.MsgBox.showInfo(action.result.msg, function () {
          me.editSubGoodsCode.focus();
        });
      }
    };
    f.submit(sf);
  },

  onEditCodeSpecialKey: function (field, e) {
    var me = this;

    if (e.getKey() == e.ENTER) {
      var edit = me.editSubGoodsCount;
      edit.focus();
      edit.setValue(edit.getValue());
    }
  },

  onEditCountSpecialKey: function (field, e) {
    var me = this;

    if (e.getKey() == e.ENTER) {
      var edit = me.editCostWeight;
      edit.focus();
      edit.setValue(edit.getValue());
    }
  },

  onEditCostWeightSpecialKey: function (field, e) {
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
    me.editSubGoodsCode.focus();

    var editors = [me.editSubGoodsId, me.editSubGoodsCode,
    me.editSubGoodsName, me.editSubGoodsSpec, me.editSubGoodsCount,
    me.editSubGoodsUnitName];
    for (var i = 0; i < editors.length; i++) {
      var edit = editors[i];
      edit.setValue(null);
      edit.clearInvalid();
    }
  },

  onWindowBeforeUnload: function (e) {
    return (window.event.returnValue = e.returnValue = '确认离开当前页面？');
  },

  onWndClose: function () {
    var me = this;

    PCL.get(window).un('beforeunload', me.onWindowBeforeUnload);

    if (me.getParentForm()) {
      me.getParentForm().refreshGoodsBOM();
    }
  },

  onWndShow: function () {
    var me = this;

    PCL.get(window).on('beforeunload', me.onWindowBeforeUnload);

    var subGoods = me.getEntity();
    if (!subGoods) {
      // 新增子商品

      var editCode = me.editSubGoodsCode;
      editCode.focus();
      editCode.setValue(editCode.getValue());

      return;
    }

    // 编辑子商品
    var r = {
      url: me.URL("Home/Goods/getSubGoodsInfo"),
      params: {
        goodsId: me.getGoods().get("id"),
        subGoodsId: subGoods.get("goodsId")
      },
      callback: function (options, success, response) {
        if (success) {
          var data = me.decodeJSON(response.responseText);
          if (data.success) {
            me.editSubGoodsCode.setValue(data.code);
            me.editSubGoodsName.setValue(data.name);
            me.editSubGoodsSpec.setValue(data.spec);
            me.editSubGoodsUnitName.setValue(data.unitName);
            me.editSubGoodsCount.setValue(data.count);
            me.editCostWeight.setValue(data.costWeight);

            me.editSubGoodsId.setValue(subGoods.get("goodsId"));

            me.editSubGoodsCode.setReadOnly(true);
            me.editSubGoodsCount.focus();
          } else {
            me.showInfo(data.msg);
          }
        } else {
          me.showInfo("网络错误");
        }
      }
    };
    me.ajax(r);
  },

  __setGoodsInfo: function (goods) {
    var me = this;
    if (goods) {
      me.editSubGoodsId.setValue(goods.get("id"));
      me.editSubGoodsName.setValue(goods.get("name"));
      me.editSubGoodsSpec.setValue(goods.get("spec"));
      me.editSubGoodsUnitName.setValue(goods.get("unitName"));
    } else {
      me.editSubGoodsId.setValue(null);
      me.editSubGoodsName.setValue(null);
      me.editSubGoodsSpec.setValue(null);
      me.editSubGoodsUnitName.setValue(null);
    }
  }
});
