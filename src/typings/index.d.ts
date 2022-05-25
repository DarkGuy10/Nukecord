import { Collection, Guild, PermissionString } from 'discord.js-selfbot-v13'

export type Raid = {
	name: RaidName
	id: number
	permission: PermissionString
	execute: (victimGuild: Guild) => Promise<void>
}

export type RaidName =
	| 'CHANNEL_CREATE_RAID'
	| 'CHANNEL_DELETE_RAID'
	| 'GUILD_INFO_RAID'
	| 'ROLE_DELETE_RAID'
