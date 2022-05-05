/**
 * 修正ExtJS中number column在格式化负数时候的bug
 * 
 * @author 艾格林门信息服务（大连）有限公司
 * @copyright 2015 - present
 * @license GPL v3
 */
Ext.define("PSI.UX.NumberOverride", {
  override: "Ext.grid.column.Number",

  defaultRenderer: function (value) {
    if (value >= 0) {
      return Ext.util.Format.number(value, this.format);
    } else {
      return "-"
        + Ext.util.Format.number(Math.abs(value),
          this.format);
    }
  }
});
