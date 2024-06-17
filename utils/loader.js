import { YoutubeLoader } from "@langchain/community/document_loaders/web/youtube";
import { PuppeteerWebBaseLoader } from "@langchain/community/document_loaders/web/puppeteer";

export const ytLoader = async (url) => {
  const loader = YoutubeLoader.createFromUrl(url, {
    language: "en",
    addVideoInfo: true,
  });

  const docs = await loader.load();

  return docs;
};

export const webLoader = async (url) => {
  const loader = new PuppeteerWebBaseLoader(url);

  const docs = await loader.load();

  return docs;
};

//TODO:  add web loader
// FIXME: language , reactor: doc splitter
