## **************************************************************************** #
#                                                                              #
#                                                         :::      ::::::::    #
#    Makefile                                           :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: mochegri <mochegri@student.42.fr>          +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2020/11/04 17:18:52 by mochegri          #+#    #+#              #
#    Updated: 2021/11/27 10:20:23 by mochegri         ###   ########.fr        #
#                                                                              #
# **************************************************************************** #

# include .env
all: $(NAME)
	

docker_start:
	docker-compose start

docker_up:
	docker-compose up --build -d --remove-orphans

docker_stop:
	docker-compose stop

docker_down:
	docker-compose down

docker_ps:
	docker-compose ps

docker_clean:
	docker stop $$(docker ps -qa);\
	docker rm $$(docker ps -qa);\
	docker rmi -f $$(docker images -qa);\
	docker system prune -a --force

docker_restart:
	docker-compose restart

docker_logs:
	docker-compose logs -f

docker_build:
	docker-compose build .

docker_shell_client:
	docker-compose exec client

docker_shell_server:
	docker-compose exec server

run_client:
	npm i --prefix srcs/client && npm run start --prefix srcs/client &

run_server:
	npm i --prefix srcs/server && nest start --prefix srcs/server &

run:
	docker run --name some-postgres -e POSTGRES_PASSWORD=mysecretpassword -d postgres
	npm run start --prefix client & npm run start --prefix server
