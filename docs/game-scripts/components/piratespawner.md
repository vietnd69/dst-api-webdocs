---
id: piratespawner
title: Piratespawner
description: Manages the spawning, behavior, and persistence of pirate raids and associated assets (boats, captains, crew, loot stash) in the game world.
tags: [ai, boss, loot, spawn, world]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 5be84724
system_scope: world
---

# Piratespawner

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Piratespawner` is a world-scoped component responsible for coordinating pirate raids in DST. It monitors player positions relative to the Queen, determines when and where to spawn pirate ships and crews, manages loot stashes, and handles save/load persistence. The component is initialized only on the master simulation (`TheWorld.ismastersim`) and operates by tracking active players, evaluating zone-based spawn probabilities over time, and interacting with a suite of helper functions and connected components to manage entities, inventory, and events.

## Usage example
```lua
-- Typically added automatically to TheWorld in master mode.
-- Example of manually triggering a pirate spawn:
local spawner = TheWorld.components.piratespawner
if spawner then
    spawner:SpawnPiratesForPlayer(player)
end

-- Example of accessing the active loot stash:
local stash = TheWorld.components.piratespawner:GetCurrentStash()
```

## Dependencies & tags
**Components used:** `age`, `boatcrew`, `container`, `crewmember`, `health`, `inventory`, `inventoryitem`, `talker`, `vanish_on_sleep`, `walkableplatform`.  
**Tags:** Does not directly add or remove tags on its own entity (`TheWorld`), but may influence entities it spawns (e.g., `"personal_possession"`, `"cursed"`, `"irreplaceable"`).  
**External modules:** `util/sourcemodifierlist`, `messagebottletreasures`.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `GEntity` | `nil` | Public reference to the owning instance (`TheWorld`). |
| `shipdatas` | table | `{}` | Array of `{ boat, captain, crew }` records tracking active pirate ships. |
| `queen` | `GEntity?` | `nil` | Reference to the `monkeyqueen` entity, used for raid logic. |

## Main functions
### `FindStashLocation()`
*   **Description:** Locates a valid ground tile near a random topology node, far from all players, for spawning the current loot stash.
*   **Parameters:** None.
*   **Returns:** `Vector3` — 3D world coordinates for the stash position.
*   **Error states:** Returns a position only if a safe, player-free location is found.

### `StashLoot(ent)`
*   **Description:** Moves all items from the entity's container or inventory to the current pirate stash.
*   **Parameters:** `ent` (`GEntity`) — Entity whose items should be stashed.
*   **Returns:** Nothing.
*   **Error states:** No-op if the entity has no inventory/container or stash is nil.

### `GetCurrentStash()`
*   **Description:** Returns the current active loot stash, creating and populating it if needed.
*   **Parameters:** None.
*   **Returns:** `GEntity` — The `pirate_stash` entity.
*   **Error states:** Returns `nil` if stash creation fails (e.g., invalid location).

### `ClearCurrentStash()`
*   **Description:** Resets the reference to the current stash, allowing a new one to be created on next access.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `SpawnPirates(pt)`
*   **Description:** Spawns a pirate ship and crew at the specified world position.
*   **Parameters:** `pt` (`Vector3`) — Spawn center for the boat and entities.
*   **Returns:** Nothing.
*   **Error states:** Silently fails if boat or crew prefabs cannot spawn.

### `SpawnPiratesForPlayer(player, nodelivery, forcedelivery)`
*   **Description:** Attempts to spawn a pirate ship near the given player's current platform.
*   **Parameters:**  
    `player` (`GEntity`) — Target player.  
    `nodelivery` (`boolean`, optional) — If true, skips treasure delivery (e.g., no message bottle).  
    `forcedelivery` (`boolean`, optional) — If true, forces a delivery event.
*   **Returns:** `boolean` — `true` if a ship was successfully spawned.
*   **Error states:** Returns `false` if no platform is found for the player or spawn location is invalid.

### `OnUpdate(dt)`
*   **Description:** Core logic loop for raid scheduling and music state. Evaluates player proximity to the Queen, updates spawn timers, checks zones, and manages the `piratesnear` music state for each player.
*   **Parameters:** `dt` (`number`) — Delta time since last frame.
*   **Returns:** Nothing.

### `LongUpdate(dt)`
*   **Description:** Alias for `OnUpdate(dt)`. Used by the scheduler for periodic updates.
*   **Parameters:** `dt` (`number`).
*   **Returns:** Nothing.

### `SaveShipData(shipdata)`
*   **Description:** Appends a ship record to the internal `shipdatas` list for persistence and tracking.
*   **Parameters:** `shipdata` (`table`) — Ship data table containing `boat`, `captain`, and `crew`.
*   **Returns:** Nothing.

### `RemoveShipData(ship)`
*   **Description:** Removes the ship record associated with the given boat entity.
*   **Parameters:** `ship` (`GEntity`) — The boat entity.
*   **Returns:** Nothing.

### `OnSave()`
*   **Description:** Compiles runtime state into a saveable table, including ship GUIDs and active stash reference.
*   **Parameters:** None.
*   **Returns:** `data` (`table`), `ents` (`table<string>`) — Save data table and list of referenced entity GUIDs.

### `OnLoad(data)`
*   **Description:** Restores simple numeric/state values from save data at early load time.
*   **Parameters:** `data` (`table`) — Loaded component data.
*   **Returns:** Nothing.

### `LoadPostPass(newents, savedata)`
*   **Description:** Reconstructs entities and component relationships after `newents` is populated. Connects saved GUIDs to real entities and reattaches components.
*   **Parameters:**  
    `newents` (`table<string, { entity }>`) — Map of GUIDs to loaded entities.  
    `savedata` (`table?`) — Saved component data from `OnSave`.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  - `ms_playerjoined` — Adds player to `_activeplayers`.  
  - `ms_playerleft` — Removes player from `_activeplayers`.  
  - `megaflare_detonated` — On successful roll, may trigger a pirate spawn near the detonation.  
  - `onremove` — Attached to the Queen to clear `self.queen` when it is removed.  
  - `spawnnewboatleak` — Attached to pirate boats; sets `boatcrew.flee = true` and schedules retreat announcements.

- **Pushes:**  
  - `victory` — Fired on the pirate captain when retreat is announced (contains `say` key with localized text).  
  - `dropitem` — Emitted on the stasher entity when items are dropped during stash operations.
