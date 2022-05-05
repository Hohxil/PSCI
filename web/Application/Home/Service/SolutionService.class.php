<?php

namespace Home\Service;

use Home\DAO\SolutionDAO;

/**
 * 解决方案Service
 *
 * @author 艾格林门信息服务（大连）有限公司
 * @copyright 2015 - present
 * @license GPL v3
 */
class SolutionService extends PSIBaseExService
{
  private $LOG_CATEGORY = "解决方案";

  /**
   * 解决方案列表
   */
  public function solutionList()
  {
    if ($this->isNotOnline()) {
      return $this->emptyResult();
    }

    $dao = new SolutionDAO($this->db());
    return $dao->solutionList();
  }

  /**
   * 新建或编辑解决方案
   */
  public function editSolution($params)
  {
    if ($this->isNotOnline()) {
      return $this->notOnlineError();
    }

    $id = $params["id"];
    $name = $params["name"];
    $code = $params["code"];

    if ($this->isDemo()) {
      $n = $id ? "编辑" : "新建";
      return $this->bad("演示环境下，不能{$n}解决方案");
    }

    $db = $this->db();
    $db->startTrans();
    $dao = new SolutionDAO($db);
    $log = "";
    if ($id) {
      // 编辑
      $rc = $dao->updateSolution($params);
      if ($rc) {
        $db->rollback();
        return $rc;
      }
      $log = "编辑解决方案：名称 = {$name} 编码 = {$code}";
    } else {
      // 新建
      $rc = $dao->addSolution($params);
      if ($rc) {
        $db->rollback();
        return $rc;
      }

      $id = $params["id"];
      $log = "新建解决方案：名称 = {$name} 编码 = {$code}";
    }

    // 记录业务日志
    $bs = new BizlogService($db);
    $bs->insertBizlog($log, $this->LOG_CATEGORY);

    $db->commit();

    return $this->ok($id);
  }

  /**
   * 删除解决方案
   */
  public function deleteSolution($params)
  {
    if ($this->isNotOnline()) {
      return $this->notOnlineError();
    }

    if ($this->isDemo()) {
      return $this->bad("演示环境下，不能删除解决方案");
    }

    $db = $this->db();
    $db->startTrans();
    $dao = new SolutionDAO($db);
    $rc = $dao->deleteSolution($params);
    if ($rc) {
      $db->rollback();
      return $rc;
    }

    // 记录业务日志
    $log = $params["log"];
    $bs = new BizlogService($db);
    $bs->insertBizlog($log, $this->LOG_CATEGORY);

    $db->commit();

    return $this->ok();
  }

  /**
   * 获得某个解决方案的详情
   */
  public function solutionInfo($params)
  {
    if ($this->isNotOnline()) {
      return $this->emptyResult();
    }

    $dao = new SolutionDAO($this->db());
    return $dao->solutionInfo($params);
  }

  /**
   * 设置默认解决方案
   */
  public function setDefault($params)
  {
    if ($this->isNotOnline()) {
      return $this->notOnlineError();
    }

    if ($this->isDemo()) {
      return $this->bad("演示环境下，不能修改默认解决方案");
    }

    $db = $this->db();
    $db->startTrans();
    $dao = new SolutionDAO($db);
    $rc = $dao->setDefault($params);
    if ($rc) {
      $db->rollback();
      return $rc;
    }

    // 记录业务日志
    $log = $params["log"];
    $bs = new BizlogService($db);
    $bs->insertBizlog($log, $this->LOG_CATEGORY);

    $db->commit();

    return $this->ok();
  }
}
