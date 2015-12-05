// STEP 1: DECLARE OBJECTS, VARIABLES AND FUNCTIONS

var activeNode = 1;
var articlesReady = true;
var ajaxContent = ['rhino', 'guns', 'black', 'projects', 'coffee'];
var ajaxIndex = 0;
var nodes = [
  ['current', 790, 1500],
  ['logo', 790, 1500],
  ['rhino', 790, 1500],
  ['guns', 2530, 1500],
  ['guns-code', 3253, 1396],
  ['guns-design', 3612, 1232],
  ['black', 6235, 1500],
  ['black-article', 6735, 1565],
  ['projects1', 8110, 1500],
  ['projects2', 8750, 1500],
  ['coffee1', 10290, 1500],
  ['coffee2', 11180, 1500],
  ['wallright', 12000, 1500],
];

nabu = {
  ajax: {
    loadContent: function(i) {
      $.ajax({
        type: "POST",
        url: '/ajax/' + ajaxContent[ajaxIndex] + '.html',
        dataType: 'html',
        delay: 1
      }).done(function(data) {
        console.log(ajaxContent[ajaxIndex]);
        $('#' + ajaxContent[ajaxIndex]).html(data);
      }).fail(function() {
        console.log('AJAX fail in ' + ajaxContent[ajaxIndex]);
      }).always(function() {
        ajaxIndex++;
        if (ajaxContent[ajaxIndex]) {
          nabu.ajax.loadContent();
        };
      });
    }
  },
  stage: {
    move: function(x, y, speed) {
      var xx = x - ($('#viewport').width() / 2);
      var yy = y - ($('#viewport').height() / 2);
      var speed = speed === undefined ? 600 : speed;
      $('#viewport').stop().animate({
        scrollLeft: xx,
        scrollTop: yy
      }, speed, 'easeOutQuart');
      nodes[0][1] = x;
      nodes[0][2] = y;
      console.log('stage move to:', x, y);
      // console.log('corrected to:', xx, yy);
      // console.log(activeNode, nodes[0][1], nodes[0][2]);
    },
    next: function() {
      if (activeNode < nodes.length - 1) {
        activeNode++;
        var x = nodes[activeNode][1];
        var y = nodes[activeNode][2];
        nabu.stage.move(x, y);
      };
    },
    prev: function() {
      if (activeNode > 1) {
        activeNode--;
        var x = nodes[activeNode][1];
        var y = nodes[activeNode][2];
        nabu.stage.move(x, y);
      };
    },
    recenter: function() {
      var x = nodes[0][1];
      var y = nodes[0][2];
      nabu.stage.move(x, y);
    }
  },
  articles: {
    show: function($clicked) {
      if (articlesReady) {
        articlesReady = false;
        $clicked = $clicked.hasClass('stage-5') ? $('#black article.stage-4') : $clicked;
        var i = $('#black article').index($clicked);
        $('#black .article-container').addClass('animating');
        $('#black article').removeAttr('class');
        $('#black article').eq(i - 4).addClass('stage-1');
        $('#black article').eq(i - 3).addClass('stage-2');
        $('#black article').eq(i - 2).addClass('stage-3');
        $('#black article').eq(i - 1).addClass('stage-4');
        $('#black article').eq(i + 0).addClass('stage-5').nextAll('article').addClass('stage-6');
        setTimeout(function() {
          var n = $('#black article.stage-6').length;
          if (n > 1) {
            $('#black article.stage-6').slice(1).removeAttr('class').prependTo($('.article-container'));
            setTimeout(function() {
              $('#black article').last().addClass('stage-6').prev().addClass('stage-5').prev().addClass('stage-4').prev().addClass('stage-3').prev().addClass('stage-2').prev().addClass('stage-1');
            }, 100);
          } else if (n < 1) {
            $('#black article').first().addClass('stage-6').appendTo($('.article-container'));
          };
          $('#black .article-container').removeClass('animating');
          articlesReady = true;
        }, 500);
      };
    }
  },
  projects: {
    open: function($clicked) {
      if ($clicked.parent().hasClass('stacked')) {
        $('#projects').removeClass('stacked');
        nodes[8][1] = 8050;
        nabu.stage.move(8750, 1500);
      } else {
        if ($clicked.hasClass('in-focus')) {
          $('#projects').removeClass('white-out');
          $('#projects article').removeClass('in-focus');
          var x = Math.round($clicked.parent().position().left + $clicked.position().left + ($clicked.width() / 2));
          var y = Math.round($clicked.parent().position().top + $clicked.position().top + ($clicked.height() / 2));
        } else {
          $('#projects').addClass('white-out');
          $('#projects article').removeClass('in-focus');
          $clicked.addClass('in-focus');
          var x = Math.round($clicked.parent().position().left + $clicked.position().left + $clicked.width());
          var y = Math.round($clicked.parent().position().top + $clicked.position().top + ($clicked.height() / 2));
        };
        nabu.stage.move(x, y);
      };
    },
    close: function() {
      $('#projects').removeClass('white-out');
      $('#projects article').removeClass('in-focus');
    }
  }
};

// STEP 2: INITIATE
// var t0 = new Date().getTime();
// $(window).load(function() { // makes sure the whole site is loaded
//     var t1 = new Date().getTime();
//     var td = t1 - t0;
//     console.log('window load: ' + td);
// });

$(document).ready(function() {

  // var t2 = new Date().getTime();
  // var tdd = t2 - t0;
  // console.log('document ready: ' + tdd);

  // AJAX
  nabu.ajax.loadContent(0, 5);

  // STAGE
  nabu.stage.move(nodes[0][1], nodes[0][2], 0);
  // $('#stage').on('click', function(e) {
  //     var x = e.pageX - $(this).position().left;
  //     var y = e.pageY - $(this).position().top;
  //     nabu.stage.move(x, y);
  // });
  $('#next').on('click', function(e) {
    nabu.stage.next();
    nabu.projects.close();
  });
  $('#prev').on('click', function(e) {
    nabu.stage.prev();
    nabu.projects.close();
  });
  $(window).resize(function() {
    nabu.stage.recenter();
  });

  // ARTICLES
  $(document).on('click', '#black article', function(e) {
    nabu.articles.show($(this));
    nabu.stage.move(6735, 1565);
    e.stopPropagation();
  });
  $(document).on('click', '#black .next', function(e) {
    nabu.articles.show($('#black article.stage-4'));
    nabu.stage.move(6735, 1565);
    e.stopPropagation();
  });
  $(document).on('click', '#black .prev', function(e) {
    nabu.articles.show($('#black article.stage-6'));
    nabu.stage.move(6735, 1565);
    e.stopPropagation();
  });

  // PROJECTS
  $(document).on('click', '#projects article', function(e) {
    nabu.projects.open($(this));
    e.stopPropagation();
  });
  $(document).on('click', '#projects article .text', function(e) {
    var x = e.pageX - $(this).parents('#stage').position().left;
    var y = e.pageY - $(this).parents('#stage').position().top;
    nabu.stage.move(x, y);
    e.stopPropagation();
  });
  $(document).on('click', '#projects article .text a', function(e) {
    e.stopPropagation();
  });

});

// var windowWidth = $(window).width(); //retrieve current window width
// var windowHeight = $(window).height(); //retrieve current window height
// var documentWidth = $(document).width(); //retrieve current document width
// var documentHeight = $(document).height(); //retrieve current document height
// var vScrollPosition = $(document).scrollTop(); //retrieve the document scroll ToP position
// var hScrollPosition = $(document).scrollLeft(); //retrieve the document scroll Left position
// $('#black article').on('transitionend webkitTransitionEnd otransitionend MSTransitionEnd animationend webkitAnimationEnd oanimationend MSAnimationEnd', function() {
//     nabu.articles.reset();
// });