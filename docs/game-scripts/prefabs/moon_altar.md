---
id: moon_altar
title: Moon Altar
description: Manages the lifecycle, linking behavior, and crafting progression of celestial altars in the DST Moon Biome.
tags: [crafting, structure, lighting, network, environment]
sidebar_position: 10

last_updated: 2026-03-06
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: abb03d99
system_scope: environment
---

# Moon Altar

> Based on game build **714014** | Last updated: 2026-03-06

## Overview
The `moon_altar` prefab defines three variants (`moon_altar`, `moon_altar_cosmic`, and `moon_altar_astral`) of celestial altar structures used to access the Moon Biome and craft celestial items. It coordinates multi-stage construction via the `workable` component, handles linking to other altars via the `moonaltarlinktarget` component, manages lighting flicker via `DoPeriodicTask`, and integrates with the world's meteor shower system to influence moonrock shell drops.

Altars transition through 1–3 stages (or 1–2 for astral), unlocking prototype recipes only when fully assembled and successfully linked. The component uses sound, animation, and lighting callbacks to provide real-time feedback during construction, activation, and linking.

## Usage example
```lua
-- Create a basic moon altar instance
local altar = Prefab("moon_altar")

-- In the master postinit, manually set the stage and repair material if needed
-- (Not typical for modders—used internally by the prefab factory function)

-- Linking behavior is triggered automatically when an altar reaches stage 3 (or stage 2 for astral)
-- via `inst.components.moonaltarlinktarget:TryEstablishLink()`
```

## Dependencies & tags
**Components used:** `inspectable`, `lootdropper`, `workable`, `moonaltarlinktarget`, `hauntable`, `repairable`, `prototyper`, `light`, `soundemitter`, `animator`, `minimapentity`, `physics`, `transform`, `network`, `combat`, `inventory`, `worldmeteorshower`

**Tags added/used:** `structure`, `celestial_station`, `FX`, `NOCLICK`, `moon_altar_astral_marker`, `antlion_sinkhole_blocker`, `moon_altar_link`, `moon_device`, `burnt`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `_stage` | number | `1` | Current construction stage (1, 2, or 3). For astral altars, only `1` or `2`. |
| `_force_on` | boolean | `false` | Indicates if the altar is forced into the "on" state (e.g., due to being linked), bypassing default `onturnoff` logic. |
| `_activetask` | Task | `nil` | Pending delayed task for starting prototyper loop sound after animation transitions. |
| `_flickertask` | Task | `nil` | Periodic task managing light flicker animation. |
| `_sounds` | table | `nil` | Sound bank for this altar variant (e.g., `sounds.moon_altar`). |
| `nameoverride` | string | `nil` | Override for the display name (used only by astral altars during WIP state). |

## Main functions
### `set_stage(inst, stage)`
*   **Description:** Updates the altar’s construction stage, adjusts animations, loot, and repairsables, adds the `prototyper` component at stages 2/3, and triggers linking if not `POPULATING`.
*   **Parameters:** `inst` (Entity), `stage` (number: 1, 2, or 3). Stage `2` may trigger prototyper component addition depending on max work value.
*   **Returns:** Nothing.
*   **Error states:** If `stage` is `nil`, defaults to `1`. Animation logic and loot changes are conditional on current `_stage`.

### `onturnon(inst)`
*   **Description:** Plays proximity animations (`proximity_pre` → `proximity_loop`) and sounds when the altars prototyper is turned on. No effect if `_force_on` is true or if linked.
*   **Parameters:** `inst` (Entity).
*   **Returns:** Nothing.
*   **Error states:** Skips animation/sound if altar is already linked.

### `onturnoff(inst)`
*   **Description:** Plays the `proximity_pst` animation and stops loop sound if the altars prototyper is turned off and not forced on.
*   **Parameters:** `inst` (Entity).
*   **Returns:** Nothing.

### `onactivate(inst)`
*   **Description:** Plays the `use` animation and loop sound when a recipe is activated via the altars prototyper.
*   **Parameters:** `inst` (Entity).
*   **Returns:** Nothing.

### `on_piece_slotted(inst, slotter, slotted_item)`
*   **Description:** Incrementally called when a repairable piece is slotted (via `repairable.onrepaired`), advancing `_stage`.
*   **Parameters:** `inst` (Entity), `slotter` (Entity), `slotted_item` (Item prefab).
*   **Returns:** Nothing.

### `check_piece(inst, piece)`
*   **Description:** Validates that a piece matches the current stage for standard/cosmic altars (seed → stage 1, idol → stage 2).
*   **Parameters:** `inst` (Entity), `piece` (Entity with `prefab` field).
*   **Returns:** `true`, or `false, "WRONGPIECE"`.

### `check_pieceastral(inst, piece)`
*   **Description:** Validation callback for astral altars, requiring `moon_altar_ward` at stage 1.
*   **Parameters:** `inst` (Entity), `piece` (Entity).
*   **Returns:** `true`, or `false, "WRONGPIECE"`.

### `addprototyper(inst)`
*   **Description:** Adds the `prototyper` component and configures its callbacks (`onturnon`, `onturnoff`, `onactivate`) and tech tree.
*   **Parameters:** `inst` (Entity).
*   **Returns:** Nothing.

### `spawn_loot_apart(inst, offset_multiplier)`
*   **Description:** Spawns each loot item from `lootdropper:GenerateLoot()` at randomized positions near the altar.
*   **Parameters:** `inst` (Entity), `offset_multiplier` (ignored in source).
*   **Returns:** Nothing.

### `onhammered(inst, worker)`
*   **Description:** Handles altar destruction. Spawns a fissure and `collapse_small`, drops loot, and removes the entity.
*   **Parameters:** `inst` (Entity), `worker` (Entity performing the hammer).
*   **Returns:** Nothing.

### `onhit(inst, hitter, work_left, work_done)`
*   **Description:** Handles hit events during work. Restores work if altar is linked or forced on (to prevent sabotage), deals lightning damage to uninsulated workers, and triggers spark FX.
*   **Parameters:** `inst` (Entity), `hitter` (Entity), `work_left` (number), `work_done` (number).
*   **Returns:** Nothing.
*   **Error states:** Returns early (no animation or sound) if `work_left <= 0` and no prototyper/link active.

### `OnLink(inst, link)`
*   **Description:** Called when the altar successfully links to 2 others. Forces the altar on (`_force_on = true`) and manages animation transitions to the proximity loop.
*   **Parameters:** `inst` (Entity), `link` (Entity — link object).
*   **Returns:** Nothing.

### `OnLinkBroken(inst, link)`
*   **Description:** Called when the link is broken. Reverts to idle animation if not `_force_on`.
*   **Parameters:** `inst` (Entity), `link` (Entity).
*   **Returns:** Nothing.

### `OnFoundOtherAltar(inst, other_altar)`
*   **Description:** Spawns an `moon_altar_link_fx_spawner` to visualize a link attempt between altars.
*   **Parameters:** `inst` (Entity), `other_altar` (Entity or `nil`).
*   **Returns:** Nothing.

### `OnUpdateFlicker(inst, starttime)`
*   **Description:** Periodic function (called every ~0.1s) that updates light intensity using a sin-based flicker function.
*   **Parameters:** `inst` (Entity), `starttime` (number — unused).
*   **Returns:** Nothing.

### `MoonAltarCanBeLinked(inst)`
*   **Description:** Predicate used by `moonaltarlinktarget.canbelinkedfn` — allows linking only when unlinked and stage 3.
*   **Parameters:** `inst` (Entity).
*   **Returns:** `true` if `_stage == 3` and `link == nil`; else `false`.

### `MoonAltarCosmicCanBeLinked(inst)`
*   **Description:** Allows linking without stage restriction (cosmic altars spawn fully built).
*   **Parameters:** `inst` (Entity).
*   **Returns:** `true` if `link == nil`; else `false`.

### `MoonAltarAstralCanBeLinked(inst)`
*   **Description:** Predicate for astral altars — allows linking only when stage 2.
*   **Parameters:** `inst` (Entity).
*   **Returns:** `true` if `_stage == 2` and `link == nil`; else `false`.

### `OnEntitySleep(inst)`
*   **Description:** Cancels the light flicker task to save resources during world sleep.
*   **Parameters:** `inst` (Entity).
*   **Returns:** Nothing.

### `OnEntityWake(inst)`
*   **Description:** Restarts the light flicker task when the world wakes.
*   **Parameters:** `inst` (Entity).
*   **Returns:** Nothing.

### `moon_altar_on_save(inst, data)`
*   **Description:** Saves `_stage` and `_force_on` to persistence.
*   **Parameters:** `inst` (Entity), `data` (table).
*   **Returns:** Nothing.

### `moon_altar_on_load(inst, data)`
*   **Description:** Restores `_stage` and `_force_on` from saved data.
*   **Parameters:** `inst` (Entity), `data` (table or `nil`).
*   **Returns:** Nothing.

### `OnLoadPostPass(inst)`
*   **Description:** Called after world load. If `_force_on` is set but no linked devices exist nearby, resets `_force_on` to allow hammering and restart linking.
*   **Parameters:** `inst` (Entity).
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** `on_fissure_socket` — calls `OnFissureSocket` to initialize animations and sound upon socketing, or `OnFissureSocket_CosmicPost` for cosmic altars.
- **Listens to:** `calling_moon_relics` (via `TheWorld`) — registers the altar as a device in `data.caller` (used by moon relics system).
- **Pushes:** No events directly; defers to parent `workable` and `moonaltarlinktarget` for event propagation.

## Special Notes
- Altars in the Moon Biome must be placed on `moon_fissure` sockets; the `on_fissure_socket` event triggers stage/animation initialization.
- Cosmic altars (`moon_altar_cosmic`) spawn at full health; only the astral variant uses `moon_altar_ward` and has only 2 stages.
- The `moonaltarlinktarget.link_radius` is defined by `TUNING.MOON_ALTAR_ESTABLISH_LINK_RADIUS`.
- Lighting flicker uses `OnUpdateFlicker`, which drives intensity based on a double-sine modulation.
- All altars become unbuildable (`Repairable` removed) after stage `2` or `3` and instead use prototyper to craft.