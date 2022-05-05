/**
 * 解接方案的全部码表导出SQL
 * 
 * @author 艾格林门信息服务（大连）有限公司
 * @copyright 2015 - present
 * @license GPL v3
 */
PCL.define("PSI.CodeTable.CodeTableSolutionGenSQLForm", {
  extend: "PCL.window.Window",

  mixins: ["PSI.AFX.Mix.Common"],

  config: {
    slnCode: "",
  },

  initComponent() {
    const me = this;

    PCL.apply(me, {
      title: "解决方案全部码表导出SQL",
      width: 800,
      height: 420,
      layout: "fit",
      items: [{
        id: "editForm",
        xtype: "form",
        layout: "form",
        height: "100%",
        bodyPadding: 5,
        defaultType: 'textfield',
        fieldDefaults: {
          labelWidth: 60,
          labelAlign: "right",
          labelSeparator: "",
          msgTarget: 'side'
        },
        items: [{
          id: "editSQL",
          fieldLabel: "SQL",
          xtype: "textareafield",
          height: 300,
          readOnly: true
        }],
        buttons: [{
          text: "关闭",
          handler() {
            me.close();
          },
          scope: me
        }]
      }],
      listeners: {
        show: {
          fn: me.onWndShow,
          scope: me
        }
      }
    });

    me.callParent(arguments);
  },

  onWndShow() {
    const me = this;

    const el = me.getEl();
    el && el.mask(PSI.Const.LOADING);
    const r = {
      url: me.URL("Home/CodeTable/codeTableSolutionGenSQL"),
      params: {
        slnCode: me.getSlnCode(),
      },
      callback(options, success, response) {
        if (success) {
          const data = me.decodeJSON(response.responseText);

          if (data.success) {
            PCL.getCmp("editSQL").setValue(data.sql);
          } else {
            PCL.getCmp("editSQL").setValue(data.msg);
          }
        } else {
          me.showInfo("网络错误");
        }

        el && el.unmask();
      }
    };

    me.ajax(r);
  }
});
