//index.js
var data = require('../../utils/data.js').songs;

Page({
  data: {
    imgUrls: [
      '../../image/banner/banner1.jpg',
      '../../image/banner/banner2.jpg',
      '../../image/banner/banner3.jpg',
      '../../image/banner/banner4.jpg'
      
    ]
  },
  onLoad: function () {
    var rs = [],
      idsMap = {},
      keys = Object.keys(data),
      len = keys.length;

    for (var i = 0; i < len; i++) {
      var k = keys[i];

      rs.push(Object.assign({
        id: k,
      }, data[k]));

      idsMap[k] = {
        preid: i > 0 ? keys[i - 1] : 0,
        nextid: i < len - 1 ? keys[i + 1] : 0
      }
    }

    idsMap[keys[0]].preid = keys[len - 1];
    idsMap[keys[len - 1]].nextid = keys[0];

    this.setData({
      recommends: rs
    });

    //console.log(rs)

    wx.setStorageSync('ids', idsMap);
  },
  playTap: function (e) {
    const dataset = e.currentTarget.dataset;
    wx.navigateTo({
      url: `../play/index?id=${dataset.id}`
    })
    //console.log(dataset.id)
  }
})