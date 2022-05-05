/**
 * 业务设置 - 主窗体
 * 
 * @author 艾格林门信息服务（大连）有限公司
 * @copyright 2015 - present
 * @license GPL v3
 */
PCL.define("PSI.BizConfig.MainForm", {
  extend: "PSI.AFX.Form.MainForm",

  /**
   * @override
   */
  initComponent() {
    const me = this;

    PCL.apply(me, {
      border: 0,
      layout: "border",
      tbar: me.getToolbarCmp(),
      items: [{
        region: "north",
        border: 0,
        height: 2,
      }, {
        region: "center",
        xtype: "panel",
        layout: "fit",
        border: 0,
        items: [me.getMainGrid()]
      }]
    });

    me.callParent();

    me.comboCompany = PCL.getCmp("comboCompany");

    me.queryCompany();
  },

  /**
   * @private
   */
  getMainGrid() {
    const me = this;
    if (me._mainGrid) {
      return me._mainGrid;
    }

    const modelName = "PSIModel.PSI.BizConfig.MainForm.BizConfig";
    PCL.define(modelName, {
      extend: "PCL.data.Model",
      fields: ["id", "name", "value", "displayValue",
        "note"],
      idProperty: "id"
    });
    const store = PCL.create("PCL.data.Store", {
      model: modelName,
      data: [],
      autoLoad: false
    });

    me._mainGrid = PCL.create("PCL.grid.Panel", {
      cls: "PSI-FC",
      viewConfig: {
        enableTextSelection: true
      },
      loadMask: true,
      border: 1,
      columnLines: true,
      columns: [PCL.create("PCL.grid.RowNumberer", {
        text: "#",
        width: 40
      }), {
        text: "设置项",
        dataIndex: "name",
        width: 250,
        menuDisabled: true
      }, {
        text: "值",
        dataIndex: "displayValue",
        width: 500,
        menuDisabled: true
      }, {
        text: "备注",
        dataIndex: "note",
        width: 500,
        menuDisabled: true
      }],
      store: store,
      listeners: {
        itemdblclick: {
          fn: me._onEdit,
          scope: me
        }
      }
    });

    return me._mainGrid;
  },

  /**
   * @private
   */
  getToolbarCmp() {
    const me = this;
    const modelName = "PSIModel.PSI.BizConfig.MainForm.Company";
    PCL.define(modelName, {
      extend: "PCL.data.Model",
      fields: ["id", "name"]
    });
    return [{
      cls: "PSI-toolbox",
      xtype: "combobox",
      id: "comboCompany",
      queryMode: "local",
      editable: false,
      valueField: "id",
      displayField: "name",
      store: PCL.create("PCL.data.Store", {
        model: modelName,
        autoLoad: false,
        data: []
      }),
      width: 500,
      listeners: {
        select: {
          fn: me._onComboCompanySelect,
          scope: me
        }
      }
    }, {
      text: "设置",
      handler: me._onEdit,
      scope: me
    }, "-", {
      text: "指南",
      handler() {
        me.focus();
        window.open(me.URL("/Home/Help/index?t=bizconfig"));
      }
    }, "-", {
      text: "关闭",
      handler() {
        me.closeWindow();
      }
    }];
  },

  /**
   * 设置按钮被单击
   */
  _onEdit() {
    const me = this;

    const companyId = me.comboCompany.getValue();
    if (!companyId) {
      me.showInfo("没有选择要设置的公司");
      return;
    }

    const form = PCL.create("PSI.BizConfig.EditForm", {
      parentForm: me,
      companyId: companyId
    });
    form.show();
  },

  /**
   * 查询公司信息
   */
  queryCompany() {
    const me = this;
    const el = PCL.getBody();
    const comboCompany = me.comboCompany;
    const store = comboCompany.getStore();
    el.mask(PSI.Const.LOADING);
    const r = {
      url: me.URL("Home/BizConfig/getCompany"),
      callback(options, success, response) {
        store.removeAll();

        if (success) {
          const data = me.decodeJSON(response.responseText);
          store.add(data);
          if (data.length > 0) {
            comboCompany.setValue(data[0]["id"]);
            me.refreshGrid();
          }
        }

        el.unmask();
      }
    };
    me.ajax(r);
  },

  _onComboCompanySelect() {
    const me = this;

    me.refreshGrid();
  },

  /**
   * @private
   */
  refreshGrid() {
    const me = this;
    const grid = me.getMainGrid();
    const el = grid.getEl() || Ext.getBody();
    el.mask(PSI.Const.LOADING);
    const r = {
      url: me.URL("Home/BizConfig/allConfigs"),
      params: {
        companyId: me.comboCompany.getValue()
      },
      callback(options, success, response) {
        const store = grid.getStore();

        store.removeAll();

        if (success) {
          const data = me.decodeJSON(response.responseText);
          store.add(data);
        }

        el.unmask();
      }
    };
    me.ajax(r);
  },
});
