const userAbortError = new Error('Received abort signal, quitting.')
userAbortError.name = 'USER_ABORT'

export { userAbortError }
