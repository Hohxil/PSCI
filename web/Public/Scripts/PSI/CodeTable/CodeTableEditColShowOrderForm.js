/**
 * 码表设置 - 调整编辑界面字段显示次序
 * 
 * @author 艾格林门信息服务（大连）有限公司
 * @copyright 2015 - present
 * @license GPL v3
 */
PCL.define("PSI.CodeTable.CodeTableEditColShowOrderForm", {
  extend: "PSI.AFX.Form.EditForm",

  config: {
    codeTable: null
  },

  /**
   * @override
   */
  initComponent() {
    const me = this;
    const entity = me.getEntity();
    this.adding = entity == null;

    const buttons = [];

    buttons.push({
      text: "保存",
      formBind: true,
      iconCls: "PSI-button-ok",
      handler() {
        me._onOK();
      },
      scope: me
    }, {
      text: "取消",
      handler() {
        me.close();
      },
      scope: me
    });

    const t = "调整编辑界面字段显示次序";
    const f = "edit-form-update.png";
    const html = `
      <img style='float:left;margin:10px 20px 0px 10px;width:48px;height:48px;' src='${PSI.Const.BASE_URL}Public/Images/${f}'></img>
      <h2 style='color:#196d83'>
        ${t}
      </h2>
      <p style='color:#196d83'>通过拖动列来调整显示次序</p>
      `;

    PCL.apply(me, {
      resizable: true,
      header: {
        title: me.formatTitle(PSI.Const.PROD_NAME),
        height: 40
      },
      width: 900,
      height: 320,
      layout: "border",
      items: [{
        region: "north",
        border: 0,
        html,
      }, {
        region: "center",
        layout: "fit",
        border: 0,
        id: "CodeTableEditColShowOrderForm_panelMain",
        items: []
      }, {
        // 占位用
        region: "south",
        border: 0,
        height: 30
      }],
      buttons: buttons,
      listeners: {
        show: {
          fn: me._onWndShow,
          scope: me
        },
        close: {
          fn: me._onWndClose,
          scope: me
        }
      }
    });

    me.callParent(arguments);

    me.__mainPanel = PCL.getCmp("CodeTableEditColShowOrderForm_panelMain");
  },

  /**
   * @private
   */
  _onWndShow() {
    const me = this;

    PCL.get(window).on('beforeunload', me.__onWindowBeforeUnload);

    const el = me.getEl();
    el && el.mask(PSI.Const.LOADING);
    me.ajax({
      url: me.URL("Home/CodeTable/queryCodeTableEditColShowOrder"),
      params: {
        tableId: me.getCodeTable().get("id")
      },
      callback(options, success, response) {
        if (success) {
          el && el.unmask();

          const data = me.decodeJSON(response.responseText);
          me.__mainPanel.add(me.createMainGrid(data));
        }
      }
    });

  },

  /**
   * @private
   */
  _onOK() {
    const me = this;

    const grid = me.getMainGrid();
    const cols = grid.columnManager.columns;
    const layout = [];
    for (let i = 0; i < cols.length; i++) {
      const c = cols[i];
      layout.push({ dataIndex: c.dataIndex });
    }
    const json = me.encodeJSON(layout);

    const info = "请确认是否保存编辑字段显示次序?";

    const funcConfirm = () => {
      const el = PCL.getBody();
      el && el.mask(PSI.Const.LOADING);
      const r = {
        url: me.URL("Home/CodeTable/saveColEditShowOrder"),
        params: {
          id: me.getCodeTable().get("id"),
          json: json
        },
        callback(options, success, response) {
          el && el.unmask();
          if (success) {
            var data = me.decodeJSON(response.responseText);
            if (data.success) {
              me.tip("成功完成操作", true);
              me.getParentForm().refreshColsGrid();
              me.close();
            } else {
              me.showInfo(data.msg);
            }
          } else {
            me.showInfo("网络错误");
          }
        }
      };

      me.ajax(r);
    }

    me.confirm(info, funcConfirm);
  },

  /**
   * @private
   */
  _onWndClose() {
    const me = this;

    PCL.get(window).un('beforeunload', me.__onWindowBeforeUnload);
  },

  /**
   * @private
   */
  getMainGrid() {
    const me = this;
    return me._mainGrid;
  },

  /**
   * @private
   */
  createMainGrid(cols) {
    const me = this;

    const fields = [];
    const columns = [];
    if (!cols) {
      columns.push({});
    } else {
      for (let i = 0; i < cols.length; i++) {
        const col = cols[i];
        columns.push({
          header: col.caption,
          dataIndex: col.dataIndex
        });
        fields.push(col.dataIndex);
      }
    }

    const modelName = "PSIModel.PSI.CodeTable.CodeTableEditColShowOrderForm.ColShowOrder";

    PCL.define(modelName, {
      extend: "PCL.data.Model",
      fields: fields
    });

    me._mainGrid = PCL.create("PCL.grid.Panel", {
      columnLines: true,
      columns: {
        defaults: {
          menuDisabled: true,
          sortable: false

        }, items: columns
      }
    });

    return me._mainGrid;
  }
});
