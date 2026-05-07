FROM gcc:latest
WORKDIR /app
RUN useradd -m sandbox
USER sandbox
CMD ["g++"]
