/**
 * 仓库 - 主界面
 * 
 * @author 艾格林门信息服务（大连）有限公司
 * @copyright 2015 - present
 * @license GPL v3
 */
PCL.define("PSI.Warehouse.MainForm", {
  extend: "PSI.AFX.Form.MainForm",

  config: {
    pAdd: null,
    pEdit: null,
    pDelete: null,
    pEditDataOrg: null,
    pInitInv: null
  },

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

    const result = [{
      text: "新建仓库",
      disabled: me.getPAdd() == "0",
      handler: me._onAddWarehouse,
      scope: me
    }, {
      text: "编辑仓库",
      disabled: me.getPEdit() == "0",
      handler: me._onEditWarehouse,
      scope: me
    }, {
      text: "删除仓库",
      disabled: me.getPDelete() == "0",
      handler: me._onDeleteWarehouse,
      scope: me
    }, "-", {
      text: "修改数据域",
      disabled: me.getPEditDataOrg() == "0",
      handler: me._onEditDataOrg,
      scope: me
    }];

    if (me.getPInitInv() == "1") {
      result.push("-", {
        text: "打开库存建账模块",
        handler() {
          me.focus();
          window.open(me.URL("Home/MainMenu/navigateTo/fid/2000"));
        }
      });
    }

    result.push("-", {
      text: "指南",
      handler() {
        me.focus();
        window.open(me.URL("Home/Help/index?t=warehouse"));
      }
    }, "-", {
      text: "关闭",
      handler() {
        me.closeWindow();
      }
    });

    return result;
  },

  /**
   * @private
   */
  getMainGrid() {
    const me = this;
    if (me._mainGrid) {
      return me._mainGrid;
    }

    const modelName = "PSIModel.PSI.Warehouse.MainForm.Warehouse";
    PCL.define(modelName, {
      extend: "PCL.data.Model",
      fields: ["id", "code", "name", "inited", "dataOrg",
        "enabled", "orgId", "orgName", "saleArea", "usageType", "usageTypeName",
        "limitGoods"]
    });

    me._mainGrid = PCL.create("PCL.grid.Panel", {
      cls: "PSI-FC",
      border: 1,
      viewConfig: {
        enableTextSelection: true
      },
      columnLines: true,
      columns: {
        defaults: {
          menuDisabled: true,
          sortable: false
        },
        items: [{
          xtype: "rownumberer",
          header: "#",
          width: 40
        }, {
          header: "仓库编码",
          dataIndex: "code",
          width: 100,
          renderer(value, metaData, record) {
            if (parseInt(record.get("enabled")) == 1) {
              return value;
            } else {
              return `<span class="PSI-record-disabled">${value}</span>`;
            }
          }
        }, {
          header: "仓库名称",
          dataIndex: "name",
          width: 200,
          renderer(value, metaData, record) {
            if (parseInt(record.get("enabled")) == 1) {
              return value;
            } else {
              return `<span class="PSI-record-disabled">${value}</span>`;
            }
          }
        }, {
          header: "核算组织机构",
          dataIndex: "orgName",
          width: 250
        }, {
          header: "销售核算面积(平方米)",
          dataIndex: "saleArea",
          width: 150,
          align: "right"
        }, {
          header: "库存建账",
          dataIndex: "inited",
          width: 90,
          renderer(value) {
            return value == 1
              ? "建账完毕"
              : "<span style='color:red'>待建账</span>";
          }
        }, {
          header: "用途",
          dataIndex: "usageTypeName",
          width: 200
        }, {
          header: "仓库状态",
          dataIndex: "enabled",
          width: 90,
          renderer(value) {
            return value == 1
              ? "启用"
              : "<span style='color:red'>停用</span>";
          }
        }, {
          header: "数据域",
          dataIndex: "dataOrg",
          width: 150
        }]
      },
      store: PCL.create("PCL.data.Store", {
        model: modelName,
        autoLoad: false,
        data: []
      }),
      listeners: {
        itemdblclick: {
          fn: me._onEditWarehouse,
          scope: me
        }
      }
    });

    return me._mainGrid;
  },

  /**
   * 新增仓库
   * 
   * @private
   */
  _onAddWarehouse() {
    const me = this;

    const form = PCL.create("PSI.Warehouse.EditForm", {
      parentForm: me
    });

    form.show();
  },

  /**
   * 编辑仓库
   * 
   * @private
   */
  _onEditWarehouse() {
    const me = this;

    if (me.getPEdit() == "0") {
      return;
    }

    const item = me.getMainGrid().getSelectionModel().getSelection();
    if (item == null || item.length != 1) {
      me.showInfo("请选择要编辑的仓库");
      return;
    }

    const warehouse = item[0];

    const form = PCL.create("PSI.Warehouse.EditForm", {
      parentForm: me,
      entity: warehouse
    });

    form.show();
  },

  /**
   * 删除仓库
   * 
   * @private
   */
  _onDeleteWarehouse() {
    const me = this;
    const item = me.getMainGrid().getSelectionModel().getSelection();
    if (item == null || item.length != 1) {
      me.showInfo("请选择要删除的仓库");
      return;
    }

    const warehouse = item[0];
    const info = `请确认是否删除仓库 <span style='color:red'>${warehouse.get("name")}</span> ？`;

    const preIndex = me.getPreIndexInMainGrid(warehouse.get("id"));

    const funcConfirm = () => {
      const el = PCL.getBody();
      el.mask(PSI.Const.LOADING);
      const r = {
        url: me.URL("Home/Warehouse/deleteWarehouse"),
        params: {
          id: warehouse.get("id")
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
  },

  /**
   * 编辑数据域
   */
  _onEditDataOrg() {
    const me = this;

    const item = me.getMainGrid().getSelectionModel().getSelection();
    if (item == null || item.length != 1) {
      me.showInfo("请选择要编辑数据域的仓库");
      return;
    }

    const warehouse = item[0];

    const form = PCL.create("PSI.Warehouse.EditDataOrgForm", {
      parentForm: me,
      entity: warehouse
    });

    form.show();
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
      url: me.URL("Home/Warehouse/warehouseList"),
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
});
