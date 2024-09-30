import { Errors } from "../error";

describe("verify constants", () => {
    test.only("test errors", () => {
        expect(Errors.ERR_BROADCAST_SESSIONS_NON_EMPTY_OR_NULL).toBe("sessions list parameter cannot be null or empty. If you intend to broadcast to all sessions, use 'broadcastAll' instead")
        expect(Errors.ERR_CONN_CLOSED).toBe("Cannot send message, connection not valid!")
        expect(Errors.ERR_INVALID_HEARTBEAT_INTERVAL).toBe("Invalid heartbeat interval provided. Value must be greater than 0")
        expect(Errors.ERR_INVALID_HISTORY_INTERVAL).toBe("Invalid history size provided. Value must be between 10 and 500.")
        expect(Errors.ERR_INVALID_RETRY_INTERVAL).toBe("Invalid retry interval provided. Value must be greater than 0")
        expect(Errors.ERR_RGISTERING_INVALID_SESSION).toBe("Session is not active. Only active sessions can be registered!")
        expect(Errors.ERR_STR_SERIALIZATION).toBe("Serialization error, message must be of type string")
    })
})