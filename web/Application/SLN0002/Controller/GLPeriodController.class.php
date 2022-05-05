<?php

namespace SLN0002\Controller;

use Home\Common\FIdConst;
use Home\Controller\PSIBaseController;
use Home\Service\UserService;
use SLN0002\Service\GLPeriodService;

/**
 * 会计期间Controller
 *
 * @author 艾格林门信息服务（大连）有限公司
 * @copyright 2015 - present
 * @license GPL v3
 */
class GLPeriodController extends PSIBaseController
{

  /**
   * 会计期间 - 主页面
   */
  public function index()
  {
    $us = new UserService();

    if ($us->hasPermission(FIdConst::GL_PERIOD)) {
      $this->initVar();

      $this->assign("title", "会计期间");

      $this->display();
    } else {
      $this->gotoLoginPage("/SLN0002/GLPeriod/index");
    }
  }

  /**
   * 返回所有的公司列表
   */
  public function companyList()
  {
    if (IS_POST) {
      $us = new UserService();

      if (!$us->hasPermission(FIdConst::GL_PERIOD)) {
        die("没有权限");
      }

      $service = new GLPeriodService();
      $this->ajaxReturn($service->companyList());
    }
  }

  /**
   * 某个公司的全部会计期间
   */
  public function periodList()
  {
    if (IS_POST) {
      $us = new UserService();

      if (!$us->hasPermission(FIdConst::GL_PERIOD)) {
        die("没有权限");
      }

      $params = [
        "companyId" => I("post.companyId")
      ];

      $service = new GLPeriodService();
      $this->ajaxReturn($service->periodList($params));
    }
  }

  /**
   * 初始化某个公司的本年度会计期间
   */
  public function initPeriod()
  {
    if (IS_POST) {
      $us = new UserService();

      if (!$us->hasPermission(FIdConst::GL_PERIOD)) {
        die("没有权限");
      }

      $params = [
        "companyId" => I("post.companyId")
      ];

      $service = new GLPeriodService();
      $this->ajaxReturn($service->initPeriod($params));
    }
  }
}
