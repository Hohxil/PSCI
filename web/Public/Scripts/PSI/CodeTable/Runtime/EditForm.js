/**
 * 码表运行 - 新增或编辑界面
 * 
 * @author 艾格林门信息服务（大连）有限公司
 * @copyright 2015 - present
 * @license GPL v3
 */
PCL.define("PSI.CodeTable.Runtime.EditForm", {
  extend: "PSI.AFX.Form.EditForm",

  config: {
    metaData: null,
    company: null,
  },

  /**
   * @override
   */
  initComponent() {
    const me = this;

    const md = me.getMetaData();

    const entity = me.getEntity();

    me.adding = entity == null;

    const buttons = [];
    if (!entity) {
      buttons.push({
        text: "保存并继续新建",
        formBind: true,
        handler() {
          me._onOK(true);
        },
        scope: me
      });
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

    buttons.push(btn = {
      text: "取消",
      handler() {
        const info = entity == null ? "新建" + md.name : "编辑" + md.name;;

        me.confirm(`请确认是否取消：${info}?`, () => {
          me.close();
        });
      },
      scope: me
    });

    // 计算Form的高度
    let sumColSpan = 0;
    for (let i = 0; i < md.cols.length; i++) {
      const colMd = md.cols[i];
      if (colMd.isVisible) {
        sumColSpan += parseInt(colMd.colSpan);
      }
    }
    const rowCount = Math.ceil(sumColSpan / md.editColCnt);

    // TODO 高度超过屏幕高度，怎么办？
    let formHeight = 240 + rowCount * 30;
    if (md.inputCompany) {
      // 给组织机构留出空间
      formHeight += 30;
    }

    // 每个字段的编辑器宽度
    const fieldWidth = 370;

    // TODO 宽度超过屏幕宽度，怎么办？
    const formWidth = fieldWidth * md.editColCnt + 50;

    const t = entity == null ? "新建" + md.name : "编辑" + md.name;
    const logoHtml = me.genLogoHtml(entity, t);
    PCL.apply(me, {
      header: {
        title: me.formatTitle(PSI.Const.PROD_NAME),
        height: 40
      },
      width: formWidth,
      height: formHeight,
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
        id: "PSI_CodeTable_RuntimeEditForm_editForm",
        xtype: "form",
        layout: {
          type: "table",
          columns: md.editColCnt,
          tableAttrs: PSI.Const.TABLE_LAYOUT,
        },
        height: "100%",
        bodyPadding: 5,
        defaultType: 'textfield',
        fieldDefaults: {
          labelAlign: "right",
          labelSeparator: "",
          msgTarget: 'side',
          width: fieldWidth,
          margin: "5"
        },
        items: me.getEditItems(),
        buttons: buttons
      }]
    });

    me.callParent(arguments);

    me.editForm = PCL.getCmp("PSI_CodeTable_RuntimeEditForm_editForm");
  },

  /**
   * @private
   */
  getEditItems() {
    const me = this;

    const entity = me.getEntity();

    const md = me.getMetaData();
    if (!md) {
      return [];
    }

    const caclLabelWidth = (caption, required = false) => {
      let len = caption.length;
      if (required) {
        len++;
      }

      const widthPerChar = 16;
      return len * widthPerChar;
    };

    // 自动编码长度
    const autoCodeLength = parseInt(md.autoCodeLength);

    const result = [{
      xtype: "hidden",
      name: "id",
      value: entity == null ? null : entity.get("id")
    }, {
      xtype: "hidden",
      name: "fid",
      value: md.fid
    }];

    if (md.inputCompany) {
      // 多公司录入
      result.push({
        xtype: "hidden",
        name: "companyId",
        value: me.getCompany().get("id"),
      }, {
        xtype: "displayfield",
        fieldLabel: "组织机构",
        labelWidth: 55,
        value: me.toFieldNoteText(me.getCompany().get("name")),
        colspan: md.editColCnt // 单独占一行
      });
    }

    const colsMd = md.cols;
    const colsCount = colsMd.length;
    for (let i = 0; i < colsCount; i++) {
      const colMd = colsMd[i];

      if (colMd.isVisible) {
        const item = {
          labelWidth: caclLabelWidth(colMd.caption),
          fieldLabel: colMd.caption,
          xtype: colMd.editorXtype,
          name: colMd.fieldName,
          id: me.buildEditId(colMd.fieldName),
          listeners: {
            specialkey: {
              fn: me._onEditSpecialKey,
              scope: me
            }
          },
          colspan: colMd.colSpan,
          width: parseInt(colMd.colSpan) * 370
        };
        if (colMd.editorXtype == "numberfield") {
          PCL.apply(item, {
            hideTrigger: true
          });
        }
        if (colMd.editorXtype == "datefield") {
          // 日期
          PCL.apply(item, {
            format: "Y-m-d"
          });
        }

        if (md.treeView && colMd.fieldName == "parent_id") {
          // hiddenParentId用来在提交Form的时候向后台传递上级id
          const hiddenParentId = PCL.create("PCL.form.field.Hidden", {
            id: me.buildEditId("parent_id_hidden"),
            name: "parent_id"
          });
          result.push(hiddenParentId);

          PCL.apply(item, {
            idCmp: hiddenParentId,
            metadata: md,
            id: me.buildEditId("parent_id"),
            name: "parent_id_value",
            company: me.getCompany(),
          });
        }

        if (parseInt(colMd.valueFrom) == 2) {
          // 引用系统数据字典
          // hiddenId用来在提交Form的时候向后台传递码表id
          const refId = me.buildEditId(colMd.fieldName + "_hidden_id");
          const hiddenId = PCL.create("PCL.form.field.Hidden", {
            id: refId,
            name: colMd.fieldName
          });
          result.push(hiddenId);
          PCL.apply(item, {
            xtype: "psi_sysdictfield",
            tableName: colMd.valueFromTableName,
            callbackFunc: me._sysDictFieldCallback,
            callbackScope: me,
            editRef: refId,
            name: colMd.fieldName + "_dispalyValue",
          });
        } else if (parseInt(colMd.valueFrom) == 3) {
          // 引用其他码表
          // hiddenId用来在提交Form的时候向后台传递码表id
          const hiddenId = PCL.create("PCL.form.field.Hidden", {
            id: me.buildEditId(colMd.fieldName + "_hidden_id"),
            name: colMd.fieldName
          });
          result.push(hiddenId);
          PCL.apply(item, {
            name: colMd.fieldName + "display",
            fid: colMd.valueFromFid
          });
        }

        if (colMd.mustInput) {
          // 必录项
          PCL.apply(item, {
            allowBlank: false,
            blankText: "没有输入" + colMd.caption,
            beforeLabelTextTpl: PSI.Const.REQUIRED
          });
        }
        if (colMd.fieldName == "code") {
          // 处理自动编码
          if (autoCodeLength > 0 && me.adding) {
            PCL.apply(item, {
              xtype: "displayfield",
              value: "<span class='PSI-field-note'>保存后自动生成</span>"
            });
          }
        }

        result.push(item);
      }
    } // end of for

    return result;
  },

  /**
   * 保存
   * 
   * @private
   */
  _onOK(thenAdd) {
    const me = this;

    const md = me.getMetaData();
    const colsMd = md.cols;
    const colsCount = colsMd.length;
    for (let i = 0; i < colsCount; i++) {
      const colMd = colsMd[i];
      if (parseInt(colMd.valueFrom) == 3) {
        // 当前字段是引用其他码表，需要赋值id给对应的hidden
        const fieldName = colMd.fieldName;
        const hidden = PCL.getCmp(me.buildEditId(fieldName + "_hidden_id"));
        const editor = PCL.getCmp(me.buildEditId(fieldName));
        hidden.setValue(editor.getIdValue());
      }
    }

    const f = me.editForm;
    if (!f.isValid()) {
      return;
    }
    const el = f.getEl();
    el && el.mask(PSI.Const.SAVING);
    const sf = {
      url: me.URL("Home/CodeTableRuntime/editCodeTableRecord"),
      method: "POST",
      success(form, action) {
        me._lastId = action.result.id;

        el && el.unmask();

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
          me.focusOnFirstEdit();
        });
      }
    };
    f.submit(sf);
  },

  /**
   * @private
   */
  clearEdit() {
    const me = this;
    const md = me.getMetaData();
    const autoCodeLength = parseInt(md.autoCodeLength);

    for (let i = 0; i < md.cols.length; i++) {
      const colMd = md.cols[i];
      if (colMd.fieldName == "code" && autoCodeLength > 0) {
        continue;
      }

      if (colMd.isVisible) {
        const id = me.buildEditId(colMd.fieldName);
        const edit = PCL.getCmp(id);
        if (edit) {
          if (parseInt(colMd.valueFrom) == 2) {
            // 系统数据字典
            // TODO 字段默认值
          } else {
            edit.setValue(null);
            edit.clearInvalid();
          }
        }
      }
    }

    me.focusOnFirstEdit();
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
        parentForm.refreshMainGrid.apply(parentForm, [me._lastId]);
      }
    }
  },

  /**
   * @private
   */
  _onWndShow() {
    const me = this;
    const md = me.getMetaData();

    PCL.get(window).on('beforeunload', me.__onWindowBeforeUnload);

    const el = me.getEl();
    el && el.mask(PSI.Const.LOADING);
    me.ajax({
      url: me.URL("Home/CodeTableRuntime/recordInfo"),
      params: {
        id: me.adding ? null : me.getEntity().get("id"),
        fid: md.fid
      },
      callback(options, success, response) {
        if (success) {
          const data = me.decodeJSON(response.responseText);
          me.setDataForEdit(data);
        }

        el && el.unmask();
      }
    });
  },

  /**
   * @private
   */
  setDataForEdit(data) {
    const me = this;

    if (me.adding) {
      // 设置默认值
      if (data) {
        const md = me.getMetaData();
        md.cols.forEach(colMd => {
          const fieldName = colMd.fieldName;
          const id = me.buildEditId(fieldName);
          const edit = PCL.getCmp(id);
          if (edit) {
            const vf = parseInt(colMd.valueFrom);
            if (vf == 3) {
              // 码表
              edit.setValue(data[fieldName + "_display_value"]);
              edit.setIdValue(data[fieldName]);
            } if (vf == 2) {
              // 系统数据字典
              const refId = me.buildEditId(fieldName + "_hidden_id");
              const editRef = PCL.getCmp(refId);
              editRef.setValue(data[fieldName]);
              edit.setValue(data[fieldName + "_display_value"]);
              edit.setIdValue(data[fieldName]);
            } else {
              edit.setValue(data[fieldName]);
            }
          }
        });
      }

      me.focusOnFirstEdit();
      return;
    }

    // 下面的是编辑时候的业务逻辑

    if (!data) {
      return;
    }

    const md = me.getMetaData();
    for (let i = 0; i < md.cols.length; i++) {
      const colMd = md.cols[i];
      if (colMd.isVisible) {
        const fieldName = colMd.fieldName;
        let id = me.buildEditId(fieldName);

        let edit = PCL.getCmp(id);
        if (edit) {
          if (fieldName == "parent_id") {
            // hidden
            id = me.buildEditId("parent_id_hidden");
            edit = PCL.getCmp(id);
            if (edit) {
              edit.setValue(data["parent_id"]);
            }

            id = me.buildEditId("parent_id");
            edit = PCL.getCmp(id);
            if (edit) {
              edit.setValue(data["parent_id_value"]);
              edit.setIdValue(data["parent_id"]);
            }
          } else {
            if (parseInt(colMd.valueFrom) == 3) {
              // 码表
              edit.setValue(data[fieldName + "_display_value"]);
              edit.setIdValue(data[fieldName]);
            } if (parseInt(colMd.valueFrom) == 2) {
              // 系统数据字典
              const refId = me.buildEditId(fieldName + "_hidden_id");
              const editRef = PCL.getCmp(refId);
              editRef.setValue(data[fieldName]);
              edit.setValue(data[fieldName + "_display_value"]);
              edit.setIdValue(data[fieldName]);
            } else {
              edit.setValue(data[fieldName]);
            }
          }
        }
      }
    }

    me.focusOnFirstEdit();
  },

  /**
   * 把录入焦点设置到第一个input
   * 
   * @private
   */
  focusOnFirstEdit() {
    const me = this;
    const md = me.getMetaData();
    const autoCodeLength = parseInt(md.autoCodeLength);
    if (autoCodeLength > 0) {
      // 自动编码的时候，把焦点设置在name字段上
      const id = me.buildEditId("name");
      const edit = PCL.getCmp(id);
      if (edit) {
        edit.focus();
      }

      return;
    }

    // 把输入焦点设置为第一个可见的输入框
    for (let i = 0; i < md.cols.length; i++) {
      const colMd = md.cols[i];
      if (colMd.isVisible) {
        const id = me.buildEditId(colMd.fieldName);
        const edit = PCL.getCmp(id);
        if (edit) {
          edit.focus();
        }

        return;
      }
    }
  },

  /**
   * @private
   */
  buildEditId(fieldName) {
    const me = this;
    const md = me.getMetaData();
    return "PSI_CodeTable_RuntimeEditForm_edit_" + md.fid + "_" + fieldName;
  },

  /**
   * @private
   */
  _onEditSpecialKey(field, e) {
    const me = this;

    if (e.getKey() === e.ENTER) {
      const id = field.getId();

      const md = me.getMetaData();
      let currentEditIndex = -1;
      for (let i = 0; i < md.cols.length; i++) {
        const colMd = md.cols[i];
        if (id == me.buildEditId(colMd.fieldName)) {
          currentEditIndex = i;

          if (currentEditIndex == md.cols.length - 1) {
            // 是最后一个编辑框，这时候回车就提交Form
            me._onOK(me.adding);
            return;
          } else {
            continue;
          }
        }

        if (currentEditIndex > -1) {
          const nextEditId = me.buildEditId(colMd.fieldName);
          const edit = PCL.getCmp(nextEditId);
          if (edit) {
            me.setFocusAndCursorPosToLast(edit);
            return;
          }
        }
      }
    }
  },

  /**
   * 系统数据字典字段回调本函数
   * 
   * @private
   */
  _sysDictFieldCallback(data, scope, editRef) {
    const me = scope;

    let id = data ? data.get("id") : null;
    if (!id) {
      // TODO 这需要系统数据字典的默认值的code为0，这未必满足全部需要，需要再仔细考虑设计
      id = 0;
    }
    PCL.getCmp(editRef).setValue(id);
  }
});
