import { http, segment } from '@kivibot/core'

import type { Forwardable } from '@kivibot/core'

export async function fetchBaike(word: string, index?: string) {
  const api = `https://baike.deno.dev/item/${word}`
  const { data } = await http.get(api, { params: { n: index ?? '' } })

  if (data.status === 404) {
    return data.message || '目标词条不存在'
  }

  if (data.status === 200) {
    return [
      segment.image(data.data.cover),
      '\n' + data.data.description,
      '\n详情：' + data.data.link
    ]
  } else {
    console.error(data.message)
    return '啊哦，出错了'
  }
}

export async function fetchItems(
  word: string,
  uin: number,
  nickname: string
): Promise<string | Forwardable[]> {
  const api = `https://baike.deno.dev/item_list/${word}`
  const { data } = await http.get(api)

  if (data.status === 404) {
    return data.message || '目标词条不存在'
  }

  if (data.status === 200) {
    const msgs = data.data.list.map((e: any, i: number) => {
      const title = `${e.title}\n${e.link}`
      return `${i + 1}.${title}`
    }) as string[]

    msgs.push('以上数据来源于百度百科')

    return msgs.map(e => ({ nickname, user_id: uin, message: e }))
  } else {
    console.error(data.message)
    return '啊哦，出错了'
  }
}
