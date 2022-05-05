<?php

namespace SLN0002\Service;

use Home\Common\FIdConst;
use Home\DAO\OrgDAO;
use Home\Service\BizlogService;
use Home\Service\PSIBaseExService;
use SLN0002\DAO\GLPeriodDAO;

/**
 * 会计期间 Service
 *
 * @author 艾格林门信息服务（大连）有限公司
 * @copyright 2015 - present
 * @license GPL v3
 */
class GLPeriodService extends PSIBaseExService
{
  private $LOG_CATEGORY = "会计期间";

  /**
   * 返回所有的公司列表
   *
   * @return array
   */
  public function companyList()
  {
    if ($this->isNotOnline()) {
      return $this->emptyResult();
    }

    $params = [
      "loginUserId" => $this->getLoginUserId(),
      "fid" => FIdConst::GL_PERIOD
    ];

    $dao = new OrgDAO($this->db());
    return $dao->getCompanyExList($params);
  }

  /**
   * 某个公司的全部会计期间
   */
  public function periodList($params)
  {
    if ($this->isNotOnline()) {
      return $this->emptyResult();
    }

    $dao = new GLPeriodDAO($this->db());
    return $dao->periodList($params);
  }

  /**
   * 初始化某个公司的本年度会计期间
   */
  public function initPeriod($params)
  {
    if ($this->isNotOnline()) {
      return $this->notOnlineError();
    }

    $db = $this->db();

    $db->startTrans();
    $dao = new GLPeriodDAO($db);

    $rc = $dao->initPeriod($params);
    if ($rc) {
      $db->rollback();
      return $rc;
    }

    // 记录业务日志
    $year = $params["year"];
    $name = $params["name"];
    $log = "初始化[{$name}]{$year}年的会计期间";
    $bs = new BizlogService($db);
    $bs->insertBizlog($log, $this->LOG_CATEGORY);

    $db->commit();

    return $this->ok();
  }
}
