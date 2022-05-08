import ora, { Ora } from 'ora'
import { userAbortError } from '../errors.js'
import Log from './logger.js'

// ================================= Small Functions That Don't Need Separate Files

/**
 * onCancel on prompt aborts
 */
const onCancel = () => {
	throw userAbortError
}

/**
 * Await this to create a sleep
 * @param duration Sleep duration in milliseconds
 */
const sleep = async (duration: number): Promise<void> => {
	return new Promise(resolve => {
		setTimeout(resolve, duration)
	})
}

/**
 * Re-usable generic spinner factory
 * @param text Text to display after the spinner.
 */
const spinner = (text?: string): Ora =>
	ora({
		text,
		spinner: 'dots',
		color: 'magenta',
		prefixText: `${Log.prefix('PROGRESS')}`,
	})

/**
 * Get a random element from an array
 * @param arr: The array to pick from
 */
const randomFrom = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)]

export { onCancel, sleep, spinner, randomFrom }
