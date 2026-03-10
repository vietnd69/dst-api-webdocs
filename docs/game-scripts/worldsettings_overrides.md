---
id: worldsettings_overrides
title: Worldsettings Overrides
description: Provides tuning override functions that adjust game difficulty settings for wildlife, weather, events, regrowth, and world mechanics by modifying global TUNING values or dispatching world state events.
tags: [world, tuning, difficulty, events, configuration]
sidebar_position: 10

last_updated: 2026-03-10
build_version: 714014
change_status: stable
category_type: root
source_hash: 9f610ea7
system_scope: world
---

# Worldsettings Overrides

> Based on game build **714014** | Last updated: 2026-03-10

## Overview
This module implements a comprehensive set of functions to dynamically override game tuning parameters and emit world configuration events based on difficulty levels. It acts as a centralized control layer for difficulty configuration, supporting a wide range of in-game systems including wildlife populations (e.g., bees, frogs, penguins), regrowth (e.g., plants, trees, grass), seasonal and daily cycle parameters, weather and lighting, rifts, meteors, hounds, and more. Functions either directly update values in the global `TUNING` table via `OverrideTuningVariables`, or post events to the world state machine (e.g., `ms_setseasonlength`, `rifts_setdifficulty`). The module supports a consistent vocabulary of difficulty levels (e.g., `never`, `rare`, `often`, `always`, `none`, `few`, `many`) across all features.

## Usage example
```lua
-- Example: Set butterfly population to rare, enable fast regrowth, and configure summer difficulty
local function setWorldDifficulty(difficulty)
    butterfly(difficulty)  -- e.g., "rare"
    regrowth("fast")       -- e.g., "veryslow", "slow", "fast", "veryfast"
    summer(difficulty)     -- e.g., "often", "always"
end

-- Apply settings
setWorldDifficulty("rare")
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** none

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `TUNING` | table | — | Global configuration table modified by `OverrideTuningVariables`. |
| `ORIGINAL_TUNING` | table | — | Stores original values of `TUNING` fields before override. |
| `applyoverrides_pre` | table | — | Namespace containing difficulty configuration functions for pre-game-start tuning overrides. |
| `applyoverrides_post` | table | — | Namespace containing difficulty configuration functions that emit world state events. |

## Main functions

### `OverrideTuningVariables(tuning)`
* **Description:** Copies values from the `tuning` table into the global `TUNING` table while preserving original values in `ORIGINAL_TUNING`. In dev builds (`BRANCH == "dev"`), asserts that each key exists in `TUNING` to prevent typos.
* **Parameters:** `tuning` — a table of key-value pairs where keys are tuning variable names (strings) and values are new values. May be `nil`.
* **Returns:** `nil`
* **Error states:** In dev builds, throws an assertion error if a key in `tuning` does not exist in `TUNING`.

### `butterfly(difficulty)`
* **Description:** Controls butterfly spawn limits using `MAX_BUTTERFLIES`.
* **Parameters:** `difficulty` — string key: `never`, `rare`, `often`, `always`.
* **Returns:** `nil`

### `birds(difficulty)`
* **Description:** Controls bird spawning caps using `BIRD_SPAWN_MAX`.
* **Parameters:** `difficulty` — string key.
* **Returns:** `nil`

### `perd(difficulty)`
* **Description:** Controls Perd spawning chance and attack frequency using `PERD_SPAWNCHANCE` and `PERD_ATTACK_PERIOD`.
* **Parameters:** `difficulty` — string key.
* **Returns:** `nil`

### `hunt(difficulty)`
* **Description:** Adjusts Hunt event timing using `HUNT_COOLDOWN`, `HUNT_COOLDOWNDEVIATION`, `HUNT_RESET_TIME`, and `HUNT_SPRING_RESET_TIME`.
* **Parameters:** `difficulty` — string key.
* **Returns:** `nil`

### `alternatehunt(difficulty)`
* **Description:** Configures probability range for alternate beast hunts using `HUNT_ALTERNATE_BEAST_CHANCE_MIN` and `HUNT_ALTERNATE_BEAST_CHANCE_MAX`.
* **Parameters:** `difficulty` — string key.
* **Returns:** `nil`

### `penguins(difficulty)`
* **Description:** Tunes penguin colony density, interval, and boulder counts.
* **Parameters:** `difficulty` — string key.
* **Returns:** `nil`

### `bees_setting(difficulty)`
* **Description:** Enables/disables beehives and adjusts bee counts, release/regen times.
* **Parameters:** `difficulty` — string key.
* **Returns:** `nil`

### `catcoons(difficulty)`
* **Description:** Enables/disables Catcoon dens and controls regen time and max children.
* **Parameters:** `difficulty` — string key.
* **Returns:** `nil`

### `frogs(difficulty)`
* **Description:** Enables/disables Frog ponds and adjusts regen/spawn times and child range.
* **Parameters:** `difficulty` — string key.
* **Returns:** `nil`

### `grassgekkos(difficulty)`
* **Description:** Controls Grass Gekko morphing: chance, delay, and enabled state.
* **Parameters:** `difficulty` — string key.
* **Returns:** `nil`

### `moles_setting(difficulty)`
* **Description:** Enables/disables Moles and sets respawn time (multiplied by `TUNING.MULTIPLAYER_WILDLIFE_RESPAWN_MODIFIER`).
* **Parameters:** `difficulty` — string key.
* **Returns:** `nil`

### `mosquitos(difficulty)`
* **Description:** Enables/disables Mosquito ponds and tunes regen/spawn times and child range.
* **Parameters:** `difficulty` — string key.
* **Returns:** `nil`

### `rabbits_setting(difficulty)`
* **Description:** Enables/disables Rabbits and sets respawn time (multiplied by `TUNING.MULTIPLAYER_WILDLIFE_RESPAWN_MODIFIER`).
* **Parameters:** `difficulty` — string key.
* **Returns:** `nil`

### `wobsters(difficulty)`
* **Description:** Enables/disables Wobster dens and adjusts regen/spawn periods and max children.
* **Parameters:** `difficulty` — string key.
* **Returns:** `nil`

### `pigs_setting(difficulty)`
* **Description:** Enables/disables Pig houses and adjusts spawn time.
* **Parameters:** `difficulty` — string key.
* **Returns:** `nil`

### `slurtles_setting(difficulty)`
* **Description:** Enables/disables Slurtle holes and adjusts regen period and child range.
* **Parameters:** `difficulty` — string key.
* **Returns:** `nil`

### `snurtles(difficulty)`
* **Description:** Adjusts chance of rare Slurtle children via `SLURTLEHOLE_RARECHILD_CHANCE`.
* **Parameters:** `difficulty` — string key.
* **Returns:** `nil`

### `bunnymen_setting(difficulty)`
* **Description:** Enables/disables Bunnyman houses and adjusts spawn time.
* **Parameters:** `difficulty` — string key.
* **Returns:** `nil`

### `rocky_setting(difficulty)`
* **Description:** Sets Rocky herd spawner density via `ROCKYHERD_SPAWNER_DENSITY`.
* **Parameters:** `difficulty` — string key.
* **Returns:** `nil`

### `monkey_setting(difficulty)`
* **Description:** Enables/disables Monkey barrels and adjusts regen/spawn periods and child range.
* **Parameters:** `difficulty` — string key.
* **Returns:** `nil`

### `dustmoths(difficulty)`
* **Description:** Enables/disables Dustmoth dens and adjusts regen/release time and max children.
* **Parameters:** `difficulty` — string key.
* **Returns:** `nil`

### `lightfliers(difficulty)`
* **Description:** Controls Lightflier flower regrow time and pickability via `LIGHTFLIER_FLOWER_REGROW_TIME` and `LIGHTFLIER_FLOWER_PICKABLE`.
* **Parameters:** `difficulty` — string key.
* **Returns:** `nil`

### `gnarwail(difficulty)`
* **Description:** Adjusts Gnarwail spawn chance and test radius.
* **Parameters:** `difficulty` — string key.
* **Returns:** `nil`

### `fishschools(difficulty)`
* **Description:** Tunes Fish school spawner behavior: delay, check radius, ocean percent, max fish, blocker mod/lifetime.
* **Parameters:** `difficulty` — string key.
* **Returns:** `nil`

### `otters_setting(difficulty)`
* **Description:** Enables/disables Otter dens and adjusts regen period.
* **Parameters:** `difficulty` — string key.
* **Returns:** `nil`

### `regrowth(difficulty)`
* **Description:** Global regrowth time multiplier via `REGROWTH_TIME_MULTIPLIER`.
* **Parameters:** `difficulty` — string: `never`, `veryslow`, `slow`, `fast`, `veryfast`.
* **Returns:** `nil`

### `flowers_regrowth(difficulty)`
* **Description:** Flower regrowth time multiplier via `FLOWER_REGROWTH_TIME_MULT`.
* **Parameters:** `difficulty` — string key.
* **Returns:** `nil`

### `flower_cave_regrowth(difficulty)`
* **Description:** Cave flower regrowth time multiplier via `FLOWER_CAVE_REGROWTH_TIME_MULT`.
* **Parameters:** `difficulty` — string key.
* **Returns:** `nil`

### `lightflier_flower_regrowth(difficulty)`
* **Description:** Lightflier flower regrowth time multiplier via `LIGHTFLIER_FLOWER_REGROWTH_TIME_MULT`.
* **Parameters:** `difficulty` — string key.
* **Returns:** `nil`

### `evergreen_regrowth(difficulty)`
* **Description:** Evergreen regrowth time multiplier via `EVERGREEN_REGROWTH_TIME_MULT`.
* **Parameters:** `difficulty` — string key.
* **Returns:** `nil`

### `twiggytrees_regrowth(difficulty)`
* **Description:** Twiggy tree regrowth time multiplier via `TWIGGYTREE_REGROWTH_TIME_MULT`.
* **Parameters:** `difficulty` — string key.
* **Returns:** `nil`

### `deciduoustree_regrowth(difficulty)`
* **Description:** Deciduous tree regrowth time multiplier via `DECIDIOUS_REGROWTH_TIME_MULT`.
* **Parameters:** `difficulty` — string key.
* **Returns:** `nil`

### `mushtree_regrowth(difficulty)`
* **Description:** Mushtree regrowth time multiplier via `MUSHTREE_REGROWTH_TIME_MULT`.
* **Parameters:** `difficulty` — string key.
* **Returns:** `nil`

### `moon_tree_regrowth(difficulty)`
* **Description:** Moon tree regrowth time multiplier via `MOONTREE_REGROWTH_TIME_MULT`.
* **Parameters:** `difficulty` — string key.
* **Returns:** `nil`

### `mushtree_moon_regrowth(difficulty)`
* **Description:** Moon Mushtree regrowth time multiplier via `MOONMUSHTREE_REGROWTH_TIME_MULT`.
* **Parameters:** `difficulty` — string key.
* **Returns:** `nil`

### `palmconetree_regrowth(difficulty)`
* **Description:** Palmcone tree regrowth time multiplier via `PALMCONETREE_REGROWTH_TIME_MULT`.
* **Parameters:** `difficulty` — string key.
* **Returns:** `nil`

### `tree_rock_regrowth(difficulty)`
* **Description:** Tree rock regrowth time multiplier via `TREE_ROCK_REGROWTH_TIME_MULT`.
* **Parameters:** `difficulty` — string key.
* **Returns:** `nil`

### `carrots_regrowth(difficulty)`
* **Description:** Carrot regrowth time multiplier via `CARROT_REGROWTH_TIME_MULT`.
* **Parameters:** `difficulty` — string key.
* **Returns:** `nil`

### `reeds_regrowth(difficulty)`
* **Description:** Reed regrowth time multiplier via `REEDS_REGROWTH_TIME_MULT`.
* **Parameters:** `difficulty` — string key.
* **Returns:** `nil`

### `cactus_regrowth(difficulty)`
* **Description:** Cactus regrowth time multiplier via `CACTUS_REGROWTH_TIME_MULT`.
* **Parameters:** `difficulty` — string key.
* **Returns:** `nil`

### `saltstack_regrowth(difficulty)`
* **Description:** Enables/disables Saltstack growth and sets growth frequency (with variance).
* **Parameters:** `difficulty` — string: `never`, `veryslow`, `slow`, `fast`, `veryfast`.
* **Returns:** `nil`

### `portal_spawnrate(difficulty)`
* **Description:** Enables/disables Monkey Island portal and adjusts spew time (`MONKEYISLAND_PORTAL_SPEWTIME`).
* **Parameters:** `difficulty` — string: `never`, `rare`, `often`, `always`.
* **Returns:** `nil`

### `bananabush_portalrate(difficulty)`
* **Description:** Adjusts weight for Banana Bush to spawn portal (`MONKEYISLAND_PORTAL_BANANABUSHWEIGHT`).
* **Parameters:** `difficulty` — string key.
* **Returns:** `nil`

### `lightcrab_portalrate(difficulty)`
* **Description:** Adjusts weight for Light Crab to spawn portal (`MONKEYISLAND_PORTAL_LIGHTCRABWEIGHT`).
* **Parameters:** `difficulty` — string key.
* **Returns:** `nil`

### `monkeytail_portalrate(difficulty)`
* **Description:** Adjusts weight for Monkey Tail to spawn portal (`MONKEYISLAND_PORTAL_MONKEYTAILWEIGHT`).
* **Parameters:** `difficulty` — string key.
* **Returns:** `nil`

### `palmcone_seed_portalrate(difficulty)`
* **Description:** Adjusts weight for Palmcone Seed to spawn portal (`MONKEYISLAND_PORTAL_PALMCONE_SEEDWEIGHT`).
* **Parameters:** `difficulty` — string key.
* **Returns:** `nil`

### `powder_monkey_portalrate(difficulty)`
* **Description:** Adjusts weight for Powder Monkey to spawn portal (`MONKEYISLAND_PORTAL_POWDERMONKEYWEIGHT`).
* **Parameters:** `difficulty` — string key.
* **Returns:** `nil`

### `frograin(difficulty)`
* **Description:** Sets frog rain tuning parameters based on difficulty level (e.g., `never`, `rare`, `often`, `always`, `force`).
* **Parameters:** `difficulty` — string.
* **Returns:** `nil`

### `earthquakes(difficulty)`
* **Description:** Configures earthquake frequency via `QUAKE_FREQUENCY_MULTIPLIER`.
* **Parameters:** `difficulty` — string: `never`, `rare`, `often`, `always`.
* **Returns:** `nil`

### `wildfires(difficulty)`
* **Description:** Sets wildfire spawn chance via `WILDFIRE_CHANCE`.
* **Parameters:** `difficulty` — string: `never`, `rare`, `often`, `always`.
* **Returns:** `nil`

### `petrification(difficulty)`
* **Description:** Configures petrification cycle (year range) via `PETRIFICATION_CYCLE`.
* **Parameters:** `difficulty` — string: `none`, `few`, `many`, `max`.
* **Returns:** `nil`

### `meteorshowers(difficulty)`
* **Description:** Configures meteor shower mechanics (LVL1–LVL3), including base/variable cooldowns, durations, meteor rates, and counts of medium/large meteors. All values are 0 for `never`, increase with difficulty.
* **Parameters:** `difficulty` — string: `never`, `rare`, `often`, `always`.
* **Returns:** `nil`

### `disease_delay(difficulty)`
* **Description:** Sets disease outbreak delay and variance (in seconds) via `DISEASE_DELAY_TIME` and `DISEASE_DELAY_TIME_VARIANCE`.
* **Parameters:** `difficulty` — string: `none`, `long`, `short`, `random`.
* **Returns:** `nil`

### `atriumgate(difficulty)`
* **Description:** Configures Atrium Gate cooldown (in seconds) via `ATRIUM_GATE_COOLDOWN`.
* **Parameters:** `difficulty` — string: `veryslow`, `slow`, `fast`, `veryfast`.
* **Returns:** `nil`

### `rifts_enabled(difficulty)`
* **Description:** Controls whether rifts spawn in surface world via `SPAWN_RIFTS` (0 = never, 2 = always).
* **Parameters:** `difficulty` — string: `never` or `always`.
* **Returns:** `nil`

### `rifts_frequency(difficulty)`
* **Description:** Sets rift spawn delay (`RIFTS_SPAWNDELAY`) in surface world. Uses `NEVER_TIME` for `never`, and `TUNING.SEG_TIME` for `always`.
* **Parameters:** `difficulty` — string: `never`, `rare`, `often`, `always`.
* **Returns:** `nil`

### `rifts_enabled_cave(difficulty)`
* **Description:** Same as `rifts_enabled`, but for cave world.
* **Parameters:** `difficulty` — string: `never` or `always`.
* **Returns:** `nil`

### `rifts_frequency_cave(difficulty)`
* **Description:** Same as `rifts_frequency`, but for cave world.
* **Parameters:** `difficulty` — string: `never`, `rare`, `often`, `always`.
* **Returns:** `nil`

### `lunarhail_frequency(difficulty)`
* **Description:** Sets cooldown for lunar hail events via `LUNARHAIL_EVENT_COOLDOWN`.
* **Parameters:** `difficulty` — string: `never`, `rare`, `often`, `always`.
* **Returns:** `nil`

### `acidrain_enabled(difficulty)`
* **Description:** Enables/disables acid rain via `ACIDRAIN_ENABLED` boolean. Only `none = false` supported in this chunk.
* **Parameters:** `difficulty` — string: `none`.
* **Returns:** `nil`

### `wanderingtrader_enabled(difficulty)`
* **Description:** Enables/disables Wandering Trader via `WANDERINGTRADER_ENABLED` boolean. Only `none = false` supported.
* **Parameters:** `difficulty` — string: `none`.
* **Returns:** `nil`

### `extrastartingitems(difficulty)`
* **Description:** Configures extra starting items delivery. If `difficulty == "none"`, sets `EXTRA_STARTING_ITEMS = {}`. If numeric string, sets `EXTRA_STARTING_ITEMS_MIN_DAYS`.
* **Parameters:** `difficulty` — string: `"none"`, `"default"`, or numeric string.
* **Returns:** `nil`

### `seasonalstartingitems(difficulty)`
* **Description:** Configures seasonal starting items. If `difficulty == "never"`, clears `SEASONAL_STARTING_ITEMS`.
* **Parameters:** `difficulty` — string: `"never"`, `"default"`.
* **Returns:** `nil`

### `dropeverythingondespawn(difficulty)`
* **Description:** If `difficulty == "always"`, enables `DROP_EVERYTHING_ON_DESPAWN`.
* **Parameters:** `difficulty` — string: `"always"`.
* **Returns:** `nil`

### `shadowcreatures(difficulty)`
* **Description:** Configures sanity monsters via multiple tuning variables: `SANITYMONSTERS_INDUCED_MAXPOP`, `SANITYMONSTERS_MAXPOP`, spawn intervals, chances, etc.
* **Parameters:** `difficulty` — string: `never`, `few`, `often`, `always`.
* **Returns:** `nil`

### `brightmarecreatures(difficulty)`
* **Description:** Configures Gestalt creature spawning via `GESTALT_MIN_SANITY_TO_SPAWN` and `GESTALT_POPULATION_LEVEL`, including `GESTALT_POP_CHANGE_INTERVAL` and related timers.
* **Parameters:** `difficulty` — string: `never`, `few`, `many`, `always`.
* **Returns:** `nil`

### `beefaloheat(difficulty)`
* **Description:** Configures Beefalo mating behavior via `BEEFALO_MATING_ENABLED`, `BEEFALO_MATING_SEASON_LENGTH`, `BEEFALO_MATING_SEASON_WAIT`, and `BEEFALO_MATING_ALWAYS`.
* **Parameters:** `difficulty` — string: `never`, `rare`, `often`, `always`.
* **Returns:** `nil`

### `krampus(difficulty)`
* **Description:** Configures Krampus mechanics: threshold, variance, level increases, ramp, and naughtiness decay period.
* **Parameters:** `difficulty` — string: `never`, `rare`, `often`, `always`.
* **Returns:** `nil`

### `temperaturedamage(difficulty)`
* **Description:** Controls whether temperature damage is lethal via `NONLETHAL_TEMPERATURE` (only `nonlethal = true` supported).
* **Parameters:** `difficulty` — string: `"nonlethal"`.
* **Returns:** `nil`

### `lessdamagetaken(difficulty)`
* **Description:** Adjusts player damage taken modifier via `PLAYER_DAMAGE_TAKEN_MOD`. Values: `0.35` (`always`, takes 35% damage), `-0.35` (`more`, takes 135% damage).
* **Parameters:** `difficulty` — string: `"always"` or `"more"`.
* **Returns:** `nil`

### `hunger(difficulty)`
* **Description:** Controls whether hunger damage is lethal via `NONLETHAL_HUNGER` (only `nonlethal = true` supported).
* **Parameters:** `difficulty` — string: `"nonlethal"`.
* **Returns:** `nil`

### `darkness(difficulty)`
* **Description:** Controls whether darkness damage is lethal via `NONLETHAL_DARKNESS` (only `nonlethal = true` supported).
* **Parameters:** `difficulty` — string: `"nonlethal"`.
* **Returns:** `nil`

### `healthpenalty(difficulty)`
* **Description:** Enables/disables health penalty via `HEALTH_PENALTY_ENABLED`. Only `none = false` defined.
* **Parameters:** `difficulty` — string: `"none"`.
* **Returns:** `nil`

### `mutated_hounds(difficulty)`
* **Description:** Enables/disables mutated hounds via `SPAWN_MUTATED_HOUNDS`. Only `never = false` defined.
* **Parameters:** `difficulty` — string: `"never"`.
* **Returns:** `nil`

### `moon_spider(difficulty)`
* **Description:** Configures Moon Spider den mechanics: number of spiders, regen time, release time, emergency radius/max investigators. Controls enable via `MOONSPIDERDEN_ENABLED` (set only in `few`).
* **Parameters:** `difficulty` — string: `never`, `few`, `many`, `always`.
* **Returns:** `nil`

### `penguins_moon(difficulty)`
* **Description:** Enables/disables Moon penguins via `SPAWN_MOON_PENGULLS`. Only `never = false` defined.
* **Parameters:** `difficulty` — string: `"never"`.
* **Returns:** `nil`

### `mutated_birds(difficulty)`
* **Description:** Enables/disables mutated birds via `SPAWN_MUTATED_BIRDS`. Only `never = false` defined.
* **Parameters:** `difficulty` — string: `"never"`.
* **Returns:** `nil`

### `mutated_merm(difficulty)`
* **Description:** Enables/disables mutated Merms via `SPAWN_MUTATED_MERMS`. Only `never = false` defined.
* **Parameters:** `difficulty` — string: `"never"`.
* **Returns:** `nil`

### `mutated_spiderqueen(difficulty)`
* **Description:** Enables/disables mutated Spider Queen via `SPAWN_MUTATED_SPIDERQUEEN`. Only `never = false` defined.
* **Parameters:** `difficulty` — string: `"never"`.
* **Returns:** `nil`

### `mutated_bird_gestalt(difficulty)`
* **Description:** Enables/disables mutated birds in Gestalt via `SPAWN_MUTATED_BIRDS_GESTALT`. Only `never = false` defined.
* **Parameters:** `difficulty` — string: `"never"`.
* **Returns:** `nil`

### `mutated_buzzard_gestalt(difficulty)`
* **Description:** Enables/disables mutated Buzzards via `SPAWN_MUTATED_BUZZARDS_GESTALT`. Only `never = false` defined.
* **Parameters:** `difficulty` — string: `"never"`.
* **Returns:** `nil`

### `mutated_deerclops(difficulty)`
* **Description:** Enables/disables mutated Deerclops via `SPAWN_MUTATED_DEERCLOPS`. Only `never = false` defined.
* **Parameters:** `difficulty` — string: `"never"`.
* **Returns:** `nil`

### `mutated_bearger(difficulty)`
* **Description:** Enables/disables mutated Bearger via `SPAWN_MUTATED_BEARGER`. Only `never = false` defined.
* **Parameters:** `difficulty` — string: `"never"`.
* **Returns:** `nil`

### `mutated_warg(difficulty)`
* **Description:** Enables/disables mutated Warg via `SPAWN_MUTATED_WARG`. Only `never = false` defined.
* **Parameters:** `difficulty` — string: `"never"`.
* **Returns:** `nil`

### `applyoverrides_post.hounds(difficulty)`
* **Description:** For forest worlds, pushes `"hounded_setdifficulty"` event with difficulty.
* **Parameters:** `difficulty` — string.
* **Returns:** `nil`

### `applyoverrides_post.summerhounds(difficulty)`
* **Description:** For forest worlds, pushes `"hounded_setsummervariant"` event with difficulty.
* **Parameters:** `difficulty` — string.
* **Returns:** `nil`

### `applyoverrides_post.winterhounds(difficulty)`
* **Description:** For forest worlds, pushes `"hounded_setwintervariant"` event with difficulty.
* **Parameters:** `difficulty` — string.
* **Returns:** `nil`

### `applyoverrides_post.wormattacks(difficulty)`
* **Description:** For cave worlds, pushes `"hounded_setdifficulty"` event with difficulty.
* **Parameters:** `difficulty` — string.
* **Returns:** `nil`

### `applyoverrides_post.wormattacks_boss(difficulty)`
* **Description:** For cave worlds, pushes `"hounds_worm_boss_setdifficulty"` event with difficulty.
* **Parameters:** `difficulty` — string.
* **Returns:** `nil`

### `applyoverrides_post.autumn(difficulty)`
* **Description:** Sets autumn season length via `"ms_setseasonlength"` event. Uses `GetRandomItem(SEASON_FRIENDLY_LENGTHS)` for `random`; otherwise indexes `SEASON_FRIENDLY_LENGTHS[difficulty]`.
* **Parameters:** `difficulty` — string: `rare`, `often`, `always`, `random`.
* **Returns:** `nil`

### `applyoverrides_post.winter(difficulty)`
* **Description:** Sets winter season length via `"ms_setseasonlength"` event. Uses `GetRandomItem(SEASON_HARSH_LENGTHS)` for `random`; otherwise indexes `SEASON_HARSH_LENGTHS[difficulty]`.
* **Parameters:** `difficulty` — string.
* **Returns:** `nil`

### `applyoverrides_post.spring(difficulty)`
* **Description:** Sets spring season length via `"ms_setseasonlength"` event (like autumn).
* **Parameters:** `difficulty` — string.
* **Returns:** `nil`

### `applyoverrides_post.summer(difficulty)`
* **Description:** Sets summer season length via `"ms_setseasonlength"` event (like winter).
* **Parameters:** `difficulty` — string.
* **Returns:** `nil`

### `applyoverrides_post.day(difficulty)`
* **Description:** Sets segment modifiers for day/dusk/night via `"ms_setseasonsegmodifier"` event. Supports keys: `"onlyday"`, `"longnight"`, `"nodusk"`, etc.
* **Parameters:** `difficulty` — string (e.g., `"longday"`, `"nonight"`).
* **Returns:** `nil`

### `applyoverrides_post.weather(difficulty)`
* **Description:** Sets precipitation mode and moisture scale via `"ms_setprecipitationmode"` and `"ms_setmoisturescale"` events. Supports: `never`, `rare`, `default`, `often`, `always`, `squall`.
* **Parameters:** `difficulty` — string.
* **Returns:** `nil`

### `applyoverrides_post.lightning(difficulty)`
* **Description:** Sets lightning mode and delay via `"ms_setlightningmode"` and `"ms_setlightningdelay"` events. Supports: `never`, `rare`, `default`, `often`, `always`.
* **Parameters:** `difficulty` — string.
* **Returns:** `nil`

### `applyoverrides_post.spawnmode(difficulty)`
* **Description:** Maps `"default"` to `"fixed"`, then pushes `"ms_setworldsetting"` and `"ms_setspawnmode"` events.
* **Parameters:** `difficulty` — string.
* **Returns:** `nil`

### `applyoverrides_post.basicresource_regrowth(difficulty)`
* **Description:** Maps `"default"` to `"none"`, converts `"always"` to boolean `true`, pushes `"ms_setworldsetting"` and `"ms_enableresourcerenewal"` events.
* **Parameters:** `difficulty` — string.
* **Returns:** `nil`

### `applyoverrides_post.ghostsanitydrain(difficulty)`
* **Description:** Maps `"default"` to `"always"`, converts to boolean, pushes `"ms_setworldsetting"` event.
* **Parameters:** `difficulty` — string.
* **Returns:** `nil`

### `applyoverrides_post.ghostenabled(difficulty)`
* **Description:** Maps `"default"` to `"always"`, converts to boolean, pushes `"ms_setworldsetting"` event.
* **Parameters:** `difficulty` — string.
* **Returns:** `nil`

### `applyoverrides_post.portalresurection(difficulty)`
* **Description:** Maps `"default"` to `"none"`, converts `"always"` to boolean `true`, pushes `"ms_setworldsetting"` and `"ms_onportalrez"` events.
* **Parameters:** `difficulty` — string.
* **Returns:** `nil`

### `applyoverrides_post.resettime(difficulty)`
* **Description:** Maps difficulty to `reset_time` table (e.g., `{time=120, loadingtime=180}`) or `{instant=true}`. Pushes `"ms_setworldsetting"` and `"ms_setworldresettime"` events.
* **Parameters:** `difficulty` — string: `"none"`, `"slow"`, `"default"`, `"fast"`, `"always"`.
* **Returns:** `nil`

### `applyoverrides_post.rifts_frequency(difficulty)`
* **Description:** Pushes `"rifts_setdifficulty"` event.
* **Parameters:** `difficulty` — string.
* **Returns:** `nil`

### `applyoverrides_post.rifts_enabled(difficulty)`
* **Description:** Pushes `"rifts_settingsenabled"` event.
* **Parameters:** `difficulty` — string.
* **Returns:** `nil`

### `applyoverrides_post.rifts_frequency_cave(difficulty)`
* **Description:** Pushes `"rifts_setdifficulty"` event (cave variant).
* **Parameters:** `difficulty` — string.
* **Returns:** `nil`

### `applyoverrides_post.rifts_enabled_cave(difficulty)`
* **Description:** Pushes `"rifts_settingsenabled_cave"` event.
* **Parameters:** `difficulty` — string.
* **Returns:** `nil`

### `areaambientdefault(prefab)`
* **Description:** Overrides ambient sounds for cave or surface (`forest`) world. Clears existing sounds and sets appropriate ambient (e.g., `"SINKHOLE"` for cave, `"ROCKY"` for surface) for specific world tiles.
* **Parameters:** `prefab` — string: `"cave"` or otherwise assumed surface/forest.
* **Returns:** `nil`

## Events & listeners
**Pushes:**
- `hounded_setdifficulty` — Sets hound difficulty (surface/cave)
- `hounded_setsummervariant` — Sets summer variant for hounds
- `hounded_setwintervariant` — Sets winter variant for hounds
- `hounds_worm_boss_setdifficulty` — Sets boss worm difficulty in caves
- `ms_setseasonlength` — Sets season length
- `ms_setseasonsegmodifier` — Sets day/dusk/night segment modifiers
- `ms_setprecipitationmode` — Sets precipitation mode (`never`, `dynamic`, `always`)
- `ms_setmoisturescale` — Sets moisture scale for precipitation
- `ms_setlightningmode` — Sets lightning mode
- `ms_setlightningdelay` — Sets lightning delay parameters
- `ms_setworldsetting` — Generic world setting update
- `ms_enableresourcerenewal` — Enables/disables resource regrowth
- `ms_onportalrez` — Enables/disables portal resurrection
- `ms_setworldresettime` — Sets world reset timer
- `rifts_setdifficulty` — Sets rift spawn difficulty
- `rifts_settingsenabled` — Enables rifts (surface)
- `rifts_settingsenabled_cave` — Enables rifts (cave)
- `overrideambientsound` — Overrides ambient sound for a tile type

**Listens to:** None