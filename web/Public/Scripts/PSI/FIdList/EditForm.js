/**
 * FId - 编辑界面
 * 
 * @author 艾格林门信息服务（大连）有限公司
 * @copyright 2015 - present
 * @license GPL v3
 */
PCL.define("PSI.FIdList.EditForm", {
  extend: "PSI.AFX.Form.EditForm",

  /**
   * 初始化组件
   * 
   * @override
   */
  initComponent() {
    const me = this;

    const entity = me.getEntity();

    const buttons = [];

    buttons.push({
      text: "保存",
      formBind: true,
      iconCls: "PSI-button-ok",
      handler() {
        me._onOK();
      },
      scope: me
    });

    buttons.push({
      text: "取消",
      handler() {
        const info = "编辑FId";

        me.confirm(`请确认是否取消：${info}?`, () => {
          me.close();
        });
      },
      scope: me
    });

    const t = "编辑FId";
    const logoHtml = me.genLogoHtml(entity, t);
    PCL.apply(me, {
      header: {
        title: me.formatTitle(PSI.Const.PROD_NAME),
        height: 40
      },
      width: 650,
      height: 340,
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
        id: "PSI_FIdList_EditForm_editForm",
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
          labelWidth: 50,
          labelAlign: "right",
          labelSeparator: "",
          msgTarget: 'side',
          width: 600,
          margin: "5"
        },
        items: [{
          xtype: "hidden",
          name: "fid",
          value: entity.get("fid")
        }, {
          xtype: "displayfield",
          fieldLabel: "fid",
          value: `<span class='PSI-field-note'>${entity.get("fid")}</span>`
        }, {
          xtype: "displayfield",
          fieldLabel: "名称",
          value: `<span class='PSI-field-note'>${entity.get("name")}</span>`
        }, {
          id: "PSI_FIdList_EditForm_editCode",
          fieldLabel: "编码",
          name: "code",
          value: entity.get("code"),
          listeners: {
            specialkey: {
              fn: me.__onEditSpecialKey,
              scope: me
            }
          }
        }, {
          id: "PSI_FIdList_EditForm_editPY",
          fieldLabel: "助记码",
          allowBlank: false,
          blankText: "没有输入助记码",
          beforeLabelTextTpl: PSI.Const.REQUIRED,
          name: "py",
          value: entity.get("py"),
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

    me.editForm = PCL.getCmp("PSI_FIdList_EditForm_editForm");

    me.editCode = PCL.getCmp("PSI_FIdList_EditForm_editCode");
    me.editPY = PCL.getCmp("PSI_FIdList_EditForm_editPY");

    me.__editorList = [me.editCode, me.editPY];
  },

  /**
   * 保存
   * 
   * @private
   */
  _onOK() {
    const me = this;
    const f = me.editForm;
    const el = f.getEl();
    el.mask(PSI.Const.SAVING);
    const sf = {
      url: me.URL("Home/FIdList/editFId"),
      method: "POST",
      success(form, action) {
        me._lastId = action.result.id;
        el.unmask();

        me.tip("数据保存成功", true);
        me.focus();
        me.close();
      },
      failure(form, action) {
        el.unmask();
        me.showInfo(action.result.msg, () => {
          me.editCode.focus();
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

    PCL.get(window).on('beforeunload', me.__onWindowBeforeUnload);

    const editCode = me.editCode;
    me.setFocusAndCursorPosToLast(editCode);
  }
});
