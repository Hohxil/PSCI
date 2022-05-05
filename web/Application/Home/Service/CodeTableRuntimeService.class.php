<?php

namespace Home\Service;

use Home\DAO\CodeTableRuntimeDAO;
use Home\DAO\OrgDAO;

/**
 * 码表运行时Service
 *
 * @author 艾格林门信息服务（大连）有限公司
 * @copyright 2015 - present
 * @license GPL v3
 */
class CodeTableRuntimeService extends PSIBaseExService
{
  private $LOG_CATEGORY = "码表设置";

  /**
   * 根据fid获得码表的元数据
   * 该元数据是模块级别的精简数据
   *
   * @param string $fid
   * @return array
   */
  public function getModuleMetaDataByFid($fid)
  {
    if ($this->isNotOnline()) {
      return $this->emptyResult();
    }

    $dao = new CodeTableRuntimeDAO($this->db());
    return $dao->getModuleMetaDataByFid($fid);
  }

  /**
   * 查询码表元数据 - 运行界面用
   */
  public function getMetaDataForRuntime($params)
  {
    if ($this->isNotOnline()) {
      return $this->emptyResult();
    }

    $params["loginUserId"] = $this->getLoginUserId();
    $params["userService"] = new UserService();

    $dao = new CodeTableRuntimeDAO($this->db());
    return $dao->getMetaDataForRuntime($params);
  }

  /**
   * 新增或编辑码表记录
   */
  public function editCodeTableRecord($params)
  {
    if ($this->isNotOnline()) {
      return $this->notOnlineError();
    }

    $id = $params["id"];

    $companyId = $params["companyId"];
    if (!$companyId) {
      // 当启用多公司录入的时候，compnayId是由前端用户选择后传递来的
      // 当不启用多公司录入的时候，就取当前用户所属公司
      $params["companyId"] = $this->getCompanyId();
    }

    $params["loginUserId"] = $this->getLoginUserId();
    $params["dataOrg"] = $this->getLoginUserDataOrg();
    $params["userService"] = new UserService();

    $db = $this->db();
    $db->startTrans();

    $dao = new CodeTableRuntimeDAO($db);
    if ($id) {
      // 编辑
      $rc = $dao->updateRecord($params, new PinyinService());
      if ($rc) {
        $db->rollback();
        return $rc;
      }
    } else {
      // 新增
      $rc = $dao->addRecord($params, new PinyinService());
      if ($rc) {
        $db->rollback();
        return $rc;
      }

      $id = $params["id"];
    }

    // 记录业务日志
    $log = $params["log"];
    $logCategory = $params["logCategory"];
    $bs = new BizlogService($db);
    $bs->insertBizlog($log, $logCategory);

    $db->commit();

    return $this->ok($id);
  }

  /**
   * 码表记录列表
   */
  public function codeTableRecordList($params)
  {
    if ($this->isNotOnline()) {
      return $this->emptyResult();
    }

    $params["loginUserId"] = $this->getLoginUserId();
    $params["userService"] = new UserService();

    $dao = new CodeTableRuntimeDAO($this->db());
    return $dao->codeTableRecordList($params);
  }

  /**
   * 码表记录 - 树状结构
   */
  public function codeTableRecordListForTreeView($params)
  {
    if ($this->isNotOnline()) {
      return $this->emptyResult();
    }

    $params["loginUserId"] = $this->getLoginUserId();
    $params["userService"] = new UserService();
    $dao = new CodeTableRuntimeDAO($this->db());
    return $dao->codeTableRecordListForTreeView($params);
  }

  /**
   * 查询码表记录的详情
   */
  public function recordInfo($params)
  {
    if ($this->isNotOnline()) {
      return $this->emptyResult();
    }

    $params["loginUserId"] = $this->getLoginUserId();
    $params["userService"] = new UserService();

    $dao = new CodeTableRuntimeDAO($this->db());
    return $dao->recordInfo($params);
  }

  /**
   * 删除码表记录
   */
  public function deleteCodeTableRecord($params)
  {
    if ($this->isNotOnline()) {
      return $this->notOnlineError();
    }

    $params["loginUserId"] = $this->getLoginUserId();
    $params["userService"] = new UserService();

    $db = $this->db();
    $db->startTrans();

    $dao = new CodeTableRuntimeDAO($db);
    $rc = $dao->deleteRecord($params);
    if ($rc) {
      $db->rollback();
      return $rc;
    }

    $log = $params["log"];
    $logCategory = $params["logCategory"];

    // 记录业务日志
    $bs = new BizlogService($db);
    $bs->insertBizlog($log, $logCategory);

    $db->commit();

    return $this->ok();
  }

  /**
   * 码表记录引用字段 - 查询数据
   */
  public function queryDataForRecordRef($params)
  {
    if ($this->isNotOnline()) {
      return $this->emptyResult();
    }

    $params["loginUserId"] = $this->getLoginUserId();

    $dao = new CodeTableRuntimeDAO($this->db());
    return $dao->queryDataForRecordRef($params);
  }

  /**
   * 保存列视图布局
   */
  public function saveColViewLayout($params)
  {
    if ($this->isNotOnline()) {
      return $this->notOnlineError();
    }

    $db = $this->db();
    $db->startTrans();

    $dao = new CodeTableRuntimeDAO($db);
    $rc = $dao->saveColViewLayout($params);
    if ($rc) {
      $db->rollback();
      return $rc;
    }

    $name = $params["name"];
    $log = "保存码表[{$name}]列视图布局";

    // 记录业务日志
    $bs = new BizlogService($db);
    $bs->insertBizlog($log, $this->LOG_CATEGORY);

    $db->commit();

    return $this->ok();
  }

  /**
   * 码表记录导出Excel
   * 
   */
  public function exportExcel($params)
  {
    if ($this->isNotOnline()) {
      die("没有权限");
    }

    $params["loginUserId"] = $this->getLoginUserId();
    $params["userService"] = new UserService();

    $db = $this->db();
    $dao = new CodeTableRuntimeDAO($db);
    $data = $dao->recordListForExcel($params);

    $error = $data["error"];
    if ($error) {
      // 出现莫名的bug
      die($error["msg"]);
    }

    $dataList = $data["dataList"];
    $cols = $data["cols"];

    // 记录业务日志
    $log = $params["log"];
    $logCategory = $params["logCategory"];
    $bs = new BizlogService($db);
    $bs->insertBizlog($log, $logCategory);

    // 下面是处理生成Excel文件的逻辑

    require_once __DIR__ . '/../Common/PhpSpreadsheet/vendor/autoload.php';

    $excel = new \PhpOffice\PhpSpreadsheet\Spreadsheet();

    $sheet = $excel->getActiveSheet();
    if (!$sheet) {
      $sheet = $excel->createSheet();
    }

    $sheet->setTitle($logCategory);

    $sheet->getRowDimension('1')->setRowHeight(22);
    $sheet->setCellValue("A1", $logCategory);

    foreach ($cols as $i => $col) {
      $index = chr(ord('A') + $i);
      $sheet->getColumnDimension($index)->setWidth(20);
      $sheet->setCellValue("{$index}2", $col["caption"]);
    }

    foreach ($dataList as $i => $v) {
      $row = $i + 3;
      foreach ($cols as $j => $col) {
        $fieldName = $col["fieldName"];
        $index = chr(ord('A') + $j);
        $sheet->setCellValue("{$index}{$row}", $v[$fieldName]);
      }
    }

    // 画表格边框
    $styleArray = [
      'borders' => [
        'allBorders' => [
          'borderStyle' => \PhpOffice\PhpSpreadsheet\Style\Border::BORDER_THIN,
        ]
      ]
    ];
    $lastRow = count($dataList) + 2;
    $lastCol = chr(ord('A') + (count($cols) - 1));
    $sheet->getStyle("A2:{$lastCol}{$lastRow}")->applyFromArray($styleArray);

    // 把焦点放置在A1
    $sheet->setSelectedCells("A1");

    $dt = date("YmdHis");

    header('Content-Type: application/vnd.ms-excel');
    header('Content-Disposition: attachment;filename="' . $logCategory . '_' . $dt . '.xlsx"');
    header('Cache-Control: max-age=0');

    $writer = new \PhpOffice\PhpSpreadsheet\Writer\Xlsx($excel);
    $writer->save("php://output");
  }

  /**
   * 修改数据域
   */
  public function editDataOrg($params)
  {
    if ($this->isNotOnline()) {
      return $this->notOnlineError();
    }

    $params["loginUserId"] = $this->getLoginUserId();
    $params["userService"] = new UserService();

    $db = $this->db();
    $db->startTrans();

    $dao = new CodeTableRuntimeDAO($db);
    $rc = $dao->editDataOrg($params);
    if ($rc) {
      $db->rollback();
      return $rc;
    }

    $log = $params["log"];
    $logCategory = $params["logCategory"];

    // 记录业务日志
    $bs = new BizlogService($db);
    $bs->insertBizlog($log, $logCategory);

    $db->commit();

    $id = $params["id"];

    return $this->ok($id);
  }

  /**
   * 修改助记码
   */
  public function editPy($params)
  {
    if ($this->isNotOnline()) {
      return $this->notOnlineError();
    }

    $params["loginUserId"] = $this->getLoginUserId();
    $params["userService"] = new UserService();

    $db = $this->db();
    $db->startTrans();

    $dao = new CodeTableRuntimeDAO($db);
    $rc = $dao->editPy($params);
    if ($rc) {
      $db->rollback();
      return $rc;
    }

    $log = $params["log"];
    $logCategory = $params["logCategory"];

    // 记录业务日志
    $bs = new BizlogService($db);
    $bs->insertBizlog($log, $logCategory);

    $db->commit();

    $id = $params["id"];

    return $this->ok($id);
  }

  /**
   * 返回所有的公司列表
   *
   * @return array
   */
  public function companyList($params)
  {
    if ($this->isNotOnline()) {
      return $this->emptyResult();
    }

    $params["loginUserId"] =  $this->getLoginUserId();

    $dao = new OrgDAO($this->db());
    return $dao->getCompanyExList($params);
  }
}
