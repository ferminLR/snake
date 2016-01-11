var Game = (function(){

	var width = 50,
		height = 50,
		cells = width*height,
		snake = Snake(),
		food = null,
		paused = null,
		timer = null,
		interval = null,
		score = null;

	var startGame = function(){
		resetScore();
		snake = initializeSnake();
		food = getRandomEmptyPosition();

		overlay.hide();
		paused = false;
		interval = 200;
		timer = setInterval(render,interval);

		function initializeSnake(){
			snake.body = [getRandomEmptyPosition()];
			snake.nextDirection = getRandomDirection();

			function getRandomDirection(){
				var directions = ['up', 'right', 'down', 'left'];

				var directionIndex = Math.floor(Math.random()*directions.length);
				var direction = directions[directionIndex];

				return direction;
			}

			return snake;
		}
	};

	var togglePause = function(){
		if(paused){
			timer = setInterval(render,interval);
			overlay.hide();
		}else{
			clearInterval(timer);
			overlay.showPauseScreen();
		}
		paused = !paused;
	};

	var endGame = function(){
		clearInterval(timer);
		showFinalScore();
		overlay.showGameOverScreen();

		function showFinalScore(){
			document.getElementById('finalScore').innerHTML = score;
		}
	};

	function Snake(){
		snake = {
			body : [],
			direction : null,
			nextDirection : null,
			move : function(){
				var newHeadPosition = snake.getNewHeadPosition();

				if (snake.collidesIn(newHeadPosition)){
					endGame();
				}

				snake.moveForward();

				if(snake.hasFoundFoodIn(newHeadPosition)){
					snake.eatsFood();
				}
			},
			getHead : function(){
				return snake.body[0];
			},
			getNewHeadPosition : function(){
				var newHeadPosition = snake.getHead() + getDelta();

				if(snake.isGoingThroughLeftEdge()){
					newHeadPosition = newHeadPosition + width;
				}else if(snake.isGoingThroughRightEdge()){
					newHeadPosition = newHeadPosition - width;
				}else if(snake.isGoingThroughTopEdge()){
					newHeadPosition = newHeadPosition + cells;
				}else if(snake.isGoingThroughBottomEdge()){
					newHeadPosition = newHeadPosition - cells;
				}

				return newHeadPosition;

				function getDelta(){
					var delta = 0;

					var deltaFor = {
						'left' : -1,
						'up' : -width,
						'right' : 1,
						'down': width
					};

					return deltaFor[snake.direction];;
				}
			},
			collidesIn : function(position){
				return snake.body.indexOf(position) >= 0;
			},
			moveForward : function(){
				var newHeadPosition = snake.getNewHeadPosition();
				snake.body.unshift(newHeadPosition);

				if(!snake.hasFoundFoodIn(newHeadPosition)){
					snake.body.pop();
				}
			},
			hasFoundFoodIn : function(position){
				return position == food;
			},
			eatsFood : function(){
				score += 100;
				updateScoreView();
				speedUp();
				food = getRandomEmptyPosition();

				function speedUp(){
					interval = Math.max(interval/1.2, 10);
					clearInterval(timer);
					timer = setInterval(render,interval);
				}
			},
			goLeft : function(){
				if(snake.direction == 'right') return;

				snake.nextDirection = 'left';
			},
			goUp : function(){
				if(snake.direction == 'down') return;

				snake.nextDirection = 'up';
			},
			goRight : function(){
				if(snake.direction == 'left') return;

				snake.nextDirection = 'right';
			},
			goDown : function(){
				if(snake.direction == 'up') return;

				snake.nextDirection = 'down';
			},
			isGoingThroughLeftEdge : function(){
				var isOnLeftEdge = snake.getHead()%width == 0;

				return isOnLeftEdge && snake.direction == 'left';
			},
			isGoingThroughTopEdge : function(){
				var isOnTopEdge = snake.getHead() < width;

				return isOnTopEdge && snake.direction == 'up';
			},
			isGoingThroughRightEdge : function(){
				var isOnRightEdge = snake.getHead()%width == width-1;

				return isOnRightEdge && snake.direction == 'right';
			},
			isGoingThroughBottomEdge : function(){
				var isOnBottomEdge = snake.getHead() >= cells-width;

				return isOnBottomEdge && snake.direction == 'down';
			}
		}
		return snake;
	}

	var resetScore = function(){
		score = 0;
		updateScoreView();
	};

	var updateScoreView = function(){
		document.getElementById('score').innerHTML = score;
	};

	var getRandomEmptyPosition = function(){
		while(true){
			var randomPosition = Math.floor(Math.random()*(width*height));
			if (isPositionEmpty(randomPosition)){
				return randomPosition;
			}
		}

		function isPositionEmpty(position){
			var isEmpty = (	snake.body.indexOf(position) == -1 &&
							food != position)
			return isEmpty;
		}
	};

	var render = function(){
		snake.direction = snake.nextDirection;
		snake.move();

		clearView();
		renderSnakeBody();
		renderFood();

		function clearView(){
			for(var i=0; i<=cells-1; i++){
				document.getElementsByTagName('td')[i].className = '';
			};
		}

		function renderSnakeBody(){
			snake.body.forEach(function(e){
				document.getElementsByTagName('td')[e].className = 'snake';
			});
		}

		function renderFood(){
			document.getElementsByTagName('td')[food].className = 'food';
		}
	};

	var overlay = {
		hide : function(){
			document.getElementById('overlay').className = '';
		},
		showPauseScreen : function(){
			document.getElementById('overlay').className = 'pause';
		},
		showGameOverScreen : function(){
			document.getElementById('overlay').className = 'gameover';
		}
	};

	document.onkeydown = function(e) {
		var key = getKeyFor(e.keyCode);

		switch(key) {
			case 'ESC':
				togglePause();
				break;
			case 'LEFT_ARROW':
				snake.goLeft();
				break;
			case 'UP_ARROW':
				snake.goUp();
				break;
			case 'RIGHT_ARROW':
				snake.goRight();
				break;
			case 'DOWN_ARROW':
				snake.goDown();
				break;
		}

		function getKeyFor(code){
			var codeToKey = {
				27: 'ESC',
				37: 'LEFT_ARROW',
				38: 'UP_ARROW',
				39: 'RIGHT_ARROW',
				40: 'DOWN_ARROW'
			};

			return codeToKey[code];
		}
	};

	var initializeView = function(){
		var row = '';
		var innerHTML = '';

		row = "<td></td>".repeat(width)
		innerHTML = '<table>'+('<tr>'+row+'</tr>').repeat(height)+'</table>';

		document.getElementById('gameview').innerHTML = innerHTML;
	};

	document.addEventListener('DOMContentLoaded', initializeView, false);

	return {
		start : startGame,
		pause : togglePause
	};

})();