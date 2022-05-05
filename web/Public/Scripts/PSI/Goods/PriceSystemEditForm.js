/**
 * 价格体系 - 新增或编辑界面
 * 
 * @author 艾格林门信息服务（大连）有限公司
 * @copyright 2015 - present
 * @license GPL v3
 */
PCL.define("PSI.Goods.PriceSystemEditForm", {
  extend: "PSI.AFX.Form.EditForm",

  config: {
    parentForm: null,
    entity: null
  },

  /**
   * 初始化组件
   */
  initComponent: function () {
    var me = this;
    var entity = me.getEntity();
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

    var t = entity == null ? "新建价格" : "编辑价格";
    var logoHtml = me.genLogoHtml(entity, t);

    const width1 = 600;
    const width2 = 295;
    PCL.apply(me, {
      header: {
        title: me.formatTitle(PSI.Const.PROD_NAME),
        height: 40
      },
      modal: true,
      resizable: false,
      onEsc: PCL.emptyFn,
      width: 650,
      height: 250,
      layout: "border",
      items: [{
        region: "north",
        border: 0,
        height: 70,
        html: logoHtml
      }, {
        region: "center",
        border: 0,
        id: "editForm",
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
          width: width2,
          margin: "5"
        },
        items: [{
          xtype: "hidden",
          name: "id",
          value: entity == null ? null : entity
            .get("id")
        }, {
          id: "editName",
          labelWidth: 60,
          fieldLabel: "价格名称",
          allowBlank: false,
          blankText: "没有输入价格名称",
          beforeLabelTextTpl: PSI.Const.REQUIRED,
          name: "name",
          value: entity == null ? null : entity
            .get("name"),
          listeners: {
            specialkey: {
              fn: me.onEditNameSpecialKey,
              scope: me
            }
          }
        }, {
          id: "editFactor",
          xtype: "numberfield",
          hideTrigger: true,
          fieldLabel: "销售基准价倍数",
          allowBlank: false,
          blankText: "没有输入销售基准价倍数",
          beforeLabelTextTpl: PSI.Const.REQUIRED,
          name: "factor",
          value: entity == null ? 1 : entity
            .get("factor"),
          listeners: {
            specialkey: {
              fn: me.onEditFactorSpecialKey,
              scope: me
            }
          }
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
  },

  onOK: function (thenAdd) {
    var me = this;
    var f = PCL.getCmp("editForm");
    var el = f.getEl();
    el.mask(PSI.Const.SAVING);
    f.submit({
      url: PSI.Const.BASE_URL + "Home/Goods/editPriceSystem",
      method: "POST",
      success: function (form, action) {
        el.unmask();
        me.__lastId = action.result.id;
        PSI.MsgBox.tip("数据保存成功");
        me.focus();
        if (thenAdd) {
          var editName = PCL.getCmp("editName");
          editName.focus();
          editName.setValue(null);
          editName.clearInvalid();
        } else {
          me.close();
        }
      },
      failure: function (form, action) {
        el.unmask();
        PSI.MsgBox.showInfo(action.result.msg, function () {
          PCL.getCmp("editName").focus();
        });
      }
    });
  },

  onEditNameSpecialKey: function (field, e) {
    if (e.getKey() == e.ENTER) {
      var editFactor = PCL.getCmp("editFactor");
      editFactor.focus();
      editFactor.setValue(editFactor.getValue());
    }
  },

  onEditFactorSpecialKey: function (field, e) {
    if (e.getKey() == e.ENTER) {
      var f = PCL.getCmp("editForm");
      if (f.getForm().isValid()) {
        this.onOK(this.adding);
      }
    }
  },

  onWindowBeforeUnload: function (e) {
    return (window.event.returnValue = e.returnValue = '确认离开当前页面？');
  },

  onWndClose: function () {
    var me = this;

    PCL.get(window).un('beforeunload', me.onWindowBeforeUnload);

    if (me.__lastId) {
      me.getParentForm().freshGrid(me.__lastId);
    }
  },

  onWndShow: function () {
    var me = this;

    PCL.get(window).on('beforeunload', me.onWindowBeforeUnload);

    var editName = PCL.getCmp("editName");
    editName.focus();
    editName.setValue(editName.getValue());
  }
});
