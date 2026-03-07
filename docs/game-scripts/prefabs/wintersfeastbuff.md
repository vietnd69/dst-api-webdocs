---
id: wintersfeastbuff
title: Wintersfeastbuff
description: Applies a timed damage-healing buff that restores health, hunger, and sanity over time while reducing hunger burn rate, and supports bonus duration extension based on feast statistics.
tags: [buff, entity, combat, sanity, hunger]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 04650e34
system_scope: entity
---

# Wintersfeastbuff

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
`wintersfeastbuff` is a non-persistent, invisible entity component used as a debuff that periodically restores health, hunger, and sanity to a target entity, while applying modifiers to hunger burn rate and sanity gain. It is attached to the target during the Winters Feast event. It includes logic for duration extension based on the number of participants and food types in the feast (`AddEffectBonus`), and spawns a spirit item (`wintersfeastfuel`) if the buff expires after a specific threshold. The buff also plays continuous sound effects and a looping particle effect (`wintersfeastbuff_fx`) whose frequency and intensity scale inversely with remaining duration.

## Usage example
```lua
-- When a player eats Winters Feast food, attach the buff:
local buff = SpawnPrefab("wintersfeastbuff")
buff.addeffectbonusfn(buff, num_feasters, num_foodtypes, num_totalfood)
buff.components.debuff:Attach(player)
```

## Dependencies & tags
**Components used:** `debuff`, `timer`, `health`, `hunger`, `sanity`, `talker`, `transform`, `soundemitter`, `animstate` (for FX entity).  
**Tags added/removed:** Adds `"wintersfeastbuff"` to target; removes `"wintersfeastbuff"` on target when buff detaches. Buff entity carries tag `"CLASSIFIED"` and is not networked.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `addeffectbonusfn` | function | `nil` | Callback set to `AddEffectBonus` to allow external code to extend remaining buff duration based on feast stats. |

## Main functions
### `AddEffectBonus(num_feasters, num_foodtypes, num_totalfood)`
*   **Description:** Extends the remaining buff duration proportionally to the number of feasters and food types involved in the feast, and updates the sound intensity based on current duration.
*   **Parameters:**
    * `num_feasters` (number) – Number of entities that ate Winters Feast food; defaults to `1`.
    * `num_foodtypes` (number) – Number of distinct food types eaten; defaults to `1`.
    * `num_totalfood` (number) – Total number of food items eaten; defaults to `1`.
*   **Returns:** Nothing.
*   **Error states:** No side effects if `num_feasters` or `num_foodtypes` are zero; bonus is capped by logic (no negative extension).

### `OnAttached(inst, target)`
*   **Description:** Attaches the buff to a target entity: parents the buff entity, starts tick and FX tasks, registers death listener, plays sound, applies modifiers to hunger burn and sanity gain, and tags the target.
*   **Parameters:**
    * `inst` (Entity) – The buff entity itself.
    * `target` (Entity) – The entity receiving the buff.
*   **Returns:** Nothing.

### `OnDetached(inst, target)`
*   **Description:** Removes the buff: cleans up modifiers, announces completion via speech if possible, and destroys the buff entity.
*   **Parameters:**
    * `inst` (Entity) – The buff entity itself.
    * `target` (Entity) – The entity that previously had the buff.
*   **Returns:** Nothing.

### `OnTick(inst, target)`
*   **Description:** Periodic callback that restores health and hunger (and sanity via modifier) to the target, or stops the buff if the target is dead or a ghost.
*   **Parameters:**
    * `inst` (Entity) – The buff entity.
    * `target` (Entity) – The target entity.
*   **Returns:** Nothing.

### `OnFxTick(inst, target)`
*   **Description:** Spawns and positions the `wintersfeastbuff_fx` prefab, updates sound intensity based on remaining time, and schedules the next FX tick.
*   **Parameters:**
    * `inst` (Entity) – The buff entity.
    * `target` (Entity) – The target entity whose position is used for FX placement.
*   **Returns:** Nothing.

### `CalcIntensity(inst)`
*   **Description:** Calculates the sound FX intensity as a value between `0` and `1`, scaling linearly with the ratio of remaining time to maximum duration.
*   **Parameters:**
    * `inst` (Entity) – The buff entity.
*   **Returns:** Number (0 to 1).

### `OnTimerDone(inst, data)`
*   **Description:** Handler for timer expiration; stops the buff when `"buffover"` timer completes.
*   **Parameters:**
    * `inst` (Entity) – The buff entity.
    * `data` (table) – Timer data containing `"name"` key; only `"buffover"` triggers the stop.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:**
  * `"death"` on target — Spawns `wintersfeastfuel` if remaining duration exceeds `DROP_SPIRIT_PERCENTAGE_THRESHOLD` of max duration, then stops buff.
  * `"onremove"` on target — Removes `"wintersfeastbuff"` tag from target when buff is removed.
  * `"timerdone"` — Triggers `OnTimerDone` to finalize buff termination.
- **Pushes:** None.