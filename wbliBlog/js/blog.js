		$(function(){
			var timer = null;
			var width = $(".b-box").find("li").eq(0).width();
			$(".next").click(function(){
				$(".b-box").stop(true,true).animate({left:width*-1},function(){
					var first = $(".b-box").children().first();
					var index = first.next().attr("index");
					$(this).css({left:0}).append(first);
					$(".b-ball li").eq(index).addClass("b-sel").siblings().removeClass("b-sel");
				})
			})
			$(".prev").click(function(){
				var last = $(".b-box").children().last();
				var index = last.attr("index");
				$(".b-box").css({left:width*-1}).stop(true,true).animate({left:0}).prepend(last);
				$(".b-ball li").eq(index).addClass("b-sel").siblings().removeClass("b-sel");
			});

			$(".b-ball").find("li").click(function(){
				var _index = $(this).index();
				$(this).addClass("b-sel").siblings().removeClass("b-sel");
						var $li = $(".b-box").find("li[index="+_index+"]");
					$(".b-box").prepend($li.nextAll());
					$(".b-box").prepend($li);

			});

			var autoplay = setInterval(function(){$(".next").trigger("click")},5000);
			$(".b-box,.b-ball").hover(function(){
				clearInterval(timer);
				clearInterval(autoplay);
			},function(){			
				autoplay = setInterval(function(){$(".next").trigger("click")},5000);
			});
		
			/*音乐播放器*/
			document.getElementById("expyes").onclick = function(){
				var $parent = document.getElementById("musicbox");
				var playdom = document.getElementById("play_listbox");
				move(playdom,{left:-1*($parent.offsetWidth - 24)});
				move($parent,{left:-1*($parent.offsetWidth - 24)});
				showhide("expyes","none");
				showhide("expno","inline-block");
			}

			document.getElementById("expno").onclick = function(){
				var $parent = document.getElementById("musicbox");
				var playdom = document.getElementById("play_listbox");
				move(playdom,{left:0});
				move($parent,{left:0});
				showhide("expyes","inline-block");
				showhide("expno","none");
			}

			document.getElementById("exlist").onclick = function(){
				var playdom = document.getElementById("play_listbox");
				if(playdom.style.display=="none"){
					playdom.style.display = "block";
					move(playdom,{top:100});
				}else{
					playdom.style.display = "none";
					playdom.style.top = (playdom.offsetHeight + 100)+"px";
				}
			};
		function move(obj,opts,callback){
			clearInterval(obj.timer);//清楚多余动画	
			//定时动画
			obj.timer = setInterval(function(){
				var imark = true;
				for(var attr in opts){//永远都是false
					attr = attr.toLowerCase();
					//获取起点坐标
					var start;
					if(attr == "opacity"){
						start = Math.round(getCss( obj, 'opacity') * 100);
					}else{
						start = parseInt(getCss(obj,attr));
					}
					//速度
					var speed = (opts[attr] - start) /8;
					//速度精度计算，如果是正小数那么向上取值，如果负数就向下取值，为什么，因为有精度的丢失的问题
					speed = speed > 0  ? Math.ceil(speed) : Math.floor(speed);
					
					if(start != opts[attr]){//到达终点 0
						imark = false;
						if(attr=="opacity"){
							console.log(start+"===="+speed);
							obj.style.opacity = (start + speed) / 100;
							obj.style.filter = 'alpha(opacity='+ (start + speed) +')';
						}else{
							obj.style[attr] = start+speed+"px";//start + speed已经走了距离
						}
					}
				};
				
				if(imark){
					clearInterval(obj.timer);//之前动画是不还执行
					if(callback)callback.call(obj);
				}
			},30);//没隔30毫秒执行一帧动画
		};
		//获取样式的起点左边的位置
		function getCss(obj,attr){
			 var val = obj.currentStyle ? obj.currentStyle[attr] : window.getComputedStyle(obj,null)[attr];
			 return val == "auto" ? 0 :val;
		};
		function showhide(id,value){
			document.getElementById(id).style.display = value;
		};


		//banner 小圆环
			(function(){
				var $b_player = document.getElementById("ban-player");
				var $b_run = document.getElementById("ban-run");

				var x = 30;
				var y =30;
				var r = 30;
				var angle = 0;
				var speed = 0.05;
				var arr = [];
				var timer = setInterval(function(){
					var ndiv = document.createElement("div");
					var top = y + Math.sin(angle)*r-2;
					var left = x + Math.cos(angle)*r-2;	
					var wh = randomRange(3,1);
					$b_run["style"]["top"] =top +"px";
					$b_run["style"]["left"] = left + "px";
					ndiv["style"]["width"] = wh+"px";
					ndiv["style"]["height"] = wh + "px";
					ndiv["style"]["background"] = "rgba(195,51,218,0.15)";
					ndiv["style"]["position"] = "absolute";
					ndiv["style"]["top"] = $b_run.offsetTop +1+ "px";
					ndiv["style"]["left"] = $b_run.offsetLeft +1+"px";
					$b_player.appendChild(ndiv);
					arr.push(ndiv);
					if(arr.length > 26){
						var a = arr.shift();
						$b_player.removeChild(a);

					}
					angle += speed;					
				},30)
				
			function random(num){
				return Math.floor(Math.random()*(num+1));
			};

			function randomRange(start,end){
				return Math.floor(Math.random()*(end-start+1))+start;
			};
			/*
			function randomColor16(){
				//0-255	
				var r = random(255).toString(16);
				var g = random(255).toString(16);
				var b = random(255).toString(16);
				//255的数字转换成十六进制
				if(r.length<2)r = "0"+r;
				if(g.length<2)g = "0"+g;
				if(b.length<2)b = "0"+b;
				return "#"+r+g+b;
			}
			*/
			})()
		});

		//音乐播放器
		var player = {
		//定义播放器对象
		audioDom:null,
		playerList:[],
		init:function(options){
			var opts = extend({
				loop:false,//默认：不重复播放
				volume:5,//默认音量0.5
				timercallback:function(){//时间加载函数				
				},
				timerUpdate:function(){//播放音乐的回调函数
				}	
			},options);
			//创建播放器
			this.create();
			//音乐初始化
			this.audioDom.src= this.playerList[0];
			//循环的控制
			if(opts.loop)this.audioDom.loop = "loop";
			//音量的控制
			this.audioDom.volume = opts.volume / 10;
			//时间初始化
			this.timer(opts);
			//加载完毕的回调函数
			if(opts.loadSuccess)opts.loadSuccess.call(opts);

		},
		//创建播放器
		create:function(){
			this.audioDom = document.createElement("audio");
		},
		//添加音乐
		add:function(link){
			this.playerList.push(link)
		},
		//播放音乐
		play:function(){
			this.audioDom.play();
		},
		//暂停音乐
		stop:function(){
			this.audioDom.pause();				
		},
		//时间控制
		timer:function(opts){
			//函数oncanplaythrough 还 ontimeupdate
			var $this = this;
			//监听播放器音乐加载完毕
			this.audioDom.addEventListener("canplaythrough",function(){
				if(opts.timercallback)opts.timercallback.call(this,$this.timeFormat(this.duration));
			});

			//监听音乐的播放
			this.audioDom.addEventListener("timeupdate",function(){
				var stime = this.duration - this.currentTime;
				var sf = $this.timeFormat(stime);
				if(opts.timeUpdate)opts.timeUpdate.call(this,$this.timeFormat(this.currentTime),sf);
			});
		},

		//时间格式化
		timeFormat:function(timer){
			var m = parseInt(timer / 60);//分
			var s = parseInt(timer % 60);//剩余多少秒
			m = m < 10 ? "0"+m : m;
			s = s < 10 ? "0"+s : s;
			return m +":"+s;
		},
		//上一首
		prev:function(){
		
		},
		//下一首
		next:function(){
		
		},
		setVolume:function(v){
			this.audioDom.volume = v / 10;
		}
	
	
	}
	/*对象继承*/
	function extend(target,source){
		var args = Array.prototype.slice.call(arguments);
		var mark = typeof args[args.length-1] === "boolean" ? args.pop():true;
		var i = 1;
		if(args.length===1){
			i = -1;
		}
		while((source = args[i++])){//undefined null "" false 0
			for(var key in source){
				if(mark || !(callback in target)){
					target[key] = source[key]
				}
			}			
		}
		return target;
	}
	
		//改变音乐事件
		function changeVolume(){
			document.getElementById("vper_proxy").onmousedown = function(e){
				//当前鼠标的坐标
				var x = e.clientX;
				//计算音量的宽度
				var vw = x - 440;
				//拿到总距离
				var w = this.parentElement.offsetWidth;
				//计算百分比
				var vt = vw / w;
				//算出百分比
				var per =  vt * 100;
				if(per >=96){
					vt = 1;
					per = 100;
				}
				//算出音乐
				var v = (vt * 10).toFixed(0);
				//保存计算的音量，静音的切换
				ov = v;
				//更改音乐播放器的音量
				player.setVolume(v);
				//更改音乐音量的进度条
				document.getElementById("vper").style.width = per+"%";
			}
		};

		//声音的控制
		changeVolume();
		
		//打开音量
		function cvolume(){
			//设置播放器的音量为0，代表静音
			player.setVolume(0);
			document.getElementById("volume").style.display="none";
			document.getElementById("novolume").style.display="inline-block";
			//音量进度条置为0%
			document.getElementById("vper").style.width = "0%";
		}

		//静音设置
		function novolume(){
			//重新找到全局的音量，
			player.setVolume(ov);
			document.getElementById("novolume").style.display="none";
			document.getElementById("volume").style.display="inline-block";
			var per = (ov / 10) * 100;
			document.getElementById("vper").style.width = per+"%";
		};
		player.add("mp3/02.mp3");
		player.add("mp3/01.mp3");
		player.init({
			volume:2,
			timercallback:function(timer){
				//总时长的计算
				document.getElementById("timer").innerHTML = timer;
			},
			timeUpdate:function(ptimer,stimer){
				//播放的时长的计算
				document.getElementById("ctimer").innerHTML = stimer+"/"+ptimer;
				var t = this.duration;//总时长
				var pt = this.currentTime;//播放时长
				//计算进度显示进度百分比
				var per = ((pt / t) * 100).toFixed(0) + "%";
				document.getElementById("prograss").style.height = per;
				document.getElementById("pnum").innerHTML = per;
			},
			loadSuccess:function(){
				var per = (this.volume / 10 ) * 100;
				document.getElementById("vper").style.width = per+"%";
				//初始化音量
				ov = 2;
			}
		});//播放器初始化

		//播放和暂停
		function play_stop(mark){
			if(mark==1){
				player.play();
				document.getElementById("play")["style"]["display"] = "none";
				document.getElementById("stop")["style"]["display"] = "inline-block";
			}else{
				player.stop();
				document.getElementById("stop")["style"]["display"] = "none";
				document.getElementById("play")["style"]["display"] = "inline-block";
			}
		}
		