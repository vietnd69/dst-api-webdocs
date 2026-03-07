---
id: wagstaff_npc
title: Wagstaff Npc
description: Manages Wagstaff, a recurring NPC that guides players through Moonstorm events by interacting with players, spawning rifts, distributing blueprints, and participating in combat phases.
tags: [npc, moonstorm, boss, dialogue, quest]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 1f91ccb8
system_scope: entity
---

# Wagstaff Npc

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
The `wagstaff_npc.lua` file defines multiple prefabs centered around Wagstaff, a key NPC involved in the Moonstorm event system. It handles NPC behavior including dialogue, item trading, player proximity interactions, teleportation overrides, and erode animation effects. The core `wagstaff_npc` prefab integrates with `moonstormmanager`, `knownlocations`, `trader`, `locomotor`, and other components to orchestrate gameplay phases: meeting players, distributing blueprints, spawning tools, advancing locations, and reacting to moonstorms and boss defeat. Additional prefabs extend functionality for post-storm boss (`wagstaff_npc_pstboss`), mutation quest (`wagstaff_npc_mutations`), arena combat (`wagstaff_npc_wagpunk_arena`), finale cutscenes (`wagstaff_npc_finale_fx`), contained Alter Guardian forms (`alterguardian_contained`), and lunar rift construction UI (`enable_lunar_rift_construction_container`).

## Usage example
```lua
-- Typical usage to spawn the base Wagstaff NPC in the world:
local inst = SpawnPrefab("wagstaff_npc")
inst.Transform:SetPosition(x, y, z)

-- Interact via proximity (e.g., player enters 7-9 units):
-- The `playerprox` component triggers `onplayernear` when a player is nearby.

-- Programmatically start music (clientside sync via networked bool):
inst:StartMusic()

-- Manually trigger blueprint distribution:
inst:doblueprintcheck()

-- Request a tool from the player to advance phases:
inst:WaitForTool()
```

## Dependencies & tags
**Components used:** `talker`, `hudindicatable`, `locomotor`, `inventory`, `lootdropper`, `knownlocations`, `trader`, `playerprox`, `timer`, `inspectable`, `teleportedoverride`, `updatelooper`, `constructionsite`, `npc_talker`, `container`, `health`, `lunarriftmutationsmanager`, `wagpunk_arena_manager`, `maprecorder`.

**Tags:** `character`, `wagstaff_npc`, `moistureimmunity`, `trader`, `trader_just_show`, `__constructionsite`, `offerconstructionsite`, `shard_recieved`, `NOCLICK`, `nomagic`, `FX`.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `tool_wanted` | string or nil | `nil` | Prefab name of the tool currently wanted by Wagstaff (set by `WaitForTool`). |
| `busy` | number | `0` | Counter used to prevent state transitions during critical phases (incremented on key events). |
| `hunt_stage`, `hunt_count` | string/number | `nil` | Part of hunt logic; managed by `moonstormmanager`. |
| `playerwasnear` | boolean | `false` | Tracks if a player has been in proximity. |
| `static` | entity or nil | `nil` | Reference to a static child entity (e.g., device) for `teleported` logic. |
| `erodingout` | boolean | `false` | Indicates whether erode-out is currently active. |
| `donexperiment` | boolean | `false` | Marks if the experiment phase has started (used to prevent re-entry). |
| `hangups` | table | `{}` | Tracks hung-up items or states (not directly initialized, inferred from usage). |
| `_device` | entity or nil | `nil` | Reference to the `alterguardian_contained` device entity when active. |
| `doblueprintcheck` | function | `(defined)` | Public function to check nearby players and distribute blueprints. |
| `WaitForTool` | function | `(defined)` | Public function to request a random tool from players. |
| `erode` | function | `(defined)` | Public function to perform erosion and shadow toggling over time. |
| `StartMusic`, `StopMusic` | function | `(defined)` | Networked functions to control music playback via `_music` bool. |
| `_music` | net_bool | `false` | Networked boolean synced to trigger music-related logic on clients. |

## Main functions
### `StartMusic(inst)`
* **Description:** Starts music playback for Wagstaff by setting `_music` to `true` and scheduling periodic proximity checks on clients.
* **Parameters:** `inst` (entity) — The Wagstaff instance.
* **Returns:** Nothing.

### `StopMusic(inst)`
* **Description:** Stops music playback by setting `_music` to `false`.
* **Parameters:** `inst` (entity) — The Wagstaff instance.
* **Returns:** Nothing.

### `WaitForTool(inst)`
* **Description:** Sets a random tool prefab as `tool_wanted` and initiates chatter asking players for it. Registers a periodic task to repeat the chatter.
* **Parameters:** `inst` (entity) — The Wagstaff instance.
* **Returns:** Nothing.
* **Error states:** Does not error, but updates `inst.tool_wanted` and schedules `need_tool_task`.

### `doblueprintcheck(inst)`
* **Description:** Iterates over all players; if within 12 units, gives blueprints for `moonstorm_goggleshat` and `moon_device_construction1`, and starts a 120-second timer on the player to prevent spam.
* **Parameters:** `inst` (entity) — The Wagstaff instance.
* **Returns:** Nothing.

### `erode(inst, time, erodein, removewhendone)`
* **Description:** Performs a time-based erosion effect using `AnimState:SetErosionParams`. Toggles shadow/lighting probabilistically during erosion. If `removewhendone` is true, removes the entity when complete.
* **Parameters:**
  * `time` (number, default `1`) — Duration in seconds.
  * `erodein` (boolean) — Direction: `true` = fade-in, `false` = fade-out.
  * `removewhendone` (boolean) — Whether to call `inst:Remove()` at the end.
* **Returns:** Nothing.

### `waypointadvance(inst, txt)`
* **Description:** Attempts to get a new clue position from `moonstormmanager:AdvanceWagstaff`. If successful, remembers the location and says a line. If not, enters a busy state and says refusal dialogue.
* **Parameters:** `inst` (entity), `txt` (string or nil) — Optional override string table for speech.
* **Returns:** Nothing.

### `teleport_override_fn(inst)`
* **Description:** Computes a new walkable destination when Wagstaff teleports; tries `FindWalkableOffset` with increasing radii.
* **Parameters:** `inst` (entity).
* **Returns:** `Vector3` — The new position.
* **Error states:** Falls back to original position if no offset found.

## Events & listeners
- **Listens to:** `timerdone` — Triggers removal, movement, or blueprint logic based on timer name (`expiretime`, `wagstaff_movetime`, `relocate_wagstaff`, `wagstaff_npc_blueprints`).
- **Listens to:** `ontalk` — Plays a single talk sound.
- **Listens to:** `entitysleep` — Removes Wagstaff in certain states (e.g., hunt stage `"hunt"` with `hunt_count == 0`).
- **Listens to:** `moonboss_defeated` — Triggers departure dialogue and erode-out; stops experiment tasks.
- **Listens to:** `ms_stormchanged` — Responds to moonstorm pass by eroding out.
- **Listens to:** `teleported` — Repositions static child entities and faces them.
- **Listens to (wagstaff_npc_pstboss):** `spawndevice` — Spawns `alterguardian_contained`; `doerode` — Initiates erode on self/device; `ms_despawn_wagstaff_npc_pstboss` — Handles special despawn logic.
- **Listens to (mutations):** `doerode` — Initiates erode.
- **Listens to (arena):** `lunarguardianincoming` — Plays startled sound and marks `oneshot = true`.
- **Pushes:** `triggeredevent` — Clientside music trigger with name `"wagstaff_experiment"`.
- **Pushes:** `talk_experiment`, `talk`, `waitfortool`, `startled` — Dialogue or state events.