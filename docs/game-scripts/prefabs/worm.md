---
id: worm
title: Worm
description: Manages the gameplay logic and behavior of the Worm boss, including home selection, lure mechanics, combat targeting, light control, and loot generation.
tags: [combat, ai, boss]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 8f8cdc57
system_scope: entity
---

# Worm

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
The `worm` prefab defines the behavior of the Worm boss entity. It handles home territory selection, lure state transitions, combat interactions, dynamic lighting, and loot drops. The entity uses the `SGworm` stategraph and `wormbrain` for AI control. Key responsibilities include identifying suitable locations to establish a "home" based on proximity to pickable entities, responding to player proximity to trigger attacks, controlling a visible light source that animates during combat, and supporting variant logic for the Year of the Snake (YOTS) event.

## Usage example
```lua
-- Default Worm prefab instantiation (forest/caves)
local worm =_prefabs.worm()

-- Year of the Snake variant
local yots_worm = _prefabs.yots_worm()

-- Custom behavior integration
if worm.components.knownlocations:GetLocation("home") == nil then
    worm:DoPeriodicTask(3, function(inst) inst:PushEvent("lookforhome") end)
end
```

## Dependencies & tags
**Components used:** `health`, `combat`, `sanityaura`, `locomotor`, `drownable`, `eater`, `pickable`, `playerprox`, `knownlocations`, `inventory`, `inspectable`, `lootdropper`, `acidinfusible`, `sleeper`
**Tags:** Adds `monster`, `hostile`, `wet`, `worm`, `cavedweller`, `fireimmune` (conditional), `wooden` (YOTS variant only); checks `_combat`, `_health`, `INLIMBO`, `prey`, `character`, `monster`, `animal`, `pickable`, `redlantern`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `_lightframe` | `net_smallbyte` | `0` | Networked frame value (0–20) controlling the intensity of the light animation. |
| `_islighton` | `net_bool` | `false` | Networked boolean indicating whether the light source is active. |
| `_lighttask` | `task` or `nil` | `nil` | Periodic task used to animate the light frame. |
| `HomeTask` | `task` or `nil` | periodic task | Periodic task (every 3 seconds) that searches for a valid home location. |
| `lastluretime` | number | `0` | Timestamp of the last lure transition. |
| `attacktask` | `task` or `nil` | `nil` | Delayed task used to defer player-targeted attacks when in lure state. |
| `loop_sound` | string or `nil` | `"rifts4/rope_bridge/shake_lp"` (YOTS only) | Sound name looped while the entity is active. |

## Main functions
### `OnUpdateLight(inst, dframes)`
*   **Description:** Updates the light frame and radius based on whether the light is on or off. Called periodically during light transitions.
*   **Parameters:** `inst` (entity), `dframes` (number) — delta frames to increment/decrement the light frame.
*   **Returns:** Nothing.
*   **Error states:** Cancels the light task and sets `_lighttask` to `nil` when the light frame reaches its limit (`0` or `MAX_LIGHT_FRAME`).

### `OnLightDirty(inst)`
*   **Description:** Ensures a periodic light update task exists and triggers an immediate light update.
*   **Parameters:** `inst` (entity)
*   **Returns:** Nothing.

### `turnonlight(inst)`
*   **Description:** Activates the light source by setting `_islighton` to `true` and initiating the light-up animation.
*   **Parameters:** `inst` (entity)
*   **Returns:** Nothing.

### `turnofflight(inst)`
*   **Description:** Deactivates the light source by setting `_islighton` to `false` and initiating the light-down animation.
*   **Parameters:** `inst` (entity)
*   **Returns:** Nothing.

### `retargetfn(inst)`
*   **Description:** Finds the nearest valid combat target within range unless the entity is currently in lure state.
*   **Parameters:** `inst` (entity)
*   **Returns:** entity or `nil`.
*   **Error states:** Returns `nil` if in lure state, or if no valid target found within `TUNING.WORM_TARGET_DIST`.

### `shouldKeepTarget(inst, target)`
*   **Description:** Determines whether the worm should maintain its current combat target. Targets are kept only if they are within `WORM_CHASE_DIST` of the home location or within direct range.
*   **Parameters:** `inst` (entity), `target` (entity or `nil`)
*   **Returns:** boolean.
*   **Error states:** Returns `false` if in lure state, target is invalid/dead, or target is too far from home.

### `onpickedfn(inst, target)`
*   **Description:** Handles player interaction when a lure plant is picked. Initiates an attack on the player after a short delay and faces the player.
*   **Parameters:** `inst` (entity), `target` (entity or `nil`) — typically the player who triggered the event.
*   **Returns:** Nothing.
*   **Error states:** Early return if `target` is `nil` or invalid.

### `playernear(inst, player)`
*   **Description:** Called when a player enters the proximity zone while in lure state. Schedules an attack against the player.
*   **Parameters:** `inst` (entity), `player` (entity)
*   **Returns:** Nothing.

### `playerfar(inst)`
*   **Description:** Called when a player exits proximity. Cancels any pending attack scheduled via `playernear`.
*   **Parameters:** `inst` (entity)
*   **Returns:** Nothing.

### `LookForHome(inst)`
*   **Description:** Scans the environment for a suitable home location (rich in pickables, above ground, and unclaimed by other worms). Stores the location once found.
*   **Parameters:** `inst` (entity)
*   **Returns:** Nothing.
*   **Error states:** Cancels `HomeTask` early if home is already set.

### `onattacked(inst, data)`
*   **Description:** Reaction to being attacked; sets attacker as target and summons nearby worms to assist.
*   **Parameters:** `inst` (entity), `data` (table containing `attacker`)
*   **Returns:** Nothing.

### `CustomOnHaunt(inst, haunter)`
*   **Description:** Handles haunting behavior differently depending on whether the worm is in lure state. May trigger state change or panic behavior.
*   **Parameters:** `inst` (entity), `haunter` (entity)
*   **Returns:** boolean — `true` if haunt handled, `false` otherwise.

### `lootsetfn(lootdropper)`
*   **Description:** Custom loot setup function for YOTS variant. Adds extra lucky gold nuggets.
*   **Parameters:** `lootdropper` (component instance)
*   **Returns:** Nothing.

### `fncommon(override_build, extra_tag)`
*   **Description:** Shared constructor logic for both default and YOTS worm variants. Initializes components, tags, physics, animation, and behavior hooks.
*   **Parameters:** `override_build` (string or `nil`), `extra_tag` (string or `nil`)
*   **Returns:** `inst` (entity)

### `yots_retargetfn(inst)`
*   **Description:** Extended retargeting logic for YOTS variant. Prioritizes targeting players holding a red lantern.
*   **Parameters:** `inst` (entity)
*   **Returns:** `target` (entity or `nil`), `should_drop` (boolean) — if a lantern holder is found.

### `yots_shouldKeepTarget(inst, target)`
*   **Description:** Variant target retention logic for YOTS. Drops target if a player holding a red lantern is nearby and closer.
*   **Parameters:** `inst` (entity), `target` (entity)
*   **Returns:** boolean.

### `yots_onnewstate(inst, data)`
*   **Description:** Syncs `fireimmune` tag based on state — adds when invisible (underground), removes otherwise.
*   **Parameters:** `inst` (entity), `data` (table with state info)
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** `lightdirty` — triggers immediate light update; `attacked` — sets attacker as target and calls `ShareTarget`; `newstate` (YOTS only) — updates `fireimmune` tag; `lookforhome` (via task) — triggers `LookForHome` periodically.
- **Pushes:** `onwakeup` — when waking from sleep state via `Sleeper:WakeUp`; `doattack` — when combat initiates an attack; `lightdirty` (via listeners) — used for client-side light updates.