import Index from "../Model/Index"

export default class ValueIndex extends Index {
    constructor(shards) {
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