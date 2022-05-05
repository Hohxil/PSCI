/**
 * 系统数据字典 - 主界面
 * 
 * @author 艾格林门信息服务（大连）有限公司
 * @copyright 2015 - present
 * @license GPL v3
 */
PCL.define("PSI.FIdList.MainForm", {
  extend: "PSI.AFX.Form.MainForm",

  /**
   * @override
   */
  initComponent() {
    const me = this;

    PCL.apply(me, {
      tbar: me.getToolbarCmp(),
      items: [{
        region: "north",
        border: 0,
        height: 2
      }, {
        region: "center",
        layout: "fit",
        border: 0,
        items: me.getMainGrid()
      }]
    });

    me.callParent(arguments);

    me.refreshMainGrid();
  },

  /**
   * @private
   */
  getToolbarCmp() {
    const me = this;

    return [{
      text: "编辑fid的编码和助记码",
      handler: me._onEdit,
      scope: me,
    }, "-", {
      text: "指南",
      handler() {
        me.focus();
        window.open(me.URL("/Home/Help/index?t=fidList"));
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

    const modelName = "PSIModel.PSI.FIdList.MainForm.FIdModel";

    PCL.define(modelName, {
      extend: "PCL.data.Model",
      fields: ["id", "fid", "name", "code", "category", "sln", "py"]
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
          width: 60
        }), {
          header: "fid",
          dataIndex: "fid",
          width: 140,
        }, {
          header: "编码",
          dataIndex: "code",
          width: 140,
        }, {
          header: "助记码",
          dataIndex: "py",
          width: 140,
        }, {
          header: "名称",
          dataIndex: "name",
          width: 400,
        }, {
          header: "性质",
          dataIndex: "category",
          width: 100,
        }, {
          header: "解决方案",
          dataIndex: "sln",
          width: 350,
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
      }
    });

    return me._mainGrid;
  },

  /**
   * @private
   */
  refreshMainGrid(fid) {
    const me = this;

    const grid = me.getMainGrid();
    const el = grid.getEl() || PCL.getBody();
    el.mask(PSI.Const.LOADING);
    const r = {
      url: me.URL("Home/FIdList/fidList"),
      callback(options, success, response) {
        const store = grid.getStore();

        store.removeAll();

        if (success) {
          const data = me.decodeJSON(response.responseText);
          store.add(data);

          if (store.getCount() > 0) {
            if (fid) {
              const r = store.findExact("fid", fid);
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
   * 编辑FId的编码和拼音字头
   */
  _onEdit() {
    const me = this;
    const item = me.getMainGrid().getSelectionModel().getSelection();
    if (item == null || item.length != 1) {
      me.showInfo("请选择要编辑的FId");
      return;
    }

    const entity = item[0];

    const form = PCL.create("PSI.FIdList.EditForm", {
      entity,
      parentForm: me,
    });
    form.show();
  },
});
