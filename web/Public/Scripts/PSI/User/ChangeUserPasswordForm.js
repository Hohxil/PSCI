/**
 * 修改用户密码
 * 
 * @author 艾格林门信息服务（大连）有限公司
 * @copyright 2015 - present
 * @license GPL v3
 */
PCL.define("PSI.User.ChangeUserPasswordForm", {
  extend: "PSI.AFX.Form.EditForm",

  /**
   * 初始化组件
   * 
   * @override
   */
  initComponent() {
    const me = this;
    const entity = me.getEntity();

    const t = "修改用户登录密码";
    const f = "edit-form-password.png";
    const logoHtml = `
      <img style='float:left;margin:0px 20px 0px 10px;width:48px;height:48px;' 
        src='${PSI.Const.BASE_URL}Public/Images/${f}'></img>
      <h2 style='color:#196d83;margin-top:0px;'>${t}</h2>
      <p style='color:#196d83'>标记
        <span style='color:red;font-weight:bold'>*</span>的是必须录入数据的字段
      </p>
      <div style='margin:0px;border-bottom:1px solid #e6f7ff;height:1px' /></div>
      `;

    const width1 = 600;
    const width2 = 295;
    PCL.apply(me, {
      header: {
        title: me.formatTitle(PSI.Const.PROD_NAME),
        height: 40
      },
      width: 650,
      height: 320,
      layout: "border",
      items: [{
        region: "north",
        border: 0,
        height: 70,
        html: logoHtml
      }, {
        region: "center",
        border: 0,
        id: "PSI_User_ChangeUserPasswordForm_editForm",
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
          width: width2,
        },
        items: [{
          xtype: "hidden",
          name: "id",
          value: entity.id
        }, {
          fieldLabel: "登录名",
          value: `<span class='PSI-field-note'>${entity.loginName}</span>`,
          xtype: "displayfield"
        }, {
          fieldLabel: "姓名",
          value: `<span class='PSI-field-note'>${entity.name}</span>`,
          xtype: "displayfield"
        }, {
          id: "PSI_User_ChangeUserPasswordForm_editPassword",
          fieldLabel: "密码",
          allowBlank: false,
          blankText: "没有输入密码",
          beforeLabelTextTpl: PSI.Const.REQUIRED,
          inputType: "password",
          name: "password",
          listeners: {
            specialkey: {
              fn: me.__onEditSpecialKey,
              scope: me
            }
          },
          colspan: 2,
          width: width1,
        }, {
          id: "PSI_User_ChangeUserPasswordForm_editConfirmPassword",
          fieldLabel: "确认密码",
          allowBlank: false,
          blankText: "没有输入确认密码",
          beforeLabelTextTpl: PSI.Const.REQUIRED,
          inputType: "password",
          listeners: {
            specialkey: {
              fn: me._onLastEditSpecialKey,
              scope: me
            }
          },
          colspan: 2,
          width: width1,
        }],
        buttons: [{
          text: "确定",
          formBind: true,
          iconCls: "PSI-button-ok",
          handler: me._onOK,
          scope: me
        }, {
          text: "取消",
          handler() {
            me.close();
          },
          scope: me
        }]
      }],
      listeners: {
        show: {
          fn: me._onEditFormShow,
          scope: me
        },
        close: {
          fn: me._onWndClose,
          scope: me
        }
      }
    });

    me.callParent(arguments);

    me.editPassword = PCL.getCmp("PSI_User_ChangeUserPasswordForm_editPassword");
    me.editConfirmPassword = PCL.getCmp("PSI_User_ChangeUserPasswordForm_editConfirmPassword");
    me.editForm = PCL.getCmp("PSI_User_ChangeUserPasswordForm_editForm");

    me.__editorList = [me.editPassword, me.editConfirmPassword];
  },

  /**
   * @private
   */
  _onEditFormShow() {
    const me = this;
    me.setFocusAndCursorPosToLast(me.editPassword);

    PCL.get(window).on('beforeunload', me.__onWindowBeforeUnload);
  },

  /**
   * @private
   */
  _onWndClose() {
    const me = this;

    PCL.get(window).un('beforeunload', me.__onWindowBeforeUnload);
  },

  /**
   * 修改密码
   * 
   * @private
   */
  _onOK() {
    const me = this;
    const pass = me.editPassword.getValue();
    const pass2 = me.editConfirmPassword.getValue();
    if (pass != pass2) {
      me.showInfo("输入的密码和确认密码不一致，请重新输入", () => {
        me.editPassword.focus();
      });

      return;
    }

    const f = me.editForm;
    const el = f.getEl();
    el.mask("数据保存中...");
    f.submit({
      url: me.URL("Home/User/changePassword"),
      method: "POST",
      success(form, action) {
        el.unmask();
        me.tip("成功修改密码", true);
        me.close();
      },
      failure(form, action) {
        el.unmask();
        me.showInfo(action.result.msg, () => {
          me.editPassword.focus();
        });
      }
    });
  },

  /**
   * @private
   */
  _onLastEditSpecialKey(field, e) {
    const me = this;

    if (e.getKey() == e.ENTER) {
      if (me.editForm.getForm().isValid()) {
        me._onOK();
      }
    }
  }
});
