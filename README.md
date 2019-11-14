# Jhaystack
This is a zero dependency JSON search utility that lets you search for string values inside of a JSON object recursively.

### Installation and Usage
Install using NPM:
```
npm install Jhaystack
```

Typically you would use the library like so:
```javascript
import Jhaystack from "jhaystack"
const se = new Jhaystack()
const data = [
    {
        name: "tom"
    },
    {
        name: "tim"
    }
]
const results = se.search(data, "tm")
```

Jhaystack can also include only certain key values in your JSON objects, or alternatively exclude certain key values. By default all keys are included in a search.
You can configure your Jhaystack instance by passing either an inclusion or disclusion array to the constructor. The first argument to the constructor is the inclusion array, and the second is the disclusion array. You can technically pass both of them, but it doesn't really make sense.

```javascript
import Jhaystack from "jhaystack"
const include = ["name"]
const disclude = ["name"]
const seInc = new Jhaystack(include, null)
const seDisc = new Jhaystack(null, disclude)
const data = [
    {
        name: "tom"
    },
    {
        name: "tim"
    }
]
const resultsInc = seInc.search(data, "tm")
const resultsDesc = seDesc.search(data, "tm")
```
