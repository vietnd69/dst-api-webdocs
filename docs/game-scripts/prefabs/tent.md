---
id: tent
title: Tent
description: Manages the behavior and state of sleeping structures (tent and siestahut), handling use tracking, sleep interactions, burning, and dismantling.
tags: [sleeping, structure, burning, crafting]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: d20e0ca6
system_scope: entity
---

# Tent

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
The `tent` prefab implements two sleeping structures: the standard tent and the siestahut. It manages item uses via `finiteuses`, sleeping behavior via `sleepingbag`, destruction and hammering via `workable`, burning via `burnable`, and loot generation via `lootdropper`. The component is shared by both structures through a common factory function, with specific behavior customized per structure type.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("tent")
inst.components.tent:SetMaxUses(10)
inst.components.tent:SetUses(10)
inst:PushEvent("onbuilt")
```

## Dependencies & tags
**Components used:** `burnable`, `finiteuses`, `lootdropper`, `sleepingbag`, `temperature`, `workable`  
**Tags:** Adds `tent`, `structure`; optionally adds `siestahut`.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `sleep_anim` | string or `nil` | `"sleep_loop"` (tent) / `nil` (siestahut) | Animation to loop while occupied. |
| `is_cooling` | boolean | `false` (tent) / `true` (siestahut) | Whether the structure cools the sleeper (siestahut) or warms them (tent). |
| `sleep_tasks` | table or `nil` | `nil` | List of periodic tasks used to play sleep loop sounds. |

## Main functions
### `common_fn(bank, build, icon, tag, onbuiltfn)`
*   **Description:** Factory function that constructs and configures a shared base for both tent types. Sets up physics, components, animations, and networking. It is not intended for direct external use.
*   **Parameters:** `bank` (string) asset bank, `build` (string) build name, `icon` (string) minimap icon, `tag` (string or `nil`) extra tag, `onbuiltfn` (function) callback executed on build.
*   **Returns:** The configured entity instance.
*   **Error states:** Returns early on client before server initialization if `TheWorld.ismastersim` is `false`.

### `onsleep(inst, sleeper)`
*   **Description:** Triggered when a sleeper begins using the structure. Starts the sleep loop animation and sound tasks. Registers event listeners for ignition to wake the sleeper.
*   **Parameters:** `inst` (Entity) the tent/siestahut, `sleeper` (Entity) the sleeping actor.
*   **Returns:** Nothing.

### `onwake(inst, sleeper, nostatechange)`
*   **Description:** Triggered when the sleeper exits the structure. Cancels sound tasks, resets animation, decrements finite uses, and unregisters ignition listener.
*   **Parameters:** `inst` (Entity), `sleeper` (Entity), `nostatechange` (boolean) passed through to `sleepingbag:DoWakeUp`.
*   **Returns:** Nothing.

### `onhammered(inst, worker)`
*   **Description:** Callback for hammering while burning or to fully destroy. Extinguishes fire (if burning), drops loot, spawns debris FX, and removes the entity.
*   **Parameters:** `inst` (Entity), `worker` (Entity) the actor performing the action.
*   **Returns:** Nothing.

### `onhit(inst, worker)`
*   **Description:** Called on partial hits (e.g., hammering without finishing). Stops sound tasks, plays hit animation, and wakes the sleeper.
*   **Parameters:** `inst` (Entity), `worker` (Entity).
*   **Returns:** Nothing.

### `onfinished(inst)`
*   **Description:** Triggered when `finiteuses` reaches zero. Plays destruction animation, disables persistence, and schedules removal.
*   **Parameters:** `inst` (Entity).
*   **Returns:** Nothing.

### `temperaturetick(inst, sleeper)`
*   **Description:** Tick callback to adjust the sleeper’s temperature toward `TUNING.SLEEP_TARGET_TEMP_TENT` at a rate defined by `TUNING.SLEEP_TEMP_PER_TICK`.
*   **Parameters:** `inst` (Entity), `sleeper` (Entity).
*   **Returns:** Nothing.

### `onsave(inst, data)`
*   **Description:** Serializes burn state for network sync and persistence.
*   **Parameters:** `inst` (Entity), `data` (table) save data table.
*   **Returns:** Nothing.

### `onload(inst, data)`
*   **Description:** Restores burn state from save data by triggering `onburnt` if marked burnt.
*   **Parameters:** `inst` (Entity), `data` (table) loaded data.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** `onbuilt` — triggers `onbuilt_tent` or `onbuilt_siestahut`; `animover` — triggers entity removal after destruction; `death` — removed on entity death (via `burnable`); `onignite` — registered per-sleeper to wake them.
- **Pushes:** `percentusedchange`, `startfreezing`, `stopfreezing`, `startoverheating`, `stopoverheating`, `temperaturedelta`, `onextinguish` (inherited from components).