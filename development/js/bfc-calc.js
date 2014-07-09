var exp_table_1 = [];
var exp_table_2 = [];
var exp_table_3 = [];
var exp_table_selected = 1;
var count_remaining_exp = false;
var dream_teams = [];
var dream_teams_idx = 0;
var dream_teams_cost = 0;
var dream_teams_max_unit = 5;
var units = [];

function metal_exp()
{
	var metal_crystal_same	= 227286;
	var metal_crystal		= 151524;
	var metal_god_same 		= 77277;
	var metal_god 			= 51518;
	var metal_king_same 	= 16518;
	var metal_king 			= 11012;
	var metal_slime_same 	= 2259;
	var metal_slime 		= 1506;
	
	var total_exp = 0, total_exp_great = 0, total_exp_super = 0;
	
	// Metal Crystal
	if($("#metal_crystal_same_check").is(":checked"))
		total_exp += (metal_crystal_same * $("#metal_crystal").val());
	else
		total_exp += (metal_crystal * $("#metal_crystal").val());
		
	// Metal God
	if($("#metal_god_same_check").is(":checked"))
		total_exp += (metal_god_same * $("#metal_god").val());
	else
		total_exp += (metal_god * $("#metal_god").val());
	
	// Metal King
	if($("#metal_king_same_check").is(":checked"))
		total_exp += (metal_king_same * $("#metal_king").val());
	else
		total_exp += (metal_king * $("#metal_king").val());
		
	// Metal Slime
	if($("#metal_slime_same_check").is(":checked"))
		total_exp += (metal_slime_same * $("#metal_slime").val());
	else
		total_exp += (metal_slime * $("#metal_slime").val());
	
	total_exp_great = total_exp * 1.5;
	total_exp_super = total_exp * 2.0;
	
	$("#metal_exp").val(total_exp);
	$("#metal_exp_great").val(total_exp_great);
	$("#metal_exp_super").val(total_exp_super);
}

function jewel_exp()
{
	var jewel_god 			= 50000;
	var jewel_king 			= 20000;
	var jewel_ghost 		= 7000;
	
	var total_zel = 0, jewel_god_zel = 0, jewel_king_zel = 0, jewel_ghost_zel = 0;
	
	jewel_god_zel = jewel_god * $("#jewel_god").val();
	jewel_king_zel = jewel_king * $("#jewel_king").val();
	jewel_ghost_zel = jewel_ghost * $("#jewel_ghost").val();
	total_zel = jewel_god_zel + jewel_king_zel + jewel_ghost_zel;
	
	$("#jewel_ghost_output").val(jewel_ghost_zel);
	$("#jewel_king_output").val(jewel_king_zel);
	$("#jewel_god_output").val(jewel_god_zel);
	$("#jewel_zel").val(total_zel);
}

function calculate()
{
	// Which calculation are we doing?
	var calc_type = $("#calc_selection").val();
	
	var exp_table = exp_table_selected;
	var current_lv = $("#current_lv").val();
	var exp_to_next_lv = $("#exp_to_next_lv").val()?$("#exp_to_next_lv").val():0;
	
	var selected_exp_table;
	
	if(exp_table == "" || current_lv == "")
	{
		alert("Please fill up all the forms");
	}	
	else
	{
		// Select Appropriate exp_table
		if (exp_table == 1 || exp_table == '1')
			selected_exp_table = exp_table_1;
		else if(exp_table == 2 || exp_table == '2')
			selected_exp_table = exp_table_2;
		else
			selected_exp_table = exp_table_3;
		
		// Get Current EXP
		var next_lv = parseInt(current_lv)+1;
		var current_exp;

		if(count_remaining_exp)
			current_exp = selected_exp_table[current_lv] + ((selected_exp_table[next_lv] - selected_exp_table[current_lv]) - exp_to_next_lv);
		else
			current_exp = selected_exp_table[current_lv];
		
		if(calc_type == 1)
		{
			// Get required EXP given xx level
			var target_lv = $("#target_lv").val();
			var required_exp = selected_exp_table[target_lv] - current_exp;
			
			// Output
			$("#out_required_exp").val(required_exp);
		}
		else
		{
			// What level will I be when I give xx EXP
			var fuse_exp = $("#fuse_exp").val();
			var final_exp, final_level, final_leftover_exp_to_next_lv, final_bool;
			var final_exp_great, final_level_great, final_leftover_exp_to_next_lv_great, final_bool_great;
			var final_exp_super, final_level_super, final_leftover_exp_to_next_lv_super, final_bool_super;
			
			final_exp = current_exp + parseInt(fuse_exp);
			final_exp_great = final_exp * 1.5;
			final_exp_super = final_exp * 2.0;
			
			final_bool = false;
			final_bool_great = false;
			final_bool_super = false;
			
			for(var i = current_lv; i<selected_exp_table.length; i++)
			{
				// Normal
				if (final_exp == selected_exp_table[i] && final_bool == false)
				{
					final_level = i;
					final_leftover_exp_to_next_lv = 0;
					final_bool = true;
				}
				else if (final_exp < selected_exp_table[i] && final_bool == false)
				{
					final_level = i-1;
					final_leftover_exp_to_next_lv = selected_exp_table[i] - final_exp;
					final_bool = true;
				}
				
				// Great
				if (final_exp_great == selected_exp_table[i] && final_bool_great == false)
				{
					final_level_great = i;
					final_leftover_exp_to_next_lv_great = 0;
					final_bool_great = true;
				}
				else if (final_exp_great < selected_exp_table[i] && final_bool_great == false)
				{
					final_level_great = i-1;
					final_leftover_exp_to_next_lv_great = selected_exp_table[i] - final_exp_great;
					final_bool_great = true;
				}
				
				// Super
				if (final_exp_super == selected_exp_table[i] && final_bool_super == false)
				{
					final_level_super = i;
					final_leftover_exp_to_next_lv_super = 0;
					final_bool_super = true;
				}
				else if (final_exp_super < selected_exp_table[i] && final_bool_super == false)
				{
					final_level_super = i-1;
					final_leftover_exp_to_next_lv_super = selected_exp_table[i] - final_exp_super;
					final_bool_super = true;
				}
			}
			
			// Output
			$("#out_final_level").val(final_level);
			$("#out_final_exp").val(final_leftover_exp_to_next_lv);
			
			$("#out_final_level_great").val(final_level_great);
			$("#out_final_exp_great").val(final_leftover_exp_to_next_lv_great);
			
			$("#out_final_level_super").val(final_level_super);
			$("#out_final_exp_super").val(final_leftover_exp_to_next_lv_super);
		}
	}
}

function change_max_lv()
{
	var max_lv = "";
	switch($("#exp_table").val())
	{
		case "1": max_lv = "100"; break;
		case "2": max_lv = "80"; break;
		case "3": max_lv = "100"; break;
		default: max_lv = "???";
	}
	$("#max_lv").text(max_lv);
	$("#current_lv").attr("max",max_lv);
	$("#target_lv").attr("max",max_lv);
}

function unit_selection($val)
{
	var max_lv = "";
	switch($val)
	{
		case "1": max_lv = "100"; break;
		case "2": max_lv = "80"; break;
		case "3": max_lv = "100"; break;
		default: max_lv = "???";
	}
	$("#max_lv").text(max_lv);
	$("#current_lv").attr("max",max_lv);
	$("#target_lv").attr("max",max_lv);
	
	exp_table_selected = $val;
	
	$(".unit-selection").removeClass("active");
	$("#us_"+$val).addClass("active");
}

function change_selection()
{
	$("#calc_selection_1").hide();
	$("#calc_selection_2").hide();
	switch($("#calc_selection").val())
	{
		case "1": $("#calc_selection_1").show(); break;
		case "2": $("#calc_selection_2").show(); break;
	}
}

function check_checkbox()
{
	if($('#exp_to_next_lv_check').is(':checked')) {
		$("#exp_to_next_lv").removeAttr("disabled");
		count_remaining_exp = true;
	}
	else
	{
		$("#exp_to_next_lv").attr("disabled","disabled");
		count_remaining_exp = false;
	}
}

function init_exp_table()
{
	// EXP Table 1
	exp_table_1[1] = 0;
	exp_table_1[2] = 10;
	exp_table_1[3] = 58;
	exp_table_1[4] = 160;
	exp_table_1[5] = 329;
	exp_table_1[6] = 574;
	exp_table_1[7] = 905;
	exp_table_1[8] = 1330;
	exp_table_1[9] = 1857;
	exp_table_1[10] = 2493;
	exp_table_1[11] = 3244;
	exp_table_1[12] = 4116;
	exp_table_1[13] = 5117;
	exp_table_1[14] = 6250;
	exp_table_1[15] = 7522;
	exp_table_1[16] = 8939;
	exp_table_1[17] = 10504;
	exp_table_1[18] = 12222;
	exp_table_1[19] = 14099;
	exp_table_1[20] = 16140;
	exp_table_1[21] = 18346;
	exp_table_1[22] = 20726;
	exp_table_1[23] = 23282;
	exp_table_1[24] = 26019;
	exp_table_1[25] = 28940;
	exp_table_1[26] = 32049;
	exp_table_1[27] = 35350;
	exp_table_1[28] = 38847;
	exp_table_1[29] = 42544;
	exp_table_1[30] = 46446;
	exp_table_1[31] = 50554;
	exp_table_1[32] = 54873;
	exp_table_1[33] = 59405;
	exp_table_1[34] = 64154;
	exp_table_1[35] = 69126;
	exp_table_1[36] = 74321;
	exp_table_1[37] = 79744;
	exp_table_1[38] = 85397;
	exp_table_1[39] = 91284;
	exp_table_1[40] = 97408;
	exp_table_1[41] = 103772;
	exp_table_1[42] = 110380;
	exp_table_1[43] = 117234;
	exp_table_1[44] = 124337;
	exp_table_1[45] = 131692;
	exp_table_1[46] = 139302;
	exp_table_1[47] = 147170;
	exp_table_1[48] = 155299;
	exp_table_1[49] = 163692;
	exp_table_1[50] = 172352;
	exp_table_1[51] = 181280;
	exp_table_1[52] = 190480;
	exp_table_1[53] = 199555;
	exp_table_1[54] = 209707;
	exp_table_1[55] = 219739;
	exp_table_1[56] = 230054;
	exp_table_1[57] = 240654;
	exp_table_1[58] = 251542;
	exp_table_1[59] = 262720;
	exp_table_1[60] = 274191;
	exp_table_1[61] = 285957;
	exp_table_1[62] = 298021;
	exp_table_1[63] = 310385;
	exp_table_1[64] = 323052;
	exp_table_1[65] = 336024;
	exp_table_1[66] = 349304;
	exp_table_1[67] = 362894;
	exp_table_1[68] = 376796;
	exp_table_1[69] = 391013;
	exp_table_1[70] = 405547;
	exp_table_1[71] = 420401;
	exp_table_1[72] = 435576;
	exp_table_1[73] = 451075;
	exp_table_1[74] = 466901;
	exp_table_1[75] = 483055;
	exp_table_1[76] = 499540;
	exp_table_1[77] = 516358;
	exp_table_1[78] = 533511;
	exp_table_1[79] = 551002;
	exp_table_1[80] = 568832;
	exp_table_1[81] = 587004;
	exp_table_1[82] = 605520;
	exp_table_1[83] = 624382;
	exp_table_1[84] = 643592;
	exp_table_1[85] = 663153;
	exp_table_1[86] = 683066;
	exp_table_1[87] = 703334;
	exp_table_1[88] = 723958;
	exp_table_1[89] = 744941;
	exp_table_1[90] = 766285;
	exp_table_1[91] = 787991;
	exp_table_1[92] = 810062;
	exp_table_1[93] = 832500;
	exp_table_1[94] = 855307;
	exp_table_1[95] = 878485;
	exp_table_1[96] = 902036;
	exp_table_1[97] = 925961;
	exp_table_1[98] = 950263;
	exp_table_1[99] = 974944;
	exp_table_1[100] = 1000006;
	
	// EXP Table 2
	exp_table_2[1] = 0;
	exp_table_2[2] = 15;
	exp_table_2[3] = 87;
	exp_table_2[4] = 240;
	exp_table_2[5] = 492;
	exp_table_2[6] = 860;
	exp_table_2[7] = 1357;
	exp_table_2[8] = 1995;
	exp_table_2[9] = 2785;
	exp_table_2[10] = 3738;
	exp_table_2[11] = 4865;
	exp_table_2[12] = 6174;
	exp_table_2[13] = 7674;
	exp_table_2[14] = 9375;
	exp_table_2[15] = 11283;
	exp_table_2[16] = 13407;
	exp_table_2[17] = 15754;
	exp_table_2[18] = 18332;
	exp_table_2[19] = 21147;
	exp_table_2[20] = 24207;
	exp_table_2[21] = 27519;
	exp_table_2[22] = 31088;
	exp_table_2[23] = 34923;
	exp_table_2[24] = 39027;
	exp_table_2[25] = 43408;
	exp_table_2[26] = 48072;
	exp_table_2[27] = 53024;
	exp_table_2[28] = 58270;
	exp_table_2[29] = 63816;
	exp_table_2[30] = 69667;
	exp_table_2[31] = 75829;
	exp_table_2[32] = 82307;
	exp_table_2[33] = 89106;
	exp_table_2[34] = 96231;
	exp_table_2[35] = 103687;
	exp_table_2[36] = 111480;
	exp_table_2[37] = 119614;
	exp_table_2[38] = 128094;
	exp_table_2[39] = 136925;
	exp_table_2[40] = 146111;
	exp_table_2[41] = 155658;
	exp_table_2[42] = 165569;
	exp_table_2[43] = 175850;
	exp_table_2[44] = 186505;
	exp_table_2[45] = 197538;
	exp_table_2[46] = 208953;
	exp_table_2[47] = 220755;
	exp_table_2[48] = 232949;
	exp_table_2[49] = 245538;
	exp_table_2[50] = 258527;
	exp_table_2[51] = 271919;
	exp_table_2[52] = 285719;
	exp_table_2[53] = 299931;
	exp_table_2[54] = 314559;
	exp_table_2[55] = 329607;
	exp_table_2[56] = 345079;
	exp_table_2[57] = 360979;
	exp_table_2[58] = 377310;
	exp_table_2[59] = 394077;
	exp_table_2[60] = 411286;
	exp_table_2[61] = 428935;
	exp_table_2[62] = 447031;
	exp_table_2[63] = 465577;
	exp_table_2[64] = 484577;
	exp_table_2[65] = 504035;
	exp_table_2[66] = 523955;
	exp_table_2[67] = 544340;
	exp_table_2[68] = 565193;
	exp_table_2[69] = 586518;
	exp_table_2[70] = 608319;
	exp_table_2[71] = 630600;
	exp_table_2[72] = 653362;
	exp_table_2[73] = 676610;
	exp_table_2[74] = 700349;
	exp_table_2[75] = 724580;
	exp_table_2[76] = 749307;
	exp_table_2[77] = 774534;
	exp_table_2[78] = 800263;
	exp_table_2[79] = 826499;
	exp_table_2[80] = 853244;

	// EXP Table 3
	exp_table_3[1] = 0;
	exp_table_3[2] = 21;
	exp_table_3[3] = 117;
	exp_table_3[4] = 321;
	exp_table_3[5] = 658;
	exp_table_3[6] = 1148;
	exp_table_3[7] = 1810;
	exp_table_3[8] = 2660;
	exp_table_3[9] = 3714;
	exp_table_3[10] = 4985;
	exp_table_3[11] = 6488;
	exp_table_3[12] = 8233;
	exp_table_3[13] = 10234;
	exp_table_3[14] = 12501;
	exp_table_3[15] = 15045;
	exp_table_3[16] = 17877;
	exp_table_3[17] = 21006;
	exp_table_3[18] = 24444;
	exp_table_3[19] = 28198;
	exp_table_3[20] = 32279;
	exp_table_3[21] = 36694;
	exp_table_3[22] = 41453;
	exp_table_3[23] = 46565;
	exp_table_3[24] = 52037;
	exp_table_3[25] = 57878;
	exp_table_3[26] = 64096;
	exp_table_3[27] = 70699;
	exp_table_3[28] = 77694;
	exp_table_3[29] = 85088;
	exp_table_3[30] = 92889;
	exp_table_3[31] = 101104;
	exp_table_3[32] = 109741;
	exp_table_3[33] = 118806;
	exp_table_3[34] = 128306;
	exp_table_3[35] = 138248;
	exp_table_3[36] = 148638;
	exp_table_3[37] = 159483;
	exp_table_3[38] = 170790;
	exp_table_3[39] = 182564;
	exp_table_3[40] = 194812;
	exp_table_3[41] = 207541;
	exp_table_3[42] = 220756;
	exp_table_3[43] = 234464;
	exp_table_3[44] = 248670;
	exp_table_3[45] = 263380;
	exp_table_3[46] = 278600;
	exp_table_3[47] = 294336;
	exp_table_3[48] = 310594;
	exp_table_3[49] = 327379;
	exp_table_3[50] = 344697;
	exp_table_3[51] = 362553;
	exp_table_3[52] = 380953;
	exp_table_3[53] = 399903;
	exp_table_3[54] = 419407;
	exp_table_3[55] = 439471;
	exp_table_3[56] = 460100;
	exp_table_3[57] = 481300;
	exp_table_3[58] = 503075;
	exp_table_3[59] = 525431;
	exp_table_3[60] = 548372;
	exp_table_3[61] = 571904;
	exp_table_3[62] = 596032;
	exp_table_3[63] = 620761;
	exp_table_3[64] = 646095;
	exp_table_3[65] = 672040;
	exp_table_3[66] = 698600;
	exp_table_3[67] = 725780;
	exp_table_3[68] = 753585;
	exp_table_3[69] = 782019;
	exp_table_3[70] = 811087;
	exp_table_3[71] = 840794;
	exp_table_3[72] = 871145;
	exp_table_3[73] = 902144;
	exp_table_3[74] = 933795;
	exp_table_3[75] = 966103;
	exp_table_3[76] = 999073;
	exp_table_3[77] = 1032709;
	exp_table_3[78] = 1067016;
	exp_table_3[79] = 1101997;
	exp_table_3[80] = 1137658;
	exp_table_3[81] = 1174002;
	exp_table_3[82] = 1211034;
	exp_table_3[83] = 1248758;
	exp_table_3[84] = 1287179;
	exp_table_3[85] = 1326300;
	exp_table_3[86] = 1366126;
	exp_table_3[87] = 1406661;
	exp_table_3[88] = 1447909;
	exp_table_3[89] = 1489875;
	exp_table_3[90] = 1532562;
	exp_table_3[91] = 1575975;
	exp_table_3[92] = 1620117;
	exp_table_3[93] = 1664993;
	exp_table_3[94] = 1710607;
	exp_table_3[95] = 1756962;
	exp_table_3[96] = 1804063;
	exp_table_3[97] = 1851914;
	exp_table_3[98] = 1900518;
	exp_table_3[99] = 1949880;
	exp_table_3[100] = 2000006;
}

function tu_search() {
	var tu_query = $("#tu-search").val();
	$("#tu-unit-list").children().hide();
	$('#tu-unit-list .tu-title').each(function(){
		if($(this).text().toUpperCase().indexOf(tu_query.toUpperCase()) != -1){
			$(this).parent().show();
		}
	});
}

function tu_add($id) {
	if(dream_teams_idx < dream_teams_max_unit)
	{
		dream_teams[dream_teams_idx] = $id;
		dream_teams_idx++;
		tu_team_refresh();
	}
}

function tu_remove($dream_teams_idx) {
	dream_teams.splice($dream_teams_idx,1);
	dream_teams_idx--;
	tu_team_refresh();
}

function tu_total_cost() {
	var tmp = 0;
	for(var i=0; i<5; i++)
	{
		if(typeof(units[dream_teams[i]]) != "undefined")
			tmp = tmp + parseInt(units[dream_teams[i]].cost);
	}
	
	$("#tu-total-cost").text(tmp);
}

function tu_team_refresh() {
	var tmp = "";
	for(var i=0; i<5; i++)
	{
		if(typeof(dream_teams[i]) != "undefined")
			tmp += get_unit_html(dream_teams[i], "remove", i);
		else
			tmp += get_empty_unit_html(i);
	}
	$("#tu-dream-team").html(tmp);
	
	// Calculate Cost
	tu_total_cost();
}

function tu_units_refresh() {
	var tmp = "";
	for(var i=0; i<units.length; i++)
	{
		tmp += get_unit_html(i, "add");
	}
	$("#tu-unit-list").html(tmp);
}

function tu_init_empty() {
	var tmp = "";
	for(var i=0; i<5; i++)
	{
		tmp += get_empty_unit_html();
	}
	$("#tu-dream-team").html(tmp);
}

function get_unit_html($id, $action, $param) {
	var onclick_action = "";
	
	if($action == "add")
		onclick_action = "tu_add("+$id+")";
	else
		onclick_action = "tu_remove("+$param+")";
	
	if(units[$id].icon == null)
		units[$id].icon = 'http://img3.wikia.nocookie.net/__cb20140402135350/bravefrontierglobal/images/thumb/9/9b/Unit_ills_thum_00000.png/42px-Unit_ills_thum_00000.webp';
	
	return '<div class="tu-unit" onclick="'+onclick_action+'"><img src="'+units[$id].icon+'" /><span class="tu-title">'+units[$id].name+'</span><span class="tu-cost">Cost: <strong>'+units[$id].cost+'</strong></span></div>';
}

function get_empty_unit_html() {
	return '<div class="tu-unit empty"><img src="http://img3.wikia.nocookie.net/__cb20140402135350/bravefrontierglobal/images/thumb/9/9b/Unit_ills_thum_00000.png/42px-Unit_ills_thum_00000.webp" /><span class="tu-title">Empty</span></div>';
}

function init_units()
{
		var json_data = {"d":[{"id":"1","name":"Fencer Vargas","star":"2","element":"Fire","cost":"2","icon":"http:\/\/img3.wikia.nocookie.net\/__cb20131008160641\/bravefrontierglobal\/images\/thumb\/f\/f4\/Unit_ills_thum_10011.png\/42px-Unit_ills_thum_10011.png"},{"id":"2","name":"Burning Vargas","star":"3","element":"Fire","cost":"4","icon":"http:\/\/img1.wikia.nocookie.net\/__cb20131014132929\/bravefrontierglobal\/images\/thumb\/0\/05\/Unit_ills_thum_10012.png\/42px-Unit_ills_thum_10012.png"},{"id":"3","name":"Fire King Vargas","star":"4","element":"Fire","cost":"8","icon":"http:\/\/img2.wikia.nocookie.net\/__cb20131029085340\/bravefrontierglobal\/images\/thumb\/d\/d1\/Unit_ills_thum_10013.png\/42px-Unit_ills_thum_10013.png"},{"id":"4","name":"Fire God Vargas","star":"5","element":"Fire","cost":"10","icon":"http:\/\/img1.wikia.nocookie.net\/__cb20131029085406\/bravefrontierglobal\/images\/thumb\/8\/8b\/Unit_ills_thum_10014.png\/42px-Unit_ills_thum_10014.webp"},{"id":"5","name":"Selena","star":"2","element":"Water","cost":"2","icon":"http:\/\/img3.wikia.nocookie.net\/__cb20131008160834\/bravefrontierglobal\/images\/thumb\/3\/34\/Unit_ills_thum_20011.png\/42px-Unit_ills_thum_20011.webp"},{"id":"6","name":"Ice Selena","star":"3","element":"Water","cost":"4","icon":"http:\/\/img3.wikia.nocookie.net\/__cb20131014133530\/bravefrontierglobal\/images\/thumb\/e\/e0\/Unit_ills_thum_20012.png\/42px-Unit_ills_thum_20012.webp"},{"id":"7","name":"Ice Queen Selena","star":"4","element":"Water","cost":"8","icon":"http:\/\/img2.wikia.nocookie.net\/__cb20131029085731\/bravefrontierglobal\/images\/thumb\/9\/99\/Unit_ills_thum_20013.png\/42px-Unit_ills_thum_20013.webp"},{"id":"8","name":"Ice Goddess Selena","star":"5","element":"Water","cost":"10","icon":"http:\/\/img3.wikia.nocookie.net\/__cb20131029085753\/bravefrontierglobal\/images\/thumb\/3\/3e\/Unit_ills_thum_20014.png\/42px-Unit_ills_thum_20014.webp"},{"id":"9","name":"Pikeman Lance","star":"2","element":"Earth","cost":"2","icon":"http:\/\/img1.wikia.nocookie.net\/__cb20131008160932\/bravefrontierglobal\/images\/thumb\/8\/81\/Unit_ills_thum_30011.png\/42px-Unit_ills_thum_30011.webp"},{"id":"10","name":"Vine Pike Lance","star":"3","element":"Earth","cost":"4","icon":"http:\/\/img1.wikia.nocookie.net\/__cb20131014133834\/bravefrontierglobal\/images\/thumb\/3\/37\/Unit_ills_thum_30012.png\/42px-Unit_ills_thum_30012.webp"},{"id":"11","name":"Earth Pike Lance","star":"4","element":"Earth","cost":"8","icon":"http:\/\/img1.wikia.nocookie.net\/__cb20131029090114\/bravefrontierglobal\/images\/thumb\/f\/f2\/Unit_ills_thum_30013.png\/42px-Unit_ills_thum_30013.webp"},{"id":"12","name":"Nature God Lance","star":"5","element":"Earth","cost":"10","icon":"http:\/\/img3.wikia.nocookie.net\/__cb20131029090137\/bravefrontierglobal\/images\/thumb\/a\/ae\/Unit_ills_thum_30014.png\/42px-Unit_ills_thum_30014.webp"},{"id":"13","name":"Warrior Eze","star":"2","element":"Thunder","cost":"2","icon":"http:\/\/img1.wikia.nocookie.net\/__cb20131008161005\/bravefrontierglobal\/images\/thumb\/9\/90\/Unit_ills_thum_40011.png\/42px-Unit_ills_thum_40011.webp"},{"id":"14","name":"Thunder Eze","star":"3","element":"Thunder","cost":"4","icon":"http:\/\/img1.wikia.nocookie.net\/__cb20131014133953\/bravefrontierglobal\/images\/thumb\/f\/fa\/Unit_ills_thum_40012.png\/42px-Unit_ills_thum_40012.webp"},{"id":"15","name":"Thunder King Eze","star":"4","element":"Thunder","cost":"8","icon":"http:\/\/img3.wikia.nocookie.net\/__cb20131029090542\/bravefrontierglobal\/images\/thumb\/1\/15\/Unit_ills_thum_40013.png\/42px-Unit_ills_thum_40013.webp"},{"id":"16","name":"Thunder God Eze","star":"5","element":"Thunder","cost":"10","icon":"http:\/\/img4.wikia.nocookie.net\/__cb20131029090607\/bravefrontierglobal\/images\/thumb\/6\/65\/Unit_ills_thum_40014.png\/42px-Unit_ills_thum_40014.webp"},{"id":"17","name":"Squire Atro","star":"2","element":"Light","cost":"2","icon":"http:\/\/img3.wikia.nocookie.net\/__cb20131029090901\/bravefrontierglobal\/images\/thumb\/c\/cd\/Unit_ills_thum_50011.png\/42px-Unit_ills_thum_50011.webp"},{"id":"18","name":"Knight Atro","star":"3","element":"Light","cost":"4","icon":"http:\/\/img4.wikia.nocookie.net\/__cb20131029090939\/bravefrontierglobal\/images\/thumb\/a\/a3\/Unit_ills_thum_50012.png\/42px-Unit_ills_thum_50012.webp"},{"id":"19","name":"Holy Knight Atro","star":"4","element":"Light","cost":"8","icon":"http:\/\/img3.wikia.nocookie.net\/__cb20131029091002\/bravefrontierglobal\/images\/thumb\/1\/13\/Unit_ills_thum_50013.png\/42px-Unit_ills_thum_50013.webp"},{"id":"20","name":"God Atro","star":"5","element":"Light","cost":"10","icon":"http:\/\/img4.wikia.nocookie.net\/__cb20131029091031\/bravefrontierglobal\/images\/thumb\/a\/a1\/Unit_ills_thum_50014.png\/42px-Unit_ills_thum_50014.webp"},{"id":"21","name":"Iron Magress","star":"2","element":"Dark","cost":"2","icon":"http:\/\/img3.wikia.nocookie.net\/__cb20131031040434\/bravefrontierglobal\/images\/thumb\/d\/d4\/Unit_ills_thum_60011.png\/42px-Unit_ills_thum_60011.webp"},{"id":"22","name":"Heavy Magress","star":"3","element":"Dark","cost":"4","icon":"http:\/\/img4.wikia.nocookie.net\/__cb20131031040523\/bravefrontierglobal\/images\/thumb\/5\/51\/Unit_ills_thum_60012.png\/42px-Unit_ills_thum_60012.webp"},{"id":"23","name":"Black Magress","star":"4","element":"Dark","cost":"8","icon":"http:\/\/img3.wikia.nocookie.net\/__cb20131031040546\/bravefrontierglobal\/images\/thumb\/c\/ca\/Unit_ills_thum_60013.png\/42px-Unit_ills_thum_60013.webp"},{"id":"24","name":"Death Magress","star":"5","element":"Dark","cost":"10","icon":"http:\/\/img1.wikia.nocookie.net\/__cb20131031040607\/bravefrontierglobal\/images\/thumb\/4\/43\/Unit_ills_thum_60014.png\/42px-Unit_ills_thum_60014.webp"},{"id":"25","name":"Beast Zegar","star":"2","element":"Fire","cost":"3","icon":"http:\/\/img2.wikia.nocookie.net\/__cb20131029074821\/bravefrontierglobal\/images\/thumb\/8\/8d\/Unit_ills_thum_10021.png\/42px-Unit_ills_thum_10021.webp"},{"id":"26","name":"Rage Beast Zegar","star":"3","element":"Fire","cost":"5","icon":"http:\/\/img1.wikia.nocookie.net\/__cb20131029092335\/bravefrontierglobal\/images\/thumb\/7\/75\/Unit_ills_thum_10022.png\/42px-Unit_ills_thum_10022.webp"},{"id":"27","name":"Fire Beast Zegar","star":"4","element":"Fire","cost":"9","icon":"http:\/\/img4.wikia.nocookie.net\/__cb20131029092351\/bravefrontierglobal\/images\/thumb\/d\/d5\/Unit_ills_thum_10023.png\/42px-Unit_ills_thum_10023.webp"},{"id":"28","name":"Zephu","star":"2","element":"Water","cost":"3","icon":"http:\/\/img2.wikia.nocookie.net\/__cb20131029092831\/bravefrontierglobal\/images\/thumb\/c\/c1\/Unit_ills_thum_20021.png\/42px-Unit_ills_thum_20021.webp"},{"id":"29","name":"Knight Zephu","star":"3","element":"Water","cost":"5","icon":"http:\/\/img4.wikia.nocookie.net\/__cb20131029092916\/bravefrontierglobal\/images\/thumb\/c\/c2\/Unit_ills_thum_20022.png\/42px-Unit_ills_thum_20022.webp"},{"id":"30","name":"Dragoon Zephu","star":"4","element":"Water","cost":"9","icon":"http:\/\/img1.wikia.nocookie.net\/__cb20131029092933\/bravefrontierglobal\/images\/thumb\/6\/69\/Unit_ills_thum_20023.png\/42px-Unit_ills_thum_20023.webp"},{"id":"31","name":"Archer Lario","star":"2","element":"Earth","cost":"3","icon":"http:\/\/img3.wikia.nocookie.net\/__cb20131029094306\/bravefrontierglobal\/images\/thumb\/7\/7e\/Unit_ills_thum_30021.png\/42px-Unit_ills_thum_30021.webp"},{"id":"32","name":"Marksman Lario","star":"3","element":"Earth","cost":"5","icon":"http:\/\/img1.wikia.nocookie.net\/__cb20131029094331\/bravefrontierglobal\/images\/thumb\/a\/ad\/Unit_ills_thum_30022.png\/42px-Unit_ills_thum_30022.webp"},{"id":"33","name":"Hawkeye Lario","star":"4","element":"Earth","cost":"9","icon":"http:\/\/img3.wikia.nocookie.net\/__cb20131029094407\/bravefrontierglobal\/images\/thumb\/5\/55\/Unit_ills_thum_30023.png\/42px-Unit_ills_thum_30023.webp"},{"id":"34","name":"Advisor Weiss","star":"2","element":"Thunder","cost":"3","icon":"http:\/\/img4.wikia.nocookie.net\/__cb20131029094820\/bravefrontierglobal\/images\/thumb\/1\/15\/Unit_ills_thum_40021.png\/42px-Unit_ills_thum_40021.webp"},{"id":"35","name":"Strategist Weiss","star":"3","element":"Thunder","cost":"5","icon":"http:\/\/img1.wikia.nocookie.net\/__cb20131029094852\/bravefrontierglobal\/images\/thumb\/e\/e2\/Unit_ills_thum_40022.png\/42px-Unit_ills_thum_40022.webp"},{"id":"36","name":"Commander Weiss","star":"4","element":"Thunder","cost":"9","icon":"http:\/\/img4.wikia.nocookie.net\/__cb20131029094938\/bravefrontierglobal\/images\/thumb\/5\/5d\/Unit_ills_thum_40023.png\/42px-Unit_ills_thum_40023.webp"},{"id":"37","name":"Luna","star":"2","element":"Light","cost":"3","icon":"http:\/\/img3.wikia.nocookie.net\/__cb20131029095309\/bravefrontierglobal\/images\/thumb\/b\/be\/Unit_ills_thum_50021.png\/42px-Unit_ills_thum_50021.webp"},{"id":"38","name":"Sunshine Luna","star":"3","element":"Light","cost":"5","icon":"http:\/\/img3.wikia.nocookie.net\/__cb20131029095340\/bravefrontierglobal\/images\/thumb\/c\/c9\/Unit_ills_thum_50022.png\/42px-Unit_ills_thum_50022.webp"},{"id":"39","name":"Holy Queen Luna","star":"4","element":"Light","cost":"9","icon":"http:\/\/img1.wikia.nocookie.net\/__cb20131029095558\/bravefrontierglobal\/images\/thumb\/e\/ee\/Unit_ills_thum_50023.png\/42px-Unit_ills_thum_50023.webp"},{"id":"40","name":"Mifune","star":"2","element":"Dark","cost":"3","icon":"http:\/\/img1.wikia.nocookie.net\/__cb20131029100048\/bravefrontierglobal\/images\/thumb\/9\/96\/Unit_ills_thum_60021.png\/42px-Unit_ills_thum_60021.webp"},{"id":"41","name":"Samurai Mifune","star":"3","element":"Dark","cost":"5","icon":"http:\/\/img3.wikia.nocookie.net\/__cb20131030140652\/bravefrontierglobal\/images\/thumb\/7\/72\/Unit_ills_thum_60022.png\/42px-Unit_ills_thum_60022.webp"},{"id":"42","name":"God Blade Mifune","star":"4","element":"Dark","cost":"9","icon":"http:\/\/img1.wikia.nocookie.net\/__cb20131030141002\/bravefrontierglobal\/images\/thumb\/a\/a1\/Unit_ills_thum_60023.png\/42px-Unit_ills_thum_60023.webp"},{"id":"43","name":"Burny","star":"1","element":"Fire","cost":"1","icon":"http:\/\/img4.wikia.nocookie.net\/__cb20131030141433\/bravefrontierglobal\/images\/thumb\/d\/d3\/Unit_ills_thum_10030.png\/42px-Unit_ills_thum_10030.webp"},{"id":"44","name":"King Burny","star":"2","element":"Fire","cost":"3","icon":"http:\/\/img4.wikia.nocookie.net\/__cb20131030141637\/bravefrontierglobal\/images\/thumb\/0\/0f\/Unit_ills_thum_10031.png\/42px-Unit_ills_thum_10031.webp"},{"id":"45","name":"Squirty","star":"1","element":"Water","cost":"1","icon":"http:\/\/img1.wikia.nocookie.net\/__cb20131030141911\/bravefrontierglobal\/images\/thumb\/7\/7d\/Unit_ills_thum_20030.png\/42px-Unit_ills_thum_20030.webp"},{"id":"46","name":"King Squirty","star":"2","element":"Water","cost":"3","icon":"http:\/\/img3.wikia.nocookie.net\/__cb20131030142047\/bravefrontierglobal\/images\/thumb\/1\/1f\/Unit_ills_thum_20031.png\/42px-Unit_ills_thum_20031.webp"},{"id":"47","name":"Mossy","star":"1","element":"Earth","cost":"1","icon":"http:\/\/img2.wikia.nocookie.net\/__cb20131030142714\/bravefrontierglobal\/images\/thumb\/9\/9c\/Unit_ills_thum_30030.png\/42px-Unit_ills_thum_30030.webp"},{"id":"48","name":"King Mossy","star":"2","element":"Earth","cost":"3","icon":"http:\/\/img3.wikia.nocookie.net\/__cb20131030142810\/bravefrontierglobal\/images\/thumb\/9\/90\/Unit_ills_thum_30031.png\/42px-Unit_ills_thum_30031.webp"},{"id":"49","name":"Sparky","star":"1","element":"Thunder","cost":"1","icon":"http:\/\/img2.wikia.nocookie.net\/__cb20131030142938\/bravefrontierglobal\/images\/thumb\/c\/cd\/Unit_ills_thum_40030.png\/42px-Unit_ills_thum_40030.webp"},{"id":"50","name":"King Sparky","star":"2","element":"Thunder","cost":"3","icon":"http:\/\/img2.wikia.nocookie.net\/__cb20131030143036\/bravefrontierglobal\/images\/thumb\/5\/54\/Unit_ills_thum_40031.png\/42px-Unit_ills_thum_40031.webp"},{"id":"51","name":"Glowy","star":"1","element":"Light","cost":"1","icon":"http:\/\/img1.wikia.nocookie.net\/__cb20131030143241\/bravefrontierglobal\/images\/thumb\/a\/a2\/Unit_ills_thum_50030.png\/42px-Unit_ills_thum_50030.png"},{"id":"52","name":"King Glowy","star":"2","element":"Light","cost":"3","icon":"http:\/\/img1.wikia.nocookie.net\/__cb20131030143309\/bravefrontierglobal\/images\/thumb\/5\/58\/Unit_ills_thum_50031.png\/42px-Unit_ills_thum_50031.png"},{"id":"53","name":"Gloomy","star":"1","element":"Dark","cost":"1","icon":"http:\/\/img4.wikia.nocookie.net\/__cb20131030143537\/bravefrontierglobal\/images\/thumb\/2\/20\/Unit_ills_thum_60030.png\/42px-Unit_ills_thum_60030.webp"},{"id":"54","name":"King Gloomy","star":"2","element":"Dark","cost":"3","icon":"http:\/\/img4.wikia.nocookie.net\/__cb20131030143558\/bravefrontierglobal\/images\/thumb\/9\/97\/Unit_ills_thum_60031.png\/42px-Unit_ills_thum_60031.webp"},{"id":"55","name":"Witch Liza","star":"1","element":"Fire","cost":"2","icon":"http:\/\/img1.wikia.nocookie.net\/__cb20131031042133\/bravefrontierglobal\/images\/thumb\/3\/30\/Unit_ills_thum_10040.png\/42px-Unit_ills_thum_10040.webp"},{"id":"56","name":"Warlock Liza","star":"2","element":"Fire","cost":"4","icon":"http:\/\/img2.wikia.nocookie.net\/__cb20131031042248\/bravefrontierglobal\/images\/thumb\/5\/52\/Unit_ills_thum_10041.png\/42px-Unit_ills_thum_10041.webp"},{"id":"57","name":"Priest Merith","star":"1","element":"Water","cost":"2","icon":"http:\/\/img4.wikia.nocookie.net\/__cb20131031042758\/bravefrontierglobal\/images\/thumb\/c\/c0\/Unit_ills_thum_20040.png\/42px-Unit_ills_thum_20040.webp"},{"id":"58","name":"Healer Merith","star":"2","element":"Water","cost":"4","icon":"http:\/\/img2.wikia.nocookie.net\/__cb20131031042912\/bravefrontierglobal\/images\/thumb\/3\/3a\/Unit_ills_thum_20041.png\/42px-Unit_ills_thum_20041.webp"},{"id":"59","name":"Geomancer Claris","star":"1","element":"Earth","cost":"2","icon":"http:\/\/img4.wikia.nocookie.net\/__cb20131031043051\/bravefrontierglobal\/images\/thumb\/b\/b1\/Unit_ills_thum_30040.png\/42px-Unit_ills_thum_30040.webp"},{"id":"60","name":"Time Mage Claris","star":"2","element":"Earth","cost":"4","icon":"http:\/\/img2.wikia.nocookie.net\/__cb20131031045802\/bravefrontierglobal\/images\/thumb\/8\/87\/Unit_ills_thum_30041.png\/42px-Unit_ills_thum_30041.webp"},{"id":"61","name":"Dancer May","star":"1","element":"Thunder","cost":"2","icon":"http:\/\/img2.wikia.nocookie.net\/__cb20131031050423\/bravefrontierglobal\/images\/thumb\/b\/b1\/Unit_ills_thum_40040.png\/42px-Unit_ills_thum_40040.webp"},{"id":"62","name":"High Dancer May","star":"2","element":"Thunder","cost":"4","icon":"http:\/\/img4.wikia.nocookie.net\/__cb20131031050630\/bravefrontierglobal\/images\/thumb\/c\/c7\/Unit_ills_thum_40041.png\/42px-Unit_ills_thum_40041.webp"},{"id":"63","name":"Sage Mimir","star":"1","element":"Light","cost":"2","icon":"http:\/\/img4.wikia.nocookie.net\/__cb20131031051125\/bravefrontierglobal\/images\/thumb\/7\/79\/Unit_ills_thum_50040.png\/42px-Unit_ills_thum_50040.webp"},{"id":"64","name":"Light Lord Mimir","star":"2","element":"Light","cost":"4","icon":"http:\/\/img3.wikia.nocookie.net\/__cb20131031051249\/bravefrontierglobal\/images\/thumb\/9\/94\/Unit_ills_thum_50041.png\/42px-Unit_ills_thum_50041.webp"},{"id":"65","name":"Sorceress Lily","star":"1","element":"Dark","cost":"2","icon":"http:\/\/img2.wikia.nocookie.net\/__cb20131031054259\/bravefrontierglobal\/images\/thumb\/0\/08\/Unit_ills_thum_60040.png\/42px-Unit_ills_thum_60040.webp"},{"id":"66","name":"Magician Lily","star":"2","element":"Dark","cost":"4","icon":"http:\/\/img2.wikia.nocookie.net\/__cb20131031054423\/bravefrontierglobal\/images\/thumb\/d\/d6\/Unit_ills_thum_60041.png\/42px-Unit_ills_thum_60041.webp"},{"id":"67","name":"Goblin","star":"1","element":"Fire","cost":"2","icon":"http:\/\/img4.wikia.nocookie.net\/__cb20131031054735\/bravefrontierglobal\/images\/thumb\/9\/98\/Unit_ills_thum_10050.png\/42px-Unit_ills_thum_10050.webp"},{"id":"68","name":"Redcap","star":"2","element":"Fire","cost":"4","icon":"http:\/\/img3.wikia.nocookie.net\/__cb20131031055108\/bravefrontierglobal\/images\/thumb\/4\/47\/Unit_ills_thum_10051.png\/42px-Unit_ills_thum_10051.webp"},{"id":"69","name":"Merman","star":"1","element":"Water","cost":"2","icon":"http:\/\/img4.wikia.nocookie.net\/__cb20131031055256\/bravefrontierglobal\/images\/thumb\/3\/3c\/Unit_ills_thum_20050.png\/42px-Unit_ills_thum_20050.webp"},{"id":"70","name":"Sahuagin","star":"2","element":"Water","cost":"4","icon":"http:\/\/img4.wikia.nocookie.net\/__cb20131031055349\/bravefrontierglobal\/images\/thumb\/1\/1e\/Unit_ills_thum_20051.png\/42px-Unit_ills_thum_20051.webp"},{"id":"71","name":"Mandragora","star":"1","element":"Earth","cost":"2","icon":"http:\/\/img1.wikia.nocookie.net\/__cb20131031055524\/bravefrontierglobal\/images\/thumb\/7\/79\/Unit_ills_thum_30050.png\/42px-Unit_ills_thum_30050.webp"},{"id":"72","name":"Polevik","star":"2","element":"Earth","cost":"4","icon":"http:\/\/img4.wikia.nocookie.net\/__cb20131031055710\/bravefrontierglobal\/images\/thumb\/2\/2e\/Unit_ills_thum_30051.png\/42px-Unit_ills_thum_30051.webp"},{"id":"73","name":"Harpy","star":"1","element":"Thunder","cost":"2","icon":"http:\/\/img1.wikia.nocookie.net\/__cb20131031055937\/bravefrontierglobal\/images\/thumb\/f\/f7\/Unit_ills_thum_40050.png\/42px-Unit_ills_thum_40050.webp"},{"id":"74","name":"Aero","star":"2","element":"Thunder","cost":"4","icon":"http:\/\/img3.wikia.nocookie.net\/__cb20131031060027\/bravefrontierglobal\/images\/thumb\/5\/5b\/Unit_ills_thum_40051.png\/42px-Unit_ills_thum_40051.webp"},{"id":"75","name":"Angel","star":"1","element":"Light","cost":"2","icon":"http:\/\/img1.wikia.nocookie.net\/__cb20131031060232\/bravefrontierglobal\/images\/thumb\/5\/5e\/Unit_ills_thum_50050.png\/42px-Unit_ills_thum_50050.webp"},{"id":"76","name":"Archangel","star":"2","element":"Light","cost":"4","icon":"http:\/\/img3.wikia.nocookie.net\/__cb20131031060325\/bravefrontierglobal\/images\/thumb\/4\/42\/Unit_ills_thum_50051.png\/42px-Unit_ills_thum_50051.webp"},{"id":"77","name":"Skeleton","star":"1","element":"Dark","cost":"2","icon":"http:\/\/img2.wikia.nocookie.net\/__cb20131031061215\/bravefrontierglobal\/images\/thumb\/3\/3d\/Unit_ills_thum_60050.png\/42px-Unit_ills_thum_60050.webp"},{"id":"78","name":"Skeleton King","star":"2","element":"Dark","cost":"4","icon":"http:\/\/img2.wikia.nocookie.net\/__cb20131031061258\/bravefrontierglobal\/images\/thumb\/e\/e4\/Unit_ills_thum_60051.png\/42px-Unit_ills_thum_60051.webp"},{"id":"79","name":"Thief Leon","star":"2","element":"Fire","cost":"3","icon":"http:\/\/img1.wikia.nocookie.net\/__cb20131031062142\/bravefrontierglobal\/images\/thumb\/6\/68\/Unit_ills_thum_10061.png\/42px-Unit_ills_thum_10061.webp"},{"id":"80","name":"Head Thief Leon","star":"3","element":"Fire","cost":"6","icon":"http:\/\/img1.wikia.nocookie.net\/__cb20131031062159\/bravefrontierglobal\/images\/thumb\/e\/ec\/Unit_ills_thum_10062.png\/42px-Unit_ills_thum_10062.webp"},{"id":"81","name":"Pirate Verica","star":"2","element":"Water","cost":"3","icon":"http:\/\/img2.wikia.nocookie.net\/__cb20131031063033\/bravefrontierglobal\/images\/thumb\/e\/e9\/Unit_ills_thum_20061.png\/42px-Unit_ills_thum_20061.webp"},{"id":"82","name":"Plunderer Verica","star":"3","element":"Water","cost":"6","icon":"http:\/\/img4.wikia.nocookie.net\/__cb20131031063051\/bravefrontierglobal\/images\/thumb\/7\/7b\/Unit_ills_thum_20062.png\/42px-Unit_ills_thum_20062.webp"},{"id":"83","name":"Bandit Zaza","star":"2","element":"Earth","cost":"3","icon":"http:\/\/img2.wikia.nocookie.net\/__cb20131031063446\/bravefrontierglobal\/images\/thumb\/7\/7d\/Unit_ills_thum_30061.png\/42px-Unit_ills_thum_30061.webp"},{"id":"84","name":"Head Bandit Zaza","star":"3","element":"Earth","cost":"6","icon":"http:\/\/img4.wikia.nocookie.net\/__cb20131031063504\/bravefrontierglobal\/images\/thumb\/2\/2c\/Unit_ills_thum_30062.png\/42px-Unit_ills_thum_30062.webp"},{"id":"85","name":"Sky Pirate Grafl","star":"2","element":"Thunder","cost":"3","icon":"http:\/\/img3.wikia.nocookie.net\/__cb20131031063752\/bravefrontierglobal\/images\/thumb\/5\/5b\/Unit_ills_thum_40061.png\/42px-Unit_ills_thum_40061.webp"},{"id":"86","name":"Sky Boss Grafl","star":"3","element":"Thunder","cost":"6","icon":"http:\/\/img4.wikia.nocookie.net\/__cb20131031063816\/bravefrontierglobal\/images\/thumb\/9\/90\/Unit_ills_thum_40062.png\/42px-Unit_ills_thum_40062.webp"},{"id":"87","name":"Orthos","star":"2","element":"Fire","cost":"2","icon":"http:\/\/img4.wikia.nocookie.net\/__cb20131031065641\/bravefrontierglobal\/images\/thumb\/0\/08\/Unit_ills_thum_10071.png\/42px-Unit_ills_thum_10071.webp"},{"id":"88","name":"Cerberus","star":"3","element":"Fire","cost":"5","icon":"http:\/\/img4.wikia.nocookie.net\/__cb20131031065712\/bravefrontierglobal\/images\/thumb\/8\/8e\/Unit_ills_thum_10072.png\/42px-Unit_ills_thum_10072.webp"},{"id":"89","name":"Ramia","star":"2","element":"Water","cost":"2","icon":"http:\/\/img4.wikia.nocookie.net\/__cb20131031070041\/bravefrontierglobal\/images\/thumb\/7\/7c\/Unit_ills_thum_20071.png\/42px-Unit_ills_thum_20071.webp"},{"id":"90","name":"Scylla","star":"3","element":"Water","cost":"5","icon":"http:\/\/img4.wikia.nocookie.net\/__cb20131031070107\/bravefrontierglobal\/images\/thumb\/7\/79\/Unit_ills_thum_20072.png\/42px-Unit_ills_thum_20072.webp"},{"id":"91","name":"Fairy","star":"2","element":"Earth","cost":"2","icon":"http:\/\/img4.wikia.nocookie.net\/__cb20131031071430\/bravefrontierglobal\/images\/thumb\/d\/da\/Unit_ills_thum_30071.png\/42px-Unit_ills_thum_30071.webp"},{"id":"92","name":"Titania","star":"3","element":"Earth","cost":"5","icon":"http:\/\/img4.wikia.nocookie.net\/__cb20131031071448\/bravefrontierglobal\/images\/thumb\/f\/ff\/Unit_ills_thum_30072.png\/42px-Unit_ills_thum_30072.webp"},{"id":"93","name":"Minotaur","star":"2","element":"Thunder","cost":"2","icon":"http:\/\/img4.wikia.nocookie.net\/__cb20131031071848\/bravefrontierglobal\/images\/thumb\/4\/46\/Unit_ills_thum_40071.png\/42px-Unit_ills_thum_40071.webp"},{"id":"94","name":"Cyclops","star":"3","element":"Thunder","cost":"5","icon":"http:\/\/img1.wikia.nocookie.net\/__cb20131031071918\/bravefrontierglobal\/images\/thumb\/1\/14\/Unit_ills_thum_40072.png\/42px-Unit_ills_thum_40072.webp"},{"id":"95","name":"Unicorn","star":"2","element":"Light","cost":"3","icon":"http:\/\/img3.wikia.nocookie.net\/__cb20131031072604\/bravefrontierglobal\/images\/thumb\/9\/96\/Unit_ills_thum_50060.png\/42px-Unit_ills_thum_50060.webp"},{"id":"96","name":"Pegasus","star":"3","element":"Light","cost":"6","icon":"http:\/\/img2.wikia.nocookie.net\/__cb20131031072801\/bravefrontierglobal\/images\/thumb\/5\/52\/Unit_ills_thum_50061.png\/42px-Unit_ills_thum_50061.webp"},{"id":"97","name":"Medusa","star":"2","element":"Dark","cost":"3","icon":"http:\/\/img1.wikia.nocookie.net\/__cb20131031073112\/bravefrontierglobal\/images\/thumb\/e\/ed\/Unit_ills_thum_60061.png\/42px-Unit_ills_thum_60061.webp"},{"id":"98","name":"Zahhak","star":"3","element":"Dark","cost":"6","icon":"http:\/\/img1.wikia.nocookie.net\/__cb20131031073131\/bravefrontierglobal\/images\/thumb\/a\/a4\/Unit_ills_thum_60062.png\/42px-Unit_ills_thum_60062.webp"},{"id":"99","name":"Salamander","star":"2","element":"Fire","cost":"2","icon":"http:\/\/img1.wikia.nocookie.net\/__cb20131031073409\/bravefrontierglobal\/images\/thumb\/8\/82\/Unit_ills_thum_10081.png\/42px-Unit_ills_thum_10081.webp"},{"id":"100","name":"Ifrit","star":"3","element":"Fire","cost":"5","icon":"http:\/\/img2.wikia.nocookie.net\/__cb20131031073428\/bravefrontierglobal\/images\/thumb\/5\/54\/Unit_ills_thum_10082.png\/42px-Unit_ills_thum_10082.webp"},{"id":"101","name":"Rantoul","star":"2","element":"Water","cost":"2","icon":"http:\/\/img2.wikia.nocookie.net\/__cb20131031073710\/bravefrontierglobal\/images\/thumb\/1\/1a\/Unit_ills_thum_20081.png\/42px-Unit_ills_thum_20081.png"},{"id":"102","name":"Legtos","star":"3","element":"Water","cost":"4","icon":"http:\/\/img4.wikia.nocookie.net\/__cb20131031073727\/bravefrontierglobal\/images\/thumb\/a\/ab\/Unit_ills_thum_20082.png\/42px-Unit_ills_thum_20082.png"},{"id":"103","name":"Trent","star":"2","element":"Earth","cost":"2","icon":"http:\/\/img2.wikia.nocookie.net\/__cb20131031074050\/bravefrontierglobal\/images\/thumb\/8\/86\/Unit_ills_thum_30081.png\/42px-Unit_ills_thum_30081.webp"},{"id":"104","name":"Ent","star":"3","element":"Earth","cost":"4","icon":"http:\/\/img1.wikia.nocookie.net\/__cb20131031074116\/bravefrontierglobal\/images\/thumb\/d\/dc\/Unit_ills_thum_30082.png\/42px-Unit_ills_thum_30082.webp"},{"id":"105","name":"Sylph","star":"2","element":"Thunder","cost":"2","icon":"http:\/\/img1.wikia.nocookie.net\/__cb20131031074816\/bravefrontierglobal\/images\/thumb\/2\/22\/Unit_ills_thum_40081.png\/42px-Unit_ills_thum_40081.webp"},{"id":"106","name":"Djin","star":"3","element":"Thunder","cost":"4","icon":"http:\/\/img2.wikia.nocookie.net\/__cb20131031074840\/bravefrontierglobal\/images\/thumb\/f\/f3\/Unit_ills_thum_40082.png\/42px-Unit_ills_thum_40082.webp"},{"id":"107","name":"Priestess Maria","star":"2","element":"Light","cost":"2","icon":"http:\/\/img2.wikia.nocookie.net\/__cb20131031075103\/bravefrontierglobal\/images\/thumb\/8\/8c\/Unit_ills_thum_50071.png\/42px-Unit_ills_thum_50071.webp"},{"id":"108","name":"Angel Maria","star":"3","element":"Light","cost":"4","icon":"http:\/\/img4.wikia.nocookie.net\/__cb20131031075124\/bravefrontierglobal\/images\/thumb\/1\/15\/Unit_ills_thum_50072.png\/42px-Unit_ills_thum_50072.webp"},{"id":"109","name":"Lilin","star":"2","element":"Dark","cost":"2","icon":"http:\/\/img2.wikia.nocookie.net\/__cb20131031075243\/bravefrontierglobal\/images\/thumb\/1\/12\/Unit_ills_thum_60071.png\/42px-Unit_ills_thum_60071.webp"},{"id":"110","name":"Succubus","star":"3","element":"Dark","cost":"4","icon":"http:\/\/img2.wikia.nocookie.net\/__cb20131031075305\/bravefrontierglobal\/images\/thumb\/e\/e0\/Unit_ills_thum_60072.png\/42px-Unit_ills_thum_60072.webp"},{"id":"111","name":"Firedrake","star":"3","element":"Fire","cost":"5","icon":"http:\/\/img2.wikia.nocookie.net\/__cb20131031075439\/bravefrontierglobal\/images\/thumb\/c\/c3\/Unit_ills_thum_10092.png\/42px-Unit_ills_thum_10092.webp"},{"id":"112","name":"Dragon Graven","star":"4","element":"Fire","cost":"8","icon":"http:\/\/img1.wikia.nocookie.net\/__cb20131031075506\/bravefrontierglobal\/images\/thumb\/9\/9b\/Unit_ills_thum_10093.png\/42px-Unit_ills_thum_10093.webp"},{"id":"113","name":"Undine","star":"3","element":"Water","cost":"5","icon":"http:\/\/img2.wikia.nocookie.net\/__cb20131031075731\/bravefrontierglobal\/images\/thumb\/e\/e5\/Unit_ills_thum_20092.png\/42px-Unit_ills_thum_20092.webp"},{"id":"114","name":"Siren","star":"4","element":"Water","cost":"8","icon":"http:\/\/img2.wikia.nocookie.net\/__cb20131031075752\/bravefrontierglobal\/images\/thumb\/3\/33\/Unit_ills_thum_20093.png\/42px-Unit_ills_thum_20093.webp"},{"id":"115","name":"Dryad","star":"3","element":"Earth","cost":"5","icon":"http:\/\/img1.wikia.nocookie.net\/__cb20131031075959\/bravefrontierglobal\/images\/thumb\/c\/c9\/Unit_ills_thum_30092.png\/42px-Unit_ills_thum_30092.webp"},{"id":"116","name":"High Elf","star":"4","element":"Earth","cost":"8","icon":"http:\/\/img1.wikia.nocookie.net\/__cb20131031080036\/bravefrontierglobal\/images\/thumb\/f\/f6\/Unit_ills_thum_30093.png\/42px-Unit_ills_thum_30093.webp"},{"id":"117","name":"Thunderbird","star":"3","element":"Thunder","cost":"5","icon":"http:\/\/img1.wikia.nocookie.net\/__cb20131031080439\/bravefrontierglobal\/images\/thumb\/9\/93\/Unit_ills_thum_40092.png\/42px-Unit_ills_thum_40092.webp"},{"id":"118","name":"Great Falcon Ziz","star":"4","element":"Thunder","cost":"8","icon":"http:\/\/img3.wikia.nocookie.net\/__cb20131031080505\/bravefrontierglobal\/images\/thumb\/8\/87\/Unit_ills_thum_40093.png\/42px-Unit_ills_thum_40093.webp"},{"id":"119","name":"Valkyrie","star":"3","element":"Light","cost":"5","icon":"http:\/\/img4.wikia.nocookie.net\/__cb20131031080715\/bravefrontierglobal\/images\/thumb\/8\/8b\/Unit_ills_thum_50082.png\/42px-Unit_ills_thum_50082.webp"},{"id":"120","name":"Sky Hero Athena","star":"4","element":"Light","cost":"8","icon":"http:\/\/img4.wikia.nocookie.net\/__cb20131031080754\/bravefrontierglobal\/images\/thumb\/1\/1d\/Unit_ills_thum_50083.png\/42px-Unit_ills_thum_50083.webp"},{"id":"121","name":"Vampire","star":"3","element":"Dark","cost":"5","icon":"http:\/\/img2.wikia.nocookie.net\/__cb20131031105607\/bravefrontierglobal\/images\/thumb\/3\/35\/Unit_ills_thum_60082.png\/42px-Unit_ills_thum_60082.webp"},{"id":"122","name":"Lich","star":"4","element":"Dark","cost":"8","icon":"http:\/\/img2.wikia.nocookie.net\/__cb20131031105848\/bravefrontierglobal\/images\/thumb\/f\/f2\/Unit_ills_thum_60083.png\/42px-Unit_ills_thum_60083.webp"},{"id":"123","name":"Knight Agni","star":"3","element":"Fire","cost":"5","icon":"http:\/\/img3.wikia.nocookie.net\/__cb20131031113057\/bravefrontierglobal\/images\/thumb\/4\/43\/Unit_ills_thum_10102.png\/42px-Unit_ills_thum_10102.webp"},{"id":"124","name":"Fire Knight Agni","star":"4","element":"Fire","cost":"8","icon":"http:\/\/img1.wikia.nocookie.net\/__cb20131031235220\/bravefrontierglobal\/images\/thumb\/8\/8b\/Unit_ills_thum_10103.png\/42px-Unit_ills_thum_10103.webp"},{"id":"125","name":"Knight Sergio","star":"3","element":"Water","cost":"5","icon":"http:\/\/img4.wikia.nocookie.net\/__cb20131031235358\/bravefrontierglobal\/images\/thumb\/9\/95\/Unit_ills_thum_20102.png\/42px-Unit_ills_thum_20102.webp"},{"id":"126","name":"Ice Ruler Sergio","star":"4","element":"Water","cost":"8","icon":"http:\/\/img3.wikia.nocookie.net\/__cb20131031235459\/bravefrontierglobal\/images\/thumb\/b\/b0\/Unit_ills_thum_20103.png\/42px-Unit_ills_thum_20103.webp"},{"id":"127","name":"Princess Lidith","star":"3","element":"Earth","cost":"5","icon":"http:\/\/img1.wikia.nocookie.net\/__cb20131101001205\/bravefrontierglobal\/images\/thumb\/b\/b3\/Unit_ills_thum_30102.png\/42px-Unit_ills_thum_30102.webp"},{"id":"128","name":"Queen Lidith","star":"4","element":"Earth","cost":"8","icon":"http:\/\/img4.wikia.nocookie.net\/__cb20131101001316\/bravefrontierglobal\/images\/thumb\/0\/0b\/Unit_ills_thum_30103.png\/42px-Unit_ills_thum_30103.webp"},{"id":"129","name":"Sky Knight Falma","star":"3","element":"Thunder","cost":"5","icon":"http:\/\/img3.wikia.nocookie.net\/__cb20131101001427\/bravefrontierglobal\/images\/thumb\/3\/31\/Unit_ills_thum_40102.png\/42px-Unit_ills_thum_40102.webp"},{"id":"130","name":"Sky King Falma","star":"4","element":"Thunder","cost":"8","icon":"http:\/\/img1.wikia.nocookie.net\/__cb20131101001531\/bravefrontierglobal\/images\/thumb\/1\/19\/Unit_ills_thum_40103.png\/42px-Unit_ills_thum_40103.webp"},{"id":"131","name":"Cowboy Heidt","star":"3","element":"Light","cost":"5","icon":"http:\/\/img2.wikia.nocookie.net\/__cb20131101001638\/bravefrontierglobal\/images\/thumb\/3\/32\/Unit_ills_thum_50092.png\/42px-Unit_ills_thum_50092.webp"},{"id":"132","name":"Holy Shot Heidt","star":"4","element":"Light","cost":"8","icon":"http:\/\/img3.wikia.nocookie.net\/__cb20131101001753\/bravefrontierglobal\/images\/thumb\/3\/36\/Unit_ills_thum_50093.png\/42px-Unit_ills_thum_50093.webp"},{"id":"133","name":"Shida","star":"3","element":"Dark","cost":"5","icon":"http:\/\/img1.wikia.nocookie.net\/__cb20131101001903\/bravefrontierglobal\/images\/thumb\/8\/85\/Unit_ills_thum_60092.png\/42px-Unit_ills_thum_60092.webp"},{"id":"134","name":"Garroter Shida","star":"4","element":"Dark","cost":"8","icon":"http:\/\/img2.wikia.nocookie.net\/__cb20131101002006\/bravefrontierglobal\/images\/thumb\/3\/35\/Unit_ills_thum_60093.png\/42px-Unit_ills_thum_60093.webp"},{"id":"135","name":"Phoenix","star":"3","element":"Fire","cost":"5","icon":"http:\/\/img2.wikia.nocookie.net\/__cb20131101014720\/bravefrontierglobal\/images\/thumb\/d\/d5\/Unit_ills_thum_10112.png\/42px-Unit_ills_thum_10112.webp"},{"id":"136","name":"Lava Phoenix","star":"4","element":"Fire","cost":"8","icon":"http:\/\/img2.wikia.nocookie.net\/__cb20131101014844\/bravefrontierglobal\/images\/thumb\/b\/b0\/Unit_ills_thum_10113.png\/42px-Unit_ills_thum_10113.webp"},{"id":"137","name":"God Phoenix","star":"5","element":"Fire","cost":"12","icon":"http:\/\/img2.wikia.nocookie.net\/__cb20131101014946\/bravefrontierglobal\/images\/thumb\/e\/e1\/Unit_ills_thum_10114.png\/42px-Unit_ills_thum_10114.webp"},{"id":"138","name":"Leviathan","star":"3","element":"Water","cost":"5","icon":"http:\/\/img2.wikia.nocookie.net\/__cb20131101015502\/bravefrontierglobal\/images\/thumb\/2\/2a\/Unit_ills_thum_20112.png\/42px-Unit_ills_thum_20112.webp"},{"id":"139","name":"Loch Ness","star":"4","element":"Water","cost":"8","icon":"http:\/\/img1.wikia.nocookie.net\/__cb20131101015922\/bravefrontierglobal\/images\/thumb\/4\/4d\/Unit_ills_thum_20113.png\/42px-Unit_ills_thum_20113.webp"},{"id":"140","name":"Malnaplis","star":"5","element":"Water","cost":"12","icon":"http:\/\/img2.wikia.nocookie.net\/__cb20131101015949\/bravefrontierglobal\/images\/thumb\/0\/00\/Unit_ills_thum_20114.png\/42px-Unit_ills_thum_20114.webp"},{"id":"141","name":"Great Tree Alneu","star":"3","element":"Earth","cost":"5","icon":"http:\/\/img2.wikia.nocookie.net\/__cb20131101023113\/bravefrontierglobal\/images\/thumb\/e\/e2\/Unit_ills_thum_30112.png\/42px-Unit_ills_thum_30112.webp"},{"id":"142","name":"World Tree Altro","star":"4","element":"Earth","cost":"8","icon":"http:\/\/img3.wikia.nocookie.net\/__cb20131101023132\/bravefrontierglobal\/images\/thumb\/5\/5e\/Unit_ills_thum_30113.png\/42px-Unit_ills_thum_30113.webp"},{"id":"143","name":"God Tree Eltri","star":"5","element":"Earth","cost":"12","icon":"http:\/\/img1.wikia.nocookie.net\/__cb20131101023147\/bravefrontierglobal\/images\/thumb\/f\/fa\/Unit_ills_thum_30114.png\/42px-Unit_ills_thum_30114.webp"},{"id":"144","name":"Behemoth","star":"3","element":"Thunder","cost":"5","icon":"http:\/\/img4.wikia.nocookie.net\/__cb20131101023548\/bravefrontierglobal\/images\/thumb\/2\/21\/Unit_ills_thum_40112.png\/42px-Unit_ills_thum_40112.webp"},{"id":"145","name":"King Behemoth","star":"4","element":"Thunder","cost":"8","icon":"http:\/\/img2.wikia.nocookie.net\/__cb20131101023651\/bravefrontierglobal\/images\/thumb\/4\/48\/Unit_ills_thum_40113.png\/42px-Unit_ills_thum_40113.webp"},{"id":"146","name":"Alpha Behemoth","star":"5","element":"Thunder","cost":"12","icon":"http:\/\/img2.wikia.nocookie.net\/__cb20131101023715\/bravefrontierglobal\/images\/thumb\/0\/0a\/Unit_ills_thum_40114.png\/42px-Unit_ills_thum_40114.webp"},{"id":"147","name":"Wyvern","star":"3","element":"Light","cost":"5","icon":"http:\/\/img1.wikia.nocookie.net\/__cb20131101025626\/bravefrontierglobal\/images\/thumb\/8\/83\/Unit_ills_thum_50102.png\/42px-Unit_ills_thum_50102.webp"},{"id":"148","name":"Bahamut","star":"4","element":"Light","cost":"8","icon":"http:\/\/img1.wikia.nocookie.net\/__cb20131101025702\/bravefrontierglobal\/images\/thumb\/4\/49\/Unit_ills_thum_50103.png\/42px-Unit_ills_thum_50103.webp"},{"id":"149","name":"Rameldria","star":"5","element":"Light","cost":"12","icon":"http:\/\/img2.wikia.nocookie.net\/__cb20131101025726\/bravefrontierglobal\/images\/thumb\/5\/56\/Unit_ills_thum_50104.png\/42px-Unit_ills_thum_50104.webp"},{"id":"150","name":"Memetes","star":"3","element":"Dark","cost":"5","icon":"http:\/\/img1.wikia.nocookie.net\/__cb20131101030037\/bravefrontierglobal\/images\/thumb\/a\/a5\/Unit_ills_thum_60102.png\/42px-Unit_ills_thum_60102.webp"},{"id":"151","name":"Hell King Hades","star":"4","element":"Dark","cost":"8","icon":"http:\/\/img1.wikia.nocookie.net\/__cb20131101030058\/bravefrontierglobal\/images\/thumb\/0\/06\/Unit_ills_thum_60103.png\/42px-Unit_ills_thum_60103.png"},{"id":"152","name":"Death God Lodaga","star":"5","element":"Dark","cost":"12","icon":"http:\/\/img1.wikia.nocookie.net\/__cb20131101030120\/bravefrontierglobal\/images\/thumb\/e\/e6\/Unit_ills_thum_60104.png\/42px-Unit_ills_thum_60104.png"},{"id":"153","name":"Lava","star":"3","element":"Fire","cost":"5","icon":"http:\/\/img4.wikia.nocookie.net\/__cb20131101031714\/bravefrontierglobal\/images\/thumb\/4\/43\/Unit_ills_thum_10122.png\/42px-Unit_ills_thum_10122.webp"},{"id":"154","name":"Fire Knight Lava","star":"4","element":"Fire","cost":"8","icon":"http:\/\/img3.wikia.nocookie.net\/__cb20131101031811\/bravefrontierglobal\/images\/thumb\/5\/5c\/Unit_ills_thum_10123.png\/42px-Unit_ills_thum_10123.webp"},{"id":"155","name":"Fire God Lava","star":"5","element":"Fire","cost":"12","icon":"http:\/\/img1.wikia.nocookie.net\/__cb20131101031829\/bravefrontierglobal\/images\/thumb\/c\/c3\/Unit_ills_thum_10124.png\/42px-Unit_ills_thum_10124.webp"},{"id":"156","name":"Captain Mega","star":"3","element":"Water","cost":"5","icon":"http:\/\/img3.wikia.nocookie.net\/__cb20131101035623\/bravefrontierglobal\/images\/thumb\/9\/9a\/Unit_ills_thum_20122.png\/42px-Unit_ills_thum_20122.webp"},{"id":"157","name":"War Captain Mega","star":"4","element":"Water","cost":"8","icon":"http:\/\/img1.wikia.nocookie.net\/__cb20131101035655\/bravefrontierglobal\/images\/thumb\/e\/eb\/Unit_ills_thum_20123.png\/42px-Unit_ills_thum_20123.webp"},{"id":"158","name":"Commander Mega","star":"5","element":"Water","cost":"12","icon":"http:\/\/img2.wikia.nocookie.net\/__cb20131101035723\/bravefrontierglobal\/images\/thumb\/b\/b8\/Unit_ills_thum_20124.png\/42px-Unit_ills_thum_20124.webp"},{"id":"159","name":"Gunner Douglas","star":"3","element":"Earth","cost":"5","icon":"http:\/\/img1.wikia.nocookie.net\/__cb20131101035806\/bravefrontierglobal\/images\/thumb\/5\/5d\/Unit_ills_thum_30122.png\/42px-Unit_ills_thum_30122.webp"},{"id":"160","name":"Gun King Douglas","star":"4","element":"Earth","cost":"8","icon":"http:\/\/img3.wikia.nocookie.net\/__cb20131101035821\/bravefrontierglobal\/images\/thumb\/8\/85\/Unit_ills_thum_30123.png\/42px-Unit_ills_thum_30123.webp"},{"id":"161","name":"Gun God Douglas","star":"5","element":"Earth","cost":"12","icon":"http:\/\/img4.wikia.nocookie.net\/__cb20131101050951\/bravefrontierglobal\/images\/thumb\/7\/7e\/Unit_ills_thum_30124.png\/42px-Unit_ills_thum_30124.webp"},{"id":"162","name":"Emilia","star":"3","element":"Thunder","cost":"5","icon":"http:\/\/img2.wikia.nocookie.net\/__cb20131101080619\/bravefrontierglobal\/images\/thumb\/4\/4d\/Unit_ills_thum_40122.png\/42px-Unit_ills_thum_40122.webp"},{"id":"163","name":"Princess Emilia","star":"4","element":"Thunder","cost":"8","icon":"http:\/\/img2.wikia.nocookie.net\/__cb20131101080656\/bravefrontierglobal\/images\/thumb\/4\/49\/Unit_ills_thum_40123.png\/42px-Unit_ills_thum_40123.webp"},{"id":"164","name":"Goddess Emilia","star":"5","element":"Thunder","cost":"12","icon":"http:\/\/img2.wikia.nocookie.net\/__cb20131101080718\/bravefrontierglobal\/images\/thumb\/c\/ce\/Unit_ills_thum_40124.png\/42px-Unit_ills_thum_40124.webp"},{"id":"165","name":"Knight Will","star":"3","element":"Light","cost":"5","icon":"http:\/\/img3.wikia.nocookie.net\/__cb20131101081138\/bravefrontierglobal\/images\/thumb\/9\/9b\/Unit_ills_thum_50112.png\/42px-Unit_ills_thum_50112.webp"},{"id":"166","name":"Holy Knight Will","star":"4","element":"Light","cost":"8","icon":"http:\/\/img3.wikia.nocookie.net\/__cb20131101081226\/bravefrontierglobal\/images\/thumb\/9\/92\/Unit_ills_thum_50113.png\/42px-Unit_ills_thum_50113.webp"},{"id":"167","name":"God Knight Will","star":"5","element":"Light","cost":"12","icon":"http:\/\/img3.wikia.nocookie.net\/__cb20131101085219\/bravefrontierglobal\/images\/thumb\/7\/7e\/Unit_ills_thum_50114.png\/42px-Unit_ills_thum_50114.webp"},{"id":"168","name":"Alice","star":"3","element":"Dark","cost":"5","icon":"http:\/\/img1.wikia.nocookie.net\/__cb20131101091137\/bravefrontierglobal\/images\/thumb\/5\/5e\/Unit_ills_thum_60112.png\/42px-Unit_ills_thum_60112.webp"},{"id":"169","name":"Scythe Alice","star":"4","element":"Dark","cost":"8","icon":"http:\/\/img2.wikia.nocookie.net\/__cb20131101091154\/bravefrontierglobal\/images\/thumb\/1\/13\/Unit_ills_thum_60113.png\/42px-Unit_ills_thum_60113.webp"},{"id":"170","name":"Scythe God Alice","star":"5","element":"Dark","cost":"12","icon":"http:\/\/img3.wikia.nocookie.net\/__cb20131101091241\/bravefrontierglobal\/images\/thumb\/d\/df\/Unit_ills_thum_60114.png\/42px-Unit_ills_thum_60114.webp"},{"id":"171","name":"Fire Nymph","star":"1","element":"Fire","cost":"2","icon":"http:\/\/img4.wikia.nocookie.net\/__cb20131101091426\/bravefrontierglobal\/images\/thumb\/2\/24\/Unit_ills_thum_10130.png\/42px-Unit_ills_thum_10130.webp"},{"id":"172","name":"Water Nymph","star":"1","element":"Water","cost":"2","icon":"http:\/\/img3.wikia.nocookie.net\/__cb20131101091540\/bravefrontierglobal\/images\/thumb\/8\/8b\/Unit_ills_thum_20130.png\/42px-Unit_ills_thum_20130.webp"},{"id":"173","name":"Earth Nymph","star":"1","element":"Earth","cost":"2","icon":"http:\/\/img3.wikia.nocookie.net\/__cb20131101091638\/bravefrontierglobal\/images\/thumb\/e\/e1\/Unit_ills_thum_30130.png\/42px-Unit_ills_thum_30130.webp"},{"id":"174","name":"Thunder Nymph","star":"1","element":"Thunder","cost":"2","icon":"http:\/\/img1.wikia.nocookie.net\/__cb20131101091916\/bravefrontierglobal\/images\/thumb\/9\/9b\/Unit_ills_thum_40130.png\/42px-Unit_ills_thum_40130.webp"},{"id":"175","name":"Light Nymph","star":"1","element":"Light","cost":"2","icon":"http:\/\/img2.wikia.nocookie.net\/__cb20131101092036\/bravefrontierglobal\/images\/thumb\/f\/fa\/Unit_ills_thum_50120.png\/42px-Unit_ills_thum_50120.webp"},{"id":"176","name":"Dark Nymph","star":"1","element":"Dark","cost":"2","icon":"http:\/\/img2.wikia.nocookie.net\/__cb20131101092151\/bravefrontierglobal\/images\/thumb\/c\/ca\/Unit_ills_thum_60120.png\/42px-Unit_ills_thum_60120.webp"},{"id":"177","name":"Fire Spirit","star":"2","element":"Fire","cost":"5","icon":"http:\/\/img4.wikia.nocookie.net\/__cb20131101092307\/bravefrontierglobal\/images\/thumb\/f\/fc\/Unit_ills_thum_10131.png\/42px-Unit_ills_thum_10131.webp"},{"id":"178","name":"Water Spirit","star":"2","element":"Water","cost":"5","icon":"http:\/\/img2.wikia.nocookie.net\/__cb20131101093927\/bravefrontierglobal\/images\/thumb\/c\/c1\/Unit_ills_thum_20131.png\/42px-Unit_ills_thum_20131.webp"},{"id":"179","name":"Earth Spirit","star":"2","element":"Earth","cost":"5","icon":"http:\/\/img4.wikia.nocookie.net\/__cb20131101094043\/bravefrontierglobal\/images\/thumb\/d\/d6\/Unit_ills_thum_30131.png\/42px-Unit_ills_thum_30131.webp"},{"id":"180","name":"Thunder Spirit","star":"2","element":"Thunder","cost":"5","icon":"http:\/\/img4.wikia.nocookie.net\/__cb20131101094110\/bravefrontierglobal\/images\/thumb\/8\/84\/Unit_ills_thum_40131.png\/42px-Unit_ills_thum_40131.webp"},{"id":"181","name":"Light Spirit","star":"2","element":"Light","cost":"5","icon":"http:\/\/img3.wikia.nocookie.net\/__cb20131101094205\/bravefrontierglobal\/images\/thumb\/7\/79\/Unit_ills_thum_50121.png\/42px-Unit_ills_thum_50121.webp"},{"id":"182","name":"Dark Spirit","star":"2","element":"Dark","cost":"5","icon":"http:\/\/img2.wikia.nocookie.net\/__cb20131101094228\/bravefrontierglobal\/images\/thumb\/7\/75\/Unit_ills_thum_60121.png\/42px-Unit_ills_thum_60121.webp"},{"id":"183","name":"Fire Idol","star":"3","element":"Fire","cost":"8","icon":"http:\/\/img1.wikia.nocookie.net\/__cb20131101094458\/bravefrontierglobal\/images\/thumb\/3\/34\/Unit_ills_thum_10132.png\/42px-Unit_ills_thum_10132.webp"},{"id":"184","name":"Water Idol","star":"3","element":"Water","cost":"8","icon":"http:\/\/img2.wikia.nocookie.net\/__cb20131101094535\/bravefrontierglobal\/images\/thumb\/7\/7d\/Unit_ills_thum_20132.png\/42px-Unit_ills_thum_20132.webp"},{"id":"185","name":"Earth Idol","star":"3","element":"Earth","cost":"8","icon":"http:\/\/img1.wikia.nocookie.net\/__cb20131101094614\/bravefrontierglobal\/images\/thumb\/8\/8b\/Unit_ills_thum_30132.png\/42px-Unit_ills_thum_30132.webp"},{"id":"186","name":"Thunder Idol","star":"3","element":"Thunder","cost":"8","icon":"http:\/\/img4.wikia.nocookie.net\/__cb20131101094649\/bravefrontierglobal\/images\/thumb\/7\/78\/Unit_ills_thum_40132.png\/42px-Unit_ills_thum_40132.webp"},{"id":"187","name":"Light Idol","star":"3","element":"Light","cost":"8","icon":"http:\/\/img2.wikia.nocookie.net\/__cb20131101094730\/bravefrontierglobal\/images\/thumb\/f\/f5\/Unit_ills_thum_50122.png\/42px-Unit_ills_thum_50122.webp"},{"id":"188","name":"Dark Idol","star":"3","element":"Dark","cost":"8","icon":"http:\/\/img3.wikia.nocookie.net\/__cb20131101094802\/bravefrontierglobal\/images\/thumb\/0\/0c\/Unit_ills_thum_60122.png\/42px-Unit_ills_thum_60122.webp"},{"id":"189","name":"Fire Totem","star":"4","element":"Fire","cost":"10","icon":"http:\/\/img4.wikia.nocookie.net\/__cb20131101095103\/bravefrontierglobal\/images\/thumb\/5\/5d\/Unit_ills_thum_10133.png\/42px-Unit_ills_thum_10133.webp"},{"id":"190","name":"Water Totem","star":"4","element":"Water","cost":"10","icon":"http:\/\/img3.wikia.nocookie.net\/__cb20131101095140\/bravefrontierglobal\/images\/thumb\/a\/a1\/Unit_ills_thum_20133.png\/42px-Unit_ills_thum_20133.webp"},{"id":"191","name":"Earth Totem","star":"4","element":"Earth","cost":"10","icon":"http:\/\/img1.wikia.nocookie.net\/__cb20131101095211\/bravefrontierglobal\/images\/thumb\/6\/6c\/Unit_ills_thum_30133.png\/42px-Unit_ills_thum_30133.webp"},{"id":"192","name":"Thunder Totem","star":"4","element":"Thunder","cost":"10","icon":"http:\/\/img1.wikia.nocookie.net\/__cb20131101095251\/bravefrontierglobal\/images\/thumb\/0\/0c\/Unit_ills_thum_40133.png\/42px-Unit_ills_thum_40133.webp"},{"id":"193","name":"Light Totem","star":"4","element":"Light","cost":"10","icon":"http:\/\/img3.wikia.nocookie.net\/__cb20131101095323\/bravefrontierglobal\/images\/thumb\/2\/27\/Unit_ills_thum_50123.png\/42px-Unit_ills_thum_50123.webp"},{"id":"194","name":"Dark Totem","star":"4","element":"Dark","cost":"10","icon":"http:\/\/img4.wikia.nocookie.net\/__cb20131101095351\/bravefrontierglobal\/images\/thumb\/e\/e7\/Unit_ills_thum_60123.png\/42px-Unit_ills_thum_60123.webp"},{"id":"195","name":"Jewel Ghost","star":"2","element":"Light","cost":"3","icon":"http:\/\/img1.wikia.nocookie.net\/__cb20131101095547\/bravefrontierglobal\/images\/thumb\/6\/68\/Unit_ills_thum_50131.png\/42px-Unit_ills_thum_50131.webp"},{"id":"196","name":"Jewel King","star":"3","element":"Light","cost":"6","icon":"http:\/\/img1.wikia.nocookie.net\/__cb20131101124745\/bravefrontierglobal\/images\/thumb\/d\/da\/Unit_ills_thum_50132.png\/42px-Unit_ills_thum_50132.webp"},{"id":"197","name":"Jewel God","star":"4","element":"Light","cost":"9","icon":"http:\/\/img4.wikia.nocookie.net\/__cb20131101124818\/bravefrontierglobal\/images\/thumb\/3\/34\/Unit_ills_thum_50133.png\/42px-Unit_ills_thum_50133.webp"},{"id":"198","name":"Metal Ghost","star":"3","element":"Dark","cost":"3","icon":"http:\/\/img1.wikia.nocookie.net\/__cb20131101124958\/bravefrontierglobal\/images\/thumb\/a\/ae\/Unit_ills_thum_60132.png\/42px-Unit_ills_thum_60132.webp"},{"id":"199","name":"Metal King","star":"4","element":"Dark","cost":"6","icon":"http:\/\/img3.wikia.nocookie.net\/__cb20131101125016\/bravefrontierglobal\/images\/thumb\/9\/95\/Unit_ills_thum_60133.png\/42px-Unit_ills_thum_60133.webp"},{"id":"200","name":"Metal God","star":"5","element":"Dark","cost":"9","icon":"http:\/\/img4.wikia.nocookie.net\/__cb20131101125031\/bravefrontierglobal\/images\/thumb\/0\/0b\/Unit_ills_thum_60134.png\/42px-Unit_ills_thum_60134.webp"},{"id":"201","name":"Mimic","star":"3","element":"Dark","cost":"2","icon":"http:\/\/img3.wikia.nocookie.net\/__cb20131105082139\/bravefrontierglobal\/images\/thumb\/c\/c3\/Unit_ills_thum_60142.png\/42px-Unit_ills_thum_60142.png"},{"id":"202","name":"Bat Mimic","star":"4","element":"Dark","cost":"6","icon":"http:\/\/img1.wikia.nocookie.net\/__cb20131105082412\/bravefrontierglobal\/images\/thumb\/7\/75\/Unit_ills_thum_60143.png\/42px-Unit_ills_thum_60143.png"},{"id":"203","name":"Blacksmith Galant","star":"2","element":"Fire","cost":"4","icon":"http:\/\/img1.wikia.nocookie.net\/__cb20140205033454\/bravefrontierglobal\/images\/thumb\/6\/6d\/Unit_ills_thum_10141.png\/42px-Unit_ills_thum_10141.webp"},{"id":"204","name":"Bruiser Galant","star":"3","element":"Fire","cost":"6","icon":"http:\/\/img1.wikia.nocookie.net\/__cb20140205033517\/bravefrontierglobal\/images\/thumb\/1\/11\/Unit_ills_thum_10142.png\/42px-Unit_ills_thum_10142.webp"},{"id":"205","name":"God Arm Galant","star":"4","element":"Fire","cost":"10","icon":"http:\/\/img1.wikia.nocookie.net\/__cb20140205033544\/bravefrontierglobal\/images\/thumb\/9\/9d\/Unit_ills_thum_10143.png\/42px-Unit_ills_thum_10143.webp"},{"id":"206","name":"Stya","star":"2","element":"Water","cost":"4","icon":"http:\/\/img1.wikia.nocookie.net\/__cb20140115061637\/bravefrontierglobal\/images\/thumb\/1\/16\/Unit_ills_thum_20141.png\/42px-Unit_ills_thum_20141.webp"},{"id":"207","name":"Snow Blade Stya","star":"3","element":"Water","cost":"6","icon":"http:\/\/img2.wikia.nocookie.net\/__cb20140115061702\/bravefrontierglobal\/images\/thumb\/2\/24\/Unit_ills_thum_20142.png\/42px-Unit_ills_thum_20142.webp"},{"id":"208","name":"Frost Queen Stya","star":"4","element":"Water","cost":"10","icon":"http:\/\/img3.wikia.nocookie.net\/__cb20140115061819\/bravefrontierglobal\/images\/thumb\/2\/20\/Unit_ills_thum_20143.png\/42px-Unit_ills_thum_20143.webp"},{"id":"209","name":"Boxer Nemia","star":"2","element":"Earth","cost":"4","icon":"http:\/\/img4.wikia.nocookie.net\/__cb20140211092214\/bravefrontierglobal\/images\/thumb\/b\/b7\/Unit_ills_thum_30141.png\/42px-Unit_ills_thum_30141.webp"},{"id":"210","name":"Brawler Nemia","star":"3","element":"Earth","cost":"6","icon":"http:\/\/img4.wikia.nocookie.net\/__cb20140211092234\/bravefrontierglobal\/images\/thumb\/a\/a2\/Unit_ills_thum_30142.png\/42px-Unit_ills_thum_30142.webp"},{"id":"211","name":"Gaia Fist Nemia","star":"4","element":"Earth","cost":"10","icon":"http:\/\/img2.wikia.nocookie.net\/__cb20140211092305\/bravefrontierglobal\/images\/thumb\/0\/00\/Unit_ills_thum_30143.png\/42px-Unit_ills_thum_30143.webp"},{"id":"212","name":"Zeln","star":"2","element":"Thunder","cost":"4","icon":"http:\/\/img1.wikia.nocookie.net\/__cb20140211092454\/bravefrontierglobal\/images\/thumb\/f\/fa\/Unit_ills_thum_40141.png\/42px-Unit_ills_thum_40141.webp"},{"id":"213","name":"Spark Kick Zeln","star":"3","element":"Thunder","cost":"6","icon":"http:\/\/img2.wikia.nocookie.net\/__cb20140211092511\/bravefrontierglobal\/images\/thumb\/c\/c8\/Unit_ills_thum_40142.png\/42px-Unit_ills_thum_40142.webp"},{"id":"214","name":"Thunder Kick Zeln","star":"4","element":"Thunder","cost":"10","icon":"http:\/\/img2.wikia.nocookie.net\/__cb20140211092526\/bravefrontierglobal\/images\/thumb\/f\/f8\/Unit_ills_thum_40143.png\/42px-Unit_ills_thum_40143.webp"},{"id":"215","name":"Traveler Alma","star":"2","element":"Light","cost":"4","icon":"http:\/\/img2.wikia.nocookie.net\/__cb20140115061903\/bravefrontierglobal\/images\/thumb\/7\/71\/Unit_ills_thum_50141.png\/42px-Unit_ills_thum_50141.webp"},{"id":"216","name":"Adventurer Alma","star":"3","element":"Light","cost":"6","icon":"http:\/\/img2.wikia.nocookie.net\/__cb20140115061931\/bravefrontierglobal\/images\/thumb\/f\/fc\/Unit_ills_thum_50142.png\/42px-Unit_ills_thum_50142.webp"},{"id":"217","name":"Hero Alma","star":"4","element":"Light","cost":"10","icon":"http:\/\/img3.wikia.nocookie.net\/__cb20140115062003\/bravefrontierglobal\/images\/thumb\/0\/08\/Unit_ills_thum_50143.png\/42px-Unit_ills_thum_50143.webp"},{"id":"218","name":"Ninja Oboro","star":"2","element":"Dark","cost":"4","icon":"http:\/\/img1.wikia.nocookie.net\/__cb20140115062033\/bravefrontierglobal\/images\/thumb\/9\/90\/Unit_ills_thum_60151.png\/42px-Unit_ills_thum_60151.webp"},{"id":"219","name":"Assassin Oboro","star":"3","element":"Dark","cost":"6","icon":"http:\/\/img4.wikia.nocookie.net\/__cb20140115062053\/bravefrontierglobal\/images\/thumb\/a\/a4\/Unit_ills_thum_60152.png\/42px-Unit_ills_thum_60152.webp"},{"id":"220","name":"Shadow Oboro","star":"4","element":"Dark","cost":"10","icon":"http:\/\/img4.wikia.nocookie.net\/__cb20140115062123\/bravefrontierglobal\/images\/thumb\/a\/a6\/Unit_ills_thum_60153.png\/42px-Unit_ills_thum_60153.webp"},{"id":"221","name":"Lancia","star":"3","element":"Fire","cost":"5","icon":"http:\/\/img2.wikia.nocookie.net\/__cb20140211091817\/bravefrontierglobal\/images\/thumb\/f\/f4\/Unit_ills_thum_10152.png\/42px-Unit_ills_thum_10152.webp"},{"id":"222","name":"Hot Chef Lancia","star":"4","element":"Fire","cost":"8","icon":"http:\/\/img3.wikia.nocookie.net\/__cb20140211101456\/bravefrontierglobal\/images\/thumb\/0\/07\/Unit_ills_thum_10153.png\/42px-Unit_ills_thum_10153.webp"},{"id":"223","name":"Head Chef Lancia","star":"5","element":"Fire","cost":"12","icon":"http:\/\/img2.wikia.nocookie.net\/__cb20140211091856\/bravefrontierglobal\/images\/thumb\/d\/dd\/Unit_ills_thum_10154.png\/42px-Unit_ills_thum_10154.webp"},{"id":"224","name":"Elimo","star":"3","element":"Water","cost":"5","icon":"http:\/\/img2.wikia.nocookie.net\/__cb20140211101649\/bravefrontierglobal\/images\/thumb\/d\/d1\/Unit_ills_thum_20152.png\/42px-Unit_ills_thum_20152.webp"},{"id":"225","name":"Royal Elimo","star":"4","element":"Water","cost":"8","icon":"http:\/\/img3.wikia.nocookie.net\/__cb20140211091957\/bravefrontierglobal\/images\/thumb\/b\/b4\/Unit_ills_thum_20153.png\/42px-Unit_ills_thum_20153.webp"},{"id":"226","name":"Genius Elimo","star":"5","element":"Water","cost":"12","icon":"http:\/\/img3.wikia.nocookie.net\/__cb20140211092011\/bravefrontierglobal\/images\/thumb\/6\/6c\/Unit_ills_thum_20154.png\/42px-Unit_ills_thum_20154.webp"},{"id":"227","name":"Pixy Leore","star":"3","element":"Earth","cost":"5","icon":"http:\/\/img1.wikia.nocookie.net\/__cb20140211092103\/bravefrontierglobal\/images\/thumb\/e\/ea\/Unit_ills_thum_30152.png\/42px-Unit_ills_thum_30152.webp"},{"id":"228","name":"Pixy Royal Leore","star":"4","element":"Earth","cost":"8","icon":"http:\/\/img3.wikia.nocookie.net\/__cb20140211092117\/bravefrontierglobal\/images\/thumb\/e\/e5\/Unit_ills_thum_30153.png\/42px-Unit_ills_thum_30153.webp"},{"id":"229","name":"Pixy King Leore","star":"5","element":"Earth","cost":"12","icon":"http:\/\/img3.wikia.nocookie.net\/__cb20140211092135\/bravefrontierglobal\/images\/thumb\/5\/53\/Unit_ills_thum_30154.png\/42px-Unit_ills_thum_30154.webp"},{"id":"230","name":"Tinkerer Elulu","star":"3","element":"Thunder","cost":"5","icon":"http:\/\/img1.wikia.nocookie.net\/__cb20140211092544\/bravefrontierglobal\/images\/thumb\/f\/fb\/Unit_ills_thum_40152.png\/42px-Unit_ills_thum_40152.webp"},{"id":"231","name":"Inventor Elulu","star":"4","element":"Thunder","cost":"8","icon":"http:\/\/img2.wikia.nocookie.net\/__cb20140211092609\/bravefrontierglobal\/images\/thumb\/5\/52\/Unit_ills_thum_40153.png\/42px-Unit_ills_thum_40153.webp"},{"id":"232","name":"Bolt Mallet Elulu","star":"5","element":"Thunder","cost":"12","icon":"http:\/\/img4.wikia.nocookie.net\/__cb20140211102027\/bravefrontierglobal\/images\/thumb\/8\/8b\/Unit_ills_thum_40154.png\/42px-Unit_ills_thum_40154.webp"},{"id":"233","name":"Knight Aem","star":"3","element":"Light","cost":"5","icon":"http:\/\/img4.wikia.nocookie.net\/__cb20140211102113\/bravefrontierglobal\/images\/thumb\/1\/18\/Unit_ills_thum_50152.png\/42px-Unit_ills_thum_50152.webp"},{"id":"234","name":"Champion Aem","star":"4","element":"Light","cost":"8","icon":"http:\/\/img4.wikia.nocookie.net\/__cb20140211092731\/bravefrontierglobal\/images\/thumb\/3\/32\/Unit_ills_thum_50153.png\/42px-Unit_ills_thum_50153.webp"},{"id":"235","name":"Holy Master Aem","star":"5","element":"Light","cost":"12","icon":"http:\/\/img1.wikia.nocookie.net\/__cb20140211092750\/bravefrontierglobal\/images\/thumb\/0\/00\/Unit_ills_thum_50154.png\/42px-Unit_ills_thum_50154.webp"},{"id":"236","name":"Lemia","star":"3","element":"Dark","cost":"5","icon":"http:\/\/img2.wikia.nocookie.net\/__cb20140212013837\/bravefrontierglobal\/images\/thumb\/6\/67\/Unit_ills_thum_60162.png\/42px-Unit_ills_thum_60162.webp"},{"id":"237","name":"Necromancer Lemia","star":"4","element":"Dark","cost":"8","icon":"http:\/\/img3.wikia.nocookie.net\/__cb20140211092905\/bravefrontierglobal\/images\/thumb\/0\/09\/Unit_ills_thum_60163.png\/42px-Unit_ills_thum_60163.webp"},{"id":"238","name":"Soul Keeper Lemia","star":"5","element":"Dark","cost":"12","icon":"http:\/\/img2.wikia.nocookie.net\/__cb20140211092932\/bravefrontierglobal\/images\/thumb\/b\/b6\/Unit_ills_thum_60164.png\/42px-Unit_ills_thum_60164.webp"},{"id":"239","name":"Lorand","star":"3","element":"Fire","cost":"7","icon":"http:\/\/img4.wikia.nocookie.net\/__cb20140219044326\/bravefrontierglobal\/images\/thumb\/8\/8c\/Unit_ills_thum_10162.png\/42px-Unit_ills_thum_10162.webp"},{"id":"240","name":"Professor Lorand","star":"4","element":"Fire","cost":"10","icon":"http:\/\/img2.wikia.nocookie.net\/__cb20140219044336\/bravefrontierglobal\/images\/thumb\/c\/ce\/Unit_ills_thum_10163.png\/42px-Unit_ills_thum_10163.webp"},{"id":"241","name":"Master Lorand","star":"5","element":"Fire","cost":"15","icon":"http:\/\/img2.wikia.nocookie.net\/__cb20140219044346\/bravefrontierglobal\/images\/thumb\/f\/f4\/Unit_ills_thum_10164.png\/42px-Unit_ills_thum_10164.webp"},{"id":"242","name":"Dean","star":"3","element":"Water","cost":"7","icon":"http:\/\/img3.wikia.nocookie.net\/__cb20140219044412\/bravefrontierglobal\/images\/thumb\/4\/4a\/Unit_ills_thum_20162.png\/42px-Unit_ills_thum_20162.webp"},{"id":"243","name":"Ice Mage Dean","star":"4","element":"Water","cost":"10","icon":"http:\/\/img1.wikia.nocookie.net\/__cb20140219044428\/bravefrontierglobal\/images\/thumb\/6\/68\/Unit_ills_thum_20163.png\/42px-Unit_ills_thum_20163.webp"},{"id":"244","name":"Ice Wizard Dean","star":"5","element":"Water","cost":"15","icon":"http:\/\/img1.wikia.nocookie.net\/__cb20140219044500\/bravefrontierglobal\/images\/thumb\/2\/22\/Unit_ills_thum_20164.png\/42px-Unit_ills_thum_20164.webp"},{"id":"245","name":"Edea","star":"3","element":"Earth","cost":"7","icon":"http:\/\/img4.wikia.nocookie.net\/__cb20140219044512\/bravefrontierglobal\/images\/thumb\/0\/0b\/Unit_ills_thum_30162.png\/42px-Unit_ills_thum_30162.webp"},{"id":"246","name":"Earth Knight Edea","star":"4","element":"Earth","cost":"10","icon":"http:\/\/img2.wikia.nocookie.net\/__cb20140219044525\/bravefrontierglobal\/images\/thumb\/2\/28\/Unit_ills_thum_30163.png\/42px-Unit_ills_thum_30163.webp"},{"id":"247","name":"Mother Earth Edea","star":"5","element":"Earth","cost":"15","icon":"http:\/\/img3.wikia.nocookie.net\/__cb20140219044535\/bravefrontierglobal\/images\/thumb\/0\/0f\/Unit_ills_thum_30164.png\/42px-Unit_ills_thum_30164.webp"},{"id":"248","name":"Loch","star":"3","element":"Thunder","cost":"7","icon":"http:\/\/img4.wikia.nocookie.net\/__cb20140219044604\/bravefrontierglobal\/images\/thumb\/a\/a4\/Unit_ills_thum_40162.png\/42px-Unit_ills_thum_40162.webp"},{"id":"249","name":"Shock Bow Loch","star":"4","element":"Thunder","cost":"10","icon":"http:\/\/img1.wikia.nocookie.net\/__cb20140219044614\/bravefrontierglobal\/images\/thumb\/e\/e1\/Unit_ills_thum_40163.png\/42px-Unit_ills_thum_40163.webp"},{"id":"250","name":"Zeus Bow Loch","star":"5","element":"Thunder","cost":"15","icon":"http:\/\/img1.wikia.nocookie.net\/__cb20140219044624\/bravefrontierglobal\/images\/thumb\/3\/36\/Unit_ills_thum_40164.png\/42px-Unit_ills_thum_40164.webp"},{"id":"254","name":"Fire Ghost","star":"3","element":"Fire","cost":"3","icon":"http:\/\/img1.wikia.nocookie.net\/__cb20140320100516\/bravefrontierglobal\/images\/thumb\/1\/1e\/Unit_ills_thum_10202.png\/42px-Unit_ills_thum_10202.webp"},{"id":"255","name":"Fire King","star":"4","element":"Fire","cost":"6","icon":"http:\/\/img3.wikia.nocookie.net\/__cb20140320100538\/bravefrontierglobal\/images\/thumb\/e\/e0\/Unit_ills_thum_10203.png\/42px-Unit_ills_thum_10203.webp"},{"id":"256","name":"Fire God","star":"5","element":"Fire","cost":"9","icon":"http:\/\/img2.wikia.nocookie.net\/__cb20140320100554\/bravefrontierglobal\/images\/thumb\/0\/0d\/Unit_ills_thum_10204.png\/42px-Unit_ills_thum_10204.webp"},{"id":"257","name":"Water Ghost","star":"3","element":"Water","cost":"3","icon":"http:\/\/img2.wikia.nocookie.net\/__cb20140320101031\/bravefrontierglobal\/images\/thumb\/f\/f8\/Unit_ills_thum_20202.png\/42px-Unit_ills_thum_20202.webp"},{"id":"258","name":"Water King","star":"4","element":"Water","cost":"6","icon":"http:\/\/img2.wikia.nocookie.net\/__cb20140320101045\/bravefrontierglobal\/images\/thumb\/a\/a0\/Unit_ills_thum_20203.png\/42px-Unit_ills_thum_20203.webp"},{"id":"259","name":"Water God","star":"5","element":"Water","cost":"9","icon":"http:\/\/img4.wikia.nocookie.net\/__cb20140320101057\/bravefrontierglobal\/images\/thumb\/f\/f0\/Unit_ills_thum_20204.png\/42px-Unit_ills_thum_20204.webp"},{"id":"260","name":"Earth Ghost","star":"3","element":"Earth","cost":"3","icon":"http:\/\/img1.wikia.nocookie.net\/__cb20140429161036\/bravefrontierglobal\/images\/thumb\/6\/63\/Unit_ills_thum_30202.png\/42px-Unit_ills_thum_30202.webp"},{"id":"261","name":"Earth King","star":"4","element":"Earth","cost":"6","icon":"http:\/\/img1.wikia.nocookie.net\/__cb20140429161046\/bravefrontierglobal\/images\/thumb\/1\/1d\/Unit_ills_thum_30203.png\/42px-Unit_ills_thum_30203.webp"},{"id":"262","name":"Earth God","star":"5","element":"Earth","cost":"9","icon":"http:\/\/img2.wikia.nocookie.net\/__cb20140429161050\/bravefrontierglobal\/images\/thumb\/8\/8b\/Unit_ills_thum_30204.png\/42px-Unit_ills_thum_30204.webp"},{"id":"263","name":"Thunder Ghost","star":"3","element":"Thunder","cost":"3","icon":"http:\/\/img3.wikia.nocookie.net\/__cb20140429173600\/bravefrontierglobal\/images\/thumb\/3\/37\/Unit_ills_thum_40202.png\/42px-Unit_ills_thum_40202.webp"},{"id":"264","name":"Thunder King","star":"4","element":"Thunder","cost":"6","icon":"http:\/\/img2.wikia.nocookie.net\/__cb20140429173919\/bravefrontierglobal\/images\/thumb\/5\/5f\/Unit_ills_thum_40203.png\/42px-Unit_ills_thum_40203.webp"},{"id":"265","name":"Thunder God","star":"5","element":"Thunder","cost":"9","icon":"http:\/\/img1.wikia.nocookie.net\/__cb20140429173742\/bravefrontierglobal\/images\/thumb\/f\/f6\/Unit_ills_thum_40204.png\/42px-Unit_ills_thum_40204.webp"},{"id":"266","name":"Light Ghost","star":"3","element":"Light","cost":"3","icon":"http:\/\/img4.wikia.nocookie.net\/__cb20140501161803\/bravefrontierglobal\/images\/thumb\/0\/0f\/Unit_ills_thum_50202.png\/42px-Unit_ills_thum_50202.webp"},{"id":"267","name":"Light King","star":"4","element":"Light","cost":"6","icon":"http:\/\/img1.wikia.nocookie.net\/__cb20140429154643\/bravefrontierglobal\/images\/thumb\/4\/4b\/Unit_ills_thum_50203.png\/42px-Unit_ills_thum_50203.webp"},{"id":"268","name":"Light God","star":"5","element":"Light","cost":"9","icon":"http:\/\/img2.wikia.nocookie.net\/__cb20140429154658\/bravefrontierglobal\/images\/thumb\/3\/36\/Unit_ills_thum_50204.png\/42px-Unit_ills_thum_50204.webp"},{"id":"269","name":"Orc","star":"2","element":"Fire","cost":"3","icon":"http:\/\/img4.wikia.nocookie.net\/__cb20140429155559\/bravefrontierglobal\/images\/thumb\/1\/1e\/Unit_ills_thum_10171.png\/42px-Unit_ills_thum_10171.webp"},{"id":"270","name":"Ogre","star":"3","element":"Fire","cost":"5","icon":"http:\/\/img1.wikia.nocookie.net\/__cb20140429155642\/bravefrontierglobal\/images\/thumb\/d\/d6\/Unit_ills_thum_10172.png\/42px-Unit_ills_thum_10172.webp"},{"id":"271","name":"Wendigo","star":"2","element":"Water","cost":"3","icon":"http:\/\/img4.wikia.nocookie.net\/__cb20140429160045\/bravefrontierglobal\/images\/thumb\/9\/97\/Unit_ills_thum_20171.png\/42px-Unit_ills_thum_20171.webp"},{"id":"272","name":"Hrungnir","star":"3","element":"Water","cost":"5","icon":"http:\/\/img3.wikia.nocookie.net\/__cb20140429160058\/bravefrontierglobal\/images\/thumb\/5\/5d\/Unit_ills_thum_20172.png\/42px-Unit_ills_thum_20172.webp"},{"id":"273","name":"Dwarf","star":"2","element":"Earth","cost":"3","icon":"http:\/\/img4.wikia.nocookie.net\/__cb20140429161558\/bravefrontierglobal\/images\/thumb\/b\/b0\/Unit_ills_thum_30171.png\/42px-Unit_ills_thum_30171.webp"},{"id":"274","name":"Dwarf Prince","star":"3","element":"Earth","cost":"5","icon":"http:\/\/img2.wikia.nocookie.net\/__cb20140429161614\/bravefrontierglobal\/images\/thumb\/8\/8e\/Unit_ills_thum_30172.png\/42px-Unit_ills_thum_30172.webp"},{"id":"275","name":"Empusa","star":"2","element":"Thunder","cost":"3","icon":"http:\/\/img2.wikia.nocookie.net\/__cb20140429165604\/bravefrontierglobal\/images\/thumb\/1\/17\/Unit_ills_thum_40171.png\/42px-Unit_ills_thum_40171.webp"},{"id":"276","name":"Gorgon","star":"3","element":"Thunder","cost":"5","icon":"http:\/\/img2.wikia.nocookie.net\/__cb20140429165631\/bravefrontierglobal\/images\/thumb\/b\/bc\/Unit_ills_thum_40172.png\/42px-Unit_ills_thum_40172.webp"},{"id":"277","name":"Al-mi'raj","star":"2","element":"Light","cost":"3","icon":"http:\/\/img2.wikia.nocookie.net\/__cb20140502141014\/bravefrontierglobal\/images\/thumb\/b\/b6\/Unit_ills_thum_50171.png\/42px-Unit_ills_thum_50171.webp"},{"id":"278","name":"Cait Sith","star":"3","element":"Light","cost":"5","icon":"http:\/\/img3.wikia.nocookie.net\/__cb20140429201229\/bravefrontierglobal\/images\/thumb\/a\/a6\/Unit_ills_thum_50172.png\/42px-Unit_ills_thum_50172.webp"},{"id":"279","name":"Imp","star":"2","element":"Dark","cost":"3","icon":"http:\/\/img1.wikia.nocookie.net\/__cb20140429173336\/bravefrontierglobal\/images\/thumb\/1\/15\/Unit_ills_thum_60181.png\/42px-Unit_ills_thum_60181.webp"},{"id":"280","name":"Incubus","star":"3","element":"Dark","cost":"5","icon":"http:\/\/img1.wikia.nocookie.net\/__cb20140429173342\/bravefrontierglobal\/images\/thumb\/3\/33\/Unit_ills_thum_60182.png\/42px-Unit_ills_thum_60182.webp"},{"id":"281","name":"Pyromancer Liza","star":"3","element":"Fire","cost":"6","icon":"http:\/\/img3.wikia.nocookie.net\/__cb20140320100238\/bravefrontierglobal\/images\/thumb\/9\/94\/Unit_ills_thum_10042.png\/42px-Unit_ills_thum_10042.webp"},{"id":"282","name":"Bishop Merith","star":"3","element":"Water","cost":"6","icon":"http:\/\/img2.wikia.nocookie.net\/__cb20140320100915\/bravefrontierglobal\/images\/thumb\/4\/4d\/Unit_ills_thum_20042.png\/42px-Unit_ills_thum_20042.webp"},{"id":"283","name":"Time Lord Claris","star":"3","element":"Earth","cost":"6","icon":"http:\/\/img2.wikia.nocookie.net\/__cb20140309062620\/bravefrontierglobal\/images\/thumb\/9\/9f\/Unit_ills_thum_30042.png\/42px-Unit_ills_thum_30042.webp"},{"id":"284","name":"Royal Dancer May","star":"3","element":"Thunder","cost":"6","icon":"http:\/\/img3.wikia.nocookie.net\/__cb20140309063631\/bravefrontierglobal\/images\/thumb\/7\/78\/Unit_ills_thum_40042.png\/42px-Unit_ills_thum_40042.webp"},{"id":"285","name":"Great Sage Mimir","star":"3","element":"Light","cost":"6","icon":"http:\/\/img4.wikia.nocookie.net\/__cb20140309135352\/bravefrontierglobal\/images\/thumb\/1\/1f\/Unit_ills_thum_50042.png\/42px-Unit_ills_thum_50042.webp"},{"id":"286","name":"Dark Arts Lily","star":"3","element":"Dark","cost":"6","icon":"http:\/\/img2.wikia.nocookie.net\/__cb20140309101245\/bravefrontierglobal\/images\/thumb\/4\/40\/Unit_ills_thum_60042.png\/42px-Unit_ills_thum_60042.webp"},{"id":"287","name":"Drake Chief Aisha","star":"3","element":"Fire","cost":"7","icon":"http:\/\/img4.wikia.nocookie.net\/__cb20140320100721\/bravefrontierglobal\/images\/thumb\/7\/7d\/Unit_ills_thum_10212.png\/42px-Unit_ills_thum_10212.webp"},{"id":"288","name":"Drake Lord Aisha","star":"4","element":"Fire","cost":"10","icon":"http:\/\/img2.wikia.nocookie.net\/__cb20140429162305\/bravefrontierglobal\/images\/thumb\/7\/71\/Unit_ills_thum_10213.png\/42px-Unit_ills_thum_10213.webp"},{"id":"289","name":"Drake Queen Aisha","star":"5","element":"Fire","cost":"15","icon":"http:\/\/img2.wikia.nocookie.net\/__cb20140320100804\/bravefrontierglobal\/images\/thumb\/d\/d0\/Unit_ills_thum_10214.png\/42px-Unit_ills_thum_10214.webp"},{"id":"290","name":"Twin Gem Rickel","star":"3","element":"Water","cost":"7","icon":"http:\/\/img2.wikia.nocookie.net\/__cb20140320101151\/bravefrontierglobal\/images\/thumb\/4\/4c\/Unit_ills_thum_20212.png\/42px-Unit_ills_thum_20212.webp"},{"id":"291","name":"Twin Flash Rickel","star":"4","element":"Water","cost":"10","icon":"http:\/\/img1.wikia.nocookie.net\/__cb20140320101307\/bravefrontierglobal\/images\/thumb\/4\/48\/Unit_ills_thum_20213.png\/42px-Unit_ills_thum_20213.webp"},{"id":"292","name":"Twin Shot Rickel","star":"5","element":"Water","cost":"15","icon":"http:\/\/img4.wikia.nocookie.net\/__cb20140314193648\/bravefrontierglobal\/images\/thumb\/9\/9f\/Unit_ills_thum_20214.png\/42px-Unit_ills_thum_20214.webp"},{"id":"293","name":"Twins Il & Mina","star":"3","element":"Earth","cost":"7","icon":"http:\/\/img3.wikia.nocookie.net\/__cb20140429163644\/bravefrontierglobal\/images\/thumb\/2\/23\/Unit_ills_thum_30212.png\/42px-Unit_ills_thum_30212.webp"},{"id":"294","name":"Earthly Il & Mina","star":"4","element":"Earth","cost":"10","icon":"http:\/\/img2.wikia.nocookie.net\/__cb20140429163319\/bravefrontierglobal\/images\/thumb\/6\/62\/Unit_ills_thum_30213.png\/42px-Unit_ills_thum_30213.webp"},{"id":"295","name":"Gemini Il & Mina","star":"5","element":"Earth","cost":"15","icon":"http:\/\/img1.wikia.nocookie.net\/__cb20140429163346\/bravefrontierglobal\/images\/thumb\/c\/cf\/Unit_ills_thum_30214.png\/42px-Unit_ills_thum_30214.webp"},{"id":"296","name":"Bolt Pike Amy","star":"3","element":"Thunder","cost":"7","icon":"http:\/\/img2.wikia.nocookie.net\/__cb20140429165121\/bravefrontierglobal\/images\/thumb\/b\/b3\/Unit_ills_thum_40212.png\/42px-Unit_ills_thum_40212.webp"},{"id":"297","name":"Bolt Knight Amy","star":"4","element":"Thunder","cost":"10","icon":"http:\/\/img4.wikia.nocookie.net\/__cb20140429165104\/bravefrontierglobal\/images\/thumb\/e\/ee\/Unit_ills_thum_40213.png\/42px-Unit_ills_thum_40213.webp"},{"id":"298","name":"Bolt Goddess Amy","star":"5","element":"Thunder","cost":"15","icon":"http:\/\/img1.wikia.nocookie.net\/__cb20140429165129\/bravefrontierglobal\/images\/thumb\/0\/0f\/Unit_ills_thum_40214.png\/42px-Unit_ills_thum_40214.webp"},{"id":"299","name":"Eight Blade Sefia","star":"3","element":"Light","cost":"7","icon":"http:\/\/img4.wikia.nocookie.net\/__cb20140429174820\/bravefrontierglobal\/images\/thumb\/9\/9a\/Unit_ills_thum_50162.png\/42px-Unit_ills_thum_50162.webp"},{"id":"300","name":"Blade Storm Sefia","star":"4","element":"Light","cost":"10","icon":"http:\/\/img3.wikia.nocookie.net\/__cb20140429162657\/bravefrontierglobal\/images\/thumb\/8\/8a\/Unit_ills_thum_50163.png\/42px-Unit_ills_thum_50163.webp"},{"id":"301","name":"Blade Queen Sefia","star":"5","element":"Light","cost":"15","icon":"http:\/\/img3.wikia.nocookie.net\/__cb20140429162643\/bravefrontierglobal\/images\/thumb\/9\/98\/Unit_ills_thum_50164.png\/42px-Unit_ills_thum_50164.png"},{"id":"302","name":"Kikuri","star":"3","element":"Dark","cost":"7","icon":"http:\/\/img3.wikia.nocookie.net\/__cb20140429171010\/bravefrontierglobal\/images\/thumb\/e\/e3\/Unit_ills_thum_60172.png\/42px-Unit_ills_thum_60172.png"},{"id":"303","name":"Goth Kikuri","star":"4","element":"Dark","cost":"10","icon":"http:\/\/img4.wikia.nocookie.net\/__cb20140429171038\/bravefrontierglobal\/images\/thumb\/6\/60\/Unit_ills_thum_60173.png\/42px-Unit_ills_thum_60173.webp"},{"id":"304","name":"Goth Idol Kikuri","star":"5","element":"Dark","cost":"15","icon":"http:\/\/img1.wikia.nocookie.net\/__cb20140429170915\/bravefrontierglobal\/images\/thumb\/1\/15\/Unit_ills_thum_60174.png\/42px-Unit_ills_thum_60174.webp"},{"id":"305","name":"Dragon Mimic","star":"5","element":"Dark","cost":"10","icon":"http:\/\/img3.wikia.nocookie.net\/__cb20140318144130\/bravefrontierglobal\/images\/thumb\/d\/db\/Unit_ills_thum_60144.png\/42px-Unit_ills_thum_60144.webp"},{"id":"306","name":"Fire Pot","star":"3","element":"Fire","cost":"1","icon":"http:\/\/img2.wikia.nocookie.net\/__cb20140430151610\/bravefrontierglobal\/images\/thumb\/d\/df\/Unit_ills_thum_10191.png\/42px-Unit_ills_thum_10191.webp"},{"id":"307","name":"Water Pot","star":"3","element":"Water","cost":"1","icon":"http:\/\/img3.wikia.nocookie.net\/__cb20140320101013\/bravefrontierglobal\/images\/thumb\/6\/60\/Unit_ills_thum_20191.png\/42px-Unit_ills_thum_20191.webp"},{"id":"308","name":"Earth Pot","star":"3","element":"Earth","cost":"1","icon":"http:\/\/img4.wikia.nocookie.net\/__cb20140429170515\/bravefrontierglobal\/images\/thumb\/6\/61\/Unit_ills_thum_30191.png\/42px-Unit_ills_thum_30191.webp"},{"id":"309","name":"Thunder Pot","star":"3","element":"Thunder","cost":"1","icon":"http:\/\/img2.wikia.nocookie.net\/__cb20140429170456\/bravefrontierglobal\/images\/thumb\/6\/6b\/Unit_ills_thum_40191.png\/42px-Unit_ills_thum_40191.webp"},{"id":"310","name":"Light Pot","star":"3","element":"Light","cost":"1","icon":"http:\/\/img4.wikia.nocookie.net\/__cb20140429170551\/bravefrontierglobal\/images\/thumb\/f\/fa\/Unit_ills_thum_50191.png\/42px-Unit_ills_thum_50191.webp"},{"id":"311","name":"Dark Pot","star":"3","element":"Dark","cost":"1","icon":"http:\/\/img3.wikia.nocookie.net\/__cb20140429170605\/bravefrontierglobal\/images\/thumb\/8\/81\/Unit_ills_thum_60201.png\/42px-Unit_ills_thum_60201.webp"},{"id":"312","name":"Great Thief Leon","star":"4","element":"Fire","cost":"9","icon":"http:\/\/img3.wikia.nocookie.net\/__cb20140320100301\/bravefrontierglobal\/images\/thumb\/a\/a8\/Unit_ills_thum_10063.png\/42px-Unit_ills_thum_10063.webp"},{"id":"313","name":"Sea Prince Verica","star":"4","element":"Water","cost":"9","icon":"http:\/\/img3.wikia.nocookie.net\/__cb20140309144236\/bravefrontierglobal\/images\/thumb\/8\/8f\/Unit_ills_thum_20063.png\/42px-Unit_ills_thum_20063.webp"},{"id":"314","name":"Wild Bandit Zaza","star":"4","element":"Earth","cost":"9","icon":"http:\/\/img3.wikia.nocookie.net\/__cb20140309144410\/bravefrontierglobal\/images\/thumb\/e\/e2\/Unit_ills_thum_30063.png\/42px-Unit_ills_thum_30063.webp"},{"id":"315","name":"Sky Emperor Grafl","star":"4","element":"Thunder","cost":"9","icon":"http:\/\/img3.wikia.nocookie.net\/__cb20140310134654\/bravefrontierglobal\/images\/thumb\/1\/12\/Unit_ills_thum_40063.png\/42px-Unit_ills_thum_40063.webp"},{"id":"316","name":"Disciple Zebra","star":"4","element":"Dark","cost":"10","icon":"http:\/\/img4.wikia.nocookie.net\/__cb20140429171502\/bravefrontierglobal\/images\/thumb\/d\/d0\/Unit_ills_thum_60233.png\/42px-Unit_ills_thum_60233.webp"},{"id":"317","name":"Mad God Zebra","star":"5","element":"Dark","cost":"15","icon":"http:\/\/img4.wikia.nocookie.net\/__cb20140429171451\/bravefrontierglobal\/images\/thumb\/9\/9a\/Unit_ills_thum_60234.png\/42px-Unit_ills_thum_60234.webp"},{"id":"318","name":"Swordswoman Seria","star":"4","element":"Fire","cost":"10","icon":"http:\/\/img4.wikia.nocookie.net\/__cb20140320100837\/bravefrontierglobal\/images\/thumb\/2\/2e\/Unit_ills_thum_10233.png\/42px-Unit_ills_thum_10233.webp"},{"id":"319","name":"Blade God Seria","star":"5","element":"Fire","cost":"15","icon":"http:\/\/img3.wikia.nocookie.net\/__cb20140320100852\/bravefrontierglobal\/images\/thumb\/7\/7c\/Unit_ills_thum_10234.png\/42px-Unit_ills_thum_10234.webp"},{"id":"320","name":"Beast King Zegar","star":"5","element":"Fire","cost":"14","icon":"http:\/\/img1.wikia.nocookie.net\/__cb20140411005225\/bravefrontierglobal\/images\/thumb\/6\/63\/Unit_ills_thum_10024.png\/42px-Unit_ills_thum_10024.webp"},{"id":"321","name":"Dragon Hero Zephu","star":"5","element":"Water","cost":"14","icon":"http:\/\/img4.wikia.nocookie.net\/__cb20140411005257\/bravefrontierglobal\/images\/thumb\/f\/fa\/Unit_ills_thum_20024.png\/42px-Unit_ills_thum_20024.webp"},{"id":"322","name":"Bow God Lario","star":"5","element":"Earth","cost":"14","icon":"http:\/\/img4.wikia.nocookie.net\/__cb20140411005455\/bravefrontierglobal\/images\/thumb\/9\/9c\/Unit_ills_thum_30024.png\/42px-Unit_ills_thum_30024.webp"},{"id":"323","name":"General Weiss","star":"5","element":"Thunder","cost":"14","icon":"http:\/\/img1.wikia.nocookie.net\/__cb20140411005528\/bravefrontierglobal\/images\/thumb\/1\/16\/Unit_ills_thum_40024.png\/42px-Unit_ills_thum_40024.webp"},{"id":"324","name":"Holy Empress Luna","star":"5","element":"Light","cost":"14","icon":"http:\/\/img2.wikia.nocookie.net\/__cb20140411005608\/bravefrontierglobal\/images\/thumb\/6\/66\/Unit_ills_thum_50024.png\/42px-Unit_ills_thum_50024.webp"},{"id":"325","name":"Ryujin Mifune","star":"5","element":"Dark","cost":"14","icon":"http:\/\/img2.wikia.nocookie.net\/__cb20140411005640\/bravefrontierglobal\/images\/thumb\/b\/b2\/Unit_ills_thum_60024.png\/42px-Unit_ills_thum_60024.webp"},{"id":"326","name":"Magma Knight Agni","star":"5","element":"Fire","cost":"13","icon":"http:\/\/img3.wikia.nocookie.net\/__cb20140411005920\/bravefrontierglobal\/images\/thumb\/c\/c9\/Unit_ills_thum_10104.png\/42px-Unit_ills_thum_10104.webp"},{"id":"327","name":"Ice Knight Sergio","star":"5","element":"Water","cost":"13","icon":"http:\/\/img3.wikia.nocookie.net\/__cb20140411010030\/bravefrontierglobal\/images\/thumb\/9\/95\/Unit_ills_thum_20104.png\/42px-Unit_ills_thum_20104.webp"},{"id":"328","name":"Empress Lidith","star":"5","element":"Earth","cost":"13","icon":"http:\/\/img1.wikia.nocookie.net\/__cb20140411010111\/bravefrontierglobal\/images\/thumb\/a\/a1\/Unit_ills_thum_30104.png\/42px-Unit_ills_thum_30104.webp"},{"id":"329","name":"Sky Legend Falma","star":"5","element":"Thunder","cost":"13","icon":"http:\/\/img2.wikia.nocookie.net\/__cb20140411010245\/bravefrontierglobal\/images\/thumb\/3\/3c\/Unit_ills_thum_50094.png\/42px-Unit_ills_thum_50094.webp"},{"id":"330","name":"Pistol God Heidt","star":"5","element":"Light","cost":"13","icon":"http:\/\/img2.wikia.nocookie.net\/__cb20140411010245\/bravefrontierglobal\/images\/thumb\/3\/3c\/Unit_ills_thum_50094.png\/42px-Unit_ills_thum_50094.webp"},{"id":"331","name":"Executioner Shida","star":"5","element":"Dark","cost":"13","icon":"http:\/\/img2.wikia.nocookie.net\/__cb20140411010245\/bravefrontierglobal\/images\/thumb\/3\/3c\/Unit_ills_thum_50094.png\/42px-Unit_ills_thum_50094.webp"},{"id":"332","name":"Miracle Totem","star":"5","element":"Light","cost":"1","icon":"http:\/\/img2.wikia.nocookie.net\/__cb20140429172548\/bravefrontierglobal\/images\/thumb\/b\/b0\/Unit_ills_thum_50354.png\/42px-Unit_ills_thum_50354.webp"},{"id":"333","name":"Burst Frog","star":"3","element":"Fire","cost":"1","icon":"http:\/\/img2.wikia.nocookie.net\/__cb20140413215412\/bravefrontierglobal\/images\/thumb\/a\/a9\/Unit_ills_thum_10312.png\/42px-Unit_ills_thum_10312.webp"},{"id":"334","name":"Brave Knight Karl","star":"4","element":"Water","cost":"12","icon":"http:\/\/img3.wikia.nocookie.net\/__cb20140429172356\/bravefrontierglobal\/images\/thumb\/1\/16\/Unit_ills_thum_20233.png\/42px-Unit_ills_thum_20233.webp"},{"id":"335","name":"Ice Warrior Karl","star":"5","element":"Water","cost":"20","icon":"http:\/\/img4.wikia.nocookie.net\/__cb20140429172353\/bravefrontierglobal\/images\/thumb\/0\/00\/Unit_ills_thum_20234.png\/42px-Unit_ills_thum_20234.webp"},{"id":"336","name":"Lugina","star":"4","element":"Earth","cost":"10","icon":"http:\/\/img3.wikia.nocookie.net\/__cb20140416125432\/bravefrontierglobal\/images\/thumb\/6\/6a\/Unit_ills_thum_30233.png\/42px-Unit_ills_thum_30233.webp"},{"id":"337","name":"Gaia King Lugina","star":"5","element":"Earth","cost":"15","icon":"http:\/\/img2.wikia.nocookie.net\/__cb20140416125508\/bravefrontierglobal\/images\/thumb\/2\/27\/Unit_ills_thum_30234.png\/42px-Unit_ills_thum_30234.webp"},{"id":"338","name":"Holy Flame Vargas","star":"6","element":"Fire","cost":"20","icon":"http:\/\/img2.wikia.nocookie.net\/__cb20140411011915\/bravefrontierglobal\/images\/thumb\/8\/8e\/Unit_ills_thum_10015.png\/42px-Unit_ills_thum_10015.webp"},{"id":"339","name":"Holy Ice Selena","star":"6","element":"Water","cost":"20","icon":"http:\/\/img3.wikia.nocookie.net\/__cb20140411011945\/bravefrontierglobal\/images\/thumb\/a\/a5\/Unit_ills_thum_20015.png\/42px-Unit_ills_thum_20015.webp"},{"id":"340","name":"Holy Earth Lance","star":"6","element":"Earth","cost":"20","icon":"http:\/\/img3.wikia.nocookie.net\/__cb20140411012139\/bravefrontierglobal\/images\/thumb\/e\/e2\/Unit_ills_thum_30015.png\/42px-Unit_ills_thum_30015.webp"},{"id":"341","name":"Holy Thunder Eze","star":"6","element":"Thunder","cost":"20","icon":"http:\/\/img1.wikia.nocookie.net\/__cb20140411012201\/bravefrontierglobal\/images\/thumb\/c\/c7\/Unit_ills_thum_40015.png\/42px-Unit_ills_thum_40015.webp"},{"id":"342","name":"Holy Light Atro","star":"6","element":"Light","cost":"20","icon":"http:\/\/img2.wikia.nocookie.net\/__cb20140411012233\/bravefrontierglobal\/images\/thumb\/f\/f9\/Unit_ills_thum_50015.png\/42px-Unit_ills_thum_50015.webp"},{"id":"343","name":"Unholy Magress","star":"6","element":"Dark","cost":"20","icon":"http:\/\/img2.wikia.nocookie.net\/__cb20140411012247\/bravefrontierglobal\/images\/thumb\/7\/76\/Unit_ills_thum_60015.png\/42px-Unit_ills_thum_60015.webp"},{"id":"344","name":"Keymaster Gilnea","star":"5","element":"Light","cost":"16","icon":"http:\/\/img3.wikia.nocookie.net\/__cb20140503041338\/bravefrontierglobal\/images\/thumb\/e\/e4\/Unit_ills_thum_50344.png\/42px-Unit_ills_thum_50344.webp"},{"id":"346","name":"Red Axe Michele","star":"4","element":"Fire","cost":"8","icon":"http:\/\/img4.wikia.nocookie.net\/__cb20140414095332\/bravefrontierglobal\/images\/thumb\/1\/11\/Unit_ills_thum_10253.png\/42px-Unit_ills_thum_10253.webp"},{"id":"347","name":"Lotus Axe Michele","star":"5","element":"Fire","cost":"13","icon":"http:\/\/img2.wikia.nocookie.net\/__cb20140413163642\/bravefrontierglobal\/images\/thumb\/d\/de\/Unit_ills_thum_10254.png\/42px-Unit_ills_thum_10254.webp"},{"id":"348","name":"Polar Angel Tiara","star":"4","element":"Water","cost":"8","icon":"http:\/\/img2.wikia.nocookie.net\/__cb20140414095303\/bravefrontierglobal\/images\/thumb\/8\/87\/Unit_ills_thum_20253.png\/42px-Unit_ills_thum_20253.webp"},{"id":"349","name":"Ice Apostle Tiara","star":"5","element":"Water","cost":"13","icon":"http:\/\/img4.wikia.nocookie.net\/__cb20140413163637\/bravefrontierglobal\/images\/thumb\/2\/23\/Unit_ills_thum_20254.png\/42px-Unit_ills_thum_20254.webp"},{"id":"350","name":"Scar Blade Zelban","star":"4","element":"Earth","cost":"8","icon":"http:\/\/img1.wikia.nocookie.net\/__cb20140414095222\/bravefrontierglobal\/images\/thumb\/8\/88\/Unit_ills_thum_30253.png\/42px-Unit_ills_thum_30253.webp"},{"id":"351","name":"Blade Hero Zelban","star":"5","element":"Earth","cost":"13","icon":"http:\/\/img1.wikia.nocookie.net\/__cb20140413163632\/bravefrontierglobal\/images\/thumb\/e\/e5\/Unit_ills_thum_30254.png\/42px-Unit_ills_thum_30254.png"},{"id":"352","name":"Drakeborn Lodin","star":"4","element":"Thunder","cost":"8","icon":"http:\/\/img3.wikia.nocookie.net\/__cb20140414095414\/bravefrontierglobal\/images\/thumb\/a\/af\/Unit_ills_thum_40253.png\/42px-Unit_ills_thum_40253.png"},{"id":"353","name":"Drake God Lodin","star":"5","element":"Thunder","cost":"13","icon":"http:\/\/img2.wikia.nocookie.net\/__cb20140413163626\/bravefrontierglobal\/images\/thumb\/2\/2f\/Unit_ills_thum_40254.png\/42px-Unit_ills_thum_40254.png"},{"id":"354","name":"Legionary Melchio","star":"4","element":"Light","cost":"8","icon":"http:\/\/img3.wikia.nocookie.net\/__cb20140429172028\/bravefrontierglobal\/images\/thumb\/7\/7d\/Unit_ills_thum_50273.png\/42px-Unit_ills_thum_50273.png"},{"id":"355","name":"Centurion Melchio","star":"5","element":"Light","cost":"13","icon":"http:\/\/img2.wikia.nocookie.net\/__cb20140429172036\/bravefrontierglobal\/images\/thumb\/9\/95\/Unit_ills_thum_50274.png\/42px-Unit_ills_thum_50274.png"},{"id":"356","name":"Duel-GX","star":"4","element":"Dark","cost":"8","icon":"http:\/\/img1.wikia.nocookie.net\/__cb20140413163024\/bravefrontierglobal\/images\/thumb\/1\/1f\/Unit_ills_thum_60253.png\/42px-Unit_ills_thum_60253.png"},{"id":"357","name":"Duel-GX II","star":"5","element":"Dark","cost":"13","icon":"http:\/\/img2.wikia.nocookie.net\/__cb20140413163050\/bravefrontierglobal\/images\/thumb\/0\/09\/Unit_ills_thum_60254.png\/42px-Unit_ills_thum_60254.png"},{"id":"358","name":"Malvan","star":"4","element":"Fire","cost":"8","icon":"http:\/\/img2.wikia.nocookie.net\/__cb20140419170508\/bravefrontierglobal\/images\/thumb\/6\/6b\/Unit_ills_thum_10083.png\/42px-Unit_ills_thum_10083.png"},{"id":"359","name":"Legnaura","star":"4","element":"Water","cost":"8","icon":"http:\/\/img1.wikia.nocookie.net\/__cb20140419170619\/bravefrontierglobal\/images\/thumb\/e\/e8\/Unit_ills_thum_20083.png\/42px-Unit_ills_thum_20083.png"},{"id":"360","name":"Xipe Totec","star":"4","element":"Earth","cost":"8","icon":"http:\/\/img3.wikia.nocookie.net\/__cb20140419170712\/bravefrontierglobal\/images\/thumb\/a\/a0\/Unit_ills_thum_30083.png\/42px-Unit_ills_thum_30083.png"},{"id":"361","name":"Crow Tengu","star":"4","element":"Thunder","cost":"8","icon":"http:\/\/img4.wikia.nocookie.net\/__cb20140419170838\/bravefrontierglobal\/images\/thumb\/f\/fd\/Unit_ills_thum_40083.png\/42px-Unit_ills_thum_40083.png"},{"id":"362","name":"Saint Maria","star":"4","element":"Light","cost":"8","icon":"http:\/\/img1.wikia.nocookie.net\/__cb20140419170939\/bravefrontierglobal\/images\/thumb\/4\/47\/Unit_ills_thum_50073.png\/42px-Unit_ills_thum_50073.png"},{"id":"363","name":"Nyx","star":"4","element":"Dark","cost":"8","icon":"http:\/\/img1.wikia.nocookie.net\/__cb20140419171023\/bravefrontierglobal\/images\/thumb\/6\/64\/Unit_ills_thum_60073.png\/42px-Unit_ills_thum_60073.png"},{"id":"364","name":"Dalimaone","star":"5","element":"Fire","cost":"12","icon":"http:\/\/img3.wikia.nocookie.net\/__cb20140419171150\/bravefrontierglobal\/images\/thumb\/a\/ac\/Unit_ills_thum_10094.png\/42px-Unit_ills_thum_10094.png"},{"id":"365","name":"Meltia","star":"5","element":"Water","cost":"12","icon":"http:\/\/img4.wikia.nocookie.net\/__cb20140419172358\/bravefrontierglobal\/images\/thumb\/3\/37\/Unit_ills_thum_20094.png\/42px-Unit_ills_thum_20094.png"},{"id":"366","name":"Lemenara","star":"5","element":"Earth","cost":"12","icon":"http:\/\/img4.wikia.nocookie.net\/__cb20140419172502\/bravefrontierglobal\/images\/thumb\/1\/14\/Unit_ills_thum_30094.png\/42px-Unit_ills_thum_30094.png"},{"id":"367","name":"Zazabis","star":"5","element":"Thunder","cost":"12","icon":"http:\/\/img3.wikia.nocookie.net\/__cb20140419172555\/bravefrontierglobal\/images\/thumb\/c\/c3\/Unit_ills_thum_40094.png\/42px-Unit_ills_thum_40094.png"},{"id":"368","name":"Legendary Jona","star":"5","element":"Light","cost":"12","icon":"http:\/\/img3.wikia.nocookie.net\/__cb20140419172638\/bravefrontierglobal\/images\/thumb\/c\/cf\/Unit_ills_thum_50084.png\/42px-Unit_ills_thum_50084.png"},{"id":"369","name":"Legion","star":"5","element":"Dark","cost":"12","icon":"http:\/\/img1.wikia.nocookie.net\/__cb20140419172726\/bravefrontierglobal\/images\/thumb\/d\/d9\/Unit_ills_thum_60084.png\/42px-Unit_ills_thum_60084.png"},{"id":"370","name":"Phoenix Reborn","star":"6","element":"Fire","cost":"22","icon":"http:\/\/img1.wikia.nocookie.net\/__cb20140420024432\/bravefrontierglobal\/images\/thumb\/3\/3f\/Unit_ills_thum_10115.png\/42px-Unit_ills_thum_10115.png"},{"id":"371","name":"Felneus","star":"6","element":"Water","cost":"22","icon":"http:\/\/img2.wikia.nocookie.net\/__cb20140420024637\/bravefrontierglobal\/images\/thumb\/a\/a8\/Unit_ills_thum_20115.png\/42px-Unit_ills_thum_20115.png"},{"id":"372","name":"Alpha Tree Altri","star":"6","element":"Earth","cost":"22","icon":"http:\/\/img3.wikia.nocookie.net\/__cb20140420024737\/bravefrontierglobal\/images\/thumb\/1\/12\/Unit_ills_thum_30115.png\/42px-Unit_ills_thum_30115.png"},{"id":"373","name":"Omega Behemoth","star":"6","element":"Thunder","cost":"22","icon":"http:\/\/img2.wikia.nocookie.net\/__cb20140420024839\/bravefrontierglobal\/images\/thumb\/a\/a3\/Unit_ills_thum_40115.png\/42px-Unit_ills_thum_40115.png"},{"id":"374","name":"Duelmex","star":"6","element":"Light","cost":"22","icon":"http:\/\/img2.wikia.nocookie.net\/__cb20140420024940\/bravefrontierglobal\/images\/thumb\/1\/1d\/Unit_ills_thum_50105.png\/42px-Unit_ills_thum_50105.png"},{"id":"375","name":"Hellborn Dilias","star":"6","element":"Dark","cost":"22","icon":"http:\/\/img2.wikia.nocookie.net\/__cb20140420025041\/bravefrontierglobal\/images\/thumb\/a\/af\/Unit_ills_thum_60105.png\/42px-Unit_ills_thum_60105.png"},{"id":"377","name":"War Demon Vishra","star":"4","element":"Fire","cost":"10","icon":"http:\/\/img2.wikia.nocookie.net\/__cb20140428050007\/bravefrontierglobal\/images\/thumb\/5\/53\/Unit_ills_thum_10283.png\/42px-Unit_ills_thum_10283.png"},{"id":"378","name":"Rakshasa Vishra","star":"5","element":"Fire","cost":"15","icon":"http:\/\/img3.wikia.nocookie.net\/__cb20140428050017\/bravefrontierglobal\/images\/thumb\/9\/9c\/Unit_ills_thum_10284.png\/42px-Unit_ills_thum_10284.png"},{"id":"379","name":"Hail Bot Reeze","star":"4","element":"Water","cost":"10","icon":"http:\/\/img4.wikia.nocookie.net\/__cb20140428050022\/bravefrontierglobal\/images\/thumb\/d\/d9\/Unit_ills_thum_20283.png\/42px-Unit_ills_thum_20283.png"},{"id":"380","name":"Hail Mech Reeze","star":"5","element":"Water","cost":"15","icon":"http:\/\/img2.wikia.nocookie.net\/__cb20140428050027\/bravefrontierglobal\/images\/thumb\/a\/a7\/Unit_ills_thum_20284.png\/42px-Unit_ills_thum_20284.png"},{"id":"381","name":"Pugilist Dilma","star":"4","element":"Earth","cost":"10","icon":"http:\/\/img2.wikia.nocookie.net\/__cb20140428050032\/bravefrontierglobal\/images\/thumb\/3\/32\/Unit_ills_thum_30283.png\/42px-Unit_ills_thum_30283.png"},{"id":"382","name":"Champ Fist Dilma","star":"5","element":"Earth","cost":"15","icon":"http:\/\/img2.wikia.nocookie.net\/__cb20140428054441\/bravefrontierglobal\/images\/thumb\/2\/22\/Unit_ills_thum_30284.png\/42px-Unit_ills_thum_30284.png"},{"id":"383","name":"Shock Mage Rashil","star":"4","element":"Thunder","cost":"10","icon":"http:\/\/img2.wikia.nocookie.net\/__cb20140428050043\/bravefrontierglobal\/images\/thumb\/9\/93\/Unit_ills_thum_40283.png\/42px-Unit_ills_thum_40283.png"},{"id":"384","name":"Bolt Magus Rashil","star":"5","element":"Thunder","cost":"15","icon":"http:\/\/img2.wikia.nocookie.net\/__cb20140428050050\/bravefrontierglobal\/images\/thumb\/c\/cd\/Unit_ills_thum_40284.png\/42px-Unit_ills_thum_40284.png"},{"id":"385","name":"Cyborg Lilith","star":"4","element":"Light","cost":"10","icon":"http:\/\/img1.wikia.nocookie.net\/__cb20140429001150\/bravefrontierglobal\/images\/thumb\/0\/0a\/Unit_ills_thum_50313.png\/42px-Unit_ills_thum_50313.png"},{"id":"386","name":"Cyborg Lilith II","star":"5","element":"Light","cost":"15","icon":"http:\/\/img3.wikia.nocookie.net\/__cb20140429001159\/bravefrontierglobal\/images\/thumb\/6\/60\/Unit_ills_thum_50314.png\/42px-Unit_ills_thum_50314.png"},{"id":"387","name":"Dark Swords Logan","star":"4","element":"Dark","cost":"10","icon":"http:\/\/img4.wikia.nocookie.net\/__cb20140428050107\/bravefrontierglobal\/images\/thumb\/d\/d7\/Unit_ills_thum_60283.png\/42px-Unit_ills_thum_60283.png"},{"id":"388","name":"Evil Blades Logan","star":"5","element":"Dark","cost":"15","icon":"http:\/\/img3.wikia.nocookie.net\/__cb20140428050112\/bravefrontierglobal\/images\/thumb\/c\/cd\/Unit_ills_thum_60284.png\/42px-Unit_ills_thum_60284.png"},{"id":"389","name":"Paladin Paris","star":"4","element":"Thunder","cost":"12","icon":"http:\/\/img3.wikia.nocookie.net\/__cb20140514120208\/bravefrontierglobal\/images\/thumb\/d\/d7\/Unit_ills_thum_40233.png\/42px-Unit_ills_thum_40233.png"},{"id":"390","name":"Royal Guard Paris","star":"5","element":"Thunder","cost":"15","icon":"http:\/\/img3.wikia.nocookie.net\/__cb20140514120226\/bravefrontierglobal\/images\/thumb\/8\/89\/Unit_ills_thum_40234.png\/42px-Unit_ills_thum_40234.png"},{"id":"391","name":"Freya","star":"4","element":"Fire","cost":"10","icon":"http:\/\/img2.wikia.nocookie.net\/__cb20140514153502\/bravefrontierglobal\/images\/thumb\/a\/af\/Unit_ills_thum_10243.png\/42px-Unit_ills_thum_10243.png"},{"id":"392","name":"Blaze Sibyl Freya","star":"5","element":"Fire","cost":"15","icon":"http:\/\/img3.wikia.nocookie.net\/__cb20140514153518\/bravefrontierglobal\/images\/thumb\/f\/f8\/Unit_ills_thum_10244.png\/42px-Unit_ills_thum_10244.png"},{"id":"393","name":"Eliza","star":"4","element":"Water","cost":"10","icon":"http:\/\/img4.wikia.nocookie.net\/__cb20140514151708\/bravefrontierglobal\/images\/thumb\/b\/b6\/Unit_ills_thum_20243.png\/42px-Unit_ills_thum_20243.png"},{"id":"394","name":"Snow Sibyl Eliza","star":"5","element":"Water","cost":"15","icon":"http:\/\/img1.wikia.nocookie.net\/__cb20140514151725\/bravefrontierglobal\/images\/thumb\/2\/2a\/Unit_ills_thum_20244.png\/42px-Unit_ills_thum_20244.png"},{"id":"395","name":"Paula","star":"4","element":"Earth","cost":"10","icon":"http:\/\/img2.wikia.nocookie.net\/__cb20140514150719\/bravefrontierglobal\/images\/thumb\/9\/94\/Unit_ills_thum_30243.png\/42px-Unit_ills_thum_30243.png"},{"id":"396","name":"Rose Sibyl Paula","star":"5","element":"Earth","cost":"15","icon":"http:\/\/img1.wikia.nocookie.net\/__cb20140514150732\/bravefrontierglobal\/images\/thumb\/e\/ed\/Unit_ills_thum_30244.png\/42px-Unit_ills_thum_30244.png"},{"id":"397","name":"Zele","star":"4","element":"Thunder","cost":"10","icon":"http:\/\/img2.wikia.nocookie.net\/__cb20140514150623\/bravefrontierglobal\/images\/thumb\/6\/6b\/Unit_ills_thum_40243.png\/42px-Unit_ills_thum_40243.png"},{"id":"398","name":"Bolt Sibyl Zele","star":"5","element":"Thunder","cost":"15","icon":"http:\/\/img4.wikia.nocookie.net\/__cb20140514150637\/bravefrontierglobal\/images\/thumb\/d\/d5\/Unit_ills_thum_40244.png\/42px-Unit_ills_thum_40244.png"},{"id":"399","name":"Sola","star":"4","element":"Light","cost":"10","icon":"http:\/\/img3.wikia.nocookie.net\/__cb20140514153229\/bravefrontierglobal\/images\/thumb\/c\/c5\/Unit_ills_thum_50263.png\/42px-Unit_ills_thum_50263.png"},{"id":"400","name":"Ray Sibyl Sola","star":"5","element":"Light","cost":"15","icon":"http:\/\/img2.wikia.nocookie.net\/__cb20140514153150\/bravefrontierglobal\/images\/thumb\/b\/ba\/Unit_ills_thum_50264.png\/42px-Unit_ills_thum_50264.png"},{"id":"401","name":"Madia","star":"4","element":"Dark","cost":"10","icon":"http:\/\/img1.wikia.nocookie.net\/__cb20140514153006\/bravefrontierglobal\/images\/thumb\/8\/82\/Unit_ills_thum_60243.png\/42px-Unit_ills_thum_60243.png"},{"id":"402","name":"Night Sibyl Madia","star":"5","element":"Dark","cost":"15","icon":"http:\/\/img4.wikia.nocookie.net\/__cb20140514153023\/bravefrontierglobal\/images\/thumb\/7\/72\/Unit_ills_thum_60244.png\/42px-Unit_ills_thum_60244.png"},{"id":"415","name":"Homusubi","star":"4","element":"Fire","cost":"12","icon":"http:\/\/img2.wikia.nocookie.net\/__cb20140515013810\/bravefrontierglobal\/images\/thumb\/5\/56\/Unit_ills_thum_10273.png\/42px-Unit_ills_thum_10273.webp"},{"id":"416","name":"Kagutsuchi","star":"5","element":"Fire","cost":"16","icon":"http:\/\/img3.wikia.nocookie.net\/__cb20140515013828\/bravefrontierglobal\/images\/thumb\/4\/4f\/Unit_ills_thum_10274.png\/42px-Unit_ills_thum_10274.webp"},{"id":"417","name":"Ice Keep Copra","star":"4","element":"Water","cost":"12","icon":"http:\/\/img1.wikia.nocookie.net\/__cb20140515041256\/bravefrontierglobal\/images\/thumb\/7\/76\/Unit_ills_thum_20273.png\/42px-Unit_ills_thum_20273.webp"},{"id":"418","name":"Ice Tower Tesla","star":"5","element":"Water","cost":"16","icon":"http:\/\/img1.wikia.nocookie.net\/__cb20140515041316\/bravefrontierglobal\/images\/thumb\/f\/fd\/Unit_ills_thum_20274.png\/42px-Unit_ills_thum_20274.webp"},{"id":"419","name":"Golem","star":"4","element":"Earth","cost":"12","icon":"http:\/\/img2.wikia.nocookie.net\/__cb20140515041605\/bravefrontierglobal\/images\/thumb\/b\/b4\/Unit_ills_thum_30273.png\/42px-Unit_ills_thum_30273.webp"},{"id":"420","name":"Great Golem","star":"5","element":"Earth","cost":"16","icon":"http:\/\/img1.wikia.nocookie.net\/__cb20140515041629\/bravefrontierglobal\/images\/thumb\/0\/08\/Unit_ills_thum_30274.png\/42px-Unit_ills_thum_30274.webp"},{"id":"421","name":"Sky Angel Kushra","star":"4","element":"Thunder","cost":"12","icon":"http:\/\/img1.wikia.nocookie.net\/__cb20140515041953\/bravefrontierglobal\/images\/thumb\/8\/8b\/Unit_ills_thum_40273.png\/42px-Unit_ills_thum_40273.webp"},{"id":"422","name":"Rebel Angel Elsel","star":"5","element":"Thunder","cost":"16","icon":"http:\/\/img3.wikia.nocookie.net\/__cb20140515042009\/bravefrontierglobal\/images\/thumb\/d\/da\/Unit_ills_thum_40274.png\/42px-Unit_ills_thum_40274.webp"},{"id":"423","name":"White Lebra","star":"4","element":"Light","cost":"12","icon":"http:\/\/img2.wikia.nocookie.net\/__cb20140515042302\/bravefrontierglobal\/images\/thumb\/6\/62\/Unit_ills_thum_50303.png\/42px-Unit_ills_thum_50303.webp"},{"id":"424","name":"Lubradine","star":"5","element":"Light","cost":"16","icon":"http:\/\/img1.wikia.nocookie.net\/__cb20140515042332\/bravefrontierglobal\/images\/thumb\/4\/44\/Unit_ills_thum_50304.png\/42px-Unit_ills_thum_50304.webp"},{"id":"425","name":"Half Blood Lira","star":"4","element":"Dark","cost":"12","icon":"http:\/\/img3.wikia.nocookie.net\/__cb20140515042647\/bravefrontierglobal\/images\/thumb\/a\/af\/Unit_ills_thum_60273.png\/42px-Unit_ills_thum_60273.webp"},{"id":"426","name":"Magistra Lira","star":"5","element":"Dark","cost":"16","icon":"http:\/\/img4.wikia.nocookie.net\/__cb20140515042734\/bravefrontierglobal\/images\/thumb\/f\/f0\/Unit_ills_thum_60274.png\/42px-Unit_ills_thum_60274.webp"},{"id":"429","name":"Fire Crystal","star":"5","element":"Fire","cost":"12","icon":"http:\/\/img4.wikia.nocookie.net\/__cb20140515024216\/bravefrontierglobal\/images\/thumb\/9\/92\/Unit_ills_thum_10344.png\/42px-Unit_ills_thum_10344.webp"},{"id":"430","name":"Water Crystal","star":"5","element":"Water","cost":"12","icon":"http:\/\/img3.wikia.nocookie.net\/__cb20140515024130\/bravefrontierglobal\/images\/thumb\/1\/10\/Unit_ills_thum_20334.png\/42px-Unit_ills_thum_20334.webp"},{"id":"431","name":"Earth Crystal","star":"5","element":"Earth","cost":"12","icon":"http:\/\/img3.wikia.nocookie.net\/__cb20140515023825\/bravefrontierglobal\/images\/thumb\/b\/bb\/Unit_ills_thum_30324.png\/42px-Unit_ills_thum_30324.webp"},{"id":"432","name":"Thunder Crystal","star":"5","element":"Thunder","cost":"12","icon":"http:\/\/img2.wikia.nocookie.net\/__cb20140515023803\/bravefrontierglobal\/images\/thumb\/a\/aa\/Unit_ills_thum_40324.png\/42px-Unit_ills_thum_40324.webp"},{"id":"433","name":"Light Crystal","star":"5","element":"Light","cost":"12","icon":"http:\/\/img2.wikia.nocookie.net\/__cb20140515023629\/bravefrontierglobal\/images\/thumb\/a\/ae\/Unit_ills_thum_50364.png\/42px-Unit_ills_thum_50364.webp"},{"id":"434","name":"Dark Crystal","star":"5","element":"Dark","cost":"12","icon":"http:\/\/img2.wikia.nocookie.net\/__cb20140515024407\/bravefrontierglobal\/images\/thumb\/7\/77\/Unit_ills_thum_60334.png\/42px-Unit_ills_thum_60334.webp"},{"id":"435","name":"Smith Lord Galant","star":"5","element":"Fire","cost":"15","icon":"http:\/\/img2.wikia.nocookie.net\/__cb20140420085403\/bravefrontierglobal\/images\/thumb\/d\/d8\/Unit_ills_thum_10144.png\/42px-Unit_ills_thum_10144.webp"},{"id":"436","name":"Mother Snow Stya","star":"5","element":"Water","cost":"15","icon":"http:\/\/img3.wikia.nocookie.net\/__cb20140420085425\/bravefrontierglobal\/images\/thumb\/3\/39\/Unit_ills_thum_20144.png\/42px-Unit_ills_thum_20144.webp"},{"id":"437","name":"Quake Fist Nemia","star":"5","element":"Earth","cost":"15","icon":"http:\/\/img3.wikia.nocookie.net\/__cb20140420085456\/bravefrontierglobal\/images\/thumb\/d\/d9\/Unit_ills_thum_30144.png\/42px-Unit_ills_thum_30144.webp"},{"id":"438","name":"Thunder Punt Zeln","star":"5","element":"Thunder","cost":"15","icon":"http:\/\/img3.wikia.nocookie.net\/__cb20140420085524\/bravefrontierglobal\/images\/thumb\/6\/64\/Unit_ills_thum_40144.png\/42px-Unit_ills_thum_40144.webp"},{"id":"439","name":"Brave Hero Alma","star":"5","element":"Light","cost":"15","icon":"http:\/\/img2.wikia.nocookie.net\/__cb20140420085548\/bravefrontierglobal\/images\/thumb\/b\/bb\/Unit_ills_thum_50144.png\/42px-Unit_ills_thum_50144.webp"},{"id":"440","name":"Red Shadow Oboro","star":"5","element":"Dark","cost":"15","icon":"http:\/\/img1.wikia.nocookie.net\/__cb20140420085625\/bravefrontierglobal\/images\/thumb\/2\/2e\/Unit_ills_thum_60154.png\/42px-Unit_ills_thum_60154.webp"},{"id":"441","name":"Sacred Flame Lava","star":"6","element":"Fire","cost":"22","icon":"http:\/\/img1.wikia.nocookie.net\/__cb20140423042400\/bravefrontierglobal\/images\/thumb\/d\/dd\/Unit_ills_thum_10125.png\/42px-Unit_ills_thum_10125.webp"},{"id":"442","name":"Sea King Mega","star":"6","element":"Water","cost":"22","icon":"http:\/\/img1.wikia.nocookie.net\/__cb20140423042430\/bravefrontierglobal\/images\/thumb\/d\/d4\/Unit_ills_thum_20125.png\/42px-Unit_ills_thum_20125.webp"},{"id":"443","name":"Holy Arms Douglas","star":"6","element":"Earth","cost":"22","icon":"http:\/\/img4.wikia.nocookie.net\/__cb20140423042457\/bravefrontierglobal\/images\/thumb\/3\/38\/Unit_ills_thum_30125.png\/42px-Unit_ills_thum_30125.webp"},{"id":"444","name":"Holy Shock Emilia","star":"6","element":"Thunder","cost":"22","icon":"http:\/\/img1.wikia.nocookie.net\/__cb20140422221454\/bravefrontierglobal\/images\/thumb\/e\/e8\/Unit_ills_thum_40125.png\/42px-Unit_ills_thum_40125.webp"},{"id":"445","name":"Holy Guard Will","star":"6","element":"Light","cost":"22","icon":"http:\/\/img2.wikia.nocookie.net\/__cb20140423042534\/bravefrontierglobal\/images\/thumb\/f\/fa\/Unit_ills_thum_50115.png\/42px-Unit_ills_thum_50115.webp"},{"id":"446","name":"Hell Keep Alice","star":"6","element":"Dark","cost":"22","icon":"http:\/\/img2.wikia.nocookie.net\/__cb20140423042557\/bravefrontierglobal\/images\/thumb\/e\/e7\/Unit_ills_thum_60115.png\/42px-Unit_ills_thum_60115.webp"},{"id":"447","name":"Red Slash Farlon","star":"4","element":"Fire","cost":"12","icon":"http:\/\/img1.wikia.nocookie.net\/__cb20140514103121\/bravefrontierglobal\/images\/thumb\/a\/a2\/Unit_ills_thum_10333.png\/42px-Unit_ills_thum_10333.webp"},{"id":"448","name":"Red Blade Farlon","star":"5","element":"Fire","cost":"16","icon":"http:\/\/img2.wikia.nocookie.net\/__cb20140514103132\/bravefrontierglobal\/images\/thumb\/0\/04\/Unit_ills_thum_10334.png\/42px-Unit_ills_thum_10334.webp"},{"id":"449","name":"Snow Cub Signas","star":"4","element":"Water","cost":"12","icon":"http:\/\/img4.wikia.nocookie.net\/__cb20140514102952\/bravefrontierglobal\/images\/thumb\/b\/bc\/Unit_ills_thum_20323.png\/42px-Unit_ills_thum_20323.webp"},{"id":"450","name":"Snow Lion Signas","star":"5","element":"Water","cost":"16","icon":"http:\/\/img1.wikia.nocookie.net\/__cb20140515024059\/bravefrontierglobal\/images\/thumb\/d\/d3\/Unit_ills_thum_20324.png\/42px-Unit_ills_thum_20324.webp"},{"id":"455","name":"Horseman Sodis","star":"4","element":"Light","cost":"12","icon":"http:\/\/img3.wikia.nocookie.net\/__cb20140514102342\/bravefrontierglobal\/images\/thumb\/d\/db\/Unit_ills_thum_50383.png\/42px-Unit_ills_thum_50383.png"},{"id":"456","name":"Cavalryman Sodis","star":"5","element":"Light","cost":"16","icon":"http:\/\/img2.wikia.nocookie.net\/__cb20140514102400\/bravefrontierglobal\/images\/thumb\/5\/51\/Unit_ills_thum_50384.png\/42px-Unit_ills_thum_50384.png"},{"id":"459","name":"Hermit Talos","star":"2","element":"Fire","cost":"3","icon":"http:\/\/img3.wikia.nocookie.net\/__cb20140515102048\/bravefrontierglobal\/images\/thumb\/1\/1c\/Unit_ills_thum_10181.png\/42px-Unit_ills_thum_10181.png"},{"id":"460","name":"Mountaineer Talos","star":"3","element":"Fire","cost":"7","icon":"http:\/\/img3.wikia.nocookie.net\/__cb20140515102120\/bravefrontierglobal\/images\/thumb\/8\/87\/Unit_ills_thum_10182.png\/42px-Unit_ills_thum_10182.png"},{"id":"461","name":"Black Rose Elize","star":"2","element":"Water","cost":"3","icon":"http:\/\/img2.wikia.nocookie.net\/__cb20140515102328\/bravefrontierglobal\/images\/thumb\/c\/ca\/Unit_ills_thum_30181.png\/42px-Unit_ills_thum_30181.png"},{"id":"462","name":"Frozen Rose Elize","star":"3","element":"Water","cost":"7","icon":"http:\/\/img1.wikia.nocookie.net\/__cb20140515102246\/bravefrontierglobal\/images\/thumb\/9\/97\/Unit_ills_thum_20182.png\/42px-Unit_ills_thum_20182.png"},{"id":"463","name":"Poet Elton","star":"2","element":"Earth","cost":"3","icon":"http:\/\/img2.wikia.nocookie.net\/__cb20140515102328\/bravefrontierglobal\/images\/thumb\/c\/ca\/Unit_ills_thum_30181.png\/42px-Unit_ills_thum_30181.png"},{"id":"464","name":"Bard Elton","star":"3","element":"Earth","cost":"7","icon":"http:\/\/img3.wikia.nocookie.net\/__cb20140515102350\/bravefrontierglobal\/images\/thumb\/6\/67\/Unit_ills_thum_30182.png\/42px-Unit_ills_thum_30182.png"},{"id":"465","name":"Wild Cat Parmi","star":"2","element":"Thunder","cost":"3","icon":"http:\/\/img2.wikia.nocookie.net\/__cb20140515102430\/bravefrontierglobal\/images\/thumb\/f\/fa\/Unit_ills_thum_40181.png\/42px-Unit_ills_thum_40181.png"},{"id":"466","name":"Thunder Cat Parmi","star":"3","element":"Thunder","cost":"7","icon":"http:\/\/img3.wikia.nocookie.net\/__cb20140515102510\/bravefrontierglobal\/images\/thumb\/0\/0b\/Unit_ills_thum_40182.png\/42px-Unit_ills_thum_40182.png"},{"id":"467","name":"Shrine Girl Amul","star":"2","element":"Light","cost":"3","icon":"http:\/\/img1.wikia.nocookie.net\/__cb20140515050408\/bravefrontierglobal\/images\/thumb\/2\/2e\/Unit_ills_thum_50181.png\/42px-Unit_ills_thum_50181.png"},{"id":"468","name":"Holy Maiden Amul","star":"3","element":"Light","cost":"7","icon":"http:\/\/img2.wikia.nocookie.net\/__cb20140515051249\/bravefrontierglobal\/images\/thumb\/a\/a0\/Unit_ills_thum_50182.png\/42px-Unit_ills_thum_50182.png"},{"id":"469","name":"Gambler Zeul","star":"2","element":"Dark","cost":"3","icon":"http:\/\/img2.wikia.nocookie.net\/__cb20140515102606\/bravefrontierglobal\/images\/thumb\/4\/4b\/Unit_ills_thum_60191.png\/42px-Unit_ills_thum_60191.png"},{"id":"470","name":"High Roller Zeul","star":"3","element":"Dark","cost":"7","icon":"http:\/\/img1.wikia.nocookie.net\/__cb20140515102620\/bravefrontierglobal\/images\/thumb\/d\/de\/Unit_ills_thum_60192.png\/42px-Unit_ills_thum_60192.png"},{"id":"8000","name":"Maiden Lico","star":"3","element":"Dark","cost":"6","icon":"http:\/\/img1.wikia.nocookie.net\/__cb20140425010201\/bravefrontierglobal\/images\/thumb\/2\/2b\/Unit_ills_thum_860003.png\/42px-Unit_ills_thum_860003.png"},{"id":"8001","name":"Dark Blade Lico","star":"4","element":"Dark","cost":"10","icon":"http:\/\/img4.wikia.nocookie.net\/__cb20140425010131\/bravefrontierglobal\/images\/thumb\/3\/37\/Unit_ills_thum_860004.png\/42px-Unit_ills_thum_860004.png"},{"id":"8002","name":"Demon Blade Lico","star":"5","element":"Dark","cost":"15","icon":"http:\/\/img1.wikia.nocookie.net\/__cb20140425010044\/bravefrontierglobal\/images\/thumb\/e\/e5\/Unit_ills_thum_860005.png\/42px-Unit_ills_thum_860005.png"},{"id":"8003","name":"Maiden Cayena","star":"3","element":"Fire","cost":"6","icon":"http:\/\/img1.wikia.nocookie.net\/__cb20140425005805\/bravefrontierglobal\/images\/thumb\/7\/75\/Unit_ills_thum_810003.png\/42px-Unit_ills_thum_810003.webp"},{"id":"8004","name":"Hot Rocket Cayena","star":"4","element":"Fire","cost":"10","icon":"http:\/\/img1.wikia.nocookie.net\/__cb20140425005737\/bravefrontierglobal\/images\/thumb\/9\/9a\/Unit_ills_thum_810004.png\/42px-Unit_ills_thum_810004.webp"},{"id":"8005","name":"War Rocket Cayena","star":"5","element":"Fire","cost":"15","icon":"http:\/\/img3.wikia.nocookie.net\/__cb20140425005706\/bravefrontierglobal\/images\/thumb\/2\/20\/Unit_ills_thum_810005.png\/42px-Unit_ills_thum_810005.webp"},{"id":"8006","name":"Maiden Serin","star":"3","element":"Water","cost":"6","icon":"http:\/\/img3.wikia.nocookie.net\/__cb20140501194953\/bravefrontierglobal\/images\/thumb\/9\/99\/Unit_ills_thum_820003.png\/42px-Unit_ills_thum_820003.webp"},{"id":"8007","name":"Gun Lady Serin","star":"4","element":"Water","cost":"10","icon":"http:\/\/img4.wikia.nocookie.net\/__cb20140501195105\/bravefrontierglobal\/images\/thumb\/1\/11\/Unit_ills_thum_820004.png\/42px-Unit_ills_thum_820004.webp"},{"id":"8008","name":"Gun Goddess Serin","star":"5","element":"Water","cost":"15","icon":"http:\/\/img1.wikia.nocookie.net\/__cb20140501195125\/bravefrontierglobal\/images\/thumb\/5\/5a\/Unit_ills_thum_820005.png\/42px-Unit_ills_thum_820005.webp"},{"id":"8009","name":"Maiden Bayley","star":"3","element":"Earth","cost":"6","icon":"http:\/\/img3.wikia.nocookie.net\/__cb20140509030137\/bravefrontierglobal\/images\/thumb\/f\/f3\/Unit_ills_thum_830003.png\/42px-Unit_ills_thum_830003.webp"},{"id":"8010","name":"Nyan Slash Bayley","star":"4","element":"Earth","cost":"10","icon":"http:\/\/img3.wikia.nocookie.net\/__cb20140509030343\/bravefrontierglobal\/images\/thumb\/e\/e2\/Unit_ills_thum_830004.png\/42px-Unit_ills_thum_830004.webp"},{"id":"8011","name":"Wild Slash Bayley","star":"5","element":"Earth","cost":"15","icon":"http:\/\/img2.wikia.nocookie.net\/__cb20140509030444\/bravefrontierglobal\/images\/thumb\/e\/ec\/Unit_ills_thum_830005.png\/42px-Unit_ills_thum_830005.webp"},{"id":"8012","name":"Maiden Fennia","star":"3","element":"Thunder","cost":"6","icon":"http:\/\/img2.wikia.nocookie.net\/__cb20140517042255\/bravefrontierglobal\/images\/thumb\/7\/74\/Unit_ills_thum_840003.png\/42px-Unit_ills_thum_840003.webp"},{"id":"8013","name":"Raid Bomb Fennia","star":"4","element":"Thunder","cost":"10","icon":"http:\/\/img2.wikia.nocookie.net\/__cb20140517042243\/bravefrontierglobal\/images\/thumb\/b\/bc\/Unit_ills_thum_840004.png\/42px-Unit_ills_thum_840004.webp"},{"id":"8014","name":"Raid Bolt Fennia","star":"5","element":"Thunder","cost":"15","icon":"http:\/\/img4.wikia.nocookie.net\/__cb20140517042211\/bravefrontierglobal\/images\/thumb\/d\/d9\/Unit_ills_thum_840005.png\/42px-Unit_ills_thum_840005.webp"},{"id":"8015","name":"Maiden Vanila","star":"3","element":"Light","cost":"6","icon":"http:\/\/img2.wikia.nocookie.net\/__cb20140524175056\/bravefrontierglobal\/images\/thumb\/5\/5a\/Unit_ills_thum_850003.png\/42px-Unit_ills_thum_850003.webp"},{"id":"8016","name":"Sky Queen Vanila","star":"4","element":"Light","cost":"10","icon":"http:\/\/img2.wikia.nocookie.net\/__cb20140524175155\/bravefrontierglobal\/images\/thumb\/7\/71\/Unit_ills_thum_850004.png\/42px-Unit_ills_thum_850004.webp"},{"id":"8017","name":"Sky Angel Vanila","star":"5","element":"Light","cost":"15","icon":"http:\/\/img3.wikia.nocookie.net\/__cb20140524175237\/bravefrontierglobal\/images\/thumb\/c\/ca\/Unit_ills_thum_850005.png\/42px-Unit_ills_thum_850005.webp"},{"id":"8030","name":"Estia","star":"3","element":"Light","cost":"6","icon":"http:\/\/img1.wikia.nocookie.net\/__cb20140617132124\/bravefrontierglobal\/images\/thumb\/6\/60\/Unit_ills_thum_850013.png\/42px-Unit_ills_thum_850013.webp"},{"id":"8031","name":"Damsel Estia","star":"4","element":"Light","cost":"10","icon":"http:\/\/img2.wikia.nocookie.net\/__cb20140617132143\/bravefrontierglobal\/images\/thumb\/7\/75\/Unit_ills_thum_850014.png\/42px-Unit_ills_thum_850014.webp"},{"id":"8032","name":"Princess Estia","star":"5","element":"Light","cost":"15","icon":"http:\/\/img1.wikia.nocookie.net\/__cb20140617132202\/bravefrontierglobal\/images\/thumb\/9\/90\/Unit_ills_thum_850015.png\/42px-Unit_ills_thum_850015.webp"},{"id":"8033","name":"Xenon","star":"3","element":"Dark","cost":"6","icon":"http:\/\/img1.wikia.nocookie.net\/__cb20140610143050\/bravefrontierglobal\/images\/thumb\/4\/4c\/Unit_ills_thum_860013.png\/42px-Unit_ills_thum_860013.webp"},{"id":"8034","name":"Royal Guard Xenon","star":"4","element":"Dark","cost":"10","icon":"http:\/\/img3.wikia.nocookie.net\/__cb20140610143057\/bravefrontierglobal\/images\/thumb\/6\/67\/Unit_ills_thum_860014.png\/42px-Unit_ills_thum_860014.webp"},{"id":"8035","name":"Sir Sancus Xenon","star":"5","element":"Dark","cost":"15","icon":"http:\/\/img1.wikia.nocookie.net\/__cb20140610143104\/bravefrontierglobal\/images\/thumb\/7\/70\/Unit_ills_thum_860015.png\/42px-Unit_ills_thum_860015.webp"}]};
		
		if(typeof json_data != "undefined")
		{
			var d = json_data.d;
			units = d;
			
			tu_units_refresh();
		}
}

$(document).ready(function() {
	init_exp_table();
	check_checkbox();
	change_max_lv();
	change_selection();
	
	init_units();
	tu_team_refresh();
});