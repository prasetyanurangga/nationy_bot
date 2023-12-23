/**
 * This is the main Node.js server script for your project
 * Check out the two endpoints this back-end API provides in fastify.get and fastify.post below
 */

const { Telegraf } = require('telegraf')
const { message } = require('telegraf/filters')
const axios = require("axios")
const lookup = require('country-code-lookup')
const {flag } = require('country-emoji');


const bot  = new Telegraf(process.env.BOT_TOKEN)



bot.start((ctx) => ctx.reply('Hi 👋 welcome to Nationy Bot, please enter your name.'))
bot.on(message('text'), async (ctx) => {
  const messageText = ctx.message.text
  try{
    
  
  const res = await axios.get('https://api.nationalize.io/?name='+messageText);
  const resultData = res.data
  const countryList = resultData.country
  console.log(countryList.length)
  if(countryList.length == 0){
    ctx.reply("sorry your name is not in our data")
  } else {
    countryList.forEach((item, i) => {
    const percentage = (item.probability * 100).toFixed(2)
    const countryData = lookup.byIso(item.country_id)
    if(countryData){
      
    ctx.reply("you have a "+percentage+"% chance of being an "+countryData.country+" "+flag(item.country_id)+" citizen.")
    }
    })
  }
  } catch (err)  {
    console.log(err)
    
  ctx.reply('We have some error')
  }
})
bot.launch().then(() => {
  console.log("running well")
})
