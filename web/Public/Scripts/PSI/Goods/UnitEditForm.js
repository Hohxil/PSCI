/**
 * 物料计量单位 - 新增或编辑界面
 * 
 * @author 艾格林门信息服务（大连）有限公司
 * @copyright 2015 - present
 * @license GPL v3
 */
PCL.define("PSI.Goods.UnitEditForm", {
  extend: "PSI.AFX.Form.EditForm",

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

    var t = entity == null ? "新建物料计量单位" : "编辑物料计量单位";
    var logoHtml = me.genLogoHtml(entity, t);

    PCL.apply(me, {
      header: {
        title: me.formatTitle(PSI.Const.PROD_NAME),
        height: 40
      },
      width: 650,
      height: 290,
      layout: "border",
      items: [{
        region: "north",
        border: 0,
        height: 70,
        html: logoHtml
      }, {
        region: "center",
        border: 0,
        id: "PSI_Goods_UnitEditForm_editForm",
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
          labelWidth: 60,
          labelAlign: "right",
          labelSeparator: "",
          msgTarget: 'side',
          width: 295,
          margin: "5"
        },
        items: [{
          xtype: "hidden",
          name: "id",
          value: entity == null ? null : entity
            .get("id")
        }, {
          id: "PSI_Goods_UnitEditForm_editName",
          fieldLabel: "计量单位",
          allowBlank: false,
          blankText: "没有输入计量单位",
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
          id: "PSI_Goods_UnitEditForm_editCode",
          fieldLabel: "编码",
          allowBlank: false,
          blankText: "没有输入编码",
          beforeLabelTextTpl: PSI.Const.REQUIRED,
          name: "code",
          value: entity == null ? null : entity
            .get("code"),
          listeners: {
            specialkey: {
              fn: me.onEditCodeSpecialKey,
              scope: me
            }
          }
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
            : parseInt(entity.get("recordStatus"))
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

    me.editForm = PCL.getCmp("PSI_Goods_UnitEditForm_editForm");
    me.editName = PCL.getCmp("PSI_Goods_UnitEditForm_editName");
    me.editCode = PCL.getCmp("PSI_Goods_UnitEditForm_editCode");
  },

  onOK: function (thenAdd) {
    var me = this;
    var f = me.editForm;
    var el = f.getEl();
    el.mask(PSI.Const.SAVING);
    f.submit({
      url: me.URL("Home/Goods/editUnit"),
      method: "POST",
      success: function (form, action) {
        el.unmask();
        me.__lastId = action.result.id;
        PSI.MsgBox.tip("数据保存成功");
        me.focus();
        if (thenAdd) {
          me.clearEditor();
          me.refreshParentFormMainGrid();
        } else {
          me.close();
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

  clearEditor: function () {
    var me = this;

    var editName = me.editName;
    editName.focus();
    editName.setValue(null);
    editName.clearInvalid();

    me.editCode.setValue(null);
  },

  onEditNameSpecialKey: function (field, e) {
    var me = this;

    if (e.getKey() == e.ENTER) {
      me.editCode.focus();
      var v = me.editCode.getValue();
      me.editCode.setValue(null);
      me.editCode.setValue(v);
    }
  },

  onEditCodeSpecialKey: function (field, e) {
    var me = this;

    if (e.getKey() == e.ENTER) {
      var f = me.editForm;
      if (f.getForm().isValid()) {
        me.onOK(me.adding);
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
      const parentForm = me.getParentForm();
      if (parentForm) {
        parentForm.refreshGrid.apply(parentForm, [me.__lastId]);
      }
    }
  },

  onWndShow: function () {
    var me = this;

    PCL.get(window).on('beforeunload', me.onWindowBeforeUnload);

    var editName = me.editName;
    editName.focus();
    var v = editName.getValue();
    editName.setValue(null);
    editName.setValue(v);
  },

  /**
   * 刷新父窗体上Grid的数据
   * 
   * 连续新增计量单位后，这样不用关闭当前窗体就能看到数据
   */
  refreshParentFormMainGrid: function () {
    const me = this;
    const form = me.getParentForm();
    if (form) {
      form.refreshGrid.apply(form, []);
    }
  }
});
