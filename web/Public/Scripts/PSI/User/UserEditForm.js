/**
 * 新增或编辑用户界面
 * 
 * @author 艾格林门信息服务（大连）有限公司
 * @copyright 2015 - present
 * @license GPL v3
 */
Ext.define("PSI.User.UserEditForm", {
  extend: "PSI.AFX.Form.EditForm",

  config: {
    defaultOrg: null
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

    const t = entity == null ? "新建用户" : "编辑用户";
    const logoHtml = me.genLogoHtml(entity, t);

    const width1 = 600;
    const width2 = 300;
    Ext.apply(me, {
      header: {
        title: me.formatTitle(PSI.Const.PROD_NAME),
        height: 40
      },
      modal: true,
      onEsc: Ext.emptyFn,
      width: 650,
      height: me.adding ? 500 : 470,
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
          labelWidth: 60,
          labelAlign: "right",
          labelSeparator: "",
          msgTarget: 'side'
        },
        items: [{
          xtype: "hidden",
          name: "id",
          value: entity === null ? null : entity.get("id")
        }, {
          id: "editLoginName",
          fieldLabel: "登录名",
          allowBlank: false,
          blankText: "没有输入登录名",
          beforeLabelTextTpl: PSI.Const.REQUIRED,
          name: "loginName",
          colspan: 2,
          width: width1,
          listeners: {
            specialkey: {
              fn: me.__onEditSpecialKey,
              scope: me
            }
          }
        }, {
          id: "editName",
          fieldLabel: "姓名",
          width: width2,
          allowBlank: false,
          blankText: "没有输入姓名",
          beforeLabelTextTpl: PSI.Const.REQUIRED,
          name: "name",
          listeners: {
            specialkey: {
              fn: me.__onEditSpecialKey,
              scope: me
            }
          }
        }, {
          id: "editOrgCode",
          fieldLabel: "编码",
          width: width2,
          allowBlank: false,
          blankText: "没有输入编码",
          beforeLabelTextTpl: PSI.Const.REQUIRED,
          name: "orgCode",
          listeners: {
            specialkey: {
              fn: me.__onEditSpecialKey,
              scope: me
            }
          },
          colspan: 1
        }, {
          id: "editOrgName",
          xtype: "PSI_org_editor",
          fieldLabel: "所属组织",
          allowBlank: false,
          blankText: "没有选择组织机构",
          beforeLabelTextTpl: PSI.Const.REQUIRED,
          parentItem: me,
          listeners: {
            specialkey: {
              fn: me.__onEditSpecialKey,
              scope: me
            }
          },
          colspan: 2,
          width: width1
        }, {
          id: "editOrgId",
          xtype: "hidden",
          name: "orgId",
        }, {
          id: "editBirthday",
          fieldLabel: "生日",
          width: width2,
          xtype: "datefield",
          format: "Y-m-d",
          name: "birthday",
          listeners: {
            specialkey: {
              fn: me.__onEditSpecialKey,
              scope: me
            }
          }
        }, {
          id: "editIdCardNumber",
          fieldLabel: "身份证号",
          width: width2,
          name: "idCardNumber",
          listeners: {
            specialkey: {
              fn: me.__onEditSpecialKey,
              scope: me
            }
          }
        }, {
          id: "editTel",
          fieldLabel: "联系电话",
          width: width2,
          name: "tel",
          listeners: {
            specialkey: {
              fn: me.__onEditSpecialKey,
              scope: me
            }
          }
        }, {
          id: "editTel02",
          fieldLabel: "备用电话",
          width: width2,
          name: "tel02",
          listeners: {
            specialkey: {
              fn: me.__onEditSpecialKey,
              scope: me
            }
          }
        }, {
          id: "editAddress",
          fieldLabel: "家庭住址",
          name: "address",
          listeners: {
            specialkey: {
              fn: me.__onEditSpecialKey,
              scope: me
            }
          },
          colspan: 2,
          width: width1
        }, {
          id: "editGenderId",
          xtype: "hidden",
          name: "gender",
          value: 0,
        }, {
          fieldLabel: "性别",
          xtype: "psi_sysdictfield",
          tableName: "t_sysdict_sln0000_gender",
          callbackFunc: me._genderCallback,
          callbackScope: me,
          id: "editGender",
          width: width2,
          listeners: {
            specialkey: {
              fn: me.__onEditSpecialKey,
              scope: me
            }
          },
        }, {
          id: "editEnabledId",
          xtype: "hidden",
          name: "enabled",
          value: 1,
        }, {
          xtype: "psi_sysdictfield",
          tableName: "t_sysdict_sln0000_user_enabled",
          callbackFunc: me._enabledCallback,
          callbackScope: me,
          fieldLabel: "能否登录",
          id: "editEnabled",
          width: width2,
          allowBlank: false,
          blankText: "没有选择是否允许登录",
          beforeLabelTextTpl: PSI.Const.REQUIRED,
          value: "允许登录",
          listeners: {
            specialkey: {
              fn: me._onLastEditSpecialKey,
              scope: me
            }
          },
        }, {
          xtype: "displayfield",
          fieldLabel: "说明",
          colspan: 2,
          value: "<span class='PSI-field-note'>新用户的默认登录密码是 123456</span>",
          hidden: !me.adding
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
            const info = !me.getEntity() ? "新建用户" : "编辑用户";
            me.confirm(`请确认是否取消： ${info} ?`,
              () => {
                me.close();
              });
          },
          scope: me
        }]
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

    if (me.getDefaultOrg()) {
      const org = me.getDefaultOrg();
      me.setOrg({
        id: org.get("id"),
        fullName: org.get("fullName")
      });
    }

    me.editLoginName = Ext.getCmp("editLoginName");
    me.editName = Ext.getCmp("editName");
    me.editOrgCode = Ext.getCmp("editOrgCode");
    me.editOrgId = Ext.getCmp("editOrgId");
    me.editOrgName = Ext.getCmp("editOrgName");
    me.editBirthday = Ext.getCmp("editBirthday");
    me.editIdCardNumber = Ext.getCmp("editIdCardNumber");
    me.editTel = Ext.getCmp("editTel");
    me.editTel02 = Ext.getCmp("editTel02");
    me.editAddress = Ext.getCmp("editAddress");
    me.editGenderId = Ext.getCmp("editGenderId");
    me.editGender = Ext.getCmp("editGender");
    me.editEnabledId = Ext.getCmp("editEnabledId");
    me.editEnabled = Ext.getCmp("editEnabled");

    me.__editorList = [
      me.editLoginName, me.editName, me.editOrgCode,
      me.editOrgName, me.editBirthday, me.editIdCardNumber, me.editTel,
      me.editTel02, me.editAddress, me.editGender, me.editEnabled];
  },

  /**
   * @private
   */
  _onWndClose() {
    const me = this;

    PCL.WindowManager.hideAll();

    Ext.get(window).un('beforeunload', me.__onWindowBeforeUnload);
  },

  /**
   * @private
   */
  _onWndShow() {
    const me = this;

    Ext.get(window).on('beforeunload', me.__onWindowBeforeUnload);

    if (me.adding) {
      me.setFocusAndCursorPosToLast(me.editLoginName);
      return;
    }

    // 下面的业务逻辑是编辑用户

    const el = me.getEl();
    el.mask(PSI.Const.LOADING);
    me.ajax({
      url: me.URL("Home/User/userInfo"),
      params: {
        id: me.getEntity().get("id")
      },
      callback(options, success, response) {
        el.unmask();
        if (success) {

          const data = me.decodeJSON(response.responseText);

          me.editLoginName.setValue(data.loginName);

          const name = data.name;
          me.editName.setValue(name);
          me.setFocusAndCursorPosToLast(me.editName);

          me.editOrgCode.setValue(data.orgCode);
          me.editBirthday.setValue(data.birthday);
          me.editIdCardNumber.setValue(data.idCardNumber);
          me.editTel.setValue(data.tel);
          me.editTel02.setValue(data.tel02);
          me.editAddress.setValue(data.address);
          me.editGenderId.setValue(data.genderId);
          me.editGender.setValue(data.gender);
          me.editGender.setIdValue(data.genderId);
          me.editEnabledId.setValue(data.enabledId);
          me.editEnabled.setValue(data.enabled);
          me.editEnabled.setIdValue(data.enabledId);
          me.editOrgId.setValue(data.orgId);
          me.editOrgName.setValue(data.orgFullName);
        }
      }
    });
  },

  // xtype: "PSI_org_editor"回调本方法
  setOrg(data) {
    const editOrgName = Ext.getCmp("editOrgName");
    editOrgName.setValue(data.fullName);

    const editOrgId = Ext.getCmp("editOrgId");
    editOrgId.setValue(data.id);
  },

  /**
   * @private
   */
  _onOK() {
    const me = this;
    const f = Ext.getCmp("editForm");
    const el = f.getEl();
    el.mask("数据保存中...");
    f.submit({
      url: me.URL("Home/User/editUser"),
      method: "POST",
      success(form, action) {
        el.unmask();
        me.close();
        me.getParentForm().freshUserGrid();
        me.tip("数据保存成功", true);
      },
      failure(form, action) {
        el.unmask();
        me.showInfo(action.result.msg, () => {
          Ext.getCmp("editName").focus();
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
      const f = Ext.getCmp("editForm");
      if (f.getForm().isValid()) {
        me._onOK();
      }
    }
  },

  /**
   * 性别字段回调本方法
   * @private
   */
  _genderCallback(data, scope) {
    const me = scope;

    let id = data ? data.get("id") : null;
    if (!id) {
      id = 0;
    }
    me.editGenderId.setValue(id);
  },

  /**
   * 能否登录字段回调本方法
   * @private
   */
  _enabledCallback(data, scope) {
    const me = scope;

    let id = data ? data.get("id") : null;
    if (!id) {
      id = 0;
    }
    me.editEnabledId.setValue(id);
  },
});
