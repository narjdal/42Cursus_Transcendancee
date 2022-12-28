include .env

SRC = docker-compose.yaml

all :
	docker-compose -f  ${SRC} up --build -d

up :
	docker-compose -f  ${SRC} up -d
start:
	docker-compose -f ${SRC} start
down:
	docker-compose -f ${SRC} down
ps:
	docker-compose -f ${SRC} ps

clean :
	docker stop $$(docker ps -qa);\
	docker rm $$(docker ps -qa);\
	docker rmi -f $$(docker images -qa);\
	docker volume rm $$(docker volume ls -q);\
    # docker network rm $$(docker network ls -q);

fclean : clean
	docker system prune -a --force

bonus : all