const healthRatios = {"Volt Absorb": 1/4, "Sitrus Berry": 1/4, "Poison Heal": 1/8, "Grassy Terrain": 1/16, "Leftovers": 1/16, "brn": -1/16, "tox": -1/16, "Life Orb": -1/10, "psn": -1/8, "Rough Skin": -1/8, "Spikes": -1/8, "Stealth Rock": -1/8, "Whirlpool": -1/8, "G-Max Volcalith": -1/6, "Rocky Helmet": -1/6, "Curse": -1/4};
const roundUpHealthRatios = {};
const moveHealthRatios = {"Milk Drink": 1/2, "Recover": 1/2, "Roost": 1/2, "Synthesis": 1/2, "Substitute": -1/4, "Curse": -1/2};
const roundUpMoveRatios = {"Milk Drink": 1, "Recover": 1, "Roost": 1};
const switchInAbilities = {"Cloud Nine": 0, "Drizzle": 0, "Drought": 0, "Electric Surge": 0, "Frisk": 0, "Intimidate": 0, "Neutralizing Gas": 2, "Pressure": 0, "Psychic Surge": 0, "Sand Stream": 0, "Unnerve": 1}; //ability: priority
const typeToBerry = {"Normal": "Chilan Berry", "Fire": "Occa Berry"};

const stealthRockRatios = [1/32, 1/16, 1/8, 1/4, 1/2];
const maxEvVal = 252;

function analyzeReplayLog(replay) {

  for(let i in replay.turns) {
    console.log("turn", i);
    analyzeReplayTurn(replay, replay.turns[i], i);
  }

}

function analyzeReplayTurn(replay, turn, turnIndex) {

  if(replay.gen < 7) {
    healthRatios.brn = -1/8;
  } else {
    healthRatios.brn = -1/16;
  }

  if(!("referenceHits" in replay)) {
    replay.referenceHits = {};
  }

  turn.events.forEach(function(event, eventIndex) {

    let eventPkmn = event.source;
    let eventConstPkmn = event.source ? replay.constantTeams[event.source.originalPlayer].pokemon[event.source.originalTeamIndex] : null;
    let eventPkmnSure = event.source && (event.source.definitelyReal || "illusionSrcIndex" in event.source.flags);
    let fromInfoRefs = {};
    let sourceRef;

    if(eventPkmn && isNaN(eventPkmn.hpbarDenominator)) {
      console.log(turnIndex, eventIndex, "BAD HPBAR DENOM", eventPkmn.name);
    }

    for(let slot in event.slots) {
      fromInfoRefs[slot] = {};
    }

    if(eventPkmn) {
      sourceRef = fromInfoRefs[event.sourcePos];
    }

    if(eventPkmn && !("impossibleItems" in eventConstPkmn)) { //analyzer attributes have not been added yet

      eventConstPkmn.impossibleItems = {};
      eventConstPkmn.impossibleAbilities = {};
      eventConstPkmn.attackHitIndexes = [];
      eventConstPkmn.defendHitIndexes = [];
      eventConstPkmn.statRanges = {};
      eventConstPkmn.altDefensiveRanges = {};
      eventConstPkmn.evs.hp = 0;
      const maxIv = replay.gen <= 2 ? 30 : 31;

      if(eventConstPkmn.hpbarDenominator != replay.hpbarDenominator) {
        eventConstPkmn.hpsPossible[eventConstPkmn.hpbarDenominator] = [eventConstPkmn.hpbarDenominator];
      } else {

        for(let i = 0; i <= maxIv; i++) {
          eventConstPkmn.ivs.hp = i;
          let hpVal = eventConstPkmn.calcStat(eventConstPkmn.gen, "hp");
          eventConstPkmn.hpsPossible[hpVal] = [hpVal];
        }

        for(let i = 0; i <= maxEvVal; i+= 4) {

          eventConstPkmn.evs.hp = i;
          const hpVal = eventConstPkmn.calcStat(eventConstPkmn.gen, "hp");
          eventConstPkmn.hpsPossible[hpVal] = [hpVal];

        }

      }

      eventConstPkmn.evs.hp = 0;

    }

    if(event.name === "switch") { //must handle potential regenerator healing first

      if("lastSwitchIndexes" in eventPkmn.flags) {

        const lastSwitchEvent = replay.turns[eventPkmn.flags.lastSwitchIndexes[0]].events[eventPkmn.flags.lastSwitchIndexes[1]];
        const lastSwitchPkmn = lastSwitchEvent.switchOut;

        if(event.endNumerator != event.startNumerator) {

          [event.startHpsPossible, eventPkmn.hpsPossible] = recalcHpsPossible(eventConstPkmn.hpsPossible, event.startNumerator, event.endNumerator, eventPkmn.hpbarDenominator, event.source.definitelyReal ? 1/3 : null, 1, false, false);
          eventConstPkmn.hpsPossible = eventPkmn.hpsPossible;

          if(!("artificialAbility" in lastSwitchPkmn.flags) && eventPkmn.definitelyReal) {

            if("tempPlayer" in lastSwitchPkmn.flags) {

              replay.constantTeams[lastSwitchPkmn.flags.tempPlayer].pokemon[lastSwitchPkmn.flags.tempTeamIndex].ability = "Regenerator";

            } else {

              eventConstPkmn.ability = "Regenerator";

            }

          }

        }

      }

    }

    else if(event.name === "move") {

      let uniqueMoves = {};

      for(let i in eventPkmn.currSessionMoves) {

        let moveName = eventPkmn.currSessionMoves[i];

        if(!moveName.startsWith("Max ") && !moveName.startsWith("G-Max") && moveName != "fail") {

          uniqueMoves[moveName] = true;

        }

      }

      if(event.move.category === "Status" && event.move.name in eventConstPkmn.replayMoves && !("artificialItem" in eventPkmn.flags)) {
        eventConstPkmn.impossibleItems["Assault Vest"] = true;
      }

      if(Object.keys(uniqueMoves).length > 1 && !("artificialItem" in eventPkmn.flags)) {

        eventConstPkmn.impossibleItems["Choice Band"] = true;
        eventConstPkmn.impossibleItems["Choice Specs"] = true;
        eventConstPkmn.impossibleItems["Choice Scarf"] = true;

      }

      for(let elem in event.field.fieldSides[eventPkmn.originalPlayer]) {

        switch(elem) {

          case "Tailwind":
            event.field.attackerSide.isTailwind = true;
          break;

        }

      }

      event.hits.forEach(function(hit, hitIndex){

        let hitPkmn = hit.defender; //hitPkmn is guaranteed to not be an illusion, unless the pokemon has a sub up
        let hitConstPkmn = replay.constantTeams[hitPkmn.originalPlayer].pokemon[hitPkmn.originalTeamIndex];
        let hitPkmnSure = hitPkmn.definitelyReal || "illusionSrcIndex" in hitPkmn.flags;
        let hitFromInfoRefs = {};

        if(!("impossibleItems" in hitConstPkmn)) { //analyzer attributes have not been added yet

          hitConstPkmn.impossibleItems = {};
          hitConstPkmn.impossibleAbilities = {};
          hitConstPkmn.attackHitIndexes = [];
          hitConstPkmn.defendHitIndexes = [];
          hitConstPkmn.statRanges = {};
          hitConstPkmn.altDefensiveRanges = {};
          hitConstPkmn.evs.hp = 0;
          const maxIv = replay.gen <= 2 ? 30 : 31;

          if(hitConstPkmn.hpbarDenominator != replay.hpbarDenominator) {
            hitConstPkmn.hpsPossible[hitConstPkmn.hpbarDenominator] = [hitConstPkmn.hpbarDenominator];
          } else {

            for(let i = 0; i <= maxIv; i++) {
              hitConstPkmn.ivs.hp = i;
              let hpVal = hitConstPkmn.calcStat(hitConstPkmn.gen, "hp");
              hitConstPkmn.hpsPossible[hpVal] = [hpVal];
            }

            for(let i = 0; i <= maxEvVal; i+= 4) {

              hitConstPkmn.evs.hp = i;
              const hpVal = hitConstPkmn.calcStat(hitConstPkmn.gen, "hp");
              hitConstPkmn.hpsPossible[hpVal] = [hpVal];

            }

          }

          hitConstPkmn.evs.hp = 0;

        }

        for(let elem in hit.field.fieldSides[hitPkmn.originalPlayer]) {

          switch(elem) {

            case "Light Screen":
              hit.field.defenderSide.isLightScreen = true;
            break;

            case "Reflect":
              hit.field.defenderSide.isReflect = true;
            break;
          }

        }

        if("Dynamax" in hitPkmn.volatileStatuses) {
          hitPkmn.isDynamaxed = true;
        }

        if(event.move === "Pursuit" && event.move.priority === 7) {
          hit.field.defenderSide.isSwitching = "out";
        }

        else if(event.move.name === "Grass Knot" || event.move.name === "Low Kick") {

          if(hitPkmn.weightkg < 10) {
            event.move.bp = 20;
          }

          else if(hitPkmn.weightkg < 25) {
            event.move.bp = 40;
          }

          else if(hitPkmn.weightkg < 50) {
            event.move.bp = 60;
          }

          else if(hitPkmn.weightkg < 100) {
            event.move.bp = 80;
          }

          else if(hitPkmn.weightkg < 200) {
            event.move.bp = 100;
          }

          else {
            event.move.bp = 120;
          }

        }

        let hitSub = false;

        if("-activate" in hit.subEventIndexes) {

          for(let i in hit.subEventIndexes["-activate"]) {

            if(hit.subEvents[i].data[0] === "Substitute") {
              hitSub = true;
            }

          }

        }

        else if("-end" in hit.subEventIndexes) {

          for(let i in hit.subEventIndexes["-end"]) {

            if(hit.subEvents[i].data[0] === "Substitute") {
              hitSub = true;
            }

          }

        }

        if(eventPkmnSure && hitPkmnSure && event.move.bp > 0 && !hitSub && !("Guard Split" in hitPkmn.volatileStatuses || "Power Split" in eventPkmn.volatileStatuses)) {
          eventConstPkmn.attackHitIndexes.push([turnIndex, eventIndex, hitIndex]);

          hitConstPkmn.defendHitIndexes.push([turnIndex, eventIndex, hitIndex]);
          replay.referenceHits[turnIndex + "," + eventIndex + "," + hitIndex] = 1;

          if("tempPlayer" in hitPkmn.flags) { //also include the pokemon that the hitPkmn transformed
            replay.constantTeams[hitPkmn.flags.tempPlayer].pokemon[hitPkmn.flags.tempTeamIndex].defendHitIndexes.push([turnIndex, eventIndex, hitIndex]);
          }

        }

        for(let slot in event.slots) {
          hitFromInfoRefs[slot] = {};
        }

        let hitSourceRef = hitFromInfoRefs[hit.defenderPos];

        //set hps

        let dmgVal = null; //null means unknown

        if(hitPkmnSure) {

          if(event.move.named("Seismic Toss", "Night Shade")) {
            dmgVal = -1 * eventPkmn.level;
          }

          else if (event.move.named("Dragon Rage")) {
            dmgVal = -40;
          }

          else if (event.move.named("Sonic Boom")) {
            dmgVal = -20;
          }

        }

        [hit.startHpsPossible, hit.defender.hpsPossible] = recalcHpsPossible(hitConstPkmn.hpsPossible, hit.startNumerator, hit.endNumerator, hit.defender.hpbarDenominator, dmgVal, 1, false, "Dynamax" in hit.defender.volatileStatuses);
        hitConstPkmn.hpsPossible = hit.defender.hpsPossible;

        hit.subEvents.forEach(function(subEvent, subEventIndex){
          const info = handleSubEvent(subEvent, subEventIndex, {replay: replay, turn: turn, event: event, hit: hit});

          if("slot" in subEvent) {
            hitFromInfoRefs[subEvent.slot][info] = subEvent.name;
          }

        });

        if(hitIndex === event.hits.length - 1) { //certain things only reveal themself on the last hit of a move

          if(!("artificialItem" in eventPkmn.flags) && eventPkmnSure) {

            if(eventConstPkmn.item != "Life Orb" &&
            //!("artificialAbility" in eventPkmn.flags) &&
            !("Magic Guard" in eventConstPkmn.speciesPossibleAbilities) &&
            !("Sheer Force" in eventConstPkmn.speciesPossibleAbilities && event.move.secondaries) &&
            !("Klutz" in eventConstPkmn.speciesPossibleAbilities) &&
            !(replay.gen == 4 && hitSub) && !replay.hackedAbilities) { //pokemon is guaranteed to not have life orb

              eventConstPkmn.impossibleItems["Life Orb"] = true;

            }

          }

        }

      });

    }

    event.subEvents.forEach(function(subEvent, subEventIndex){
      const info = handleSubEvent(subEvent, subEventIndex, {replay: replay, turn: turn, event: event});

      if("slot" in subEvent) {
        fromInfoRefs[subEvent.slot][info] = subEvent.name;
      }

    });

    switch(event.name) { //excludes the move case because it needs its info processed to be processed before the loop above

      case "switch":

        //air balloon check
        if(!("artificialItem" in eventPkmn.flags) && !("Klutz" in eventPkmn.speciesPossibleAbilities) && eventPkmn.item != "Air Balloon") {
          eventConstPkmn.impossibleItems["Air Balloon"] = true;
        }

        //do checks for switch-in hazards

        if(sourceRef["Stealth Rock"] === "-damage") {

          setImpossibleAbility(eventConstPkmn, "Magic Guard", replay.hackedAbilities);
          eventConstPkmn.impossibleItems["Heavy-Duty Boots"] = true;

        }

        else if("Stealth Rock" in event.field.fieldSides[eventPkmn.originalPlayer]) { //no stealth rock damage, despite it being on the switch-in's side

          if(!("Magic Guard" in eventConstPkmn.speciesPossibleAbilities) && !replay.hackedAbilities) {
            eventConstPkmn.item = "Heavy-Duty Boots";
            setImpossibleAbility(eventConstPkmn, "Klutz", replay.hackedAbilities);
          }

          else if(replay.gen <= 7) {
            eventConstPkmn.ability = "Magic Guard";
          }

        }

        if(!(eventConstPkmn.ability in switchInAbilities) && !("Unnerve" in  eventConstPkmn.impossibleAbilities)) { //need to check if switch in abilities could have been triggered

          let nextNonSwitchEvent = false;

          for(let i = eventIndex + 1; i < turn.events.length; i++) {

            if(turn.events[i].name != "switch") {
              nextNonSwitchEvent = turn.events[i];
              break;
            }

          }

          if(nextNonSwitchEvent) {

            let neutralizingGasExists = false;

            for(let slot in nextNonSwitchEvent.slots) {

              if(nextNonSwitchEvent.teams[slot.substring(0, 2)].pokemon[nextNonSwitchEvent.slots[slot]].ability === "Neutralizing Gas") {
                neutralizingGasExists = true;
                break;
              }

            }

            for(let ability in switchInAbilities) {

              if(!neutralizingGasExists || ability === "Neutralizing Gas") {

                setImpossibleAbility(eventConstPkmn, ability, replay.hackedAbilities);

              }

            }

          }

        }

      break;

      case "faint":

      break;

    }


  });

}

function handleSubEvent(subEvent, subEventIndex, containers){
  let previousLevelContainer = "hit" in containers ? containers.hit : containers.event;

  switch(subEvent.name){
    case "-damage":
    case "-heal":
    case "-sethp":

      let sourcePkmn = subEvent.source;
      let constPkmn = containers.replay.constantTeams[subEvent.source.originalPlayer].pokemon[subEvent.source.originalTeamIndex];

      if(subEventIndex > 0 && previousLevelContainer.subEvents[subEventIndex - 1].data[0] === "Dynamax" && sourcePkmn.hpbarDenominator === containers.replay.hpbarDenominator) { //dynamax change checks

        subEvent.startHpsPossible = cloneHpsPossible(constPkmn.hpsPossible);
        constPkmn.hpsPossible = {};

        if(previousLevelContainer.subEvents[subEventIndex - 1].name === "-end") { //get possible hp values from the end of dynamax

          for(let hp in subEvent.startHpsPossible) {

            const hpVals = subEvent.startHpsPossible[hp];
            const nHps = [];

            for(let i = hpVals.length - 1; i >= 0; i--) {
              let nHpVal = Math.round(hpVals[i] / 2);
              let nNumerator = Math.ceil(containers.replay.hpbarDenominator * nHpVal / hp);

              if(nNumerator == containers.replay.hpbarDenominator && subEvent.endNumerator == containers.replay.hpbarDenominator - 1) {
                nNumerator -= 1;
              }

              if(nNumerator == subEvent.endNumerator && !nHps.includes(nHpVal)) {
                nHps.unshift(nHpVal);
              }

            }

            if(nHps.length > 0) {
              constPkmn.hpsPossible[hp] = nHps;
            }

          }

        } else { //double hps for the start of dynamax

          for(let hp in subEvent.startHpsPossible) {
            constPkmn.hpsPossible[hp] = subEvent.startHpsPossible[hp].map(x => x * 2);
          }

        }

        console.log(JSON.parse(JSON.stringify(constPkmn.hpsPossible)), constPkmn.name, containers);

        subEvent.source.hpsPossible = cloneHpsPossible(constPkmn.hpsPossible);

      }

      else if(previousLevelContainer.name === "move" && previousLevelContainer.move.name in moveHealthRatios){

          [subEvent.startHpsPossible, sourcePkmn.hpsPossible] = recalcHpsPossible(constPkmn.hpsPossible, subEvent.startNumerator, subEvent.endNumerator, sourcePkmn.hpbarDenominator, moveHealthRatios[previousLevelContainer.move.name], 1, previousLevelContainer.move.name in roundUpMoveRatios);
          constPkmn.hpsPossible = sourcePkmn.hpsPossible;

      }

      else if("fromInfo" in subEvent.extraData &&
      subEvent.extraData.fromInfo[subEvent.extraData.fromInfo.length - 1] in healthRatios) {
        const cause = subEvent.extraData.fromInfo[subEvent.extraData.fromInfo.length - 1];
        let ratio = healthRatios[cause];
        let ratioCount = 1;

        if(cause === "Stealth Rock"){

          for(let i = 0; i < sourcePkmn.types.length; i++){
            ratio *= getMoveEffectiveness(new Generation(containers.replay.gen), new Move(8, "Rock Slide"), sourcePkmn.types[i], false, false);
          }

        }

        else if(subEvent.source.status === "tox" && cause === "psn"){
          ratio = healthRatios["tox"];
          ratioCount = subEvent.source.toxicCounter;
        }

        else if(cause === "Spikes"){

          let spikeNum = previousLevelContainer.field.fieldSides[subEvent.slot.substring(0, 2)]["Spikes"];

          if(spikeNum == 1){
            ratio = -1/8;
          }

          else if(spikeNum == 2){
            ratio = -1/6;
          }

          else if(spikeNum == 3){
            ratio = -1/4;
          }

        }

        if(subEvent.source.definitelyReal != true && subEvent.source.flags.illusionSrcIndex != subEvent.source.originalTeamIndex){
          ratio = null; //since the pokemon's true identity is unknown, don't try to calculate hp info
        }

        //console.log(containers.event);
        //console.log(1, recalcHpsPossible(constPkmn.hpsPossible, subEvent.startNumerator, subEvent.endNumerator, containers.replay.hpbarDenominator, ratio, ratioCount), subEvent.startNumerator, subEvent.endNumerator);
        //console.log(2, recalcHpsPossible(containers.replay.constantTeams[subEvent.source.originalPlayer].pokemon[subEvent.source.originalTeamIndex].hpsPossible, subEvent.startNumerator, subEvent.endNumerator, containers.replay.hpbarDenominator, null));

        let nPossibilities = recalcHpsPossible(constPkmn.hpsPossible, subEvent.startNumerator, subEvent.endNumerator, constPkmn.hpbarDenominator, ratio, ratioCount, cause in roundUpHealthRatios, "Dynamax" in subEvent.source.volatileStatuses);

        constPkmn.hpsPossible = nPossibilities[1];
        sourcePkmn.hpsPossible = nPossibilities[1];
        subEvent.startHpsPossible = nPossibilities[0];

      }

      else {

        [subEvent.startHpsPossible, sourcePkmn.hpsPossible] = recalcHpsPossible(constPkmn.hpsPossible, subEvent.startNumerator, subEvent.endNumerator, sourcePkmn.hpbarDenominator, null, 1, false, "Dynamax" in subEvent.source.volatileStatuses);
        constPkmn.hpsPossible = sourcePkmn.hpsPossible;

      }


    break;
  }

  if("fromInfo" in subEvent.extraData) { //return fromInfo, which is necessary for figuring stuff out
    return subEvent.extraData.fromInfo[subEvent.extraData.fromInfo.length - 1];
  } else {
    return "";
  }

}

function recalcHpsPossible(hpsPossible, startNumerator, endNumerator, replayDenominator, factor, factorCount, roundUp, isDynamaxed){
  const hpsPossibleClone = cloneHpsPossible(hpsPossible);
  const oldHpsPossibleClone = cloneHpsPossible(hpsPossible);

  if(replayDenominator != 48 && replayDenominator != 100) { //exact hp is known, so just return that instead of wasting time
    let oldOutput = {};
    let output = {};

    if(isDynamaxed) {
      replayDenominator /= 2;
    }

    oldOutput[replayDenominator] = [startNumerator];
    output[replayDenominator] = [endNumerator];
    return [oldOutput, output];
  }

  if(factor === null){ //do calculation for something like getting hit by a move like pound

    for(let hpStat in hpsPossible){
      let realHpStat = Number(hpStat);
      hpsPossibleClone[hpStat] = [];

      if(isDynamaxed) {
        realHpStat *= 2;
      }

      if(endNumerator < replayDenominator && endNumerator > 0){

        for(let i = Math.floor(realHpStat * (endNumerator - 1) / replayDenominator) + 1; i <= Math.floor(realHpStat * endNumerator / replayDenominator); i++){
          hpsPossibleClone[hpStat].push(i);
        }

      }

      if(endNumerator == replayDenominator - 1){
        for(let i = Math.floor(hpStat * endNumerator / replayDenominator) + 1; i <= realHpStat; i++){
          hpsPossibleClone[hpStat].push(i);
        }
      } else if(endNumerator == 0 || endNumerator == replayDenominator){

        hpsPossibleClone[hpStat].push(endNumerator ? realHpStat : 0);

      }

    }

  } else {

    for(let hpStat in hpsPossible){
      let baseHpStat = hpStat
      let absFactor = Math.abs(factor);
      let hpChange = factor;

      if(absFactor < 1){
        hpChange = baseHpStat * absFactor;
        hpChange = roundUp ? Math.ceil(hpChange) : Math.floor(hpChange);
        hpChange *= factorCount;

        if(factor < 0){
          hpChange *= -1;
        }
      }

      for(let i = hpsPossible[hpStat].length - 1; i >= 0; i--) {

        let nHpVal = Number(hpsPossible[hpStat][i]) + hpChange;
        let hpStatDenominator = isDynamaxed ? hpStat * 2 : hpStat;
        let nNumerator = Math.ceil(replayDenominator * nHpVal / hpStatDenominator);

        if(nNumerator == replayDenominator && endNumerator == replayDenominator - 1){ //last value acts differently -- it has more error
          nNumerator -= 1;
        }

        if(nNumerator == endNumerator){
          hpsPossibleClone[hpStat][i] = nHpVal;
        }

        else if(nNumerator > endNumerator && endNumerator == replayDenominator && !hpsPossibleClone[hpStat].includes(Number(hpStat))){
          hpsPossibleClone[hpStat][i] = Number(hpStat);
        }

        else if(nNumerator < 0 && endNumerator == 0 && !hpsPossibleClone[hpStat].includes(Number(hpStat))){
          hpsPossibleClone[hpStat][i] = 0;
        }

        else {
          hpsPossibleClone[hpStat].splice(i, 1);
          oldHpsPossibleClone[hpStat].splice(i, 1);
        }

      }

      if(hpsPossibleClone[hpStat].length == 0){ //this hp value is not possible
        delete hpsPossibleClone[hpStat];
        delete oldHpsPossibleClone[hpStat];
      }

    }

  }

  if(Object.keys(hpsPossibleClone).length == 0 && Object.keys(hpsPossible).length != 0){ //something went horribly wrong, so to preserve info, just treat the ratio as null
    console.log("PROBLEM", startNumerator, endNumerator, factor, factorCount, hpsPossible);
    return recalcHpsPossible(hpsPossible, startNumerator, endNumerator, replayDenominator, null, 1, false);
  } else {
    return [oldHpsPossibleClone, hpsPossibleClone];
  }

}

function cloneHpsPossible(hpsPossible){
  let nHps = {};

  for(let hp in hpsPossible){
    nHps[hp] = [...hpsPossible[hp]];
  }

  return nHps;
}

function setImpossibleAbility(constPkmn, ability, hackedAbilities) {

  constPkmn.impossibleAbilities[ability] = true;

  if(ability in constPkmn.speciesPossibleAbilities) {
    delete constPkmn.speciesPossibleAbilities[ability];
    const abilitiesList = Object.keys(constPkmn.speciesPossibleAbilities);

    if(abilitiesList.length == 1 && !hackedAbilities) { //if the deletion caused only 1 ability to be possible, set the ability, given that this is not a format with hacked abilities

      constPkmn.ability = abilitiesList[0];

    }

  }

}
