/**
 * 关于窗体
 * 
 * @author 艾格林门信息服务（大连）有限公司
 * @copyright 2015 - present
 * @license GPL v3
 */
PCL.define("PSI.About.MainForm", {
  extend: "PCL.window.Window",
  config: {
    productionName: "PSI",
    phpVersion: "",
    mySQLVersion: "",
    PSIDBVersion: "",
    PSIDBUpdateDT: ""
  },

  modal: true,
  closable: false,
  resizable: false,
  width: 760,
  layout: "fit",

  /**
   * @override
   */
  initComponent() {
    const me = this;

    const year = new Date().getFullYear();
    const c = `Copyright &copy; 2015-${year} 艾格林门信息服务（大连）有限公司, All Rights Reserved`;

    PCL.apply(me, {
      header: {
        title: `<span style='font-size:160%'>关于 - ${me.getProductionName()}</span>`,
        iconCls: "PSI-fid-9994",
        height: 40
      },
      height: 510,
      bodyCls: "PSI-About-body",
      items: [{
        border: 0,
        xtype: "container",
        margin: "0 0 0 20",
        cls: "PSI-about",
        html: `
              <h1 style='color:#0050b3;margin-top:0px;margin-left:-15px'>${me.getProductionName()}基于开源技术，提供人、财、物、产、供、销、存一体化的企业管理全面解决方案</h1>
              <div style='margin-top:-5px;margin-left:-20px;border-bottom:1px solid #e6f7ff;height:1px' /></div>
              <ul style="margin-left:-25px;font-size:14px">
                <li style='margin-bottom:20px'>
                  当前版本：<span style='border-bottom:1px solid #adc6ff'>${PSI.Const.VERSION}</span>
                </li>
                <li style='margin-bottom:20px'>
                  数据库结构版本号：<span style='border-bottom:1px solid #adc6ff'>${me.getPSIDBVersion()}</span>
                  <span style='display:inline-block;width:10px'></span>
                  数据库结构更新时间：<span style='border-bottom:1px solid #adc6ff'>${me.getPSIDBUpdateDT()}</span>
                </li>
                <li style='margin-bottom:20px'>
                  UI组件PCL版本号：<span style='border-bottom:1px solid #adc6ff'>${PCL.VERSION}</span>
                  &nbsp;&nbsp;PHP版本号：<span style='border-bottom:1px solid #adc6ff'>${me.getPhpVersion()}</span>
                  &nbsp;&nbsp;MySQL版本号：<span style='border-bottom:1px solid #adc6ff'>${me.getMySQLVersion()}</span>
                </li>
              </ul>
              <div style='margin-top:40px;border-left:3px solid #fa8c16;font-size:16px'>
                <h3>&nbsp;&nbsp;授权</h3>
                <p>&nbsp;&nbsp;在遵守 GPL v3 开源协议的前提下，授权您可以把PSI的全部代码和文档用于<span style='border-bottom:2px solid #d3adf7'>任何</span>您需要的商业用途</p>
                <p>&nbsp;&nbsp;利用PSI的代码给您带来商业收益，这是对PSI最大的褒奖</p>
              </div>
              <div style='margin-top:40px;border-left:3px solid #1890ff;font-size:14px'>
                <h3>&nbsp;&nbsp;<a style='text-decoration:none;' href='https://gitee.com/crm8000/PSI' target='_blank'>https://gitee.com/crm8000/PSI</a></h3>
                <p>&nbsp;&nbsp;${c}</p>
              </div>
              `
      }],
      buttons: [{
        id: "buttonAboutFormOK",
        text: "返回首页",
        handler: me._onOK,
        scope: me,
        iconCls: "PSI-button-ok"
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
    PCL.getCmp("buttonAboutFormOK").focus();
  },

  /**
   * @private
   */
  _onOK() {
    if (PSI.Const.MOT == "0") {
      window.location.replace(PSI.Const.BASE_URL);

    } else {
      window.close();

      if (!window.closed) {
        window.location.replace(PSI.Const.BASE_URL);
      }
    }
  }
});
