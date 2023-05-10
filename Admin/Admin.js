// pages/Admin/Admin.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userArray: [],
    func_bIsShow: false,
    addUser_bIsShow:false,
    changeNotice_bIsShow: false,
    changeTip_bIsShow: false,
    changeUserInfo_bIsShow: false,
    UserTip_bIsShow: false,
    Domain: getApp().Domain.url,
    UserTip: "Here is UserTip"
  },

  usersRequest:function(){
    var that = this

    wx.cloud.callFunction({

      name:'getUsers',
      data:{
        "domain": that.data.Domain,
        token: wx.getStorageSync('token'),
      },

      success: function(res){
        console.log(res)
        if( res.result.statusCode == 200)
        {
          wx.showToast({
            title: res.result.body.message,
            duration: 2000,
            icon: 'none',
            mask: true
          })

          for(var i=0 ; i<res.result.body.result.length ; i++)
          {
            switch (res.result.body.result[i].role) {
              case 1:
                res.result.body.result[i].role = '超级管理员'
                break;
              case 2:
                res.result.body.result[i].role = '普通管理员'
                break;
              case 3:
                res.result.body.result[i].role = '普通用户'
                break;

              default:
                break;
            }

            var arr={
                id:res.result.body.result[i].id,
                name:res.result.body.result[i].name,
                email:res.result.body.result[i].email,
                role:res.result.body.result[i].role,
                boss:res.result.body.result[i].boss,
                activation:res.result.body.result[i].activation
            }
            that.data.userArray = that.data.userArray.concat(arr)
            that.setData({
              userArray : that.data.userArray
            })
          }         

        }
        else
        {
          wx.showToast({
            title: res.result.body.message,
            duration: 2000,
            icon: 'none',
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
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.usersRequest()
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {
    this.refresh()
  },

  showAnimation:function(){
    this.setData({
      func_bIsShow:!(this.data.func_bIsShow)
    })
  },
  closeInput:function(){
    this.setData({
    addUser_bIsShow:false,
    changeNotice_bIsShow: false,
    changeTip_bIsShow: false,
    changeUserInfo_bIsShow: false
    })
  },
  addUser_Show:function()
  {
    this.setData({
      addUser_bIsShow:!(this.data.addUser_bIsShow)
    })
  },
  changeNotice_Show:function()
  {
    this.setData({
      changeNotice_bIsShow:!(this.data.changeNotice_bIsShow)
    })
  },
  changeTip_Show:function()
  {
    this.setData({
      changeTip_bIsShow:!(this.data.changeTip_bIsShow)
    })
  },
  changeUserInfo_Show:function()
  {
    this.setData({
      changeUserInfo_bIsShow:!(this.data.changeUserInfo_bIsShow)
    })
  },
  checkUserTip_Show:function()
  {
    this.setData({
      closeUserTip_bIsShow:!(this.data.closeUserTip_bIsShow)
    })
  },
  

  OnChange_Name:function(e){
    this.data.Name=e.detail.value
  },
  OnChange_Mail:function(e){
    this.data.Mail=e.detail.value
  },
  OnChange_Role:function(e){
    this.data.Role=e.detail.value
  },
  OnChange_Content:function(e){
    this.data.Content=e.detail.value
  },
  OnChange_ID:function(e){
    this.data.ID=e.detail.value
  },

  addUser:function(){
    var that = this
    wx.showLoading({
      title: 'Adding',
    })

    console.log({
      name:that.data.Name,
      email:that.data.Mail,
      role:that.data.Role,
    })

    wx.cloud.callFunction({
      name:'addUser',
      data:{
        "domain": that.data.Domain,
        name:that.data.Name,
        email:that.data.Mail,
        role:that.data.Role,
        token:wx.getStorageSync('token')
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
          that.refresh()
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

  changeNotice:function(){
    var that = this
    wx.showLoading({
      title: 'Changing',
    })
    console.log(wx.getStorageSync('token'))

    wx.cloud.callFunction({
      name:'changeNotice',
      data:{
        "domain": that.data.Domain,
        content:that.data.Content,
        token:wx.getStorageSync('token')
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

  changeTip:function(){
    var that = this
    wx.showLoading({
      title: 'Changing',
    })

    wx.cloud.callFunction({
      name:'changeTip',
      data:{
        "domain": that.data.Domain,
        uid:that.data.ID,
        content:that.data.Content,
        token:wx.getStorageSync('token')
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

  changeUserInfo:function(){
    var that = this
    
    wx.showLoading({
      title: 'Changing',
    })

    wx.cloud.callFunction({
      name:'changeUserInfo',
      data:{
        "domain": that.data.Domain,
        id:that.data.ID,
        name:that.data.Name,
        role:that.data.Role,
        token:wx.getStorageSync('token')
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
          that.refresh()

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
  deleteUser:function(event){
    var targetid = event.currentTarget.dataset.targetid
    var that = this
    console.log(targetid)

    wx.showLoading({
      title: 'Deleting',
    })

    wx.cloud.callFunction({
      name:'deleteUser',
      data:{
        "domain": that.data.Domain,
        targetid: this.targetid,
        token:wx.getStorageSync('token')
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
          that.refresh()

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
  checkUserTip:function(event){
    var uid = event.currentTarget.dataset.targetid
    var that = this
    console.log(uid)

    wx.showLoading({
      title: 'Checking',
    })

    wx.cloud.callFunction({
      name:'checkUserTip',
      data:{
        "domain": that.data.Domain,
        uid: this.uid,
        token:wx.getStorageSync('token')
      },

      success: function(res){
        console.log(res)
        wx.hideLoading()

        if( res.result.body.code == 0)
        {
          that.setData({
            UserTip : res.result.body.result.content
          })

          wx.showToast({
            title: res.result.body.message,
            duration: 2000,
            icon: 'success',
            mask: true
          })
          that.checkUserTip_Show()

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


  refresh:function(){
    this.setData({userArray: []})
    this.usersRequest()
  }

})

