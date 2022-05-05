/**
 * 客户资料 - 主界面
 * 
 * @author 艾格林门信息服务（大连）有限公司
 * @copyright 2015 - present
 * @license GPL v3
 */
PCL.define("PSI.Customer.MainForm", {
  extend: "PSI.AFX.Form.MainForm",
  border: 0,

  config: {
    pAddCategory: null,
    pEditCategory: null,
    pDeleteCategory: null,
    pAddCustomer: null,
    pEditCustomer: null,
    pDeleteCustomer: null,
    pImportCustomer: null
  },

  /**
   * 初始化组件
   * 
   * @override
   */
  initComponent() {
    const me = this;

    PCL.apply(me, {
      layout: "border",
      items: [{
        tbar: me.getToolbarCmp(),
        id: "panelQueryCmp",
        region: "north",
        height: 90,
        border: 0,
        collapsible: true,
        collapseMode: "mini",
        header: false,
        layout: {
          type: "table",
          columns: 5
        },
        items: me.getQueryCmp()
      }, {
        region: "center",
        layout: "border",
        border: 0,
        items: [{
          region: "center",
          xtype: "panel",
          layout: "fit",
          border: 0,
          items: [me.getMainGrid()]
        }, {
          id: "panelCategory",
          xtype: "panel",
          region: "west",
          layout: "fit",
          width: 430,
          split: true,
          collapsible: true,
          header: false,
          border: 0,
          items: [me.getCategoryGrid()]
        }]
      }]
    });

    me.callParent(arguments);

    me.categoryGrid = me.getCategoryGrid();
    me.customerGrid = me.getMainGrid();

    me.__queryEditNameList = ["editQueryCode", "editQueryName",
      "editQueryAddress", "editQueryContact", "editQueryMobile",
      "editQueryTel", "editQueryQQ"];

    me.freshCategoryGrid();
  },

  /**
   * @private
   */
  getToolbarCmp() {
    const me = this;

    return [{
      text: "新建客户分类",
      disabled: me.getPAddCategory() == "0",
      handler: me.onAddCategory,
      scope: me
    }, {
      text: "编辑客户分类",
      disabled: me.getPEditCategory() == "0",
      handler: me.onEditCategory,
      scope: me
    }, {
      text: "删除客户分类",
      disabled: me.getPDeleteCategory() == "0",
      handler: me.onDeleteCategory,
      scope: me
    }, "-", {
      text: "新建客户",
      disabled: me.getPAddCustomer() == "0",
      handler: me.onAddCustomer,
      scope: me
    }, {
      text: "导入客户",
      disabled: me.getPImportCustomer() == "0",
      handler: me.onImportCustomer,
      scope: me
    }, {
      text: "编辑客户",
      disabled: me.getPEditCustomer() == "0",
      handler: me.onEditCustomer,
      scope: me
    }, {
      text: "删除客户",
      disabled: me.getPDeleteCustomer() == "0",
      handler: me.onDeleteCustomer,
      scope: me
    }, "-", {
      text: "指南",
      handler() {
        me.focus();
        window.open(me.URL("Home/Help/index?t=customer"));
      }
    }, "-", {
      text: "关闭",
      handler() {
        me.closeWindow();
      }
    }];
  },

  /**
   * @private
   */
  getQueryCmp() {
    const me = this;

    return [{
      id: "editQueryCode",
      labelWidth: 60,
      labelAlign: "right",
      labelSeparator: "",
      fieldLabel: "客户编码",
      margin: "5, 0, 0, 0",
      xtype: "textfield",
      listeners: {
        specialkey: {
          fn: me.onQueryEditSpecialKey,
          scope: me
        }
      }
    }, {
      id: "editQueryName",
      labelWidth: 60,
      labelAlign: "right",
      labelSeparator: "",
      fieldLabel: "客户名称",
      margin: "5, 0, 0, 0",
      xtype: "textfield",
      listeners: {
        specialkey: {
          fn: me.onQueryEditSpecialKey,
          scope: me
        }
      }
    }, {
      id: "editQueryAddress",
      labelWidth: 60,
      labelAlign: "right",
      labelSeparator: "",
      fieldLabel: "地址",
      margin: "5, 0, 0, 0",
      xtype: "textfield",
      listeners: {
        specialkey: {
          fn: me.onQueryEditSpecialKey,
          scope: me
        }
      }
    }, {
      id: "editQueryContact",
      labelWidth: 60,
      labelAlign: "right",
      labelSeparator: "",
      fieldLabel: "联系人",
      margin: "5, 0, 0, 0",
      xtype: "textfield",
      listeners: {
        specialkey: {
          fn: me.onQueryEditSpecialKey,
          scope: me
        }
      }
    }, {
      id: "editQueryMobile",
      labelWidth: 60,
      labelAlign: "right",
      labelSeparator: "",
      fieldLabel: "手机",
      margin: "5, 0, 0, 0",
      xtype: "textfield",
      listeners: {
        specialkey: {
          fn: me.onQueryEditSpecialKey,
          scope: me
        }
      }
    }, {
      id: "editQueryTel",
      labelWidth: 60,
      labelAlign: "right",
      labelSeparator: "",
      fieldLabel: "固话",
      margin: "5, 0, 0, 0",
      xtype: "textfield",
      listeners: {
        specialkey: {
          fn: me.onQueryEditSpecialKey,
          scope: me
        }
      }
    }, {
      id: "editQueryQQ",
      labelWidth: 60,
      labelAlign: "right",
      labelSeparator: "",
      fieldLabel: "QQ",
      margin: "5, 0, 0, 0",
      xtype: "textfield",
      listeners: {
        specialkey: {
          fn: me.onLastQueryEditSpecialKey,
          scope: me
        }
      }
    }, {
      id: "editQueryRecordStatus",
      xtype: "combo",
      queryMode: "local",
      editable: false,
      valueField: "id",
      labelWidth: 60,
      labelAlign: "right",
      labelSeparator: "",
      fieldLabel: "状态",
      margin: "5, 0, 0, 0",
      store: PCL.create("PCL.data.ArrayStore", {
        fields: ["id", "text"],
        data: [[-1, "全部"], [1000, "启用"], [0, "停用"]]
      }),
      value: -1
    }, {
      xtype: "container",
      items: [{
        xtype: "button",
        text: "查询",
        width: 100,
        height: 26,
        margin: "5, 0, 0, 20",
        handler: me.onQuery,
        scope: me
      }, {
        xtype: "button",
        text: "清空查询条件",
        width: 100,
        height: 26,
        margin: "5, 0, 0, 15",
        handler: me.onClearQuery,
        scope: me
      }]
    }, {
      xtype: "container",
      items: [{
        xtype: "button",
        text: "隐藏工具栏",
        width: 130,
        height: 26,
        iconCls: "PSI-button-hide",
        margin: "5 0 0 10",
        handler() {
          PCL.getCmp("panelQueryCmp").collapse();
        },
        scope: me
      }]
    }];
  },

  /**
   * @private
   */
  getCategoryGrid() {
    const me = this;

    if (me.__categoryGrid) {
      return me.__categoryGrid;
    }

    const modelName = "PSIModel.PSI.Customer.CustomerCategory";

    PCL.define(modelName, {
      extend: "PCL.data.Model",
      fields: ["id", "code", "name", {
        name: "cnt",
        type: "int"
      }, "priceSystem"]
    });

    me.__categoryGrid = PCL.create("PCL.grid.Panel", {
      cls: "PSI-FC",
      viewConfig: {
        enableTextSelection: true
      },
      header: {
        height: 30,
        title: me.formatGridHeaderTitle("客户分类")
      },
      tools: [{
        type: "close",
        handler() {
          PCL.getCmp("panelCategory").collapse();
        }
      }],
      features: [{
        ftype: "summary"
      }],
      columnLines: true,
      columns: [{
        header: "类别编码",
        dataIndex: "code",
        width: 80,
        menuDisabled: true,
        sortable: false
      }, {
        header: "类别",
        dataIndex: "name",
        width: 160,
        menuDisabled: true,
        sortable: false,
        summaryRenderer() {
          return "客户数合计";
        }
      }, {
        header: "价格体系",
        dataIndex: "priceSystem",
        width: 80,
        menuDisabled: true,
        sortable: false
      }, {
        header: "客户数",
        dataIndex: "cnt",
        width: 80,
        menuDisabled: true,
        sortable: false,
        summaryType: "sum",
        align: "right"
      }],
      store: PCL.create("PCL.data.Store", {
        model: modelName,
        autoLoad: false,
        data: []
      }),
      listeners: {
        select: {
          fn: me.onCategoryGridSelect,
          scope: me
        },
        itemdblclick: {
          fn: me.onEditCategory,
          scope: me
        }
      }
    });

    return me.__categoryGrid;
  },

  /**
   * @private
   */
  getMainGrid() {
    const me = this;
    if (me.__mainGrid) {
      return me.__mainGrid;
    }

    const modelName = "PSIModel.PSI.Customer.CustomerModel";

    PCL.define(modelName, {
      extend: "PCL.data.Model",
      fields: ["id", "code", "name", "contact01", "tel01",
        "mobile01", "qq01", "contact02", "tel02",
        "mobile02", "qq02", "categoryId",
        "initReceivables", "initReceivablesDT", "address",
        "addressReceipt", "bankName", "bankAccount", "tax",
        "fax", "note", "dataOrg", "warehouseName",
        "recordStatus"]
    });

    const store = PCL.create("PCL.data.Store", {
      autoLoad: false,
      model: modelName,
      data: [],
      pageSize: 20,
      proxy: {
        type: "ajax",
        actionMethods: {
          read: "POST"
        },
        url: me.URL("Home/Customer/customerList"),
        reader: {
          root: 'customerList',
          totalProperty: 'totalCount'
        }
      },
      listeners: {
        beforeload: {
          fn() {
            store.proxy.extraParams = me.getQueryParam();
          },
          scope: me
        },
        load: {
          fn(e, records, successful) {
            if (successful) {
              me.refreshCategoryCount();
              me.gotoCustomerGridRecord(me.__lastId);
            }
          },
          scope: me
        }
      }
    });

    me.__mainGrid = PCL.create("PCL.grid.Panel", {
      cls: "PSI-LC",
      viewConfig: {
        enableTextSelection: true
      },
      header: {
        height: 30,
        title: me.formatGridHeaderTitle("客户列表")
      },
      columnLines: true,
      columns: {
        defaults: {
          menuDisabled: true,
          sortable: false
        },
        items: [PCL.create("PCL.grid.RowNumberer", {
          text: "#",
          width: 40
        }), {
          header: "客户编码",
          dataIndex: "code",
          locked: true,
          renderer(value, metaData, record) {
            if (parseInt(record.get("recordStatus")) == 1000) {
              return value;
            } else {
              return `<span class="PSI-record-disabled">${value}</span>`;
            }
          }
        }, {
          header: "客户名称",
          dataIndex: "name",
          locked: true,
          width: 300,
          renderer(value, metaData, record) {
            if (parseInt(record.get("recordStatus")) == 1000) {
              return value;
            } else {
              return `<span class="PSI-record-disabled">${value}</span>`;
            }
          }
        }, {
          header: "地址",
          dataIndex: "address",
          width: 300
        }, {
          header: "联系人",
          dataIndex: "contact01"
        }, {
          header: "手机",
          dataIndex: "mobile01"
        }, {
          header: "固话",
          dataIndex: "tel01"
        }, {
          header: "QQ",
          dataIndex: "qq01"
        }, {
          header: "备用联系人",
          dataIndex: "contact02"
        }, {
          header: "备用联系人手机",
          dataIndex: "mobile02",
          width: 150
        }, {
          header: "备用联系人固话",
          dataIndex: "tel02",
          width: 150
        }, {
          header: "备用联系人QQ",
          dataIndex: "qq02",
          width: 150
        }, {
          header: "收货地址",
          dataIndex: "addressReceipt",
          width: 300
        }, {
          header: "开户行",
          dataIndex: "bankName"
        }, {
          header: "开户行账号",
          dataIndex: "bankAccount"
        }, {
          header: "税号",
          dataIndex: "tax"
        }, {
          header: "传真",
          dataIndex: "fax"
        }, {
          header: "应收期初余额",
          dataIndex: "initReceivables",
          align: "right",
          xtype: "numbercolumn"
        }, {
          header: "应收期初余额日期",
          dataIndex: "initReceivablesDT",
          width: 150
        }, {
          header: "销售出库仓库",
          dataIndex: "warehouseName",
          width: 200
        }, {
          header: "备注",
          dataIndex: "note",
          width: 400
        }, {
          header: "数据域",
          dataIndex: "dataOrg"
        }, {
          header: "状态",
          dataIndex: "recordStatus",
          renderer(value) {
            if (parseInt(value) == 1000) {
              return "启用";
            } else {
              return "<span style='color:red'>停用</span>";
            }
          }
        }]
      },
      store: store,
      bbar: ["->", {
        id: "pagingToolbar",
        border: 0,
        xtype: "pagingtoolbar",
        store: store
      }, "-", {
          xtype: "displayfield",
          value: "每页显示"
        }, {
          id: "comboCountPerPage",
          xtype: "combobox",
          editable: false,
          width: 60,
          store: PCL.create("PCL.data.ArrayStore", {
            fields: ["text"],
            data: [["20"], ["50"], ["100"], ["300"],
            ["1000"]]
          }),
          value: 20,
          listeners: {
            change: {
              fn() {
                store.pageSize = PCL.getCmp("comboCountPerPage").getValue();
                store.currentPage = 1;
                PCL.getCmp("pagingToolbar").doRefresh();
              },
              scope: me
            }
          }
        }, {
          xtype: "displayfield",
          value: "条记录"
        }],
      listeners: {
        itemdblclick: {
          fn: me.onEditCustomer,
          scope: me
        }
      }
    });

    return me.__mainGrid;
  },

  /**
   * 新增客户分类
   * 
   * @private
   */
  onAddCategory() {
    const me = this;

    const form = PCL.create("PSI.Customer.CategoryEditForm", {
      parentForm: me
    });

    form.show();
  },

  /**
   * 编辑客户分类
   * 
   * @private
   */
  onEditCategory() {
    const me = this;
    if (me.getPEditCategory() == "0") {
      return;
    }

    const item = me.getCategoryGrid().getSelectionModel().getSelection();
    if (item == null || item.length != 1) {
      me.showInfo("请选择要编辑的客户分类");
      return;
    }

    const category = item[0];

    const form = PCL.create("PSI.Customer.CategoryEditForm", {
      parentForm: me,
      entity: category
    });

    form.show();
  },

  /**
   * 删除客户分类
   * 
   * @private
   */
  onDeleteCategory() {
    const me = this;
    const item = me.categoryGrid.getSelectionModel().getSelection();
    if (item == null || item.length != 1) {
      me.showInfo("请选择要删除的客户分类");
      return;
    }

    const category = item[0];

    const store = me.getCategoryGrid().getStore();
    let index = store.findExact("id", category.get("id"));
    index--;
    let preIndex = null;
    const preItem = store.getAt(index);
    if (preItem) {
      preIndex = preItem.get("id");
    }

    const info = `请确认是否删除客户分类: <span style='color:red'>${category.get("name")}</span> ？`;

    const funcConfirm = () => {
      const el = PCL.getBody();
      el.mask("正在删除中...");

      const r = {
        url: me.URL("Home/Customer/deleteCategory"),
        params: {
          id: category.get("id")
        },
        callback(options, success, response) {
          el.unmask();

          if (success) {
            const data = me.decodeJSON(response.responseText);
            if (data.success) {
              me.tip("成功完成删除操作", true);
              me.freshCategoryGrid(preIndex);
            } else {
              me.showInfo(data.msg);
            }
          } else {
            me.showInfo("网络错误");
          }
        }
      };

      me.ajax(r);
    };

    me.confirm(info, funcConfirm);
  },

  /**
   * 刷新客户分类Grid
   * 
   * @private
   */
  freshCategoryGrid(id) {
    const me = this;
    const grid = me.getCategoryGrid();
    const el = grid.getEl() || PCL.getBody();
    el.mask(PSI.Const.LOADING);
    me.ajax({
      url: me.URL("Home/Customer/categoryList"),
      params: me.getQueryParam(),
      callback(options, success, response) {
        const store = grid.getStore();

        store.removeAll();

        if (success) {
          const data = me.decodeJSON(response.responseText);
          store.add(data);

          if (store.getCount() > 0) {
            if (id) {
              const r = store.findExact("id", id);
              if (r != -1) {
                grid.getSelectionModel().select(r);
              }
            } else {
              grid.getSelectionModel().select(0);
            }
          }
        }

        el.unmask();
      }
    });
  },

  /**
   * 刷新客户资料Grid
   * 
   * @private
   */
  freshCustomerGrid(id) {
    const me = this;

    const item = me.getCategoryGrid().getSelectionModel().getSelection();
    if (item == null || item.length != 1) {
      const grid = me.getMainGrid();
      grid.setTitle(me.formatGridHeaderTitle("客户列表"));
      return;
    }

    const category = item[0];

    const grid = me.getMainGrid();
    const info = `<span class='PSI-title-keyword'>${category.get("name")}</span> - 客户列表`;
    grid.setTitle(me.formatGridHeaderTitle(info));

    me.__lastId = id;
    PCL.getCmp("pagingToolbar").doRefresh()
  },

  /**
   * @private
   */
  onCategoryGridSelect() {
    const me = this;
    me.getMainGrid().getStore().currentPage = 1;
    me.freshCustomerGrid();
  },

  /**
   * 新增客户资料
   * 
   * @private
   */
  onAddCustomer() {
    const me = this;

    if (me.getCategoryGrid().getStore().getCount() == 0) {
      me.showInfo("没有客户分类，请先新增客户分类");
      return;
    }

    const form = PCL.create("PSI.Customer.CustomerEditForm", {
      parentForm: me
    });

    form.show();
  },

  /**
   * 导入客户资料
   * 
   * @private
   */
  onImportCustomer() {
    const form = PCL.create("PSI.Customer.CustomerImportForm", {
      parentForm: this
    });

    form.show();
  },

  /**
   * 编辑客户资料
   * 
   * @private
   */
  onEditCustomer() {
    const me = this;
    if (me.getPEditCustomer() == "0") {
      return;
    }

    let item = me.getCategoryGrid().getSelectionModel().getSelection();
    if (item == null || item.length != 1) {
      me.showInfo("没有选择客户分类");
      return;
    }
    const category = item[0];

    item = me.getMainGrid().getSelectionModel().getSelection();
    if (item == null || item.length != 1) {
      me.showInfo("请选择要编辑的客户");
      return;
    }

    const customer = item[0];
    customer.set("categoryId", category.get("id"));
    const form = PCL.create("PSI.Customer.CustomerEditForm", {
      parentForm: me,
      entity: customer
    });

    form.show();
  },

  /**
   * 删除客户资料
   * 
   * @private
   */
  onDeleteCustomer() {
    const me = this;
    const item = me.getMainGrid().getSelectionModel().getSelection();
    if (item == null || item.length != 1) {
      me.showInfo("请选择要删除的客户");
      return;
    }

    const customer = item[0];

    const store = me.getMainGrid().getStore();
    let index = store.findExact("id", customer.get("id"));
    index--;
    let preIndex = null;
    const preItem = store.getAt(index);
    if (preItem) {
      preIndex = preItem.get("id");
    }

    const info = `请确认是否删除客户: <span style='color:red'>${customer.get("name")}</span> ？`;

    const funcConfirm = () => {
      const el = PCL.getBody();
      el.mask("正在删除中...");

      const r = {
        url: me.URL("Home/Customer/deleteCustomer"),
        params: {
          id: customer.get("id")
        },
        callback(options, success, response) {
          el.unmask();

          if (success) {
            const data = me.decodeJSON(response.responseText);
            if (data.success) {
              me.tip("成功完成删除操作", true);
              me.freshCustomerGrid(preIndex);
            } else {
              me.showInfo(data.msg);
            }
          }
        }

      };

      me.ajax(r);
    };

    me.confirm(info, funcConfirm);
  },

  /**
   * @private
   */
  gotoCustomerGridRecord(id) {
    const me = this;
    const grid = me.getMainGrid();
    const store = grid.getStore();
    if (id) {
      const r = store.findExact("id", id);
      if (r != -1) {
        grid.getSelectionModel().select(r);
      } else {
        grid.getSelectionModel().select(0);
      }
    } else {
      grid.getSelectionModel().select(0);
    }
  },

  /**
   * @private
   */
  refreshCategoryCount() {
    const me = this;
    const item = me.getCategoryGrid().getSelectionModel().getSelection();
    if (item == null || item.length != 1) {
      return;
    }

    const category = item[0];
    category.set("cnt", me.getMainGrid().getStore().getTotalCount());
    me.getCategoryGrid().getStore().commitChanges();
  },

  /**
   * @private
   */
  onQueryEditSpecialKey(field, e) {
    if (e.getKey() === e.ENTER) {
      const me = this;
      const id = field.getId();
      for (let i = 0; i < me.__queryEditNameList.length - 1; i++) {
        const editorId = me.__queryEditNameList[i];
        if (id === editorId) {
          const edit = PCL.getCmp(me.__queryEditNameList[i + 1]);
          edit.focus();
          edit.setValue(edit.getValue());
        }
      }
    }
  },

  /**
   * @private
   */
  onLastQueryEditSpecialKey(field, e) {
    if (e.getKey() === e.ENTER) {
      this.onQuery();
    }
  },

  /**
   * @private
   */
  getQueryParam() {
    const me = this;
    const item = me.getCategoryGrid().getSelectionModel().getSelection();
    let categoryId;
    if (item == null || item.length != 1) {
      categoryId = null;
    } else {
      categoryId = item[0].get("id");
    }

    const result = {
      categoryId: categoryId
    };

    const code = PCL.getCmp("editQueryCode").getValue();
    if (code) {
      result.code = code;
    }

    const address = PCL.getCmp("editQueryAddress").getValue();
    if (address) {
      result.address = address;
    }

    const name = PCL.getCmp("editQueryName").getValue();
    if (name) {
      result.name = name;
    }

    const contact = PCL.getCmp("editQueryContact").getValue();
    if (contact) {
      result.contact = contact;
    }

    const mobile = PCL.getCmp("editQueryMobile").getValue();
    if (mobile) {
      result.mobile = mobile;
    }

    const tel = PCL.getCmp("editQueryTel").getValue();
    if (tel) {
      result.tel = tel;
    }

    const qq = PCL.getCmp("editQueryQQ").getValue();
    if (qq) {
      result.qq = qq;
    }

    result.recordStatus = PCL.getCmp("editQueryRecordStatus").getValue();

    return result;
  },

  /**
   * 查询
   * 
   * @private
   */
  onQuery() {
    const me = this;

    me.getMainGrid().getStore().removeAll();
    me.freshCategoryGrid();
  },

  /**
   * 清除查询条件
   * 
   * @private
   */
  onClearQuery() {
    const me = this;

    const nameList = me.__queryEditNameList;
    for (let i = 0; i < nameList.length; i++) {
      const name = nameList[i];
      const edit = PCL.getCmp(name);
      if (edit) {
        edit.setValue(null);
      }
    }

    PCL.getCmp("editQueryRecordStatus").setValue(-1);

    me.onQuery();
  }
});
