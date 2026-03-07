---
id: moonbase
title: Moonbase
description: Manages the Moon Base structure's state, including staff charging, morphing, repair, and moon-based spawner activation.
tags: [boss, environment, structure, repair, crafting]
sidebar_position: 10

last_updated: 2026-03-06
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: d85fb6b3
system_scope: environment
---

# Moonbase

> Based on game build **714014** | Last updated: 2026-03-06

## Overview
The `moonbase` prefab implements the behavior of the Moon Base structure in Don't Starve Together. It coordinates multiple systems including charging with a Yellow Staff during a Full Moon, morphing into the Opal Staff, animating based on structural integrity, spawning petrifying Moon Beasts during charging, and handling repair and loot distribution. It integrates heavily with the `workable`, `repairable`, `trader`, `pickable`, `timer`, `lootdropper`, `moonbeastspawner`, and `inspectable` components to represent a dynamic in-game structure with complex state transitions.

## Usage example
```lua
-- Typical usage is internal; the prefab is spawned via world generation.
-- Example of external interaction (e.g., on entity load):
local moonbase = SpawnPrefab("moonbase")
moonbase.components.workable:SetWorkLeft(500) -- partially damaged
moonbase.components.pickable.caninteractwith = false
moonbase.components.trader:Disable()
```

## Dependencies & tags
**Components used:**  
`inspectable`, `workable`, `repairable`, `pickable`, `trader`, `lootdropper`, `timer`, `moonbeastspawner`, `inventoryitem`, `pointofinterest` (client-only), `inventory`, `network`

**Tags:** Adds `moonbase`, `event_trigger`, `antlion_sinkhole_blocker`, `NPC_workable`, `intense` (during high-level charging). Removes `intense` when charging stops. Uses `usesdepleted` tag via `finiteuses` component indirectly.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `_staffinst` | `EntityRef` or `nil` | `nil` | Refers to the actual staff prefab instance when skinned staffs are placed. |
| `_staffuse` | `number` or `nil` | `nil` | Stores finite uses count of non-skinned staffs before placement. |
| `_loading` | `boolean` | `nil` | Indicates whether the entity is currently loading (used to suppress state changes during load). |
| `_fxpulse`, `_fxfront`, `_fxback` | `EntityRef` or `nil` | `nil` | FX entities for positron pulses and beams during charging. |
| `_startlighttask`, `_stoplighttask` | `Task` or `nil` | `nil` | Tasks managing delayed light enable/disable transitions. |
| `_staffstar` | `EntityRef` or `nil` | `nil` | The cold light FX prefab spawned when the Opal Staff is inserted. |
| `_musictask` | `Task` or `nil` | `nil` | Periodic task controlling music triggers near the Moon Base. |
| `_music` | `NetVar` | `net_tinybyte(...)` | Network variable storing current music level (0 = off). |

## Main functions
### `ToggleMoonCharge(inst)`
* **Description:** Starts or stops the Moon Base's charging sequence based on current state and conditions. Handles lighting, FX, spawner activation, and music. Can transition between full, partial, or low states.
* **Parameters:** `inst` (Entity) — the Moon Base entity.
* **Returns:** Nothing.
* **Error states:** No-op if no staff is present when attempting to start charging; silently disables trading when fully depleted.

### `GetAnimState(inst)`
* **Description:** Determines the correct animation state string (`"full"`, `"med"`, `"medlow"`, or `"low"`) based on current work left and damage thresholds.
* **Parameters:** `inst` (Entity) — the Moon Base entity.
* **Returns:** `string` — animation state identifier.
* **Error states:** Always returns a valid animation state string.

### `OnStaffGiven(inst, giver, item)`
* **Description:** Handles placing a staff into the Moon Base. Configures the staff's visual representation, updates pickable state, triggers music, and may show cold-star FX for the Opal Staff. Prevents trading while staff is inserted.
* **Parameters:**  
  - `inst` (Entity) — the Moon Base entity.  
  - `giver` (Entity or `nil`) — entity providing the staff.  
  - `item` (string or Entity) — staff prefab name or entity reference.
* **Returns:** Nothing.

### `OnStaffTaken(inst, picker, loot)`
* **Description:** Handles removing a staff from the Moon Base. Restores trading capability if fixed, clears visual overrides, returns the staff to the player or ground, and resumes/deactivates charging logic.
* **Parameters:**  
  - `inst` (Entity) — the Moon Base entity.  
  - `picker` (Entity or `nil`) — entity picking up the staff.  
  - `loot` (Entity or `nil`) — the loot instance created by `lootdropper`.
* **Returns:** Nothing.

### `OnTimerDone(inst, data)`
* **Description:** Event handler for timer events: `"moonchargepre"`, `"mooncharge"`, `"mooncharge2"`, `"mooncharge3"`. Coordinates staging of charging phases (including FX updates, tag toggling, and staff morphing to Opal Staff).
* **Parameters:**  
  - `inst` (Entity) — the Moon Base entity.  
  - `data` (table) — `{ name = "timername" }` event payload.
* **Returns:** Nothing.
* **Error states:** No-op if expected timer state does not match (e.g., `"mooncharge"` fires but no valid staff is present).

### `OnRepaired(inst)`
* **Description:** Called after the Moon Base is repaired. Restores full integrity if needed, triggers repair animation/sound, and re-evaluates charging state.
* **Parameters:** `inst` (Entity) — the Moon Base entity.
* **Returns:** Nothing.

### `UpdateWorkState(inst)`
* **Description:** Updates visual state and animations when work is performed (e.g., mining damage). Triggers repair capability if not at full health, and re-evaluates charging state.
* **Parameters:** `inst` (Entity) — the Moon Base entity.
* **Returns:** Nothing.

### `OnFullmoon(inst, isfullmoon)`
* **Description:** Listens for world full moon state changes. Starts or stops `"fullmoonstartdelay"` timer, updates music, and toggles charging accordingly.
* **Parameters:**  
  - `inst` (Entity) — the Moon Base entity.  
  - `isfullmoon` (boolean) — current full moon state.
* **Returns:** Nothing.

### `getstatus(inst)`
* **Description:** Returns a human-readable status string for the inspectable UI, indicating Moon Base condition (e.g., `"STAFFED"`, `"MOONSTAFF"`, `"WRONGSTAFF"`, `"BROKEN"`).
* **Parameters:** `inst` (Entity) — the Moon Base entity.
* **Returns:** `string` — status label.

### `onsave(inst, data)` and `onload(inst, data)`
* **Description:** Save/load serialization helpers. Stores staff state (instance or prefab + uses count) and restores it on load.
* **Parameters:**  
  - `inst` (Entity) — the Moon Base entity.  
  - `data` (table) — save/load data table.
* **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  - `"timerdone"` — triggers staged charging and morphing logic via `OnTimerDone`.  
  - `"musicdirty"` (client-only) — triggers music updates via `OnMusicDirty`.  
  - `"isfullmoon"` (via `WatchWorldState`) — responds to full moon phase changes via `OnFullmoon`.

- **Pushes:**  
  - `"percentusedchange"` — via `finiteuses` component (no direct push, but triggered by use state changes).  
  - `"picksomething"` — dispatched to the picker when a staff is retrieved.  
  - `"triggeredevent"` — to `ThePlayer` when near and music level changes (client-only).  
  - `"moonpetrify"` — to entities during forced petrification via `moonbeastspawner:ForcePetrify`.  
  - `"loot_prefab_spawned"` — via `lootdropper:SpawnLootPrefab`.  

(No direct `PushEvent` calls are defined in the constructor; these are propagated through component callbacks.)