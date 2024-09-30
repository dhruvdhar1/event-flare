import http from "http"
import { Stream } from "stream";
import { MessageTransformer } from "./MessageTransformer";
import { IMessageOptions } from "./interfaces/IMessageOptions";

export class MessageDispatcher {
    private res: http.ServerResponse<http.IncomingMessage> & { req: http.IncomingMessage; };

    constructor(res: http.ServerResponse<http.IncomingMessage> & { req: http.IncomingMessage; }) {
        this.res = res
    }

    sendMessage(readStream: Stream, options?: IMessageOptions): void {
        const messageTransformer = new MessageTransformer(options)
        readStream.pipe(messageTransformer).pipe(this.res)
    }
}