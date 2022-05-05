/**
 * 表单 - 新建或编辑界面
 *
 * @author 艾格林门信息服务（大连）有限公司
 * @copyright 2015 - present
 * @license GPL v3
 */
Ext.define("PSI.Form.FormEditForm", {
  extend: "PSI.AFX.Form.EditForm",

  config: {
    category: null,
    slnCode: "",
    slnName: "",
  },

  /**
   * @override
   */
  initComponent() {
    const me = this;
    const entity = me.getEntity();
    me.adding = entity == null;

    const buttons = [];

    buttons.push({
      text: "保存",
      formBind: true,
      iconCls: "PSI-button-ok",
      handler() {
        me._onOK(false);
      },
      scope: me
    }, {
      text: "取消",
      handler() {
        me.close();
      },
      scope: me
    });

    const t = entity == null ? "新增表单" : "编辑表单";
    const logoHtml = me.genLogoHtml(entity, t);

    const width1 = 600;
    const width2 = 295;

    Ext.apply(me, {
      header: {
        title: me.formatTitle(PSI.Const.PROD_NAME),
        height: 40
      },
      width: 650,
      height: 380,
      layout: "border",
      items: [{
        region: "north",
        border: 0,
        height: 55,
        html: logoHtml
      }, {
        region: "center",
        border: 0,
        id: "PSI_Form_FormEditForm_editForm",
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
          labelWidth: 75,
          labelAlign: "right",
          labelSeparator: "",
          msgTarget: 'side'
        },
        items: [{
          xtype: "hidden",
          name: "id",
          value: entity == null ? null : entity.get("id")
        }, {
          xtype: "hidden",
          name: "slnCode",
          value: me.getSlnCode()
        }, {
          xtype: "displayfield",
          colspan: 2,
          width: width1,
          fieldLabel: "解决方案",
          value: `<span class='PSI-field-note'>${me.getSlnName()}</span>`
        }, {
          id: "PSI_Form_FormEditForm_editCategoryId",
          xtype: "hidden",
          name: "categoryId"
        }, {
          id: "PSI_Form_FormEditForm_editCategory",
          xtype: "psi_formcategoryfield",
          slnCode: me.getSlnCode(),
          fieldLabel: "分类",
          width: width2,
          allowBlank: false,
          blankText: "没有输入表单分类",
          beforeLabelTextTpl: PSI.Const.REQUIRED,
          valueField: "id",
          displayField: "name",
          listeners: {
            specialkey: {
              fn: me.__onEditSpecialKey,
              scope: me
            }
          }
        }, {
          id: "PSI_Form_FormEditForm_editCode",
          fieldLabel: "编码",
          labelWidth: 40,
          width: width2,
          name: "code",
          listeners: {
            specialkey: {
              fn: me.__onEditSpecialKey,
              scope: me
            }
          }
        }, {
          id: "PSI_Form_FormEditForm_editName",
          fieldLabel: "表单名称",
          allowBlank: false,
          blankText: "没有输入中文名称",
          beforeLabelTextTpl: PSI.Const.REQUIRED,
          name: "name",
          listeners: {
            specialkey: {
              fn: me.__onEditSpecialKey,
              scope: me
            }
          },
          colspan: 2,
          width: width1
        }, {
          id: "PSI_Form_FormEditForm_editTableName",
          fieldLabel: "数据库表名",
          allowBlank: false,
          blankText: "没有输入数据库表名",
          beforeLabelTextTpl: PSI.Const.REQUIRED,
          name: "tableName",
          listeners: {
            specialkey: {
              fn: me.__onEditSpecialKey,
              scope: me
            }
          },
          colspan: 2,
          width: width1
        }, {
          id: "PSI_Form_FormEditForm_editModuleName",
          fieldLabel: "模块名称",
          allowBlank: false,
          blankText: "没有输入模块名称",
          beforeLabelTextTpl: PSI.Const.REQUIRED,
          name: "moduleName",
          listeners: {
            specialkey: {
              fn: me.__onEditSpecialKey,
              scope: me
            }
          },
          colspan: 2,
          width: width1
        }, {
          id: "PSI_Form_FormEditForm_editMemo",
          fieldLabel: "备注",
          name: "memo",
          value: entity == null ? null : entity
            .get("note"),
          listeners: {
            specialkey: {
              fn: me._onLastEditSpecialKey,
              scope: me
            }
          },
          width: width1,
          colspan: 2
        }],
        buttons: buttons
      }],
      listeners: {
        show: {
          fn: me._onWndShow,
          scope: me
        },
        close: {
          fn: me._onWndClose,
          scope: me
        }
      }
    });

    me.callParent(arguments);

    me.editForm = Ext.getCmp("PSI_Form_FormEditForm_editForm");

    me.editCategoryId = Ext.getCmp("PSI_Form_FormEditForm_editCategoryId");
    me.editCategory = Ext.getCmp("PSI_Form_FormEditForm_editCategory");
    me.editCode = Ext.getCmp("PSI_Form_FormEditForm_editCode");
    me.editName = Ext.getCmp("PSI_Form_FormEditForm_editName");
    me.editTableName = Ext.getCmp("PSI_Form_FormEditForm_editTableName");
    me.editModuleName = Ext.getCmp("PSI_Form_FormEditForm_editModuleName");
    me.editMemo = Ext.getCmp("PSI_Form_FormEditForm_editMemo");

    me.__editorList = [
      me.editCategory, me.editCode, me.editName,
      me.editTableName, me.editModuleName, me.editMemo];

    const c = me.getCategory();
    if (c) {
      me.editCategory.setIdValue(c.get("id"));
      me.editCategory.setValue(c.get("name"));
    }
  },

  /**
   * @private
   */
  _onWndShow() {
    const me = this;

    Ext.get(window).on('beforeunload', me.__onWindowBeforeUnload);

    if (me.adding) {
      // 新建
      const slnCode = me.getSlnCode().toLowerCase();
      me.editTableName.setValue(`t_${slnCode}_`);
    } else {
      // 编辑
      const el = me.getEl();
      el && el.mask(PSI.Const.LOADING);
      Ext.Ajax.request({
        url: me.URL("Home/Form/formInfo"),
        params: {
          id: me.getEntity().get("id")
        },
        method: "POST",
        callback(options, success, response) {
          if (success) {
            const data = me.decodeJSON(response.responseText);
            me.editCategory.setIdValue(data.categoryId);
            me.editCategory.setValue(data.categoryName);
            me.editCode.setValue(data.code);
            me.editName.setValue(data.name);
            me.editTableName.setValue(data.tableName);
            me.editTableName.setReadOnly(true);
            me.editModuleName.setValue(data.moduleName);
            me.editMemo.setValue(data.memo);
          }

          el && el.unmask();
        }
      });
    }

    me.editCode.focus();
    me.editCode.setValue(me.editCode.getValue());
  },

  /**
   * @private
   */
  _onOK() {
    const me = this;

    me.editCategoryId.setValue(me.editCategory.getIdValue());

    const f = me.editForm;
    const el = f.getEl();
    el && el.mask(PSI.Const.SAVING);
    f.submit({
      url: me.URL("Home/Form/editForm"),
      method: "POST",
      success(form, action) {
        el && el.unmask();
        me.tip("数据保存成功", true);
        me.focus();
        me._lastId = action.result.id;
        me.close();
      },
      failure(form, action) {
        el && el.unmask();
        me.showInfo(action.result.msg, () => {
          me.editCode.focus();
        });
      }
    });
  },

  /**
   * @private
   */
  _onLastEditSpecialKey(field, e) {
    const me = this;

    if (e.getKey() === e.ENTER) {
      const f = me.editForm;
      if (f.getForm().isValid()) {
        me._onOK();
      }
    }
  },

  /**
   * @private
   */
  _onWndClose() {
    const me = this;

    Ext.get(window).un('beforeunload', me.__onWindowBeforeUnload);

    if (me._lastId) {
      const parentForm = me.getParentForm();
      if (parentForm) {
        parentForm.refreshMainGrid.apply(parentForm, [me._lastId]);
      }
    }
  }
});
