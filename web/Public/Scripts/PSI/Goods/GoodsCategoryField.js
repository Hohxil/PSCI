/**
 * 自定义字段 - 物料分类字段
 * 
 * @author 艾格林门信息服务（大连）有限公司
 * @copyright 2015 - present
 * @license GPL v3
 */
PCL.define("PSI.Goods.GoodsCategoryField", {
  extend: "PCL.form.field.Trigger",
  alias: "widget.psi_goodscategoryfield",

  /**
   * 初始化组件
   */
  initComponent: function () {
    var me = this;

    me.__idValue = null;

    me.enableKeyEvents = true;

    me.callParent(arguments);

    me.on("keydown", function (field, e) {
      if (e.getKey() == e.BACKSPACE) {
        field.setValue(null);
        me.setIdValue(null);
        e.preventDefault();
        return false;
      }

      if (e.getKey() !== e.ENTER) {
        this.onTriggerClick(e);
      }
    });
    me.on({
      render: function (p) {
        p.getEl().on("dblclick", function () {
          me.onTriggerClick();
        });
      },
      single: true
    });

  },

  onTriggerClick: function (e) {
    var modelName = "PSIGoodsCategoryModel_Field";
    PCL.define(modelName, {
      extend: "PCL.data.Model",
      fields: ["id", "text", "fullName", "code", "leaf",
        "children"]
    });

    var orgStore = PCL.create("PCL.data.TreeStore", {
      model: modelName,
      proxy: {
        type: "ajax",
        actionMethods: {
          read: "POST"
        },
        url: PSI.Const.BASE_URL
          + "Home/Goods/allCategories"
      }
    });

    var orgTree = PCL.create("PCL.tree.Panel", {
      cls: "PSI",
      store: orgStore,
      rootVisible: false,
      useArrows: true,
      viewConfig: {
        loadMask: true
      },
      columns: {
        defaults: {
          flex: 1,
          sortable: false,
          menuDisabled: true,
          draggable: false
        },
        items: [{
          xtype: "treecolumn",
          text: "名称",
          dataIndex: "text"
        }, {
          text: "编码",
          dataIndex: "code"
        }]
      }
    });
    orgTree.on("itemdblclick", this.onOK, this);
    this.tree = orgTree;

    var wnd = PCL.create("PCL.window.Window", {
      title: "选择物料分类",
      header: false,
      border: 0,
      width: 400,
      height: 300,
      layout: "fit",
      items: [orgTree],
      buttons: [{
        text: "确定",
        handler: this.onOK,
        scope: this
      }, {
        text: "取消",
        handler: function () {
          wnd.close();
        }
      }]
    });
    this.wnd = wnd;
    wnd.on("deactivate", function () {
      wnd.close();
    });

    wnd.showBy(this);
  },

  onOK: function () {
    var me = this;

    var tree = me.tree;
    var item = tree.getSelectionModel().getSelection();

    if (item === null || item.length !== 1) {
      PSI.MsgBox.showInfo("没有选择商品分类");

      return;
    }

    var data = item[0];
    me.setIdValue(data.get("id"));
    me.setValue(data.get("fullName"));
    me.wnd.close();
    me.focus();
  },

  setIdValue: function (id) {
    this.__idValue = id;
  },

  getIdValue: function () {
    return this.__idValue;
  }
});
