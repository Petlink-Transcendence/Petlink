# **************************************************************************** #
#                                                                              #
#                                                         :::      ::::::::    #
#    Makefile                                           :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: gde-la-r <gde-la-r@student.42porto.com>    +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2026/07/06 17:44:03 by gde-la-r          #+#    #+#              #
#    Updated: 2026/07/06 17:48:05 by gde-la-r         ###   ########.fr        #
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
	$(DOCKER) ps

logs:
	#(DOCKER) logs -f

images:
	docker images

clean:
	$(DOCKER) down -v

fclean:
	$(DOCKER) down -v --rmi all --remove-orphans

.PHONY: all up down ps logs images clean fclean
