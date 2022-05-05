<?php

namespace Home\Service;

use Home\DAO\SysDictDAO;

/**
 * 系统数据字典Service
 *
 * @author 艾格林门信息服务（大连）有限公司
 * @copyright 2015 - present
 * @license GPL v3
 */
class SysDictService extends PSIBaseExService
{

  /**
   * 系统数据字段分类列表
   */
  public function categoryList()
  {
    if ($this->isNotOnline()) {
      return $this->emptyResult();
    }

    $dao = new SysDictDAO($this->db());
    return $dao->categoryList();
  }

  /**
   * 某个分类下的数据字典
   */
  public function sysDictList($params)
  {
    if ($this->isNotOnline()) {
      return $this->emptyResult();
    }

    $dao = new SysDictDAO($this->db());
    return $dao->sysDictList($params);
  }

  /**
   * 查询某个码表的数据
   */
  public function dictDataList($params)
  {
    if ($this->isNotOnline()) {
      return $this->emptyResult();
    }

    $dao = new SysDictDAO($this->db());
    return $dao->dictDataList($params);
  }

  /**
   * 自定义字段 - 查询数据
   */
  public function queryDataForSysDictField($params)
  {
    if ($this->isNotOnline()) {
      return $this->emptyResult();
    }

    $dao = new SysDictDAO($this->db());
    return $dao->queryDataForSysDictField($params);
  }
}
