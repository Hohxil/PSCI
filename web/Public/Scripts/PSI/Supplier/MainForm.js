/**
 * 供应商档案 - 主界面
 * 
 * @author 艾格林门信息服务（大连）有限公司
 * @copyright 2015 - present
 * @license GPL v3
 */
PCL.define("PSI.Supplier.MainForm", {
  extend: "PSI.AFX.BaseMainExForm",

  config: {
    pAddCategory: null,
    pEditCategory: null,
    pDeleteCategory: null,
    pAddSupplier: null,
    pEditSupplier: null,
    pDeleteSupplier: null
  },

  initComponent: function () {
    var me = this;

    PCL.apply(me, {
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
        xtype: "container",
        layout: "border",
        border: 0,
        items: [{
          region: "center",
          xtype: "panel",
          layout: "border",
          border: 0,
          items: [{
            region: "center",
            layout: "fit",
            border: 0,
            items: [me.getMainGrid()]
          }, {
            region: "south",
            height: 200,
            layout: "border",
            split: true,
            collapsible: true,
            border: 0,
            id: "panelGoodsRange",
            header: {
              height: 30,
              title: me
                .formatGridHeaderTitle("关联商品")
            },
            items: [{
              region: "center",
              layout: "fit",
              border: 0,
              items: [me
                .getGRCategoryGrid()]
            }, {
              region: "east",
              width: "50%",
              layout: "fit",
              split: true,
              border: 0,
              items: [me
                .getGRGoodsGrid()]
            }]
          }]
        }, {
          id: "panelCategory",
          xtype: "panel",
          region: "west",
          layout: "fit",
          width: 370,
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
    me.supplierGrid = me.getMainGrid();

    me.__queryEditNameList = ["editQueryCode", "editQueryName",
      "editQueryAddress", "editQueryContact", "editQueryMobile",
      "editQueryTel", "editQueryQQ"];

    me.freshCategoryGrid();
  },

  getToolbarCmp: function () {
    var me = this;

    return [{
      text: "新建供应商分类",
      disabled: me.getPAddCategory() == "0",
      handler: me.onAddCategory,
      scope: me
    }, {
      text: "编辑供应商分类",
      disabled: me.getPEditCategory() == "0",
      handler: me.onEditCategory,
      scope: me
    }, {
      text: "删除供应商分类",
      disabled: me.getPDeleteCategory() == "0",
      handler: me.onDeleteCategory,
      scope: me
    }, "-", {
      text: "新建供应商",
      disabled: me.getPAddSupplier() == "0",
      handler: me.onAddSupplier,
      scope: me
    }, {
      text: "编辑供应商",
      disabled: me.getPEditSupplier() == "0",
      handler: me.onEditSupplier,
      scope: me
    }, {
      text: "删除供应商",
      disabled: me.getPDeleteSupplier() == "0",
      handler: me.onDeleteSupplier,
      scope: me
    }, "-", {
      text: "指南",
      handler: function () {
        me.focus();
        window.open(me.URL("Home/Help/index?t=supplier"));
      }
    }, "-", {
      text: "关闭",
      handler: function () {
        me.closeWindow();
      }
    }];
  },

  getQueryCmp: function () {
    var me = this;

    return [{
      id: "editQueryCode",
      labelWidth: 70,
      labelAlign: "right",
      labelSeparator: "",
      fieldLabel: "供应商编码",
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
      labelWidth: 70,
      labelAlign: "right",
      labelSeparator: "",
      fieldLabel: "供应商名称",
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
      labelWidth: 70,
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
      labelWidth: 70,
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
      },
      width: 240
    }, {
      id: "editQueryMobile",
      labelWidth: 70,
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
      labelWidth: 70,
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
      labelWidth: 70,
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
        handler: function () {
          PCL.getCmp("panelQueryCmp").collapse();
        },
        scope: me
      }]
    }];
  },

  getCategoryGrid: function () {
    var me = this;
    if (me.__categoryGrid) {
      return me.__categoryGrid;
    }

    var modelName = "PSISupplierCategory";
    PCL.define(modelName, {
      extend: "PCL.data.Model",
      fields: ["id", "code", "name", {
        name: "cnt",
        type: "int"
      }]
    });

    me.__categoryGrid = PCL.create("PCL.grid.Panel", {
      cls: "PSI-FC",
      viewConfig: {
        enableTextSelection: true
      },
      header: {
        height: 30,
        title: me.formatGridHeaderTitle("供应商分类")
      },
      tools: [{
        type: "close",
        handler: function () {
          PCL.getCmp("panelCategory").collapse();
        }
      }],
      features: [{
        ftype: "summary"
      }],
      columnLines: true,
      columns: [{
        header: "分类编码",
        dataIndex: "code",
        width: 80,
        menuDisabled: true,
        sortable: false
      }, {
        header: "供应商分类",
        dataIndex: "name",
        width: 160,
        menuDisabled: true,
        sortable: false,
        summaryRenderer: function () {
          return "供应商个数合计";
        }
      }, {
        header: "供应商个数",
        dataIndex: "cnt",
        width: 100,
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

  getMainGrid: function () {
    var me = this;
    if (me.__mainGrid) {
      return me.__mainGrid;
    }

    var modelName = "PSISupplier";
    PCL.define(modelName, {
      extend: "PCL.data.Model",
      fields: ["id", "code", "name", "contact01", "tel01",
        "mobile01", "qq01", "contact02", "tel02",
        "mobile02", "qq02", "categoryId", "initPayables",
        "initPayablesDT", "address", "addressShipping",
        "bankName", "bankAccount", "tax", "fax", "note",
        "dataOrg", "taxRate", "recordStatus", "goodsRange"]
    });

    var store = PCL.create("PCL.data.Store", {
      autoLoad: false,
      model: modelName,
      data: [],
      pageSize: 20,
      proxy: {
        type: "ajax",
        actionMethods: {
          read: "POST"
        },
        url: me.URL("Home/Supplier/supplierList"),
        reader: {
          root: 'supplierList',
          totalProperty: 'totalCount'
        }
      },
      listeners: {
        beforeload: {
          fn: function () {
            store.proxy.extraParams = me.getQueryParam();
          },
          scope: me
        },
        load: {
          fn: function (e, records, successful) {
            if (successful) {
              me.refreshCategoryCount();
              me.gotoSupplierGridRecord(me.__lastId);
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
        title: "供应商列表"
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
          header: "供应商编码",
          locked: true,
          dataIndex: "code",
          renderer: function (value, metaData, record) {
            if (parseInt(record.get("recordStatus")) == 1000) {
              return value;
            } else {
              return `<span class="PSI-record-disabled">${value}</span>`;
            }
          }
        }, {
          header: "供应商名称",
          locked: true,
          dataIndex: "name",
          width: 300,
          renderer: function (value, metaData, record) {
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
          header: "发货地址",
          dataIndex: "addressShipping",
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
          header: "税率(%)",
          align: "right",
          dataIndex: "taxRate"
        }, {
          header: "应付期初余额",
          dataIndex: "initPayables",
          align: "right",
          xtype: "numbercolumn"
        }, {
          header: "应付期初余额日期",
          dataIndex: "initPayablesDT",
          width: 150
        }, {
          header: "关联物料的范围",
          dataIndex: "goodsRange",
          width: 120,
          renderer: function (value) {
            return value == 1
              ? "全部物料"
              : "<span style='color:red'>部分设置的物料</span>";
          }
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
          renderer: function (value) {
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
              fn: function () {
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
          fn: me.onEditSupplier,
          scope: me
        },
        select: {
          fn: me.onSupplierSelect,
          scope: me
        }
      }
    });

    return me.__mainGrid;
  },

  /**
   * 新建供应商分类
   */
  onAddCategory: function () {
    var me = this;

    var form = PCL.create("PSI.Supplier.CategoryEditForm", {
      parentForm: me
    });

    form.show();
  },

  /**
   * 编辑供应商分类
   */
  onEditCategory: function () {
    var me = this;
    if (me.getPEditCategory() == "0") {
      return;
    }

    var item = me.getCategoryGrid().getSelectionModel().getSelection();
    if (item == null || item.length != 1) {
      me.showInfo("请选择要编辑的供应商分类");
      return;
    }

    var category = item[0];

    var form = PCL.create("PSI.Supplier.CategoryEditForm", {
      parentForm: me,
      entity: category
    });

    form.show();
  },

  /**
   * 删除供应商分类
   */
  onDeleteCategory: function () {
    var me = this;

    var item = me.getCategoryGrid().getSelectionModel().getSelection();
    if (item == null || item.length != 1) {
      PSI.MsgBox.showInfo("请选择要删除的供应商分类");
      return;
    }

    var category = item[0];
    var info = "请确认是否删除供应商分类: <span style='color:red'>"
      + category.get("name") + "</span>";

    var store = me.getCategoryGrid().getStore();
    var index = store.findExact("id", category.get("id"));
    index--;
    var preIndex = null;
    var preItem = store.getAt(index);
    if (preItem) {
      preIndex = preItem.get("id");
    }

    me.confirm(info, function () {
      var el = PCL.getBody();
      el.mask("正在删除中...");
      me.ajax({
        url: me.URL("Home/Supplier/deleteCategory"),
        params: {
          id: category.get("id")
        },
        callback: function (options, success, response) {
          el.unmask();

          if (success) {
            var data = me.decodeJSON(response.responseText);
            if (data.success) {
              me.tip("成功完成删除操作");
              me.freshCategoryGrid(preIndex);
            } else {
              me.showInfo(data.msg);
            }
          }
        }
      });
    });
  },

  freshCategoryGrid: function (id) {
    var me = this;
    var grid = me.getCategoryGrid();
    var el = grid.getEl() || PCL.getBody();
    el.mask(PSI.Const.LOADING);
    me.ajax({
      url: me.URL("Home/Supplier/categoryList"),
      params: me.getQueryParam(),
      callback: function (options, success, response) {
        var store = grid.getStore();

        store.removeAll();

        if (success) {
          var data = me.decodeJSON(response.responseText);
          store.add(data);

          if (id) {
            var r = store.findExact("id", id);
            if (r != -1) {
              grid.getSelectionModel().select(r);
            }
          } else {
            grid.getSelectionModel().select(0);
          }
        }

        el.unmask();
      }
    });
  },

  freshSupplierGrid: function (id) {
    var me = this;

    var item = me.getCategoryGrid().getSelectionModel().getSelection();
    if (item == null || item.length != 1) {
      var grid = me.getMainGrid();
      grid.setTitle(me.formatGridHeaderTitle("供应商档案"));
      return;
    }

    var category = item[0];

    var grid = me.getMainGrid();
    grid.setTitle(me.formatGridHeaderTitle("属于分类 [" + category.get("name")
      + "] 的供应商"));

    me.__lastId = id;
    PCL.getCmp("pagingToolbar").doRefresh()
  },

  onCategoryGridSelect: function () {
    var me = this;
    me.supplierGrid.getStore().currentPage = 1;
    me.freshSupplierGrid();
  },

  onAddSupplier: function () {
    var me = this;

    if (me.getCategoryGrid().getStore().getCount() == 0) {
      me.showInfo("没有供应商分类，请先新建供应商分类");
      return;
    }

    var form = PCL.create("PSI.Supplier.SupplierEditForm", {
      parentForm: me
    });

    form.show();
  },

  /**
   * 编辑供应商档案
   */
  onEditSupplier: function () {
    var me = this;
    if (me.getPEditSupplier() == "0") {
      return;
    }

    var item = me.getCategoryGrid().getSelectionModel().getSelection();
    if (item == null || item.length != 1) {
      me.showInfo("没有选择供应商分类");
      return;
    }
    var category = item[0];

    var item = me.getMainGrid().getSelectionModel().getSelection();
    if (item == null || item.length != 1) {
      me.showInfo("请选择要编辑的供应商");
      return;
    }

    var supplier = item[0];
    supplier.set("categoryId", category.get("id"));
    var form = PCL.create("PSI.Supplier.SupplierEditForm", {
      parentForm: me,
      entity: supplier
    });

    form.show();
  },

  onDeleteSupplier: function () {
    var me = this;
    var item = me.getMainGrid().getSelectionModel().getSelection();
    if (item == null || item.length != 1) {
      me.showInfo("请选择要删除的供应商");
      return;
    }

    var supplier = item[0];

    var store = me.getMainGrid().getStore();
    var index = store.findExact("id", supplier.get("id"));
    index--;
    var preIndex = null;
    var preItem = store.getAt(index);
    if (preItem) {
      preIndex = preItem.get("id");
    }

    var info = "请确认是否删除供应商: <span style='color:red'>"
      + supplier.get("name") + "</span>";
    me.confirm(info, function () {
      var el = PCL.getBody();
      el.mask("正在删除中...");
      me.ajax({
        url: me.URL("Home/Supplier/deleteSupplier"),
        params: {
          id: supplier.get("id")
        },
        callback: function (options, success, response) {
          el.unmask();

          if (success) {
            var data = me.decodeJSON(response.responseText);
            if (data.success) {
              me.tip("成功完成删除操作");
              me.freshSupplierGrid(preIndex);
            } else {
              me.showInfo(data.msg);
            }
          }
        }

      });
    });
  },

  gotoCategoryGridRecord: function (id) {
    var me = this;
    var grid = me.getCategoryGrid();
    var store = grid.getStore();
    if (id) {
      var r = store.findExact("id", id);
      if (r != -1) {
        grid.getSelectionModel().select(r);
      } else {
        grid.getSelectionModel().select(0);
      }
    }
  },

  gotoSupplierGridRecord: function (id) {
    var me = this;
    var grid = me.getMainGrid();
    var store = grid.getStore();
    if (id) {
      var r = store.findExact("id", id);
      if (r != -1) {
        grid.getSelectionModel().select(r);
      } else {
        grid.getSelectionModel().select(0);
      }
    } else {
      grid.getSelectionModel().select(0);
    }
  },

  refreshCategoryCount: function () {
    var me = this;
    var item = me.getCategoryGrid().getSelectionModel().getSelection();
    if (item == null || item.length != 1) {
      return;
    }

    var category = item[0];
    category.set("cnt", me.getMainGrid().getStore().getTotalCount());
    me.getCategoryGrid().getStore().commitChanges();
  },

  onQueryEditSpecialKey: function (field, e) {
    if (e.getKey() === e.ENTER) {
      var me = this;
      var id = field.getId();
      for (var i = 0; i < me.__queryEditNameList.length - 1; i++) {
        var editorId = me.__queryEditNameList[i];
        if (id === editorId) {
          var edit = PCL.getCmp(me.__queryEditNameList[i + 1]);
          edit.focus();
          edit.setValue(edit.getValue());
        }
      }
    }
  },

  onLastQueryEditSpecialKey: function (field, e) {
    var me = this;

    if (e.getKey() === e.ENTER) {
      me.onQuery();
    }
  },

  getQueryParam: function () {
    var me = this;
    var item = me.getCategoryGrid().getSelectionModel().getSelection();
    var categoryId;
    if (item == null || item.length != 1) {
      categoryId = null;
    } else {
      categoryId = item[0].get("id");
    }

    var result = {
      categoryId: categoryId
    };

    var code = PCL.getCmp("editQueryCode").getValue();
    if (code) {
      result.code = code;
    }

    var address = PCL.getCmp("editQueryAddress").getValue();
    if (address) {
      result.address = address;
    }

    var name = PCL.getCmp("editQueryName").getValue();
    if (name) {
      result.name = name;
    }

    var contact = PCL.getCmp("editQueryContact").getValue();
    if (contact) {
      result.contact = contact;
    }

    var mobile = PCL.getCmp("editQueryMobile").getValue();
    if (mobile) {
      result.mobile = mobile;
    }

    var tel = PCL.getCmp("editQueryTel").getValue();
    if (tel) {
      result.tel = tel;
    }

    var qq = PCL.getCmp("editQueryQQ").getValue();
    if (qq) {
      result.qq = qq;
    }

    result.recordStatus = PCL.getCmp("editQueryRecordStatus").getValue();

    return result;
  },

  onQuery: function () {
    var me = this;

    me.getMainGrid().getStore().removeAll();
    me.freshCategoryGrid();
  },

  onClearQuery: function () {
    var me = this;

    var nameList = me.__queryEditNameList;
    for (var i = 0; i < nameList.length; i++) {
      var name = nameList[i];
      var edit = PCL.getCmp(name);
      if (edit) {
        edit.setValue(null);
      }
    }

    PCL.getCmp("editQueryRecordStatus").setValue(-1);

    me.onQuery();
  },

  // 关联物料 - 按物料类别设置
  getGRCategoryGrid: function () {
    var me = this;
    if (me.__grcategoryGrid) {
      return me.__grcategoryGrid;
    }

    var modelName = "PSISupplierGRCategory";
    PCL.define(modelName, {
      extend: "PCL.data.Model",
      fields: ["id", "code", "name"]
    });

    me.__grcategoryGrid = PCL.create("PCL.grid.Panel", {
      cls: "PSI-HL",
      viewConfig: {
        enableTextSelection: true
      },
      header: {
        height: 30,
        title: me.formatGridHeaderTitle("按物料分类设置")
      },
      selModel: {
        mode: "MULTI"
      },
      selType: "checkboxmodel",
      tbar: [{
        text: "添加物料分类",
        scope: me,
        handler: me.onAddGRCategory
      }, "-", {
        text: "移除物料分类",
        scope: me,
        handler: me.onDeleteGRCategory
      }],
      columnLines: true,
      columns: [{
        header: "物料分类编码",
        dataIndex: "code",
        width: 120,
        menuDisabled: true,
        sortable: false
      }, {
        header: "物料分类",
        dataIndex: "name",
        width: 160,
        menuDisabled: true,
        sortable: false
      }],
      store: PCL.create("PCL.data.Store", {
        model: modelName,
        autoLoad: false,
        data: []
      }),
      listeners: {}
    });

    return me.__grcategoryGrid;
  },

  // 关联物料 - 个别物料设置
  getGRGoodsGrid: function () {
    var me = this;
    if (me.__grgoodsGrid) {
      return me.__grgoodsGrid;
    }

    var modelName = "PSISupplierGRGoods";
    PCL.define(modelName, {
      extend: "PCL.data.Model",
      fields: ["id", "code", "name", "spec"]
    });

    me.__grgoodsGrid = PCL.create("PCL.grid.Panel", {
      cls: "PSI-HL",
      viewConfig: {
        enableTextSelection: true
      },
      header: {
        height: 30,
        title: me.formatGridHeaderTitle("按个别物料设置")
      },
      selModel: {
        mode: "MULTI"
      },
      selType: "checkboxmodel",
      tbar: [{
        text: "添加物料",
        scope: me,
        handler: me.onAddGRGoods
      }, "-", {
        text: "移除物料",
        scope: me,
        handler: me.onDeleteGRGoods
      }],
      columnLines: true,
      columns: [{
        header: "物料编码",
        dataIndex: "code",
        width: 120,
        menuDisabled: true,
        sortable: false
      }, {
        header: "品名",
        dataIndex: "name",
        width: 160,
        menuDisabled: true,
        sortable: false
      }, {
        header: "规格型号",
        dataIndex: "spec",
        width: 160,
        menuDisabled: true,
        sortable: false
      }],
      store: PCL.create("PCL.data.Store", {
        model: modelName,
        autoLoad: false,
        data: []
      }),
      listeners: {}
    });

    return me.__grgoodsGrid;
  },

  onAddGRCategory: function () {
    var me = this;

    var item = me.getMainGrid().getSelectionModel().getSelection();
    if (item == null || item.length != 1) {
      me.showInfo("请选择要设置关联物料的供应商");
      return;
    }

    var supplier = item[0];

    var form = PCL.create("PSI.Supplier.GRCategoryEditForm", {
      entity: supplier,
      parentForm: me
    });
    form.show();
  },

  onDeleteGRCategory: function () {
    var me = this;
    var item = me.getMainGrid().getSelectionModel().getSelection();
    if (item == null || item.length != 1) {
      me.showInfo("没有选择供应商");
      return;
    }

    var supplier = item[0];

    var item = me.getGRCategoryGrid().getSelectionModel().getSelection();
    if (item == null || item.length == 0) {
      me.showInfo("没有选择要移除的物料分类");
      return;
    }

    var idArray = [];
    for (var i = 0; i < item.length; i++) {
      idArray.push(item[i].get("id"));
    }

    var info = "请确认是否要移除选中的物料分类?";
    var confirmFunc = function () {
      var el = PCL.getBody();
      el.mask("正在删除中...");
      var r = {
        url: me.URL("Home/Supplier/deleteGRCategory"),
        params: {
          id: supplier.get("id"),
          idList: idArray.join(",")
        },
        callback: function (options, success, response) {
          el.unmask();

          if (success) {
            var data = me.decodeJSON(response.responseText);
            if (data.success) {
              me.tip("成功完成删除操作");
              me.refreshGRCategoryGrid();
            } else {
              me.showInfo(data.msg);
            }
          }
        }
      };
      me.ajax(r);
    };

    me.confirm(info, confirmFunc);
  },

  onAddGRGoods: function () {
    var me = this;

    var item = me.getMainGrid().getSelectionModel().getSelection();
    if (item == null || item.length != 1) {
      me.showInfo("请选择要设置关联物料的供应商");
      return;
    }

    var supplier = item[0];

    var form = PCL.create("PSI.Supplier.GRGoodsEditForm", {
      entity: supplier,
      parentForm: me
    });
    form.show();
  },

  onDeleteGRGoods: function () {
    var me = this;
    var item = me.getMainGrid().getSelectionModel().getSelection();
    if (item == null || item.length != 1) {
      me.showInfo("没有选择供应商");
      return;
    }

    var supplier = item[0];

    var item = me.getGRGoodsGrid().getSelectionModel().getSelection();
    if (item == null || item.length == 0) {
      me.showInfo("没有选择要移除的个别物料");
      return;
    }

    var idArray = [];
    for (var i = 0; i < item.length; i++) {
      idArray.push(item[i].get("id"));
    }

    var info = "请确认是否要移除选中的物料?";
    var confirmFunc = function () {
      var el = PCL.getBody();
      el.mask("正在删除中...");
      var r = {
        url: me.URL("Home/Supplier/deleteGRGoods"),
        params: {
          id: supplier.get("id"),
          idList: idArray.join(",")
        },
        callback: function (options, success, response) {
          el.unmask();

          if (success) {
            var data = me.decodeJSON(response.responseText);
            if (data.success) {
              me.tip("成功完成删除操作");
              me.refreshGRGoodsGrid();
            } else {
              me.showInfo(data.msg);
            }
          }
        }
      };
      me.ajax(r);
    };

    me.confirm(info, confirmFunc);
  },

  onSupplierSelect: function () {
    var me = this;
    var item = me.getMainGrid().getSelectionModel().getSelection();
    if (item == null || item.length != 1) {
      return;
    }

    var supplier = item[0];
    var goodsRange = supplier.get("goodsRange");

    var info = "供应商[" + supplier.get("name") + "]";
    if (goodsRange == 1) {
      info += "能使用<strong>全部物料</strong>(<span class='PSI-field-note'>下表的设置不生效</span>)";
    } else {
      info += "只能使用如下设置中的<strong>关联物料</strong>";
    }
    info = "<span style='font-size:120%;'>" + info + "</span>";
    PCL.getCmp("panelGoodsRange").setTitle(info);

    me.refreshGRCategoryGrid();
    me.refreshGRGoodsGrid();
  },

  refreshGRCategoryGrid: function () {
    var me = this;
    var item = me.getMainGrid().getSelectionModel().getSelection();
    if (item == null || item.length != 1) {
      return;
    }

    var supplier = item[0];

    var grid = me.getGRCategoryGrid();
    var el = grid.getEl() || PCL.getBody();
    el.mask(PSI.Const.LOADING);
    me.ajax({
      url: me.URL("Home/Supplier/grCategoryList"),
      method: "POST",
      params: {
        id: supplier.get("id")
      },
      callback: function (options, success, response) {
        var store = grid.getStore();

        store.removeAll();

        if (success) {
          var data = me.decodeJSON(response.responseText);
          store.add(data);
        }

        el.unmask();
      }
    });
  },

  refreshGRGoodsGrid: function () {
    var me = this;
    var item = me.getMainGrid().getSelectionModel().getSelection();
    if (item == null || item.length != 1) {
      return;
    }

    var supplier = item[0];

    var grid = me.getGRGoodsGrid();
    var el = grid.getEl() || PCL.getBody();
    el.mask(PSI.Const.LOADING);
    me.ajax({
      url: me.URL("Home/Supplier/grGoodsList"),
      method: "POST",
      params: {
        id: supplier.get("id")
      },
      callback: function (options, success, response) {
        var store = grid.getStore();

        store.removeAll();

        if (success) {
          var data = me.decodeJSON(response.responseText);
          store.add(data);
        }

        el.unmask();
      }
    });
  }
});
