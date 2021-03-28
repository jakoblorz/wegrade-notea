import { strCompress } from 'packages/shared'
import { api } from 'libs/server/api'
import { metaToJson } from 'libs/server/meta'
import { useAuth } from 'libs/server/middlewares/auth'
import { useStore } from 'libs/server/middlewares/store'
import { getPathNoteById } from 'libs/server/note-path'
import { NoteModel } from 'libs/web/state/note'
import { StoreProvider } from 'packages/store/src'
import { API } from 'libs/server/middlewares/error'

export async function getNote(
  store: StoreProvider,
  id: string
): Promise<NoteModel> {
  const { content, meta } = await store.getObjectAndMeta(getPathNoteById(id))

  if (!content && !meta) {
    throw API.NOT_FOUND.throw()
  }

  const jsonMeta = metaToJson(meta)

  return {
    id,
    content: content || '\n',
    ...jsonMeta,
  } as NoteModel
}

export default api()
  .use(useAuth)
  .use(useStore)
  .delete(async (req, res) => {
    const id = req.query.id as string
    const notePath = getPathNoteById(id)

    await Promise.all([
      req.store.deleteObject(notePath),
      req.treeStore.removeItem(id),
    ])

    res.end()
  })
  .get(async (req, res) => {
    const id = req.query.id as string

    if (id === 'root') {
      return res.json({
        id,
      })
    }

    const note = await getNote(req.store, id)

    res.json(note)
  })
  .post(async (req, res) => {
    const id = req.query.id as string
    const { content } = req.body
    const notePath = getPathNoteById(id)
    const oldMeta = await req.store.getObjectMeta(notePath)

    if (oldMeta) {
      oldMeta['date'] = strCompress(new Date().toISOString())
    }

    await req.store.putObject(notePath, content, {
      contentType: 'text/markdown',
      meta: oldMeta,
    })

    res.status(204).end()
  })
