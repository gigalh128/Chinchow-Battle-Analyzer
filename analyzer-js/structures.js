class Replay {
  constructor(){
    this.gen = 0;
    this.turns = [];
    this.previewTeams = {};
    this.constantTeams = {}; //these are the teams that will hold the overall details
    this.trainers = {};
    this.rules = {};
    this.hpbarDenominator = 100;
    this.winner = null;
    this.rated = true;
    this.tier = null;
    this.hackedAbilities = false;
    this.gameType = null;
    this.sidePositions = {};
    this.unknownPkmn = {};
    this.potentialIllusionMons = {};
  }

  clone(){
    let clone = new Replay();
    clone.gen = this.gen;

    for(let i = 0; i < this.turns.length; i++){
      clone.turns[i] = this.turns[i].clone();
    }

    for(let player in this.previewTeams){
      clone.previewTeams[player] = this.previewTeams[player].clone();
    }

    for(let player in this.constantTeams){
      clone.constantTeams[player] = this.constantTeams[player].clone();
    }

    for(let trainer in this.trainers){
      clone.trainers[trainer] = this.trainers[trainer].clone();
    }

    clone.rules = {...this.rules};
    clone.hpbarDenominator = this.hpbarDenominator;
    clone.winner = this.winner;
    clone.tier = this.tier;
    clone.hackedAbilities = this.hackedAbilities;
    clone.gameType = this.gameType;
    clone.sidePositions = {...this.sidePositions};
    clone.unknownPkmn = {...this.unknownPkmn};
    clone.potentialIllusionMons = {...this.potentialIllusionMons};

    return clone;
  }
}

class Trainer{
  constructor(name, replayName, avatar, elo){
    this.name = name;
    this.replayName = replayName;
    this.avatar = avatar;
    this.elo = elo;
  }

  clone(){
    return new Trainer(this.name, this.replayName, this.avatar, this.elo);
  }
}

class Turn {
  constructor(){
    this.startTime = 0;
    this.endTime = 0;
    this.events = [];
    this.eventIndexes = {};
    this.pokemonActionsDict = {};
  }

  clone(){
    let clone = new Turn();
    clone.startTime = this.startTime;
    clone.endTime = this.endTime;

    for(let i = 0; i < this.events.length; i++){
      clone.events[i] = this.events[i].clone();
    }

    for(let eventName in this.eventIndexes){
      clone.eventIndexes[eventName] = [...this.eventIndexes[eventName]];
    }

    clone.pokemonActionsDict = {...this.pokemonActionsDict};

    return clone;

  }

}

class Team {
  constructor(){
    this.teamSize = 0;
    this.pokemon = [];
    this.backSlotIndex = -1; //this is primarily for teams with illusion pkmn
  }

  clone(){
    const clone = new Team();
    clone.teamSize = this.teamSize;

    for(let i = 0; i < this.pokemon.length; i++){
      clone.pokemon[i] = this.pokemon[i].clone();
    }

    clone.backSlotIndex = this.backSlotIndex;

    return clone;
  }
}

class ReplayPokemon extends Pokemon {
  constructor(gen, name, shiny, nickname, originalPlayer, originalTeamIndex, options) {

    if(name.startsWith("Gastrodon-East")) {
      name = "Gastrodon";
    }

    if(name.endsWith("-Gmax")) {
      name = name.substring(0, name.length - 5);
    }

    super(gen, name, options)
    this.speciesPossibleAbilities = {};
    this.species.abilities = {0: "Illuminate"}
    this.replayMoves = {};
    this.summonedMoves = {};
    this.currSessionMoves = [];
    this.currHpbarNumerator = 100;
    this.hpbarDenominator = 100;
    this.hpsPossible = {};
    this.nickname = nickname;
    this.originalPlayer = originalPlayer;
    this.originalTeamIndex = originalTeamIndex;
    this.shiny = shiny;
    this.definitelyReal = true; //keep track of whether or not we definitely know this pkmn isn't an illusion
    this.volatileStatuses = {};
    this.flags = {}; //custom info for the replay
    this.boosts.evasion = 0;
    this.boosts.accuracy = 0;

    let pkmnRef = gens.get(this.gen.num).species.get(this.name);

    if(pkmnRef == null && this.gen.num == 8) {
      pkmnRef = gens.get(this.gen.num - 1).species.get(this.name);
    }

    if(pkmnRef == null) {
      console.log(this.name, this.gen.num, "BAD POKEMON REF");
    }

    const abilitiesRef = pkmnRef.abilities;

    for(let key in abilitiesRef) {
      this.speciesPossibleAbilities[abilitiesRef[key]] = key;
    }

  }

  clone(){
    const clone = super.clone();
    clone.ability = this.ability;
    clone.species.abilities[0] = this.species.abilities[0];
    clone.speciesPossibleAbilities = {...this.speciesPossibleAbilities};
    clone.currSessionMoves = [...this.currSessionMoves];
    clone.replayMoves = {};
    clone.summonedMoves = {};
    clone.currHpbarNumerator = this.currHpbarNumerator;
    clone.hpbarDenominator = this.hpbarDenominator;
    clone.hpsPossible = {};
    clone.nickname = this.nickname;
    clone.originalPlayer = this.originalPlayer;
    clone.originalTeamIndex = this.originalTeamIndex;
    clone.shiny = this.shiny;
    clone.definitelyReal = this.definitelyReal;
    clone.flags = {...this.flags};
    clone.volatileStatuses = {};

    for(let hp in this.hpsPossible){
      clone.hpsPossible[hp] = [...this.hpsPossible[hp]];
    }

    for(let move in this.replayMoves){
      clone.replayMoves[move] = this.replayMoves[move].clone();
    }

    for(let move in this.summonedMoves){
      clone.summonedMoves[move] = this.summonedMoves[move].clone();
    }

    for(let status in this.volatileStatuses){
      clone.volatileStatuses[status] = this.volatileStatuses[status].clone();
    }

    clone.types = this.types.slice(0);
    clone.clone = this.clone;

    return clone;
  }

}

class FieldCondition {
  constructor(type){
    this.type = type; //weather, terrain, other, etc.
    this.turnsActive = 0;
  }

  clone(){
    const clone = new FieldCondition(this.type);
    clone.turnsActive = this.turnsActive;
    clone.clone = this.clone;
    return clone;
  }
}

class ReplayField extends Field {
  constructor(options){
    super(options);
    this.fieldConditions = {};
    this.fieldSides = {};
  }

  clone(){
    const clone = super.clone();
    clone.fieldConditions = {};
    clone.fieldSides = {};

    for(i in this.fieldConditions){
      clone.fieldConditions[i] = this.fieldConditions[i].clone();
    }

    for(let player in this.fieldSides){
      clone.fieldSides[player] = {...this.fieldSides[player]};
    }

    clone.clone = this.clone;

    return clone;
  }
}

class Hit {
  constructor(index, defender, defenderPos, startNumerator, endNumerator, field, teams, subEvents){
    this.defender = defender;
    this.defenderPos = defenderPos;
    this.startNumerator = startNumerator;
    this.endNumerator = endNumerator;
    this.field = field;
    this.teams = teams;
    this.index = index;
    this.startHpsPossible = {};
    this.subEvents = subEvents;
    this.subEventIndexes = {};
    this.extraData = {};
    this.maxRng = 1;
    this.minRng = 0.85;

    for(let i = 0; i < subEvents.length; i++){

      if(subEvents[i].name in this.subEventIndexes){
        this.subEventIndexes[subEvents[i].name].push(i)
      } else {
        this.subEventIndexes[subEvents[i].name] = [i];
      }

    }

  }

  clone(){
    let clone = new Hit(this.index, this.defender.clone(), this.defenderPos, this.startNumerator, this.endNumerator, this.field.clone(), this.teams, this.subEvents);

    for(let player in this.teams){
      clone.teams[player] = this.teams[player].clone();
    }

    for(let hp in this.startHpsPossible) {
      clone.startHpsPossible[hp] = [...this.startHpsPossible[hp]];
    }

    for(let i = 0; i < this.subEvents.length; i++){
      clone.subEvents[i] = this.subEvents[i].clone();
    }

    clone.extraData = {...this.extraData};
    clone.maxRng = this.maxRng;
    clone.minRng = this.minRng;

    return clone;
  }
}

class VolatileStatus {
  constructor(singleTurn, name){
    this.singleTurn = singleTurn;
    this.name = name;
    this.turnsActive = 0;
  }

  clone(){
    const clone = new VolatileStatus(this.singleTurn, this.name);
    clone.turnsActive = this.turnsActive;
    return clone;
  }
}

class MajorEvent {
  constructor(name, field, slots, sourcePos, source, teams){
    this.name = name;
    this.field = field;
    this.slots = slots; //{p2a: pkmn nickname, p1b: pkmn nickname}
    this.sourcePos = sourcePos;
    this.source = source;
    this.teams = teams;
    this.subEvents = [];
    this.subEventIndexes = {};
    this.extraData = {};
    this.originalSource = null;
  }

  clone(){
    let clone = new MajorEvent(this.name, this.field.clone(), {...this.slots}, this.sourcePos, this.source ? this.source.clone() : null, this.teams);

    for(let player in this.teams){
      clone.teams[player] = this.teams[player].clone();
    }

    for(let i = 0; i < this.subEvents.length; i++){
      clone.subEvents[i] = this.subEvents[i].clone();
    }

    clone.subEventIndexes = {...this.subEventIndexes};
    clone.extraData = {...this.extraData};
    clone.originalSource = this.originalSource;
    clone.clone = this.clone;

    return clone;

  }
}

class SwitchEvent extends MajorEvent {
  constructor(field, slots, sourcePos, source, teams, time, cause, switchOut){
    super("switch", field, slots, sourcePos, source, teams);
    this.cause = cause;
    this.time = time;
    this.startNumerator = 0;
    this.endNumerator = 0;
    this.switchOut = switchOut;
    this.priority = 6;
  }

  clone(){
    let clone = super.clone();
    clone.name = this.name;
    clone.cause = this.cause;
    clone.time = this.time;
    clone.startNumerator = this.startNumerator;
    clone.endNumerator = this.endNumerator;
    clone.switchOut = clone.switchOut ? this.switchOut.clone() : null;
    clone.priority = 6;
    clone.clone = this.clone;
    return clone;
  }
}

class MoveEvent extends MajorEvent {
  constructor(field, slots, sourcePos, source, teams, move, targetPositions, cause){
    super("move", field, slots, sourcePos, source, teams);
    this.move = move;
    this.targetPositions = targetPositions;
    this.cause = cause;
    this.hits = [];
    this.priority = move.priority;
  }

  clone(){
    let clone = super.clone();
    clone.name = this.name;
    clone.move = this.move.clone();
    clone.targetPositions = [...this.targetPositions];
    clone.hits = [];
    clone.cause = this.cause;

    for(let i = 0; i < this.hits.length; i++){
      clone.hits[i] = this.hits[i].clone();
    }

    clone.clone = this.clone;
    clone.priority = this.priority;

    return clone;

  }

}

class FaintEvent extends MajorEvent {
  constructor(field, slots, sourcePos, source, teams){
    super("faint", field, slots, sourcePos, source, teams);
    this.priority = "Unknown";
  }

  clone(){
    return new FaintEvent(this.field, this.slots, this.sourcePos, this.source, this.teams);
  }
}

class CantEvent extends MajorEvent {
  constructor(field, slots, sourcePos, source, teams, reason){
    super("cant", field, slots, sourcePos, source, teams);
    this.reason = reason;
  }

  clone(){
    let clone = super.clone();
    clone.clone = this.clone;
    clone.reason = this.reason;
    return clone;
  }
}

class DetailsChangeEvent extends MajorEvent {
  constructor(field, slots, sourcePos, source, teams, prevForm){
    super("detailschange", field, slots, sourcePos, source, teams);
    this.prevForm = prevForm;
  }

  clone(){
    let clone = super.clone();
    clone.clone = this.clone;
    clone.prevForm = this.prevForm;
    return clone;
  }
}

class SwapEvent extends MajorEvent {
  constructor(field, slots, sourcePos, source, teams, prevSlots, prevPos, cause){
    super("swap", field, slots, sourcePos, source, teams);
    this.prevSlots = prevSlots;
    this.prevPos = prevPos;
    this.cause = cause;
    this.priority = 0;
  }

  clone(){
    let clone = super.clone();
    clone.clone = this.clone;
    clone.prevSlots = {...this.prevSlots};
    clone.prevPos = this.prevPos;
    clone.cause = this.cause;
    clone.priority = this.priority;

    return clone;
  }

}

class MinorEvent {
  constructor(name, data){
    this.name = name;
    this.data = data;
    this.extraData = {};
  }

  clone(){
    let clone = new MinorEvent(this.name, this.data);
    clone.extraData = {...this.extraData};
    return clone;
  }
}

class PokemonMinorEvent extends MinorEvent {
  constructor(name, data, slot, source){
    super(name, data);
    this.slot = slot;
    this.source = source;
  }

  clone(){
    let clone = new PokemonMinorEvent(this.name, this.data, this.slot, this.source);
    clone.extraData = {...this.extraData};
    return clone;
  }
}

class HealthEvent extends PokemonMinorEvent {
  constructor(name, data, slot, source, startNumerator, endNumerator){
    super(name, data, slot, source);
    this.startNumerator = startNumerator;
    this.endNumerator = endNumerator;
  }

  clone(){
    let clone = new HealthEvent(this.name, this.data, this.slot, this.source, this.startNumerator, this.endNumerator);
    clone.extraData = {...this.extraData};

    if("startHpsPossible" in this) {
      clone.startHpsPossible = JSON.parse(JSON.stringify(this.startHpsPossible));
    }

    return clone;
  }
}

class SourceTargetEvent extends PokemonMinorEvent {
  constructor(name, data, slot, source, targetSlot, target){
    super(name, data, slot, source);
    this.targetSlot = targetSlot;
    this.target = target;
  }

  clone(){
    let clone = new SourceTargetEvent(this.name, this.data, this.slot, this.source, this.startNumerator, this.endNumerator);
    clone.extraData = {...this.extraData};
    return clone;
  }

}
