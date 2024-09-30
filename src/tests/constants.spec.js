import { DEFAULT_HEARTBEAT_INTERVAL, DEFAULT_HISTORY_SIZE, DEFAULT_RETRY_INTERVAL } from "../constants";

describe("verify constants", () => {
    test.only("test default constants", () => {
        expect(DEFAULT_HEARTBEAT_INTERVAL).toBe(45000)
        expect(DEFAULT_HISTORY_SIZE).toBe(100)
        expect(DEFAULT_RETRY_INTERVAL).toBe(1000)
    })
})