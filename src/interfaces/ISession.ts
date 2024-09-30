import { CONNECTION_STATE } from "../Session";

export interface ISession {
    /**
     * A session can either be in `CONNECTED` state or in `DISCONNECTED` state. This 
     * method returns the current state of session.
     */
    getConnectionState(): CONNECTION_STATE;
    
    /**
     * Send a message to client over SSE. Note that the passed message should be 
     * a string. If you wish to send an object, you'd need to stringify it first.
     * If you want to bind a message to a particular event, use the `eventname` param.
     * 
     * @param msg: stringified message to send
     * @param eventName: When sending data over sse, we can use eventName 
     * to describe an event type.
     *      const eventType = "AAPL-stock-price"
     *      session.sendMessage(msg, eventType)
     * This will send the following SPEC compliant SSE event:
     *      event: AAPL-stock-price
     *      data: mock data
     *      ... 
     */
    sendMessage(msg: string, eventName?: string): void

    /**
     * Get session id pertaining to this session.
     */
    getSessionId(): string
}