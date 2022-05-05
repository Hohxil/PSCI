/**
 * 账样列 - 新增或编辑界面
 * 
 * @author 艾格林门信息服务（大连）有限公司
 * @copyright 2015 - present
 * @license GPL v3
 */
PCL.define("PSI.SLN0002.Subject.FmtColEditForm", {
  extend: "PSI.AFX.Form.EditForm",

  config: {
    subject: null,
    company: null
  },

  /**
   * @override
   */
  initComponent() {
    const me = this;

    const entity = me.getEntity();

    me.adding = entity == null;

    const buttons = [];
    if (!entity) {
      const btn = {
        text: "保存并继续新建",
        formBind: true,
        handler() {
          me._onOK(true);
        },
        scope: me
      };

      buttons.push(btn);
    }

    let btn = {
      text: "保存",
      formBind: true,
      iconCls: "PSI-button-ok",
      handler() {
        me._onOK(false);
      },
      scope: me
    };
    buttons.push(btn);

    btn = {
      text: "取消",
      handler() {
        me.close();
      },
      scope: me
    };
    buttons.push(btn);

    const t = entity == null ? "新增账样列" : "编辑账样列";
    const logoHtml = me.genLogoHtml(entity, t);

    const width = 600;
    PCL.apply(me, {
      header: {
        title: me.formatTitle(PSI.Const.PROD_NAME),
        height: 40
      },
      width: 650,
      height: 380,
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
        id: "PSI_Subject_FmtColEditForm_editForm",
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
          labelWidth: 80,
          labelAlign: "right",
          labelSeparator: "",
          msgTarget: 'side',
          width,
          margin: "5"
        },
        items: [{
          xtype: "hidden",
          id: "PSI_Subject_FmtColEditForm_hiddenId",
          name: "id",
          value: entity == null ? null : entity.get("id")
        }, {
          xtype: "hidden",
          name: "companyId",
          value: me.getCompany().get("id")
        }, {
          xtype: "hidden",
          name: "subjectCode",
          value: me.getSubject().get("code")
        }, {
          xtype: "displayfield",
          fieldLabel: "科目",
          value: me.toFieldNoteText(me.getSubject().get("code") + " - "
            + me.getSubject().get("name"))
        }, {
          id: "PSI_Subject_FmtColEditForm_editCaption",
          fieldLabel: "列标题",
          allowBlank: false,
          blankText: "没有输入列标题",
          beforeLabelTextTpl: PSI.Const.REQUIRED,
          name: "fieldCaption",
          listeners: {
            specialkey: {
              fn: me.__onEditSpecialKey,
              scope: me
            }
          }
        }, {
          id: "PSI_Subject_FmtColEditForm_editName",
          fieldLabel: "数据库字段",
          allowBlank: false,
          blankText: "没有输入数据库字段名称",
          beforeLabelTextTpl: PSI.Const.REQUIRED,
          name: "fieldName",
          listeners: {
            specialkey: {
              fn: me.__onEditSpecialKey,
              scope: me
            }
          }
        }, {
          id: "PSI_Subject_FmtColEditForm_hiddenFieldType",
          xtype: "hidden",
          name: "fieldType",
          value: "1",
        }, {
          id: "PSI_Subject_FmtColEditForm_editFieldType",
          xtype: "psi_sysdictfield",
          tableName: "t_sysdict_sln0002_fmt_field_type",
          callbackFunc: me._fieldTypeCallback,
          callbackScope: me,
          fieldLabel: "类型",
          beforeLabelTextTpl: PSI.Const.REQUIRED,
          blankText: "没有输入类型",
          value: "字符串",
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

    me.editForm = PCL.getCmp("PSI_Subject_FmtColEditForm_editForm");

    me.hiddenId = PCL.getCmp("PSI_Subject_FmtColEditForm_hiddenId");
    me.editCaption = PCL.getCmp("PSI_Subject_FmtColEditForm_editCaption");
    me.editName = PCL.getCmp("PSI_Subject_FmtColEditForm_editName");
    me.hiddenType = PCL.getCmp("PSI_Subject_FmtColEditForm_hiddenFieldType");
    me.editType = PCL.getCmp("PSI_Subject_FmtColEditForm_editFieldType");

    me.__editorList = [me.editCaption, me.editName, me.editType];
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
    el && el.mask(PSI.Const.SAVING);
    const sf = {
      url: me.URL("SLN0002/Subject/editFmtCol"),
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
        el && el.unmask();
        me.showInfo(action.result.msg, () => {
          me.editCaption.focus();
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
    me.editCaption.focus();

    const editors = [me.editCaption, me.editName];
    for (let i = 0; i < editors.length; i++) {
      const edit = editors[i];
      edit.setValue(null);
      edit.clearInvalid();
    }
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
        parentForm.refreshFmtColsGrid.apply(parentForm, [me._lastId]);
      }
    }
  },

  /**
   * @private
   */
  _onWndShow() {
    const me = this;

    PCL.get(window).on('beforeunload', me.__onWindowBeforeUnload);

    if (me.adding) {
      me.editCaption.focus();
      return;
    }

    const el = me.getEl() || PCL.getBody();
    el.mask(PSI.Const.LOADING);
    const r = {
      url: me.URL("SLN0002/Subject/fmtColInfo"),
      params: {
        id: me.hiddenId.getValue()
      },
      callback(options, success, response) {
        el.unmask();

        if (success) {
          const data = me.decodeJSON(response.responseText);
          me.editCaption.setValue(data.caption);
          me.editName.setValue(data.fieldName);
          me.hiddenType.setValue(data.fieldType);
          me.editType.setValue(data.fieldTypeName);
          if (parseInt(data.sysCol) != 0) {
            // 标准账样列，不能编辑字段名和类型
            me.editName.setReadOnly(true);
            me.editType.setReadOnly(true);
          }

          if (parseInt(data.dbTableCreated) == 1) {
            // 已经创建了数据库表，字段名和类型也不能修改了
            me.editName.setReadOnly(true);
            me.editType.setReadOnly(true);
          }

          me.editCaption.focus();
        } else {
          me.showInfo("网络错误")
        }
      }
    };

    me.ajax(r);
  },

  /**
   * 类型自定义字段回调本方法
   * @private
   */
  _fieldTypeCallback(data, scope) {
    const me = scope;

    let id = data ? data.get("id") : null;
    if (!id) {
      id = "1";
    }
    me.hiddenType.setValue(id);
  },
});
