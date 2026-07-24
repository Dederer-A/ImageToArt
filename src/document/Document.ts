import type { HistoryRecord } from "@/history/HistoryRecord"
import type { layer } from "@/layer/Layer"

export class Document {
    id: string
    sourceImage!: string // base64 representation
    layers: layer[]
    historyRecords: HistoryRecord[]

    constructor(sourceImage: string) {
        this.id = crypto.randomUUID()
        this.sourceImage = sourceImage
        this.layers = []
        this.historyRecords = []
    }
}
