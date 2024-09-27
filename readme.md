# Event Flare
![Static Badge](https://img.shields.io/badge/version-1.0.0-blue)
![Static Badge](https://img.shields.io/badge/build-passing-green)


Effortlessly stream real-time events from your server to clients using Server-Sent Events (SSE). This package provides an easy-to-use API for implementing SSE, allowing you to establish a one-to-one/ one-to-many connection where the server can continuously send event updates to clients with minimal setup.

## Features
- Unicast event to a single client.
- Broadcast event to multiple clients at once.
- Compatible with all popular Node.js HTTP frameworks like Express, http, Koa.
- Ships with Typescript types.
- Event history with configurable size.
- Comes with retry mechanism with configurable reconnection timeout.
- events are sent with last event id for more robustness.
- Heartbeat mechanism for keeping connection alive with configurable heartbeatInterval.
- Supports [`event-source-polyfill`](https://www.npmjs.com/package/event-source-polyfill)

## Installation
```
    npm install event-flare
```

## Usage

### Stream events to single client:

#### Express Server
```typescript
import { Session } from "event-flare"
import express from "express"

const app = express()
app.get('/', (req, res) => {
    const session = new Session(req, res)
    const dataToSend = {
        stockName: "AAPL",
        currentStockPrice: "245.65"
    }
    session.sendMessage(JSON.stringify(dataToSend))
}).listen(PORT)
```

#### Node.js http module
```typescript
import { Session } from "event-flare"
import http from "http"

http.createServer((req, res) => {
    const session = new Session(req, res)
    const dataToSend = {
        stockName: "AAPL",
        currentStockPrice: "245.65"
    }
    session.sendMessage(JSON.stringify(dataToSend))
}).listen(PORT)
```

#### Koa
```typescript
import { Session } from "event-flare"
import { PassThrough } from "stream"
import Koa from "koa"

const app = new Koa()
app.use(async ctx => {
    const req = ctx.req
    const res = ctx.res
    ctx.respond = false
    const stream = new PassThrough();
    ctx.body = stream
    const session = new Session(req, res)
    const dataToSend = {
        stockName: "AAPL",
        currentStockPrice: "245.65"
    }
    session.sendMessage(JSON.stringify(dataToSend))
}).listen(PORT)
```

### Bind events to a particular eventName:
When sending data over sse, we can use `eventName` to describe an event type. To do this with `event-flare`, pass the `eventName` in the `sendMessage` method.

```typescript
const session = new Session(req, res)
const msg = "mock data"
const eventType = "AAPL-stock-price"
session.sendMessage(msg, eventType)
```
This will send the following SPEC compliant SSE event:
```
    event: AAPL-stock-price
    data: mock data
    ...
```

### Configure session parameters:
You can configure/ pass the following to the session Object:

- `heartbeatInterval`: send an empty heartbeat event after the specified time to keep connection open. Default is `45000` millis

- `retryInterval`: time to wait before the client attemps to reconnect. Default is `1000` millis

- `historySize`: Max event history size. Oldest events will be popped when this limit is reached. Default is `100`

- `sessionId`: You can pass a custom sessionId for a sesison.

```typescript
const options = {
    heartbeatInterval: 20000,
    retryInterval: 2000,
    historySize: 500,
    sessionId: 'my-custom-session-id'
}
const session = new Session(req, res, options)
```

### Get connection state for a particular session:
A session can either be in `CONNECTED` state or in `DISCONNECTED` state. To get the connection state, use the `getConnectionState` method.

```typescript
const session = new Session(req, res)
const state = session.getConnectionState()
```

### Broadcast events to multiple client:
To broadcast events to multiple clients, we first need to create a broadcast channel. This can be done by:

```typescript
const broadcastStream = new BroadcastStream("some-channel-id")
```
After setting up the broadcast channel, we need to link client sessions with the broadcast channel. This can be done with the `register()` method:

```typescript
broadcastStream.register(session)
```

#### Broadcasting can be done in 2 ways:
1. Broadcast events to all the sessions associated with that channel. This can be done by using `broadcastAll()` method.
2. Broadcast events to some sessions in that channel. This can be done by using `broadcastSome()` method.

The following code examples demonstrate both usages.

```typescript
import { BroadcastStream } from "event-flare"

const channelId = "AAPL-subscribers"
const broadcastStream = new BroadcastStream(channelId)
const session = new Session(req, res)

//Session registration
broadcastStream.register(session)
const dataToSend = {
    stockName: "AAPL",
    currentStockPrice: "245.65"
}

//send message to all subscribers in that channel
broadcastStream.broadcastAll(JSON.stringify(dataToSend))

...
```

----

```typescript
import { BroadcastStream } from "event-flare"

const channelId = "AAPL-subscribers"
const broadcastStream = new BroadcastStream(channelId)

const session1 = new Session(req, res)
const session2 = new Session(req, res)
const session3 = new Session(req, res)

broadcastStream.register(session1)
broadcastStream.register(session2)
broadcastStream.register(session3)

const dataToSend = {
    stockName: "AAPL",
    currentStockPrice: "245.65"
}

//send message to some subscribers in that channel
broadcastStream.broadcastSome(JSON.stringify(dataToSend), [session1, session2])

...
```

### Evict a client from a broadcast channel:

To deregister a session from a broadcast channel, we can use the `deregister()` method. The `deregister` method expects to pass `sessionId` associated with the session to evict. `SessionId` can be fetched by calling `getSessionId()` method on a session object.

```typescript
const sessionIdToEvict = session.getSessionId()
broadcastStream.deregister(sessionIdToEvict)
```

### Get total active connections in a broadcast channel:

```typescript
const totalConnections = broadcastStream.getActiveConnections()
```