/**
 * 会计期间 - 主界面
 * 
 * @author 艾格林门信息服务（大连）有限公司
 * @copyright 2015 - present
 * @license GPL v3
 */
PCL.define("PSI.SLN0002.GLPeriod.MainForm", {
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
        region: "west",
        width: 300,
        layout: "fit",
        border: 0,
        split: true,
        items: [me.getCompanyGrid()]
      }, {
        region: "center",
        xtype: "panel",
        layout: "border",
        border: 0,
        items: [{
          region: "center",
          layout: "fit",
          split: true,
          border: 0,
          items: me.getMainGrid()
        }]
      }]
    });

    me.callParent(arguments);

    me.refreshCompanyGrid();
  },

  /**
   * @private
   */
  getToolbarCmp() {
    const me = this;
    return [{
      text: "初始化本年度会计期间",
      handler: me._onInitPeriod,
      scope: me
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
  refreshCompanyGrid() {
    const me = this;
    const el = PCL.getBody();
    const store = me.getCompanyGrid().getStore();
    el.mask(PSI.Const.LOADING);
    const r = {
      url: me.URL("SLN0002/GLPeriod/companyList"),
      callback(options, success, response) {
        store.removeAll();

        if (success) {
          const data = me.decodeJSON(response.responseText);
          store.add(data);
          if (store.getCount() > 0) {
            me.getCompanyGrid().getSelectionModel().select(0);
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
  getCompanyGrid() {
    const me = this;
    if (me._companyGrid) {
      return me._companyGrid;
    }

    const modelName = "PSI_GLPeriod_Company";

    PCL.define(modelName, {
      extend: "PCL.data.Model",
      fields: ["id", "code", "name", "orgType"]
    });

    me._companyGrid = PCL.create("PCL.grid.Panel", {
      cls: "PSI-FC",
      header: {
        height: 30,
        title: me.formatGridHeaderTitle("核算组织机构")
      },
      forceFit: true,
      columnLines: true,
      columns: [{
        header: "编码",
        dataIndex: "code",
        menuDisabled: true,
        sortable: false,
        width: 70
      }, {
        header: "组织机构名称",
        dataIndex: "name",
        flex: 1,
        menuDisabled: true,
        sortable: false
      }, {
        header: "组织机构性质",
        dataIndex: "orgType",
        width: 100,
        menuDisabled: true,
        sortable: false
      }],
      store: PCL.create("PCL.data.Store", {
        model: modelName,
        autoLoad: false,
        data: []
      }),
      listeners: {
        select: {
          fn: me._onCompanyGridSelect,
          scope: me
        }
      }
    });
    return me._companyGrid;
  },

  /**
   * @private
   */
  _onCompanyGridSelect() {
    const me = this;

    me.getMainGrid().setTitle(me.formatGridHeaderTitle("会计期间"));
    const item = me.getCompanyGrid().getSelectionModel().getSelection();
    if (item == null || item.length != 1) {
      return;
    }

    const company = item[0];

    const title = `<span class='PSI-title-keyword'>${company.get("name")}</span> - 会计期间`;
    me.getMainGrid().setTitle(me.formatGridHeaderTitle(title));

    const grid = me.getMainGrid();
    const el = grid.getEl();
    el && el.mask(PSI.Const.LOADING);

    const r = {
      url: me.URL("SLN0002/GLPeriod/periodList"),
      params: {
        companyId: company.get("id")
      },
      callback(options, success, response) {
        const store = grid.getStore();

        store.removeAll();

        if (success) {
          const data = me.decodeJSON(response.responseText);
          store.add(data);
        }

        el && el.unmask();
      }
    };
    me.ajax(r);
  },

  /**
   * @private
   */
  getMainGrid() {
    const me = this;
    if (me._mainGrid) {
      return me._mainGrid;
    }

    const modelName = "PSIFMTProp";
    PCL.define(modelName, {
      extend: "PCL.data.Model",
      fields: ["id", "year", "month", "glKept", "glClosed",
        "detailKept", "detailClosed", "periodClosed", "yearForward"]
    });

    const defaultColsProp = {
      menuDisabled: true,
      sortable: false,
      draggable: false
    };

    me._mainGrid = PCL.create("PCL.grid.Panel", {
      cls: "PSI-HL",
      header: {
        height: 30,
        title: me.formatGridHeaderTitle("会计期间")
      },
      columnLines: true,
      columns: {
        defaults: defaultColsProp,
        items: [{
          header: "年",
          dataIndex: "year",
          width: 60,
          align: "center"
        }, {
          header: "月",
          dataIndex: "month",
          width: 60,
          align: "center"
        }, {
          header: "总账",
          columns: [{
            header: "已记账",
            dataIndex: "glKept",
            width: 90,
            align: "center",
            ...defaultColsProp
          }, {
            header: "已结账",
            dataIndex: "glClosed",
            width: 90,
            align: "center",
            ...defaultColsProp
          }]
        }, {
          header: "明细账",
          columns: [{
            header: "已记账",
            dataIndex: "detailKept",
            width: 100,
            align: "center",
            ...defaultColsProp
          }, {
            header: "已结账",
            dataIndex: "detailClosed",
            width: 100,
            align: "center",
            ...defaultColsProp
          }]
        }, {
          header: "本期间已结账",
          dataIndex: "periodClosed",
          width: 100,
          align: "center"
        }, {
          header: "已年终结转",
          dataIndex: "yearForward",
          width: 90,
          align: "center"
        }]
      },
      store: PCL.create("PCL.data.Store", {
        model: modelName,
        autoLoad: false,
        data: []
      })
    });

    return me._mainGrid;
  },

  /**
   * 初始化本年度会计期间
   * 
   * @private
   */
  _onInitPeriod() {
    const me = this;
    const item = me.getCompanyGrid().getSelectionModel().getSelection();
    if (item == null || item.length != 1) {
      return;
    }

    const company = item[0];

    const info = `请确认是否初始化[${company.get("name")}]的本年度会计期间?`;
    const funcConfirm = () => {
      const el = PCL.getBody();
      el.mask("正在操作中...");
      const r = {
        url: me.URL("SLN0002/GLPeriod/initPeriod"),
        params: {
          companyId: company.get("id")
        },
        callback(options, success, response) {
          el.unmask();

          if (success) {
            const data = me.decodeJSON(response.responseText);
            if (data.success) {
              me.tip("成功完成初始化操作", true);
              me._onCompanyGridSelect();
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
