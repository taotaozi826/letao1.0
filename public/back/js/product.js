$(function () {
  var picArr = [];// 图片数组, 用于存储已上传的图片对象(路径和名称)
  var currentPage = 1;
  var pageSize = 2;
  // 1.商品页基本渲染
  render();
  
  function render() {
    $.ajax({
      url: "/product/queryProductDetailList",
      type: "get",
      data: {
        page: currentPage,
        pageSize: pageSize
      },
      dataType: "json",
      success: function (info) {
        // console.log(info)
        var htmlStr = template("tmp", info);
        $("tbody").html(htmlStr);
        
        // 配置分页插件
        $("#paginator").bootstrapPaginator({
          bootstrapMajorVersion: 3,
          currentPage: info.page,
          totalPages: Math.ceil(info.total / info.size),
          onPageClicked: function (a, b, c, page) {
            currentPage = page;
            render();
          }
        })
      }
    })
  }
  
  // 2.点击添加按钮,调用添加的模态框
  $("#addBtn").click(function () {
    $('#addModal').modal("show")
    
    // 获取所有的二级分类, 进行渲染下拉菜单
    $.ajax({
      type: "get",
      url: "/category/querySecondCategoryPaging",
      data: {
        page: 1,
        pageSize: 100
      },
      dataType: "json",
      success: function (info) {
        // console.log(info);
        var htmlStr = template("addTmp", info);
        $(".dropdown-menu").html(htmlStr);
      }
    })
  });
  
  // 3. 给下拉菜单的 a 绑定点击事件 (事件委托绑定)
  $(".dropdown-menu").on("click", "a", function () {
    var txt = $(this).text();
    $("#dropdownMenu1").text(txt);
    
    var id = $(this).data("id");
    $('[name="brandId"]').val(id);
  
    // 重置校验状态为 VALID
    $('#form').data("bootstrapValidator").updateStatus("brandId", "VALID");
    
  })
  
  // 4. 进行图片上传插件初始化
  $("#fileupload").fileupload({
    dataType: "json",
    //e：事件对象
    //data：图片上传后的对象，通过data.result.picAddr可以获取上传后的图片地址
    done: function (e, data) {
      // console.log(data.result);
      var picObj = data.result;
      var picUrl = picObj.picAddr;
      // console.log(picObj)  //会打印三次
      
      picArr.unshift(picObj);
      // console.log(picArr) //打印三次
      
      $("#imgBox").prepend('<img src="' + picUrl + '" alt="">')
      
      if (picArr.length > 3) {
        picArr.pop();
        $("#imgBox img:last-of-type").remove();
      }
      
      // 如果图片上传满3张,该让picStatus的校验状态, 置成校验成功
      if(picArr.length===3) {
        $("#form").data("bootstrapValidator").updateStatus("picStatus","VALID");
      }
      
    }
  });
  
  // 5.添加表单校检
  $("#form").bootstrapValidator({
    // 配置对隐藏域也进行校验
    excluded: [],
    // 配置图标
    feedbackIcons: {
      valid: 'glyphicon glyphicon-ok',   // 校验成功
      invalid: 'glyphicon glyphicon-remove',   // 校验失败
      validating: 'glyphicon glyphicon-refresh'  // 校验中
    },
    // 配置校验字段
    fields: {
      brandId: {
        validators: {
          notEmpty: {
            message: "请选择二级分类"
          }
        }
      },
      proName: {
        validators: {
          notEmpty: {
            message: "请输入商品名称"
          }
        }
      },
      proDesc: {
        validators: {
          notEmpty: {
            message: "请输入商品描述"
          }
        }
      },
      num: {
        validators: {
          notEmpty: {
            message: "请输入商品库存"
          },
          regexp: {
            regexp: /^[1-9]\d*$/,
            message: '库存格式要求是非零开头的数字'
          }
        }
      },
      size: {
        validators: {
          notEmpty: {
            message: "请输入商品尺码"
          },
          regexp: {
            regexp: /^\d{2}-\d{2}$/,
            message: '尺码格式必须是 xx-xx 的格式, 例如: 32-40'
          }
        }
      },
      oldPrice: {
        validators: {
          notEmpty: {
            message: "请输入商品原价"
          }
        }
      },
      price: {
        validators: {
          notEmpty: {
            message: "请输入商品现价"
          }
        }
      },
      picStatus: {
        validators: {
          notEmpty: {
            message: "请上传三张图片"
          }
        }
      }
    }
  })
  
  // 6.注册表单校验成功事件, 阻止默认的提交, 通过 ajax 提交
  $("#form").on("success.form.bv",function (e) {
    e.preventDefault();
    
    // 拼接data数据
    var params = $("#form").serialize();
    // console.log(params);
    
    params += "&picName1=" + picArr[0].picName + "&picAddr1=" +picArr[0].picAddr;
    params += "&picName1=" + picArr[1].picName + "&picAddr1=" +picArr[1].picAddr;
    params += "&picName1=" + picArr[2].picName + "&picAddr1=" +picArr[2].picAddr;
    
    $.ajax({
      type:"post",
      data: params,
      dataType: "json",
      url: "/product/addProduct",
      success:function (info) {
        console.log(info);
        if(info.success) {
          $("#addModal").modal("hide");
          currentPage=1;
          render();
          //上传成功并渲染后再次添加需要重置表单
          $('#form').data("bootstrapValidator").resetForm(true);
          // 重置下拉框和图片
          $("#dropdownMenu1").text("请选择二级分类");
          $("#imgBox").html("");
        }
        
      }
    })
  });
})


