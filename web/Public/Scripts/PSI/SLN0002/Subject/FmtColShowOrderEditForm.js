/**
 * 账样列显示次序
 * 
 * @author 艾格林门信息服务（大连）有限公司
 * @copyright 2015 - present
 * @license GPL v3
 */
Ext.define("PSI.SLN0002.Subject.FmtColShowOrderEditForm", {
  extend: "PSI.AFX.Form.EditForm",

  /**
   * 初始化组件
   */
  initComponent() {
    const me = this;

    const buttons = [];

    let btn = {
      text: "保存",
      formBind: true,
      iconCls: "PSI-button-ok",
      handler() {
        me.onOK(false);
      },
      scope: me
    };
    buttons.push(btn);

    btn = {
      text: "取消",
      handler() {
        me.close();
      },
      scope: me
    };
    buttons.push(btn);

    const t = "设置账样列显示次序";
    const f = "edit-form-update.png";
    const logoHtml = "<img style='float:left;margin:10px 20px 0px 10px;width:48px;height:48px;' src='"
      + PSI.Const.BASE_URL
      + "Public/Images/"
      + f
      + "'></img>"
      + "<h2 style='color:#196d83'>"
      + t
      + "</h2>"
      + "<p style='color:#196d83'>通过拖动列来调整显示次序</p>";
    Ext.apply(me, {
      header: {
        title: me.formatTitle(PSI.Const.PROD_NAME),
        height: 40
      },
      width: 1000,
      height: 340,
      layout: "border",
      listeners: {
        show: {
          fn: me.onWndShow,
          scope: me
        },
        close: {
          fn: me.onWndClose,
          scope: me
        }
      },
      items: [{
        region: "north",
        height: 90,
        border: 0,
        html: logoHtml
      }, {
        region: "center",
        border: 0,
        layout: "fit",
        items: [me.getMainGrid()],
        buttons: buttons
      }]
    });

    me.callParent(arguments);
  },

  /**
   * 保存
   */
  onOK(thenAdd) {
    const me = this;

    const columns = me.getMainGrid().columnManager.columns;

    const data = [];
    for (let i = 0; i < columns.length; i++) {
      const col = columns[i];

      data.push(col.dataIndex);
    }

    const showOrder = data.join(",");

    const el = Ext.getBody();
    el.mask("正在操作中...");
    const r = {
      url: me.URL("SLN0002/Subject/editFmtColShowOrder"),
      params: {
        id: me.getEntity().get("id"), // 科目id
        idList: showOrder
      },
      callback(options, success, response) {
        el.unmask();

        if (success) {
          const data = me.decodeJSON(response.responseText);
          if (data.success) {
            me.tip("成功修改账样列显示次序", true);
            me.close();

            // 回调
            const parentForm = me.getParentForm();
            if (parentForm) {
              parentForm.refreshFmtColsGrid.apply(parentForm);
            }
          } else {
            me.showInfo(data.msg);
          }
        } else {
          me.showInfo("网络错误");
        }
      }
    };
    me.ajax(r);
  },

  onWindowBeforeUnload(e) {
    return (window.event.returnValue = e.returnValue = '确认离开当前页面？');
  },

  onWndClose() {
    const me = this;

    Ext.get(window).un('beforeunload', me.onWindowBeforeUnload);

    if (me.__lastId) {
      if (me.getParentForm()) {
        me.getParentForm().refreshFmtColsGrid()
      }
    }
  },

  getMainGrid() {
    const me = this;
    if (me.__mainGrid) {
      return me.__mainGrid;
    }

    const modelName = "PSIEditFMTColsShowOrder";
    Ext.define(modelName, {
      extend: "Ext.data.Model",
      fields: ["id"]
    });

    me.__mainGrid = Ext.create("Ext.grid.Panel", {
      cls: "PSI",
      header: {
        height: 30,
        title: me.formatGridHeaderTitle("账样列")
      },
      columnLines: true,
      columns: {
        defaults: {
          menuDisabled: true,
          sortable: false
        },
        items: []
      },
      store: Ext.create("Ext.data.Store", {
        model: modelName,
        autoLoad: false,
        data: []
      })
    });

    return me.__mainGrid;
  },

  onWndShow() {
    const me = this;

    Ext.get(window).on('beforeunload', me.onWindowBeforeUnload);

    const id = me.getEntity().get("id");

    const el = me.getEl() || Ext.getBody();
    el.mask(PSI.Const.LOADING);
    const r = {
      url: me.URL("SLN0002/Subject/fmtGridColsList"),
      params: {
        id
      },
      callback(options, success, response) {
        el.unmask();

        if (success) {
          const data = me.decodeJSON(response.responseText);
          me.reconfigMainGrid(data);
        } else {
          me.showInfo("网络错误")
        }
      }
    };

    me.ajax(r);
  },

  reconfigMainGrid(data) {
    const me = this;
    const cols = [];
    for (let i = 0; i < data.length; i++) {
      const item = data[i];
      cols.push({
        text: item.caption,
        dataIndex: item.id
      });
    }
    me.getMainGrid().reconfigure(me.getMainGrid().getStore(), cols);
  }
});
