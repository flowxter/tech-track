import { EvidenceModel } from '../../models/Evidence'

type EvidenceTask = { _id: unknown; owner: unknown }
function ownerId(owner: unknown): string {
  return String(owner && typeof owner === 'object' && '_id' in owner ? owner._id : owner)
}

/** Evidence es la fuente de metadatos; nunca se incluyen binarios en JSON. */
export async function withTaskEvidence<T extends EvidenceTask>(tasks: T[], admin = false) {
  if (!tasks.length) return []
  const evidence = await EvidenceModel.find({ $or: tasks.map((task) => ({ task: task._id, owner: ownerId(task.owner) })) })
    .select('task owner filename mimeType size uploadedAt')
    .sort({ uploadedAt: 1, _id: 1 })
    .lean()
  const grouped = new Map<string, typeof evidence>()
  for (const item of evidence) {
    const key = `${item.task}:${item.owner}`
    const entries = grouped.get(key) ?? []
    entries.push(item)
    grouped.set(key, entries)
  }
  return tasks.map((task) => ({
    ...task,
    evidence: (grouped.get(`${task._id}:${ownerId(task.owner)}`) ?? []).map((item) => ({
      _id: String(item._id), filename: item.filename, mimeType: item.mimeType,
      size: item.size, uploadedAt: item.uploadedAt,
      url: `${admin ? '/admin' : ''}/tasks/${task._id}/evidence/${item._id}/content`,
    })),
  }))
}
