import sha256  from "sha256";

export class Blockchain {
    constructor() {
        this.chain = []
        this.pendingTransaction = []

        // genesis block
        this.createNewBlock(100, '0', '0')
    }

    createNewBlock(nonce, previousBlock, hash) {
        const newBlock = {
            index: this.chain.length + 1,
            timestamp: Date.now(),
            transaction: this.pendingTransaction,
            nonce: nonce,
            hash: hash,
            previousBlock: previousBlock
        }
    
        this.pendingTransaction = []
        this.chain.push(newBlock)
    }

    getLastBlock() {
        return this.chain[this.chain.length - 1]
    }

    createNewTransaction(amount, sender, recepient) {
        const newTransaction = {
            amount: amount,
            sender: sender,
            recepient: recepient
        }

        this.pendingTransaction.push(newTransaction)

        return this.getLastBlock()['index'] + 1;
    }

    hashBlock(previousHashBlock, currentBlock, nonce) {
        const dataAsString = previousHashBlock + nonce.toString() + JSON.stringify(currentBlock);
        return sha256(dataAsString)
    }

    proofOfWork(previousBlockHash, currentBlockData) {
        let nonce = 0;
        let hash = this.hashBlock(previousBlockHash, currentBlockData, nonce)

        while(hash.substring(0, 4) !== '0000') {
            nonce++;
            hash = this.hashBlock(previousBlockHash, currentBlockData, nonce)
        }

        return nonce;
    }
}