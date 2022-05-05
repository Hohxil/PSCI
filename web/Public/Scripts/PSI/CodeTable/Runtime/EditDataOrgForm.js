/**
 * 码表运行 - 修改数据域
 * 
 * @author 艾格林门信息服务（大连）有限公司
 * @copyright 2015 - present
 * @license GPL v3
 */
PCL.define("PSI.CodeTable.Runtime.EditDataOrgForm", {
  extend: "PSI.AFX.Form.EditForm",

  config: {
    fid: "",
  },

  /**
   * 初始化组件
   * 
   * @override
   */
  initComponent() {
    const me = this;

    const entity = me.getEntity();

    const buttons = [{
      text: "数据域应用详解",
      iconCls: "PSI-help",
      handler: function () {
        const url = me.URL("Home/Help/index?t=dataOrg")
        window.open(url);
      }
    }, "->"];

    let btn = {
      text: "保存",
      formBind: true,
      iconCls: "PSI-button-ok",
      handler() {
        me._onOK(false);
      },
      scope: me
    };
    buttons.push(btn);

    btn = {
      text: "取消",
      handler() {
        me.close();
      },
      scope: me
    };
    buttons.push(btn);

    const logoHtml = `
      <img style='float:left;margin:0px 10px 0px 20px;width:48px;height:48px;' 
        src='${PSI.Const.BASE_URL}Public/Images/edit-form-data.png'></img>
      <h2 style='color:#196d83;margin-top:0px;'>修改数据域</h2>
      <p style='color:#196d83'>点击帮助按钮可以了解更多数据域的应用场景</p>
      <div style='margin:0px;border-bottom:1px solid #e6f7ff;height:1px' /></div>
      `;

    const width2 = 460;
    PCL.apply(me, {
      header: {
        title: me.formatTitle(PSI.Const.PROD_NAME),
        height: 40
      },
      modal: true,
      resizable: false,
      onEsc: PCL.emptyFn,
      width: 500,
      height: 350,
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
        id: "PSI_CodeTable_Runtime_EditDataOrgForm_editForm",
        xtype: "form",
        layout: {
          type: "table",
          columns: 1,
          tableAttrs: PSI.Const.TABLE_LAYOUT,
        },
        height: "100%",
        bodyPadding: 5,
        fieldDefaults: {
          labelWidth: 60,
          labelAlign: "right",
          labelSeparator: "",
          msgTarget: 'side',
          width: width2,
        },
        items: [{
          id: "PSI_CodeTable_Runtime_EditDataOrgForm_editId",
          xtype: "hidden",
          value: entity.get("id")
        }, {
          fieldLabel: "编码",
          xtype: "displayfield",
          value: me.toFieldNoteText(entity.get("code"))
        }, {
          fieldLabel: "名称",
          xtype: "displayfield",
          value: me.toFieldNoteText(entity.get("name"))
        }, {
          fieldLabel: "原数据域",
          xtype: "displayfield",
          value: me.toFieldNoteText(entity.get("data_org")),
          id: "PSI_CodeTable_Runtime_EditDataOrgForm_editOldDataOrg",
        }, {
          id: "PSI_CodeTable_Runtime_EditDataOrgForm_editDataOrg",
          fieldLabel: "新数据域",
          name: "dataOrg",
          allowBlank: false,
          blankText: "没有输入新数据域",
          beforeLabelTextTpl: PSI.Const.REQUIRED,
          xtype: "psi_selectuserdataorgfield",
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

    me.editForm = PCL.getCmp("PSI_CodeTable_Runtime_EditDataOrgForm_editForm");

    me.editId = PCL.getCmp("PSI_CodeTable_Runtime_EditDataOrgForm_editId");
    me.editOldDataOrg = PCL.getCmp("PSI_CodeTable_Runtime_EditDataOrgForm_editOldDataOrg");
    me.editDataOrg = PCL.getCmp("PSI_CodeTable_Runtime_EditDataOrgForm_editDataOrg");
  },

  /**
   * 保存
   * 
   * @private
   */
  _onOK() {
    const me = this;

    const oldDataOrg = me.editOldDataOrg.getValue();
    const newDataOrg = me.editDataOrg.getValue();
    if (!newDataOrg) {
      me.showInfo("没有输入新数据域", () => {
        me.editDataOrg.focus();
      });

      return;
    }
    if (oldDataOrg == newDataOrg) {
      me.showInfo("数据域没有变动，不用保存");

      return;
    }

    const f = me.editForm;
    const el = f.getEl();
    el.mask(PSI.Const.SAVING);

    const r = {
      url: me.URL("Home/CodeTableRuntime/editDataOrg"),
      params: {
        id: me.editId.getValue(),
        fid: me.getFid(),
        dataOrg: newDataOrg
      },
      callback(options, success, response) {
        el.unmask();
        if (success) {
          const data = me.decodeJSON(response.responseText);
          if (data.success) {
            me._lastId = data.id;
            me.tip("成功修改数据域", true);
            me.close();
          } else {
            me.showInfo(data.msg, () => {
              me.editDataOrg.focus();
            });
          }
        } else {
          me.showInfo("网络错误");
        }
      }
    };

    me.ajax(r);
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
        me.getParentForm().refreshMainGrid.apply(parentForm, [me._lastId]);
      }
    }
  },

  /**
   * @private
   */
  _onWndShow() {
    const me = this;

    PCL.get(window).on('beforeunload', me.__onWindowBeforeUnload);

    me.editDataOrg.focus();
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
});
