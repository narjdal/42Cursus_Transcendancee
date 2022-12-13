import { Injectable } from '@nestjs/common';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import Pong from './pong';
import {v4 as uuidv4} from 'uuid';
import { Player } from '@prisma/client';
import { Socket } from "socket.io";


@Injectable()
export class GameService {
  private games: Map<string, Pong> = new Map();
  private queue: any[] = [];
  private PlayersGames:any = [];
  private WatchersGames:any = [];
  private roomPrefix = 'roomGameSocket';

  newPlayer(client: Socket, user: any): void {
    this.queue.push({user:user, client:Socket});
    if (this.queue.length === 2) {
      let gameId = uuidv4();
      const playerLeft = this.queue.shift();
      const playerRight = this.queue.shift();
      const game = new Pong(playerLeft, playerRight);
      this.games.set(gameId, game);
      this.PlayersGames[playerLeft] = gameId;
      this.PlayersGames[playerRight] = gameId;
      playerLeft.client.join(this.roomPrefix + gameId);
      playerRight.client.join(this.roomPrefix + gameId);

      client.to(this.roomPrefix + gameId).emit('newGame', {
        id: gameId,
        player_left: game.player_left,
        player_right: game.player_right,
      });
    }
    return null;
  }

  onUpdate(player: any, position: number): void {
    const gameId = this.PlayersGames[player];
    const game = this.games.get(gameId);
    if (game) {
      game.onUpdate(player, position);
    }
  }

  update(user: any): any {
    const gameId = (this.PlayersGames[user]);
    const game = this.games.get(gameId);
    if (game) {
      game.player_left.client.to(this.roomPrefix + gameId).emit('update', game.update());
      return game.update();
    }
  }

  getAllGames(): any{
    let games = [];
    this.games.forEach((game, key) => {
      games.push({
        id: key,
        player_left: game.player_left,
        player_right: game.player_right,
      });
    });
    return games;
  }

  watchGame(client: Socket, user:any, gameId:any): any {
    this.watchGame[user] = gameId;
    const game = this.games.get(gameId);
    if (game) {
      client.join(this.roomPrefix + gameId);
      game.spectators.add(user);
    }
  }

  leaveGameAsWatcher(client: Socket, userId:any): void {
    const gameId = this.watchGame[userId];
    const game = this.games.get(gameId);
    if (game) {
      if (client.in(this.roomPrefix + gameId))
        client.leave(this.roomPrefix + gameId);
      game.spectators.delete(userId);
    }
  }

  leaveGameAsPlayer(user:any): void {
    const gameId = this.PlayersGames[user];
    const game = this.games.get(gameId);
    if (game) {
      if (game.player_left.id === user) {
        this.games.delete(gameId);
      }
      else if (game.player_right.id === user) {
        this.games.delete(gameId);
      }
    }
  }

  newGame(playerLeft:any, playerRight:any): void {
    let gameId = uuidv4();
    // const game = new Pong(user1, user2);
    // this.games.set(gameId, game);
    // this.PlayersGames[user1] = gameId;
    // this.PlayersGames[user2] = gameId;
    // let playerLeft = {user:user1, client:Socket}
    const game = new Pong({user:playerLeft.user, client:playerLeft.socket},
      {user:playerLeft.user, client:playerLeft.socket});
    this.games.set(gameId, game);
    this.PlayersGames[playerRight] = gameId;
    this.PlayersGames[playerRight] = gameId;
    playerLeft.client.join(this.roomPrefix + gameId);
    playerRight.client.join(this.roomPrefix + gameId);

    playerLeft.socket.to(this.roomPrefix + gameId).emit('newGame', {
      id: gameId,
      player_left: game.player_left,
      player_right: game.player_right,
    });
  }
}

