FROM python:3
ENV PYTHONUNBUFFERED 1
RUN mkdir /code
WORKDIR /code
COPY requirements.txt /code/
RUN pip install -r requirements.txt
CMD python manage.py migrate && python manage.py collectstatic --noinput && python manage.py runserver
COPY . /code/