/**
 * 计算商品价格的Mix
 * 用于单据编辑页面
 * 
 * @author 艾格林门信息服务（大连）有限公司
 * @copyright 2015 - present
 * @license GPL v3
 */
Ext.define("PSI.Mix.GoodsPrice", {
  // 因价税合计变化，重新计算
  calcTax: function (goods) {
    if (!goods) {
      return;
    }
    var taxRate = goods.get("taxRate") / 100;
    if (isNaN(taxRate)) {
      taxRate = 0;
    }
    var tax = goods.get("moneyWithTax") * taxRate / (1 + taxRate);
    if (isNaN(tax)) {
      tax = 0;
    }
    goods.set("tax", tax);
    goods.set("goodsMoney", goods.get("moneyWithTax") - tax);

    // 计算单价
    var cnt = parseFloat(goods.get("goodsCount"));
    if (isNaN(cnt) || Math.abs(cnt) < 1e-10) {
      goods.set("goodsPrice", null);
      goods.set("goodsPriceWithTax", null);
    } else {
      goods.set("goodsPrice", goods.get("goodsMoney")
        / cnt);
      goods.set("goodsPriceWithTax", goods.get("moneyWithTax")
        / cnt);
    }
  },

  // 因为税金变化，重新计算
  calcMoneyWithTax: function (goods) {
    if (!goods) {
      return;
    }

    goods.set("goodsMoney", goods.get("tax") * 100
      / goods.get("taxRate"));
    goods.set("moneyWithTax", goods.get("goodsMoney")
      + goods.get("tax"));
    var cnt = parseFloat(goods.get("goodsCount"));
    if (!isNaN(cnt) && Math.abs(cnt) > 1e-10) {
      goods.set("goodsPrice", goods.get("goodsMoney") / cnt);
      goods.set("goodsPriceWithTax", goods.get("moneyWithTax") / cnt);
    }
  },

  // 因为不含税价格变化，重新计算金额
  calcMoney: function (goods) {
    if (!goods) {
      return;
    }

    var cnt = parseFloat(goods.get("goodsCount"));
    var price = parseFloat(goods.get("goodsPrice"));
    if (isNaN(cnt) || isNaN(price)) {
      goods.set("goodsMoney", null);
      goods.set("tax", null);
      goods.set("moneyWithTax", null);
      goods.set("goodsPriceWithTax", null);
      return;
    }

    var money = cnt * price;
    goods.set("goodsMoney", money);
    var taxRate = parseInt(goods.get("taxRate"));
    if (isNaN(taxRate)) {
      taxRate = 0;
    }
    var tax = money * (taxRate / 100);
    goods.set("tax", tax);
    var moneyWithTax = money + tax;
    goods.set("moneyWithTax", moneyWithTax);
    if (cnt != 0) {
      goods.set("goodsPriceWithTax", moneyWithTax / cnt);
    }
  },

  // 因为含税价变化，重新计算金额
  calcMoney2: function (goods) {
    if (!goods) {
      return;
    }

    goods.set("moneyWithTax", goods.get("goodsPriceWithTax")
      * goods.get("goodsCount"));
    goods.set("goodsMoney", goods.get("moneyWithTax")
      / (1 + goods.get("taxRate") / 100));
    goods.set("tax", goods.get("moneyWithTax")
      - goods.get("goodsMoney"));

    var cnt = parseFloat(goods.get("goodsCount"));
    if (!isNaN(cnt) && Math.abs(cnt) > 1e-10) {
      goods.set("goodsPrice", goods.get("goodsMoney") / cnt);
    }
  },

  // 因金额变化，重新计算单价
  calcPrice: function (goods) {
    if (!goods) {
      return;
    }

    var cnt = parseFloat(goods.get("goodsCount"));
    if (!isNaN(cnt) && Math.abs(cnt) > 1e-10) {
      goods.set("goodsPrice", goods.get("goodsMoney") / cnt);
      goods.set("goodsPriceWithTax", goods.get("moneyWithTax") / cnt);
    }
  }
});
