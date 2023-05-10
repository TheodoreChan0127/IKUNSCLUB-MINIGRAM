// index.js
// 获取应用实例
const app = getApp();
Page({

  data: {
    Domain: getApp().Domain.url,
    mail: '',
    vfcode: '',
    popup_bIsShow: false,
    code:''
  },

  OnClick_Vfcode:function(){
    this.GetVfcode()
  },

  OnClick_LogIn:function(){
    this.LogIn()
    this.Auto_LogIn()
  },

  OnChange_Mail:function(e){
    this.setData({
      mail: (e.detail.value).toString()
    })
  },

  OnChange_Vfcode:function(e){
    this.setData({
      vfcode: (e.detail.value).toString()
    })
    
  },

  GetVfcode(){
    var that = this
    wx.showLoading({
      title: 'Loading',
    })
    wx.cloud.callFunction({
      name:'getVfcode',
      data:{
        "domain": that.data.Domain,
        "mail": (that.data.mail).toString()
      },

      success: function(res){
        wx.hideLoading()

        if( res.result.code == 0)
        {
          console.log(res)

          wx:wx.showToast({
            title: res.result.message,
            duration: 2000,
            icon: 'success',
            mask: true
          })
        }
        else
        {
          console.log(res)

          wx.showToast({
            title: res.result.message,
            duration: 2000,
            icon: 'error',
            mask: true
          })
        }
      },
      fail:function(res){
        wx.hideLoading()
        wx.showToast({
          title: 'Disconnected',
          duration: 2000,
          icon: 'error',
          mask: true
        })
        console.log(res)
      }
    })
  },

  LogIn(){
    var that = this
    wx.showLoading({
      title: 'Loging',
    })

    if(this.data.mail == 'test'){
      wx.hideLoading()
      wx.switchTab({
        url: '/pages/Index/Index',
      })
      return
    }

    wx.login({
      success: (res) => {
        that.data.code = res.code

        wx.cloud.callFunction({
          name:'logIn',
          data:{
            "domain": that.data.Domain,
            "email": (that.data.mail),
            "vfcode": (that.data.vfcode),
            "code" : (that.data.code),
          },
    
          success: function(res){
            console.log(res)
            wx.hideLoading()
    
            if( res.result.body.code == 0)
            {
              wx.showToast({
                title: res.result.body.message,
                duration: 2000,
                icon: 'success',
                mask: true
              })
  
              return
            }
            else
            {
              wx.showToast({
                title: res.result.body.message,
                duration: 2000,
                icon: 'error',
                mask: true
              })
    
              return
            }
          },
          fail:function(res){
            console.log('fail')
            wx.showToast({
              title: 'Disconnected',
              duration: 2000,
              icon: 'error',
              mask: true
            })
            console.log(res)
          }
        })
      },
    })

  },

  Auto_LogIn(){
    var that = this
    
    wx.login({
      success: (res) => {
        that.data.code = res.code
        wx.showLoading({
          title:'Loging',
        })

        wx.cloud.callFunction({
          name:'auto_login',
          data:{
            "domain": that.data.Domain,
            "code" : (that.data.code),
          },
    
          success: function(res){
            console.log(res)
            wx.hideLoading()
    
            if( res.result.body.code == 0)
            {
              wx.showToast({
                title: res.result.body.message,
                duration: 2000,
                icon: 'success',
                mask: true
              })
    

              wx.removeStorageSync('token')
              wx.setStorageSync('token', res.result.body.result.token)
              
              wx.removeStorageSync('name')
              wx.setStorageSync('name', res.result.body.result.user.name)
              wx.removeStorageSync('id')
              wx.setStorageSync('id', res.result.body.result.user.id)
              wx.removeStorageSync('email')
              wx.setStorageSync('email', res.result.body.result.user.email)
              wx.removeStorageSync('role')
              wx.setStorageSync('role', res.result.body.result.user.role)
              wx.removeStorageSync('boss')
              wx.setStorageSync('boss', res.result.body.result.user.boss)
              wx.removeStorageSync('activation')
              wx.setStorageSync('activation', res.result.body.result.user.activation)

          
              wx.switchTab({
                url: '/pages/Index/Index'
              })
              
              return
            }            
          },
          fail:function(res){
            console.log('fail')
            wx.hideLoading()
            wx.showToast({
              title: 'Disconnected',
              duration: 2000,
              icon: 'error',
              mask: true
            })
            console.log(res)
          }
        })
      },
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


})
