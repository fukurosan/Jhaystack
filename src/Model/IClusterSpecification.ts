import ICluster from "./ICluster"

export default interface IClusterSpecification {
	id: string
	cluster: new (id: any, options?: any) => ICluster
	options?: any
}
