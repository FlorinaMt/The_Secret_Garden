

$(document).ready(function () {

  $("#tree").css("z-index", "-1");
  $(".basket").css("z-index", "-1");

  var treeHeight = $('#tree').height();
  var treeWidth = $('#tree').width();
  $(".apple").css("z-index", "1");
  $("#basketfront").css("z-index", "2");


  $('.apple').each(function () {
    //Set the X-coordinate within the area covered by the leaves
    var randomX = getLeftPosition("#tree") + Math.random() * treeWidth;
    var minX = getLeftPosition("#tree") + treeWidth * 0.1; //10%
    var maxX = getLeftPosition("#tree") + treeWidth * 0.8; //80%
    randomX = getRandom(minX, maxX);

    // Set the Y-coordinate within the area covered by the leaves
    var minY = getTopPosition("#tree") + treeHeight * 0.1; // 60% from the top
    var maxY = getTopPosition("#tree") + treeHeight * 0.3; // 90% from the top
    var randomY = getRandom(minY, maxY) + 30;

    $(this).offset({
      left: randomX,
      top: randomY
    });
  })


  function rotateElement($element, fromDeg, toDeg, duration, nextFunctionCall) {
    $element.animate({
      deg: toDeg
    }, {
      duration: duration, //set duration of rotation
      step: function (now) { //do it for every step of animation
        $(this).css({ transform: 'rotate(' + now + 'deg)' }); //rotate element accordingly with current position
      },
      complete: nextFunctionCall // call next function after completion
    });
  }

  $('.apple').click(function () {
    var height = $(window).height() - $(this).height();
    var basketWidth = $('.basket').width();
    var minX = getLeftPosition(".basket") + basketWidth * 0.1;
    var maxX = getLeftPosition(".basket") + basketWidth * 0.8;
    var randomX = getRandom(minX, maxX);

    rotateElement($(this), 0, 30, 400, function () {
      rotateElement($(this), 30, -30, 400, function () {
        rotateElement($(this), -30, 0, 400, function () {
          // Move the element to a new position after rotation
          $(this).animate({
            top: height - 80 + Math.random() * 2,
            left: randomX - 30 * Math.random()
          }, 300);
        });
      });
    });
  });

  //here we store whether the watering can is tilted or not
  var tilted = false;

  //***bonus***: each drop will make a little puddle splash when it touches the visible bottom of the window
  $("<img>").attr({
    "src": "images/puddle.png",
    "alt": "puddle",
    "id": "puddle"
  }).appendTo("body");

  //we set the width and the height for the puddle
  $("#puddle").css({
    width: 50 + "px",
    height: 30 + "px"
  })

  //Set the position property so we can put the water drops near the watering can
  $(".waterdrop").css("position", "absolute");
  $("#puddle").css("position", "absolute");

  $("#wateringcan").css("z-index", "1");

  //The waterdrops and puddles are not visible until the watering can is tilted
  $(".waterdrop").css("display", "none");
  $("#puddle").css("display", "none");

  //Get the y coordinate of the element's top-corner
  function getTopPosition(element) {//reused function
    var top = $(element).offset().top;
    return top;
  }

  //Get the x coordinate of the element's top-corner
  function getLeftPosition(element) {//reused function
    var left = $(element).offset().left;
    return left;
  }

  // Here we generate random integers in a specified interval
  function getRandom(min, max) {//reused function
    return Math.random() * (max - min) + min;
  }

  // When the watering can is clicked
  $("#wateringcan").click(function () {

    //if it was not tilted before
    if (!tilted) {

      // we tilt the watering can
      $(this).css("transform", "rotate(-30deg)");

      //and we mark it as tilted
      tilted = true;

      //At this point, the water drops appear
      $(".waterdrop").show();

      //and they are moving
      waterdropsMotion();

      //But if the watering can was tilted before
    } else {

      //We put it in the initial, untilted position
      $(this).css("transform", "rotate(0deg)");

      //and we mark it as untilted
      tilted = false;

    }
  });

  // Here we have the function for water drops' motion
  function waterdropsMotion() {

    //Another ***bonus***: when the watering can is tilted, this audio will play (hint: it is a watering can sound)
    $("<audio></audio>").attr("src", "audio/wateringCanSound.mp3").appendTo("body");

    //for each water drop
    $(".waterdrop").each(function () {
      var waterDrop = $(this);
      var topWaterDrop = getTopPosition(waterDrop);

      //we store the position of the watering can, so we can put the water drops near it
      var topCan = getTopPosition("#wateringcan");
      var leftCan = getLeftPosition("#wateringcan");

      //and we generate random positions for water drops around the top-left corner of the watering can
      var dropStartLeft = getRandom(leftCan + 15, leftCan + 30);
      var dropStartTop = getRandom(topCan + 130, topCan + 160);



      //if the watering can is tilted
      if (tilted) {

        //the audio starts playing
        $("audio")[0].play();

        //and we can set water drop's position to the previous mentioned random positions
        waterDrop.css({
          top: dropStartTop + "px",
          left: dropStartLeft + "px"
        });

        // Here we animate water drop's movement, with a random duration between 0.3 and 1.5 seconds, until it reaches the visible bottom of the window
        waterDrop.animate({ top: $(window).height() - 30 }, getRandom(300, 1500), function () {

          //before moving, the water drop must be visible
          $(waterDrop).show();

          //if the watering can is tilted
          if (tilted) {

            //the puddle will appear where the water drop disappeared
            $("#puddle").css({
              top: getTopPosition(waterDrop) + 5 + "px",
              left: getLeftPosition(waterDrop) - 10 + "px"
            }).show();

            // and the puddle will disappear after 0.1 seconds
            setTimeout(function () {
              $("#puddle").hide();
            }, 100);
          }

          //this behavior will repeat as long as the watering can is tilted
          waterdropsMotion();
        });

      }

      //if the watering can is not tilted
      else {

        //if the last water drops reached the bottom of the window
        if (topWaterDrop >= $(window).height() - 30) {
          //the water drops will disappear at another random position
          waterDrop.hide();
          waterDrop.css({
            top: dropStartTop + "px",
            left: dropStartLeft + "px"
          });
        }

        //but if they are still falling
        else {
          //they will keep falling until they reach the bottom
          waterDrop.animate({ top: $(window).height() - 30 }, getRandom(300, 1500), function () {

            //and then, they will disappear at another random position
            waterDrop.hide();
            waterDrop.css({
              top: dropStartTop + "px",
              left: dropStartLeft + "px"

            });

          });
        }

        //and the audio will stop playing
        $("audio")[0].pause();
      }
    });
  }

  $('#butterfly').css("z-index", "5").css('transition', '0.15s');

  flyRandomly($('#butterfly'));


  //  actual function that moves the butterfly to the random position within the browser window
  function flyRandomly() {
    $('#basketfront').css("z-index", "1");
    var height = $(window).height() - $('#butterfly').height();
    var width = $(window).width() - $('#butterfly').width();
    var randomX = getRandom(0, width);
    var randomY = getRandom(0, height);

    var randomPosition = { top: randomY, left: randomX };
    var position = $('#butterfly').position();

    $('#butterfly').animate({
      left: randomX,
      top: randomY
    }, {
      duration: 2000,
      step: function () { // step allows function to be called each step of the animation
        var deltaX = randomPosition.left - position.left;
        var deltaY = randomPosition.top - position.top;
        var angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI); //  calculate the angle

        $(this).css('transform', 'rotate(' + (angle + 90) + 'deg)'); //   apply rotation
      },
      complete: function () {
        flyRandomly('#butterfly');
      }
    });
  }

  //  On hovering moving the butterfly to the random position
  $('#butterfly').mouseenter(function () {
    var height = $(window).height() - $(this).height();
    var width = $(window).width() - $(this).width();
    var randomX = getRandom(0, width);
    var randomY = getRandom(0, height);

    var randomPosition = { top: randomY, left: randomX };
    var position = $('#butterfly').position();


    $(this).stop().animate(randomPosition, {
      step: function () { // step allows function to be called each step of the animation
        var deltaX = randomPosition.left - position.left;
        var deltaY = randomPosition.top - position.top;
        var angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI); //  calculate the angle

        $(this).css('transform', 'rotate(' + (angle + 90) + 'deg)'); //   apply rotation
      },
      complete: function () { flyRandomly() }
    })
  });

  //  On clicking sends the butterfly to the basket
  $('#butterfly').click(function () {
    $('#basketfront').css("z-index", "6");
    var top = $(window).height() - 200;
    left = 240;
    $(this).stop().animate({
      top: top,
      left: left
    }, 300);
    $(this).css('transform', 'rotate(' + 0 + 'deg)')
  });

  //on mouse move the coords of the picture change to that of the mouse
  $("<img>").attr({
    "src": "images/net2.png",
    "alt": "net2",
    "id": "net2"
  }).appendTo("body").hide();
  $("#net").css({
    "position": "absolute",
    "transform": "translate(-50%, -50%)",
    "width":"250px",
    "height": "auto"
  }).hide();

  $("#net2").css({
    "position": "absolute",
    "transform": "translate(-50%, -50%)",
    "width":"250px",
    "height": "auto"
  });
  var x1 = 0;
  $(document).mousemove(function (event) {
    var x2 = event.pageX;
    $('#net').css('left', event.pageX + "px");
    $('#net').css('top', event.pageY + "px");
    $('#net2').css('left', event.pageX + "px");
    $('#net2').css('top', event.pageY + "px");
    if (x1 <= x2) {
      x1 = x2;
      $("#net").hide();
      $("#net2").show();

    } else {
      x1 = x2;
      $("#net").show();
      $("#net2").hide();
    }
  });
  
});

