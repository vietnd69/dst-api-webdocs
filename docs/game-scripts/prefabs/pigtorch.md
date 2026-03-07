---
id: pigtorch
title: Pigtorch
description: A structure that produces guards and burns fuel over time, extinguishing when its fuel runs out or during rain.
tags: [structure, spawning, fuel, environment]
sidebar_position: 10

last_updated: 2026-03-06
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: db365d82
system_scope: world
---

# Pigtorch

> Based on game build **714014** | Last updated: 2026-03-06

## Overview
The `pigtorch` component represents the Pigtorch structure, a renewable guard spawner that burns fuel to stay lit. It manages fuel consumption, flame effect updates, rain sensitivity (which increases burn rate), and spawning of Pigguards. The component integrates with `burnable`, `fueled`, `spawner`, `workable`, and `hauntable` subsystems to provide gameplay behavior.

## Usage example
This component is not added manually; it is instantiated as part of the `pigtorch` prefab. Typical usage involves interacting with it via player actions:
```lua
-- Example: Interact with a Pigtorch to add fuel
if inst.components.pigtorch ~= nil then
    local fuel_item = SpawnPrefab("pigtorch_fuel")
    inst.components.fueled:TakeFuelItem(fuel_item, doer)
end
```

## Dependencies & tags
**Components used:** `burnable`, `fueled`, `lootdropper`, `workable`, `spawner`, `hauntable`, `rainimmunity`, `inspectable`  
**Tags added:** `structure`, `wildfireprotected`  

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst.components.burnable.canlight` | boolean | `false` | Prevents external ignition sources from lighting the Torch. |
| `inst.components.fueled.accepting` | boolean | `true` | Allows fuel items to be added. |
| `inst.components.fueled.maxfuel` | number | `TUNING.PIGTORCH_FUEL_MAX` | Total fuel capacity. |
| `inst.components.fueled.rate` | number | `1` (modified by rain) | Fuel consumption rate per tick; increases during rain. |
| `inst.components.spawner.childname` | string | `"pigguard"` | Prefab name of the spawned entity. |
| `inst.components.spawner.delay` | number | `TUNING.PIGHOUSE_SPAWN_TIME` | Spawn interval in seconds. |
| `inst.components.workable.workleft` | number | `4` | Damage required to break the Torch. |

## Main functions
No custom public methods are defined beyond component API calls. Interaction occurs through component methods (e.g., `fueled:TakeFuelItem`, `burnable:Ignite`).

## Events & listeners
- **Listens to:**  
  - `onextinguish` – Resets fuel level to `0` and triggers `onextinguish` callback.
  - `worldstate("israining")` – Updates burn rate based on precipitation via `onupdatefueledraining`.
  - `death` (via `burnable`) – Stops burning if the Torch is destroyed.

- **Pushes:**  
  - `takefuel` – Fired after fuel is consumed (via `fueled` component).
  - `onextinguish` – Fired when extinguished (via `burnable` component).
  - `entity_droploot` – Fired when loot is dropped (via `lootdropper` component).