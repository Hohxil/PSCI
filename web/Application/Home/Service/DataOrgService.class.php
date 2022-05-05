<?php

namespace Home\Service;

/**
 * 数据域Service
 *
 * @author 艾格林门信息服务（大连）有限公司
 * @copyright 2015 - present
 * @license GPL v3
 */
class DataOrgService extends PSIBaseService
{

  /**
   * 构建数据域的查询SQL语句
   */
  public function buildSQL($fid, $tableName)
  {
    $queryParams = [];

    $us = new UserService();
    $userDataOrg = $us->getLoginUserDataOrg();

    $dataOrgList = $us->getDataOrgForFId($fid);
    if (count($dataOrgList) == 0) {
      // return null; // 全部数据域

      // 2022-3-15
      // 原来是返回 null，作为全域
      // 现在改为返回一个假条件，生成空域
      return [
        0 => " ( 1 = 2) ",
        1 => [],
      ];
    }

    // data_org is null 是为了兼容之前的版本遗留下的数据
    $result = " ( " . $tableName . ".data_org is null or " . $tableName . ".data_org = '' ";
    foreach ($dataOrgList as $dataOrg) {
      // 2022-3-15 取消全域
      // if ($dataOrg == "*") {
      //   return null; // 全部数据域
      // }

      if ($dataOrg == "#") {
        $result .= " or " . $tableName . ".data_org = '%s' ";
        $queryParams[] = $userDataOrg;

        continue;
      }

      $result .= " or left(" . $tableName . ".data_org, %d) = '%s' ";
      $queryParams[] = strlen($dataOrg);
      $queryParams[] = $dataOrg;
    }

    $result .= " ) ";

    return [
      0 => $result,
      1 => $queryParams
    ];
  }
}
