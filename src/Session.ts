import http from "http"
import { parse } from "url";
import { Readable } from "stream";
import { randomUUID } from "crypto";
import { Errors } from "./error";
import { MessageDipatcher } from "./MessageDispatcher";
import { DEFAULT_HEARTBEAT_INTERVAL, DEFAULT_HISTORY_SIZE, DEFAULT_RETRY_INTERVAL } from "./constants";
import { IOptions } from "./interfaces/IOptions";
import { ISession } from "./interfaces/ISession";
import EventEmitter from "events";
import { IEvent } from "./interfaces/IEvent";

export enum CONNECTION_STATE {
    CONNECTED = 'CONNECTED',
    DISCONNECTED = 'DISCONNECTED'
}

/**
 * - test retry mechanism for single and broadcast session, what if the client goes of network anmd connects back?
 */
export class Session extends EventEmitter implements ISession {
    private req: http.IncomingMessage;
    private res: http.ServerResponse<http.IncomingMessage> & { req: http.IncomingMessage; };
    private heartbeatIntervalDuration: number = DEFAULT_HEARTBEAT_INTERVAL
    private heartbeatInterval: NodeJS.Timeout | undefined;
    private messageDispatcher: MessageDipatcher
    private connectionState: CONNECTION_STATE = CONNECTION_STATE.DISCONNECTED
    private messageRetryInterval: number = DEFAULT_RETRY_INTERVAL
    private readStream: Readable
    private streamStarted: boolean = false
    private lastEventId: number
    private sessionId: string
    private history: IEvent[] = []
    private historySize: number = DEFAULT_HISTORY_SIZE
    private headers = {
        'Content-Type': 'text/event-stream',
        'Connection': 'keep-alive',
        'Cache-Control': 'private, no-cache, no-store, no-transform, must-revalidate, max-age=0',
        'X-Accel-Buffering': 'no'
    };

    constructor(req: http.IncomingMessage, 
            res: http.ServerResponse<http.IncomingMessage> & { req: http.IncomingMessage; }, options?: IOptions) {
        super()
        this.validateOptions(options)
        this.req = req
        this.res = res
        const lastEventIdReq = this.getLastEventIdFromReq(req)
        this.lastEventId = parseInt(lastEventIdReq)

        if(this.lastEventId) {
            //rewind and resend messages between this.lastEventId : latest
            this.rewind()
        }

        this.sessionId = options?.sessionId || randomUUID()
        this.messageDispatcher = new MessageDipatcher(res)
        this.historySize = options?.historySize || DEFAULT_HISTORY_SIZE
        this.messageRetryInterval = options?.retryInterval || DEFAULT_RETRY_INTERVAL
        this.heartbeatIntervalDuration = options?.heartbeatInterval || DEFAULT_HEARTBEAT_INTERVAL
        this.readStream = new Readable({
            read(_) {}
        });

        this.initConnection()
        this.sendHeartbeatMsg()

        this.connectionState = CONNECTION_STATE.CONNECTED
        this.req.once("close", () => this.close())
        this.res.once("close", () => this.close())
    }

    private getLastEventIdFromReq(req: http.IncomingMessage): string {
        const query = req.url && parse(req.url, true).query || {};
        const id1 = Array.isArray(req.headers['last-event-id']) ? req.headers['last-event-id'][0] : req.headers['last-event-id']
        const id2 = Array.isArray(query.evs_last_event_id) ? query.evs_last_event_id[0] : query.evs_last_event_id
        const id3 = Array.isArray(query.lastEventId) ? query.lastEventId[0] : query.lastEventId
        return id1 || id2 || id3 || '0'
    }

    private rewind() {
        const pivot = this.history.findIndex(event => event.id >= this.lastEventId)
        if(pivot !== -1) {
            const eventsToResend = this.history.slice(pivot)
            for(const event of eventsToResend) {
                this.lastEventId = event.id
                this.sendMessage(event.msg)
            }
        }
    }

    private validateOptions(options?: IOptions) {
        if(options && options.heartbeatInterval && typeof options.heartbeatInterval !== 'number') {
            throw new Error(Errors.ERR_INVALID_HEARTBEAT_INTERVAL)
        }
        if(options && options.heartbeatInterval && options.heartbeatInterval <= 0) {
            throw new Error(Errors.ERR_INVALID_HEARTBEAT_INTERVAL)
        }
        if(options && options.retryInterval && typeof options.retryInterval !== 'number') {
            throw new Error(Errors.ERR_INVALID_RETRY_INTERVAL)
        }
        if(options && options.retryInterval && options.retryInterval <= 0) {
            throw new Error(Errors.ERR_INVALID_RETRY_INTERVAL)
        }
        if(options && options.historySize && typeof options.historySize !== 'number') {
            throw new Error(Errors.ERR_INVALID_HISTORY_INTERVAL)
        }
        if(options && options.historySize && (options.historySize <= 9 || options.historySize > 500)) {
            throw new Error(Errors.ERR_INVALID_HISTORY_INTERVAL)
        }
    }

    private initConnection() {
        this.res.writeHead(200, this.headers)
    }

    private sendHeartbeatMsg() {
        if(!this.heartbeatInterval) {
            this.heartbeatInterval = setInterval(() => {
                this.res.write(':\n\n') //comment
            }, this.heartbeatIntervalDuration)
        }
    }

    private close() {
		this.req.removeListener("close", () => this.close());
		this.res.removeListener("close", () => this.close());

        this.lastEventId = 0
        this.streamStarted = false
        this.connectionState = CONNECTION_STATE.DISCONNECTED
        clearInterval(this.heartbeatInterval)
        this.readStream.push(null)
        this.res.end()
        this.emit("session-closed", this.sessionId)
    }

    private evictEventFromHistory() {
        this.history.shift()
    }

    getSessionId(): string {
        return this.sessionId
    }

    getConnectionState() {
        return this.connectionState
    }

    sendMessage(msg: string, eventName?: string) {
        if(this.connectionState === CONNECTION_STATE.DISCONNECTED) {
            throw new Error(`${Errors.ERR_CONN_CLOSED}, sessionId: ${this.sessionId}`)
        }
        const event: IEvent = {msg, eventName, id: this.lastEventId++}
        this.history.push(event) //save event to history

        if(this.history.length === this.historySize) {
            this.evictEventFromHistory()
        }

        const eventStr = JSON.stringify(event)
        const canPush = this.readStream.push(eventStr)
        if (!canPush) {
            this.readStream.once('drain', () => this.readStream.push(eventStr));
        }
        if(!this.streamStarted) {
            this.streamStarted = true
            this.messageDispatcher.sendMessage(this.readStream, {
                retryInterval: this.messageRetryInterval
            })
        }
        this.emit("message-sent", this.sessionId)
    }
}