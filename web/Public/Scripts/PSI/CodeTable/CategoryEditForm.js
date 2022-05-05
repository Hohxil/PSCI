/**
 * 码表分类 - 新增或编辑界面
 * 
 * @author 艾格林门信息服务（大连）有限公司
 * @copyright 2015 - present
 * @license GPL v3
 */
PCL.define("PSI.CodeTable.CategoryEditForm", {
  extend: "PSI.AFX.Form.EditForm",

  config: {
    slnCode: "",
    slnName: "",
  },

  /**
   * 初始化组件
   * 
   * @override
   */
  initComponent() {
    const me = this;

    const entity = me.getEntity();

    me.adding = entity == null;

    const buttons = [];
    if (!entity) {
      const btn = {
        text: "保存并继续新增",
        formBind: true,
        handler() {
          me._onOK(true);
        },
        scope: me
      };

      buttons.push(btn);
    }

    buttons.push({
      text: "保存",
      formBind: true,
      iconCls: "PSI-button-ok",
      handler() {
        me._onOK(false);
      },
      scope: me
    });

    buttons.push({
      text: "取消",
      handler() {
        const info = entity == null ? "新建码表分类" : "编辑码表分类";

        me.confirm(`请确认是否取消：${info}?`, () => {
          me.close();
        });
      },
      scope: me
    });

    const t = entity == null ? "新建码表分类" : "编辑码表分类";
    const logoHtml = me.genLogoHtml(entity, t);
    PCL.apply(me, {
      header: {
        title: me.formatTitle(PSI.Const.PROD_NAME),
        height: 40
      },
      width: 650,
      height: 310,
      layout: "border",
      listeners: {
        show: {
          fn: me._onWndShow,
          scope: me
        },
        close: {
          fn: me._onWndClose,
          scope: me
        }
      },
      items: [{
        region: "north",
        height: 70,
        border: 0,
        html: logoHtml
      }, {
        region: "center",
        border: 0,
        id: "PSI_CodeTable_CategoryEditForm_editForm",
        xtype: "form",
        layout: {
          type: "table",
          columns: 1,
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
          width: 600,
          margin: "5"
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
          fieldLabel: "解决方案",
          value: `<span class='PSI-field-note'>${me.getSlnName()}</span>`
        }, {
          id: "PSI_CodeTable_CategoryEditForm_editCode",
          fieldLabel: "分类编码",
          name: "code",
          allowBlank: false,
          blankText: "没有输入分类编码",
          beforeLabelTextTpl: PSI.Const.REQUIRED,
          value: entity == null ? null : entity.get("code"),
          listeners: {
            specialkey: {
              fn: me.__onEditSpecialKey,
              scope: me
            }
          }
        }, {
          id: "PSI_CodeTable_CategoryEditForm_editName",
          fieldLabel: "分类",
          allowBlank: false,
          blankText: "没有输入分类",
          beforeLabelTextTpl: PSI.Const.REQUIRED,
          name: "name",
          value: entity == null ? null : entity.get("name"),
          listeners: {
            specialkey: {
              fn: me._onLastEditSpecialKey,
              scope: me
            }
          }
        }],
        buttons: buttons
      }]
    });

    me.callParent(arguments);

    me.editForm = PCL.getCmp("PSI_CodeTable_CategoryEditForm_editForm");

    me.editCode = PCL.getCmp("PSI_CodeTable_CategoryEditForm_editCode");
    me.editName = PCL.getCmp("PSI_CodeTable_CategoryEditForm_editName");

    me.__editorList = [me.editCode, me.editName];
  },

  /**
   * 保存
   * 
   * @private
   */
  _onOK(thenAdd) {
    const me = this;
    const f = me.editForm;
    const el = f.getEl();
    el.mask(PSI.Const.SAVING);
    const sf = {
      url: me.URL("Home/CodeTable/editCodeTableCategory"),
      method: "POST",
      success(form, action) {
        me._lastId = action.result.id;
        el.unmask();

        me.tip("数据保存成功", !thenAdd);
        me.focus();
        if (thenAdd) {
          me.clearEdit();
        } else {
          me.close();
        }
      },
      failure(form, action) {
        el.unmask();
        me.showInfo(action.result.msg, () => {
          me.editCode.focus();
        });
      }
    };
    f.submit(sf);
  },

  /**
   * @private
   */
  _onLastEditSpecialKey(field, e) {
    const me = this;

    if (e.getKey() == e.ENTER) {
      const f = me.editForm;
      if (f.getForm().isValid()) {
        me._onOK(me.adding);
      }
    }
  },

  /**
   * @private
   */
  clearEdit() {
    const me = this;
    me.editCode.focus();

    const editors = [me.editCode, me.editName];
    editors.forEach(edit => {
      edit.setValue(null);
      edit.clearInvalid();
    })
  },

  /**
   * @private
   */
  _onWndClose() {
    const me = this;

    PCL.get(window).un('beforeunload', me.__onWindowBeforeUnload);

    if (me._lastId) {
      const parentForm = me.getParentForm();
      if (parentForm) {
        parentForm.refreshCategoryGrid.apply(parentForm, [me._lastId]);
      }
    }
  },

  /**
   * @private
   */
  _onWndShow() {
    const me = this;

    PCL.get(window).on('beforeunload', me.__onWindowBeforeUnload);

    const editCode = me.editCode;
    me.setFocusAndCursorPosToLast(editCode);
  }
});
