# **************************************************************************** #
#                                                                              #
#                                                         :::      ::::::::    #
#    Makefile                                           :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: gabriel <gabriel@student.42.fr>            +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2026/07/06 17:23:54 by gabriel           #+#    #+#              #
#    Updated: 2026/07/06 17:28:25 by gabriel          ###   ########.fr        #
#                                                                              #
# **************************************************************************** #

DOCKER = docker compose

all:
	cp .env.example .env && $(DOCKER) up --build -d

up:
	$(DOCKER) up

down:
	$(DOCKER) down

ps:
	$(DOCKER) ps

images:
	docker images

PHONY:	up down ps
