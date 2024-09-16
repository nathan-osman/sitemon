FROM golang:alpine AS backend

# Install ld and C runtime libraries
RUN apk --no-cache add binutils musl-dev

WORKDIR /usr/src/app

# Copy the package files
COPY go.mod go.sum ./

# Install package requirements
RUN go mod download && go mod verify

# Copy the remaining Go files
COPY . .

# Build the application
RUN go build -ldflags '-linkmode external -extldflags "-static"'


FROM scratch

# Copy the application
COPY --from=backend /usr/src/app/sitemon /usr/local/bin

# Download and install a cert bundle
ADD https://curl.se/ca/cacert.pem /etc/ssl/certs/

ENTRYPOINT ["/usr/local/bin/sitemon"]
