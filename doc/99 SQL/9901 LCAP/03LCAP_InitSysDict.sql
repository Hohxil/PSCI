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
('-6000', '-6000', -6000, '/Home/Solution', '', '解决方案', 11)
;

# 实施指南导航
TRUNCATE TABLE `t_sysdict_sln0000_help_nav`;
INSERT INTO `t_sysdict_sln0000_help_nav` (`id`, `code`, `code_int`, `name`, `py`, `memo`, `show_order`) VALUES
('login', 'login', 1, '/help/user/10.html', '', '', 1),
('user', 'user', 2, '/help/admin/02-01.html', '', '访问实施指南页面：用户管理', 2),
('permission', 'permission', 5, '/help/admin/02-02.html', '', '访问实施指南页面：权限管理', 5),
('bizlog', 'bizlog', 6, '/help/admin/03.html', '', '访问实施指南页面：业务日志', 6),
('dataOrg', 'dataOrg', 22, '/help/admin/05.html', '', '访问实施指南页面：数据域应用详解', 22),
('commBill', 'commBill', 23, '/help/user/00.html', '', '访问实施指南页面：表单通用操作', 23),
('mainMenuMaintain', 'mainMenuMaintain', 30, '/help/dev/lcap/08-01.html', '', '访问实施指南页面：主菜单维护', 30),
('sysdict', 'sysdict', 31, '/help/dev/lcap/08-02.html', '', '访问实施指南页面：系统数据字典', 31),
('codetable', 'codetable', 32, '/help/dev/lcap/08-03.html', '', '访问实施指南页面：码表设置', 32),
('form', 'form', 33, '/help/dev/lcap/08-06.html', '', '访问实施指南页面：自定义表单', 33),
('formview', 'formview', 34, '/help/dev/lcap/08-04.html', '', '访问实施指南页面：视图开发助手', 34),
('solution', 'solution', 35, '/help/dev/lcap/08-05.html', '', '访问实施指南页面：解决方案', 35),
('fidList', 'fidList', 36, '/help/dev/lcap/08-07.html', '', '访问实施指南页面：FId一览', 36),
('fromShortcut', 'fromShortcut', 37, '/help/index.html', '', '通过快捷访问进入实施指南页面', 37)
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
