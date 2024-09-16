FROM golang:latest AS backend

WORKDIR /usr/src/app

# Copy the package files
COPY go.mod go.sum ./

# Install package requirements
RUN go mod download && go mod verify

# Copy the remaining Go files
COPY . .

# Build the application
RUN go build


FROM scratch

# Copy the application
COPY --from=backend /usr/src/app/sitemon /usr/local/bin

ENTRYPOINT ["/usr/local/bin/sitemon"]
