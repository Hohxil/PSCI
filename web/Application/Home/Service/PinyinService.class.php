<?php
namespace Home\Service;

require __DIR__ . '/../Common/Pinyin/pinyin.php';

/**
 * 拼音Service
 *
 * @author 艾格林门信息服务（大连）有限公司
 * @copyright 2015 - present
 * @license GPL v3
 */
class PinyinService
{
  public function toPY($s)
  {
    return strtoupper(pinyin($s, "first", ""));
  }
}
