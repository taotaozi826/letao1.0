$(function () {
    var currentPage = 1;
    var pageSize = 5;
    var currentId; //当前修改的用户 id
    var isDelete;  // 修改的状态
    render();
    function render() {
        $.ajax({
            url: "/user/queryUser",
            dataType: "json",
            type: "get",
            data: {
                page: currentPage,
                pageSize: pageSize
            },
            success: function (info) {
                console.log(info);
                var str = template("tmp", info);
                $("tbody").html(str);
                
                // 配置分页插件
                $("#paginator").bootstrapPaginator({
                    bootstrapMajorVersion: 3,
                    currentPage: info.page,
                    totalPages: Math.ceil(info.total / info.size),
                    onPageClicked: function (a, b, c, page) {
                        // console.log(page)
                        currentPage = page;
                        render();
                    }
                })
            }
        });
    }
    
    // 点击启用禁用按钮, 显示模态框 (使用事件委托)
    $("tbody").on("click",".btn",function () {
        // 显示模态框
      $("#userModal").modal("show");
        currentId = $(this).parent().data("id");
        isDelete = $(this).hasClass("btn-danger")? 0:1;
    })
    
    $("#submitBtn").click(function () {
      $.ajax({
          type:"post",
          url:"/user/updateUser",
          data:{
              id:currentId,
              isDelete:isDelete
          },
          dataType:"json",
          success:function (info) {
            console.log(info)
              if(info.success){
                $("#userModal").modal("hide");
                render();
              }
          }
      })
    })
    
})