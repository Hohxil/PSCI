<?php

namespace Home\Service;

/**
 * 关于 Service
 *
 * @author 艾格林门信息服务（大连）有限公司
 * @copyright 2015 - present
 * @license GPL v3
 */
class AboutService extends PSIBaseExService
{

  /**
   * PHP 版本号
   *
   * @return string
   */
  public function getPHPVersion()
  {
    return phpversion();
  }

  /**
   * MySQL 版本号
   *
   * @return string
   */
  public function getMySQLVersion()
  {
    $db = M();
    $sql = "select version() as v";
    $data = $db->query($sql);
    if (!$data) {
      return "MySQL版本号未知";
    } else {
      return $data[0]["v"];
    }
  }

  /**
   * 数据库结构版本号
   *
   * @return array
   */
  public function getPSIDBVersion()
  {
    $db = M();
    $sql = "select db_version, update_dt from t_psi_db_version";
    $data = $db->query($sql);
    if (!$data) {
      return "产品数据库结构版本号未知";
    } else {
      return [
        "version" => $data[0]["db_version"],
        "dt" => $data[0]["update_dt"]
      ];
    }
  }
}
