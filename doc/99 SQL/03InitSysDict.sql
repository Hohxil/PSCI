# @author 艾格林门信息服务（大连）有限公司
# @copyright 2015 - present
# @license GPL v3

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

TRUNCATE TABLE `t_dict_table_category`;
INSERT INTO `t_dict_table_category` (`id`, `code`, `name`, `parent_id`) VALUES
('SLN0000.01', 'SLN0000.01', '码表', NULL),
('SLN0000.02', 'SLN0000.02', '自定义表单', NULL),
('SLN0000.03', 'SLN0000.03', '视图', NULL),
('SLN0000.04', 'SLN0000.04', '报表', NULL),
('SLN0000.05', 'SLN0000.05', '工作流', NULL),
('SLN0000.51', 'SLN0000.51', '组织机构', NULL),
('SLN0000.52', 'SLN0000.52', '用户', NULL),
('SLN0002.01', 'SLN0002.01', '会计科目', NULL);

TRUNCATE TABLE `t_dict_table_md`;
INSERT INTO `t_dict_table_md` (`id`, `code`, `name`, `table_name`, `category_id`, `memo`, `py`) VALUES
('473D4804-60AF-11EC-A41B-E86A641ED142', 'SLN0000.01.01', '码表记录状态', 't_sysdict_sln0000_ct_record_status', 'SLN0000.01', '码表记录的状态', 'MBJLZT'),
('53965D61-60AF-11EC-A41B-E86A641ED142', 'SLN0000.01.02', '码表字段编辑器类型', 't_sysdict_sln0000_ct_editor_xtype', 'SLN0000.01', '码表字段编辑器的类型', 'MBZDBJQLX'),
('E314BAAD-9936-11EC-88C3-E86A641ED142', 'SLN0000.01.03', '码表层级数据', 't_sysdict_sln0000_ct_tree_view', 'SLN0000.01', '码表是否启用层级数据', 'MBCJSJ'),
('168711AD-9937-11EC-88C3-E86A641ED142', 'SLN0000.01.04', '码表视图分页', 't_sysdict_sln0000_ct_view_paging', 'SLN0000.01', '码表是否数据分页', 'MBSTFY'),
('45CEE82A-99F0-11EC-A344-E86A641ED142', 'SLN0000.01.05', '码表字段类型', 't_sysdict_sln0000_ct_field_type', 'SLN0000.01', '码表字段的数据库类型', 'MBZDLX'),
('856F8A8C-99F0-11EC-A344-E86A641ED142', 'SLN0000.01.06', '码表列值来源', 't_sysdict_sln0000_ct_value_from', 'SLN0000.01', '码表列值来源', 'MBLZLY'),
('E2FA7FCF-99F1-11EC-A344-E86A641ED142', 'SLN0000.01.07', '码表列是否可见', 't_sysdict_sln0000_ct_field_visible', 'SLN0000.01', '码表列对用户是否可见', 'MBLSFKJ'),
('EFD9A3F3-99F1-11EC-A344-E86A641ED142', 'SLN0000.01.08', '码表列是否必录', 't_sysdict_sln0000_ct_must_input', 'SLN0000.01', '码表列是否是必录项', 'MBLSFBL'),
('00D176CE-A367-11EC-9B63-E86A641ED142', 'SLN0000.01.09', '码表列默认值', 't_sysdict_sln0000_ct_field_default_value', 'SLN0000.01', '码表列的默认值', 'MBLMRZ'),
('647CE48D-A383-11EC-8B93-E86A641ED142', 'SLN0000.01.10', '码表列默认值的宏', 't_sysdict_sln0000_ct_field_default_value_macro', 'SLN0000.01', '码表列默认值是宏的时候，其宏的取值列表', 'MBLMRZDH'),
('5216A516-C371-11EC-B2A3-E86A641ED142', 'SLN0000.01.11', '码表启用多公司录入', 't_sysdict_sln0000_ct_input_company', 'SLN0000.01', '码表是否启用多公司录入', 'MBSFQYDGSLR'),
('5DAC23B4-60AF-11EC-A41B-E86A641ED142', 'SLN0000.02.01', '表单字段编辑器类型', 't_sysdict_sln0000_form_editor_xtype', 'SLN0000.02', '表单字段编辑器的类型', 'BDZDBJQLX'),
('68BE0DF3-60AF-11EC-A41B-E86A641ED142', 'SLN0000.03.01', '视图xtype', 't_sysdict_sln0000_fv_xtype', 'SLN0000.03', '视图的组件类型(xtype)', 'STXTYPE'),
('6C5F4D19-8952-11EC-9791-E86A641ED142', 'SLN0000.05.01', '主菜单导航', 't_sysdict_mainmenu_nav', 'SLN0000.05', '主菜单导航 - 主菜单中单击模块后跳转的URL', 'ZCDDH'),
('5E538B96-8973-11EC-9791-E86A641ED142', 'SLN0000.05.02', '实施指南导航', 't_sysdict_sln0000_help_nav', 'SLN0000.05', '实施指南导航 - 模块中单击指南按钮后跳转的URL', 'SSZNDH'),
('103CD8A1-95EB-11EC-A366-E86A641ED142', 'SLN0000.51.01', '组织机构性质', 't_sysdict_sln0000_org_type', 'SLN0000.51', '组织机构性质', 'ZZJGXZ'),
('8F7829F3-9602-11EC-A366-E86A641ED142', 'SLN0000.52.01', '性别', 't_sysdict_sln0000_gender', 'SLN0000.52', '', 'XB'),
('99913BDD-9602-11EC-A366-E86A641ED142', 'SLN0000.52.02', '能否登录', 't_sysdict_sln0000_user_enabled', 'SLN0000.52', '', 'NFDL'),
('46A81380-9DE8-11EC-B333-E86A641ED142', 'SLN0002.01.01', '末级科目', 't_sysdict_sln0002_leaf_subject', 'SLN0002.01', '会计科目是否是末级科目', 'MJKM'),
('22123994-9F4D-11EC-85BD-E86A641ED142', 'SLN0002.01.02', '账样字段类型', 't_sysdict_sln0002_fmt_field_type', 'SLN0002.01', '会计科目账样的字段类型', 'ZYZDLX');

TRUNCATE TABLE `t_sysdict_sln0000_ct_record_status`;
INSERT INTO `t_sysdict_sln0000_ct_record_status` (`id`, `code`, `code_int`, `name`, `py`, `memo`, `show_order`) VALUES
('9B90C56E-696E-11E9-B2BF-782BCBD7746B', '1000', 1000, '启用', 'QY', '记录处于启用状态', 1),
('AC7F3FAB-696E-11E9-B2BF-782BCBD7746B', '0', 0, '停用', 'TY', '记录处于停用状态', 2);

# 码表列编辑器类型
TRUNCATE TABLE `t_sysdict_sln0000_ct_editor_xtype`;
INSERT INTO `t_sysdict_sln0000_ct_editor_xtype` (`id`, `code`, `code_int`, `name`, `py`, `memo`, `show_order`) VALUES
('5104A62E-9F97-11E9-9BDF-F0BF9790E21F', 'textfield', 1, 'textfield - 字符串编辑器', 'textfield', '字符串编辑器', 1),
('7B795BEF-9F97-11E9-9BDF-F0BF9790E21F', 'numberfield', 2, 'numberfield - 数值编辑器', 'numberfield', '数值编辑器', 2),
('FD1F4CF4-9F97-11E9-9BDF-F0BF9790E21F', 'psi_codetable_parentidfield', 3, 'psi_codetable_parentidfield - 上级记录编辑器', 'psi_codetable_parentidfield', '上级记录编辑器', 3),
('9929B6FA-AD1A-11E9-B2D3-F0BF9790E21F', 'psi_codetable_recordreffield', 4, 'psi_codetable_recordreffield - 码表记录引用字段编辑器', 'psi_codetable_recordreffield', '码表记录引用字段编辑器', 4),
('D5A2BB45-F42F-11EA-843F-E86A641ED142', 'datefield', 5, 'datefield - 日期编辑器', 'datefield', '日期编辑器', 5),
('CBAB9173-985E-11EC-93F2-E86A641ED142', 'psi_sysdictfield', 6, 'psi_sysdictfield - 系统数据字典编辑器', 'psi_sysdictfield', '系统数据字典编辑器', 6);

TRUNCATE TABLE `t_sysdict_sln0000_form_editor_xtype`;
INSERT INTO `t_sysdict_sln0000_form_editor_xtype` (`id`, `code`, `code_int`, `name`, `py`, `memo`, `show_order`) VALUES
('133BC834-62A4-11EA-BE39-F0BF9790E21F', '1', 1, 'textfield', 'textfield', '字符字段编辑器', 1),
('2E01A0A4-62A4-11EA-BE39-F0BF9790E21F', '2', 2, 'numberfield', 'numberfield', '数值字段编辑器', 2),
('28D248CD-843D-11EA-8C00-E86A641ED142', '3', 3, 'datefield', 'datefield', '日期字段编辑器', 3),
('BF6F569E-843D-11EA-8C00-E86A641ED142', '4', 4, 'displayfield', 'displayfield', '不使用编辑器', 4),
('CD0B859B-843D-11EA-8C00-E86A641ED142', '5', 5, 'psi_userfield', 'psi_userfield', '用户字段编辑器', 5);

TRUNCATE TABLE `t_sysdict_sln0000_fv_xtype`;
INSERT INTO `t_sysdict_sln0000_fv_xtype` (`id`, `code`, `code_int`, `name`, `py`, `memo`, `show_order`) VALUES
('7E444093-97CF-11EA-8BF1-E86A641ED142', '-1', -1, 'panel', 'panel', '占位容器', -1),
('882978F6-90CA-11EA-B303-E86A641ED142', '1', 1, 'psi_codetable_view_cmp', 'psi_codetable_view_cmp', '数据来自码表的视图', 1);

# 主菜单导航
TRUNCATE TABLE `t_sysdict_mainmenu_nav`;
INSERT INTO `t_sysdict_mainmenu_nav` (`id`, `code`, `code_int`, `name`, `py`, `memo`, `show_order`) VALUES
('-9996', '-9996', -9996, '/Home/User/changeMyPassword', '', '修改我的密码', 1),
('-9994', '-9994', -9994, '/Home/About', '', '关于', 2),
('-8999', '-8999', -8999, '/Home/User', '', '用户管理', 3),
('-8997', '-8997', -8997, '/Home/Bizlog', '', '业务日志', 4),
('-8996', '-8996', -8996, '/Home/Permission', '', '权限管理', 5),
('-7999', '-7999', -7999, '/Home/Form', '', '自定义表单', 6),
('-7997', '-7997', -7997, '/Home/FormView', '', '视图开发助手', 7),
('-7996', '-7996', -7996, '/Home/CodeTable', '', '码表设置', 8),
('-7995', '-7995', -7995, '/Home/MainMenu/maintainIndex', '', '主菜单维护', 9),
('-7994', '-7994', -7994, '/Home/SysDict', '', '系统数据字典', 10),
('-6001', '-6001', -6000, '/Home/FIdList', '', 'FId一览', 11),
('-6000', '-6000', -6000, '/Home/Solution', '', '解决方案', 12),
('1001', '1001', 1001, '/Home/Goods', '', '物料', 13),
('1002', '1002', 1002, '/Home/Goods/unitIndex', '', '物料计量单位', 14),
('1003', '1003', 1003, '/Home/Warehouse', '', '仓库', 15),
('1004', '1004', 1004, '/Home/Supplier', '', '供应商档案', 16),
('1007', '1007', 1007, '/Home/Customer', '', '客户资料', 17),
('2000', '2000', 2000, '/Home/Inventory/initIndex', '', '库存建账', 18),
('2001', '2001', 2001, '/Home/Purchase/pwbillIndex', '', '采购入库', 19),
('2002', '2002', 2002, '/Home/Sale/wsIndex', '', '销售出库', 20),
('2003', '2003', 2003, '/Home/Inventory/inventoryQuery', '', '库存账查询', 21),
('2004', '2004', 2004, '/Home/Funds/rvIndex', '', '应收账款管理', 22),
('2005', '2005', 2005, '/Home/Funds/payIndex', '', '应付账款管理', 23),
('2006', '2006', 2006, '/Home/SaleRej/srIndex', '', '销售退货入库', 24),
('2007', '2007', 2007, '/Home/PurchaseRej', '', '采购退货出库', 25),
('2008', '2008', 2008, '/Home/BizConfig', '', '业务设置', 26),
('2009', '2009', 2009, '/Home/InvTransfer', '', '库间调拨', 27),
('2010', '2010', 2010, '/Home/InvCheck', '', '库存盘点', 28),
('2012', '2012', 2012, '/Home/Report/saleDayByGoods', '', '销售日报表(按商品汇总)', 29),
('2013', '2013', 2013, '/Home/Report/saleDayByCustomer', '', '销售日报表(按客户汇总)', 30),
('2014', '2014', 2014, '/Home/Report/saleDayByWarehouse', '', '销售日报表(按仓库汇总)', 31),
('2015', '2015', 2015, '/Home/Report/saleDayByBizuser', '', '销售日报表(按业务员汇总)', 32),
('2016', '2016', 2016, '/Home/Report/saleMonthByGoods', '', '销售月报表(按商品汇总)', 33),
('2017', '2017', 2017, '/Home/Report/saleMonthByCustomer', '', '销售月报表(按客户汇总)', 34),
('2018', '2018', 2018, '/Home/Report/saleMonthByWarehouse', '', '销售月报表(按仓库汇总)', 35),
('2019', '2019', 2019, '/Home/Report/saleMonthByBizuser', '', '销售月报表(按业务员汇总)', 36),
('2020', '2020', 2020, '/Home/Report/safetyInventory', '', '安全库存明细表', 37),
('2021', '2021', 2021, '/Home/Report/receivablesAge', '', '应收账款账龄分析表', 38),
('2022', '2022', 2022, '/Home/Report/payablesAge', '', '应付账款账龄分析表', 39),
('2023', '2023', 2023, '/Home/Report/inventoryUpper', '', '库存超上限明细表', 40),
('2024', '2024', 2024, '/Home/Funds/cashIndex', '', '现金收支查询', 41),
('2025', '2025', 2025, '/Home/Funds/prereceivingIndex', '', '预收款管理', 42),
('2026', '2026', 2026, '/Home/Funds/prepaymentIndex', '', '预付款管理', 43),
('2027', '2027', 2027, '/Home/PurchaseOrder/pobillIndex', '', '采购订单', 44),
('2028', '2028', 2028, '/Home/SaleOrder/soIndex', '', '销售订单', 45),
('2029', '2029', 2029, '/Home/Goods/brandIndex', '', '物料品牌', 46),
('2031', '2031', 2031, '/Home/Goods/psIndex', '', '价格体系', 47),
('2032', '2032', 2032, '/Home/SaleContract', '', '销售合同', 48),
('2033', '2033', 2033, '/Home/WSP', '', '存货拆分', 49),
('2034', '2034', 2034, '/Home/Factory', '', '工厂', 50),
('2035', '2035', 2035, '/Home/DMO/dmobillIndex', '', '成品委托生产订单', 51),
('2036', '2036', 2036, '/Home/DMW/dmwbillIndex', '', '成品委托生产入库', 52),
('2037', '2037', 2037, '/Home/Report/purchaseDetail', '', '采购入库明细表', 53),
('2038', '2038', 2038, '/Home/Report/saleDetail', '', '销售出库明细表', 54),
('2101', '2101', 2101, '/SLN0002/Subject', '', '会计科目', 55),
('2102', '2102', 2102, '/SLN0002/Bank', '', '银行账户', 56),
('2103', '2103', 2103, '/SLN0002/GLPeriod', '', '会计期间', 57)
;

# 实施指南导航
TRUNCATE TABLE `t_sysdict_sln0000_help_nav`;
INSERT INTO `t_sysdict_sln0000_help_nav` (`id`, `code`, `code_int`, `name`, `py`, `memo`, `show_order`) VALUES
('login', 'login', 1, '/help/user/10.html', '', '', 1),
('user', 'user', 2, '/help/admin/02-01.html', '', '访问实施指南页面：用户管理', 2),
('priceSystem', 'priceSystem', 3, '/help/admin/02-04-03.html', '', '访问实施指南页面：价格体系', 3),
('initInv', 'initInv', 4, '/help/admin/02-06.html', '', '访问实施指南页面：库存建账', 4),
('permission', 'permission', 5, '/help/admin/02-02.html', '', '访问实施指南页面：权限管理', 5),
('bizlog', 'bizlog', 6, '/help/admin/03.html', '', '访问实施指南页面：业务日志', 6),
('warehouse', 'warehouse', 7, '/help/admin/02-05.html', '', '访问实施指南页面：仓库', 7),
('goods', 'goods', 8, '/help/admin/02-04.html', '', '访问实施指南页面：物料', 8),
('goodsBrand', 'goodsBrand', 9, '/help/admin/02-04-02.html', '', '访问实施指南页面：物料品牌', 9),
('goodsUnit', 'goodsUnit', 10, '/help/admin/02-04-01.html', '', '访问实施指南页面：物料计量单位', 10),
('supplier', 'supplier', 11, '/help/admin/02-07.html', '', '访问实施指南页面：供应商档案', 11),
('customer', 'customer', 12, '/help/admin/02-08.html', '', '访问实施指南页面：客户资料', 12),
('bizconfig', 'bizconfig', 13, '/help/admin/02-03.html', '', '访问实施指南页面：业务设置', 13),
('pobill', 'pobill', 14, '/help/user/20-01.html', '', '访问实施指南页面：采购订单', 14),
('pwbill', 'pwbill', 15, '/help/user/20-02.html', '', '访问实施指南页面：采购入库', 15),
('prbill', 'prbill', 16, '/help/user/20-03.html', '', '访问实施指南页面：采购退货出库', 16),
('sobill', 'sobill', 17, '/help/user/30-01.html', '', '访问实施指南页面：销售订单', 17),
('wsbill', 'wsbill', 18, '/help/user/30-02.html', '', '访问实施指南页面：销售出库', 18),
('srbill', 'srbill', 19, '/help/user/30-03.html', '', '访问实施指南页面：销售退货入库', 19),
('itbill', 'itbill', 20, '/help/user/40-01.html', '', '访问实施指南页面：库间调拨', 20),
('icbill', 'icbill', 21, '/help/user/40-02.html', '', '访问实施指南页面：库存盘点', 21),
('dataOrg', 'dataOrg', 22, '/help/admin/05.html', '', '访问实施指南页面：数据域应用详解', 22),
('commBill', 'commBill', 23, '/help/user/00.html', '', '访问实施指南页面：表单通用操作', 23),
('scbill', 'scbill', 24, '/help/user/30-04.html', '', '访问实施指南页面：销售合同', 24),
('costWeight', 'costWeight', 25, '/help/admin/02-04-04.html', '', '访问实施指南页面：静态BOM-成本分摊权重', 25),
('wspbill', 'wspbill', 26, '/help/user/60-01.html', '', '访问实施指南页面：存货拆分', 26),
('factory', 'factory', 27, '/help/admin/02-09.html', '', '访问实施指南页面：工厂', 27),
('dmobill', 'dmobill', 28, '/help/user/60-02.html', '', '访问实施指南页面：成品委托生产订单', 28),
('dmwbill', 'dmwbill', 29, '/help/user/60-03.html', '', '访问实施指南页面：成品委托生产入库', 29),
('mainMenuMaintain', 'mainMenuMaintain', 30, '/help/dev/lcap/08-01.html', '', '访问实施指南页面：主菜单维护', 30),
('sysdict', 'sysdict', 31, '/help/dev/lcap/08-02.html', '', '访问实施指南页面：系统数据字典', 31),
('codetable', 'codetable', 32, '/help/dev/lcap/08-03.html', '', '访问实施指南页面：码表设置', 32),
('form', 'form', 33, '/help/dev/lcap/08-06.html', '', '访问实施指南页面：自定义表单', 33),
('formview', 'formview', 34, '/help/dev/lcap/08-04.html', '', '访问实施指南页面：视图开发助手', 34),
('solution', 'solution', 35, '/help/dev/lcap/08-05.html', '', '访问实施指南页面：解决方案', 35),
('fidList', 'fidList', 36, '/help/dev/lcap/08-07.html', '', '访问实施指南页面：FId一览', 36),
('fromShortcut', 'fromShortcut', 37, '/help/index.html', '', '通过快捷访问进入实施指南页面', 37),
('subject', 'subject', 38, '/help/user/70-01.html', '', '访问实施指南页面：会计科目', 38)
;

# 组织机构性质
TRUNCATE TABLE `t_sysdict_sln0000_org_type`;
INSERT INTO `t_sysdict_sln0000_org_type` (`id`, `code`, `code_int`, `name`, `py`, `memo`, `show_order`) VALUES
('0', '0', 0, '[无]', '', '', 1),
('400', '400', 400, '事业部', '', '', 2),
('500', '500', 500, '门店', '', '', 3),
('600', '600', 600, '内部物流组织机构', '', '', 4),
('700', '700', 700, '办事处', '', '', 5),
('2000', '2000', 2000, '客户', '', '', 6),
('3000', '3000', 3000, '供应商', '', '', 7),
('4000', '4000', 4000, '外协工厂', '', '', 8),
('5000', '5000', 5000, '外部物流商', '', '', 9);

# 性别
TRUNCATE TABLE `t_sysdict_sln0000_gender`;
INSERT INTO `t_sysdict_sln0000_gender` (`id`, `code`, `code_int`, `name`, `py`, `memo`, `show_order`) VALUES
('0', '0', 0, '', '', '空白，用于表示没有选择性别', 1),
('1', '1', 1, '男', '', '', 2),
('2', '2', 2, '女', '', '', 3);

# 用户能否登录
TRUNCATE TABLE `t_sysdict_sln0000_user_enabled`;
INSERT INTO `t_sysdict_sln0000_user_enabled` (`id`, `code`, `code_int`, `name`, `py`, `memo`, `show_order`) VALUES
('1', '1', 1, '允许登录', '', '', 1),
('0', '0', 0, '禁止登录', '', '', 2);

# 码表层级数据
TRUNCATE TABLE `t_sysdict_sln0000_ct_tree_view`;
INSERT INTO `t_sysdict_sln0000_ct_tree_view` (`id`, `code`, `code_int`, `name`, `py`, `memo`, `show_order`) VALUES
('0', '0', 0, '否', '', '码表不是层级数据，数据以列表形式展现', 1),
('1', '1', 1, '是', '', '码表是层级数据，数据以树状结构展示', 2);

# 码表视图分页
TRUNCATE TABLE `t_sysdict_sln0000_ct_view_paging`;
INSERT INTO `t_sysdict_sln0000_ct_view_paging` (`id`, `code`, `code_int`, `name`, `py`, `memo`, `show_order`) VALUES
('1', '1', 1, '分页', '', '码表视图分页显示', 1),
('2', '2', 2, '不分页', '', '码表视图不分页显示', 2);

# 码表字段类型
TRUNCATE TABLE `t_sysdict_sln0000_ct_field_type`;
INSERT INTO `t_sysdict_sln0000_ct_field_type` (`id`, `code`, `code_int`, `name`, `py`, `memo`, `show_order`) VALUES
('varchar', 'varchar', 1, 'varchar', '', '字符串', 1),
('int', 'int', 2, 'int', '', '整数', 2),
('decimal', 'decimal', 3, 'decimal', '', '小数', 3),
('datetime', 'datetime', 4, 'datetime', '', '日期', 4);

# 码表列值来源
TRUNCATE TABLE `t_sysdict_sln0000_ct_value_from`;
INSERT INTO `t_sysdict_sln0000_ct_value_from` (`id`, `code`, `code_int`, `name`, `py`, `memo`, `show_order`) VALUES
('1', '1', 1, '直接录入', '', '', 1),
('2', '2', 2, '引用系统数据字典', '', '', 2),
('3', '3', 3, '引用其他码表', '', '', 3),
('4', '4', 4, '引用自身数据', '', '', 4),
('99', '99', 99, '由后台程序创建', '', '通常用于系统字段。自定义字段请慎用', 99);

# 码表列是否可见
TRUNCATE TABLE `t_sysdict_sln0000_ct_field_visible`;
INSERT INTO `t_sysdict_sln0000_ct_field_visible` (`id`, `code`, `code_int`, `name`, `py`, `memo`, `show_order`) VALUES
('1', '1', 1, '对用户可见', '', '', 1),
('2', '2', 2, '对用户不可见', '', '', 2);

# 码表列是否必录
TRUNCATE TABLE `t_sysdict_sln0000_ct_must_input`;
INSERT INTO `t_sysdict_sln0000_ct_must_input` (`id`, `code`, `code_int`, `name`, `py`, `memo`, `show_order`) VALUES
('1', '1', 1, '非必须录入项', '', '', 1),
('2', '2', 2, '必须录入', '', '', 2);

# 会计科目是否是末级科目
TRUNCATE TABLE `t_sysdict_sln0002_leaf_subject`;
INSERT INTO `t_sysdict_sln0002_leaf_subject` (`id`, `code`, `code_int`, `name`, `py`, `memo`, `show_order`) VALUES
('1', '1', 1, '是末级科目', '', '', 1),
('0', '0', 0, '不是末级科目', '', '', 2);

# 会计科目账样的字段类型
TRUNCATE TABLE `t_sysdict_sln0002_fmt_field_type`;
INSERT INTO `t_sysdict_sln0002_fmt_field_type` (`id`, `code`, `code_int`, `name`, `py`, `memo`, `show_order`) VALUES
('1', '1', 1, '字符串', '', '', 1),
('2', '2', 2, '日期', '', '', 2),
('3', '3', 3, '金额(两位小数)', '', '', 3),
('4', '4', 4, '整数', '', '', 4);

# 码表列的默认值
TRUNCATE TABLE `t_sysdict_sln0000_ct_field_default_value`;
INSERT INTO `t_sysdict_sln0000_ct_field_default_value` (`id`, `code`, `code_int`, `name`, `py`, `memo`, `show_order`) VALUES
('100', '100', 100, '[无]', '', '', 1),
('200', '200', 200, '固定值', '', '例如：状态的默认值为1000 - 启用', 2),
('300', '300', 300, '宏', '', '例如：今天日期 - $today，其数据引用系统数据字典<br/>t_sysdict_sln0000_ct_field_default_value_macro', 3),
('400', '400', 400, '后台代码', '', '由后台业务逻辑类返回默认值', 4);

# 码表列的默认值的宏列表
TRUNCATE TABLE `t_sysdict_sln0000_ct_field_default_value_macro`;
INSERT INTO `t_sysdict_sln0000_ct_field_default_value_macro` (`id`, `code`, `code_int`, `name`, `py`, `memo`, `show_order`) VALUES
('$today', '$today', 1, '$today', '', '今天日期', 1),
('$login_user_id', '$login_user_id', 2, '$login_user_id', '', '当前登录用户的id - 对应与t_user表中的id', 2),
('$login_user_name', '$login_user_name', 3, '$login_user_name', '', '当前登录用户的姓名', 3);

# 码表启用多公司录入
TRUNCATE TABLE `t_sysdict_sln0000_ct_input_company`;
INSERT INTO `t_sysdict_sln0000_ct_input_company` (`id`, `code`, `code_int`, `name`, `py`, `memo`, `show_order`) VALUES
('1', '1', 1, '不启用多公司录入', '', '系统自动把当前用户所属的公司id赋值给码表记录company_id', 1),
('2', '2', 2, '启用多公司录入', '', '由用户选择公司', 2);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
