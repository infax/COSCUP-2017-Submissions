/* =================================
	COSCUP 2017 Submissions Data by Infax Lai @ infax.lai@gmail.com 2017-07-18
	簡單說，官方資料抓下來解開重排過，並列成直列式的資料
	原理是定義每分鐘高度後，計算每個session的時間長度，轉成高度，再計算與上場session 時間差並以css定義顯示
	這樣就可以對上垂直的時間軸
	接下來就是顯示而以
	顯示結構分成三區塊：
		<div class="class_day">	-->天<--
			<div class="class_room"> -->議程空間<--
				<div class="class_sub">-->議程<--
				</div>
			</div>
		</div>
	這部分為底下的Javascript 產生
	
=================================*/
$(function(){
	
	var room_submission = new Object(); //因原始格式不好排資料，所以需要重排過
	var day_start = 8 * 60; //定義一天的開始從早上8點算
	var url = 'https://coscup.org/2017-assets/json/submissions.json'; //coscup 2017 議程官方資料來源
	/* 原始json格式為下：
		0=>[object Object]
			=---room=>101
			=---community=>
			=---subject=>Opening
			=---summary=>Welcome to COSCUP 2017
			=---start=>2017-08-05T08:45:00+08:00
			=---end=>2017-08-05T09:15:00+08:00
			=---original_speakerpic=>
			=---lang=>ZH
			=---speaker=>[object Object]
		1=>[object Object]
			=---room=>101
			=---community=>
			=---subject=>誰來相挺 _ Mr.big with COSCUP
			=---summary=>台灣各行各業之中，都擁有無私奉獻與付出的開源貢獻者，由生活農業、建築人文、法律和政治的多種面向，展演 Open Source 開源精神。
			=---start=>2017-08-05T09:20:00+08:00
			=---end=>2017-08-05T10:40:00+08:00
			=---original_speakerpic=>
			=---lang=>ZH
			=---speaker=>[object Object]
	*/
	$.getJSON( url , function( data ) {
		$.each( data , function (v , d){
			
			var date_start = new Date(d['start']); //解出開始與結束時間
			var date_end = new Date(d['end']);
			var day = date_start.getDate(); //取出議程日期
			var time_start = date_start.getHours() * 60 + date_start.getMinutes() - day_start; //計算開始時間的每天基準分鐘數
			var time_end = date_end.getHours() * 60 + date_end.getMinutes() - day_start;	//計算結束時間的每天基準分鐘數
			var time = padLeft(''+date_start.getHours(),2) + ':' + padLeft(''+date_start.getMinutes(),2); //顯示用的時間
			time +='~'+ padLeft(''+date_end.getHours(),2) + ':' + padLeft(''+date_end.getMinutes(),2);

			
			if(room_submission[day] == undefined)room_submission[day] = new Object();
			if(room_submission[day][d['room']] == undefined)room_submission[day][d['room']] = new Object();
			//重新定義一個Object 存放解完的資料
			room_submission[day][d['room']][v]=new Object({	'community':d['community'],
													'subject':d['subject'],
													'summary':d['summary'],
													'time':time,
													'original_speakerpic':d['original_speakerpic'],
													'lang':d['lang'],
													'speaker':d['speaker']['name'],
													'time_start':time_start,
													'time_end':time_end
												});
		});
		
		$.each( room_submission , function (v_day , d_room){
			//放置議程日期的空間
			$('body').append('<div class="class_day" ref="'+v_day+'" id="div_day_'+v_day+'"><div class="class_title_day">'+v_day+'</div><div class="class_times" id="div_tims_'+v_day+'"></div></div>');

			//產生時間軸
			for(var i=8;i<17;i++){
				$('#div_tims_'+v_day+'').append('<div class="class_times_hr">'+i+':00</div>');
			}
			
			//放置議程空間
			$.each( d_room , function (v_room , d_sub){
				$('#div_day_'+v_day).append('<div class="class_room" ref="'+v_room+'" id="div_day_'+v_day+'_room_'+v_room+'"><div class="class_title_room">'+v_room+'</div></div>');
				//放置議程資料
				$.each( d_sub , function (v , d){
					$('#div_day_'+v_day+'_room_'+v_room).append('<div class="class_sub" ref="'+v+'" id="div_day_'+v_day+'_room_'+v_room+'_sub_'+v+'" ref_start="'+d['time_start']+'" ref_end="'+d['time_end']+'" title="['+d['speaker']+']">'+d['time']+'<br>'+d['subject']+'</div>'); //+v+''+d['subject'] //+d['subject']+'<br>'
				});	
			});
			
			var w=$(document).width(); //取得顯示的空間寬
			w-=$('.class_times').width(); //減掉時間軸的寬度
			$('.class_day').each(function(v,d){ //將議程空間的寬度以等比例分配
				var count_rooms=$(this).find('.class_room').length;
				var width_init=w/count_rooms -6;
				$(this).find('.class_room').css({'width':width_init+'px'});
			});
			
			$('.class_room').each(function(){ //設定每個議程的顯示位置與時間(也就是從幾點開始到幾點)
				var last_tims=0; //上一場議程的結速時間
				$(this).find('.class_sub').each(function(){
					
					var time_start=$(this).attr('ref_start'); //正在處理的這場議程的開始與結束時間差，已轉換成每天的第幾分鐘
					var time_end=$(this).attr('ref_end');
					
					$(this).css({'height':((time_end-time_start)*2-2)+'px'}); //空間高度就是開始時間減去結束時間
					$(this).css({'margin-top':((time_start-last_tims)*2)+'px'});//與上一個議程用margin-top定義時間差
					//此處的時間基數為2是因為在CSS裡定義每分鐘為2px(.class_times_hr  高119，加上底框1px，計120)
					// 減去2是因為上下框高
					
					
					last_tims=time_end;//記錄這場議程的結束時間，下一場議程以這個時間做時間差來計算顯示的位置
					
				});
			});
			$('body').append('<br>');
		});
	});

});
function padLeft(str,lenght){
    if(str.length >= lenght)
        return str;
    else
        return padLeft("0" +str,lenght);
}