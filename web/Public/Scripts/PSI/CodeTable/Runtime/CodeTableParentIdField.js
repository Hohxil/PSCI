/**
 * 自定义字段 - 上级字段
 * 
 * @author 艾格林门信息服务（大连）有限公司
 * @copyright 2015 - present
 * @license GPL v3
 */
PCL.define("PSI.CodeTable.Runtime.CodeTableParentIdField", {
  extend: "PCL.form.field.Trigger",
  alias: "widget.psi_codetable_parentidfield",

  config: {
    // 当前码表的完整元数据
    metadata: null,
    idCmp: null,
    company: null, // 多公司录入的时候使用
  },

  /**
   * @override
   */
  initComponent() {
    const me = this;

    me.__idValue = null;

    me.enableKeyEvents = true;

    me.callParent(arguments);

    me.on("keydown", (field, e) => {
      if (e.getKey() == e.BACKSPACE) {
        field.setValue(null);
        me.setIdValue(null);
        e.preventDefault();
        return false;
      }

      if (e.getKey() !== e.ENTER) {
        me.onTriggerClick(e);
      }
    });

    me.on({
      render(p) {
        p.getEl().on("dblclick", () => {
          me.onTriggerClick();
        });
      },
      single: true
    });
  },

  onTriggerClick(e) {
    const me = this;
    const modelName = "PSICodeTableParentIdField";
    PCL.define(modelName, {
      extend: "PCL.data.Model",
      fields: ["id", "name", "full_name", "code",
        "leaf", "children"]
    });

    let companyId = null;
    const company = me.getCompany();
    if (company) {
      companyId = company.get("id");
    }
    const store = PCL.create("PCL.data.TreeStore", {
      model: modelName,
      proxy: {
        type: "ajax",
        extraParams: {
          fid: me.getMetadata().fid,
          companyId,
        },
        actionMethods: {
          read: "POST"
        },
        url: PSI.Const.BASE_URL + "Home/CodeTableRuntime/codeTableRecordListForTreeView"
      }
    });

    const tree = PCL.create("PCL.tree.Panel", {
      cls: "PSI",
      store: store,
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
          dataIndex: "name"
        }, {
          text: "编码",
          dataIndex: "code"
        }]
      }
    });
    tree.on("itemdblclick", me.onOK, me);
    me.tree = tree;

    const wnd = PCL.create("PCL.window.Window", {
      title: "选择上级",
      modal: true,
      width: 400,
      height: 300,
      layout: "fit",
      items: [tree],
      buttons: [{
        text: "确定",
        handler: this.onOK,
        scope: this
      }, {
        text: "取消",
        handler() {
          wnd.close();
        }
      }]
    });
    me.wnd = wnd;
    wnd.show();
  },

  // private
  onOK() {
    const me = this;

    const tree = me.tree;
    const item = tree.getSelectionModel().getSelection();

    if (item === null || item.length !== 1) {
      PSI.MsgBox.showInfo("没有选择记录");

      return;
    }

    const data = item[0];

    me.setIdValue(data.get("id"));
    me.setValue(data.get("full_name"));

    me.wnd.close();
    me.focus();
  },

  setIdValue(id) {
    const me = this;
    me.__idValue = id;

    const idCmp = me.getIdCmp();
    if (idCmp) {
      idCmp.setValue(id);
    }
  },

  getIdValue() {
    return this.__idValue;
  }
});
