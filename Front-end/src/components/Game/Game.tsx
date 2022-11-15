import Sketch from 'react-p5';
import p5Types from 'p5';
import pong from './Pong'

//import hit from './assets/soundshit.mp3'


const _hit = new Audio();
const _wall = new Audio();
const _left_scor = new Audio();
const _right_scor = new Audio();

function update_data(_data:any, width:number, height:number):object{
	return {
		player_left: {y:(_data.player_left.y * height), score:_data.player_left.score},
		player_right: {y:(_data.player_right.y * height), score:_data.player_right.score},
		ball: {x:(_data.ball.x * width), y:(_data.ball.y * height)},
		music_id:_data.music_id, still_playing:_data.still_playing
	};
}

export default function Game(props:any){
	let new_game = new pong();
	let bagrounad_img:any;
	let ball_img:any;
	let player_left_img:any;
	let player_right_img:any;
	let playe_img:any;

	let overBox:boolean = false;
	let locked:boolean = false;
	let yOffset:number = 0.0;
	let data:any;
	let start:boolean;

	const setup = (p5: p5Types, canvasParentRef: Element) => {
		let cnv = p5.createCanvas(props.width, props.height).parent( canvasParentRef,);
		cnv.id('pong_canvas');
		bagrounad_img = p5.loadImage("./images/assets/baground_table.jpg'");
		ball_img = p5.loadImage("./images/assets/ball.png");
		player_left_img = p5.loadImage("'./images/assets/player_red.png");
		player_right_img = p5.loadImage("./images/assets/player_green.png");
		playe_img = p5.loadImage("./images/assets/play.gif");

		_hit.src = './images/sounds_hit.mp3';
		_wall.src = './images/sounds_wall.mp3';
		_left_scor.src = './images/sounds_userScore.mp3';
		_right_scor.src = './images/sounds_comScore.mp3';
		data = new_game.data_to_render();
		data = update_data(data, props.width, props.height);
	};

	const draw = (p5: p5Types) => {
		if (p5.mouseX > 0 - props.width / 60
				&& p5.mouseX < 0 + props.width / 60
				&& p5.mouseY > data.player_left.y - props.height / 4
				&& p5.mouseY < data.player_left.y + props.height / 4)
			overBox = true;
		else
			overBox = false;
		if (!start)
			p5.image(playe_img, 0, 0, props.width, props.height);
		else{
			if (data.still_playing){
				new_game.update();
				data = new_game.data_to_render();
				data = update_data(data, props.width, props.height);
			}
			else
			{
				p5.textSize(64);
				p5.text("Game Over", props.width / 3, props.height / 2);
				p5.noLoop();
			}
			p5.image(bagrounad_img, 0, 0, props.width, props.height);	
			p5.image(player_left_img, 0, data.player_left.y, props.width / 60,
			props.height / 4);
			p5.image(player_right_img, props.width - props.width / 60,
				data.player_right.y, props.width / 60, props.height / 4);
			p5.fill(51, 102, 255);
			for (let i = 0; i <= props.height ; i += props.height / 27)
				p5.rect(props.width * 0.48 , i, props.width * 0.02, props.height * 0.025);
			p5.image(ball_img, data.ball.x - props.width / 60,
				data.ball.y - props.height / 40, props.width / 30, props.height / 20);
			p5.textSize(32);
			p5.textFont("75px fantasy");
			p5.fill(230, 236, 255);
			p5.text(new_game.player_left.score.toString(), props.width / 4, props.height / 6);
			p5.text(new_game.player_right.score.toString(), props.width * 3 / 4, props.height / 6);
			//if (data.music_id === 1)
			//	_hit.play();
			//else if (data.music_id === 2)
			//	_wall.play();
			//else if (data.music_id === 3)
			//	_left_scor.play();
			//else if (data.music_id === 4)
			//	_right_scor.play();
		}
	}
	const mousePressed = (p5: p5Types) => {
		locked = (overBox) ? true : false;
		yOffset = p5.mouseY - data.player_left.y;

	}
	const mouseDragged = (p5: p5Types) => {
		if (locked && p5.mouseY > 0 && p5.mouseY < props.height)
			new_game.set_player((p5.mouseY - yOffset) / props.height);
	}
	const mouseReleased = (p5: p5Types) => {
		locked = false;
		if (!start){
			p5.loop();
			start = true;
		}
	}
	return (
		<div className='game'>
			<Sketch className={"ttt"} setup={setup} draw={draw} mousePressed={mousePressed}
				mouseDragged={mouseDragged} mouseReleased={mouseReleased} />
		</div>
	);
}
