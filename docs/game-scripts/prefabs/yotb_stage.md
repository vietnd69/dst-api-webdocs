---
id: yotb_stage
title: Yotb Stage
description: Manages the stage booth structure, handling placement, interaction (hammering, hitting), voice playback, and cleanup with event notifications and loot drops.
tags: [structure, interaction, event, loot]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 43f53727
system_scope: entity
---

# Yotb Stage

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
The `yotb_stage` prefab defines a deployable stage booth structure used in DST events (e.g., YOTB). It integrates multiple components to handle structural behavior: placement via `deployable`, interaction via `workable` and `hauntable`, and dynamic state transitions via the `SGyotb_stage` state graph. It notifies the world of construction and destruction events and drops appropriate loot upon destruction. This prefab includes three associated prefabs: `yotb_stage` (the actual structure), `yotb_stage_voice` (a non-physical voice proxy for talking animations), and `yotb_stage_item` (the deployable item variant).

## Usage example
```lua
-- Spawning a stage booth programmatically
local stage = SpawnPrefab("yotb_stage")
if stage ~= nil then
    stage.Transform:SetPosition(worldX, 0, worldZ)
    stage:PushEvent("onbuilt")
    -- The stage will now be placed and active in the world
end

-- Deploying via an item
local item = SpawnPrefab("yotb_stage_item")
-- The item will use its deployable component to spawn the stage at the target point
```

## Dependencies & tags
**Components used:** `talker`, `lootdropper`, `workable`, `hauntable`, `deployable`, `yotb_stager`, `timer`, `inspectable`, `inventoryitem`, `burnable`, `propagator`, `physics`  
**Tags:** Adds `structure`, `yotb_stage`, `appraiser`, `NOCLICK`, `fx`, `deploykititem`  

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `Talker.offset` | `Vector3` | `Vector3(0, -700, 0)` | Vertical offset for talker speech display. |
| `Talker.font` | `string` | `TALKINGFONT_TRADEIN` | Font style used for speech bubbles. |
| `Workable.action` | `ACTIONS` | `ACTIONS.HAMMER` | Action type that triggers work callbacks. |
| `Workable.workleft` | `number` | `4` | Remaining work units before finish. |
| `Hauntable.hauntvalue` | `number` | `TUNING.HAUNT_TINY` | Haunt value applied when damaged by Haunt. |
| `Deployable.ondeploy` | `function` | `ondeploy` | Callback executed when the item is deployed. |

## Main functions
### `onhammered(inst, worker)`
* **Description:** Callback triggered when the stage is fully hammered. Drops loot, spawns a `collapse_big` FX, and removes the stage instance.
* **Parameters:**  
  - `inst` (Entity) — the stage instance.  
  - `worker` (Entity) — the entity performing the hammering.  
* **Returns:** Nothing.

### `onhit(inst, worker)`
* **Description:** Callback triggered during hammering. Advances the stage’s state graph to `"hit_ready"` or `"hit_closed"` depending on current state tag.
* **Parameters:**  
  - `inst` (Entity) — the stage instance.  
  - `worker` (Entity) — the entity performing the hammering.  
* **Returns:** Nothing.

### `onbuilt(inst)`
* **Description:** Event handler for `"onbuilt"` event. Transitions the state graph to `"place"` to show placement animation.
* **Parameters:**  
  - `inst` (Entity) — the stage instance.  
* **Returns:** Nothing.

### `onremove(inst)`
* **Description:** Event handler for `"onremove"` event. Pushes the `"yotb_onstagedestroyed"` event and stops background sound.
* **Parameters:**  
  - `inst` (Entity) — the stage instance.  
* **Returns:** Nothing.

### `ondeploy(inst, pt, deployer)`
* **Description:** Deploy callback for the item variant. Spawns the `yotb_stage`, positions it at `pt`, plays placement animation and sound, then removes the deployer item.
* **Parameters:**  
  - `inst` (Entity) — the deploy kit item instance.  
  - `pt` (Vector3) — world position where the stage is to be placed.  
  - `deployer` (Entity) — the entity deploying the item.  
* **Returns:** Nothing.

### `fn()` (main constructor)
* **Description:** Constructs and initializes the `yotb_stage` structure entity with all required components and listeners.
* **Parameters:** None.  
* **Returns:** `inst` (Entity) — fully initialized stage structure.

## Events & listeners
- **Listens to:**  
  - `"onbuilt"` — triggers `onbuilt` handler to transition to placement state.  
  - `"onremove"` — triggers `onremove` handler to notify world and stop sounds.  
- **Pushes:**  
  - `"yotb_onstagebuilt"` — fired shortly after construction (via `DoTaskInTime`).  
  - `"yotb_onstagedestroyed"` — fired when the stage is removed (e.g., via hammering or demolition).  
  - `"entity_droploot"` — fired internally by `LootDropper:DropLoot`.