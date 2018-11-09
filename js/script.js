/**
 * @author office
 */
jQuery(document).ready(function($){
    var $btnPressed  = false;	

    var header_height = function($targetElement){
        var window_height =  $(window).height();

        // Header adjustment
          function jql_header_adjustment(){

            // Execute
            jql_execute_header_adjustment();

            $(window).resize(function(){
              jql_execute_header_adjustment();
            });
          }

          // Header adjustment execute
          function jql_execute_header_adjustment(){
            // Adjust header
            $($targetElement).height(window_height);
          }


          jql_header_adjustment();
    };
    var jqlScrollTo = function(){
        $('.nav ul li a,a[rel=goToPanel]').click(function(e){
          var $target = $(this).attr('href'); 
          scrollToPanel($target);
          e.preventDefault();
        });
    }

    var scrollToPanel = function(targetPanel){
      $('body,html').animate({
        scrollTop: $(targetPanel).offset().top+50 + "px"
      }, 500);
    }


    var fancybox = function(){
      $(".fancybox").fancybox({
        openEffect  : 'none',
        closeEffect : 'none',
        margin: 100
      });
    }

    var scrollbar = function(){
      if($.fn.mCustomScrollbar){
        $('.panel-content,.user-info,.statistics-tab-panel').mCustomScrollbar({
          theme:"minimal-dark"
        });
      }
    }

    var slick_slider = function($element_name,$arrow_next,$arrow_prev){
      if($.fn.slick){
        
        $($element_name).slick({
          arrows : false,
          slidesToShow:3,
          rtl: true,
          infinite: false,
          responsive:[{
                        breakpoint: 320,
                        settings: {
                          slidesToShow: 1,
                          slidesToScroll: 1,
                          
                        } 
                    }]
        });

        $($arrow_next).click(function(event) {
          $wrapper = $(this).parent().parent().parent();
          $wrapper.find($element_name).slick('slickNext');
          event.preventDefault();
        });

        $($arrow_prev).click(function(event) {
          $wrapper = $(this).parent().parent().parent();
          $wrapper.find($element_name).slick('slickPrev');
          event.preventDefault();
        });
      }

    }

    scrollbar();
    jqlScrollTo();

    $('.open').click(function(event) {
      var $book = $(this).parent().parent();
      var $overlay = $book.find('.book-overlay').addClass('active');
      event.preventDefault();
    });

    $('.book-overlay .close').click(function(event) {
      var $overlay = $(this).parent();
      $overlay.removeClass('active');
      event.preventDefault();
    });

    if($.fn.tabs){
      $( ".profile-tabs" ).tabs();
      $( ".statistics-tabs" ).tabs();
    }

    header_height('.header');
    slick_slider('.category-slider','.category .arrow-next','.category .arrow-prev');

    if($.fn.tipsy){
      $('a.tipsy').tipsy();
    }

    if($.fn.select2){
      $('.select2').select2();
    }

    $('.select-add').click(function(event) {
      /* Act on the event */
      var $id = $(this).attr('data-target-select');
      var $target_select = $("#"+$id);
      var $target_panel = $($(this).attr('data-target'));

      
      console.log($target_select.val());
      var $name = $("#s2id_"+$id).find('.select2-chosen').text();
      console.log($name);

      $target_panel.append('<li>'+$name+' <a href="#" data-id="'+$target_select.val()+'" class="select-delete"><i class="fa fa-times-circle"></i></a></li>');

      event.preventDefault();
    });

    $('body').on('click','.select-delete',function(event) {
      var $student_id = $(this).attr('data-id');

      $(this).parent().fadeOut();
      event.preventDefault();
    });
    //$('.parallax-window').parallax({imageSrc: 'images/bg/features2.png',zIndex:2,speed:0.0});
    //
    $('.overlay-close').click(function(event) {
      $('.lib-overlay').fadeOut();
      event.preventDefault();
    });

    $('body').keyup(function(event) {
      if(event.keyCode == 27){
        $('.lib-overlay').fadeOut();
      }
    });

    $('a[href=#overlay]').click(function(event) {
      var $id = $(this).attr("data-id");
      
      $('#overlay').fadeIn();
      
      /*
      $.ajax({
        success:function(){

        }
      });
      */
      e.preventDefault();
    });

    $('.toggle-menu').click(function(event) {
      if($(this).hasClass('open-menu')){
        $(this).addClass('close-menu').removeClass('open-menu');

        $('.site-header').animate({right: '-125px'},500);
        $('.content').animate({'padding-right': '0'},500);

      }else{
        $(this).addClass('open-menu').removeClass('close-menu');
        $('.site-header').animate({right: '0'},500);
        $('.content').animate({'padding-right': '125px'},500);
      }
      event.preventDefault();
    });

});