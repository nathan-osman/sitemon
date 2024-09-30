## sitemon

[![Go Reference](https://pkg.go.dev/badge/github.com/nathan-osman/sitemon.svg)](https://pkg.go.dev/github.com/nathan-osman/sitemon)
[![MIT License](https://img.shields.io/badge/license-MIT-9370d8.svg?style=flat)](https://opensource.org/licenses/MIT)

This tool provides a simple way to monitor a group of websites for issues and notify you.

- Runs both standalone and within [a Docker container](https://hub.docker.com/repository/docker/nathanosman/sitemon/general)
- No external dependencies (uses SQLite internally)
- Maintains a list of recent issues for each monitored site
- Monitored sites can be marked public or private (access only to logged in users)

#### Screenshots

<img src="https://github.com/nathan-osman/sitemon/blob/main/img/ss-home.png?raw=true" width="400" /> &nbsp; <img src="https://github.com/nathan-osman/sitemon/blob/main/img/ss-events.png?raw=true" width="400" />
