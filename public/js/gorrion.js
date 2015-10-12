(function(){

	// Project Page

	var all = $('#project .pagination li');

	var items = all.filter('.item').click(function() {
		select($(this))
		return false;
	})

	var prev = all.filter('.prev').click(function() {
		select(items.filter('.active').prev('.item'));
		return false;
	});

	var next = all.filter('.next').click(function() {
		select(items.filter('.active').next('.item'));
		return false;
	});

	function select(item) {
		if (!item.length) return;
		items.removeClass('active');
		var item = item.addClass('active');
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

	// Tooltips

	$('a[title]').tooltip();

})();
