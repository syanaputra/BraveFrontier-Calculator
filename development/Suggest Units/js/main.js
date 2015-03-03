(function($) {
	"use strict";
	
	var browser_height = $(window).height();
	var section_height, height_difference;
	var s;
	var $root = $('html, body');
	var perfect_scrollbar_elements = $('.perfect-scrollbar');
	
	// Hide Loading
	function hide_loading()
	{
		$("#loading").fadeOut();
	}
	
	// Section Auto Height
	function adjust_section()
	{
		$(".auto-height").each(function() {
			$(this).css("padding-top", 0);
			$(this).css("padding-bottom", 0);
			
			browser_height = $(window).height();
			section_height = $(this).height();
			height_difference = browser_height - section_height;
			
			if(height_difference > 0) {
				$(this).css("margin", 0);
				$(this).css("padding-top", height_difference/2);
				$(this).css("padding-bottom", height_difference/2);
			}
			else
			{
				$(this).css("padding-top", 35);
				$(this).css("padding-bottom", 35);
			}
		});
	}
	
	// Init Perfect Scroll
	function init_perfect_scroll()
	{
		perfect_scrollbar_elements.perfectScrollbar();
	}
	
	$(document).ready(function() {
		// Auto Adjust Height
		adjust_section();
		
		
		// Activate Perfect Scrollbar
		init_perfect_scroll();
		
		// Smooth Scroll
		$('a[href^="#"].page-scroll').click(function() {
			var href = $.attr(this, 'href');
			$root.animate({
				scrollTop: $(href).offset().top - navigation_height
			}, 750, function () {
				window.location.hash = href;
			});
			return false;
		});
		
		var $container = $('#search-result');
		// initialize
		$container.masonry({
			itemSelector: '.item'
		});
	});
	
	
	$( window ).resize(function() {
		adjust_section();
		perfect_scrollbar_elements.perfectScrollbar('update');
	});
	
	$(window).load(function() {
		adjust_section();
		
		setTimeout(function() {
			hide_loading();
			
			// Initiate WOW
			new WOW().init();
		}, 300);
	});
})(jQuery);