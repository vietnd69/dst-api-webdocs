---
id: woodie
title: Woodie
description: Manages Woodie's transformation between human and three were-forms (beaver, moose, goose) and their associated gameplay mechanics.
tags: [player, transformation, combat, locomotion, environment]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: dd2805b9
system_scope: player
---

# Woodie

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
`woodie` is the player character prefab for Woodie, which implements his core transformation system between human and three distinct were-forms: beaver, moose, and goose. Each form provides unique abilities, stats, and behaviors. The component manages form transitions based on `wereness` percentage, lunar cycles, and skill activation, while synchronizing visuals, animations, sounds, camera behavior, and combat attributes. It integrates deeply with components such as `wereness`, `health`, `hunger`, `sanity`, `inventory`, `playeractionpicker`, `frostybreather`, and several custom helper functions.

## Usage example
This component is not added manually. It is instantiated as part of the Woodie character prefab via `MakePlayerCharacter`.

```lua
-- Internally handled by the game engine when spawning the woodie prefab
local woodie = MakePlayerCharacter("woodie", prefabs, assets, common_postinit, master_postinit)

-- Example: Force a transformation programmatically (server-side only)
if TheWorld.ismastersim then
    woodie.components.wereness:SetWereMode("beaver")
    woodie.components.wereness:SetPercent(1, true)
    -- Transformation logic is triggered via stategraph callbacks, not directly
end
```

## Dependencies & tags
**Components used:**  
`beard`, `wereness`, `wereeater`, `tackler`, `health`, `hunger`, `sanity`, `inventory`, `playeractionpicker`, `frostybreather`, `drownable`, `groundpounder`, `worker`, `attackdodger`, `planardefense`, `skilltreeupdater`, `skinner`, `locomotor`, `playervision`, `debuffable`, `freezable`, `temperature`, `moisture`, `carefulwalker`, `catcher`, `sandstormwatcher`, `moonstormwatcher`, `miasmawatcher`, `Inspectable`, `focalpoint`.

**Tags added:** `woodcutter`, `polite`, `werehuman`, `bearded`, `wereplayer`, `beaver`, `weremoose`, `weregoose`, `cancarveboards`, `inherentshadowdominance`, `shadowdominance`.  
**Tags checked:** `playerghost`, `player_lunar_aligned`, `player_shadow_aligned`, `nomorph`, `silentmorph`.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `weremode` | `net_tinybyte` | `0` (`WEREMODES.NONE`) | Networked value storing current were-form index (0=human, 1=beaver, 2=moose, 3=goose). |
| `_weregooseflying` | `net_bool` | `false` | Networked flag indicating if weregoose is currently flying. |
| `_weremoosesmashshake` | `net_event` | — | Networked event for moose smash camera shake. |
| `fullmoontriggered` | boolean | `false` | Tracks if full moon transformation has been processed this cycle. |
| `_wasnomorph` | boolean | `nil` | Tracks whether the player was in a no-morph state during last wereness change. |
| `gooseflycamvec` | `Vector3` | `nil` | Stores offset for weregoose flying camera. |
| `_gooserunning`, `_beaverworking`, `_moosefighting` | `task` | `nil` | Periodic tasks used to track active drain modifiers. |
| `_beaverworkinglevel`, `_moosefightinglevel`, `_gooserunninglevel` | number | `nil` | Integer counters for drain rate modifiers. |

## Main functions
### `SetWereMode(inst, mode, skiphudfx)`
*   **Description:** Transitions the player to the specified were-form (`WEREMODES.BEAVER`, `WEREMODES.MOOSE`, `WEREMODES.GOOSE`, or `WEREMODES.NONE`), updating all associated systems (stats, actions, vision, sounds, camera, clothing, physics). Called when `wereness` crosses thresholds or during forced transformations.
*   **Parameters:**  
    `mode` (number) — One of `WEREMODES.NONE`, `BEAVER`, `MOOSE`, `GOOSE`.  
    `skiphudfx` (boolean) — If `true`, skips UI transition effects (used internally for immediate state changes).
*   **Returns:** Nothing.
*   **Error states:** No explicit error handling; rely on `IsWereMode(mode)` validation prior to calling.

### `ChangeWereModeValue(inst, newmode)`
*   **Description:** Updates the networked `weremode` value and manages the `wereplayer`, `beaver`, `weremoose`, `weregoose`, and `USERFLAGS` tags for server/client sync.
*   **Parameters:**  
    `newmode` (number) — New `WEREMODES.*` value.
*   **Returns:** Nothing.
*   **Error states:** Triggers side effects (`OnWereModeDirty`) only when the value actually changes.

### `CalculateWerenessDrainRate(inst, mode, isfullmoon)`
*   **Description:** Computes the negative drain rate (per second) for `wereness` based on form, skill levels, activity tags, and lunar phase. Used to update `wereness` component's drain rate dynamically.
*   **Parameters:**  
    `mode` (number) — `WEREMODES.BEAVER`, `MOOSE`, or `GOOSE`.  
    `isfullmoon` (boolean) — Current full moon state.
*   **Returns:** number — Negative drain rate (e.g., `-100 / t`).
*   **Error states:** Returns `0` if no valid `wereness` component exists (fallback case in helper functions).

### `SetWereVision(inst, mode)`
*   **Description:** Applies or removes forced beaver night vision (color correction) based on whether the player is in a were-form. Uses `playervision` stack to manage priority and clean removal.
*   **Parameters:**  
    `mode` (number) — Current were-form.
*   **Returns:** Nothing.

### `SetWereWorker(inst, mode)`
*   **Description:** Enables/disables the `worker` and `groundpounder` components for beaver mode. Configures actions (chop, mine, dig, hammer) and associated event callbacks for working and combat activity.
*   **Parameters:**  
    `mode` (number) — Target were-form.
*   **Returns:** Nothing.

### `SetWereFighter(inst, mode)`
*   **Description:** Configures combat modifiers: health regen (`planardefense`) and dodge chance for moose/goose modes, using `attackdodger` and `health` components.
*   **Parameters:**  
    `mode` (number) — Target were-form.
*   **Returns:** Nothing.

### `SetWereSounds(inst, mode)`
*   **Description:** Manages ambient and state-based sound playback for were-forms (flap/honk for goose, hurt/death override for beaver/moose).
*   **Parameters:**  
    `mode` (number) — Target were-form.
*   **Returns:** Nothing.

### `SetWereDrowning(inst, mode)`
*   **Description:** Overrides `drownable.enabled` and physics collision mask for goose form (to allow flying over water) and human form.
*   **Parameters:**  
    `mode` (number) — Target were-form.
*   **Returns:** Nothing.

### `OnForceTransform(inst, weremode)`
*   **Description:** Forces a transformation to the specified were-form (used by in-game items or mod logic). Sets `wereness` to 100% and lets stategraph callback trigger `onbecame...`.
*   **Parameters:**  
    `weremode` (string or `nil`) — One of `"beaver"`, `"moose"`, `"goose"` or `nil` (random).
*   **Returns:** Nothing.

### `UseWereFormSkill(inst, act)`
*   **Description:** Executes the special ability for current were-form (groundpound for beaver, teleport for goose) and consumes `wereness`.
*   **Parameters:**  
    `inst` (Entity) — Woodie instance.  
    `act` (action) — Not used directly but passed for consistency.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  `weremodedirty`, `weregooseflyingdirty`, `werenessdelta`, `newstate`, `onremove`, `playeractivated`, `playerdeactivated`, `ms_respawnedfromghost`, `ms_becameghost`, `ms_skilltreeinitialized`, `onactivateskill_server`, `ondeactivateskill_server`, `itemget`, `itemlose`, `working`, `onattackother`, `onmissother`, `attacked`, `blocked`, `newstate` (for goose sounds).

- **Pushes:**  
  `startwereplayer`, `stopwereplayer`, `werenessdelta` (via `wereness:DoDelta`).

- **Network events:**  
  `woodie._weremoosesmashshake` (client receives moose smash shake event).  
  `weremodedirty` (changes to `weremode`).  
  `weregooseflyingdirty` (changes to `_weregooseflying`).