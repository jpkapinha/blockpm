import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { Document } from "langchain/document";

export const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
});

export async function chunkText(text: string, metadata: Record<string, unknown> = {}): Promise<Document[]> {
    const docs = await splitter.createDocuments([text], [metadata]);
    return docs;
}
