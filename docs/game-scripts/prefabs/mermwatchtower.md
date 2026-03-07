---
id: mermwatchtower
title: Mermwatchtower
description: A structure that spawns and manages Merm guards when a Merm King is present, supporting dynamic spawning behavior and interaction with world settings and offering pots.
tags: [structure, spawn, merm, boss]
sidebar_position: 10

last_updated: 2026-03-06
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 4bb573c9
system_scope: world
---

# Mermwatchtower

> Based on game build **714014** | Last updated: 2026-03-06

## Overview
`mermwatchtower` is a world-interactive structure that spawns Merm guards (`mermguard`) when a Merm King exists anywhere in the world shard. It integrates with the `childspawner` component to manage guard deployment, responds to structural damage and burning, and dynamically adjusts its spawning rate based on kelp offering counts from nearby `offering_pot` structures. It also supports seasonal tuning via the `iswinter` world state and integrates with DST's deploy helper system for placement preview.

## Usage example
```lua
-- Spawns the mermwatchtower entity
local inst = SpawnPrefab("mermwatchtower")
inst.Transform:SetPosition(x, y, z)

-- Manually trigger spawning if the Merm King is present
if TheWorld.components.mermkingmanager and TheWorld.components.mermkingmanager:HasKingAnywhere() then
    inst.components.childspawner:StartSpawning()
end

-- Manually update spawning rate from offering pots
inst:UpdateSpawningTime({ inst = some_player, count = 3 })
```

## Dependencies & tags
**Components used:** `burnable`, `childspawner`, `combat`, `deployhelper`, `inspectable`, `lootdropper`, `mermkingmanager`, `talker`, `updatelooper`, `worldsettingstimer`, `workable`, `fueled`, `propagator`
**Tags:** Adds `structure`. Checks `burnt`, `placer`, `CLASSIFIED`, `NOCLICK`.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `kelpofferings` | table | `{}` | Map of player GUID to offering count, used to compute dynamic regen multiplier. |
| `UpdateSpawningTime` | function | `nil` | Public method assigned to instance; updates regen period based on offering counts. |
| `placerinst` | Entity | `nil` | Reference to the entity placing this tower (used in placement helper). |
| `helper` | Entity | `nil` | Visual ring placed during placement preview (client-side only). |

## Main functions
### `UpdateSpawningTime(data)`
* **Description:** Updates the child spawner's regen period based on the highest offering count in the local `kelpofferings` map. Called in response to `ms_updateofferingpotstate` events from the world.
* **Parameters:**  
  `data` (table) — Expected fields: `inst` (offering pot entity), `count` (number of kelp offerings). Returns early if `data.inst` is invalid or too far (> `WURT_OFFERING_POT_RANGE`).
* **Returns:** Nothing.
* **Error states:** Returns early if `inst.components.worldsettingstimer` or `inst.components.childspawner` are missing.

### `OnEnableHelper(inst, enabled, recipename, placerinst)`
* **Description:** Creates or destroys the placement helper ring entity (`placerinst`) when the deploy helper activates or deactivates.
* **Parameters:**  
  `enabled` (boolean) — Whether helper mode is active.  
  `placerinst` (Entity) — Reference to the entity doing the placement.  
* **Returns:** Nothing.

### `StartSpawning(inst)`
* **Description:** Begins spawning Merm guards if the Merm King is present, the structure is not burnt, and the `childspawner` component exists. Shows the flag animation and plays "flagup".
* **Parameters:**  
  `inst` (Entity) — The mermwatchtower entity.
* **Returns:** Nothing.

### `StopSpawning(inst)`
* **Description:** Stops spawning Merm guards. Plays "flagdown" animation to hide the flag. Does nothing if burnt.
* **Parameters:**  
  `inst` (Entity) — The mermwatchtower entity.
* **Returns:** Nothing.

### `OnSpawned(inst, child)`
* **Description:** Callback invoked after a Merm guard spawns. Plays a sound and stops spawning if it is daytime, at least one child is outside, and the spawned child has no target.
* **Parameters:**  
  `inst` (Entity) — The watchtower instance.  
  `child` (Entity) — The newly spawned `mermguard`.
* **Returns:** Nothing.

### `OnGoHome(inst, child)`
* **Description:** Callback invoked when a Merm guard returns home. Plays a sound and resumes spawning if no guards remain outside.
* **Parameters:**  
  `inst` (Entity) — The watchtower instance.  
  `child` (Entity) — The returning `mermguard`.
* **Returns:** Nothing.

### `onhammered(inst, worker)`
* **Description:** Executed when the watchtower is hammered. Extinguishes burning, removes `childspawner`, drops loot, spawns a collapse FX, and removes the entity.
* **Parameters:**  
  `inst` (Entity) — The watchtower instance.  
  `worker` (Entity) — The entity doing the hammering.
* **Returns:** Nothing.

### `onhit(inst, worker)`
* **Description:** Executed when the watchtower is hammered but not destroyed. Releases all Merm guards, plays a "hit" animation sequence, and updates flag visibility.
* **Parameters:**  
  `inst` (Entity) — The watchtower instance.  
  `worker` (Entity) — The entity doing the hammering.
* **Returns:** Nothing.

### `onignite(inst)`
* **Description:** On ignition, immediately releases all Merm guards.
* **Parameters:**  
  `inst` (Entity) — The watchtower instance.
* **Returns:** Nothing.

### `onburntup(inst)`
* **Description:** Sets the animation to "burnt" when the structure fully burns.
* **Parameters:**  
  `inst` (Entity) — The watchtower instance.
* **Returns:** Nothing.

### `ToggleWinterTuning(inst, iswinter)`
* **Description:** Adjusts the regen period multiplier during winter (x12 slower regen).
* **Parameters:**  
  `inst` (Entity) — The watchtower instance.  
  `iswinter` (boolean) — Whether it is winter.
* **Returns:** Nothing.

### `DescriptionFn(inst, viewer)`
* **Description:** Returns the localized description string based on whether a Merm King is currently present.
* **Parameters:**  
  `inst` (Entity) — The watchtower instance.  
  `viewer` (Entity) — The player inspecting the tower.
* **Returns:** String — Either `"MERMWATCHTOWER_REGULAR"` or `"MERMWATCHTOWER_NOKING"` string key.

### `OnStartHelper(inst)`
* **Description:** If placement animation is "place", stops helper mode early to prevent overlap.
* **Parameters:**  
  `inst` (Entity) — The watchtower instance.
* **Returns:** Nothing.

### `onsave(inst, data)`
* **Description:** Records burn state (`burnt = true`) in the save data.
* **Parameters:**  
  `inst` (Entity) — The watchtower instance.  
  `data` (table) — Save data table.
* **Returns:** Nothing.

### `onload(inst, data)`
* **Description:** Restores burnt state on load by invoking `onburnt`.
* **Parameters:**  
  `inst` (Entity) — The watchtower instance.  
  `data` (table) — Loaded data, may contain `data.burnt`.
* **Returns:** Nothing.

### `OnPreLoad(inst, data)`
* **Description:** Initializes `childspawner` values from save data using `WorldSettings_ChildSpawner_PreLoad`.
* **Parameters:**  
  `inst` (Entity) — The watchtower instance.  
  `data` (table) — Loaded save data.
* **Returns:** Nothing.

### `watchtower_on_animover(inst)`
* **Description:** Ensures the flag is hidden after the "flagdown" animation completes and plays idle.
* **Parameters:**  
  `inst` (Entity) — The watchtower instance.
* **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  - `ms_updateofferingpotstate` — Updates spawning time based on offering pot counts.  
  - `onbuilt` — Plays build animation and sound, and updates flag visibility.  
  - `onignite` — Releases guards when ignited.  
  - `burntup` — Switches animation to burnt state.  
  - `onmermkingcreated_anywhere` — Triggers spawning when a Merm King appears.  
  - `onmermkingdestroyed_anywhere` — Triggers stopping spawning when a Merm King dies.  
  - `animover` — Handles flag animation cleanup.

- **Pushes:** None.

## Notes
- Deploy helper integration (`deployhelper`) is only added on non-dedicated clients.
- Spawning is conditional on `TheWorld.components.mermkingmanager:HasKingAnywhere()` returning `true`.
- During winter, regen time is multiplied by 12 (`TUNING.MERMWATCHTOWER_REGEN_TIME * 12`).
- Offering pots in range modify the `ChildSpawner_RegenPeriod` up to `TUNING.WURT_MAX_OFFERING_REGEN_MULT` times faster (up to `MAX_COUNT` offerings).
- The placement helper (`placer`) ring uses `winona_battery_placement` assets and a custom `OnUpdatePlacerHelper` to fade out when out of range.