//index.js
var data = require('../../utils/data.js').songs;

Page({
  data: {
    imgUrls: [
      'http://p1.music.126.net/Bn16ByIEjOyUCZsJ1R_dXw==/109951163638462544.jpg',
      'http://p1.music.126.net/Jmrpx8nMfyJhvojTxoHxqQ==/109951163638454760.jpg',
      'http://p1.music.126.net/N9ljku9Ltmj_Hf3zVe9nwA==/109951163638475643.jpg',
      'http://p1.music.126.net/l00RpRax7_rx3TfEHXwp0g==/109951163638435877.jpg',
      'http://p1.music.126.net/dHCZBMiOE-Hacku_eMj_7w==/109951163636707868.jpg',
      'http://p1.music.126.net/viMu6v3-TJ_VSIirgTywrg==/109951163638548359.jpg',
      'http://p1.music.126.net/bMGpdXxfBg-ie07AEyJSpg==/109951163636664500.jpg'
      
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