import * as p from "@clack/prompts";

const loadingIndicator = {
  start: (message) => {
    const spin = p.spinner();
    spin.start();
    spin.message(message);
    return spin;
  },

  stop: (spin, message) => {
    spin.stop(message);
  },
};

const withLoading = async (fn, messageStart, messageEnd, messageError) => {
  const spin = loadingIndicator.start(messageStart);
  try {
    const result = await fn();
    loadingIndicator.stop(spin, messageEnd || "Completed");
    return result;
  } catch (error) {
    loadingIndicator.stop(spin, messageError || "Error");
    throw error;
  }
};

export { withLoading };
