import * as p from "@clack/prompts";
import color from "picocolors";

import { ytLoader } from "./utils/loader.js";
import { createVectorStore } from "./utils/store.js";
import { openai } from "./openai.js";

//FIXME: refactor

p.intro(`${color.bgWhite(color.black(" Ezil "))}`);

const spin = p.spinner();

const dataType = await p.select({
  message: `Pick a data type `,
  initialValue: "youtube",
  maxItems: 5,
  options: [
    { value: "youtube", label: "Youtube" },
    { value: "web", label: "WebUrl" },
  ],
});

const url = await p.text({
  placeholder: "http://..",
  message: "Please enter Your url",
  validate: (value) => {
    if (!value) return "Please enter a Url.";
  },
});

//load
spin.start();
spin.message(`Loading Your Data .`);

let loader;

if (dataType === "youtube") {
  try {
    loader = await ytLoader(url);
  } catch (e) {
    if (e) {
      p.cancel(e);
      process.exit(0);
    }
  }
}

spin.stop(`Your Data is Load`);

// / store

spin.start();
spin.message(`indexing and save  Your Data .`);
const store = await createVectorStore([...loader]);

spin.stop(`index And save`);

//  QA

while (true) {
  const query = await p.text({
    message: color.green("Please enter your question : "),
    validate: (value) => {
      if (!value) return "Please enter your qa.";
    },
  });

  if (query.toLowerCase() === "exit") {
    break;
  }

  /// answer

  spin.start();
  spin.message(`getting your answer.`);

  const results = await store.similaritySearch(query, 2);

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
        Answer the users QUESTION using the Context text above.
        Keep your answer ground in the facts of the Context!
        If the Context doesn’t contain the facts to answer the QUESTION return oh, it’s the documents that aren’t sufficient!
            
        `,
      },
    ],
  });

  // console.log(response.choices[0].message.content);

  spin.stop(`your answer`);
  p.outro(color.white(color.bold(response.choices[0].message.content)));
  console.log(results.map((r) => r.metadata.source).join(","));
}
