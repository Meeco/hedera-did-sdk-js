import { Hashing } from "../../../..";
import { HcsDidDeleteEvent } from "./hcs-did-delete-event";
import { HcsDidDidOwnerEvent } from "./owner/hcs-did-did-owner-event";
import { HcsDidEvent } from "./hcs-did-event";
import { HcsDidEventName } from "./hcs-did-event-name";
import { HcsDidCreateServiceEvent } from "./service/hcs-did-create-service-event";
import { HcsDidCreateVerificationMethodEvent } from "./verification-method/hcs-did-create-verification-method-event";
import { HcsDidCreateVerificationRelationshipEvent } from "./verification-relationship/hcs-did-create-verification-relationship-event";

const EVENT_NAME_TO_CLASS = {
    [HcsDidEventName.DID_OWNER]: HcsDidDidOwnerEvent,
    [HcsDidEventName.SERVICE]: HcsDidCreateServiceEvent,
    [HcsDidEventName.VERIFICATION_METHOD]: HcsDidCreateVerificationMethodEvent,
    [HcsDidEventName.VERIFICATION_RELATIONSHIP]: HcsDidCreateVerificationRelationshipEvent,
    [HcsDidEventName.DELETE]: HcsDidDeleteEvent,
};

export class HcsDidEventParser {
    static fromBase64(eventBase64: any): HcsDidEvent {
        const tree = JSON.parse(Hashing.base64.decode(eventBase64));
        const eventName = Object.keys(EVENT_NAME_TO_CLASS).find((eventName) => !!tree[eventName]);

        if (!eventName) {
            throw new Error("Invalid DID event");
        }

        return EVENT_NAME_TO_CLASS[eventName].fromJsonTree(tree[eventName]);
    }
}
