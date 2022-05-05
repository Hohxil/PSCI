<?php

namespace Home\Service;

use Home\DAO\FIdListDAO;
use Home\DAO\SysDictDAO;

/**
 * FId一览Service
 *
 * @author 艾格林门信息服务（大连）有限公司
 * @copyright 2015 - present
 * @license GPL v3
 */
class FIdListService extends PSIBaseExService
{

  private $LOG_CATEGORY = "FId一览";

  /**
   * 查询全部FId数据
   */
  public function fidList()
  {
    if ($this->isNotOnline()) {
      return $this->emptyResult();
    }

    $dao = new FIdListDAO($this->db());
    return $dao->fidList();
  }

  /**
   * 编辑fid
   */
  public function editFId($params)
  {
    if ($this->isNotOnline()) {
      return $this->notOnlineError();
    }

    if ($this->isDemo()) {
      return $this->bad("演示环境下不能编辑fid");
    }

    $db = $this->db();
    $db->startTrans();

    $dao = new FIdListDAO($db);
    $rc = $dao->editFId($params);
    if ($rc) {
      $db->rollback();
      return $rc;
    }

    // 记录业务日志
    $log = $params["log"];
    $bs = new BizlogService($db);
    $bs->insertBizlog($log, $this->LOG_CATEGORY);

    $db->commit();

    $fid = $params["fid"];
    return $this->ok($fid);
  }
}
