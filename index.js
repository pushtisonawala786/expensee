
import { Client, GatewayIntentBits } from 'discord.js';
import { getUserInventory, upgradeUserInventory } from './firebaseService.js'; // Firebase integration
import fetch from 'node-fetch';

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]
});

const userGameState = {};

function initializeUserInventory(userId) {
    if (!userGameState[userId]) {
        userGameState[userId] = {
            shields: 1,
            laserCannons: 1,
            health: 100,
            status: 'inactive', // possible states: 'inactive', 'inGame', 'combat'
        };
    }
}

async function handleCombat(userId) {
    const userInventory = userGameState[userId];
    const alienPower = Math.floor(Math.random() * 50) + 1; // Random alien power
    const userPower = userInventory.laserCannons * 10 + userInventory.shields * 5; // User's total combat power

    // Basic combat system: Higher power wins
    if (userPower >= alienPower) {
        userInventory.health -= alienPower / 2; // Take damage based on alien strength
        userInventory.laserCannons++; // Upgrade laser cannons after winning
        return `🚨 Battle won! You defeated the alien forces, but took ${alienPower / 2} damage. New Laser Cannon Level: ${userInventory.laserCannons}. Remaining Health: ${userInventory.health}`;
    } else {
        userInventory.health -= alienPower; // Take full damage if defeated
        return `💥 Battle lost! Alien forces were too strong! You took ${alienPower} damage. Remaining Health: ${userInventory.health}`;
    }
}

client.on('messageCreate', async (message) => {
    const userId = message.author.id;

    // Initialize user inventory if they haven't already started
    initializeUserInventory(userId);

    if (message.content === '/start') {
        userGameState[userId].status = 'inGame';
        message.channel.send("🎮 Game started! You are now in the space battle arena! Type `/scan` to scan for alien presence.");
    }

    if (message.content === '/scan') {
        if (userGameState[userId].status !== 'inGame') {
            return message.channel.send("🚫 You need to start the game first! Use `/start` to begin.");
        }
        const alienPresence = Math.random() > 0.5;
        const response = alienPresence ?
            "🚨 Alien fleet detected! Prepare for battle!" :
            "🌌 All clear! No alien activity detected.";
        message.channel.send(response);
        
        if (alienPresence) {
            message.channel.send("🚀 Battle begins! Use `/fight` to engage in combat.");
        }
    }

    if (message.content === '/fight') {
        if (userGameState[userId].status !== 'inGame') {
            return message.channel.send("🚫 You need to start the game first! Use `/start` to begin.");
        }
        const combatResult = await handleCombat(userId);
        message.channel.send(combatResult);
    }

    if (message.content === '/inventory') {
        const inventory = userGameState[userId];
        message.channel.send(`🛡️ Shields: ${inventory.shields}\n🔫 Laser Cannons: ${inventory.laserCannons}\n💪 Health: ${inventory.health}`);
    }

    if (message.content.startsWith('/upgrade')) {
        const item = message.content.split(' ')[1];
        if (!item || !['shields', 'laserCannons'].includes(item)) {
            return message.channel.send("Specify an item to upgrade: `shields` or `laserCannons`.");
        }

        try {
            // Upgrade the user's inventory item
            const newLevel = await upgradeUserInventory(userId, item);
            message.channel.send(`✅ Upgraded ${item}! New level: ${newLevel}`);
        } catch (error) {
            console.error('Error upgrading inventory:', error);
            message.channel.send('There was an error upgrading your inventory.');
        }
    }
});



client.login("MTMwNTkzMTQ0MzE1MDY1NTYwMg.GuXh7h.kjFMaM9O0uSKG3eeL5dPsJ0dAry7RiKW5Co-H0");
//ca6be78b2f1bedd228e35bd90766550c
//https://api.openweathermap.org/data/2.5/weather?q={city name}&appid={API key}