export const delay = (ms = 180) =>
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
