import { PassThrough } from "stream";
import { MessageTransformer } from "../MessageTransformer";

describe("MessageTransformer tests", () => {
    test("test with id and message", () => {
        const messageTransformer = new MessageTransformer()
        const input = new PassThrough();
        let output = '';
        input.pipe(messageTransformer).on('data', (chunk) => {
            output += chunk.toString();
        });
        messageTransformer.on('end', () => {
            expect(output).toBe('id:10\n\n\n');
        });
        input.write(JSON.stringify({id: 10}));
        input.end();
    })

    test("test with only message", () => {
        const messageTransformer = new MessageTransformer()
        const input = new PassThrough();
        let output = '';
        input.pipe(messageTransformer).on('data', (chunk) => {
            output += chunk.toString();
        });
        messageTransformer.on('end', () => {
            expect(output).toBe('id:0\ndata:hello world\n\n');
        });
        input.write(JSON.stringify({msg: "hello world"}));
        input.end();
    })

    test("test with id and message", () => {
        const messageTransformer = new MessageTransformer()
        const input = new PassThrough();
        let output = '';
        input.pipe(messageTransformer).on('data', (chunk) => {
            output += chunk.toString();
        });
        messageTransformer.on('end', () => {
            expect(output).toBe('id:10\ndata:hello world\n\n');
        });
        input.write(JSON.stringify({id: 10, msg: "hello world"}));
        input.end();
    })

    test("test with id, eventName and message", () => {
        const messageTransformer = new MessageTransformer()
        const input = new PassThrough();
        let output = '';
        input.pipe(messageTransformer).on('data', (chunk) => {
            output += chunk.toString();
        });
        messageTransformer.on('end', () => {
            expect(output).toBe('id:10\nevent:mock-event\ndata:hello world\n\n');
        });
        input.write(JSON.stringify({id: 10, msg: "hello world", eventName: "mock-event"}));
        input.end();
    })

    test("test with id, message and retry", () => {
        const messageTransformer = new MessageTransformer({retryInterval:1000})
        const input = new PassThrough();
        let output = '';
        input.pipe(messageTransformer).on('data', (chunk) => {
            output += chunk.toString();
        });
        messageTransformer.on('end', () => {
            expect(output).toBe('id:10\ndata:hello world\nretry:1000\n\n');
        });
        input.write(JSON.stringify({id: 10, msg: "hello world"}));
        input.end();
    })

    test("test with id, event, message and retry", () => {
        const messageTransformer = new MessageTransformer({retryInterval:1000})
        const input = new PassThrough();
        let output = '';
        input.pipe(messageTransformer).on('data', (chunk) => {
            output += chunk.toString();
        });
        messageTransformer.on('end', () => {
            expect(output).toBe('id:10\nevent:mock-event\ndata:hello world\nretry:1000\n\n');
        });
        input.write(JSON.stringify({id: 10, msg: "hello world", eventName: "mock-event"}));
        input.end();
    })
})