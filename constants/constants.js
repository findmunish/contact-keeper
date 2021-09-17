module.exports = {
    USER: {
        SALT_VALUE: 10,
        PASSWORD_MIN_LEN: 8
    },
    RANDOM_STR: {
        CRYPTO_RANDOM_STRING_LEN: 10,
        CRYPTO_RANDOM_TYPE_ALPHANUMERIC: 'alphanumeric',
        SKIP_CHARS_IN_BASE_36: 2,
        BASE_36_STR: 36
    },
    JWT_AUTH: {
        AUTH_TOKEN_HEADER: "x-auth-token",
        EMAIL_HEADER: 'email',
        JWT_SECRET_TOKEN_KEY: "jwtSecret",
        EXPIRES_IN_SEC: 360000
    },
    CODES: {
        SERVER_ERROR: 500,
        ERROR_400: 400,
        NO_ERROR: 200,
        AUTH_FAILED: 401
    }
}