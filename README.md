# Chinchow-Battle-Analyzer
An attempt at making a battle analyzer add-on for Pokemon Showdown. It can work on both active battles and replays, and if you are logged in, it will get your more detailed HP information.

This only works for standard meta battles from gen 7 and gen 8. It should work for doubles as well as singles, but there is a higher chance for problems in doubles. There are definitely bugs I did not find, and the extension may infinitely loop. I am not planning on doing much more with this extension in particular, since there are a lot of errors, and I would like to re-design the framework entirely. Additionally, I would prefer to use usage stats rather to predict items, abilities, and stat ranges, rather than do the guesswork I am currently using in order to generate theoretically possible configurations of pokemon. I also think that the split between parsing and analysis is unnecessary, so I would like to change that as well.

## How to run this
The add-on was made specifically for Firefox (I haven't tested it in chrome), so you need to type in `about:debugging` into the url bar and then click  `This Firefox`. Add it as a temporary extension through its manifest.json. Some debug statements will only be visible from the browser console (Ctrl + Shift + j)

## Components

The analyzer-js folder
* structures.js - The data structures for holding data from a parsed replay.
    * Replay class - main container. The constantTeams field will contain the most detailed information on pokemon.
    * ReplayPokemon class - a subclass of the Pokemon class from damage-calc that has more info
    * Turn class - container for the events that happen within a turn
    * Hit class - similar to a turn class, but it contains the damage that a pokemon took.
* parser.js - A robust, custom replay parser that works on a turn by turn basis. Handles Zoroark better than the pokemon showdown client does.
    * parseLog - parses an entire text replay log into a Replay object
    * parseTurn - parses a replay turn into a Turn object (which requires a Replay object as a container)
* analyzer.js - Makes logical deductions on possible pokemon abilities and items
    * analyzeReplayLog - parses a Replay object and fills in analysis
    * analyzeReplayTurn - parses a turn in a Replay object
* statcalculator.js - calculates possible stat ranges for pokemon based on reverse damage calculations done on a battle
    * calcADStatRanges - function for calculating the stat ranges for the attacker's attacking stat and the defender's hp and defending stat
    * calcADRatioRanges - the core function that does reverse calculations on the pokemon damage formula
    * getPossibleChangeVals - calculates possible hp damage values given start and end hp possibilities
    * calcHitItemAbilityConstraints - calculates the possible set of items/abilities possible for both the attacker and defender of a hit
    * mergeStatRanges - the guessing function that handles conflicts in potential stat ranges and gives possible stat configurations based on the course of a battle

**Notes**:
* All of these depend on js from the damage-calc folder
* Events that come before a hit will be moved from the turn container into the hit container, and some events that come after, such as recoil damage and stat changes from landing a hit will also be moved
* I used some global variables in parser.js, analyzer.js, and statcalculator.js

Obvious things that could be improved
* Actually calculate speed ranges
* Use recoil damage / draining moves to calculate HP ranges
* Figure out how to properly calculate confusion damage (probably implement this in damage-calc)
* Calculate probabilities of certain items existing, such as scope lens, wide lens
* Implement logic conditions for more abilities

## Credits

Credit to https://github.com/smogon/damage-calc for the damage-calc library functions in the damage-calc-js folder