# @author 艾格林门信息服务（大连）有限公司
# @copyright 2015 - present
# @license GPL v3

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

TRUNCATE TABLE `t_fid`;
INSERT INTO `t_fid` (`fid`, `name`, `py`, `memo`) VALUES
('-6001', 'FId一览', 'FIDYL', ''),
('-6000', '解决方案', 'JJFA', ''),
('-7996', '码表设置', 'MBSZ', ''),
('-7995', '主菜单维护', 'ZCDWH', ''),
('-7994', '系统数据字典', 'XTSJZD', ''),
('-7997', '视图开发助手', 'STKFZS', ''),
('-7999', '自定义表单', 'ZDYBD', ''),
('-9999', '重新登录', '', ''),
('-9997', '首页', 'SY', ''),
('-9996', '修改我的密码', 'XGWDMM', ''),
('-9995', '实施指南', 'SSZN', ''),
('-9994', '关于', 'GY', ''),
('-8999', '用户管理', 'YHGL', ''),
('-8999-01', '组织机构在业务单据中的使用权限', '', ''),
('-8999-02', '业务员在业务单据中的使用权限', '', ''),
('-8997', '业务日志', 'YWRZ', ''),
('-8996', '权限管理', 'QXGL', '');

TRUNCATE TABLE `t_menu_item`;
INSERT INTO `t_menu_item` (`id`, `caption`, `fid`, `parent_id`, `show_order`, `py`, `memo`) VALUES
('01', '文件', NULL, NULL, 1, 'WJ', ''),
('0101', '首页', '-9997', '01', 1, 'SY', ''),
('0102', '重新登录', '-9999', '01', 2, '', ''),
('0103', '修改我的密码', '-9996', '01', 3, 'XGWDMM', ''),
('09', '系统管理', NULL, NULL, 11, 'XTGL', ''),
('0901', '用户管理', '-8999', '09', 1, 'YHGL', ''),
('0902', '权限管理', '-8996', '09', 2, 'QXGL', ''),
('0903', '业务日志', '-8997', '09', 3, 'YWRZ', ''),
('0905', '低代码应用平台', NULL, '09', 5, 'DDMYYPT', ''),
('090501', '码表设置', '-7996', '0905', 1, 'MBSZ', ''),
('090502', '自定义表单', '-7999', '0905', 2, 'ZDYBD', ''),
('090503', '视图开发助手', '-7997', '0905', 3, 'STKFZS', ''),
('090504', '主菜单维护', '-7995', '0905', 4, 'ZCDWH', ''),
('090505', '系统数据字典', '-7994', '0905', 5, 'XTSJZD', ''),
('090506', '解决方案', '-6000', '0905', 6, 'JJFA', ''),
('10', '指南', NULL, NULL, 12, 'ZN', ''),
('1001', '实施指南', '-9995', '10', 1, 'SSZN', ''),
('1003', '关于', '-9994', '10', 3, 'GY', '');

TRUNCATE TABLE `t_org`;
INSERT INTO `t_org` (`id`, `full_name`, `name`, `org_code`, `data_org`, `parent_id`) VALUES
('4D74E1E4-A129-11E4-9B6A-782BCBD7746B', '公司', '公司', '01', '01', NULL),
('5EBDBE11-A129-11E4-9B6A-782BCBD7746B', '公司\\信息部', '信息部', '0199', '0101', '4D74E1E4-A129-11E4-9B6A-782BCBD7746B');

TRUNCATE TABLE `t_permission`;
INSERT INTO `t_permission` (`id`, `fid`, `name`, `note`, `category`, `py`, `show_order`) VALUES
('-6001', '-6001', 'FId一览 - 模块权限', '通过菜单进入FId一览模块的权限', 'FId一览', 'FIDYL', 100),
('-6000', '-6000', '解决方案 - 模块权限', '通过菜单进入解决方案模块的权限', '解决方案', 'JJFA', 100),
('-7994', '-7994', '系统数据字典 - 模块权限', '通过菜单进入系统数据字典模块的权限', '系统数据字典', 'XTSJZD', 100),
('-7995', '-7995', '主菜单维护 - 模块权限', '通过菜单进入主菜单维护模块的权限', '主菜单维护', 'ZCDWH', 100),
('-7996', '-7996', '码表设置 - 模块权限', '通过菜单进入码表设置模块的权限', '码表设置', 'MBSZ', 100),
('-7997', '-7997', '视图开发助手 - 模块权限', '通过菜单进入视图开发助手模块的权限', '视图开发助手', 'STKFZS', 100),
('-7999', '-7999', '自定义表单 - 模块权限', '通过菜单进入自定义表单模块的权限', '自定义表单', 'ZDYBD', 100),
('-8996', '-8996', '权限管理 - 模块权限', '通过菜单进入权限管理模块的权限', '权限管理', 'QXGL', 100),
('-8996-01', '-8996-01', '权限管理 - 按钮权限 - 新建角色', '权限管理模块中按钮[新建角色]的启用权限', '权限管理', 'QXGL_XZJS', 201),
('-8996-02', '-8996-02', '权限管理 - 按钮权限 - 编辑角色', '权限管理模块中按钮[编辑角色]的启用权限', '权限管理', 'QXGL_BJJS', 202),
('-8996-03', '-8996-03', '权限管理 - 按钮权限 - 删除角色', '权限管理模块中按钮[删除角色]的启用权限', '权限管理', 'QXGL_SCJS', 203),
('-8997', '-8997', '业务日志 - 模块权限', '通过菜单进入业务日志模块的权限', '系统管理', 'YWRZ', 100),
('-8999', '-8999', '用户管理 - 模块权限', '通过菜单进入用户管理模块的权限', '用户管理', 'YHGL', 100),
('-8999-01', '-8999-01', '用户管理 - 数据域权限 - 组织机构在业务单据中的使用权限', '组织机构在业务单据中的使用权限', '用户管理', 'ZZJGZYWDJZDSYQX', 300),
('-8999-02', '-8999-02', '用户管理 - 数据域权限 - 业务员在业务单据中的使用权限', '业务员(用户)在业务单据中的使用权限', '用户管理', 'YWYZYWDJZDSYQX', 301),
('-8999-03', '-8999-03', '用户管理 - 按钮权限 - 新建组织机构', '用户管理模块中按钮[新建组织机构]的启用权限', '用户管理', 'YHGL_XZZZJG', 201),
('-8999-04', '-8999-04', '用户管理 - 按钮权限 - 编辑组织机构', '用户管理模块中按钮[编辑组织机构]的启用权限', '用户管理', 'YHGL_BJZZJG', 202),
('-8999-05', '-8999-05', '用户管理 - 按钮权限 - 删除组织机构', '用户管理模块中按钮[删除组织机构]的启用权限', '用户管理', 'YHGL_SCZZJG', 203),
('-8999-06', '-8999-06', '用户管理 - 按钮权限 - 新建用户', '用户管理模块中按钮[新建用户]的启用权限', '用户管理', 'YHGL_XZYH', 204),
('-8999-07', '-8999-07', '用户管理 - 按钮权限 - 编辑用户', '用户管理模块中按钮[编辑用户]的启用权限', '用户管理', 'YHGL_BJYH', 205),
('-8999-08', '-8999-08', '用户管理 - 按钮权限 - 删除用户', '用户管理模块中按钮[删除用户]的启用权限', '用户管理', 'YHGL_SCYH', 206),
('-8999-09', '-8999-09', '用户管理 - 按钮权限 - 修改用户密码', '用户管理模块中按钮[修改用户密码]的启用权限', '用户管理', 'YHGL_XGYHMM', 207);

# 默认角色 - 系统管理
TRUNCATE TABLE `t_role`;
INSERT INTO `t_role` (`id`, `name`, `data_org`, `company_id`, `code`) VALUES
('A83F617E-A153-11E4-A9B8-782BCBD7746B', '系统管理', '01010001', '4D74E1E4-A129-11E4-9B6A-782BCBD7746B', '01');

# 默认角色的权限项
TRUNCATE TABLE `t_role_permission`;
INSERT INTO `t_role_permission` (`role_id`, `permission_id`) 
select 'A83F617E-A153-11E4-A9B8-782BCBD7746B' as role_id, fid as permission_id
from t_permission;

# 默认角色的数据域
TRUNCATE TABLE `t_role_permission_dataorg`;
INSERT INTO `t_role_permission_dataorg` (`role_id`, `permission_id`, `data_org`) 
select 'A83F617E-A153-11E4-A9B8-782BCBD7746B' as role_id, fid as permission_id, '01' as data_org
from t_permission;

TRUNCATE TABLE `t_role_user`;
INSERT INTO `t_role_user` (`role_id`, `user_id`) VALUES
('A83F617E-A153-11E4-A9B8-782BCBD7746B', '6C2A09CD-A129-11E4-9B6A-782BCBD7746B');

TRUNCATE TABLE `t_user`;
INSERT INTO `t_user` (`id`, `enabled`, `login_name`, `name`, `org_id`, `org_code`, `data_org`, `password`, `py`) VALUES
('6C2A09CD-A129-11E4-9B6A-782BCBD7746B', '1', 'admin', '系统管理员', '5EBDBE11-A129-11E4-9B6A-782BCBD7746B', '019901', '01010001', '21232f297a57a5a743894a0e4a801fc3', 'XTGLY');

TRUNCATE TABLE `t_config`;
INSERT INTO `t_config` (`id`, `name`, `value`, `note`, `show_order`) VALUES
('9002-01', '产品名称', 'PSI低代码应用平台', '', 0);

update t_config set company_id = '4D74E1E4-A129-11E4-9B6A-782BCBD7746B' ;

TRUNCATE TABLE `t_psi_db_version`;
INSERT INTO `t_psi_db_version` (`db_version`, `update_dt`) VALUES
('20220427-01', now());

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
