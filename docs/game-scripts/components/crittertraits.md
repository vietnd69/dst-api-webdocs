---
id: crittertraits
title: Crittertraits
description: Manages a critter entity's personality traits, including tracking scores for behaviors like combat, playfulness, and crafting, and determining the dominant trait that influences the critter's emotes and stats.
tags: [ai, personality, combat, crafting, social]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: dea09709
system_scope: entity
---

# Crittertraits

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`CritterTraits` tracks a critter's behavioral tendencies across multiple traits (e.g., `COMBAT`, `PLAYFUL`, `CRAFTY`, `WELLFED`) based on actions such as eating, petting, combat participation, and crafting. It uses a scoring system (`traitscore`) with per-trait increments and a decay mechanism, and maintains a single `dominanttrait` that activates a corresponding tag and influences the critter's behavior. It reacts to events on both the critter and its leader (via the `follower` component) to synchronize trait gains with the owner's activities.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("crittertraits")
inst:AddComponent("timer")
inst:AddComponent("follower")

inst.components.crittertraits:SetOnPetFn(function(critter, petter)
    print(petter .. " petted " .. critter)
end)
```

## Dependencies & tags
**Components used:** `edible` (accessed via `data.food.components.edible.foodtype`), `follower`, `timer`
**Tags:** Adds/removes `trait_<TRAITNAME>` (e.g., `trait_COMBAT`); checks `stale` on food and `preparedfood`, `fresh` for scoring multipliers.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `traitscore` | table of numbers | `{}` initialized for all keys in `TUNING.CRITTER_TRAITS` | Current score for each trait, bounded between `TRAIT_MIN` (-6) and `TRAIT_MAX` (40). |
| `dominanttrait` | string or `nil` | `nil` | Uppercase name of the current dominant trait, or `nil` if no dominant trait. |
| `dominanttraitlocked` | boolean | `nil` | When `true`, prevents the dominant trait from being recalculated (typically set after feeding a "goodies" food). |
| `onpetfn` | function or `nil` | `nil` | Optional callback invoked when the critter is pet. |
| `pettask` | task reference or `nil` | `nil` | Task handle for scheduling or canceling petting windows. |

## Main functions
### `SetOnPetFn(fn)`
* **Description:** Sets a custom callback function to be executed when the critter is pet.
* **Parameters:** `fn` (function) - A function taking `(critter_inst, petter_inst)` as arguments.
* **Returns:** Nothing.

### `OnPet(petter)`
* **Description:** Triggers the pet emote state and invokes `onpetfn` if set.
* **Parameters:** `petter` (entity instance) - The entity that pet the critter.
* **Returns:** Nothing.

### `IncTracker(name, multiplier)`
* **Description:** Increases a trait's score by `multiplier × trait.inc`. Applies a 1.1× bias if the trait is currently dominant. Clamps the score to `[TRAIT_MIN, TRAIT_MAX]`.
* **Parameters:** 
  - `name` (string) - Lowercase trait key (e.g., `"wellfed"`). Converted internally to uppercase.
  - `multiplier` (number or `nil`) - Scaling factor for the increment. Defaults to `1`.
* **Returns:** Nothing.

### `DecayTraits()`
* **Description:** Reduces all trait scores by their respective decay rates scaled by `DECAY_TICK_RATE`, clamping to `TRAIT_MIN`.
* **Parameters:** None.
* **Returns:** Nothing.

### `SetDominantTrait(trait)`
* **Description:** Updates the dominant trait and applies/removes the `trait_<TRAITNAME>` tag on the critter. Accepts `nil` to clear dominance.
* **Parameters:** `trait` (string or `nil`) - Uppercase trait name (e.g., `"PLAYFUL"`), or `nil`.
* **Returns:** Nothing.

### `IsDominantTrait(trait)`
* **Description:** Returns whether the given trait is currently dominant.
* **Parameters:** `trait` (string) - Uppercase trait name.
* **Returns:** `boolean` — `true` if `trait` equals the current `dominanttrait`; otherwise `false`.

### `RefreshDominantTrait()`
* **Description:** Recalculates the dominant trait based on `traitscore` values. Only runs if `dominanttraitlocked` is `nil` or `false`. Pushes a `crittertraitchanged` event if the dominant trait changes. Also reports metrics.
* **Parameters:** None.
* **Returns:** Nothing.

### `StartTracking()`
* **Description:** Registers all event listeners for behavior tracking on both the critter and its leader (via `follower`), and starts the `decay` and `dominant` timers.
* **Parameters:** None.
* **Returns:** Nothing.

### `OnSave()`
* **Description:** Serializes the component state for persistence (e.g., `dominanttrait`, `dominanttraitlocked`, and `traitscore`).
* **Parameters:** None.
* **Returns:** `table` — A serializable data structure containing all tracked state.

### `OnLoad(data)`
* **Description:** Restores component state from saved `data`. Includes legacy handling to migrate `AFFECTIONATE` trait scores into `PLAYFUL`.
* **Parameters:** `data` (table or `nil`) — Previously saved data from `OnSave()`.
* **Returns:** Nothing.

### `GetDebugString()`
* **Description:** Returns a formatted string listing the current dominant trait (with " - Locked" if applicable) and all trait scores.
* **Parameters:** None.
* **Returns:** `string` — A multiline debug string.

## Events & listeners
- **Listens to:**
  - `oneat` (critter) — Adds score to `wellfed` and may lock dominant trait on feeding "goodies".
  - `perished` (critter) — Decreases `wellfed` score.
  - `critter_onpet` (critter) — Increases `playful` score.
  - `critter_onnuzzle` (critter) — Sets up a timer to allow petting for boosted scores.
  - `critter_onplaying` (critter) — Increases `playful` score.
  - `timerdone` (critter) — Triggers trait decay or dominant trait refresh.
  - `killed`, `onhitother`, `death` (owner) — Increases/decreases `combat` score.
  - `finishedwork`, `unlockrecipe`, `builditem`, `buildstructure` (owner) — Increases `crafty` score and potentially triggers the `queuecraftyemote` memory flag.
- **Pushes:**
  - `crittertraitchanged` — Fired with `{trait=<TRAITNAME>}` when the dominant trait changes.
  - Metrics events: `"crittertraits.locked"` and `"crittertrait.dominant"` via `Stats.PushMetricsEvent`.
