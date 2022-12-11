import { KiviPlugin, segment, http } from '@kivibot/core'

const plugin = new KiviPlugin('百度百科', '0.0.0')

plugin.onMounted(() => {
  plugin.onMessage(event => {
    const { raw_message } = event

    if (raw_message === 'hello') {
      const msgs = [segment.face(66), 'world']
      event.reply(msgs)
    }
  })
})

export { plugin }
