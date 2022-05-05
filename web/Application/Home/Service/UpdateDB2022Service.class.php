<?php

namespace Home\Service;

use Home\Common\FIdConst;
use Think\Think;

/**
 * 数据库升级Service - 用于PSI 2022
 * 
 * 由UpdateDBService调用本class
 *
 * @author 艾格林门信息服务（大连）有限公司
 * @copyright 2015 - present
 * @license GPL v3
 */
class UpdateDB2022Service extends PSIBaseService
{
  /**
   *
   * @var \Think\Model $db
   */
  protected $db;

  function __construct($db)
  {
    $this->db = $db;
  }

  public function update()
  {
  }
}
