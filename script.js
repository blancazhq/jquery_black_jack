function Card(point, suit){
  this.point = point;
  this.suit = suit;
}

Card.prototype.getImageUrl = function(){
  if (this.point===1){
      return 'images/' + 'ace' + '_of_' +this.suit+ '.png';
  }else if (this.point===11){
      return 'images/' + 'jack' + '_of_' +this.suit+ '.png';
  }else if (this.point===12){
      return 'images/' + 'queen' + '_of_' +this.suit+ '.png';
  }else if (this.point===13){
      return 'images/' + 'king' + '_of_' +this.suit+ '.png';
  }else{
      return 'images/' + this.point + '_of_' +this.suit+ '.png';
  }
}

function Hand(){
  this.cards = [];
}

Hand.prototype.addCard = function(object){
  this.cards.push(object);
}

Hand.prototype.getPoints = function(){
  function compare(a, b){
      return a.point-b.point;
  }
  function checkHowManyAce(cards){
    var count_ace = 0
    for(var j=0;j<cards.length;j++){
      if(cards[j].point === 1){
        count_ace += 1;
      }
    }
    return count_ace;
  }
  function add(cards, i){
    var score = cards[i].point;
    if(score===11){
        score = 10;
    }else if (score===12) {
        score = 10;
    }else if (score===13) {
        score = 10;
    }
    sum += score;
    return sum;
  }

  var count_ace = 0;
  this.cards.sort(compare);
  count_ace = checkHowManyAce(this.cards);
  if(this.cards[0].point === 1){
    var sum = 0;
    for(var i=count_ace; i<this.cards.length; i++){
        sum = add(this.cards, i);
    }
    for(var i=0;i<count_ace;i++){
      if(sum + 11 > 21){
          sum += 1;
      }else{
          sum += 11;
      }
    }
  }else{
    sum = 0;
    for(var i=0; i<this.cards.length; i++){
        sum = add(this.cards, i);
    }
  }
  return sum;
}

function Deck(){
  this.cards=[];
  var suit = ['spades', 'hearts', 'clubs', 'diamonds'];
  for(var i = 1; i<14; i++){
      for(var j = 0; j<4; j++){
          var card = new Card(i, suit[j]);
          this.cards.push(card);
      }
  }
}

Deck.prototype.draw = function(){
  var copy = Object.assign({}, this.cards[0]);
  this.cards.splice(0,1);
  return copy;
}

Deck.prototype.shuffle = function(){
   var new_deck_shuffled = _.shuffle(this.cards);
   this.cards = new_deck_shuffled
}

Deck.prototype.numCardsLeft = function(){
  return this.cards.length;
}


$(document).ready(function(){
    var bet = 5;
    $("#bet").text(bet);
    $("button").addClass("disable");
    $("#deal-button").removeClass("disable");
    var new_deck = new Deck();
    new_deck.shuffle();
    var bust = false;
    var stringRepresentation = new_deck.cards.map(function(card) {
      return card.point + ' of ' + card.suit;
    }).join(',');
    var dealer_cards= new Hand();
    var player_cards= new Hand();
    var dealer_money=500;
    var player_money=500;
    updateMoneyText();

    function boardAnimation(){
      TweenMax.from("#messages", 1, {y: "100vw"})
      TweenMax.to("#messages", 1, {y: 0})
    }

    function flyingcardAnimation(element){
      TweenMax.from(element, 1, {x: "-1000vw", y: "500vw", rotation: 360})
      TweenMax.to(element, 1, {x: 0, y: 0, rotation: 0})
    }

    function chipInAnimation(element){
      TweenMax.from(element, 1, {y: "-100vw"})
      TweenMax.to(element, 1, {y: 0})
    }

    function chipOutAnimation(element){
      TweenMax.from(element, 1, {y: 0})
      TweenMax.to(element, 1, {y: "-100vw", ease: Strong.easeOut})
    }

    function restart(){
      bet=5;
      $("#bet").text(bet);
      dealer_cards=new Hand();
      player_cards=new Hand();
      new_deck = new Deck();
      new_deck.shuffle();
      bust = false;
      $("#dealer-points").text("0");
      $("#player-points").text("0");
      $('#dealer-hand').empty();
      $('#player-hand').empty();
      $('#message').empty();
      $("#deal-button").removeClass("disable");
    }

    function startNewGame(){
      boardAnimation()
      $("button").addClass("disable");
      setTimeout(function(){$('#message').text('Starting new game...');},2000);
      setTimeout(restart, 5500);
    }

    function checkBust(hand){
      if(hand.getPoints()>21){
          bust = true;
      }
    }
    function playerWinMoneyChange(){
      dealer_money -= bet;
      player_money += bet;
      $(".chip").addClass("chip_visible");
      chipOutAnimation("#chip1");
      chipInAnimation("#chip2");
      setTimeout(function(){
        $("#chip2").removeClass("chip_visible");
      }, 900);
      setTimeout(function(){
        $("#chip1").removeClass("chip_visible");
      }, 500);
    }

    function dealerWinMoneyChange(){
      player_money -= bet;
      dealer_money += bet;
      $(".chip").addClass("chip_visible");
      chipOutAnimation("#chip2")
      chipInAnimation("#chip1")
      setTimeout(function(){
        $("#chip1").removeClass("chip_visible");
      }, 900);
      setTimeout(function(){
        $("#chip2").removeClass("chip_visible");
      }, 500);
    }

    function updateMoneyText(){
      $("#dealer-money").text(dealer_money);
      $("#player-money").text(player_money);
    }

    function resetGame(){
      dealer_money=500;
      player_money=500;
      updateMoneyText()
      startNewGame()
    }

    function resetRunOutMoney(){
      if(player_money<0){
        boardAnimation()
        setTimeout(function(){$('#message').text('Player ran out of money!');},2000);
      }else{
        boardAnimation()
        setTimeout(function(){$('#message').text('Dealer ran out of money! :( ');},2000);
      }
      dealer_money=500;
      player_money=500;
      setTimeout(updateMoneyText, 7500);
      boardAnimation()
      setTimeout(function(){$('#message').text('Resetting...');},4000);
      setTimeout(restart, 7500);
    }

    function dealCard(div,hand,label,character){
        hand.addCard(new_deck.cards[0]);
        var image = document.createElement("IMG");
        $(image).attr("src", new_deck.cards[0].getImageUrl());
        $(image).addClass("card");
        flyingcardAnimation(image);
        $(div).append(image);
        $(label).text(hand.getPoints());
        new_deck.draw();
        checkBust(hand);
        if(bust === true){
            $("#message").text(character+" Busted!");
            if(character === "Player"){
                dealerWinMoneyChange();
            }else if(character === "Dealer"){
                playerWinMoneyChange();
            }
            updateMoneyText();
            if(player_money<0 ||dealer_money<0){
                resetRunOutMoney();
            }else{
                startNewGame();
            }
        }
    }

    $('#add_5').on('click', function(){
      if(player_money>=(bet+5)){
        bet += 5;
        $("#bet").text(bet);
      }else{
        boardAnimation();
        $('#message').text("Bet too much!");
      }
    });

    $('#add_10').on('click', function(){
      if(player_money>=(bet+10)){
        bet += 10;
        $("#bet").text(bet);
      }else{
        boardAnimation();
        $('#message').text("Bet too much!");
      }
    });

    $('#add_25').on('click', function(){
      if(player_money>=(bet+25)){
        bet += 25;
        $("#bet").text(bet);
      }else{
        boardAnimation();
        $('#message').text("Bet too much!");
      }
    });

    $('#add_50').on('click', function(){
      if(player_money>=(bet+50)){
        bet += 50;
        $("#bet").text(bet);
      }else{
        boardAnimation();
        $('#message').text("Bet too much!");
      }
    });

    $('#add_100').on('click', function(){
      if(player_money>=(bet+100)){
        bet += 100;
        $("#bet").text(bet);
      }else{
        boardAnimation();
        $('#message').text("Bet too much!");
      }
    });

    $('#add_500').on('click', function(){
      if(player_money>=(bet+500)){
        bet += 500;
        $("#bet").text(bet);
      }else{
        boardAnimation();
        $('#message').text("Bet too much!");
      }
    });

    $('#deal-button').on('click', function(){
        for(var i=0; i<2; i++){
            dealCard("#dealer-hand", dealer_cards, "#dealer-points", "Dealer");
        }
        for(var i=0; i<2; i++){
            dealCard("#player-hand",player_cards, "#player-points", "Player");
        }
        $("button").removeClass('disable');
        $(this).addClass('disable');
        if(player_cards.getPoints()===21 && dealer_cards.getPoints()!==21){
            $('#message').text('Player got Blackjack!');
            playerWinMoneyChange();
            updateMoneyText();
            if(player_money<0 ||dealer_money<0){
                resetRunOutMoney();
            }else{
                startNewGame();
            }
        }else if(player_cards.getPoints()===21 && dealer_cards.getPoints()===21){
            $('#message').text('Blackjack vs Blackjack! Push!');
            startNewGame();
        }
    });

    $('#hit-button').on('click', function(){
        dealCard("#player-hand",player_cards,"#player-points", "Player");
        if(player_cards.getPoints()===21){
            $('#message').text('Player Wins!');
            playerWinMoneyChange();
            updateMoneyText();
            if(player_money<0 ||dealer_money<0){
                resetRunOutMoney();
            }else{
                startNewGame();
            }
        }
    });

    $('#stand-button').on('click', function(){
        while(dealer_cards.getPoints()<18){
            dealCard("#dealer-hand",dealer_cards,"#dealer-points", "Dealer");
        }
        if(bust === false){
            if(dealer_cards.getPoints() > player_cards.getPoints()){
                $('#message').text('Dealer Wins!');
                dealerWinMoneyChange()
            }
            else if (player_cards.getPoints() > dealer_cards.getPoints()) {
                $('#message').text('Player Wins!');
                playerWinMoneyChange()
            }
            else{
                $('#message').text('Draw!');
            }
            updateMoneyText()
            if(player_money<0 ||dealer_money<0){
                resetRunOutMoney();
            }else{
                startNewGame();
            }
        }
    });

    $('#newgame-button').on('click', function(){
        startNewGame()
    })

    $('#reset-button').on('click', function(){
        resetGame()
    })
});
