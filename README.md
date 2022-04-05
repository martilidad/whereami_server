# whereami_server

## Start the Server with Docker:

We publish a public docker image `ghcr.io/martilidad/whereami-server`.  
For a general example see the [example docker-compose File](docker-compose.yml).  
It can be started via:
> docker-compose up

The Server will be availible under `http://localhost`.
Go to the index page, create games, then challenges and enjoy them :)

### Environment Variables

#### Google API-Key
Set the Google API-Key via the environment Variable `GOOGLE_API_KEY`.
The free recurring monthly credit on the Maps Platform is more than enough to play self-hosted with friends, but you need a valid credit card.  
See https://developers.google.com/maps/gmp-get-started

#### Default User

A Admin User will be created via `INITIAL_SUPER_USER` and `INITIAL_SUPER_PW`.  
Afterwards you can go to `http:://<host>/admin/` and create additional users. 

These variables need to be present the **first time the Application is connecting to the database** in order to work.
If you missed that, you can do the following:

Connect into the container:
> docker exec -it whereami /bin/bash

Create one superuser:
>python manage.py createsuperuser

#### Allowed Hosts

Set `ALLOWED_HOSTS` to the domain(s) where you host the application. Expects a list in the format `localhost,example.com`.
https://docs.djangoproject.com/en/4.0/ref/settings/#allowed-hosts

#### Complete list of Environment Keys

| Name | Description |
|------|-----|
| DB_NAME            | Database name to use. |
| DB_USER            | Database user to authenticate with. |
| DB_PW              | Database password to authenticate with.|
| DB_HOST            | Database connection parameters. |
| DB_PORT            | Database connection parameters. |
| REDIS_HOST         | Redis connection parameters. (Used as publish/subscribe backend for websocket peer to peer client status updates.) |
| REDIS_PORT         | Redis connection parameters. (Used as publish/subscribe backend for websocket peer to peer client status updates.) |
| ALLOWED_HOSTS      | A list of host/domain names the site is allowed to serve. |
| GOOGLE_API_KEY     | Used for the Maps & Street-View API. |
| STATIC_ROOT        | The folder static files will be copied to. (Expected to be hosted somewhere else.) |
| INITIAL_SUPER_USER | Admin User created on the first Database connection. (if not empty) |
| INITIAL_SUPER_PW   | Admin Password created on the first Database connection. (if not empty) |
| DEBUG              | (True/False) Enables delivery of static files, debug toolbar and more. |
| INTERNAL_IPS       | Client IPs to expose the debug toolbar to. (if DEBUG=True) |
