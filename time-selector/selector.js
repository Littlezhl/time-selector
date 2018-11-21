(function ($) {
    var defaults={
        startFlag:0   //选择标识，为0则表示未选择，1表示已选择开始时间；        
    };
    $.fn.timeSelector = function (options) {
		$.extend(defaults,options);
		//初始化
	    var init=function(){
			 // 时间节点构成
		    var totalM = (defaults.endTime- defaults.startTime)*60; // 总分钟数
		    var liLength = totalM/15; // 算出是由多少个15分钟
			var leftNode=$('<div class="selector-left"></div>');
			var rightNode=$('<div class="selector-right"></div>');
		    var ulNode = $('<ul></ul>'); // 创建ul元素
		    // 构建分钟节点
			var leftContent='';
		    var li = '';
		    var minutes = 0;
			var num=defaults.startTime;
		    for(var i = 0; i<liLength; i++){
			    if(minutes%60== 0){
				    leftContent += '<div class="hour">'+num+':'+'00</div>';			
					li += '<li type="'+num+':00" ></li>';
					num+=1;
					minutes = 0;
			    }else{
				    li += '<li type="'+(num-1)+':'+minutes+'" ></li>';
				}
                minutes+=15; 				
		    }
		    ulNode.append(li); // 把li插入到ul里
		    rightNode.html(ulNode);
			leftNode.html(leftContent);
			$(defaults.domClassName).append(leftNode);
			$(defaults.domClassName).append(rightNode);
		}();
		//初始化已选择时间段
		$(defaults.selectedSection).each(function(i,v){
				var stime = new Date(v.meetDate+"T"+v.startTime); //数据开始时间  兼容safri浏览器
		        var etime = new Date(v.meetDate+"T"+v.endTime); //数据结束时间
		        var init_time = new Date(v.meetDate+"T08:00");
		        var sminute = parseInt((stime.getTime() - init_time.getTime()) / parseInt(1000*60)); // 将开始时间转化成分钟数
		        var eminute = parseInt((etime.getTime() - init_time.getTime()) / parseInt(1000*60)); // 将结束时间转化成分钟数
				// 转化成分钟数一定是15的倍数，用总分钟数除以15就可以知道他是由几个15构成,他所对应的下标
				var st = sminute/15;
				var et = eminute/15;
				$('.selector-right ul li').each(function(i,v){
					if(i>=st && i<=et){
						// 已经被预约的时间段;
						$(this).addClass('booked');
					}
				});
			});
		//li 点击事件
        $('.selector-right ul li').each(function(i,v){
            // 鼠标按下选择时间开始点
            $(this).unbind('click').on('click',function(){
                if(defaults.startFlag===0){
                    //清空文字信息
                    $('.selector-right li').html('');
                    //选择开始时间
                    if($(this).hasClass('booked')){
                        alert('当前时间段已经被预约!请重新预约');
                        $('.selector-right ul li').removeClass('service');
                    }else{
                        $(this).addClass('selected').siblings().removeClass('selected');
                        //显示文字提示
                        confirmStart(this);
                        //选择标识置为1
                        defaults.startFlag=1;
                        //提示选择结束时间
                        alert("请选择结束时间");
                    }
                }else{
                    //选择结束时间
                    if($(this).hasClass('booked')){
                        alert('当前时间段已经被预约!请重新预约');
                        $('.selector-right ul li').removeClass('service');
                    }else{
                        $(this).addClass('selected');
                        compareEnd(this,function(flag){
                            defaults.startFlag=0;
                            if(flag){
                                //开始时间和结束时间之间的节点置为selected
                                var dist = []; //声明数组用来存放鼠标按下、抬起。所对应的节点
                                $('.selector-right ul li').each(function(i,v){
                                    if($(v).hasClass('selected')){
                                        dist.push($(this).index());
                                        for(var j = dist[0]+1;j<dist[1]; j++){
                                            $('.selector-right ul li').eq(j).addClass('selected');
                                        }
                                    }
                                });
                                confirmEnd(function(f){
                                    if(!f){
                                        defaults.callback(defaults.startTime,defaults.endTime);
                                    }
                                });
                            }
                        });
                    }
                }
            });
        });
    };

    var confirmStart=function (dom){
        defaults.startTime=$(dom).attr("type");
        var html="<span>起始时间</span><span>"+$(dom).attr("type")+"</span>";
        $(dom).append(html);
    };

    var compareEnd=function (dom,callback){
        //判断是否大于开始时间
        if(defaults.startTime<$(dom).attr("type")){
            defaults.endTime=$(dom).attr("type");
            var html="<span>结束时间</span><span>"+$(dom).attr("type")+"</span>";
            $(dom).append(html);
            callback(true);
        }else{
            alert('开始时间大于或等于结束时间！请重新选择');
            $('.selector-right .selected').html('');
            $('.selector-right ul li').removeClass('selected');
            callback(false);
        }
    };

    var confirmEnd=function (callback){
        // 判断预约时间段里是否有已经被预约的时间段
        $('.selected').each(function(i,v){
            if($(v).hasClass('booked')){
                alert('您所选时间段有时间已被预约！请重新选择');
                $('.selector-right .selected').html('');
                $('.selector-right ul li').removeClass('selected');
                callback(true);
                return false;
            }else{
                if(i===($('.selected').length-1)){
                    callback(false);
                }
            }
        })
    };
})($);

