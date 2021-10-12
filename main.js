const tempBattleLogs = {};
const partialTurnData = {};

function storeLog(battleKey, parsedLog) {

  chrome.storage.local.get(["battle-logs"], function(result){

    const battleLogs = "battle-logs" in result ? result["battle-logs"] : {};
    const battleLogKeys = Object.keys(battleLogs);

    if(battleLogKeys.length >= 5) {
      delete battleLogs[battleLogKeys[0]];
    }

    battleLogs[battleKey] = JSON.parse(JSON.stringify(parsedLog));
    chrome.storage.local.set({"battle-logs": battleLogs});

  });

}

if(document.URL.match(/.*replay\.pokemonshowdown.com\/.*/)){
  let battleKey = document.URL.match(/(\w|\d| )+-\d+$/g);
  let replayLog = document.getElementsByClassName("log")[0].textContent.replace(/\\/g, "");
  let parsedLog = parseLog(replayLog);
  analyzeReplayLog(parsedLog);
  calcStatRangesForReplay(parsedLog);
  console.log(parsedLog);
  storeLog(battleKey, parsedLog);

  alert("Chinchow successfully parsed battle " + battleKey);
} else {
  alert("Chinchow reading active battles");

  if(!document.getElementById("chinchow-console-inject")){

    let injectScript = document.createElement("script");
    injectScript.setAttribute("src", chrome.runtime.getURL("injects/console-interceptor.js"));
    injectScript.setAttribute("id", "chinchow-console-inject");
    document.body.appendChild(injectScript);

  }

  window.addEventListener("message", (event) => { //get info from the injected page script

    if("logMessage" in event.data) {

      const msg = event.data.logMessage[0];

      if(msg.startsWith("<< >battle-")) {

        const battleKey = msg.match(/^<< >battle-((\w|\d|-)+)/)[1];
        const parseMsg = msg.substring(11 + battleKey.length);
        console.log(battleKey);

        if(parseMsg.startsWith("\n|request")) { //just ignore the requests, they can be handled differently
          return;
        }

        const turnParts = parseMsg.split("\n|turn");
        //let isInit = /\|gen\|\d\n\|tier\|/.test(turnParts[0]); //once the battle reaches this point, there will be enough info to init a battle log
        let isDeinit = turnParts[0].startsWith("\n|deinit");
        let infoIndx = turnParts.length <= 2 ? 0 : turnParts.length - 1;
        let parsedLog = false;

        console.log(turnParts, parseMsg);

        if(isDeinit) { //store whatever stuff was previously in the temp battle logs
          console.log("deinit!", tempBattleLogs);
          parsedLog = tempBattleLogs[battleKey];
          parseTurn(parsedLog, partialTurnData[battleKey]);
          analyzeReplayTurn(parsedLog, parsedLog.turns[parsedLog.turns.length - 1], parsedLog.turns.length - 1);
          calcStatRangesForReplay(parsedLog);
          console.log(parsedLog);
          delete tempBattleLogs[battleKey];
          delete partialTurnData[battleKey];
          return;
        }

        if(infoIndx != 0) { //more than 1 turn has passed before the client joined

          parsedLog = parseLog(turnParts[0]);

          for(let i = 1; i < infoIndx - 1; i++) {
            parseTurn(parsedLog, turnParts[i]);
          }

          analyzeReplayLog(parsedLog);
          calcStatRangesForReplay(parsedLog);
          tempBattleLogs[battleKey] = parsedLog;
          storeLog(battleKey, parsedLog);

        }


        if(!(battleKey in partialTurnData)) {
          partialTurnData[battleKey] = turnParts[infoIndx];
        } else {
          partialTurnData[battleKey] += turnParts[infoIndx];
        }

        if(/^\|\d+?(?!\n\|\n\|t:\|)/.test(turnParts[turnParts.length - 1]) && infoIndx == 0) { //turn has been completed

          let isInit = /\|gen\|\d\n\|tier\|/.test(partialTurnData[battleKey]); //once the battle reaches this point, there will be enough info to init a battle log
          console.log("partial data.", JSON.parse(JSON.stringify(partialTurnData)));
          const dataStr = partialTurnData[battleKey];
          delete partialTurnData[battleKey];

          if(isInit) { //there is only one turn in the init text block
            parsedLog = parseLog(dataStr);
            analyzeReplayLog(parsedLog);
            calcStatRangesForReplay(parsedLog);
          } else {

            parsedLog = tempBattleLogs[battleKey];
            parseTurn(parsedLog, dataStr);

            analyzeReplayTurn(parsedLog, parsedLog.turns[parsedLog.turns.length - 1], parsedLog.turns.length - 1);

            let currTurnIndexes = {};

            for(let indexes in parsedLog.referenceHits) {
              if(indexes.startsWith(parsedLog.turns.length - 1)) {
                currTurnIndexes[indexes] = 1;
              }
            }

            calcStatRangesForIndexes(parsedLog, currTurnIndexes);

          }

          console.log("BATTLE DATA", JSON.parse(JSON.stringify(parsedLog)));
          tempBattleLogs[battleKey] = parsedLog;
          storeLog(battleKey, parsedLog);
          console.log("done storing");

        }


      }



    }

  });

}
