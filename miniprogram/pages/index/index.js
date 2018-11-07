//index.js
var data = require('../../utils/data.js').songs;
var sliderWidth = 96; // 需要设置slider的宽度，用于计算中间位置
Page({
  data: {
    inputShowed:false,
    inputVal:"",
    tabs:["个性推荐","歌单","主播电台","排行榜"],
    activeIndex:0,
    sliderOffset:0,
    sliderLeft:0,
    imgUrls: [
      'http://p1.music.126.net/Bn16ByIEjOyUCZsJ1R_dXw==/109951163638462544.jpg',
      'http://p1.music.126.net/Jmrpx8nMfyJhvojTxoHxqQ==/109951163638454760.jpg',
      'http://p1.music.126.net/N9ljku9Ltmj_Hf3zVe9nwA==/109951163638475643.jpg',
      'http://p1.music.126.net/l00RpRax7_rx3TfEHXwp0g==/109951163638435877.jpg',
      'http://p1.music.126.net/dHCZBMiOE-Hacku_eMj_7w==/109951163636707868.jpg',
      'http://p1.music.126.net/viMu6v3-TJ_VSIirgTywrg==/109951163638548359.jpg',
      'http://p1.music.126.net/bMGpdXxfBg-ie07AEyJSpg==/109951163636664500.jpg'
      
    ],
    searchReault:[]
  },
  showInput: function () {
    this.setData({
      inputShowed: true
    });
  },
  hideInput: function () {
    this.setData({
      inputVal: "",
      inputShowed: false
    });
  },
  clearInput: function () {
    this.setData({
      inputVal: ""
    });
  },

  inputTyping: function (e) {
    console.log(e.detail)
    this.setData({
      inputVal: e.detail.value
    });
    // let url = `http://localhost:3000/search?keywords=${e.detail.value}`
    wx.request({
      url: 'http://neteasemusic.leanapp.cn/search',
      data: {
        keywords: e.detail.value
      },
      method: 'GET',
      success: function (res) {
        let temp = []
        if (!res.data.result.songs) {
          return;
        }
        res.data.result.songs.forEach((song, index) => {

          temp.push({
            id: song.id,
            name: song.name,
            mp3Url: song.mp3Url,
            picUrl: song.album.picUrl,
            singer: song.artists[0].name
          })
          that.setData({
            searchReault: temp
          })


        })
        // 存入搜索的结果进缓存
        wx.setStorage({
          key: "searchReault",
          data: temp
        })
      },
    })
  },
  onShow: function () {
    wx.hideLoading()
  },

  onLoad: function () {
    //顶部导航栏
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
          sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex
        });
      }
    });
    var rs = [],
    idsMap = {},
    keys = Object.keys(data),
    len = keys.length
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
    that.setData({
      recommends: rs
    });
    wx.setStorageSync('ids', idsMap);
  },


  playTap: function (e) {
    const dataset = e.currentTarget.dataset;
    console.log(dataset)
    wx.switchTab({
      url: `../play/play?id=${dataset.id}`
    })
  },
  //搜索
  tabClick: function (e) {
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
  },
  tonow: function (event) {
    let songData = {
      id: event.currentTarget.dataset.id,
      name: event.currentTarget.dataset.name,
      mp3Url: event.currentTarget.dataset.songurl,
      picUrl: event.currentTarget.dataset.picurl,
      singer: event.currentTarget.dataset.singer
    }
    // 将当前点击的歌曲保存在缓存中
    wx.setStorageSync('clickdata', songData)
    wx.switchTab({
      url: '../play/play'
    })
  }
})