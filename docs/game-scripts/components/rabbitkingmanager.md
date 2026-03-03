---
id: rabbitkingmanager
title: Rabbitkingmanager
description: Manages the Rabbit King’s lifecycle, including spawning, leashing to players, state transitions (passive/aggressive/lucky), and interaction tracking via carrot-feeding or naughtiness.
tags: [rabbit, boss, spawner, event, player]
sidebar_position: 1
last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: cd4e5137
system_scope: entity
---
# Rabbitkingmanager

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`rabbitkingmanager` is a server-only component that orchestrates the appearance and behavior of the Rabbit King in DST. It tracks player actions (carrot feeding, killing rabbits) to determine when and how the Rabbit King should spawn, manages its leash to a specific player, handles state transitions (passive ➝ aggressive ➝ lucky), and coordinates save/load persistence. It runs exclusively on the master server (`ismastersim` is enforced), integrates with `combat`, `homeseeker`, `inventoryitem`, `knownlocations`, and `talker` components, and performs periodic housecleaning via `OnUpdate`.

## Usage example
```lua
local inst = ThePlayer
inst:AddComponent("rabbitkingmanager")
-- After feeding carrots or causing naughtiness, the manager auto-spawns the Rabbit King.
-- To force a Rabbit King into the world:
local success, reason = inst.components.rabbitkingmanager:CreateRabbitKingForPlayer(inst)
if not success then
    print("Rabbit King failed to spawn:", reason)
end
```

## Dependencies & tags
**Components used:** `combat` (`SuggestTarget`), `homeseeker` (`home`, `SetHome`), `inventoryitem` (`canbepickedup`, `canbepickedupalive`), `knownlocations` (`RememberLocation`), `talker` (`Say`).
**Tags:** None added or removed by this component.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `PERIODIC_TICK_TIME` | number | `1` | Interval (in seconds) for periodic housecleaning tasks. |
| `STATES` | table | `{ PASSIVE = 0, AGGRESSIVE = 1, LUCKY = 2 }` | Internal state constants for Rabbit King types. |
| `ANNOUNCE_STRINGS` | table | Map of `STATES` to localization keys (e.g., `"ANNOUNCE_RABBITKING_AGGRESSIVE"`) | Strings used for warning speech on spawn. |
| `SPAWN_PREFABS` | table | Map of `STATES` to prefabs (e.g., `"rabbitking_aggressive"`) | Prefab names for Rabbit King variants. |
| `carrots_fed` | number | `0` | Count of carrots fed in current session. |
| `carrots_fed_max` | number | `TUNING.RABBITKING_CARROTS_NEEDED + random variance` | Threshold carrots needed to spawn Rabbit King. |
| `naughtiness` | number | `0` | Accumulated naughtiness from killing rabbits. |
| `naughtiness_max` | number | `TUNING.RABBITKING_NAUGHTINESS_NEEDED + random variance` | Threshold naughtiness needed to spawn aggressive Rabbit King. |
| `cooldown` | number or nil | `nil` | Remaining cooldown (in seconds) before next Rabbit King spawn. |
| `rabbitkingdata` | table or nil | `nil` | Holds runtime state: `rabbitking`, `player`, `old_players`, `accumulator`, `introtask`. |
| `pendingplayerload` | boolean or nil | `nil` | Set while waiting for a saved player to rejoin after world load. |

## Main functions
### `CreateRabbitKingForPlayer(player, pt_override?, forcedstate_string?, params?)`
* **Description:** Spawns a Rabbit King for a given player, with optional override spawn point, forced state (`"passive"`, `"aggressive"`, `"lucky"`), and presentation flags (`jumpfrominventory`, `nopresentation`). Returns `true` on success, `false` plus a reason string on failure.
* **Parameters:**
  - `player` (Entity) — Target player to leash the Rabbit King to.
  - `pt_override` (Vector3 or nil) — Optional explicit spawn point.
  - `forcedstate_string` (string or nil) — Force a specific Rabbit King state.
  - `params` (table or nil) — Optional flags: `jumpfrominventory` (skip intro), `nopresentation` (skip intro and delay warning).
* **Returns:** `true`, or `false` and one of: `"ON_COOLDOWN"`, `"ALREADY_EXISTS"`, `"NO_VALID_SPAWNPOINT"`, `"PREFAB_FAILED_TO_CREATE"`.
* **Error states:** Returns early with `false` if cooldown active or a Rabbit King already exists.

### `RemoveRabbitKing(rabbitking?)`
* **Description:** Removes the currently tracked Rabbit King, optionally specifying a specific one. Triggers `"burrowaway"` unless sleeping or intro task pending (silent removal).
* **Parameters:** `rabbitking` (Entity or nil) — Entity to remove; defaults to `self.rabbitkingdata.rabbitking`.
* **Returns:** Nothing.

### `AddCarrotFromPlayer(player, receiver)`
* **Description:** Increments the carrot counter; if threshold reached, spawns the Rabbit King. Plays a sound for the receiver or player.
* **Parameters:**
  - `player` (Entity) — Player who fed the carrot.
  - `receiver` (Entity) — Entity with `SoundEmitter` to play sound on.
* **Returns:** Nothing.

### `AddNaughtinessFromPlayer(player, naughtiness)`
* **Description:** Increments naughtiness counter; if threshold reached, forces an aggressive Rabbit King spawn. Plays a sound for the player.
* **Parameters:**
  - `player` (Entity) — Player responsible for the naughtiness.
  - `naughtiness` (number) — Amount to add.
* **Returns:** Nothing.

### `TrackRabbitKingForPlayer(rabbitking, player)`
* **Description:** Registers the Rabbit King and binds it to a player, setting up event listeners and updating the component for housecleaning.
* **Parameters:**
  - `rabbitking` (Entity) — Spawned Rabbit King instance.
  - `player` (Entity) — Player to leash to.
* **Returns:** Nothing.

### `UnTrackRabbitKing()`
* **Description:** Cleans up event bindings, sets cooldown (if not lucky), and clears `rabbitkingdata`.
* **Parameters:** None.
* **Returns:** Nothing.

### `DoWarningSpeechFor(player, rabbitking_kind)`
* **Description:** Causes the player to speak a warning line when the Rabbit King appears, based on its kind.
* **Parameters:**
  - `player` (Entity) — Speaker.
  - `rabbitking_kind` (string) — e.g., `"passive"`, `"aggressive"`, `"lucky"`.
* **Returns:** Nothing.

### `GetRabbitKingSpawnPoint(pt)`
* **Description:** Finds a valid spawn point near the given position, avoiding holes and terrain issues. Tries increasing radii downward.
* **Parameters:** `pt` (Vector3) — Center point to search around.
* **Returns:** Vector3 (spawn point) or `nil` if none found.

### `IsvalidPointForRabbitKing(x, y, z)`
* **Description:** Checks if a point is valid ground (no water, no boats) for Rabbit King burrow-in/-out.
* **Parameters:** `x`, `y`, `z` — Coordinates.
* **Returns:** `true` if point is valid ground, else `false`.

### `OnUpdate(dt)`
* **Description:** Periodically performs housecleaning (tries to trigger aggressive state, teleports if far) and decrements cooldown. Called via `StartUpdatingComponent`.
* **Parameters:** `dt` (number) — Delta time.
* **Returns:** Nothing.

### `OnSave()`
* **Description:** Serializes state for save files: counters, cooldown, Rabbit King and player GUIDs, and optional home GUID.
* **Parameters:** None.
* **Returns:** Table with save data, and optional list of entity GUIDs (`ents`) to persist.

### `OnLoad(data)`
* **Description:** Restores saved counters, cooldown, and resumes updating if cooldown present.
* **Parameters:** `data` (table or nil) — Saved data.
* **Returns:** Nothing.

### `LoadPostPass(newents, savedata)`
* **Description:** Resolves saved Rabbit King entity and player ID after world load; waits for player rejoin (5-min timeout) and re-establishes tracking.
* **Parameters:**
  - `newents` (table) — Map of GUID → entity.
  - `savedata` (table) — Saved data from `OnSave`.
* **Returns:** Nothing.

### `GetDebugString()`
* **Description:** Returns a human-readable debug string for debugging tools (e.g., `/debug` console).
* **Parameters:** None.
* **Returns:** String — State information.

## Events & listeners
- **Listens to:**  
  - `"onremove"` on Rabbit King (bridge: `OnRemove_RabbitKing`)  
  - `"attacked"` on Rabbit King (bridge: `OnAttacked`)  
  - `"onremove"` and `"death"` on leashed player (bridge: `OnRemove_Player_Bridge`)  
  - `"onremove"` and `"death"` on players tracked in `old_players`  
  - `"killed"` on players (via `OnPlayerKilledOther`)  
  - `"ms_playerjoined"` and `"ms_playerleft"` (to manage per-player `"killed"` listeners)

- **Pushes:**  
  - `"becameaggressive"` on Rabbit King (when transitioning state)  
  - `"burrowto"`, `"burrowarrive"` for teleportation events  
  - `"dropkickarrive"` (when spawned via inventory drop)  
  - `"burrowaway"` before removal unless silent
