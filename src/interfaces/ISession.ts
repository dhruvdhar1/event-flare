import { CONNECTION_STATE } from "../Session";

export interface ISession {
    getConnectionState(): CONNECTION_STATE;
    
    sendMessage(msg: string): void

    getSessionId(): string
}