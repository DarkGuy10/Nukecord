#!/usr/bin/env node
import 'dotenv/config'
import chalk from 'chalk'
import prompts from 'prompts'
import { Collection, Guild } from 'discord.js-selfbot-v13'
import { Ora } from 'ora'
import { Log, onCancel, spinner, sleep } from './utils/index.js'
import raidModules from './raids/index.js'
import { Raid, RaidName } from './typings/index.js'
import { userAbortError } from './errors.js'
import NukecordClient from './client/index.js'

/* 
	"Hisashiburi, Handler One"
		- Shinei Nouzen
*/

/* 
	Autopilot Mode: [To add]
	--token (if exists) takes priority over NUKECORD_SELFBOT_TOKEN 
	--guild-id must be provided
*/

// ================================= Global Variables
let token: string

/**
 * The last spinner that was used.
 * A new reference is created each time a new spinner is required.
 */
let _spinner: Ora

const client = new NukecordClient({
	intents: ['GUILDS'],
})

// ================================= Piece Functions
/**
 * Get token from either environment variable or user input.
 */
const getToken = async (): Promise<string> => {
	if (process.env.NUKECORD_SELFBOT_TOKEN) {
		Log.info(`Token found from env: ${chalk.bold(process.env.NUKECORD_SELFBOT_TOKEN)}`)
		const { _useFromEnv } = await prompts(
			{
				type: 'confirm',
				name: '_useFromEnv',
				message: 'Continue with this token?',
				initial: true,
			},
			{ onCancel }
		)
		if (_useFromEnv) return process.env.NUKECORD_SELFBOT_TOKEN
	}

	const { token } = await prompts(
		{
			type: 'text',
			name: 'token',
			message: 'Enter your user token',
			format: value => value.trim(),
			validate: value => !!value,
		},
		{ onCancel }
	)
	return token
}

// ================================= Error Handling
process.on('uncaughtException', (error, origin) => {
	// All errors are fatal and the script exits with code 1
	Log.error(error)
	process.exit(1)
})

// ================================= Start Of Script
// Welcome human
Log.banner()
token = await getToken()
_spinner = spinner('Attempting Login...').start()

// Try login
try {
	await client.login(token)
	_spinner.text = 'Building client cache...'
} catch (error) {
	_spinner.prefixText = `${Log.prefix('ERROR')}`
	_spinner.fail('Login failed.')
	throw error
}

// Wait for client to get ready
await client.getReady()
_spinner.stop()
Log.success(
	`Logged in as ${chalk.bold(
		`${client.user?.username}#${client.user?.discriminator}`
	)} ${chalk.gray.dim(`[ID: ${client.user?.id}]`)}`
)

// Sassy sleep statement
await sleep(500)

// Select target guild
Log.info(`Retrieved ${chalk.bold(`${client.guilds.cache.size} guilds`)}`)

const { target }: { target: Guild } = await prompts(
	{
		type: 'select',
		name: 'target',
		message: 'Select target guild',
		choices: client.guilds.cache.map(guild => ({
			title: guild.name,
			description: `[ID: ${guild.id}]`,
			value: guild.id,
		})),
		initial: 0,
		hint: '- Use arrow-keys. Return or Enter to submit.',
		format: id => client.guilds.cache.get(id),
	},
	{ onCancel }
)

// Filter raids by available permissions
const permittedRaids = raidModules.filter(
	raid => target.me?.permissions.has(raid.permission) ?? false
)

// The client doesn't have sufficient permission for executing any raid
if (!permittedRaids.size) {
	Log.warn("Client doesn't have permissions for executing any raid")
	process.exit(0)
}

// Ask user to select atleast 1 raid module out of the permitted ones
const { selectedRaids }: { selectedRaids: Collection<RaidName, Raid> } = await prompts(
	{
		type: 'multiselect',
		name: 'selectedRaids',
		message: 'Choose the raid modules to execute',
		choices: permittedRaids.map(raid => ({
			title: raid.name,
			value: raid.name,
		})),
		min: 1,
		format: (raidNames: RaidName[]) =>
			permittedRaids.filter(raid => raidNames.includes(raid.name)),
	},
	{ onCancel }
)

// Warning, because people may second guess their decisions
Log.warn(`Think twice before moving ahead, violence isn't always the answer (but sometimes it is)`)

// Are you really really sure?
const { _confirmRaid } = await prompts(
	{
		type: 'confirm',
		name: '_confirmRaid',
		message: `Confirm raid execution on ${chalk.cyan(target.name)} with modules [${selectedRaids
			.map(raid => raid.name)
			.join(', ')}] ?`,
		initial: true,
	},
	{ onCancel }
)

// That's an abort innit
if (!_confirmRaid) throw userAbortError

// Execute the selected raids
for (const raid of selectedRaids.values()) await raid.execute(target)

// We're done!
Log.success('Raid completed, exitting script.')
process.exit(0)

// =================================  Bye Bye
