/**
 * 选择数据域
 * 
 * @author 艾格林门信息服务（大连）有限公司
 * @copyright 2015 - present
 * @license GPL v3
 */
PCL.define("PSI.Permission.SelectDataOrgForm", {
  extend: "PSI.AFX.Form.EditForm",

  config: {
    // 出现parentForm和editForm
    // 是因为本窗体用在了PSI.Permission.EditForm和PSI.Permission.SelectPermissionForm中
    // 这两处，各自都需要回调，所以用了两个config
    // 这是很糟糕的设计
    parentForm: null,
    /**
     * editForm: PSI.Permission.EditForm
     */
    editForm: null
  },

  width: 600,
  height: 500,
  modal: true,
  layout: "fit",

  /**
   * @override
   */
  initComponent() {
    const me = this;

    PCL.apply(me, {
      header: {
        height: 40,
        title: me.formatTitle("选择数据域")
      },
      items: [me.getMainGrid()],
      buttons: [{
        text: "选择所有的公司",
        handler: me._onAllCompany,
        scope: me
      }, "->", {
        text: "把数据域设置为[本人数据]",
        handler: me._onSetSelf,
        scope: me
      }, {
        text: "确定",
        formBind: true,
        iconCls: "PSI-button-ok",
        handler: me._onOK,
        scope: me
      }, {
        text: "取消",
        handler() {
          me.close();
        },
        scope: me
      }],
      listeners: {
        show: {
          fn: me._onWndShow,
          scope: me
        }
      }
    });

    me.callParent(arguments);
  },

  /**
   * @private
   */
  _onWndShow() {
    const me = this;
    const store = me.getMainGrid().getStore();

    const el = me.getEl() || PCL.getBody();
    el.mask("数据加载中...");
    PCL.Ajax.request({
      url: PSI.Const.BASE_URL
        + "Home/Permission/selectDataOrg",
      params: {},
      method: "POST",
      callback(options, success, response) {
        if (success) {
          const data = PCL.JSON.decode(response.responseText);
          store.add(data);
        }

        el.unmask();
      }
    });
  },

  /**
   * @private
   */
  _onOK() {
    const me = this;
    const grid = me.getMainGrid();

    const items = grid.getSelectionModel().getSelection();
    if (items == null || items.length == 0) {
      PSI.MsgBox.showInfo("没有选择数据域");

      return;
    }

    const fullNameList = [];
    const dataOrgList = [];
    for (let i = 0; i < items.length; i++) {
      const it = items[i];
      fullNameList.push(it.get("fullName"));
      dataOrgList.push(it.get("dataOrg"));
    }

    if (me.getParentForm()) {
      me.getParentForm().setDataOrgList(fullNameList.join(";"),
        dataOrgList.join(";"));
    }

    const editForm = me.getEditForm();
    if (editForm) {
      editForm.getEl().mask("数据域更改中...");
      PCL.Function.defer(() => {
        editForm.onEditDataOrgCallback.apply(editForm, [dataOrgList.join(";")]);
        editForm.getEl().unmask();
      }, 100);
    }

    me.close();
  },

  /**
   * @private
   */
  getMainGrid() {
    const me = this;
    if (me.__mainGrid) {
      return me.__mainGrid;
    }

    const modelName = "PSIModel.PSI.Permission.SelectDataOrgForm.DataOrgModel";
    PCL.define(modelName, {
      extend: "PCL.data.Model",
      fields: ["id", "fullName", "dataOrg"]
    });

    const store = PCL.create("PCL.data.Store", {
      model: modelName,
      autoLoad: false,
      data: []
    });

    me.__mainGrid = PCL.create("PCL.grid.Panel", {
      cls: "PSI-HL",
      padding: 5,
      selModel: {
        mode: "MULTI"
      },
      selType: "checkboxmodel",
      store: store,
      columnLines: true,
      columns: [{
        header: "组织机构",
        dataIndex: "fullName",
        flex: 2,
        menuDisabled: true
      }, {
        header: "数据域",
        dataIndex: "dataOrg",
        flex: 1,
        menuDisabled: true
      }]
    });

    return me.__mainGrid;
  },

  /**
   * 把数据域设置为本人数据
   * 
   * @private
   */
  _onSetSelf() {
    const me = this;
    if (me.getParentForm()) {
      me.getParentForm().setDataOrgList("[本人数据]", "#");
    }

    const editForm = me.getEditForm();
    if (editForm) {
      editForm.getEl().mask("数据域更改中...");
      PCL.Function.defer(() => {
        me.getEditForm().onEditDataOrgCallback("#");
        editForm.getEl().unmask();
      }, 100);
    }


    me.close();
  },

  /**
   * 选择所有的公司
   * 
   * @private
   */
  _onAllCompany() {
    const me = this;

    const m = me.getMainGrid().getSelectionModel();
    const store = me.getMainGrid().getStore();
    m.deselectAll();
    for (let i = 0; i < store.getCount(); i++) {
      const record = store.getAt(i);
      if (record.get("dataOrg").length == 2) {
        m.select(i, true, true);
      }
    }

    me._onOK();
  }
});
