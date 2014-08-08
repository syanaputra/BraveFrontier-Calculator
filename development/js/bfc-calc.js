function goclone(source) {
    if (Object.prototype.toString.call(source) === '[object Array]') {
        var clone = [];
        for (var i=0; i<source.length; i++) {
            clone[i] = goclone(source[i]);
        }
        return clone;
    } else if (typeof(source)=="object") {
        var clone = {};
        for (var prop in source) {
            if (source.hasOwnProperty(prop)) {
                clone[prop] = goclone(source[prop]);
            }
        }
        return clone;
    } else {
        return source;
    }
}

function auto_validate() {
	var $tmp = $(this);
	if($tmp.val() > $tmp.attr("max"))
	{
		$tmp.val($tmp.attr("max"));
	}
	else if($tmp.val() < 1)
	{
		$tmp.val(1);
	}
}

// ----

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
var units_by_name = [];
var summoners = [];
var specific_info_selection = 0;

var unit_is_loaded = false;

// EXP Modifier
var EXP_NORMAL_MODIFIER	= 1;
var EXP_GREAT_MODIFIER 	= 1.5;
var EXP_SUPER_MODIFIER 	= 2;

// Metal Units
var metal_crystal_same	= 227286;
var metal_crystal		= 151524;
var metal_god_same 		= 77277;
var metal_god 			= 51518;
var metal_king_same 	= 16518;
var metal_king 			= 11012;
var metal_slime_same 	= 2259;
var metal_slime 		= 1506;

// Jewel Units
var jewel_god 			= 50000;
var jewel_king 			= 20000;
var jewel_ghost 		= 7000;

function metal_exp()
{
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
	
	total_exp_great = total_exp * EXP_GREAT_MODIFIER;
	total_exp_super = total_exp * EXP_SUPER_MODIFIER;
	
	$("#metal_exp").val(total_exp);
	$("#metal_exp_great").val(total_exp_great);
	$("#metal_exp_super").val(total_exp_super);
}

function jewel_exp()
{
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
		
		if(calc_type == 1 || calc_type == 0)
		{
			// Get required EXP given xx level
			var target_lv = $("#target_lv").val();
			var required_exp = selected_exp_table[target_lv] - current_exp;
			
			// Calculate Overall Metal Units needed
			var m_crystal, m_god, m_king, m_slime;			// Normal
			var m_crystal_g, m_god_g, m_king_g, m_slime_g;	// Great
			var m_crystal_s, m_god_s, m_king_s, m_slime_s;	// Super
			var tmp_m1, tmp_m2, tmp_m3, tmp_m4;
			
			// Minus with Metal Crystal (NORMAL)
			m_crystal = Math.floor(required_exp / metal_crystal_same);
			tmp_m1 = required_exp - (m_crystal * metal_crystal_same);
			
			m_god = Math.floor(tmp_m1 / metal_god_same);
			tmp_m2 = tmp_m1 - (m_god * metal_god_same);
			
			m_king = Math.floor(tmp_m2 / metal_king_same);
			tmp_m3 = tmp_m2 - (m_king * metal_king_same);
			
			m_slime = Math.floor(tmp_m3 / metal_slime_same);
			tmp_m4 = tmp_m3 - (m_slime * metal_slime_same);
			
			if(tmp_m4 > 0)
				m_slime++;
			
			
			// Minus with Metal Crystal (GREAT)
			m_crystal_g = Math.floor(required_exp / (metal_crystal_same * EXP_GREAT_MODIFIER));
			tmp_m1 = required_exp - (m_crystal_g * (metal_crystal_same * EXP_GREAT_MODIFIER));
			
			m_god_g = Math.floor(tmp_m1 / (metal_god_same * EXP_GREAT_MODIFIER));
			tmp_m2 = tmp_m1 - (m_god_g * (metal_god_same * EXP_GREAT_MODIFIER));
			
			m_king_g = Math.floor(tmp_m2 / (metal_king_same * EXP_GREAT_MODIFIER));
			tmp_m3 = tmp_m2 - (m_king_g * (metal_king_same * EXP_GREAT_MODIFIER));
			
			m_slime_g = Math.floor(tmp_m3 / (metal_slime_same * EXP_GREAT_MODIFIER));
			tmp_m4 = tmp_m3 - (m_slime_g * (metal_slime_same * EXP_GREAT_MODIFIER));
			
			if(tmp_m4 > 0)
				m_slime_g++;			
			
			
			// Minus with Metal Crystal (SUPER)
			m_crystal_s = Math.floor(required_exp / (metal_crystal_same * EXP_SUPER_MODIFIER));
			tmp_m1 = required_exp - (m_crystal_s * (metal_crystal_same * EXP_SUPER_MODIFIER));
			
			m_god_s = Math.floor(tmp_m1 / (metal_god_same * EXP_SUPER_MODIFIER));
			tmp_m2 = tmp_m1 - (m_god_s * (metal_god_same * EXP_SUPER_MODIFIER));
			
			m_king_s = Math.floor(tmp_m2 / (metal_king_same * EXP_SUPER_MODIFIER));
			tmp_m3 = tmp_m2 - (m_king_s * (metal_king_same * EXP_SUPER_MODIFIER));
			
			m_slime_s = Math.floor(tmp_m3 / (metal_slime_same * EXP_SUPER_MODIFIER));
			tmp_m4 = tmp_m3 - (m_slime_s * (metal_slime_same * EXP_SUPER_MODIFIER));
			
			if(tmp_m4 > 0)
				m_slime_g++;	
				
				
			// Output
			// -- Req Exp
			$("#out_required_exp").val(required_exp);
			
			// -- Req Metal Units (NORMAL)
			$("#req_m_crystal").text(m_crystal);
			$("#req_m_god").text(m_god);
			$("#req_m_king").text(m_king);
			$("#req_m_slime").text(m_slime);
			
			// -- Req Metal Units (GREAT)
			$("#req_m_crystal_g").text(m_crystal_g);
			$("#req_m_god_g").text(m_god_g);
			$("#req_m_king_g").text(m_king_g);
			$("#req_m_slime_g").text(m_slime_g);
			
			// -- Req Metal Units (SUPER)
			$("#req_m_crystal_s").text(m_crystal_s);
			$("#req_m_god_s").text(m_god_s);
			$("#req_m_king_s").text(m_king_s);
			$("#req_m_slime_s").text(m_slime_s);
		}
		else
		{
			// What level will I be when I give xx EXP
			var fuse_exp = $("#fuse_exp").val();
			var final_exp, final_level, final_leftover_exp_to_next_lv, final_bool;
			var final_exp_great, final_level_great, final_leftover_exp_to_next_lv_great, final_bool_great;
			var final_exp_super, final_level_super, final_leftover_exp_to_next_lv_super, final_bool_super;
			
			final_exp = current_exp + parseInt(fuse_exp);
			final_exp_great = final_exp * EXP_GREAT_MODIFIER;
			final_exp_super = final_exp * EXP_SUPER_MODIFIER;
			
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
	var $cur_lv = $("#current_lv");
	var $tar_lv = $("#target_lv");
	var cur_lv = parseInt($cur_lv.val());
	var tar_lv = parseInt($tar_lv.val());
	var m_image = "";
	
	if(typeof($val.max_lv) == "undefined")
	{
		max_lv = "???";
	}
	else
	{
		max_lv = $val.max_lv;
	
		$cur_lv.attr("max",max_lv);
		$tar_lv.attr("max",max_lv);
		
		if(cur_lv > max_lv)
			$cur_lv.val(max_lv);
			
		if(tar_lv > max_lv)
			$tar_lv.val(max_lv);
		
		exp_table_selected = $val.exp_table;
		
		if(specific_info_selection == 0) {
			$tar_lv.val(max_lv);
		}
	}
	
	switch($val.element.toLowerCase())
	{
		default:
		case "dark"		:
			m_image_crystal	= "http://img2.wikia.nocookie.net/__cb20140515024407/bravefrontierglobal/images/thumb/7/77/Unit_ills_thum_60334.png/42px-Unit_ills_thum_60334.png";
			m_image_god 	= "http://img4.wikia.nocookie.net/__cb20131101125031/bravefrontierglobal/images/thumb/0/0b/Unit_ills_thum_60134.png/42px-Unit_ills_thum_60134.png";
			m_image_king 	= "http://img3.wikia.nocookie.net/__cb20131101125016/bravefrontierglobal/images/thumb/9/95/Unit_ills_thum_60133.png/42px-Unit_ills_thum_60133.png";
			m_image_slime 	= "http://img1.wikia.nocookie.net/__cb20131101124958/bravefrontierglobal/images/thumb/a/ae/Unit_ills_thum_60132.png/42px-Unit_ills_thum_60132.png";
		break;
		case "light"	: 
			m_image_crystal	= "http://img2.wikia.nocookie.net/__cb20140515023629/bravefrontierglobal/images/thumb/a/ae/Unit_ills_thum_50364.png/42px-Unit_ills_thum_50364.png";
			m_image_god 	= "http://img2.wikia.nocookie.net/__cb20140429154658/bravefrontierglobal/images/thumb/3/36/Unit_ills_thum_50204.png/42px-Unit_ills_thum_50204.png";
			m_image_king 	= "http://img1.wikia.nocookie.net/__cb20140429154643/bravefrontierglobal/images/thumb/4/4b/Unit_ills_thum_50203.png/42px-Unit_ills_thum_50203.png";
			m_image_slime 	= "http://img4.wikia.nocookie.net/__cb20140501161803/bravefrontierglobal/images/thumb/0/0f/Unit_ills_thum_50202.png/42px-Unit_ills_thum_50202.png";
		break;
		case "fire"		:
			m_image_crystal	= "http://img4.wikia.nocookie.net/__cb20140515024216/bravefrontierglobal/images/thumb/9/92/Unit_ills_thum_10344.png/42px-Unit_ills_thum_10344.png";
			m_image_god 	= "http://img2.wikia.nocookie.net/__cb20140320100554/bravefrontierglobal/images/thumb/0/0d/Unit_ills_thum_10204.png/42px-Unit_ills_thum_10204.png";
			m_image_king 	= "http://img3.wikia.nocookie.net/__cb20140320100538/bravefrontierglobal/images/thumb/e/e0/Unit_ills_thum_10203.png/42px-Unit_ills_thum_10203.png";
			m_image_slime 	= "http://img1.wikia.nocookie.net/__cb20140320100516/bravefrontierglobal/images/thumb/1/1e/Unit_ills_thum_10202.png/42px-Unit_ills_thum_10202.png";
		break;
		case "water"	: 
			m_image_crystal	= "http://img3.wikia.nocookie.net/__cb20140515024130/bravefrontierglobal/images/thumb/1/10/Unit_ills_thum_20334.png/42px-Unit_ills_thum_20334.png";
			m_image_god 	= "http://img4.wikia.nocookie.net/__cb20140320101057/bravefrontierglobal/images/thumb/f/f0/Unit_ills_thum_20204.png/42px-Unit_ills_thum_20204.png";
			m_image_king 	= "http://img2.wikia.nocookie.net/__cb20140320101045/bravefrontierglobal/images/thumb/a/a0/Unit_ills_thum_20203.png/42px-Unit_ills_thum_20203.png";
			m_image_slime 	= "http://img2.wikia.nocookie.net/__cb20140320101031/bravefrontierglobal/images/thumb/f/f8/Unit_ills_thum_20202.png/42px-Unit_ills_thum_20202.png";
		break;
		case "thunder"	: 
			m_image_crystal	= "http://img2.wikia.nocookie.net/__cb20140515023803/bravefrontierglobal/images/thumb/a/aa/Unit_ills_thum_40324.png/42px-Unit_ills_thum_40324.png";
			m_image_god 	= "http://img1.wikia.nocookie.net/__cb20140429173742/bravefrontierglobal/images/thumb/f/f6/Unit_ills_thum_40204.png/42px-Unit_ills_thum_40204.png";
			m_image_king 	= "http://img2.wikia.nocookie.net/__cb20140429173919/bravefrontierglobal/images/thumb/5/5f/Unit_ills_thum_40203.png/42px-Unit_ills_thum_40203.png";
			m_image_slime 	= "http://img3.wikia.nocookie.net/__cb20140429173600/bravefrontierglobal/images/thumb/3/37/Unit_ills_thum_40202.png/42px-Unit_ills_thum_40202.png";
		break;
		case "earth"	: 
			m_image_crystal	= "http://img3.wikia.nocookie.net/__cb20140515023825/bravefrontierglobal/images/thumb/b/bb/Unit_ills_thum_30324.png/42px-Unit_ills_thum_30324.png";
			m_image_god 	= "http://img2.wikia.nocookie.net/__cb20140429161050/bravefrontierglobal/images/thumb/8/8b/Unit_ills_thum_30204.png/42px-Unit_ills_thum_30204.png";
			m_image_king 	= "http://img1.wikia.nocookie.net/__cb20140429161046/bravefrontierglobal/images/thumb/1/1d/Unit_ills_thum_30203.png/42px-Unit_ills_thum_30203.png";
			m_image_slime 	= "http://img1.wikia.nocookie.net/__cb20140429161036/bravefrontierglobal/images/thumb/6/63/Unit_ills_thum_30202.png/42px-Unit_ills_thum_30202.png";
		break;
	}
	
	$(".r_m_crystal").attr("src",m_image_crystal);
	$(".r_m_god").attr("src",m_image_god);
	$(".r_m_king").attr("src",m_image_king);
	$(".r_m_slime").attr("src",m_image_slime);
	
	$("#max_lv").text(max_lv);
}

function change_selection()
{
	$("#calc_selection_1").hide();
	$("#calc_selection_2").hide();
	switch($("#calc_selection").val())
	{
		case "0":
			$("#calc_selection_1").show();
			$("#target_lv").val($("#target_lv").attr("max"));
			specific_info_selection = 0;
		break;
		case "1": $("#calc_selection_1").show(); specific_info_selection = 1; break;
		case "2": $("#calc_selection_2").show(); specific_info_selection = 2; break;
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

function get_summoner_minimum_lv($cost) {
	for(var i=0; i<summoners.length; i++)
	{
		if(summoners[i].cost >= $cost)
		{
			return summoners[i].level;
		}
	}
}

function tu_search() {
	var tu_query = $("#tu-search").val();
	var tu_element = $("#tu-search-element").val();
	$("#tu-unit-list").children().hide();
	$('#tu-unit-list .tu-title').each(function(){
		if($(this).text().toUpperCase().indexOf(tu_query.toUpperCase()) != -1){
			if($(this).parent().children(".tu-element").text().toUpperCase().indexOf(tu_element.toUpperCase()) != -1)
			{
				$(this).parent().show();
			}
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
	
	// Get Minimum Summoner's Level
	var min_summoner_lv = get_summoner_minimum_lv(parseInt(tmp));
	$("#tu-summoner-lv").text(min_summoner_lv);
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
		units[$id].icon = 'http://img3.wikia.nocookie.net/__cb20140402135350/bravefrontierglobal/images/thumb/9/9b/Unit_ills_thum_00000.png/42px-Unit_ills_thum_00000.png';
	
	return '<div class="tu-unit" onclick="'+onclick_action+'"><img src="'+units[$id].icon+'" /><span class="tu-title">'+units[$id].name+'</span><span class="tu-element hidden">'+units[$id].element+'</span><span class="tu-cost">Cost: <strong>'+units[$id].cost+'</strong></span></div>';
}

function get_empty_unit_html() {
	return '<div class="tu-unit empty"><img src="http://img3.wikia.nocookie.net/__cb20140402135350/bravefrontierglobal/images/thumb/9/9b/Unit_ills_thum_00000.png/42px-Unit_ills_thum_00000.png" /><span class="tu-title">Empty</span></div>';
}

function init_units()
{
	var json_data, json_data_2;
	var timer_looker;
	
	// Try to init remotely
	$.post("http://bf-calc.com/get_units.php", { token:"bfc" }, function (data) {
		console.log(data);
	})
	.error(function(data) {
		console.log(data);
		
		// If it doesn't work, let's do it locally
		json_data = {"d":[{"id":"1","name":"Fencer Vargas","text":"Fencer Vargas","max_lv":"12","star":"2","element":"Fire","cost":"2","exp_table":"1","icon":"http:\/\/img3.wikia.nocookie.net\/__cb20131008160641\/bravefrontierglobal\/images\/thumb\/f\/f4\/Unit_ills_thum_10011.png\/42px-Unit_ills_thum_10011.png"},{"id":"2","name":"Burning Vargas","text":"Burning Vargas","max_lv":"40","star":"3","element":"Fire","cost":"4","exp_table":"1","icon":"http:\/\/img1.wikia.nocookie.net\/__cb20131014132929\/bravefrontierglobal\/images\/thumb\/0\/05\/Unit_ills_thum_10012.png\/42px-Unit_ills_thum_10012.png"},{"id":"3","name":"Fire King Vargas","text":"Fire King Vargas","max_lv":"60","star":"4","element":"Fire","cost":"8","exp_table":"1","icon":"http:\/\/img2.wikia.nocookie.net\/__cb20131029085340\/bravefrontierglobal\/images\/thumb\/d\/d1\/Unit_ills_thum_10013.png\/42px-Unit_ills_thum_10013.png"},{"id":"4","name":"Fire God Vargas","text":"Fire God Vargas","max_lv":"80","star":"5","element":"Fire","cost":"10","exp_table":"1","icon":"http:\/\/img1.wikia.nocookie.net\/__cb20131029085406\/bravefrontierglobal\/images\/thumb\/8\/8b\/Unit_ills_thum_10014.png\/42px-Unit_ills_thum_10014.png"},{"id":"5","name":"Selena","text":"Selena","max_lv":"12","star":"2","element":"Water","cost":"2","exp_table":"1","icon":"http:\/\/img3.wikia.nocookie.net\/__cb20131008160834\/bravefrontierglobal\/images\/thumb\/3\/34\/Unit_ills_thum_20011.png\/42px-Unit_ills_thum_20011.png"},{"id":"6","name":"Ice Selena","text":"Ice Selena","max_lv":"40","star":"3","element":"Water","cost":"4","exp_table":"1","icon":"http:\/\/img3.wikia.nocookie.net\/__cb20131014133530\/bravefrontierglobal\/images\/thumb\/e\/e0\/Unit_ills_thum_20012.png\/42px-Unit_ills_thum_20012.png"},{"id":"7","name":"Ice Queen Selena","text":"Ice Queen Selena","max_lv":"60","star":"4","element":"Water","cost":"8","exp_table":"1","icon":"http:\/\/img2.wikia.nocookie.net\/__cb20131029085731\/bravefrontierglobal\/images\/thumb\/9\/99\/Unit_ills_thum_20013.png\/42px-Unit_ills_thum_20013.png"},{"id":"8","name":"Ice Goddess Selena","text":"Ice Goddess Selena","max_lv":"80","star":"5","element":"Water","cost":"10","exp_table":"1","icon":"http:\/\/img3.wikia.nocookie.net\/__cb20131029085753\/bravefrontierglobal\/images\/thumb\/3\/3e\/Unit_ills_thum_20014.png\/42px-Unit_ills_thum_20014.png"},{"id":"9","name":"Pikeman Lance","text":"Pikeman Lance","max_lv":"12","star":"2","element":"Earth","cost":"2","exp_table":"1","icon":"http:\/\/img1.wikia.nocookie.net\/__cb20131008160932\/bravefrontierglobal\/images\/thumb\/8\/81\/Unit_ills_thum_30011.png\/42px-Unit_ills_thum_30011.png"},{"id":"10","name":"Vine Pike Lance","text":"Vine Pike Lance","max_lv":"40","star":"3","element":"Earth","cost":"4","exp_table":"1","icon":"http:\/\/img1.wikia.nocookie.net\/__cb20131014133834\/bravefrontierglobal\/images\/thumb\/3\/37\/Unit_ills_thum_30012.png\/42px-Unit_ills_thum_30012.png"},{"id":"11","name":"Earth Pike Lance","text":"Earth Pike Lance","max_lv":"60","star":"4","element":"Earth","cost":"8","exp_table":"1","icon":"http:\/\/img1.wikia.nocookie.net\/__cb20131029090114\/bravefrontierglobal\/images\/thumb\/f\/f2\/Unit_ills_thum_30013.png\/42px-Unit_ills_thum_30013.png"},{"id":"12","name":"Nature God Lance","text":"Nature God Lance","max_lv":"80","star":"5","element":"Earth","cost":"10","exp_table":"1","icon":"http:\/\/img3.wikia.nocookie.net\/__cb20131029090137\/bravefrontierglobal\/images\/thumb\/a\/ae\/Unit_ills_thum_30014.png\/42px-Unit_ills_thum_30014.png"},{"id":"13","name":"Warrior Eze","text":"Warrior Eze","max_lv":"12","star":"2","element":"Thunder","cost":"2","exp_table":"1","icon":"http:\/\/img1.wikia.nocookie.net\/__cb20131008161005\/bravefrontierglobal\/images\/thumb\/9\/90\/Unit_ills_thum_40011.png\/42px-Unit_ills_thum_40011.png"},{"id":"14","name":"Thunder Eze","text":"Thunder Eze","max_lv":"40","star":"3","element":"Thunder","cost":"4","exp_table":"1","icon":"http:\/\/img1.wikia.nocookie.net\/__cb20131014133953\/bravefrontierglobal\/images\/thumb\/f\/fa\/Unit_ills_thum_40012.png\/42px-Unit_ills_thum_40012.png"},{"id":"15","name":"Thunder King Eze","text":"Thunder King Eze","max_lv":"60","star":"4","element":"Thunder","cost":"8","exp_table":"1","icon":"http:\/\/img3.wikia.nocookie.net\/__cb20131029090542\/bravefrontierglobal\/images\/thumb\/1\/15\/Unit_ills_thum_40013.png\/42px-Unit_ills_thum_40013.png"},{"id":"16","name":"Thunder God Eze","text":"Thunder God Eze","max_lv":"80","star":"5","element":"Thunder","cost":"10","exp_table":"1","icon":"http:\/\/img4.wikia.nocookie.net\/__cb20131029090607\/bravefrontierglobal\/images\/thumb\/6\/65\/Unit_ills_thum_40014.png\/42px-Unit_ills_thum_40014.png"},{"id":"17","name":"Squire Atro","text":"Squire Atro","max_lv":"30","star":"2","element":"Light","cost":"2","exp_table":"1","icon":"http:\/\/img3.wikia.nocookie.net\/__cb20131029090901\/bravefrontierglobal\/images\/thumb\/c\/cd\/Unit_ills_thum_50011.png\/42px-Unit_ills_thum_50011.png"},{"id":"18","name":"Knight Atro","text":"Knight Atro","max_lv":"40","star":"3","element":"Light","cost":"4","exp_table":"1","icon":"http:\/\/img4.wikia.nocookie.net\/__cb20131029090939\/bravefrontierglobal\/images\/thumb\/a\/a3\/Unit_ills_thum_50012.png\/42px-Unit_ills_thum_50012.png"},{"id":"19","name":"Holy Knight Atro","text":"Holy Knight Atro","max_lv":"60","star":"4","element":"Light","cost":"8","exp_table":"1","icon":"http:\/\/img3.wikia.nocookie.net\/__cb20131029091002\/bravefrontierglobal\/images\/thumb\/1\/13\/Unit_ills_thum_50013.png\/42px-Unit_ills_thum_50013.png"},{"id":"20","name":"God Atro","text":"God Atro","max_lv":"80","star":"5","element":"Light","cost":"10","exp_table":"1","icon":"http:\/\/img4.wikia.nocookie.net\/__cb20131029091031\/bravefrontierglobal\/images\/thumb\/a\/a1\/Unit_ills_thum_50014.png\/42px-Unit_ills_thum_50014.png"},{"id":"21","name":"Iron Magress","text":"Iron Magress","max_lv":"30","star":"2","element":"Dark","cost":"2","exp_table":"1","icon":"http:\/\/img3.wikia.nocookie.net\/__cb20131031040434\/bravefrontierglobal\/images\/thumb\/d\/d4\/Unit_ills_thum_60011.png\/42px-Unit_ills_thum_60011.png"},{"id":"22","name":"Heavy Magress","text":"Heavy Magress","max_lv":"40","star":"3","element":"Dark","cost":"4","exp_table":"1","icon":"http:\/\/img4.wikia.nocookie.net\/__cb20131031040523\/bravefrontierglobal\/images\/thumb\/5\/51\/Unit_ills_thum_60012.png\/42px-Unit_ills_thum_60012.png"},{"id":"23","name":"Black Magress","text":"Black Magress","max_lv":"60","star":"4","element":"Dark","cost":"8","exp_table":"1","icon":"http:\/\/img3.wikia.nocookie.net\/__cb20131031040546\/bravefrontierglobal\/images\/thumb\/c\/ca\/Unit_ills_thum_60013.png\/42px-Unit_ills_thum_60013.png"},{"id":"24","name":"Death Magress","text":"Death Magress","max_lv":"80","star":"5","element":"Dark","cost":"10","exp_table":"1","icon":"http:\/\/img1.wikia.nocookie.net\/__cb20131031040607\/bravefrontierglobal\/images\/thumb\/4\/43\/Unit_ills_thum_60014.png\/42px-Unit_ills_thum_60014.png"},{"id":"25","name":"Beast Zegar","text":"Beast Zegar","max_lv":"30","star":"2","element":"Fire","cost":"3","exp_table":"2","icon":"http:\/\/img2.wikia.nocookie.net\/__cb20131029074821\/bravefrontierglobal\/images\/thumb\/8\/8d\/Unit_ills_thum_10021.png\/42px-Unit_ills_thum_10021.png"},{"id":"26","name":"Rage Beast Zegar","text":"Rage Beast Zegar","max_lv":"40","star":"3","element":"Fire","cost":"5","exp_table":"2","icon":"http:\/\/img1.wikia.nocookie.net\/__cb20131029092335\/bravefrontierglobal\/images\/thumb\/7\/75\/Unit_ills_thum_10022.png\/42px-Unit_ills_thum_10022.png"},{"id":"27","name":"Fire Beast Zegar","text":"Fire Beast Zegar","max_lv":"60","star":"4","element":"Fire","cost":"9","exp_table":"2","icon":"http:\/\/img4.wikia.nocookie.net\/__cb20131029092351\/bravefrontierglobal\/images\/thumb\/d\/d5\/Unit_ills_thum_10023.png\/42px-Unit_ills_thum_10023.png"},{"id":"28","name":"Zephu","text":"Zephu","max_lv":"30","star":"2","element":"Water","cost":"3","exp_table":"2","icon":"http:\/\/img2.wikia.nocookie.net\/__cb20131029092831\/bravefrontierglobal\/images\/thumb\/c\/c1\/Unit_ills_thum_20021.png\/42px-Unit_ills_thum_20021.png"},{"id":"29","name":"Knight Zephu","text":"Knight Zephu","max_lv":"40","star":"3","element":"Water","cost":"5","exp_table":"2","icon":"http:\/\/img4.wikia.nocookie.net\/__cb20131029092916\/bravefrontierglobal\/images\/thumb\/c\/c2\/Unit_ills_thum_20022.png\/42px-Unit_ills_thum_20022.png"},{"id":"30","name":"Dragoon Zephu","text":"Dragoon Zephu","max_lv":"60","star":"4","element":"Water","cost":"9","exp_table":"2","icon":"http:\/\/img1.wikia.nocookie.net\/__cb20131029092933\/bravefrontierglobal\/images\/thumb\/6\/69\/Unit_ills_thum_20023.png\/42px-Unit_ills_thum_20023.png"},{"id":"31","name":"Archer Lario","text":"Archer Lario","max_lv":"30","star":"2","element":"Earth","cost":"3","exp_table":"2","icon":"http:\/\/img3.wikia.nocookie.net\/__cb20131029094306\/bravefrontierglobal\/images\/thumb\/7\/7e\/Unit_ills_thum_30021.png\/42px-Unit_ills_thum_30021.png"},{"id":"32","name":"Marksman Lario","text":"Marksman Lario","max_lv":"40","star":"3","element":"Earth","cost":"5","exp_table":"2","icon":"http:\/\/img1.wikia.nocookie.net\/__cb20131029094331\/bravefrontierglobal\/images\/thumb\/a\/ad\/Unit_ills_thum_30022.png\/42px-Unit_ills_thum_30022.png"},{"id":"33","name":"Hawkeye Lario","text":"Hawkeye Lario","max_lv":"60","star":"4","element":"Earth","cost":"9","exp_table":"2","icon":"http:\/\/img3.wikia.nocookie.net\/__cb20131029094407\/bravefrontierglobal\/images\/thumb\/5\/55\/Unit_ills_thum_30023.png\/42px-Unit_ills_thum_30023.png"},{"id":"34","name":"Advisor Weiss","text":"Advisor Weiss","max_lv":"30","star":"2","element":"Thunder","cost":"3","exp_table":"2","icon":"http:\/\/img4.wikia.nocookie.net\/__cb20131029094820\/bravefrontierglobal\/images\/thumb\/1\/15\/Unit_ills_thum_40021.png\/42px-Unit_ills_thum_40021.png"},{"id":"35","name":"Strategist Weiss","text":"Strategist Weiss","max_lv":"40","star":"3","element":"Thunder","cost":"5","exp_table":"2","icon":"http:\/\/img1.wikia.nocookie.net\/__cb20131029094852\/bravefrontierglobal\/images\/thumb\/e\/e2\/Unit_ills_thum_40022.png\/42px-Unit_ills_thum_40022.png"},{"id":"36","name":"Commander Weiss","text":"Commander Weiss","max_lv":"60","star":"4","element":"Thunder","cost":"9","exp_table":"2","icon":"http:\/\/img4.wikia.nocookie.net\/__cb20131029094938\/bravefrontierglobal\/images\/thumb\/5\/5d\/Unit_ills_thum_40023.png\/42px-Unit_ills_thum_40023.png"},{"id":"37","name":"Luna","text":"Luna","max_lv":"30","star":"2","element":"Light","cost":"3","exp_table":"2","icon":"http:\/\/img3.wikia.nocookie.net\/__cb20131029095309\/bravefrontierglobal\/images\/thumb\/b\/be\/Unit_ills_thum_50021.png\/42px-Unit_ills_thum_50021.png"},{"id":"38","name":"Sunshine Luna","text":"Sunshine Luna","max_lv":"40","star":"3","element":"Light","cost":"5","exp_table":"2","icon":"http:\/\/img3.wikia.nocookie.net\/__cb20131029095340\/bravefrontierglobal\/images\/thumb\/c\/c9\/Unit_ills_thum_50022.png\/42px-Unit_ills_thum_50022.png"},{"id":"39","name":"Holy Queen Luna","text":"Holy Queen Luna","max_lv":"60","star":"4","element":"Light","cost":"9","exp_table":"2","icon":"http:\/\/img1.wikia.nocookie.net\/__cb20131029095558\/bravefrontierglobal\/images\/thumb\/e\/ee\/Unit_ills_thum_50023.png\/42px-Unit_ills_thum_50023.png"},{"id":"40","name":"Mifune","text":"Mifune","max_lv":"30","star":"2","element":"Dark","cost":"3","exp_table":"2","icon":"http:\/\/img1.wikia.nocookie.net\/__cb20131029100048\/bravefrontierglobal\/images\/thumb\/9\/96\/Unit_ills_thum_60021.png\/42px-Unit_ills_thum_60021.png"},{"id":"41","name":"Samurai Mifune","text":"Samurai Mifune","max_lv":"40","star":"3","element":"Dark","cost":"5","exp_table":"2","icon":"http:\/\/img3.wikia.nocookie.net\/__cb20131030140652\/bravefrontierglobal\/images\/thumb\/7\/72\/Unit_ills_thum_60022.png\/42px-Unit_ills_thum_60022.png"},{"id":"42","name":"God Blade Mifune","text":"God Blade Mifune","max_lv":"60","star":"4","element":"Dark","cost":"9","exp_table":"2","icon":"http:\/\/img1.wikia.nocookie.net\/__cb20131030141002\/bravefrontierglobal\/images\/thumb\/a\/a1\/Unit_ills_thum_60023.png\/42px-Unit_ills_thum_60023.png"},{"id":"43","name":"Burny","text":"Burny","max_lv":"10","star":"1","element":"Fire","cost":"1","exp_table":"1","icon":"http:\/\/img4.wikia.nocookie.net\/__cb20131030141433\/bravefrontierglobal\/images\/thumb\/d\/d3\/Unit_ills_thum_10030.png\/42px-Unit_ills_thum_10030.png"},{"id":"44","name":"King Burny","text":"King Burny","max_lv":"30","star":"2","element":"Fire","cost":"3","exp_table":"1","icon":"http:\/\/img4.wikia.nocookie.net\/__cb20131030141637\/bravefrontierglobal\/images\/thumb\/0\/0f\/Unit_ills_thum_10031.png\/42px-Unit_ills_thum_10031.png"},{"id":"45","name":"Squirty","text":"Squirty","max_lv":"10","star":"1","element":"Water","cost":"1","exp_table":"1","icon":"http:\/\/img1.wikia.nocookie.net\/__cb20131030141911\/bravefrontierglobal\/images\/thumb\/7\/7d\/Unit_ills_thum_20030.png\/42px-Unit_ills_thum_20030.png"},{"id":"46","name":"King Squirty","text":"King Squirty","max_lv":"30","star":"2","element":"Water","cost":"3","exp_table":"1","icon":"http:\/\/img3.wikia.nocookie.net\/__cb20131030142047\/bravefrontierglobal\/images\/thumb\/1\/1f\/Unit_ills_thum_20031.png\/42px-Unit_ills_thum_20031.png"},{"id":"47","name":"Mossy","text":"Mossy","max_lv":"10","star":"1","element":"Earth","cost":"1","exp_table":"1","icon":"http:\/\/img2.wikia.nocookie.net\/__cb20131030142714\/bravefrontierglobal\/images\/thumb\/9\/9c\/Unit_ills_thum_30030.png\/42px-Unit_ills_thum_30030.png"},{"id":"48","name":"King Mossy","text":"King Mossy","max_lv":"30","star":"2","element":"Earth","cost":"3","exp_table":"1","icon":"http:\/\/img3.wikia.nocookie.net\/__cb20131030142810\/bravefrontierglobal\/images\/thumb\/9\/90\/Unit_ills_thum_30031.png\/42px-Unit_ills_thum_30031.png"},{"id":"49","name":"Sparky","text":"Sparky","max_lv":"10","star":"1","element":"Thunder","cost":"1","exp_table":"1","icon":"http:\/\/img2.wikia.nocookie.net\/__cb20131030142938\/bravefrontierglobal\/images\/thumb\/c\/cd\/Unit_ills_thum_40030.png\/42px-Unit_ills_thum_40030.png"},{"id":"50","name":"King Sparky","text":"King Sparky","max_lv":"30","star":"2","element":"Thunder","cost":"3","exp_table":"1","icon":"http:\/\/img2.wikia.nocookie.net\/__cb20131030143036\/bravefrontierglobal\/images\/thumb\/5\/54\/Unit_ills_thum_40031.png\/42px-Unit_ills_thum_40031.png"},{"id":"51","name":"Glowy","text":"Glowy","max_lv":"10","star":"1","element":"Light","cost":"1","exp_table":"1","icon":"http:\/\/img1.wikia.nocookie.net\/__cb20131030143241\/bravefrontierglobal\/images\/thumb\/a\/a2\/Unit_ills_thum_50030.png\/42px-Unit_ills_thum_50030.png"},{"id":"52","name":"King Glowy","text":"King Glowy","max_lv":"30","star":"2","element":"Light","cost":"3","exp_table":"1","icon":"http:\/\/img1.wikia.nocookie.net\/__cb20131030143309\/bravefrontierglobal\/images\/thumb\/5\/58\/Unit_ills_thum_50031.png\/42px-Unit_ills_thum_50031.png"},{"id":"53","name":"Gloomy","text":"Gloomy","max_lv":"10","star":"1","element":"Dark","cost":"1","exp_table":"1","icon":"http:\/\/img4.wikia.nocookie.net\/__cb20131030143537\/bravefrontierglobal\/images\/thumb\/2\/20\/Unit_ills_thum_60030.png\/42px-Unit_ills_thum_60030.png"},{"id":"54","name":"King Gloomy","text":"King Gloomy","max_lv":"30","star":"2","element":"Dark","cost":"3","exp_table":"1","icon":"http:\/\/img4.wikia.nocookie.net\/__cb20131030143558\/bravefrontierglobal\/images\/thumb\/9\/97\/Unit_ills_thum_60031.png\/42px-Unit_ills_thum_60031.png"},{"id":"55","name":"Witch Liza","text":"Witch Liza","max_lv":"15","star":"1","element":"Fire","cost":"2","exp_table":"1","icon":"http:\/\/img1.wikia.nocookie.net\/__cb20131031042133\/bravefrontierglobal\/images\/thumb\/3\/30\/Unit_ills_thum_10040.png\/42px-Unit_ills_thum_10040.png"},{"id":"56","name":"Warlock Liza","text":"Warlock Liza","max_lv":"30","star":"2","element":"Fire","cost":"4","exp_table":"1","icon":"http:\/\/img2.wikia.nocookie.net\/__cb20131031042248\/bravefrontierglobal\/images\/thumb\/5\/52\/Unit_ills_thum_10041.png\/42px-Unit_ills_thum_10041.png"},{"id":"57","name":"Priest Merith","text":"Priest Merith","max_lv":"15","star":"1","element":"Water","cost":"2","exp_table":"1","icon":"http:\/\/img4.wikia.nocookie.net\/__cb20131031042758\/bravefrontierglobal\/images\/thumb\/c\/c0\/Unit_ills_thum_20040.png\/42px-Unit_ills_thum_20040.png"},{"id":"58","name":"Healer Merith","text":"Healer Merith","max_lv":"30","star":"2","element":"Water","cost":"4","exp_table":"1","icon":"http:\/\/img2.wikia.nocookie.net\/__cb20131031042912\/bravefrontierglobal\/images\/thumb\/3\/3a\/Unit_ills_thum_20041.png\/42px-Unit_ills_thum_20041.png"},{"id":"59","name":"Geomancer Claris","text":"Geomancer Claris","max_lv":"15","star":"1","element":"Earth","cost":"2","exp_table":"1","icon":"http:\/\/img4.wikia.nocookie.net\/__cb20131031043051\/bravefrontierglobal\/images\/thumb\/b\/b1\/Unit_ills_thum_30040.png\/42px-Unit_ills_thum_30040.png"},{"id":"60","name":"Time Mage Claris","text":"Time Mage Claris","max_lv":"30","star":"2","element":"Earth","cost":"4","exp_table":"1","icon":"http:\/\/img2.wikia.nocookie.net\/__cb20131031045802\/bravefrontierglobal\/images\/thumb\/8\/87\/Unit_ills_thum_30041.png\/42px-Unit_ills_thum_30041.png"},{"id":"61","name":"Dancer May","text":"Dancer May","max_lv":"15","star":"1","element":"Thunder","cost":"2","exp_table":"1","icon":"http:\/\/img2.wikia.nocookie.net\/__cb20131031050423\/bravefrontierglobal\/images\/thumb\/b\/b1\/Unit_ills_thum_40040.png\/42px-Unit_ills_thum_40040.png"},{"id":"62","name":"High Dancer May","text":"High Dancer May","max_lv":"30","star":"2","element":"Thunder","cost":"4","exp_table":"1","icon":"http:\/\/img4.wikia.nocookie.net\/__cb20131031050630\/bravefrontierglobal\/images\/thumb\/c\/c7\/Unit_ills_thum_40041.png\/42px-Unit_ills_thum_40041.png"},{"id":"63","name":"Sage Mimir","text":"Sage Mimir","max_lv":"15","star":"1","element":"Light","cost":"2","exp_table":"1","icon":"http:\/\/img4.wikia.nocookie.net\/__cb20131031051125\/bravefrontierglobal\/images\/thumb\/7\/79\/Unit_ills_thum_50040.png\/42px-Unit_ills_thum_50040.png"},{"id":"64","name":"Light Lord Mimir","text":"Light Lord Mimir","max_lv":"30","star":"2","element":"Light","cost":"4","exp_table":"1","icon":"http:\/\/img3.wikia.nocookie.net\/__cb20131031051249\/bravefrontierglobal\/images\/thumb\/9\/94\/Unit_ills_thum_50041.png\/42px-Unit_ills_thum_50041.png"},{"id":"65","name":"Sorceress Lily","text":"Sorceress Lily","max_lv":"15","star":"1","element":"Dark","cost":"2","exp_table":"1","icon":"http:\/\/img2.wikia.nocookie.net\/__cb20131031054259\/bravefrontierglobal\/images\/thumb\/0\/08\/Unit_ills_thum_60040.png\/42px-Unit_ills_thum_60040.png"},{"id":"66","name":"Magician Lily","text":"Magician Lily","max_lv":"30","star":"2","element":"Dark","cost":"4","exp_table":"1","icon":"http:\/\/img2.wikia.nocookie.net\/__cb20131031054423\/bravefrontierglobal\/images\/thumb\/d\/d6\/Unit_ills_thum_60041.png\/42px-Unit_ills_thum_60041.png"},{"id":"67","name":"Goblin","text":"Goblin","max_lv":"12","star":"1","element":"Fire","cost":"2","exp_table":"1","icon":"http:\/\/img4.wikia.nocookie.net\/__cb20131031054735\/bravefrontierglobal\/images\/thumb\/9\/98\/Unit_ills_thum_10050.png\/42px-Unit_ills_thum_10050.png"},{"id":"68","name":"Redcap","text":"Redcap","max_lv":"30","star":"2","element":"Fire","cost":"4","exp_table":"1","icon":"http:\/\/img3.wikia.nocookie.net\/__cb20131031055108\/bravefrontierglobal\/images\/thumb\/4\/47\/Unit_ills_thum_10051.png\/42px-Unit_ills_thum_10051.png"},{"id":"69","name":"Merman","text":"Merman","max_lv":"12","star":"1","element":"Water","cost":"2","exp_table":"1","icon":"http:\/\/img4.wikia.nocookie.net\/__cb20131031055256\/bravefrontierglobal\/images\/thumb\/3\/3c\/Unit_ills_thum_20050.png\/42px-Unit_ills_thum_20050.png"},{"id":"70","name":"Sahuagin","text":"Sahuagin","max_lv":"30","star":"2","element":"Water","cost":"4","exp_table":"1","icon":"http:\/\/img4.wikia.nocookie.net\/__cb20131031055349\/bravefrontierglobal\/images\/thumb\/1\/1e\/Unit_ills_thum_20051.png\/42px-Unit_ills_thum_20051.png"},{"id":"71","name":"Mandragora","text":"Mandragora","max_lv":"12","star":"1","element":"Earth","cost":"2","exp_table":"1","icon":"http:\/\/img1.wikia.nocookie.net\/__cb20131031055524\/bravefrontierglobal\/images\/thumb\/7\/79\/Unit_ills_thum_30050.png\/42px-Unit_ills_thum_30050.png"},{"id":"72","name":"Polevik","text":"Polevik","max_lv":"30","star":"2","element":"Earth","cost":"4","exp_table":"1","icon":"http:\/\/img4.wikia.nocookie.net\/__cb20131031055710\/bravefrontierglobal\/images\/thumb\/2\/2e\/Unit_ills_thum_30051.png\/42px-Unit_ills_thum_30051.png"},{"id":"73","name":"Harpy","text":"Harpy","max_lv":"12","star":"1","element":"Thunder","cost":"2","exp_table":"1","icon":"http:\/\/img1.wikia.nocookie.net\/__cb20131031055937\/bravefrontierglobal\/images\/thumb\/f\/f7\/Unit_ills_thum_40050.png\/42px-Unit_ills_thum_40050.png"},{"id":"74","name":"Aero","text":"Aero","max_lv":"30","star":"2","element":"Thunder","cost":"4","exp_table":"1","icon":"http:\/\/img3.wikia.nocookie.net\/__cb20131031060027\/bravefrontierglobal\/images\/thumb\/5\/5b\/Unit_ills_thum_40051.png\/42px-Unit_ills_thum_40051.png"},{"id":"75","name":"Angel","text":"Angel","max_lv":"12","star":"1","element":"Light","cost":"2","exp_table":"1","icon":"http:\/\/img1.wikia.nocookie.net\/__cb20131031060232\/bravefrontierglobal\/images\/thumb\/5\/5e\/Unit_ills_thum_50050.png\/42px-Unit_ills_thum_50050.png"},{"id":"76","name":"Archangel","text":"Archangel","max_lv":"30","star":"2","element":"Light","cost":"4","exp_table":"1","icon":"http:\/\/img3.wikia.nocookie.net\/__cb20131031060325\/bravefrontierglobal\/images\/thumb\/4\/42\/Unit_ills_thum_50051.png\/42px-Unit_ills_thum_50051.png"},{"id":"77","name":"Skeleton","text":"Skeleton","max_lv":"12","star":"1","element":"Dark","cost":"2","exp_table":"1","icon":"http:\/\/img2.wikia.nocookie.net\/__cb20131031061215\/bravefrontierglobal\/images\/thumb\/3\/3d\/Unit_ills_thum_60050.png\/42px-Unit_ills_thum_60050.png"},{"id":"78","name":"Skeleton King","text":"Skeleton King","max_lv":"30","star":"2","element":"Dark","cost":"4","exp_table":"1","icon":"http:\/\/img2.wikia.nocookie.net\/__cb20131031061258\/bravefrontierglobal\/images\/thumb\/e\/e4\/Unit_ills_thum_60051.png\/42px-Unit_ills_thum_60051.png"},{"id":"79","name":"Thief Leon","text":"Thief Leon","max_lv":"30","star":"2","element":"Fire","cost":"3","exp_table":"1","icon":"http:\/\/img1.wikia.nocookie.net\/__cb20131031062142\/bravefrontierglobal\/images\/thumb\/6\/68\/Unit_ills_thum_10061.png\/42px-Unit_ills_thum_10061.png"},{"id":"80","name":"Head Thief Leon","text":"Head Thief Leon","max_lv":"40","star":"3","element":"Fire","cost":"6","exp_table":"1","icon":"http:\/\/img1.wikia.nocookie.net\/__cb20131031062159\/bravefrontierglobal\/images\/thumb\/e\/ec\/Unit_ills_thum_10062.png\/42px-Unit_ills_thum_10062.png"},{"id":"81","name":"Pirate Verica","text":"Pirate Verica","max_lv":"30","star":"2","element":"Water","cost":"3","exp_table":"1","icon":"http:\/\/img2.wikia.nocookie.net\/__cb20131031063033\/bravefrontierglobal\/images\/thumb\/e\/e9\/Unit_ills_thum_20061.png\/42px-Unit_ills_thum_20061.png"},{"id":"82","name":"Plunderer Verica","text":"Plunderer Verica","max_lv":"40","star":"3","element":"Water","cost":"6","exp_table":"1","icon":"http:\/\/img4.wikia.nocookie.net\/__cb20131031063051\/bravefrontierglobal\/images\/thumb\/7\/7b\/Unit_ills_thum_20062.png\/42px-Unit_ills_thum_20062.png"},{"id":"83","name":"Bandit Zaza","text":"Bandit Zaza","max_lv":"30","star":"2","element":"Earth","cost":"3","exp_table":"1","icon":"http:\/\/img2.wikia.nocookie.net\/__cb20131031063446\/bravefrontierglobal\/images\/thumb\/7\/7d\/Unit_ills_thum_30061.png\/42px-Unit_ills_thum_30061.png"},{"id":"84","name":"Head Bandit Zaza","text":"Head Bandit Zaza","max_lv":"40","star":"3","element":"Earth","cost":"6","exp_table":"1","icon":"http:\/\/img4.wikia.nocookie.net\/__cb20131031063504\/bravefrontierglobal\/images\/thumb\/2\/2c\/Unit_ills_thum_30062.png\/42px-Unit_ills_thum_30062.png"},{"id":"85","name":"Sky Pirate Grafl","text":"Sky Pirate Grafl","max_lv":"30","star":"2","element":"Thunder","cost":"3","exp_table":"1","icon":"http:\/\/img3.wikia.nocookie.net\/__cb20131031063752\/bravefrontierglobal\/images\/thumb\/5\/5b\/Unit_ills_thum_40061.png\/42px-Unit_ills_thum_40061.png"},{"id":"86","name":"Sky Boss Grafl","text":"Sky Boss Grafl","max_lv":"40","star":"3","element":"Thunder","cost":"6","exp_table":"1","icon":"http:\/\/img4.wikia.nocookie.net\/__cb20131031063816\/bravefrontierglobal\/images\/thumb\/9\/90\/Unit_ills_thum_40062.png\/42px-Unit_ills_thum_40062.png"},{"id":"87","name":"Orthos","text":"Orthos","max_lv":"30","star":"2","element":"Fire","cost":"2","exp_table":"1","icon":"http:\/\/img4.wikia.nocookie.net\/__cb20131031065641\/bravefrontierglobal\/images\/thumb\/0\/08\/Unit_ills_thum_10071.png\/42px-Unit_ills_thum_10071.png"},{"id":"88","name":"Cerberus","text":"Cerberus","max_lv":"40","star":"3","element":"Fire","cost":"5","exp_table":"1","icon":"http:\/\/img4.wikia.nocookie.net\/__cb20131031065712\/bravefrontierglobal\/images\/thumb\/8\/8e\/Unit_ills_thum_10072.png\/42px-Unit_ills_thum_10072.png"},{"id":"89","name":"Ramia","text":"Ramia","max_lv":"30","star":"2","element":"Water","cost":"2","exp_table":"1","icon":"http:\/\/img4.wikia.nocookie.net\/__cb20131031070041\/bravefrontierglobal\/images\/thumb\/7\/7c\/Unit_ills_thum_20071.png\/42px-Unit_ills_thum_20071.png"},{"id":"90","name":"Scylla","text":"Scylla","max_lv":"40","star":"3","element":"Water","cost":"5","exp_table":"1","icon":"http:\/\/img4.wikia.nocookie.net\/__cb20131031070107\/bravefrontierglobal\/images\/thumb\/7\/79\/Unit_ills_thum_20072.png\/42px-Unit_ills_thum_20072.png"},{"id":"91","name":"Fairy","text":"Fairy","max_lv":"30","star":"2","element":"Earth","cost":"2","exp_table":"1","icon":"http:\/\/img4.wikia.nocookie.net\/__cb20131031071430\/bravefrontierglobal\/images\/thumb\/d\/da\/Unit_ills_thum_30071.png\/42px-Unit_ills_thum_30071.png"},{"id":"92","name":"Titania","text":"Titania","max_lv":"40","star":"3","element":"Earth","cost":"5","exp_table":"1","icon":"http:\/\/img4.wikia.nocookie.net\/__cb20131031071448\/bravefrontierglobal\/images\/thumb\/f\/ff\/Unit_ills_thum_30072.png\/42px-Unit_ills_thum_30072.png"},{"id":"93","name":"Minotaur","text":"Minotaur","max_lv":"30","star":"2","element":"Thunder","cost":"2","exp_table":"1","icon":"http:\/\/img4.wikia.nocookie.net\/__cb20131031071848\/bravefrontierglobal\/images\/thumb\/4\/46\/Unit_ills_thum_40071.png\/42px-Unit_ills_thum_40071.png"},{"id":"94","name":"Cyclops","text":"Cyclops","max_lv":"40","star":"3","element":"Thunder","cost":"5","exp_table":"1","icon":"http:\/\/img1.wikia.nocookie.net\/__cb20131031071918\/bravefrontierglobal\/images\/thumb\/1\/14\/Unit_ills_thum_40072.png\/42px-Unit_ills_thum_40072.png"},{"id":"95","name":"Unicorn","text":"Unicorn","max_lv":"30","star":"2","element":"Light","cost":"3","exp_table":"1","icon":"http:\/\/img3.wikia.nocookie.net\/__cb20131031072604\/bravefrontierglobal\/images\/thumb\/9\/96\/Unit_ills_thum_50060.png\/42px-Unit_ills_thum_50060.png"},{"id":"96","name":"Pegasus","text":"Pegasus","max_lv":"40","star":"3","element":"Light","cost":"6","exp_table":"1","icon":"http:\/\/img2.wikia.nocookie.net\/__cb20131031072801\/bravefrontierglobal\/images\/thumb\/5\/52\/Unit_ills_thum_50061.png\/42px-Unit_ills_thum_50061.png"},{"id":"97","name":"Medusa","text":"Medusa","max_lv":"30","star":"2","element":"Dark","cost":"3","exp_table":"1","icon":"http:\/\/img1.wikia.nocookie.net\/__cb20131031073112\/bravefrontierglobal\/images\/thumb\/e\/ed\/Unit_ills_thum_60061.png\/42px-Unit_ills_thum_60061.png"},{"id":"98","name":"Zahhak","text":"Zahhak","max_lv":"40","star":"3","element":"Dark","cost":"6","exp_table":"1","icon":"http:\/\/img1.wikia.nocookie.net\/__cb20131031073131\/bravefrontierglobal\/images\/thumb\/a\/a4\/Unit_ills_thum_60062.png\/42px-Unit_ills_thum_60062.png"},{"id":"99","name":"Salamander","text":"Salamander","max_lv":"30","star":"2","element":"Fire","cost":"2","exp_table":"1","icon":"http:\/\/img1.wikia.nocookie.net\/__cb20131031073409\/bravefrontierglobal\/images\/thumb\/8\/82\/Unit_ills_thum_10081.png\/42px-Unit_ills_thum_10081.png"},{"id":"100","name":"Ifrit","text":"Ifrit","max_lv":"40","star":"3","element":"Fire","cost":"5","exp_table":"1","icon":"http:\/\/img2.wikia.nocookie.net\/__cb20131031073428\/bravefrontierglobal\/images\/thumb\/5\/54\/Unit_ills_thum_10082.png\/42px-Unit_ills_thum_10082.png"},{"id":"101","name":"Rantoul","text":"Rantoul","max_lv":"30","star":"2","element":"Water","cost":"2","exp_table":"1","icon":"http:\/\/img2.wikia.nocookie.net\/__cb20131031073710\/bravefrontierglobal\/images\/thumb\/1\/1a\/Unit_ills_thum_20081.png\/42px-Unit_ills_thum_20081.png"},{"id":"102","name":"Legtos","text":"Legtos","max_lv":"40","star":"3","element":"Water","cost":"4","exp_table":"1","icon":"http:\/\/img4.wikia.nocookie.net\/__cb20131031073727\/bravefrontierglobal\/images\/thumb\/a\/ab\/Unit_ills_thum_20082.png\/42px-Unit_ills_thum_20082.png"},{"id":"103","name":"Trent","text":"Trent","max_lv":"30","star":"2","element":"Earth","cost":"2","exp_table":"1","icon":"http:\/\/img2.wikia.nocookie.net\/__cb20131031074050\/bravefrontierglobal\/images\/thumb\/8\/86\/Unit_ills_thum_30081.png\/42px-Unit_ills_thum_30081.png"},{"id":"104","name":"Ent","text":"Ent","max_lv":"40","star":"3","element":"Earth","cost":"4","exp_table":"1","icon":"http:\/\/img1.wikia.nocookie.net\/__cb20131031074116\/bravefrontierglobal\/images\/thumb\/d\/dc\/Unit_ills_thum_30082.png\/42px-Unit_ills_thum_30082.png"},{"id":"105","name":"Sylph","text":"Sylph","max_lv":"30","star":"2","element":"Thunder","cost":"2","exp_table":"1","icon":"http:\/\/img1.wikia.nocookie.net\/__cb20131031074816\/bravefrontierglobal\/images\/thumb\/2\/22\/Unit_ills_thum_40081.png\/42px-Unit_ills_thum_40081.png"},{"id":"106","name":"Djin","text":"Djin","max_lv":"40","star":"3","element":"Thunder","cost":"4","exp_table":"1","icon":"http:\/\/img2.wikia.nocookie.net\/__cb20131031074840\/bravefrontierglobal\/images\/thumb\/f\/f3\/Unit_ills_thum_40082.png\/42px-Unit_ills_thum_40082.png"},{"id":"107","name":"Priestess Maria","text":"Priestess Maria","max_lv":"30","star":"2","element":"Light","cost":"2","exp_table":"1","icon":"http:\/\/img2.wikia.nocookie.net\/__cb20131031075103\/bravefrontierglobal\/images\/thumb\/8\/8c\/Unit_ills_thum_50071.png\/42px-Unit_ills_thum_50071.png"},{"id":"108","name":"Angel Maria","text":"Angel Maria","max_lv":"40","star":"3","element":"Light","cost":"4","exp_table":"1","icon":"http:\/\/img4.wikia.nocookie.net\/__cb20131031075124\/bravefrontierglobal\/images\/thumb\/1\/15\/Unit_ills_thum_50072.png\/42px-Unit_ills_thum_50072.png"},{"id":"109","name":"Lilin","text":"Lilin","max_lv":"30","star":"2","element":"Dark","cost":"2","exp_table":"1","icon":"http:\/\/img2.wikia.nocookie.net\/__cb20131031075243\/bravefrontierglobal\/images\/thumb\/1\/12\/Unit_ills_thum_60071.png\/42px-Unit_ills_thum_60071.png"},{"id":"110","name":"Succubus","text":"Succubus","max_lv":"40","star":"3","element":"Dark","cost":"4","exp_table":"1","icon":"http:\/\/img2.wikia.nocookie.net\/__cb20131031075305\/bravefrontierglobal\/images\/thumb\/e\/e0\/Unit_ills_thum_60072.png\/42px-Unit_ills_thum_60072.png"},{"id":"111","name":"Firedrake","text":"Firedrake","max_lv":"40","star":"3","element":"Fire","cost":"5","exp_table":"2","icon":"http:\/\/img2.wikia.nocookie.net\/__cb20131031075439\/bravefrontierglobal\/images\/thumb\/c\/c3\/Unit_ills_thum_10092.png\/42px-Unit_ills_thum_10092.png"},{"id":"112","name":"Dragon Graven","text":"Dragon Graven","max_lv":"60","star":"4","element":"Fire","cost":"8","exp_table":"2","icon":"http:\/\/img1.wikia.nocookie.net\/__cb20131031075506\/bravefrontierglobal\/images\/thumb\/9\/9b\/Unit_ills_thum_10093.png\/42px-Unit_ills_thum_10093.png"},{"id":"113","name":"Undine","text":"Undine","max_lv":"40","star":"3","element":"Water","cost":"5","exp_table":"2","icon":"http:\/\/img2.wikia.nocookie.net\/__cb20131031075731\/bravefrontierglobal\/images\/thumb\/e\/e5\/Unit_ills_thum_20092.png\/42px-Unit_ills_thum_20092.png"},{"id":"114","name":"Siren","text":"Siren","max_lv":"60","star":"4","element":"Water","cost":"8","exp_table":"2","icon":"http:\/\/img2.wikia.nocookie.net\/__cb20131031075752\/bravefrontierglobal\/images\/thumb\/3\/33\/Unit_ills_thum_20093.png\/42px-Unit_ills_thum_20093.png"},{"id":"115","name":"Dryad","text":"Dryad","max_lv":"40","star":"3","element":"Earth","cost":"5","exp_table":"2","icon":"http:\/\/img1.wikia.nocookie.net\/__cb20131031075959\/bravefrontierglobal\/images\/thumb\/c\/c9\/Unit_ills_thum_30092.png\/42px-Unit_ills_thum_30092.png"},{"id":"116","name":"High Elf","text":"High Elf","max_lv":"60","star":"4","element":"Earth","cost":"8","exp_table":"2","icon":"http:\/\/img1.wikia.nocookie.net\/__cb20131031080036\/bravefrontierglobal\/images\/thumb\/f\/f6\/Unit_ills_thum_30093.png\/42px-Unit_ills_thum_30093.png"},{"id":"117","name":"Thunderbird","text":"Thunderbird","max_lv":"40","star":"3","element":"Thunder","cost":"5","exp_table":"2","icon":"http:\/\/img1.wikia.nocookie.net\/__cb20131031080439\/bravefrontierglobal\/images\/thumb\/9\/93\/Unit_ills_thum_40092.png\/42px-Unit_ills_thum_40092.png"},{"id":"118","name":"Great Falcon Ziz","text":"Great Falcon Ziz","max_lv":"60","star":"4","element":"Thunder","cost":"8","exp_table":"2","icon":"http:\/\/img3.wikia.nocookie.net\/__cb20131031080505\/bravefrontierglobal\/images\/thumb\/8\/87\/Unit_ills_thum_40093.png\/42px-Unit_ills_thum_40093.png"},{"id":"119","name":"Valkyrie","text":"Valkyrie","max_lv":"40","star":"3","element":"Light","cost":"5","exp_table":"2","icon":"http:\/\/img4.wikia.nocookie.net\/__cb20131031080715\/bravefrontierglobal\/images\/thumb\/8\/8b\/Unit_ills_thum_50082.png\/42px-Unit_ills_thum_50082.png"},{"id":"120","name":"Sky Hero Athena","text":"Sky Hero Athena","max_lv":"60","star":"4","element":"Light","cost":"8","exp_table":"2","icon":"http:\/\/img4.wikia.nocookie.net\/__cb20131031080754\/bravefrontierglobal\/images\/thumb\/1\/1d\/Unit_ills_thum_50083.png\/42px-Unit_ills_thum_50083.png"},{"id":"121","name":"Vampire","text":"Vampire","max_lv":"40","star":"3","element":"Dark","cost":"5","exp_table":"2","icon":"http:\/\/img2.wikia.nocookie.net\/__cb20131031105607\/bravefrontierglobal\/images\/thumb\/3\/35\/Unit_ills_thum_60082.png\/42px-Unit_ills_thum_60082.png"},{"id":"122","name":"Lich","text":"Lich","max_lv":"60","star":"4","element":"Dark","cost":"8","exp_table":"2","icon":"http:\/\/img2.wikia.nocookie.net\/__cb20131031105848\/bravefrontierglobal\/images\/thumb\/f\/f2\/Unit_ills_thum_60083.png\/42px-Unit_ills_thum_60083.png"},{"id":"123","name":"Knight Agni","text":"Knight Agni","max_lv":"40","star":"3","element":"Fire","cost":"5","exp_table":"2","icon":"http:\/\/img3.wikia.nocookie.net\/__cb20131031113057\/bravefrontierglobal\/images\/thumb\/4\/43\/Unit_ills_thum_10102.png\/42px-Unit_ills_thum_10102.png"},{"id":"124","name":"Fire Knight Agni","text":"Fire Knight Agni","max_lv":"60","star":"4","element":"Fire","cost":"8","exp_table":"2","icon":"http:\/\/img1.wikia.nocookie.net\/__cb20131031235220\/bravefrontierglobal\/images\/thumb\/8\/8b\/Unit_ills_thum_10103.png\/42px-Unit_ills_thum_10103.png"},{"id":"125","name":"Knight Sergio","text":"Knight Sergio","max_lv":"40","star":"3","element":"Water","cost":"5","exp_table":"2","icon":"http:\/\/img4.wikia.nocookie.net\/__cb20131031235358\/bravefrontierglobal\/images\/thumb\/9\/95\/Unit_ills_thum_20102.png\/42px-Unit_ills_thum_20102.png"},{"id":"126","name":"Ice Ruler Sergio","text":"Ice Ruler Sergio","max_lv":"60","star":"4","element":"Water","cost":"8","exp_table":"2","icon":"http:\/\/img3.wikia.nocookie.net\/__cb20131031235459\/bravefrontierglobal\/images\/thumb\/b\/b0\/Unit_ills_thum_20103.png\/42px-Unit_ills_thum_20103.png"},{"id":"127","name":"Princess Lidith","text":"Princess Lidith","max_lv":"40","star":"3","element":"Earth","cost":"5","exp_table":"2","icon":"http:\/\/img1.wikia.nocookie.net\/__cb20131101001205\/bravefrontierglobal\/images\/thumb\/b\/b3\/Unit_ills_thum_30102.png\/42px-Unit_ills_thum_30102.png"},{"id":"128","name":"Queen Lidith","text":"Queen Lidith","max_lv":"60","star":"4","element":"Earth","cost":"8","exp_table":"2","icon":"http:\/\/img4.wikia.nocookie.net\/__cb20131101001316\/bravefrontierglobal\/images\/thumb\/0\/0b\/Unit_ills_thum_30103.png\/42px-Unit_ills_thum_30103.png"},{"id":"129","name":"Sky Knight Falma","text":"Sky Knight Falma","max_lv":"40","star":"3","element":"Thunder","cost":"5","exp_table":"2","icon":"http:\/\/img3.wikia.nocookie.net\/__cb20131101001427\/bravefrontierglobal\/images\/thumb\/3\/31\/Unit_ills_thum_40102.png\/42px-Unit_ills_thum_40102.png"},{"id":"130","name":"Sky King Falma","text":"Sky King Falma","max_lv":"60","star":"4","element":"Thunder","cost":"8","exp_table":"2","icon":"http:\/\/img1.wikia.nocookie.net\/__cb20131101001531\/bravefrontierglobal\/images\/thumb\/1\/19\/Unit_ills_thum_40103.png\/42px-Unit_ills_thum_40103.png"},{"id":"131","name":"Cowboy Heidt","text":"Cowboy Heidt","max_lv":"40","star":"3","element":"Light","cost":"5","exp_table":"2","icon":"http:\/\/img2.wikia.nocookie.net\/__cb20131101001638\/bravefrontierglobal\/images\/thumb\/3\/32\/Unit_ills_thum_50092.png\/42px-Unit_ills_thum_50092.png"},{"id":"132","name":"Holy Shot Heidt","text":"Holy Shot Heidt","max_lv":"60","star":"4","element":"Light","cost":"8","exp_table":"2","icon":"http:\/\/img3.wikia.nocookie.net\/__cb20131101001753\/bravefrontierglobal\/images\/thumb\/3\/36\/Unit_ills_thum_50093.png\/42px-Unit_ills_thum_50093.png"},{"id":"133","name":"Shida","text":"Shida","max_lv":"40","star":"3","element":"Dark","cost":"5","exp_table":"2","icon":"http:\/\/img1.wikia.nocookie.net\/__cb20131101001903\/bravefrontierglobal\/images\/thumb\/8\/85\/Unit_ills_thum_60092.png\/42px-Unit_ills_thum_60092.png"},{"id":"134","name":"Garroter Shida","text":"Garroter Shida","max_lv":"60","star":"4","element":"Dark","cost":"8","exp_table":"2","icon":"http:\/\/img2.wikia.nocookie.net\/__cb20131101002006\/bravefrontierglobal\/images\/thumb\/3\/35\/Unit_ills_thum_60093.png\/42px-Unit_ills_thum_60093.png"},{"id":"135","name":"Phoenix","text":"Phoenix","max_lv":"40","star":"3","element":"Fire","cost":"5","exp_table":"3","icon":"http:\/\/img2.wikia.nocookie.net\/__cb20131101014720\/bravefrontierglobal\/images\/thumb\/d\/d5\/Unit_ills_thum_10112.png\/42px-Unit_ills_thum_10112.png"},{"id":"136","name":"Lava Phoenix","text":"Lava Phoenix","max_lv":"60","star":"4","element":"Fire","cost":"8","exp_table":"3","icon":"http:\/\/img2.wikia.nocookie.net\/__cb20131101014844\/bravefrontierglobal\/images\/thumb\/b\/b0\/Unit_ills_thum_10113.png\/42px-Unit_ills_thum_10113.png"},{"id":"137","name":"God Phoenix","text":"God Phoenix","max_lv":"80","star":"5","element":"Fire","cost":"12","exp_table":"3","icon":"http:\/\/img2.wikia.nocookie.net\/__cb20131101014946\/bravefrontierglobal\/images\/thumb\/e\/e1\/Unit_ills_thum_10114.png\/42px-Unit_ills_thum_10114.png"},{"id":"138","name":"Leviathan","text":"Leviathan","max_lv":"40","star":"3","element":"Water","cost":"5","exp_table":"3","icon":"http:\/\/img2.wikia.nocookie.net\/__cb20131101015502\/bravefrontierglobal\/images\/thumb\/2\/2a\/Unit_ills_thum_20112.png\/42px-Unit_ills_thum_20112.png"},{"id":"139","name":"Loch Ness","text":"Loch Ness","max_lv":"60","star":"4","element":"Water","cost":"8","exp_table":"3","icon":"http:\/\/img1.wikia.nocookie.net\/__cb20131101015922\/bravefrontierglobal\/images\/thumb\/4\/4d\/Unit_ills_thum_20113.png\/42px-Unit_ills_thum_20113.png"},{"id":"140","name":"Malnaplis","text":"Malnaplis","max_lv":"80","star":"5","element":"Water","cost":"12","exp_table":"3","icon":"http:\/\/img2.wikia.nocookie.net\/__cb20131101015949\/bravefrontierglobal\/images\/thumb\/0\/00\/Unit_ills_thum_20114.png\/42px-Unit_ills_thum_20114.png"},{"id":"141","name":"Great Tree Alneu","text":"Great Tree Alneu","max_lv":"40","star":"3","element":"Earth","cost":"5","exp_table":"3","icon":"http:\/\/img2.wikia.nocookie.net\/__cb20131101023113\/bravefrontierglobal\/images\/thumb\/e\/e2\/Unit_ills_thum_30112.png\/42px-Unit_ills_thum_30112.png"},{"id":"142","name":"World Tree Altro","text":"World Tree Altro","max_lv":"60","star":"4","element":"Earth","cost":"8","exp_table":"3","icon":"http:\/\/img3.wikia.nocookie.net\/__cb20131101023132\/bravefrontierglobal\/images\/thumb\/5\/5e\/Unit_ills_thum_30113.png\/42px-Unit_ills_thum_30113.png"},{"id":"143","name":"God Tree Eltri","text":"God Tree Eltri","max_lv":"80","star":"5","element":"Earth","cost":"12","exp_table":"3","icon":"http:\/\/img1.wikia.nocookie.net\/__cb20131101023147\/bravefrontierglobal\/images\/thumb\/f\/fa\/Unit_ills_thum_30114.png\/42px-Unit_ills_thum_30114.png"},{"id":"144","name":"Behemoth","text":"Behemoth","max_lv":"40","star":"3","element":"Thunder","cost":"5","exp_table":"3","icon":"http:\/\/img4.wikia.nocookie.net\/__cb20131101023548\/bravefrontierglobal\/images\/thumb\/2\/21\/Unit_ills_thum_40112.png\/42px-Unit_ills_thum_40112.png"},{"id":"145","name":"King Behemoth","text":"King Behemoth","max_lv":"60","star":"4","element":"Thunder","cost":"8","exp_table":"3","icon":"http:\/\/img2.wikia.nocookie.net\/__cb20131101023651\/bravefrontierglobal\/images\/thumb\/4\/48\/Unit_ills_thum_40113.png\/42px-Unit_ills_thum_40113.png"},{"id":"146","name":"Alpha Behemoth","text":"Alpha Behemoth","max_lv":"80","star":"5","element":"Thunder","cost":"12","exp_table":"3","icon":"http:\/\/img2.wikia.nocookie.net\/__cb20131101023715\/bravefrontierglobal\/images\/thumb\/0\/0a\/Unit_ills_thum_40114.png\/42px-Unit_ills_thum_40114.png"},{"id":"147","name":"Wyvern","text":"Wyvern","max_lv":"40","star":"3","element":"Light","cost":"5","exp_table":"3","icon":"http:\/\/img1.wikia.nocookie.net\/__cb20131101025626\/bravefrontierglobal\/images\/thumb\/8\/83\/Unit_ills_thum_50102.png\/42px-Unit_ills_thum_50102.png"},{"id":"148","name":"Bahamut","text":"Bahamut","max_lv":"60","star":"4","element":"Light","cost":"8","exp_table":"3","icon":"http:\/\/img1.wikia.nocookie.net\/__cb20131101025702\/bravefrontierglobal\/images\/thumb\/4\/49\/Unit_ills_thum_50103.png\/42px-Unit_ills_thum_50103.png"},{"id":"149","name":"Rameldria","text":"Rameldria","max_lv":"80","star":"5","element":"Light","cost":"12","exp_table":"3","icon":"http:\/\/img2.wikia.nocookie.net\/__cb20131101025726\/bravefrontierglobal\/images\/thumb\/5\/56\/Unit_ills_thum_50104.png\/42px-Unit_ills_thum_50104.png"},{"id":"150","name":"Memetes","text":"Memetes","max_lv":"40","star":"3","element":"Dark","cost":"5","exp_table":"3","icon":"http:\/\/img1.wikia.nocookie.net\/__cb20131101030037\/bravefrontierglobal\/images\/thumb\/a\/a5\/Unit_ills_thum_60102.png\/42px-Unit_ills_thum_60102.png"},{"id":"151","name":"Hell King Hades","text":"Hell King Hades","max_lv":"60","star":"4","element":"Dark","cost":"8","exp_table":"3","icon":"http:\/\/img1.wikia.nocookie.net\/__cb20131101030058\/bravefrontierglobal\/images\/thumb\/0\/06\/Unit_ills_thum_60103.png\/42px-Unit_ills_thum_60103.png"},{"id":"152","name":"Death God Lodaga","text":"Death God Lodaga","max_lv":"80","star":"5","element":"Dark","cost":"12","exp_table":"3","icon":"http:\/\/img1.wikia.nocookie.net\/__cb20131101030120\/bravefrontierglobal\/images\/thumb\/e\/e6\/Unit_ills_thum_60104.png\/42px-Unit_ills_thum_60104.png"},{"id":"153","name":"Lava","text":"Lava","max_lv":"40","star":"3","element":"Fire","cost":"5","exp_table":"3","icon":"http:\/\/img4.wikia.nocookie.net\/__cb20131101031714\/bravefrontierglobal\/images\/thumb\/4\/43\/Unit_ills_thum_10122.png\/42px-Unit_ills_thum_10122.png"},{"id":"154","name":"Fire Knight Lava","text":"Fire Knight Lava","max_lv":"60","star":"4","element":"Fire","cost":"8","exp_table":"3","icon":"http:\/\/img3.wikia.nocookie.net\/__cb20131101031811\/bravefrontierglobal\/images\/thumb\/5\/5c\/Unit_ills_thum_10123.png\/42px-Unit_ills_thum_10123.png"},{"id":"155","name":"Fire God Lava","text":"Fire God Lava","max_lv":"80","star":"5","element":"Fire","cost":"12","exp_table":"3","icon":"http:\/\/img1.wikia.nocookie.net\/__cb20131101031829\/bravefrontierglobal\/images\/thumb\/c\/c3\/Unit_ills_thum_10124.png\/42px-Unit_ills_thum_10124.png"},{"id":"156","name":"Captain Mega","text":"Captain Mega","max_lv":"40","star":"3","element":"Water","cost":"5","exp_table":"3","icon":"http:\/\/img3.wikia.nocookie.net\/__cb20131101035623\/bravefrontierglobal\/images\/thumb\/9\/9a\/Unit_ills_thum_20122.png\/42px-Unit_ills_thum_20122.png"},{"id":"157","name":"War Captain Mega","text":"War Captain Mega","max_lv":"60","star":"4","element":"Water","cost":"8","exp_table":"3","icon":"http:\/\/img1.wikia.nocookie.net\/__cb20131101035655\/bravefrontierglobal\/images\/thumb\/e\/eb\/Unit_ills_thum_20123.png\/42px-Unit_ills_thum_20123.png"},{"id":"158","name":"Commander Mega","text":"Commander Mega","max_lv":"80","star":"5","element":"Water","cost":"12","exp_table":"3","icon":"http:\/\/img2.wikia.nocookie.net\/__cb20131101035723\/bravefrontierglobal\/images\/thumb\/b\/b8\/Unit_ills_thum_20124.png\/42px-Unit_ills_thum_20124.png"},{"id":"159","name":"Gunner Douglas","text":"Gunner Douglas","max_lv":"40","star":"3","element":"Earth","cost":"5","exp_table":"3","icon":"http:\/\/img1.wikia.nocookie.net\/__cb20131101035806\/bravefrontierglobal\/images\/thumb\/5\/5d\/Unit_ills_thum_30122.png\/42px-Unit_ills_thum_30122.png"},{"id":"160","name":"Gun King Douglas","text":"Gun King Douglas","max_lv":"60","star":"4","element":"Earth","cost":"8","exp_table":"3","icon":"http:\/\/img3.wikia.nocookie.net\/__cb20131101035821\/bravefrontierglobal\/images\/thumb\/8\/85\/Unit_ills_thum_30123.png\/42px-Unit_ills_thum_30123.png"},{"id":"161","name":"Gun God Douglas","text":"Gun God Douglas","max_lv":"80","star":"5","element":"Earth","cost":"12","exp_table":"3","icon":"http:\/\/img4.wikia.nocookie.net\/__cb20131101050951\/bravefrontierglobal\/images\/thumb\/7\/7e\/Unit_ills_thum_30124.png\/42px-Unit_ills_thum_30124.png"},{"id":"162","name":"Emilia","text":"Emilia","max_lv":"40","star":"3","element":"Thunder","cost":"5","exp_table":"3","icon":"http:\/\/img2.wikia.nocookie.net\/__cb20131101080619\/bravefrontierglobal\/images\/thumb\/4\/4d\/Unit_ills_thum_40122.png\/42px-Unit_ills_thum_40122.png"},{"id":"163","name":"Princess Emilia","text":"Princess Emilia","max_lv":"60","star":"4","element":"Thunder","cost":"8","exp_table":"3","icon":"http:\/\/img2.wikia.nocookie.net\/__cb20131101080656\/bravefrontierglobal\/images\/thumb\/4\/49\/Unit_ills_thum_40123.png\/42px-Unit_ills_thum_40123.png"},{"id":"164","name":"Goddess Emilia","text":"Goddess Emilia","max_lv":"80","star":"5","element":"Thunder","cost":"12","exp_table":"3","icon":"http:\/\/img2.wikia.nocookie.net\/__cb20131101080718\/bravefrontierglobal\/images\/thumb\/c\/ce\/Unit_ills_thum_40124.png\/42px-Unit_ills_thum_40124.png"},{"id":"165","name":"Knight Will","text":"Knight Will","max_lv":"40","star":"3","element":"Light","cost":"5","exp_table":"3","icon":"http:\/\/img3.wikia.nocookie.net\/__cb20131101081138\/bravefrontierglobal\/images\/thumb\/9\/9b\/Unit_ills_thum_50112.png\/42px-Unit_ills_thum_50112.png"},{"id":"166","name":"Holy Knight Will","text":"Holy Knight Will","max_lv":"60","star":"4","element":"Light","cost":"8","exp_table":"3","icon":"http:\/\/img3.wikia.nocookie.net\/__cb20131101081226\/bravefrontierglobal\/images\/thumb\/9\/92\/Unit_ills_thum_50113.png\/42px-Unit_ills_thum_50113.png"},{"id":"167","name":"God Knight Will","text":"God Knight Will","max_lv":"80","star":"5","element":"Light","cost":"12","exp_table":"3","icon":"http:\/\/img3.wikia.nocookie.net\/__cb20131101085219\/bravefrontierglobal\/images\/thumb\/7\/7e\/Unit_ills_thum_50114.png\/42px-Unit_ills_thum_50114.png"},{"id":"168","name":"Alice","text":"Alice","max_lv":"40","star":"3","element":"Dark","cost":"5","exp_table":"3","icon":"http:\/\/img1.wikia.nocookie.net\/__cb20131101091137\/bravefrontierglobal\/images\/thumb\/5\/5e\/Unit_ills_thum_60112.png\/42px-Unit_ills_thum_60112.png"},{"id":"169","name":"Scythe Alice","text":"Scythe Alice","max_lv":"60","star":"4","element":"Dark","cost":"8","exp_table":"3","icon":"http:\/\/img2.wikia.nocookie.net\/__cb20131101091154\/bravefrontierglobal\/images\/thumb\/1\/13\/Unit_ills_thum_60113.png\/42px-Unit_ills_thum_60113.png"},{"id":"170","name":"Scythe God Alice","text":"Scythe God Alice","max_lv":"80","star":"5","element":"Dark","cost":"12","exp_table":"3","icon":"http:\/\/img3.wikia.nocookie.net\/__cb20131101091241\/bravefrontierglobal\/images\/thumb\/d\/df\/Unit_ills_thum_60114.png\/42px-Unit_ills_thum_60114.png"},{"id":"171","name":"Fire Nymph","text":"Fire Nymph","max_lv":"1","star":"1","element":"Fire","cost":"2","exp_table":"0","icon":"http:\/\/img4.wikia.nocookie.net\/__cb20131101091426\/bravefrontierglobal\/images\/thumb\/2\/24\/Unit_ills_thum_10130.png\/42px-Unit_ills_thum_10130.png"},{"id":"172","name":"Water Nymph","text":"Water Nymph","max_lv":"1","star":"1","element":"Water","cost":"2","exp_table":"0","icon":"http:\/\/img3.wikia.nocookie.net\/__cb20131101091540\/bravefrontierglobal\/images\/thumb\/8\/8b\/Unit_ills_thum_20130.png\/42px-Unit_ills_thum_20130.png"},{"id":"173","name":"Earth Nymph","text":"Earth Nymph","max_lv":"1","star":"1","element":"Earth","cost":"2","exp_table":"0","icon":"http:\/\/img3.wikia.nocookie.net\/__cb20131101091638\/bravefrontierglobal\/images\/thumb\/e\/e1\/Unit_ills_thum_30130.png\/42px-Unit_ills_thum_30130.png"},{"id":"174","name":"Thunder Nymph","text":"Thunder Nymph","max_lv":"1","star":"1","element":"Thunder","cost":"2","exp_table":"0","icon":"http:\/\/img1.wikia.nocookie.net\/__cb20131101091916\/bravefrontierglobal\/images\/thumb\/9\/9b\/Unit_ills_thum_40130.png\/42px-Unit_ills_thum_40130.png"},{"id":"175","name":"Light Nymph","text":"Light Nymph","max_lv":"1","star":"1","element":"Light","cost":"2","exp_table":"0","icon":"http:\/\/img2.wikia.nocookie.net\/__cb20131101092036\/bravefrontierglobal\/images\/thumb\/f\/fa\/Unit_ills_thum_50120.png\/42px-Unit_ills_thum_50120.png"},{"id":"176","name":"Dark Nymph","text":"Dark Nymph","max_lv":"1","star":"1","element":"Dark","cost":"2","exp_table":"0","icon":"http:\/\/img2.wikia.nocookie.net\/__cb20131101092151\/bravefrontierglobal\/images\/thumb\/c\/ca\/Unit_ills_thum_60120.png\/42px-Unit_ills_thum_60120.png"},{"id":"177","name":"Fire Spirit","text":"Fire Spirit","max_lv":"1","star":"2","element":"Fire","cost":"5","exp_table":"0","icon":"http:\/\/img4.wikia.nocookie.net\/__cb20131101092307\/bravefrontierglobal\/images\/thumb\/f\/fc\/Unit_ills_thum_10131.png\/42px-Unit_ills_thum_10131.png"},{"id":"178","name":"Water Spirit","text":"Water Spirit","max_lv":"1","star":"2","element":"Water","cost":"5","exp_table":"0","icon":"http:\/\/img2.wikia.nocookie.net\/__cb20131101093927\/bravefrontierglobal\/images\/thumb\/c\/c1\/Unit_ills_thum_20131.png\/42px-Unit_ills_thum_20131.png"},{"id":"179","name":"Earth Spirit","text":"Earth Spirit","max_lv":"1","star":"2","element":"Earth","cost":"5","exp_table":"0","icon":"http:\/\/img4.wikia.nocookie.net\/__cb20131101094043\/bravefrontierglobal\/images\/thumb\/d\/d6\/Unit_ills_thum_30131.png\/42px-Unit_ills_thum_30131.png"},{"id":"180","name":"Thunder Spirit","text":"Thunder Spirit","max_lv":"1","star":"2","element":"Thunder","cost":"5","exp_table":"0","icon":"http:\/\/img4.wikia.nocookie.net\/__cb20131101094110\/bravefrontierglobal\/images\/thumb\/8\/84\/Unit_ills_thum_40131.png\/42px-Unit_ills_thum_40131.png"},{"id":"181","name":"Light Spirit","text":"Light Spirit","max_lv":"1","star":"2","element":"Light","cost":"5","exp_table":"0","icon":"http:\/\/img3.wikia.nocookie.net\/__cb20131101094205\/bravefrontierglobal\/images\/thumb\/7\/79\/Unit_ills_thum_50121.png\/42px-Unit_ills_thum_50121.png"},{"id":"182","name":"Dark Spirit","text":"Dark Spirit","max_lv":"1","star":"2","element":"Dark","cost":"5","exp_table":"0","icon":"http:\/\/img2.wikia.nocookie.net\/__cb20131101094228\/bravefrontierglobal\/images\/thumb\/7\/75\/Unit_ills_thum_60121.png\/42px-Unit_ills_thum_60121.png"},{"id":"183","name":"Fire Idol","text":"Fire Idol","max_lv":"1","star":"3","element":"Fire","cost":"8","exp_table":"0","icon":"http:\/\/img1.wikia.nocookie.net\/__cb20131101094458\/bravefrontierglobal\/images\/thumb\/3\/34\/Unit_ills_thum_10132.png\/42px-Unit_ills_thum_10132.png"},{"id":"184","name":"Water Idol","text":"Water Idol","max_lv":"1","star":"3","element":"Water","cost":"8","exp_table":"0","icon":"http:\/\/img2.wikia.nocookie.net\/__cb20131101094535\/bravefrontierglobal\/images\/thumb\/7\/7d\/Unit_ills_thum_20132.png\/42px-Unit_ills_thum_20132.png"},{"id":"185","name":"Earth Idol","text":"Earth Idol","max_lv":"1","star":"3","element":"Earth","cost":"8","exp_table":"0","icon":"http:\/\/img1.wikia.nocookie.net\/__cb20131101094614\/bravefrontierglobal\/images\/thumb\/8\/8b\/Unit_ills_thum_30132.png\/42px-Unit_ills_thum_30132.png"},{"id":"186","name":"Thunder Idol","text":"Thunder Idol","max_lv":"1","star":"3","element":"Thunder","cost":"8","exp_table":"0","icon":"http:\/\/img4.wikia.nocookie.net\/__cb20131101094649\/bravefrontierglobal\/images\/thumb\/7\/78\/Unit_ills_thum_40132.png\/42px-Unit_ills_thum_40132.png"},{"id":"187","name":"Light Idol","text":"Light Idol","max_lv":"1","star":"3","element":"Light","cost":"8","exp_table":"0","icon":"http:\/\/img2.wikia.nocookie.net\/__cb20131101094730\/bravefrontierglobal\/images\/thumb\/f\/f5\/Unit_ills_thum_50122.png\/42px-Unit_ills_thum_50122.png"},{"id":"188","name":"Dark Idol","text":"Dark Idol","max_lv":"1","star":"3","element":"Dark","cost":"8","exp_table":"0","icon":"http:\/\/img3.wikia.nocookie.net\/__cb20131101094802\/bravefrontierglobal\/images\/thumb\/0\/0c\/Unit_ills_thum_60122.png\/42px-Unit_ills_thum_60122.png"},{"id":"189","name":"Fire Totem","text":"Fire Totem","max_lv":"1","star":"4","element":"Fire","cost":"10","exp_table":"0","icon":"http:\/\/img4.wikia.nocookie.net\/__cb20131101095103\/bravefrontierglobal\/images\/thumb\/5\/5d\/Unit_ills_thum_10133.png\/42px-Unit_ills_thum_10133.png"},{"id":"190","name":"Water Totem","text":"Water Totem","max_lv":"1","star":"4","element":"Water","cost":"10","exp_table":"0","icon":"http:\/\/img3.wikia.nocookie.net\/__cb20131101095140\/bravefrontierglobal\/images\/thumb\/a\/a1\/Unit_ills_thum_20133.png\/42px-Unit_ills_thum_20133.png"},{"id":"191","name":"Earth Totem","text":"Earth Totem","max_lv":"1","star":"4","element":"Earth","cost":"10","exp_table":"0","icon":"http:\/\/img1.wikia.nocookie.net\/__cb20131101095211\/bravefrontierglobal\/images\/thumb\/6\/6c\/Unit_ills_thum_30133.png\/42px-Unit_ills_thum_30133.png"},{"id":"192","name":"Thunder Totem","text":"Thunder Totem","max_lv":"1","star":"4","element":"Thunder","cost":"10","exp_table":"0","icon":"http:\/\/img1.wikia.nocookie.net\/__cb20131101095251\/bravefrontierglobal\/images\/thumb\/0\/0c\/Unit_ills_thum_40133.png\/42px-Unit_ills_thum_40133.png"},{"id":"193","name":"Light Totem","text":"Light Totem","max_lv":"1","star":"4","element":"Light","cost":"10","exp_table":"0","icon":"http:\/\/img3.wikia.nocookie.net\/__cb20131101095323\/bravefrontierglobal\/images\/thumb\/2\/27\/Unit_ills_thum_50123.png\/42px-Unit_ills_thum_50123.png"},{"id":"194","name":"Dark Totem","text":"Dark Totem","max_lv":"1","star":"4","element":"Dark","cost":"10","exp_table":"0","icon":"http:\/\/img4.wikia.nocookie.net\/__cb20131101095351\/bravefrontierglobal\/images\/thumb\/e\/e7\/Unit_ills_thum_60123.png\/42px-Unit_ills_thum_60123.png"},{"id":"195","name":"Jewel Ghost","text":"Jewel Ghost","max_lv":"1","star":"2","element":"Light","cost":"3","exp_table":"0","icon":"http:\/\/img1.wikia.nocookie.net\/__cb20131101095547\/bravefrontierglobal\/images\/thumb\/6\/68\/Unit_ills_thum_50131.png\/42px-Unit_ills_thum_50131.png"},{"id":"196","name":"Jewel King","text":"Jewel King","max_lv":"1","star":"3","element":"Light","cost":"6","exp_table":"0","icon":"http:\/\/img1.wikia.nocookie.net\/__cb20131101124745\/bravefrontierglobal\/images\/thumb\/d\/da\/Unit_ills_thum_50132.png\/42px-Unit_ills_thum_50132.png"},{"id":"197","name":"Jewel God","text":"Jewel God","max_lv":"1","star":"4","element":"Light","cost":"9","exp_table":"0","icon":"http:\/\/img4.wikia.nocookie.net\/__cb20131101124818\/bravefrontierglobal\/images\/thumb\/3\/34\/Unit_ills_thum_50133.png\/42px-Unit_ills_thum_50133.png"},{"id":"198","name":"Metal Ghost","text":"Metal Ghost","max_lv":"1","star":"3","element":"Dark","cost":"3","exp_table":"0","icon":"http:\/\/img1.wikia.nocookie.net\/__cb20131101124958\/bravefrontierglobal\/images\/thumb\/a\/ae\/Unit_ills_thum_60132.png\/42px-Unit_ills_thum_60132.png"},{"id":"199","name":"Metal King","text":"Metal King","max_lv":"1","star":"4","element":"Dark","cost":"6","exp_table":"0","icon":"http:\/\/img3.wikia.nocookie.net\/__cb20131101125016\/bravefrontierglobal\/images\/thumb\/9\/95\/Unit_ills_thum_60133.png\/42px-Unit_ills_thum_60133.png"},{"id":"200","name":"Metal God","text":"Metal God","max_lv":"1","star":"5","element":"Dark","cost":"9","exp_table":"0","icon":"http:\/\/img4.wikia.nocookie.net\/__cb20131101125031\/bravefrontierglobal\/images\/thumb\/0\/0b\/Unit_ills_thum_60134.png\/42px-Unit_ills_thum_60134.png"},{"id":"201","name":"Mimic","text":"Mimic","max_lv":"1","star":"3","element":"Dark","cost":"2","exp_table":"0","icon":"http:\/\/img3.wikia.nocookie.net\/__cb20131105082139\/bravefrontierglobal\/images\/thumb\/c\/c3\/Unit_ills_thum_60142.png\/42px-Unit_ills_thum_60142.png"},{"id":"202","name":"Bat Mimic","text":"Bat Mimic","max_lv":"1","star":"4","element":"Dark","cost":"6","exp_table":"0","icon":"http:\/\/img1.wikia.nocookie.net\/__cb20131105082412\/bravefrontierglobal\/images\/thumb\/7\/75\/Unit_ills_thum_60143.png\/42px-Unit_ills_thum_60143.png"},{"id":"203","name":"Blacksmith Galant","text":"Blacksmith Galant","max_lv":"30","star":"2","element":"Fire","cost":"4","exp_table":"2","icon":"http:\/\/img1.wikia.nocookie.net\/__cb20140205033454\/bravefrontierglobal\/images\/thumb\/6\/6d\/Unit_ills_thum_10141.png\/42px-Unit_ills_thum_10141.png"},{"id":"204","name":"Bruiser Galant","text":"Bruiser Galant","max_lv":"40","star":"3","element":"Fire","cost":"6","exp_table":"2","icon":"http:\/\/img1.wikia.nocookie.net\/__cb20140205033517\/bravefrontierglobal\/images\/thumb\/1\/11\/Unit_ills_thum_10142.png\/42px-Unit_ills_thum_10142.png"},{"id":"205","name":"God Arm Galant","text":"God Arm Galant","max_lv":"60","star":"4","element":"Fire","cost":"10","exp_table":"2","icon":"http:\/\/img1.wikia.nocookie.net\/__cb20140205033544\/bravefrontierglobal\/images\/thumb\/9\/9d\/Unit_ills_thum_10143.png\/42px-Unit_ills_thum_10143.png"},{"id":"206","name":"Stya","text":"Stya","max_lv":"30","star":"2","element":"Water","cost":"4","exp_table":"2","icon":"http:\/\/img1.wikia.nocookie.net\/__cb20140115061637\/bravefrontierglobal\/images\/thumb\/1\/16\/Unit_ills_thum_20141.png\/42px-Unit_ills_thum_20141.png"},{"id":"207","name":"Snow Blade Stya","text":"Snow Blade Stya","max_lv":"40","star":"3","element":"Water","cost":"6","exp_table":"2","icon":"http:\/\/img2.wikia.nocookie.net\/__cb20140115061702\/bravefrontierglobal\/images\/thumb\/2\/24\/Unit_ills_thum_20142.png\/42px-Unit_ills_thum_20142.png"},{"id":"208","name":"Frost Queen Stya","text":"Frost Queen Stya","max_lv":"60","star":"4","element":"Water","cost":"10","exp_table":"2","icon":"http:\/\/img3.wikia.nocookie.net\/__cb20140115061819\/bravefrontierglobal\/images\/thumb\/2\/20\/Unit_ills_thum_20143.png\/42px-Unit_ills_thum_20143.png"},{"id":"209","name":"Boxer Nemia","text":"Boxer Nemia","max_lv":"30","star":"2","element":"Earth","cost":"4","exp_table":"2","icon":"http:\/\/img4.wikia.nocookie.net\/__cb20140211092214\/bravefrontierglobal\/images\/thumb\/b\/b7\/Unit_ills_thum_30141.png\/42px-Unit_ills_thum_30141.png"},{"id":"210","name":"Brawler Nemia","text":"Brawler Nemia","max_lv":"40","star":"3","element":"Earth","cost":"6","exp_table":"2","icon":"http:\/\/img4.wikia.nocookie.net\/__cb20140211092234\/bravefrontierglobal\/images\/thumb\/a\/a2\/Unit_ills_thum_30142.png\/42px-Unit_ills_thum_30142.png"},{"id":"211","name":"Gaia Fist Nemia","text":"Gaia Fist Nemia","max_lv":"60","star":"4","element":"Earth","cost":"10","exp_table":"2","icon":"http:\/\/img2.wikia.nocookie.net\/__cb20140211092305\/bravefrontierglobal\/images\/thumb\/0\/00\/Unit_ills_thum_30143.png\/42px-Unit_ills_thum_30143.png"},{"id":"212","name":"Zeln","text":"Zeln","max_lv":"30","star":"2","element":"Thunder","cost":"4","exp_table":"2","icon":"http:\/\/img1.wikia.nocookie.net\/__cb20140211092454\/bravefrontierglobal\/images\/thumb\/f\/fa\/Unit_ills_thum_40141.png\/42px-Unit_ills_thum_40141.png"},{"id":"213","name":"Spark Kick Zeln","text":"Spark Kick Zeln","max_lv":"40","star":"3","element":"Thunder","cost":"6","exp_table":"2","icon":"http:\/\/img2.wikia.nocookie.net\/__cb20140211092511\/bravefrontierglobal\/images\/thumb\/c\/c8\/Unit_ills_thum_40142.png\/42px-Unit_ills_thum_40142.png"},{"id":"214","name":"Thunder Kick Zeln","text":"Thunder Kick Zeln","max_lv":"60","star":"4","element":"Thunder","cost":"10","exp_table":"2","icon":"http:\/\/img2.wikia.nocookie.net\/__cb20140211092526\/bravefrontierglobal\/images\/thumb\/f\/f8\/Unit_ills_thum_40143.png\/42px-Unit_ills_thum_40143.png"},{"id":"215","name":"Traveler Alma","text":"Traveler Alma","max_lv":"30","star":"2","element":"Light","cost":"4","exp_table":"2","icon":"http:\/\/img2.wikia.nocookie.net\/__cb20140115061903\/bravefrontierglobal\/images\/thumb\/7\/71\/Unit_ills_thum_50141.png\/42px-Unit_ills_thum_50141.png"},{"id":"216","name":"Adventurer Alma","text":"Adventurer Alma","max_lv":"40","star":"3","element":"Light","cost":"6","exp_table":"2","icon":"http:\/\/img2.wikia.nocookie.net\/__cb20140115061931\/bravefrontierglobal\/images\/thumb\/f\/fc\/Unit_ills_thum_50142.png\/42px-Unit_ills_thum_50142.png"},{"id":"217","name":"Hero Alma","text":"Hero Alma","max_lv":"60","star":"4","element":"Light","cost":"10","exp_table":"2","icon":"http:\/\/img3.wikia.nocookie.net\/__cb20140115062003\/bravefrontierglobal\/images\/thumb\/0\/08\/Unit_ills_thum_50143.png\/42px-Unit_ills_thum_50143.png"},{"id":"218","name":"Ninja Oboro","text":"Ninja Oboro","max_lv":"30","star":"2","element":"Dark","cost":"4","exp_table":"2","icon":"http:\/\/img1.wikia.nocookie.net\/__cb20140115062033\/bravefrontierglobal\/images\/thumb\/9\/90\/Unit_ills_thum_60151.png\/42px-Unit_ills_thum_60151.png"},{"id":"219","name":"Assassin Oboro","text":"Assassin Oboro","max_lv":"40","star":"3","element":"Dark","cost":"6","exp_table":"2","icon":"http:\/\/img4.wikia.nocookie.net\/__cb20140115062053\/bravefrontierglobal\/images\/thumb\/a\/a4\/Unit_ills_thum_60152.png\/42px-Unit_ills_thum_60152.png"},{"id":"220","name":"Shadow Oboro","text":"Shadow Oboro","max_lv":"60","star":"4","element":"Dark","cost":"10","exp_table":"2","icon":"http:\/\/img4.wikia.nocookie.net\/__cb20140115062123\/bravefrontierglobal\/images\/thumb\/a\/a6\/Unit_ills_thum_60153.png\/42px-Unit_ills_thum_60153.png"},{"id":"221","name":"Lancia","text":"Lancia","max_lv":"40","star":"3","element":"Fire","cost":"5","exp_table":"3","icon":"http:\/\/img2.wikia.nocookie.net\/__cb20140211091817\/bravefrontierglobal\/images\/thumb\/f\/f4\/Unit_ills_thum_10152.png\/42px-Unit_ills_thum_10152.png"},{"id":"222","name":"Hot Chef Lancia","text":"Hot Chef Lancia","max_lv":"60","star":"4","element":"Fire","cost":"8","exp_table":"3","icon":"http:\/\/img3.wikia.nocookie.net\/__cb20140211101456\/bravefrontierglobal\/images\/thumb\/0\/07\/Unit_ills_thum_10153.png\/42px-Unit_ills_thum_10153.png"},{"id":"223","name":"Head Chef Lancia","text":"Head Chef Lancia","max_lv":"80","star":"5","element":"Fire","cost":"12","exp_table":"3","icon":"http:\/\/img2.wikia.nocookie.net\/__cb20140211091856\/bravefrontierglobal\/images\/thumb\/d\/dd\/Unit_ills_thum_10154.png\/42px-Unit_ills_thum_10154.png"},{"id":"224","name":"Elimo","text":"Elimo","max_lv":"40","star":"3","element":"Water","cost":"5","exp_table":"3","icon":"http:\/\/img2.wikia.nocookie.net\/__cb20140211101649\/bravefrontierglobal\/images\/thumb\/d\/d1\/Unit_ills_thum_20152.png\/42px-Unit_ills_thum_20152.png"},{"id":"225","name":"Royal Elimo","text":"Royal Elimo","max_lv":"60","star":"4","element":"Water","cost":"8","exp_table":"3","icon":"http:\/\/img3.wikia.nocookie.net\/__cb20140211091957\/bravefrontierglobal\/images\/thumb\/b\/b4\/Unit_ills_thum_20153.png\/42px-Unit_ills_thum_20153.png"},{"id":"226","name":"Genius Elimo","text":"Genius Elimo","max_lv":"80","star":"5","element":"Water","cost":"12","exp_table":"3","icon":"http:\/\/img3.wikia.nocookie.net\/__cb20140211092011\/bravefrontierglobal\/images\/thumb\/6\/6c\/Unit_ills_thum_20154.png\/42px-Unit_ills_thum_20154.png"},{"id":"227","name":"Pixy Leore","text":"Pixy Leore","max_lv":"40","star":"3","element":"Earth","cost":"5","exp_table":"3","icon":"http:\/\/img1.wikia.nocookie.net\/__cb20140211092103\/bravefrontierglobal\/images\/thumb\/e\/ea\/Unit_ills_thum_30152.png\/42px-Unit_ills_thum_30152.png"},{"id":"228","name":"Pixy Royal Leore","text":"Pixy Royal Leore","max_lv":"60","star":"4","element":"Earth","cost":"8","exp_table":"3","icon":"http:\/\/img3.wikia.nocookie.net\/__cb20140211092117\/bravefrontierglobal\/images\/thumb\/e\/e5\/Unit_ills_thum_30153.png\/42px-Unit_ills_thum_30153.png"},{"id":"229","name":"Pixy King Leore","text":"Pixy King Leore","max_lv":"80","star":"5","element":"Earth","cost":"12","exp_table":"3","icon":"http:\/\/img3.wikia.nocookie.net\/__cb20140211092135\/bravefrontierglobal\/images\/thumb\/5\/53\/Unit_ills_thum_30154.png\/42px-Unit_ills_thum_30154.png"},{"id":"230","name":"Tinkerer Elulu","text":"Tinkerer Elulu","max_lv":"40","star":"3","element":"Thunder","cost":"5","exp_table":"3","icon":"http:\/\/img1.wikia.nocookie.net\/__cb20140211092544\/bravefrontierglobal\/images\/thumb\/f\/fb\/Unit_ills_thum_40152.png\/42px-Unit_ills_thum_40152.png"},{"id":"231","name":"Inventor Elulu","text":"Inventor Elulu","max_lv":"60","star":"4","element":"Thunder","cost":"8","exp_table":"3","icon":"http:\/\/img2.wikia.nocookie.net\/__cb20140211092609\/bravefrontierglobal\/images\/thumb\/5\/52\/Unit_ills_thum_40153.png\/42px-Unit_ills_thum_40153.png"},{"id":"232","name":"Bolt Mallet Elulu","text":"Bolt Mallet Elulu","max_lv":"80","star":"5","element":"Thunder","cost":"12","exp_table":"3","icon":"http:\/\/img4.wikia.nocookie.net\/__cb20140211102027\/bravefrontierglobal\/images\/thumb\/8\/8b\/Unit_ills_thum_40154.png\/42px-Unit_ills_thum_40154.png"},{"id":"233","name":"Knight Aem","text":"Knight Aem","max_lv":"40","star":"3","element":"Light","cost":"5","exp_table":"3","icon":"http:\/\/img4.wikia.nocookie.net\/__cb20140211102113\/bravefrontierglobal\/images\/thumb\/1\/18\/Unit_ills_thum_50152.png\/42px-Unit_ills_thum_50152.png"},{"id":"234","name":"Champion Aem","text":"Champion Aem","max_lv":"60","star":"4","element":"Light","cost":"8","exp_table":"3","icon":"http:\/\/img4.wikia.nocookie.net\/__cb20140211092731\/bravefrontierglobal\/images\/thumb\/3\/32\/Unit_ills_thum_50153.png\/42px-Unit_ills_thum_50153.png"},{"id":"235","name":"Holy Master Aem","text":"Holy Master Aem","max_lv":"80","star":"5","element":"Light","cost":"12","exp_table":"3","icon":"http:\/\/img1.wikia.nocookie.net\/__cb20140211092750\/bravefrontierglobal\/images\/thumb\/0\/00\/Unit_ills_thum_50154.png\/42px-Unit_ills_thum_50154.png"},{"id":"236","name":"Lemia","text":"Lemia","max_lv":"40","star":"3","element":"Dark","cost":"5","exp_table":"3","icon":"http:\/\/img2.wikia.nocookie.net\/__cb20140212013837\/bravefrontierglobal\/images\/thumb\/6\/67\/Unit_ills_thum_60162.png\/42px-Unit_ills_thum_60162.png"},{"id":"237","name":"Necromancer Lemia","text":"Necromancer Lemia","max_lv":"60","star":"4","element":"Dark","cost":"8","exp_table":"3","icon":"http:\/\/img3.wikia.nocookie.net\/__cb20140211092905\/bravefrontierglobal\/images\/thumb\/0\/09\/Unit_ills_thum_60163.png\/42px-Unit_ills_thum_60163.png"},{"id":"238","name":"Soul Keeper Lemia","text":"Soul Keeper Lemia","max_lv":"80","star":"5","element":"Dark","cost":"12","exp_table":"3","icon":"http:\/\/img2.wikia.nocookie.net\/__cb20140211092932\/bravefrontierglobal\/images\/thumb\/b\/b6\/Unit_ills_thum_60164.png\/42px-Unit_ills_thum_60164.png"},{"id":"239","name":"Lorand","text":"Lorand","max_lv":"40","star":"3","element":"Fire","cost":"7","exp_table":"3","icon":"http:\/\/img4.wikia.nocookie.net\/__cb20140219044326\/bravefrontierglobal\/images\/thumb\/8\/8c\/Unit_ills_thum_10162.png\/42px-Unit_ills_thum_10162.png"},{"id":"240","name":"Professor Lorand","text":"Professor Lorand","max_lv":"60","star":"4","element":"Fire","cost":"10","exp_table":"3","icon":"http:\/\/img2.wikia.nocookie.net\/__cb20140219044336\/bravefrontierglobal\/images\/thumb\/c\/ce\/Unit_ills_thum_10163.png\/42px-Unit_ills_thum_10163.png"},{"id":"241","name":"Master Lorand","text":"Master Lorand","max_lv":"80","star":"5","element":"Fire","cost":"15","exp_table":"3","icon":"http:\/\/img2.wikia.nocookie.net\/__cb20140219044346\/bravefrontierglobal\/images\/thumb\/f\/f4\/Unit_ills_thum_10164.png\/42px-Unit_ills_thum_10164.png"},{"id":"242","name":"Dean","text":"Dean","max_lv":"40","star":"3","element":"Water","cost":"7","exp_table":"3","icon":"http:\/\/img3.wikia.nocookie.net\/__cb20140219044412\/bravefrontierglobal\/images\/thumb\/4\/4a\/Unit_ills_thum_20162.png\/42px-Unit_ills_thum_20162.png"},{"id":"243","name":"Ice Mage Dean","text":"Ice Mage Dean","max_lv":"60","star":"4","element":"Water","cost":"10","exp_table":"3","icon":"http:\/\/img1.wikia.nocookie.net\/__cb20140219044428\/bravefrontierglobal\/images\/thumb\/6\/68\/Unit_ills_thum_20163.png\/42px-Unit_ills_thum_20163.png"},{"id":"244","name":"Ice Wizard Dean","text":"Ice Wizard Dean","max_lv":"80","star":"5","element":"Water","cost":"15","exp_table":"3","icon":"http:\/\/img1.wikia.nocookie.net\/__cb20140219044500\/bravefrontierglobal\/images\/thumb\/2\/22\/Unit_ills_thum_20164.png\/42px-Unit_ills_thum_20164.png"},{"id":"245","name":"Edea","text":"Edea","max_lv":"40","star":"3","element":"Earth","cost":"7","exp_table":"3","icon":"http:\/\/img4.wikia.nocookie.net\/__cb20140219044512\/bravefrontierglobal\/images\/thumb\/0\/0b\/Unit_ills_thum_30162.png\/42px-Unit_ills_thum_30162.png"},{"id":"246","name":"Earth Knight Edea","text":"Earth Knight Edea","max_lv":"60","star":"4","element":"Earth","cost":"10","exp_table":"3","icon":"http:\/\/img2.wikia.nocookie.net\/__cb20140219044525\/bravefrontierglobal\/images\/thumb\/2\/28\/Unit_ills_thum_30163.png\/42px-Unit_ills_thum_30163.png"},{"id":"247","name":"Mother Earth Edea","text":"Mother Earth Edea","max_lv":"80","star":"5","element":"Earth","cost":"15","exp_table":"3","icon":"http:\/\/img3.wikia.nocookie.net\/__cb20140219044535\/bravefrontierglobal\/images\/thumb\/0\/0f\/Unit_ills_thum_30164.png\/42px-Unit_ills_thum_30164.png"},{"id":"248","name":"Loch","text":"Loch","max_lv":"40","star":"3","element":"Thunder","cost":"7","exp_table":"3","icon":"http:\/\/img4.wikia.nocookie.net\/__cb20140219044604\/bravefrontierglobal\/images\/thumb\/a\/a4\/Unit_ills_thum_40162.png\/42px-Unit_ills_thum_40162.png"},{"id":"249","name":"Shock Bow Loch","text":"Shock Bow Loch","max_lv":"60","star":"4","element":"Thunder","cost":"10","exp_table":"3","icon":"http:\/\/img1.wikia.nocookie.net\/__cb20140219044614\/bravefrontierglobal\/images\/thumb\/e\/e1\/Unit_ills_thum_40163.png\/42px-Unit_ills_thum_40163.png"},{"id":"250","name":"Zeus Bow Loch","text":"Zeus Bow Loch","max_lv":"80","star":"5","element":"Thunder","cost":"15","exp_table":"3","icon":"http:\/\/img1.wikia.nocookie.net\/__cb20140219044624\/bravefrontierglobal\/images\/thumb\/3\/36\/Unit_ills_thum_40164.png\/42px-Unit_ills_thum_40164.png"},{"id":"254","name":"Fire Ghost","text":"Fire Ghost","max_lv":"1","star":"3","element":"Fire","cost":"3","exp_table":"0","icon":"http:\/\/img1.wikia.nocookie.net\/__cb20140320100516\/bravefrontierglobal\/images\/thumb\/1\/1e\/Unit_ills_thum_10202.png\/42px-Unit_ills_thum_10202.png"},{"id":"255","name":"Fire King","text":"Fire King","max_lv":"1","star":"4","element":"Fire","cost":"6","exp_table":"0","icon":"http:\/\/img3.wikia.nocookie.net\/__cb20140320100538\/bravefrontierglobal\/images\/thumb\/e\/e0\/Unit_ills_thum_10203.png\/42px-Unit_ills_thum_10203.png"},{"id":"256","name":"Fire God","text":"Fire God","max_lv":"1","star":"5","element":"Fire","cost":"9","exp_table":"0","icon":"http:\/\/img2.wikia.nocookie.net\/__cb20140320100554\/bravefrontierglobal\/images\/thumb\/0\/0d\/Unit_ills_thum_10204.png\/42px-Unit_ills_thum_10204.png"},{"id":"257","name":"Water Ghost","text":"Water Ghost","max_lv":"1","star":"3","element":"Water","cost":"3","exp_table":"0","icon":"http:\/\/img2.wikia.nocookie.net\/__cb20140320101031\/bravefrontierglobal\/images\/thumb\/f\/f8\/Unit_ills_thum_20202.png\/42px-Unit_ills_thum_20202.png"},{"id":"258","name":"Water King","text":"Water King","max_lv":"1","star":"4","element":"Water","cost":"6","exp_table":"0","icon":"http:\/\/img2.wikia.nocookie.net\/__cb20140320101045\/bravefrontierglobal\/images\/thumb\/a\/a0\/Unit_ills_thum_20203.png\/42px-Unit_ills_thum_20203.png"},{"id":"259","name":"Water God","text":"Water God","max_lv":"1","star":"5","element":"Water","cost":"9","exp_table":"0","icon":"http:\/\/img4.wikia.nocookie.net\/__cb20140320101057\/bravefrontierglobal\/images\/thumb\/f\/f0\/Unit_ills_thum_20204.png\/42px-Unit_ills_thum_20204.png"},{"id":"260","name":"Earth Ghost","text":"Earth Ghost","max_lv":"1","star":"3","element":"Earth","cost":"3","exp_table":"0","icon":"http:\/\/img1.wikia.nocookie.net\/__cb20140429161036\/bravefrontierglobal\/images\/thumb\/6\/63\/Unit_ills_thum_30202.png\/42px-Unit_ills_thum_30202.png"},{"id":"261","name":"Earth King","text":"Earth King","max_lv":"1","star":"4","element":"Earth","cost":"6","exp_table":"0","icon":"http:\/\/img1.wikia.nocookie.net\/__cb20140429161046\/bravefrontierglobal\/images\/thumb\/1\/1d\/Unit_ills_thum_30203.png\/42px-Unit_ills_thum_30203.png"},{"id":"262","name":"Earth God","text":"Earth God","max_lv":"1","star":"5","element":"Earth","cost":"9","exp_table":"0","icon":"http:\/\/img2.wikia.nocookie.net\/__cb20140429161050\/bravefrontierglobal\/images\/thumb\/8\/8b\/Unit_ills_thum_30204.png\/42px-Unit_ills_thum_30204.png"},{"id":"263","name":"Thunder Ghost","text":"Thunder Ghost","max_lv":"1","star":"3","element":"Thunder","cost":"3","exp_table":"0","icon":"http:\/\/img3.wikia.nocookie.net\/__cb20140429173600\/bravefrontierglobal\/images\/thumb\/3\/37\/Unit_ills_thum_40202.png\/42px-Unit_ills_thum_40202.png"},{"id":"264","name":"Thunder King","text":"Thunder King","max_lv":"1","star":"4","element":"Thunder","cost":"6","exp_table":"0","icon":"http:\/\/img2.wikia.nocookie.net\/__cb20140429173919\/bravefrontierglobal\/images\/thumb\/5\/5f\/Unit_ills_thum_40203.png\/42px-Unit_ills_thum_40203.png"},{"id":"265","name":"Thunder God","text":"Thunder God","max_lv":"1","star":"5","element":"Thunder","cost":"9","exp_table":"0","icon":"http:\/\/img1.wikia.nocookie.net\/__cb20140429173742\/bravefrontierglobal\/images\/thumb\/f\/f6\/Unit_ills_thum_40204.png\/42px-Unit_ills_thum_40204.png"},{"id":"266","name":"Light Ghost","text":"Light Ghost","max_lv":"1","star":"3","element":"Light","cost":"3","exp_table":"0","icon":"http:\/\/img4.wikia.nocookie.net\/__cb20140501161803\/bravefrontierglobal\/images\/thumb\/0\/0f\/Unit_ills_thum_50202.png\/42px-Unit_ills_thum_50202.png"},{"id":"267","name":"Light King","text":"Light King","max_lv":"1","star":"4","element":"Light","cost":"6","exp_table":"0","icon":"http:\/\/img1.wikia.nocookie.net\/__cb20140429154643\/bravefrontierglobal\/images\/thumb\/4\/4b\/Unit_ills_thum_50203.png\/42px-Unit_ills_thum_50203.png"},{"id":"268","name":"Light God","text":"Light God","max_lv":"1","star":"5","element":"Light","cost":"9","exp_table":"0","icon":"http:\/\/img2.wikia.nocookie.net\/__cb20140429154658\/bravefrontierglobal\/images\/thumb\/3\/36\/Unit_ills_thum_50204.png\/42px-Unit_ills_thum_50204.png"},{"id":"269","name":"Orc","text":"Orc","max_lv":"30","star":"2","element":"Fire","cost":"3","exp_table":"1","icon":"http:\/\/img4.wikia.nocookie.net\/__cb20140429155559\/bravefrontierglobal\/images\/thumb\/1\/1e\/Unit_ills_thum_10171.png\/42px-Unit_ills_thum_10171.png"},{"id":"270","name":"Ogre","text":"Ogre","max_lv":"40","star":"3","element":"Fire","cost":"5","exp_table":"1","icon":"http:\/\/img1.wikia.nocookie.net\/__cb20140429155642\/bravefrontierglobal\/images\/thumb\/d\/d6\/Unit_ills_thum_10172.png\/42px-Unit_ills_thum_10172.png"},{"id":"271","name":"Wendigo","text":"Wendigo","max_lv":"30","star":"2","element":"Water","cost":"3","exp_table":"1","icon":"http:\/\/img4.wikia.nocookie.net\/__cb20140429160045\/bravefrontierglobal\/images\/thumb\/9\/97\/Unit_ills_thum_20171.png\/42px-Unit_ills_thum_20171.png"},{"id":"272","name":"Hrungnir","text":"Hrungnir","max_lv":"40","star":"3","element":"Water","cost":"5","exp_table":"1","icon":"http:\/\/img3.wikia.nocookie.net\/__cb20140429160058\/bravefrontierglobal\/images\/thumb\/5\/5d\/Unit_ills_thum_20172.png\/42px-Unit_ills_thum_20172.png"},{"id":"273","name":"Dwarf","text":"Dwarf","max_lv":"30","star":"2","element":"Earth","cost":"3","exp_table":"1","icon":"http:\/\/img4.wikia.nocookie.net\/__cb20140429161558\/bravefrontierglobal\/images\/thumb\/b\/b0\/Unit_ills_thum_30171.png\/42px-Unit_ills_thum_30171.png"},{"id":"274","name":"Dwarf Prince","text":"Dwarf Prince","max_lv":"40","star":"3","element":"Earth","cost":"5","exp_table":"1","icon":"http:\/\/img2.wikia.nocookie.net\/__cb20140429161614\/bravefrontierglobal\/images\/thumb\/8\/8e\/Unit_ills_thum_30172.png\/42px-Unit_ills_thum_30172.png"},{"id":"275","name":"Empusa","text":"Empusa","max_lv":"30","star":"2","element":"Thunder","cost":"3","exp_table":"1","icon":"http:\/\/img2.wikia.nocookie.net\/__cb20140429165604\/bravefrontierglobal\/images\/thumb\/1\/17\/Unit_ills_thum_40171.png\/42px-Unit_ills_thum_40171.png"},{"id":"276","name":"Gorgon","text":"Gorgon","max_lv":"40","star":"3","element":"Thunder","cost":"5","exp_table":"1","icon":"http:\/\/img2.wikia.nocookie.net\/__cb20140429165631\/bravefrontierglobal\/images\/thumb\/b\/bc\/Unit_ills_thum_40172.png\/42px-Unit_ills_thum_40172.png"},{"id":"277","name":"Al-mi'raj","text":"Al-mi'raj","max_lv":"30","star":"2","element":"Light","cost":"3","exp_table":"1","icon":"http:\/\/img2.wikia.nocookie.net\/__cb20140502141014\/bravefrontierglobal\/images\/thumb\/b\/b6\/Unit_ills_thum_50171.png\/42px-Unit_ills_thum_50171.png"},{"id":"278","name":"Cait Sith","text":"Cait Sith","max_lv":"40","star":"3","element":"Light","cost":"5","exp_table":"1","icon":"http:\/\/img3.wikia.nocookie.net\/__cb20140429201229\/bravefrontierglobal\/images\/thumb\/a\/a6\/Unit_ills_thum_50172.png\/42px-Unit_ills_thum_50172.png"},{"id":"279","name":"Imp","text":"Imp","max_lv":"30","star":"2","element":"Dark","cost":"3","exp_table":"1","icon":"http:\/\/img1.wikia.nocookie.net\/__cb20140429173336\/bravefrontierglobal\/images\/thumb\/1\/15\/Unit_ills_thum_60181.png\/42px-Unit_ills_thum_60181.png"},{"id":"280","name":"Incubus","text":"Incubus","max_lv":"40","star":"3","element":"Dark","cost":"5","exp_table":"1","icon":"http:\/\/img1.wikia.nocookie.net\/__cb20140429173342\/bravefrontierglobal\/images\/thumb\/3\/33\/Unit_ills_thum_60182.png\/42px-Unit_ills_thum_60182.png"},{"id":"281","name":"Pyromancer Liza","text":"Pyromancer Liza","max_lv":"40","star":"3","element":"Fire","cost":"6","exp_table":"1","icon":"http:\/\/img3.wikia.nocookie.net\/__cb20140320100238\/bravefrontierglobal\/images\/thumb\/9\/94\/Unit_ills_thum_10042.png\/42px-Unit_ills_thum_10042.png"},{"id":"282","name":"Bishop Merith","text":"Bishop Merith","max_lv":"40","star":"3","element":"Water","cost":"6","exp_table":"1","icon":"http:\/\/img2.wikia.nocookie.net\/__cb20140320100915\/bravefrontierglobal\/images\/thumb\/4\/4d\/Unit_ills_thum_20042.png\/42px-Unit_ills_thum_20042.png"},{"id":"283","name":"Time Lord Claris","text":"Time Lord Claris","max_lv":"40","star":"3","element":"Earth","cost":"6","exp_table":"1","icon":"http:\/\/img2.wikia.nocookie.net\/__cb20140309062620\/bravefrontierglobal\/images\/thumb\/9\/9f\/Unit_ills_thum_30042.png\/42px-Unit_ills_thum_30042.png"},{"id":"284","name":"Royal Dancer May","text":"Royal Dancer May","max_lv":"40","star":"3","element":"Thunder","cost":"6","exp_table":"1","icon":"http:\/\/img3.wikia.nocookie.net\/__cb20140309063631\/bravefrontierglobal\/images\/thumb\/7\/78\/Unit_ills_thum_40042.png\/42px-Unit_ills_thum_40042.png"},{"id":"285","name":"Great Sage Mimir","text":"Great Sage Mimir","max_lv":"40","star":"3","element":"Light","cost":"6","exp_table":"1","icon":"http:\/\/img4.wikia.nocookie.net\/__cb20140309135352\/bravefrontierglobal\/images\/thumb\/1\/1f\/Unit_ills_thum_50042.png\/42px-Unit_ills_thum_50042.png"},{"id":"286","name":"Dark Arts Lily","text":"Dark Arts Lily","max_lv":"40","star":"3","element":"Dark","cost":"6","exp_table":"1","icon":"http:\/\/img2.wikia.nocookie.net\/__cb20140309101245\/bravefrontierglobal\/images\/thumb\/4\/40\/Unit_ills_thum_60042.png\/42px-Unit_ills_thum_60042.png"},{"id":"287","name":"Drake Chief Aisha","text":"Drake Chief Aisha","max_lv":"40","star":"3","element":"Fire","cost":"7","exp_table":"3","icon":"http:\/\/img4.wikia.nocookie.net\/__cb20140320100721\/bravefrontierglobal\/images\/thumb\/7\/7d\/Unit_ills_thum_10212.png\/42px-Unit_ills_thum_10212.png"},{"id":"288","name":"Drake Lord Aisha","text":"Drake Lord Aisha","max_lv":"60","star":"4","element":"Fire","cost":"10","exp_table":"3","icon":"http:\/\/img2.wikia.nocookie.net\/__cb20140429162305\/bravefrontierglobal\/images\/thumb\/7\/71\/Unit_ills_thum_10213.png\/42px-Unit_ills_thum_10213.png"},{"id":"289","name":"Drake Queen Aisha","text":"Drake Queen Aisha","max_lv":"80","star":"5","element":"Fire","cost":"15","exp_table":"3","icon":"http:\/\/img2.wikia.nocookie.net\/__cb20140320100804\/bravefrontierglobal\/images\/thumb\/d\/d0\/Unit_ills_thum_10214.png\/42px-Unit_ills_thum_10214.png"},{"id":"290","name":"Twin Gem Rickel","text":"Twin Gem Rickel","max_lv":"40","star":"3","element":"Water","cost":"7","exp_table":"3","icon":"http:\/\/img2.wikia.nocookie.net\/__cb20140320101151\/bravefrontierglobal\/images\/thumb\/4\/4c\/Unit_ills_thum_20212.png\/42px-Unit_ills_thum_20212.png"},{"id":"291","name":"Twin Flash Rickel","text":"Twin Flash Rickel","max_lv":"60","star":"4","element":"Water","cost":"10","exp_table":"3","icon":"http:\/\/img1.wikia.nocookie.net\/__cb20140320101307\/bravefrontierglobal\/images\/thumb\/4\/48\/Unit_ills_thum_20213.png\/42px-Unit_ills_thum_20213.png"},{"id":"292","name":"Twin Shot Rickel","text":"Twin Shot Rickel","max_lv":"80","star":"5","element":"Water","cost":"15","exp_table":"3","icon":"http:\/\/img4.wikia.nocookie.net\/__cb20140314193648\/bravefrontierglobal\/images\/thumb\/9\/9f\/Unit_ills_thum_20214.png\/42px-Unit_ills_thum_20214.png"},{"id":"293","name":"Twins Il & Mina","text":"Twins Il & Mina","max_lv":"40","star":"3","element":"Earth","cost":"7","exp_table":"3","icon":"http:\/\/img3.wikia.nocookie.net\/__cb20140429163644\/bravefrontierglobal\/images\/thumb\/2\/23\/Unit_ills_thum_30212.png\/42px-Unit_ills_thum_30212.png"},{"id":"294","name":"Earthly Il & Mina","text":"Earthly Il & Mina","max_lv":"60","star":"4","element":"Earth","cost":"10","exp_table":"3","icon":"http:\/\/img2.wikia.nocookie.net\/__cb20140429163319\/bravefrontierglobal\/images\/thumb\/6\/62\/Unit_ills_thum_30213.png\/42px-Unit_ills_thum_30213.png"},{"id":"295","name":"Gemini Il & Mina","text":"Gemini Il & Mina","max_lv":"80","star":"5","element":"Earth","cost":"15","exp_table":"3","icon":"http:\/\/img1.wikia.nocookie.net\/__cb20140429163346\/bravefrontierglobal\/images\/thumb\/c\/cf\/Unit_ills_thum_30214.png\/42px-Unit_ills_thum_30214.png"},{"id":"296","name":"Bolt Pike Amy","text":"Bolt Pike Amy","max_lv":"40","star":"3","element":"Thunder","cost":"7","exp_table":"3","icon":"http:\/\/img2.wikia.nocookie.net\/__cb20140429165121\/bravefrontierglobal\/images\/thumb\/b\/b3\/Unit_ills_thum_40212.png\/42px-Unit_ills_thum_40212.png"},{"id":"297","name":"Bolt Knight Amy","text":"Bolt Knight Amy","max_lv":"60","star":"4","element":"Thunder","cost":"10","exp_table":"3","icon":"http:\/\/img4.wikia.nocookie.net\/__cb20140429165104\/bravefrontierglobal\/images\/thumb\/e\/ee\/Unit_ills_thum_40213.png\/42px-Unit_ills_thum_40213.png"},{"id":"298","name":"Bolt Goddess Amy","text":"Bolt Goddess Amy","max_lv":"80","star":"5","element":"Thunder","cost":"15","exp_table":"3","icon":"http:\/\/img1.wikia.nocookie.net\/__cb20140429165129\/bravefrontierglobal\/images\/thumb\/0\/0f\/Unit_ills_thum_40214.png\/42px-Unit_ills_thum_40214.png"},{"id":"299","name":"Eight Blade Sefia","text":"Eight Blade Sefia","max_lv":"40","star":"3","element":"Light","cost":"7","exp_table":"3","icon":"http:\/\/img4.wikia.nocookie.net\/__cb20140429174820\/bravefrontierglobal\/images\/thumb\/9\/9a\/Unit_ills_thum_50162.png\/42px-Unit_ills_thum_50162.png"},{"id":"300","name":"Blade Storm Sefia","text":"Blade Storm Sefia","max_lv":"60","star":"4","element":"Light","cost":"10","exp_table":"3","icon":"http:\/\/img3.wikia.nocookie.net\/__cb20140429162657\/bravefrontierglobal\/images\/thumb\/8\/8a\/Unit_ills_thum_50163.png\/42px-Unit_ills_thum_50163.png"},{"id":"301","name":"Blade Queen Sefia","text":"Blade Queen Sefia","max_lv":"80","star":"5","element":"Light","cost":"15","exp_table":"3","icon":"http:\/\/img3.wikia.nocookie.net\/__cb20140429162643\/bravefrontierglobal\/images\/thumb\/9\/98\/Unit_ills_thum_50164.png\/42px-Unit_ills_thum_50164.png"},{"id":"302","name":"Kikuri","text":"Kikuri","max_lv":"40","star":"3","element":"Dark","cost":"7","exp_table":"3","icon":"http:\/\/img3.wikia.nocookie.net\/__cb20140429171010\/bravefrontierglobal\/images\/thumb\/e\/e3\/Unit_ills_thum_60172.png\/42px-Unit_ills_thum_60172.png"},{"id":"303","name":"Goth Kikuri","text":"Goth Kikuri","max_lv":"60","star":"4","element":"Dark","cost":"10","exp_table":"3","icon":"http:\/\/img4.wikia.nocookie.net\/__cb20140429171038\/bravefrontierglobal\/images\/thumb\/6\/60\/Unit_ills_thum_60173.png\/42px-Unit_ills_thum_60173.png"},{"id":"304","name":"Goth Idol Kikuri","text":"Goth Idol Kikuri","max_lv":"80","star":"5","element":"Dark","cost":"15","exp_table":"3","icon":"http:\/\/img1.wikia.nocookie.net\/__cb20140429170915\/bravefrontierglobal\/images\/thumb\/1\/15\/Unit_ills_thum_60174.png\/42px-Unit_ills_thum_60174.png"},{"id":"305","name":"Dragon Mimic","text":"Dragon Mimic","max_lv":"1","star":"5","element":"Dark","cost":"10","exp_table":"0","icon":"http:\/\/img3.wikia.nocookie.net\/__cb20140318144130\/bravefrontierglobal\/images\/thumb\/d\/db\/Unit_ills_thum_60144.png\/42px-Unit_ills_thum_60144.png"},{"id":"306","name":"Fire Pot","text":"Fire Pot","max_lv":"1","star":"3","element":"Fire","cost":"1","exp_table":"0","icon":"http:\/\/img2.wikia.nocookie.net\/__cb20140430151610\/bravefrontierglobal\/images\/thumb\/d\/df\/Unit_ills_thum_10191.png\/42px-Unit_ills_thum_10191.png"},{"id":"307","name":"Water Pot","text":"Water Pot","max_lv":"1","star":"3","element":"Water","cost":"1","exp_table":"0","icon":"http:\/\/img3.wikia.nocookie.net\/__cb20140320101013\/bravefrontierglobal\/images\/thumb\/6\/60\/Unit_ills_thum_20191.png\/42px-Unit_ills_thum_20191.png"},{"id":"308","name":"Earth Pot","text":"Earth Pot","max_lv":"1","star":"3","element":"Earth","cost":"1","exp_table":"0","icon":"http:\/\/img4.wikia.nocookie.net\/__cb20140429170515\/bravefrontierglobal\/images\/thumb\/6\/61\/Unit_ills_thum_30191.png\/42px-Unit_ills_thum_30191.png"},{"id":"309","name":"Thunder Pot","text":"Thunder Pot","max_lv":"1","star":"3","element":"Thunder","cost":"1","exp_table":"0","icon":"http:\/\/img2.wikia.nocookie.net\/__cb20140429170456\/bravefrontierglobal\/images\/thumb\/6\/6b\/Unit_ills_thum_40191.png\/42px-Unit_ills_thum_40191.png"},{"id":"310","name":"Light Pot","text":"Light Pot","max_lv":"1","star":"3","element":"Light","cost":"1","exp_table":"0","icon":"http:\/\/img4.wikia.nocookie.net\/__cb20140429170551\/bravefrontierglobal\/images\/thumb\/f\/fa\/Unit_ills_thum_50191.png\/42px-Unit_ills_thum_50191.png"},{"id":"311","name":"Dark Pot","text":"Dark Pot","max_lv":"1","star":"3","element":"Dark","cost":"1","exp_table":"0","icon":"http:\/\/img3.wikia.nocookie.net\/__cb20140429170605\/bravefrontierglobal\/images\/thumb\/8\/81\/Unit_ills_thum_60201.png\/42px-Unit_ills_thum_60201.png"},{"id":"312","name":"Great Thief Leon","text":"Great Thief Leon","max_lv":"60","star":"4","element":"Fire","cost":"9","exp_table":"1","icon":"http:\/\/img3.wikia.nocookie.net\/__cb20140320100301\/bravefrontierglobal\/images\/thumb\/a\/a8\/Unit_ills_thum_10063.png\/42px-Unit_ills_thum_10063.png"},{"id":"313","name":"Sea Prince Verica","text":"Sea Prince Verica","max_lv":"60","star":"4","element":"Water","cost":"9","exp_table":"1","icon":"http:\/\/img3.wikia.nocookie.net\/__cb20140309144236\/bravefrontierglobal\/images\/thumb\/8\/8f\/Unit_ills_thum_20063.png\/42px-Unit_ills_thum_20063.png"},{"id":"314","name":"Wild Bandit Zaza","text":"Wild Bandit Zaza","max_lv":"60","star":"4","element":"Earth","cost":"9","exp_table":"1","icon":"http:\/\/img3.wikia.nocookie.net\/__cb20140309144410\/bravefrontierglobal\/images\/thumb\/e\/e2\/Unit_ills_thum_30063.png\/42px-Unit_ills_thum_30063.png"},{"id":"315","name":"Sky Emperor Grafl","text":"Sky Emperor Grafl","max_lv":"60","star":"4","element":"Thunder","cost":"9","exp_table":"1","icon":"http:\/\/img3.wikia.nocookie.net\/__cb20140310134654\/bravefrontierglobal\/images\/thumb\/1\/12\/Unit_ills_thum_40063.png\/42px-Unit_ills_thum_40063.png"},{"id":"316","name":"Disciple Zebra","text":"Disciple Zebra","max_lv":"60","star":"4","element":"Dark","cost":"10","exp_table":"2","icon":"http:\/\/img4.wikia.nocookie.net\/__cb20140429171502\/bravefrontierglobal\/images\/thumb\/d\/d0\/Unit_ills_thum_60233.png\/42px-Unit_ills_thum_60233.png"},{"id":"317","name":"Mad God Zebra","text":"Mad God Zebra","max_lv":"80","star":"5","element":"Dark","cost":"15","exp_table":"2","icon":"http:\/\/img4.wikia.nocookie.net\/__cb20140429171451\/bravefrontierglobal\/images\/thumb\/9\/9a\/Unit_ills_thum_60234.png\/42px-Unit_ills_thum_60234.png"},{"id":"318","name":"Swordswoman Seria","text":"Swordswoman Seria","max_lv":"60","star":"4","element":"Fire","cost":"10","exp_table":"2","icon":"http:\/\/img4.wikia.nocookie.net\/__cb20140320100837\/bravefrontierglobal\/images\/thumb\/2\/2e\/Unit_ills_thum_10233.png\/42px-Unit_ills_thum_10233.png"},{"id":"319","name":"Blade God Seria","text":"Blade God Seria","max_lv":"80","star":"5","element":"Fire","cost":"15","exp_table":"2","icon":"http:\/\/img3.wikia.nocookie.net\/__cb20140320100852\/bravefrontierglobal\/images\/thumb\/7\/7c\/Unit_ills_thum_10234.png\/42px-Unit_ills_thum_10234.png"},{"id":"320","name":"Beast King Zegar","text":"Beast King Zegar","max_lv":"80","star":"5","element":"Fire","cost":"14","exp_table":"2","icon":"http:\/\/img1.wikia.nocookie.net\/__cb20140411005225\/bravefrontierglobal\/images\/thumb\/6\/63\/Unit_ills_thum_10024.png\/42px-Unit_ills_thum_10024.png"},{"id":"321","name":"Dragon Hero Zephu","text":"Dragon Hero Zephu","max_lv":"80","star":"5","element":"Water","cost":"14","exp_table":"2","icon":"http:\/\/img4.wikia.nocookie.net\/__cb20140411005257\/bravefrontierglobal\/images\/thumb\/f\/fa\/Unit_ills_thum_20024.png\/42px-Unit_ills_thum_20024.png"},{"id":"322","name":"Bow God Lario","text":"Bow God Lario","max_lv":"80","star":"5","element":"Earth","cost":"14","exp_table":"2","icon":"http:\/\/img4.wikia.nocookie.net\/__cb20140411005455\/bravefrontierglobal\/images\/thumb\/9\/9c\/Unit_ills_thum_30024.png\/42px-Unit_ills_thum_30024.png"},{"id":"323","name":"General Weiss","text":"General Weiss","max_lv":"80","star":"5","element":"Thunder","cost":"14","exp_table":"2","icon":"http:\/\/img1.wikia.nocookie.net\/__cb20140411005528\/bravefrontierglobal\/images\/thumb\/1\/16\/Unit_ills_thum_40024.png\/42px-Unit_ills_thum_40024.png"},{"id":"324","name":"Holy Empress Luna","text":"Holy Empress Luna","max_lv":"80","star":"5","element":"Light","cost":"14","exp_table":"2","icon":"http:\/\/img2.wikia.nocookie.net\/__cb20140411005608\/bravefrontierglobal\/images\/thumb\/6\/66\/Unit_ills_thum_50024.png\/42px-Unit_ills_thum_50024.png"},{"id":"325","name":"Ryujin Mifune","text":"Ryujin Mifune","max_lv":"80","star":"5","element":"Dark","cost":"14","exp_table":"2","icon":"http:\/\/img2.wikia.nocookie.net\/__cb20140411005640\/bravefrontierglobal\/images\/thumb\/b\/b2\/Unit_ills_thum_60024.png\/42px-Unit_ills_thum_60024.png"},{"id":"326","name":"Magma Knight Agni","text":"Magma Knight Agni","max_lv":"80","star":"5","element":"Fire","cost":"13","exp_table":"2","icon":"http:\/\/img3.wikia.nocookie.net\/__cb20140411005920\/bravefrontierglobal\/images\/thumb\/c\/c9\/Unit_ills_thum_10104.png\/42px-Unit_ills_thum_10104.png"},{"id":"327","name":"Ice Knight Sergio","text":"Ice Knight Sergio","max_lv":"80","star":"5","element":"Water","cost":"13","exp_table":"2","icon":"http:\/\/img3.wikia.nocookie.net\/__cb20140411010030\/bravefrontierglobal\/images\/thumb\/9\/95\/Unit_ills_thum_20104.png\/42px-Unit_ills_thum_20104.png"},{"id":"328","name":"Empress Lidith","text":"Empress Lidith","max_lv":"80","star":"5","element":"Earth","cost":"13","exp_table":"2","icon":"http:\/\/img1.wikia.nocookie.net\/__cb20140411010111\/bravefrontierglobal\/images\/thumb\/a\/a1\/Unit_ills_thum_30104.png\/42px-Unit_ills_thum_30104.png"},{"id":"329","name":"Sky Legend Falma","text":"Sky Legend Falma","max_lv":"80","star":"5","element":"Thunder","cost":"13","exp_table":"2","icon":"http:\/\/img2.wikia.nocookie.net\/__cb20140411010245\/bravefrontierglobal\/images\/thumb\/3\/3c\/Unit_ills_thum_50094.png\/42px-Unit_ills_thum_50094.png"},{"id":"330","name":"Pistol God Heidt","text":"Pistol God Heidt","max_lv":"80","star":"5","element":"Light","cost":"13","exp_table":"2","icon":"http:\/\/img2.wikia.nocookie.net\/__cb20140411010245\/bravefrontierglobal\/images\/thumb\/3\/3c\/Unit_ills_thum_50094.png\/42px-Unit_ills_thum_50094.png"},{"id":"331","name":"Executioner Shida","text":"Executioner Shida","max_lv":"80","star":"5","element":"Dark","cost":"13","exp_table":"2","icon":"http:\/\/img2.wikia.nocookie.net\/__cb20140411010245\/bravefrontierglobal\/images\/thumb\/3\/3c\/Unit_ills_thum_50094.png\/42px-Unit_ills_thum_50094.png"},{"id":"332","name":"Miracle Totem","text":"Miracle Totem","max_lv":"1","star":"5","element":"Light","cost":"1","exp_table":"0","icon":"http:\/\/img2.wikia.nocookie.net\/__cb20140429172548\/bravefrontierglobal\/images\/thumb\/b\/b0\/Unit_ills_thum_50354.png\/42px-Unit_ills_thum_50354.png"},{"id":"333","name":"Burst Frog","text":"Burst Frog","max_lv":"1","star":"3","element":"Fire","cost":"1","exp_table":"0","icon":"http:\/\/img2.wikia.nocookie.net\/__cb20140413215412\/bravefrontierglobal\/images\/thumb\/a\/a9\/Unit_ills_thum_10312.png\/42px-Unit_ills_thum_10312.png"},{"id":"334","name":"Brave Knight Karl","text":"Brave Knight Karl","max_lv":"60","star":"4","element":"Water","cost":"12","exp_table":"3","icon":"http:\/\/img3.wikia.nocookie.net\/__cb20140429172356\/bravefrontierglobal\/images\/thumb\/1\/16\/Unit_ills_thum_20233.png\/42px-Unit_ills_thum_20233.png"},{"id":"335","name":"Ice Warrior Karl","text":"Ice Warrior Karl","max_lv":"80","star":"5","element":"Water","cost":"20","exp_table":"3","icon":"http:\/\/img4.wikia.nocookie.net\/__cb20140429172353\/bravefrontierglobal\/images\/thumb\/0\/00\/Unit_ills_thum_20234.png\/42px-Unit_ills_thum_20234.png"},{"id":"336","name":"Lugina","text":"Lugina","max_lv":"60","star":"4","element":"Earth","cost":"10","exp_table":"3","icon":"http:\/\/img3.wikia.nocookie.net\/__cb20140416125432\/bravefrontierglobal\/images\/thumb\/6\/6a\/Unit_ills_thum_30233.png\/42px-Unit_ills_thum_30233.png"},{"id":"337","name":"Gaia King Lugina","text":"Gaia King Lugina","max_lv":"80","star":"5","element":"Earth","cost":"15","exp_table":"3","icon":"http:\/\/img2.wikia.nocookie.net\/__cb20140416125508\/bravefrontierglobal\/images\/thumb\/2\/27\/Unit_ills_thum_30234.png\/42px-Unit_ills_thum_30234.png"},{"id":"338","name":"Holy Flame Vargas","text":"Holy Flame Vargas","max_lv":"100","star":"6","element":"Fire","cost":"20","exp_table":"1","icon":"http:\/\/img2.wikia.nocookie.net\/__cb20140411011915\/bravefrontierglobal\/images\/thumb\/8\/8e\/Unit_ills_thum_10015.png\/42px-Unit_ills_thum_10015.png"},{"id":"339","name":"Holy Ice Selena","text":"Holy Ice Selena","max_lv":"100","star":"6","element":"Water","cost":"20","exp_table":"1","icon":"http:\/\/img3.wikia.nocookie.net\/__cb20140411011945\/bravefrontierglobal\/images\/thumb\/a\/a5\/Unit_ills_thum_20015.png\/42px-Unit_ills_thum_20015.png"},{"id":"340","name":"Holy Earth Lance","text":"Holy Earth Lance","max_lv":"100","star":"6","element":"Earth","cost":"20","exp_table":"1","icon":"http:\/\/img3.wikia.nocookie.net\/__cb20140411012139\/bravefrontierglobal\/images\/thumb\/e\/e2\/Unit_ills_thum_30015.png\/42px-Unit_ills_thum_30015.png"},{"id":"341","name":"Holy Thunder Eze","text":"Holy Thunder Eze","max_lv":"100","star":"6","element":"Thunder","cost":"20","exp_table":"1","icon":"http:\/\/img1.wikia.nocookie.net\/__cb20140411012201\/bravefrontierglobal\/images\/thumb\/c\/c7\/Unit_ills_thum_40015.png\/42px-Unit_ills_thum_40015.png"},{"id":"342","name":"Holy Light Atro","text":"Holy Light Atro","max_lv":"100","star":"6","element":"Light","cost":"20","exp_table":"1","icon":"http:\/\/img2.wikia.nocookie.net\/__cb20140411012233\/bravefrontierglobal\/images\/thumb\/f\/f9\/Unit_ills_thum_50015.png\/42px-Unit_ills_thum_50015.png"},{"id":"343","name":"Unholy Magress","text":"Unholy Magress","max_lv":"100","star":"6","element":"Dark","cost":"20","exp_table":"1","icon":"http:\/\/img2.wikia.nocookie.net\/__cb20140411012247\/bravefrontierglobal\/images\/thumb\/7\/76\/Unit_ills_thum_60015.png\/42px-Unit_ills_thum_60015.png"},{"id":"344","name":"Keymaster Gilnea","text":"Keymaster Gilnea","max_lv":"80","star":"5","element":"Light","cost":"16","exp_table":"3","icon":"http:\/\/img3.wikia.nocookie.net\/__cb20140503041338\/bravefrontierglobal\/images\/thumb\/e\/e4\/Unit_ills_thum_50344.png\/42px-Unit_ills_thum_50344.png"},{"id":"346","name":"Red Axe Michele","text":"Red Axe Michele","max_lv":"60","star":"4","element":"Fire","cost":"8","exp_table":"3","icon":"http:\/\/img4.wikia.nocookie.net\/__cb20140414095332\/bravefrontierglobal\/images\/thumb\/1\/11\/Unit_ills_thum_10253.png\/42px-Unit_ills_thum_10253.png"},{"id":"347","name":"Lotus Axe Michele","text":"Lotus Axe Michele","max_lv":"80","star":"5","element":"Fire","cost":"13","exp_table":"3","icon":"http:\/\/img2.wikia.nocookie.net\/__cb20140413163642\/bravefrontierglobal\/images\/thumb\/d\/de\/Unit_ills_thum_10254.png\/42px-Unit_ills_thum_10254.png"},{"id":"348","name":"Polar Angel Tiara","text":"Polar Angel Tiara","max_lv":"60","star":"4","element":"Water","cost":"8","exp_table":"3","icon":"http:\/\/img2.wikia.nocookie.net\/__cb20140414095303\/bravefrontierglobal\/images\/thumb\/8\/87\/Unit_ills_thum_20253.png\/42px-Unit_ills_thum_20253.png"},{"id":"349","name":"Ice Apostle Tiara","text":"Ice Apostle Tiara","max_lv":"80","star":"5","element":"Water","cost":"13","exp_table":"3","icon":"http:\/\/img4.wikia.nocookie.net\/__cb20140413163637\/bravefrontierglobal\/images\/thumb\/2\/23\/Unit_ills_thum_20254.png\/42px-Unit_ills_thum_20254.png"},{"id":"350","name":"Scar Blade Zelban","text":"Scar Blade Zelban","max_lv":"60","star":"4","element":"Earth","cost":"8","exp_table":"3","icon":"http:\/\/img1.wikia.nocookie.net\/__cb20140414095222\/bravefrontierglobal\/images\/thumb\/8\/88\/Unit_ills_thum_30253.png\/42px-Unit_ills_thum_30253.png"},{"id":"351","name":"Blade Hero Zelban","text":"Blade Hero Zelban","max_lv":"80","star":"5","element":"Earth","cost":"13","exp_table":"3","icon":"http:\/\/img1.wikia.nocookie.net\/__cb20140413163632\/bravefrontierglobal\/images\/thumb\/e\/e5\/Unit_ills_thum_30254.png\/42px-Unit_ills_thum_30254.png"},{"id":"352","name":"Drakeborn Lodin","text":"Drakeborn Lodin","max_lv":"60","star":"4","element":"Thunder","cost":"8","exp_table":"3","icon":"http:\/\/img3.wikia.nocookie.net\/__cb20140414095414\/bravefrontierglobal\/images\/thumb\/a\/af\/Unit_ills_thum_40253.png\/42px-Unit_ills_thum_40253.png"},{"id":"353","name":"Drake God Lodin","text":"Drake God Lodin","max_lv":"80","star":"5","element":"Thunder","cost":"13","exp_table":"3","icon":"http:\/\/img2.wikia.nocookie.net\/__cb20140413163626\/bravefrontierglobal\/images\/thumb\/2\/2f\/Unit_ills_thum_40254.png\/42px-Unit_ills_thum_40254.png"},{"id":"354","name":"Legionary Melchio","text":"Legionary Melchio","max_lv":"60","star":"4","element":"Light","cost":"8","exp_table":"3","icon":"http:\/\/img3.wikia.nocookie.net\/__cb20140429172028\/bravefrontierglobal\/images\/thumb\/7\/7d\/Unit_ills_thum_50273.png\/42px-Unit_ills_thum_50273.png"},{"id":"355","name":"Centurion Melchio","text":"Centurion Melchio","max_lv":"80","star":"5","element":"Light","cost":"13","exp_table":"3","icon":"http:\/\/img2.wikia.nocookie.net\/__cb20140429172036\/bravefrontierglobal\/images\/thumb\/9\/95\/Unit_ills_thum_50274.png\/42px-Unit_ills_thum_50274.png"},{"id":"356","name":"Duel-GX","text":"Duel-GX","max_lv":"60","star":"4","element":"Dark","cost":"8","exp_table":"3","icon":"http:\/\/img1.wikia.nocookie.net\/__cb20140413163024\/bravefrontierglobal\/images\/thumb\/1\/1f\/Unit_ills_thum_60253.png\/42px-Unit_ills_thum_60253.png"},{"id":"357","name":"Duel-GX II","text":"Duel-GX II","max_lv":"80","star":"5","element":"Dark","cost":"13","exp_table":"3","icon":"http:\/\/img2.wikia.nocookie.net\/__cb20140413163050\/bravefrontierglobal\/images\/thumb\/0\/09\/Unit_ills_thum_60254.png\/42px-Unit_ills_thum_60254.png"},{"id":"358","name":"Malvan","text":"Malvan","max_lv":"60","star":"4","element":"Fire","cost":"8","exp_table":"1","icon":"http:\/\/img2.wikia.nocookie.net\/__cb20140419170508\/bravefrontierglobal\/images\/thumb\/6\/6b\/Unit_ills_thum_10083.png\/42px-Unit_ills_thum_10083.png"},{"id":"359","name":"Legnaura","text":"Legnaura","max_lv":"60","star":"4","element":"Water","cost":"8","exp_table":"1","icon":"http:\/\/img1.wikia.nocookie.net\/__cb20140419170619\/bravefrontierglobal\/images\/thumb\/e\/e8\/Unit_ills_thum_20083.png\/42px-Unit_ills_thum_20083.png"},{"id":"360","name":"Xipe Totec","text":"Xipe Totec","max_lv":"60","star":"4","element":"Earth","cost":"8","exp_table":"1","icon":"http:\/\/img3.wikia.nocookie.net\/__cb20140419170712\/bravefrontierglobal\/images\/thumb\/a\/a0\/Unit_ills_thum_30083.png\/42px-Unit_ills_thum_30083.png"},{"id":"361","name":"Crow Tengu","text":"Crow Tengu","max_lv":"60","star":"4","element":"Thunder","cost":"8","exp_table":"1","icon":"http:\/\/img4.wikia.nocookie.net\/__cb20140419170838\/bravefrontierglobal\/images\/thumb\/f\/fd\/Unit_ills_thum_40083.png\/42px-Unit_ills_thum_40083.png"},{"id":"362","name":"Saint Maria","text":"Saint Maria","max_lv":"60","star":"4","element":"Light","cost":"8","exp_table":"1","icon":"http:\/\/img1.wikia.nocookie.net\/__cb20140419170939\/bravefrontierglobal\/images\/thumb\/4\/47\/Unit_ills_thum_50073.png\/42px-Unit_ills_thum_50073.png"},{"id":"363","name":"Nyx","text":"Nyx","max_lv":"60","star":"4","element":"Dark","cost":"8","exp_table":"1","icon":"http:\/\/img1.wikia.nocookie.net\/__cb20140419171023\/bravefrontierglobal\/images\/thumb\/6\/64\/Unit_ills_thum_60073.png\/42px-Unit_ills_thum_60073.png"},{"id":"364","name":"Dalimaone","text":"Dalimaone","max_lv":"80","star":"5","element":"Fire","cost":"12","exp_table":"2","icon":"http:\/\/img3.wikia.nocookie.net\/__cb20140419171150\/bravefrontierglobal\/images\/thumb\/a\/ac\/Unit_ills_thum_10094.png\/42px-Unit_ills_thum_10094.png"},{"id":"365","name":"Meltia","text":"Meltia","max_lv":"80","star":"5","element":"Water","cost":"12","exp_table":"2","icon":"http:\/\/img4.wikia.nocookie.net\/__cb20140419172358\/bravefrontierglobal\/images\/thumb\/3\/37\/Unit_ills_thum_20094.png\/42px-Unit_ills_thum_20094.png"},{"id":"366","name":"Lemenara","text":"Lemenara","max_lv":"80","star":"5","element":"Earth","cost":"12","exp_table":"2","icon":"http:\/\/img4.wikia.nocookie.net\/__cb20140419172502\/bravefrontierglobal\/images\/thumb\/1\/14\/Unit_ills_thum_30094.png\/42px-Unit_ills_thum_30094.png"},{"id":"367","name":"Zazabis","text":"Zazabis","max_lv":"80","star":"5","element":"Thunder","cost":"12","exp_table":"2","icon":"http:\/\/img3.wikia.nocookie.net\/__cb20140419172555\/bravefrontierglobal\/images\/thumb\/c\/c3\/Unit_ills_thum_40094.png\/42px-Unit_ills_thum_40094.png"},{"id":"368","name":"Legendary Jona","text":"Legendary Jona","max_lv":"80","star":"5","element":"Light","cost":"12","exp_table":"2","icon":"http:\/\/img3.wikia.nocookie.net\/__cb20140419172638\/bravefrontierglobal\/images\/thumb\/c\/cf\/Unit_ills_thum_50084.png\/42px-Unit_ills_thum_50084.png"},{"id":"369","name":"Legion","text":"Legion","max_lv":"80","star":"5","element":"Dark","cost":"12","exp_table":"2","icon":"http:\/\/img1.wikia.nocookie.net\/__cb20140419172726\/bravefrontierglobal\/images\/thumb\/d\/d9\/Unit_ills_thum_60084.png\/42px-Unit_ills_thum_60084.png"},{"id":"370","name":"Phoenix Reborn","text":"Phoenix Reborn","max_lv":"100","star":"6","element":"Fire","cost":"22","exp_table":"3","icon":"http:\/\/img1.wikia.nocookie.net\/__cb20140420024432\/bravefrontierglobal\/images\/thumb\/3\/3f\/Unit_ills_thum_10115.png\/42px-Unit_ills_thum_10115.png"},{"id":"371","name":"Felneus","text":"Felneus","max_lv":"100","star":"6","element":"Water","cost":"22","exp_table":"3","icon":"http:\/\/img2.wikia.nocookie.net\/__cb20140420024637\/bravefrontierglobal\/images\/thumb\/a\/a8\/Unit_ills_thum_20115.png\/42px-Unit_ills_thum_20115.png"},{"id":"372","name":"Alpha Tree Altri","text":"Alpha Tree Altri","max_lv":"100","star":"6","element":"Earth","cost":"22","exp_table":"3","icon":"http:\/\/img3.wikia.nocookie.net\/__cb20140420024737\/bravefrontierglobal\/images\/thumb\/1\/12\/Unit_ills_thum_30115.png\/42px-Unit_ills_thum_30115.png"},{"id":"373","name":"Omega Behemoth","text":"Omega Behemoth","max_lv":"100","star":"6","element":"Thunder","cost":"22","exp_table":"3","icon":"http:\/\/img2.wikia.nocookie.net\/__cb20140420024839\/bravefrontierglobal\/images\/thumb\/a\/a3\/Unit_ills_thum_40115.png\/42px-Unit_ills_thum_40115.png"},{"id":"374","name":"Duelmex","text":"Duelmex","max_lv":"100","star":"6","element":"Light","cost":"22","exp_table":"3","icon":"http:\/\/img2.wikia.nocookie.net\/__cb20140420024940\/bravefrontierglobal\/images\/thumb\/1\/1d\/Unit_ills_thum_50105.png\/42px-Unit_ills_thum_50105.png"},{"id":"375","name":"Hellborn Dilias","text":"Hellborn Dilias","max_lv":"100","star":"6","element":"Dark","cost":"22","exp_table":"3","icon":"http:\/\/img2.wikia.nocookie.net\/__cb20140420025041\/bravefrontierglobal\/images\/thumb\/a\/af\/Unit_ills_thum_60105.png\/42px-Unit_ills_thum_60105.png"},{"id":"377","name":"War Demon Vishra","text":"War Demon Vishra","max_lv":"60","star":"4","element":"Fire","cost":"10","exp_table":"3","icon":"http:\/\/img2.wikia.nocookie.net\/__cb20140428050007\/bravefrontierglobal\/images\/thumb\/5\/53\/Unit_ills_thum_10283.png\/42px-Unit_ills_thum_10283.png"},{"id":"378","name":"Rakshasa Vishra","text":"Rakshasa Vishra","max_lv":"80","star":"5","element":"Fire","cost":"15","exp_table":"3","icon":"http:\/\/img3.wikia.nocookie.net\/__cb20140428050017\/bravefrontierglobal\/images\/thumb\/9\/9c\/Unit_ills_thum_10284.png\/42px-Unit_ills_thum_10284.png"},{"id":"379","name":"Hail Bot Reeze","text":"Hail Bot Reeze","max_lv":"60","star":"4","element":"Water","cost":"10","exp_table":"3","icon":"http:\/\/img4.wikia.nocookie.net\/__cb20140428050022\/bravefrontierglobal\/images\/thumb\/d\/d9\/Unit_ills_thum_20283.png\/42px-Unit_ills_thum_20283.png"},{"id":"380","name":"Hail Mech Reeze","text":"Hail Mech Reeze","max_lv":"80","star":"5","element":"Water","cost":"15","exp_table":"3","icon":"http:\/\/img2.wikia.nocookie.net\/__cb20140428050027\/bravefrontierglobal\/images\/thumb\/a\/a7\/Unit_ills_thum_20284.png\/42px-Unit_ills_thum_20284.png"},{"id":"381","name":"Pugilist Dilma","text":"Pugilist Dilma","max_lv":"60","star":"4","element":"Earth","cost":"10","exp_table":"3","icon":"http:\/\/img2.wikia.nocookie.net\/__cb20140428050032\/bravefrontierglobal\/images\/thumb\/3\/32\/Unit_ills_thum_30283.png\/42px-Unit_ills_thum_30283.png"},{"id":"382","name":"Champ Fist Dilma","text":"Champ Fist Dilma","max_lv":"80","star":"5","element":"Earth","cost":"15","exp_table":"3","icon":"http:\/\/img2.wikia.nocookie.net\/__cb20140428054441\/bravefrontierglobal\/images\/thumb\/2\/22\/Unit_ills_thum_30284.png\/42px-Unit_ills_thum_30284.png"},{"id":"383","name":"Shock Mage Rashil","text":"Shock Mage Rashil","max_lv":"60","star":"4","element":"Thunder","cost":"10","exp_table":"3","icon":"http:\/\/img2.wikia.nocookie.net\/__cb20140428050043\/bravefrontierglobal\/images\/thumb\/9\/93\/Unit_ills_thum_40283.png\/42px-Unit_ills_thum_40283.png"},{"id":"384","name":"Bolt Magus Rashil","text":"Bolt Magus Rashil","max_lv":"80","star":"5","element":"Thunder","cost":"15","exp_table":"3","icon":"http:\/\/img2.wikia.nocookie.net\/__cb20140428050050\/bravefrontierglobal\/images\/thumb\/c\/cd\/Unit_ills_thum_40284.png\/42px-Unit_ills_thum_40284.png"},{"id":"385","name":"Cyborg Lilith","text":"Cyborg Lilith","max_lv":"60","star":"4","element":"Light","cost":"10","exp_table":"3","icon":"http:\/\/img1.wikia.nocookie.net\/__cb20140429001150\/bravefrontierglobal\/images\/thumb\/0\/0a\/Unit_ills_thum_50313.png\/42px-Unit_ills_thum_50313.png"},{"id":"386","name":"Cyborg Lilith II","text":"Cyborg Lilith II","max_lv":"80","star":"5","element":"Light","cost":"15","exp_table":"3","icon":"http:\/\/img3.wikia.nocookie.net\/__cb20140429001159\/bravefrontierglobal\/images\/thumb\/6\/60\/Unit_ills_thum_50314.png\/42px-Unit_ills_thum_50314.png"},{"id":"387","name":"Dark Swords Logan","text":"Dark Swords Logan","max_lv":"60","star":"4","element":"Dark","cost":"10","exp_table":"3","icon":"http:\/\/img4.wikia.nocookie.net\/__cb20140428050107\/bravefrontierglobal\/images\/thumb\/d\/d7\/Unit_ills_thum_60283.png\/42px-Unit_ills_thum_60283.png"},{"id":"388","name":"Evil Blades Logan","text":"Evil Blades Logan","max_lv":"80","star":"5","element":"Dark","cost":"15","exp_table":"3","icon":"http:\/\/img3.wikia.nocookie.net\/__cb20140428050112\/bravefrontierglobal\/images\/thumb\/c\/cd\/Unit_ills_thum_60284.png\/42px-Unit_ills_thum_60284.png"},{"id":"389","name":"Paladin Paris","text":"Paladin Paris","max_lv":"60","star":"4","element":"Thunder","cost":"12","exp_table":"3","icon":"http:\/\/img3.wikia.nocookie.net\/__cb20140514120208\/bravefrontierglobal\/images\/thumb\/d\/d7\/Unit_ills_thum_40233.png\/42px-Unit_ills_thum_40233.png"},{"id":"390","name":"Royal Guard Paris","text":"Royal Guard Paris","max_lv":"80","star":"5","element":"Thunder","cost":"15","exp_table":"3","icon":"http:\/\/img3.wikia.nocookie.net\/__cb20140514120226\/bravefrontierglobal\/images\/thumb\/8\/89\/Unit_ills_thum_40234.png\/42px-Unit_ills_thum_40234.png"},{"id":"391","name":"Freya","text":"Freya","max_lv":"60","star":"4","element":"Fire","cost":"10","exp_table":"2","icon":"http:\/\/img2.wikia.nocookie.net\/__cb20140514153502\/bravefrontierglobal\/images\/thumb\/a\/af\/Unit_ills_thum_10243.png\/42px-Unit_ills_thum_10243.png"},{"id":"392","name":"Blaze Sibyl Freya","text":"Blaze Sibyl Freya","max_lv":"80","star":"5","element":"Fire","cost":"15","exp_table":"2","icon":"http:\/\/img3.wikia.nocookie.net\/__cb20140514153518\/bravefrontierglobal\/images\/thumb\/f\/f8\/Unit_ills_thum_10244.png\/42px-Unit_ills_thum_10244.png"},{"id":"393","name":"Eliza","text":"Eliza","max_lv":"60","star":"4","element":"Water","cost":"10","exp_table":"2","icon":"http:\/\/img4.wikia.nocookie.net\/__cb20140514151708\/bravefrontierglobal\/images\/thumb\/b\/b6\/Unit_ills_thum_20243.png\/42px-Unit_ills_thum_20243.png"},{"id":"394","name":"Snow Sibyl Eliza","text":"Snow Sibyl Eliza","max_lv":"80","star":"5","element":"Water","cost":"15","exp_table":"2","icon":"http:\/\/img1.wikia.nocookie.net\/__cb20140514151725\/bravefrontierglobal\/images\/thumb\/2\/2a\/Unit_ills_thum_20244.png\/42px-Unit_ills_thum_20244.png"},{"id":"395","name":"Paula","text":"Paula","max_lv":"60","star":"4","element":"Earth","cost":"10","exp_table":"2","icon":"http:\/\/img2.wikia.nocookie.net\/__cb20140514150719\/bravefrontierglobal\/images\/thumb\/9\/94\/Unit_ills_thum_30243.png\/42px-Unit_ills_thum_30243.png"},{"id":"396","name":"Rose Sibyl Paula","text":"Rose Sibyl Paula","max_lv":"80","star":"5","element":"Earth","cost":"15","exp_table":"2","icon":"http:\/\/img1.wikia.nocookie.net\/__cb20140514150732\/bravefrontierglobal\/images\/thumb\/e\/ed\/Unit_ills_thum_30244.png\/42px-Unit_ills_thum_30244.png"},{"id":"397","name":"Zele","text":"Zele","max_lv":"60","star":"4","element":"Thunder","cost":"10","exp_table":"2","icon":"http:\/\/img2.wikia.nocookie.net\/__cb20140514150623\/bravefrontierglobal\/images\/thumb\/6\/6b\/Unit_ills_thum_40243.png\/42px-Unit_ills_thum_40243.png"},{"id":"398","name":"Bolt Sibyl Zele","text":"Bolt Sibyl Zele","max_lv":"80","star":"5","element":"Thunder","cost":"15","exp_table":"2","icon":"http:\/\/img4.wikia.nocookie.net\/__cb20140514150637\/bravefrontierglobal\/images\/thumb\/d\/d5\/Unit_ills_thum_40244.png\/42px-Unit_ills_thum_40244.png"},{"id":"399","name":"Sola","text":"Sola","max_lv":"60","star":"4","element":"Light","cost":"10","exp_table":"2","icon":"http:\/\/img3.wikia.nocookie.net\/__cb20140514153229\/bravefrontierglobal\/images\/thumb\/c\/c5\/Unit_ills_thum_50263.png\/42px-Unit_ills_thum_50263.png"},{"id":"400","name":"Ray Sibyl Sola","text":"Ray Sibyl Sola","max_lv":"80","star":"5","element":"Light","cost":"15","exp_table":"2","icon":"http:\/\/img2.wikia.nocookie.net\/__cb20140514153150\/bravefrontierglobal\/images\/thumb\/b\/ba\/Unit_ills_thum_50264.png\/42px-Unit_ills_thum_50264.png"},{"id":"401","name":"Madia","text":"Madia","max_lv":"60","star":"4","element":"Dark","cost":"10","exp_table":"2","icon":"http:\/\/img1.wikia.nocookie.net\/__cb20140514153006\/bravefrontierglobal\/images\/thumb\/8\/82\/Unit_ills_thum_60243.png\/42px-Unit_ills_thum_60243.png"},{"id":"402","name":"Night Sibyl Madia","text":"Night Sibyl Madia","max_lv":"80","star":"5","element":"Dark","cost":"15","exp_table":"2","icon":"http:\/\/img4.wikia.nocookie.net\/__cb20140514153023\/bravefrontierglobal\/images\/thumb\/7\/72\/Unit_ills_thum_60244.png\/42px-Unit_ills_thum_60244.png"},{"id":"415","name":"Homusubi","text":"Homusubi","max_lv":"60","star":"4","element":"Fire","cost":"12","exp_table":"3","icon":"http:\/\/img2.wikia.nocookie.net\/__cb20140515013810\/bravefrontierglobal\/images\/thumb\/5\/56\/Unit_ills_thum_10273.png\/42px-Unit_ills_thum_10273.png"},{"id":"416","name":"Kagutsuchi","text":"Kagutsuchi","max_lv":"80","star":"5","element":"Fire","cost":"16","exp_table":"3","icon":"http:\/\/img3.wikia.nocookie.net\/__cb20140515013828\/bravefrontierglobal\/images\/thumb\/4\/4f\/Unit_ills_thum_10274.png\/42px-Unit_ills_thum_10274.png"},{"id":"417","name":"Ice Keep Copra","text":"Ice Keep Copra","max_lv":"60","star":"4","element":"Water","cost":"12","exp_table":"3","icon":"http:\/\/img1.wikia.nocookie.net\/__cb20140515041256\/bravefrontierglobal\/images\/thumb\/7\/76\/Unit_ills_thum_20273.png\/42px-Unit_ills_thum_20273.png"},{"id":"418","name":"Ice Tower Tesla","text":"Ice Tower Tesla","max_lv":"80","star":"5","element":"Water","cost":"16","exp_table":"3","icon":"http:\/\/img1.wikia.nocookie.net\/__cb20140515041316\/bravefrontierglobal\/images\/thumb\/f\/fd\/Unit_ills_thum_20274.png\/42px-Unit_ills_thum_20274.png"},{"id":"419","name":"Golem","text":"Golem","max_lv":"60","star":"4","element":"Earth","cost":"12","exp_table":"3","icon":"http:\/\/img2.wikia.nocookie.net\/__cb20140515041605\/bravefrontierglobal\/images\/thumb\/b\/b4\/Unit_ills_thum_30273.png\/42px-Unit_ills_thum_30273.png"},{"id":"420","name":"Great Golem","text":"Great Golem","max_lv":"80","star":"5","element":"Earth","cost":"16","exp_table":"3","icon":"http:\/\/img1.wikia.nocookie.net\/__cb20140515041629\/bravefrontierglobal\/images\/thumb\/0\/08\/Unit_ills_thum_30274.png\/42px-Unit_ills_thum_30274.png"},{"id":"421","name":"Sky Angel Kushra","text":"Sky Angel Kushra","max_lv":"60","star":"4","element":"Thunder","cost":"12","exp_table":"3","icon":"http:\/\/img1.wikia.nocookie.net\/__cb20140515041953\/bravefrontierglobal\/images\/thumb\/8\/8b\/Unit_ills_thum_40273.png\/42px-Unit_ills_thum_40273.png"},{"id":"422","name":"Rebel Angel Elsel","text":"Rebel Angel Elsel","max_lv":"80","star":"5","element":"Thunder","cost":"16","exp_table":"3","icon":"http:\/\/img3.wikia.nocookie.net\/__cb20140515042009\/bravefrontierglobal\/images\/thumb\/d\/da\/Unit_ills_thum_40274.png\/42px-Unit_ills_thum_40274.png"},{"id":"423","name":"White Lebra","text":"White Lebra","max_lv":"60","star":"4","element":"Light","cost":"12","exp_table":"3","icon":"http:\/\/img2.wikia.nocookie.net\/__cb20140515042302\/bravefrontierglobal\/images\/thumb\/6\/62\/Unit_ills_thum_50303.png\/42px-Unit_ills_thum_50303.png"},{"id":"424","name":"Lubradine","text":"Lubradine","max_lv":"80","star":"5","element":"Light","cost":"16","exp_table":"3","icon":"http:\/\/img1.wikia.nocookie.net\/__cb20140515042332\/bravefrontierglobal\/images\/thumb\/4\/44\/Unit_ills_thum_50304.png\/42px-Unit_ills_thum_50304.png"},{"id":"425","name":"Half Blood Lira","text":"Half Blood Lira","max_lv":"60","star":"4","element":"Dark","cost":"12","exp_table":"3","icon":"http:\/\/img3.wikia.nocookie.net\/__cb20140515042647\/bravefrontierglobal\/images\/thumb\/a\/af\/Unit_ills_thum_60273.png\/42px-Unit_ills_thum_60273.png"},{"id":"426","name":"Magistra Lira","text":"Magistra Lira","max_lv":"80","star":"5","element":"Dark","cost":"16","exp_table":"3","icon":"http:\/\/img4.wikia.nocookie.net\/__cb20140515042734\/bravefrontierglobal\/images\/thumb\/f\/f0\/Unit_ills_thum_60274.png\/42px-Unit_ills_thum_60274.png"},{"id":"429","name":"Fire Crystal","text":"Fire Crystal","max_lv":"1","star":"5","element":"Fire","cost":"12","exp_table":"0","icon":"http:\/\/img4.wikia.nocookie.net\/__cb20140515024216\/bravefrontierglobal\/images\/thumb\/9\/92\/Unit_ills_thum_10344.png\/42px-Unit_ills_thum_10344.png"},{"id":"430","name":"Water Crystal","text":"Water Crystal","max_lv":"1","star":"5","element":"Water","cost":"12","exp_table":"0","icon":"http:\/\/img3.wikia.nocookie.net\/__cb20140515024130\/bravefrontierglobal\/images\/thumb\/1\/10\/Unit_ills_thum_20334.png\/42px-Unit_ills_thum_20334.png"},{"id":"431","name":"Earth Crystal","text":"Earth Crystal","max_lv":"1","star":"5","element":"Earth","cost":"12","exp_table":"0","icon":"http:\/\/img3.wikia.nocookie.net\/__cb20140515023825\/bravefrontierglobal\/images\/thumb\/b\/bb\/Unit_ills_thum_30324.png\/42px-Unit_ills_thum_30324.png"},{"id":"432","name":"Thunder Crystal","text":"Thunder Crystal","max_lv":"1","star":"5","element":"Thunder","cost":"12","exp_table":"0","icon":"http:\/\/img2.wikia.nocookie.net\/__cb20140515023803\/bravefrontierglobal\/images\/thumb\/a\/aa\/Unit_ills_thum_40324.png\/42px-Unit_ills_thum_40324.png"},{"id":"433","name":"Light Crystal","text":"Light Crystal","max_lv":"1","star":"5","element":"Light","cost":"12","exp_table":"0","icon":"http:\/\/img2.wikia.nocookie.net\/__cb20140515023629\/bravefrontierglobal\/images\/thumb\/a\/ae\/Unit_ills_thum_50364.png\/42px-Unit_ills_thum_50364.png"},{"id":"434","name":"Dark Crystal","text":"Dark Crystal","max_lv":"1","star":"5","element":"Dark","cost":"12","exp_table":"0","icon":"http:\/\/img2.wikia.nocookie.net\/__cb20140515024407\/bravefrontierglobal\/images\/thumb\/7\/77\/Unit_ills_thum_60334.png\/42px-Unit_ills_thum_60334.png"},{"id":"435","name":"Smith Lord Galant","text":"Smith Lord Galant","max_lv":"80","star":"5","element":"Fire","cost":"15","exp_table":"2","icon":"http:\/\/img2.wikia.nocookie.net\/__cb20140420085403\/bravefrontierglobal\/images\/thumb\/d\/d8\/Unit_ills_thum_10144.png\/42px-Unit_ills_thum_10144.png"},{"id":"436","name":"Mother Snow Stya","text":"Mother Snow Stya","max_lv":"80","star":"5","element":"Water","cost":"15","exp_table":"2","icon":"http:\/\/img3.wikia.nocookie.net\/__cb20140420085425\/bravefrontierglobal\/images\/thumb\/3\/39\/Unit_ills_thum_20144.png\/42px-Unit_ills_thum_20144.png"},{"id":"437","name":"Quake Fist Nemia","text":"Quake Fist Nemia","max_lv":"80","star":"5","element":"Earth","cost":"15","exp_table":"2","icon":"http:\/\/img3.wikia.nocookie.net\/__cb20140420085456\/bravefrontierglobal\/images\/thumb\/d\/d9\/Unit_ills_thum_30144.png\/42px-Unit_ills_thum_30144.png"},{"id":"438","name":"Thunder Punt Zeln","text":"Thunder Punt Zeln","max_lv":"80","star":"5","element":"Thunder","cost":"15","exp_table":"2","icon":"http:\/\/img3.wikia.nocookie.net\/__cb20140420085524\/bravefrontierglobal\/images\/thumb\/6\/64\/Unit_ills_thum_40144.png\/42px-Unit_ills_thum_40144.png"},{"id":"439","name":"Brave Hero Alma","text":"Brave Hero Alma","max_lv":"80","star":"5","element":"Light","cost":"15","exp_table":"2","icon":"http:\/\/img2.wikia.nocookie.net\/__cb20140420085548\/bravefrontierglobal\/images\/thumb\/b\/bb\/Unit_ills_thum_50144.png\/42px-Unit_ills_thum_50144.png"},{"id":"440","name":"Red Shadow Oboro","text":"Red Shadow Oboro","max_lv":"80","star":"5","element":"Dark","cost":"15","exp_table":"2","icon":"http:\/\/img1.wikia.nocookie.net\/__cb20140420085625\/bravefrontierglobal\/images\/thumb\/2\/2e\/Unit_ills_thum_60154.png\/42px-Unit_ills_thum_60154.png"},{"id":"441","name":"Sacred Flame Lava","text":"Sacred Flame Lava","max_lv":"100","star":"6","element":"Fire","cost":"22","exp_table":"3","icon":"http:\/\/img1.wikia.nocookie.net\/__cb20140423042400\/bravefrontierglobal\/images\/thumb\/d\/dd\/Unit_ills_thum_10125.png\/42px-Unit_ills_thum_10125.png"},{"id":"442","name":"Sea King Mega","text":"Sea King Mega","max_lv":"100","star":"6","element":"Water","cost":"22","exp_table":"3","icon":"http:\/\/img1.wikia.nocookie.net\/__cb20140423042430\/bravefrontierglobal\/images\/thumb\/d\/d4\/Unit_ills_thum_20125.png\/42px-Unit_ills_thum_20125.png"},{"id":"443","name":"Holy Arms Douglas","text":"Holy Arms Douglas","max_lv":"100","star":"6","element":"Earth","cost":"22","exp_table":"3","icon":"http:\/\/img4.wikia.nocookie.net\/__cb20140423042457\/bravefrontierglobal\/images\/thumb\/3\/38\/Unit_ills_thum_30125.png\/42px-Unit_ills_thum_30125.png"},{"id":"444","name":"Holy Shock Emilia","text":"Holy Shock Emilia","max_lv":"100","star":"6","element":"Thunder","cost":"22","exp_table":"3","icon":"http:\/\/img1.wikia.nocookie.net\/__cb20140422221454\/bravefrontierglobal\/images\/thumb\/e\/e8\/Unit_ills_thum_40125.png\/42px-Unit_ills_thum_40125.png"},{"id":"445","name":"Holy Guard Will","text":"Holy Guard Will","max_lv":"100","star":"6","element":"Light","cost":"22","exp_table":"3","icon":"http:\/\/img2.wikia.nocookie.net\/__cb20140423042534\/bravefrontierglobal\/images\/thumb\/f\/fa\/Unit_ills_thum_50115.png\/42px-Unit_ills_thum_50115.png"},{"id":"446","name":"Hell Keep Alice","text":"Hell Keep Alice","max_lv":"100","star":"6","element":"Dark","cost":"22","exp_table":"3","icon":"http:\/\/img2.wikia.nocookie.net\/__cb20140423042557\/bravefrontierglobal\/images\/thumb\/e\/e7\/Unit_ills_thum_60115.png\/42px-Unit_ills_thum_60115.png"},{"id":"447","name":"Red Slash Farlon","text":"Red Slash Farlon","max_lv":"60","star":"4","element":"Fire","cost":"12","exp_table":"3","icon":"http:\/\/img1.wikia.nocookie.net\/__cb20140514103121\/bravefrontierglobal\/images\/thumb\/a\/a2\/Unit_ills_thum_10333.png\/42px-Unit_ills_thum_10333.png"},{"id":"448","name":"Red Blade Farlon","text":"Red Blade Farlon","max_lv":"80","star":"5","element":"Fire","cost":"16","exp_table":"3","icon":"http:\/\/img2.wikia.nocookie.net\/__cb20140514103132\/bravefrontierglobal\/images\/thumb\/0\/04\/Unit_ills_thum_10334.png\/42px-Unit_ills_thum_10334.png"},{"id":"449","name":"Snow Cub Signas","text":"Snow Cub Signas","max_lv":"60","star":"4","element":"Water","cost":"12","exp_table":"3","icon":"http:\/\/img4.wikia.nocookie.net\/__cb20140514102952\/bravefrontierglobal\/images\/thumb\/b\/bc\/Unit_ills_thum_20323.png\/42px-Unit_ills_thum_20323.png"},{"id":"450","name":"Snow Lion Signas","text":"Snow Lion Signas","max_lv":"80","star":"5","element":"Water","cost":"16","exp_table":"3","icon":"http:\/\/img1.wikia.nocookie.net\/__cb20140515024059\/bravefrontierglobal\/images\/thumb\/d\/d3\/Unit_ills_thum_20324.png\/42px-Unit_ills_thum_20324.png"},{"id":"455","name":"Horseman Sodis","text":"Horseman Sodis","max_lv":"60","star":"4","element":"Light","cost":"12","exp_table":"3","icon":"http:\/\/img3.wikia.nocookie.net\/__cb20140514102342\/bravefrontierglobal\/images\/thumb\/d\/db\/Unit_ills_thum_50383.png\/42px-Unit_ills_thum_50383.png"},{"id":"456","name":"Cavalryman Sodis","text":"Cavalryman Sodis","max_lv":"80","star":"5","element":"Light","cost":"16","exp_table":"3","icon":"http:\/\/img2.wikia.nocookie.net\/__cb20140514102400\/bravefrontierglobal\/images\/thumb\/5\/51\/Unit_ills_thum_50384.png\/42px-Unit_ills_thum_50384.png"},{"id":"459","name":"Hermit Talos","text":"Hermit Talos","max_lv":"30","star":"2","element":"Fire","cost":"3","exp_table":"2","icon":"http:\/\/img3.wikia.nocookie.net\/__cb20140515102048\/bravefrontierglobal\/images\/thumb\/1\/1c\/Unit_ills_thum_10181.png\/42px-Unit_ills_thum_10181.png"},{"id":"460","name":"Mountaineer Talos","text":"Mountaineer Talos","max_lv":"40","star":"3","element":"Fire","cost":"7","exp_table":"2","icon":"http:\/\/img3.wikia.nocookie.net\/__cb20140515102120\/bravefrontierglobal\/images\/thumb\/8\/87\/Unit_ills_thum_10182.png\/42px-Unit_ills_thum_10182.png"},{"id":"461","name":"Black Rose Elize","text":"Black Rose Elize","max_lv":"30","star":"2","element":"Water","cost":"3","exp_table":"2","icon":"http:\/\/img2.wikia.nocookie.net\/__cb20140515102328\/bravefrontierglobal\/images\/thumb\/c\/ca\/Unit_ills_thum_30181.png\/42px-Unit_ills_thum_30181.png"},{"id":"462","name":"Frozen Rose Elize","text":"Frozen Rose Elize","max_lv":"40","star":"3","element":"Water","cost":"7","exp_table":"2","icon":"http:\/\/img1.wikia.nocookie.net\/__cb20140515102246\/bravefrontierglobal\/images\/thumb\/9\/97\/Unit_ills_thum_20182.png\/42px-Unit_ills_thum_20182.png"},{"id":"463","name":"Poet Elton","text":"Poet Elton","max_lv":"30","star":"2","element":"Earth","cost":"3","exp_table":"2","icon":"http:\/\/img2.wikia.nocookie.net\/__cb20140515102328\/bravefrontierglobal\/images\/thumb\/c\/ca\/Unit_ills_thum_30181.png\/42px-Unit_ills_thum_30181.png"},{"id":"464","name":"Bard Elton","text":"Bard Elton","max_lv":"40","star":"3","element":"Earth","cost":"7","exp_table":"2","icon":"http:\/\/img3.wikia.nocookie.net\/__cb20140515102350\/bravefrontierglobal\/images\/thumb\/6\/67\/Unit_ills_thum_30182.png\/42px-Unit_ills_thum_30182.png"},{"id":"465","name":"Wild Cat Parmi","text":"Wild Cat Parmi","max_lv":"30","star":"2","element":"Thunder","cost":"3","exp_table":"2","icon":"http:\/\/img2.wikia.nocookie.net\/__cb20140515102430\/bravefrontierglobal\/images\/thumb\/f\/fa\/Unit_ills_thum_40181.png\/42px-Unit_ills_thum_40181.png"},{"id":"466","name":"Thunder Cat Parmi","text":"Thunder Cat Parmi","max_lv":"40","star":"3","element":"Thunder","cost":"7","exp_table":"2","icon":"http:\/\/img3.wikia.nocookie.net\/__cb20140515102510\/bravefrontierglobal\/images\/thumb\/0\/0b\/Unit_ills_thum_40182.png\/42px-Unit_ills_thum_40182.png"},{"id":"467","name":"Shrine Girl Amul","text":"Shrine Girl Amul","max_lv":"30","star":"2","element":"Light","cost":"3","exp_table":"2","icon":"http:\/\/img1.wikia.nocookie.net\/__cb20140515050408\/bravefrontierglobal\/images\/thumb\/2\/2e\/Unit_ills_thum_50181.png\/42px-Unit_ills_thum_50181.png"},{"id":"468","name":"Holy Maiden Amul","text":"Holy Maiden Amul","max_lv":"40","star":"3","element":"Light","cost":"7","exp_table":"2","icon":"http:\/\/img2.wikia.nocookie.net\/__cb20140515051249\/bravefrontierglobal\/images\/thumb\/a\/a0\/Unit_ills_thum_50182.png\/42px-Unit_ills_thum_50182.png"},{"id":"469","name":"Gambler Zeul","text":"Gambler Zeul","max_lv":"30","star":"2","element":"Dark","cost":"3","exp_table":"2","icon":"http:\/\/img2.wikia.nocookie.net\/__cb20140515102606\/bravefrontierglobal\/images\/thumb\/4\/4b\/Unit_ills_thum_60191.png\/42px-Unit_ills_thum_60191.png"},{"id":"470","name":"High Roller Zeul","text":"High Roller Zeul","max_lv":"40","star":"3","element":"Dark","cost":"7","exp_table":"2","icon":"http:\/\/img1.wikia.nocookie.net\/__cb20140515102620\/bravefrontierglobal\/images\/thumb\/d\/de\/Unit_ills_thum_60192.png\/42px-Unit_ills_thum_60192.png"},{"id":"471","name":"Ace Chef Lancia","text":"Ace Chef Lancia","max_lv":"100","star":"6","element":"Fire","cost":"22","exp_table":"3","icon":"http:\/\/img3.wikia.nocookie.net\/__cb20140420031450\/bravefrontierglobal\/images\/thumb\/1\/1f\/Unit_ills_thum_10155.png\/42px-Unit_ills_thum_10155.png"},{"id":"472","name":"Wise Mage Elimo","text":"Wise Mage Elimo","max_lv":"100","star":"6","element":"Water","cost":"22","exp_table":"3","icon":"http:\/\/img4.wikia.nocookie.net\/__cb20140420031915\/bravefrontierglobal\/images\/thumb\/a\/ae\/Unit_ills_thum_20155.png\/42px-Unit_ills_thum_20155.png"},{"id":"473","name":"Pixy Lord Leore","text":"Pixy Lord Leore","max_lv":"100","star":"6","element":"Earth","cost":"22","exp_table":"3","icon":"http:\/\/img1.wikia.nocookie.net\/__cb20140420032325\/bravefrontierglobal\/images\/thumb\/5\/55\/Unit_ills_thum_30155.png\/42px-Unit_ills_thum_30155.png"},{"id":"474","name":"Tesla Club Elulu","text":"Tesla Club Elulu","max_lv":"100","star":"6","element":"Thunder","cost":"22","exp_table":"3","icon":"http:\/\/img1.wikia.nocookie.net\/__cb20140420032837\/bravefrontierglobal\/images\/thumb\/2\/23\/Unit_ills_thum_40155.png\/42px-Unit_ills_thum_40155.png"},{"id":"475","name":"Ultra Blade Aem","text":"Ultra Blade Aem","max_lv":"100","star":"6","element":"Light","cost":"22","exp_table":"3","icon":"http:\/\/img2.wikia.nocookie.net\/__cb20140420032958\/bravefrontierglobal\/images\/thumb\/2\/20\/Unit_ills_thum_50155.png\/42px-Unit_ills_thum_50155.png"},{"id":"476","name":"Soul Vortex Lemia","text":"Soul Vortex Lemia","max_lv":"100","star":"6","element":"Dark","cost":"22","exp_table":"3","icon":"http:\/\/img1.wikia.nocookie.net\/__cb20140420033323\/bravefrontierglobal\/images\/thumb\/b\/b9\/Unit_ills_thum_60165.png\/42px-Unit_ills_thum_60165.png"},{"id":"477","name":"Taskmaster Lorand","text":"Taskmaster Lorand","max_lv":"100","star":"6","element":"Fire","cost":"22","exp_table":"3","icon":"http:\/\/img3.wikia.nocookie.net\/__cb20140420034001\/bravefrontierglobal\/images\/thumb\/d\/d8\/Unit_ills_thum_10165.png\/42px-Unit_ills_thum_10165.png"},{"id":"478","name":"Ice Master Dean","text":"Ice Master Dean","max_lv":"100","star":"6","element":"Water","cost":"22","exp_table":"3","icon":"http:\/\/img2.wikia.nocookie.net\/__cb20140420034306\/bravefrontierglobal\/images\/thumb\/c\/cf\/Unit_ills_thum_20165.png\/42px-Unit_ills_thum_20165.png"},{"id":"479","name":"Gaia Armor Edea","text":"Gaia Armor Edea","max_lv":"100","star":"6","element":"Earth","cost":"22","exp_table":"3","icon":"http:\/\/img1.wikia.nocookie.net\/__cb20140420034848\/bravefrontierglobal\/images\/thumb\/d\/de\/Unit_ills_thum_30165.png\/42px-Unit_ills_thum_30165.png"},{"id":"480","name":"Heaven's Bow Loch","text":"Heaven's Bow Loch","max_lv":"100","star":"6","element":"Thunder","cost":"22","exp_table":"3","icon":"http:\/\/img1.wikia.nocookie.net\/__cb20140420035540\/bravefrontierglobal\/images\/thumb\/6\/6d\/Unit_ills_thum_40165.png\/42px-Unit_ills_thum_40165.png"},{"id":"481","name":"Metal Mimic","text":"Metal Mimic","max_lv":"1","star":"5","element":"Dark","cost":"1","exp_table":"0","icon":"http:\/\/img2.wikia.nocookie.net\/__cb20140515044523\/bravefrontierglobal\/images\/thumb\/4\/4b\/Unit_ills_thum_60224.png\/42px-Unit_ills_thum_60224.png"},{"id":"482","name":"Drake Angel Aisha","text":"Drake Angel Aisha","max_lv":"100","star":"6","element":"Fire","cost":"24","exp_table":"3","icon":"http:\/\/img1.wikia.nocookie.net\/__cb20140510214858\/bravefrontierglobal\/images\/thumb\/e\/ef\/Unit_ills_thum_10215.png\/42px-Unit_ills_thum_10215.png"},{"id":"483","name":"Twin Arms Rickel","text":"Twin Arms Rickel","max_lv":"100","star":"6","element":"Water","cost":"24","exp_table":"3","icon":"http:\/\/img3.wikia.nocookie.net\/__cb20140420054222\/bravefrontierglobal\/images\/thumb\/e\/ee\/Unit_ills_thum_20215.png\/42px-Unit_ills_thum_20215.png"},{"id":"484","name":"Gaians Il & Mina","text":"Gaians Il & Mina","max_lv":"100","star":"6","element":"Earth","cost":"24","exp_table":"3","icon":"http:\/\/img3.wikia.nocookie.net\/__cb20140429163739\/bravefrontierglobal\/images\/thumb\/d\/da\/Unit_ills_thum_30215.png\/42px-Unit_ills_thum_30215.png"},{"id":"485","name":"Heaven's Bolt Amy","text":"Heaven's Bolt Amy","max_lv":"100","star":"6","element":"Thunder","cost":"24","exp_table":"3","icon":"http:\/\/img2.wikia.nocookie.net\/__cb20140429165205\/bravefrontierglobal\/images\/thumb\/d\/d9\/Unit_ills_thum_40215.png\/42px-Unit_ills_thum_40215.png"},{"id":"486","name":"Holy Blades Sefia","text":"Holy Blades Sefia","max_lv":"100","star":"6","element":"Light","cost":"24","exp_table":"3","icon":"http:\/\/img2.wikia.nocookie.net\/__cb20140420060553\/bravefrontierglobal\/images\/thumb\/e\/eb\/Unit_ills_thum_50165.png\/42px-Unit_ills_thum_50165.png"},{"id":"487","name":"Death Idol Kikuri","text":"Death Idol Kikuri","max_lv":"100","star":"6","element":"Dark","cost":"24","exp_table":"3","icon":"http:\/\/img2.wikia.nocookie.net\/__cb20140429171022\/bravefrontierglobal\/images\/thumb\/3\/3a\/Unit_ills_thum_60175.png\/42px-Unit_ills_thum_60175.png"},{"id":"500","name":"Fire Step Ramna","text":"Fire Step Ramna","max_lv":"60","star":"4","element":"Fire","cost":"12","exp_table":"3","icon":"http:\/\/img4.wikia.nocookie.net\/__cb20140515020541\/bravefrontierglobal\/images\/thumb\/e\/ed\/Unit_ills_thum_10363.png\/42px-Unit_ills_thum_10363.png"},{"id":"501","name":"Fire Dance Ramna","text":"Fire Dance Ramna","max_lv":"80","star":"5","element":"Fire","cost":"16","exp_table":"3","icon":"http:\/\/img2.wikia.nocookie.net\/__cb20140515020714\/bravefrontierglobal\/images\/thumb\/1\/1f\/Unit_ills_thum_10364.png\/42px-Unit_ills_thum_10364.png"},{"id":"503","name":"Spear Fist Raydn","text":"Spear Fist Raydn","max_lv":"60","star":"4","element":"Water","cost":"12","exp_table":"3","icon":"http:\/\/img1.wikia.nocookie.net\/__cb20140515021827\/bravefrontierglobal\/images\/thumb\/5\/5b\/Unit_ills_thum_20353.png\/42px-Unit_ills_thum_20353.png"},{"id":"504","name":"Spear Arms Raydn","text":"Spear Arms Raydn","max_lv":"80","star":"5","element":"Water","cost":"16","exp_table":"3","icon":"http:\/\/img4.wikia.nocookie.net\/__cb20140515021841\/bravefrontierglobal\/images\/thumb\/e\/e8\/Unit_ills_thum_20354.png\/42px-Unit_ills_thum_20354.png"},{"id":"506","name":"Battle Girl Ophelia","text":"Battle Girl Ophelia","max_lv":"60","star":"4","element":"Earth","cost":"12","exp_table":"3","icon":"http:\/\/img4.wikia.nocookie.net\/__cb20140515022239\/bravefrontierglobal\/images\/thumb\/0\/03\/Unit_ills_thum_30343.png\/42px-Unit_ills_thum_30343.png"},{"id":"507","name":"War Girl Ophelia","text":"War Girl Ophelia","max_lv":"80","star":"5","element":"Earth","cost":"16","exp_table":"3","icon":"http:\/\/img3.wikia.nocookie.net\/__cb20140515022309\/bravefrontierglobal\/images\/thumb\/5\/59\/Unit_ills_thum_30344.png\/42px-Unit_ills_thum_30344.png"},{"id":"509","name":"Mech Arms Grybe","text":"Mech Arms Grybe","max_lv":"60","star":"4","element":"Thunder","cost":"12","exp_table":"3","icon":"http:\/\/img1.wikia.nocookie.net\/__cb20140515022641\/bravefrontierglobal\/images\/thumb\/f\/f2\/Unit_ills_thum_40343.png\/42px-Unit_ills_thum_40343.png"},{"id":"510","name":"Mech Cannon Grybe","text":"Mech Cannon Grybe","max_lv":"80","star":"5","element":"Thunder","cost":"16","exp_table":"3","icon":"http:\/\/img2.wikia.nocookie.net\/__cb20140515022706\/bravefrontierglobal\/images\/thumb\/b\/b7\/Unit_ills_thum_40344.png\/42px-Unit_ills_thum_40344.png"},{"id":"512","name":"Light Blade Alyut","text":"Light Blade Alyut","max_lv":"60","star":"4","element":"Light","cost":"12","exp_table":"3","icon":"http:\/\/img3.wikia.nocookie.net\/__cb20140515022830\/bravefrontierglobal\/images\/thumb\/b\/be\/Unit_ills_thum_50403.png\/42px-Unit_ills_thum_50403.png"},{"id":"513","name":"Holy Warrior Alyut","text":"Holy Warrior Alyut","max_lv":"80","star":"5","element":"Light","cost":"16","exp_table":"3","icon":"http:\/\/img1.wikia.nocookie.net\/__cb20140515022847\/bravefrontierglobal\/images\/thumb\/3\/3e\/Unit_ills_thum_50404.png\/42px-Unit_ills_thum_50404.png"},{"id":"515","name":"Dark Blade Zephyr","text":"Dark Blade Zephyr","max_lv":"60","star":"4","element":"Dark","cost":"12","exp_table":"3","icon":"http:\/\/img3.wikia.nocookie.net\/__cb20140515022949\/bravefrontierglobal\/images\/thumb\/3\/39\/Unit_ills_thum_60353.png\/42px-Unit_ills_thum_60353.png"},{"id":"516","name":"Dark Warrior Zephyr","text":"Dark Warrior Zephyr","max_lv":"80","star":"5","element":"Dark","cost":"16","exp_table":"3","icon":"http:\/\/img1.wikia.nocookie.net\/__cb20140515023007\/bravefrontierglobal\/images\/thumb\/0\/07\/Unit_ills_thum_60354.png\/42px-Unit_ills_thum_60354.png"},{"id":"518","name":"Hobgoblin","text":"Hobgoblin","max_lv":"40","star":"3","element":"Fire","cost":"6","exp_table":"1","icon":"http:\/\/img1.wikia.nocookie.net\/__cb20140505054145\/bravefrontierglobal\/images\/thumb\/b\/b4\/Unit_ills_thum_10052.png\/42px-Unit_ills_thum_10052.png"},{"id":"519","name":"Lizard Man","text":"Lizard Man","max_lv":"40","star":"3","element":"Water","cost":"6","exp_table":"1","icon":"http:\/\/img1.wikia.nocookie.net\/__cb20140505053922\/bravefrontierglobal\/images\/thumb\/d\/df\/Unit_ills_thum_20052.png\/42px-Unit_ills_thum_20052.png"},{"id":"520","name":"Leshy","text":"Leshy","max_lv":"40","star":"3","element":"Earth","cost":"6","exp_table":"1","icon":"http:\/\/img2.wikia.nocookie.net\/__cb20140505054613\/bravefrontierglobal\/images\/thumb\/5\/54\/Unit_ills_thum_30052.png\/42px-Unit_ills_thum_30052.png"},{"id":"521","name":"Ocypete","text":"Ocypete","max_lv":"40","star":"3","element":"Thunder","cost":"6","exp_table":"1","icon":"http:\/\/img2.wikia.nocookie.net\/__cb20140505054918\/bravefrontierglobal\/images\/thumb\/c\/c2\/Unit_ills_thum_40052.png\/42px-Unit_ills_thum_40052.png"},{"id":"522","name":"Azrael","text":"Azrael","max_lv":"40","star":"3","element":"Light","cost":"6","exp_table":"1","icon":"http:\/\/img2.wikia.nocookie.net\/__cb20140505055138\/bravefrontierglobal\/images\/thumb\/f\/fb\/Unit_ills_thum_50052.png\/42px-Unit_ills_thum_50052.png"},{"id":"523","name":"Skull Lord","text":"Skull Lord","max_lv":"40","star":"3","element":"Dark","cost":"6","exp_table":"1","icon":"http:\/\/img4.wikia.nocookie.net\/__cb20140505055301\/bravefrontierglobal\/images\/thumb\/d\/d1\/Unit_ills_thum_60052.png\/42px-Unit_ills_thum_60052.png"},{"id":"524","name":"Goddess Axe Michele","text":"Goddess Axe Michele","max_lv":"100","star":"6","element":"Fire","cost":"23","exp_table":"3","icon":"http:\/\/img2.wikia.nocookie.net\/__cb20140512153216\/bravefrontierglobal\/images\/thumb\/f\/f1\/Unit_ills_thum_10255.png\/42px-Unit_ills_thum_10255.png"},{"id":"525","name":"Final Apostle Tiara","text":"Final Apostle Tiara","max_lv":"100","star":"6","element":"Water","cost":"23","exp_table":"3","icon":"http:\/\/img1.wikia.nocookie.net\/__cb20140512153217\/bravefrontierglobal\/images\/thumb\/b\/ba\/Unit_ills_thum_20255.png\/42px-Unit_ills_thum_20255.png"},{"id":"526","name":"Blade Emperor Zelban","text":"Blade Emperor Zelban","max_lv":"100","star":"6","element":"Earth","cost":"23","exp_table":"3","icon":"http:\/\/img1.wikia.nocookie.net\/__cb20140512153217\/bravefrontierglobal\/images\/thumb\/b\/b6\/Unit_ills_thum_30255.png\/42px-Unit_ills_thum_30255.png"},{"id":"527","name":"Empyreal Drake Lodin","text":"Empyreal Drake Lodin","max_lv":"100","star":"6","element":"Thunder","cost":"23","exp_table":"3","icon":"http:\/\/img3.wikia.nocookie.net\/__cb20140512153218\/bravefrontierglobal\/images\/thumb\/b\/ba\/Unit_ills_thum_40255.png\/42px-Unit_ills_thum_40255.png"},{"id":"528","name":"Legatus Melchio","text":"Legatus Melchio","max_lv":"100","star":"6","element":"Light","cost":"23","exp_table":"3","icon":"http:\/\/img2.wikia.nocookie.net\/__cb20140512153219\/bravefrontierglobal\/images\/thumb\/3\/39\/Unit_ills_thum_50275.png\/42px-Unit_ills_thum_50275.png"},{"id":"529","name":"Duel-SGX","text":"Duel-SGX","max_lv":"100","star":"6","element":"Dark","cost":"23","exp_table":"3","icon":"http:\/\/img2.wikia.nocookie.net\/__cb20140512153219\/bravefrontierglobal\/images\/thumb\/2\/28\/Unit_ills_thum_60255.png\/42px-Unit_ills_thum_60255.png"},{"id":"8000","name":"Maiden Lico","text":"Maiden Lico","max_lv":"40","star":"3","element":"Dark","cost":"6","exp_table":"3","icon":"http:\/\/img1.wikia.nocookie.net\/__cb20140425010201\/bravefrontierglobal\/images\/thumb\/2\/2b\/Unit_ills_thum_860003.png\/42px-Unit_ills_thum_860003.png"},{"id":"8001","name":"Dark Blade Lico","text":"Dark Blade Lico","max_lv":"60","star":"4","element":"Dark","cost":"10","exp_table":"3","icon":"http:\/\/img4.wikia.nocookie.net\/__cb20140425010131\/bravefrontierglobal\/images\/thumb\/3\/37\/Unit_ills_thum_860004.png\/42px-Unit_ills_thum_860004.png"},{"id":"8002","name":"Demon Blade Lico","text":"Demon Blade Lico","max_lv":"80","star":"5","element":"Dark","cost":"15","exp_table":"3","icon":"http:\/\/img1.wikia.nocookie.net\/__cb20140425010044\/bravefrontierglobal\/images\/thumb\/e\/e5\/Unit_ills_thum_860005.png\/42px-Unit_ills_thum_860005.png"},{"id":"8003","name":"Maiden Cayena","text":"Maiden Cayena","max_lv":"40","star":"3","element":"Fire","cost":"6","exp_table":"3","icon":"http:\/\/img1.wikia.nocookie.net\/__cb20140425005805\/bravefrontierglobal\/images\/thumb\/7\/75\/Unit_ills_thum_810003.png\/42px-Unit_ills_thum_810003.png"},{"id":"8004","name":"Hot Rocket Cayena","text":"Hot Rocket Cayena","max_lv":"60","star":"4","element":"Fire","cost":"10","exp_table":"3","icon":"http:\/\/img1.wikia.nocookie.net\/__cb20140425005737\/bravefrontierglobal\/images\/thumb\/9\/9a\/Unit_ills_thum_810004.png\/42px-Unit_ills_thum_810004.png"},{"id":"8005","name":"War Rocket Cayena","text":"War Rocket Cayena","max_lv":"80","star":"5","element":"Fire","cost":"15","exp_table":"3","icon":"http:\/\/img3.wikia.nocookie.net\/__cb20140425005706\/bravefrontierglobal\/images\/thumb\/2\/20\/Unit_ills_thum_810005.png\/42px-Unit_ills_thum_810005.png"},{"id":"8006","name":"Maiden Serin","text":"Maiden Serin","max_lv":"40","star":"3","element":"Water","cost":"6","exp_table":"3","icon":"http:\/\/img3.wikia.nocookie.net\/__cb20140501194953\/bravefrontierglobal\/images\/thumb\/9\/99\/Unit_ills_thum_820003.png\/42px-Unit_ills_thum_820003.png"},{"id":"8007","name":"Gun Lady Serin","text":"Gun Lady Serin","max_lv":"60","star":"4","element":"Water","cost":"10","exp_table":"3","icon":"http:\/\/img4.wikia.nocookie.net\/__cb20140501195105\/bravefrontierglobal\/images\/thumb\/1\/11\/Unit_ills_thum_820004.png\/42px-Unit_ills_thum_820004.png"},{"id":"8008","name":"Gun Goddess Serin","text":"Gun Goddess Serin","max_lv":"80","star":"5","element":"Water","cost":"15","exp_table":"3","icon":"http:\/\/img1.wikia.nocookie.net\/__cb20140501195125\/bravefrontierglobal\/images\/thumb\/5\/5a\/Unit_ills_thum_820005.png\/42px-Unit_ills_thum_820005.png"},{"id":"8009","name":"Maiden Bayley","text":"Maiden Bayley","max_lv":"40","star":"3","element":"Earth","cost":"6","exp_table":"3","icon":"http:\/\/img3.wikia.nocookie.net\/__cb20140509030137\/bravefrontierglobal\/images\/thumb\/f\/f3\/Unit_ills_thum_830003.png\/42px-Unit_ills_thum_830003.png"},{"id":"8010","name":"Nyan Slash Bayley","text":"Nyan Slash Bayley","max_lv":"60","star":"4","element":"Earth","cost":"10","exp_table":"3","icon":"http:\/\/img3.wikia.nocookie.net\/__cb20140509030343\/bravefrontierglobal\/images\/thumb\/e\/e2\/Unit_ills_thum_830004.png\/42px-Unit_ills_thum_830004.png"},{"id":"8011","name":"Wild Slash Bayley","text":"Wild Slash Bayley","max_lv":"80","star":"5","element":"Earth","cost":"15","exp_table":"3","icon":"http:\/\/img2.wikia.nocookie.net\/__cb20140509030444\/bravefrontierglobal\/images\/thumb\/e\/ec\/Unit_ills_thum_830005.png\/42px-Unit_ills_thum_830005.png"},{"id":"8012","name":"Maiden Fennia","text":"Maiden Fennia","max_lv":"40","star":"3","element":"Thunder","cost":"6","exp_table":"3","icon":"http:\/\/img2.wikia.nocookie.net\/__cb20140517042255\/bravefrontierglobal\/images\/thumb\/7\/74\/Unit_ills_thum_840003.png\/42px-Unit_ills_thum_840003.png"},{"id":"8013","name":"Raid Bomb Fennia","text":"Raid Bomb Fennia","max_lv":"60","star":"4","element":"Thunder","cost":"10","exp_table":"3","icon":"http:\/\/img2.wikia.nocookie.net\/__cb20140517042243\/bravefrontierglobal\/images\/thumb\/b\/bc\/Unit_ills_thum_840004.png\/42px-Unit_ills_thum_840004.png"},{"id":"8014","name":"Raid Bolt Fennia","text":"Raid Bolt Fennia","max_lv":"80","star":"5","element":"Thunder","cost":"15","exp_table":"3","icon":"http:\/\/img4.wikia.nocookie.net\/__cb20140517042211\/bravefrontierglobal\/images\/thumb\/d\/d9\/Unit_ills_thum_840005.png\/42px-Unit_ills_thum_840005.png"},{"id":"8015","name":"Maiden Vanila","text":"Maiden Vanila","max_lv":"40","star":"3","element":"Light","cost":"6","exp_table":"3","icon":"http:\/\/img2.wikia.nocookie.net\/__cb20140524175056\/bravefrontierglobal\/images\/thumb\/5\/5a\/Unit_ills_thum_850003.png\/42px-Unit_ills_thum_850003.png"},{"id":"8016","name":"Sky Queen Vanila","text":"Sky Queen Vanila","max_lv":"60","star":"4","element":"Light","cost":"10","exp_table":"3","icon":"http:\/\/img2.wikia.nocookie.net\/__cb20140524175155\/bravefrontierglobal\/images\/thumb\/7\/71\/Unit_ills_thum_850004.png\/42px-Unit_ills_thum_850004.png"},{"id":"8017","name":"Sky Angel Vanila","text":"Sky Angel Vanila","max_lv":"80","star":"5","element":"Light","cost":"15","exp_table":"3","icon":"http:\/\/img3.wikia.nocookie.net\/__cb20140524175237\/bravefrontierglobal\/images\/thumb\/c\/ca\/Unit_ills_thum_850005.png\/42px-Unit_ills_thum_850005.png"},{"id":"8030","name":"Estia","text":"Estia","max_lv":"40","star":"3","element":"Light","cost":"6","exp_table":"3","icon":"http:\/\/img1.wikia.nocookie.net\/__cb20140617132124\/bravefrontierglobal\/images\/thumb\/6\/60\/Unit_ills_thum_850013.png\/42px-Unit_ills_thum_850013.png"},{"id":"8031","name":"Damsel Estia","text":"Damsel Estia","max_lv":"60","star":"4","element":"Light","cost":"10","exp_table":"3","icon":"http:\/\/img2.wikia.nocookie.net\/__cb20140617132143\/bravefrontierglobal\/images\/thumb\/7\/75\/Unit_ills_thum_850014.png\/42px-Unit_ills_thum_850014.png"},{"id":"8032","name":"Princess Estia","text":"Princess Estia","max_lv":"80","star":"5","element":"Light","cost":"15","exp_table":"3","icon":"http:\/\/img1.wikia.nocookie.net\/__cb20140617132202\/bravefrontierglobal\/images\/thumb\/9\/90\/Unit_ills_thum_850015.png\/42px-Unit_ills_thum_850015.png"},{"id":"8033","name":"Xenon","text":"Xenon","max_lv":"40","star":"3","element":"Dark","cost":"6","exp_table":"3","icon":"http:\/\/img1.wikia.nocookie.net\/__cb20140610143050\/bravefrontierglobal\/images\/thumb\/4\/4c\/Unit_ills_thum_860013.png\/42px-Unit_ills_thum_860013.png"},{"id":"8034","name":"Royal Guard Xenon","text":"Royal Guard Xenon","max_lv":"60","star":"4","element":"Dark","cost":"10","exp_table":"3","icon":"http:\/\/img3.wikia.nocookie.net\/__cb20140610143057\/bravefrontierglobal\/images\/thumb\/6\/67\/Unit_ills_thum_860014.png\/42px-Unit_ills_thum_860014.png"},{"id":"8035","name":"Sir Sancus Xenon","text":"Sir Sancus Xenon","max_lv":"80","star":"5","element":"Dark","cost":"15","exp_table":"3","icon":"http:\/\/img1.wikia.nocookie.net\/__cb20140610143104\/bravefrontierglobal\/images\/thumb\/7\/70\/Unit_ills_thum_860015.png\/42px-Unit_ills_thum_860015.png"},{"id":"8036","name":"Xenon & Estia","text":"Xenon & Estia","max_lv":"80","star":"5","element":"Light","cost":"15","exp_table":"3","icon":"http:\/\/img1.wikia.nocookie.net\/__cb20140727172322\/bravefrontierglobal\/images\/thumb\/9\/9f\/Unit_ills_thum_850025.png\/42px-Unit_ills_thum_850025.png"},{"id":"8043","name":"Miracle Bulb","text":"Miracle Bulb","max_lv":"1","star":"3","element":"Light","cost":"1","exp_table":"0","icon":"http:\/\/img2.wikia.nocookie.net\/__cb20140727172307\/bravefrontierglobal\/images\/thumb\/b\/b1\/Unit_ills_thum_870034.png\/42px-Unit_ills_thum_870034.png"}]};
		unit_is_loaded = true;
		console.log("Load Failed, using local data.");
	})
	.done(function(data) {
		json_data = data;
		unit_is_loaded = true;
		console.log("Load Data Success!");
	});
	
	timer_looker = setInterval(function() {
		if(unit_is_loaded)
		{
			json_data_2 = goclone(json_data);
			
			if(typeof json_data != "undefined")
			{
				var d = json_data.d;
				units = d;
				units_by_name = json_data_2.d;
				units_by_name.sort(compare);
				
				tu_units_refresh();
			}
			
			init_unit_exp_tables();
			tu_team_refresh();
			
			window.clearInterval(timer_looker);
		}
	},200);
}

function init_summoners()
{
	var json_data = {"d":[{"level":1,"cost":15},{"level":2,"cost":16},{"level":3,"cost":17},{"level":4,"cost":18},{"level":5,"cost":19},{"level":6,"cost":20},{"level":7,"cost":20},{"level":8,"cost":21},{"level":9,"cost":21},{"level":10,"cost":26},{"level":11,"cost":26},{"level":12,"cost":27},{"level":13,"cost":27},{"level":14,"cost":28},{"level":15,"cost":28},{"level":16,"cost":29},{"level":17,"cost":29},{"level":18,"cost":30},{"level":19,"cost":30},{"level":20,"cost":35},{"level":21,"cost":35},{"level":22,"cost":36},{"level":23,"cost":36},{"level":24,"cost":37},{"level":25,"cost":37},{"level":26,"cost":38},{"level":27,"cost":38},{"level":28,"cost":39},{"level":29,"cost":39},{"level":30,"cost":44},{"level":31,"cost":44},{"level":32,"cost":45},{"level":33,"cost":45},{"level":34,"cost":46},{"level":35,"cost":46},{"level":36,"cost":47},{"level":37,"cost":47},{"level":38,"cost":48},{"level":39,"cost":48},{"level":40,"cost":53},{"level":41,"cost":53},{"level":42,"cost":54},{"level":43,"cost":54},{"level":44,"cost":55},{"level":45,"cost":55},{"level":46,"cost":56},{"level":47,"cost":56},{"level":48,"cost":57},{"level":49,"cost":57},{"level":50,"cost":62},{"level":51,"cost":62},{"level":52,"cost":63},{"level":53,"cost":63},{"level":54,"cost":64},{"level":55,"cost":64},{"level":56,"cost":65},{"level":57,"cost":65},{"level":58,"cost":66},{"level":59,"cost":66},{"level":60,"cost":71},{"level":61,"cost":71},{"level":62,"cost":72},{"level":63,"cost":72},{"level":64,"cost":73},{"level":65,"cost":73},{"level":66,"cost":74},{"level":67,"cost":74},{"level":68,"cost":75},{"level":69,"cost":75},{"level":70,"cost":80},{"level":71,"cost":80},{"level":72,"cost":81},{"level":73,"cost":81},{"level":74,"cost":82},{"level":75,"cost":82},{"level":76,"cost":83},{"level":77,"cost":83},{"level":78,"cost":84},{"level":79,"cost":84},{"level":80,"cost":89},{"level":81,"cost":89},{"level":82,"cost":90},{"level":83,"cost":90},{"level":84,"cost":91},{"level":85,"cost":91},{"level":86,"cost":92},{"level":87,"cost":92},{"level":88,"cost":93},{"level":89,"cost":93},{"level":90,"cost":99},{"level":91,"cost":99},{"level":92,"cost":100},{"level":93,"cost":100},{"level":94,"cost":101},{"level":95,"cost":101},{"level":96,"cost":102},{"level":97,"cost":102},{"level":98,"cost":103},{"level":99,"cost":103},{"level":100,"cost":109},{"level":101,"cost":109},{"level":102,"cost":110},{"level":103,"cost":111},{"level":104,"cost":111},{"level":105,"cost":112},{"level":106,"cost":113},{"level":107,"cost":113},{"level":108,"cost":114},{"level":109,"cost":115},{"level":110,"cost":115},{"level":111,"cost":116},{"level":112,"cost":117},{"level":113,"cost":117},{"level":114,"cost":118},{"level":115,"cost":119},{"level":116,"cost":119},{"level":117,"cost":120},{"level":118,"cost":121},{"level":119,"cost":121},{"level":120,"cost":122},{"level":121,"cost":123},{"level":122,"cost":123},{"level":123,"cost":124},{"level":124,"cost":125},{"level":125,"cost":125},{"level":126,"cost":126},{"level":127,"cost":127},{"level":128,"cost":127},{"level":129,"cost":128},{"level":130,"cost":129},{"level":131,"cost":129},{"level":132,"cost":130},{"level":133,"cost":131},{"level":134,"cost":131},{"level":135,"cost":132},{"level":136,"cost":133},{"level":137,"cost":133},{"level":138,"cost":134},{"level":138,"cost":135},{"level":139,"cost":135},{"level":140,"cost":135},{"level":141,"cost":136},{"level":142,"cost":137},{"level":143,"cost":137},{"level":144,"cost":138},{"level":145,"cost":139},{"level":146,"cost":139},{"level":147,"cost":140},{"level":148,"cost":141},{"level":149,"cost":141},{"level":150,"cost":142},{"level":151,"cost":143},{"level":152,"cost":143},{"level":153,"cost":144},{"level":154,"cost":145},{"level":155,"cost":145},{"level":156,"cost":146},{"level":157,"cost":147},{"level":158,"cost":147},{"level":159,"cost":148},{"level":160,"cost":149},{"level":161,"cost":149},{"level":162,"cost":150},{"level":163,"cost":151},{"level":164,"cost":151},{"level":165,"cost":152},{"level":166,"cost":153},{"level":167,"cost":153},{"level":168,"cost":154},{"level":169,"cost":155},{"level":170,"cost":155},{"level":171,"cost":156},{"level":172,"cost":157},{"level":173,"cost":157},{"level":174,"cost":158},{"level":175,"cost":159},{"level":176,"cost":159},{"level":177,"cost":160},{"level":178,"cost":161},{"level":179,"cost":161},{"level":180,"cost":162},{"level":181,"cost":163},{"level":182,"cost":163},{"level":183,"cost":164},{"level":184,"cost":165},{"level":185,"cost":165},{"level":186,"cost":166},{"level":187,"cost":167},{"level":188,"cost":167},{"level":189,"cost":168},{"level":190,"cost":169},{"level":191,"cost":169},{"level":192,"cost":170},{"level":193,"cost":171},{"level":194,"cost":171},{"level":195,"cost":172},{"level":196,"cost":173},{"level":197,"cost":173},{"level":198,"cost":174},{"level":199,"cost":175},{"level":200,"cost":175}]};
	if(typeof json_data != "undefined")
	{
		var d = json_data.d;
		summoners = d;
	}
}

function init_contributor_unit()
{
	var tmp = "";
	for(var i=0; i<units_by_name.length; i++)
	{
		tmp += '<option value="'+units_by_name[i].name+'">'+units_by_name[i].name+'</option>';
	}
	$("#u_name").html(tmp);
}

// Compare by Unit Name
function compare(a,b) {
	if (a.name < b.name)
		return -1;
	if (a.name > b.name)
		return 1;
	return 0;
}


function init_unit_exp_tables() {
  var exp_table_units = goclone(units);
  exp_table_units.unshift({"id":"10003","name":"Type 3","text":"Type 3","exp_table":"3", "max_lv":100});
  exp_table_units.unshift({"id":"10002","name":"Type 2","text":"Type 2","exp_table":"2", "max_lv":80});
  exp_table_units.unshift({"id":"10001","name":"Type 1","text":"Type 1","exp_table":"1", "max_lv":100});

  function format(x) {
	//if (!x.icon) return x.name; // optgroup
	//return "<img src='" + x.icon + "' width='19'/> " + x.name;
	return x.text;
  }
  
  $('#unit-to-level').select2({
    data: exp_table_units,
    formatResult: format,
    formatSelection: format,
  }).on('change', function(selectedObject){
    unit_selection(selectedObject.added);
  });
}

$(document).ready(function() {
	init_exp_table();
	check_checkbox();
	change_max_lv();
	change_selection();
	
	init_units();
	init_contributor_unit();
	init_summoners();
});
