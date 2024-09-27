import { Session } from "../Session";

export interface IBroadcastStream {
    register(session: Session): void;
    deregister(sessionId: string): boolean;
    broadcastAll(msg: string): void
    broadcastSome(msg: string, sessions: Session[]): void
    getActiveConnections(): number
}
