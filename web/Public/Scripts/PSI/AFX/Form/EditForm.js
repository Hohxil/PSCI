/**
 * 新建或编辑业务实体的对话框窗体基类
 * 
 * @author 艾格林门信息服务（大连）有限公司
 * @copyright 2015 - present
 * @license GPL v3
 */
PCL.define("PSI.AFX.Form.EditForm", {
  extend: "PCL.window.Window",

  mixins: ["PSI.AFX.Mix.Common"],

  config: {
    // 调用本Form的父Form，通常是一个模块的MainForm
    // 主要用途是：在编辑完成后，回调parntForm中的刷新页面的函数
    parentForm: null,

    // 新建的时候entity == null；编辑的时候则为要编辑的业务实体
    entity: null
  },

  modal: true,
  closable: false,
  resizable: false,
  onEsc: PCL.emptyFn,

  /**
   * 
   * @protected
   */
  __onWindowBeforeUnload(e) {
    return (window.event.returnValue = e.returnValue = '确认离开当前页面？');
  },

  /**
   * 是否是使用的TabPanel布局
   * true：是
   * 
   * @protected
   */
  __useTabPanel: false,

  /**
   * 当__useTabPanel == true的时候，保存TabPanel的Id，用于获得对其的引用
   * @protected
   */
  __tabPanelId: null,

  /**
   * 保存input列表，用于在回车的时候跳转
   * 
   * 当__useTabPanel == false的时候，__editorList中直接存放对应的input控件，
   * 这时候__editorList是一维数组；
   * 
   * 当__useTabPanel == true的时候，__editorList是二维数组，
   * 例如 __editList = [[input1, input2], [input3, ...], [inputN, ...]];
   * 上述就表示有3个Tab页
   * 
   * ------------------------------------------------------------------
   * 注意 
   * 有这样的业务场景：input会随着其他选项不同，被禁用或只读
   * 这时候，在业务逻辑中需要重新给__editorList赋值。
   * 也就是说，__editorList里面的input都是可以获得焦点的。
   * 
   * 典型应用见：web\Public\Scripts\PSI\CodeTable\CodeTableColEditForm.js
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
      if (me.__useTabPanel) {
        // TabPanel布局
        const id = field.getId();
        for (let i = 0; i < me.__editorList.length; i++) {
          const inputInTab = me.__editorList[i];
          for (let j = 0; j < inputInTab.length; j++) {
            const editor = inputInTab[j];
            if (id === editor.getId()) {
              if (j == inputInTab.length - 1) {
                // 这是当前Tab页的最后一个input了
                if (i == me.__editorList.length - 1) {
                  // 这也是最后一个Tab页了，这时候就不需要做处理，留给具体的业务页面去处理
                } else {
                  // 调整到下一个Tab页
                  const tab = PCL.getCmp(me.__tabPanelId);
                  if (tab) {
                    const nextTab = i + 1;
                    tab.setActiveTab(nextTab);
                    const edit = me.__editorList[nextTab][0];
                    me.setFocusAndCursorPosToLast(edit);
                  }
                }
              } else {
                // 跳转到当前Tab页的下一个input
                const edit = inputInTab[j + 1];
                me.setFocusAndCursorPosToLast(edit);
              }
            }
          }
        }
      } else {
        // 单一的Form布局
        const id = field.getId();
        for (let i = 0; i < me.__editorList.length; i++) {
          const editor = me.__editorList[i];
          if (id === editor.getId()) {
            const edit = me.__editorList[i + 1];
            me.setFocusAndCursorPosToLast(edit);
          }
        }
      }
    }
  },

});
