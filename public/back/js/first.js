$(function () {
    var currentPage = 1;
    var pageSize = 5
    // 1. 发送ajax请求数据, 进行渲染
    render();
    function render() {
        $.ajax({
            type: "get",
            url: "/category/queryTopCategoryPaging",
            data: {
                page: currentPage,
                pageSize: pageSize
            },
            dataType: "json",
            success: function (info) {
                console.log(info);
                var htmlStr = template("tmp", info);
                // console.log(htmlStr);
                $("tbody").html(htmlStr);
                
                // 进行分页
                $("#paginator").bootstrapPaginator({
                    bootstrapMajorVersion: 3,
                    totalPages: Math.ceil(info.total / info.size),
                    currentPage: info.page,
                    onPageClicked: function (a, b, c, page) {
                        // console.log(page)
                        currentPage = page;
                        render();
                    }
                    
                })
            }
        })
    }
    // 2. 点击添加按钮, 显示添加模态框
    $("#addBtn").click(function () {
      $("#addModal").modal("show");
    });
    
    // 3. 表单校验
    $("#form").bootstrapValidator({
        // 配置图标
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',   // 校验成功
            invalid: 'glyphicon glyphicon-remove',   // 校验失败
            validating: 'glyphicon glyphicon-refresh'  // 校验中
        },
    
        // 配置需要校验的字段
        fields:{
            categoryName:{
                validators:{
                    notEmpty:{
                        message:"请输入一级分类"
                    }
                }
            }
        }
    });
    
    // 4. 注册表单校验成功事件, 阻止默认的提交, 通过 ajax 提交
    $("#form").on("success.form.bv",function (e) {
        // console.log(e);
      e.preventDefault();
      // console.log($("#form").serialize());
      
      $.ajax({
          type:"post",
          url:"/category/addTopCategory",
          data: $("#form").serialize(),
          dataType:"json",
          success:function (info) {
            console.log(info);
              // 关闭模态框
            $("#addModal").modal("hide");
              // 页面重新渲染第1页
            currentPage = 1;
            render();
              // 调用 resetForm 进行重置
              $("#form").data("bootstrapValidator").resetForm(true);
          }
      });
    })
})