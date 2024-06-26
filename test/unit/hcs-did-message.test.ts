import { Client, PrivateKey, TopicId } from "@hashgraph/sdk";
import { DidMethodOperation, Hashing, HcsDid, HcsDidCreateDidOwnerEvent, HcsDidMessage } from "../../dist";

const network = "testnet";
const DID_TOPIC_ID1 = TopicId.fromString("0.0.2");
const DID_TOPIC_ID2 = TopicId.fromString("0.0.3");

describe("HcsDidMessage", () => {
    const client = Client.forTestnet({ scheduleNetworkUpdate: false });
    const privateKey = PrivateKey.generate();
    const identifier = `did:hedera:${network}:${Hashing.multibase.encode(
        privateKey.publicKey.toBytes()
    )}_${DID_TOPIC_ID1}`;

    it("Test Valid Message", () => {
        const did = new HcsDid({ identifier: identifier, privateKey: privateKey, client: client });

        const message = new HcsDidMessage(
            DidMethodOperation.CREATE,
            did.getIdentifier(),
            new HcsDidCreateDidOwnerEvent(
                did.getIdentifier() + "#did-root-key",
                did.getIdentifier(),
                privateKey.publicKey
            )
        );

        expect(message.isValid(DID_TOPIC_ID1)).toEqual(true);
    });

    it("Test Invalid Did", () => {
        const did = new HcsDid({ identifier: identifier, privateKey: privateKey, client: client });

        const message = new HcsDidMessage(
            DidMethodOperation.CREATE,
            "invalid_did###",
            new HcsDidCreateDidOwnerEvent(
                did.getIdentifier() + "#did-root-key",
                did.getIdentifier(),
                privateKey.publicKey
            )
        );

        expect(message.isValid()).toEqual(false);
    });

    it("Test Invalid Topic", () => {
        const did = new HcsDid({ identifier: identifier, privateKey: privateKey, client: client });

        const message = new HcsDidMessage(
            DidMethodOperation.CREATE,
            did.getIdentifier(),
            new HcsDidCreateDidOwnerEvent(
                did.getIdentifier() + "#did-root-key",
                did.getIdentifier(),
                privateKey.publicKey
            )
        );

        expect(message.isValid(DID_TOPIC_ID1)).toEqual(true);
        expect(message.isValid(DID_TOPIC_ID2)).toEqual(false);
    });

    it("Test Missing Data", () => {
        const did = new HcsDid({ identifier: identifier, privateKey: privateKey, client: client });

        let message = new HcsDidMessage(
            <any>null,
            did.getIdentifier(),
            new HcsDidCreateDidOwnerEvent(
                did.getIdentifier() + "#did-root-key",
                did.getIdentifier(),
                privateKey.publicKey
            )
        );

        expect(message.getOperation()).toEqual(null);
        expect(message.isValid()).toEqual(false);

        message = new HcsDidMessage(
            DidMethodOperation.CREATE,
            <any>null,
            new HcsDidCreateDidOwnerEvent(
                did.getIdentifier() + "#did-root-key",
                did.getIdentifier(),
                privateKey.publicKey
            )
        );

        expect(message.getDid()).toEqual(null);
        expect(message.isValid()).toEqual(false);

        message = new HcsDidMessage(DidMethodOperation.CREATE, did.getIdentifier(), <any>null);

        expect(message.getEvent()).toEqual(null);
        expect(message.isValid()).toEqual(false);

        message = new HcsDidMessage(
            DidMethodOperation.CREATE,
            did.getIdentifier(),
            new HcsDidCreateDidOwnerEvent(
                did.getIdentifier() + "#did-root-key",
                did.getIdentifier(),
                privateKey.publicKey
            )
        );

        expect(message.isValid()).toEqual(true);
    });
});
