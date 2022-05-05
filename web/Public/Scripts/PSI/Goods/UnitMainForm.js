/**
 * 物料计量单位 - 主界面
 * 
 * @author 艾格林门信息服务（大连）有限公司
 * @copyright 2015 - present
 * @license GPL v3
 */
PCL.define("PSI.Goods.UnitMainForm", {
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

    me.refreshGrid();
  },

  /**
   * @private
   */
  getToolbarCmp() {
    const me = this;
    return [{
      text: "新建计量单位",
      handler: me._onAddUnit,
      scope: me
    }, "-", {
      text: "编辑计量单位",
      handler: me._onEditUnit,
      scope: me
    }, "-", {
      text: "删除计量单位",
      handler: me._onDeleteUnit,
      scope: me
    }, "-", {
      text: "指南",
      handler() {
        me.focus();
        window.open(me.URL("Home/Help/index?t=goodsUnit"));
      }
    }, "-", {
      text: "关闭",
      handler() {
        me.closeWindow();
      }
    }];
  },

  /**
   * @private
   */
  getMainGrid() {
    const me = this;
    if (me._mainGrid) {
      return me._mainGrid;
    }

    const modelName = "PSIModel.PSI.Goods.UnitMainForm.GoodsUnit";
    PCL.define(modelName, {
      extend: "PCL.data.Model",
      fields: ["id", "name", "goodsCount", "goodsEnabledCount",
        "goodsDisabledCount", "code", "recordStatus"]
    });

    me._mainGrid = PCL.create("PCL.grid.Panel", {
      cls: "PSI-FC",
      border: 1,
      columnLines: true,
      columns: {
        defaults: {
          menuDisabled: true,
          sortable: false
        },
        items: [{
          xtype: "rownumberer",
          width: 40,
          header: "#"
        }, {
          header: "编码",
          dataIndex: "code",
          renderer(value, metaData, record) {
            if (parseInt(record.get("recordStatus")) == 1) {
              return value;
            } else {
              return `<span class="PSI-record-disabled">${value}</span>`;
            }
          }
        }, {
          header: "物料计量单位",
          dataIndex: "name",
          width: 200,
          renderer(value, metaData, record) {
            if (parseInt(record.get("recordStatus")) == 1) {
              return value;
            } else {
              return `<span class="PSI-record-disabled">${value}</span>`;
            }
          }
        }, {
          header: "状态",
          dataIndex: "recordStatus",
          renderer(value, metaData, record) {
            if (parseInt(record.get("recordStatus")) == 1) {
              return "启用";
            } else {
              return "<span style='color:red;'>停用</span>";
            }
          }
        }, {
          header: "使用该计量单位的物料数",
          align: "right",
          width: 180,
          columns: [{
            header: "启用状态物料数",
            dataIndex: "goodsEnabledCount",
            align: "right",
            menuDisabled: true,
            sortable: false,
            width: 120

          }, {
            header: "停用状态物料数",
            dataIndex: "goodsDisabledCount",
            align: "right",
            menuDisabled: true,
            sortable: false,
            width: 120

          }, {
            header: "物料总数",
            dataIndex: "goodsCount",
            align: "right",
            menuDisabled: true,
            sortable: false
          }]
        }]
      },
      store: PCL.create("PCL.data.Store", {
        model: modelName,
        autoLoad: false,
        data: []
      }),
      listeners: {
        itemdblclick: {
          fn: me._onEditUnit,
          scope: me
        }
      }
    });

    return me._mainGrid;
  },

  /**
   * @private
   */
  refreshGrid(id) {
    const me = this;
    const grid = me.getMainGrid();
    const el = grid.getEl() || Ext.getBody();
    el.mask(PSI.Const.LOADING);
    const r = {
      url: me.URL("Home/Goods/allUnits"),
      callback(options, success, response) {
        const store = grid.getStore();

        store.removeAll();

        if (success) {
          const data = me.decodeJSON(response.responseText);
          store.add(data);
        }

        me.gotoGridRecord(id);

        el.unmask();
      }
    };
    me.ajax(r);
  },

  /**
   * @private
   */
  gotoGridRecord(id) {
    const me = this;
    const grid = me.getMainGrid();
    const store = grid.getStore();
    if (id) {
      const r = store.findExact("id", id);
      if (r != -1) {
        grid.getSelectionModel().select(r);
      } else {
        grid.getSelectionModel().select(0);
      }
    }
  },

  /**
   * 新建计量单位
   * 
   * @private
   */
  _onAddUnit() {
    const me = this;
    const form = PCL.create("PSI.Goods.UnitEditForm", {
      parentForm: me
    });

    form.show();
  },

  /**
   * 编辑计量单位
   * 
   * @private
   */
  _onEditUnit() {
    const me = this;

    const item = me.getMainGrid().getSelectionModel().getSelection();
    if (item == null || item.length != 1) {
      me.showInfo("请选择要编辑的计量单位");
      return;
    }

    const unit = item[0];

    const form = PCL.create("PSI.Goods.UnitEditForm", {
      parentForm: me,
      entity: unit
    });

    form.show();
  },

  /**
   * @private
   */
  getPreIndexInMainGrid(id) {
    const me = this;

    const store = me.getMainGrid().getStore();
    const index = store.findExact("id", id) - 1;

    let result = null;
    const preEntity = store.getAt(index);
    if (preEntity) {
      result = preEntity.get("id");
    }

    return result;
  },


  /**
   * 删除计量单位
   * 
   * @private
   */
  _onDeleteUnit() {
    const me = this;
    const item = me.getMainGrid().getSelectionModel().getSelection();
    if (item == null || item.length != 1) {
      me.showInfo("请选择要删除的计量单位");
      return;
    }

    const unit = item[0];
    const info = `请确认是否删除计量单位 <span style='color:red'>${unit.get("name")}</span> ?`;

    const preIndex = me.getPreIndexInMainGrid(unit.get("id"));

    const funcConfirm = () => {
      const el = PCL.getBody();
      el.mask(PSI.Const.LOADING);
      const r = {
        url: me.URL("Home/Goods/deleteUnit"),
        params: {
          id: unit.get("id")
        },
        callback(options, success, response) {
          el.unmask();
          if (success) {
            const data = me.decodeJSON(response.responseText);
            if (data.success) {
              me.tip("成功完成删除操作", true);
              me.refreshGrid(preIndex);
            } else {
              me.showInfo(data.msg);
            }
          } else {
            me.showInfo("网络错误");
          }
        }
      };
      me.ajax(r);
    };

    me.confirm(info, funcConfirm);
  }
});
