import { YoutubeLoader } from "@langchain/community/document_loaders/web/youtube";

export const ytLoader = async (url) => {
  const loader = YoutubeLoader.createFromUrl(url, {
    language: "en",
    addVideoInfo: true,
  });

  const docs = await loader.load();

  return docs;
};

//TODO:  add web loader
// FIXME: language , reactor: doc splitter
