# **************************************************************************** #
#                                                                              #
#                                                         :::      ::::::::    #
#    Makefile                                           :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: gabriel <gabriel@student.42.fr>            +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2026/07/06 17:23:54 by gabriel           #+#    #+#              #
#    Updated: 2026/07/06 17:33:32 by gabriel          ###   ########.fr        #
#                                                                              #
# **************************************************************************** #

DOCKER = docker compose

all:
	@if [ ! -f .env ]; then \
		cp .env.example .env &&\; \
		echo "\033[0;32m .env file created!\033[0m"
	fi
	$(DOCKER) up --build -d

up:
	$(DOCKER) up

down:
	$(DOCKER) down

ps:
	$(DOCKER) ps

images:
	docker images

PHONY:	up down ps
