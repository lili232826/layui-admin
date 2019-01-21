layui.define(['element'], function(exports){
  var element = layui.element;
   //监听导航点击
  var tabArr=["page/page0.html"];
  var activeIndex=-1;
  //监听左侧侧边栏
  element.on('nav(layadmin-system-side-menu)', function(elem){
    var layHref=$(elem).attr("lay-href");
		var tabTxt=elem.text();
		//console.log(layHref,"layHref")
		$('#LAY_app_body').children().removeClass('layui-show');
		$("#LAY_app_tabsheader").children().removeClass("layui-this");
		if(tabArr.length<1){//数组无长度时
			//tabArr.push(layHref);
		}else{//数组有长度时
			
			for(var i=0;i<tabArr.length;i++){
				//console.log(tabArr,"ppppppppppppppppppp")
				if(tabArr[i]===layHref){
					activeIndex=i*1;
					console.log(activeIndex,"activeIndex")
					$('#LAY_app_body .layadmin-tabsbody-item').eq(activeIndex).addClass("layui-show");
					$('#LAY_app_tabsheader li').eq(activeIndex).addClass("layui-this");
					scrollCurrent(activeIndex);
					return false;
				}
			}
		}
		tabArr.push(layHref);
		activeIndex=tabArr.length-1;
		addItem(element,layHref,tabTxt);
			//layer.msg(elem.text());
		$("#LAY_app").removeClass('layadmin-side-shrink')//展开
		$('#flexible .layui-icon').addClass('layui-icon-shrink-right').removeClass('layui-icon-spread-left')
  });
  //监听头部tabs切换
	element.on('tab(layadmin-layout-tabs)', function(data){
		var currentIndex=data.index;
		activeIndex=data.index;
		$('#LAY_app_body').children().removeClass('layui-show');
		$('#LAY_app_body .layadmin-tabsbody-item').eq(currentIndex).addClass("layui-show");
		setSiderActive();
		//console.log(this); //当前Tab标题所在的原始DOM元素
		//console.log(data.index); //得到当前Tab的所在下标
		//console.log(data.elem); //得到当前的Tab大容器
	})
	//监听头部tabs删除；layui的tab删除做了一部分样式处理
	element.on('tabDelete(layadmin-layout-tabs)', function(data){
 		//console.log(this,"kkkk")
 		var currentIndex=data.index;
		delItem(currentIndex,tabArr);
		//console.log(this); //当前Tab标题所在的原始DOM元素
		  //console.log(data.index); //得到当前Tab的所在下标
		 // console.log(data.elem); //得到当前的Tab大容器
	});
	//操作tabs的下拉按钮
	element.on('nav(layadmin-pagetabs-nav)', function(elem){
		var layadminEevent=$(elem).parent("dd").attr("layadmin-event");
		var currentIndex=$("#LAY_app_tabsheader").children('.layui-this').index();
		//console.log(currentIndex)
		switch(layadminEevent)
		{
			case 'closeThisTabs':
			closeThisTabs(currentIndex,tabArr);	
				break;
			case 'closeOtherTabs':
				//执行代码块 2
				closeOtherTabs(currentIndex,tabArr);
				break;
			case 'closeAllTabs':
				closeAllTabs(tabArr);
				break;
		}
	});
 

 //exports('index', {}); //注意，这里是模块输出的核心，模块名必须和use时的模块名一致
});
//展开收缩
$('#flexible').click(function(){
	$("#LAY_app").toggleClass("layadmin-side-shrink");
	$(this).children('i').toggleClass('layui-icon-spread-left')
})
//全屏展示
$('#fullscreen').click(function(){
	fullscreen();
})
	
function addItem(element,layHref,tabTxt){
	//console.log(layHref,tabTxt,'000000000000')
	var newBodyChild="<div class='layadmin-tabsbody-item layui-show'><iframe class='layadmin-iframe' src='"+layHref+"'></iframe></div>";
	//var newHeadCgild='<li lay-id="'+layHref+'" lay-attr="'+layHref+'" class="layui-this"><span>'+tabTxt+'</span></li>'
	element.tabAdd('layadmin-layout-tabs', {
	  title: tabTxt
	  ,id: layHref
	});             
	$('#LAY_app_body').append(newBodyChild);
	element.tabChange('layadmin-layout-tabs', layHref);
	setLeftScroll();
	//$("#LAY_app_tabsheader").append(newHeadCgild);
}
function delItem(currentIndex,tabArr){
	$('#LAY_app_body .layadmin-tabsbody-item').eq(currentIndex).remove();
	tabArr.splice(currentIndex,1);
	setSiderActive();
	scrollRightScroll(currentIndex);
}
function closeThisTabs(currentIndex,tabArr){
	console.log(currentIndex)
	if(currentIndex<tabArr.length-1){
		$('#LAY_app_tabsheader li').eq(currentIndex+1).addClass("layui-this");
		$('#LAY_app_body .layadmin-tabsbody-item').eq(currentIndex+1).addClass("layui-show");
	}else{
		$('#LAY_app_tabsheader li').eq(currentIndex-1).addClass("layui-this");
		$('#LAY_app_body .layadmin-tabsbody-item').eq(currentIndex-1).addClass("layui-show");
	}
	if(currentIndex==0){
		return false;
	}
	$("#LAY_app_tabsheader li").eq(currentIndex).remove();
	$('#LAY_app_body .layadmin-tabsbody-item').eq(currentIndex).remove();
	tabArr.splice(currentIndex,1);
	setSiderActive();
	scrollRightScroll(currentIndex);
}
function closeOtherTabs(currentIndex,tabArr){
	$('#LAY_app_body .layadmin-tabsbody-item:not(":first,.layui-show")').remove();
	$('#LAY_app_tabsheader li:not(":first,.layui-this")').remove();
	var layHref=tabArr[currentIndex];
	tabArr.splice(1,tabArr.length-1);
	tabArr.push(layHref);
	$("#LAY_app_tabsheader").css("left","0px")
}
function closeAllTabs(tabArr){
	$('#LAY_app_body .layadmin-tabsbody-item:gt(0)').remove();
	$('#LAY_app_tabsheader li:gt(0)').remove();
	$('#LAY_app_body .layadmin-tabsbody-item').eq(0).addClass("layui-show");
	$('#LAY_app_tabsheader li').eq(0).addClass("layui-this");
	$("#LAY-system-side-menu li").removeClass('layui-this');
	tabArr.splice(1,tabArr.length-1);
	$("#LAY_app_tabsheader").css("left","0px")
}
function setSiderActive(){
	var layId=$('#LAY_app_tabsheader li.layui-this').attr('lay-id');
	$("#LAY-system-side-menu li").removeClass('layui-this');
	$("#LAY-system-side-menu a[lay-href='"+layId+"']").parent('li').addClass("layui-this")
}
function fullscreen() {
    if (document.body.requestFullscreen) {
        return document.body.requestFullScreen();
    } else if (document.body.webkitRequestFullScreen) {
        return document.body.webkitRequestFullScreen();
    } else if (document.body.mozRequestFullScreen) {
        return document.body.mozRequestFullScreen();
    } else {
        return document.body.msRequestFullscreen();
    }
}	
var scrollIndex=0;
var maxWidth=$('#LAY_app_tabsheader').width();
$(window).resize(function () {
	maxWidth=$('#LAY_app_tabsheader').width();
})
//	监听左右按钮
$("#leftPage").click(function(){
	var left=$("#LAY_app_tabsheader").css("left"),leftNum=Math.abs(left.substring(0,left.length-2)*1);
	if(left+maxWidth<0){
		$('#LAY_app_tabsheader').css("left",(leftNum+maxWidth)+"px");
	}else{
		$('#LAY_app_tabsheader').css("left","0px");
	}
})
$("#rightPage").click(function(){
	var left=$("#LAY_app_tabsheader").css("left"),leftNum=left.substring(0,left.length-2)*1;
	var sumWidth=0;
	$('#LAY_app_tabsheader li').each(function(){
		sumWidth += $(this).outerWidth();
	});
	if(sumWidth+leftNum<0||sumWidth+leftNum>maxWidth){
		$('#LAY_app_tabsheader').css("left",(leftNum-maxWidth)+"px");
	}
})
//点击添加往做移动
function setLeftScroll(){
	var sumWidth=0;
	var left=$("#LAY_app_tabsheader").css("left"),leftNum=Math.abs(left.substring(0,left.length-2)*1);
	$('#LAY_app_tabsheader li').each(function(){
		sumWidth += $(this).outerWidth();
	});
	if(sumWidth>maxWidth){
		leftNum+=$('#LAY_app_tabsheader li').eq(scrollIndex).outerWidth()*1;
		scrollIndex++;
		$('#LAY_app_tabsheader').css("left",-leftNum+"px");
		
	}
	//console.log(left,"left")
}
//点击添加的时候，是已经存在的；
function scrollCurrent(currentIndex){
	var sumWidth=0;
	var left=$("#LAY_app_tabsheader").css("left"),leftNum=left.substring(0,left.length-2)*1;
	$('#LAY_app_tabsheader li:lt('+currentIndex+')').each(function(){
		sumWidth += $(this).outerWidth();	
	});
	if(sumWidth+leftNum<0||sumWidth+leftNum>maxWidth){
		$('#LAY_app_tabsheader').css("left",-sumWidth+"px");
	}	
}
//点击删除像右移动
function scrollRightScroll(currentIndex){
	var sumWidth=0;
	var left=$("#LAY_app_tabsheader").css("left"),leftNum=left.substring(0,left.length-2)*1;
	$('#LAY_app_tabsheader li:lt('+currentIndex+')').each(function(){
		sumWidth += $(this).outerWidth();	
	});
	if(sumWidth+leftNum<=0){
		var move=$('#LAY_app_tabsheader li').eq(currentIndex-1).outerWidth()*1;
		$('#LAY_app_tabsheader').css("left",(leftNum+move)+"px");
	}	
	console.log(leftNum,"leftNum")
}