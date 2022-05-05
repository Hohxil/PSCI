/**
 * 业务设置 - 编辑设置项目
 * 
 * @author 艾格林门信息服务（大连）有限公司
 * @copyright 2015 - present
 * @license GPL v3
 */
PCL.define("PSI.BizConfig.EditForm", {
  extend: "PSI.AFX.Form.EditForm",

  config: {
    companyId: null
  },

  /**
   * @override
   */
  initComponent() {
    const me = this;

    const buttons = [{
      text: "保存",
      formBind: true,
      iconCls: "PSI-button-ok",
      handler() {
        me._onOK();
      },
      scope: me
    }, {
      text: "取消",
      handler() {
        me.close();
      },
      scope: me
    }];

    const modelName = "PSIModel.PSI.BizConfig.EditForm.Warehouse";
    PCL.define(modelName, {
      extend: "PCL.data.Model",
      fields: ["id", "name"]
    });

    const storePW = PCL.create("PCL.data.Store", {
      model: modelName,
      autoLoad: false,
      fields: ["id", "name"],
      data: []
    });
    me.__storePW = storePW;
    const storeWS = PCL.create("PCL.data.Store", {
      model: modelName,
      autoLoad: false,
      fields: ["id", "name"],
      data: []
    });
    me.__storeWS = storeWS;

    PCL.apply(me, {
      header: {
        title: me.formatTitle("业务设置"),
        height: 40
      },
      width: 500,
      height: 470,
      layout: "fit",
      items: [{
        xtype: "tabpanel",
        cls: "PSI-Bizconfig",
        bodyPadding: 5,
        border: 0,
        items: [{
          title: "公司",
          border: 0,
          layout: "form",
          items: [{
            id: "editName9000-01",
            xtype: "displayfield"
          }, {
            id: "editValue9000-01",
            xtype: "textfield"
          }, {
            id: "editName9000-02",
            xtype: "displayfield"
          }, {
            id: "editValue9000-02",
            xtype: "textfield"
          }, {
            id: "editName9000-03",
            xtype: "displayfield"
          }, {
            id: "editValue9000-03",
            xtype: "textfield"
          }, {
            id: "editName9000-04",
            xtype: "displayfield"
          }, {
            id: "editValue9000-04",
            xtype: "textfield"
          }, {
            id: "editName9000-05",
            xtype: "displayfield"
          }, {
            id: "editValue9000-05",
            xtype: "textfield"
          }]
        }, {
          title: "采购",
          border: 0,
          layout: "form",
          items: [{
            id: "editName2001-01",
            xtype: "displayfield"
          }, {
            id: "editValue2001-01",
            xtype: "combo",
            queryMode: "local",
            editable: false,
            valueField: "id",
            displayField: "name",
            store: storePW,
            name: "value2001-01"
          }, {
            id: "editName2001-02",
            xtype: "displayfield"
          }, {
            id: "editValue2001-02",
            xtype: "combo",
            queryMode: "local",
            editable: false,
            valueField: "id",
            store: PCL.create(
              "PCL.data.ArrayStore", {
              fields: ["id", "text"],
              data: [["0", "记应付账款"],
              ["1", "现金付款"],
              ["2", "预付款"]]
            }),
            value: "0"
          }, {
            id: "editName2001-03",
            xtype: "displayfield"
          }, {
            id: "editValue2001-03",
            xtype: "combo",
            queryMode: "local",
            editable: false,
            valueField: "id",
            store: PCL.create(
              "PCL.data.ArrayStore", {
              fields: ["id", "text"],
              data: [["0", "记应付账款"],
              ["1", "现金付款"],
              ["2", "预付款"]]
            }),
            value: "0"
          }, {
            id: "editName2001-04",
            xtype: "displayfield"
          }, {
            id: "editValue2001-04",
            xtype: "combo",
            queryMode: "local",
            editable: false,
            valueField: "id",
            store: PCL.create(
              "PCL.data.ArrayStore", {
              fields: ["id", "text"],
              data: [
                ["0", "不做限制"],
                ["1",
                  "不能超过采购订单未入库量"]]
            }),
            value: "0"
          }]
        }, {
          title: "销售",
          border: 0,
          layout: "form",
          items: [{
            id: "editName2002-02",
            xtype: "displayfield"
          }, {
            id: "editValue2002-02",
            xtype: "combo",
            queryMode: "local",
            editable: false,
            valueField: "id",
            displayField: "name",
            store: storeWS,
            name: "value2002-02"
          }, {
            id: "editName2002-01",
            xtype: "displayfield"
          }, {
            id: "editValue2002-01",
            xtype: "combo",
            queryMode: "local",
            editable: false,
            valueField: "id",
            store: PCL.create(
              "PCL.data.ArrayStore", {
              fields: ["id", "text"],
              data: [["0", "不允许编辑销售单价"],
              ["1", "允许编辑销售单价"]]
            }),
            name: "value2002-01"
          }, {
            id: "editName2002-03",
            xtype: "displayfield"
          }, {
            id: "editValue2002-03",
            xtype: "combo",
            queryMode: "local",
            editable: false,
            valueField: "id",
            store: PCL.create(
              "PCL.data.ArrayStore", {
              fields: ["id", "text"],
              data: [["0", "记应收账款"],
              ["1", "现金收款"],
              ["2", "用预收款支付"]]
            }),
            value: "0"
          }, {
            id: "editName2002-04",
            xtype: "displayfield"
          }, {
            id: "editValue2002-04",
            xtype: "combo",
            queryMode: "local",
            editable: false,
            valueField: "id",
            store: PCL.create(
              "PCL.data.ArrayStore", {
              fields: ["id", "text"],
              data: [["0", "记应收账款"],
              ["1", "现金收款"]]
            }),
            value: "0"
          }, {
            id: "editName2002-05",
            xtype: "displayfield"
          }, {
            id: "editValue2002-05",
            xtype: "combo",
            queryMode: "local",
            editable: false,
            valueField: "id",
            store: PCL.create(
              "PCL.data.ArrayStore", {
              fields: ["id", "text"],
              data: [
                ["0", "不做限制"],
                ["1",
                  "不能超过销售订单未出库量"]]
            }),
            value: "0"
          }]
        }, {
          title: "存货",
          border: 0,
          layout: "form",
          items: [{
            id: "editName1003-02",
            xtype: "displayfield"
          }, {
            id: "editValue1003-02",
            xtype: "combo",
            queryMode: "local",
            editable: false,
            valueField: "id",
            store: PCL.create(
              "PCL.data.ArrayStore", {
              fields: ["id", "text"],
              data: [["0", "移动平均法"],
              ["1", "先进先出法"]]
            }),
            name: "value1003-01"
          }]
        }, {
          title: "财务",
          border: 0,
          layout: "form",
          items: [{
            id: "editName9001-01",
            xtype: "displayfield"
          }, {
            id: "editValue9001-01",
            xtype: "numberfield",
            hideTrigger: true,
            allowDecimals: false
          }]
        }, {
          title: "单号前缀",
          border: 0,
          layout: {
            type: "table",
            columns: 2
          },
          items: [{
            id: "editName9003-01",
            xtype: "displayfield"
          }, {
            id: "editValue9003-01",
            xtype: "textfield"
          }, {
            id: "editName9003-02",
            xtype: "displayfield"
          }, {
            id: "editValue9003-02",
            xtype: "textfield"
          }, {
            id: "editName9003-03",
            xtype: "displayfield"
          }, {
            id: "editValue9003-03",
            xtype: "textfield"
          }, {
            id: "editName9003-04",
            xtype: "displayfield"
          }, {
            id: "editValue9003-04",
            xtype: "textfield"
          }, {
            id: "editName9003-05",
            xtype: "displayfield"
          }, {
            id: "editValue9003-05",
            xtype: "textfield"
          }, {
            id: "editName9003-06",
            xtype: "displayfield"
          }, {
            id: "editValue9003-06",
            xtype: "textfield"
          }, {
            id: "editName9003-07",
            xtype: "displayfield"
          }, {
            id: "editValue9003-07",
            xtype: "textfield"
          }, {
            id: "editName9003-08",
            xtype: "displayfield"
          }, {
            id: "editValue9003-08",
            xtype: "textfield"
          }, {
            id: "editName9003-09",
            xtype: "displayfield"
          }, {
            id: "editValue9003-09",
            xtype: "textfield"
          }, {
            id: "editName9003-10",
            xtype: "displayfield"
          }, {
            id: "editValue9003-10",
            xtype: "textfield"
          }, {
            id: "editName9003-11",
            xtype: "displayfield"
          }, {
            id: "editValue9003-11",
            xtype: "textfield"
          }, {
            id: "editName9003-12",
            xtype: "displayfield"
          }, {
            id: "editValue9003-12",
            xtype: "textfield"
          }]
        }, {
          title: "系统",
          border: 0,
          layout: "form",
          items: [{
            id: "editName9002-01",
            xtype: "displayfield"
          }, {
            id: "editValue9002-01",
            xtype: "textfield"
          }, {
            id: "editName9002-02",
            xtype: "displayfield"
          }, {
            id: "editValue9002-02",
            xtype: "combo",
            queryMode: "local",
            editable: false,
            valueField: "id",
            store: PCL.create(
              "PCL.data.ArrayStore", {
              fields: ["id", "text"],
              data: [["0", "原窗口打开"],
              ["1", "新窗口打开"]]
            })
          }, {
            id: "editName9002-03",
            xtype: "displayfield"
          }, {
            id: "editValue9002-03",
            xtype: "combo",
            queryMode: "local",
            editable: false,
            valueField: "id",
            store: PCL.create(
              "PCL.data.ArrayStore", {
              fields: ["id", "text"],
              data: [["0", "整数"],
              ["1", "1位小数"],
              ["2", "2位小数"],
              ["3", "3位小数"],
              ["4", "4位小数"],
              ["5", "5位小数"],
              ["6", "6位小数"],
              ["7", "7位小数"],
              ["8", "8位小数"]]
            })
          }, {
            id: "editName9002-04",
            xtype: "displayfield"
          }, {
            id: "editValue9002-04",
            xtype: "combo",
            queryMode: "local",
            editable: false,
            valueField: "id",
            store: PCL.create(
              "PCL.data.ArrayStore", {
              fields: ["id", "text"],
              data: [["0", "不启用"],
              ["1", "启用"]]
            })
          }]
        }],
        buttons
      }],
      listeners: {
        close: {
          fn: me._onWndClose,
          scope: me
        },
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
  getSaveData() {
    const me = this;

    const result = {
      companyId: me.getCompanyId(),
      'value9000-01': PCL.getCmp("editValue9000-01").getValue(),
      'value9000-02': PCL.getCmp("editValue9000-02").getValue(),
      'value9000-03': PCL.getCmp("editValue9000-03").getValue(),
      'value9000-04': PCL.getCmp("editValue9000-04").getValue(),
      'value9000-05': PCL.getCmp("editValue9000-05").getValue(),
      'value1003-02': PCL.getCmp("editValue1003-02").getValue(),
      'value2001-01': PCL.getCmp("editValue2001-01").getValue(),
      'value2001-02': PCL.getCmp("editValue2001-02").getValue(),
      'value2001-03': PCL.getCmp("editValue2001-03").getValue(),
      'value2001-04': PCL.getCmp("editValue2001-04").getValue(),
      'value2002-01': PCL.getCmp("editValue2002-01").getValue(),
      'value2002-02': PCL.getCmp("editValue2002-02").getValue(),
      'value2002-03': PCL.getCmp("editValue2002-03").getValue(),
      'value2002-04': PCL.getCmp("editValue2002-04").getValue(),
      'value2002-05': PCL.getCmp("editValue2002-05").getValue(),
      'value9001-01': PCL.getCmp("editValue9001-01").getValue(),
      'value9002-01': PCL.getCmp("editValue9002-01").getValue(),
      'value9002-02': PCL.getCmp("editValue9002-02").getValue(),
      'value9002-03': PCL.getCmp("editValue9002-03").getValue(),
      'value9002-04': PCL.getCmp("editValue9002-04").getValue(),
      'value9003-01': PCL.getCmp("editValue9003-01").getValue(),
      'value9003-02': PCL.getCmp("editValue9003-02").getValue(),
      'value9003-03': PCL.getCmp("editValue9003-03").getValue(),
      'value9003-04': PCL.getCmp("editValue9003-04").getValue(),
      'value9003-05': PCL.getCmp("editValue9003-05").getValue(),
      'value9003-06': PCL.getCmp("editValue9003-06").getValue(),
      'value9003-07': PCL.getCmp("editValue9003-07").getValue(),
      'value9003-08': PCL.getCmp("editValue9003-08").getValue(),
      'value9003-09': PCL.getCmp("editValue9003-09").getValue(),
      'value9003-10': PCL.getCmp("editValue9003-10").getValue(),
      'value9003-11': PCL.getCmp("editValue9003-11").getValue(),
      'value9003-12': PCL.getCmp("editValue9003-12").getValue()
    };

    return result;
  },

  /**
   * @private
   */
  _onOK() {
    const me = this;
    PCL.getBody().mask("正在保存中...");
    me.ajax({
      url: me.URL("Home/BizConfig/edit"),
      params: me.getSaveData(),
      callback(options, success, response) {
        PCL.getBody().unmask();

        if (success) {
          const data = me.decodeJSON(response.responseText);
          if (data.success) {
            me._saved = true;
            me.close();

            me.tip("成功保存数据", true);
          } else {
            me.showInfo(data.msg);
          }
        }
      }
    });
  },

  /**
   * @private
   */
  _onWndClose() {
    const me = this;

    PCL.get(window).un('beforeunload', me.__onWindowBeforeUnload);

    if (me._saved) {
      const parentForm = me.getParentForm();
      if (parentForm) {
        parentForm.refreshGrid.apply(parentForm, []);
      }
    }
  },

  /**
   * @private
   */
  _onWndShow() {
    const me = this;
    me._saved = false;

    PCL.get(window).on('beforeunload', me.__onWindowBeforeUnload);

    const el = me.getEl() || PCL.getBody();
    el.mask(PSI.Const.LOADING);
    me.ajax({
      url: me.URL("Home/BizConfig/allConfigsWithExtData"),
      params: {
        companyId: me.getCompanyId()
      },
      callback(options, success, response) {
        if (success) {
          const data = PCL.JSON.decode(response.responseText);
          me.__storePW.add(data.extData.warehouse);
          me.__storeWS.add(data.extData.warehouse);

          for (let i = 0; i < data.dataList.length; i++) {
            const item = data.dataList[i];
            const editName = PCL.getCmp("editName" + item.id);
            if (editName) {
              editName.setValue(item.name);
            }
            const editValue = PCL.getCmp("editValue"
              + item.id);
            if (editValue) {
              editValue.setValue(item.value);
            }
          }
        } else {
          me.showInfo("网络错误");
        }

        el.unmask();
      }
    });
  }
});
