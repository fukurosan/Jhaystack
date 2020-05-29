export default (term: string, context: any): number => {
    return (`${context}`) === (`${term}`) ? 1 : 0
}