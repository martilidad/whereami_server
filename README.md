# whereami_server

## Start the Server with Docker:

Replace the Google API-Key in /whereami/static/index.html
Create the container and start it on port 80:
> docker-compose up -d

Connect into the container:
> docker exec -it whereami /bin/bash

Create one superuser:
>python manage.py createsuperuser

Import the base game locations.(Optional)
>python manage.py loaddata base_game_locations

Go to /admin/ and create additional users. 
Go to the index page and create challenges and enjoy :)