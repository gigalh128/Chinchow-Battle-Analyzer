const log = console.log.bind(console)
console.log = (...args) => {
  window.postMessage({"logMessage": args}, document.URL);
  //log(...args);
}
