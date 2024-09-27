import { EventEmitter } from "events";
import { CONNECTION_STATE, Session } from "./Session";
import { IBroadcastStream } from "./interfaces/IBroadcastStream";
import { Errors } from "./error";

export class BroadcastStream extends EventEmitter implements IBroadcastStream {
    private sessions: Map<String, Session>
    private channelId: string

    constructor(channelId: string) {
        super()
        this.sessions = new Map()
        this.channelId = channelId
    }
    getActiveConnections(): number {
        return this.sessions.size
    }

    register(session: Session) {
        if(session.getConnectionState() !== CONNECTION_STATE.CONNECTED) {
            throw new Error(Errors.ERR_RGISTERING_INVALID_SESSION)
        }
        this.sessions.set(session.getSessionId(), session)
        this.emit("session-registered", session.getSessionId())
        
        session.on("session-closed", (sessionId) => {
            this.deregister(sessionId)
        })
    }

    deregister(sessionId: string): boolean {
        if(!this.sessions.has(sessionId)) {
            return false
        }
        this.sessions.delete(sessionId)
        this.emit("session-deregistered", sessionId)
        return true
    }

    broadcastAll(msg: string) {
        for(const [_, session] of this.sessions) {
            session.sendMessage(msg)
        }
        this.emit("broadcast-success", this.channelId)
    }

    broadcastSome(msg: string, sessions: Session[]) {
        if(!sessions || sessions.length === 0) {
            throw new Error(Errors.ERR_BROADCAST_SESSIONS_NON_EMPTY_OR_NULL)
        }
        for(const session of sessions) {
            if(this.sessions.has(session.getSessionId())) {
                session.sendMessage(msg)
            }
        }
        this.emit("broadcast-success", this.channelId)
    }
}