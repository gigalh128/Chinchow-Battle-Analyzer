const healthEvents = {"-damage" : 1, "drag" : 1, "-heal" : 1, "-sethp" : 1, "switch" : 1};
const unsuppressableAbilities = {"As One": 1, "Battle Bond": 1, "Comatose": 1, "Disguise": 1, "Multitype": 1, "Neutralizing Gas": 1, "Power Construct": 1, "RKS System": 1, "Schooling": 1, "Shields Down": 1, "Stance Change": 1}
const assignedToLastHit = {"-ability": 1, "-boost": 1, "-damage": 1, "-enditem": 1, "-heal": 1, "-status": 1, "-unboost": 1}
const positions = ["a", "b", "c"];
let gens = new Generations(Dex);

function parseLog(replayLog){
  //const pkmnEvents = new Set(["cant", "-damage", "drag", "faint", "-heal", "move", "-start", "switch"]);
  const output = new Replay();
  const turns = replayLog.split("\n|turn");
  const currTeams = {};
  const currSlots = {};
  let currField = new ReplayField({gameType: output.gametype});
  const sidePositions = {};
  const unknownPkmn = {};//split into teams, then format is | pkmn info : [indexes]
  let potentialIllusionMons = {};

  turns[0].split("\n|").forEach(function(line){ //we need to get some specific information from turn 0
    const lineParts = line.split("|");
    let upkeepDone = false;

    switch(lineParts[0]){
      case "poke":
        const currRoster = unknownPkmn[lineParts[1]];
        const currPreviewTeam = output.previewTeams[lineParts[1]];

        if(lineParts[2] in currRoster){
          currRoster[lineParts[2]].push(currPreviewTeam.pokemon.length);
        } else {
          currRoster[lineParts[2]] = [currPreviewTeam.pokemon.length];
        }

        let infoParts = lineParts[2].split(", ");
        const pkmninfo = {};

        if(infoParts[0] === "Aegislash"){
          infoParts[0] += "-Shield";
        }

        for(let j = 1; j < infoParts.length; j++){

          if(infoParts[j].length === 1){
            pkmninfo.gender = infoParts[j];
          }

          else if(infoParts[j].startsWith("L")){
            pkmninfo.level = Number(infoParts[j].substring(1));
          }

        }

        currPreviewTeam.pokemon.push(new ReplayPokemon(output.gen, infoParts[0], false, infoParts[0], lineParts[1], currPreviewTeam.pokemon.length, pkmninfo));

        if(lineParts[2].startsWith("Zoroark") || lineParts[2].startsWith("Zorua") || output.hackedAbilities){
          potentialIllusionMons[lineParts[1]] += 1;
        }

        break;

      case "rule":
        let ruleInfo = lineParts[1].split(": ");
        output.rules[ruleInfo[0]] = ruleInfo[1];
      break;

      case "player":
        output.constantTeams[lineParts[1]] = new Team();
        output.previewTeams[lineParts[1]] = new Team();
        output.trainers[lineParts[2]] = new Trainer(lineParts[2], lineParts[1], lineParts[3], lineParts[4]);
        unknownPkmn[lineParts[1]] = {};
        potentialIllusionMons[lineParts[1]] = 0;
        currField.fieldSides[lineParts[1]] = {};
        break;
      case "gen":
        output.gen = Number(lineParts[1]);
        break;
      case "gametype":
        output.gameType = lineParts[1];
        output.gameType = output.gameType[0].toUpperCase() + output.gameType.substring(1);
        currField.gameType = output.gameType;
        break;
      case "teamsize":
        output.constantTeams[lineParts[1]].teamSize = Number(lineParts[2]); //unless there is other info, this is the team size
        output.previewTeams[lineParts[1]].teamSize = Number(lineParts[2]);
        break;
      case "tier":
        output.tier = lineParts[1];
        output.hackedAbilities = output.tier.endsWith("Almost Any Ability") || output.tier.includes("Hackmons") || output.tier.includes("Custom") || output.tier.includes("Metronome");

        if(output.tier.endsWith("Random Battle") && output.gen > 4) { //no team preview + zoroark possible

          for(let player in potentialIllusionMons) {
            potentialIllusionMons[player] = 1;
          }

        }

        break;
      case "teampreview":
        const num = Number(lineParts[1]);

        for(let team in output.constantTeams){

          if(num > output.constantTeams[team].pokemon){
            output.constantTeams[team].teamSize = num;
          }

        }

        break;
    }

  });

  for(let player in output.constantTeams){

    sidePositions[player] = [player + "a"];

    if(output.gameType === "Doubles" || output.gameType === "Freeforall"){
      sidePositions[player].push(player + "b");
    }

    else if(output.gameType === "Triples"){
      sidePositions[player].push(player + "b");
      sidePositions[player].push(player + "c");
    }

    currTeams[player] = output.constantTeams[player].clone();

  }

  output.sidePositions = sidePositions;
  output.unknownPkmn = unknownPkmn;
  output.potentialIllusionMons = potentialIllusionMons;
  output.currTeams = currTeams;
  output.currSlots = currSlots;
  output.currField = currField;


  for(let i = 0; i < turns.length; i++){
    parseTurn(output, turns[i]);
  }

  //console.log(output);
  return output;
}

function parseTurn(replay, turnLog){

  const output = replay;
  let currTeams = replay.currTeams;
  let currSlots = replay.currSlots;
  let currField = replay.currField;
  let i = output.turns.length;
  const turnLines = turnLog.split("\n|");

  output.turns.push(new Turn());
  const currTurn = output.turns[output.turns.length - 1];
  currTurn.events.push(new MajorEvent("transition", currField.clone(), {...currSlots}, null, null, cloneTeams(currTeams)));
  let currTime = 0;
  let currMajorEvent = currTurn.events[currTurn.events.length - 1];
  updateEventIndexes(currTurn, currMajorEvent);

  turnLines.forEach(function(line, index){

      const lineParts = line.trim().split("|");
      let upkeepDone = false;
      let sourcePkmn = null;
      let sourcePos = null;
      let sourceIndex = -1;
      let player = null;
      let sourceTeam = null;
      let targetPkmn = null;
      let targetPos = null;
      let nickname = null;
      let prevHpVal = null;
      let fromInfo = null;
      let isDrainEvent = false; //draining moves get recovery on each hit, while recoil moves take recoil for overall damage dealt
      const switchingIndexes = {};
      let assignmentLocation = currMajorEvent;
      //do event specific actions

      let ofPkmn = null;
      let ofPos = null;
      let ofPlayer = null;
      let ofIndex = -1;

      if(lineParts.length > 1 && lineParts[1].startsWith("p")){
        player = lineParts[1].substring(0, 2);
        sourceTeam = currTeams[player];
      }

      if(lineParts.length > 1 && lineParts[1].substring(3, 4) === ":"){ //minor event w/ pokemon source
        sourcePos = lineParts[1].substring(0, 3);
        nickname = lineParts[1].substring(5);
        //sourcePkmn = sourceTeam.pokemon[nickname];
        sourceIndex = currSlots[sourcePos];
        sourcePkmn = sourceTeam.pokemon[sourceIndex];

        if(lineParts[0] === "switch" || lineParts[0] === "drag" || lineParts[0] === "replace"){ //switch needs to be handled separately

          const infoStr = lineParts[2].split(", ");
          let pokemonName = infoStr[0] != "Aegislash" ? infoStr[0] : "Aegislash-Shield";
          const pkmninfo = {};
          let shiny = false;

          for(let j = 1; j < infoStr.length; j++){

            if(infoStr[j].length === 1){
              pkmninfo.gender = infoStr[j];
            }

            else if(infoStr[j] === "shiny"){
              shiny = true;
            }

            else if(infoStr[j].startsWith("L")){
              pkmninfo.level = Number(infoStr[j].substring(1));
            }

          }

          let nPkmnIndex = -1;
          let safeIndexes = [];

          if(!(player in switchingIndexes) || lineParts[lineParts.length - 1].startsWith("[from]")){ //cases where we need to generate new indexes to be ignored

            for(let j = 0; j < output.sidePositions[player].length; j++){

              let index = currSlots[output.sidePositions[player][j]];

              safeIndexes.push(index);

            }

          } else {
            safeIndexes = switchingIndexes[player];
          }

          let currGender = pkmninfo.gender ? pkmninfo.gender : "N";
          let currLevel = pkmninfo.level || 100;

          for(let j = 0; j < sourceTeam.pokemon.length; j++){ //try to find evidence that this is not a new pkmn

            const p = sourceTeam.pokemon[j];

            if(safeIndexes.includes(j) && p.definitelyReal){
              continue;
            }

            if(p.nickname === nickname && p.name === pokemonName && p.shiny == shiny && (p.level == currLevel || !p.definitelyReal) && p.gender === currGender){
              nPkmnIndex = j;
            }

          }

          if(nPkmnIndex == -1){
            nPkmnIndex = sourceTeam.pokemon.length;

            if(lineParts[0] == "replace") {
              console.log("replace", JSON.parse(JSON.stringify(sourceTeam.pokemon)));
            }

            sourceTeam.pokemon.push(new ReplayPokemon(output.gen, pokemonName, shiny, nickname, player, nPkmnIndex, pkmninfo));
            sourceTeam.pokemon[nPkmnIndex].ability = "Illuminate"; //Illuminate represents Unknown
            sourceTeam.pokemon[nPkmnIndex].item = "Mail"; //Mail represents Unknown

            if(!output.hackedAbilities) {

              switch(pokemonName) {
                case "Giratina-Origin":
                  sourceTeam.pokemon[nPkmnIndex].item = "Griseous Orb";
                break;

                case "Zacian-Crowned":
                  sourceTeam.pokemon[nPkmnIndex].item = "Rusted Sword";
                break;

                case "Zamazenta-Crowned":
                  sourceTeam.pokemon[nPkmnIndex].item = "Rusted Shield";
                break;
              }

              if(pokemonName.startsWith("Silvally-") && !(pokemonName.endsWith("Normal"))) {
                sourceTeam.pokemon[nPkmnIndex].item = pokemonName.substring(9) + " Memory";
              }

            }

            //set const pkmn hp bar denominator
            if(lineParts.length > 3) { //don't do this on a replace event
              const hpFractionParts = lineParts[3].split("/");
              sourceTeam.pokemon[nPkmnIndex].currHpbarNumerator = parseInt(hpFractionParts[0]);
              sourceTeam.pokemon[nPkmnIndex].hpbarDenominator = parseInt(hpFractionParts[1]);
            }

            //initialize species possible abilities
            let possibleAbilities = sourceTeam.pokemon[nPkmnIndex].speciesPossibleAbilities;

            if(Object.keys(possibleAbilities).length == 1 && !output.hackedAbilities){
              sourceTeam.pokemon[nPkmnIndex].ability = Object.keys(possibleAbilities)[0];
            }

            output.constantTeams[player].pokemon.push(sourceTeam.pokemon[nPkmnIndex].clone());
            let checkString = pokemonName;

            if("otherFormes" in sourceTeam.pokemon[nPkmnIndex]){
              checkString = checkString.substring(0, checkName.indexOf("-") + 1) + "*";
            }

            checkString += lineParts[2].substring(infoStr[0].length);
            checkString = checkString.replace(", shiny", ""); //shininess is unknown for preview mons

            if(!(checkString in output.unknownPkmn[player])){ //this is definitely an illusion mon, but there isn't necessarily a nickname to map it to :'(
              sourceTeam.pokemon[nPkmnIndex].flags.definitelyIllusion = true;
            }

            else if (output.unknownPkmn[player][checkString][0] != null) {
              output.previewTeams[player].pokemon[output.unknownPkmn[player][checkString][0]].flags.constantIndex = nPkmnIndex;
              output.unknownPkmn[player][checkString].splice(0, 1);

            } else { //this pokemon was actually not definitely real

              output.constantTeams[player].pokemon.pop();
              sourceTeam.pokemon.pop();

              for(let j = 0; j < sourceTeam.pokemon.length; j++){ //try to find the closest match

                const p = sourceTeam.pokemon[j];

                if(p.nickname === nickname && p.name === pokemonName && p.shiny == shiny && p.gender === currGender){
                  nPkmnIndex = j;
                  sourceTeam.backSlotIndex = j;
                  p.definitelyReal = false;
                }

              }

            }

          }

          switchingIndexes[player] = safeIndexes;
          sourcePkmn = sourceTeam.pokemon[nPkmnIndex];
          sourceIndex = nPkmnIndex;

          if(lineParts[0] != "replace" && lineParts[3].endsWith("48")){
            output.hpbarDenominator = 48;
          }

          if("Neutralizing Gas" in currField.fieldConditions && !(sourcePkmn.ability in unsuppressableAbilities)) {
            sourcePkmn.flags.artificialAbility = "neutralizing_gas_temp";
          }

          if(output.potentialIllusionMons[player] && (currTeams[player].backSlotIndex == -1 || sourcePkmn.originalTeamIndex == currTeams[player].backSlotIndex)){ //don't blindly assume the pokemon you are seeing is the real deal when illusion mons are around
            sourcePkmn.definitelyReal = false;

            if(sourcePkmn.originalTeamIndex == currTeams[player].backSlotIndex){
              currTeams[player].backSlotIndex = -1;
            }

            if("tempUnsureMoves" in sourcePkmn.flags){

              if(!("persistentUnsureMoves" in sourcePkmn.flags)){
                sourcePkmn.flags.persistentUnsureMoves = {};
              }

              for(let tempMove in sourcePkmn.flags.tempUnsureMoves){

                if(tempMove in sourcePkmn.flags.persistentUnsureMoves){
                  sourcePkmn.flags.persistentUnsureMoves[tempMove].timesUsed += sourcePkmn.flags.tempUnsureMoves[tempMove].timesUsed;
                } else {
                  sourcePkmn.flags.persistentUnsureMoves[tempMove] = sourcePkmn.flags.tempUnsureMoves[tempMove];
                }

              }

            }

            sourcePkmn.flags.tempUnsureMoves = {};
            sourcePkmn.flags.artificialItem = "maybe";
          } else {
            sourcePkmn.definitelyReal = true;
          }

          if(lineParts[0] != "replace" && sourcePkmn.definitelyReal){
            sourcePkmn.hpbarDenominator = Number(lineParts[3].split(" ")[0].split("/")[1]);
          }

          const prevPkmnIndex = currSlots[sourcePos];
          let prevPkmn = sourceTeam.pokemon[prevPkmnIndex];
          let backupPrevPkmn = null;

          if(lineParts[0] === "replace"){ //need to copy over some stuff
            sourcePkmn.volatileStatuses = prevPkmn.volatileStatuses;
            sourcePkmn.toxicCounter = prevPkmn.toxicCounter;
            sourcePkmn.boosts = {...prevPkmn.boosts};
            sourcePkmn.currSessionMoves = [...prevPkmn.currSessionMoves];
          }

          if(prevPkmn){
            backupPrevPkmn = prevPkmn.clone();

            if(lineParts[0] != "replace") {
              prevPkmn.flags.lastSwitchIndexes = [i, currTurn.events.length];
            } else {
              sourcePkmn.currHpbarNumerator = prevPkmn.currHpbarNumerator;
              sourcePkmn.hpbarDenominator = prevPkmn.hpbarDenominator;
            }

            if("tempTeamIndex" in prevPkmn.flags) { //undo the effects of transforming
              const tempPkmn = prevPkmn;
              prevPkmn = output.constantTeams[player].pokemon[prevPkmn.originalTeamIndex].clone();
              prevPkmn.replayMoves = tempPkmn.replayMoves;
              prevPkmn.status = tempPkmn.status;
              prevPkmn.currHpbarNumerator = tempPkmn.currHpbarNumerator;
              prevPkmn.flags = tempPkmn.flags;
              delete prevPkmn.flags.tempTeamIndex;
              delete prevPkmn.flags.tempPlayer;
              currTeams[player].pokemon[prevPkmnIndex] = prevPkmn;
            }

            //this probably causes issues if prevPkmn and sourcePkmn are both on the field, but it can be fixed later
            prevPkmn.volatileStatuses = {};
            prevPkmn.toxicCounter = 0;
            prevPkmn.types = prevPkmn.species.types.slice(0);
            prevPkmn.currSessionMoves = [];

            for(let boost in prevPkmn.boosts){ //boosts reset upon switching out
              prevPkmn.boosts[boost] = 0;
            }

            if(prevPkmn.name === output.constantTeams[player].pokemon[prevPkmn.originalTeamIndex].name) {
              delete prevPkmn.flags.artificialAbility;
            }

            if(prevPkmn.flags.artificialItem === "maybe") {//this was only a temporary judgement

              if(prevPkmn.item != output.constantTeams[player].pokemon[prevPkmnIndex].item){ //some event happened modified the item & we don't know if this pkmn is real, so now we have to give this pkmn & every illusion mon with an unconfirmed item the artificial item flag
                prevPkmn.flags.artificialItem = true;

                for(let j = 0; j < currTeams[player].pokemon.length; j++){
                  let tempPkmn = currTeams[player].pokemon[j];

                  if((tempPkmn.name.startsWith("Zoroark") || tempPkmn.name.startsWith("Zorua")) && output.constantTeams[player].pokemon[j] == null){//output.tier.endsWith("Almost Any Ability") || output.tier.includes("Hackmons") || output.tier.includes("Custom")
                    tempPkmn.flags.artificialItem = true;
                  }

                }
                //for the purposes of your sanity, the parser won't be super strict with these tiers.  Don't be surprised it if it mislabels your items though

              } else {
                delete prevPkmn.flags.artificialItem;
              }

            }

            if("baseSpecies" in prevPkmn.species){
              prevPkmn.ability = prevPkmn.species.abilities[0];
            } else {
              prevPkmn.ability = output.constantTeams[player].pokemon[prevPkmn.originalTeamIndex].ability;
            }

          }

          currSlots[sourcePos] = nPkmnIndex;
          let cause = "trainer";

          if(lineParts.length == 5){
            cause = lineParts[4];
          }
          else if(lineParts[0] === "drag"){
            cause = "drag";
          }

          currTurn.events.push(new SwitchEvent(currField.clone(), {...currSlots}, sourcePos, sourcePkmn.clone(), cloneTeams(currTeams), currTime, cause, backupPrevPkmn));
          currMajorEvent = currTurn.events[currTurn.events.length - 1];
          assignmentLocation = currMajorEvent;

          if(lineParts[0] != "replace") {
            updateEventIndexes(currTurn, currMajorEvent);
          }

          delete sourcePkmn.flags.lastSwitchIndexes;
        }

        if(lineParts.length > 2 && lineParts[2].substring(3, 4) === ":") { //source target event

          targetPos = lineParts[2].substring(0, 3);
          targetPkmn = currTeams[targetPos.substring(0, 2)].pokemon[currSlots[targetPos]];

        }

        else if(lineParts.length > 3 && lineParts[3].substring(3, 4) === ":") { //alternative source target event

          targetPos = lineParts[3].substring(0, 3);
          targetPkmn = currTeams[targetPos.substring(0, 2)].pokemon[currSlots[targetPos]];

        }

      }

      if(lineParts[0] in healthEvents){
        const statusInfo = lineParts[lineParts[0] === "switch" || lineParts[0] === "drag" ? 3 : 2].split(" ");
        prevHpVal = sourcePkmn.currHpbarNumerator;
        const numDenom = statusInfo[0].split("/");
        sourcePkmn.currHpbarNumerator = parseInt(numDenom[0]);
        sourcePkmn.originalCurHP = Math.floor(prevHpVal / sourcePkmn.hpbarDenominator * sourcePkmn.stats.hp);

        if(sourcePkmn.currHpbarNumerator != 0) {

          if(isNaN(numDenom[1][numDenom[1].length - 1])) {
            numDenom[1] = numDenom[1].substring(0, numDenom[1].length - 1);
          }

          sourcePkmn.hpbarDenominator = parseInt(numDenom[1]);
        }

        if(statusInfo.length > 1){

          if(statusInfo[1] != "fnt") {
            sourcePkmn.status = statusInfo[1];
          }

        } else {
          sourcePkmn.status = "";
        }

      }

      //of info parser
      if(lineParts[lineParts.length - 1].startsWith("[of]")){
        ofPos = lineParts[lineParts.length - 1].substring(5, 8);
        ofPlayer = ofPos.substring(0, 2);
        ofPkmn = currTeams[ofPlayer].pokemon[currSlots[ofPos]];
        ofIndex = currSlots[ofPos];
      }

      //from info parser
      if(lineParts[lineParts.length - 1].startsWith("[from]") || lineParts.length > 2 && lineParts[lineParts.length - 2].startsWith("[from]")){ //special handlers to parse out items/abillities
        let fromIndex = -1;
        let otherIndex = -1;
        let owner = null;
        let constOwner = null;

        if(lineParts[lineParts.length - 1].startsWith("[from]")){
          fromIndex = lineParts.length - 1;
        } else { //check what the next case could be

          fromIndex = lineParts.length - 2;
          otherIndex = lineParts.length - 1;

          if(lineParts[otherIndex].startsWith("[wisher]")){ //find the wisher from this index

            for(let j = 0; j < output.turns[i - 1].eventIndexes["move"].length; j++){

              let moveEvent = output.turns[i - 1].events[output.turns[i - 1].eventIndexes["move"][j]];

              if(sourcePos === moveEvent.sourcePos){
                ofPkmn = moveEvent.source;
              }

            }


          }

        }

        fromInfo = lineParts[fromIndex].substring(6).trim().split(": ");

        if(!ofPkmn || lineParts[0] === "-heal" || lineParts[0] === "-ability" ||lineParts[0] === "-item"){ //figure out who is getting the new info
          owner = sourcePkmn;
          constOwner = output.constantTeams[player].pokemon[sourceIndex];
        } else {
          owner = ofPkmn;
          constOwner = output.constantTeams[ofPlayer].pokemon[currSlots[ofPos]];

        }

        if(owner){ //make sure that the parser doesn't attempt to do stuff with a null owner

          switch(fromInfo[0].toLowerCase()){
            case "item":
              let setItem = true;
              let setConstOwner = !("artificialItem" in owner.flags);

              if(fromInfo[1] === "Sticky Barb"){//this is a terrible item...

                if(!("artificialItem" in owner.flags) && !("Magic Guard" in constOwner.speciesPossibleAbilities)){ //if the owner hasn't made contact with anything, then it is definitely the owner of the sticky barb.  Just to be safe, ignore potential magic guard pokemon who have gotten their abilities changed.
                //"artificialAbility" in sourcePkmn
                  let guaranteed = true;

                  if("move" in currTurn.eventIndexes){

                    for(let j = 0; j < currTurn.eventIndexes["move"].length; j++){

                      let tempEvent = currTurn.events[currTurn.eventIndexes["move"][j]];

                      if(tempEvent.source.originalTeamIndex === sourceIndex && tempEvent.source.originalPlayer === player && "contact" in tempEvent.move.flags){
                        guaranteed = false;
                        break;
                      }

                    }

                  }

                  setConstOwner = setConstOwner && guaranteed;

                }

              }

              else if(fromInfo[1].endsWith("Berry")){ //berries not eaten normally aren't from the original owner

                setItem = false; //berries have an accompanying enditem event, where ownership is set properly

              }

              if(owner.item === "" && !setConstOwner) {
                setItem = false;
              }

              if(setItem){
                owner.item = fromInfo[1];

                if(setConstOwner){
                  constOwner.item = fromInfo[1];
                }

              }

            break;

            case "ability":
              owner.ability = fromInfo[1];

              if(!("artificialAbility" in owner.flags)) {
                constOwner.ability = fromInfo[1];
              }

            break;

            case "drain":
              isDrainEvent = true;
            break;
          }

        }

      }

      if(currMajorEvent.name === "move" && currMajorEvent.hits.length && lineParts[0] in assignedToLastHit) { // && (lineParts[0] === "-damage" || isDrainEvent)
        assignmentLocation = currMajorEvent.hits[currMajorEvent.hits.length - 1];
      }

      //parse for actual events
      switch(lineParts[0]){

        case "move":
          const moveName = lineParts[2];
          cause = "trainer";
          let currMove = null;
          const movePkmn = "tempPlayer" in sourcePkmn.flags ? currTeams[sourcePkmn.flags.tempPlayer].pokemon[sourcePkmn.flags.tempTeamIndex] : currTeams[sourcePkmn.originalPlayer].pokemon[sourcePkmn.originalTeamIndex];

          if(!cause.endsWith("Magic Bounce")) {
            sourcePkmn.currSessionMoves.push(moveName);
          }

          if(fromInfo && fromInfo[0] != "Pursuit" && fromInfo[0] != "move: Round" || lineParts[lineParts.length - 1] === "[zeffect]" || moveName.startsWith("Max ") || moveName.startsWith("G-Max ") ||
          "Instruct" in sourcePkmn.volatileStatuses && currTurn.events[currTurn.events.length - 1].name === "move" && currTurn.events[currTurn.events.length - 1].move.name === "Instruct") {

            if(!(moveName in sourcePkmn.summonedMoves)){
              sourcePkmn.summonedMoves[moveName] = new Move(output.gen, moveName);
            }
            else if(!("tempTeamIndex" in sourcePkmn.flags)){
              sourcePkmn.summonedMoves[moveName].timesUsed += 1;
            }

            currMove = sourcePkmn.summonedMoves[moveName];

            if(fromInfo){
              cause = fromInfo.join(" ");
            }

            else if("Instruct" in sourcePkmn.volatileStatuses) {
              cause = "Instruct";
            }

            else {
              cause = "[zeffect]";
            }

          }
          else if(!sourcePkmn.definitelyReal){
            if(!(moveName in sourcePkmn.flags.tempUnsureMoves)){
              sourcePkmn.flags.tempUnsureMoves[moveName] = new Move(output.gen, moveName);
            } else {
              sourcePkmn.flags.tempUnsureMoves[moveName].timesUsed += 1;
            }

            currMove = sourcePkmn.flags.tempUnsureMoves[moveName];
          }
          else {
            if(!(moveName in movePkmn.replayMoves)){
              movePkmn.replayMoves[moveName] = new Move(output.gen, moveName);
              output.constantTeams[movePkmn.originalPlayer].pokemon[movePkmn.originalTeamIndex].replayMoves[moveName] = movePkmn.replayMoves[moveName];
            }

            else if (!("tempTeamIndex" in sourcePkmn.flags)) {
              sourcePkmn.replayMoves[moveName].timesUsed += 1;
            }

            currMove = movePkmn.replayMoves[moveName];

            if(!("usedAt" in currMove)){
              currMove.usedAt = {};
            }

            if(!(sourcePos in currMove)){
              currMove.usedAt[sourcePos] = [];
            }

            currMove.usedAt[sourcePos].push([i, currTurn.events.length]); //turn, major event index

          }

          let affectedSlots;

          if(lineParts[lineParts.length - 1].startsWith("[spread]")){ //spread move
            affectedSlots = lineParts[4].substring(9).split(",");

            if(affectedSlots.length == 0) { //spread move hits all slots, except the originator

              for(let slot in currSlots) {

                if(slot != sourcePos) {
                  affectedSlots.push(slot);
                }

              }

            }

          } else {
            const slot = lineParts[3].substring(0, 3);
            affectedSlots = [slot != '' ? slot : sourcePos];
          }


          //handle metronome count
          let metronomeCount = 0;

          for(let j = sourcePkmn.currSessionMoves.length - 2; j >= 0; j--) {

            if(sourcePkmn.currSessionMoves[j] != currMove.name) {
              break;
            }

            metronomeCount++;

          }

          currMove.timesUsedWithMetronome = metronomeCount;

          currTurn.events.push(new MoveEvent(currField.clone(), {...currSlots}, sourcePos, sourcePkmn.clone(), cloneTeams(currTeams), currMove.clone(), affectedSlots, cause));
          currMajorEvent = currTurn.events[currTurn.events.length - 1];
          assignmentLocation = currMajorEvent;
          currMajorEvent.move.timesUsed = currMove.timesUsed;

          if(fromInfo && fromInfo[0] === "Pursuit"){ //pursuit happened before switch
           currMajorEvent.move.priority = 7;
          }

          if(cause === "trainer" || lineParts[lineParts.length - 1] === "[zeffect]" || moveName.startsWith("Max ") || moveName.startsWith("G-Max ") || fromInfo && (fromInfo[0] === "Pursuit" || fromInfo[0] === "lockedmove" || fromInfo.length > 1 && fromInfo[1] === "Round")){
            currTurn.pokemonActionsDict[currMajorEvent.source.originalPlayer + "," + currMajorEvent.source.originalTeamIndex] = currTurn.events.length - 1;
          }

          updateEventIndexes(currTurn, currMajorEvent);
        break;

        case "switch": //separate place of their own
        case "drag":
          currMajorEvent.startNumerator = prevHpVal;
          currMajorEvent.endNumerator = sourcePkmn.currHpbarNumerator;
          currMajorEvent.source.currHpbarNumerator = currMajorEvent.endNumerator; //need to account for updates to health info

          if(lineParts[0] != "drag"){
            currTurn.pokemonActionsDict[currMajorEvent.source.originalPlayer + "," + currMajorEvent.source.originalTeamIndex] = currTurn.events.length - 1;
          }

        break;

        case "replace":
          currMajorEvent.name = "replace";
          sourcePkmn.definitelyReal = true;

          //find the last hit if possible and set the pokemon hit to be the real mon instead of the illusion
          const hitMoveIndex = currTurn.events.length - 2;
          if(currTurn.events.length > 1 && currTurn.events[hitMoveIndex].name === "move" && currTurn.events[hitMoveIndex].hits.length > 0) {

            for(let j in currTurn.events[hitMoveIndex].hits) {

              currTurn.events[hitMoveIndex].hits[j].defender = sourcePkmn.clone();

            }

          }

          //if the pokemon has already done something this turn, fix it
          const switchoutStr = currMajorEvent.switchOut.originalPlayer + "," + currMajorEvent.switchOut.originalTeamIndex;
          if(switchoutStr in currTurn.pokemonActionsDict) {
            currTurn.pokemonActionsDict[sourcePkmn.originalPlayer + "," + sourcePkmn.originalTeamIndex] = currTurn.pokemonActionsDict[switchoutStr];
            delete currTurn.pokemonActionsDict[switchoutStr];
          }

          for(let j = 0; j < currTurn.events.length - 1; j++) {

            if(currTurn.events[j].source && currTurn.events[j].source.originalPlayer === currMajorEvent.switchOut.originalPlayer && currTurn.events[j].source.originalTeamIndex === currMajorEvent.switchOut.originalTeamIndex) {
              let oldPkmn = currTurn.events[j].source.clone();
              currTurn.events[j].source = sourcePkmn.clone();
              let currEventPkmn = currTurn.events[j].source;
              currEventPkmn.boosts = JSON.parse(JSON.stringify(oldPkmn.boosts));
              currEventPkmn.volatileStatuses = {};

              for(let volatileStatus in oldPkmn.volatileStatuses) {
                currEventPkmn.volatileStatuses[volatileStatus] = oldPkmn.volatileStatuses[volatileStatus].clone();
              }

              currEventPkmn.status = oldPkmn.status;
              currEventPkmn.currHpbarNumerator = oldPkmn.currHpbarNumerator;
              currEventPkmn.hpbarDenominator = oldPkmn.hpbarDenominator;

            }

          }

          updateEventIndexes(currTurn, currMajorEvent);

        break;

        case "t:":
          currTime = Number(lineParts[1]);

          if(currTurn.startTime == 0){

            if(i != 0){
              currTurn.startTime = output.turns[i - 1].endTime;
            } else {
              currTurn.startTime = currTime;
            }

          }

          currTurn.endTime = currTime;
        break;

        case "upkeep":

          for(let condition in currField.fieldConditions){
            currField.fieldConditions[condition].turnsActive += 1;

            if(currField.fieldConditions[condition].type === "temporary"){
              delete currField.fieldConditions[condition];
            }
          }

          for(let slot in currSlots){

            const currPkmn = currTeams[slot.substring(0, 2)].pokemon[currSlots[slot]];

            for(let s in currPkmn.volatileStatuses){
              currPkmn.volatileStatuses[s].turnsActive += 1;

              if(currPkmn.volatileStatuses[s].singleTurn) {
                delete currPkmn.volatileStatuses[s];
              }

            }

            if(currPkmn.item === "Sticky Barb"){ //check if original sticky barb owners lost their sticky barb

              let foundBarb = false;

              if("-damage" in currMajorEvent.subEventIndexes){

                for(let j = 0; j < currMajorEvent.subEventIndexes["-damage"].length; j++){

                  let subEvent = currMajorEvent.subEvents[currMajorEvent.subEventIndexes["-damage"][j]];

                  if(subEvent.source.originalTeamIndex === currPkmn.originalTeamIndex && subEvent.source.originalPlayer === currPkmn.originalPlayer) {
                    foundBarb = true;
                  }

                }

              }

              if(!foundBarb){
                currPkmn.item = "";
              }

            }

          }
          upkeepDone = true;
          appendMinorEvent(currMajorEvent, sourcePos, sourcePkmn, targetPos, targetPkmn, lineParts);

        break;

        case "cant":

          const sourceConstPkmn = output.constantTeams[player].pokemon[currSlots[sourcePos]];

          if(lineParts[2].startsWith("ability")){ //cant event was triggered by the source pkmn's ability
            let triggeredAbility = lineParts[2].substring(9);
            sourcePkmn.ability = triggeredAbility;

            if(!("artificialAbility" in sourcePkmn.flags)){
              sourceConstPkmn.ability = triggeredAbility;
            }

          }
          //console.log(sourceConstPkmn, "CANT");

          currTurn.events.push(new CantEvent(currField.clone(), {...currSlots}, sourcePos, sourcePkmn.clone(), cloneTeams(currTeams), lineParts[2]));
          currMajorEvent = currTurn.events[currTurn.events.length - 1];
          currTurn.pokemonActionsDict[currMajorEvent.source.originalPlayer + "," + currMajorEvent.source.originalTeamIndex] = currTurn.events.length - 1;

          updateEventIndexes(currTurn, currMajorEvent);
        break;

        case "faint":
          sourcePkmn.status = "fnt";

          if(sourcePkmn.ability === "Illusion" && sourcePkmn.definitelyReal){
            output.potentialIllusionMons[player]--;
          }

          currTurn.events.push(new FaintEvent(currField.clone(), {...currSlots}, sourcePos, sourcePkmn.clone(), cloneTeams(currTeams)));
          currMajorEvent = currTurn.events[currTurn.events.length - 1];
          const actionsDictTarget = currMajorEvent.source.originalPlayer + "," + currMajorEvent.source.originalTeamIndex;

          if(!(actionsDictTarget in currTurn.pokemonActionsDict)) {
            currTurn.pokemonActionsDict[actionsDictTarget] = currTurn.events.length - 1;
            updateEventIndexes(currTurn, currMajorEvent);
          }

        break;

        case "detailschange":
        case "-formechange":
          const nInfo = lineParts[2].split(", ");
          let pkmnName = nInfo[0] != "Aegislash" ? nInfo[0] : "Aegislash-Shield";
          const nPkmn = new ReplayPokemon(output.gen, pkmnName, sourcePkmn.shiny, sourcePkmn.nickname, player,
          sourceIndex, {gender: sourcePkmn.gender, level: sourcePkmn.level});
          const oldPkmn = sourcePkmn;
          nPkmn.replayMoves = sourcePkmn.replayMoves;
          nPkmn.volatileStatuses = sourcePkmn.volatileStatuses;
          nPkmn.currHpbarNumerator = sourcePkmn.currHpbarNumerator;
          nPkmn.definitelyReal = true;
          sourceTeam.pokemon[sourceIndex] = nPkmn;
          sourcePkmn = nPkmn;

          if(lineParts[0] === "-formechange"){

            sourcePkmn.ability = oldPkmn.ability;
            sourcePkmn.flags.tempTeamIndex = sourcePkmn.originalTeamIndex; //make sure the pkmn reverts to its base form when it switches out

            if(currMajorEvent.name != "transition" && currMajorEvent.sourcePos != sourcePos){ //forme changes should not be associated with events from any other pkmn
              currTurn.events.push(new MajorEvent("transition", currField.clone(), {...currSlots}, sourcePos, null, cloneTeams(currTeams)));
              currMajorEvent = currTurn.events[currTurn.events.length - 1];
            }

            appendMinorEvent(currMajorEvent, sourcePos, sourcePkmn, targetPos, targetPkmn, lineParts);

          } else {

            if(oldPkmn.name != nPkmn.name){
              sourcePkmn.flags.artificialAbility = true;
            }

            currTurn.events.push(new DetailsChangeEvent(currField.clone(), {...currSlots}, sourcePos, sourcePkmn.clone(), cloneTeams(currTeams), oldPkmn.clone()));
            currMajorEvent = currTurn.events[currTurn.events.length - 1];
            updateEventIndexes(currTurn, currMajorEvent);

          }
        break;

        case "swap":
          cause = "trainer";
          const nPos = player + positions[Number(lineParts[2])];
          const oldPos = sourcePos;
          const oldSlots = {...currSlots};
          currSlots[nPos] = oldSlots[oldPos];
          currSlots[oldPos] = oldSlots[nPos];
          sourcePos = nPos;

          if(fromInfo){
            cause = fromInfo.join(" ");
          }

          currTurn.events.push(new SwapEvent(currField.clone(), {...currSlots}, sourcePos, sourcePkmn.clone(), cloneTeams(currTeams), oldSlots, oldPos, cause));
          currMajorEvent = currTurn.events[currTurn.events.length - 1];
          updateEventIndexes(currTurn, currMajorEvent);

          if(cause === "trainer"){
            currTurn.pokemonActionsDict[currMajorEvent.source.originalPlayer + "," + currMajorEvent.source.originalTeamIndex] = currTurn.events.length - 1;
          }
        break;

        case "":
          if(currMajorEvent.name != "transition"){ //don't stack transition events
            currTurn.events.push(new MajorEvent("transition", currField.clone(), {...currSlots}, sourcePos, null, cloneTeams(currTeams)));
            currMajorEvent = currTurn.events[currTurn.events.length - 1];
            updateEventIndexes(currTurn, currMajorEvent);
          }

          break;

        case "-damage":
        case "-heal":
        case "-sethp":

          if(lineParts[0] === "-damage" && lineParts.length == 3 && currMajorEvent.targetPositions && currMajorEvent.targetPositions[0] != currMajorEvent.sourcePos){ //fromInfo && fromInfo[0] === "confusion" || <-- confusion check

            const hitEvents = [];

            currMajorEvent.subEventIndexes = {};

            for(let j = currMajorEvent.subEvents.length - 1; j >= 0; j--){

              if(currMajorEvent.subEvents[j].slot === lineParts[1].substring(0, 3) || currMajorEvent.subEvents[j].slot === currMajorEvent.sourcePos && currMajorEvent.subEvents[j].name != "-anim"){
                hitEvents.push(currMajorEvent.subEvents[j]);
                currMajorEvent.subEvents.splice(j, 1);
              } else {

                if(!(currMajorEvent.subEvents[j].name in currMajorEvent.subEventIndexes)){
                  currMajorEvent.subEventIndexes[currMajorEvent.subEvents[j].name] = [];
                }

              }

            }

            for(let j = 0; j < currMajorEvent.subEvents.length; j++){
              currMajorEvent.subEventIndexes[currMajorEvent.subEvents[j].name].push(j);
            }

            if(output.potentialIllusionMons[player]) {//a damaging hit will reveal if the current pkmn is under an illusion or not

              let isIllusion = false;

              for(let j = index + 1; j < turnLines.length; j++){

                if(turnLines[j] === ""){
                  break;
                }

                if(turnLines[j].startsWith(`-end|${sourcePos}:`) && turnLines[j].endsWith("|Illusion")){
                  isIllusion = true;
                  sourcePkmn.definitelyReal = true;
                  break;
                }

              }

              if(!isIllusion){//go back until this pokemon was switched in and update moves used by this pokemon
                setIllusionStatus(output, currTeams, player, sourcePos, sourceIndex, sourcePkmn, i, false, output.potentialIllusionMons); //if it is an illusion, this will be run a bit later

                if(sourcePkmn.flags.artificialItem === "maybe") {
                  delete sourcePkmn.flags.artificialItem;
                  delete currMajorEvent.teams[player].pokemon[sourceIndex].flags.artificialItem;
                }

              }

            }

            currMajorEvent.hits.push(new Hit(currMajorEvent.hits.length, sourcePkmn.clone(), sourcePos, prevHpVal, sourcePkmn.currHpbarNumerator, currField.clone(), cloneTeams(currTeams), hitEvents));

          } else {

            if(fromInfo && fromInfo[fromInfo.length - 1] === "psn" && sourcePkmn.status === "tox"){
              sourcePkmn.toxicCounter += 1;
            }

            else if(fromInfo && fromInfo[fromInfo.length - 1] === "Stealth Rock"){ //stealth rocks can help determine illusion status
              let tempRatio = (prevHpVal - sourcePkmn.currHpbarNumerator) / output.hpbarDenominator;
              if((tempRatio < 0.1 || tempRatio > 0.15) && !(output.tier.endsWith("Almost Any Ability") || output.tier.includes("Hackmons") || output.tier.includes("Custom"))){ //resistance or weakness to stealth rocks means it isn't zoroark/zorua
                setIllusionStatus(output, currTeams, player, sourcePos, sourceIndex, sourcePkmn, i, false, output.potentialIllusionMons);
              }

            }

            assignmentLocation.subEvents.push(new HealthEvent(lineParts[0], lineParts.slice(3), sourcePos, sourcePkmn.clone(), prevHpVal, sourcePkmn.currHpbarNumerator));
            updateEventIndexes(assignmentLocation, assignmentLocation.subEvents[assignmentLocation.subEvents.length - 1]);

          }
          break;

        case "-boost":
        case "-unboost":
          sourcePkmn.boosts[lineParts[2]] += (lineParts[0].startsWith("-u") ? -1 : 1) * Number(lineParts[3]);
          appendMinorEvent(assignmentLocation, sourcePos, sourcePkmn, targetPos, targetPkmn, lineParts);
        break;

        case "-setboost":
          sourcePkmn.boosts[lineParts[2]] = Number(lineParts[3]);
        break;

        case "-swapboost":
          const statTypes = lineParts[3].split(" ");

          for(let j = 0; j < statTypes.length; j++){
            let tempBoost = sourcePkmn.boosts[statTypes[j]];
            sourcePkmn.boosts[statTypes[j]] = targetPkmn.boosts[statTypes[j]];
            targetPkmn.boosts[statTypes[j]] = tempBoost;
          }

        break;

        case "-clearboost":
          sourcePkmn.boosts = {...output.constantTeams[player].pokemon[currSlots[sourcePos]].boosts};
          appendMinorEvent(currMajorEvent, sourcePos, sourcePkmn, targetPos, targetPkmn, lineParts);
        break;

        case "-clearallboost":

          for(let pos in currSlots){
            const tmpPlayer = pos.substring(0, 2);
            currTeams[tmpPlayer].pokemon[currSlots[pos]].boosts = {...output.constantTeams[tmpPlayer].pokemon[currSlots[pos]].boosts}
          }

          appendMinorEvent(currMajorEvent, sourcePos, sourcePkmn, targetPos, targetPkmn, lineParts);
        break;

        case "-copyboost":
          sourcePkmn.boosts = {...targetPkmn.boosts};
          appendMinorEvent(currMajorEvent, sourcePos, sourcePkmn, targetPos, targetPkmn, lineParts);
        break;

        case "-clearpositiveboost":

          for(let boost in sourcePkmn.boosts){

            if(sourcePkmn.boosts[boost] > 0){
              sourcePkmn.boosts[boost] = 0;
            }

          }

          appendMinorEvent(currMajorEvent, sourcePos, sourcePkmn, targetPos, targetPkmn, lineParts);
        break;

        case "-clearnegativeboost":

          for(let boost in sourcePkmn.boosts){

            if(sourcePkmn.boosts[boost] < 0){
              sourcePkmn.boosts[boost] = 0;
            }

          }

          appendMinorEvent(currMajorEvent, sourcePos, sourcePkmn, targetPos, targetPkmn, lineParts);
        break;

        case "-invertboost":

          for(let stat in sourcePkmn.boosts){
            sourcePkmn.boosts[stat] *= -1;
          }

          appendMinorEvent(currMajorEvent, sourcePos, sourcePkmn, targetPos, targetPkmn, lineParts);
        break;

        case "-status": //todo, figure out how to handle edge cases where sourcePkmn is no longer on the field
          sourcePkmn.status = lineParts[2];
          appendMinorEvent(currMajorEvent, sourcePos, sourcePkmn, targetPos, targetPkmn, lineParts);
        break;

        case "-curestatus":
          if(sourcePkmn){
            sourcePkmn.status = "";
          } else {

            let foundTarget = false;

            for(let j = 0; j < sourceTeam.pokemon.length; j++){

              if(sourceTeam.pokemon[j].nickname === lineParts[1].substring(4) && sourceTeam.pokemon[j].status === lineParts[2]){
                foundTarget = true;
                sourceTeam.pokemon[j].status = "";
              } else {
                //this pokemon has the illusion ability
              }

            }

          }

          appendMinorEvent(currMajorEvent, sourcePos, sourcePkmn, targetPos, targetPkmn, lineParts);
        break;

        case "-item":
        case "-enditem":
          sourcePkmn.item = lineParts[0] == "-item" ? lineParts[2] : "";

          if(lineParts[lineParts.length - 1].endsWith("Trick") || lineParts[lineParts.length - 1].endsWith("Switcheroo")){
              const originalPkmnPos = currMajorEvent.sourcePos === sourcePos ? currMajorEvent.targetPositions[0] : currMajorEvent.sourcePos;
              const originalPlayer = originalPkmnPos.substring(0, 2);
              const originalPkmn = currTeams[originalPlayer].pokemon[currSlots[originalPkmnPos]];

              if(!("artificialItem" in originalPkmn.flags)){
                output.constantTeams[originalPlayer].pokemon[currSlots[originalPkmnPos]].item = sourcePkmn.item;
                originalPkmn.flags.artificialItem = true;
              }

          } else {

            if(lineParts[0] === "-item" && lineParts[lineParts.length - 1] != "[identify]"){
              sourcePkmn.flags.artificialItem = true;
            }

            if(!("artificialItem" in sourcePkmn.flags)){

              output.constantTeams[player].pokemon[sourceIndex].item = lineParts[2];

              if(sourcePkmn.item === ""){
                sourcePkmn.flags.artificialItem = true;
              }

            }

          }

          if(currMajorEvent.name === "move" && currMajorEvent.hits.length){

            for(let j = 0; j < currMajorEvent.hits.length; j++){ //do this in case a multi-target knock-off like move ever exists

              if(currMajorEvent.hits[j].defender.originalTeamIndex == sourcePkmn.originalTeamIndex && currMajorEvent.hits[j].defender.originalPlayer == sourcePkmn.originalPlayer){
                currMajorEvent.hits[j].defender.item = lineParts[2];
              }

            }
          }

          appendMinorEvent(currMajorEvent, sourcePos, sourcePkmn, targetPos, targetPkmn, lineParts);
        break;

        case "-end":

          if(lineParts[2].endsWith("Future Sight") || lineParts[2].endsWith("Doom Desire")){ //find the future sight/doom desire that initiated this
            let associatedEvent = null;
            const nSlots = {...currSlots};
            const nTeams = cloneTeams(currTeams);
            for(let j = 0; j < output.turns[i - 2].events.length; j++){
              const event = output.turns[i - 2].events[j];

              if(event.name === "move" && event.move.name === lineParts[2].substring(6) && event.targetPositions[0] === sourcePos){
                associatedEvent = event;
                break;
              }

            }

            const tempIndex = associatedEvent.slots[associatedEvent.sourcePos];
            const tempPkmn = currTeams[associatedEvent.sourcePos.substring(0, 2)].pokemon[tempIndex];
            if(output.gen < 5){ //future sight uses the stats of the attacker during the initatiation turn
              currTurn.events.push(new MoveEvent(associatedEvent.field, nSlots, associatedEvent.sourcePos, associatedEvent.source, nTeams, tempPkmn.replayMoves[associatedEvent.move.name], associatedEvent.targetPositions, associatedEvent.cause));
            } else {
              currTurn.events.push(new MoveEvent(currField.clone(), nSlots, associatedEvent.sourcePos, tempPkmn.clone(), nTeams, tempPkmn.replayMoves[associatedEvent.move.name], associatedEvent.targetPositions, associatedEvent.cause));
            }

            currMajorEvent = currTurn.events[currTurn.events.length - 1];
            updateEventIndexes(currTurn, currMajorEvent);

          }

          else if (lineParts[2] === "Illusion"){ //set moves properly, etc.
            output.constantTeams[player].pokemon[sourceIndex].ability = "Illusion";
            setIllusionStatus(output, currTeams, player, sourcePos, sourceIndex, sourcePkmn, i, true, output.potentialIllusionMons); //if it is an illusion, this will be run a bit later
            appendMinorEvent(currMajorEvent, sourcePos, sourcePkmn, targetPos, targetPkmn, lineParts);
            currMajorEvent = currTurn.events[currTurn.events.length - 2]; //the illusion major event disrupts other major events
          }

          else if(lineParts[2] === "ability: Neutralizing Gas") {//end the ability neutering effects of neutralizing gas

            delete currField.fieldConditions["Neutralizing Gas"];

            for(let slot in currSlots) { //set all pokemon that aren't the current one to have an "artificial ability" for calculation purposes

              if(slot === sourcePos) {
                continue;
              }

              const chgPkmn = currTeams[slot.substring(0, 2)].pokemon[currSlots[slot]];

              if("artificialAbility" in chgPkmn.flags) {

                if(chgPkmn.flags.artificialAbility === "neutralizing_gas_temp") {
                  delete chgPkmn.flags.artificialAbility;
                } else {
                  chgPkmn.ability = chgPkmn.flags.artificialAbility;
                  chgPkmn.flags.artificialAbility = true;
                }

              }

            }

          } else {

            let statusName = lineParts[2];

            if(statusName[4] === ":"){
              statusName = statusName.substring(6);
            }

            appendMinorEvent(currMajorEvent, sourcePos, sourcePkmn, targetPos, targetPkmn, lineParts);

            if(statusName === "Substitute") { //substitutes get handled differently

              const hitEvents = [];

              currMajorEvent.subEventIndexes = {};

              for(let j = currMajorEvent.subEvents.length - 1; j >= 0; j--){

                if(currMajorEvent.subEvents[j].slot === lineParts[1].substring(0, 3) || currMajorEvent.subEvents[j].slot === currMajorEvent.sourcePos && currMajorEvent.subEvents[j].name != "-anim"){
                  hitEvents.push(currMajorEvent.subEvents[j]);
                  currMajorEvent.subEvents.splice(j, 1);
                } else {

                  if(!(currMajorEvent.subEvents[j].name in currMajorEvent.subEventIndexes)){
                    currMajorEvent.subEventIndexes[currMajorEvent.subEvents[j].name] = [];
                  }

                }

              }

              for(let j = 0; j < currMajorEvent.subEvents.length; j++){
                currMajorEvent.subEventIndexes[currMajorEvent.subEvents[j].name].push(j);
              }

              currMajorEvent.hits.push(new Hit(currMajorEvent.hits.length, sourcePkmn.clone(), sourcePos, sourcePkmn.currHpbarNumerator, sourcePkmn.currHpbarNumerator, currField.clone(), cloneTeams(currTeams), hitEvents));

            }

            else if (statusName === "Dynamax") {
              output.constantTeams[sourcePkmn.originalPlayer].pokemon[sourcePkmn.originalTeamIndex].isDynamaxed = false;
            }

            delete sourcePkmn.volatileStatuses[statusName];

          }
        break;

        case "-singleturn":
        case "-singlemove":
        case "-start":
          let statusName = lineParts[2];

          if(statusName[4] === ":"){
            statusName = statusName.substring(6);
          }

          switch(statusName){
            case "typechange":
              let nTypes = null;

              if(lineParts[3].endsWith("Reflect Type")){
                sourcePkmn.types = [...ofPkmn.types];
              } else {
                sourcePkmn.types = lineParts[3].split(", "); //just a guess as to how this would be formatted for multiple types being set this way

                if(currMajorEvent.source && sourcePkmn.originalPlayer === currMajorEvent.source.originalPlayer && sourcePkmn.originalTeamIndex === currMajorEvent.source.originalTeamIndex){
                  currMajorEvent.source.types = [...sourcePkmn.types];
                }
              }

            break;

            case "typeadd":
              if(!sourcePkmn.types.includes(lineParts[3])){
                sourcePkmn.types.push(lineParts[3]);
              }

            default:
              sourcePkmn.volatileStatuses[statusName] = new VolatileStatus(lineParts[0] === "-singleturn" || lineParts[0] === "-singlemove", statusName);
            break;
          }

          if(statusName === "Dyanamax") {
            output.constantTeams[sourcePkmn.originalPlayer].pokemon[sourcePkmn.originalTeamIndex].isDynamaxed = true;
          }

          appendMinorEvent(currMajorEvent, sourcePos, sourcePkmn, targetPos, targetPkmn, lineParts);
        break;

        case "-sidestart":
        case "-sideend":
          let element = lineParts[2];

          if(element[4] === ":"){
            element = element.substring(6);
          }

          if(element in currField.fieldSides[player]){

            if(lineParts[0] === "-sidestart"){
              currField.fieldSides[player][element] += 1;
            } else {
              delete currField.fieldSides[player][element];
            }

          } else {
            currField.fieldSides[player][element] = 1;
          }

          appendMinorEvent(currMajorEvent, sourcePos, sourcePkmn, targetPos, targetPkmn, lineParts);

        break;

        case "-immune":
        case "-fail":

          if(currMajorEvent.name === "move") {
            currMajorEvent.source.currSessionMoves[currMajorEvent.source.currSessionMoves.length - 1] = "fail";
            currMajorEvent.move.timesUsedWithMetronome = 0;
          }

        break;

        case "-fieldstart":
        case "-fieldactivate":
          let fieldType = "other";
          var fieldElement = lineParts[1].split(": ")[1];

          if(fieldElement.endsWith("Terrain")){

            if(currField.terrain != null){
              delete currField.fieldConditions[currField.terrain];
            }

            fieldType = "terrain";
            currField.terrain = fieldElement.split(" ")[0];
          }

          else if(lineParts[0] === "-fieldactivate"){
            fieldType = "temporary";
          }

          currField.fieldConditions[fieldElement] = new FieldCondition(fieldType);

          appendMinorEvent(currMajorEvent, sourcePos, sourcePkmn, targetPos, targetPkmn, lineParts);
        break;

        case "-fieldend":
          const fieldInfo = lineParts[1].split(": ");
          fieldElement = fieldInfo.length > 1 ? fieldInfo[1] : fieldInfo[0];

          if(fieldElement.endsWith("Terrain")){
            currField.terrain = null;
          }

          delete currField.fieldConditions[fieldElement];
          appendMinorEvent(currMajorEvent, sourcePos, sourcePkmn, targetPos, targetPkmn, lineParts);
        break;

        case "-weather":

          if(lineParts[2] != "upkeep"){

            if(lineParts[1] === "none"){
              delete currField.fieldConditions[currField.weather];
              currField.weather = "";
            } else {
              let weather = "";

              switch(lineParts[1]){

                case "RainDance":
                  weather = "Rain";
                break;

                case "Sandstorm":
                  weather = "Sand";
                break;

                case "SunnyDay":
                  weather = "Sun";
                break;

                case "Hail":
                  weather = "Hail";
                break;

                case "DesolateLand":
                  weather = "Harsh Sunshine";
                break;

                case "PrimordialSea":
                  weather = "Heavy Rain";
                break;

                case "DeltaStream":
                  weather = "Strong Winds";
                break;

                default:
                  weather = lineParts[1]; //who knows what the weather is, but leave in some remark about it
                break;
              }

              currField.weather = weather;
              currField.fieldConditions[weather] = new FieldCondition("weather");

            }

          }
          appendMinorEvent(currMajorEvent, sourcePos, sourcePkmn, targetPos, targetPkmn, lineParts);

        break;

        case "-endability":
        case "-ability":

          if(lineParts.length < 3){ //there is no indication of what its original ability was
            sourcePkmn.ability = "suppressed";
            sourcePkmn.flags.artificialAbility = true;
            break;
          }

          switch(lineParts[2]) { //events based on specific abilities

            case "Aura Break":
              currField.isAuraBreak = true;
            break;

            case "Dark Aura":
              currField.isDarkAura = true;
            break;

            case "Fairy Aura":
              currField.isFairyAura = true;
            break;

            case "Neutralizing Gas":
              currField.fieldConditions["Neutralizing Gas"] = new FieldCondition("other");
              currField.isAuraBreak = false;
              currField.isDarkAura = false;
              currField.isFairyAura = false;

              for(let slot in currSlots) { //set all pokemon that aren't the current one to have an "artificial ability" for calculation purposes

                if(slot === sourcePos) {
                  continue;
                }

                const chgPkmn = currTeams[slot.substring(0, 2)].pokemon[currSlots[slot]];

                if(chgPkmn.ability in unsuppressableAbilities) {
                  continue;
                }

                if("artificialAbility" in chgPkmn.flags) {
                  chgPkmn.flags.artificialAbility = chgPkmn.ability;
                } else {
                  chgPkmn.flags.artificialAbility = "neutralizing_gas_temp";
                }

                chgPkmn.ability = "Illuminate";

              }

            break;

          }

          if(lineParts[lineParts.length - 1].startsWith("[of]") && lineParts[lineParts.length - 2].startsWith("[from] ability")){ //this ability is actually from the of pokemon
            ofPkmn.ability = lineParts[2];

            if(!("artificialAbility" in ofPkmn.flags)){
              output.constantTeams["tempPlayer" in ofPkmn.flags ? ofPkmn.flags.tempPlayer : ofPlayer].pokemon["tempPlayer" in ofPkmn.flags ? ofPkmn.flags.tempTeamIndex : ofIndex].ability = lineParts[2];
            }
            sourcePkmn.flags.artificialAbility = true;
            //ofPkmn.flags.artificialAbility = true;
          }

          else if(lineParts[0] != "-endability" && lineParts[lineParts.length - 1].startsWith("[from] move") || sourcePkmn.ability === "suppressed"){
            sourcePkmn.flags.artificialAbility = true;
          }

          else if(!("artificialAbility" in sourcePkmn.flags)){ //only set the base ability, not stuff from things like worry seed
            output.constantTeams["tempPlayer" in sourcePkmn.flags ? sourcePkmn.flags.tempPlayer : player].pokemon["tempPlayer" in sourcePkmn.flags ? sourcePkmn.flags.tempTeamIndex : sourceIndex].ability = lineParts[2];
          }

          sourcePkmn.ability = lineParts[0] === "-ability" ? lineParts[2] : "suppressed";

          appendMinorEvent(currMajorEvent, sourcePos, sourcePkmn, targetPos, targetPkmn, lineParts);
        break;

        case "-activate":

          assignmentLocation = currMajorEvent;
          const playerConsideringTransform = "tempPlayer" in sourcePkmn.flags ? sourcePkmn.flags.tempPlayer : player;
          const teamIndexConsideringTransform = "tempPlayer" in sourcePkmn.flags ? sourcePkmn.flags.tempTeamIndex : sourceIndex;

          if(lineParts[2].startsWith("ability")){
            let activatedAbility = lineParts[2].substring(8).trim();
            sourcePkmn.ability = activatedAbility;

            if(!("artificialAbility" in sourcePkmn.flags)){
              output.constantTeams[playerConsideringTransform].pokemon[teamIndexConsideringTransform].ability = activatedAbility;
            }

            if(activatedAbility === "Quick Draw") {
              sourcePkmn.volatileStatuses["Quick"] = new VolatileStatus(true, "Quick");
            }

          }

          else if(lineParts[2].startsWith("item")){
            let itemName = lineParts[2].substring(6);
            let setItem = true;

            if(itemName.endsWith("Berry")){
              setItem = false;
            }

            if(itemName === "Quick Claw" || itemName === "Custap Berry"){
              sourcePkmn.volatileStatuses["Quick"] = new VolatileStatus(true, "Quick");
            }

            if(setItem){
              sourcePkmn.item = itemName;

              if(!("artificialItem" in sourcePkmn.flags)){
                output.constantTeams[player].pokemon[sourceIndex].item = lineParts[2].substring(6);
              }

            }

          }

          else if(lineParts[2] === "confusion"){ //make a new confused hit event
            const confusedMove = new Move(output.gen, "Pound");
            confusedMove.type = "???";
            confusedMove.originalName = confusedMove.name = "Confused";
            const affectedSlots = [sourcePos];
            currTurn.events.push(new MoveEvent(currField.clone(), {...currSlots}, sourcePos, sourcePkmn.clone(), cloneTeams(currTeams), confusedMove, affectedSlots, "confused"));
            currMajorEvent = currTurn.events[currTurn.events.length - 1];
            updateEventIndexes(currTurn, currMajorEvent);
            sourcePkmn.currSessionMoves.push("confused");
            currTurn.pokemonActionsDict[sourcePkmn.originalPlayer + "," + sourcePkmn.originalTeamIndex] = currTurn.events.length - 1;
            break;
          }

          else if(lineParts[2] === "Substitute" && lineParts[3] === "[damage]") { //activating a substitute is another way to "hit" a pokemon

            const hitEvents = [];

            currMajorEvent.subEventIndexes = {};

            for(let j = currMajorEvent.subEvents.length - 1; j >= 0; j--){

              if(currMajorEvent.subEvents[j].slot === lineParts[1].substring(0, 3) || currMajorEvent.subEvents[j].slot === currMajorEvent.sourcePos && currMajorEvent.subEvents[j].name != "-anim"){
                hitEvents.push(currMajorEvent.subEvents[j]);
                currMajorEvent.subEvents.splice(j, 1);
              } else {

                if(!(currMajorEvent.subEvents[j].name in currMajorEvent.subEventIndexes)){
                  currMajorEvent.subEventIndexes[currMajorEvent.subEvents[j].name] = [];
                }

              }

            }

            for(let j = 0; j < currMajorEvent.subEvents.length; j++){
              currMajorEvent.subEventIndexes[currMajorEvent.subEvents[j].name].push(j);
            }

            currMajorEvent.hits.push(new Hit(currMajorEvent.hits.length, sourcePkmn.clone(), sourcePos, sourcePkmn.currHpbarNumerator, sourcePkmn.currHpbarNumerator, currField.clone(), cloneTeams(currTeams), hitEvents));
            assignmentLocation = currMajorEvent.hits[currMajorEvent.hits.length - 1];

          }

          else if(lineParts[2].startsWith("move")) {

            if(lineParts[2].endsWith("Protect") || lineParts[2].endsWith("Detect") || lineParts[2].endsWith("Shield") || lineParts[2].endsWith("Guard") || lineParts[2].endsWith("Mat Block")){
              currMajorEvent.source.currSessionMoves.push("fail");
            }

            else if(lineParts[2].endsWith("Guard Split")) {
              sourcePkmn.volatileStatuses["Guard Split"] = new VolatileStatus(false, "Guard Split");
              ofPkmn.volatileStatuses["Guard Split"] = new VolatileStatus(false, "Guard Split");
            }

            else if(lineParts[2].endsWith("Power Split")) {
              sourcePkmn.volatileStatuses["Power Split"] = new VolatileStatus(false, "Power Split");
              ofPkmn.volatileStatuses["Power Split"] = new VolatileStatus(false, "Power Split");
            }

          }

          else if(lineParts[2].endsWith("Skill Swap")){ //special case for skill swap -_-
            sourcePkmn.ability = lineParts[3];
            ofPkmn.ability = lineParts[4];

            if(!("artificialAbility" in sourcePkmn.flags)){
              output.constantTeams[playerConsideringTransform].pokemon[teamIndexConsideringTransform].ability = lineParts[4];
            }

            if(!("artificialAbility" in ofPkmn.flags)){
              output.constantTeams["tempPlayer" in ofPkmn.flags ? ofPkmn.flags.tempPlayer : ofPlayer].pokemon["tempPlayer" in ofPkmn.flags ? ofPkmn.flags.tempTeamIndex : ofIndex].ability = lineParts[3];
            }

            sourcePkmn.flags.artificialAbility = true;
            ofPkmn.flags.artificialAbility = true;
          }

          else if(lineParts[2].endsWith("Poltergeist")){
            sourcePkmn.item = lineParts[3];
            if(!("artificialItem") in sourcePkmn.flags){
              output.constantTeams[player].pokemon[sourceIndex].item = lineParts[3];
            }
          }

          if(currMajorEvent.name === "move" && currMajorEvent.hits.length){

            if(lineParts.length == 3){
              assigmentLocation = currMajorEvent.hits[currMajorEvent.hits.length - 1];
            }

          }

          assignmentLocation.subEvents.push(new PokemonMinorEvent(lineParts[0], lineParts.slice(2), sourcePos, sourcePkmn.clone()));
          updateEventIndexes(assignmentLocation, assignmentLocation.subEvents[assignmentLocation.subEvents.length - 1]);

        break;

        case "-anim":

          if(currMajorEvent.name === "move"){

            if(currMajorEvent.targetPositions[0] === currMajorEvent.sourcePos){
              currMajorEvent.targetPositions = [];
            }

            currMajorEvent.targetPositions.push(targetPos);

          }

          appendMinorEvent(currMajorEvent, sourcePos, sourcePkmn, targetPos, targetPkmn, lineParts);
        break;

        case "-transform":
          const tempPkmn = sourcePkmn;
          sourcePkmn = targetPkmn.clone();
          sourcePkmn.definitelyReal = true;
          sourcePkmn.status = tempPkmn.status;
          sourcePkmn.gender = tempPkmn.gender;
          sourcePkmn.level = tempPkmn.level;
          sourcePkmn.nickname = nickname;
          sourcePkmn.originalCurHP = tempPkmn.originalCurHP;
          sourcePkmn.currHpbarNumerator = tempPkmn.currHpbarNumerator;
          sourcePkmn.hpbarDenominator = tempPkmn.hpbarDenominator;
          sourcePkmn.volatileStatuses = tempPkmn.volatileStatuses;
          sourcePkmn.flags.tempTeamIndex = targetPkmn.originalTeamIndex;
          sourcePkmn.flags.tempPlayer = targetPkmn.originalPlayer;
          sourcePkmn.originalTeamIndex = tempPkmn.originalTeamIndex;
          sourcePkmn.originalPlayer = tempPkmn.originalPlayer;
          sourcePkmn.species.baseStats.hp = tempPkmn.species.baseStats.hp;
          sourcePkmn.currSessionMoves = [...tempPkmn.currSessionMoves];
          currTeams[player].pokemon[sourceIndex] = sourcePkmn;
          appendMinorEvent(currMajorEvent, sourcePos, tempPkmn, targetPos, targetPkmn, lineParts);

        break;

        case "-hint":

          if(lineParts[1].endsWith("Shell Side Arm") && currMajorEvent.move){ //set move's category

            if(lineParts[1].startsWith("Physical")){
              currMajorEvent.move.category = currMajorEvent.move.defensiveCategory = "Physical";
            } else {
              currMajorEvent.move.category = currMajorEvent.move.defensiveCategory = "Special";
            }

          }

        break;

        case "-mega":
        case "-burst":
          sourcePkmn.item = lineParts[3];
          output.constantTeams[sourcePkmn.originalPlayer].pokemon[sourcePkmn.originalTeamIndex].item = lineParts[3];
          appendMinorEvent(currMajorEvent, sourcePos, sourcePkmn, targetPos, targetPkmn, lineParts);
        break;

        case "-primal":
          const nextLine = turnLines[index + 1];
          sourcePkmn.item = nextLine.includes("DesolateLand") ? "Red Orb" : "Blue Orb"; //doing it this way can account for pokemon showdown's other metagames
          output.constantTeams[sourcePkmn.originalPlayer].pokemon[sourcePkmn.originalTeamIndex].item = sourcePkmn.item;
          appendMinorEvent(currMajorEvent, sourcePos, sourcePkmn, targetPos, targetPkmn, lineParts);
        break;

        case "win":
          output.winner = lineParts[1];
        break;

        default: //non-specified minor events get handled generically
          appendMinorEvent(currMajorEvent, sourcePos, sourcePkmn, targetPos, targetPkmn, lineParts);
        break;

      }

      let extraData = {};

      if(ofPkmn){
        extraData["ofPkmn"] = ofPkmn.clone();
      }

      if(fromInfo){
        extraData["fromInfo"] = [...fromInfo];
      }

      if(!(assignmentLocation.subEvents[assignmentLocation.subEvents.length - 1])){
        assignmentLocation.extraData = extraData;
      }

      else if(lineParts[0] === assignmentLocation.subEvents[assignmentLocation.subEvents.length - 1].name) {
        assignmentLocation.subEvents[assignmentLocation.subEvents.length - 1].extraData = extraData;
      }


    });

  if(currMajorEvent.name != "transition") { //ensure that the turn ends with a transition event

    currTurn.events.push(new MajorEvent("transition", currField.clone(), {...currSlots}, null, null, cloneTeams(currTeams)));
    currMajorEvent = currTurn.events[currTurn.events.length - 1];
    updateEventIndexes(currTurn, currMajorEvent);

  }

}

function appendMinorEvent(currMajorEvent, sourcePos, sourcePkmn, targetPos, targetPkmn, lineParts){

    if(sourcePkmn != null){

      if(targetPkmn != null){
        currMajorEvent.subEvents.push(new SourceTargetEvent(lineParts[0], lineParts.slice(3), sourcePos, sourcePkmn.clone(), targetPos, targetPkmn.clone()));
      } else {
        currMajorEvent.subEvents.push(new PokemonMinorEvent(lineParts[0], lineParts.slice(2), sourcePos, sourcePkmn.clone()));
      }

    }
    else {
      currMajorEvent.subEvents.push(new MinorEvent(lineParts[0], lineParts.slice(1)));
    }

    updateEventIndexes(currMajorEvent, currMajorEvent.subEvents[currMajorEvent.subEvents.length - 1]);

}

function updateEventIndexes(container, event){

  let indexer = null;
  let eventList = null;

  if("eventIndexes" in container){
    indexer = container.eventIndexes;
    eventList = container.events;
  } else {
    indexer = container.subEventIndexes;
    eventList = container.subEvents;
  }

  if(event.name in indexer){
    indexer[event.name].push(eventList.length - 1);
  } else {
    indexer[event.name] = [eventList.length - 1];
  }

}

function cloneTeams(teams){
  const newTeams = {};
  for(name in teams){
    newTeams[name] = teams[name].clone();
  }
  return newTeams;
}

function setIllusionStatus(replay, currTeams, player, sourcePos, sourceIndex, sourcePkmn, turnIndex, isIllusion, potentialIllusionMons){
  currTeams[player].pokemon[sourceIndex].definitelyReal = true;

  const originalTurnIndex = turnIndex;
  let eventIndex = -1;
  let stop = false;
  let switchinPos = sourcePos;
  let switchinEvent = null;

  while(turnIndex >= 0){//first, find out where the pokemon switches in
    eventIndex = replay.turns[turnIndex].events.length - 1;

    while(eventIndex >= 0){
      const loopMajorEvent = replay.turns[turnIndex].events[eventIndex];

      if(loopMajorEvent.name === "swap"){ //change the switch-in pos accordingly

        if(loopMajorEvent.sourcePos === switchinPos){
          switchinPos = loopMajorEvent.prevPos;
        }

        else if(loopMajorEvent.prevPos === switchinPos){
          switchinPos = loopMajorEvent.sourcePos;
        }

      }

      for(let k = 0; k < loopMajorEvent.subEvents.length; k++){

        if(loopMajorEvent.subEvents[k].slot === switchinPos){
          loopMajorEvent.subEvents[k].source.flags.illusionSrcIndex = sourceIndex;
        }

      }

      if(loopMajorEvent.name === "move"){

        for(let k = 0; k < loopMajorEvent.hits.length; k++){

          for(let l = 0; l < loopMajorEvent.hits[k].subEvents.length; l++){

            if(loopMajorEvent.hits[k].subEvents[l].slot === switchinPos){
              loopMajorEvent.hits[k].subEvents[l].source.flags.illusionSrcIndex = sourceIndex;
            }

          }

        }

        if(switchinPos === loopMajorEvent.sourcePos){

          if(!(loopMajorEvent.move.name in replay.constantTeams[player].pokemon[sourceIndex].replayMoves)){
            replay.constantTeams[player].pokemon[sourceIndex].replayMoves[loopMajorEvent.move.name] = new Move(replay.gen, loopMajorEvent.move.name);
          }

          if(!isIllusion) {
            loopMajorEvent.source.definitelyReal = true;

            if(loopMajorEvent.source.flags.artificialItem === "maybe") {
              delete loopMajorEvent.source.flags.artificialItem;
              delete loopMajorEvent.teams[player].pokemon[sourceIndex].flags.artificialItem;
            }

          }

        }

      }

      if(loopMajorEvent.sourcePos === switchinPos){
        loopMajorEvent.source.flags.illusionSrcIndex = sourceIndex;
      }

      if(loopMajorEvent.name === "switch" && loopMajorEvent.sourcePos === switchinPos){
        switchinEvent = loopMajorEvent;
        stop = true;
        break;
      }

      eventIndex--;
    }

    if(stop){
      break;
    }

    turnIndex--;
  }

  if(isIllusion){
    let backSlotIndex = switchinEvent.slots[switchinPos];

    for(let i = turnIndex; i <= originalTurnIndex; i++){ //track down the pokemon in the back slot

      for(let j = 0; j < replay.turns[i].events.length; j++){
        const loopMajorEvent = replay.turns[i].events[j];

        if(loopMajorEvent.name === "switch" && loopMajorEvent.source.originalPlayer === player && loopMajorEvent.source.flags.illusionSrcIndex != sourceIndex){ //if there is only one illusion mon, we know what the new back index is.  otherwise, we have no idea, so just make it -1

          if(loopMajorEvent.switchOut && loopMajorEvent.switchOut.originalTeamIndex == backSlotIndex){
            backSlotIndex = (potentialIllusionMons[player] <= 1) ? loopMajorEvent.source.originalTeamIndex : -1;
          }

          else if(loopMajorEvent.source.originalTeamIndex == backSlotIndex && loopMajorEvent.switchOut){
            backSlotIndex = (potentialIllusionMons[player] <= 1) ? loopMajorEvent.switchOut.originalTeamIndex : -1;
          }

        }

      }

    }

    currTeams[player].backSlotIndex = backSlotIndex;

  }

}
