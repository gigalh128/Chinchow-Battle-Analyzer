document.addEventListener('DOMContentLoaded', function(){

  chrome.storage.local.get(["battle-logs"], function(result){

    window.battleLogs = result["battle-logs"];
    setupPage();

  });

});

document.addEventListener("change", function(e){

  if(e.target.id === "battleSelect"){
    setupInfo();
  }

});

function setupPage(){
  const logKeyDropdown = document.getElementById("battleSelect");
  const battleKeys = Object.keys(window.battleLogs);
  console.log("PAGE SETUP");
  //logKeyDropdown.addEventListener("click", setupInfo());

  for(let i = battleKeys.length - 1; i >= 0; i--){

    battleKey = battleKeys[i];
    const battleOption = document.createElement("option");
    battleOption.textContent = battleKey;
    battleOption.setAttribute("value", battleKey);
    logKeyDropdown.appendChild(battleOption);

  }
  setupInfo();
}

function setupInfo(){

  const anchor = document.getElementById("battleSelect");
  const currBattle = window.battleLogs[anchor.value];

  if(!currBattle){
    return;
  }

  const infoFilled = anchor.nextElementSibling;

  if(!infoFilled){
    anchor.parentNode.appendChild(document.createElement("div"));
    anchor.parentNode.appendChild(document.createElement("hr"));
    let pkmnInfo = document.createElement("div");
    pkmnInfo.setAttribute("id", "pkmnInfo");
    anchor.parentNode.appendChild(pkmnInfo);
  }

  let currElem = anchor.nextElementSibling;
  currElem.textContent = "";

  //set div header text
  for(let trainer in currBattle.trainers){
    currElem.textContent += `${trainer} `;

    if(currBattle.trainers[trainer].elo != null){ //key always exists, but unrated battles give null elos
      currElem.textContent += `(${currBattle.trainers[trainer].elo}) `;
    }

    currElem.textContent += `vs. `;

  }

  currElem.textContent = currElem.textContent.substring(0, currElem.textContent.length - 5);
  currElem = currElem.nextElementSibling.nextElementSibling;
  currElem.innerHTML = "";

  for(let trainer in currBattle.trainers){

    let trainerHtml = document.createElement("b");
    const player = currBattle.trainers[trainer].replayName;
    trainerHtml.textContent = `${trainer}: `;
    currElem.appendChild(trainerHtml);
    let pkmnList = document.createElement("p");
    currElem.appendChild(pkmnList);

    //append pokemon info
    for(let i in currBattle.constantTeams[player].pokemon){

      let currPkmn = currBattle.constantTeams[player].pokemon[i];
      let currPkmnElem = document.createElement("details");
      currPkmnElem.setAttribute("class", "pkmnbox");

      let name = document.createElement("summary");
      name.appendChild(document.createElement("u"));
      name.firstChild.textContent = currPkmn.name;

      if(currPkmn.level != 100){
        name.firstChild.textContent = `L${currPkmn.level} ${name.firstChild.textContent}`;
      }

      currPkmnElem.appendChild(name);
      currPkmnElem.appendChild(document.createElement("li"));
      currPkmnElem.lastChild.textContent = `Item: ${currPkmn.item != "Mail" ? currPkmn.item : "Unknown"}`;
      currPkmnElem.appendChild(document.createElement("li"));
      currPkmnElem.lastChild.textContent = `Ability: ${currPkmn.ability != "Illuminate" ? currPkmn.ability : "Unknown"}`;
      currPkmnElem.appendChild(document.createElement("li"));
      currPkmnElem.lastChild.textContent = "Moves: ";

      for(let move in currPkmn.replayMoves) { //be aware that this usually won't show up for pokemon in random battles, due to the lack of team preview and the possibility of zoroark
        currPkmnElem.lastChild.textContent += `${move}, `;
      }

      if(currPkmnElem.lastChild.textContent.length > 7) {
        currPkmnElem.lastChild.textContent = currPkmnElem.lastChild.textContent.substring(0, currPkmnElem.lastChild.textContent.length - 2);
      }

      const statRangesContainer = document.createElement("p");
      statRangesContainer.textContent = "Stat Ranges: ";

      for(let stat in currPkmn.statRanges) {

        const statRange = document.createElement("details");
        statRange.appendChild(document.createElement("summary"));
        statRange.lastChild.textContent = stat;

        for(let category in currPkmn.statRanges[stat]) {

          statRange.appendChild(document.createElement("li"));
          statRange.lastChild.style["padding-left"] = "1.5em";
          statRange.lastChild.textContent = category;

          const statInfo = currPkmn.statRanges[stat][category];
          const statInfoElem = document.createElement("span");
          statInfoElem.appendChild(document.createElement("li"));
          statInfoElem.lastChild.textContent = `${statInfo.evs[0]} - ${statInfo.evs[1]} evs, ${statInfo.ivs[0]} - ${statInfo.ivs[1]} ivs`;

          if(stat in currPkmn.altDefensiveRanges) {

            statInfoElem.appendChild(document.createElement("li"));
            statInfoElem.lastChild.textContent = `${statInfo.hpevs[0]} - ${statInfo.hpevs[1]} HP evs, ${statInfo.hpivs[0]} - ${statInfo.hpivs[1]} HP ivs`;

          }

          statRange.lastChild.appendChild(statInfoElem);

        }

        statRangesContainer.appendChild(statRange);

        if(stat in currPkmn.altDefensiveRanges) { //also include alternate defense options in the list

          const altStatRange = document.createElement("details");
          altStatRange.appendChild(document.createElement("summary"));
          altStatRange.lastChild.textContent = `${stat} (alternative ranges)`;

          for(let category in currPkmn.altDefensiveRanges[stat]) {

            altStatRange.appendChild(document.createElement("li"));
            altStatRange.lastChild.style["padding-left"] = "1.5em";
            altStatRange.lastChild.textContent = category;

            const altStatInfo = currPkmn.altDefensiveRanges[stat][category];
            const altStatInfoElem = document.createElement("span");
            altStatInfoElem.appendChild(document.createElement("li"));
            altStatInfoElem.lastChild.textContent = `${altStatInfo.evs[0]} - ${altStatInfo.evs[1]} evs, ${altStatInfo.ivs[0]} - ${altStatInfo.ivs[1]} ivs`;
            altStatInfoElem.appendChild(document.createElement("li"));
            altStatInfoElem.lastChild.textContent = `${altStatInfo.hpevs[0]} - ${altStatInfo.hpevs[1]} HP evs, ${altStatInfo.hpivs[0]} - ${altStatInfo.hpivs[1]} HP ivs`;
            altStatRange.lastChild.appendChild(altStatInfoElem);

          }

          statRangesContainer.appendChild(altStatRange);

        }

      }

      currPkmnElem.appendChild(statRangesContainer);
      pkmnList.appendChild(currPkmnElem);

    }
    currElem.appendChild(document.createElement("br"));

  }


}
