$(document).ready(function() {

	$('#slider').width($('#slider').parent().width());
	$('#slider').slider({
		formatter: function(value) {
			return 'Option ' + value;
		}
	});
	$('.slider').hide();
	$('.season_text').hide();
	// Array showing the relationship between nos of program blocks and the potential options for the structure of the program
	var blocks_table = {
		nos_of_blocks: {
			4: {
				nos_of_options: 1,
				options: [{
					default: 1,
					off_season_phases: 2,
					pre_season_phases: 1,
					in_season_phases: 1,
				}]
			},
			5: {
				nos_of_options: 2,
				options: [{
					default: 1,
					off_season_phases: 2,
					pre_season_phases: 2,
					in_season_phases: 1,
				}, {
					off_season_phases: 2,
					pre_season_phases: 1,
					in_season_phases: 2,
				}]
			},
			6: {
				nos_of_options: 1,
				options: [{
					default: 1,
					off_season_phases: 2,
					pre_season_phases: 2,
					in_season_phases: 2,
				}]
			},
			7: {
				nos_of_options: 4,
				options: [{
					default: 1,
					off_season_phases: 4,
					pre_season_phases: 2,
					in_season_phases: 1,
				}, {
					off_season_phases: 4,
					pre_season_phases: 1,
					in_season_phases: 2,
				}, {
					off_season_phases: 2,
					pre_season_phases: 3,
					in_season_phases: 2,
				}, {
					off_season_phases: 2,
					pre_season_phases: 2,
					in_season_phases: 3,
				}]
			},
			8: {
				nos_of_options: 3,
				options: [{
					off_season_phases: 6,
					pre_season_phases: 1,
					in_season_phases: 1,
				}, {
					default: 1,
					off_season_phases: 4,
					pre_season_phases: 2,
					in_season_phases: 2,
				}, {
					off_season_phases: 2,
					pre_season_phases: 3,
					in_season_phases: 3,
				}]
			},
			9: {
				nos_of_options: 4,
				options: [{
					default: 1,
					off_season_phases: 6,
					pre_season_phases: 2,
					in_season_phases: 1,
				}, {
					off_season_phases: 6,
					pre_season_phases: 1,
					in_season_phases: 2,
				}, {
					off_season_phases: 4,
					pre_season_phases: 3,
					in_season_phases: 2,
				}, {
					off_season_phases: 4,
					pre_season_phases: 2,
					in_season_phases: 3,
				}]
			},
			10: {
				nos_of_options: 2,
				options: [{
					default: 1,
					off_season_phases: 6,
					pre_season_phases: 2,
					in_season_phases: 2,
				}, {
					off_season_phases: 4,
					pre_season_phases: 3,
					in_season_phases: 3,
				}]
			},
			11: {
				nos_of_options: 2,
				options: [{
					default: 1,
					off_season_phases: 6,
					pre_season_phases: 3,
					in_season_phases: 2,
				}, {
					off_season_phases: 6,
					pre_season_phases: 2,
					in_season_phases: 3,
				}]
			},
			12: {
				nos_of_options: 1,
				options: [{
					default: 1,
					off_season_phases: 6,
					pre_season_phases: 3,
					in_season_phases: 3,
				}]
			},
		}
	}

	/**
	 * calculate
	 * This fuction will be triggerd when chaged datepicker, checkbox(new to program)
	 */

	function calculate() {

		// get dateStart and dateSeasonPeak
		var dateStart = $('#dateStart').val();
		var dateSeasonPeak = $('#dateSeasonPeak').val();

		var html = '';
		var date_html = '';

		// Get Remain days
		var remain_days = calcDiffDays(dateStart, dateSeasonPeak) % 7;

		// Calcutate dateStartAdjusted
		var dateStartAdjusted = convertString(dateStart);
		dateStartAdjusted.setDate(dateStartAdjusted.getDate() + remain_days);

		// Get prepPhaseLength
		var prepPhaseLength = 4;
		if ($('#new_to_the_UAP:checked').length == 0) {
			prepPhaseLength = 0;		
		}

		if (remain_days == 0) {
			$('.is-adjusted-start-date span').hide();
		}
		else {
			$('.is-adjusted-start-date span').show();
		}

		// Get programLengthWeeks
		var programLengthWeeks = Math.floor((calcDiffDays(dateStartAdjusted, dateSeasonPeak) + 1) / 7) - prepPhaseLength;

		// program length validation 
		if (programLengthWeeks > 52 || programLengthWeeks < 18 ) {
			$('.show-date, .slider-limit').html("");
			$('.warning').not('.error').addClass('error');
			$('.is-adjusted-start-date span').hide();
			return;
		}
		else {
			$('.warning.error').removeClass('error');
		}

		// Get programBlocks
		var programBlocks = Math.floor(programLengthWeeks/4);

		// Get Taper Weeks
		var tapers = programLengthWeeks % 4;
		if(tapers == 0) {
			$('.is-adjusted-start-date span').hide();
		}
		if (tapers < 2 ) {
			tapers = 4;
			programBlocks --;
		}
		else if (tapers > 3) {
			$('.show-date, .slider-limit').html("");
			alert('This is an erro, we should not find this case!');
			$('.is-adjusted-start-date span').hide();
			return;
		}


		//show schedule seasons
		var selected = blocks_table['nos_of_blocks'][programBlocks];
		var seasons = ['Off-season', 'Pre-season', 'In-season'];
		var l = 0;

		
		// Set slider-limt width for scrollbar

		$('.slider-limit').css('width', $('.show-data').width() * selected['nos_of_options'] + 'px');

		if (selected['nos_of_options'] > 1) {
			$('.slider').show();
			$('.season_text').show();			
			// Change max
			$('#slider').data('slider').max = selected['nos_of_options'] ;
			$('#slider').data('slider').min = 1 ;

			// Apply setValue to redraw slider
			$('#slider').slider('setValue', 1);
		}		
		else {
			$('.season_text').hide();
			$('.slider').hide();
		}

		for (var i = 0;i < selected['nos_of_options']; i ++) {
			
			var j;
			html += '<div class="option pull-left" style="width: ' + $('.show-data').width() + 'px;' + '">';

			if ($('#new_to_the_UAP:checked').length > 0) {
				html += '<div class="preparation"> Preparation </div>';
				date_html += '<div>';
			}
			for (var k = 0;k < 3; k ++) {
				
				var season_phase = seasons[k].toLowerCase();
				season_phase = season_phase.replace("-", "_") + '_phases';
				for (j = 1; j <= selected['options'][i][season_phase]; j ++) {
					html += '<div class="'+ seasons[k].toLowerCase() + '" >' + seasons[k] + ' ' + j + '</div>';
				}	
			}
			html += '<div class="taper"> Taper </div>';	

			html += '</div>';
			date_html += '</div>';
		}

		$('.slider-limit').html(html);

		date_html += '<div>' + dateformat(dateStartAdjusted) + '</div>';

		// show schedule days 
		if ($('#new_to_the_UAP:checked').length > 0) {
			programBlocks += 1;
		}
		for (var l = 0;l < programBlocks;l ++){
			dateStartAdjusted.setDate(dateStartAdjusted.getDate() + 28);	
			date_html += '<div>' + dateformat(dateStartAdjusted) + '</div>';
		}
		$('.show-date').html(date_html);

		$('.slider-limit').css('left', '0px');

	}

	$('#slider').slider().on('slideStop', function(ev){
		var newVal = $('#slider').data('slider').getValue();
		$('.slider-limit').css('left', $('.option').width() * (1 - newVal) + 'px');
	});

	// Trigger caculate when checked, or unchecked
	$('#new_to_the_UAP').change(calculate);
	// Trigger calculate when dateStart changed...
	$('#dateStart').change(calculate);
	// Trigger calculate when dateSeasonPeak changed...
	$('#dateSeasonPeak').change(calculate);
});

// date differneces function
function calcDiffDays(firstDate, secondDate) {

	if (typeof firstDate == "string") {
		firstDate = convertString(firstDate);
	}
	if (typeof secondDate == "string") {
		secondDate = convertString(secondDate);
	}
	
	var oneDay = 24*60*60*1000; // hours*minutes*seconds*milliseconds
	var diffDays = Math.round(Math.abs((firstDate.getTime() - secondDate.getTime())/(oneDay)));

	return diffDays;
}

// convert date string(dd/mm/yy) to date object
function convertString(initialDateString) {
	var dateParts = initialDateString.split("/");
	return new Date(dateParts[2], dateParts[1] - 1, dateParts[0]);
}

// date format (dd mon yyyy) function
function dateformat(d){
	var m_names = new Array("Jan", "Feb", "Mar", 
	"Apr", "May", "Jun", "Jul", "Aug", "Sep", 
	"Oct", "Nov", "Dec");

	var curr_date = d.getDate();
	var curr_month = d.getMonth();
	var curr_year = d.getFullYear();
	return(curr_date + " " + m_names[curr_month] 
	+ " " + curr_year);
}
