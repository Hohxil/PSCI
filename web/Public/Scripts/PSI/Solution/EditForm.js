/**
 * 新增或编辑解决方案
 * 
 * @author 艾格林门信息服务（大连）有限公司
 * @copyright 2015 - present
 * @license GPL v3
 */
PCL.define("PSI.Solution.EditForm", {
  extend: "PSI.AFX.Form.EditForm",

  /**
   * 初始化组件
   * 
   * @override
   */
  initComponent() {
    const me = this;
    const entity = me.getEntity();

    const t = entity == null ? "新建解决方案" : "编辑解决方案";

    const logoHtml = me.genLogoHtml(entity, t);
    const width1 = 300;
    PCL.apply(me, {
      header: {
        title: me.formatTitle(PSI.Const.PROD_NAME),
        height: 40
      },
      width: 650,
      height: 240,
      layout: "border",
      items: [{
        region: "north",
        border: 0,
        height: 70,
        html: logoHtml
      }, {
        region: "center",
        border: 0,
        id: "PSI_Solution_EditForm_editForm",
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
          labelWidth: 40,
          labelAlign: "right",
          labelSeparator: "",
          msgTarget: 'side',
          width: width1,
        },
        items: [{
          xtype: "hidden",
          name: "id",
          value: entity === null ? null : entity.get("id")
        }, {
          id: "PSI_Solution_EditForm_editCode",
          fieldLabel: "编码",
          allowBlank: false,
          blankText: "没有输入编码",
          beforeLabelTextTpl: PSI.Const.REQUIRED,
          name: "code",
          value: entity === null ? null : entity.get("code"),
          listeners: {
            specialkey: {
              fn: me.__onEditSpecialKey,
              scope: me
            }
          },
        }, {
          id: "PSI_Solution_EditForm_editName",
          fieldLabel: "名称",
          allowBlank: false,
          blankText: "没有输入名称",
          beforeLabelTextTpl: PSI.Const.REQUIRED,
          name: "name",
          value: entity === null ? null : entity.get("name"),
          listeners: {
            specialkey: {
              fn: me._onLastEditSpecialKey,
              scope: me
            }
          },
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
            const info = entity == null ? "新建解决方案" : "编辑解决方案";

            me.confirm(`请确认是否取消：${info}?`, () => {
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

    me.editName = PCL.getCmp("PSI_Solution_EditForm_editName");
    me.editCode = PCL.getCmp("PSI_Solution_EditForm_editCode");

    me.editForm = PCL.getCmp("PSI_Solution_EditForm_editForm");

    me.__editorList = [me.editCode, me.editName];
  },

  /**
   * @private
   */
  _onWndClose() {
    const me = this;

    PCL.get(window).un('beforeunload', me.__onWindowBeforeUnload);
  },

  /**
   * @private
   */
  _onWndShow() {
    const me = this;

    PCL.get(window).on('beforeunload', me.__onWindowBeforeUnload);

    me.setFocusAndCursorPosToLast(me.editCode);

    const entity = me.getEntity();
    if (entity === null) {
      return;
    }

    const el = me.getEl() || PCL.getBody();
    el.mask("数据加载中...");
    me.ajax({
      url: me.URL("Home/Solution/solutionInfo"),
      params: {
        id: entity.get("id")
      },
      callback(options, success, response) {
        el.unmask();
        if (success) {
          const { code, name } = me.decodeJSON(response.responseText);
          me.editCode.setValue(code);
          me.editName.setValue(name);
        }
      }
    });
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
      url: me.URL("Home/Solution/editSolution"),
      method: "POST",
      success(form, action) {
        el.unmask();
        me.close();
        me.getParentForm().refreshMainGrid(action.result.id);
        me.tip("操作成功", true);
      },
      failure(form, action) {
        el.unmask();
        me.showInfo(action.result.msg, () => {
          me.setFocusAndCursorPosToLast(me.editCode);
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
