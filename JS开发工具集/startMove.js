/*
 * @author:liwenbin
 * @dateL2015-12-01
 * @desc 多物体运动框架
 */
		/*
		//改变距离 宽度等
		var timer = null;

		function startMove(obj,target){
			clearInterval(obj.timer);
			obj.timer = setInterval(function(){
				var speed = (target - obj.offsetWidth) / 8;
				speed = speed>0?Math.ceil(speed):Math.floor(speed);
				if(obj.offsetWidth == target){
					clearInterval(obj.timer);
				}else{
					obj.style.width = obj.offsetWidth + speed + 'px';
				}
			},30)
			
		}

		window.onload = function(){
			var oDiv = document.getElementsByTagName('div');

			for(var i=0;i<oDiv.length;i++){
				oDiv[i].timer = null;
				oDiv[i].onmouseover = function(){
					startMove(this,300)
				}
				oDiv[i].onmouseout = function(){
					startMove(this,100)
				}
			}
		}
		*/

			//改变透明度
			/*
			var alpha = 30;
			function startMove(obj,target){
				clearInterval(obj.timer);
				obj.timer = setInterval(function(){
					var speed = (target - obj.alpha) / 8;
					speed = speed>0?Math.ceil(speed):Math.floor(speed);
					if(obj.alpha == target){
						clearInterval(obj.timer);
					}else{
						obj.alpha += speed;
						obj.style.filter = 'alpha(opacity:'+obj.alpha+')';
						obj.style.opacity = obj.alpha / 100;
					}
				},30)
			}

			window.onload = function(){
				var oDiv = document.getElementsByTagName('div');
				for(var i=0;i<oDiv.length;i++){
					oDiv[i].alpha = 30;
					oDiv[i].onmouseover = function(){
						startMove(this,100);
					}
					oDiv[i].onmouseout = function(){
						startMove(this,30);
					}
				}
			}
			*/


			//	整合代码
			//var timer = null;
			
			function getStyle(obj,attr){
				if(obj.currentStyle){
					return obj.currentStyle[attr];
				}else{
					return getComputedStyle(obj,false)[attr];
				}
			}
			
			function startMove(obj,attr,target){
				clearInterval(obj.timer);
				obj.timer = setInterval(function(){
					if(attr == 'opacity'){
						var iCur = parseInt(parseFloat(getStyle(obj,attr))*100);
					}else{
						var iCur = parseInt(getStyle(obj,attr));
					}
					
					var speed = (target - iCur) / 8;
					speed = speed>0?Math.ceil(speed):Math.floor(speed);
					if(iCur == target){
						clearInterval(obj.timer);
					}else{
						if(attr == 'opacity'){
							iCur += speed;
							obj.style.filter = 'alpha(opacity:'+iCur+')';
							obj.style.opacity = iCur / 100;
						}else{
							obj.style[attr] = iCur + speed + 'px';
						}
					}
				},30)
				
			}