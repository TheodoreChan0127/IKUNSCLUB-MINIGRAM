// pages/Index/Index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    Domain: getApp().Domain.url,
    link:"",
    Tips:"This is Tips",
    Notice:"This is Notice",
    Id:wx.getStorageSync('id'),
    Name:wx.getStorageSync('name'),
    Email:wx.getStorageSync('email'),
    Role:wx.getStorageSync('role'),
    Boss:wx.getStorageSync('boss'),
    Activation:wx.getStorageSync('activation'),
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.getInfo()

    switch (this.data.Role) {
      case 1:
        this.setData({Role : '超级管理员'})
        break;
      case 2:
        this.setData({Role : '普通管理员'})
        break;
      case 3:
        this.setData({Role : '普通用户'})
        break;

      default:
        break;
    }
  },

  onPullDownRefresh(options){
    this.getInfo()
  },

  GetLink(){
    var that = this
    wx.showLoading({
      title: 'Getting',
    })

    wx.cloud.callFunction({

      name:'getNewLink',
      data:{
        "domain": that.data.Domain,
        token:wx.getStorageSync('token')
      },

      success: function(res){
        console.log(res)
        console.log('Index')
        wx.hideLoading()

        if( res.result.statusCode == 200)
        {
          var link=res.result.body.result.clashlink
          wx.showModal({
            title: 'Getted!',
            content: res.result.body.message+res.result.body.result.clashlink+"\n点击确认复制链接",
            complete: (res) => {
              if (res.cancel) {
                
              }
          
              if (res.confirm) {
                that.setData({
                  link: link
                })
                that.copy()
              }
            }
          })
          
        }
        else
        {
          wx.showToast({
            title: res.result.body.message,
            duration: 2000,
            icon: 'error',
            mask: true
          })
        }
      },
      fail:function(res){
        console.log(res)
        wx.showToast({
          title: 'Couldnt Get!',
          duration: 2000,
          icon: 'error',
          mask: true
        })
        console.log(res)
      }
    })

  },

  copy:function(){
    var that = this
    wx.setClipboardData({
      data: that.data.link,

      success(res){
        wx.showToast({
          title: 'Copied!',
        })
      }
    })
  },

  popup_close:function(){
    this.setData({
      popup_bIsShow: false
    })
  },

  popup_show:function(){
    this.setData({
      popup_bIsShow: true
    })
  },

  getInfo:function(){
    var that = this
    var m_token = wx.getStorageSync('token')
    
    wx.cloud.callFunction({

      name:'getTips',
      data:{
        "domain": that.data.Domain,
        token: m_token,
      },

      success: function(res){

        console.log(res)
        if( res.result.statusCode == 200)
        {
           that.setData({
             Tips: res.result.body.result.content
           })
        }
        else
        {
          wx.showToast({
            title: res.result.body.message,
            duration: 2000,
            icon: 'error',
            mask: true
          })
        }
      },
      fail:function(res){
        console.log(res)
        wx.showToast({
          title: 'Failed to Get UserTips',
          duration: 2000,
          icon: 'error',
          mask: true
        })
        console.log(res)
      }
    })

    wx.cloud.callFunction({

      name:'getNotice',
      data:{
        "domain": that.data.Domain,
        token: m_token,
      },

      success: function(res){

        console.log(res)
        if( res.result.statusCode == 200)
        {
          that.setData({
            Notice: res.result.body.result.content
          })
        }
        else
        {
          wx.showToast({
            title: res.result.body.message,
            duration: 2000,
            icon: 'error',
            mask: true
          })
        }
      },
      fail:function(res){
        console.log(res)
        wx.showToast({
          title: 'Failed to Get',
          duration: 2000,
          icon: 'error',
          mask: true
        })
        console.log(res)
      }
    })
  }
  
})