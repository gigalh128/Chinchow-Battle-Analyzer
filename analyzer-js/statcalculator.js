const natureMultipliers = {"plus": 1.1, "neutral": 1, "minus": 0.9};
const hpBasedMoves = {"Crush Grip": 1, "Eruption": 1, "Flail": 1, "Reversal": 1, "Water Spout" : 1, "Wring Out": 1};

const uniqueDmgBoostItems = {};
uniqueDmgBoostItems[2] = {
  "Bug": {"Silver Powder": 1, "Pokemon": {}},
  "Dark": {"Black Glasses": 1, "Pokemon": {}},
  "Dragon": {"Dragon Scale": 1, "Pokemon": {}},
  "Electric": {"Magnet": 1, "Pokemon": {}},
  "Fighting": {"Black Belt": 1, "Pokemon": {}},
  "Fire": {"Charcoal": 1, "Pokemon": {}},
  "Flying": {"Sharp Beak": 1, "Pokemon": {}},
  "Ghost": {"Spell Tag": 1, "Pokemon": {}},
  "Grass": {"Miracle Seed": 1, "Pokemon": {}},
  "Ground": {"Soft Sand": 1, "Pokemon": {}},
  "Ice": {"Never-Melt-Ice": 1, "Pokemon": {}},
  "Normal": {"Pink Bow": 1, "Pokemon": {}},
  "Poison": {"Poison Barb": 1, "Pokemon": {}},
  "Psychic": {"Twisted Spoon": 1, "Pokemon": {}},
  "Rock": {"Hard Stone": 1, "Pokemon": {}},
  "Steel": {"Metal Coat": 1, "Pokemon": {}},
  "Water": {"Mystic Water": 1, "Pokemon": {}},
  "Physical": {
    "Pokemon": {
      "Marowak": {"Thick Club": 1}
    }
  },
  "Special": {
    "Pokemon": {
      "Pikachu": {"Light Ball": 1}
    }
  },
  "Damage": {

  }
}

uniqueDmgBoostItems[3] = JSON.parse(JSON.stringify(uniqueDmgBoostItems[2]));
uniqueDmgBoostItems[3]["Dragon"] = {"Dragon Fang": 1, "Pokemon": {}};
uniqueDmgBoostItems[3]["Normal"] = {"Silk Scarf": 1, "Pokemon": {}};
uniqueDmgBoostItems[3]["Water"]["Sea Incense"] = 1;
uniqueDmgBoostItems[3]["Physical"]["Choice Band"] = 1;
uniqueDmgBoostItems[3]["Special"]["Pokemon"]["Clamperl"] = {"Deep Sea Tooth": 1};
uniqueDmgBoostItems[3]["Special"]["Pokemon"]["Latias"] = {"Soul Dew": 1};
uniqueDmgBoostItems[3]["Special"]["Pokemon"]["Latios"] = {"Soul Dew": 1};

uniqueDmgBoostItems[4] = JSON.parse(JSON.stringify(uniqueDmgBoostItems[3]));
uniqueDmgBoostItems[4]["Damage"]["Expert Belt"] = 1;
uniqueDmgBoostItems[4]["Damage"]["Life Orb"] = 1;
uniqueDmgBoostItems[4]["Damage"]["Metronome"] = 1;
uniqueDmgBoostItems[4]["Physical"]["Muscle Band"] = 1;
uniqueDmgBoostItems[4]["Physical"]["Pokemon"]["Pikachu"] = {"Light Ball" : 1};
uniqueDmgBoostItems[4]["Special"]["Choice Specs"] = 1;
uniqueDmgBoostItems[4]["Special"]["Wise Glasses"] = 1;
uniqueDmgBoostItems[4]["Dragon"]["Pokemon"]["Dialga"] = {"Adamant Orb": 1};
uniqueDmgBoostItems[4]["Dragon"]["Pokemon"]["Giratina"] = {"Griseous Orb": 1};
uniqueDmgBoostItems[4]["Dragon"]["Pokemon"]["Palkia"] = {"Lustrous Orb": 1};
uniqueDmgBoostItems[4]["Ghost"]["Pokemon"]["Giratina-Origin"] = {"Griseous Orb": 1};
delete uniqueDmgBoostItems[4]["Water"]["Sea Incense"]; //only unique modifier in gen 3

uniqueDmgBoostItems[5] = JSON.parse(JSON.stringify(uniqueDmgBoostItems[4]));

uniqueDmgBoostItems[6] = JSON.parse(JSON.stringify(uniqueDmgBoostItems[5]));
uniqueDmgBoostItems[6]["Fairy"] = {"Pixie Plate": 1};

uniqueDmgBoostItems[7] = JSON.parse(JSON.stringify(uniqueDmgBoostItems[6]));
uniqueDmgBoostItems[7]["Dragon"]["Pokemon"]["Latias"] = {"Soul Dew": 1};
uniqueDmgBoostItems[7]["Dragon"]["Pokemon"]["Latios"] = {"Soul Dew": 1};
uniqueDmgBoostItems[7]["Psychic"]["Pokemon"]["Latias"] = {"Soul Dew": 1};
uniqueDmgBoostItems[7]["Psychic"]["Pokemon"]["Latios"] = {"Soul Dew": 1};
delete uniqueDmgBoostItems[7]["Special"]["Pokemon"]["Latias"];
delete uniqueDmgBoostItems[7]["Special"]["Pokemon"]["Latios"];

uniqueDmgBoostItems[8] = JSON.parse(JSON.stringify(uniqueDmgBoostItems[7]));

const uniqueDmgReductionItems = {};
uniqueDmgReductionItems[2] = {
  "Physical": {
    "Pokemon": {
      "Ditto": {"Metal Powder": 1}
    }
  },
  "Special": {
    "Pokemon": {
      "Ditto": {"Metal Powder": 1}
    }
  }
}

uniqueDmgReductionItems[3] = JSON.parse(JSON.stringify(uniqueDmgReductionItems[2]));
uniqueDmgReductionItems[3]["Special"]["Pokemon"]["Clamperl"] = {"Deep Sea Scale": 1};
uniqueDmgReductionItems[3]["Special"]["Pokemon"]["Latias"] = {"Soul Dew": 1};
uniqueDmgReductionItems[3]["Special"]["Pokemon"]["Latios"] = {"Soul Dew": 1};
delete uniqueDmgReductionItems[3]["Special"]["Pokemon"]["Ditto"]; //metal powder doesn't boost special defense past gen 2

uniqueDmgReductionItems[4] = JSON.parse(JSON.stringify(uniqueDmgReductionItems[3]));

uniqueDmgReductionItems[5] = JSON.parse(JSON.stringify(uniqueDmgReductionItems[4]));
uniqueDmgReductionItems[5]["Physical"]["Eviolite"] = 1;
uniqueDmgReductionItems[5]["Special"]["Eviolite"] = 1;

uniqueDmgReductionItems[6] = JSON.parse(JSON.stringify(uniqueDmgReductionItems[5]));
uniqueDmgReductionItems[6]["Special"]["Assault Vest"] = 1;

uniqueDmgReductionItems[7] = JSON.parse(JSON.stringify(uniqueDmgReductionItems[6]));
delete uniqueDmgReductionItems[7]["Special"]["Pokemon"]["Latias"];
delete uniqueDmgReductionItems[7]["Special"]["Pokemon"]["Latios"];

uniqueDmgReductionItems[8] = JSON.parse(JSON.stringify(uniqueDmgReductionItems[7]));

function getMoveTypeSMSS(gen, attacker, defender, move, field) {

  var type = move.type;
  let desc = {};
  if (move.named('Weather Ball')) {
      var holdingUmbrella = attacker.hasItem('Utility Umbrella');
      type =
          field.hasWeather('Sun', 'Harsh Sunshine') && !holdingUmbrella ? 'Fire'
              : field.hasWeather('Rain', 'Heavy Rain') && !holdingUmbrella ? 'Water'
                  : field.hasWeather('Sand') ? 'Rock'
                      : field.hasWeather('Hail') ? 'Ice'
                          : 'Normal';
      desc.weather = field.weather;
      desc.moveType = type;
  }
  else if (move.named('Judgment') && attacker.item && attacker.item.includes('Plate')) {
      type = items_1.getItemBoostType(attacker.item);
  }
  else if (move.named('Techno Blast') && attacker.item && attacker.item.includes('Drive')) {
      type = items_1.getTechnoBlast(attacker.item);
  }
  else if (move.named('Multi-Attack') && attacker.item && attacker.item.includes('Memory')) {
      type = items_1.getMultiAttack(attacker.item);
  }
  else if (move.named('Natural Gift') && attacker.item && attacker.item.includes('Berry')) {
      var gift = items_1.getNaturalGift(gen, attacker.item);
      type = gift.t;
      desc.moveType = type;
      desc.attackerItem = attacker.item;
  }
  else if (move.named('Nature Power', 'Terrain Pulse')) {
      type =
          field.hasTerrain('Electric') ? 'Electric'
              : field.hasTerrain('Grassy') ? 'Grass'
                  : field.hasTerrain('Misty') ? 'Fairy'
                      : field.hasTerrain('Psychic') ? 'Psychic'
                          : 'Normal';
  }
  else if (move.named('Revelation Dance')) {
      type = attacker.types[0];
  }
  else if (move.named('Aura Wheel')) {
      if (attacker.named('Morpeko')) {
          type = 'Electric';
      }
      else if (attacker.named('Morpeko-Hangry')) {
          type = 'Dark';
      }
  }
  var hasAteAbilityTypeChange = false;
  var isAerilate = false;
  var isPixilate = false;
  var isRefrigerate = false;
  var isGalvanize = false;
  var isLiquidVoice = false;
  var isNormalize = false;
  var noTypeChange = move.named('Revelation Dance', 'Judgment', 'Nature Power', 'Techno Blast', 'Multi Attack', 'Natural Gift', 'Weather Ball', 'Terrain Pulse');
  if (!move.isZ && !noTypeChange) {
      var normal = move.hasType('Normal');
      if ((isAerilate = attacker.hasAbility('Aerilate') && normal)) {
          type = 'Flying';
      }
      else if ((isGalvanize = attacker.hasAbility('Galvanize') && normal)) {
          type = 'Electric';
      }
      else if ((isLiquidVoice = attacker.hasAbility('Liquid Voice') && !!move.flags.sound)) {
          type = 'Water';
      }
      else if ((isPixilate = attacker.hasAbility('Pixilate') && normal)) {
          type = 'Fairy';
      }
      else if ((isRefrigerate = attacker.hasAbility('Refrigerate') && normal)) {
          type = 'Ice';
      }
      else if ((isNormalize = attacker.hasAbility('Normalize'))) {
          type = 'Normal';
      }
      if (isGalvanize || isPixilate || isRefrigerate || isAerilate || isNormalize) {
          hasAteAbilityTypeChange = true;
      }
  }


  if("Ion Deluge" in field.fieldConditions && move.hasType("Normal")){
    type = "Electric";
  }

  return [type, hasAteAbilityTypeChange];

}

function calcADStatRanges(replay, moveEvent, pokemonActionsDict, hit, indexes) {

  const turn = replay.turns[indexes[0]];
  const generation = new Generation(replay.gen);
  const hitClone = hit.clone();
  const outputObj = {};
  let attacker = moveEvent.source;
  let defender = hit.defender;
  const baseConstAttacker = replay.constantTeams[attacker.originalPlayer].pokemon[attacker.originalTeamIndex];
  const realConstAttacker = "tempPlayer" in attacker ? replay.constantTeams[attacker.flags.tempPlayer].pokemon[attacker.flags.tempTeamIndex] : baseConstAttacker;
  const baseConstDefender = replay.constantTeams[defender.originalPlayer].pokemon[defender.originalTeamIndex];
  const realConstDefender = "tempPlayer" in defender ? replay.constantTeams[defender.flags.tempPlayer].pokemon[defender.flags.tempTeamIndex] : baseConstDefender;
  const constAttackSource = moveEvent.move.named("Foul Play") ? realConstDefender : realConstAttacker;
  const attackSource = moveEvent.move.named("Foul Play") ? defender : attacker;
  let move = moveEvent.move;
  const isCritical = "-crit" in hit.subEventIndexes;
  const hpkeys = Object.keys(baseConstDefender.hpsPossible);
  const flags = {};
  let hasAteAbilityTypeChange;
  let doubleBP = false;

  //just copy stuff from the gen78 mechanics calculator
  [move.type, hasAteAbilityTypeChange] = getMoveTypeSMSS(attacker.gen, attacker, defender, move, hit.field);

  let attackingStat = replay.turns[indexes[0]].events[indexes[1]].move.category === "Special" ? "spa" : "atk";
  let defendingStat = replay.turns[indexes[0]].events[indexes[1]].move.defensiveCategory === "Special" ? "spd" : "def";

  //set speed values as the order in which pokemon acted to help with turn order calculations
  attacker.stats.spe = attacker.stats.spe = -1 * indexes[1];
  defender.stats.spe = -1 * pokemonActionsDict[defender.originalPlayer + "," + defender.originalTeamIndex];

  if(move.name === "Pursuit" && move.priority === 7) {
    hit.field.defenderSide.isSwitching = 'out';
  }

  else if(turn.events[pokemonActionsDict[defender.originalPlayer + "," + defender.originalTeamIndex]].name === "switch") {
    hit.field.defenderSide.isSwitching = 'in';
  }

  //do move specific considerations
  if(move.name === "Body Press"){
    attackingStat = "def";
  }

  else if(move.name === "Stomping Tantrum") {
    const lastTurn = replay.turns[indexes[0] - 1];
    let lastMoveEvent = false;
    let lastMoveEventIndx = -1;

    for(let i in lastTurn.events) {

      if((lastTurn.events[i].name === "move" || lastTurn.events[i].name === "cant") && lastTurn.events[i].source.originalPlayer == baseConstAttacker.originalPlayer && lastTurn.events[i].source.originalTeamIndex == baseConstAttacker.originalTeamIndex) { //find the last moves that were previously executed by the current pokemon

        lastMoveEvent = lastTurn.events[i];
        lastMoveEventIndx = i;

      }

    }

    if(lastMoveEvent) {

      if(lastMoveEvent.name === "cant") { //the move clearly failed
        doubleBP = true;
      }

      else if(lastMoveEvent.name === "move") {

        if("-fail" in lastMoveEvent.subEventIndexes) {
          doubleBP = true;
        } else {
          console.log(lastMoveEvent);

          let failSum = 0;
          let requiredSum = lastMoveEvent.targetPositions.length;

          if("-miss" in lastMoveEvent.subEventIndexes) {
            failSum += lastMoveEvent.subEventIndexes["-miss"].length;
          }

          if("-immune" in lastMoveEvent.subEventIndexes) {
            failSum += lastMoveEvent.subEventIndexes["-immune"].length;
          }

          if("-activate" in lastMoveEvent.subEventIndexes) {

            for(let i in lastMoveEvent.subEventIndexes["-activate"]) {
              let index = lastMoveEvent.subEventIndexes["-activate"][i];

              if(lastMoveEvent.subEvents[index].data.length > 0 && lastMoveEvent.subEvents[index].data === "move: Protect") { //protect does not contribute to stomping tantrum
                requiredSum--;
              }

            }

          }

          if(requiredSum > 0) {

            if(failSum >= requiredSum) {
              doubleBP = true;
            } else { //search for magic bounce redirections (they are considered a fail)

              for(let i = lastMoveEventIndx + 1; i < lastTurn.events.length; i++) {

                const potentialMagicBounce = lastTurn.events[i];

                if(lastTurn.events[i].name === "move" && lastTurn.events[i].cause.endsWith("Magic Bounce")) {
                  failSum++;
                } else { //magic bounces must be chained immediately after the activated move
                  break;
                }

              }

              if(failSum >= requiredSum) {
                doubleBP = true;
              }

            }

          }

        }

      }

    }

  }

  else if(move.name === "Avalanche" || move.name === "Revenge") {

    for(let i in turn.eventIndexes.move) {

      if(turn.eventIndexes.move[i] >= indexes[1] || doubleBP) {
        break;
      }

      const tempMove = turn.events[turn.eventIndexes.move[i]];

      for(let j in tempMove.hits) {

        const tempHit = tempMove.hits[j];

        if(tempHit.defender.originalPlayer === attacker.originalPlayer && tempHit.defender.originalTeamIndex === attacker.originalTeamIndex && tempMove.source.originalPlayer === defender.originalPlayer && tempMove.source.originalTeamIndex === defender.originalTeamIndex) {
          doubleBP = true;
          break;
        }

      }

    }

  }

  else if(move.name === "Payback" && generation.num > 4) {

    for(let i in turn.eventIndexes.move) {

      if(turn.eventIndexes.move[i] >= indexes[1]) { //payback should not double in power
        attacker.stats.spe = defender.stats.spe + 1;
        break;
      }

      const tempMove = turn.events[turn.eventIndexes.move[i]];

      if(tempMove.source.originalPlayer === defender.originalPlayer && tempMove.source.originalTeamIndex === defender.originalTeamIndex && tempMove.cause != "ability: Magic Bounce") {
        attacker.stats.spe = defender.stats.spe - 1;
        break;
      }

    }

    console.log(attacker.stats.spe, defender.stats.spe, "payback speed check?!");
  }

  else if (move.name === "Round" && moveEvent.cause.endsWith("Round")) {
    doubleBP = true;
  }

  else if (move.name === "Rollout" || move.name === "Ice Ball") { //search back to see what power this should be

    if(attacker.currSessionMoves.includes("Defense Curl")) {
      doubleBP = true;
    }

    let previousUses = 0;
    const refStr = attacker.originalPlayer + "," + attacker.originalTeamIndex;
    let turnNum = indexes[0] - 1;
    while(turnNum > 0 && refStr in replay.turns[turnNum].pokemonActionsDict) {

      const tempTurn = replay.turns[turnNum];
      const refEventIndex = tempTurn.pokemonActionsDict[refStr];

      if(tempTurn.events[refEventIndex].name != "move") {
        break;
      }

      if(tempTurn.events[refEventIndex].move.name != move.name && tempTurn.events[refEventIndex].cause != "lockedmove") {
        break;
      }

      previousUses++;
      turnNum--;

    }

    move.bp *= 2 ** previousUses;

  }

  else if (move.name === "Echoed Voice") { //have to search back at most 5 turns to determine the base power...

    let multiplier = 1;
    let turnNum = indexes[0] - 1;

    while(turnNum > 0 && multiplier < 5) {

      const tempTurn = replay.turns[turnNum];

      if(!("move" in tempTurn.eventIndexes)) { //no moves were made, so clearly echoed voice did not get used
        break;
      }

      let foundEchoedVoice = false;

      for(let i in tempTurn.eventIndexes.move) {

        const moveEvent = tempTurn.events[tempTurn.eventIndexes.move[i]];

        if(moveEvent.move.name === "Echoed Voice") {

          foundEchoedVoice = true;
          multiplier++;
          break;

        }

      }

      if(!foundEchoedVoice) {
        break;
      }

      turnNum--;

    }

    move.bp *= multiplier;

    console.log(move.bp);

  }

  else if (move.name === "Fury Cutter") {
    move.bp *= 2 ** move.timesUsedWithMetronome;
    move.bp = Math.min(move.bp, 160);
  }

  if(doubleBP) {
    move.bp *= 2;
  }

  //do specific ability considerations
  doubleBP = false;

  if(attacker.ability === "Stakeout" && hit.field.defenderSide.isSwitching === 'in') {
    doubleBP = true;
  }

  else if(attacker.ability === "Analytic" && moveEvent.field.gameType != "Singles" && !("Neutralizing Gas" in moveEvent.field.fieldConditions)) {

    if(indexes[1] === turn.eventIndexes.move[turn.eventIndexes.move.length - 1] && moveEvent.name != "Pursuit") {
      attacker.stats.spe = defender.stats.spe - 1;
    } else {
      attacker.stats.spe = defender.stats.spe + 1;
    }

  }

  if(doubleBP) {
    move.bp *= 2;
  }

  //search ally abilities to see if they affect calculations
  if(moveEvent.field.gameType != "Singles" && moveEvent.field.game != "freeforall" && !("Neutralizing Gas" in moveEvent.field.fieldConditions)) {

    for(let slot in moveEvent.slots) {

      const pkmnAbility = moveEvent.teams[slot.substring(0, 2)].pokemon[moveEvent.slots[slot]].ability;
      const sideToChange = slot.startsWith(attacker.originalPlayer) ? hit.field.attackerSide : hit.field.defenderSide;

      switch(pkmnAbility) {

        case "Power Spot":
          sideToChange.isPowerSpot = true;
        break;

        case "Battery":
          sideToChange.isBattery = true;
        break;

        case "Friend Guard":
          sideToChange.isFriendGuard = true;
        break;

      }

    }

  }

  let attackingStatRanges = {};
  let defendingStatRanges = {};
  let altDefendingStatRanges = {};
  let backupHpStatRanges = {};
  let altBackupHpStatRanges = {};

  for(let category in constAttackSource.statRanges[attackingStat]){
    attackingStatRanges[category] = {ivs: [...constAttackSource.statRanges[attackingStat][category].ivs], evs: [...constAttackSource.statRanges[attackingStat][category].evs]};
  }

  for(let category in realConstDefender.statRanges[defendingStat]){
    defendingStatRanges[category] = {ivs: [...realConstDefender.statRanges[defendingStat][category].ivs], evs: [...realConstDefender.statRanges[defendingStat][category].evs], hpivs: [...realConstDefender.statRanges[defendingStat][category].hpivs], hpevs: [...realConstDefender.statRanges[defendingStat][category].hpevs]};
  }

  for(let category in realConstDefender.altDefensiveRanges[defendingStat]){
    altDefendingStatRanges[category] = {ivs: [...realConstDefender.altDefensiveRanges[defendingStat][category].ivs], evs: [...realConstDefender.altDefensiveRanges[defendingStat][category].evs], hpivs: [...realConstDefender.altDefensiveRanges[defendingStat][category].hpivs], hpevs: [...realConstDefender.altDefensiveRanges[defendingStat][category].hpevs]};
  }

  for(let category in baseConstDefender.statRanges[defendingStat]){
    backupHpStatRanges[category] = {ivs: [...baseConstDefender.statRanges[defendingStat][category].ivs], evs: [...baseConstDefender.statRanges[defendingStat][category].evs], hpivs: [...baseConstDefender.statRanges[defendingStat][category].hpivs], hpevs: [...baseConstDefender.statRanges[defendingStat][category].hpevs]};
  }

  for(let category in baseConstDefender.altDefensiveRanges[defendingStat]){
    altBackupHpStatRanges[category] = {ivs: [...baseConstDefender.altDefensiveRanges[defendingStat][category].ivs], evs: [...baseConstDefender.altDefensiveRanges[defendingStat][category].evs], hpivs: [...baseConstDefender.altDefensiveRanges[defendingStat][category].hpivs], hpevs: [...baseConstDefender.altDefensiveRanges[defendingStat][category].hpevs]};
  }

  //make hp stat range adjustments for transformed pokemon
  if("tempPlayer" in defender.flags) {
    let minHpRange = baseConstDefender.altDefensiveRanges[defendingStat][findExtremeKey(baseConstDefender.altDefensiveRanges[defendingStat], false)];
    let maxHpRange = baseConstDefender.statRanges[defendingStat][findExtremeKey(baseConstDefender.statRanges[defendingStat], true)];
    const tempIvs = [minHpRange.hpivs[0], maxHpRange.hpivs[1]];
    const tempEvs = [minHpRange.hpevs[0], maxHpRange.hpevs[1]];

    for(let category in realConstDefender.statRanges[defendingStat]) {
      defendingStatRanges[category].hpivs = [...tempIvs];
      defendingStatRanges[category].hpevs = [...tempEvs];
    }

    for(let category in realConstDefender.statRanges[defendingStat]) {
      altDefendingStatRanges[category].hpivs = [...tempIvs];
      altDefendingStatRanges[category].hpevs = [...tempEvs];
    }

  }

  let power = calculateBasePowerSMSS(generation, attacker, defender, move,  hit.field, hasAteAbilityTypeChange, {});
  let damageModsList = buildDamageModsList(replay, attacker, defender, moveEvent, hit);

  //reset move base power in the case it was modified
  move.bp = new Move(replay.gen, move.name).bp;

  console.log(indexes);
  console.log("DAMAGES MODS", damageModsList);
  console.log("MOVE POWER", move.name, power);
  console.log(attacker.ability, attacker.item, defender.ability, defender.item);

  //note: def is chosen arbitrarily here.  both alt defensive ranges should contain the same min hp stat
  const tempMaxKey = findExtremeKey(baseConstDefender.altDefensiveRanges.def, false);
  defender.ivs.hp = baseConstDefender.altDefensiveRanges.def[tempMaxKey].hpivs[0];
  defender.evs.hp = baseConstDefender.altDefensiveRanges.def[tempMaxKey].hpevs[0];
  const definiteMinHp = defender.calcStat(generation, "hp");

  //same goes for here.  both primary stat ranges should contain the same max hp stat
  const tempMinKey = findExtremeKey(baseConstDefender.statRanges.def, true);
  defender.ivs.hp = baseConstDefender.statRanges.def[tempMinKey].hpivs[1];
  defender.evs.hp = baseConstDefender.statRanges.def[tempMinKey].hpevs[1];
  const definiteMaxHp = defender.calcStat(generation, "hp");

  let oneDamagePossible = hit.startNumerator - hit.endNumerator <= 1;
  let reachedZero = hit.endNumerator == 0;

  if("-ability" in hit.subEventIndexes){

    for(let i = 0; i < hit.subEventIndexes["-ability"].length; i++){

      if(hit.subEvents[hit.subEventIndexes["-ability"][i]].data[0] === "Sturdy"){
        reachedZero = true;
        break;
      }

    }

  }

  else if("-enditem" in moveEvent.subEventIndexes){

    for(let i = 0; i < moveEvent.subEventIndexes["-enditem"].length; i++){
      const subEvent = moveEvent.subEvents[moveEvent.subEventIndexes["-enditem"][i]];

      if((subEvent.item === "Focus Sash" || subEvent.item === "Focus Band") && !("fromInfo" in subEvent.extraData)){
        reachedZero = true;
        break;
      }

    }

  }

  else if("-activate" in moveEvent.subEventIndexes) {

    for(let i in moveEvent.subEventIndexes["-activate"]) {

      const subEvent = moveEvent.subEvents[moveEvent.subEventIndexes["-activate"][i]];

      if(subEvent.data[0] === "Endure") {
        reachedZero = true;
        break;
      }

    }

  }

  //calculate min attack
  //console.log(damageModsList);
  let invalidStat = false;


  if(Object.keys(altDefendingStatRanges).length == 0){
    console.log("HELP", defendingStatRanges, defendingStat, {...realConstDefender.altDefensiveRanges[defendingStat]});
  }


  if(!oneDamagePossible){

    const possibleMinAttacks = [];
    const defErrorDict = {};
    const altDefErrorDict = {};
    const maxAttackValsPossible = {};
    //if min hp stats are all the same, then the min attack will definitely come from the lowest nature.  Otherwise, you need to check all possible defending stat range categories

    for(let category in attackingStatRanges){
      attackSource.ivs[attackingStat] = attackingStatRanges[category].ivs[1];
      attackSource.evs[attackingStat] = attackingStatRanges[category].evs[1];
      maxAttackValsPossible[category] = Math.floor(attackSource.calcStat(generation, attackingStat) * natureMultipliers[category]);
    }

    for(let category in defendingStatRanges){

      //main setup
      defender.ivs.hp = defendingStatRanges[category].hpivs[0];
      defender.evs.hp = defendingStatRanges[category].hpevs[0];
      defender.ivs[defendingStat] = defendingStatRanges[category].ivs[0];
      defender.evs[defendingStat] = defendingStatRanges[category].evs[0];
      defender.rawStats[defendingStat] = Math.floor(defender.calcStat(generation, defendingStat) * natureMultipliers[category]);
      defender.stats[defendingStat] = getModifiedStat(defender.rawStats[defendingStat], defender.boosts[defendingStat], generation);
      let minHp = defender.calcStat(generation, "hp");
      let minDef = calculateDefenseSMSS(generation, attacker, defender, moveEvent.move, hit.field, {}, isCritical);

      /*
      if(defender.isDynamaxed) {
        minHp *= 2;
      }
      */

      /*
      if("tempPlayer" in defender.flags){ //can't make distinction between alt min and min for transformed mons
        minHp = definiteMinHp;
      }
      */

      let minAttack = Math.ceil(minDef * calcADRatioRanges(replay, power, damageModsList, moveEvent, hit, minHp, minHp)[0]);
      minAttack = unwrapStatMods(replay.gen, moveEvent, hit, attackingStat, minAttack, "attacker")[0];
      const theoreticalMaxAttack = maxAttackValsPossible[findExtremeKey(maxAttackValsPossible, false)];

      if(theoreticalMaxAttack < minAttack){
        defErrorDict[category] = true;
      } else {
        possibleMinAttacks.push(minAttack);
      }

    }

    for(let category in altDefendingStatRanges){

      //alt setup
      defender.ivs.hp = altDefendingStatRanges[category].hpivs[0];
      defender.evs.hp = altDefendingStatRanges[category].hpevs[0];
      defender.ivs[defendingStat] = altDefendingStatRanges[category].ivs[0];
      defender.evs[defendingStat] = altDefendingStatRanges[category].evs[0];
      defender.rawStats[defendingStat] = Math.floor(defender.calcStat(generation, defendingStat) * natureMultipliers[category]);
      defender.stats[defendingStat] = getModifiedStat(defender.rawStats[defendingStat], defender.boosts[defendingStat], generation);
      let altMinHp = defender.calcStat(generation, "hp");
      let altMinDef = calculateDefenseSMSS(generation, attacker, defender, moveEvent.move, hit.field, {}, isCritical);

      /*
      if(defender.isDynamaxed) {
        altMinHp *= 2;
      }
      */

      /*
      if("tempPlayer" in defender.flags){ //can't make distinction between alt min and min for transformed mons
        altMinHp = definiteMinHp;
      }
      */

      let altMinAttack = Math.ceil(altMinDef * calcADRatioRanges(replay, power, damageModsList, moveEvent, hit, altMinHp, altMinHp)[0]);
      altMinAttack = unwrapStatMods(replay.gen, moveEvent, hit, attackingStat, altMinAttack, "attacker")[0];
      const theoreticalMaxAttack = maxAttackValsPossible[findExtremeKey(maxAttackValsPossible, false)];

      if(theoreticalMaxAttack < altMinAttack){
        altDefErrorDict[category] = true;
      } else {
        possibleMinAttacks.push(altMinAttack);
      }

    }

    if(possibleMinAttacks.length == 0){

      flags.adRatioTooLow = true;
      invalidStat = true;
      flags.problem = "attacker";
      console.log("The Attack / Defense Ratio is too low. (attacker calc)  For now, nothing has been changed.");

    } else {

      const finalMinAttack = Math.min(...possibleMinAttacks);

      for(let category in attackingStatRanges){

        if(finalMinAttack > maxAttackValsPossible[category]){
          delete attackingStatRanges[category];
        } else {

          let unwrappedVals = unwrapRawStatEvsIvs(attackSource, attackingStat, finalMinAttack, category, constAttackSource.statRanges[attackingStat][category].ivs, constAttackSource.statRanges[attackingStat][category].evs);
          attackingStatRanges[category].ivs[0] = unwrappedVals[0][0]; //min ivs required
          attackingStatRanges[category].evs[0] = unwrappedVals[0][3]; //min evs required

        }

      }

      for(let category in defErrorDict){
        delete defendingStatRanges[category];
      }

      for(let category in altDefErrorDict){
        delete altDefendingStatRanges[category];
      }

    }

  }

  //calculate max attack
  if(!(invalidStat || reachedZero)){

    const possibleMaxAttacks = [];
    const defErrorDict = {};
    const altDefErrorDict = {};
    const minAttackValsPossible = {};

    for(let category in attackingStatRanges){

      attackSource.ivs[attackingStat] = attackingStatRanges[category].ivs[0];
      attackSource.evs[attackingStat] = attackingStatRanges[category].evs[0];
      minAttackValsPossible[category] = Math.floor(attackSource.calcStat(generation, attackingStat) * natureMultipliers[category]);

    }

    for(let category in defendingStatRanges){

      //main setup
      defender.ivs.hp = defendingStatRanges[category].hpivs[1];
      defender.evs.hp = defendingStatRanges[category].hpevs[1];
      defender.ivs[defendingStat] = defendingStatRanges[category].ivs[1];
      defender.evs[defendingStat] = defendingStatRanges[category].evs[1];
      defender.rawStats[defendingStat] = Math.floor(defender.calcStat(generation, defendingStat) * natureMultipliers[category]);
      defender.stats[defendingStat] = getModifiedStat(defender.rawStats[defendingStat], defender.boosts[defendingStat], generation);
      let maxHp = defender.calcStat(generation, "hp");
      let maxDef = calculateDefenseSMSS(generation, attacker, defender, moveEvent.move, hit.field, {}, isCritical);

      /*
      if(defender.isDynamaxed) {
        maxHp *= 2;
      }
      */

      /*
      if("tempPlayer" in defender.flags){ //can't make distinction between alt min and min for transformed mons
        maxHp = definiteMaxHp;
      }
      */

      let maxAttack = Math.ceil(maxDef * calcADRatioRanges(replay, power, damageModsList, moveEvent, hit, maxHp, maxHp)[1]);
      maxAttack = unwrapStatMods(replay.gen, moveEvent, hit, attackingStat, maxAttack, "attacker")[1];
      const theoreticalMinAttack = minAttackValsPossible[findExtremeKey(minAttackValsPossible, true)];

      if(theoreticalMinAttack > maxAttack){
        defErrorDict[category] = true;
      } else {
        possibleMaxAttacks.push(maxAttack);
      }

    }

    for(let category in altDefendingStatRanges){

      //alt setup
      defender.ivs.hp = altDefendingStatRanges[category].hpivs[1];
      defender.evs.hp = altDefendingStatRanges[category].hpevs[1];
      defender.ivs[defendingStat] = altDefendingStatRanges[category].ivs[1];
      defender.evs[defendingStat] = altDefendingStatRanges[category].evs[1];
      defender.rawStats[defendingStat] = Math.floor(defender.calcStat(generation, defendingStat) * natureMultipliers[category]);
      defender.stats[defendingStat] = getModifiedStat(defender.rawStats[defendingStat], defender.boosts[defendingStat], generation);
      let altMaxHp = defender.calcStat(generation, "hp");
      let altMaxDef = calculateDefenseSMSS(generation, attacker, defender, moveEvent.move, hit.field, {}, isCritical);

      /*
      if(defender.isDynamaxed) {
        altMaxHp *= 2;
      }
      */

      /*
      if("tempPlayer" in defender.flags){ //can't make distinction between alt min and min for transformed mons
        altMaxHp = definiteMaxHp;
      }
      */

      let altMaxAttack = Math.ceil(altMaxDef * calcADRatioRanges(replay, power, damageModsList, moveEvent, hit, altMaxHp, altMaxHp)[1]);
      altMaxAttack = unwrapStatMods(replay.gen, moveEvent, hit, attackingStat, altMaxAttack, "attacker")[1];
      const theoreticalMinAttack = minAttackValsPossible[findExtremeKey(minAttackValsPossible, true)];

      if(theoreticalMinAttack > altMaxAttack){
        altDefErrorDict[category] = true;
      } else {
        possibleMaxAttacks.push(altMaxAttack);
      }

    }

    if(possibleMaxAttacks.length == 0){

      flags.adRatioTooHigh = true;
      invalidStat = true;
      flags.problem = "attacker";
      console.log("The Attack / Defense Ratio is too high. (attacker calc)  For now, nothing has been changed.");

    } else {

      const finalMaxAttack = Math.max(...possibleMaxAttacks);

      for(let category in attackingStatRanges){

        if(finalMaxAttack < minAttackValsPossible[category]){
          delete attackingStatRanges[category];
        } else {

          let unwrappedVals = unwrapRawStatEvsIvs(attackSource, attackingStat, finalMaxAttack, category, constAttackSource.statRanges[attackingStat][category].ivs, constAttackSource.statRanges[attackingStat][category].evs);
          attackingStatRanges[category].ivs[1] = unwrappedVals[1][2]; //max ivs required
          attackingStatRanges[category].evs[1] = unwrappedVals[1][1]; //max evs required

        }

      }

      for(let category in defErrorDict){
        delete defendingStatRanges[category];
      }

      for(let category in altDefErrorDict){
        delete altDefendingStatRanges[category];
      }

    }

  }

  //calculate min defense
  if(!(invalidStat || reachedZero)){

    const minAttackNature = findExtremeKey(attackingStatRanges, true);
    attackSource.ivs[attackingStat] = attackingStatRanges[minAttackNature].ivs[0];
    attackSource.evs[attackingStat] = attackingStatRanges[minAttackNature].evs[0];
    attackSource.rawStats[attackingStat] = Math.floor(attackSource.calcStat(generation, attackingStat) * natureMultipliers[minAttackNature]);
    attackSource.stats[attackingStat] = getModifiedStat(attacker.rawStats[attackingStat], attacker.boosts[attackingStat], generation);
    attackSource.stats[attackingStat] = calculateAttackSMSS(generation, attacker, defender, moveEvent.move, hit.field, {}, isCritical);
    const errorDict = {};
    const altErrorDict = {};

    for(let category in defendingStatRanges){

      defender.ivs[defendingStat] = defendingStatRanges[category].ivs[0];
      defender.evs[defendingStat] = defendingStatRanges[category].evs[0];
      defender.rawStats[defendingStat] = Math.floor(defender.calcStat(generation, defendingStat) * natureMultipliers[category]);
      defender.stats[defendingStat] = getModifiedStat(defender.rawStats[attackingStat], defender.boosts[defendingStat], generation);
      defender.stats[defendingStat] = calculateDefenseSMSS(generation, attacker, defender, moveEvent.move, hit.field, {}, isCritical);
      let prevMinHp = definiteMinHp;
      let prevMaxHp = definiteMaxHp;

      defender.ivs.hp = defendingStatRanges[category].hpivs[0];
      defender.evs.hp = defendingStatRanges[category].hpevs[0];
      prevMinHp = defender.calcStat(generation, "hp");

      /*
      if(defender.isDynamaxed) {
        prevMinHp *= 2;
        prevMaxHp *= 2;
      }
      */

      damageModsList[4] = hit.minRng; // need to set rng mod
      let damageVal = calcDamage(power, attacker.level, damageModsList, attackSource.stats[attackingStat], defender.stats[defendingStat]);
      let changeValsPossible = getPossibleChangeVals(hit.startHpsPossible, defender.hpsPossible, prevMinHp, prevMaxHp, baseConstDefender.hpsPossible);
      //console.log("CHANGE VALS", changeValsPossible, damageVal, prevMinHp, prevMaxHp);
      //console.log("start end hps", hit.startHpsPossible, defender.hpsPossible, JSON.parse(JSON.stringify(baseConstDefender.hpsPossible)));
      let changeValsKeys = Object.keys(changeValsPossible);
      let defenseRecalcNeeded = false;
      let minHp = 0;
      let minDefense = defender.rawStats[defendingStat];
      let maxPossibleDamage = Number(changeValsKeys[changeValsKeys.length - 1]);

      if(damageVal < Number(changeValsKeys[0])) { //inconclusive information to determine max defenses
        continue;
      }

      if(changeValsPossible[damageVal]){
        minHp = changeValsPossible[damageVal][0];
      } else {
        defenseRecalcNeeded = true;
        minHp = definiteMaxHp;
      }

      /*
      if(defender.isDynamaxed) {
        minHp *= 2;
      }
      */

      if(defenseRecalcNeeded){
        minDefense = Math.ceil(attackSource.stats[attackingStat] / calcADRatioRanges(replay, power, damageModsList, moveEvent, hit, minHp, minHp)[2]);
        minDefense = unwrapStatMods(replay.gen, moveEvent, hit, defendingStat, minDefense, "defender")[0];
      }

      //verify results
      defender.ivs[defendingStat] = defendingStatRanges[category].ivs[1];
      defender.evs[defendingStat] = 252;
      defender.rawStats[defendingStat] = Math.floor(defender.calcStat(generation, defendingStat) * natureMultipliers[category]);

      if(minDefense > defender.rawStats[defendingStat]){
        errorDict[category] = true;
      } else { //stat range setting fails to account for transformed pokemon at the moment
        let unwrappedDefVals = unwrapRawStatEvsIvs(defender, defendingStat, minDefense, category, realConstDefender.statRanges[defendingStat][category].ivs, realConstDefender.statRanges[defendingStat][category].evs);
        defendingStatRanges[category].ivs[0] = unwrappedDefVals[0][0];
        defendingStatRanges[category].evs[0] = unwrappedDefVals[0][3];
        let unwrappedHpVals = unwrapRawStatEvsIvs(defender, "hp", minHp, category, baseConstDefender.statRanges[defendingStat][category].hpivs, baseConstDefender.statRanges[defendingStat][category].hpevs);
        defendingStatRanges[category].hpivs[0] = unwrappedHpVals[0][0];
        defendingStatRanges[category].hpevs[0] = unwrappedHpVals[0][3];

      }

    }

    for(let category in altDefendingStatRanges){ //alt range calculation

      defender.ivs.hp = altDefendingStatRanges[category].hpivs[0];
      defender.evs.hp = altDefendingStatRanges[category].hpevs[0];
      let altMinHp = defender.calcStat(generation, "hp");

      /*
      if(defender.isDynamaxed) {
        altMinHp *= 2;
      }
      */

      let altMinDefense = Math.ceil(attackSource.stats[attackingStat] / calcADRatioRanges(replay, power, damageModsList, moveEvent, hit, altMinHp, altMinHp)[2]);
      altMinDefense = unwrapStatMods(replay.gen, moveEvent, hit, defendingStat, altMinDefense, "defender")[0];

      defender.ivs[defendingStat] = altDefendingStatRanges[category].ivs[1];
      defender.evs[defendingStat] = 252;
      defender.rawStats[defendingStat] = Math.floor(defender.calcStat(generation, defendingStat) * natureMultipliers[category]);

      if(altMinDefense > defender.rawStats[defendingStat]){ //need to adjust hp stat

        altMinDefense = defender.rawStats[defendingStat];
        defender.stats[defendingStat] = getModifiedStat(defender.rawStats[attackingStat], defender.boosts[defendingStat], generation);
        defender.stats[defendingStat] = calculateDefenseSMSS(generation, attacker, defender, moveEvent.move, hit.field, {}, isCritical);
        let prevMinHp = definiteMinHp;
        let prevMaxHp = definiteMaxHp;

        defender.ivs.hp = altDefendingStatRanges[category].hpivs[1];
        defender.evs.hp = altDefendingStatRanges[category].hpevs[1];
        prevMaxHp = defender.calcStat(generation, "hp");

        /*
        if(defender.isDynamaxed) {
          prevMinHp *= 2;
          prevMaxHp *= 2;
        }
        */

        damageModsList[4] = hit.minRng; // need to set rng mod
        let damageVal = calcDamage(power, attacker.level, damageModsList, attackSource.stats[attackingStat], defender.stats[defendingStat]);
        let changeValsPossible = getPossibleChangeVals(hit.startHpsPossible, defender.hpsPossible, prevMinHp, prevMaxHp, baseConstDefender.hpsPossible);
        let changeValsKeys = Object.keys(changeValsPossible);
        let maxPossibleDamage = Number(changeValsKeys[changeValsKeys.length - 1]);

        if(damageVal < Number(changeValsKeys[0])){ //inconclusive calculation
          continue;
        }

        if(changeValsPossible[damageVal]){ //same problem with transformed pkmn
          altMinHp = changeValsPossible[damageVal][0];
        }

        else if(damageVal < maxPossibleDamage && damageVal > changeValsPossible[0]) {

          let keyNum = changeVals.length - 1;

          while(keyNum > 0 && Number(changeValsKeys[keyNum - 1]) > damageVal) {
            keyNum--;
          }

          damageVal = changeValsKeys[keyNum];
          minHp = changeValsPossible[damageVal][0];

        }

        else { //calculation error
          altErrorDict[category] = true;
        }

      }

      if(!altErrorDict[category]){

        let unwrappedDefVals = unwrapRawStatEvsIvs(defender, defendingStat, altMinDefense, category, realConstDefender.altDefensiveRanges[defendingStat][category].ivs, realConstDefender.altDefensiveRanges[defendingStat][category].evs);
        altDefendingStatRanges[category].ivs[0] = unwrappedDefVals[0][0];
        altDefendingStatRanges[category].evs[0] = unwrappedDefVals[0][3];
        let unwrappedHpVals = unwrapRawStatEvsIvs(defender, "hp", altMinHp, category, baseConstDefender.altDefensiveRanges[defendingStat][category].hpivs, baseConstDefender.altDefensiveRanges[defendingStat][category].hpevs);
        altDefendingStatRanges[category].hpivs[0] = unwrappedHpVals[0][0];
        altDefendingStatRanges[category].hpevs[0] = unwrappedHpVals[0][3];

      }

      if(Object.keys(errorDict).length == Object.keys(defendingStatRanges).length){ //both alt and primary ranges should error together if all of them fail
        flags.adRatioTooHigh = true;
        invalidStat = true;
        flags.problem = "defender";
        console.log("The Attack / Defense Ratio is too high. (defender calc)  For now, nothing has been changed.");
      } else {

        for(let category in errorDict){
          delete defendingStatRanges[category];
        }

        for(let category in altErrorDict){
          delete altDefendingStatRanges[category];
        }

      }

    }

  }

  //calculate max defense
  if(!(invalidStat || oneDamagePossible)){

    const maxAttackNature = findExtremeKey(attackingStatRanges, false);
    attackSource.ivs[attackingStat] = attackingStatRanges[maxAttackNature].ivs[1];
    attackSource.evs[attackingStat] = attackingStatRanges[maxAttackNature].evs[1];
    attackSource.rawStats[attackingStat] = Math.floor(attackSource.calcStat(generation, attackingStat) * natureMultipliers[maxAttackNature]);
    attackSource.stats[attackingStat] = getModifiedStat(attacker.rawStats[attackingStat], attacker.boosts[attackingStat], generation);
    attackSource.stats[attackingStat] = calculateAttackSMSS(generation, attacker, defender, moveEvent.move, hit.field, {}, isCritical);
    const errorDict = {};
    const altErrorDict = {};

    for(let category in altDefendingStatRanges){ //alt ranges calc

      defender.ivs[defendingStat] = altDefendingStatRanges[category].ivs[1];
      defender.evs[defendingStat] = altDefendingStatRanges[category].evs[1];
      defender.rawStats[defendingStat] = Math.floor(defender.calcStat(generation, defendingStat) * natureMultipliers[category]);
      defender.stats[defendingStat] = getModifiedStat(defender.rawStats[attackingStat], defender.boosts[defendingStat], generation);
      defender.stats[defendingStat] = calculateDefenseSMSS(generation, attacker, defender, moveEvent.move, hit.field, {}, isCritical);
      let prevMinHp = definiteMinHp;
      let prevMaxHp = definiteMaxHp;

      defender.ivs.hp = altDefendingStatRanges[category].hpivs[1];
      defender.evs.hp = altDefendingStatRanges[category].hpevs[1];
      prevMaxHp = defender.calcStat(generation, "hp");

      /*
      if(defender.isDynamaxed) {
        prevMinHp *= 2;
        prevMaxHp *= 2;
      }
      */

      damageModsList[4] = hit.maxRng; // need to set rng mod
      let damageVal = calcDamage(power, attacker.level, damageModsList, attackSource.stats[attackingStat], defender.stats[defendingStat]);
      let changeValsPossible = getPossibleChangeVals(hit.startHpsPossible, defender.hpsPossible, prevMinHp, prevMaxHp, baseConstDefender.hpsPossible);
      let changeValsKeys = Object.keys(changeValsPossible);
      let defenseRecalcNeeded = false;
      let altMaxHp = 0;
      let altMaxDefense = defender.rawStats[defendingStat];
      let minPossibleDamage = Number(changeValsKeys[0]);
      //console.log("max def alt calc", damageVal, changeValsPossible, category);

      if(damageVal > Number(changeValsKeys[changeValsKeys.length - 1])){ //calculation is inconclusive.  don't do anything
        continue;
      }

      if(changeValsPossible[damageVal]){
        altMaxHp = changeValsPossible[damageVal][changeValsPossible[damageVal].length - 1];
      } else {
        defenseRecalcNeeded = true;
        altMaxHp = definiteMinHp;
      }

      /*
      if(defender.isDynamaxed) {
        altMaxHp *= 2;
      }
      */

      if(defenseRecalcNeeded){
        altMaxDefense = Math.floor(attackSource.stats[attackingStat] / calcADRatioRanges(replay, power, damageModsList, moveEvent, hit, altMaxHp, altMaxHp)[3]);
        altMaxDefense = unwrapStatMods(replay.gen, moveEvent, hit, defendingStat, altMaxDefense, "defender")[1];
      }

      //verify results
      defender.ivs[defendingStat] = altDefendingStatRanges[category].ivs[0];
      defender.evs[defendingStat] = 0;
      defender.rawStats[defendingStat] = Math.floor(defender.calcStat(generation, defendingStat) * natureMultipliers[category]);

      if(altMaxDefense < defender.rawStats[defendingStat]){
        altErrorDict[category] = true;
      } else { //stat range setting fails to account for transformed pokemon at the moment
        let unwrappedDefVals = unwrapRawStatEvsIvs(defender, defendingStat, altMaxDefense, category, realConstDefender.altDefensiveRanges[defendingStat][category].ivs, realConstDefender.altDefensiveRanges[defendingStat][category].evs);
        altDefendingStatRanges[category].ivs[1] = unwrappedDefVals[1][2];
        altDefendingStatRanges[category].evs[1] = unwrappedDefVals[1][1];
        let unwrappedHpVals = unwrapRawStatEvsIvs(defender, "hp", altMaxHp, category, baseConstDefender.altDefensiveRanges[defendingStat][category].hpivs, baseConstDefender.altDefensiveRanges[defendingStat][category].hpevs);
        altDefendingStatRanges[category].hpivs[1] = unwrappedHpVals[1][2];
        altDefendingStatRanges[category].hpevs[1] = unwrappedHpVals[1][1];

      }

    }

    for(let category in defendingStatRanges){ //primary range calculation

      defender.ivs.hp = defendingStatRanges[category].hpivs[1];
      defender.evs.hp = defendingStatRanges[category].hpevs[1];
      let maxHp = defender.calcStat(generation, "hp");

      /*
      if(defender.isDynamaxed) {
        maxHp *= 2;
      }
      */

      let maxDefense = Math.floor(attackSource.stats[attackingStat] / calcADRatioRanges(replay, power, damageModsList, moveEvent, hit, maxHp, maxHp)[3]);
      maxDefense = unwrapStatMods(replay.gen, moveEvent, hit, defendingStat, maxDefense, "defender")[1];

      defender.ivs[defendingStat] = defendingStatRanges[category].ivs[0];
      defender.evs[defendingStat] = 0;
      defender.rawStats[defendingStat] = Math.floor(defender.calcStat(generation, defendingStat) * natureMultipliers[category]);

      if(maxDefense < defender.rawStats[defendingStat]){ //need to adjust hp stat

        maxDefense = defender.rawStats[defendingStat];
        defender.stats[defendingStat] = getModifiedStat(defender.rawStats[attackingStat], defender.boosts[defendingStat], generation);
        defender.stats[defendingStat] = calculateDefenseSMSS(generation, attacker, defender, moveEvent.move, hit.field, {}, isCritical);
        let prevMinHp = definiteMinHp;
        let prevMaxHp = definiteMaxHp;

        defender.ivs.hp = defendingStatRanges[category].hpivs[0];
        defender.evs.hp = defendingStatRanges[category].hpevs[0];
        prevMinHp = defender.calcStat(generation, "hp");

        /*
        if(defender.isDynamaxed) {
          prevMinHp *= 2;
          prevMaxHp *= 2;
        }
        */

        damageModsList[4] = hit.maxRng; // need to set rng mod
        let damageVal = calcDamage(power, attacker.level, damageModsList, attackSource.stats[attackingStat], defender.stats[defendingStat]);
        let changeValsPossible = getPossibleChangeVals(hit.startHpsPossible, defender.hpsPossible, prevMinHp, prevMaxHp, baseConstDefender.hpsPossible);
        let changeValsKeys = Object.keys(changeValsPossible);
        let minPossibleDamage = Number(changeValsKeys[0]);

        //console.log("max def real calc", maxDefense, damageVal, changeValsPossible, category);

        if(damageVal > Number(changeValsKeys[changeValsKeys.length - 1])){ //inconclusive calculation
          continue;
        }

        if(changeValsPossible[damageVal]){ //same problem with transformed pkmn
          maxHp = changeValsPossible[damageVal][changeValsPossible[damageVal].length - 1];
        }

        else if (damageVal > minPossibleDamage && damageVal < Number(changeValsKeys[changeValsKeys.length - 1])) { //damage val was somewhere in the middle

          let keyNum = 0;

          while(keyNum < changeValsKeys.length - 1 && Number(changeValsKeys[keyNum + 1]) < damageVal) {
            keyNum++;
          }

          damageVal = changeValsKeys[keyNum];
          maxHp = changeValsPossible[damageVal][changeValsPossible[damageVal].length - 1];

        }

        else { //calculation error
          errorDict[category] = true;
        }

      }

      if(!errorDict[category]){

        let unwrappedDefVals = unwrapRawStatEvsIvs(defender, defendingStat, maxDefense, category, realConstDefender.statRanges[defendingStat][category].ivs, realConstDefender.statRanges[defendingStat][category].evs);
        defendingStatRanges[category].ivs[1] = unwrappedDefVals[1][2];
        defendingStatRanges[category].evs[1] = unwrappedDefVals[1][1];
        let unwrappedHpVals = unwrapRawStatEvsIvs(defender, "hp", maxHp, category, baseConstDefender.statRanges[defendingStat][category].hpivs, baseConstDefender.statRanges[defendingStat][category].hpevs);
        defendingStatRanges[category].hpivs[1] = unwrappedHpVals[1][2];
        defendingStatRanges[category].hpevs[1] = unwrappedHpVals[1][1];

      }

      if(Object.keys(errorDict).length == Object.keys(defendingStatRanges).length){ //both alt and primary ranges should error together if all of them fail
        flags.adRatioTooLow = true;
        flags.problem = "defender";
        invalidStat = true;
        console.log("The Attack / Defense Ratio is too low. (defender calc)  For now, nothing has been changed.");
      } else {

        for(let category in errorDict){
          delete defendingStatRanges[category];
        }

        for(let category in altErrorDict){
          delete altDefendingStatRanges[category];
        }

      }

    }

  }

  return [attackingStatRanges, defendingStatRanges, altDefendingStatRanges, backupHpStatRanges, altBackupHpStatRanges, flags, attackingStat, defendingStat];
}

function calcADRatioRanges(replay, power, damageModsList, moveEvent, hit, lowHp, highHp){
  const generation = new Generation(replay.gen);
  const moveEventClone = moveEvent.clone();
  let attacker = moveEvent.source;
  let defender = hit.defender;
  const constAttacker = replay.constantTeams[attacker.originalPlayer].pokemon[attacker.originalTeamIndex];
  const constDefender = replay.constantTeams[defender.originalPlayer].pokemon[defender.originalTeamIndex];

  let hpkeys = Object.keys(constDefender.hpsPossible);
  /*
  const hpStatRange = useAlt ? constDefender.altDefensiveRanges : constDefender.statRanges;
  defender.ivs.hp = hpStatRange.hp[maxNature].ivs[0];
  defender.evs.hp = hpStatRange.hp[maxNature].evs[0];
  let lowHp = defender.calcStat(generation, "hp");
  defender.ivs.hp = hpStatRange.hp[minNature].ivs[1];
  defender.evs.hp = hpStatRange.hp[minNature].evs[1];
  let highHp = defender.calcStat(generation, "hp");
  */

  if(!(lowHp in hit.startHpsPossible)){
    console.log(lowHp, hit);
  }

  let minBoundAtk = hit.startHpsPossible[lowHp][0] - defender.hpsPossible[lowHp][defender.hpsPossible[lowHp].length - 1];
  let minBoundDef = hit.startHpsPossible[lowHp][hit.startHpsPossible[lowHp].length - 1] - defender.hpsPossible[lowHp][0];
  let maxBoundAtk = hit.startHpsPossible[highHp][hit.startHpsPossible[highHp].length - 1] - defender.hpsPossible[highHp][0];
  let maxBoundDef = hit.startHpsPossible[highHp][0] - defender.hpsPossible[highHp][defender.hpsPossible[highHp].length - 1];
  //console.log([minBoundAtk, maxBoundAtk, minBoundDef, maxBoundDef]);

  for(let i = damageModsList.length - 1; i >= 0; i--){ //go backwards through the list and undo the mods

    if(i == 4){ //rng index or type effectiveness index
      maxBoundAtk = Math.floor((maxBoundAtk + 1)/hit.minRng);
      maxBoundDef = Math.ceil(maxBoundDef/hit.maxRng);
      minBoundAtk = Math.ceil(minBoundAtk/hit.maxRng);
      minBoundDef = Math.floor((minBoundDef + 1)/hit.minRng);
    }

    else if(i == 6 && damageModsList[i] % 1){
      maxBoundAtk = Math.floor((maxBoundAtk + 1)/damageModsList[i]) - 1;
      maxBoundDef = Math.ceil(maxBoundDef/damageModsList[i]);
      minBoundAtk = Math.ceil(minBoundAtk/damageModsList[i]);
      minBoundDef = Math.floor((minBoundDef + 1)/damageModsList[i]) - 1;
    }

    else if(damageModsList[i] % 1){
      maxBoundAtk = Math.floor((maxBoundAtk + 0.5)/damageModsList[i]);
      maxBoundDef = (maxBoundDef - 0.5)/damageModsList[i];
      minBoundAtk = (minBoundAtk - 0.5)/damageModsList[i];
      minBoundDef = Math.floor((minBoundDef + 0.5)/damageModsList[i]);

      //account for the fact that these mods are pokerounded
      maxBoundDef = maxBoundDef % 1 ? Math.ceil(maxBoundDef) : maxBoundDef + 1;
      minBoundAtk = minBoundAtk % 1 ? Math.ceil(minBoundAtk) : minBoundAtk + 1;
    }

    else { //damage modifier was divisible by 1
      maxBoundAtk = Math.floor(maxBoundAtk / damageModsList[i]);
      maxBoundDef /= damageModsList[i];
      minBoundAtk /= damageModsList[i];
      minBoundDef /= damageModsList[i];
    }

  }

  maxBoundAtk = 50 * (maxBoundAtk - 1.02) + 1;
  maxBoundDef = 50 * (maxBoundDef - 2);
  minBoundAtk = 50 * (minBoundAtk - 2);
  minBoundDef = 50 * (minBoundDef - 1.02) + 1;
  let divisor = Math.floor(0.4 * constAttacker.level + 2) * power;
  const output = [minBoundAtk, maxBoundAtk, minBoundDef, maxBoundDef];

  for(let i = 0; i < output.length; i++){
    output[i] /= divisor;
  }

  return output;
}

function calcDamage(power, level, damageModsList, attackingStat, defendingStat){

  let damage = Math.floor(0.02 * Math.floor(Math.floor(0.4 * level + 2) * power * attackingStat / defendingStat)) + 2;

  for(let i = 0; i < damageModsList.length; i++){
    damage *= damageModsList[i];

    if(i == 4 || i == 6){
      damage = Math.floor(damage);
    } else {
      damage = pokeRound(damage);
    }
  }

  return damage;
}

function getPossibleChangeVals(startHpsPossible, endHpsPossible, minHp, maxHp, constHpsPossible = endHpsPossible){
  const possibleChangeVals = {};
  //const dynamaxHpCheck = Number(Object.keys(constHpsPossible)[0]) * 2;
  //let isDynamaxed = dynamaxHpCheck in startHpsPossible || dynamaxHpCheck in endHpsPossible;

  for(let hp in constHpsPossible){

    /*
    if(isDynamaxed) {
      hp *= 2;
    }
    */

    if(hp < minHp || hp > maxHp){
      continue;
    }

    for(let i = 0; i < startHpsPossible[hp].length; i++){

      for(let j = 0; j < endHpsPossible[hp].length; j++){

        let changeVal = Math.abs(startHpsPossible[hp][i] - endHpsPossible[hp][j]);

        if(changeVal in possibleChangeVals){
          possibleChangeVals[changeVal].push(Number(hp));
        } else {
          possibleChangeVals[changeVal] = [Number(hp)];
        }

      }

    }

  }

  return possibleChangeVals;

}

function unwrapStatMods(gen, moveEvent, hit, statName, statValue, position){ //find min & max input stats
  let generation = new Generation(gen);
  let minBound = statValue;
  let maxBound = statValue;
  let attacker = moveEvent.source;
  let defender = hit.defender;
  let isCritical = "-crit" in hit.subEventIndexes;
  let noBoostMultiplier = false;
  let modsList = [4096];
  let boostTarget;

  if(position === "attacker") {

    modsList = calculateAtModsSMSS(generation, moveEvent.source, hit.defender, moveEvent.move, hit.field, {});
    boostTarget = attacker;
    if(isCritical && boostTarget.boosts[statName] < 0 || defender.hasAbility("Unaware")){
      noBoostMultiplier = true;
    }

  } else {

    modsList = calculateDfModsSMSS(generation, moveEvent.source, hit.defender, moveEvent.move, hit.field, {}, isCritical, moveEvent.move.defensiveCategory === "Physical");
    boostTarget = defender;

    if(isCritical && boostTarget.boosts[statName] > 0 || attacker.hasAbility("Unaware")){
      noBoostMultiplier = true;
    }

  }

  modsList = [chainMods(modsList) / 4096];

  if(moveEvent.source.hasAbility("Hustle") && moveEvent.move.category === "Physical" && position === "attacker" || hit.field.hasWeather("Sand") && moveEvent.source.hasType("Rock") && moveEvent.move.defensiveCategory != "Physical" && gen >= 4 && position === "defender") {
    modsList.push(1.5);
  }

  for(let i = 0; i < modsList.length; i++){

    if(modsList[i] % 1){
      minBound = (minBound - 0.5) / modsList[i];
      maxBound = Math.floor((maxBound + 0.5) / modsList[i]);

      minBound = minBound % 1 ? Math.ceil(minBound) : minBound + 1;

    } else {
      minBound /= modsList[i];
      maxBound /= modsList[i];
    }

  }

  if(!noBoostMultiplier && boostTarget.boosts[statName] != 0){

    let boostMultiplier = (Math.abs(boostTarget.boosts[statName]) / 2 + 1) ** (boostTarget.boosts[statName] / Math.abs(boostTarget.boosts[statName]));

    if(boostMultiplier % 1){
      minBound = Math.ceil(minBound / boostMultiplier)
      maxBound = Math.floor((maxBound + 1) / boostMultiplier)
    } else {
      minBound /= boostMultiplier;
      maxBound /= boostMultiplier;
    }

  }

  return [minBound, maxBound];

}

function buildDamageModsList(replay, attacker, defender, moveEvent, hit){

    const generation = new Generation(replay.gen);
    let modsList = [];

    if(moveEvent.targetPositions.length > 1 && moveEvent.move.target != "any"){ //check to see if spread modifier applies.

      let nonFaintedTargets = 0;

      for(let i in moveEvent.targetPositions){

        const position = moveEvent.targetPositions[i];

        if(moveEvent.teams[position.substring(0, 2)].pokemon[moveEvent.slots[position]].status != "fnt"){
          nonFaintedTargets += 1;
        }

      }

      if(nonFaintedTargets >= 1 && !(replay.gen === 3 && moveEvent.move.target === "allAdjacent")) {
        modsList.push(Object.keys(replay.constantTeams).length > 2 || replay.gen === 3 ? 0.5 : 0.75);
      } else {
        modsList.push(1);
      }

    } else {
      modsList.push(1);
    }

    if(hit.index == 1 && moveEvent.move.hits == 1 && modsList[0] == 1){ //parental bond 2nd hit
      modsList.push(generation.num == 6 ? 0.5 : 0.25);
    } else {
      modsList.push(1);
    }

    if(!defender.hasItem("Utility Umbrella")){ //check for weather mods

      if(moveEvent.move.hasType("Fire") && hit.field.hasWeather("Sun", "Harsh Sunshine") || moveEvent.move.hasType("Water") && hit.field.hasWeather("Rain", "Heavy Rain")){
        modsList.push(1.5);
      }

      else if(moveEvent.move.hasType("Fire") && hit.field.hasWeather("Rain") || moveEvent.move.hasType("Water") && hit.field.hasWeather("Sun")){
        modsList.push(0.5);
      }

      else {
        modsList.push(1);
      }

    } else {
      modsList.push(1);
    }

    if("-crit" in hit.subEventIndexes){ //critical hit modifier
      modsList.push(1.5);
    } else {
      modsList.push(1);
    }

    let rngIndex = modsList.length;
    modsList.push(1); //rng factor can be changed later

    if(attacker.hasType(moveEvent.move.type)){ //STAB
      modsList.push(attacker.hasAbility("Adaptability") ? 2 : 1.5);
    } else {
      modsList.push(1);
    }

    let typeEffectiveness = 1; //all results should be greater than 0, as the move has to actually do damage in order for a hit event to occur

    for(let i = 0; i < defender.types.length; i++){

      let currType = defender.types[i];
      let effectivenessMod = getMoveEffectiveness(generation, moveEvent.move, currType, true, "Gravity" in hit.field.fieldConditions, typeEffectiveness);

      if(effectivenessMod == 0){ //can't actually have effectivenessMods that are 0

        if(defender.item === "Iron Ball" && replay.gen >= 5){
          typeEffectiveness = 1;
          break;
        }
        effectivenessMod = 1;

      }

      //else if(effectivenessMod > 1 && currType === "Flying"){
        //typeEffectiveness /= 2;
      //}

      typeEffectiveness *= effectivenessMod;

    }

    modsList.push(typeEffectiveness);

    if(attacker.status === "brn" && moveEvent.move.category === "Physical" && !attacker.hasAbility("Guts") && moveEvent.move.name != "Facade"){
      modsList.push(0.5);
    } else {
      modsList.push(1);
    }

    let finalMods = chainMods(calculateFinalModsSMSS(generation, attacker, defender, moveEvent.move, hit.field, {}, "-crit" in hit.subEventIndexes, typeEffectiveness));

    modsList.push(finalMods/4096);

    if("-zbroken" in hit.subEventIndexes){
      modsList.push(0.25);
    }
    modsList.push(1);

    return modsList;

}

function unwrapRawStatEvsIvs(pokemon, statName, statValue, natureEffect, ivRanges){

  statValue = Number(statValue);
  let rangeMin = statValue;
  let rangeMax = statValue;

  if(statName === "hp"){

    /*
    if(pokemon.isDynamaxed) {
      rangeMin /= 2;
      rangeMax /= 2;
    }
    */

    rangeMin = rangeMax -= 10 + pokemon.level;

  } else {

    if(natureEffect != "neutral"){
      rangeMax += 1;
      const factor = natureEffect === "plus" ? 1.1 : 0.9;
      rangeMin = Math.ceil(rangeMin / factor);
      rangeMax = Math.ceil(rangeMax / factor - 1);
    }

    rangeMin -= 5;
    rangeMax -= 5;

  }

  if(pokemon.level != 100){
    rangeMax += 1;
  }

  rangeMin *= 100 / pokemon.level;
  rangeMax *= 100 / pokemon.level;
  rangeMin -= 2 * pokemon.species.baseStats[statName];
  rangeMax -= 2 * pokemon.species.baseStats[statName];

  if(pokemon.level != 100){
    rangeMin = Math.ceil(rangeMin);
    rangeMax = Math.ceil(rangeMax - 1);
  }

  const minIv = pokemon.gen.num <= 2 ? IVToDV(ivRanges[0]) * 2 : ivRanges[0];
  const maxIv = pokemon.gen.num <= 2 ? IVToDV(ivRanges[1]) * 2 : ivRanges[1];

  const overallMinEv = 0;
  const overallMaxEv = 63;
  let rangeMin1Ev = rangeMin - minIv;
  let rangeMin1Iv = minIv;

  if(rangeMin1Ev > overallMaxEv){ //not enough EVs to reach the desired stat
    rangeMin1Iv = rangeMin - overallMaxEv;
    rangeMin1Ev = overallMaxEv;
  }

  rangeMin1Ev *= 4;

  let rangeMin2Ev = rangeMin - maxIv;
  let rangeMin2Iv = maxIv;

  if(rangeMin2Ev < overallMinEv){ //too many IVs for the desired stat
    rangeMin2Iv = rangeMin;
    rangeMin2Ev = overallMinEv;
  }

  rangeMin2Ev *= 4;

  let rangeMax1Ev = rangeMax - minIv;
  let rangeMax1Iv = minIv;

  if(rangeMax1Ev > overallMaxEv){
    rangeMax1Iv = rangeMax - overallMaxEv;
    rangeMax1Ev = overallMaxEv;
  }

  rangeMax1Ev *= 4;

  let rangeMax2Ev = rangeMax - maxIv;
  let rangeMax2Iv = maxIv;

  if(rangeMax2Ev < overallMinEv){
    rangeMax2Iv = rangeMax;
    rangeMax2Ev = overallMinEv;
  }
  rangeMax2Ev *= 4;

  const rangeMinVals = [rangeMin1Iv, rangeMin1Ev, rangeMin2Iv, rangeMin2Ev]; //pair 1: max IV, min EV.  pair 2: min IV, max EV
  const rangeMaxVals = [rangeMax1Iv, rangeMax1Ev, rangeMax2Iv, rangeMax2Ev];

  return [rangeMinVals, rangeMaxVals];
}

function generateDefaultStatRanges(constPkmn, tier){
  let defaultMinEv = constPkmn.gen.num >= 3 ? 0 : 252;
  let defaultMaxEv = 252;
  let defaultMinIv = constPkmn.gen.num >= 3 ? 31 : 30;
  let defaultMaxIv = defaultMinIv;

  if(constPkmn.gen.num >= 3 && tier.endsWith("Random Battle")) {
    defaultMinEv = 84;
    defaultMaxEv = 84;
  }

  if(tier.includes("Challenge Cup")) {
    defaultMinIv = 0;
  }


  const hpIvRanges = [defaultMinIv, defaultMaxIv];
  const hpEvRanges = [defaultMinEv, defaultMaxEv];
  const hpKeys = Object.keys(constPkmn.hpsPossible);
  constPkmn.evs.hp = 0;
  constPkmn.ivs.hp = defaultMinIv;

  let defaultMinHp = constPkmn.calcStat(constPkmn.gen, "hp");
  while(!(defaultMinHp in constPkmn.hpsPossible) && defaultMinHp < Number(hpKeys[hpKeys.length - 1])){ //traverse up the hp values and find a new hp value if the default min isn't there
    defaultMinHp += 1;
  }

  statRanges = { //hp is bundled with defenses
    "atk": {
      "neutral": {ivs: [defaultMinIv, defaultMaxIv], evs: [defaultMinEv, defaultMaxEv]}
    },
    "def": {
      "neutral": {ivs: [defaultMinIv, defaultMaxIv], evs: [defaultMinEv, defaultMaxEv]}
    },
    "spa": {
      "neutral": {ivs: [defaultMinIv, defaultMaxIv], evs: [defaultMinEv, defaultMaxEv]}
    },
    "spd": {
      "neutral": {ivs: [defaultMinIv, defaultMaxIv], evs: [defaultMinEv, defaultMaxEv]}
    },
    "spe": {
      "neutral": {ivs: [defaultMinIv, defaultMaxIv], evs: [defaultMinEv, defaultMaxEv]}
    }
  };

  let trueMinHpVals = unwrapRawStatEvsIvs(constPkmn, "hp", hpKeys[0], "neutral", hpIvRanges, hpEvRanges);
  const hasNatures = constPkmn.gen.num >= 3 && !tier.endsWith("Random Battle");
  const minHpVals = unwrapRawStatEvsIvs(constPkmn, "hp", Number(hpKeys[0]) > defaultMinHp ? hpKeys[0] : defaultMinHp, "neutral", hpIvRanges, hpEvRanges);
  const maxHpVals = unwrapRawStatEvsIvs(constPkmn, "hp", hpKeys[hpKeys.length - 1], "neutral", hpIvRanges, hpEvRanges);
  const physUtilityMoves = ["Flip Turn", "Knock Off", "Rapid Spin", "U-Turn"];
  statRanges.def.neutral.hpivs = [minHpVals[0][0], maxHpVals[1][2]];
  statRanges.def.neutral.hpevs = [minHpVals[0][3], maxHpVals[1][1]];
  statRanges.spd.neutral.hpivs = [minHpVals[0][0], maxHpVals[1][2]];
  statRanges.spd.neutral.hpevs = [minHpVals[0][3], maxHpVals[1][1]];

  if(hasNatures) { //need to account for positive and negative natures

    for(let stat in statRanges){
      statRanges[stat].minus = {ivs: [...statRanges[stat].neutral.ivs], evs: [...statRanges[stat].neutral.evs]};
      statRanges[stat].plus = {ivs: [...statRanges[stat].neutral.ivs], evs: [...statRanges[stat].neutral.evs]};

      if("hpivs" in statRanges[stat].neutral){
        statRanges[stat].minus.hpivs = [...statRanges[stat].neutral.hpivs];
        statRanges[stat].minus.hpevs = [...statRanges[stat].neutral.hpevs];
        statRanges[stat].plus.hpivs = [...statRanges[stat].neutral.hpivs];
        statRanges[stat].plus.hpevs = [...statRanges[stat].neutral.hpevs];
      }

    }

    if(constPkmn.item === "Focus Sash"){ //some focus sash pokemon seem to run min ivs for defensive stats.  Also don't include plus because no one does plus with 0 ivs
      statRanges.def.neutral.hpivs[0] = trueMinHpVals[0][2];
      statRanges.def.neutral.hpevs[0] = trueMinHpVals[0][3];
      statRanges.def.minus.hpivs[0] = trueMinHpVals[0][2];
      statRanges.def.minus.hpevs[0] = trueMinHpVals[0][3];
      statRanges.spd.neutral.hpivs[0] = trueMinHpVals[0][2];
      statRanges.spd.neutral.hpevs[0] = trueMinHpVals[0][3];
      statRanges.spd.minus.hpivs[0] = trueMinHpVals[0][2];
      statRanges.spd.minus.hpevs[0] = trueMinHpVals[0][3];
      statRanges.def.neutral.ivs[0] = 0;
      statRanges.def.minus.ivs[0] = 0;
      statRanges.spd.neutral.ivs[0] = 0;
      statRanges.spd.minus.ivs[0] = 0;

    }

    if(constPkmn.species.baseStats.spe < 50 || "Trick Room" in constPkmn.replayMoves || "Gyro Ball" in constPkmn.replayMoves){ //check whether or not there is a decent chance of using 0 speed ivs
      statRanges.spe.minus.ivs[0] = 0;
    }

  } else {

    if(constPkmn.species.baseStats.spe < 50 || "Trick Room" in constPkmn.replayMoves || "Gyro Ball" in constPkmn.replayMoves){ //check whether or not there is a decent chance of using 0 speed ivs
      statRanges.spe.neutral.ivs[0] = 0;
    }

  }

  let setZero = true;//check whether or not pkmn has a high chance of using 0 atk ivs

  for(let move in constPkmn.replayMoves){
    if(constPkmn.replayMoves[move].category === "Physical" && !physUtilityMoves.includes(move)){
      setZero = false;
    }
  }

  if(setZero){

    if(hasNatures) {
      statRanges.atk.minus.ivs[0] = 0;
    } else {
      statRanges.atk.neutral.ivs[0] = 0;
    }

  }

  return statRanges;

}

function pokeRound(x){
  if(x - Math.floor(x) > 0.5){
    return Math.ceil(x);
  } else {
    return Math.floor(x);
  }
}

function findExtremeKey(statRangeObj, findMin){

  let extremeVal = findMin ? "minus" : "plus";

  if(!(extremeVal in statRangeObj)){

    if("neutral" in statRangeObj){
      extremeVal = "neutral";
    } else {
      extremeVal = findMin ? "plus" : "minus";
    }

  }

  return extremeVal;

}

function calcHitItemAbilityConstraints(analyzedReplay, moveEvent, pokemonActionsDict, hit, indexes, prevCompressedConstraints, slotIndex){

  const constraints = [];
  const slotKey = slotIndex < Object.keys(moveEvent.slots).length ? Object.keys(moveEvent.slots)[slotIndex] : null;

  if(slotKey && slotIndex < Object.keys(moveEvent.slots).length){ //there are still more pokemon to test out

    const currPlayer = slotKey.substring(0, 2);
    const currIndx = moveEvent.slots[slotKey];
    const currPkmn = moveEvent.teams[currPlayer].pokemon[currIndx];
    const oldAbility = currPkmn.ability;
    const oldAttackerAbility = moveEvent.source.ability;
    const oldDefenderAbility = hit.defender.ability;
    const baseConstPkmn = analyzedReplay.constantTeams[currPlayer].pokemon[currIndx];
    const realConstPkmn = "tempPlayer" in currPkmn.flags ? analyzedReplay.constantTeams[currPkmn.flags.tempPlayer].pokemon[currPkmn.flags.tempTeamIndex] : baseConstPkmn;
    const ability = "artificialAbility" in currPkmn.flags ? currPkmn.ability : realConstPkmn.ability;

    slotIndex += 1;

    if(currPkmn.ability != "Illuminate") {
      possibleAbilities = {};
      possibleAbilities[currPkmn.ability] = currPkmn.ability;
    }

    else if("artificialAbility" in currPkmn.flags && currPkmn.flags.artificialAbility != "neutralizing_gas_temp") { //it's possible to not know the current pokemon's ability, even if it is artificial (e.g. skill swap was used among allies)

      possibleAbilities = {};

      for(let slot in moveEvent.slots) { //panick and just give this pokemon all the possible abilities on its side of the field

        if(slot.startsWith(currPlayer)) {

          for(let ability in analyzedReplay.overallConstraints[currPlayer][moveEvent.slots[slot]].abilities) {
            possibleAbilities[ability] = ability;
          }

        }

      }

    }

    else if(currPlayer in prevCompressedConstraints && currIndx in prevCompressedConstraints[currPlayer]) {
      possibleAbilities = prevCompressedConstraints[currPlayer][currIndx].abilities;
    }

    else {
      possibleAbilities = realConstPkmn.speciesPossibleAbilities;
    }

    for(let ability in possibleAbilities) { //recurse through each possible ability

      moveEvent.teams[currPlayer].pokemon[currIndx].ability = ability;

      if(moveEvent.source.originalPlayer === currPlayer && moveEvent.source.originalTeamIndex == currIndx) {
        moveEvent.source.ability = ability;
      }

      if(hit.defender.originalPlayer === currPlayer && hit.defender.originalTeamIndex == currIndx) {
        hit.defender.ability = ability;
      }

      const additionalConstraints = calcHitItemAbilityConstraints(analyzedReplay, moveEvent, pokemonActionsDict, hit, indexes, prevCompressedConstraints, slotIndex);

      for(let i in additionalConstraints){
        constraints.push(additionalConstraints[i]);
      }

    }

    moveEvent.teams[currPlayer].pokemon[currIndx].ability = oldAbility;
    moveEvent.source.ability = oldAttackerAbility;
    hit.defender.ability = oldDefenderAbility;

  } else { //loop through pokemon items and create constraint objects

    const move = moveEvent.move;
    const attacker = moveEvent.source;
    const defender = hit.defender;
    console.log(attacker.ability, defender.ability);
    let type;
    let hasAteAbilityTypeChange;
    [type, hasAteAbilityTypeChange] = getMoveTypeSMSS(attacker.gen, attacker, defender, move, hit.field);
    const baseConstAttacker = analyzedReplay.constantTeams[attacker.originalPlayer].pokemon[attacker.originalTeamIndex];
    const baseConstDefender = analyzedReplay.constantTeams[defender.originalPlayer].pokemon[defender.originalTeamIndex];
    //generate possible damage boosting items
    let boostItemList = ["artificialItem" in attacker.flags ? attacker.item : baseConstAttacker.item];
    //initialize with a default item that does nothing
    let reductionItemList = ["artificialItem" in defender.flags ? defender.item : baseConstDefender.item];
    const boostItemsPossible = uniqueDmgBoostItems[analyzedReplay.gen];
    const reductionItemsPossible = uniqueDmgReductionItems[analyzedReplay.gen];

    if(baseConstAttacker.originalPlayer in prevCompressedConstraints && baseConstAttacker.originalTeamIndex in prevCompressedConstraints[baseConstAttacker.originalPlayer] && !("artificialItem" in attacker.flags)) {

      const itemList = prevCompressedConstraints[baseConstAttacker.originalPlayer][baseConstAttacker.originalTeamIndex].abilities["artificialAbility" in attacker.flags ? baseConstAttacker.ability : attacker.ability];

      if(!("Mail" in itemList)) {
        boostItemList = Object.keys(itemList);
      } else {
        boostItemList = ["Mail"];
      }

    }

    if(baseConstDefender.originalPlayer in prevCompressedConstraints && baseConstDefender.originalTeamIndex in prevCompressedConstraints[baseConstDefender.originalPlayer] && !("artificialItem" in defender.flags)) {

      const itemList = prevCompressedConstraints[baseConstDefender.originalPlayer][baseConstDefender.originalTeamIndex].abilities["artificialAbility" in defender.flags ? baseConstDefender.ability : defender.ability];

      if(!itemList) {
        console.log(defender, baseConstDefender, prevCompressedConstraints[baseConstDefender.originalPlayer][baseConstDefender.originalTeamIndex]);
      }

      if(!("Mail" in itemList)) {
        reductionItemList = Object.keys(itemList);
      } else {
        reductionItemList = ["Mail"];
      }

    }

    if(boostItemList[0] === "Mail") { //need to test attacker items

      for(let item in boostItemsPossible["Damage"]) {

        if(item === "Expert Belt") {

          if("-supereffective" in hit.subEventIndexes) {
            boostItemList.push(item);
          }

        }

        else if(item === "Metronome") {

          if(move.timesUsedWithMetronome > 0) {
            boostItemList.push(item);
          }

        }

        else if(!(item in baseConstAttacker.impossibleItems)) {
          boostItemList.push(item);
        }

      }

      for(let item in boostItemsPossible[type]) {

        if(item === "Pokemon") {

          if(boostItemsPossible[type]["Pokemon"][baseConstAttacker.name]){

            for(let specialItem in boostItemsPossible[type]["Pokemon"][baseConstAttacker.name]){

              if(!(specialItem in baseConstAttacker.impossibleItems)) {
                boostItemList.push(specialItem);
              }

            }

          }

        }

        else if(!(item in baseConstAttacker.impossibleItems)) {
          boostItemList.push(item);
        }

      }

      for(let item in boostItemsPossible[move.category]) {

        if(item === "Pokemon") {

          if(boostItemsPossible[move.category]["Pokemon"][baseConstAttacker.name])

            for(let specialItem in boostItemsPossible[move.category]["Pokemon"][baseConstAttacker.name]) {

              if(!(specialItem in baseConstAttacker.impossibleItems)) {
                boostItemList.push(specialItem);
              }

            }

        }

        else if(!(item in baseConstAttacker.impossibleItems)) {
          boostItemList.push(item);
        }

      }

    }

    if(reductionItemList[0] === "Mail") { //need to test defender items

      for(let item in reductionItemsPossible[move.defensiveCategory]){

        if(item === "Pokemon") {

          if(reductionItemsPossible[move.defensiveCategory]["Pokemon"][baseConstDefender.name]){

            for(let specialItem in reductionItemsPossible[move.defensiveCategory]["Pokemon"][baseConstDefender.name]) {

              if(!(specialItem in baseConstDefender.impossibleItems)) {

                if(baseConstDefender === "Ditto" && analyzedReplay.gen >= 3 && "tempPlayer" in defender.flags){ //transformation offsets effect of ditto's special items
                  continue;
                }

                reductionItemList.push(specialItem);

              }

            }

          }

        }

        else if(item === "Eviolite") {

          if("nfe" in baseConstDefender.species && !(item in baseConstDefender.impossibleItems)){
            reductionItemList.push(item);
          }

        }

        else if(!(item in baseConstDefender.impossibleItems)) {
          reductionItemList.push(item);
        }


      }

    }

    const oldAttackerItem = attacker.item;
    const oldDefenderItem = defender.item;

    for(let i in boostItemList) {

      attacker.item = boostItemList[i];
      moveEvent.teams[attacker.originalPlayer].pokemon[attacker.originalTeamIndex].item = boostItemList[i];

      for(let j in reductionItemList) {

        defender.item = reductionItemList[j];
        //console.log(attacker.item, defender.item);
        moveEvent.teams[defender.originalPlayer].pokemon[defender.originalTeamIndex].item = reductionItemList[j];

        let rangeInfo = calcADStatRanges(analyzedReplay, moveEvent, pokemonActionsDict, hit, indexes);
        //console.log(rangeInfo);
        let flags = rangeInfo[rangeInfo.length - 3];

        if("adRatioTooHigh" in flags || "adRatioTooLow" in flags) { //bad item combo
          continue;
        }//need to generate constraint

        const constraint = {};

        for(let player in analyzedReplay.constantTeams){

          constraint[player] = {};

        }

        for(let pos in moveEvent.slots){

          const constraintMon = moveEvent.teams[pos.substring(0, 2)].pokemon[moveEvent.slots[pos]];
          constraint[pos.substring(0, 2)][moveEvent.slots[pos]] = {"ability": constraintMon.ability, "item": constraintMon.item};

          if("artificialAbility" in constraintMon.flags) {
            constraint[pos.substring(0, 2)][moveEvent.slots[pos]].artificialAbility = true;
          }

          if("artificialItem" in constraintMon.flags) {
            constraint[pos.substring(0, 2)][moveEvent.slots[pos]].artificialItem = true;
          }

        }

        let alreadyPushed = false;

        if("tempPlayer" in attacker.flags || "artificialAbility" in attacker.flags) {

          if(baseConstAttacker.ability != "Illuminate") {

            constraint[attacker.originalPlayer][attacker.originalTeamIndex].ability = baseConstAttacker.ability;

          } else {

            alreadyPushed = true;

            for(let ability in baseConstAttacker.speciesPossibleAbilities) {

              constraint[attacker.originalPlayer][attacker.originalTeamIndex].ability = ability;
              constraints.push({...constraint});

            }

          }

        }

        if("tempPlayer" in defender.flags || "artificialAbility" in defender.flags) {

          if(baseConstDefender.ability != "Illuminate") {

            constraint[defender.originalPlayer][defender.originalTeamIndex].ability = baseConstDefender.ability;

          } else {

            alreadyPushed = true;

            for(let ability in baseConstDefender.speciesPossibleAbilities) {

              constraint[defender.originalPlayer][defender.originalTeamIndex].ability = ability;
              constraints.push({...constraint});

            }

          }

        }

        if(!alreadyPushed) {
          constraints.push(constraint);
        }

      }

    }

  attacker.item = oldAttackerItem;
  defender.item = oldDefenderItem;
  moveEvent.teams[attacker.originalPlayer].pokemon[attacker.originalTeamIndex].item = oldAttackerItem;
  moveEvent.teams[defender.originalPlayer].pokemon[defender.originalTeamIndex].item = oldDefenderItem;

  }

  return constraints;

}

function getMergedCompressedConstraintsList(compressedList1, compressedList2) {

  const outputList = JSON.parse(JSON.stringify(compressedList1));
  //console.log(compressedList1, compressedList2);

  for(let player in compressedList2) {

    for(let pkmnIndx in compressedList2[player]) {

      if(!(pkmnIndx in compressedList1[player])) {
        outputList[player][pkmnIndx] = JSON.parse(JSON.stringify(compressedList2[player][pkmnIndx]));
        continue;
      }

      const currPkmn1 = compressedList1[player][pkmnIndx];
      const currPkmn2 = compressedList2[player][pkmnIndx];

      if("artificialAbility" in currPkmn1) {
        outputList[player][pkmnIndx].abilities = JSON.parse(JSON.stringify(currPkmn2.abilities));

        if(!("artificialItem" in currPkmn1)) {

          let currPkmn1ability = Object.keys(currPkmn1.abilities)[0];

          for(let ability1 in currPkmn1.abilities) {

            if(!(ability1 in currPkmn2.abilities)) {
              continue;
            }

            for(let ability2 in currPkmn2.abilities) {

              outputList[player][pkmnIndx].abilities[ability2] = JSON.parse(JSON.stringify(currPkmn1.abilities[ability1]));

            }

          }

        }

      }

      else if(!("artificialAbility" in currPkmn2)) {

        for(let ability in currPkmn1.abilities) {

          if(!(ability in currPkmn2.abilities)) {
            delete outputList[player][pkmnIndx].abilities[ability];
          }

        }

      }

      if("artificialItem" in currPkmn1) {

        for(let ability in outputList[player][pkmnIndx].abilities) {

          let currPkmn2ability = "artificialAbility" in currPkmn2 ? Object.keys(currPkmn2.abilities)[0] : ability;
          outputList[player][pkmnIndx].abilities[ability] = {...currPkmn2.abilities[currPkmn2ability]};
        }

      }

      else if(!("artificialItem" in currPkmn2)) {

        for(let ability in outputList[player][pkmnIndx].abilities) {

          let currPkmn1ability = "artificialAbility" in currPkmn1 ? Object.keys(currPkmn1.abilities)[0] : ability;
          let currPkmn2ability = "artificialAbility" in currPkmn2 ? Object.keys(currPkmn2.abilities)[0] : ability;

          for(let item in currPkmn2.abilities[currPkmn2ability]) {

            if("Mail" in currPkmn1.abilities[currPkmn1ability] || item in currPkmn1.abilities[currPkmn1ability]) { //combine ban dictionaries

              const banDict2 = currPkmn2.abilities[currPkmn2ability][item];

              if(!(item in outputList[player][pkmnIndx].abilities[ability])) {
                outputList[player][pkmnIndx].abilities[ability][item] = JSON.parse(JSON.stringify(banDict2));
              }


              for(let ban in banDict2) {

                outputList[player][pkmnIndx].abilities[ability][item][ban] = 1;
              }

            }

          }

          for(let item in currPkmn1.abilities[currPkmn1ability]) {

            if(!("Mail" in currPkmn2.abilities[currPkmn2ability] || item in currPkmn2.abilities[currPkmn2ability])) {
              delete outputList[player][pkmnIndx].abilities[ability][item];
            }

          }


        }

      }

    }

  }

  return outputList;

}

function getCompressedConstraintsList(constraintsList) { //turns constraint list into an object (which loses some info, but is more useful in some cases)

  const constraintsObj = {};

  if(constraintsList.length == 0){
    return constraintsObj;
  }

  for(let player in constraintsList[0]) {

    constraintsObj[player] = {};

    for(let pkmnIndex in constraintsList[0][player]) {

      constraintsObj[player][pkmnIndex] = {};
      constraintsObj[player][pkmnIndex].abilities = {}; //abilities: {item1: 1, item2: 1};

    }

  }

  for(let i = 0; i < constraintsList.length; i++){

    for(let player in constraintsList[i]) {

      for(let pkmnIndex in constraintsList[i][player]) {

        const currPkmn = constraintsList[i][player][pkmnIndex];
        const abilitiesObj = constraintsObj[player][pkmnIndex].abilities;

        if(!(currPkmn.ability in abilitiesObj)) {
          abilitiesObj[currPkmn.ability] = {};
        }

        abilitiesObj[currPkmn.ability][currPkmn.item] = {}; //dict of failure json objects

        if("artificialAbility" in currPkmn) {
          constraintsObj[player][pkmnIndex].artificialAbility = true;
        }

        if("artificialItem" in currPkmn) {
          constraintsObj[player][pkmnIndex].artificialItem = true;
        }

      }

    }

  }

  return constraintsObj;

}

function mergeStatRanges(ranges, analyzedReplay, moveEvent, hit, targetsToMerge) { //returns whether or not it succeeds

  const constPkmn = analyzedReplay.constantTeams[moveEvent.source.originalPlayer].pokemon[moveEvent.source.originalTeamIndex];
  const baseConstDefender = analyzedReplay.constantTeams[hit.defender.originalPlayer].pokemon[hit.defender.originalTeamIndex];
  const realConstPkmn = "tempPlayer" in moveEvent.source.flags ? analyzedReplay.constantTeams[moveEvent.source.flags.tempPlayer].pokemon[moveEvent.source.flags.tempTeamIndex] : constPkmn;
  const realConstDefender = "tempPlayer" in hit.defender.flags ? analyzedReplay.constantTeams[hit.defender.flags.tempPlayer].pokemon[hit.defender.flags.tempTeamIndex] : baseConstDefender;
  const constAttackSource = moveEvent.move.named("Foul Play") ? realConstDefender : realConstPkmn;

  const attackingStat = ranges[ranges.length - 2];
  const defendingStat = ranges[ranges.length - 1];
  const otherDefendingStat = defendingStat === "def" ? "spd" : "def";
  //console.log(ranges);

  //set attack ranges
  if(targetsToMerge === 1 || targetsToMerge === 3) {

    for(let category in constAttackSource.statRanges[attackingStat]){

      if(!(category in ranges[0])){
        delete constAttackSource.statRanges[attackingStat][category];
        continue;
      }

      const currStatCategory = constAttackSource.statRanges[attackingStat][category];
      const prevMinStatSum = currStatCategory.ivs[0] + currStatCategory.evs[0];
      const prevMaxStatSum = currStatCategory.ivs[1] + currStatCategory.evs[1];
      const minStatSum = ranges[0][category].ivs[0] + ranges[0][category].evs[0];
      const maxStatSum = ranges[0][category].ivs[1] + ranges[0][category].evs[1];

      if(minStatSum > prevMinStatSum){
        currStatCategory.ivs[0] = ranges[0][category].ivs[0];
        currStatCategory.evs[0] = ranges[0][category].evs[0];
      }

      if(maxStatSum < prevMaxStatSum){
        currStatCategory.ivs[1] = ranges[0][category].ivs[1];
        currStatCategory.evs[1] = ranges[0][category].evs[1];
      }

      if(currStatCategory.evs[1] < currStatCategory.evs[0]) {
        console.log(moveEvent, "minimum evs are higher than maximum evs", attackingStat);
        return -1;
      }

    }

    if(Object.keys(constAttackSource.statRanges[attackingStat]).length == 0) {
      console.log(moveEvent, "all attacking stat ranges were removed", attackingStat);
      return -1;
    }

  }

  //set defense ranges
  if(targetsToMerge === 2 || targetsToMerge === 3) {
    let minDefCategory = findExtremeKey(ranges[1], true);
    let maxDefCategory = findExtremeKey(ranges[1], false);
    let baseDefStatRange = baseConstDefender.statRanges[defendingStat];

    for(let category in realConstDefender.statRanges[defendingStat]){

      if(!(category in ranges[1])){
        delete realConstDefender.statRanges[defendingStat][category];
        continue;
      }

      /*
      if("tempPlayer" in hit.defender.flags){ //skip for now because transformed mons aren't handled properly
        continue;
      }
      */

      const currStatCategory = realConstDefender.statRanges[defendingStat][category];
      const prevMinDefStatSum = currStatCategory.ivs[0] + currStatCategory.evs[0];
      const prevMaxDefStatSum = currStatCategory.ivs[1] + currStatCategory.evs[1];
      let prevMinHpStatSum;
      let prevMaxHpStatSum;
      const minDefStatSum = ranges[1][category].ivs[0] + ranges[1][category].evs[0];
      const maxDefStatSum = ranges[1][category].ivs[1] + ranges[1][category].evs[1];
      const minHpStatSum = ranges[1][category].hpivs[0] + ranges[1][category].hpevs[0];
      const maxHpStatSum = ranges[1][category].hpivs[1] + ranges[1][category].hpevs[1];

      if("tempPlayer" in hit.defender.flags) {

        prevMinHpStatSum = baseDefStatRange[maxDefCategory].ivs[0] + baseDefStatRange[maxDefCategory].evs[0];
        prevMaxHpStatSum = baseDefStatRange[minDefCategory].ivs[1] + baseDefStatRange[minDefCategory].evs[1];

      } else {

        prevMinHpStatSum = currStatCategory.hpivs[0] + currStatCategory.hpevs[0];
        prevMaxHpStatSum = currStatCategory.hpivs[1] + currStatCategory.hpevs[1];

      }

      //temp player ranges are handled later
      if(minDefStatSum > prevMinDefStatSum) {
        currStatCategory.ivs[0] = ranges[1][category].ivs[0];
        currStatCategory.evs[0] = ranges[1][category].evs[0];
      }

      if(!("tempPlayer" in hit.defender.flags) && minHpStatSum > prevMinHpStatSum) {
        currStatCategory.hpivs[0] = ranges[1][category].hpivs[0];
        currStatCategory.hpevs[0] = ranges[1][category].hpevs[0];
      }

      if(maxDefStatSum < prevMaxDefStatSum) {
        currStatCategory.ivs[1] = ranges[1][category].ivs[1];
        currStatCategory.evs[1] = ranges[1][category].evs[1];
      }

      if(!("tempPlayer" in hit.defender.flags) && maxHpStatSum < prevMaxHpStatSum) {
        currStatCategory.hpivs[1] = ranges[1][category].hpivs[1];
        currStatCategory.hpevs[1] = ranges[1][category].hpevs[1];
      }

      /*

      if(minDefStatSum + minHpStatSum > prevMinDefStatSum + prevMinHpStatSum){
        currStatCategory.ivs[0] = ranges[1][category].ivs[0];
        currStatCategory.evs[0] = ranges[1][category].evs[0];

        if(!("tempPlayer" in hit.defender.flags)) { //these will get handled later
          currStatCategory.hpivs[0] = ranges[1][category].hpivs[0];
          currStatCategory.hpevs[0] = ranges[1][category].hpevs[0];
        }


      }

      if(maxDefStatSum + maxHpStatSum < prevMaxDefStatSum + prevMaxHpStatSum){
        currStatCategory.ivs[1] = ranges[1][category].ivs[1];
        currStatCategory.evs[1] = ranges[1][category].evs[1];

        if(!("tempPlayer" in hit.defender.flags)) {
          currStatCategory.hpivs[1] = ranges[1][category].hpivs[1];
          currStatCategory.hpevs[1] = ranges[1][category].hpevs[1];
        }

      }
      */

      if(currStatCategory.hpevs[1] < currStatCategory.hpevs[0] || currStatCategory.evs[1] < currStatCategory.evs[0]) {
        console.log(moveEvent, "minimum defensive evs are higher than maximum defensive evs", defendingStat);
        return -2;
      }

    }

    if(Object.keys(realConstDefender.statRanges[defendingStat]).length == 0) {
      console.log(moveEvent, "all defending stat ranges were removed", defendingStat);
      return -2;
    }

    if("tempPlayer" in hit.defender.flags) { //account for possible hp shifts based on calculations

      for(let category in baseConstDefender.statRanges[defendingStat]) {

        const currStatCategory = baseConstDefender.statRanges[defendingStat][category];

        if(ranges[1][maxDefCategory].hpivs[0] + ranges[1][maxDefCategory].hpevs[0] > currStatCategory.hpivs[0] + currStatCategory.hpevs[0]) {
          currStatCategory.hpivs[0] = ranges[1][maxDefCategory].hpivs[0];
          currStatCategory.hpevs[0] = ranges[1][maxDefCategory].hpevs[0];
        }

        if(ranges[1][minDefCategory].hpivs[1] + ranges[1][minDefCategory].hpevs[1] < currStatCategory.hpivs[1] + currStatCategory.hpevs[1]) {
          currStatCategory.hpivs[1] = ranges[1][minDefCategory].hpivs[1];
          currStatCategory.hpevs[1] = ranges[1][minDefCategory].hpevs[1];
        }

        if(currStatCategory.hpevs[1] < currStatCategory.hpevs[0]) {
          console.log(moveEvent, "minimum defensive evs are higher than maximum defensive evs", defendingStat);
          return -2;
        }

      }

    }

    //set alt defense ranges

    minDefCategory = findExtremeKey(ranges[2], true);
    maxDefCategory = findExtremeKey(ranges[2], false);
    baseDefStatRange = baseConstDefender.altDefensiveRanges[defendingStat];

    for(let category in realConstDefender.altDefensiveRanges[defendingStat]){

      if(!(category in ranges[2])){
        delete realConstDefender.altDefensiveRanges[defendingStat][category];
        continue;
      }

      /*
      if("tempPlayer" in hit.defender.flags){ //skip for now
        continue;
      }
      */

      const currStatCategory = realConstDefender.altDefensiveRanges[defendingStat][category];
      const prevMinDefStatSum = currStatCategory.ivs[0] + currStatCategory.evs[0];
      const prevMaxDefStatSum = currStatCategory.ivs[1] + currStatCategory.evs[1];
      let prevMinHpStatSum;
      let prevMaxHpStatSum;
      const minDefStatSum = ranges[2][category].ivs[0] + ranges[2][category].evs[0];
      const maxDefStatSum = ranges[2][category].ivs[1] + ranges[2][category].evs[1];
      const minHpStatSum = ranges[2][category].hpivs[0] + ranges[2][category].hpevs[0];
      const maxHpStatSum = ranges[2][category].hpivs[1] + ranges[2][category].hpevs[1];

      if("tempPlayer" in hit.defender.flags) {

        prevMinHpStatSum = baseDefStatRange[maxDefCategory].ivs[0] + baseDefStatRange[maxDefCategory].evs[0];
        prevMaxHpStatSum = baseDefStatRange[minDefCategory].ivs[1] + baseDefStatRange[minDefCategory].evs[1];

      } else {

        prevMinHpStatSum = currStatCategory.hpivs[0] + currStatCategory.hpevs[0];
        prevMaxHpStatSum = currStatCategory.hpivs[1] + currStatCategory.hpevs[1];

      }

      if(minDefStatSum > prevMinDefStatSum) {
        currStatCategory.ivs[0] = ranges[2][category].ivs[0];
        currStatCategory.evs[0] = ranges[2][category].evs[0];
      }

      if(!("tempPlayer" in hit.defender.flags) && minHpStatSum > prevMinHpStatSum) {
        currStatCategory.hpivs[0] = ranges[2][category].hpivs[0];
        currStatCategory.hpevs[0] = ranges[2][category].hpevs[0];
      }

      if(maxDefStatSum < prevMaxDefStatSum) {
        currStatCategory.ivs[1] = ranges[2][category].ivs[1];
        currStatCategory.evs[1] = ranges[2][category].evs[1];
      }

      if(!("tempPlayer" in hit.defender.flags) && maxHpStatSum < prevMaxHpStatSum) {
        currStatCategory.hpivs[1] = ranges[2][category].hpivs[1];
        currStatCategory.hpevs[1] = ranges[2][category].hpevs[1];
      }

      /*
      if(minDefStatSum + minHpStatSum > prevMinDefStatSum + prevMinHpStatSum){
        currStatCategory.ivs[0] = ranges[2][category].ivs[0];
        currStatCategory.evs[0] = ranges[2][category].evs[0];

        if(!("tempPlayer" in hit.defender.flags)) {
          currStatCategory.hpivs[0] = ranges[2][category].hpivs[0];
          currStatCategory.hpevs[0] = ranges[2][category].hpevs[0];
        }

      }

      if(maxDefStatSum + maxHpStatSum < prevMaxDefStatSum + prevMaxHpStatSum){
        currStatCategory.ivs[1] = ranges[2][category].ivs[1];
        currStatCategory.evs[1] = ranges[2][category].evs[1];

        if(!("tempPlayer" in hit.defender.flags)) {
          currStatCategory.hpivs[1] = ranges[2][category].hpivs[1];
          currStatCategory.hpevs[1] = ranges[2][category].hpevs[1];
        }

      }
      */

    }

    if("tempPlayer" in hit.defender.flags) { //account for possible hp shifts based on calculations

      for(let category in baseConstDefender.altDefensiveRanges[defendingStat]) {

        const currStatCategory = baseConstDefender.altDefensiveRanges[defendingStat][category];

        if(ranges[2][maxDefCategory].hpivs[0] + ranges[2][maxDefCategory].hpevs[0] > currStatCategory.hpivs[0] + currStatCategory.hpevs[0]) {
          currStatCategory.hpivs[0] = ranges[2][maxDefCategory].hpivs[0];
          currStatCategory.hpevs[0] = ranges[2][maxDefCategory].hpevs[0];
        }

        if(ranges[2][minDefCategory].hpivs[1] + ranges[2][minDefCategory].hpevs[1] < currStatCategory.hpivs[1] + currStatCategory.hpevs[1]) {
          currStatCategory.hpivs[1] = ranges[2][minDefCategory].hpivs[1];
          currStatCategory.hpevs[1] = ranges[2][minDefCategory].hpevs[1];
        }

      }

    }

    const maxKey = findExtremeKey(baseConstDefender.altDefensiveRanges[defendingStat], false);
    const minKey = findExtremeKey(baseConstDefender.statRanges[defendingStat], true);
    let lowHpCheck = baseConstDefender.altDefensiveRanges[defendingStat][maxKey].hpevs[0];
    let lowHpCheckIvs = baseConstDefender.altDefensiveRanges[defendingStat][maxKey].hpivs[0];
    let highHpCheck = baseConstDefender.statRanges[defendingStat][minKey].hpevs[1];

    for(let category in baseConstDefender.statRanges[otherDefendingStat]) {

      const currStatCategory = baseConstDefender.statRanges[otherDefendingStat][category];

      if(currStatCategory.hpevs[0] < lowHpCheck) {
        currStatCategory.hpevs[0] = lowHpCheck;
      }

      if(currStatCategory.hpevs[1] > highHpCheck) {
        currStatCategory.hpevs[1] = highHpCheck;
      }

      if(currStatCategory.hpevs[0] > currStatCategory.hpevs[1]) {
        console.log(moveEvent, "minimum defensive evs are higher than maximum defensive evs", defendingStat);
        return -2;
      }

    }

    for(let category in baseConstDefender.altDefensiveRanges[otherDefendingStat]) {

      const currStatCategory = baseConstDefender.altDefensiveRanges[otherDefendingStat][category];

      if(currStatCategory.hpevs[0] < lowHpCheck) {
        currStatCategory.hpevs[0] = lowHpCheck;
      }

      if(currStatCategory.hpevs[1] > highHpCheck) {
        currStatCategory.hpevs[1] = highHpCheck;
      }

    }
  }

  return true;

}

function calcHitStatRanges(analyzedReplay, indexes) {

  let turn = analyzedReplay.turns[indexes[0]];
  let moveEvent = turn.events[indexes[1]];
  let hit = moveEvent.hits[indexes[2]];
  const constPkmn = analyzedReplay.constantTeams[moveEvent.source.originalPlayer].pokemon[moveEvent.source.originalTeamIndex];
  const baseConstDefender = analyzedReplay.constantTeams[hit.defender.originalPlayer].pokemon[hit.defender.originalTeamIndex];
  const realConstPkmn = "tempPlayer" in moveEvent.source.flags ? analyzedReplay.constantTeams[moveEvent.source.flags.tempPlayer].pokemon[moveEvent.source.flags.tempTeamIndex] : constPkmn;
  const realConstDefender = "tempPlayer" in hit.defender.flags ? analyzedReplay.constantTeams[hit.defender.flags.tempPlayer].pokemon[hit.defender.flags.tempTeamIndex] : baseConstDefender;
  //const constAttackSource = moveEvent.move.named("Foul Play") ? realConstDefender : realConstPkmn;

  if(!moveEvent.source.definitelyReal || !hit.defender.definitelyReal) { //don't do things with pkmn with unsure identities
    return [];
  }

  if(!("artificialItem" in moveEvent.source.flags)){
    moveEvent.source.item = constPkmn.item;
  }

  if(!("artificialItem" in hit.defender.flags)){
    hit.defender.item = baseConstDefender.item;
  }

  if(!("artificialAbility" in moveEvent.source.flags)){
    moveEvent.source.ability = realConstPkmn.ability;
  }

  if(!("artificialAbility" in hit.defender.flags)){
    hit.defender.ability = realConstDefender.ability;
  }

  //console.log(indexes);
  let ranges = calcADStatRanges(analyzedReplay, moveEvent, turn.pokemonActionsDict, hit, indexes);

  if("adRatioTooHigh" in ranges[ranges.length - 3] || "adRatioTooLow" in ranges[ranges.length - 3]){
    return [false, ranges[ranges.length - 3], ranges[ranges.length - 2], ranges[ranges.length - 1]];
  }

  return ranges;

}

function resetPkmnStatRanges(constPkmn, tier) {

  constPkmn.statRanges = generateDefaultStatRanges(constPkmn, tier);
  constPkmn.altDefensiveRanges = {};
  constPkmn.altDefensiveRanges.def = {};
  constPkmn.altDefensiveRanges.spd = {};

  for(let stat in constPkmn.altDefensiveRanges){

    for(let category in constPkmn.statRanges[stat]){

      constPkmn.altDefensiveRanges[stat][category] = {ivs: [...constPkmn.statRanges[stat][category].ivs], evs: [...constPkmn.statRanges[stat][category].evs], hpivs: [...constPkmn.statRanges[stat][category].hpivs], hpevs: [...constPkmn.statRanges[stat][category].hpevs]};

    }

  }

}


function resetStatRangesAndConstraints(analyzedReplay) {

  analyzedReplay.overallConstraints = {};
  analyzedReplay.baselineStatRanges = {};
  //analyzedReplay.backupStats = {};
  analyzedReplay.backupMergedStats = {};
  analyzedReplay.excludedHitIndexes = {};

  for(let team in analyzedReplay.constantTeams){ //set default stat ranges for each pokemon

    analyzedReplay.overallConstraints[team] = {};
    //analyzedReplay.backupStats[team] = {};
    analyzedReplay.backupMergedStats[team] = {};

    for(let i in analyzedReplay.constantTeams[team].pokemon){

      analyzedReplay.overallConstraints[team][i] = {"abilities": {}};
      const constPkmn = analyzedReplay.constantTeams[team].pokemon[i];

      if(constPkmn.ability == "Illuminate") {

        for(let key in constPkmn.speciesPossibleAbilities) {
          analyzedReplay.overallConstraints[team][i].abilities[key] = {};
          analyzedReplay.overallConstraints[team][i].abilities[key][constPkmn.item] = {};
          constPkmn.ability = key; //just set the constPkmn's ability to some valid ability.  We can fix it back to illuminate later by checking if the # of keys > 1
        }

      } else {
        analyzedReplay.overallConstraints[team][i].abilities[constPkmn.ability] = {};analyzedReplay.overallConstraints[team][i].abilities[constPkmn.ability][constPkmn.item] = {};
      }

      resetPkmnStatRanges(constPkmn, analyzedReplay.tier);
      //analyzedReplay.backupStats[team][i] = {"statRanges": JSON.parse(JSON.stringify(constPkmn.statRanges)), "altDefensiveRanges": JSON.parse(JSON.stringify(constPkmn.altDefensiveRanges))};
      analyzedReplay.backupMergedStats[team][i] = {"statRanges": JSON.parse(JSON.stringify(constPkmn.statRanges)), "altDefensiveRanges": JSON.parse(JSON.stringify(constPkmn.altDefensiveRanges))};

    }

  }

}

function getFullHitIndexesDict(analyzedReplay, blacklistDict) {

  const hitIndexesDict = {};

  for(let team in analyzedReplay.constantTeams) {

    for(let i in analyzedReplay.constantTeams[team].pokemon) {

      analyzedReplay.constantTeams[team].pokemon[i].attackHitIndexes.forEach(function(indexes){

        const indexesStr = indexes[0] + "," + indexes[1] + "," + indexes[2];
        indexes[0] = Number(indexes[0]);

        if(!(indexesStr in blacklistDict)) {
          hitIndexesDict[indexesStr] = 1;
        }

      });

    }

  }

  return hitIndexesDict;

}

function generateProblemStr(analyzedReplay, candidateProblemPkmn) {

  let output = "";

  for(let pkmn in candidateProblemPkmn) {
    const pkmnParts = pkmn.split(",");
    output += pkmn + "," + analyzedReplay.constantTeams[pkmnParts[0]].pokemon[pkmnParts[1]].ability + "," + analyzedReplay.constantTeams[pkmnParts[0]].pokemon[pkmnParts[1]].item;
  }

  return output;

}

function calcStatRangesForIndexes(analyzedReplay, hitIndexesDict) {
  console.log(hitIndexesDict, "HIT INDEXES");

  for(let team in analyzedReplay.constantTeams) {

    for(let i in analyzedReplay.constantTeams[team].pokemon) {

      if(!(i in analyzedReplay.backupMergedStats)) {
        resetPkmnStatRanges(analyzedReplay.constantTeams[team].pokemon[i], analyzedReplay.tier);
        analyzedReplay.backupMergedStats[team][i] = {"statRanges": JSON.parse(JSON.stringify(analyzedReplay.constantTeams[team].pokemon[i].statRanges)), "altDefensiveRanges": JSON.parse(JSON.stringify(analyzedReplay.constantTeams[team].pokemon[i].altDefensiveRanges))};
      }

    }

  }

  while(Object.keys(hitIndexesDict).length != 0) {

    const indexesStr = Object.keys(hitIndexesDict)[0];
    delete hitIndexesDict[indexesStr];
    const indexes = indexesStr.split(",").map(Number);
    console.log("indexes...", indexes, indexesStr);
    const turn = analyzedReplay.turns[indexes[0]];
    const moveEvent = turn.events[indexes[1]];
    const hit = moveEvent.hits[indexes[2]];
    const baseConstAttacker = analyzedReplay.constantTeams[moveEvent.source.originalPlayer].pokemon[moveEvent.source.originalTeamIndex];
    const realConstAttacker = "tempPlayer" in moveEvent.source.flags ? analyzedReplay.constantTeams[moveEvent.source.flags.tempPlayer].pokemon[moveEvent.source.flags.tempTeamIndex] : baseConstAttacker;
    const baseConstDefender = analyzedReplay.constantTeams[hit.defender.originalPlayer].pokemon[hit.defender.originalTeamIndex];
    const realConstDefender = "tempPlayer" in hit.defender.flags ? analyzedReplay.constantTeams[hit.defender.flags.tempPlayer].pokemon[hit.defender.flags.tempTeamIndex] : baseConstDefender;

    if(!moveEvent.source.definitelyReal || !hit.defender.definitelyReal || moveEvent.move.name.startsWith("Max ") || moveEvent.move.name.startsWith("G-Max ") || moveEvent.move.name in hpBasedMoves && hit.startNumerator < hit.defender.hpbarDenominator) {
      continue;
    }

    resetPkmnStatRanges(realConstAttacker, analyzedReplay.tier);
    resetPkmnStatRanges(baseConstDefender, analyzedReplay.tier);

    if("tempPlayer" in hit.defender.flags) {
      resetPkmnStatRanges(realConstDefender, analyzedReplay.tier);
    }

    let calcSuccess = calcHitStatRanges(analyzedReplay, indexes);
    let mergeSuccess = -3;

    if(calcSuccess[0]) { //prepare stats to be merged

      analyzedReplay.baselineStatRanges[indexesStr] = calcSuccess;
      console.log(calcSuccess);

      realConstAttacker.statRanges = JSON.parse(JSON.stringify(analyzedReplay.backupMergedStats[realConstAttacker.originalPlayer][realConstAttacker.originalTeamIndex].statRanges));
      realConstAttacker.altDefensiveRanges = JSON.parse(JSON.stringify(analyzedReplay.backupMergedStats[realConstAttacker.originalPlayer][realConstAttacker.originalTeamIndex].altDefensiveRanges)); //have to set these again even for the attacker because they get reset very often
      baseConstDefender.statRanges = JSON.parse(JSON.stringify(analyzedReplay.backupMergedStats[baseConstDefender.originalPlayer][baseConstDefender.originalTeamIndex].statRanges));
      baseConstDefender.altDefensiveRanges = JSON.parse(JSON.stringify(analyzedReplay.backupMergedStats[baseConstDefender.originalPlayer][baseConstDefender.originalTeamIndex].altDefensiveRanges));

      if("tempPlayer" in hit.defender.flags) {

        realConstDefender.statRanges = JSON.parse(JSON.stringify(analyzedReplay.backupMergedStats[realConstDefender.originalPlayer][realConstDefender.originalTeamIndex].statRanges));
        realConstDefender.altDefensiveRanges = JSON.parse(JSON.stringify(analyzedReplay.backupMergedStats[realConstDefender.originalPlayer][realConstDefender.originalTeamIndex].altDefensiveRanges));

      }

      mergeSuccess = mergeStatRanges(calcSuccess, analyzedReplay, moveEvent, hit, 3);

    }

    /*
    if( baseConstDefender.originalPlayer == "p1" && baseConstDefender.originalTeamIndex == 3) {
      console.log("corvi stuff", JSON.parse(JSON.stringify(analyzedReplay.backupMergedStats["p1"][3])));
      console.log("part 2", JSON.parse(JSON.stringify(analyzedReplay.constantTeams["p1"].pokemon[3])))
    }
    */

    if(calcSuccess[0] && mergeSuccess >= 1) { //success from both means that stats can be backed up now
      //back up newly merged stats
      analyzedReplay.backupMergedStats[realConstAttacker.originalPlayer][realConstAttacker.originalTeamIndex].statRanges = JSON.parse(JSON.stringify(realConstAttacker.statRanges));
      analyzedReplay.backupMergedStats[baseConstDefender.originalPlayer][baseConstDefender.originalTeamIndex].statRanges = JSON.parse(JSON.stringify(baseConstDefender.statRanges));
      analyzedReplay.backupMergedStats[baseConstDefender.originalPlayer][baseConstDefender.originalTeamIndex].altDefensiveRanges = JSON.parse(JSON.stringify(baseConstDefender.altDefensiveRanges));

      if("tempPlayer" in hit.defender.flags) {

        analyzedReplay.backupMergedStats[realConstDefender.originalPlayer][realConstDefender.originalTeamIndex].statRanges = JSON.parse(JSON.stringify(realConstDefender.statRanges));
        analyzedReplay.backupMergedStats[realConstDefender.originalPlayer][realConstDefender.originalTeamIndex].altDefensiveRanges = JSON.parse(JSON.stringify(realConstDefender.altDefensiveRanges));

      }

    } else {
      console.log("FAIL.", indexes, calcSuccess, mergeSuccess);
      console.log(JSON.parse(JSON.stringify(baseConstDefender.statRanges)));
      console.log(JSON.parse(JSON.stringify(analyzedReplay.baselineStatRanges)));

      //reset stat ranges of affected parties/stats
      for(let team in analyzedReplay.constantTeams) { //reset pokemon stat ranges completely

        for(let i in analyzedReplay.constantTeams[team].pokemon) {

          resetPkmnStatRanges(analyzedReplay.constantTeams[team].pokemon[i], analyzedReplay.tier);

        }

      }

      const attackingStat = calcSuccess[calcSuccess.length - 2];
      const defendingStat = calcSuccess[calcSuccess.length - 1];
      const oldAttackerConstraints = JSON.parse(JSON.stringify(analyzedReplay.overallConstraints[baseConstAttacker.originalPlayer][baseConstAttacker.originalTeamIndex].abilities));
      const oldDefenderConstraints = JSON.parse(JSON.stringify(analyzedReplay.overallConstraints[baseConstDefender.originalPlayer][baseConstDefender.originalTeamIndex].abilities));

      let testConstraints = calcHitItemAbilityConstraints(analyzedReplay, moveEvent, turn.pokemonActionsDict, hit, indexes, analyzedReplay.overallConstraints, 0);
      console.log("backup merge ranges", JSON.parse(JSON.stringify(analyzedReplay.backupMergedStats)));

      if(Object.keys(testConstraints).length == 0) {
        console.log("Major failure, ignoring indexes", indexes);
        console.log(oldAttackerConstraints);

        analyzedReplay.excludedHitIndexes[indexesStr] = true;
        continue;
      } else {

        const testCompressedConstraints = getCompressedConstraintsList(testConstraints);
        console.log("TEST CONSTRAINTS", testCompressedConstraints, indexes);
        analyzedReplay.overallConstraints = getMergedCompressedConstraintsList(testCompressedConstraints, analyzedReplay.overallConstraints);

      }

      const candidateProblemPkmn = {};
      const attackerConstraint = analyzedReplay.overallConstraints[baseConstAttacker.originalPlayer][baseConstAttacker.originalTeamIndex].abilities;
      const defenderConstraint = analyzedReplay.overallConstraints[baseConstDefender.originalPlayer][baseConstDefender.originalTeamIndex].abilities;
      let attackerCalcProblem = false;
      let defenderCalcProblem = false;

      if(!calcSuccess[0]) { //figure out who is to blame for the problems

        //regardless of whose fault this is, the given index will need to be recalculated
        hitIndexesDict[indexesStr] = 1;

        if(Object.keys(oldAttackerConstraints).length != Object.keys(attackerConstraint).length) {
          attackerCalcProblem = true;

          if(!("tempPlayer" in moveEvent.source.flags)) {
            baseConstAttacker.ability = Object.keys(attackerConstraint)[0];
          }

        } else {

          for(let ability in oldAttackerConstraints) {

            if(JSON.stringify(oldAttackerConstraints[ability]) != JSON.stringify(attackerConstraint[ability])) {
              attackerCalcProblem = true;
            }

          }

        }

        if(Object.keys(oldDefenderConstraints).length != Object.keys(defenderConstraint).length) {
          defenderCalcProblem = true;

          if(!("tempPlayer" in hit.defender.flags)) {
            baseConstDefender.ability = Object.keys(defenderConstraint)[0];
          }

        } else {

          for(let ability in oldDefenderConstraints) {

            if(JSON.stringify(oldDefenderConstraints[ability]) != JSON.stringify(defenderConstraint[ability])) {
              defenderCalcProblem = true;
            }

          }

        }

        console.log(attackerCalcProblem, defenderCalcProblem);
        console.log(oldAttackerConstraints, JSON.parse(JSON.stringify(attackerConstraint)));

      }

      if(attackerCalcProblem == false && defenderCalcProblem == false && mergeSuccess === -3) {
        console.log("didn't decide who was at fault", indexesStr, analyzedReplay.overallConstraints);
        return;
      }

      if(!(indexesStr in analyzedReplay.excludedHitIndexes) && (mergeSuccess === -1 || defenderCalcProblem)) { //a defending pokemon caused stat conflicts

        candidateProblemPkmn[baseConstDefender.originalPlayer + "," + baseConstDefender.originalTeamIndex + "," + defendingStat] = 1;

        if(calcSuccess[0]) {

          baseConstAttacker.attackHitIndexes.forEach(function(hitIndexes) {

            const hitIndexesStr = hitIndexes[0] + "," + hitIndexes[1] + "," + hitIndexes[2];

            if(!(hitIndexesStr in analyzedReplay.baselineStatRanges) || analyzedReplay.baselineStatRanges[hitIndexesStr][analyzedReplay.baselineStatRanges[hitIndexesStr].length - 2] != attackingStat) {
              return;
            }

            const tempDefender = analyzedReplay.turns[hitIndexes[0]].events[hitIndexes[1]].hits[hitIndexes[2]].defender;
            const defenderConstraintsRef = analyzedReplay.overallConstraints[tempDefender.originalPlayer][tempDefender.originalTeamIndex].abilities;
            const firstAbility = Object.keys(defenderConstraintsRef)[0];

            if(Object.keys(defenderConstraintsRef).length === 1 && Object.keys(defenderConstraintsRef[firstAbility]).length === 1 && !("Mail" in defenderConstraintsRef[firstAbility])) {
              return; //pokemon can't be a problem because its item & ability are known
            }

            const defenderStr = tempDefender.originalPlayer + "," + tempDefender.originalTeamIndex + "," + analyzedReplay.baselineStatRanges[hitIndexesStr][analyzedReplay.baselineStatRanges[hitIndexesStr].length - 1];

            const otherTestConstraints = calcHitItemAbilityConstraints(analyzedReplay, analyzedReplay.turns[hitIndexes[0]].events[hitIndexes[1]], analyzedReplay.turns[hitIndexes[0]].pokemonActionsDict, analyzedReplay.turns[hitIndexes[0]].events[hitIndexes[1]].hits[hitIndexes[2]], hitIndexes, analyzedReplay.overallConstraints, 0);
            const otherCompressedTestConstraints = getCompressedConstraintsList(otherTestConstraints);
            console.log(defenderStr, {...otherCompressedTestConstraints});
            analyzedReplay.overallConstraints = getMergedCompressedConstraintsList(otherCompressedTestConstraints, analyzedReplay.overallConstraints);
            console.log(defenderStr, {...analyzedReplay.overallConstraints});

            candidateProblemPkmn[defenderStr] = 1;

          });

        }

        console.log("candidate problem pkmn (on defense)", {...candidateProblemPkmn});

        const baseConstAttackerConstraintRef = analyzedReplay.overallConstraints[baseConstAttacker.originalPlayer][baseConstAttacker.originalTeamIndex].abilities[baseConstAttacker.ability][baseConstAttacker.item];
        const inputProblemStr = generateProblemStr(analyzedReplay, candidateProblemPkmn);

        if(inputProblemStr in baseConstAttackerConstraintRef) {
          console.log("PROBLEM STRING IMPROPERLY REPEATED", baseConstAttackerConstraintRef);
          return;
        }

        baseConstAttackerConstraintRef[inputProblemStr] = 1;

        //rank who should be the culprit defender

        let culpritDefender = false;
        let culpritDefenderScore = -9999;
        let tempCulpritDefender = false;
        let tempCulpritDefenderScore = 0;

        for(let problemPkmnInfo in candidateProblemPkmn) {

          const problemPkmnInfoParts = problemPkmnInfo.split(",");
          const problemPkmnConstraintRef = analyzedReplay.overallConstraints[problemPkmnInfoParts[0]][problemPkmnInfoParts[1]].abilities;

          tempCulpritDefender = analyzedReplay.constantTeams[problemPkmnInfoParts[0]].pokemon[problemPkmnInfoParts[1]];
          tempCulpritDefenderScore = 0;

          if(!culpritDefender) {
            culpritDefender = tempCulpritDefender;
          }

          const previousItem = tempCulpritDefender.item;

          if("Assault Vest" in problemPkmnConstraintRef[tempCulpritDefender.ability]) {

            tempCulpritDefender.item = "Assault Vest";

            if(previousItem === "Assault Vest") {
              tempCulpritDefenderScore--;
            }

            else if(!(generateProblemStr(analyzedReplay, candidateProblemPkmn) in baseConstAttackerConstraintRef)) {
              tempCulpritDefenderScore += 17; //if there are enough failure appearances, this should be overriden
            }

          }

          if("Eviolite" in problemPkmnConstraintRef[tempCulpritDefender.ability] && previousItem != "Eviolite") {

            tempCulpritDefender.item = "Eviolite";

            if(previousItem === "Eviolite") {
              tempCulpritDefenderScore--;
            }

            else if(!(generateProblemStr(analyzedReplay, candidateProblemPkmn) in baseConstAttackerConstraintRef)) {
              tempCulpritDefenderScore += 20; //if there are enough failure appearances, this should be overriden
            }

          }

          tempCulpritDefender.item = previousItem;

          let failureAppearances = 0;

          if("culprit," + problemPkmnInfo in baseConstAttackerConstraintRef) {
            failureAppearances = baseConstAttackerConstraintRef["culprit," + problemPkmnInfo];
          }

          let totalPossibleCombos = 0;

          for(let ability in problemPkmnConstraintRef) {

            for(let item in problemPkmnConstraintRef[ability]) {
              totalPossibleCombos += 1;
            }

          }

          tempCulpritDefenderScore -= 40 * failureAppearances / totalPossibleCombos;

          console.log("defender score", tempCulpritDefenderScore, tempCulpritDefender, problemPkmnConstraintRef);

          if(tempCulpritDefenderScore > culpritDefenderScore) {
            culpritDefender = tempCulpritDefender;
            culpritDefenderScore = tempCulpritDefenderScore;
          }

        }

        const culpritDefenderConstraint = analyzedReplay.overallConstraints[culpritDefender.originalPlayer][culpritDefender.originalTeamIndex].abilities;
        const culpritStr = "culprit," + culpritDefender.originalPlayer + "," + culpritDefender.originalTeamIndex;

        if(culpritStr in baseConstAttackerConstraintRef) {
          baseConstAttackerConstraintRef[culpritStr] += 1;
        } else {
          baseConstAttackerConstraintRef[culpritStr] = 1;
        }

        const abilitiesList = Object.keys(culpritDefenderConstraint);

        for(let i in abilitiesList) {

          const itemsList = [];
          let canBreak = false;

          if("Assault Vest" in culpritDefenderConstraint[abilitiesList[i]]) {
            itemsList.push("Assault Vest");
          }

          if("Eviolite" in culpritDefenderConstraint[abilitiesList[i]]) {
            itemsList.push("Eviolite");
          }

          for(let item in culpritDefenderConstraint[abilitiesList[i]]) {

            if(!itemsList.includes(item)) {
              itemsList.push(item);
            }

          }

          for(let j in itemsList) {

            const previousItem = culpritDefender.item;

            culpritDefender.ability = abilitiesList[i];
            culpritDefender.item = itemsList[j];
            const testProblemStr = generateProblemStr(analyzedReplay, candidateProblemPkmn);

            if(!(testProblemStr in baseConstAttackerConstraintRef)) {

              canBreak = true;

              break;

            }

          }

          if(canBreak) {
            break;
          }

        }

        console.log("defense culprit str", culpritStr);

        const attackersToRemerge = {};
        attackersToRemerge[culpritDefender.originalPlayer + "," + culpritDefender.originalTeamIndex] = 1; //ensures that the culprit defender's attacking indexes will be re-merged

        culpritDefender.defendHitIndexes.forEach(function(hitIndexes) {

          const hitIndexesStr = hitIndexes[0] + "," + hitIndexes[1] + "," + hitIndexes[2];

          if(!(hitIndexesStr in analyzedReplay.baselineStatRanges)) {
            return;
          }

          hitIndexesDict[hitIndexesStr] = 1; //make sure this index gets recalculated
          const tempAttacker = analyzedReplay.turns[hitIndexes[0]].events[hitIndexes[1]].source;
          const realAttacker = analyzedReplay.constantTeams[tempAttacker.originalPlayer].pokemon[tempAttacker.originalTeamIndex];
          attackersToRemerge[realAttacker.originalPlayer + "," + realAttacker.originalTeamIndex] = 1;

          delete analyzedReplay.baselineStatRanges[hitIndexesStr]; //this index has to be recalculated

        });

        for(let atkStr in attackersToRemerge) {

          const atkStrParts = atkStr.split(",");
          const realAttacker = analyzedReplay.constantTeams[atkStrParts[0]].pokemon[atkStrParts[1]];

          realAttacker.attackHitIndexes.forEach(function(hitIndexes) {

            const hitIndexesStr = hitIndexes[0] + "," + hitIndexes[1] + "," + hitIndexes[2];

            if(!(hitIndexesStr in analyzedReplay.baselineStatRanges)) {
              return;
            }

            mergeStatRanges(analyzedReplay.baselineStatRanges[hitIndexesStr], analyzedReplay, analyzedReplay.turns[hitIndexes[0]].events[hitIndexes[1]], analyzedReplay.turns[hitIndexes[0]].events[hitIndexes[1]].hits[hitIndexes[2]], 3);

          });

          analyzedReplay.backupMergedStats[atkStrParts[0]][atkStrParts[1]].statRanges = JSON.parse(JSON.stringify(realAttacker.statRanges));
          analyzedReplay.backupMergedStats[atkStrParts[0]][atkStrParts[1]].altDefensiveRanges = JSON.parse(JSON.stringify(realAttacker.altDefensiveRanges));

        }

      }

      if(!(indexesStr in analyzedReplay.excludedHitIndexes) && (mergeSuccess === -2 || attackerCalcProblem)) { //an attacking pokemon caused conflicts

        candidateProblemPkmn[baseConstAttacker.originalPlayer + "," + baseConstAttacker.originalTeamIndex + "," + attackingStat] = 1;

        if("tempPlayer" in moveEvent.source.flags) {
          candidateProblemPkmn[realConstAttacker.originalPlayer + "," + realConstAttacker.originalTeamIndex + "," + attackingStat] = 1;
        }

        if(calcSuccess[0]) {

          baseConstDefender.defendHitIndexes.forEach(function(hitIndexes){

            const hitIndexesStr = hitIndexes[0] + "," + hitIndexes[1] + "," + hitIndexes[2];

            if(!(hitIndexesStr in analyzedReplay.baselineStatRanges)) {
              return;
            }

            const tempAttacker = analyzedReplay.turns[hitIndexes[0]].events[hitIndexes[1]].source;
            const attackerConstraintsRef = analyzedReplay.overallConstraints[tempAttacker.originalPlayer][tempAttacker.originalTeamIndex].abilities;
            const firstAbility = Object.keys(attackerConstraintsRef)[0];

            if(Object.keys(attackerConstraintsRef).length === 1 && Object.keys(attackerConstraintsRef[firstAbility]).length === 1 && !("Mail" in attackerConstraintsRef[firstAbility])) {
              return; //pokemon can't be a problem because its item & ability are known
            }

            const attackerStr = tempAttacker.originalPlayer + "," + tempAttacker.originalTeamIndex + "," + analyzedReplay.baselineStatRanges[hitIndexesStr][analyzedReplay.baselineStatRanges[hitIndexesStr].length - 2];


            const otherTestConstraints = calcHitItemAbilityConstraints(analyzedReplay, analyzedReplay.turns[hitIndexes[0]].events[hitIndexes[1]], analyzedReplay.turns[hitIndexes[0]].pokemonActionsDict, analyzedReplay.turns[hitIndexes[0]].events[hitIndexes[1]].hits[hitIndexes[2]], hitIndexes, analyzedReplay.overallConstraints, 0);

            const otherCompressedTestConstraints = getCompressedConstraintsList(otherTestConstraints);
            console.log("other compressed test constraints", otherCompressedTestConstraints, hitIndexesStr);
            analyzedReplay.overallConstraints = getMergedCompressedConstraintsList( otherCompressedTestConstraints, analyzedReplay.overallConstraints);


            if("tempPlayer" in tempAttacker.flags) {

              console.log("tempPlayer CHECK");

              const tempAttackerStr = tempAttacker.flags.tempPlayer + "," + tempAttacker.flags.tempTeamIndex + "," + analyzedReplay.baselineStatRanges[hitIndexesStr][analyzedReplay.baselineStatRanges[hitIndexesStr].length - 2];

              candidateProblemPkmn[tempAttackerStr] = 1;

            }

            candidateProblemPkmn[attackerStr] = 1;

          });

        }

        console.log(baseConstDefender, analyzedReplay.overallConstraints);
        console.log("candidate problem pkmn", {...candidateProblemPkmn});
        const baseConstDefenderConstraintRef = analyzedReplay.overallConstraints[baseConstDefender.originalPlayer][baseConstDefender.originalTeamIndex].abilities[baseConstDefender.ability][baseConstDefender.item];

        const inputProblemStr = generateProblemStr(analyzedReplay, candidateProblemPkmn);

        if(inputProblemStr in baseConstDefenderConstraintRef) {
          console.log("PROBLEM STRING IMPROPERLY REPEATED", baseConstDefenderConstraintRef);
          return;
        }

        baseConstDefenderConstraintRef[inputProblemStr] = 1;

        //rank who should be the culprit attacker

        let culpritAttacker = false;
        let culpritAttackerScore = -9999;
        let tempCulpritAttacker = false;
        let tempCulpritAttackerScore = 0;

        for(let problemPkmnInfo in candidateProblemPkmn) {

          const problemPkmnInfoParts = problemPkmnInfo.split(",");
          const problemPkmnConstraintRef = analyzedReplay.overallConstraints[problemPkmnInfoParts[0]][problemPkmnInfoParts[1]].abilities;

          tempCulpritAttacker = analyzedReplay.constantTeams[problemPkmnInfoParts[0]].pokemon[problemPkmnInfoParts[1]];
          tempCulpritAttackerScore = 0;

          if(!culpritAttacker) {
            culpritAttacker = tempCulpritAttacker;
          }

          const previousItem = tempCulpritAttacker.item;

          //give consideration to the item possibilities in the constraints
          if("Life Orb" in problemPkmnConstraintRef[tempCulpritAttacker.ability]) {

            tempCulpritAttacker.item = "Life Orb";

            if(previousItem === "Life Orb") {
              tempCulpritAttackerScore--;
            }

            else if(!(generateProblemStr(analyzedReplay, candidateProblemPkmn) in baseConstDefenderConstraintRef)) {
              tempCulpritAttackerScore += 17; //if there are enough failure appearances, this should be overriden
            }

          }

          else if("Choice Band" in problemPkmnConstraintRef[tempCulpritAttacker.ability]) {

            tempCulpritAttacker.item = "Choice Band";

            if(previousItem === "Choice Band") {
              tempCulpritAttackerScore--;
            }

            else if(!(generateProblemStr(analyzedReplay, candidateProblemPkmn) in baseConstDefenderConstraintRef)) {
              tempCulpritAttackerScore += 16; //if there are enough failure appearances, this should be overriden
            }

          }

          else if("Choice Specs" in problemPkmnConstraintRef[tempCulpritAttacker.ability] && previousItem != "Choice Specs") {

            tempCulpritAttacker.item = "Choice Specs";

            if(previousItem === "Choice Specs") {
              tempCulpritAttackerScore--;
            }

            else if(!(generateProblemStr(analyzedReplay, candidateProblemPkmn) in baseConstDefenderConstraintRef)) {
              tempCulpritAttackerScore += 16; //if there are enough failure appearances, this should be overriden
            }

          }

          tempCulpritAttacker.item = previousItem;

          let failureAppearances = 0; //second most important factor, the number of times this pokemon has been chosen to fix itself

          if("culprit," + problemPkmnInfo in baseConstDefenderConstraintRef) {
            failureAppearances = baseConstDefenderConstraintRef["culprit," + problemPkmnInfo];
          }

          let totalPossibleCombos = 0;

          for(let ability in problemPkmnConstraintRef) {

            for(let item in problemPkmnConstraintRef[ability]) {
              totalPossibleCombos += 1;
            }

          }

          tempCulpritAttackerScore -= 40 * failureAppearances / totalPossibleCombos;

          console.log("attacker score", tempCulpritAttackerScore, tempCulpritAttacker, problemPkmnConstraintRef);

          if(tempCulpritAttackerScore > culpritAttackerScore) {
            culpritAttacker = tempCulpritAttacker;
            culpritAttackerScore = tempCulpritAttackerScore;
          }

        }

        const culpritAttackerConstraint = analyzedReplay.overallConstraints[culpritAttacker.originalPlayer][culpritAttacker.originalTeamIndex].abilities;
        const culpritStr = "culprit," + culpritAttacker.originalPlayer + "," + culpritAttacker.originalTeamIndex;

        if(culpritStr in baseConstDefenderConstraintRef) {
          baseConstDefenderConstraintRef[culpritStr] += 1;
        } else {
          baseConstDefenderConstraintRef[culpritStr] = 1;
        }

        const abilitiesList = Object.keys(culpritAttackerConstraint);

        for(let i in abilitiesList) {

          const previousAbility = culpritAttacker.ability;
          const itemsList = [];
          let canBreak = false;

          if("Life Orb" in culpritAttackerConstraint[abilitiesList[i]]) {
            itemsList.push("Life Orb");
          }

          if("Choice Band" in culpritAttackerConstraint[abilitiesList[i]]) {
            itemsList.push("Choice Band");
          }

          else if("Choice Specs" in culpritAttackerConstraint[abilitiesList[i]]) {
            itemsList.push("Choice Specs");
          }

          else if("Mail" in culpritAttackerConstraint[abilitiesList[i]]) {
            itemsList.push("Mail");
          }

          for(let item in culpritAttackerConstraint[abilitiesList[i]]) {

            if(!itemsList.includes(item)) {
              itemsList.push(item);
            }

          }

          for(let j in itemsList) {

            const previousItem = culpritAttacker.item;

            culpritAttacker.ability = abilitiesList[i];
            culpritAttacker.item = itemsList[j];
            const testProblemStr = generateProblemStr(analyzedReplay, candidateProblemPkmn);

            if(!(testProblemStr in baseConstDefenderConstraintRef)) {

              canBreak = true;
              break;

            }

          }

          if(canBreak) {
            break;
          }

        }

        const defendersToRemerge = {};
        defendersToRemerge[culpritAttacker.originalPlayer + "," + culpritAttacker.originalTeamIndex] = 1;
        console.log("culprit attacker.", culpritAttacker, culpritAttackerScore);

        culpritAttacker.attackHitIndexes.forEach(function(hitIndexes) {

          const hitIndexesStr = hitIndexes[0] + "," + hitIndexes[1] + "," + hitIndexes[2];

          if(!(hitIndexesStr in analyzedReplay.baselineStatRanges)) {
            return;
          }

          //console.log(hitIndexes, "recalc?");

          hitIndexesDict[hitIndexesStr] = 1; //make sure this index gets recalculated
          const tempDefender = analyzedReplay.turns[hitIndexes[0]].events[hitIndexes[1]].hits[hitIndexes[2]].defender;
          const realDefender = analyzedReplay.constantTeams[tempDefender.originalPlayer].pokemon[tempDefender.originalTeamIndex];
          defendersToRemerge[realDefender.originalPlayer + "," + realDefender.originalTeamIndex] = 1;

          delete analyzedReplay.baselineStatRanges[hitIndexesStr]; //this index has to be recalculated

        });

        console.log(defendersToRemerge);

        for(let defStr in defendersToRemerge) {

          const defStrParts = defStr.split(",");
          const realDefender = analyzedReplay.constantTeams[defStrParts[0]].pokemon[defStrParts[1]];

          realDefender.defendHitIndexes.forEach(function(hitIndexes){

            const hitIndexesStr = hitIndexes[0] + "," + hitIndexes[1] + "," + hitIndexes[2];

            if(!(hitIndexesStr in analyzedReplay.baselineStatRanges)) {
              return;
            }

            mergeStatRanges(analyzedReplay.baselineStatRanges[hitIndexesStr], analyzedReplay, analyzedReplay.turns[hitIndexes[0]].events[hitIndexes[1]], analyzedReplay.turns[hitIndexes[0]].events[hitIndexes[1]].hits[hitIndexes[2]], 2);

          });

          analyzedReplay.backupMergedStats[defStrParts[0]][defStrParts[1]].statRanges = JSON.parse(JSON.stringify(realDefender.statRanges));
          analyzedReplay.backupMergedStats[defStrParts[0]][defStrParts[1]].altDefensiveRanges = JSON.parse(JSON.stringify(realDefender.altDefensiveRanges));

        }

      }

      for(let team in analyzedReplay.constantTeams) { //put back the merged stats

        for(let i in analyzedReplay.constantTeams[team].pokemon) {

          analyzedReplay.constantTeams[team].pokemon[i].statRanges = JSON.parse(JSON.stringify(analyzedReplay.backupMergedStats[team][i].statRanges));
          analyzedReplay.constantTeams[team].pokemon[i].altDefensiveRanges = JSON.parse(JSON.stringify(analyzedReplay.backupMergedStats[team][i].altDefensiveRanges));

        }

      }

    }
  }

  for(let team in analyzedReplay.backupMergedStats) {

    for(let i in analyzedReplay.backupMergedStats[team]) {

      analyzedReplay.constantTeams[team].pokemon[i].statRanges = JSON.parse(JSON.stringify(analyzedReplay.backupMergedStats[team][i].statRanges));
      analyzedReplay.constantTeams[team].pokemon[i].altDefensiveRanges = JSON.parse(JSON.stringify(analyzedReplay.backupMergedStats[team][i].altDefensiveRanges));

    }

  }

  console.log("CALCULATING DONE", analyzedReplay);

}

function calcStatRangesForReplay(analyzedReplay) {

  if(!("excludedHitIndexes" in analyzedReplay)) {
    analyzedReplay.excludedHitIndexes = {};
  }

  resetStatRangesAndConstraints(analyzedReplay);
  console.log(getFullHitIndexesDict(analyzedReplay, analyzedReplay.excludedHitIndexes)); //getFullHitIndexesDict(analyzedReplay, analyzedReplay.excludedHitIndexes)
  calcStatRangesForIndexes(analyzedReplay, getFullHitIndexesDict(analyzedReplay, analyzedReplay.excludedHitIndexes)); // {"9,2,0": 1} getFullHitIndexesDict(analyzedReplay, analyzedReplay.excludedHitIndexes)

}

function calcStatRangesForReplayOld(analyzedReplay, startTurnIndex){

  analyzedReplay.overallConstraints = {};
  analyzedReplay.baselineStatRanges = {};
  let hitsToCheck = {};
  const referenceHits = {};
  const backupPkmnStats = {};
  resetStatRangesAndConstraints(analyzedReplay);

  //fill up hits to check

  for(let team in analyzedReplay.constantTeams) {

    backupPkmnStats[team] = {};

    for(let i in analyzedReplay.constantTeams[team].pokemon) {

      backupPkmnStats[team][i] = {"statRanges": JSON.parse(JSON.stringify(analyzedReplay.constantTeams[team].pokemon[i].statRanges)), "altDefensiveRanges": JSON.parse(JSON.stringify(analyzedReplay.constantTeams[team].pokemon[i].altDefensiveRanges))};

      analyzedReplay.constantTeams[team].pokemon[i].attackHitIndexes.forEach(function(indexes) {

        referenceHits[indexes[0] + "," + indexes[1] + "," + indexes[2]] = 1;

        if(indexes[0] >= startTurnIndex) {
          hitsToCheck[indexes[0] + "," + indexes[1] + "," + indexes[2]] = 1;
        }

      });

    }

  }

  while(Object.keys(hitsToCheck).length != 0) { //create baseline ranges

    const indexesStr = Object.keys(hitsToCheck)[0];

    delete hitsToCheck[indexesStr];
    const indexes = indexesStr.split(",").map(x => Number(x));
    //console.log(indexes);

    const turn = analyzedReplay.turns[indexes[0]];
    const moveEvent = turn.events[indexes[1]];
    const hit = moveEvent.hits[indexes[2]];
    const baseConstAttacker = analyzedReplay.constantTeams[moveEvent.source.originalPlayer].pokemon[moveEvent.source.originalTeamIndex];
    const realConstAttacker = "tempPlayer" in moveEvent.source.flags ? analyzedReplay.constantTeams[moveEvent.source.flags.tempPlayer].pokemon[moveEvent.source.flags.tempTeamIndex] : baseConstAttacker;
    const baseConstDefender = analyzedReplay.constantTeams[hit.defender.originalPlayer].pokemon[hit.defender.originalTeamIndex];
    const realConstDefender = "tempPlayer" in hit.defender.flags ? analyzedReplay.constantTeams[hit.defender.flags.tempPlayer].pokemon[hit.defender.flags.tempTeamIndex] : baseConstDefender;

    let calcSuccess = calcHitStatRanges(analyzedReplay, indexes);

    if(calcSuccess) {

      analyzedReplay.baselineStatRanges[indexesStr] = calcSuccess;

    } else {

      console.log("early failure", indexes);
      let testConstraints = calcHitItemAbilityConstraints(analyzedReplay, moveEvent, turn.pokemonActionsDict, hit, indexes, analyzedReplay.overallConstraints, 0);

      if(Object.keys(testConstraints).length == 0) {

        console.log("major failure", indexes, {...analyzedReplay.overallConstraints});
        delete referenceHits[indexesStr];
        continue;

      }

      const testCompressedConstraints = getCompressedConstraintsList(testConstraints);

      let attackerChanged = false;
      let attackerConstraint = analyzedReplay.overallConstraints[baseConstAttacker.originalPlayer][baseConstAttacker.originalTeamIndex].abilities;

      for(let ability in attackerConstraint) {

        if(!(ability in testCompressedConstraints[baseConstAttacker.originalPlayer][baseConstAttacker.originalTeamIndex].abilities)) {
          attackerChanged = true;
          break;
        }

        if("artificialItem" in testCompressedConstraints[baseConstAttacker.originalPlayer][baseConstAttacker.originalTeamIndex]) { //do not check for item differences if there is an artificial item
          continue;
        }

        for(let item in attackerConstraint[ability]) {

          if(!(item in testCompressedConstraints[baseConstAttacker.originalPlayer][baseConstAttacker.originalTeamIndex].abilities[ability])) {
            attackerChanged = true;
            break;
          }

        }

      }

      let defenderChanged = false;
      let defenderConstraint = analyzedReplay.overallConstraints[baseConstDefender.originalPlayer][baseConstDefender.originalTeamIndex].abilities;

      for(let ability in defenderConstraint) {

        if(!(ability in testCompressedConstraints[baseConstDefender.originalPlayer][baseConstDefender.originalTeamIndex].abilities)) {
          defenderChanged = true;
          break;
        }

        if("artificialItem" in testCompressedConstraints[baseConstDefender.originalPlayer][baseConstDefender.originalTeamIndex]) { //do not check for item differences if there is an artificial item
          continue;
        }

        for(let item in defenderConstraint[ability]) {

          if(!(item in testCompressedConstraints[baseConstDefender.originalPlayer][baseConstDefender.originalTeamIndex].abilities[ability])) {
            defenderChanged = true;
            break;
          }

        }

      }

      analyzedReplay.overallConstraints = getMergedCompressedConstraintsList(testCompressedConstraints, analyzedReplay.overallConstraints);

      if(attackerChanged) { //reload all of the attacker indexes

        analyzedReplay.constantTeams[baseConstAttacker.originalPlayer].pokemon[baseConstAttacker.originalTeamIndex].attackHitIndexes.forEach(function(hitIndx){

          hitsToCheck[hitIndx[0] + "," + hitIndx[1] + "," + hitIndx[2]] = 1;

        });

        attackerConstraint = analyzedReplay.overallConstraints[baseConstAttacker.originalPlayer][baseConstAttacker.originalTeamIndex].abilities;

        //update base const attacker info
        baseConstAttacker.ability = Object.keys(attackerConstraint)[0];
        baseConstAttacker.item = "Mail" in attackerConstraint[baseConstAttacker.ability] ? "Mail" : Object.keys(attackerConstraint[baseConstAttacker.ability])[0];

      }

      if(defenderChanged) { //reload all of the defender indexes

        analyzedReplay.constantTeams[baseConstDefender.originalPlayer].pokemon[baseConstDefender.originalTeamIndex].defendHitIndexes.forEach(function(hitIndx) {

          hitsToCheck[hitIndx[0] + "," + hitIndx[1] + "," + hitIndx[2]] = 1;

        });

        defenderConstraint = analyzedReplay.overallConstraints[baseConstDefender.originalPlayer][baseConstDefender.originalTeamIndex].abilities;

        //update base const defender info
        baseConstDefender.ability = Object.keys(defenderConstraint)[0];
        baseConstDefender.item = Object.keys(defenderConstraint[baseConstDefender.ability])[0];

      }

      console.log(testConstraints, testCompressedConstraints, attackerChanged, defenderChanged);

    }

  }

  hitsToCheck = {...referenceHits};

  while(Object.keys(hitsToCheck).length != 0) { //verify that merging baseline stats will actually work

    const indexesStr = Object.keys(hitsToCheck)[0];
    delete hitsToCheck[indexesStr];
    const indexes = indexesStr.split(",").map(x => Number(x));
    const turn = analyzedReplay.turns[indexes[0]];
    const moveEvent = turn.events[indexes[1]];
    const hit = moveEvent.hits[indexes[2]];
    const baseConstAttacker = analyzedReplay.constantTeams[moveEvent.source.originalPlayer].pokemon[moveEvent.source.originalTeamIndex];
    const realConstAttacker = "tempPlayer" in moveEvent.source.flags ? analyzedReplay.constantTeams[moveEvent.source.flags.tempPlayer].pokemon[moveEvent.source.flags.tempTeamIndex] : baseConstAttacker;
    const baseConstDefender = analyzedReplay.constantTeams[hit.defender.originalPlayer].pokemon[hit.defender.originalTeamIndex];
    const realConstDefender = "tempPlayer" in hit.defender.flags ? analyzedReplay.constantTeams[hit.defender.flags.tempPlayer].pokemon[hit.defender.flags.tempTeamIndex] : baseConstDefender;

    let mergeSuccess = mergeStatRanges(analyzedReplay.baselineStatRanges[indexesStr], analyzedReplay, moveEvent, hit);

    if(mergeSuccess < 1) { //merging failed, stuff needs to reset

      hitsToCheck = {...referenceHits};
      let attackerChanged = false;
      let defenderChanged = false;

      for(let player in analyzedReplay.constantTeams) {

        for(let i in analyzedReplay.constantTeams[player].pokemon) {

          analyzedReplay.constantTeams[player].pokemon[i].statRanges = JSON.parse(JSON.stringify(backupPkmnStats[player][i].statRanges));
          analyzedReplay.constantTeams[player].pokemon[i].altDefensiveRanges = JSON.parse(JSON.stringify(backupPkmnStats[player][i].altDefensiveRanges));

        }

      }

      //log the failure
      const baseAttackerStr = baseConstAttacker.originalPlayer + "," + baseConstAttacker.originalTeamIndex + ",";
      const attackerStr = baseAttackerStr + baseConstAttacker.ability + "," + baseConstAttacker.item;
      const baseDefenderStr = baseConstDefender.originalPlayer + "," + baseConstDefender.originalTeamIndex + ",";
      const defenderStr = baseDefenderStr + baseConstDefender.ability + "," + baseConstDefender.item;

      const attackerRef = analyzedReplay.overallConstraints[baseConstAttacker.originalPlayer][baseConstAttacker.originalTeamIndex].abilities[baseConstAttacker.ability][baseConstAttacker.item];
      attackerRef[defenderStr] = 1;
      const defenderRef = analyzedReplay.overallConstraints[baseConstDefender.originalPlayer][baseConstDefender.originalTeamIndex].abilities[baseConstDefender.ability][baseConstDefender.item];
      defenderRef[attackerStr] = 1;

      //test attacker item possibilities
      for(let item in analyzedReplay.overallConstraints[baseConstAttacker.originalPlayer][baseConstAttacker.originalTeamIndex].abilities[baseConstAttacker.ability]) {

        const testAttackerStr = baseAttackerStr + baseConstAttacker.ability + "," + item;

        if(!(testAttackerStr in defenderRef)) {
          baseConstAttacker.item = item;
          attackerChanged = true;
          break;
        }

      }

      for(let ability in analyzedReplay.overallConstraints[baseConstAttacker.originalPlayer][baseConstAttacker.originalTeamIndex].abilities) {

        for(let item in analyzedReplay.overallConstraints[baseConstAttacker.originalPlayer][baseConstAttacker.originalTeamIndex].abilities[ability]) {

          const testAttackerStr = baseAttackerStr + ability + "," + item;

          if(!(testAttackerStr in defenderRef)) {

            baseConstAttacker.ability = ability;
            baseConstAttacker.item = item;
            attackerChanged = true;
            break;

          }


        }

        if(attackerChanged) {
          break;
        }

      }

      if(!attackerChanged) { //clearly an issue with the defender ability/item

        for(let ability in analyzedReplay.overallConstraints[baseConstDefender.originalPlayer][baseConstDefender.originalTeamIndex].abilities) {

          for(let item in analyzedReplay.overallConstraints[baseConstDefender.originalPlayer][baseConstDefender.originalTeamIndex].abilities[ability]) {

            const testDefenderStr = baseDefenderStr + ability + "," + item;

            if(!(testDefenderStr in attackerRef)) {

              baseConstDefender.ability = ability;
              baseConstDefender.item = item;
              defenderChanged = true;
              break;

            }

          }

          if(defenderChanged) {
            break;
          }

        }

      }

      if(attackerChanged) {

        baseConstAttacker.attackHitIndexes.forEach(function(attackIndexes){

          let keyStr = attackIndexes[0] + "," + attackIndexes[1] + "," + attackIndexes[2];
          analyzedReplay.baselineStatRanges[keyStr] = calcHitStatRanges(analyzedReplay, attackIndexes);

        });

      }

      else if(defenderChanged) {

        baseConstDefender.defendHitIndexes.forEach(function(defendIndexes) {

          let keyStr = defendIndexes[0] + "," + defendIndexes[1] + "," + defendIndexes[2];
          analyzedReplay.baselineStatRanges[keyStr] = calcHitStatRanges(analyzedReplay, defendIndexes);

        });

      }

      else {
        console.log("Major failure with merging occurred");
        return;
      }

      //console.log(indexes);
    }

  }

  for(let team in analyzedReplay.constantTeams) {

    for(let i in analyzedReplay.constantTeams[team].pokemon) {

      analyzedReplay.constantTeams[team].pokemon[i].attackHitIndexes.forEach(function(indexes) {

        const turn = analyzedReplay.turns[indexes[0]];
        const moveEvent = turn.events[indexes[1]];
        const hit = moveEvent.hits[indexes[2]];

        let calcSuccess = calcHitStatRanges(analyzedReplay, indexes);

        if(calcSuccess) {
          mergeStatRanges(calcSuccess, analyzedReplay, moveEvent, hit);
        }

      });

    }

  }

}
