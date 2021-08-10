import { BY_OBJECT } from "../../Extraction/ByObject"
import Document from "../../Model/Document"

const documents = [
	{
		name: "Johnny Fish",
		longValue: "Fishes swim in the ocean and play with other fish."
	},
	{
		name: "Jimmy Ocean",
		longValue: "Humans sometime swim in the ocean and eat fish. Although sometimes playing with dolphines can also be fun."
	},
	{
		name: "Jargon Lake",
		longValue: "Having swum in a lot of water I can tell you that lakes are way nicer than the ocean."
	}
]

export const simpleDocuments = documents.map((doc, i) => new Document(i, doc, i, BY_OBJECT(doc)[0]))
