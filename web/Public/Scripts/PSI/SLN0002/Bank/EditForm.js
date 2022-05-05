/**
 * 银行账户 - 新建或编辑界面
 * 
 * @author 艾格林门信息服务（大连）有限公司
 * @copyright 2015 - present
 * @license GPL v3
 */
PCL.define("PSI.SLN0002.Bank.EditForm", {
  extend: "PSI.AFX.Form.EditForm",

  config: {
    company: null
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
        text: "保存并继续新建",
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
      text: entity == null ? "关闭" : "取消",
      handler() {
        me.close();
      },
      scope: me
    });

    const t = entity == null ? "新建银行账户" : "编辑银行账户";
    const logoHtml = me.genLogoHtml(entity, t);

    PCL.apply(me, {
      header: {
        title: me.formatTitle(PSI.Const.PROD_NAME),
        height: 40
      },
      width: 400,
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
        id: "PSI_Bank_EditForm_editForm",
        xtype: "form",
        layout: {
          type: "table",
          columns: 1
        },
        height: "100%",
        bodyPadding: 5,
        defaultType: 'textfield',
        fieldDefaults: {
          labelWidth: 60,
          labelAlign: "right",
          labelSeparator: "",
          msgTarget: 'side',
          width: 370,
          margin: "5"
        },
        items: [{
          xtype: "hidden",
          name: "id",
          value: entity == null ? null : entity.get("id")
        }, {
          xtype: "hidden",
          name: "companyId",
          value: me.getCompany().get("id")
        }, {
          fieldLabel: "组织机构",
          xtype: "displayfield",
          value: `<span class='PSI-field-note'>${me.getCompany().get("name")}</span>`
        }, {
          id: "PSI_Bank_EditForm_editBankName",
          fieldLabel: "银行",
          allowBlank: false,
          blankText: "没有输入银行名称",
          beforeLabelTextTpl: PSI.Const.REQUIRED,
          name: "bankName",
          value: entity == null ? null : entity.get("bankName"),
          listeners: {
            specialkey: {
              fn: me.__onEditSpecialKey,
              scope: me
            }
          }
        }, {
          id: "PSI_Bank_EditForm_editBankNumber",
          fieldLabel: "账号",
          allowBlank: false,
          blankText: "没有输入账号",
          beforeLabelTextTpl: PSI.Const.REQUIRED,
          name: "bankNumber",
          value: entity == null ? null : entity.get("bankNumber"),
          listeners: {
            specialkey: {
              fn: me.__onEditSpecialKey,
              scope: me
            }
          }
        }, {
          id: "PSI_Bank_EditForm_editMemo",
          fieldLabel: "备注",
          name: "memo",
          value: entity == null ? null : entity.get("memo"),
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

    me.editForm = PCL.getCmp("PSI_Bank_EditForm_editForm");

    me.editBankName = PCL.getCmp("PSI_Bank_EditForm_editBankName");
    me.editBankNumber = PCL.getCmp("PSI_Bank_EditForm_editBankNumber");
    me.editMemo = PCL.getCmp("PSI_Bank_EditForm_editMemo");

    me.__editorList = [me.editBankName, me.editBankNumber, me.editMemo];
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
      url: me.URL("SLN0002/Bank/editBank"),
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
          me.editBankName.focus();
        });
      }
    };
    f.submit(sf);
  },

  /**
   * 最后一个input回车的时候，提交Form
   * 注：其他input的回车处理函数在父类中实现了
   * 
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
   * 当保存并继续新建的时候，清除之前input里面录入的数据
   * 
   * @private
   */
  clearEdit() {
    const me = this;
    me.editBankName.focus();

    const editors = [me.editBankName, me.editBankNumber, me.editMemo];
    editors.forEach(edit => {
      edit.setValue(null);
      edit.clearInvalid();
    })
  },

  /**
   * Form关闭时候的事件处理函数
   * 
   * @private
   */
  _onWndClose() {
    const me = this;

    PCL.get(window).un('beforeunload', me.__onWindowBeforeUnload);

    if (me._lastId) {
      if (me.getParentForm()) {
        me.getParentForm().refreshMainGrid(me._lastId);
      }
    }
  },

  /**
   * Form显示时候的事件处理函数
   * 
   * @private
   */
  _onWndShow() {
    const me = this;

    PCL.get(window).on('beforeunload', me.__onWindowBeforeUnload);

    me.setFocusAndCursorPosToLast(me.editBankName);
  }
});
