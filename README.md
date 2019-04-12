# SportX Subgraph

A SportX subgraph for [The Graph](https://thegraph.com). SportX provides a platform for sports betting on Ethereum.


## Brief Description of The Graph Node Setup

A Graph Node can run multiple subgraphs, and in this case it can have a subgraph for Ropsten, Mainnet and Kovan. The subgraph ingests event data by calling to Infura through http. It can also connect to any geth node or parity node that accepts RPC calls. Fast synced geth nodes work. To use parity, the `--no-warp` flag must be used. Setting up a local Ethereum node is more reliable and faster, but Infura is the easiest way to get started. 

This subgraph has three types of files which tell the Graph Node to ingest events from specific contracts. They are:
* The subgraph manifest (subgraph.yaml)
* A GraphQL schema      (schema.graphql)
* Mapping scripts       (ExchangeV1.ts, ExchangeV2.ts) 

This repository has these files created and ready to compile, so a user can start this subgraph on their own. The only thing that needs to be edited is the contract addresses in the `subgraph.yaml` file to change between Kovan, Ropsten or Mainnet.  

We have provided a quick guide on how to start up the SportX-Subgraph graph node. If these steps aren't descriptive enough, the [getting started guide](https://github.com/graphprotocol/graph-node/blob/master/docs/getting-started.md) has in depth details on running a subgraph.

## Steps to Deploy The SportX Subgraph Locally 
  1. Install IPFS and run `ipfs init` followed by `ipfs daemon`
  2. Install PostgreSQL and run `initdb -D .postgres` followed by `pg_ctl -D .postgres start` and `createdb graph-node-mainnet` (note this db name is used in the commands below for the mainnet examples)
  3. If using Ubuntu, you may need to install additional packages: `sudo apt-get install -y clang libpq-dev libssl-dev pkg-config`
  4. Clone this repository, and run the following:
     * `yarn`
     * `yarn codegen` 
  5. Clone https://github.com/graphprotocol/graph-node from master and `cargo build` (this might take a while)
  6. a) Now that all the dependencies are running, you can run the following command to connect to Infura Mainnet (it may take a few minutes for Rust to compile). Password might be optional, it depends on your postrgres setup:

```
  cargo run -p graph-node --release -- \
  --postgres-url postgresql://USERNAME:[PASSWORD]@localhost:5432/graph-node-mainnet \
  --ipfs 127.0.0.1:5001 \
  --ethereum-rpc mainnet-infura:https://mainnet.infura.io --debug
```
  6. b) Or Mainnet with a Local Ethereum node. This is very common if you are working with brand new contracts, and you have deployed them to a testnet environment like *ganache* (note that ganache commonly uses port 9545 rather than 8545):
```
  cargo run -p graph-node --release -- \
  --postgres-url postgresql://USERNAME:[PASSWORD]@localhost:5432/graph-node-mainnet \
  --ipfs 127.0.0.1:5001 \
  --ethereum-rpc mainnet-local:http://127.0.0.1:8545 
```
  6. c) Or Infura Kovan _(NOTE: Infura Kovan is not reliable right now, we get inconsistent results returned. If Kovan data is needed, it is suggested to run your own Kovan node)_
```
    cargo run -p graph-node --release --   \
    --postgres-url postgresql://USERNAME:[PASSWORD]@localhost:5432/graph-node-testnet \
    --ipfs 127.0.0.1:5001
    --ethereum-rpc kovan-infura:https://kovan.infura.io 

```
 6. d) Or a Kovan local node which was started with `parity --chain=kovan --no-warp  --jsonrpc-apis="all" `:
 
 ```
   cargo run -p graph-node --release -- \
   --postgres-url postgresql://USERNAME:[PASSWORD]@localhost:5432/graph-node-testnet \
   --ipfs 127.0.0.1:5001 \
   --ethereum-rpc kovan-local:http://127.0.0.1:8545
 
 ```
 
 6. e) You can also connect to ropsten, just follow the syntax that was used with the kovan example. 
 
 7. Now create the subgraph locally on The Graph Node with `yarn create-local`. On The Graph Hosted service, creating the subgraph is done in the web broswer. 
  
 8. Now deploy the SportX subgraph to The Graph Node with `yarn deploy --debug`. You should see a lot of blocks being skipped in the `graph-node` terminal, and then it will start ingesting events from the moment the contracts were uploaded to the network. 

Now that you have subgraph is running you may open a [Graphiql](https://github.com/graphql/graphiql) browser at `127.0.0.1:8000` and get started with querying.

## Viewing the Subgraph on the Graph Hosted Service
This subgraph is not yet on [The Graph Explorer](https://thegraph.com/explorer/). To understand how deploying to the hosted service works, check out the [Deploying Instructions](https://thegraph.com/docs/deploy-a-subgraph) in the official documentation. The most important part of deploying to the hosted service is ensuring that the npm script for `deploy` is updated to the correct name that you want to deploy with.

## Getting started with Querying 

Below are a few ways to show how to query the SportX-Subgraph for data. 

### Querying all possible data that is being stored
The query below shows all the information that is possible to query, but is limited to the first 5 instances. There are many other filtering options that can be used, just check out the [querying api](https://github.com/graphprotocol/graph-node/blob/master/docs/graphql-api.md).

```
{
  orders(first: 5){
    id
    maker
    market {
        id
        baseToken
        title
        outcomeOne
        outcomeTwo
        outcomeVoid
        referenceUrl
        registered      
    }
    taker
    newFilledAmount
    totalBetSize
    percentageOdds
    expiry
    oracleFee
    relayerMakerFee
    relayerTakerFee
    salt
    relayer
    isMakerBettingOutcomeOne
    takerAmount
    takerEscrow
    potSize
    makerOracleFee
    takerOracleFee      
  }
}

```
The command above can be copy pasted into the Graphiql interface in your browser at `127.0.0.1:8000` or in the query playground on the hosted-service.