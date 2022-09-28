chrome.commands.onCommand.addListener((command) => {
  console.log(`Command "${command}" triggered`);
});

console.log('Background started')

// Functional "content_scripts" injection
// chrome.action.onClicked.addListener((tab) => {
//   chrome.scripting.executeScript({
//     target: { tabId: tab.id },
//     files: ['content-script.js']
//   });
// });