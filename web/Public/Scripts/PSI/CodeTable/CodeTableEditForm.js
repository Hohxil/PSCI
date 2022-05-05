/**
 * 码表设置 - 新建或编辑码表元数据界面
 * 
 * @author 艾格林门信息服务（大连）有限公司
 * @copyright 2015 - present
 * @license GPL v3
 */
PCL.define("PSI.CodeTable.CodeTableEditForm", {
  extend: "PSI.AFX.Form.EditForm",

  config: {
    category: null,
    slnCode: "",
    slnName: "",
  },

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
        const info = entity == null ? "新建码表" : "编辑码表";

        me.confirm(`请确认是否取消：${info}?`, () => {
          me.close();
        });
      },
      scope: me
    });

    const t = entity == null ? "新建码表" : "编辑码表";
    const logoHtml = me.genLogoHtml(entity, t);

    const width1 = 600;
    const width2 = 300;
    PCL.apply(me, {
      header: {
        title: me.formatTitle(PSI.Const.PROD_NAME),
        height: 40
      },
      width: 650,
      height: 500,
      layout: "border",
      items: [{
        region: "north",
        border: 0,
        height: 70,
        html: logoHtml
      }, {
        region: "center",
        border: 0,
        id: "PSI_CodeTable_CodeTableEditForm_editForm",
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
          labelWidth: 85,
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
          value: me.getSlnCode(),
        }, {
          id: "PSI_CodeTable_CodeTableEditForm_editCategoryId",
          xtype: "hidden",
          name: "categoryId"
        }, {
          xtype: "displayfield",
          fieldLabel: "解决方案",
          value: `<span class='PSI-field-note'>${me.getSlnName()}</span>`,
          colspan: 2,
          width: width1,
        }, {
          id: "PSI_CodeTable_CodeTableEditForm_editCategory",
          xtype: "psi_codetablecategoryfield",
          fieldLabel: "分类",
          allowBlank: false,
          blankText: "没有输入码表分类",
          beforeLabelTextTpl: PSI.Const.REQUIRED,
          valueField: "id",
          displayField: "name",
          slnCode: me.getSlnCode(),
          listeners: {
            specialkey: {
              fn: me.__onEditSpecialKey,
              scope: me
            }
          },
          width: width2,
        }, {
          id: "PSI_CodeTable_CodeTableEditForm_editCode",
          fieldLabel: "编码",
          name: "code",
          allowBlank: false,
          blankText: "没有输入码表编码",
          beforeLabelTextTpl: PSI.Const.REQUIRED,
          listeners: {
            specialkey: {
              fn: me.__onEditSpecialKey,
              scope: me
            }
          },
          width: width2,
        }, {
          id: "PSI_CodeTable_CodeTableEditForm_editName",
          fieldLabel: "码表名称",
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
          width: width2,
        }, {
          id: "PSI_CodeTable_CodeTableEditForm_editModuleName",
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
          width: width2,
        }, {
          id: "PSI_CodeTable_CodeTableEditForm_editTableName",
          fieldLabel: "数据库表名",
          xtype: me.adding ? "textfield" : "displayfield",
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
          id: "PSI_CodeTable_CodeTableEditForm_hiddenEnableParentId",
          xtype: "hidden",
          value: 0,
          name: "enableParentId",
        }, {
          id: "PSI_CodeTable_CodeTableEditForm_editEnableParentId",
          fieldLabel: "层级数据",
          xtype: me.adding ? "psi_sysdictfield" : "displayfield",
          beforeLabelTextTpl: PSI.Const.REQUIRED,
          tableName: "t_sysdict_sln0000_ct_tree_view",
          callbackFunc: me._parentIdCallback,
          callbackScope: me,
          value: "否",
          width: width2,
          allowBlank: false,
          blankText: "没有选择是否是层级数据",
          listeners: {
            specialkey: {
              fn: me.__onEditSpecialKey,
              scope: me
            }
          },
        }, {
          id: "PSI_CodeTable_CodeTableEditForm_editEditColCnt",
          fieldLabel: "编辑布局列数",
          allowBlank: false,
          blankText: "没有输入编辑布局列数",
          beforeLabelTextTpl: PSI.Const.REQUIRED,
          xtype: "numberfield",
          hideTrigger: true,
          allowDecimal: false,
          minValue: 1,
          name: "editColCnt",
          value: entity == null ? 1 : entity.get("editColCnt"),
          listeners: {
            specialkey: {
              fn: me.__onEditSpecialKey,
              scope: me
            }
          },
          width: width2,
        }, {
          id: "PSI_CodeTable_CodeTableEditForm_hiddenViewPaging",
          xtype: "hidden",
          value: "2",
          name: "viewPaging",
        }, {
          id: "PSI_CodeTable_CodeTableEditForm_editViewPaging",
          xtype: "psi_sysdictfield",
          tableName: "t_sysdict_sln0000_ct_view_paging",
          callbackFunc: me._viewPagingCallback,
          callbackScope: me,
          fieldLabel: "视图分页",
          beforeLabelTextTpl: PSI.Const.REQUIRED,
          allowBlank: false,
          blankText: "没有选择视图是否需要分页",
          value: "不分页",
          width: width2,
          listeners: {
            specialkey: {
              fn: me.__onEditSpecialKey,
              scope: me
            }
          },
        }, {
          id: "PSI_CodeTable_CodeTableEditForm_editAutoCodeLength",
          fieldLabel: "自动编码长度",
          allowBlank: false,
          blankText: "没有输入自动编码长度",
          beforeLabelTextTpl: PSI.Const.REQUIRED,
          xtype: "numberfield",
          hideTrigger: true,
          allowDecimal: false,
          minValue: 0,
          maxValue: 20,
          name: "autoCodeLength",
          value: entity == null ? 0 : entity.get("autoCodeLength"),
          listeners: {
            specialkey: {
              fn: me.__onEditSpecialKey,
              scope: me
            }
          },
          width: width2,
        }, {
          id: "PSI_CodeTable_CodeTableEditForm_editHandlerClassName",
          fieldLabel: "业务逻辑类名",
          name: "handlerClassName",
          value: entity == null ? null : entity
            .get("handlerClassName"),
          listeners: {
            specialkey: {
              fn: me.__onEditSpecialKey,
              scope: me
            }
          },
          width: width1,
          colspan: 2
        }, {
          id: "PSI_CodeTable_CodeTableEditForm_hiddenInputCompany",
          xtype: "hidden",
          value: "1",
          name: "inputCompany",
        }, {
          id: "PSI_CodeTable_CodeTableEditForm_editInputCompany",
          xtype: "psi_sysdictfield",
          tableName: "t_sysdict_sln0000_ct_input_company",
          callbackFunc: me._inputCompanyCallback,
          callbackScope: me,
          fieldLabel: "多公司录入",
          beforeLabelTextTpl: PSI.Const.REQUIRED,
          allowBlank: false,
          blankText: "没有选择码表记录是否需要多公司录入",
          value: "不启用多公司录入",
          width: width2,
          listeners: {
            specialkey: {
              fn: me.__onEditSpecialKey,
              scope: me
            }
          },
          colspan: 2,
        }, {
          id: "PSI_CodeTable_CodeTableEditForm_editMemo",
          fieldLabel: "备注",
          name: "memo",
          value: entity == null ? null : entity.get("note"),
          listeners: {
            specialkey: {
              fn: me._onEditLastSpecialKey,
              scope: me
            }
          },
          width: width1,
          colspan: 2
        }],
        buttons
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

    me.editForm = PCL.getCmp("PSI_CodeTable_CodeTableEditForm_editForm");

    me.editCategoryId = PCL.getCmp("PSI_CodeTable_CodeTableEditForm_editCategoryId");
    me.editCategory = PCL.getCmp("PSI_CodeTable_CodeTableEditForm_editCategory");
    me.editCode = PCL.getCmp("PSI_CodeTable_CodeTableEditForm_editCode");
    me.editName = PCL.getCmp("PSI_CodeTable_CodeTableEditForm_editName");
    me.editModuleName = PCL.getCmp("PSI_CodeTable_CodeTableEditForm_editModuleName");
    me.editTableName = PCL.getCmp("PSI_CodeTable_CodeTableEditForm_editTableName");
    me.hiddenEnableParentId = PCL.getCmp("PSI_CodeTable_CodeTableEditForm_hiddenEnableParentId");
    me.editEnableParentId = PCL.getCmp("PSI_CodeTable_CodeTableEditForm_editEnableParentId");
    me.editEditColCnt = PCL.getCmp("PSI_CodeTable_CodeTableEditForm_editEditColCnt");
    me.editAutoCodeLength = PCL.getCmp("PSI_CodeTable_CodeTableEditForm_editAutoCodeLength");
    me.editHandlerClassName = PCL.getCmp("PSI_CodeTable_CodeTableEditForm_editHandlerClassName");
    me.editMemo = PCL.getCmp("PSI_CodeTable_CodeTableEditForm_editMemo");
    me.hiddenViewPaging = PCL.getCmp("PSI_CodeTable_CodeTableEditForm_hiddenViewPaging");
    me.editViewPaging = PCL.getCmp("PSI_CodeTable_CodeTableEditForm_editViewPaging");
    me.hiddenInputCompany = PCL.getCmp("PSI_CodeTable_CodeTableEditForm_hiddenInputCompany");
    me.editInputCompany = PCL.getCmp("PSI_CodeTable_CodeTableEditForm_editInputCompany");

    const list = [me.editCategory, me.editCode, me.editName, me.editModuleName];
    if (me.adding) {
      list.push(me.editTableName);
      list.push(me.editEnableParentId);
    }
    list.push(me.editEditColCnt, me.editViewPaging, me.editAutoCodeLength,
      me.editHandlerClassName, me.editInputCompany, me.editMemo);

    me.__editorList = list;

    const c = me.getCategory();
    if (c) {
      me.editCategory.setIdValue(c.get("id"));
      me.editCategory.setValue(c.get("name"));
    }
  },

  _onWndShow() {
    const me = this;

    PCL.get(window).on('beforeunload', me.__onWindowBeforeUnload);

    if (me.adding) {
      // 新建
      me.editTableName.setValue(`t_${me.getSlnCode()}_ct_`.toLocaleLowerCase());
    } else {
      // 编辑
      const el = me.getEl();
      el && el.mask(PSI.Const.LOADING);
      me.ajax({
        url: me.URL("Home/CodeTable/codeTableInfo"),
        params: {
          id: me.getEntity().get("id")
        },
        callback(options, success, response) {
          if (success) {
            const data = me.decodeJSON(response.responseText);
            me.editCategory.setIdValue(data.categoryId);
            me.editCategory.setValue(data.categoryName);
            me.editCode.setValue(data.code);
            me.editName.setValue(data.name);
            me.editModuleName.setValue(data.moduleName);
            me.editTableName.setValue(`<span class='PSI-field-note'>${data.tableName}</span>`);
            // 当编辑的时候，me.editEnableParentId是个displayfield
            me.editEnableParentId.setValue(`<span class='PSI-field-note'>${data.enableParentName}</span>`);
            me.editEditColCnt.setValue(data.editColCnt);
            me.editAutoCodeLength.setValue(data.autoCodeLength);
            me.editHandlerClassName.setValue(data.handlerClassName);
            me.editMemo.setValue(data.memo);
            me.hiddenViewPaging.setValue(data.viewPaging);
            me.editViewPaging.setValue(data.viewPagingDisplay);
            me.hiddenInputCompany.setValue(data.inputCompany);
            me.editInputCompany.setValue(data.inputCompanyDisplay);
          }

          el && el.unmask();
        }
      });
    }

    me.setFocusAndCursorPosToLast(me.editCode);
  },

  _onOK() {
    const me = this;

    me.editCategoryId.setValue(me.editCategory.getIdValue());

    const f = me.editForm;
    const el = f.getEl();
    el && el.mask(PSI.Const.SAVING);
    f.submit({
      url: me.URL("Home/CodeTable/editCodeTable"),
      method: "POST",
      success(form, action) {
        el && el.unmask();
        me.tip("数据保存成功", true);
        me.__lastId = action.result.id;
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

  _onEditLastSpecialKey(field, e) {
    const me = this;

    if (e.getKey() === e.ENTER) {
      const f = me.editForm;
      if (f.getForm().isValid()) {
        me._onOK();
      }
    }
  },

  _onWndClose() {
    const me = this;

    PCL.get(window).un('beforeunload', me.__onWindowBeforeUnload);

    if (me.__lastId) {
      const parentForm = me.getParentForm();
      if (parentForm) {
        parentForm.refreshMainGrid.apply(parentForm, [me.__lastId]);
      }
    }
  },

  /**
   * 层级数据 字段回调本方法
   * @private
   */
  _parentIdCallback(data, scope) {
    const me = scope;

    let id = data ? data.get("id") : null;
    if (!id) {
      id = 0;
    }
    me.hiddenEnableParentId.setValue(id);
  },

  /**
   * 视图分页 字段回调本方法
   * @private
   */
  _viewPagingCallback(data, scope) {
    const me = scope;

    let id = data ? data.get("id") : null;
    if (!id) {
      id = "2"; // 不分页
    }
    me.hiddenViewPaging.setValue(id);
  },

  /**
   * 多公司录入 字段回调本方法
   * @private
   */
  _inputCompanyCallback(data, scope) {
    const me = scope;

    let id = data ? data.get("id") : null;
    if (!id) {
      id = "1"; // 不启用多公司录入
    }
    me.hiddenInputCompany.setValue(id);
  },
});
