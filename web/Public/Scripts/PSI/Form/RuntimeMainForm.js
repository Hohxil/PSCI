/**
 * 自定义表单运行- 主界面
 * 
 * @author 艾格林门信息服务（大连）有限公司
 * @copyright 2015 - present
 * @license GPL v3
 */
Ext.define("PSI.Form.RuntimeMainForm", {
  extend: "PSI.AFX.Form.MainForm",
  border: 0,

  config: {
    fid: null
  },

  /**
   * @override
   */
  initComponent() {
    const me = this;

    Ext.apply(me, {
      tbar: {
        id: "PSI_Form_RuntimeMainForm_toolBar",
        xtype: "toolbar"
      },
      layout: "border",
      items: [{
        region: "north",
        id: "PSI_Form_RuntimeMainForm_panelMain",
        layout: "fit",
        split: true,
        height: "40%",
        border: 0,
        items: []
      }, {
        region: "center",
        id: "PSI_Form_RuntimeMainForm_panelDetail",
        layout: "fit",
        border: 0,
        items: []
      }]
    });

    me.callParent(arguments);

    me._toolBar = Ext.getCmp("PSI_Form_RuntimeMainForm_toolBar");
    me._panelMain = Ext.getCmp("PSI_Form_RuntimeMainForm_panelMain");
    me._panelDetail = Ext.getCmp("PSI_Form_RuntimeMainForm_panelDetail");

    me.fetchMeatData();
  },

  /**
   * @private
   */
  getMetaData() {
    return this._md;
  },

  /**
   * @private
   */
  fetchMeatData() {
    const me = this;
    const el = me.getEl();
    el && el.mask(PSI.Const.LOADING);
    me.ajax({
      url: me.URL("Home/Form/getMetaDataForRuntime"),
      params: {
        fid: me.getFid()
      },
      callback(options, success, response) {
        if (success) {
          const data = me.decodeJSON(response.responseText);

          me._md = data;

          me.initUI();
        }

        el && el.unmask();
      }
    });
  },

  /**
   * @private
   */
  initUI() {
    const me = this;

    const md = me.getMetaData();
    if (!md) {
      return;
    }

    const name = md.name;
    if (!name) {
      return;
    }

    // 按钮
    const toolBar = me._toolBar;
    toolBar.add([{
      text: "新增" + name,
      id: "buttonAddFormRecord",
      handler: me._onAddFormRecord,
      scope: me
    }, {
      text: "编辑" + name,
      id: "buttonEditFormRecord",
      handler: me._onEditFormRecord,
      scope: me
    }, {
      text: "删除" + name,
      id: "buttonDeleteFormRecord",
      handler: me._onDeleteFormRecord,
      scope: me
    }, "-", , {
      text: "关闭",
      handler() {
        me.closeWindow();
      }
    }]);

    me._mainGrid = me.createMainGrid(md);
    me._panelMain.add(me._mainGrid);

    // 明细表
    if (md.details.length > 1) {
      // 多个明细表
    } else {
      // 一个明细表
      me._detailGrid = me.createDetailGrid(md.details[0]);
      me._panelDetail.add(me._detailGrid);
    }
  },

  /**
   * @private
   */
  createMainGrid(md) {
    const modelName = "PSIFormRuntime_" + Ext.id();

    const fields = [];
    const cols = [];
    const colsLength = md.cols.length;
    for (let i = 0; i < colsLength; i++) {
      const mdCol = md.cols[i];

      fields.push(mdCol.dataIndex);

      cols.push({
        header: mdCol.caption,
        dataIndex: mdCol.dataIndex,
        width: parseInt(mdCol.widthInView),
        menuDisabled: true,
        sortable: false
      });
    }

    Ext.define(modelName, {
      extend: "Ext.data.Model",
      fields: fields
    });

    return Ext.create("Ext.grid.Panel", {
      cls: "PSI",
      viewConfig: {
        enableTextSelection: true
      },
      columnLines: true,
      border: 0,
      columns: cols,
      store: Ext.create("Ext.data.Store", {
        model: modelName,
        autoLoad: false,
        data: []
      })
    });
  },

  /**
   * @private
   */
  createDetailGrid(md) {
    const modelName = "PSIFormRuntime_Detail_" + Ext.id();

    const fields = [];
    const cols = [];
    const colsLength = md.cols.length;
    for (let i = 0; i < colsLength; i++) {
      const mdCol = md.cols[i];

      fields.push(mdCol.dataIndex);

      cols.push({
        header: mdCol.caption,
        dataIndex: mdCol.dataIndex,
        width: parseInt(mdCol.widthInView),
        menuDisabled: true,
        sortable: false
      });
    }

    Ext.define(modelName, {
      extend: "Ext.data.Model",
      fields: fields
    });

    return Ext.create("Ext.grid.Panel", {
      cls: "PSI",
      viewConfig: {
        enableTextSelection: true
      },
      columnLines: true,
      border: 0,
      columns: cols,
      store: Ext.create("Ext.data.Store", {
        model: modelName,
        autoLoad: false,
        data: []
      })
    });
  },

  /**
   * @private
   */
  _onAddFormRecord() {
    const me = this;
    me.showInfo("TODO");
  },

  /**
   * @private
   */
  _onEditFormRecord() {
    const me = this;
    me.showInfo("TODO");
  },

  /**
   * @private
   */
  _onDeleteFormRecord() {
    const me = this;
    me.showInfo("TODO");
  }
});
