# SpeakOut

Blockchain Demo App

### Run with Docker

Run Ganache as Ethereum Blockchain

    docker run -it --name SpeakOut.Ganache -p 8545:8545 node:8 /bin/bash
    npm install -g ganache-cli

Run Truffle as compile and migrate platform

    docker run -it --name SpeakOut.Truffle -p 3000:3000 -v `pwd`/SpeakOut:/home node:8 /bin/bash
    npm install -g truffle

Run Exprsss as web server

    docker run -it --name SpeakOut.Web -p 8080:3000 -v `pwd`/SpeakOut:/home node:8 /bin/bash
    npm install
