export default class Index {
    constructor(shards) {
        this.tag = "NOT SET"
        this.shards = shards
        this.index = {}
        this.build()
    }

    build() {}

    evaluate(term) {
        return this.index[term]
    }

    setShards(shards) {
        this.shards = shards
        this.build()
    }
}