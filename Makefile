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

include .env
# all: $(NAME)
# 	docker-compose up &
# 	npx prisma migrate dev --name init --preview-feature
# 	npm run start --prefix srcs/client & npm run start --prefix srcs/server

docker-build:
	docker-compose up

docker-prisma:
	npx prisma migrate dev --name init --preview-feature

docker-server:
	npm run start --prefix srcs/server

docker-client:
	npm run start --prefix srcs/client