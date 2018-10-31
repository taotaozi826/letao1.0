
// 进度条功能
$(function () {
    $(document).ajaxStart(function () {
       NProgress.start();
    });
    
    $(document).ajaxStop(function () {
        setTimeout(function () {
            NProgress.done();
        },500)
    });
});

// index页面
$(function () {
    // 二级导航的切换
    $(".It_aside .nav .category").on("click",function () {
      // $(this).next().stop().slideToggle();
      $(this).siblings().stop().slideToggle();
    })
    
    // 左侧菜单的切换
    $(".It_topbar .icon_left").click(function () {
        // alert(1)
        $(".It_main").toggleClass("hidemenu");
        $(".It_aside").toggleClass("hidemenu");
        $(".It_topbar").toggleClass("hidemenu");
    })
    
    // 右侧退出功能
    $("#logoutBtn").on("click",function () {
        $.ajax({
            url:"/employee/employeeLogout",
            type:"get",
            dataType:"json",
            success:function (info) {
                console.log(info);
                if(info.success){
                    location.href = "login.html";
                }
            }
        })
    });
})
