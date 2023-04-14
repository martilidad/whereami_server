FROM python:3.11
ENV PYTHONUNBUFFERED 1
RUN mkdir /code
WORKDIR /code
COPY requirements.txt /code/
RUN pip install -r requirements.txt
LABEL org.opencontainers.image.description="An image for drf-SPECtacular generation(behaves different on linux)"
LABEL org.opencontainers.image.url="https://github.com/martilidad/whereami_server"
LABEL org.opencontainers.image.title="whereami_server gen spec"
LABEL org.opencontainers.image.licenses="MIT"
CMD python manage.py spectacular --color --file /dev/stdout --validate
