/**
 * Created by 54721 on 2018/10/31.
 */
$(function() {

  // 一进入页面, 发送 ajax 请求, 获取用户列表, 通过 模板引擎渲染
  $.ajax({
    type: "get",
    url: "/user/queryUser",
    data: {
      page: 1,
      pageSize: 5
    },
    dataType: "json",
    success: function( info ) {
      console.log( info )
      // 通过模板引擎渲染
      // var htmlStr = template( "模板id", "数据对象")
      // 在模板中可以使用传入的数据对象的属性
      var htmlStr = template("tmp", info);

      // 渲染到页面中
      $('tbody').html( htmlStr );
    }
  })


})
