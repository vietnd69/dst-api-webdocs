---
id: rabbitkinghorn_chest
title: Rabbitkinghorn Chest
description: A portable chest that stores items in the Rabbit King's horn pocket dimension and despawns after a fixed duration unless opened.
tags: [pocket_dimension, container, boss, timed]
sidebar_position: 10

last_updated: 2026-03-06
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 4623a5f5
system_scope: inventory
---

# Rabbitkinghorn Chest

> Based on game build **714014** | Last updated: 2026-03-06

## Overview
The `rabbitkinghorn_chest` prefab creates a temporary chest that deposits and retrieves items from the Rabbit King's horn pocket dimension. It uses the `container_proxy` component to link to the world's pocket container, the `timer` component to manage its 23-second lifespan, and the `hauntable` component for minor hauntable properties. The chest plays specific animations and sounds on open/close and transitions to a despawn animation if not opened before its timer expires.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("container_proxy")
inst:AddComponent("hauntable")
inst:AddComponent("timer")

inst.components.hauntable:SetHauntValue(TUNING.HAUNT_TINY)
inst.components.timer:StartTimer("despawn", TUNING.RABBITKINGHORN_DURATION)

inst.components.container_proxy:SetOnOpenFn(function(inst) 
    -- open logic
end)
inst.components.container_proxy:SetOnCloseFn(function(inst)
    -- close logic
end)
inst.components.container_proxy:SetMaster(TheWorld:GetPocketDimensionContainer("rabbitkinghorn"))
```

## Dependencies & tags
**Components used:** `container_proxy`, `hauntable`, `timer`, `inspectable`  
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `rabbitkinghorn_quietdowntask` | task | `nil` | Internal task reference for the quiet-down sound timer. |
| `rabbitkinghorn_emergetask` | task | `nil` | Internal task reference for the emerge sound timer. |
| `scrapbook_anim` | string | `"close_idle"` | Animation name used for the scrapbook preview. |

## Main functions
### `OnOpen(inst)`
*   **Description:** Triggered when the chest is opened. Plays the open animation sequence, starts ambient "move" sound, schedules quiet-down and emerge sound effects, and pauses the despawn timer.
*   **Parameters:** `inst` (Entity) — the chest entity instance.
*   **Returns:** Nothing.
*   **Error states:** No explicit error handling; assumes `inst.components.timer` exists.

### `OnClose(inst)`
*   **Description:** Triggered when the chest is closed. Plays the close animation, stops ambient sound, schedules quiet-down sound, cancels emerge sound task, and resumes the despawn timer.
*   **Parameters:** `inst` (Entity) — the chest entity instance.
*   **Returns:** Nothing.

### `ontimerdone(inst, data)`
*   **Description:** Called when the "despawn" timer completes. If the chest is asleep (`IsAsleep()` returns true), it removes the entity directly. Otherwise, it sets `persists = false`, locks the container, plays the close sound, initiates the "despawn" animation, and registers for the `animover` event to remove the entity when the animation finishes.
*   **Parameters:**  
  `inst` (Entity) — the chest entity instance.  
  `data` (table) — event data containing `name = "despawn"`.  
*   **Returns:** Nothing.
*   **Error states:** If `IsAsleep()` returns false, the entity removal is delayed until `animover`; no fallback if animation never fires.

## Events & listeners
- **Listens to:** `animover` — triggers `inst.Remove()` to delete the entity after the despawn animation completes.  
- **Listens to:** `timerdone` — routes to `ontimerdone` when the "despawn" timer finishes.
- **Pushes:** None identified.