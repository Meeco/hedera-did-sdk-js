import { HcsDid } from "@hashgraph/did-sdk-js";
import { Client, PrivateKey } from "@hashgraph/sdk";

async function main() {
    const OPERATOR_ID = "0.0.28520500";
    const OPERATOR_KEY =
        "302e020100300506032b65700422042024a2b2bfffa54e492e06f4b092bf9701fa0f230223754bf0b4c350eed222a3b0";

    const client = Client.forTestnet();
    client.setOperator(OPERATOR_ID, OPERATOR_KEY);
    client.setMirrorNetwork(["hcs.testnet.mirrornode.hedera.com:5600"]);

    const didPrivateKey = PrivateKey.generate();
    const did = new HcsDid({ privateKey: didPrivateKey, client: client });
    await did.register();

    // const didDoc = await did.resolve();
    // console.log(didDoc.toJsonTree());
}

main();
