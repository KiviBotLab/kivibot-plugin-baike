import { KiviPlugin, makeForwardMsg } from '@kivibot/core'

import { fetchBaike, fetchItems } from './services'

const { version } = require('../package.json')
const plugin = new KiviPlugin('百度百科', version)

const baike = /^百科\s*([^\s]+)\s*$/
const baikeIndex = /^百科\s*([^\s]+)\s+(\d+)\s*$/
const item = /^词条\s*([^\s]+)\s*$/

plugin.onMounted(bot => {
  plugin.onMatch(baike, async event => {
    const word = baike.exec(event.raw_message)![1]
    const info = await fetchBaike(word)
    event.reply(info)
  })

  plugin.onMatch(baikeIndex, async event => {
    const results = <string[]>baike.exec(event.raw_message)
    const [word, idx] = results
    const info = await fetchBaike(word, idx)
    event.reply(info)
  })

  plugin.onMatch(item, async event => {
    const word = baike.exec(event.raw_message)![1]
    const info = await fetchItems(word, bot.uin)

    if (Array.isArray(info)) {
      event.reply(await makeForwardMsg.bind(bot)(info, `${word} 的义项列表`))
    } else {
      event.reply(info)
    }
  })
})

export { plugin }
