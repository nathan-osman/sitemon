FROM node:latest AS frontend

WORKDIR /usr/src/app

# Copy the package files
COPY ui/package.json ui/package-lock.json ./

# Install package requirements
RUN npm install

# Copy the remaining files
COPY ui/ .

# Build the application bundle
RUN npm run build


FROM golang:alpine AS backend

WORKDIR /usr/src/app

# Disable cgo
ENV CGO_ENABLED=0

# Copy the package files
COPY go.mod go.sum ./

# Install package requirements
RUN go mod download && go mod verify

# Copy the remaining Go files
COPY . .

# Copy the UI files
COPY --from=frontend /usr/src/app/dist/ ui/dist

# Build the application
RUN go build


FROM scratch

# Copy the application
COPY --from=backend /usr/src/app/sitemon /usr/local/bin/

# Download and install a cert bundle
ADD https://curl.se/ca/cacert.pem /etc/ssl/certs/

ENTRYPOINT ["/usr/local/bin/sitemon"]
