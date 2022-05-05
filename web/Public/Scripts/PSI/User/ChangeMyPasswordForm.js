/**
 * 修改我的密码
 * 
 * @author 艾格林门信息服务（大连）有限公司
 * @copyright 2015 - present
 * @license GPL v3
 */
PCL.define("PSI.User.ChangeMyPasswordForm", {
  extend: "PCL.panel.Panel",

  config: {
    loginUserId: null,
    loginUserName: null,
    loginUserFullName: null
  },

  border: 0,
  layout: "border",

  /**
   * 初始化组件
   * 
   * @override
   */
  initComponent() {
    const me = this;
    const user = {
      id: me.getLoginUserId(),
      loginName: me.getLoginUserName(),
      name: me.getLoginUserFullName()
    };

    PCL.apply(me, {
      items: [{
        region: "center",
        xtype: "panel",
        layout: "absolute",
        border: 0,
        items: [{
          id: "PSI_User_ChangeMyPasswordForm_editForm",
          x: 200,
          y: 50,
          xtype: "form",
          layout: {
            type: "table",
            columns: 1,
            tableAttrs: PSI.Const.TABLE_LAYOUT,
          },
          height: 250,
          width: 320,
          defaultType: 'textfield',
          border: 0,
          fieldDefaults: {
            labelWidth: 60,
            labelAlign: "right",
            labelSeparator: "",
            msgTarget: 'side',
            width: 300
          },
          items: [{
            xtype: "hidden",
            name: "userId",
            value: user.id
          }, {
            fieldLabel: "登录名",
            xtype: "displayfield",
            value: `<span class='PSI-field-note'>${user.loginName}</span>`
          }, {
            fieldLabel: "用户名",
            xtype: "displayfield",
            value: `<span class='PSI-field-note'>${user.name}</span>`
          }, {
            id: "PSI_User_ChangeMyPasswordForm_editOldPassword",
            fieldLabel: "旧密码",
            allowBlank: false,
            blankText: "没有输入旧密码",
            beforeLabelTextTpl: PSI.Const.REQUIRED,
            inputType: "password",
            name: "oldPassword",
            listeners: {
              specialkey: {
                fn: me._onEditOldPasswordSpecialKey,
                scope: me
              }
            }
          }, {
            id: "PSI_User_ChangeMyPasswordForm_editNewPassword",
            fieldLabel: "新密码",
            allowBlank: false,
            blankText: "没有输入新密码",
            beforeLabelTextTpl: PSI.Const.REQUIRED,
            inputType: "password",
            name: "newPassword",
            listeners: {
              specialkey: {
                fn: me._onEditNewPasswordSpecialKey,
                scope: me
              }
            }
          }, {
            id: "PSI_User_ChangeMyPasswordForm_editConfirmPassword",
            fieldLabel: "确认密码",
            allowBlank: false,
            blankText: "没有输入确认密码",
            beforeLabelTextTpl: PSI.Const.REQUIRED,
            inputType: "password",
            listeners: {
              specialkey: {
                fn: me._onEditConfirmPasswordSpecialKey,
                scope: me
              }
            }
          }],
          buttons: [{
            id: "PSI_User_ChangeMyPasswordForm_buttonOK",
            text: "修改密码",
            formBind: true,
            handler: me._onOK,
            scope: me,
            iconCls: "PSI-button-ok"
          }, {
            text: "取消",
            handler() {
              me.closeWindow();
            }
          }]
        }]
      }]
    });

    me.callParent(arguments);

    me.editNewPassword = PCL.getCmp("PSI_User_ChangeMyPasswordForm_editNewPassword");
    me.editConfirmPassword = PCL.getCmp("PSI_User_ChangeMyPasswordForm_editConfirmPassword");
    me.editForm = PCL.getCmp("PSI_User_ChangeMyPasswordForm_editForm");
    me.buttonOK = PCL.getCmp("PSI_User_ChangeMyPasswordForm_buttonOK");
  },

  /**
   * 修改密码
   * 
   * @private
   */
  _onOK() {
    const me = this;

    const editNewPassword = me.editNewPassword;
    const editConfirmPassword = me.editConfirmPassword;

    const np = editNewPassword.getValue();
    const cp = editConfirmPassword.getValue();

    if (np != cp) {
      PSI.MsgBox.showInfo("确认密码与新密码不一致", () => {
        editNewPassword.focus();
      });
      return;
    }

    const form = me.editForm;
    const el = PCL.getBody();
    el.mask("数据保存中...");
    form.submit({
      url: PSI.Const.BASE_URL + "Home/User/changeMyPasswordPOST",
      method: "POST",
      success(form, action) {
        el.unmask();
        PSI.MsgBox.showInfo("成功修改登录密码", () => {
          me.closeWindow();
        });
      },
      failure(form, action) {
        el.unmask();
        PSI.MsgBox.showInfo(action.result.msg);
      }
    });
  },

  /**
   * @private
   */
  _onEditOldPasswordSpecialKey(field, e) {
    const me = this;

    if (e.getKey() == e.ENTER) {
      me.editNewPassword.focus();
    }
  },

  /**
   * @private
   */
  _onEditNewPasswordSpecialKey(field, e) {
    const me = this;

    if (e.getKey() == e.ENTER) {
      me.editConfirmPassword.focus();
    }
  },

  /**
   * @private
   */
  _onEditConfirmPasswordSpecialKey(field, e) {
    const me = this;

    if (e.getKey() == e.ENTER) {
      me.buttonOK.focus();
    }
  },

  /**
   * @private
   */
  closeWindow() {
    if (PSI.Const.MOT == "0") {
      window.location.replace(PSI.Const.BASE_URL);
    } else {
      window.close();

      if (!window.closed) {
        window.location.replace(PSI.Const.BASE_URL);
      }
    }
  }
});
