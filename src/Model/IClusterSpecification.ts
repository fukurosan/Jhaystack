import ICluster from "./ICluster"

export default interface IClusterSpecification {
	id: string
	cluster: { new <T extends ICluster>(id: any, options: any): T }
	options?: any
}
