/**
 * confirm窗体
 * 
 * @author 艾格林门信息服务（大连）有限公司
 * @copyright 2015 - present
 * @license GPL v3
 */
PCL.define("PSI.AFX.MessageBox.ConfirmForm", {
  extend: "PCL.window.Window",
  config: {
    fn: null,
    msg: "",
  },

  modal: true,
  closable: false,
  width: 600,
  layout: "fit",

  /**
   * @override
   */
  initComponent() {
    const me = this;

    PCL.apply(me, {
      header: {
        title: `<span style='font-size:160%'>${PSI.Const.PROD_NAME}</span>`,
        height: 40
      },
      height: 200,
      items: [{
        border: 0,
        xtype: "container",
        margin: "0 0 0 10",
        html: `
              <h2 style='color:#843fa1;border-left:3px solid #1890ff;padding-left:5px;padding-right:10px'>${me.getMsg()}</h2>
              `
      }],
      buttons: [{
        id: "PSI_AFX_MessageBox_ConfirmForm_buttonOK",
        text: "是",
        handler: me._onOK,
        scope: me,
        iconCls: "PSI-button-ok"
      }, {
        id: "PSI_AFX_MessageBox_ConfirmForm_buttonCancel",
        text: "否",
        handler: me._onCancel,
        scope: me,
      }],
      listeners: {
        show: {
          fn: me._onWndShow,
          scope: me
        }
      }
    });

    me.callParent(arguments);
  },

  /**
   * @private
   */
  _onWndShow() {
    PCL.getCmp("PSI_AFX_MessageBox_ConfirmForm_buttonCancel").focus();
  },

  /**
   * @private
   */
  _onOK() {
    const me = this;

    me.close();

    const fn = me.getFn();
    if (fn) {
      fn();
    }
  },

  /**
   * @private
   */
  _onCancel() {
    const me = this;
    me.close();
  }
});
