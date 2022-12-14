import { KiviPlugin, makeForwardMsg as make } from '@kivibot/core'

import { fetchBaike, fetchItems } from './services'

const { version } = require('../package.json')
const plugin = new KiviPlugin('百度百科', version)

const baike = /^百科\s*([^\s]+)\s*$/
const baikeIndex = /^百科\s*([^\s]+)\s+(\d+)\s*$/
const item = /^词条\s*([^\s]+)\s*$/

plugin.onMounted(bot => {
  plugin.onMatch(['百科', '百度百科', 'baike'], e => {
    e.reply('百科<词条>\n词条<词条>\n百科<词条> <序号>', true)
  })

  plugin.onMatch(baike, async event => {
    const word = baike.exec(event.raw_message)![1]
    const info = await fetchBaike(word)
    event.reply(info)
  })

  plugin.onMatch(baikeIndex, async event => {
    const results = <string[]>baikeIndex.exec(event.raw_message)
    const [_, word, idx] = results
    const info = await fetchBaike(word, idx)
    event.reply(info)
  })

  plugin.onMatch(item, async event => {
    const word = item.exec(event.raw_message)![1]
    const info = await fetchItems(word, bot.uin, bot.nickname)
    const n = info.length - 1

    if (Array.isArray(info)) {
      const msg = await make.bind(bot)(info, `【${word}】共有 ${n} 个义项`, '轻按查看详情')
      event.reply(msg)
    } else {
      event.reply(info)
    }
  })
})

export { plugin }
