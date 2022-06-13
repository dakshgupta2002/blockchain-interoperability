pragma solidity >=0.4.25 <0.7.0;
// https://rinkeby.etherscan.io/block/10843258

// a) Create a Smart contract that can store the block headers of its respective blockchain from a certain fixed timestamp. (Fetch block headers data from the blockchain itself or the block explorer website) 
// b) Use smart contract created in step a to perform the finality verification of transaction involved in asset exchange.
// c) cost and latency metrics calculations. 

contract BlockHeader {
    struct header{
        uint transactionId;
        string txnHash;
        uint timestamp;
        uint blockNumber;
        uint difficulty;
        uint gasLimit;
        uint gasUsed;
        uint baseFeePerGas;
        uint nonce;
        string blockHash;
        string parentHash;
        string input;
        string r;
        string s;
        string to;
        // check transaction index;
        string v;
        uint value;
    }
    
    uint currentTransactionId = 0;
    mapping(uint => header) public headers;

    function createBlock(
        uint _txnHash,
        uint _blockNumber,
        uint _blockHash,
        uint _parentHash,
    ) 
    public view 
    returns (header _header) {
        headers[currentTransactionId] = header(
            currentTransactionId,
            _txnHash,
            now,
            _blockNumber,
            block.difficulty,
            block.gasLimit,
            block.gasUsed,
            block.baseFeePerGas,
            block.nonce,
            _blockHash,
            _parentHash
        );
        currentTransactionId++;
        return headers[currentTransactionId - 1];
    }

    function getBlock(uint _transactionId)
    public view
    returns (uint _blockNumber)
    requires(_transactionId < currentTransactionId) {
        return headers[_transactionId].blockNumber;
    }

} 