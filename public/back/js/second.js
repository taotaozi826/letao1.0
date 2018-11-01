$(function () {
    var currentPage = 1;
    var pageSize = 5;
    render();
    
    function render() {
        $.ajax({
            url: "/category/querySecondCategoryPaging",
            type: "get",
            data: {
                page: currentPage,
                pageSize: pageSize
            },
            dataType:"json",
            success: function (info) {
                console.log(info)
                var htmlStr = template("secondTmp",info);
                $("tbody").html(htmlStr);
                
                // 分页插件
               $("#paginator").bootstrapPaginator({
                   bootstrapMajorVersion:3,
                   totalPages: Math.ceil(info.total/info.size),
                   currentPage:info.page,
                   onPageClicked:function (a,b,c,page) {
                     currentPage = page;
                     render();
                   }
               })
            }
        });
    }
    
})
