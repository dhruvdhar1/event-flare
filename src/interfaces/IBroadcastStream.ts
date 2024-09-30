import { Session } from "../Session";

export interface IBroadcastStream {
    /**
     * Register a `Session` object with a broadcast stream.
     * Broadcasted messages are sent to only registered sessions.
     * @param session 
     * 
     * example usage:
     * const channelId = "AAPL-subscribers"
     * const broadcastStream = new BroadcastStream(channelId)
     * const session = new Session(req, res)
     * broadcastStream.register(session)
     * ...
     * 
     */
    register(session: Session): void;

    /**
     * Evicts a `Session` object from a broadcast stream. Note that if a client 
     * session is bound to a broadcast channel, closing the session automatically 
     * deregisters it from the broadcast channel.
     * Any subsequent broadcasted messages won't be sent to the deregistered session.
     * @param sessionId: session id of the session to deregister. 
     * 
     * example usage:
     * const sessionIdToEvict = session.getSessionId()
     * broadcastStream.deregister(sessionIdToEvict)
     * ...
     * 
     */
    deregister(sessionId: string): boolean;

    /**
     * Broadcast events to all the sessions associated with this channel.
     * @param msg: the message to broadcast. This message should be a string. If you
     * want to broadcast an object, you'd need to stringify it first.
     * 
     * example usage:
     * const channelId = "AAPL-subscribers"
     * const broadcastStream = new BroadcastStream(channelId)
     * const session = new Session(req, res)
     * //Session registration
     * broadcastStream.register(session)
     * const dataToSend = {
     *     stockName: "AAPL",
     *     currentStockPrice: "245.65"
     * }
     * //send message to all subscribers in that channel
     * broadcastStream.broadcastAll(JSON.stringify(dataToSend))
     * ...
     */
    broadcastAll(msg: string): void

    /**
     * Broadcast events to a subset of the sessions associated with this channel.
     * @param msg: the message to broadcast. This message should be a string. If you
     * want to broadcast an object, you'd need to stringify it first.
     * @param sessions: list of sessions that should receive the message.
     * 
     * example usage:
     * const channelId = "AAPL-subscribers"
     * const broadcastStream = new BroadcastStream(channelId)
     * const session1 = new Session(req, res)
     * const session2 = new Session(req, res)
     * const session3 = new Session(req, res)
     * broadcastStream.register(session1)
     * broadcastStream.register(session2)
     * broadcastStream.register(session3)
     * const dataToSend = {
     *     stockName: "AAPL",
     *     currentStockPrice: "245.65"
     * }
     * //send message to some subscribers in that channel
     * broadcastStream.broadcastSome(JSON.stringify(dataToSend), [session1, session2])
     * ...
     */
    broadcastSome(msg: string, sessions: Session[]): void

    /**
     * Get total number of active connections associated with this brpadcast channel.
     */
    getActiveConnections(): number
}
