/**
 * 物料品牌 - 主界面
 * 
 * @author 艾格林门信息服务（大连）有限公司
 * @copyright 2015 - present
 * @license GPL v3
 */
PCL.define("PSI.Goods.BrandMainForm", {
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
  },

  /**
   * @private
   */
  getToolbarCmp() {
    const me = this;
    return [{
      text: "新建品牌",
      handler: me._onAddBrand,
      scope: me
    }, "-", {
      text: "编辑品牌",
      handler: me._onEditBrand,
      scope: me
    }, "-", {
      text: "删除品牌",
      handler: me._onDeleteBrand,
      scope: me
    }, "-", {
      text: "刷新",
      handler: me._onRefreshGrid,
      scope: me
    }, "-", {
      text: "指南",
      handler() {
        me.focus();
        window.open(me.URL("Home/Help/index?t=goodsBrand"));
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

    const modelName = "PSIGoodsBrand";
    PCL.define(modelName, {
      extend: "PCL.data.Model",
      fields: ["id", "text", "fullName", "recordStatus", "leaf",
        "children", "goodsCount", "goodsEnabledCount",
        "goodsDisabledCount"]
    });

    const store = PCL.create("PCL.data.TreeStore", {
      model: modelName,
      proxy: {
        type: "ajax",
        actionMethods: {
          read: "POST"
        },
        url: me.URL("Home/Goods/allBrands")
      }
    });

    me._mainGrid = PCL.create("PCL.tree.Panel", {
      cls: "PSI",
      border: 1,
      store: store,
      rootVisible: false,
      useArrows: true,
      viewConfig: {
        loadMask: true
      },
      columns: {
        defaults: {
          sortable: false,
          menuDisabled: true,
          draggable: false
        },
        items: [{
          xtype: "treecolumn",
          text: "品牌",
          dataIndex: "text",
          flex: 1,
          renderer(value, metaData, record) {
            if (parseInt(record.get("recordStatus")) == 1) {
              return value;
            } else {
              return `<span class="PSI-record-disabled">${value}</span>`;
            }
          }
        }, {
          text: "全名",
          dataIndex: "fullName",
          flex: 2,
          renderer(value, metaData, record) {
            if (parseInt(record.get("recordStatus")) == 1) {
              return value;
            } else {
              return `<span class="PSI-record-disabled">${value}</span>`;
            }
          }
        }, {
          text: "状态",
          dataIndex: "recordStatus",
          width: 80,
          renderer(value, metaData, record) {
            if (parseInt(record.get("recordStatus")) == 1) {
              return "启用";
            } else {
              return "<span style='color:red;'>停用</span>";
            }
          }
        }, {
          header: "使用该品牌的物料数",
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
            header: "总物料数",
            dataIndex: "goodsCount",
            align: "right",
            menuDisabled: true,
            sortable: false
          }]
        }]
      },
      listeners: {
        beforeitemdblclick: {
          fn() {
            me._onEditBrand();
            return false;
          }
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

    const store = me.getMainGrid().getStore();
    store.load();
  },

  /**
   * 新建品牌
   * 
   * @private
   */
  _onAddBrand() {
    const me = this;
    const form = PCL.create("PSI.Goods.BrandEditForm", {
      parentForm: me
    });
    form.show();
  },

  /**
   * 编辑品牌
   * 
   * @private
   */
  _onEditBrand() {
    const me = this;
    const item = me.getMainGrid().getSelectionModel().getSelection();
    if (item == null || item.length != 1) {
      me.showInfo("请选择要编辑的品牌");
      return;
    }

    const brand = item[0];

    const form = PCL.create("PSI.Goods.BrandEditForm", {
      parentForm: me,
      entity: brand
    });

    form.show();
  },

  /**
   * 删除商品品牌
   * 
   * @private
   */
  _onDeleteBrand() {
    const me = this;
    const item = me.getMainGrid().getSelectionModel().getSelection();
    if (item == null || item.length != 1) {
      me.showInfo("请选择要删除的品牌");
      return;
    }

    const brand = item[0];
    const info = `请确认是否删除品牌: <span style='color:red'>${brand.get("text")}</span> ？`;
    const confimFunc = () => {
      const el = PCL.getBody();
      el.mask("正在删除中...");
      const r = {
        url: me.URL("Home/Goods/deleteBrand"),
        params: {
          id: brand.get("id")
        },
        callback(options, success, response) {
          el.unmask();

          if (success) {
            const data = me.decodeJSON(response.responseText);
            if (data.success) {
              me.tip("成功完成删除操作", true);
              me.refreshGrid();
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

    me.confirm(info, confimFunc);
  },

  _onRefreshGrid() {
    const me = this;
    me.refreshGrid();
  }
});
