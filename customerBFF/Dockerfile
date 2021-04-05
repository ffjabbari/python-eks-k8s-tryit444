FROM python:3.6-slim-buster AS PYTHON_BUILD
MAINTAINER Max Kornyev
COPY . /app/
COPY requirements.txt /app
WORKDIR /app
RUN pip install -r requirements.txt
EXPOSE 80
ENTRYPOINT ["python", "app.py"]