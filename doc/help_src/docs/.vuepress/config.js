module.exports = {
  lang: 'zh-CN',
  title: 'PSI实施指南',
  description: 'PSI实施指南',

  base: '/help/',
  head: [['link', { rel: 'shortcut icon', href: '/help/images/favicon.ico', type: 'image/x-icon' }]],

  themeConfig: {
    logo: '/images/logo.png',
    editLink: false,
    contributors: false,
    backToHome: '返回首页',
    notFound: ['文档页面不存在'],
    lastUpdated: false,
    navbar: [
      {
        text: '使用手册',
        link: '/user/'
      },
      {
        text: '系统管理',
        link: '/admin/'
      },
      {
        text: '二次开发',
        link: '/dev/'
      }
    ],
    sidebar: {
      '/user/': [
        {
          text: '使用手册',
          children: [{
            text: '通用操作',
            link: '/user/00.html',
          },
          {
            text: '登录',
            link: '/user/10.html',
          },
          {
            text: '采购业务',
            link: '/user/20.html',
            children: [
              { text: '采购订单', link: '/user/20-01.html' },
              { text: '采购入库', link: '/user/20-02.html' },
              { text: '采购退货出库', link: '/user/20-03.html' }]
          },
          {
            text: '销售业务',
            link: '/user/30.html',
            children: [
              { text: '销售合同', link: '/user/30-04.html' },
              { text: '销售订单', link: '/user/30-01.html' },
              { text: '销售出库', link: '/user/30-02.html' },
              { text: '销售退货入库', link: '/user/30-03.html' }]
          },
          {
            text: '库存管理',
            link: '/user/40.html',
            children: [
              { text: '库间调拨', link: '/user/40-01.html' },
              { text: '库存盘点', link: '/user/40-02.html' },
            ]
          },
          {
            text: '加工业务',
            link: '/user/60.html',
            children: [
              { text: '存货拆分', link: '/user/60-01.html' },
              { text: '成品委托生产订单', link: '/user/60-02.html' },
              { text: '成品委托生产入库', link: '/user/60-03.html' },
            ]
          },
          {
            text: '资金管理',
            link: '/user/50.html',
          },
          {
            text: '财务总账',
            link: '/user/70.html',
            children:[
              { text: '会计科目', link: '/user/70-01.html' },
            ]
          }],
        },
      ],
      '/admin/': [
        {
          text: '系统管理',
          children: [
            { text: '安装', link: '/admin/01.html' },
            {
              text: '初始化', link: '/admin/02.html',
              children: [
                { text: '用户管理', link: '/admin/02-01.html' },
                { text: '权限管理', link: '/admin/02-02.html' },
                {
                  text: '物料', link: '/admin/02-04.html',
                  children: [
                    { text: '物料计量单位', link: '/admin/02-04-01.html' },
                    { text: '物料品牌', link: '/admin/02-04-02.html' },
                    { text: '价格体系', link: '/admin/02-04-03.html' },
                    { text: '成本分摊', link: '/admin/02-04-04.html' },
                  ]
                },
                { text: '供应商档案', link: '/admin/02-07.html' },
                { text: '客户资料', link: '/admin/02-08.html' },
                { text: '仓库', link: '/admin/02-05.html' },
                { text: '库存建账', link: '/admin/02-06.html' },
                { text: '业务设置', link: '/admin/02-03.html' },
                { text: '工厂', link: '/admin/02-09.html' },
              ]
            },
            { text: '业务日志', link: '/admin/03.html' },
            { text: '如何升级PSI', link: '/admin/04.html' },
            { text: '数据域应用详解', link: '/admin/05.html' },
            { text: '环境变量', link: '/admin/06.html' },
            { text: 'Lodop打印', link: '/admin/07.html' },
          ],
        },
      ],
      '/dev/': [{
        text: '低代码应用平台',
        link: '/dev/lcap/',
        children: [{
          text: '解决方案',
          link: '/dev/lcap/08-05.html'
        }, {
          text: '主菜单维护',
          link: '/dev/lcap/08-01.html'
        }, {
          text: '码表设置',
          link: '/dev/lcap/08-03.html'
        }, {
          text: '自定义表单',
          link: '/dev/lcap/08-06.html'
        },{
          text: '视图开发助手',
          link: '/dev/lcap/08-04.html'
        }, {
          text: '系统数据字典',
          link: '/dev/lcap/08-02.html'
        }, {
          text: 'FId一览',
          link: '/dev/lcap/08-07.html'
        }]
      },
      {
        text: '二次开发',
        children: [{
          text: '独立模块',
          link: '/dev/alone/',
          children: [
            {
              text: '如何新增一个模块',
              link: '/dev/alone/100.html'
            }
          ]
        }],
      },
      ],
    },
  },
}
