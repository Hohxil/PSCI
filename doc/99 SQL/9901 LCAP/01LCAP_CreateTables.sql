# @author 艾格林门信息服务（大连）有限公司
# @copyright 2015 - present
# @license GPL v3

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

DROP TABLE IF EXISTS `t_biz_log`;
CREATE TABLE IF NOT EXISTS `t_biz_log` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `date_created` datetime DEFAULT NULL,
  `info` varchar(1000) NOT NULL,
  `ip` varchar(255) NOT NULL,
  `user_id` varchar(255) NOT NULL,
  `log_category` varchar(50) NOT NULL,
  `data_org` varchar(255) DEFAULT NULL,
  `ip_from` varchar(255) DEFAULT NULL,
  `company_id` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

DROP TABLE IF EXISTS `t_fid`;
CREATE TABLE IF NOT EXISTS `t_fid` (
  `fid` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `py` varchar(255) DEFAULT NULL,
  `memo` varchar(255) DEFAULT NULL,
  `code` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `t_menu_item`;
CREATE TABLE IF NOT EXISTS `t_menu_item` (
  `id` varchar(255) NOT NULL,
  `caption` varchar(255) NOT NULL,
  `fid` varchar(255) DEFAULT NULL,
  `parent_id` varchar(255) DEFAULT NULL,
  `show_order` int(11) NOT NULL,
  `py` varchar(255) DEFAULT NULL,
  `memo` varchar(255) DEFAULT NULL,
  `sys_category` int(11) NOT NULL DEFAULT 1,
  `code` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `t_org`;
CREATE TABLE IF NOT EXISTS `t_org` (
  `id` varchar(255) NOT NULL,
  `full_name` varchar(1000) NOT NULL,
  `name` varchar(255) NOT NULL,
  `org_code` varchar(255) NOT NULL,
  `parent_id` varchar(255) DEFAULT NULL,
  `data_org` varchar(255) DEFAULT NULL,
  `org_type` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `t_permission`;
CREATE TABLE IF NOT EXISTS `t_permission` (
  `id` varchar(255) NOT NULL,
  `fid` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `note` varchar(255) DEFAULT NULL,
  `category` varchar(255) DEFAULT NULL,
  `py` varchar(255) DEFAULT NULL,
  `show_order` int(11) DEFAULT NULL,
  `parent_fid` varchar(255) DEFAULT NULL,
  `sub_category` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `t_recent_fid`;
CREATE TABLE IF NOT EXISTS `t_recent_fid` (
  `fid` varchar(255) NOT NULL,
  `user_id` varchar(255) NOT NULL,
  `click_count` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `t_role`;
CREATE TABLE IF NOT EXISTS `t_role` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `data_org` varchar(255) DEFAULT NULL,
  `company_id` varchar(255) DEFAULT NULL,
  `code` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `t_role_permission`;
CREATE TABLE IF NOT EXISTS `t_role_permission` (
  `role_id` varchar(255) DEFAULT NULL,
  `permission_id` varchar(255) DEFAULT NULL,
  `data_org` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `t_role_user`;
CREATE TABLE IF NOT EXISTS `t_role_user` (
  `role_id` varchar(255) DEFAULT NULL,
  `user_id` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `t_user`;
CREATE TABLE IF NOT EXISTS `t_user` (
  `id` varchar(255) NOT NULL,
  `enabled` int(11) NOT NULL,
  `login_name` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `org_id` varchar(255) NOT NULL,
  `org_code` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `py` varchar(255) DEFAULT NULL,
  `gender` varchar(255) DEFAULT NULL,
  `birthday` varchar(255) DEFAULT NULL,
  `id_card_number` varchar(255) DEFAULT NULL,
  `tel` varchar(255) DEFAULT NULL,
  `tel02` varchar(255) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `data_org` varchar(255) DEFAULT NULL,
  `company_id` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `t_config`;
CREATE TABLE IF NOT EXISTS `t_config` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `value` varchar(255) NOT NULL,
  `note` varchar(255) NOT NULL,
  `show_order` int(11) DEFAULT NULL,
  `company_id` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `t_psi_db_version`;
CREATE TABLE IF NOT EXISTS `t_psi_db_version` (
  `db_version` varchar(255) NOT NULL,
  `update_dt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `t_role_permission_dataorg`;
CREATE TABLE IF NOT EXISTS `t_role_permission_dataorg` (
  `role_id` varchar(255) DEFAULT NULL,
  `permission_id` varchar(255) DEFAULT NULL,
  `data_org` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `think_session`;
CREATE TABLE `think_session` (
  `session_id` varchar(255) NOT NULL,
  `session_expire` int(11) NOT NULL,
  `session_data` blob,
  UNIQUE KEY `session_id` (`session_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `t_fid_plus`;
CREATE TABLE IF NOT EXISTS `t_fid_plus` (
  `fid` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `py` varchar(255) DEFAULT NULL,
  `memo` varchar(255) DEFAULT NULL,
  `code` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `t_menu_item_plus`;
CREATE TABLE IF NOT EXISTS `t_menu_item_plus` (
  `id` varchar(255) NOT NULL,
  `caption` varchar(255) NOT NULL,
  `fid` varchar(255) DEFAULT NULL,
  `parent_id` varchar(255) DEFAULT NULL,
  `show_order` int(11) NOT NULL,
  `py` varchar(255) DEFAULT NULL,
  `memo` varchar(255) DEFAULT NULL,
  `sys_category` int(11) NOT NULL DEFAULT 1,
  `code` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `t_permission_plus`;
CREATE TABLE IF NOT EXISTS `t_permission_plus` (
  `id` varchar(255) NOT NULL,
  `fid` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `note` varchar(255) DEFAULT NULL,
  `category` varchar(255) DEFAULT NULL,
  `py` varchar(255) DEFAULT NULL,
  `show_order` int(11) DEFAULT NULL,
  `parent_fid` varchar(255) DEFAULT NULL,
  `sub_category` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `t_dict_table_category`;
CREATE TABLE IF NOT EXISTS `t_dict_table_category` (
  `id` varchar(255) NOT NULL,
  `code` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `parent_id` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `t_dict_table_md`;
CREATE TABLE IF NOT EXISTS `t_dict_table_md` (
  `id` varchar(255) NOT NULL,
  `code` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `table_name` varchar(255) NOT NULL,
  `category_id` varchar(255) NOT NULL,
  `memo` varchar(1000) DEFAULT NULL,
  `py` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `t_sysdict_sln0000_ct_record_status`;
CREATE TABLE IF NOT EXISTS `t_sysdict_sln0000_ct_record_status` (
  `id` varchar(255) NOT NULL,
  `code` varchar(255) NOT NULL,
  `code_int` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `py` varchar(255) NOT NULL,
  `memo` varchar(255) NOT NULL,
  `show_order` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `t_sysdict_sln0000_ct_editor_xtype`;
CREATE TABLE IF NOT EXISTS `t_sysdict_sln0000_ct_editor_xtype` (
  `id` varchar(255) NOT NULL,
  `code` varchar(255) NOT NULL,
  `code_int` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `py` varchar(255) NOT NULL,
  `memo` varchar(255) NOT NULL,
  `show_order` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `t_sysdict_sln0000_form_editor_xtype`;
CREATE TABLE IF NOT EXISTS `t_sysdict_sln0000_form_editor_xtype` (
  `id` varchar(255) NOT NULL,
  `code` varchar(255) NOT NULL,
  `code_int` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `py` varchar(255) NOT NULL,
  `memo` varchar(255) NOT NULL,
  `show_order` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `t_sysdict_sln0000_fv_xtype`;
CREATE TABLE IF NOT EXISTS `t_sysdict_sln0000_fv_xtype` (
  `id` varchar(255) NOT NULL,
  `code` varchar(255) NOT NULL,
  `code_int` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `py` varchar(255) NOT NULL,
  `memo` varchar(255) NOT NULL,
  `show_order` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `t_solution`;
CREATE TABLE IF NOT EXISTS `t_solution` (
  `id` varchar(255) NOT NULL,
  `code` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `is_default` int(11) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `t_code_table_category`;
CREATE TABLE IF NOT EXISTS `t_code_table_category` (
  `id` varchar(255) NOT NULL,
  `code` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `parent_id` varchar(255) DEFAULT NULL,
  `is_system` int(11) NOT NULL DEFAULT 2,
  `sln_code` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `t_code_table_md`;
CREATE TABLE IF NOT EXISTS `t_code_table_md` (
  `id` varchar(255) NOT NULL,
  `code` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `table_name` varchar(255) NOT NULL,
  `category_id` varchar(255) NOT NULL,
  `memo` varchar(1000) DEFAULT NULL,
  `py` varchar(255) DEFAULT NULL,
  `fid` varchar(255) DEFAULT NULL,
  `md_version` int(11) NOT NULL DEFAULT 1,
  `is_fixed` int(11) NOT NULL DEFAULT 2,
  `enable_parent_id` int(11) NOT NULL DEFAULT 0,
  `handler_class_name` varchar(255) DEFAULT NULL,
  `module_name` varchar(255) DEFAULT NULL,
  `edit_col_cnt` int(11) NOT NULL DEFAULT 1,
  `view_paging` int(11) NOT NULL DEFAULT 2,
  `auto_code_length` int(11) NOT NULL DEFAULT 0,
  `sln_code` varchar(255) NOT NULL,
  `input_company` int(11) NOT NULL DEFAULT 1,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `t_code_table_cols_md`;
CREATE TABLE IF NOT EXISTS `t_code_table_cols_md` (
  `id` varchar(255) NOT NULL,
  `table_id` varchar(255) NOT NULL,
  `caption` varchar(255) NOT NULL,
  `db_field_name` varchar(255) NOT NULL,
  `db_field_type` varchar(255) NOT NULL,
  `db_field_length` int(11) NOT NULL,
  `db_field_decimal` int(11) NOT NULL,
  `show_order` int(11) NOT NULL,
  `value_from` int(11) DEFAULT NULL,
  `value_from_table_name` varchar(255) DEFAULT NULL,
  `value_from_col_name` varchar(255) DEFAULT NULL,
  `value_from_col_name_display` varchar(255) DEFAULT NULL,
  `must_input` int(11) DEFAULT 1,
  `sys_col` int(11) DEFAULT 1,
  `is_visible` int(11) DEFAULT 1,
  `width_in_view` int(11) DEFAULT NULL,
  `note` varchar(1000) DEFAULT NULL,
  `show_order_in_view` int(11) NOT NULL DEFAULT -1,
  `editor_xtype` varchar(255) NOT NULL DEFAULT 'textfield',
  `col_span` int(11) NOT NULL DEFAULT 1,
  `default_value` int(11) NOT NULL DEFAULT 100,
  `default_value_ext` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `t_code_table_buttons`;
CREATE TABLE IF NOT EXISTS `t_code_table_buttons` (
  `id` varchar(255) NOT NULL,
  `table_id` varchar(255) NOT NULL,
  `caption` varchar(255) NOT NULL,
  `fid` varchar(255) NOT NULL,
  `on_click_frontend` varchar(255) DEFAULT NULL,
  `on_click_backend` varchar(255) DEFAULT NULL,
  `show_order` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `t_form_category`;
CREATE TABLE IF NOT EXISTS `t_form_category` (
  `id` varchar(255) NOT NULL,
  `code` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `parent_id` varchar(255) DEFAULT NULL,
  `sln_code` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `t_form`;
CREATE TABLE IF NOT EXISTS `t_form` (
  `id` varchar(255) NOT NULL,
  `code` varchar(255) NOT NULL,
  `name` varchar(1000) NOT NULL,
  `category_id` varchar(255) NOT NULL,
  `sys_form` int(11) NOT NULL DEFAULT 0,
  `md_version` int(11) NOT NULL DEFAULT 1,
  `memo` varchar(1000) DEFAULT NULL,
  `table_name` varchar(255) NOT NULL,
  `fid` varchar(255) DEFAULT NULL,
  `module_name` varchar(255) DEFAULT NULL,
  `sln_code` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `t_form_cols`;
CREATE TABLE IF NOT EXISTS `t_form_cols` (
  `id` varchar(255) NOT NULL,
  `form_id` varchar(255) NOT NULL,
  `caption` varchar(255) NOT NULL,
  `db_field_name` varchar(255) NOT NULL,
  `db_field_type` varchar(255) NOT NULL,
  `db_field_length` int(11) NOT NULL,
  `db_field_decimal` int(11) NOT NULL,
  `show_order` int(11) NOT NULL,
  `col_span` int(11) NOT NULL,
  `value_from` int(11) DEFAULT NULL,
  `value_from_table_name` varchar(255) DEFAULT NULL,
  `value_from_col_name` varchar(255) DEFAULT NULL,
  `value_from_col_name_display` varchar(255) DEFAULT NULL,
  `must_input` int(11) DEFAULT 1,
  `sys_col` int(11) DEFAULT 1,
  `is_visible` int(11) DEFAULT 1,
  `note` varchar(1000) DEFAULT NULL,
  `editor_xtype` varchar(255) NOT NULL DEFAULT 'textfield',
  `data_index` varchar(255) DEFAULT NULL,
  `width_in_view` int(11) NOT NULL DEFAULT 120,
  `show_order_in_view` int(11) NOT NULL DEFAULT -1,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `t_form_detail`;
CREATE TABLE IF NOT EXISTS `t_form_detail` (
  `id` varchar(255) NOT NULL,
  `form_id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `table_name` varchar(255) NOT NULL,
  `fk_name` varchar(255) NOT NULL,
  `show_order` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `t_form_detail_cols`;
CREATE TABLE IF NOT EXISTS `t_form_detail_cols` (
  `id` varchar(255) NOT NULL,
  `detail_id` varchar(255) NOT NULL,
  `caption` varchar(255) NOT NULL,
  `db_field_name` varchar(255) NOT NULL,
  `db_field_type` varchar(255) NOT NULL,
  `db_field_length` int(11) NOT NULL,
  `db_field_decimal` int(11) NOT NULL,
  `show_order` int(11) NOT NULL,
  `width_in_view` int(11) NOT NULL,
  `value_from` int(11) DEFAULT NULL,
  `value_from_table_name` varchar(255) DEFAULT NULL,
  `value_from_col_name` varchar(255) DEFAULT NULL,
  `value_from_col_name_display` varchar(255) DEFAULT NULL,
  `must_input` int(11) DEFAULT 1,
  `sys_col` int(11) DEFAULT 1,
  `is_visible` int(11) DEFAULT 1,
  `note` varchar(1000) DEFAULT NULL,
  `editor_xtype` varchar(255) NOT NULL DEFAULT 'textfield',
  `data_index` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `t_fv_category`;
CREATE TABLE IF NOT EXISTS `t_fv_category` (
  `id` varchar(255) NOT NULL,
  `code` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `parent_id` varchar(255) DEFAULT NULL,
  `is_system` int(11) NOT NULL DEFAULT 2,
  `sln_code` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `t_fv`;
CREATE TABLE IF NOT EXISTS `t_fv` (
  `id` varchar(255) NOT NULL,
  `code` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `category_id` varchar(255) NOT NULL,
  `memo` varchar(1000) DEFAULT NULL,
  `py` varchar(255) DEFAULT NULL,
  `fid` varchar(255) DEFAULT NULL,
  `md_version` int(11) NOT NULL DEFAULT 1,
  `is_fixed` int(11) NOT NULL DEFAULT 2,
  `parent_id` varchar(255) DEFAULT NULL,
  `module_name` varchar(255) DEFAULT NULL,
  `xtype` varchar(255) NOT NULL,
  `region` varchar(255) DEFAULT NULL,
  `width_or_height` varchar(255) DEFAULT NULL,
  `layout_type` int(11) NOT NULL DEFAULT 1,
  `data_source_type` int(11) NOT NULL DEFAULT 1,
  `data_source_table_name` varchar(255) DEFAULT NULL,
  `handler_class_name` varchar(255) DEFAULT NULL,
  `sln_code` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `t_fv_cols`;
CREATE TABLE IF NOT EXISTS `t_fv_cols` (
  `id` varchar(255) NOT NULL,
  `fv_id` varchar(255) NOT NULL,
  `caption` varchar(255) NOT NULL,
  `show_order` int(11) NOT NULL,
  `width` int(11) NOT NULL,
  `value_from_table_name` varchar(255) DEFAULT NULL,
  `value_from_col_name` varchar(255) DEFAULT NULL,
  `value_type` int(11) NOT NULL DEFAULT 1,
  `value_sql` varchar(255) DEFAULT NULL,
  `value_php_class_name` varchar(255) DEFAULT NULL,
  `display_format` int(11) NOT NULL DEFAULT 1,
  `display_format_ext` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `t_fv_qc`;
CREATE TABLE IF NOT EXISTS `t_fv_qc` (
  `id` varchar(255) NOT NULL,
  `fv_id` varchar(255) NOT NULL,
  `caption` varchar(255) NOT NULL,
  `show_order` int(11) NOT NULL,
  `qc_type` int(11) NOT NULL,
  `value_from_fv_id` varchar(255) DEFAULT NULL,
  `value_from_col_name` varchar(255) DEFAULT NULL,
  `xtype` varchar(255) DEFAULT NULL,
  `qc_php_class_name` varchar(255) DEFAULT NULL,
  `op` int(11) NOT NULL DEFAULT 1,
  `op_group` int(11) NOT NULL DEFAULT 1,
  `parent_id` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `t_sysdict_mainmenu_nav`;
CREATE TABLE IF NOT EXISTS `t_sysdict_mainmenu_nav` (
  `id` varchar(255) NOT NULL,
  `code` varchar(255) NOT NULL,
  `code_int` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `py` varchar(255) NOT NULL,
  `memo` varchar(255) NOT NULL,
  `show_order` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `t_sysdict_sln0000_help_nav`;
CREATE TABLE IF NOT EXISTS `t_sysdict_sln0000_help_nav` (
  `id` varchar(255) NOT NULL,
  `code` varchar(255) NOT NULL,
  `code_int` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `py` varchar(255) NOT NULL,
  `memo` varchar(255) NOT NULL,
  `show_order` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `t_sysdict_sln0000_org_type`;
CREATE TABLE IF NOT EXISTS `t_sysdict_sln0000_org_type` (
  `id` varchar(255) NOT NULL,
  `code` varchar(255) NOT NULL,
  `code_int` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `py` varchar(255) NOT NULL,
  `memo` varchar(255) NOT NULL,
  `show_order` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `t_sysdict_sln0000_gender`;
CREATE TABLE IF NOT EXISTS `t_sysdict_sln0000_gender` (
  `id` varchar(255) NOT NULL,
  `code` varchar(255) NOT NULL,
  `code_int` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `py` varchar(255) NOT NULL,
  `memo` varchar(255) NOT NULL,
  `show_order` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `t_sysdict_sln0000_user_enabled`;
CREATE TABLE IF NOT EXISTS `t_sysdict_sln0000_user_enabled` (
  `id` varchar(255) NOT NULL,
  `code` varchar(255) NOT NULL,
  `code_int` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `py` varchar(255) NOT NULL,
  `memo` varchar(255) NOT NULL,
  `show_order` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `t_sysdict_sln0000_ct_tree_view`;
CREATE TABLE IF NOT EXISTS `t_sysdict_sln0000_ct_tree_view` (
  `id` varchar(255) NOT NULL,
  `code` varchar(255) NOT NULL,
  `code_int` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `py` varchar(255) NOT NULL,
  `memo` varchar(255) NOT NULL,
  `show_order` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `t_sysdict_sln0000_ct_view_paging`;
CREATE TABLE IF NOT EXISTS `t_sysdict_sln0000_ct_view_paging` (
  `id` varchar(255) NOT NULL,
  `code` varchar(255) NOT NULL,
  `code_int` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `py` varchar(255) NOT NULL,
  `memo` varchar(255) NOT NULL,
  `show_order` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `t_sysdict_sln0000_ct_field_type`;
CREATE TABLE IF NOT EXISTS `t_sysdict_sln0000_ct_field_type` (
  `id` varchar(255) NOT NULL,
  `code` varchar(255) NOT NULL,
  `code_int` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `py` varchar(255) NOT NULL,
  `memo` varchar(255) NOT NULL,
  `show_order` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `t_sysdict_sln0000_ct_value_from`;
CREATE TABLE IF NOT EXISTS `t_sysdict_sln0000_ct_value_from` (
  `id` varchar(255) NOT NULL,
  `code` varchar(255) NOT NULL,
  `code_int` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `py` varchar(255) NOT NULL,
  `memo` varchar(255) NOT NULL,
  `show_order` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `t_sysdict_sln0000_ct_field_visible`;
CREATE TABLE IF NOT EXISTS `t_sysdict_sln0000_ct_field_visible` (
  `id` varchar(255) NOT NULL,
  `code` varchar(255) NOT NULL,
  `code_int` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `py` varchar(255) NOT NULL,
  `memo` varchar(255) NOT NULL,
  `show_order` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `t_sysdict_sln0000_ct_must_input`;
CREATE TABLE IF NOT EXISTS `t_sysdict_sln0000_ct_must_input` (
  `id` varchar(255) NOT NULL,
  `code` varchar(255) NOT NULL,
  `code_int` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `py` varchar(255) NOT NULL,
  `memo` varchar(255) NOT NULL,
  `show_order` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `t_sysdict_sln0002_leaf_subject`;
CREATE TABLE IF NOT EXISTS `t_sysdict_sln0002_leaf_subject` (
  `id` varchar(255) NOT NULL,
  `code` varchar(255) NOT NULL,
  `code_int` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `py` varchar(255) NOT NULL,
  `memo` varchar(255) NOT NULL,
  `show_order` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `t_sysdict_sln0002_fmt_field_type`;
CREATE TABLE IF NOT EXISTS `t_sysdict_sln0002_fmt_field_type` (
  `id` varchar(255) NOT NULL,
  `code` varchar(255) NOT NULL,
  `code_int` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `py` varchar(255) NOT NULL,
  `memo` varchar(255) NOT NULL,
  `show_order` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `t_sysdict_sln0000_ct_field_default_value`;
CREATE TABLE IF NOT EXISTS `t_sysdict_sln0000_ct_field_default_value` (
  `id` varchar(255) NOT NULL,
  `code` varchar(255) NOT NULL,
  `code_int` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `py` varchar(255) NOT NULL,
  `memo` varchar(255) NOT NULL,
  `show_order` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `t_sysdict_sln0000_ct_field_default_value_macro`;
CREATE TABLE IF NOT EXISTS `t_sysdict_sln0000_ct_field_default_value_macro` (
  `id` varchar(255) NOT NULL,
  `code` varchar(255) NOT NULL,
  `code_int` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `py` varchar(255) NOT NULL,
  `memo` varchar(255) NOT NULL,
  `show_order` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `t_sysdict_sln0000_ct_input_company`;
CREATE TABLE IF NOT EXISTS `t_sysdict_sln0000_ct_input_company` (
  `id` varchar(255) NOT NULL,
  `code` varchar(255) NOT NULL,
  `code_int` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `py` varchar(255) NOT NULL,
  `memo` varchar(255) NOT NULL,
  `show_order` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `t_user_dataorg_history`;
CREATE TABLE IF NOT EXISTS `t_user_dataorg_history` (
  `id` varchar(255) NOT NULL,
  `user_id` varchar(255) NOT NULL,
  `old_data_org` varchar(255) NOT NULL,
  `new_data_org` varchar(255) NOT NULL,
  `update_dt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
