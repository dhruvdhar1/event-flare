export class MessageBuidler {
    private msg: string

    constructor() {
        this.msg = ""
    }

    id(id: string): MessageBuidler {
        this.msg = `id:${id}\n${this.msg}`
        return this
    }

    retry(interval: number): MessageBuidler {
        this.msg = `${this.msg}\nretry:${interval}`
        return this
    }

    event(eventName?: string): MessageBuidler {
        if(!eventName) return this
        this.msg = `event:${eventName}\n${this.msg}`
        return this
    }

    data(data: string): MessageBuidler {
        const sanitizedData = this.sanitizeData(data)
        this.msg = `${this.msg}\data:${sanitizedData}`
        return this
    }

    private sanitizeData(data: string) {
        //todo: Add custom sanitization logic
        let sanitized = data.trim()
        return sanitized
    }

    getMessage(): string {
        return `${this.msg}\n\n`
    }

    clear(): void {
        this.msg = ""
    }
    
}