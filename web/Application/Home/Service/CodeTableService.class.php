<?php

namespace Home\Service;

use Home\DAO\CodeTableDAO;

/**
 * 码表Service
 *
 * @author 艾格林门信息服务（大连）有限公司
 * @copyright 2015 - present
 * @license GPL v3
 */
class CodeTableService extends PSIBaseExService
{
  private $LOG_CATEGORY = "码表设置";

  /**
   * 码表分类列表
   */
  public function categoryList($params)
  {
    if ($this->isNotOnline()) {
      return $this->emptyResult();
    }

    $dao = new CodeTableDAO($this->db());
    return $dao->categoryList($params);
  }

  /**
   * 新增或编辑码表分类
   */
  public function editCodeTableCategory($params)
  {
    if ($this->isNotOnline()) {
      return $this->notOnlineError();
    }

    $id = $params["id"];
    if ($this->isDemo()) {
      $n = $id ? "编辑" : "新建";
      return $this->bad("演示环境下，不能{$n}码表分类");
    }

    $db = $this->db();
    $db->startTrans();

    $dao = new CodeTableDAO($db);
    if ($id) {
      // 编辑
      $rc = $dao->updateCodeTableCategory($params);
      if ($rc) {
        $db->rollback();
        return $rc;
      }
    } else {
      // 新增
      $rc = $dao->addCodeTableCategory($params);
      if ($rc) {
        $db->rollback();
        return $rc;
      }

      $id = $params["id"];
    }

    // 记录业务日志
    $log = $params["log"];
    $bs = new BizlogService($db);
    $bs->insertBizlog($log, $this->LOG_CATEGORY);

    $db->commit();

    return $this->ok($id);
  }

  /**
   * 删除码表分类
   */
  public function deleteCodeTableCategory($params)
  {
    if ($this->isNotOnline()) {
      return $this->notOnlineError();
    }

    if ($this->isDemo()) {
      return $this->bad("演示环境下，不能删除码表分类");
    }

    $db = $this->db();
    $db->startTrans();

    $dao = new CodeTableDAO($db);
    $rc = $dao->deleteCodeTableCategory($params);
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
   * 码表列表
   */
  public function codeTableList($params)
  {
    if ($this->isNotOnline()) {
      return $this->emptyResult();
    }

    $dao = new CodeTableDAO($this->db());
    return $dao->codeTableList($params);
  }

  /**
   * 码表分类自定义字段 - 查询数据
   */
  public function queryDataForCategory($params)
  {
    if ($this->isNotOnline()) {
      return $this->emptyResult();
    }

    $dao = new CodeTableDAO($this->db());
    return $dao->queryDataForCategory($params);
  }

  /**
   * 新增或编辑码表
   */
  public function editCodeTable($params)
  {
    if ($this->isNotOnline()) {
      return $this->notOnlineError();
    }

    $id = $params["id"];
    if ($this->isDemo()) {
      $n = $id ? "编辑" : "新建";
      return $this->bad("演示环境下，不能{$n}码表");
    }

    $isModify = $id;
    $name = $params["name"];

    $pyService = new PinyinService();
    $py = $pyService->toPY($name);
    $params["py"] = $py;

    $db = $this->db();
    $db->startTrans();

    $dao = new CodeTableDAO($db);
    if ($isModify) {
      // 编辑
      $rc = $dao->updateCodeTable($params);
      if ($rc) {
        $db->rollback();
        return $rc;
      }
    } else {
      // 新增
      $rc = $dao->addCodeTable($params);
      if ($rc) {
        $db->rollback();
        return $rc;
      }

      $id = $params["id"];
    }

    // 记录业务日志
    $log = $params["log"];
    $bs = new BizlogService($db);
    $bs->insertBizlog($log, $this->LOG_CATEGORY);

    $db->commit();

    if (!$isModify) {
      // 新建码表，创建数据库中的实际物理表
      // 因为MySQL的DDL自动提交事务，所以该代码在创建元数据之后执行
      // 也不需要启动事务
      $rc = $dao->createCodeTableInDb($params);
      if ($rc) {
        return $rc;
      }
    }

    return $this->ok($id);
  }

  /**
   * 某个码表的列
   */
  public function codeTableColsList($params)
  {
    if ($this->isNotOnline()) {
      return $this->emptyResult();
    }

    $dao = new CodeTableDAO($this->db());
    return $dao->codeTableColsList($params);
  }

  /**
   * 删除码表
   */
  public function deleteCodeTable($params)
  {
    if ($this->isNotOnline()) {
      return $this->notOnlineError();
    }

    if ($this->isDemo()) {
      return $this->bad("演示环境下，不能删除码表");
    }

    $db = $this->db();
    $db->startTrans();

    $dao = new CodeTableDAO($db);
    $rc = $dao->deleteCodeTable($params);
    if ($rc) {
      $db->rollback();
      return $rc;
    }

    $log = $params["log"];

    // 记录业务日志
    $bs = new BizlogService($db);
    $bs->insertBizlog($log, $this->LOG_CATEGORY);

    $db->commit();

    return $this->ok();
  }

  /**
   * 查询码表主表元数据
   */
  public function codeTableInfo($params)
  {
    if ($this->isNotOnline()) {
      return $this->emptyResult();
    }

    $dao = new CodeTableDAO($this->db());
    return $dao->codeTableInfo($params);
  }

  /**
   * 新增或编辑码表列
   */
  public function editCodeTableCol($params)
  {
    if ($this->isNotOnline()) {
      return $this->notOnlineError();
    }

    $id = $params["id"];
    if ($this->isDemo()) {
      $n = $id ? "编辑" : "新建";
      return $this->bad("演示环境下，不能{$n}码表列");
    }

    $isModify = $id;
    $name = $params["name"];

    $pyService = new PinyinService();
    $py = $pyService->toPY($name);
    $params["py"] = $py;

    $db = $this->db();
    $db->startTrans();

    $log = null;
    $dao = new CodeTableDAO($db);
    if ($isModify) {
      // 编辑
      $rc = $dao->updateCodeTableCol($params);
      if ($rc) {
        $db->rollback();
        return $rc;
      }
    } else {
      // 新增
      $rc = $dao->addCodeTableCol($params);
      if ($rc) {
        $db->rollback();
        return $rc;
      }

      $id = $params["id"];
    }

    // 记录业务日志
    $log = $params["log"];
    $bs = new BizlogService($db);
    $bs->insertBizlog($log, $this->LOG_CATEGORY);

    $db->commit();

    if (!$isModify) {
      $rc = $dao->addCodeTableColInDb($params);
      if ($rc) {
        return $rc;
      }
    }

    return $this->ok($id);
  }

  /**
   * 码表某列的详细信息
   */
  public function codeTableColInfo($params)
  {
    if ($this->isNotOnline()) {
      return $this->emptyResult();
    }

    $dao = new CodeTableDAO($this->db());
    return $dao->codeTableColInfo($params);
  }

  /**
   * 删除码表列
   */
  public function deleteCodeTableCol($params)
  {
    if ($this->isNotOnline()) {
      return $this->notOnlineError();
    }

    if ($this->isDemo()) {
      return $this->bad("演示环境下，不能删除码表列");
    }

    $db = $this->db();
    $db->startTrans();

    $dao = new CodeTableDAO($db);
    $rc = $dao->deleteCodeTableCol($params);
    if ($rc) {
      $db->rollback();
      return $rc;
    }

    $log = $params["log"];

    // 记录业务日志
    $bs = new BizlogService($db);
    $bs->insertBizlog($log, $this->LOG_CATEGORY);

    $db->commit();

    return $this->ok();
  }

  /**
   * 把码表转化为系统固有码表
   */
  public function convertCodeTable($params)
  {
    if ($this->isNotOnline()) {
      return $this->notOnlineError();
    }

    if ($this->isDemo()) {
      return $this->bad("在演示环境下，不能使用本功能，请见谅");
    }


    $db = $this->db();
    $db->startTrans();

    $dao = new CodeTableDAO($db);
    $rc = $dao->convertCodeTable($params);
    if ($rc) {
      $db->rollback();
      return $rc;
    }

    $name = $params["name"];
    $log = "把码表[{$name}]转化为系统固有码表";

    // 记录业务日志
    $bs = new BizlogService($db);
    $bs->insertBizlog($log, $this->LOG_CATEGORY);

    $db->commit();

    return $this->ok();
  }

  /**
   * 查询码表编辑界面字段的显示次序
   */
  public function queryCodeTableEditColShowOrder($params)
  {
    if ($this->isNotOnline()) {
      return $this->emptyResult();
    }

    $dao = new CodeTableDAO($this->db());
    return $dao->queryCodeTableEditColShowOrder($params);
  }

  /**
   * 保存编辑界面字段显示次序
   */
  public function saveColEditShowOrder($params)
  {
    if ($this->isNotOnline()) {
      return $this->notOnlineError();
    }

    $db = $this->db();
    $db->startTrans();

    $dao = new CodeTableDAO($db);
    $rc = $dao->saveColEditShowOrder($params);
    if ($rc) {
      $db->rollback();
      return $rc;
    }

    $name = $params["name"];
    $log = "保存码表[{$name}]编辑界面字段显示次序";

    // 记录业务日志
    $bs = new BizlogService($db);
    $bs->insertBizlog($log, $this->LOG_CATEGORY);

    $db->commit();

    return $this->ok();
  }

  /**
   * 码表生成SQL
   */
  public function codeTableGenSQL($params)
  {
    if ($this->isNotOnline()) {
      return $this->emptyResult();
    }

    $dao = new CodeTableDAO($this->db());
    return $dao->codeTableGenSQL($params);
  }

  /**
   * 解决方案的全部码表生成SQL
   */
  public function codeTableSolutionGenSQL($params)
  {
    if ($this->isNotOnline()) {
      return $this->emptyResult();
    }

    $dao = new CodeTableDAO($this->db());
    return $dao->codeTableSolutionGenSQL($params);
  }

  /**
   * 查询解决方案列表
   */
  public function querySolutionList()
  {
    if ($this->isNotOnline()) {
      return $this->emptyResult();
    }

    $dao = new CodeTableDAO($this->db());
    return $dao->querySolutionList();
  }

  /**
   * 选择值来源的引用列 - 查询表
   */
  public function queryTablesForColRef($params)
  {
    if ($this->isNotOnline()) {
      return $this->emptyResult();
    }

    $dao = new CodeTableDAO($this->db());
    return $dao->queryTablesForColRef($params);
  }

  /**
   * 选择值来源的引用列 - 查询列
   */
  public function queryColsForColRef($params)
  {
    if ($this->isNotOnline()) {
      return $this->emptyResult();
    }

    $dao = new CodeTableDAO($this->db());
    return $dao->queryColsForColRef($params);
  }
}
