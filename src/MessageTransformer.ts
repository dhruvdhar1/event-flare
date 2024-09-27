import { Transform } from "stream";
import { MessageBuidler } from "./MessageBuilder";
import { IMessageOptions } from "./interfaces/IMessageOptions";
import { IEvent } from "./interfaces/IEvent";


export class MessageTransformer extends Transform {
    private retryInterval: number | undefined
    private messageBuilder: MessageBuidler

    constructor(options?: IMessageOptions) {
        super();
        this.retryInterval = options?.retryInterval
        this.messageBuilder = new MessageBuidler()
    }

    _transform(chunk: string, encoding: any, callback: () => void) {
        const { msg, id, eventName }: IEvent = JSON.parse(chunk.toString())

        const mb: MessageBuidler = this.messageBuilder.event(eventName).data(msg).id(String(id))
        if(this.retryInterval) {
            mb.retry(this.retryInterval)
        }
        const message = mb.getMessage()
        this.push(message);
        callback();
        this.messageBuilder.clear()
    }
}