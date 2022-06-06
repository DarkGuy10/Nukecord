import chalk from 'chalk'

type LogLevel = 'ERROR' | 'SUCCESS' | 'INFO' | 'PROGRESS' | 'WARN'

/**
 * Utility class for neat logging.
 * This will later be a separate package: toodles sexy logger
 */
class Log {
	/**
	 * Colors for different log levels
	 */
	private static _colorLevels = {
		INFO: chalk.cyan,
		ERROR: chalk.red,
		SUCCESS: chalk.green,
		PROGRESS: chalk.magenta,
		WARN: chalk.yellow,
	}

	/**
	 * Prefixes used to print messages
	 * @param logLevel Log level of the prefix
	 */
	static prefix(logLevel: LogLevel): string {
		return `${chalk.grey('[')} ${this._colorLevels[logLevel].bold(logLevel)} ${chalk.grey(']')}`
	}

	/**
	 * Print a plain message (same as console.log)
	 * @param message Message to print
	 */
	static plain(message: any) {
		console.log(message)
	}

	/**
	 * Print an error message
	 * @param message Message to print
	 */
	static error(message: any): void {
		console.log(
			`${this.prefix('ERROR')} ${this._colorLevels.ERROR(
				`${message.code ?? message.name}: ${message.message}`
			)}
${process.env.NODE_ENV === 'development' ? message.stack : ''}`
		)
	}

	/**
	 * Print a success message
	 * @param message Message to print
	 */
	static success(message: any): void {
		console.log(`${this.prefix('SUCCESS')} ${this._colorLevels.SUCCESS(message)}`)
	}

	/**
	 * Print an info message
	 * @param message Message to print
	 */
	static info(message: any): void {
		console.log(`${this.prefix('INFO')} ${this._colorLevels.INFO(message)}`)
	}

	/**
	 * Print a warn message
	 * @param message Message to print
	 */
	static warn(message: any): void {
		console.log(`${this.prefix('WARN')} ${this._colorLevels.WARN(message)}`)
	}

	/**
	 * Print a progress message
	 * @param message Message to print
	 */
	static progress(message: any): void {
		console.log(`${this.prefix('PROGRESS')} ${this._colorLevels.PROGRESS(message)}`)
	}

	/**
	 * Print the banner
	 * @param clearScreen Should clear screen?
	 */
	static banner(clearScreen: boolean = true): void {
		if (clearScreen) console.clear()
		const bannerText = `

		
	 ███▄    █  █    ██  ██ ▄█▀▓█████  ▄████▄   ▒█████   ██▀███  ▓█████▄ 
	 ██ ▀█   █  ██  ▓██▒ ██▄█▒ ▓█   ▀ ▒██▀ ▀█  ▒██▒  ██▒▓██ ▒ ██▒▒██▀ ██▌
	▓██  ▀█ ██▒▓██  ▒██░▓███▄░ ▒███   ▒▓█    ▄ ▒██░  ██▒▓██ ░▄█ ▒░██   █▌
	▓██▒  ▐▌██▒▓▓█  ░██░▓██ █▄ ▒▓█  ▄ ▒▓▓▄ ▄██▒▒██   ██░▒██▀▀█▄  ░▓█▄   ▌
	▒██░   ▓██░▒▒█████▓ ▒██▒ █▄░▒████▒▒ ▓███▀ ░░ ████▓▒░░██▓ ▒██▒░▒████▓ 
	░ ▒░   ▒ ▒ ░▒▓▒ ▒ ▒ ▒ ▒▒ ▓▒░░ ▒░ ░░ ░▒ ▒  ░░ ▒░▒░▒░ ░ ▒▓ ░▒▓░ ▒▒▓  ▒ 
	░ ░░   ░ ▒░░░▒░ ░ ░ ░ ░▒ ▒░ ░ ░  ░  ░  ▒     ░ ▒ ▒░   ░▒ ░ ▒░ ░ ▒  ▒ 
	   ░   ░ ░  ░░░ ░ ░ ░ ░░ ░    ░   ░        ░ ░ ░ ▒    ░░   ░  ░ ░  ░ 
	         ░    ░     ░  ░      ░  ░░ ░          ░ ░     ░        ░    
	                                  ░                           ░      
	                      ${chalk.gray.italic(`"we do a bit of trolling"
	                            - @DarkGuy10`)}
`
		console.log(chalk.blue(bannerText))
	}
}

export default Log
export { LogLevel }
