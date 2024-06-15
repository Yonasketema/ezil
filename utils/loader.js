import { YoutubeLoader } from "@langchain/community/document_loaders/web/youtube";
import { CharacterTextSplitter } from "langchain/text_splitter";
import "dotenv/config";

export const ytLoader = async (url) => {
  const loadData = YoutubeLoader.createFromUrl(url, {
    language: "en",
    addVideoInfo: true,
  });

  const ytDocs = await loadData.loadAndSplit(
    new CharacterTextSplitter({
      separator: "",
      chunkSize: 2500,
      chunkOverlap: 100,
    })
  );

  return ytDocs;
};

//TODO:  add web loader
// FIXME: language , reactor: doc splitter
