#!/usr/bin/env node
import 'dotenv/config'
import chalk from 'chalk'
import prompts from 'prompts'
import { Collection, DiscordAPIError, Guild } from 'discord.js-selfbot-v13'
import { Log, onCancel, spinner, sleep } from './utils/index.js'
import yargs from 'yargs/yargs'
import { hideBin } from 'yargs/helpers'
import raidModules from './raids/index.js'
import { Raid, RaidName } from './typings/index.js'
import { userAbortError } from './errors.js'
import NukecordClient from './client/index.js'

/* 
	Supported flags:
		--token=TOKEN			# prioritized over NUKECORD_SELFBOT_TOKEN env variable
		--use-env				# use the NUKECORD_SELFBOT_TOKEN env variable, exit if doesn't exist
		--guild-id=GUILD_ID		# use this guild, exit if can't
		--autopilot 			# enable autopilot mode

	Autopilot Mode: (--autopilot)
		either --token=TOKEN must be provided, or script searches for NUKECORD_SELFBOT_TOKEN 
		from the environment; exits if neither found
		--guild-id=GUILD_ID must be provded
*/

// ================================= Global Variables
let token: string

const argv = yargs(hideBin(process.argv))
	.options({
		token: { type: 'string', alias: 't' },
		'use-env': { type: 'boolean', alias: 'u' },
		'guild-id': { type: 'string', alias: 'g' },
		// autopilot: { type: 'boolean', alias: 'a' },
	})
	.parseSync()

let _spinner = spinner()

const client = new NukecordClient({
	intents: ['GUILDS'],
})

let targetGuild: Guild

// ================================= Piece Functions
/**
 * Get the client token.
 * Respects script options.
 */
const getToken = async (): Promise<string> => {
	// If --token=TOKEN is provided
	if (argv.token) {
		Log.info(`Using provided token: ${chalk.bold(argv.token)}`)
		return argv.token
	}

	// If --use-env is enabled
	if (argv.useEnv) {
		if (!process.env.NUKECORD_SELFBOT_TOKEN)
			throw new Error(
				'Option --use-env was used but script could not find a NUKECORD_SELFBOT_TOKEN. Did you forget to add it to PATH?'
			)
		Log.info(`Using token from env: ${chalk.bold(process.env.NUKECORD_SELFBOT_TOKEN)}`)
		return process.env.NUKECORD_SELFBOT_TOKEN
	}

	// This part is for the interactive wizard
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

/**
 * Get the target guild.
 * Respects script options.
 */
const getTargetGuild = async (): Promise<Guild> => {
	// If --guild-id=GUILD_ID is provided
	if (argv.guildId) {
		try {
			const _targetGuild = await client.guilds.fetch(argv.guildId)
			return _targetGuild
		} catch (error) {
			throw new Error(
				`Client is missing access to given guild. \nEither the provided GUILD_ID is invalid or client is not present in the said guild.`
			)
		}
	}

	// This part is for the interactive wizard
	Log.info(`Retrieved ${chalk.bold(`${client.guilds.cache.size} guilds`)}`)
	const { _targetGuild }: { _targetGuild: Guild } = await prompts(
		{
			type: 'select',
			name: '_targetGuild',
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

	return _targetGuild
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

// Get token
token = await getToken()

// Try login and display relevant error
try {
	_spinner.start('Attempting Login...')
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

// Get target guild
targetGuild = await getTargetGuild()

// Filter raids by available permissions
const permittedRaids = raidModules.filter(
	raid => targetGuild.me?.permissions.has(raid.permission) ?? false
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
		message: `Confirm raid execution on ${chalk.cyan(
			targetGuild.name
		)} with modules [${selectedRaids.map(raid => raid.name).join(', ')}] ?`,
		initial: true,
	},
	{ onCancel }
)

// That's an abort innit
if (!_confirmRaid) throw userAbortError

// Execute the selected raids
for (const raid of selectedRaids.values()) await raid.execute(targetGuild)

// We're done!
Log.success('Raid completed, exitting script.')
process.exit(0)

// =================================  Bye Bye

/* 
	"Hisashiburi, Handler One"
		- Shinei Nouzen
*/
