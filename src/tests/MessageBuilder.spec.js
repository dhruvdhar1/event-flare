import { MessageBuidler } from "../MessageBuilder";

describe("MessageBuilder tests", () => {
    test("test message formation 1", () => {
        const mb = new MessageBuidler()
        mb.id("1").data("mock message")
        const msg = mb.getMessage()
        expect(msg).toBe("id:1\ndata:mock message\n\n")
    })

    test("test message formation 2", () => {
        const mb = new MessageBuidler()
        mb.data("hello world")
        const msg = mb.getMessage()
        expect(msg).toBe("data:hello world\n\n")
    })

    test("test message formation 3", () => {
        const mb = new MessageBuidler()
        mb.data("mock message").id("1")
        const msg = mb.getMessage()
        expect(msg).toBe("id:1\ndata:mock message\n\n")
    })

    test("test message formation 4", () => {
        const mb = new MessageBuidler()
        mb.data("   mock message    ").id("1")
        const msg = mb.getMessage()
        expect(msg).toBe("id:1\ndata:mock message\n\n")
    })

    test("test message formation 5", () => {
        const mb = new MessageBuidler()
        mb.id("").data("mock message")
        const msg = mb.getMessage()
        expect(msg).toBe("data:mock message\n\n")
    })

    test("test message formation with object", () => {
        const mb = new MessageBuidler()
        const message = {name: "John Doe", age: 24}
        mb.id(1).data(JSON.stringify(message))
        const msg = mb.getMessage()
        expect(msg).toBe("id:1\ndata:{\"name\":\"John Doe\",\"age\":24}\n\n")
    })

    test("test message formation with an event", () => {
        const mb = new MessageBuidler()
        const message = {name: "John Doe", age: 24}
        mb.id("10").event("mock-event").data(JSON.stringify(message))
        const msg = mb.getMessage()
        expect(msg).toBe("event:mock-event\nid:10\ndata:{\"name\":\"John Doe\",\"age\":24}\n\n")
    })

    test("test message formation with an empty event", () => {
        const mb = new MessageBuidler()
        const message = {name: "John Doe", age: 24}
        mb.id("10").event().data(JSON.stringify(message))
        const msg = mb.getMessage()
        expect(msg).toBe("id:10\ndata:{\"name\":\"John Doe\",\"age\":24}\n\n")
    })

    test("test message formation with a retry", () => {
        const mb = new MessageBuidler()
        const message = {name: "John Doe", age: 24}
        mb.id("10").data(JSON.stringify(message)).retry(1000)
        const msg = mb.getMessage()
        expect(msg).toBe("id:10\ndata:{\"name\":\"John Doe\",\"age\":24}\nretry:1000\n\n")
    })

    test("test message formation with an event and retry", () => {
        const mb = new MessageBuidler()
        const message = {name: "John Doe", age: 24}
        mb.id("10").event("mock-event").data(JSON.stringify(message)).retry(1000)
        const msg = mb.getMessage()
        expect(msg).toBe("event:mock-event\nid:10\ndata:{\"name\":\"John Doe\",\"age\":24}\nretry:1000\n\n")
    })

    test("test clear message", () => {
        const mb = new MessageBuidler()
        const message = {name: "John Doe", age: 24}
        mb.id("10").event("mock-event").data(JSON.stringify(message)).retry(1000)
        const msg = mb.getMessage()
        expect(msg).toBe("event:mock-event\nid:10\ndata:{\"name\":\"John Doe\",\"age\":24}\nretry:1000\n\n")

        mb.clear()
        const clear = mb.getMessage()
        expect(clear).toBe("\n\n")
    })
})