# whereami_server

## Start the Server with Docker:

Example docker-compose.yml:
```
version: '3'

services:
  web:
    image: ghcr.io/martilidad/whereami-server
    links:
      - postgresql:db
      - redis:redis
    depends_on: 
      - postgresql
      - redis
    ports: 
      - "80:80"
    environment:
      - "POST
  postgresql:
    image: postgres
    container_name: "whereami-postgresql"
    environment:
      - "POSTGRES_USER=whereami"
      - "POSTGRES_PASSWORD=whereami"
      - "POSTGRES_DB=whereami"
    ports:
      - "5432:5432"
  redis:
    image: redis:5
    expose:
      - "6379"

```
Set the Google API-Key in 
> whereami_server/settings.py
  
The free recurring monthly credit on the Maps Platform is more than enough to play self-hosted with friends, but you need a valid credit card.  
See https://developers.google.com/maps/gmp-get-started

Create the containers and expose wherami on port 80:
> docker-compose up -d

Connect into the container:
> docker exec -it whereami /bin/bash

Create one superuser:
>python manage.py createsuperuser

Import the base game locations.(Optional)
>python manage.py loaddata base_game_locations

Go to /admin/ and create additional users. 
Go to the index page and create challenges and enjoy :)