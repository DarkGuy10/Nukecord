import { Collection } from 'discord.js-selfbot-v13'
import { readdirSync } from 'fs'
import { Raid, RaidName } from './../typings/index.js'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

/**
 * A collection of all raid modules
 */
const raidModules: Collection<RaidName, Raid> = new Collection()

const raidFiles = readdirSync(__dirname).filter(file => !file.startsWith('index'))
for (const raidFile of raidFiles) {
	const raid: Raid = (await import(join('file://', __dirname, raidFile))).default
	raidModules.set(raid.name, raid)
}

raidModules.sort((a, b) => a.id - b.id)

export default raidModules
