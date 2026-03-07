---
id: marsh_bush
title: Marsh Bush
description: A harvestable, thorny plant prefab that yields twigs upon picking and triggers damage to non-resilient pickers.
tags: [harvest, plant, damage, thorny, environment]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: f0699353
system_scope: environment
---

# Marsh Bush

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
`marsh_bush` is a static, harvestable environment entity in the `prefabs` system. It implements core gameplay behaviors for a thorny plant: players or creatures can pick it for `twigs`, but they risk taking damage from its thorns unless protected. The prefab uses the `pickable`, `workable`, and `lootdropper` components to manage harvesting, digging, and loot drops, while integrating with `burnable` and `hauntable` systems for environmental interactions.

This prefab also defines two additional variants—`burnt_marsh_bush` and `burnt_marsh_bush_erode`—to handle post-burn states, including activation-based ash generation and visual erosion effects.

## Usage example
```lua
local inst = SpawnPrefab("marsh_bush")
inst.Transform:SetPosition(x, y, z)

-- Harvest twigs manually via workable (e.g., dig action)
inst.components.workable:DoWork()

-- Or pick directly (triggers damage unless protected)
inst.components.pickable:Pick(picker)
```

## Dependencies & tags
**Components used:**  
- `pickable` — manages harvest state, regeneration, and callbacks  
- `lootdropper` — spawns loot (`twigs`, `dug_marsh_bush`, `ash`)  
- `workable` — enables dig action via `ACTIONS.DIG`  
- `hauntable` — sets haunt value for burnt variant  
- `activatable` — handles burnt bush activation  
- `inspectable` — adds description and tooltip support  

**Tags added:**  
- `plant`, `thorny`, `silviculture` (on `marsh_bush`)  
- `plant`, `thorny`, `burnt`, `NOCLICK` (on burnt variants)  
- `FX` (on erosion effects)  

## Properties
No public properties are defined in this prefab. State is managed entirely through component interfaces and internal functions.

## Main functions
### `onpickedfn(inst, picker)`
* **Description:** Callback invoked when the marsh bush is picked. Plays a picking animation, damages the picker unless they have `bramble_resistant` gear or are a `shadowminion`, and emits a thorns event.
* **Parameters:**  
  - `inst` (Entity) — the marsh bush instance  
  - `picker` (Entity?) — the entity attempting to pick; may be `nil`  
* **Returns:** Nothing.
* **Error states:** No damage occurs if `picker` is `nil`, has `bramble_resistant` tag on equipped item, or is a `shadowminion`.

### `dig_up(inst, chopper)`
* **Description:** Callback executed upon finishing a dig work action. Drops `twigs` (if pickable) and `dug_marsh_bush`, then removes the entity.
* **Parameters:**  
  - `inst` (Entity) — the marsh bush instance  
  - `chopper` (Entity) — the actor performing the dig action  
* **Returns:** Nothing.

### `OnActivateBurnt(inst)`
* **Description:** Activation handler for burnt marsh bushes. Schedules ash generation, tags as `NOCLICK`, marks non-persistent, triggers erosion, and spawns a burnt erosion FX entity.
* **Parameters:** `inst` (Entity) — the burnt marsh bush instance  
* **Returns:** Nothing.

## Events & listeners
- **Listens to:** `animover` — on erosion FX entity, triggers `inst:Remove()` after animation completes.  
- **Pushes:** `thorns` — fired on the picker after thorn damage is applied (client/server).