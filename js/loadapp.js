// Variables To Fix Responsive
var window_height = $(window).height(),
	window_width = $(window).width(),
	$height = window_height,
	$width = Math.floor($height * 1.5367),
	$display = "double";

if (window_width < window_height) {
	$display = "single";
	$width = $width / 2;
}

// Hide Toolbar And Site Header
function hideToolbarAndSiteHeader() {
	if (!$('#notes').hasClass('active')) {
		hideTimeout = setTimeout(function () {
			$('nav#toolbar, header.site-header').addClass('tempHidden');
		}, 4000);
	}
}

function ShowToolbarAndSiteHeader() {
	$('nav#toolbar, header.site-header').removeClass('tempHidden');
	clearTimeout(hideTimeout);
	hideToolbarAndSiteHeader();
}

hideToolbarAndSiteHeader();

$(document).on('mousemove click', function () {
	ShowToolbarAndSiteHeader();
});

// Tipsy Plugin Enabled
$('.tipsy').tipsy({ gravity: 'nw', delayIn: 100, delayOut: 100 });

// Toastr Plugin Options
//toastr.options.closeButton = true;
//toastr.options.closeHtml = '<a><i class="fa fa-times"></i></a>';
//toastr.options.positionClass = 'toast-bottom-left';

// Pages and Ratio
function set_book_meter(page, pages) {
	//$('#cuPaThis').text(page);
	//$('#cuPaAll').text(pages);

	if (page + 1 == pages)
		page = pages;

	//$ratio = Math.floor((page / pages) * 100);
	//$('#cuPaRatio').text($ratio + '%');
}

// Fullscreen Button
function toggleFullscreen(elem) {
	elem = elem || document.documentElement;
	if (!document.fullscreenElement && !document.mozFullScreenElement &&
		!document.webkitFullscreenElement && !document.msFullscreenElement) {
		if (elem.requestFullscreen) {
			elem.requestFullscreen();
		} else if (elem.msRequestFullscreen) {
			elem.msRequestFullscreen();
		} else if (elem.mozRequestFullScreen) {
			elem.mozRequestFullScreen();
		} else if (elem.webkitRequestFullscreen) {
			elem.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
		}
	} else {
		if (document.exitFullscreen) {
			document.exitFullscreen();
		} else if (document.msExitFullscreen) {
			document.msExitFullscreen();
		} else if (document.mozCancelFullScreen) {
			document.mozCancelFullScreen();
		} else if (document.webkitExitFullscreen) {
			document.webkitExitFullscreen();
		}
	}
}

function PreviousPage() {
	$('.magazine').turn('previous');
}

function NextPage() {
	$('.magazine').turn('next');
}

$('#pageFullscreenButton').on('click', function (e) {
	toggleFullscreen();
	e.preventDefault();
});

// Zoom Button
$('#pageZoomButton').on('click', function (e) {
	if ($('#pageZoomButton i.fa').hasClass('fa-search-plus')) {
		$('#pageZoomButton i.fa').removeClass('fa-search-plus').addClass('fa-search-minus');
		$('.magazine-viewport').zoom('zoomIn');
	} else {
		$('#pageZoomButton i.fa').removeClass('fa-search-minus').addClass('fa-search-plus');
		$('.magazine-viewport').zoom('zoomOut');
	}
	e.preventDefault();
});

// Previous Button + Swipe
$('#pagePreviousButton').on('click', function (e) {
	//$('.magazine').turn('previous');
	PreviousPage();
	e.preventDefault();
});

//$('.magazine').on('swipeleft', function() { // maybe you can use (document) too.
//	$('.magazine').turn('previous');
//});

// Next Button + Swipe
$('#pageNextButton').on('click', function (e) {
	//$('.magazine').turn('next');
	NextPage();
	e.preventDefault();
});

//$('.magazine').on('swiperight', function() { // maybe you can use (document) too.
//	$('.magazine').turn('next');
//});

// Toggle Menu Button
$('#toggle-menu').on('click', function (e) {
	if (!$(this).hasClass('active')) {
		$(this).addClass('active');
		$('header.site-header').addClass('active');
		$('nav#toolbar').addClass('header_is_open');
		$('#notes').addClass('header_is_open');
	} else {
		$(this).removeClass('active');
		$('header.site-header').removeClass('active');
		$('nav#toolbar').removeClass('header_is_open');
		$('#notes').removeClass('header_is_open');
	}
	e.preventDefault();
});

// Create Note Button
$('#create-note').on('click', function (e) {
	if (!$(this).hasClass('active')) {
		$(this).addClass('active');
		$('#notes').addClass('active');
		$('nav#toolbar').addClass('notes_is_open');
	} else {
		$(this).removeClass('active');
		$('#notes').removeClass('active');
		$('nav#toolbar').removeClass('notes_is_open');
	}
	e.preventDefault();
});

// Close Notes Button
$('#close_notes').on('click', function (e) {
	if ($('#create-note').hasClass('active')) {
		$('#create-note').removeClass('active');
		$('#notes').removeClass('active');
		$('nav#toolbar').removeClass('notes_is_open');
	}
	e.preventDefault();
});

// Magazine LoadApp Function
function loadApp() {
	$('#canvas').fadeIn(1000);

	var flipbook = $('.magazine');

	// Check if the CSS was already loaded

	if (flipbook.width() == 0 || flipbook.height() == 0) {
		setTimeout(loadApp, 10);
		return;
	}

	// Create the flipbook
	flipbook.turn({

		// Magazine width
		width: $width,

		// Magazine height
		height: $height,

		// Duration in millisecond
		duration: 1000,

		// Hardware acceleration
		acceleration: !isChrome(),

		// Enables gradients
		gradients: true,

		// Auto center this flipbook
		autoCenter: true,

		// Elevation from the edge of the flipbook when turning a page
		elevation: 50,

		// The display of pages
		direction: 'rtl',

		// The display of pages
		display: $display,

		// The number of pages
		pages: PagesCount,

		// Events
		when: {
			turning: function (event, page, view) {
				CurrentPage = page;

				var book = $(this),
				currentPage = book.turn('page'),
				pages = book.turn('pages');

				// Show and hide navigation buttons
				disableControls(page);

				$('.thumbnails .page-' + currentPage).parent().removeClass('current');
				$('.thumbnails .page-' + page).parent().addClass('current');

				QuranPageChanged(page);
			},
			turned: function (event, page, view) {
				CurrentPage = page;

				disableControls(page);

				$(this).turn('center');

				if (page == 1) {
					$(this).turn('peel', 'br');
				}

				var $page = $('.magazine').turn('page');
				var $pages = $('.magazine').turn('pages');
				//set_book_meter($page, $pages);
			},

			missing: function (event, pages) {
				// Add pages that aren't in the magazine
				for (var i = 0; i < pages.length; i++)
					addPage(pages[i], $(this));
			}
		}
	});

	// Zoom.js
	$('.magazine-viewport').zoom({
		flipbook: $('.magazine'),

		max: function () {
			return largeMagazineWidth() / $('.magazine').width();
		},

		when: {
//			swipeLeft: function () {
//				//$(this).zoom('flipbook').turn('next');
//				NextPage();
//			},

//			swipeRight: function () {
//				//$(this).zoom('flipbook').turn('previous');
//				PreviousPage();
//			},

			resize: function (event, scale, page, pageElement) {
			},

			zoomIn: function () {
				$('.thumbnails').hide();
				$('.made').hide();
				$('.magazine').removeClass('animated').addClass('zoom-in');
				$('.zoom-icon').removeClass('zoom-icon-in').addClass('zoom-icon-out');

				if (!window.escTip && !$.isTouch) {
					escTip = true;

					$('<div />', { 'class': 'exit-message' }).
						html('<div>اضغط زر "ESC" للخروج</div>').
							appendTo($('body')).
							delay(2000).
							animate({ opacity: 0 }, 500, function () {
								$(this).remove();
							});
				}
			},

			zoomOut: function () {
				$('.exit-message').hide();
				$('.thumbnails').fadeIn();
				$('.made').fadeIn();
				$('.zoom-icon').removeClass('zoom-icon-out').addClass('zoom-icon-in');

				setTimeout(function () {
					$('.magazine').addClass('animated').removeClass('zoom-in');
					resizeViewport();
				}, 0);
			}
		}
	});

	// Zoom event

	if ($.isTouch)
		$('.magazine-viewport').bind('zoom.doubleTap', zoomTo);
	else
		$('.magazine-viewport').bind('zoom.doubleTap', zoomTo);

	// Using arrow keys to turn the page
	$(document).keydown(function (e) {
		var previous = 39, next = 37, esc = 27;

		switch (e.keyCode) {
			case previous:
				PreviousPage();
				e.preventDefault();
				break;
			case next:
				NextPage();
				e.preventDefault();
				break;
			case esc:
				$('.magazine-viewport').zoom('zoomOut');
				e.preventDefault();
				break;
		}
	});

	$(window).resize(function () {
		resizeViewport();
	}).bind('orientationchange', function () {
		resizeViewport();
	});

	// Events for the next button
	$('.next-button').bind($.mouseEvents.over, function () {
		$(this).addClass('next-button-hover');
	}).bind($.mouseEvents.out, function () {
		$(this).removeClass('next-button-hover');
	}).bind($.mouseEvents.down, function () {
		$(this).addClass('next-button-down');
	}).bind($.mouseEvents.up, function () {
		$(this).removeClass('next-button-down');
	}).click(function () {
		//$('.magazine').turn("disable", false);
		//$('.magazine').turn('previous');
		PreviousPage();
	});

	// Events for the previous button
	$('.previous-button').bind($.mouseEvents.over, function () {
		$(this).addClass('previous-button-hover');
	}).bind($.mouseEvents.out, function () {
		$(this).removeClass('previous-button-hover');
	}).bind($.mouseEvents.down, function () {
		$(this).addClass('previous-button-down');
	}).bind($.mouseEvents.up, function () {
		$(this).removeClass('previous-button-down');
	}).click(function () {
		//$('.magazine').turn('next');
		NextPage();
	});

	resizeViewport();

	$('.magazine').addClass('animated');

	$(magazine).turn("page", InitPage);
}

$('#canvas').hide();

// Load the HTML4 version if there's not CSS transform

yepnope({
	test: Modernizr.csstransforms,
	yep: ['js/turn.min.js'],
	nope: ['js/turn.html4.min.js'],
	both: ['js/zoom.min.js', 'js/magazine.js', 'css/magazine.css'],
	complete: loadApp
});

function LogInfo(Msg) {
	console.log(Msg);
	console.log(new Date());
	console.log("CurrentPage: " + CurrentPage + ", SkippedPages: " + SkippedPages);
}

// Note that the API is still vendor-prefixed in browsers implementing it
document.addEventListener("fullscreenchange", function( event ) {
	resizeViewport();	
});
