const express = require('express');
const app = express();
const { JsonDB, Config } = require('node-json-db');
const cron = require('node-cron')

// modules
const GetFreeGames = require('./GetFreeGames');

const config = new Config("efg", true, false, "/")
const db = new JsonDB(config)

async function getData(){
    const result = await GetFreeGames()
    await db.push("efg", result)
}

cron.schedule('*/30 * * * *', () => {
    const dt = new Date()
    const hour = dt.getHours()
    const minutes = dt.getMinutes()
    const seconds = dt.getSeconds()
    console.log(`[${hour.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}] Updating game list ...`)
    getData()
})

app.get('/', async (req, res) => {
    try {
        const games = await db.getData('efg')
        res.send({ code: 200, message: "SUCCESS", games });

    } catch(err){
        res.status(500).send({ code: 500, message: "Something went wrong when getting requested resource", games: null });
    }
});

app.listen(3303, () => {
    getData()
    console.log('Epic Free Games service is running at http://localhost:3303')
});
