/**
 * 价格体系 - 主界面
 * 
 * @author 艾格林门信息服务（大连）有限公司
 * @copyright 2015 - present
 * @license GPL v3
 */
PCL.define("PSI.Goods.PriceSystemMainForm", {
  extend: "PSI.AFX.BaseMainExForm",

  /**
   * 初始化组件
   */
  initComponent: function () {
    var me = this;

    PCL.apply(me, {
      border: 0,
      layout: "border",
      tbar: [{
        text: "新建价格",
        handler: me.onAddPrice,
        scope: me
      }, "-", {
        text: "编辑价格",
        handler: me.onEditPrice,
        scope: me
      }, "-", {
        text: "删除价格",
        handler: me.onDeletePrice,
        scope: me
      }, "-", {
        text: "指南",
        handler: function () {
          me.focus();
          var url = me.URL("/Home/Help/index?t=priceSystem")
          window.open(url);
        }
      }, "-", {
        text: "关闭",
        handler: function () {
          me.closeWindow();
        }
      }],
      items: [{
        region: "center",
        xtype: "panel",
        layout: "fit",
        border: 0,
        items: [me.getMainGrid()]
      }]
    });

    me.callParent(arguments);

    me.freshGrid();
  },

  /**
   * 新增价格
   */
  onAddPrice: function () {
    var me = this;

    var form = PCL.create("PSI.Goods.PriceSystemEditForm", {
      parentForm: me
    });

    form.show();
  },

  /**
   * 编辑价格
   */
  onEditPrice: function () {
    var me = this;

    var item = me.getMainGrid().getSelectionModel().getSelection();
    if (item == null || item.length != 1) {
      PSI.MsgBox.showInfo("请选择要编辑的价格");
      return;
    }

    var price = item[0];

    var form = PCL.create("PSI.Goods.PriceSystemEditForm", {
      parentForm: me,
      entity: price
    });

    form.show();
  },

  /**
   * 删除价格
   */
  onDeletePrice: function () {
    var me = this;
    var item = me.getMainGrid().getSelectionModel().getSelection();
    if (item == null || item.length != 1) {
      PSI.MsgBox.showInfo("请选择要删除的价格");
      return;
    }

    var price = item[0];
    var info = "请确认是否删除价格 <span style='color:red'>" + price.get("name")
      + "</span> ?";

    var store = me.getMainGrid().getStore();
    var index = store.findExact("id", price.get("id"));
    index--;
    var preIndex = null;
    var preItem = store.getAt(index);
    if (preItem) {
      preIndex = preItem.get("id");
    }

    var funcConfirm = function () {
      var el = PCL.getBody();
      el.mask(PSI.Const.LOADING);
      var r = {
        url: PSI.Const.BASE_URL + "Home/Goods/deletePriceSystem",
        params: {
          id: price.get("id")
        },
        method: "POST",
        callback: function (options, success, response) {
          el.unmask();
          if (success) {
            var data = PCL.JSON.decode(response.responseText);
            if (data.success) {
              PSI.MsgBox.tip("成功完成删除操作");
              me.freshGrid(preIndex);
            } else {
              PSI.MsgBox.showInfo(data.msg);
            }
          } else {
            PSI.MsgBox.showInfo("网络错误");
          }
        }
      };
      PCL.Ajax.request(r);
    };

    PSI.MsgBox.confirm(info, funcConfirm);
  },

  /**
   * 刷新Grid
   */
  freshGrid: function (id) {
    var me = this;
    var grid = me.getMainGrid();

    var el = grid.getEl() || PCL.getBody();
    el.mask(PSI.Const.LOADING);
    PCL.Ajax.request({
      url: PSI.Const.BASE_URL + "Home/Goods/priceSystemList",
      method: "POST",
      callback: function (options, success, response) {
        var store = grid.getStore();

        store.removeAll();

        if (success) {
          var data = PCL.JSON.decode(response.responseText);
          store.add(data);
          if (id) {
            var r = store.findExact("id", id);
            if (r != -1) {
              grid.getSelectionModel().select(r);
            } else {
              grid.getSelectionModel().select(0);
            }

          }
        }

        el.unmask();
      }
    });
  },

  getMainGrid: function () {
    var me = this;

    if (me.__mainGrid) {
      return me.__mainGrid;
    }

    var modelName = "PSIGoodsPS";
    PCL.define(modelName, {
      extend: "PCL.data.Model",
      fields: ["id", "name", "factor"]
    });

    me.__mainGrid = PCL.create("PCL.grid.Panel", {
      cls: "PSI-FC",
      border: 0,
      columnLines: true,
      columns: {
        defaults: {
          menuDisabled: true,
          sortable: false
        },
        items: [{
          header: "#",
          xtype: "rownumberer",
          width: 40
        }, {
          header: "价格名称",
          dataIndex: "name",
          width: 400
        }, {
          header: "销售基准价的倍数",
          width: 130,
          dataIndex: "factor",
          align: "right"
        }]
      },
      store: PCL.create("PCL.data.Store", {
        model: modelName,
        autoLoad: false,
        data: []
      }),
      listeners: {
        itemdblclick: {
          fn: me.onEditPrice,
          scope: me
        }
      }
    });

    return me.__mainGrid;
  }
});
