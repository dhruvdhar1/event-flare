export const Errors = {
    ERR_STR_SERIALIZATION: "Serialization error, message must be of type string",
    ERR_CONN_CLOSED: "Cannot send message, connection not valid!",
    ERR_INVALID_RETRY_INTERVAL: "Invalid retry interval provided. Value must be greater than 0",
    ERR_INVALID_HISTORY_INTERVAL: "Invalid history size provided. Value must be between 10 and 500.",
    ERR_INVALID_HEARTBEAT_INTERVAL: "Invalid heartbeat interval provided. Value must be greater than 0",
    ERR_RGISTERING_INVALID_SESSION: "Session is not active. Only active sessions can be registered!",
    ERR_BROADCAST_SESSIONS_NON_EMPTY_OR_NULL: "sessions list parameter cannot be null or empty. If you intend to broadcast to all sessions, use 'broadcastAll' instead"
}