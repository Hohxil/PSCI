/**
 * 码表列 - 新建或编辑界面
 * 
 * @author 艾格林门信息服务（大连）有限公司
 * @copyright 2015 - present
 * @license GPL v3
 */
PCL.define("PSI.CodeTable.CodeTableColEditForm", {
  extend: "PSI.AFX.Form.EditForm",

  config: {
    codeTable: null
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
      handler: function () {
        me._onOK(false);
      },
      scope: me
    }, {
      text: "取消",
      handler() {
        const info = entity == null ? "新建码表列" : "编辑码表列";

        me.confirm(`请确认是否取消：${info}?`, () => {
          me.close();
        });
      },
      scope: me
    });

    const t = entity == null ? "新建码表列" : "编辑码表列";
    const logoHtml = me.genLogoHtml(entity, t);

    PCL.apply(me, {
      header: {
        title: me.formatTitle(PSI.Const.PROD_NAME),
        height: 40
      },
      width: 890,
      height: 410,
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
        items: {
          xtype: "tabpanel",
          id: "PSI_CodeTable_CodeTableColEditForm_tabPanel",
          border: 0,
          items: [{
            title: "数据库结构",
            id: "tabDbStruct",
            border: 0,
            layout: "fit",
            items: {
              border: 0,
              xtype: "form",
              id: "form1",
              bodyStyle: "margin-top:10px",
              layout: {
                type: "table",
                columns: 3,
                tableAttrs: PSI.Const.TABLE_LAYOUT,
              },
              defaultType: 'textfield',
              fieldDefaults: {
                labelWidth: 90,
                labelAlign: "right",
                labelSeparator: "",
                msgTarget: 'side'
              },
              items: me.getDbStructInputs()
            }
          }, {
            title: "取值",
            id: "tabValueFrom",
            border: 0,
            layout: "fit",
            items: {
              border: 0,
              xtype: "form",
              id: "form2",
              bodyStyle: "margin-top:10px",
              layout: {
                type: "table",
                columns: 2,
                tableAttrs: PSI.Const.TABLE_LAYOUT,
              },
              defaultType: 'textfield',
              fieldDefaults: {
                labelWidth: 120,
                labelAlign: "right",
                labelSeparator: "",
                msgTarget: 'side'
              },
              items: me.getFetchValueInputs()
            }
          }, {
            title: "显示",
            id: "tabDisplay",
            border: 0,
            layout: "fit",
            items: {
              border: 0,
              xtype: "form",
              id: "form3",
              bodyStyle: "margin-top:10px",
              layout: {
                type: "table",
                columns: 3,
                tableAttrs: PSI.Const.TABLE_LAYOUT,
              },
              defaultType: 'textfield',
              fieldDefaults: {
                labelWidth: 120,
                labelAlign: "right",
                labelSeparator: "",
                msgTarget: 'side'
              },
              items: me.getDisplayInput()
            }
          }, {
            title: "编辑",
            id: "tabEdit",
            border: 0,
            layout: "fit",
            items: {
              border: 0,
              xtype: "form",
              id: "form4",
              bodyStyle: "margin-top:10px",
              layout: {
                type: "table",
                columns: 3,
                tableAttrs: PSI.Const.TABLE_LAYOUT,
              },
              defaultType: 'textfield',
              fieldDefaults: {
                labelWidth: 90,
                labelAlign: "right",
                labelSeparator: "",
                msgTarget: 'side'
              },
              items: me.getEditInputs()
            }
          }, {
            title: "默认值",
            id: "tabDefaultValue",
            border: 0,
            layout: "fit",
            items: {
              border: 0,
              xtype: "form",
              id: "form5",
              bodyStyle: "margin-top:10px",
              layout: {
                type: "table",
                columns: 3,
                tableAttrs: PSI.Const.TABLE_LAYOUT,
              },
              defaultType: 'textfield',
              fieldDefaults: {
                labelWidth: 90,
                labelAlign: "right",
                labelSeparator: "",
                msgTarget: 'side'
              },
              items: me.getDefaultValueInputs(),
            }
          }],
          listeners: {
            tabchange: {
              fn: me._onTabChange,
              scope: me
            },
          }
        }
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

    me.editName = PCL.getCmp("PSI_CodeTable_CodeTableColEditForm_editName");
    me.editTableName = PCL.getCmp("PSI_CodeTable_CodeTableColEditForm_editTableName");
    me.editCaption = PCL.getCmp("PSI_CodeTable_CodeTableColEditForm_editCaption");
    me.editFieldName = PCL.getCmp("PSI_CodeTable_CodeTableColEditForm_editFieldName");
    me.hiddenFieldType = PCL.getCmp("PSI_CodeTable_CodeTableColEditForm_hiddenFieldType");
    me.editFieldType = PCL.getCmp("PSI_CodeTable_CodeTableColEditForm_editFieldType");
    me.editFieldLength = PCL.getCmp("PSI_CodeTable_CodeTableColEditForm_editFieldLength");
    me.editFieldDec = PCL.getCmp("PSI_CodeTable_CodeTableColEditForm_editFieldDec");
    me.hiddenValueFrom = PCL.getCmp("PSI_CodeTable_CodeTableColEditForm_hiddenValueFrom");
    me.editValueFrom = PCL.getCmp("PSI_CodeTable_CodeTableColEditForm_editValueFrom");
    me.editValueFromTableName = PCL.getCmp("PSI_CodeTable_CodeTableColEditForm_editValueFromTableName");
    me.editValueFromColName = PCL.getCmp("PSI_CodeTable_CodeTableColEditForm_editValueFromColName");
    me.editValueFromColNameDisplay = PCL.getCmp("PSI_CodeTable_CodeTableColEditForm_editValueFromColNameDisplay");
    me.editWidthInView = PCL.getCmp("PSI_CodeTable_CodeTableColEditForm_editWidthInView");
    me.editShowOrder = PCL.getCmp("PSI_CodeTable_CodeTableColEditForm_editShowOrder");
    me.editColSpan = PCL.getCmp("PSI_CodeTable_CodeTableColEditForm_editColSpan");
    me.editShowOrderInView = PCL.getCmp("PSI_CodeTable_CodeTableColEditForm_editShowOrderInView");
    me.hiddenEditorXtype = PCL.getCmp("PSI_CodeTable_CodeTableColEditForm_hiddenEditorXtype");
    me.editEditorXtype = PCL.getCmp("PSI_CodeTable_CodeTableColEditForm_editEditorXtype");
    me.editMemo = PCL.getCmp("PSI_CodeTable_CodeTableColEditForm_editMemo");
    me.hiddenIsVisible = PCL.getCmp("PSI_CodeTable_CodeTableColEditForm_hiddenIsVisible");
    me.editIsVisible = PCL.getCmp("PSI_CodeTable_CodeTableColEditForm_editIsVisible");
    me.hiddenMustInput = PCL.getCmp("PSI_CodeTable_CodeTableColEditForm_hiddenMustInput");
    me.editMustInput = PCL.getCmp("PSI_CodeTable_CodeTableColEditForm_editMustInput");

    me.hiddenDefaultValue = PCL.getCmp("PSI_CodeTable_CodeTableColEditForm_hiddenDefaultValue");
    me.editDefaultValue = PCL.getCmp("PSI_CodeTable_CodeTableColEditForm_editDefaultValue");
    me.editDefaultValueText = PCL.getCmp("PSI_CodeTable_CodeTableColEditForm_editDefaultValueText");
    me.hiddenDefaultValueMacro = PCL.getCmp("PSI_CodeTable_CodeTableColEditForm_hiddenDefaultValueMacro");
    me.editDefaultValueMacro = PCL.getCmp("PSI_CodeTable_CodeTableColEditForm_editDefaultValueMacro");

    me.__useTabPanel = true;
    me.__tabPanelId = "PSI_CodeTable_CodeTableColEditForm_tabPanel";
    inputForm1 = [me.editCaption];
    if (me.adding) {
      inputForm1.push(me.editFieldName, me.editFieldType);
    }
    inputForm1.push(me.editMemo);

    me.__editorList = [
      inputForm1,
      [me.editValueFrom],
      [me.editWidthInView, me.editShowOrderInView, me.editShowOrder],
      [me.editColSpan, me.editEditorXtype, me.editIsVisible, me.editMustInput],
      [me.editDefaultValue],
    ];

    me.buttonRefCol = PCL.getCmp("PSI_CodeTable_CodeTableColEditForm_buttonRefCol");

    me.form1 = PCL.getCmp("form1");
    me.form2 = PCL.getCmp("form2");
    me.form3 = PCL.getCmp("form3");
    me.form4 = PCL.getCmp("form4");
    me.form5 = PCL.getCmp("form5");
    me.tabPanelMain = PCL.getCmp("PSI_CodeTable_CodeTableColEditForm_tabPanel");
  },

  /**
   * @private
   * 
   * 和数据库结构相关的属性input
   */
  getDbStructInputs() {
    const me = this;
    const entity = me.getEntity();
    const isSysCol = (entity != null) && (parseInt(entity.get("sysColRawValue")) == 1);

    const col2Width = 550;
    const col3Width = 830;

    const list = [];

    list.push({
      xtype: "hidden",
      name: "id",
      value: entity == null ? null : entity.get("id")
    }, {
      xtype: "hidden",
      name: "codeTableId",
      value: me.getCodeTable().get("id")
    }, {
      id: "PSI_CodeTable_CodeTableColEditForm_editName",
      fieldLabel: "码表名称",
      xtype: "displayfield",
      value: `<span class='PSI-field-note'>${me.getCodeTable().get("name")}</span>`
    }, {
      id: "PSI_CodeTable_CodeTableColEditForm_editTableName",
      fieldLabel: "数据库表名",
      xtype: "displayfield",
      colspan: 2,
      width: col2Width,
      value: `<span class='PSI-field-note'>${me.getCodeTable().get("tableName")}</span>`
    }, {
      id: "PSI_CodeTable_CodeTableColEditForm_editCaption",
      fieldLabel: "列标题",
      xtype: me.adding ? "textfield" : (isSysCol ? "displayfield" : "textfield"),
      allowBlank: false,
      blankText: "没有输入列标题",
      beforeLabelTextTpl: PSI.Const.REQUIRED,
      listeners: {
        specialkey: {
          fn: me.__onEditSpecialKey,
          scope: me
        }
      },
      name: "caption"
    }, {
      id: "PSI_CodeTable_CodeTableColEditForm_editFieldName",
      xtype: me.adding ? "textfield" : "displayfield",
      fieldLabel: "列数据库名",
      allowBlank: false,
      blankText: "没有输入列数据库名",
      beforeLabelTextTpl: PSI.Const.REQUIRED,
      listeners: {
        specialkey: {
          fn: me.__onEditSpecialKey,
          scope: me
        }
      },
      colspan: 2,
      width: col2Width,
      name: "fieldName"
    }, {
      id: "PSI_CodeTable_CodeTableColEditForm_hiddenFieldType",
      xtype: "hidden",
      name: "fieldType",
      value: "varchar",
    }, {
      id: "PSI_CodeTable_CodeTableColEditForm_editFieldType",
      xtype: me.adding ? "psi_sysdictfield" : "displayfield",
      tableName: "t_sysdict_sln0000_ct_field_type",
      callbackFunc: me._fieldTypeCallback,
      callbackScope: me,
      labelAlign: "right",
      labelSeparator: "",
      fieldLabel: "列数据类型",
      allowBlank: false,
      blankText: "没有输入列数据类型",
      beforeLabelTextTpl: PSI.Const.REQUIRED,
      value: "varchar",
      listeners: {
        specialkey: {
          fn: me.__onEditSpecialKey,
          scope: me
        }
      },
    }, {
      id: "PSI_CodeTable_CodeTableColEditForm_editFieldLength",
      fieldLabel: "列数据长度",
      listeners: {
        specialkey: {
          fn: me.__onEditSpecialKey,
          scope: me
        }
      },
      xtype: me.adding ? "numberfield" : "displayfield",
      hideTrigger: true,
      allowDecimal: false,
      minValue: 1,
      value: 255,
      name: "fieldLength"
    }, {
      id: "PSI_CodeTable_CodeTableColEditForm_editFieldDec",
      fieldLabel: "列小数位数",
      listeners: {
        specialkey: {
          fn: me.__onEditSpecialKey,
          scope: me
        }
      },
      xtype: me.adding ? "numberfield" : "displayfield",
      hideTrigger: true,
      allowDecimal: false,
      minValue: 0,
      value: 0,
      name: "fieldDecimal",
      disabled: true
    }, {
      id: "PSI_CodeTable_CodeTableColEditForm_editMemo",
      fieldLabel: "备注",
      name: "memo",
      value: entity == null ? null : entity
        .get("note"),
      listeners: {
        specialkey: {
          fn: me.__onEditSpecialKey,
          scope: me
        }
      },
      width: col3Width,
      colspan: 3
    });

    return list;
  },

  /**
   * @private
   * 
   * 和取值相关的列属性input
   */
  getFetchValueInputs() {
    const me = this;

    const col1Width = 405;
    const col3Width = 820;
    const list = [{
      id: "PSI_CodeTable_CodeTableColEditForm_hiddenValueFrom",
      xtype: "hidden",
      name: "fieldType",
      value: 1,
    }, {
      id: "PSI_CodeTable_CodeTableColEditForm_editValueFrom",
      xtype: "psi_sysdictfield",
      tableName: "t_sysdict_sln0000_ct_value_from",
      callbackFunc: me._valueFromCallback,
      callbackScope: me,
      fieldLabel: "值来源",
      labelWidth: 100,
      allowBlank: false,
      blankText: "没有输入值来源",
      beforeLabelTextTpl: PSI.Const.REQUIRED,
      value: "直接录入",
      width: col1Width,
      listeners: {
        specialkey: {
          fn: me.__onEditSpecialKey,
          scope: me
        }
      },
    }, {
      id: "PSI_CodeTable_CodeTableColEditForm_buttonRefCol",
      xtype: "button",
      text: "选择值来源的引用列",
      disabled: true,
      handler: me._onRefCol,
      scope: me,
    }, {
      id: "PSI_CodeTable_CodeTableColEditForm_editValueFromTableName",
      fieldLabel: "引用表名",
      labelWidth: 100,
      disabled: true,
      colspan: 2,
      width: col3Width,
      name: "valueFromTableName"
    }, {
      id: "PSI_CodeTable_CodeTableColEditForm_editValueFromColName",
      fieldLabel: "引用列名(关联用)",
      labelWidth: 100,
      disabled: true,
      name: "valueFromColName",
      width: col1Width,
    }, {
      id: "PSI_CodeTable_CodeTableColEditForm_editValueFromColNameDisplay",
      fieldLabel: "引用列名(显示用)",
      labelWidth: 100,
      disabled: true,
      name: "valueFromColNameDisplay",
      width: col1Width,
    }];

    return list;
  },

  /**
   * @private
   * 
   * 显示相关的属性input
   */
  getDisplayInput() {
    const me = this;

    const list = [{
      id: "PSI_CodeTable_CodeTableColEditForm_editWidthInView",
      fieldLabel: "列视图宽度(px)",
      labelWidth: 100,
      xtype: "numberfield",
      hideTrigger: true,
      allowDecimal: false,
      minValue: 10,
      value: 120,
      allowBlank: false,
      blankText: "没有输入列视图宽度",
      beforeLabelTextTpl: PSI.Const.REQUIRED,
      name: "widthInView",
      listeners: {
        specialkey: {
          fn: me.__onEditSpecialKey,
          scope: me
        }
      }
    }, {
      id: "PSI_CodeTable_CodeTableColEditForm_editShowOrderInView",
      fieldLabel: "视图界面显示次序",
      allowBlank: false,
      blankText: "没有输入视图界面显示次序",
      beforeLabelTextTpl: PSI.Const.REQUIRED,
      xtype: "numberfield",
      hideTrigger: true,
      allowDecimal: false,
      name: "showOrderInView",
      listeners: {
        specialkey: {
          fn: me.__onEditSpecialKey,
          scope: me
        }
      },
      colspan: 1,
      value: 1000,
    }, {
      id: "PSI_CodeTable_CodeTableColEditForm_editShowOrder",
      fieldLabel: "编辑界面显示次序",
      allowBlank: false,
      blankText: "没有输入编辑界面显示次序",
      beforeLabelTextTpl: PSI.Const.REQUIRED,
      xtype: "numberfield",
      hideTrigger: true,
      allowDecimal: false,
      name: "showOrder",
      value: 1000,
      listeners: {
        specialkey: {
          fn: me.__onEditSpecialKey,
          scope: me
        }
      }
    }];

    if (me.adding) {
      list.push({
        xtype: "displayfield",
        fieldLabel: "提示",
        labelWidth: 100,
        colspan: 3,
        value: "<span class='PSI-field-note'>显示次序可以通过其他处的可视化功能灵活调整，新建列的时候填写默认值1000即可</span>"
      });
    }

    return list;
  },

  /**
   * @private
   * 
   * 编辑相关的属性input
   */
  getEditInputs() {
    const me = this;
    const col2Width = 550;

    const list = [{
      id: "PSI_CodeTable_CodeTableColEditForm_editColSpan",
      fieldLabel: "编辑器列占位",
      allowBlank: false,
      blankText: "没有输入编辑器列占位",
      beforeLabelTextTpl: PSI.Const.REQUIRED,
      xtype: "numberfield",
      hideTrigger: true,
      allowDecimal: false,
      minValue: 1,
      name: "colSpan",
      value: 1,
      listeners: {
        specialkey: {
          fn: me.__onEditSpecialKey,
          scope: me
        }
      }
    }, {
      id: "PSI_CodeTable_CodeTableColEditForm_hiddenEditorXtype",
      xtype: "hidden",
      name: "editorXtype",
      value: "textfield",
    }, {
      id: "PSI_CodeTable_CodeTableColEditForm_editEditorXtype",
      xtype: "psi_sysdictfield",
      tableName: "t_sysdict_sln0000_ct_editor_xtype",
      callbackFunc: me._editorXtypeCallback,
      callbackScope: me,
      labelAlign: "right",
      labelSeparator: "",
      fieldLabel: "编辑器类型",
      allowBlank: false,
      blankText: "没有输入编辑器类型",
      beforeLabelTextTpl: PSI.Const.REQUIRED,
      colspan: 2,
      width: col2Width,
      value: "textfield - 字符串编辑器",
      listeners: {
        specialkey: {
          fn: me.__onEditSpecialKey,
          scope: me
        }
      }
    }, {
      id: "PSI_CodeTable_CodeTableColEditForm_hiddenIsVisible",
      xtype: "hidden",
      name: "isVisible",
      value: 1,
    }, {
      id: "PSI_CodeTable_CodeTableColEditForm_editIsVisible",
      xtype: "psi_sysdictfield",
      tableName: "t_sysdict_sln0000_ct_field_visible",
      callbackFunc: me._isVisibleCallback,
      callbackScope: me,
      labelAlign: "right",
      labelSeparator: "",
      fieldLabel: "对用户可见",
      allowBlank: false,
      blankText: "没有输入是否对用户可见",
      beforeLabelTextTpl: PSI.Const.REQUIRED,
      value: "对用户可见",
      listeners: {
        specialkey: {
          fn: me.__onEditSpecialKey,
          scope: me
        }
      }
    }, {
      id: "PSI_CodeTable_CodeTableColEditForm_hiddenMustInput",
      xtype: "hidden",
      name: "mustInput",
      value: 1,
    }, {
      id: "PSI_CodeTable_CodeTableColEditForm_editMustInput",
      xtype: "psi_sysdictfield",
      tableName: "t_sysdict_sln0000_ct_must_input",
      callbackFunc: me._mustInputCallback,
      callbackScope: me,
      labelAlign: "right",
      labelSeparator: "",
      fieldLabel: "必须录入",
      allowBlank: false,
      blankText: "没有输入必须录入",
      beforeLabelTextTpl: PSI.Const.REQUIRED,
      value: "非必须录入项",
      listeners: {
        specialkey: {
          fn: me.__onEditSpecialKey,
          scope: me
        }
      }
    }];

    return list;
  },

  /**
   * 默认值相关的属性input
   * 
   * @private
   */
  getDefaultValueInputs() {
    const me = this;
    const col2Width = 550;

    const list = [{
      id: "PSI_CodeTable_CodeTableColEditForm_hiddenDefaultValue",
      xtype: "hidden",
      name: "defaultValue",
      value: "100",
    }, {
      id: "PSI_CodeTable_CodeTableColEditForm_editDefaultValue",
      xtype: "psi_sysdictfield",
      tableName: "t_sysdict_sln0000_ct_field_default_value",
      callbackFunc: me._defaultValueCallback,
      callbackScope: me,
      labelAlign: "right",
      labelSeparator: "",
      fieldLabel: "默认值类型",
      allowBlank: false,
      blankText: "没有输入默认值类型",
      beforeLabelTextTpl: PSI.Const.REQUIRED,
      value: "[无]",
      listeners: {
        specialkey: {
          fn: me._onDefaultValueEditSpecialKey,
          scope: me
        }
      },
      colspan: 3,
    }, {
      id: "PSI_CodeTable_CodeTableColEditForm_editDefaultValueText",
      fieldLabel: "固定值",
      xtype: "textfield",
      colspan: 3,
      width: col2Width,
      listeners: {
        specialkey: {
          fn: me._onEditLastSpecialKey,
          scope: me
        }
      },
      disabled: true,
      name: "defaultValueText",
    }, {
      id: "PSI_CodeTable_CodeTableColEditForm_hiddenDefaultValueMacro",
      xtype: "hidden",
      name: "defaultValue",
      value: "100",
      name: "defaultValueMacro"
    }, {
      id: "PSI_CodeTable_CodeTableColEditForm_editDefaultValueMacro",
      xtype: "psi_sysdictfield",
      tableName: "t_sysdict_sln0000_ct_field_default_value_macro",
      callbackFunc: me._defaultValueMacroCallback,
      callbackScope: me,
      labelAlign: "right",
      labelSeparator: "",
      fieldLabel: "宏",
      colspan: 3,
      width: col2Width,
      value: "",
      listeners: {
        specialkey: {
          fn: me._onEditLastSpecialKey,
          scope: me
        }
      },
      disabled: true,
    }];

    return list;
  },

  /**
   * @private
   */
  _onWndShow() {
    const me = this;

    PCL.get(window).on('beforeunload', me.__onWindowBeforeUnload);

    const el = me.getEl();
    el && el.mask(PSI.Const.LOADING);
    me.ajax({
      url: me.URL("Home/CodeTable/codeTableColInfo"),
      params: {
        id: me.adding ? null : me.getEntity().get("id"),
        tableId: me.getCodeTable().get("id")
      },
      callback(options, success, response) {
        if (success) {
          el && el.unmask();

          const data = PCL.JSON.decode(response.responseText);

          if (me.adding) {
            // 新建
            me.editCaption.focus();
          } else {
            // 编辑
            me.editTableName.setReadOnly(true);
            me.editCaption.setReadOnly(true);
            me.editFieldName.setReadOnly(true);
            me.editFieldType.setReadOnly(true);
            me.editFieldLength.setReadOnly(true);
            me.editFieldLength.setDisabled(false);
            me.editFieldDec.setReadOnly(true);
            me.editFieldDec.setDisabled(false);

            const col = data.col;
            if (col) {
              me.editCaption.setValue(col.caption);
              me.editFieldName.setValue(`<span class='PSI-field-note'>${col.fieldName}</span>`);
              me.editFieldType.setValue(`<span class='PSI-field-note'>${col.fieldType}</span>`);
              me.editFieldLength.setValue(`<span class='PSI-field-note'>${col.fieldLength}</span>`);
              me.editFieldDec.setValue(`<span class='PSI-field-note'>${col.fieldDecimal}</span>`);
              const valueFrom = parseInt(col.valueFrom);
              me.hiddenValueFrom.setValue(valueFrom);
              me.editValueFrom.setValue(col.valueFromDisplay);
              me.editValueFromTableName.setValue(col.valueFromTableName);
              me.editValueFromColName.setValue(col.valueFromColName);
              me.editValueFromColNameDisplay.setValue(col.valueFromColNameDisplay);

              if (valueFrom == 4) {
                // 引用自身数据
                me.editValueFromTableName.setReadOnly(true);
              }

              me.hiddenIsVisible.setValue(parseInt(col.isVisible));
              me.editIsVisible.setValue(col.isVisibleDisplay);
              me.hiddenMustInput.setValue(parseInt(col.mustInput));
              me.editMustInput.setValue(col.mustInputDisplay);
              me.editWidthInView.setValue(col.widthInView);
              me.editShowOrder.setValue(col.showOrder);
              me.editColSpan.setValue(col.colSpan);
              me.editShowOrderInView.setValue(col.showOrderInView);
              me.hiddenEditorXtype.setValue(col.editorXtype);
              me.editEditorXtype.setValue(col.editorXtypeDisplay);
              me.editMemo.setValue(col.memo);

              // 默认值
              const defaultValue = col.defaultValue;
              const defaultValueDisplay = col.defaultValueDisplay;
              const defaultValueExt = col.defaultValueExt;
              me.hiddenDefaultValue.setValue(defaultValue);
              me.editDefaultValue.setValue(defaultValueDisplay);
              me.editDefaultValue.setIdValue(defaultValue);
              if (defaultValue == "200") {
                // 固定值
                me.editDefaultValueText.setDisabled(false);
                me.editDefaultValueText.setValue(defaultValueExt);
              } else if (defaultValue == "300") {
                // 宏
                me.editDefaultValueMacro.setDisabled(false);
                me.editDefaultValueMacro.setValue(defaultValueExt);
                me.editDefaultValueMacro.setIdValue(defaultValueExt);
                me.hiddenDefaultValueMacro.setValue(defaultValueExt);
              }

              if (col.sysCol == 1) {
                // 系统列的时候，进一步限制字段的修改
                me.editCaption.setValue(`<span class='PSI-field-note'>${col.caption}</span>`);

                me.editValueFrom.setReadOnly(true);
                me.editIsVisible.setReadOnly(true);
                me.editMustInput.setReadOnly(true);
                me.editWidthInView.setReadOnly(true);
                me.editWidthInView.clearInvalid();
                me.editWidthInView.setMinValue(0);
                me.editEditorXtype.setReadOnly(true);
              } else {
                me.editCaption.setDisabled(false);
                me.editCaption.setReadOnly(false);
              }

              if (col.isVisible == 1) {
                // 可见的字段，也能设置在视图中的宽度
                me.editWidthInView.setReadOnly(false);
              }
              if (col.sysCol == 1) {
                // 系统列的时候
                me.editMemo.focus();
              } else {
                me.editCaption.focus();
              }
            }
          }
        }
      }
    });
  },

  /**
   * @private
   */
  _onOK() {
    const me = this;

    // 检查数据是否录入完整
    let f = me.form1;
    if (!f.getForm().isValid()) {
      me.showInfo("数据没有录入完整", () => {
        me.tabPanelMain.setActiveTab(0);
      });

      return;
    }

    f = me.form2;
    if (!f.getForm().isValid()) {
      me.showInfo("数据没有录入完整", () => {
        me.tabPanelMain.setActiveTab(1);
      });

      return;
    }

    f = me.form3;
    if (!f.getForm().isValid()) {
      me.showInfo("数据没有录入完整", () => {
        me.tabPanelMain.setActiveTab(2);
      });

      return;
    }

    f = me.form4;
    if (!f.getForm().isValid()) {
      me.showInfo("数据没有录入完整", () => {
        me.tabPanelMain.setActiveTab(3);
      });

      return;
    }

    f = me.form5;
    if (!f.getForm().isValid()) {
      me.showInfo("数据没有录入完整", () => {
        me.tabPanelMain.setActiveTab(4);
      });

      return;
    }

    const entity = me.getEntity();
    const params = {
      id: entity == null ? null : entity.get("id"),
      codeTableId: me.getCodeTable().get("id"),
      caption: me.editCaption.getValue(),
      fieldName: me.editFieldName.getValue(),
      fieldType: me.hiddenFieldType.getValue(),
      fieldLength: me.editFieldLength.getValue(),
      fieldDecimal: me.editFieldDec.getValue(),
      valueFrom: me.hiddenValueFrom.getValue(),
      valueFromTableName: me.editValueFromTableName.getValue(),
      valueFromColName: me.editValueFromColName.getValue(),
      valueFromColNameDisplay: me.editValueFromColNameDisplay.getValue(),
      mustInput: me.hiddenMustInput.getValue(),
      widthInView: me.editWidthInView.getValue(),
      showOrder: me.editShowOrder.getValue(),
      showOrderInView: me.editShowOrderInView.getValue(),
      isVisible: me.hiddenIsVisible.getValue(),
      editorXtype: me.hiddenEditorXtype.getValue(),
      memo: me.editMemo.getValue(),
      colSpan: me.editColSpan.getValue(),
    };

    const defaultValue = me.hiddenDefaultValue.getValue();
    let defaultValueExt = "";
    if (defaultValue == "200") {
      // 固定值
      defaultValueExt = me.editDefaultValueText.getValue();
    } else if (defaultValue == "300") {
      // 宏
      defaultValueExt = me.hiddenDefaultValueMacro.getValue();
    }
    PCL.apply(params, {
      defaultValue,
      defaultValueExt,
    });

    const el = me.getEl();
    el && el.mask(PSI.Const.SAVING);

    const r = {
      url: me.URL("Home/CodeTable/editCodeTableCol"),
      params,
      callback(options, success, response) {
        el && el.unmask();

        if (success) {
          const data = me.decodeJSON(response.responseText);
          if (data.success) {
            me.tip("数据保存成功", true);
            me._lastId = data.id;
            me.close();
            const parentForm = me.getParentForm();
            if (parentForm) {
              parentForm.refreshColsGrid.apply(parentForm, [me._lastId]);
            }
          } else {
            me.showInfo(data.msg);
          }
        } else {
          me.showInfo("网络错误");
        }
      }
    };

    me.ajax(r);
  },

  _onEditLastSpecialKey(field, e) {
    const me = this;

    if (e.getKey() === e.ENTER) {
      me._onOK();
    }
  },

  _onDefaultValueEditSpecialKey(field, e) {
    const me = this;

    if (e.getKey() === e.ENTER) {
      const v = me.editDefaultValue.getIdValue();
      if (v == "200") {
        me.setFocusAndCursorPosToLast(me.editDefaultValueText);
      } else if (v == "300") {
        me.setFocusAndCursorPosToLast(me.editDefaultValueMacro);
      } else {
        me._onOK();
      }
    }
  },

  /**
   * @private
   */
  _onWndClose() {
    const me = this;

    PCL.get(window).un('beforeunload', me.__onWindowBeforeUnload);

    PCL.WindowManager.hideAll();
  },

  /**
   * @private
   */
  _onFieldTypeChange() {
    const me = this;
    const v = me.hiddenFieldType.getValue();
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
    } else if (v == "datetime") {
      me.editFieldLength.setValue(null);
      me.editFieldLength.setDisabled(true);
      me.editFieldDec.setDisabled(true);
      me.editFieldDec.setValue(null);
    }
  },

  /**
   * @private
   */
  _onValueFromChange() {
    const me = this;
    const v = me.hiddenValueFrom.getValue();
    if (v == 1) {
      me.buttonRefCol.setDisabled(true);
      me.editValueFromTableName.setDisabled(true);
      me.editValueFromColName.setDisabled(true);
      me.editValueFromColNameDisplay.setDisabled(true);
    } else if (v == 2) {
      me.buttonRefCol.setDisabled(false);
      me.editValueFromTableName.setDisabled(false);
      me.editValueFromColName.setDisabled(false);
      me.editValueFromColNameDisplay.setDisabled(false);
    } else if (v == 3) {
      me.buttonRefCol.setDisabled(false);
      me.editValueFromTableName.setDisabled(false);
      me.editValueFromColName.setDisabled(false);
      me.editValueFromColNameDisplay.setDisabled(false);
    } else if (v == 4) {
      me.buttonRefCol.setDisabled(false);
      me.editValueFromTableName.setDisabled(true);
      me.editValueFromColName.setDisabled(false);
      me.editValueFromColNameDisplay.setDisabled(false);
    }
  },

  /**
   * @private
   */
  _onRefCol() {
    const me = this;

    const valueFrom = parseInt(me.hiddenValueFrom.getValue());

    if (valueFrom != 2 && valueFrom != 3 && valueFrom != 4) {
      me.showInfo("请先选择正确的值来源");
      return;
    }

    const codeTable = me.getCodeTable();

    const form = PCL.create("PSI.CodeTable.SelectColRefForm", {
      codeTable,
      valueFrom,
      parentForm: me,
    });
    form.show();
  },

  /**
   * TabPanel选中的Tab发生改变的时候的时间处理函数
   * @private
   */
  _onTabChange(tabPanel, newCard, oldCard, eOpts) {
    const me = this;

    const id = newCard.getId();

    // 延迟0.1秒后设置input焦点
    // 这是一个奇怪的写法，不这样处理，就不能正确设置焦点
    // 原因目前不明
    PCL.Function.defer(() => {
      if (id == "tabDbStruct") {
        me.setFocusAndCursorPosToLast(me.editCaption);
      } else if (id == "tabValueFrom") {
        me.setFocusAndCursorPosToLast(me.editValueFrom);
      } else if (id == "tabDisplay") {
        me.setFocusAndCursorPosToLast(me.editWidthInView);
      } else if (id == "tabEdit") {
        me.setFocusAndCursorPosToLast(me.editColSpan);
      } else if (id == "tabDefaultValue") {
        me.setFocusAndCursorPosToLast(me.editDefaultValue);
      }
    }, 100);
  },

  /**
   * 列数据类型 - 回调本方法
   * 
   * @private
   */
  _fieldTypeCallback(data, scope) {
    const me = scope;

    let t = data ? data.get("id") : null;
    if (!t) {
      t = "varchar";
    }
    me.hiddenFieldType.setValue(t);

    me._onFieldTypeChange();
  },

  /**
   * 值来源 - 回调本方法
   * 
   * @private
   */
  _valueFromCallback(data, scope) {
    const me = scope;

    let t = data ? data.get("id") : null;
    if (!t) {
      t = 1; // 直接录入
    }
    me.hiddenValueFrom.setValue(parseInt(t));

    me._onValueFromChange();
  },

  /**
   * 编辑器类型 - 回调本方法
   * 
   * @private
   */
  _editorXtypeCallback(data, scope) {
    const me = scope;

    let t = data ? data.get("id") : null;
    if (!t) {
      t = "textfield";
    }
    me.hiddenEditorXtype.setValue(t);
  },

  /**
   * 对用户是否可见 - 回调本方法
   * 
   * @private
   */
  _isVisibleCallback(data, scope) {
    const me = scope;

    let t = data ? data.get("id") : null;
    if (!t) {
      t = 1; // 可见
    }
    me.hiddenIsVisible.setValue(parseInt(t));
  },

  /**
   * 必须录入 - 回调本方法
   * 
   * @private
   */
  _mustInputCallback(data, scope) {
    const me = scope;

    let t = data ? data.get("id") : null;
    if (!t) {
      t = 1; // 非必录项
    }
    me.hiddenMustInput.setValue(parseInt(t));
  },

  /**
   * 默认值 - 回调本方法
   * 
   * @private
   */
  _defaultValueCallback(data, scope) {
    const me = scope;
    me.editDefaultValueText.setDisabled(true);
    me.editDefaultValueMacro.setDisabled(true);

    let t = data ? data.get("id") : null;
    if (!t) {
      t = "100"; // [无]
    } else {
      if (t == "200") {
        me.editDefaultValueText.setDisabled(false);
      } else if (t == "300") {
        me.editDefaultValueMacro.setDisabled(false);
      }
    }

    me.hiddenDefaultValue.setValue(t);
  },

  /**
   * 宏 - 回调本方法
   * 
   * @private
   */
  _defaultValueMacroCallback(data, scope) {
    const me = scope;

    let t = data ? data.get("id") : null;
    if (!t) {
      t = "100"; // [无]
    }

    me.hiddenDefaultValueMacro.setValue(t);
  },

  /**
   * PSI.CodeTable.SelectColRefForm回调本方法
   * 
   * @private
   */
  _refColCallbackFn(data) {
    const me = this;
    me.editValueFromTableName.setValue(data.tableName);
    me.editValueFromColName.setValue(data.colName);
    me.editValueFromColNameDisplay.setValue(data.colNameDisplay);
  }
});
