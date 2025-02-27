const { use } = require("@maticnetwork/maticjs");
const maticJs = require("@maticnetwork/maticjs").default
const { Web3ClientPlugin } = require("@maticnetwork/maticjs-web3");


const HDWalletProvider = require("@truffle/hdwallet-provider");
const { user1, rpc, fx_portal } = require("./config");
const { FxPortalPlugin, FxPortalClient } = require("@maticnetwork/maticjs-fxportal");

// const dotenv = require('dotenv');
// dotenv.config();

use(Web3ClientPlugin);
console.log(maticJs.Web3Client)
use(FxPortalPlugin);
const from = process.env.FROM || user1.address;

console.log('from', from);

const execute = async () => {
    const privateKey = process.env.PRIVATE_KEY || user1.privateKey;
    const mumbaiERC20 = fx_portal.child.erc20;
    const goerliERC20 = fx_portal.parent.erc20;
    const rootRPC = process.env.ROOT_RPC || rpc.parent;
    const maticRPC = process.env.MATIC_RPC || rpc.child;
    const matic = new FxPortalClient({
        log: true,
        network: 'testnet',
        version: 'mumbai',
        parent: {
            provider: new HDWalletProvider(privateKey, rootRPC),
            defaultConfig: {
                from
            }
        },
        child: {
            provider: new HDWalletProvider(privateKey, maticRPC),
            defaultConfig: {
                from
            }
        }
    });

    await matic.init();

    const rootTokenErc20 = matic.erc20(goerliERC20, true);
    const mumbaiTokenErc20 = matic.erc20(mumbaiERC20);

    // return console.log(
    //     await mumbaiTokenErc20.getBalance(from)
    // )
    

    // const result = await rootTokenErc20.deposit(1000000000, from);
    // const result = await rootTokenErc20.mapChild();
    const result = await mumbaiTokenErc20.withdrawStart(10);
    const txHash = await result.getTransactionHash();
    console.log("txHash", txHash);
    console.log("receipt", await result.getReceipt());

    // const result = await rootTokenErc20.withdrawExit('0xbb9051c6a55ad82122835dd6b656f62f2bf905452e844172f9d8ba6a98137f8c');
    // // console.log("result", result, typeof result);
    // const txHash = await result.getTransactionHash();
    // console.log("txHash", txHash);
    // console.log("receipt", await result.getReceipt());

    // const isCheckpointed = await mumbaiTokenErc20.isWithdrawExited('0xbb9051c6a55ad82122835dd6b656f62f2bf905452e844172f9d8ba6a98137f8c');
    // console.log("isWithdrawExited", isCheckpointed);
    // console.log("from", from, mumbaiERC20);
    // const balanceRoot = await mumbaiTokenErc20.getBalance(from)
    // console.log('balanceRoot', balanceRoot);
}

execute().then(_ => {
    process.exit(0)
}).catch(err => {
    console.error("error", err);
    process.exit(0);
})
