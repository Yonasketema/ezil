import * as p from "@clack/prompts";
import color from "picocolors";

import { openai } from "./openai.js";
import { webLoader, ytLoader } from "./utils/loader.js";
import { createVectorStore } from "./utils/store.js";
import { recursiveSplitter } from "./utils/docSplitter.js";
import { withLoading } from "./utils/loadingIndicator.js";

p.intro(`${color.bgWhite(color.black(" Ezil : CTRL + C to quit"))}`);

const getDataType = async () => {
  return await p.select({
    message: `Pick a data type : `,
    initialValue: "youtube",
    maxItems: 5,
    options: [
      { value: "youtube", label: "Youtube" },
      { value: "web", label: "Web" },
    ],
  });
};

const getUrl = async () => {
  return await p.text({
    placeholder: "http://..",
    message: "Please enter Your URL",
    validate: (value) => {
      if (!value) return "Please enter a URL.";
    },
  });
};

const loadData = async (dataType, url) => {
  let docs;
  if (dataType === "youtube") {
    docs = await ytLoader(url);
  } else if (dataType === "web") {
    docs = await webLoader(url);
  }
  return docs;
};

const splitAndIndex = async (docs) => {
  const chunks = await recursiveSplitter(docs);
  return await createVectorStore(chunks);
};

//  QA
const askQuestions = async (store) => {
  while (true) {
    const query = await p.text({
      message: color.green("Please enter your question: "),
      validate: (value) => {
        if (!value) return "Please enter your question.";
      },
    });

    if (query.toLowerCase() === "exit") {
      break;
    }

    const results = await withLoading(
      () => store.similaritySearch(query, 2),
      "Getting your answer."
    );

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      temperature: 0,
      messages: [
        {
          role: "system",
          content: "answer my question",
        },
        {
          role: "user",
          content: `
          Context:${results.map((r) => r.pageContent).join("\n")}
          Question:${query}
          INSTRUCTIONS:
          Answer the user's QUESTION using the Context text above.
          Keep your answer grounded in the facts of the Context!
          If the Context doesn’t contain the facts to answer the QUESTION, return "Oh, the documents aren’t sufficient!"
          `,
        },
      ],
    });

    p.outro(color.white(color.bold(response.choices[0].message.content)));
    console.log([...new Set(results)].map((r) => r.metadata.source).join(","));
  }
};

const main = async () => {
  const dataType = await getDataType();
  const url = await getUrl();

  const docs = await withLoading(
    () => loadData(dataType, url),
    "Loading Your Data."
  );

  const store = await withLoading(
    () => splitAndIndex(docs),
    "Indexing and saving your data."
  );

  await askQuestions(store);
};

main().catch((error) => {
  p.cancel(error.message);
  process.exit(0);
});
