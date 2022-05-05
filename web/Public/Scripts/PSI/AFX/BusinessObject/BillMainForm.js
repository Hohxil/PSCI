/**
 * 业务单据主界面基类
 * 
 * @author 艾格林门信息服务（大连）有限公司
 * @copyright 2015 - present
 * @license GPL v3
 */
PCL.define("PSI.AFX.BusinessObject.BillMainForm", {
  extend: "PCL.panel.Panel",

  config: {
    // 元数据
    // 主流程如下：
    // 1、外部先从服务器获得该模块的元数据
    // 2、然后由外部传入元数据，本class依据元数据创建UI
    // 3、回调注册的插件，在不修改本class代码的前提下实现外部扩展
    afxMetadata: null
  },

  mixins: ["PSI.AFX.Mix.Common"],

  border: 0,

  layout: "border",

  initComponent() {
    var me = this;

    PCL.apply(me, {
      tbar: me.afxGetToolbarCmp()
    });

    me.callParent(arguments);

    me.afxInitComponent();
  },

  afxGetToolbarCmp() {
    return [];
  },

  afxInitComponent() {
  }
});
