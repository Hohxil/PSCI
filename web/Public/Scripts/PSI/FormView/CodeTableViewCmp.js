/**
 * 码表视图自定义控件
 * 
 * @author 艾格林门信息服务（大连）有限公司
 * @copyright 2015 - present
 * @license GPL v3
 */
Ext.define("PSI.FormView.CodeTableViewCmp", {
  extend: "Ext.panel.Panel",
  alias: "widget.psi_codetable_view_cmp",

  config: {
    fid: null
  },

  /**
   * @override
   */
  initComponent() {
    const me = this;

    Ext.apply(me, {
      layout: "fit",
      border: 0,
      items: [me.getMainGrid()]
    });

    me.callParent(arguments);
  },

  /**
   * @private
   */
  getMainGrid() {
    const me = this;

    if (me._mainGrid) {
      return me._mainGrid;
    }

    const modelName = "PSICodeTableViewCmp" + Ext.id();

    Ext.define(modelName, {
      extend: "Ext.data.Model",
      fields: ["id"]
    });

    me._mainGrid = Ext.create("Ext.grid.Panel", {
      cls: "PSI",
      viewConfig: {
        enableTextSelection: true
      },
      columnLines: true,
      columns: [{
        header: "编码",
        dataIndex: "code",
        menuDisabled: true,
        sortable: false
      }],
      store: Ext.create("Ext.data.Store", {
        model: modelName,
        autoLoad: false,
        data: []
      })
    });

    return me._mainGrid;
  }
});
