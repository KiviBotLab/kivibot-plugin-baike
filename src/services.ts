import { http, segment } from '@kivibot/core'

import type { Forwardable } from '@kivibot/core'

export async function fetchBaike(word: string, index?: string) {
  const api = `https://baike.deno.dev/item/${word}`
  const { data } = await http.get(api, { params: { n: index ?? '' } })

  if (data.status === 404) {
    return data.message || '目标词条不存在'
  } else {
    return [
      segment.image(data.data.cover),
      '\n' + data.data.description,
      '\n详情：' + data.data.link
    ]
  }
}

export async function fetchItems(word: string, uin: number): Promise<string | Forwardable[]> {
  const api = `https://baike.deno.dev/item_list/${word}`
  const { data } = await http.get(api)

  if (data.status === 404) {
    return data.message || '目标词条不存在'
  } else {
    return [
      `词条【${data.data.item}】有以下义项：`,
      ...data.data.list.map((e: any) => `${e.title}\n${e.link}`)
    ].map(e => ({ user_id: uin, message: e }))
  }
}
