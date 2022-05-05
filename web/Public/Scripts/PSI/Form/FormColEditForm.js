/**
 * 表单列 - 新建或编辑界面
 * 
 * @author 艾格林门信息服务（大连）有限公司
 * @copyright 2015 - present
 * @license GPL v3
 */
Ext.define("PSI.Form.FormColEditForm", {
  extend: "PSI.AFX.Form.EditForm",

  config: {
    form: null
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
        const info = entity == null ? "新建表单主表列" : "编辑表单主表列";

        me.confirm(`请确认是否取消：${info}?`, () => {
          me.close();
        });
      },
      scope: me
    });

    const t = entity == null ? "新建表单主表列" : "编辑表单主表列";
    const logoHtml = me.genLogoHtml(entity, t);

    Ext.apply(me, {
      header: {
        title: me.formatTitle(PSI.Const.PROD_NAME),
        height: 40
      },
      width: 870,
      height: 430,
      layout: "border",
      items: [{
        region: "north",
        border: 0,
        height: 60,
        html: logoHtml
      }, {
        region: "center",
        border: 0,
        layout: "fit",
        items: [
          {
            xtype: "tabpanel",
            border: 0,
            items: [{
              title: "数据库结构",
              border: 0,
              layout: "fit",
              items:
              {
                border: 0,
                xtype: "form",
                layout: {
                  type: "table",
                  columns: 3,
                  tableAttrs: PSI.Const.TABLE_LAYOUT,
                },
                bodyStyle: "margin-top:10px",
                defaultType: 'textfield',
                fieldDefaults: {
                  labelWidth: 90,
                  labelAlign: "right",
                  labelSeparator: "",
                  msgTarget: 'side'
                },
                items: me.getDbStructCols()
              }
            }, {
              title: "取值",
              layout: "fit",
              border: 0,
              items: {
                border: 0,
                xtype: "form",
                layout: {
                  type: "table",
                  columns: 3,
                  tableAttrs: PSI.Const.TABLE_LAYOUT,
                },
                bodyStyle: "margin-top:10px",
                defaultType: 'textfield',
                fieldDefaults: {
                  labelWidth: 60,
                  labelAlign: "right",
                  labelSeparator: "",
                  msgTarget: 'side'
                },
                items: me.getValueCols()
              }
            },
            {
              title: "显示",
              border: 0,
              layout: "fit",
              items: {
                border: 0,
                xtype: "form",
                layout: {
                  type: "table",
                  columns: 3,
                  tableAttrs: PSI.Const.TABLE_LAYOUT,
                },
                bodyStyle: "margin-top:10px",
                defaultType: 'textfield',
                fieldDefaults: {
                  labelWidth: 100,
                  labelAlign: "right",
                  labelSeparator: "",
                  msgTarget: 'side'
                },
                items: me.getDisplayCols()
              }
            }]
          }
        ]
      }],
      buttons,
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

    me.editForm = Ext.getCmp("PSI_Form_FormColEditForm_editForm");

    me.editName = Ext.getCmp("PSI_Form_FormColEditForm_editName");
    me.editTableName = Ext.getCmp("PSI_Form_FormColEditForm_editTableName");
    me.editCaption = Ext.getCmp("PSI_Form_FormColEditForm_editCaption");
    me.editFieldName = Ext.getCmp("PSI_Form_FormColEditForm_editFieldName");
    me.editFieldType = Ext.getCmp("PSI_Form_FormColEditForm_editFieldType");
    me.editFieldLength = Ext.getCmp("PSI_Form_FormColEditForm_editFieldLength");
    me.editFieldDec = Ext.getCmp("PSI_Form_FormColEditForm_editFieldDec");
    me.editValueFrom = Ext.getCmp("PSI_Form_FormColEditForm_editValueFrom");
    me.editValueFromTableName = Ext.getCmp("PSI_Form_FormColEditForm_editValueFromTableName");
    me.editValueFromColName = Ext.getCmp("PSI_Form_FormColEditForm_editValueFromColName");
    me.editValueFromColNameDisplay = Ext.getCmp("PSI_Form_FormColEditForm_editValueFromColNameDisplay");
    me.editShowOrder = Ext.getCmp("PSI_Form_FormColEditForm_editShowOrder");
    me.editEditorXtype = Ext.getCmp("PSI_Form_FormColEditForm_editEditorXtype");
    me.editColSpan = Ext.getCmp("PSI_Form_FormColEditForm_editColSpan");
    me.editMemo = Ext.getCmp("PSI_Form_FormColEditForm_editMemo");
    me.editIsVisible = Ext.getCmp("PSI_Form_FormColEditForm_editIsVisible");
    me.editMustInput = Ext.getCmp("PSI_Form_FormColEditForm_editMustInput");
    me.editWidthInView = Ext.getCmp("PSI_Form_FormColEditForm_editWidthInView");
    me.editShowOrderInView = Ext.getCmp("PSI_Form_FormColEditForm_editShowOrderInView");

    me.__editorList = [
      me.editCaption, me.editFieldName, me.editShowOrder, me.editColSpan, me.editWidthInView,
      me.editShowOrderInView, me.editMemo
    ];
  },

  /**
   * 数据库结构相关的列
   * 
   * @private
   */
  getDbStructCols() {
    const me = this;

    const entity = me.getEntity();
    const col2Width = 550;
    const col3Width = 820;

    const list = [];
    list.push({
      xtype: "hidden",
      name: "id",
      value: entity == null ? null : entity.get("id")
    }, {
      xtype: "hidden",
      name: "formId",
      value: me.getForm().get("id")
    }, {
      id: "PSI_Form_FormColEditForm_editName",
      fieldLabel: "表单名称",
      xtype: "displayfield",
      value: `<span class='PSI-field-note'>${me.getForm().get("name")}</span>`
    }, {
      id: "PSI_Form_FormColEditForm_editTableName",
      fieldLabel: "数据库表名",
      xtype: "displayfield",
      colspan: 2,
      width: col2Width,
      value: `<span class='PSI-field-note'>${me.getForm().get("tableName")}</span>`
    }, {
      id: "PSI_Form_FormColEditForm_editCaption",
      fieldLabel: "列标题",
      allowBlank: false,
      blankText: "没有输入列标题",
      beforeLabelTextTpl: PSI.Const.REQUIRED,
      listeners: {
        specialkey: {
          fn: me._onEditSpecialKey,
          scope: me
        }
      },
      name: "caption"
    }, {
      id: "PSI_Form_FormColEditForm_editFieldName",
      fieldLabel: "列数据库名",
      allowBlank: false,
      blankText: "没有输入列数据库名",
      beforeLabelTextTpl: PSI.Const.REQUIRED,
      listeners: {
        specialkey: {
          fn: me._onEditSpecialKey,
          scope: me
        }
      },
      colspan: 2,
      width: col2Width,
      name: "fieldName"
    }, {
      id: "PSI_Form_FormColEditForm_editFieldType",
      xtype: "combo",
      queryMode: "local",
      editable: false,
      valueField: "id",
      labelAlign: "right",
      labelSeparator: "",
      fieldLabel: "列数据类型",
      allowBlank: false,
      blankText: "没有输入列数据类型",
      beforeLabelTextTpl: PSI.Const.REQUIRED,
      store: Ext.create("Ext.data.ArrayStore", {
        fields: ["id", "text"],
        data: [["varchar", "varchar"],
        ["int", "int"],
        ["decimal", "decimal"]]
      }),
      value: "varchar",
      name: "fieldType",
      listeners: {
        change: {
          fn: me._onFieldTypeChange,
          scope: me
        }
      }
    }, {
      id: "PSI_Form_FormColEditForm_editFieldLength",
      fieldLabel: "列数据长度",
      listeners: {
        specialkey: {
          fn: me._onEditSpecialKey,
          scope: me
        }
      },
      xtype: "numberfield",
      hideTrigger: true,
      allowDecimal: false,
      minValue: 0,
      value: 255,
      name: "fieldLength"
    }, {
      id: "PSI_Form_FormColEditForm_editFieldDec",
      fieldLabel: "列小数位数",
      listeners: {
        specialkey: {
          fn: me._onEditSpecialKey,
          scope: me
        }
      },
      xtype: "numberfield",
      hideTrigger: true,
      allowDecimal: false,
      minValue: 0,
      value: 0,
      name: "fieldDecimal",
      disabled: true
    }, {
      id: "PSI_Form_FormColEditForm_editIsVisible",
      xtype: "combo",
      queryMode: "local",
      editable: false,
      valueField: "id",
      labelAlign: "right",
      labelSeparator: "",
      fieldLabel: "对用户可见",
      allowBlank: false,
      blankText: "没有输入对用户可见",
      beforeLabelTextTpl: PSI.Const.REQUIRED,
      store: Ext.create("Ext.data.ArrayStore", {
        fields: ["id", "text"],
        data: [[1, "对用户可见"],
        [2, "对用户不可见"]]
      }),
      value: 1,
      name: "isVisible"
    }, {
      id: "PSI_Form_FormColEditForm_editMustInput",
      xtype: "combo",
      queryMode: "local",
      editable: false,
      valueField: "id",
      labelAlign: "right",
      labelSeparator: "",
      fieldLabel: "必须录入",
      allowBlank: false,
      blankText: "没有输入必须录入",
      beforeLabelTextTpl: PSI.Const.REQUIRED,
      store: Ext.create("Ext.data.ArrayStore", {
        fields: ["id", "text"],
        data: [[1, "非必须录入项"],
        [2, "必须录入"]]
      }),
      value: 1,
      name: "mustInput"
    }, {
      id: "PSI_Form_FormColEditForm_editShowOrder",
      fieldLabel: "编辑界面显示次序",
      allowBlank: false,
      blankText: "没有输入编辑界面显示次序",
      beforeLabelTextTpl: PSI.Const.REQUIRED,
      xtype: "numberfield",
      hideTrigger: true,
      allowDecimal: false,
      name: "showOrder",
      listeners: {
        specialkey: {
          fn: me._onEditSpecialKey,
          scope: me
        }
      }
    }, {
      id: "PSI_Form_FormColEditForm_editEditorXtype",
      xtype: "combo",
      queryMode: "local",
      editable: false,
      valueField: "id",
      labelAlign: "right",
      labelSeparator: "",
      fieldLabel: "编辑器类型",
      allowBlank: false,
      blankText: "没有输入编辑器类型",
      beforeLabelTextTpl: PSI.Const.REQUIRED,
      store: Ext.create("Ext.data.ArrayStore", {
        fields: ["id", "text"],
        data: []
      }),
      value: "textfield",
      name: "editorXtype",
      colspan: 2,
      width: col2Width
    }, {
      id: "PSI_Form_FormColEditForm_editColSpan",
      fieldLabel: "编辑器列占位",
      allowBlank: false,
      blankText: "没有输入编辑器列占位",
      beforeLabelTextTpl: PSI.Const.REQUIRED,
      xtype: "numberfield",
      hideTrigger: true,
      allowDecimal: false,
      value: 1,
      name: "colSpan",
      listeners: {
        specialkey: {
          fn: me._onEditSpecialKey,
          scope: me
        }
      }
    }, {
      id: "PSI_Form_FormColEditForm_editMemo",
      fieldLabel: "备注",
      name: "memo",
      value: entity == null ? null : entity.get("note"),
      listeners: {
        specialkey: {
          fn: me._onEditLastSpecialKey,
          scope: me
        }
      },
      width: col3Width,
      colspan: 3
    });

    return list;
  },

  /**
   * 取值相关的列
   * 
   * @private
   */
  getValueCols() {
    const me = this;

    const list = [{
      id: "PSI_Form_FormColEditForm_editValueFrom",
      xtype: "combo",
      queryMode: "local",
      editable: false,
      valueField: "id",
      labelAlign: "right",
      labelSeparator: "",
      fieldLabel: "值来源",
      allowBlank: false,
      blankText: "没有输入值来源",
      beforeLabelTextTpl: PSI.Const.REQUIRED,
      store: Ext.create("Ext.data.ArrayStore", {
        fields: ["id", "text"],
        data: [[1, "直接录入"],
        [2, "引用系统数据字典"],
        [3, "引用码表"],
        [5, "程序生成"]]
      }),
      value: 1,
      name: "valueFrom",
      listeners: {
        change: {
          fn: me._onValueFromChange,
          scope: me
        }
      },
      colspan: 3
    }, {
      id: "PSI_Form_FormColEditForm_editValueFromTableName",
      fieldLabel: "引用表名",
      disabled: true,
      name: "valueFromTableName"
    }, {
      id: "PSI_Form_FormColEditForm_editValueFromColName",
      fieldLabel: "引用列名(关联用)",
      disabled: true,
      name: "valueFromColName"
    }, {
      id: "PSI_Form_FormColEditForm_editValueFromColNameDisplay",
      fieldLabel: "引用列名(显示用)",
      disabled: true,
      name: "valueFromColNameDisplay"
    }];

    return list;
  },

  /**
   * 显示相关的列
   * 
   * @private
   */
  getDisplayCols() {
    const me = this;
    const entity = me.getEntity();

    const list = [{
      id: "PSI_Form_FormColEditForm_editWidthInView",
      fieldLabel: "列宽度",
      labelWidth: 60,
      allowBlank: false,
      blankText: "没有输入列宽度",
      beforeLabelTextTpl: PSI.Const.REQUIRED,
      xtype: "numberfield",
      hideTrigger: true,
      allowDecimal: false,
      name: "widthInView",
      value: entity == null ? 120 : entity.get("widthInView"),
      listeners: {
        specialkey: {
          fn: me._onEditSpecialKey,
          scope: me
        }
      }
    }, {
      id: "PSI_Form_FormColEditForm_editShowOrderInView",
      fieldLabel: "视图界面显示次序",
      labelWidth: 120,
      allowBlank: false,
      blankText: "没有输入视图界面显示次序",
      beforeLabelTextTpl: PSI.Const.REQUIRED,
      xtype: "numberfield",
      hideTrigger: true,
      allowDecimal: false,
      name: "showOrderInView",
      value: entity == null ? 10 : entity.get("showOrderInView"),
      colspan: 2,
      listeners: {
        specialkey: {
          fn: me._onEditSpecialKey,
          scope: me
        }
      }
    }];

    return list;
  },

  /**
   * @private
   */
  _onWndShow() {
    const me = this;

    Ext.get(window).on('beforeunload', me.__onWindowBeforeUnload);

    const el = me.getEl();
    el && el.mask(PSI.Const.LOADING);
    me.ajax({
      url: me.URL("Home/Form/formColInfo"),
      params: {
        id: me.adding ? null : me.getEntity().get("id"),
        formId: me.getForm().get("id")
      },
      callback(options, success, response) {
        if (success) {
          el && el.unmask();

          const data = me.decodeJSON(response.responseText);
          if (data.editorXtype) {
            const store = me.editEditorXtype.getStore();
            store.removeAll();
            store.add(data.editorXtype);
          }

          if (me.adding) {
            // 新建
            const store = me.editEditorXtype.getStore();
            me.editEditorXtype.setValue(store.getAt(0));
          } else {
            // 编辑
            me.editCaption.setValue(data.caption);
            me.editFieldName.setReadOnly(true);
            me.editFieldName.setValue(data.fieldName);
            me.editFieldType.setReadOnly(true);
            me.editFieldType.setValue(data.fieldType);
            me.editFieldLength.setReadOnly(true);
            me.editFieldLength.setValue(data.fieldLength);
            me.editFieldDec.setReadOnly(true);
            me.editFieldDec.setValue(data.fieldDec);
            me.editValueFrom.setValue(parseInt(data.valueFrom));
            me.editValueFromTableName.setValue(data.valueFromTableName);
            me.editValueFromColName.setValue(data.valueFromColName);
            me.editValueFromColNameDisplay.setValue(data.valueFromColNameDisplay);
            me.editIsVisible.setValue(parseInt(data.isVisible));
            me.editMustInput.setValue(parseInt(data.mustInput));
            me.editShowOrder.setValue(data.showOrder);
            me.editEditorXtype.setValue(data.editorXtypeValue);
            me.editColSpan.setValue(data.colSpan);
            me.editWidthInView.setValue(data.widthInView);
            me.editShowOrderInView.setValue(data.showOrderInView);
            me.editMemo.setValue(data.memo);
          }

          me.editCaption.focus();
        }
      }
    });
  },

  /**
   * @private
   */
  _onOK() {
    const me = this;

    me.showInfo("TODO")
    // const f = me.editForm;
    // const el = f.getEl();
    // el && el.mask(PSI.Const.SAVING);
    // f.submit({
    //   url: me.URL("Home/Form/editFormCol"),
    //   method: "POST",
    //   success(form, action) {
    //     el && el.unmask();
    //     me.tip("数据保存成功", true);
    //     me.__lastId = action.result.id;
    //     me.close();
    //     const parentForm = me.getParentForm();
    //     if (parentForm) {
    //       parentForm.refreshColsGrid.apply(parentForm, [me.__lastId]);
    //     }
    //   },
    //   failure(form, action) {
    //     el && el.unmask();
    //     me.showInfo(action.result.msg);
    //   }
    // });
  },

  /**
   * @private
   */
  _onEditSpecialKey(field, e) {
    const me = this;

    if (e.getKey() === e.ENTER) {
      const id = field.getId();
      for (let i = 0; i < me.__editorList.length; i++) {
        let edit = me.__editorList[i];
        if (id == edit.getId()) {
          edit = me.__editorList[i + 1];
          edit.focus();
          edit.setValue(edit.getValue());
        }
      }
    }
  },

  /**
   * @private
   */
  _onEditLastSpecialKey(field, e) {
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

    if (me.__lastId) {
      const parentForm = me.getParentForm();
      if (parentForm) {
        parentForm.refreshColsGrid.apply(parentForm, [me.__lastId]);
      }
    }
  },

  /**
   * @private
   */
  _onFieldTypeChange() {
    const me = this;
    const v = me.editFieldType.getValue();
    if (v == "varchar") {
      me.editFieldLength.setValue(255);
      me.editFieldLength.setDisabled(false);
      me.editFieldDec.setDisabled(true);
      me.editFieldDec.setValue(null);
    } else if (v == "int") {
      me.editFieldLength.setValue(11);
      me.editFieldLength.setDisabled(true);
      me.editFieldDec.setDisabled(true);
      me.editFieldDec.setValue(null);
    } else if (v == "decimal") {
      me.editFieldLength.setValue(19);
      me.editFieldLength.setDisabled(true);
      me.editFieldDec.setDisabled(false);
      me.editFieldDec.setValue(2);
    }
  },

  /**
   * @private
   */
  _onValueFromChange() {
    const me = this;
    const v = me.editValueFrom.getValue();
    if (v == 1) {
      me.editValueFromTableName.setDisabled(true);
      me.editValueFromColName.setDisabled(true);
      me.editValueFromColNameDisplay.setDisabled(true);
    } else if (v == 2) {
      me.editValueFromTableName.setDisabled(false);
      me.editValueFromColName.setDisabled(false);
      me.editValueFromColNameDisplay.setDisabled(false);
    } else if (v == 3) {
      me.editValueFromTableName.setDisabled(false);
      me.editValueFromColName.setDisabled(false);
      me.editValueFromColNameDisplay.setDisabled(false);
    } else if (v == 4) {
      me.editValueFromTableName.setDisabled(true);
      me.editValueFromColName.setDisabled(false);
      me.editValueFromColNameDisplay.setDisabled(false);
    }
  }
});
