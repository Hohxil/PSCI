/**
 * PSI 对话框窗体基类
 * 
 * @author 艾格林门信息服务（大连）有限公司
 * @copyright 2015 - present
 * @license GPL v3
 */
Ext.define("PSI.AFX.BaseDialogForm", {
  extend: 'Ext.window.Window',

  config: {
    parentForm: null,
    entity: null
  },

  modal: true,
  closable: false,
  resizable: false,
  onEsc: Ext.emptyFn,

  URL: function (url) {
    return PSI.Const.BASE_URL + url;
  },

  decodeJSON: function (str) {
    return Ext.JSON.decode(str);
  },

  tip: function (info) {
    PSI.MsgBox.tip(info);
  },

  showInfo: function (info, func) {
    PSI.MsgBox.showInfo(info, func);
  },

  confirm: function (confirmInfo, funcOnYes) {
    PSI.MsgBox.confirm(confirmInfo, funcOnYes);
  },

  ajax: function (r) {
    if (!r.method) {
      r.method = "POST";
    }
    Ext.Ajax.request(r);
  },

  formatTitle: function (title) {
    return "<span style='font-size:160%'>" + title + "</span>";
  },

  formatGridHeaderTitle: function (title) {
    return "<span style='font-size:13px'>" + title + "</sapn>";
  },

  htmlDecode: function (s) {
    return Ext.String.htmlDecode(s);
  },

  genLogoHtml: function (entity, t) {
    var f = entity == null
      ? "edit-form-create.png"
      : "edit-form-update.png";
    var logoHtml = "<img style='float:left;margin:0px 20px 0px 10px;width:48px;height:48px;' src='"
      + PSI.Const.BASE_URL
      + "Public/Images/"
      + f
      + "'></img>"
      + "<div style='margin-left:60px;margin-top:0px;'><h2 style='color:#196d83;margin-top:0px;'>"
      + t
      + "</h2>"
      + "<p style='color:#196d83'>标记 <span style='color:red;font-weight:bold'>*</span>的是必须录入数据的字段</p></div>";

    return logoHtml;
  },

  /**
   * 把普通文本转换成备注型HTML
   */
  toFieldNoteText(s) {
    return `<span class='PSI-field-note'>${s}</span>`;
  },
});
