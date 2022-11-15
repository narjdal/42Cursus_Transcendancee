interface player{
	x:number;
	y:number;
	width:number;
	height:number;
	score:number;
}

interface ball{
	x:number;
	y:number;
	radius:number;
	speed:number;
	velocity_X:number;
	velocity_Y:number;
}

let width = 600;
let height = 400;

export default class pong{
	player_left:player;
	player_right:player;
	how_play:player;
	_ball:ball;
	histoy_game: object[] = [];
	music_id:number;
	constructor(){
		this.player_left = {x:0, y:(height - 100 / 2), width:10, height:100, score:0};
		this.player_right = {x:width - 10, y:(height - 100 / 2), width:10, height:100, score:0};
		this._ball = {x:width / 2, y:height / 2, radius:10,speed:7, velocity_X:5, velocity_Y:5};
		this.how_play = this.player_right;
		this.music_id = 0;
	}
	reset = () => {
		this._ball.x = width / 2;
		this._ball.y = height / 2;
		this._ball.velocity_X *= -1;
		this._ball.speed = 7;
		this.player_left.y = (height - 100 / 2);
		this.player_right.y = (height - 100 / 2);
	}
	set_player = (y:number) =>{
		this.player_left.y = y * height;
	}
	update = ():any => {
		if (this._ball.x - this._ball.radius < 0)
		{
			this.player_right.score++;
			this.music_id = 4;
			this.reset();
		}
		else if (this._ball.x + this._ball.radius > width)
		{
			this.player_left.score++;
			this.music_id = 3;
			this.reset();
		}
		this._ball.x += this._ball.velocity_X;
		this._ball.y += this._ball.velocity_Y;	
		this.player_right.y += ((this._ball.y - (this.player_right.y
								+ this.player_right.height / 2))) * 0.1;
		if (this._ball.y - this._ball.radius < 0
			|| this._ball.y + this._ball.radius > height){
				this._ball.velocity_Y *= -1;
				this.music_id = 2;
		}
		this.how_play = (this._ball.x + this._ball.radius < width / 2) ?
		this.player_left : this.player_right;
		if (this.collision()){
			this.music_id = 1;
			let collide_point = (this._ball.y
				- (this.how_play.y + this.how_play.height / 2));
			collide_point /= (this.how_play.height / 2);
			let angleRad = (Math.PI / 4) * collide_point;
			let direction = (this._ball.x  + this._ball.radius < width / 2) ? 1 : -1;
			this._ball.velocity_X = direction * this._ball.speed * Math.cos(angleRad);
			this._ball.velocity_Y = this._ball.speed * Math.sin(angleRad);
			this._ball.speed += 0.1;
		}
	}
	collision = ():boolean => {
		const b_top = this._ball.y - this._ball.radius;
		const b_bottom = this._ball.y + this._ball.radius;
		const b_left = this._ball.x - this._ball.radius;
		const b_right = this._ball.x + this._ball.radius;
		const p_top = this.how_play.y;
		const p_bottom = this.how_play.y + this.how_play.height;
		const p_left = this.how_play.x;
		const p_right = this.how_play.x + this.how_play.width;
		return(p_left < b_right && p_top < b_bottom && p_right > b_left
			&& p_bottom > b_top);
	}
	data_to_render = ():any =>{
		return {
			player_left: {y:this.player_left.y / height, score:this.player_left.score},
			player_right: {y:this.player_right.y / height, score:this.player_right.score},
			ball: {x:(this._ball.x / width), y:(this._ball.y / height)},
			music_id:this.music_id, still_playing:(this.player_left.score < 5 &&
			this.player_right.score < 5)
		};
	}
}