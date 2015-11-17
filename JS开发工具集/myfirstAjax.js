var uri = "http://cmss.10086.cn/cms/";
$(document).ready(function() {
	//下拉菜单
		
		
		(function(){
			var droptimer = null;
			$(".nav li").find("div").hover(function(){
				clearTimeout(droptimer);
			})
			$(".nav li").hover(function(){
				var _this = $(this);
				_this.siblings().children("div").hide();
				droptimer=setTimeout(function(){
					_this.find("div").show();
				},500)		
			},function(){
				var _this = $(this);
				droptimer=setTimeout(function(){
					_this.find("div").hide();
				},500)	
			})			
		})()
		
/*资讯页导航信息切换*/
	$(".info-nav").find("a").click(function () {
		 $(this).addClass("info-sel").siblings().removeClass("info-sel");
	})
	
})
		//初始化全部信息
		function loadInit(){
			//loadInfo("json=1");
			loadInfo("json=get_category_posts&slug=all&count=40");
		};

		/**
		 * 获得url参数，封装到params对象中
		 */
		function urlParas(){
			var url = window.location.href;

			var p = url.split("?")[1];

			var params = {};
			if(p && p.length > 0){
				var ps = p.split("&");
				for(var i=0;i < ps.length ; i++){
					var kv = ps[i].split("=");
					params[kv[0]] = kv[1];
				}
			}
			window.params = params;
		};
		urlParas();
		//console.log(params.got);
		if(params.got == undefined || params.got == "" || params.got == null){
			loadInit()
		}

		//页面跳转触发事件	
		(function(){
			if(params.got == '4'){loadJobInfo('json=get_category_index&parent=7');}
			if(params.got == '3'){loadInfo('json=get_category_posts&slug=company');}
			if(params.got == '2'){loadInfo('json=get_category_posts&slug=industry');}
		})();
	
		function parseISO8601(dateStringInRange) {
		   var isoExp = /^\s*(\d{4})-(\d\d)-(\d\d)\s*$/,
			   date = new Date(NaN), month,
			   parts = isoExp.exec(dateStringInRange);

		   if(parts) {
			 month = +parts[2];
			 date.setFullYear(parts[1], month - 1, parts[3]);
			 if(month != date.getMonth() + 1) {
			   date.setTime(NaN);
			 }
		   }
		   return date;
		 }
	//资讯加载
	function loadInfo(params){
		$("#c-msg").html("");
		var url = uri +"?"+ params;
		var address = "http://cmss.10086.cn/";
		var infos={years:[]}
		$.ajax({
				type:"post",
				url:url,
				dataType:"json",
				success:function(data) {
//					debugger
					var jdata = data.posts;
					if(jdata.length > 0){
						for(var i=0;i<jdata.length;i++){
							var timer = parseISO8601(jdata[i].date.split(" ")[0]);
							//console.log(timer);
							var year = timer.getFullYear();
							if(!infos[year]){
								infos[year] = [];
								infos.years.push(year)
							}
							var mon = timer.getMonth()+1;
							if(!infos[year][mon])infos[year][mon] = [];
							infos[year][mon].push(jdata[i]);
						}
	//					console.log(infos);
						var html ="";
						//infos.years.sort();
						for(var i=0;i < infos.years.length;i++){
							console.log(i+"---"+infos.years[i]+"---"+infos[infos.years[i]]);
							var months = infos[infos.years[i]];
							console.log(months);
	//						debugger
							if(months){
								console.log(months[i]);
								for(var j=12;j >0;j--){
									if(months[j] && months[j].length>0){
										html = "<div class='c-date'>"+infos.years[i]+"年"+j+"月</div>"
										for(var k=0;k<months[j].length;k++){
											html += "<p><span>"+months[j][k].date.split(" ")[0]+"</span><a href='./info.html?key="+months[j][k].id+"' title='"+months[j][k].title+"'>"+months[j][k].title+"</a></p>";
										}
										$("#c-msg").append(html);
									}
								}
							}
						}
					}else{
						$("#c-msg").html("<div class='come-back'><img src='img/nofound.png' class='img-nofound'/><p class='p-nofound'>抱歉，您点击的页面尚在维护中，敬请期待 <br/>您可以前往其他页面看看，<a href='./index.html' class='backhome'>点击返回首页</a></p></div>");
					}
					//console.log(html);
				}
		})				
	}
	
	
	//社会招聘加载
	function loadJobInfo(params){
		$("#c-msg").html("");
		var url = uri + "?" + params;
		$.ajax({
			type:"post",
			url:url,
			dataType:"json",
			success:function (data) {
				var cate = data.categories;
				if(cate && cate.length > 0){
					var department = "";
					for (var i=0;i<cate.length;i++) {
						$("#c-msg").append("<div class='c-date'>"+cate[i].title+"</div><div id='"+cate[i].slug+"' class='job-lists'></div>");
						if(cate[i].post_count > 0){
							$.ajax({
								type:"post",
								url:uri + "?json=get_category_posts&slug="+cate[i].slug,
								dataType:"json",
								success:function (data) {
									var job = data.posts;
									for (var i=0;i<job.length;i++) {
										department = "<a href='./work_detail.html?key="+job[i].id+"' title='"+job[i].title+"'>"+job[i].title+"</a>";
										$("#"+data.category.slug).append(department);
									}
								}
							});
						}
					}
				}else{
					$("#c-msg").html("<div class='come-back'><img src='img/nofound.png' class='img-nofound'/><p class='p-nofound'>抱歉，您点击的页面尚在维护中，敬请期待 <br/>您可以前往其他页面看看，<a href='./index.html' class='backhome'>点击返回首页</a></p></div>");
				}
				
			}
		});
	}
	
	
	//学校招聘加载
	function schollJob(params) {
		$("#c-msg").html("");
		var url = uri + "?" + params;
		$.ajax({
			type:"post",
			url:url,
			dataType:"json",
			success:function (data) {
				var cate = data.categories;
				if(cate && cate.length > 0){
					var school = "";
					for (var i=0;i<cate.length;i++) {
						$("#c-msg").append("<div class='c-date'>"+cate[i].title+"</div><div id='"+cate[i].slug+"' class='job-lists'></div>");
						if(cate[i].post_count > 0){
							$.ajax({
								type:"post",
								url:uri + "?json=get_category_posts&slug="+cate[i].slug,
								dataType:"json",
								success:function (data) {
									var job = data.posts;
									for (var i=0;i<job.length;i++) {
										school = "<a href='./work_detail.html?key=1&id="+job[i].id+"'>"+job[i].title+"</a>";
										$("#"+data.category.slug).append(school);
									}
								}
							});
						}
					}					
				}else{
					$("#c-msg").html("<div class='come-back'><img src='img/nofound.png' class='img-nofound'/><p class='p-nofound'>抱歉，您点击的页面尚在维护中，敬请期待 <br/>您可以前往其他页面看看，<a href='./index.html' class='backhome'>点击返回首页</a></p></div>");
				}
			},
			error:function(){
				
			}
		});
	}
