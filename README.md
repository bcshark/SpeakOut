# SpeakOut

Blockchain Demo App

### Run with Docker

Run Ganache as Ethereum Blockchain

    docker run -it --name SpeakOut.Ganache -p 8545:8545 node:8 /bin/bash
    npm install -g ganache-cli

Run Truffle as compile and migrate platform

    docker run -it --name SpeakOut.Truffle -p 3000:3000 -v `pwd`/SpeakOut:/home node:8 /bin/bash
    npm install -g truffle

Run Backend

    docker run -it --name 'SpeakOut.Service' -v `pwd`/SpeakOut:/home -p 5000:3000 node:8 /bin/bash
