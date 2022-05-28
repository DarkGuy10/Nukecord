import { Client, ClientOptions } from 'discord.js-selfbot-v13'

/**
 * The NukecordClient that extends djs-selfbot client
 * Slightly modified to match our needs
 */
class NukecordClient extends Client {
	constructor(props: ClientOptions) {
		super(props)
	}

	/**
	 * Wait for the client to get ready.
	 * So we don't have to split the code into two parts.
	 * Straight up butcher the event emitter lmao.
	 */
	async getReady(): Promise<void> {
		const promise = new Promise<void>(resolve => {
			this.once('ready', () => {
				resolve()
			})
		})
		return promise
	}
}

export default NukecordClient
