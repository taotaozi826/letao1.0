$(function () {
  $.ajax({
      url:"/user/queryUser",
      dataType:"json",
      type:"get",
      data:{
          page:1,
          pageSize:5
      },
      success:function (info) {
        console.log(info);
        var str = template("tmp",info);
        console.log(str);
        $("tbody").html(str);
      }
  })
})