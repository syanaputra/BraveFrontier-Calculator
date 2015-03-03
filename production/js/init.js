/**
 * @author Stephanus Yanaputra
 * @url http://bf-calc.com
 */
	// Load Contribution from User
	function load_contribution()
	{
		$("#contribution tbody").children().remove();
		$.post("table.php", {}, function (data) {
			console.log(data);
		})
		.error(function(data) {
			console.log(data);
		})
		.done(function(data) {
			if(typeof data.d != "undefined")
			{
				var d = data.d;
				for(var i=0; i<d.length; i++)
				{
					$("#contribution tbody").append("<tr><td>"+d[i].name+"</td><td>"+d[i].exp_type+"</td><td>"+d[i].counter+"</td></tr>");
				}
			}
		});
	}

	// AJAX Script
	function send_contribution()
	{
		var u_name = $("[name=u_name]").val();
		var exp_type = $("[name=exp_type]").val();
		var submitted_by = $("[name=submitted_by]").val();
		
		if(u_name != "" && exp_type !="")
		{
			$.post("store.php", {
				unit_name: u_name,
				exp_type: exp_type,
				submitted_by: submitted_by,
				token: "x",
			}, function (data) {
				console.log(data);
			})
			.error(function(data) {
				console.log(data);
			})
			.done(function(data) {
				if(data.status == "error")
				{
					alert(data.msg);
				}
				else if(data.status == "success")
				{
					alert(data.msg);
					
					$("input[name=u_name]").val("");
					$("input[name=submitted_by]").val("");
					load_contribution();
				}
			});
		}
	}

	function send_form()
	{
		var name = $("input[name=feedback_name]").val();
		var email = $("[name=feedback_email]").val();
		var comments = $("textarea[name=feedback_message]").val();
		
		if(name != "" && email != "" && comments != "")
		{
			$.post("send-email.php", {
				name: name,
				email: email,
				comments: comments,
				token: "x",
			}, function (data) {
				console.log(data);
			})
			.error(function(data) {
				console.log(data);
			})
			.done(function(data) {
				if(data.status == "error")
				{
					alert(data.msg);
				}
				else if(data.status == "success")
				{
					alert(data.msg);
					
					$("input[name=feedback_name]").val("");
					$("input[name=feedback_email]").val("");
					$("textarea[name=feedback_message]").val("");
				}
			});
		}
		else
		{
			alert("Please complete the form");
		}
	}

	$(function() {
		// Attach FastClick
		FastClick.attach(document.body);
		
		// Load Contribution from User
		load_contribution();
		
		// Improve mobile experience by auto closing the menu after click
		var hash = window.location.hash;
		hash && $('ul.nav a[href="' + hash + '"]').tab('show');
		
		$('[role="tab"]').on('click', function(){ 
			if($('#bf-navigation').hasClass("in")) {
				$(".navbar-toggle").trigger( "click" );
			}
			
			window.location.hash = this.hash;
			$("html, body").animate({ scrollTop: ($(".navbar-header").height() + 15) });
			
			if (typeof ga !== "undefined" && ga !== null) {
				ga('send', 'event', 'Navigation', 'Click', this.hash);
			}
		});
	});