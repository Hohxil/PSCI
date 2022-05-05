/**
 * 修正 toFixed
 * 
 * @author 艾格林门信息服务（大连）有限公司
 * @copyright 2015 - present
 * @license GPL v3
 */

// 算法来自
https://zhuanlan.zhihu.com/p/31202697

if (!Number.prototype._toFixed) {
  Number.prototype._toFixed = Number.prototype.toFixed;
}
Number.prototype.toFixed = function (n) {
  return (this + 1e-10)._toFixed(n);
};
