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

	if (items.length <= 1) {
		items.parent().hide();
	}

	function select(item) {
		if (!item.length) return;
		items.removeClass('active');
		item.addClass('active');
		
		$('#large-photo').attr('src', item.find('a').attr('href'));

		var i = items.index(item);
		var last = i === items.length - 1;
		prev.toggleClass('disabled', i === 0);
		next.toggleClass('disabled', last);

		if (!last) {
			// Preload next image
			var nextSrc = item.next().find('a').attr('href');
			new Image().src = nextSrc;
		}
	}

	items.eq(0).click();

	// Contact page

	var emailRegex = /^[^@]+@[^.]+\.[^.]/;
	$('form').submit(function(e) {
		var any = false;
		$(this).find('.required').removeClass('has-error').each(function(){
			var field = $(this);
			var ok = field.attr('name') === 'email' ? emailRegex.test(field.val()) : field.val();
			if (!ok && !any) {
				any = true;
				// Select first invalid field
				field.focus();
			}
			field.toggleClass('has-error', !ok);
		});

		return !any;
	});
	// Change all the generated HTMLs instead
	$('form').find('[name="name"],[name="from"],[name="message"]').addClass('required');

	// Animated scroll

	$('a[href^=#]:not(.no-scroll)').click(function(e) {
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
