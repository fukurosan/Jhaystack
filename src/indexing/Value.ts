import Index from "../Model/Index"
import Shard from "../Model/Shard"

export default class EqualsIndex extends Index {
    tag: string
    
    constructor(shards: Shard[]) {
        super(shards)
        this.tag = "VALUE"
    }

    build() {
        this.index = {}
        this.shards.forEach(shard => {
            const value = ("" + shard.value).toUpperCase()
            if (!this.index[value]) {
                this.index[value] = []
            }
            this.index[value].push(shard)
        })
    }
}