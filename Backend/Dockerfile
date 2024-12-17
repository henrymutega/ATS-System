FROM golang:latest

WORKDIR /app

COPY go.mod .
COPY main.go .

# Download project dependencies
RUN go mod download

# Build the Go binary
RUN go build -o main .

RUN go get
RUN go build -o bin .

EXPOSE 8080

ENTRYPOINT ["./main"]
