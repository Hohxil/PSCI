/**
 * 解决方案 - 主界面
 * 
 * @author 艾格林门信息服务（大连）有限公司
 * @copyright 2015 - present
 * @license GPL v3
 */

PCL.define("PSI.Solution.MainForm", {

  extend: "PSI.AFX.Form.MainForm",

  /**
   * 初始化组件
   * 
   * @override
   */
  initComponent() {
    const me = this;

    PCL.apply(me, {
      tbar: [{
        text: "新建解决方案",
        handler: me._onAdd,
        scope: me
      }, {
        text: "编辑解决方案",
        handler: me._onEdit,
        scope: me
      }, {
        text: "删除解决方案",
        handler: me._onDelete,
        scope: me
      }, "-",
      {
        text: "设置默认解决方案",
        handler: me._onDefault,
        scope: me
      }, "-", {
        text: "指南",
        handler() {
          me.focus();
          window.open(me.URL("Home/Help/index?t=solution"));
        }
      }, "-", {
        text: "关闭",
        handler() {
          me.closeWindow();
        }
      }],
      items: [{
        region: "north", height: 2,
        border: 0,
      }, {
        region: "center",
        xtype: "panel",
        layout: "fit",
        border: 0,
        items: [me.getMainGrid()]
      }]
    });

    me.callParent(arguments);

    me.refreshMainGrid();
  },

  /**
   * @private
   */
  getMainGrid() {
    const me = this;

    if (me._mainGrid) {
      return me._mainGrid;
    }

    const modelName = "PSIModel.PSI.Solution.MainForm.SolutionModel";

    PCL.define(modelName, {
      extend: "PCL.data.Model",
      fields: ["id", "code", "name", "isDefault"]
    });

    me._mainGrid = PCL.create("PCL.grid.Panel", {
      cls: "PSI-FC",
      viewConfig: {
        enableTextSelection: true
      },
      columnLines: true,
      columns: {
        defaults: {
          menuDisabled: true,
          sortable: false
        },
        items: [PCL.create("PCL.grid.RowNumberer", {
          text: "#",
          align: "right",
          width: 60
        }), {
          header: "编码",
          dataIndex: "code",
          width: 140,
        }, {
          header: "解决方案名称",
          dataIndex: "name",
          width: 400,
        }, {
          header: "默认解决方案",
          dataIndex: "isDefault",
          width: 100,
          align: "center"
        }]
      },
      store: PCL.create("PCL.data.Store", {
        model: modelName,
        autoLoad: false,
        data: []
      }),
      listeners: {
        itemdblclick: {
          fn: me._onEdit,
          scope: me
        }
      },
    });

    return me._mainGrid;
  },

  /**
   * 新建解决方案
   * 
   * @private
   */
  _onAdd() {
    const me = this;

    const form = PCL.create("PSI.Solution.EditForm", {
      parentForm: me
    });
    form.show();
  },

  /**
   * 编辑解决方案
   * 
   * @private
   */
  _onEdit() {
    const me = this;

    const item = me.getMainGrid().getSelectionModel().getSelection();
    if (item === null || item.length !== 1) {
      me.showInfo("请选择要编辑的解决方案");
      return;
    }

    const solution = item[0];

    const form = PCL.create("PSI.Solution.EditForm", {
      entity: solution,
      parentForm: me
    });
    form.show();
  },

  /**
   * 删除解决方案
   * 
   * @private
   */
  _onDelete() {
    const me = this;

    const item = me.getMainGrid().getSelectionModel().getSelection();
    if (item === null || item.length !== 1) {
      me.showInfo("请选择要删除的解决方案");
      return;
    }

    const solution = item[0];

    const store = me.getMainGrid().getStore();
    let index = store.findExact("id", solution.get("id"));
    index--;
    const preItem = store.getAt(index);
    let preId = null;
    if (preItem) {
      preId = preItem.get("id");
    }

    const funcConfirm = () => {
      PCL.getBody().mask("正在删除中...");
      const r = {
        url: me.URL("Home/Solution/deleteSolution"),
        params: {
          id: solution.get("id")
        },
        callback(options, success, response) {
          PCL.getBody().unmask();

          if (success) {
            const data = me.decodeJSON(response.responseText);
            if (data.success) {
              me.tip("成功完成删除操作", true);
              me.refreshMainGrid(preId);
            } else {
              me.showInfo(data.msg);
            }
          }
        }
      };

      me.ajax(r);
    };

    const info = `请确认是否删除解决方案 <span style='color:red'>${solution.get("name")}</span> ?`;
    me.confirm(info, funcConfirm);
  },

  /**
   * @private
   */
  refreshMainGrid(id) {
    const me = this;

    const grid = me.getMainGrid();
    const el = grid.getEl() || PCL.getBody();
    el.mask(PSI.Const.LOADING);
    const r = {
      url: me.URL("Home/Solution/solutionList"),
      callback(options, success, response) {
        const store = grid.getStore();

        store.removeAll();

        if (success) {
          const data = me.decodeJSON(response.responseText);
          store.add(data);

          if (store.getCount() > 0) {
            if (id) {
              const r = store.findExact("id", id);
              if (r != -1) {
                grid.getSelectionModel().select(r);
              }
            } else {
              grid.getSelectionModel().select(0);
            }
          }
        }

        el.unmask();
      }
    };

    me.ajax(r);
  },

  /**
   * @private
   */
  _onDefault() {
    const me = this;

    const item = me.getMainGrid().getSelectionModel().getSelection();
    if (item === null || item.length !== 1) {
      me.showInfo("请选择解决方案");
      return;
    }

    const solution = item[0];
    const id = solution.get("id");

    const funcConfirm = () => {
      PCL.getBody().mask("正在操作中...");
      const r = {
        url: me.URL("Home/Solution/setDefault"),
        params: {
          id
        },
        callback(options, success, response) {
          PCL.getBody().unmask();

          if (success) {
            const data = me.decodeJSON(response.responseText);
            if (data.success) {
              me.tip("成功完成操作", true);
              me.refreshMainGrid(id);
            } else {
              me.showInfo(data.msg);
            }
          }
        }
      };

      me.ajax(r);
    };

    const info = `请确认是否把解决方案 <span style='color:red'>${solution.get("name")}</span> 设置为默认解决方案?`;
    me.confirm(info, funcConfirm);
  }
});
