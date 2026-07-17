# **************************************************************************** #
#                                                                              #
#                                                         :::      ::::::::    #
#    Makefile                                           :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: gde-la-r <gde-la-r@student.42porto.com>    +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2026/07/06 17:44:03 by gde-la-r          #+#    #+#              #
#    Updated: 2026/07/14 20:01:35 by gde-la-r         ###   ########.fr        #
#                                                                              #
# **************************************************************************** #

DOCKER = docker compose

all:
	@test -f .env || (cp .env.example .env && echo "\033[0;32m .env file created!\033[0m")
	$(DOCKER) up --build -d

up:
	$(DOCKER) up -d

down:
	$(DOCKER) down

ps:
	$(DOCKER) ps -a

logs:
	$(DOCKER) logs -f

images:
	docker images

seed:
	$(DOCKER) down -v --remove-orphans && docker compose up -d --build postgres redis \
		&& $(DOCKER) run --rm core-service python manage.py migrate \
		&& $(DOCKER)  run --rm core-service python manage.py seed \
		&& $(DOCKER) up -d --build core-service frontend nginx realtime-service

tests:
	$(DOCKER) exec core-service python manage.py test accounts.tests

clean:
	$(DOCKER) down -v

fclean:
	$(DOCKER) down -v --rmi all --remove-orphans

.PHONY: all up down ps logs images clean fclean
