/**
 * 主界面基类
 * 
 * @author 艾格林门信息服务（大连）有限公司
 * @copyright 2015 - present
 * @license GPL v3
 */
PCL.define("PSI.AFX.Form.MainForm", {
  extend: "PCL.panel.Panel",

  mixins: ["PSI.AFX.Mix.Common"],

  border: 0,

  layout: "border",

  /**
   * 保存查询条件里面的input列表，用于在回车的时候跳转
   * 
   * @protected
   */
  __editorList: [],

  /**
   * @protected
   */
  __onEditSpecialKey(field, e) {
    const me = this;

    if (e.getKey() === e.ENTER) {
      const id = field.getId();
      for (let i = 0; i < me.__editorList.length; i++) {
        const editor = me.__editorList[i];
        if (id === editor.getId()) {
          const edit = me.__editorList[i + 1];
          me.setFocusAndCursorPosToLast(edit);
        }
      }
    }
  },

  /**
   * 最后一个查询input回车后，触发 _onQuery 方法查询数据
   * 
   * @protected
   */
  __onLastEditSpecialKey(field, e) {
    const me = this;

    if (e.getKey() === e.ENTER) {
      // ComboBox的下拉框出现的时候，回车是选中下拉框中相应的条码
      // 这里ComboBox的默认键盘操作行为，所以不触发查询
      if (field.isExpanded) {
        return;
      }

      if (me._onQuery) {
        me._onQuery.apply(me);
      }
    }
  }
});
