---
id: play_commonfn
title: Play Commonfn
description: Provides utility functions for orchestrating stage performances, including character positioning, visual effects, costume swaps, and crowd interactions.
tags: [stage, performance, effects, ai, roleplay]
sidebar_position: 10

last_updated: 2026-03-10
build_version: 714014
change_status: stable
category_type: root
source_hash: 23d127c4
system_scope: entity
---

# Play Commonfn

> Based on game build **714014** | Last updated: 2026-03-10

## Overview
`play_commonfn` is a utility module containing shared helper functions used during scripted play sequences and cinematic events in *Don't Starve Together*. These functions manage actor positioning, visual effects (FX), costume/mask swaps, sound playback, and coordination with the game's stategraph and locomotion systems. It is typically invoked by higher-level play/script systems rather than being attached as a component.

## Usage example
```lua
local fns = require "play_commonfn"

-- Position actors around a center entity (e.g., a stage)
fns.findpositions(center_inst, {
    roles = {"ACTOR1", "ACTOR2"},
    positions = {ACTOR1 = 1, ACTOR2 = 2},
    duration = 1.0
}, cast)

-- Trigger mask blinking effect
fns.maskflash(center_inst, {line = {...}, time = 0.5}, cast)

-- Swap actor costumes dynamically
fns.swapmask(center_inst, {
    roles = {"ACTOR1"},
    mask = "mask_waxwell",
    body = "costume_summer"
}, cast)
```

## Dependencies & tags
**Components used:** `stageactingprop`, `inventory`, `locomotor`, `rider`, `skinner`, `talker`, `health`, `sleeper`, `revivablecorpse`, `container`, `stackable`, `Physics`, `AnimState`, `Transform`, `SoundEmitter`, `Follower`.  
**Tags:** Checks for `player`, `equipmentmodel`, `ignoretalking`, `debuffed`, `buffed`, `away`; not responsible for adding/removing tags.

## Properties
No public properties.

## Main functions
### `callbirds(inst, line, cast)`
*   **Description:** Instructs birds (`BIRD1`, `BIRD2`) to enter the stage and adds the narrator to the cast. Used to initiate a bird performance sequence.
*   **Parameters:**
    *   `inst` (entity) — The center entity (typically the stage/narrator).
    *   `line` (table) — Script line data (unused directly, but may contain timing hints).
    *   `cast` (table | nil) — Map of costume names to cast data (`{castmember = entity}`). May be `nil`.
*   **Returns:** Nothing.
*   **Error states:** Does nothing if `cast` is `nil` or stageactingprop is missing.

### `exitbirds(inst, line, cast)`
*   **Description:** Signals birds to exit the stage (sets `exited_stage = true`) after a short delay.
*   **Parameters:**
    *   Same as `callbirds`.
*   **Returns:** Nothing.

### `actorscurtsey(inst, line, cast)`
*   **Description:** Instructs all actors in the cast to perform a curtsy with randomized timing.
*   **Parameters:** Same as `callbirds`.
*   **Returns:** Nothing.

### `actorsbow(inst, line, cast)`
*   **Description:** Instructs all actors in the cast to perform a bow with randomized timing.
*   **Parameters:** Same as `callbirds`.
*   **Returns:** Nothing.

### `do_mask_blink(inst, line, cast)`
*   **Description:** Spawns and attaches `mask_halfwit_fx` to each actor’s head (used for mask blinking effects).
*   **Parameters:** Same as `callbirds`.
*   **Returns:** Nothing.

### `marionetteon(inst, line, cast)`
*   **Description:** Spawns a timed `marionette_appear_fx` on each non-bird/narrator actor to simulate marionette control activation.
*   **Parameters:** Same as `callbirds`.
*   **Returns:** Nothing.

### `marionetteoff(inst, line, cast)`
*   **Description:** Spawns a timed `marionette_disappear_fx` on each non-bird/narrator actor to simulate marionette control deactivation.
*   **Parameters:** Same as `callbirds`.
*   **Returns:** Nothing.

### `startbgmusic(inst, line, cast)`
*   **Description:** Sets background music type based on `line.musictype`. If `musictype` is missing, defaults to `1`.
*   **Parameters:** Same as `callbirds`.
*   **Returns:** Nothing.

### `stopbgmusic(inst, line, cast)`
*   **Description:** Sets background music type to `0` (off).
*   **Parameters:** Same as `callbirds`.
*   **Returns:** Nothing.

### `stageon(inst)`
*   **Description:** Forces the narrator’s stategraph into the `"narrator_on"` state.
*   **Parameters:**
    *   `inst` (entity) — The narrator entity.
*   **Returns:** Nothing.

### `stageoff(inst)`
*   **Description:** Forces the narrator’s stategraph into the `"narrator_off"` state.
*   **Parameters:** Same as `stageon`.
*   **Returns:** Nothing.

### `stinger(inst, line)`
*   **Description:** Triggers a stinger sound/state transition in the narrator’s stategraph, passing `line.sound` as the state parameter.
*   **Parameters:**
    *   `inst` (entity) — The narrator entity.
    *   `line` (table) — Must contain `sound` (string).
*   **Returns:** Nothing.

### `findlucy(player)`
*   **Description:** Locates a `lucy` item on or in the player’s inventory (including overflow and open containers).
*   **Parameters:**
    *   `player` (entity) — Player entity.
*   **Returns:** `lucy` item entity or `nil`.

### `lucytalk(inst, line, cast)`
*   **Description:** If `line.lucytest` specifies a costume in the cast, locates `lucy` for that actor and has *it* speak `line.line` using its `talker` component.
*   **Parameters:** Same as `callbirds`.
*   **Returns:** Nothing.

### `maskflash(inst, line, cast)`
*   **Description:** Applies a bloom and pulsing color overlay to each actor’s hat (`swap_hat` symbol) using a periodic task, then clears the effect after `line.time` seconds.
*   **Parameters:** Same as `callbirds`.
*   **Returns:** Nothing.

### `enableblackout(inst)`
*   **Description:** Finds all players within `25` units of `inst` that have a `_blackout` property and activates it. Tracks them in `inst.blackoutviewers`.
*   **Parameters:**
    *   `inst` (entity) — The blackout source.
*   **Returns:** Nothing.

### `disableblackout(inst)`
*   **Description:** Disables `_blackout` for all players previously recorded in `inst.blackoutviewers`.
*   **Parameters:** Same as `enableblackout`.
*   **Returns:** Nothing.

### `waxwelldancer(inst, line, cast)`
*   **Description:** Spawns a `shadowdancer` entity, positions it relative to `inst` using `line.theta` and `line.radius`, copies the caster’s skins, and schedules its quickdespawn after `line.time`.
*   **Parameters:** Same as `callbirds`.
*   **Returns:** Nothing.

### `crowdcomment(inst, line, cast)`
*   **Description:** Finds nearby players who are not in the current cast and match one of `line.prefabs`, then has one randomly chosen actor perform `line.anim` and speak `line.line`.
*   **Parameters:** Same as `callbirds`.
*   **Returns:** Nothing.

### `isplayercostume(costume)`
*   **Description:** Returns `true` if `costume` is not one of the reserved names (`"BIRD1"`, `"BIRD2"`, `"NARRATOR"`).
*   **Parameters:**
    *   `costume` (string) — A costume label.
*   **Returns:** `boolean`.

### `swapmask(inst, line, cast)`
*   **Description:** Equips new masks and/or clothing items (`line.mask`, `line.body`) for each actor listed in `line.roles`, replacing their existing items.
*   **Parameters:** Same as `callbirds`.
*   **Returns:** Nothing.

### `findpositions(inst, line, cast)`
*   **Description:** Calculates target positions for each actor based on `line.positions`, using a predefined `POSITIONS` table. Uses `locomotor:GoToPoint` if available; otherwise teleports with animation.
*   **Parameters:** Same as `callbirds`.
*   **Returns:** Nothing.

### `override_with_chalice(inst, line, cast)`
*   **Description:** Overrides the `ghostly_elixirs_swap` symbol on each actor’s `AnimState` to display the `chalice_swap` model.
*   **Parameters:** Same as `callbirds`.
*   **Returns:** Nothing.

### `clear_chalice_symbol(inst, line, cast)`
*   **Description:** Clears the chalice symbol override on each actor.
*   **Parameters:** Same as `callbirds`.
*   **Returns:** Nothing.

### `override_with_dagger(inst, line, cast)`
*   **Description:** Overrides the `swap_object` symbol to `vault_dagger` and shows `ARM_carry`/hides `ARM_normal` on each actor.
*   **Parameters:** Same as `callbirds`.
*   **Returns:** Nothing.

### `clear_dagger_symbol(inst, line, cast)`
*   **Description:** Clears the dagger override and restores the previous `swap_object` symbol; toggles arm animations back.
*   **Parameters:** Same as `callbirds`.
*   **Returns:** Nothing.

### `do_emote_fx(inst, line, cast)`
*   **Description:** Spawns `emote_fx`, parents it to each actor, and attaches it to either `"emotefx"` or `"headbase"` depending on the `equipmentmodel` tag.
*   **Parameters:** Same as `callbirds`.
*   **Returns:** Nothing.

### `play_sound_with_delay_fn_constructor(delay, sound_name)`
*   **Description:** Returns a callable function that, when invoked with `(inst, line, cast)`, plays `sound_name` on all actors after `delay` seconds.
*   **Parameters:**
    *   `delay` (number) — Delay in seconds.
    *   `sound_name` (string) — Sound event name.
*   **Returns:** `function(inst, line, cast)` — A function suitable for use in play scripts.

### `apply_vault_dagger(inst, line, cast)`
*   **Description:** Applies a symbol override to `vault_dagger01` for all actors in the cast.
*   **Parameters:** Same as `callbirds`.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** Uses `inst:DoTaskInTime` and `inst:DoPeriodicTask` for delayed tasks; does not register `ListenForEvent` handlers itself.
- **Pushes:** Pushes events via actor entities (e.g., `"acting"`, `"arrive"`, `"dance"`, `"perform_do_next_line"`); does not push events itself directly.