import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";

export const recursiveSplitter = async (docs) => {
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
    // separators: "",
  });

  const output = await splitter.splitDocuments(docs);

  return output;
};
