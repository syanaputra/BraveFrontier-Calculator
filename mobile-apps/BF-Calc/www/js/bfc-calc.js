/**
 * @author Stephanus Yanaputra
 * @url http://bf-calc.com
 */
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
		var $val = parseInt($tmp.val());
		if($val > parseInt($tmp.attr("max")))
		{
			$tmp.val($tmp.attr("max"));
		}
		else if($val < 1)
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
	var exp_table_units = [];
	var units = [];
	var units_by_name = [];
	var summoners = [];
	var old_summoners = [];
	var specific_info_selection = 0;
	var selected_unit_id;

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
	
	// jQuery Variables for quick cache
	$unitSelectionModal 	= $('#unitSelectionModal');
	$exp_table 				= $('exp_table');
	$calc_selection 		= $('#calc_selection');
	$selected_unit 			= $('#selected_unit');
	
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
	
	function calculate_needed_units(is_excluded, needed_exp, metal_unit_exp, exp_modifier) {
		if(is_excluded)
			total_metal_unit = 0;
		else
			total_metal_unit = Math.floor(needed_exp / (metal_unit_exp * exp_modifier));
		
		return total_metal_unit;
	}
	
	function calculate_remainder(prev_calculation, total_metal_unit, metal_unit_exp, exp_modifier) {
		return prev_calculation - (total_metal_unit * (metal_unit_exp * exp_modifier));
	}
	
	function calculated_required_zel(current_exp, exp_table, is_same_element, exp_modifier, total_crystal, total_god, total_king, total_slime)
	{
		// This calculation table stores 5 units worth fusion
		var calculation_table = [];
		var calculation = 0;
		var zel = 0;
		var current_lv = get_level(current_exp, exp_table);
		
		// Set the used EXP units
		var slime, king, god, crystal;
		if(is_same_element)
		{
			crystal = metal_crystal_same;
			god = metal_god_same;
			king = metal_king_same;
			slime = metal_slime_same;
		}
		else
		{
			crystal = metal_crystal;
			god = metal_god;
			king = metal_king;
			slime = metal_slime;
		}
		
		// Set the Tables
		//=====================================================
		// Add all metal units to the array table
		for(var i=0; i<total_slime; i++) { calculation_table.push(slime); }
		for(var i=0; i<total_king; i++) { calculation_table.push(king); }
		for(var i=0; i<total_god; i++) { calculation_table.push(god); }
		for(var i=0; i<total_crystal; i++) { calculation_table.push(crystal); }
		
		// Start Calculation
		//=====================================================
		var tmp_exp = 0, tmp_count = 0;
		for(var i=0; i<calculation_table.length; i++)
		{
			tmp_count++;
			tmp_exp += calculation_table[i];
			
			if((tmp_count % 5 == 0) || ((i+1) == calculation_table.length))
			{
				zel += tmp_count * (current_lv * 100) + (1 * 100);
				console.log(i + " - " + zel);
				current_exp += tmp_exp;
				current_lv = get_level(current_exp, exp_table);
				
				// Reset
				tmp_count = 0;
				tmp_exp = 0;
			}
		}
		
		return zel;
	}
	
	function get_level(current_exp, exp_table)
	{
		// Select Appropriate exp_table
		if (exp_table == 1 || exp_table == '1')
			selected_exp_table = exp_table_1;
		else if(exp_table == 2 || exp_table == '2')
			selected_exp_table = exp_table_2;
		else
			selected_exp_table = exp_table_3;
			
		for(var i = 1; i<=selected_exp_table.length; i++)
		{
			// Normal
			if (current_exp == selected_exp_table[i])
			{
				final_level = i;
				return final_level;
			}
			else if (current_exp < selected_exp_table[i])
			{
				final_level = i-1;
				return final_level;
			}
		}
	}

	function calculate()
	{
		// Which calculation are we doing?
		var calc_type = $calc_selection.val();
		
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
				var tmp_m1, tmp_m2, tmp_m3, tmp_m4;
				
				// Same Element
				var sm_crystal, sm_god, sm_king, sm_slime;			// Normal
				var sm_crystal_g, sm_god_g, sm_king_g, sm_slime_g;	// Great
				var sm_crystal_s, sm_god_s, sm_king_s, sm_slime_s;	// Super
				
				// Excludes
				var req_sm_crystal_excl, req_sm_god_excl, req_sm_king_excl;
				var req_sm_crystal_excl_g, req_sm_god_excl_g, req_sm_king_excl_g;
				var req_sm_crystal_excl_s, req_sm_god_excl_s, req_sm_king_excl_s;
				
				req_sm_crystal_excl 	= $("#req_sm_crystal_excl").is(':checked');
				req_sm_crystal_excl_g	= $("#req_sm_crystal_excl_g").is(':checked');
				req_sm_crystal_excl_s 	= $("#req_sm_crystal_excl_s").is(':checked');
				req_sm_god_excl 		= $("#req_sm_god_excl").is(':checked');
				req_sm_god_excl_g 		= $("#req_sm_god_excl_g").is(':checked');
				req_sm_god_excl_s 		= $("#req_sm_god_excl_s").is(':checked');
				req_sm_king_excl 		= $("#req_sm_king_excl").is(':checked');
				req_sm_king_excl_g 		= $("#req_sm_king_excl_g").is(':checked');
				req_sm_king_excl_s 		= $("#req_sm_king_excl_s").is(':checked');
				
				// Minus with Metal Crystal (NORMAL)
				sm_crystal 		= calculate_needed_units(req_sm_crystal_excl, required_exp, metal_crystal_same, 1);
				tmp_m1 			= calculate_remainder(required_exp, sm_crystal, metal_crystal_same, 1);
				
				sm_god 			= calculate_needed_units(req_sm_god_excl, tmp_m1, metal_god_same, 1);
				tmp_m2 			= calculate_remainder(tmp_m1, sm_god, metal_god_same, 1);
				
				sm_king 		= calculate_needed_units(req_sm_king_excl, tmp_m2, metal_king_same, 1);
				tmp_m3 			= calculate_remainder(tmp_m2, sm_king, metal_king_same, 1);
				
				sm_slime 		= calculate_needed_units(false, tmp_m3, metal_slime_same, 1);
				tmp_m4 			= calculate_remainder(tmp_m3, sm_king, metal_slime_same, 1);
				
				if(tmp_m4 > 0)
					sm_slime++;
				
				
				// Minus with Metal Crystal (GREAT)
				sm_crystal_g 	= calculate_needed_units(req_sm_crystal_excl_g, required_exp, metal_crystal_same, EXP_GREAT_MODIFIER);
				tmp_m1 			= calculate_remainder(required_exp, sm_crystal_g, metal_crystal_same, EXP_GREAT_MODIFIER);
				
				sm_god_g 		= calculate_needed_units(req_sm_god_excl_g, tmp_m1, metal_god_same, EXP_GREAT_MODIFIER);
				tmp_m2 			= calculate_remainder(tmp_m1, sm_god_g, metal_god_same, EXP_GREAT_MODIFIER);
				
				sm_king_g 		= calculate_needed_units(req_sm_king_excl_g, tmp_m2, metal_king_same, EXP_GREAT_MODIFIER);
				tmp_m3 			= calculate_remainder(tmp_m2, sm_king_g, metal_king_same, EXP_GREAT_MODIFIER);
				
				sm_slime_g 		= calculate_needed_units(false, tmp_m3, metal_slime_same, EXP_GREAT_MODIFIER);
				tmp_m4 			= calculate_remainder(tmp_m3, sm_king_g, metal_slime_same, EXP_GREAT_MODIFIER);
				
				if(tmp_m4 > 0)
					sm_slime_g++;		
				
				
				// Minus with Metal Crystal (SUPER)
				sm_crystal_s 	= calculate_needed_units(req_sm_crystal_excl_s, required_exp, metal_crystal_same, EXP_SUPER_MODIFIER);
				tmp_m1 			= calculate_remainder(required_exp, sm_crystal_s, metal_crystal_same, EXP_SUPER_MODIFIER);
				
				sm_god_s 		= calculate_needed_units(req_sm_god_excl_s, tmp_m1, metal_god_same, EXP_SUPER_MODIFIER);
				tmp_m2 			= calculate_remainder(tmp_m1, sm_god_s, metal_god_same, EXP_SUPER_MODIFIER);
				
				sm_king_s 		= calculate_needed_units(req_sm_king_excl_s, tmp_m2, metal_king_same, EXP_SUPER_MODIFIER);
				tmp_m3 			= calculate_remainder(tmp_m2, sm_king_s, metal_king_same, EXP_SUPER_MODIFIER);
				
				sm_slime_s 		= calculate_needed_units(false, tmp_m3, metal_slime_same, EXP_SUPER_MODIFIER);
				tmp_m4 			= calculate_remainder(tmp_m3, sm_king_s, metal_slime_same, EXP_SUPER_MODIFIER);
				
				if(tmp_m4 > 0)
					sm_slime_s++;	
					
					
				// Output
				// -- Req Metal Units (NORMAL)
				$("#req_sm_crystal").text(sm_crystal);
				$("#req_sm_god").text(sm_god);
				$("#req_sm_king").text(sm_king);
				$("#req_sm_slime").text(sm_slime);
				
				// -- Req Metal Units (GREAT)
				$("#req_sm_crystal_g").text(sm_crystal_g);
				$("#req_sm_god_g").text(sm_god_g);
				$("#req_sm_king_g").text(sm_king_g);
				$("#req_sm_slime_g").text(sm_slime_g);
				
				// -- Req Metal Units (SUPER)
				$("#req_sm_crystal_s").text(sm_crystal_s);
				$("#req_sm_god_s").text(sm_god_s);
				$("#req_sm_king_s").text(sm_king_s);
				$("#req_sm_slime_s").text(sm_slime_s);
				
				
				// Different Element
				var dm_crystal, dm_god, dm_king, dm_slime;			// Normal
				var dm_crystal_g, dm_god_g, dm_king_g, dm_slime_g;	// Great
				var dm_crystal_s, dm_god_s, dm_king_s, dm_slime_s;	// Super
				
				// Excludes
				var req_dm_crystal_excl, req_dm_god_excl, req_dm_king_excl;
				var req_dm_crystal_excl_g, req_dm_god_excl_g, req_dm_king_excl_g;
				var req_dm_crystal_excl_s, req_dm_god_excl_s, req_dm_king_excl_s;
				
				req_dm_crystal_excl 	= $("#req_dm_crystal_excl").is(':checked');
				req_dm_crystal_excl_g	= $("#req_dm_crystal_excl_g").is(':checked');
				req_dm_crystal_excl_s 	= $("#req_dm_crystal_excl_s").is(':checked');
				req_dm_god_excl 		= $("#req_dm_god_excl").is(':checked');
				req_dm_god_excl_g 		= $("#req_dm_god_excl_g").is(':checked');
				req_dm_god_excl_s 		= $("#req_dm_god_excl_s").is(':checked');
				req_dm_king_excl 		= $("#req_dm_king_excl").is(':checked');
				req_dm_king_excl_g 		= $("#req_dm_king_excl_g").is(':checked');
				req_dm_king_excl_s 		= $("#req_dm_king_excl_s").is(':checked');
				
				// Minus with Metal Crystal (NORMAL)
				dm_crystal 		= calculate_needed_units(req_dm_crystal_excl, required_exp, metal_crystal, 1);
				tmp_m1 			= calculate_remainder(required_exp, dm_crystal, metal_crystal, 1);
				
				dm_god 			= calculate_needed_units(req_dm_god_excl, tmp_m1, metal_god, 1);
				tmp_m2 			= calculate_remainder(tmp_m1, dm_god, metal_god, 1);
				
				dm_king 		= calculate_needed_units(req_dm_king_excl, tmp_m2, metal_king, 1);
				tmp_m3 			= calculate_remainder(tmp_m2, dm_king, metal_king, 1);
				
				dm_slime 		= calculate_needed_units(false, tmp_m3, metal_slime, 1);
				tmp_m4 			= calculate_remainder(tmp_m3, dm_king, metal_slime, 1);
				
				if(tmp_m4 > 0)
					dm_slime++;
				
				
				// Minus with Metal Crystal (GREAT)
				dm_crystal_g 	= calculate_needed_units(req_dm_crystal_excl_g, required_exp, metal_crystal, EXP_GREAT_MODIFIER);
				tmp_m1 			= calculate_remainder(required_exp, dm_crystal_g, metal_crystal, EXP_GREAT_MODIFIER);
				
				dm_god_g 		= calculate_needed_units(req_dm_god_excl_g, tmp_m1, metal_god, EXP_GREAT_MODIFIER);
				tmp_m2 			= calculate_remainder(tmp_m1, dm_god_g, metal_god, EXP_GREAT_MODIFIER);
				
				dm_king_g 		= calculate_needed_units(req_dm_king_excl_g, tmp_m2, metal_king, EXP_GREAT_MODIFIER);
				tmp_m3 			= calculate_remainder(tmp_m2, dm_king_g, metal_king, EXP_GREAT_MODIFIER);
				
				dm_slime_g 		= calculate_needed_units(false, tmp_m3, metal_slime, EXP_GREAT_MODIFIER);
				tmp_m4 			= calculate_remainder(tmp_m3, dm_king_g, metal_slime, EXP_GREAT_MODIFIER);
				
				if(tmp_m4 > 0)
					dm_slime_g++;	
					
				
				// Minus with Metal Crystal (SUPER)
				dm_crystal_s 	= calculate_needed_units(req_dm_crystal_excl_s, required_exp, metal_crystal, EXP_SUPER_MODIFIER);
				tmp_m1 			= calculate_remainder(required_exp, dm_crystal_s, metal_crystal, EXP_SUPER_MODIFIER);
				
				dm_god_s 		= calculate_needed_units(req_dm_god_excl_s, tmp_m1, metal_god, EXP_SUPER_MODIFIER);
				tmp_m2 			= calculate_remainder(tmp_m1, dm_god_s, metal_god, EXP_SUPER_MODIFIER);
				
				dm_king_s 		= calculate_needed_units(req_dm_king_excl_s, tmp_m2, metal_king, EXP_SUPER_MODIFIER);
				tmp_m3 			= calculate_remainder(tmp_m2, dm_king_s, metal_king, EXP_SUPER_MODIFIER);
				
				dm_slime_s 		= calculate_needed_units(false, tmp_m3, metal_slime, EXP_SUPER_MODIFIER);
				tmp_m4 			= calculate_remainder(tmp_m3, dm_king_s, metal_slime, EXP_SUPER_MODIFIER);
				
				
				// Output
				// -- Req Metal Units (NORMAL)
				$("#req_dm_crystal").text(dm_crystal);
				$("#req_dm_god").text(dm_god);
				$("#req_dm_king").text(dm_king);
				$("#req_dm_slime").text(dm_slime);
				
				// -- Req Metal Units (GREAT)
				$("#req_dm_crystal_g").text(dm_crystal_g);
				$("#req_dm_god_g").text(dm_god_g);
				$("#req_dm_king_g").text(dm_king_g);
				$("#req_dm_slime_g").text(dm_slime_g);
				
				// -- Req Metal Units (SUPER)
				$("#req_dm_crystal_s").text(dm_crystal_s);
				$("#req_dm_god_s").text(dm_god_s);
				$("#req_dm_king_s").text(dm_king_s);
				$("#req_dm_slime_s").text(dm_slime_s);
				
				// Find out Required Zel
				var zel_sm 		= calculated_required_zel(current_exp, exp_table, true, EXP_NORMAL_MODIFIER, sm_crystal, sm_god, sm_king, sm_slime);
				var zel_sm_g 	= calculated_required_zel(current_exp, exp_table, true, EXP_GREAT_MODIFIER, sm_crystal_g, sm_god_g, sm_king_g, sm_slime_g);
				var zel_sm_s 	= calculated_required_zel(current_exp, exp_table, true, EXP_SUPER_MODIFIER, sm_crystal_s, sm_god_s, sm_king_s, sm_slime_s);
				
				var zel_dm 		= calculated_required_zel(current_exp, exp_table, false, EXP_NORMAL_MODIFIER, dm_crystal, dm_god, dm_king, dm_slime);
				var zel_dm_g 	= calculated_required_zel(current_exp, exp_table, false, EXP_GREAT_MODIFIER, dm_crystal_g, dm_god_g, dm_king_g, dm_slime_g);
				var zel_dm_s 	= calculated_required_zel(current_exp, exp_table, false, EXP_SUPER_MODIFIER, dm_crystal_s, dm_god_s, dm_king_s, dm_slime_s);
				
				// -- Req Zel
				$("#zel_sm").html(zel_sm);
				$("#zel_sm_g").html(zel_sm_g);
				$("#zel_sm_s").html(zel_sm_s);
				
				$("#zel_dm").html(zel_dm);
				$("#zel_dm_g").html(zel_dm_g);
				$("#zel_dm_s").html(zel_dm_s);
				
				// -- Req Exp
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
				final_exp_great = final_exp * EXP_GREAT_MODIFIER;
				final_exp_super = final_exp * EXP_SUPER_MODIFIER;
				
				final_bool = false;
				final_bool_great = false;
				final_bool_super = false;
				
				for(var i = current_lv; i<=selected_exp_table.length; i++)
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
		switch($exp_table.val())
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
	
	function us_select_unit($id)
	{
		unit_selection(exp_table_units[$id]);
		$selected_unit.html('<img src="'+exp_table_units[$id].icon+'" /> ' + exp_table_units[$id].name);
		$unitSelectionModal.modal('hide');
	}
	
	function unit_selection($val, $is_using_id)
	{
		// Set Default
		$is_using_id = typeof $is_using_id !== 'undefined' ? $is_using_id : false;
		
		var max_lv = "";
		var $cur_lv = $("#current_lv");
		var $tar_lv = $("#target_lv");
		var cur_lv = parseInt($cur_lv.val());
		var tar_lv = parseInt($tar_lv.val());
		var m_image = "";
		var unit;
		
		if($is_using_id == true)
			unit = units[$val];
		else
			unit = $val;
		
		if(typeof(unit.max_lv) == "undefined")
		{
			max_lv = "???";
		}
		else
		{
			max_lv = unit.max_lv;
		
			$cur_lv.attr("max",max_lv);
			$tar_lv.attr("max",max_lv);
			
			if(cur_lv > max_lv)
				$cur_lv.val(max_lv);
				
			if(tar_lv > max_lv)
				$tar_lv.val(max_lv);
			
			exp_table_selected = unit.exp_table;
			
			if(specific_info_selection == 0) {
				$tar_lv.val(max_lv);
			}
		}
		
		selected_unit_id = unit.id;
		
		switch(unit.element.toLowerCase())
		{
			default:
			case "dark"		:
				m_image_crystal	= "http://img2.wikia.nocookie.net/__cb20140515024407/bravefrontierglobal/images/thumb/7/77/Unit_ills_thum_60334.png/42px-Unit_ills_thum_60334.png";
				m_image_god 	= "http://img4.wikia.nocookie.net/__cb20131101125031/bravefrontierglobal/images/thumb/0/0b/Unit_ills_thum_60134.png/42px-Unit_ills_thum_60134.png";
				m_image_king 	= "http://img3.wikia.nocookie.net/__cb20131101125016/bravefrontierglobal/images/thumb/9/95/Unit_ills_thum_60133.png/42px-Unit_ills_thum_60133.png";
				m_image_slime 	= "http://img1.wikia.nocookie.net/__cb20131101124958/bravefrontierglobal/images/thumb/a/ae/Unit_ills_thum_60132.png/42px-Unit_ills_thum_60132.png";
				
				dm_image_crystal	= "http://img2.wikia.nocookie.net/__cb20140515023629/bravefrontierglobal/images/thumb/a/ae/Unit_ills_thum_50364.png/42px-Unit_ills_thum_50364.png";
				dm_image_god 	= "http://img2.wikia.nocookie.net/__cb20140429154658/bravefrontierglobal/images/thumb/3/36/Unit_ills_thum_50204.png/42px-Unit_ills_thum_50204.png";
				dm_image_king 	= "http://img1.wikia.nocookie.net/__cb20140429154643/bravefrontierglobal/images/thumb/4/4b/Unit_ills_thum_50203.png/42px-Unit_ills_thum_50203.png";
				dm_image_slime 	= "http://img4.wikia.nocookie.net/__cb20140501161803/bravefrontierglobal/images/thumb/0/0f/Unit_ills_thum_50202.png/42px-Unit_ills_thum_50202.png";
			break;
			case "light"	: 
				m_image_crystal	= "http://img2.wikia.nocookie.net/__cb20140515023629/bravefrontierglobal/images/thumb/a/ae/Unit_ills_thum_50364.png/42px-Unit_ills_thum_50364.png";
				m_image_god 	= "http://img2.wikia.nocookie.net/__cb20140429154658/bravefrontierglobal/images/thumb/3/36/Unit_ills_thum_50204.png/42px-Unit_ills_thum_50204.png";
				m_image_king 	= "http://img1.wikia.nocookie.net/__cb20140429154643/bravefrontierglobal/images/thumb/4/4b/Unit_ills_thum_50203.png/42px-Unit_ills_thum_50203.png";
				m_image_slime 	= "http://img4.wikia.nocookie.net/__cb20140501161803/bravefrontierglobal/images/thumb/0/0f/Unit_ills_thum_50202.png/42px-Unit_ills_thum_50202.png";
				
				dm_image_crystal	= "http://img4.wikia.nocookie.net/__cb20140515024216/bravefrontierglobal/images/thumb/9/92/Unit_ills_thum_10344.png/42px-Unit_ills_thum_10344.png";
				dm_image_god 	= "http://img2.wikia.nocookie.net/__cb20140320100554/bravefrontierglobal/images/thumb/0/0d/Unit_ills_thum_10204.png/42px-Unit_ills_thum_10204.png";
				dm_image_king 	= "http://img3.wikia.nocookie.net/__cb20140320100538/bravefrontierglobal/images/thumb/e/e0/Unit_ills_thum_10203.png/42px-Unit_ills_thum_10203.png";
				dm_image_slime 	= "http://img1.wikia.nocookie.net/__cb20140320100516/bravefrontierglobal/images/thumb/1/1e/Unit_ills_thum_10202.png/42px-Unit_ills_thum_10202.png";
			break;
			case "fire"		:
				m_image_crystal	= "http://img4.wikia.nocookie.net/__cb20140515024216/bravefrontierglobal/images/thumb/9/92/Unit_ills_thum_10344.png/42px-Unit_ills_thum_10344.png";
				m_image_god 	= "http://img2.wikia.nocookie.net/__cb20140320100554/bravefrontierglobal/images/thumb/0/0d/Unit_ills_thum_10204.png/42px-Unit_ills_thum_10204.png";
				m_image_king 	= "http://img3.wikia.nocookie.net/__cb20140320100538/bravefrontierglobal/images/thumb/e/e0/Unit_ills_thum_10203.png/42px-Unit_ills_thum_10203.png";
				m_image_slime 	= "http://img1.wikia.nocookie.net/__cb20140320100516/bravefrontierglobal/images/thumb/1/1e/Unit_ills_thum_10202.png/42px-Unit_ills_thum_10202.png";
				
				dm_image_crystal	= "http://img3.wikia.nocookie.net/__cb20140515024130/bravefrontierglobal/images/thumb/1/10/Unit_ills_thum_20334.png/42px-Unit_ills_thum_20334.png";
				dm_image_god 	= "http://img4.wikia.nocookie.net/__cb20140320101057/bravefrontierglobal/images/thumb/f/f0/Unit_ills_thum_20204.png/42px-Unit_ills_thum_20204.png";
				dm_image_king 	= "http://img2.wikia.nocookie.net/__cb20140320101045/bravefrontierglobal/images/thumb/a/a0/Unit_ills_thum_20203.png/42px-Unit_ills_thum_20203.png";
				dm_image_slime 	= "http://img2.wikia.nocookie.net/__cb20140320101031/bravefrontierglobal/images/thumb/f/f8/Unit_ills_thum_20202.png/42px-Unit_ills_thum_20202.png";
			break;
			case "water"	: 
				m_image_crystal	= "http://img3.wikia.nocookie.net/__cb20140515024130/bravefrontierglobal/images/thumb/1/10/Unit_ills_thum_20334.png/42px-Unit_ills_thum_20334.png";
				m_image_god 	= "http://img4.wikia.nocookie.net/__cb20140320101057/bravefrontierglobal/images/thumb/f/f0/Unit_ills_thum_20204.png/42px-Unit_ills_thum_20204.png";
				m_image_king 	= "http://img2.wikia.nocookie.net/__cb20140320101045/bravefrontierglobal/images/thumb/a/a0/Unit_ills_thum_20203.png/42px-Unit_ills_thum_20203.png";
				m_image_slime 	= "http://img2.wikia.nocookie.net/__cb20140320101031/bravefrontierglobal/images/thumb/f/f8/Unit_ills_thum_20202.png/42px-Unit_ills_thum_20202.png";
				
				dm_image_crystal	= "http://img2.wikia.nocookie.net/__cb20140515023803/bravefrontierglobal/images/thumb/a/aa/Unit_ills_thum_40324.png/42px-Unit_ills_thum_40324.png";
				dm_image_god 	= "http://img1.wikia.nocookie.net/__cb20140429173742/bravefrontierglobal/images/thumb/f/f6/Unit_ills_thum_40204.png/42px-Unit_ills_thum_40204.png";
				dm_image_king 	= "http://img2.wikia.nocookie.net/__cb20140429173919/bravefrontierglobal/images/thumb/5/5f/Unit_ills_thum_40203.png/42px-Unit_ills_thum_40203.png";
				dm_image_slime 	= "http://img3.wikia.nocookie.net/__cb20140429173600/bravefrontierglobal/images/thumb/3/37/Unit_ills_thum_40202.png/42px-Unit_ills_thum_40202.png";
			break;
			case "thunder"	: 
				m_image_crystal	= "http://img2.wikia.nocookie.net/__cb20140515023803/bravefrontierglobal/images/thumb/a/aa/Unit_ills_thum_40324.png/42px-Unit_ills_thum_40324.png";
				m_image_god 	= "http://img1.wikia.nocookie.net/__cb20140429173742/bravefrontierglobal/images/thumb/f/f6/Unit_ills_thum_40204.png/42px-Unit_ills_thum_40204.png";
				m_image_king 	= "http://img2.wikia.nocookie.net/__cb20140429173919/bravefrontierglobal/images/thumb/5/5f/Unit_ills_thum_40203.png/42px-Unit_ills_thum_40203.png";
				m_image_slime 	= "http://img3.wikia.nocookie.net/__cb20140429173600/bravefrontierglobal/images/thumb/3/37/Unit_ills_thum_40202.png/42px-Unit_ills_thum_40202.png";
			
				dm_image_crystal	= "http://img3.wikia.nocookie.net/__cb20140515023825/bravefrontierglobal/images/thumb/b/bb/Unit_ills_thum_30324.png/42px-Unit_ills_thum_30324.png";
				dm_image_god 	= "http://img2.wikia.nocookie.net/__cb20140429161050/bravefrontierglobal/images/thumb/8/8b/Unit_ills_thum_30204.png/42px-Unit_ills_thum_30204.png";
				dm_image_king 	= "http://img1.wikia.nocookie.net/__cb20140429161046/bravefrontierglobal/images/thumb/1/1d/Unit_ills_thum_30203.png/42px-Unit_ills_thum_30203.png";
				dm_image_slime 	= "http://img1.wikia.nocookie.net/__cb20140429161036/bravefrontierglobal/images/thumb/6/63/Unit_ills_thum_30202.png/42px-Unit_ills_thum_30202.png";
			break;
			case "earth"	: 
				m_image_crystal	= "http://img3.wikia.nocookie.net/__cb20140515023825/bravefrontierglobal/images/thumb/b/bb/Unit_ills_thum_30324.png/42px-Unit_ills_thum_30324.png";
				m_image_god 	= "http://img2.wikia.nocookie.net/__cb20140429161050/bravefrontierglobal/images/thumb/8/8b/Unit_ills_thum_30204.png/42px-Unit_ills_thum_30204.png";
				m_image_king 	= "http://img1.wikia.nocookie.net/__cb20140429161046/bravefrontierglobal/images/thumb/1/1d/Unit_ills_thum_30203.png/42px-Unit_ills_thum_30203.png";
				m_image_slime 	= "http://img1.wikia.nocookie.net/__cb20140429161036/bravefrontierglobal/images/thumb/6/63/Unit_ills_thum_30202.png/42px-Unit_ills_thum_30202.png";
				
				dm_image_crystal	= "http://img2.wikia.nocookie.net/__cb20140515024407/bravefrontierglobal/images/thumb/7/77/Unit_ills_thum_60334.png/42px-Unit_ills_thum_60334.png";
				dm_image_god 	= "http://img4.wikia.nocookie.net/__cb20131101125031/bravefrontierglobal/images/thumb/0/0b/Unit_ills_thum_60134.png/42px-Unit_ills_thum_60134.png";
				dm_image_king 	= "http://img3.wikia.nocookie.net/__cb20131101125016/bravefrontierglobal/images/thumb/9/95/Unit_ills_thum_60133.png/42px-Unit_ills_thum_60133.png";
				dm_image_slime 	= "http://img1.wikia.nocookie.net/__cb20131101124958/bravefrontierglobal/images/thumb/a/ae/Unit_ills_thum_60132.png/42px-Unit_ills_thum_60132.png";
			break;
		}
		
		$(".r_m_crystal").attr("src",m_image_crystal);
		$(".r_m_god").attr("src",m_image_god);
		$(".r_m_king").attr("src",m_image_king);
		$(".r_m_slime").attr("src",m_image_slime);
		
		$(".dr_m_crystal").attr("src",dm_image_crystal);
		$(".dr_m_god").attr("src",dm_image_god);
		$(".dr_m_king").attr("src",dm_image_king);
		$(".dr_m_slime").attr("src",dm_image_slime);
		
		$("#max_lv").text(max_lv);
	}

	function change_selection()
	{
		$("#calc_selection_1").hide();
		$("#calc_selection_2").hide();
		switch($calc_selection.val())
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

	function get_old_summoner_minimum_lv($cost) {
		for(var i=0; i<old_summoners.length; i++)
		{
			if(old_summoners[i].cost >= $cost)
			{
				return old_summoners[i].level;
			}
		}
		return old_summoners.length;
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
	
	function us_search() {
		var tu_query = $("#us-search").val();
		var tu_element = $("#us-search-element").val();
		$("#unit-list-selectable").children().hide();
		$('#unit-list-selectable .tu-title').each(function(){
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
		var min_old_summoner_lv = get_old_summoner_minimum_lv(parseInt(tmp));
		$("#tu-summoner-lv").text(min_summoner_lv);
		$("#tu-old-summoner-lv").text(min_old_summoner_lv);
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
	
	function select_unit_refresh() {
		var tmp = "";
		for(var i=0; i<exp_table_units.length; i++)
		{
			tmp += get_unit_selection_html(i);
		}
		$("#unit-list-selectable").html(tmp);
		
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
		var html = "";
		
		if($action == "add")
			onclick_action = "tu_add("+$id+")";
		else
			onclick_action = "tu_remove("+$param+")";
		
		if(units[$id].icon == null)
			units[$id].icon = 'http://img3.wikia.nocookie.net/__cb20140402135350/bravefrontierglobal/images/thumb/9/9b/Unit_ills_thum_00000.png/42px-Unit_ills_thum_00000.png';
		
		if($action == "remove")
			return '<div class="tu-unit" onclick="'+onclick_action+'"><img class="lazy" src="'+units[$id].icon+'" /><span class="tu-title">'+units[$id].name+'</span><span class="tu-element hidden">'+units[$id].element+'</span><span class="tu-cost">Cost: <strong>'+units[$id].cost+'</strong></span></div>';
		else
			return '<div class="tu-unit" onclick="'+onclick_action+'"><img class="lazy" src="http://img3.wikia.nocookie.net/__cb20140402135350/bravefrontierglobal/images/thumb/9/9b/Unit_ills_thum_00000.png/42px-Unit_ills_thum_00000.png" data-original="'+units[$id].icon+'" /><span class="tu-title">'+units[$id].name+'</span><span class="tu-element hidden">'+units[$id].element+'</span><span class="tu-cost">Cost: <strong>'+units[$id].cost+'</strong></span></div>';
	}
	
	function get_unit_selection_html($id) {
		var onclick_action = "us_select_unit("+$id+")";
		var html = "";
		
		if(exp_table_units[$id].icon == null)
			exp_table_units[$id].icon = 'http://img3.wikia.nocookie.net/__cb20140402135350/bravefrontierglobal/images/thumb/9/9b/Unit_ills_thum_00000.png/42px-Unit_ills_thum_00000.png';
		
		return '<div class="tu-unit" onclick="'+onclick_action+'"><img class="lazy" src="'+exp_table_units[$id].icon+'" /><span class="tu-title">'+exp_table_units[$id].name+'</span><span class="tu-element hidden">'+exp_table_units[$id].element+'</span></div>';
	}

	function get_empty_unit_html() {
		return '<div class="tu-unit empty"><img src="http://img3.wikia.nocookie.net/__cb20140402135350/bravefrontierglobal/images/thumb/9/9b/Unit_ills_thum_00000.png/42px-Unit_ills_thum_00000.png" /><span class="tu-title">Empty</span></div>';
	}

	function init_units()
	{
		var json_data, json_data_2;
		var timer_looker;
		
		// Try to init remotely
		$.getJSON('http://bf-calc.com/get_units_mobile.php?callback=?', function(data) {
			console.log(data);
		})
		.error(function(data) {
			console.log(data);
			
			// If it doesn't work, throw error message
			unit_is_loaded = true;
			console.log("Load Failed. Interenet connection is required.");
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
				init_contributor_unit();
				tu_team_refresh();
				
				// Process Daily Vortex & Key Time
				/*
				$('#daily-vortex-countdown').countdown({
					date: json_data.daily_vortex,
					startDate: json_data.current_date_time,
					render: function(date) {
						return $(this.el).html("<span class='c-field'><span class='c-number'>" + date.days + "</span> days</span><span class='c-field'><span class='c-number'>" + (this.leadingZeros(date.hours)) + "</span> hours</span><span class='c-field'><span class='c-number'>" + (this.leadingZeros(date.min)) + "</span> min</span><span class='c-field'><span class='c-number'>" + (this.leadingZeros(date.sec)) + "</span> sec</span>");
					}
				});
				*/
				$('#vortex-image').html("<img src='images/daily-events/"+json_data.daily_vortex_type+".png' class='img-responsive' />");
				/*
				$('#daily-key-countdown').countdown({
					date: json_data.daily_key,
					startDate: json_data.current_date_time,
					render: function(date) {
						return $(this.el).html("<span class='c-field'><span class='c-number'>" + date.days + "</span> days</span><span class='c-field'><span class='c-number'>" + (this.leadingZeros(date.hours)) + "</span> hours</span><span class='c-field'><span class='c-number'>" + (this.leadingZeros(date.min)) + "</span> min</span><span class='c-field'><span class='c-number'>" + (this.leadingZeros(date.sec)) + "</span> sec</span>");
					}
				});
				*/
				if(json_data.daily_key_type != "")
					$('#daily-key-image').html("<img src='images/"+json_data.daily_key_type+"-key.png' class='img-responsive' />");
				else
					$('#daily-key-image').html("<strong>No Key for today</strong>");
				
				$("img.lazy").lazyload({
					container: $("#tu-unit-list"),
				});
				
				window.clearInterval(timer_looker);
			}
		},200);
	}

	function init_summoners()
	{
		var json_data = {
			"new_summoners":[{"level":1,"cost":30},{"level":2,"cost":31},{"level":3,"cost":32},{"level":4,"cost":33},{"level":5,"cost":34},{"level":6,"cost":35},{"level":7,"cost":35},{"level":8,"cost":36},{"level":9,"cost":36},{"level":10,"cost":41},{"level":11,"cost":41},{"level":12,"cost":42},{"level":13,"cost":42},{"level":14,"cost":43},{"level":15,"cost":43},{"level":16,"cost":44},{"level":17,"cost":44},{"level":18,"cost":45},{"level":19,"cost":45},{"level":20,"cost":50},{"level":21,"cost":50},{"level":22,"cost":51},{"level":23,"cost":51},{"level":24,"cost":52},{"level":25,"cost":52},{"level":26,"cost":53},{"level":27,"cost":53},{"level":28,"cost":54},{"level":29,"cost":54},{"level":30,"cost":59},{"level":31,"cost":59},{"level":32,"cost":60},{"level":33,"cost":60},{"level":34,"cost":61},{"level":35,"cost":61},{"level":36,"cost":62},{"level":37,"cost":62},{"level":38,"cost":63},{"level":39,"cost":63},{"level":40,"cost":68},{"level":41,"cost":68},{"level":42,"cost":69},{"level":43,"cost":69},{"level":44,"cost":70},{"level":45,"cost":70},{"level":46,"cost":71},{"level":47,"cost":71},{"level":48,"cost":72},{"level":49,"cost":72},{"level":50,"cost":77},{"level":51,"cost":77},{"level":52,"cost":78},{"level":53,"cost":78},{"level":54,"cost":79},{"level":55,"cost":79},{"level":56,"cost":80},{"level":57,"cost":80},{"level":58,"cost":81},{"level":59,"cost":81},{"level":60,"cost":86},{"level":61,"cost":86},{"level":62,"cost":87},{"level":63,"cost":87},{"level":64,"cost":88},{"level":65,"cost":88},{"level":66,"cost":89},{"level":67,"cost":89},{"level":68,"cost":90},{"level":69,"cost":90},{"level":70,"cost":95},{"level":71,"cost":95},{"level":72,"cost":96},{"level":73,"cost":96},{"level":74,"cost":97},{"level":75,"cost":97},{"level":76,"cost":98},{"level":77,"cost":98},{"level":78,"cost":99},{"level":79,"cost":99},{"level":80,"cost":104},{"level":81,"cost":104},{"level":82,"cost":105},{"level":83,"cost":105},{"level":84,"cost":106},{"level":85,"cost":106},{"level":86,"cost":107},{"level":87,"cost":107},{"level":88,"cost":108},{"level":89,"cost":108},{"level":90,"cost":114},{"level":91,"cost":114},{"level":92,"cost":115},{"level":93,"cost":115},{"level":94,"cost":116},{"level":95,"cost":116},{"level":96,"cost":117},{"level":97,"cost":117},{"level":98,"cost":118},{"level":99,"cost":118},{"level":100,"cost":124},{"level":101,"cost":124},{"level":102,"cost":125},{"level":103,"cost":126},{"level":104,"cost":126},{"level":105,"cost":127},{"level":106,"cost":128},{"level":107,"cost":128},{"level":108,"cost":129},{"level":109,"cost":130},{"level":110,"cost":130},{"level":111,"cost":131},{"level":112,"cost":132},{"level":113,"cost":132},{"level":114,"cost":133},{"level":115,"cost":134},{"level":116,"cost":134},{"level":117,"cost":135},{"level":118,"cost":136},{"level":119,"cost":136},{"level":120,"cost":137},{"level":121,"cost":138},{"level":122,"cost":138},{"level":123,"cost":139},{"level":124,"cost":140},{"level":125,"cost":140},{"level":126,"cost":141},{"level":127,"cost":142},{"level":128,"cost":142},{"level":129,"cost":143},{"level":130,"cost":144},{"level":131,"cost":144},{"level":132,"cost":145},{"level":133,"cost":146},{"level":134,"cost":146},{"level":135,"cost":147},{"level":136,"cost":148},{"level":137,"cost":148},{"level":138,"cost":149},{"level":138,"cost":150},{"level":139,"cost":150},{"level":140,"cost":150},{"level":141,"cost":151},{"level":142,"cost":152},{"level":143,"cost":152},{"level":144,"cost":153},{"level":145,"cost":154},{"level":146,"cost":154},{"level":147,"cost":155},{"level":148,"cost":156},{"level":149,"cost":156},{"level":150,"cost":157},{"level":151,"cost":158},{"level":152,"cost":158},{"level":153,"cost":159},{"level":154,"cost":160},{"level":155,"cost":160},{"level":156,"cost":161},{"level":157,"cost":162},{"level":158,"cost":162},{"level":159,"cost":163},{"level":160,"cost":164},{"level":161,"cost":164},{"level":162,"cost":165},{"level":163,"cost":166},{"level":164,"cost":166},{"level":165,"cost":167},{"level":166,"cost":168},{"level":167,"cost":168},{"level":168,"cost":169},{"level":169,"cost":170},{"level":170,"cost":170},{"level":171,"cost":171},{"level":172,"cost":172},{"level":173,"cost":172},{"level":174,"cost":173},{"level":175,"cost":174},{"level":176,"cost":174},{"level":177,"cost":175},{"level":178,"cost":176},{"level":179,"cost":176},{"level":180,"cost":177},{"level":181,"cost":178},{"level":182,"cost":178},{"level":183,"cost":179},{"level":184,"cost":180},{"level":185,"cost":180},{"level":186,"cost":181},{"level":187,"cost":182},{"level":188,"cost":182},{"level":189,"cost":183},{"level":190,"cost":184},{"level":191,"cost":184},{"level":192,"cost":185},{"level":193,"cost":186},{"level":194,"cost":186},{"level":195,"cost":187},{"level":196,"cost":188},{"level":197,"cost":188},{"level":198,"cost":189},{"level":199,"cost":190},{"level":200,"cost":190}],
			"old_summoners":[{"level":1,"cost":15},{"level":2,"cost":16},{"level":3,"cost":17},{"level":4,"cost":18},{"level":5,"cost":19},{"level":6,"cost":20},{"level":7,"cost":20},{"level":8,"cost":21},{"level":9,"cost":21},{"level":10,"cost":26},{"level":11,"cost":26},{"level":12,"cost":27},{"level":13,"cost":27},{"level":14,"cost":28},{"level":15,"cost":28},{"level":16,"cost":29},{"level":17,"cost":29},{"level":18,"cost":30},{"level":19,"cost":30},{"level":20,"cost":35},{"level":21,"cost":36},{"level":22,"cost":36},{"level":23,"cost":36},{"level":24,"cost":37},{"level":25,"cost":37},{"level":26,"cost":38},{"level":27,"cost":38},{"level":28,"cost":39},{"level":29,"cost":39},{"level":30,"cost":44},{"level":31,"cost":44},{"level":32,"cost":45},{"level":33,"cost":45},{"level":34,"cost":46},{"level":35,"cost":46},{"level":36,"cost":47},{"level":37,"cost":47},{"level":38,"cost":48},{"level":39,"cost":48},{"level":40,"cost":53},{"level":41,"cost":53},{"level":42,"cost":54},{"level":43,"cost":54},{"level":44,"cost":55},{"level":45,"cost":55},{"level":46,"cost":56},{"level":47,"cost":56},{"level":48,"cost":57},{"level":49,"cost":57},{"level":50,"cost":62},{"level":51,"cost":62},{"level":52,"cost":63},{"level":53,"cost":63},{"level":54,"cost":64},{"level":55,"cost":64},{"level":56,"cost":65},{"level":57,"cost":65},{"level":58,"cost":66},{"level":59,"cost":66},{"level":60,"cost":71},{"level":61,"cost":71},{"level":62,"cost":72},{"level":63,"cost":72},{"level":64,"cost":73},{"level":65,"cost":73},{"level":66,"cost":74},{"level":67,"cost":74},{"level":68,"cost":75},{"level":69,"cost":75},{"level":70,"cost":80},{"level":71,"cost":80},{"level":72,"cost":81},{"level":73,"cost":81},{"level":74,"cost":82},{"level":75,"cost":82},{"level":76,"cost":83},{"level":77,"cost":83},{"level":78,"cost":84},{"level":79,"cost":84},{"level":80,"cost":89},{"level":81,"cost":89},{"level":82,"cost":90},{"level":83,"cost":90},{"level":84,"cost":91},{"level":85,"cost":91},{"level":86,"cost":92},{"level":87,"cost":92},{"level":88,"cost":93},{"level":89,"cost":94},{"level":90,"cost":99},{"level":91,"cost":99},{"level":92,"cost":100},{"level":93,"cost":100},{"level":94,"cost":101},{"level":95,"cost":101},{"level":96,"cost":102},{"level":97,"cost":102},{"level":98,"cost":103},{"level":99,"cost":103},{"level":100,"cost":109},{"level":101,"cost":109},{"level":102,"cost":110},{"level":103,"cost":111},{"level":104,"cost":111},{"level":105,"cost":112},{"level":106,"cost":112},{"level":107,"cost":113},{"level":108,"cost":114},{"level":109,"cost":115},{"level":110,"cost":115},{"level":111,"cost":116},{"level":112,"cost":117},{"level":113,"cost":117},{"level":114,"cost":118},{"level":115,"cost":119},{"level":116,"cost":119},{"level":117,"cost":120},{"level":118,"cost":121},{"level":119,"cost":121},{"level":120,"cost":122},{"level":121,"cost":123},{"level":122,"cost":123},{"level":123,"cost":124},{"level":124,"cost":125},{"level":125,"cost":125}]
		};
		if(typeof json_data != "undefined")
		{
			summoners = json_data.new_summoners;
			old_summoners = json_data.old_summoners;
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
		exp_table_units = goclone(units);
		exp_table_units.unshift({"id":"10003","name":"Type 3","text":"Type 3","exp_table":"3", "max_lv":"100", "element":"Dark"});
		exp_table_units.unshift({"id":"10002","name":"Type 2","text":"Type 2","exp_table":"2", "max_lv":"80", "element":"Dark"});
		exp_table_units.unshift({"id":"10001","name":"Type 1","text":"Type 1","exp_table":"1", "max_lv":"100", "element":"Dark"});
		
		select_unit_refresh();
	}

	$(document).ready(function() {
		init_exp_table();
		check_checkbox();
		change_max_lv();
		change_selection();
		
		init_units();
		init_summoners();
	});