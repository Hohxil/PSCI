/**
 * 主菜单维护 - 新增或编辑界面
 * 
 * @author 艾格林门信息服务（大连）有限公司
 * @copyright 2015 - present
 * @license GPL v3
 */
PCL.define("PSI.MainMenu.MenuItemEditForm", {
  extend: "PSI.AFX.Form.EditForm",

  /**
   * 初始化组件
   * 
   * @override
   */
  initComponent() {
    const me = this;

    const entity = me.getEntity();

    me.adding = entity == null;

    const buttons = [];

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
        const info = !me.getEntity() ? "新建菜单项" : "编辑菜单项";
        me.confirm(`请确认是否取消： ${info} ?`,
          () => {
            me.close();
          });
      },
      scope: me
    };
    buttons.push(btn);

    const t = entity == null ? "新增菜单项" : "编辑菜单项";
    const logoHtml = me.genLogoHtml(entity, t);
    PCL.apply(me, {
      header: {
        title: me.formatTitle(PSI.Const.PROD_NAME),
        height: 40
      },
      width: 650,
      height: 280,
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
        id: "PSI_MainMenu_MenuItemEditForm_editForm",
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
          msgTarget: 'side',
          width: 290,
          margin: "5"
        },
        items: [{
          xtype: "hidden",
          name: "id",
          value: entity == null ? null : entity.get("id")
        }, {
          id: "PSI_MainMenu_MenuItemEditForm_editFid",
          fieldLabel: "fid",
          xtype: "psi_fidfield",
          allowBlank: false,
          showModal: true,
          blankText: "没有输入fid",
          beforeLabelTextTpl: PSI.Const.REQUIRED,
          listeners: {
            specialkey: {
              fn: me.__onEditSpecialKey,
              scope: me
            }
          },
          callbackFunc: me.fidCallbackFunc,
          callbackScope: me
        }, {
          id: "PSI_MainMenu_MenuItemEditForm_hiddenFid",
          name: "fid",
          xtype: "hidden"
        }, {
          id: "PSI_MainMenu_MenuItemEditForm_editCaption",
          fieldLabel: "菜单标题",
          allowBlank: false,
          blankText: "没有输入菜单标题",
          beforeLabelTextTpl: PSI.Const.REQUIRED,
          name: "caption",
          listeners: {
            specialkey: {
              fn: me.__onEditSpecialKey,
              scope: me
            }
          }
        }, {
          id: "PSI_MainMenu_MenuItemEditForm_editParentMenu",
          xtype: "psi_menuitemfield",
          fieldLabel: "上级菜单",
          allowBlank: false,
          blankText: "没有输入上级菜单",
          showModal: true,
          beforeLabelTextTpl: PSI.Const.REQUIRED,
          listeners: {
            specialkey: {
              fn: me.__onEditSpecialKey,
              scope: me
            }
          }
        }, {
          id: "PSI_MainMenu_MenuItemEditForm_hiddenParentMenuId",
          name: "parentMenuId",
          xtype: "hidden"
        }, {
          id: "PSI_MainMenu_MenuItemEditForm_editShowOrder",
          xtype: "numberfield",
          fieldLabel: "显示排序",
          hideTrigger: true,
          allowDecimals: false,
          allowBlank: false,
          blankText: "没有输入显示排序",
          beforeLabelTextTpl: PSI.Const.REQUIRED,
          name: "showOrder",
          listeners: {
            specialkey: {
              fn: me._onLastEditSpecialKey,
              scope: me
            }
          }
        }],
        buttons
      }]
    });

    me.callParent(arguments);

    me.editForm = PCL.getCmp("PSI_MainMenu_MenuItemEditForm_editForm");

    me.editFid = PCL.getCmp("PSI_MainMenu_MenuItemEditForm_editFid");
    me.editCaption = PCL.getCmp("PSI_MainMenu_MenuItemEditForm_editCaption");
    me.editParentMenu = PCL.getCmp("PSI_MainMenu_MenuItemEditForm_editParentMenu");
    me.editShowOrder = PCL.getCmp("PSI_MainMenu_MenuItemEditForm_editShowOrder");
    me.hiddenFid = PCL.getCmp("PSI_MainMenu_MenuItemEditForm_hiddenFid");
    me.hiddenParentMenuId = PCL.getCmp("PSI_MainMenu_MenuItemEditForm_hiddenParentMenuId");
    me.__editorList = [me.editFid, me.editCaption, me.editParentMenu, me.editShowOrder];
  },

  /**
   * 保存
   * 
   * @private
   */
  _onOK() {
    const me = this;

    me.hiddenFid.setValue(me.editFid.getIdValue());
    me.hiddenParentMenuId.setValue(me.editParentMenu.getIdValue());

    const f = me.editForm;
    const el = f.getEl();
    el.mask(PSI.Const.SAVING);
    const sf = {
      url: me.URL("Home/MainMenu/editMenuItem"),
      method: "POST",
      success(form, action) {
        me.__lastId = action.result.id;

        el.unmask();

        me.tip("数据保存成功", true);
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

    if (me.__lastId) {
      const parentForm = me.getParentForm();
      if (parentForm) {
        parentForm.refreshMainGrid.apply(parentForm, [me.__lastId]);
      }
    }
  },

  /**
   * @private
   */
  _onWndShow() {
    const me = this;

    PCL.get(window).on('beforeunload', me.__onWindowBeforeUnload);

    me.editFid.focus();

    const entity = me.getEntity();
    if (entity === null) {
      return;
    }

    const el = me.getEl();
    el && el.mask("数据加载中...");
    const r = {
      url: me.URL("Home/MainMenu/menuItemInfo"),
      params: {
        id: entity.get("id")
      },
      callback(options, success, response) {
        el && el.unmask();
        if (success) {
          const data = me.decodeJSON(response.responseText);
          me.editFid.setIdValue(data.fid);
          me.editFid.setValue(data.fidName);
          me.editCaption.setValue(data.caption);
          me.editParentMenu.setIdValue(data.parentMenuId);
          me.editParentMenu.setValue(data.parentMenuCaption);
          me.editShowOrder.setValue(data.showOrder);
        }
      }
    };

    me.ajax(r);
  },

  /**
   * 自定义字段psi_fidfield(web\Public\Scripts\PSI\Fid\FidField.js)回调本方法
   * 
   * @public
   */
  fidCallbackFunc(data, scope) {
    const me = scope;

    if (!me.editCaption.getValue()) {
      me.editCaption.setValue(data.get("name"));
    }
  }
});
