import { Client } from 'discord.js-selfbot-v13'

/**
 * The NukecordClient that extends djs-selfbot client
 * Slightly modified to match our needs
 */
class NukecordClient extends Client {
	/**
	 * Wait for the client to get ready.
	 * So we don't have to split the code into two parts.
	 * Straight up butcher the event emitter lmao.
	 */
	getReady(): Promise<void> {
		return new Promise(resolve => {
			this.once('ready', () => {
				resolve()
			})
		})
	}
}

export default NukecordClient
