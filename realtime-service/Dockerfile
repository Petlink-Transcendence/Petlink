FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .

EXPOSE 8001

CMD ["daphne", "-b", "0.0.0.0", "-p", "8001", "core.asgi:application"]
