/**
 * 新增或编辑商品品牌
 * 
 * @author 艾格林门信息服务（大连）有限公司
 * @copyright 2015 - present
 * @license GPL v3
 */
PCL.define("PSI.Goods.BrandEditForm", {
  extend: "PSI.AFX.Form.EditForm",

  /**
   * 初始化组件
   */
  initComponent: function () {
    var me = this;
    var entity = me.getEntity();

    var t = entity == null ? "新建物料品牌" : "编辑物料品牌";
    var logoHtml = me.genLogoHtml(entity, t);

    const width1 = 600;
    const width2 = 295;
    PCL.apply(me, {
      header: {
        title: me.formatTitle(PSI.Const.PROD_NAME),
        height: 40
      },
      width: 650,
      height: 300,
      layout: "border",
      items: [{
        region: "north",
        border: 0,
        height: 70,
        html: logoHtml
      }, {
        region: "center",
        border: 0,
        id: "PSI_Goods_BrandEditForm_editForm",
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
          labelWidth: 50,
          labelAlign: "right",
          labelSeparator: "",
          msgTarget: 'side',
        },
        items: [{
          xtype: "hidden",
          name: "id",
          value: entity === null ? null : entity
            .get("id")
        }, {
          id: "PSI_Goods_BrandEditForm_editName",
          fieldLabel: "品牌",
          labelWidth: 60,
          allowBlank: false,
          blankText: "没有输入品牌",
          beforeLabelTextTpl: PSI.Const.REQUIRED,
          name: "name",
          value: entity === null ? null : entity
            .get("text"),
          listeners: {
            specialkey: {
              fn: me.onEditNameSpecialKey,
              scope: me
            }
          },
          colspan: 2,
          width: width1,
        }, {
          id: "PSI_Goods_BrandEditForm_editParentBrand",
          xtype: "PSI_parent_brand_editor",
          parentItem: me,
          fieldLabel: "上级品牌",
          labelWidth: 60,
          listeners: {
            specialkey: {
              fn: me.onEditParentBrandSpecialKey,
              scope: me
            }
          },
          colspan: 2,
          width: width1,
        }, {
          id: "PSI_Goods_BrandEditForm_editParentBrandId",
          xtype: "hidden",
          name: "parentId",
          value: entity === null ? null : entity
            .get("parentId")
        }, {
          xtype: "combo",
          queryMode: "local",
          editable: false,
          valueField: "id",
          fieldLabel: "状态",
          allowBlank: false,
          blankText: "没有输入状态",
          beforeLabelTextTpl: PSI.Const.REQUIRED,
          name: "recordStatus",
          store: PCL.create("PCL.data.ArrayStore", {
            fields: ["id", "text"],
            data: [[1, "启用"], [2, "停用"]]
          }),
          value: entity == null
            ? 1
            : parseInt(entity.get("recordStatus")),
          width: width2,
        }],
        buttons: [{
          text: "确定",
          formBind: true,
          iconCls: "PSI-button-ok",
          handler: me.onOK,
          scope: me
        }, {
          text: "取消",
          handler: function () {
            PSI.MsgBox.confirm("请确认是否取消操作?",
              function () {
                me.close();
              });
          },
          scope: me
        }]
      }],
      listeners: {
        show: {
          fn: me.onEditFormShow,
          scope: me
        },
        close: {
          fn: me.onWndClose,
          scope: me
        }
      }
    });

    me.callParent(arguments);

    me.editForm = PCL.getCmp("PSI_Goods_BrandEditForm_editForm");

    me.editName = PCL.getCmp("PSI_Goods_BrandEditForm_editName");
    me.editParentBrand = PCL.getCmp("PSI_Goods_BrandEditForm_editParentBrand");
    me.editParentBrandId = PCL.getCmp("PSI_Goods_BrandEditForm_editParentBrandId");
  },

  onWindowBeforeUnload: function (e) {
    return (window.event.returnValue = e.returnValue = '确认离开当前页面？');
  },

  onWndClose: function () {
    var me = this;

    PCL.get(window).un('beforeunload', me.onWindowBeforeUnload);
  },

  onEditFormShow: function () {
    var me = this;

    PCL.get(window).on('beforeunload', me.onWindowBeforeUnload);

    me.editName.focus();

    var entity = me.getEntity();
    if (entity === null) {
      return;
    }

    me.getEl().mask("数据加载中...");
    PCL.Ajax.request({
      url: me.URL("Home/Goods/brandParentName"),
      method: "POST",
      params: {
        id: entity.get("id")
      },
      callback: function (options, success, response) {
        me.getEl().unmask();
        if (success) {
          var data = PCL.JSON.decode(response.responseText);
          me.editParentBrand.setValue(me.htmlDecode(data.parentBrandName));
          me.editParentBrandId.setValue(data.parentBrandId);
          me.editName.setValue(me.htmlDecode(data.name));
        }
      }
    });
  },

  setParentBrand: function (data) {
    var me = this;

    me.editParentBrand.setValue(me.htmlDecode(data.fullName));
    me.editParentBrandId.setValue(data.id);
  },

  onOK: function () {
    var me = this;
    var f = me.editForm;
    var el = f.getEl();
    el.mask("数据保存中...");
    f.submit({
      url: me.URL("Home/Goods/editBrand"),
      method: "POST",
      success: function (form, action) {
        el.unmask();
        me.close();
        if (me.getParentForm()) {
          me.getParentForm().refreshGrid();
        }
      },
      failure: function (form, action) {
        el.unmask();
        PSI.MsgBox.showInfo(action.result.msg, function () {
          me.editName.focus();
        });
      }
    });
  },

  onEditNameSpecialKey: function (field, e) {
    var me = this;

    if (e.getKey() == e.ENTER) {
      me.editParentBrand.focus();
    }
  },

  onEditParentBrandSpecialKey: function (field, e) {
    var me = this;
    if (e.getKey() == e.ENTER) {
      if (me.editForm.getForm().isValid()) {
        me.onOK();
      }
    }
  }
});
