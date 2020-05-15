import Index from "../Model/Index"

export default class EqualsIndex extends Index {
    constructor(shards) {
        super(shards)
        this.tag = "EQUALS"
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