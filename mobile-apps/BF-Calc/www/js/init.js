/**
 * @author Stephanus Yanaputra
 * @url http://bf-calc.com
 */
// Load Contribution from User
function load_contribution()
{
	$("#contribution tbody").children().remove();
	$.getJSON('http://bf-calc.com/table_mobile.php?callback=?', function(data) {
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
	
	$('a[href*="http://"]').click(function(event) {
		event.preventDefault();
		intel.xdk.device.launchExternal($(this).attr("href"));
		return false;
	});
});