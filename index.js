$(function(){
	
	var room_submission = new Object();
	var day_start = 8 * 60;
	var url = 'https://coscup.org/2017-assets/json/submissions.json';
	$.getJSON( url , function( data ) {
		$.each( data , function (v , d){
			
			//$('body').append( v + '=>' + d + '<br>' );
			//$.each( d , function (v_2 , d_2){
			//$('body').append( ' ---------' + v_2 + '=>' + d_2 + '<br>' );
			//});
			//$.each( d['speaker'] , function (v_2 , d_2){
			//	$('body').append( ' ---------' + v_2 + '=>' + d_2 + '<br>' );
			//});
			
			var date_start = new Date(d['start']);
			var date_end = new Date(d['end']);
			var day = date_start.getDate();
			var time_start = date_start.getHours() * 60 + date_start.getMinutes() - day_start;
			var time_end = date_end.getHours() * 60 + date_end.getMinutes() - day_start;
			var time = padLeft(''+date_start.getHours(),2) + ':' + padLeft(''+date_start.getMinutes(),2);
			time +='~'+ padLeft(''+date_end.getHours(),2) + ':' + padLeft(''+date_end.getMinutes(),2);
			//$('body').append( ' ---------day:' + day + '<br>' );
			//$('body').append( ' ---------time_start:' + time_start + '<br>' );
			//$('body').append( ' ---------time_end:' + time_end + '<br>' );
			
			
			if(room_submission[day] == undefined)room_submission[day] = new Object();
			if(room_submission[day][d['room']] == undefined)room_submission[day][d['room']] = new Object();
			
			
			
			room_submission[day][d['room']][v]=new Object({	'community':d['community'],
													'subject':d['subject'],
													'summary':d['summary'],
													'time':time,
													'start':d['community'],
													'end':d['community'],
													'original_speakerpic':d['original_speakerpic'],
													'lang':d['lang'],
													'speaker':d['speaker']['name'],
													'time_start':time_start,
													'time_end':time_end
												});
			
		});
		
		$.each( room_submission , function (v_day , d_room){
			$('body').append('<div class="class_day" ref="'+v_day+'" id="div_day_'+v_day+'"><div class="class_title_day">'+v_day+'</div><div class="class_times" id="div_tims_'+v_day+'"></div></div>');
			
			
			for(var i=8;i<17;i++){
				$('#div_tims_'+v_day+'').append('<div class="class_times_hr">'+i+':00</div>');
			}
			
			
			$.each( d_room , function (v_room , d_sub){
				$('#div_day_'+v_day).append('<div class="class_room" ref="'+v_room+'" id="div_day_'+v_day+'_room_'+v_room+'"><div class="class_title_room">'+v_room+'</div></div>');
				$.each( d_sub , function (v , d){
					$('#div_day_'+v_day+'_room_'+v_room).append('<div class="class_sub" ref="'+v+'" id="div_day_'+v_day+'_room_'+v_room+'_sub_'+v+'" ref_start="'+d['time_start']+'" ref_end="'+d['time_end']+'">'+d['time']+'<br>'+d['subject']+'</div>'); //+v+''+d['subject'] //+d['subject']+'<br>'
				});	
			});
			
			
			var w=$(document).width();
			w-=50;
			$('.class_day').each(function(v,d){
				var count_rooms=$(this).find('.class_room').length;
				var width_init=w/count_rooms -6;
				//alert(width_init);
				$(this).find('.class_room').css({'width':width_init+'px'});
				
			});
			
			$('.class_room').each(function(){
				var last_tims=0;
				$(this).find('.class_sub').each(function(){
					
					var time_start=$(this).attr('ref_start');
					var time_end=$(this).attr('ref_end');
					
					$(this).css({'height':((time_end-time_start)*2-1)+'px'});
					$(this).css({'margin-top':((time_start-last_tims)*2-1)+'px'});
					last_tims=time_end;
					
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