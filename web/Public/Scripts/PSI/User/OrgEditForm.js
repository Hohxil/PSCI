/**
 * 新增或编辑组织机构
 * 
 * @author 艾格林门信息服务（大连）有限公司
 * @copyright 2015 - present
 * @license GPL v3
 */
PCL.define("PSI.User.OrgEditForm", {
  extend: "PSI.AFX.Form.EditForm",

  /**
   * 初始化组件
   * 
   * @override
   */
  initComponent() {
    const me = this;
    const entity = me.getEntity();

    const t = entity == null ? "新建组织机构" : "编辑组织机构";

    const logoHtml = me.genLogoHtml(entity, t);
    const width1 = 600;
    const width2 = 295;
    PCL.apply(me, {
      header: {
        title: me.formatTitle(PSI.Const.PROD_NAME),
        height: 40
      },
      width: 650,
      height: 360,
      layout: "border",
      items: [{
        region: "north",
        border: 0,
        height: 70,
        html: logoHtml
      }, {
        region: "center",
        border: 0,
        id: "PSI_User_OrgEditForm_editForm",
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
          id: "PSI_User_OrgEditForm_editOrgCode",
          fieldLabel: "编码",
          allowBlank: false,
          blankText: "没有输入编码",
          beforeLabelTextTpl: PSI.Const.REQUIRED,
          name: "orgCode",
          value: entity === null ? null : entity.get("orgCode"),
          listeners: {
            specialkey: {
              fn: me.__onEditSpecialKey,
              scope: me
            }
          },
          width: width2
        }, {
          id: "PSI_User_OrgEditForm_editName",
          fieldLabel: "名称",
          allowBlank: false,
          blankText: "没有输入名称",
          beforeLabelTextTpl: PSI.Const.REQUIRED,
          name: "name",
          value: entity === null ? null : entity.get("text"),
          listeners: {
            specialkey: {
              fn: me.__onEditSpecialKey,
              scope: me
            }
          },
          width: width2
        }, {
          id: "PSI_User_OrgEditForm_editParentOrg",
          xtype: "PSI_parent_org_editor",
          parentItem: me,
          fieldLabel: "上级组织",
          listeners: {
            specialkey: {
              fn: me.__onEditSpecialKey,
              scope: me
            }
          },
          width: width1,
          colspan: 2,
        }, {
          id: "PSI_User_OrgEditForm_editParentOrgId",
          xtype: "hidden",
          name: "parentId",
          value: entity === null ? null : entity.get("parentId")
        }, {
          id: "PSI_User_OrgEditForm_editOrgTypeId",
          xtype: "hidden",
          name: "orgType",
          value: 0,
        }, {
          id: "PSI_User_OrgEditForm_editOrgType",
          xtype: "psi_sysdictfield",
          tableName: "t_sysdict_sln0000_org_type",
          callbackFunc: me._orgTypeCallback,
          callbackScope: me,
          fieldLabel: "性质",
          width: width1,
          colspan: 2,
          listeners: {
            specialkey: {
              fn: me._onLastEditSpecialKey,
              scope: me
            }
          }
        }, {
          xtype: "displayfield",
          fieldLabel: "说明",
          colspan: 2,
          value: "<span class='PSI-field-note'>上级组织机构为空的时候，该组织机构是公司</span>"
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
            const info = !me.getEntity() ? "新建组织机构" : "编辑组织机构";
            me.confirm(`请确认是否取消：${info} ?`, () => {
              me.close();
            });
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

    me.editParentOrg = PCL.getCmp("PSI_User_OrgEditForm_editParentOrg");
    me.editParentOrgId = PCL.getCmp("PSI_User_OrgEditForm_editParentOrgId");
    me.editName = PCL.getCmp("PSI_User_OrgEditForm_editName");
    me.editOrgCode = PCL.getCmp("PSI_User_OrgEditForm_editOrgCode");
    me.editOrgType = PCL.getCmp("PSI_User_OrgEditForm_editOrgType");
    me.editOrgTypeId = PCL.getCmp("PSI_User_OrgEditForm_editOrgTypeId");

    me.editForm = PCL.getCmp("PSI_User_OrgEditForm_editForm");

    me.__editorList = [me.editOrgCode, me.editName, me.editParentOrg, me.editOrgType];
  },

  /**
   * @private
   */
  _onWndClose() {
    const me = this;

    PCL.WindowManager.hideAll();

    PCL.get(window).un('beforeunload', me.__onWindowBeforeUnload);
  },

  /**
   * @private
   */
  _onEditFormShow() {
    const me = this;

    PCL.get(window).on('beforeunload', me.__onWindowBeforeUnload);

    me.setFocusAndCursorPosToLast(me.editOrgCode);

    const entity = me.getEntity();
    if (entity === null) {
      return;
    }
    const el = me.getEl() || PCL.getBody();
    el.mask("数据加载中...");
    me.ajax({
      url: me.URL("Home/User/orgParentName"),
      params: {
        id: entity.get("id")
      },
      callback(options, success, response) {
        el.unmask();
        if (success) {
          const { parentOrgName, parentOrgId, name, orgCode, orgType, orgTypeId }
            = me.decodeJSON(response.responseText);
          me.editParentOrg.setValue(parentOrgName);
          me.editParentOrgId.setValue(parentOrgId);
          me.editName.setValue(name);
          me.editOrgCode.setValue(orgCode);
          me.editOrgType.setValue(orgType);
          me.editOrgType.setIdValue(orgTypeId);
          me.editOrgTypeId.setValue(orgTypeId);
        }
      }
    });
  },

  /**
   * PSI_parent_org_editor字段在选则组织机构后，回调本方法
   * 
   * @private
   */
  setParentOrg(data) {
    const me = this;
    me.editParentOrg.setValue(data.fullName);
    me.editParentOrgId.setValue(data.id);
  },

  /**
   * @private
   */
  _onOK() {
    const me = this;
    const f = me.editForm;
    const el = f.getEl();
    el.mask("数据保存中...");
    f.submit({
      url: me.URL("Home/User/editOrg"),
      method: "POST",
      success(form, action) {
        el.unmask();
        me.close();
        const parentForm = me.getParentForm();
        parentForm && parentForm.freshOrgGrid.apply(parentForm);
      },
      failure(form, action) {
        el.unmask();
        me.showInfo(action.result.msg, () => {
          me.editName.focus();
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
  },

  /**
   * 组织机构性质自定义字段回调本方法
   * @private
   */
  _orgTypeCallback(data, scope) {
    const me = scope;

    let orgTypeId = data ? data.get("id") : null;
    if (!orgTypeId) {
      orgTypeId = 0;
    }
    me.editOrgTypeId.setValue(orgTypeId);
  }
});
