import express from "express"
import bodyParser from "body-parser"
import { Blockchain } from "./blockchain.js"

const app = express()
const coin = new Blockchain()

app.use(bodyParser.json()) // json
app.use(bodyParser.urlencoded({ extended: false })) // form

app.get('/blockchain', (req, res) => {
    res.send(coin)
})

app.post('/transaction', (req, res) => {
    const blockIndex = coin.createNewTransaction(req.body.amount, req.body.sender, req.body.recepient)
    res.json({
        note: `Transaction will be added in block ${blockIndex}.`
    })
})

app.get('/mine', (req, res) => {
    const lastBlock = coin.getLastBlock()
    const previousBlockHash = lastBlock["hash"]
    const currentBlockData = {
        transactions: coin.pendingTransaction,
        index: lastBlock['index'] + 1
    }
    const nonce = coin.proofOfWork(previousBlockHash, currentBlockData)
    const blockHash = coin.hashBlock(previousBlockHash, currentBlockData, nonce)
    const newBlock = coin.createNewBlock(nonce, previousBlockHash, blockHash)

    res.json({
        note: "New block mined successfully",
        block: newBlock
    })
})


app.listen(3000, () => {
    console.log('listening on port 3000...')
})