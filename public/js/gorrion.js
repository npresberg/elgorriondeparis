(function(){

	// Activates the Carousel
	$('.carousel').carousel({ interval: 5000 });

	// Tooltips
	$.fn.tooltip.Constructor.DEFAULTS.placement = 'auto';

	/*$('a[title]').tooltip();

	$('img[alt]').each(function() {
		if (!this.title) this.title = this.alt;
	}).tooltip();

	$('.tooltip-social').tooltip({ selector: "a[data-toggle=tooltip]" });*/

	// Project Page

	var all = $('#project .pagination li');

	var items = all.filter('.item').click(function() {
		select($(this));
		return false;
	});

	var prev = all.filter('.prev').click(function() {
		select(items.filter('.active').prev('.item'));
		return false;
	});

	var next = all.filter('.next').click(function() {
		select(items.filter('.active').next('.item'));
		return false;
	});

	if (items.length === 1) {
		items.parent().hide();
	}

	function select(item) {
		if (!item.length) return;
		items.removeClass('active');
		item.addClass('active');
		$('#large-photo').attr('src', item.find('a').attr('href'));

		var i = items.index(item);
		prev.toggleClass('disabled', i === 0);
		next.toggleClass('disabled', i === items.length - 1);
	}

	items.eq(0).click();

	// Contact page

	var emailRegex = /^[^@]+@[^.]+\.[^.]/;
	$('form').submit(function(e) {
		var controls = $(this).find('.required').removeClass('has-error').each(function(){
			var control = $(this);
			var field = control.children().last();
			var ok = field.attr('name') === 'email' ? emailRegex.test(field.val()) : field.val();
			control.toggleClass('has-error', !ok);
		});

		return controls.filter('.has-error').length === 0;
	});

	// Animated scroll

	$('a[href^=#]').click(function(e) {
		e.preventDefault();
		if (this.hash.length > 1) {
			var pos = $(this.hash).offset().top;
			$('html,body').animate({scrollTop:pos}, 800);
		}
	});

	// Collapsible sidebar

	var events = $('#sidebar > ul > li > a');
	
	events.parent().not('.selected').addClass('collapsed');

	events.click(function(e) {
		e.preventDefault();
		var item = $(e.currentTarget).parent();
		item.find('.wrapper').height(item.find('ul').outerHeight());
		item.toggleClass('collapsed');
		item.siblings().addClass('collapsed');
		
	});

})();
