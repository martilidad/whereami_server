FROM python:3.11
ENV PYTHONUNBUFFERED 1
RUN mkdir /code
WORKDIR /code
COPY requirements.txt /code/
RUN pip install -r requirements.txt
EXPOSE 8000/tcp
LABEL org.opencontainers.image.description="An open source multiplayer location guessing game based on streetview."
LABEL org.opencontainers.image.url="https://github.com/martilidad/whereami_server"
LABEL org.opencontainers.image.title="whereami_server"
LABEL org.opencontainers.image.licenses="MIT"
CMD python manage.py migrate && \
    python manage.py collectstatic --noinput && \
    gunicorn --bind 0.0.0.0:8000 whereami_server.asgi:application \
    -k uvicorn.workers.UvicornWorker \
    --log-file "-" --error-logfile "-" \
    --enable-stdio-inheritance
COPY . /code/