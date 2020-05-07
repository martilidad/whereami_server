# whereami_server

## Start the Server with Docker:

Create the container and start it on port 80:
> docker-compose up -d

Connect into the container:
> docker exec -it whereami /bin/bash

Create one superuser:
>python manage.py createsuperuser