---
id: shadowheart_infused
title: Shadowheart Infused
description: Spawnable item entity that functions as a socketable trinket with sanity aura, drowning detection, and client-side shadow visual effects.
tags: [prefab, item, socketable, sanity]
sidebar_position: 10
last_updated: 2026-04-28
build_version: 722832
change_status: stable
category_type: prefabs
source_hash: a7fa9fb5
system_scope: entity
---

# Shadowheart Infused

> Based on game build **722832** | Last updated: 2026-04-28

## Overview
`shadowheart_infused.lua` registers a spawnable socketable item entity. The prefab's `fn()` constructor builds the physics body, attaches client-side components and visual effects, then branches into master-only initialization on the server where gameplay components (drownable, sanityaura, lootdropper, inventoryitem) are attached. The entity emits periodic shadow heart sounds while active and spawns a client-side shadow FX particle that follows the item. It is referenced by name `"shadowheart_infused"` and instantiated with `SpawnPrefab("shadowheart_infused")`.

## Usage example
```lua
-- Spawn at world origin:
local inst = SpawnPrefab("shadowheart_infused")
inst.Transform:SetPosition(0, 0, 0)

-- Check socket quality on server:
if TheWorld.ismastersim and inst.components.socketable ~= nil then
    local quality = inst.components.socketable.socketquality
end
```

## Dependencies & tags
**External dependencies:**
- `prefabs/wx78_common` -- provides `MakeItemSocketable` server-side socketable setup
- `brains/shadowheart_infusedbrain` -- AI brain attached on master
- `stategraphs/SGshadowheart_infused` -- animation stategraph attached on master
- `MakeInventoryPhysics` -- applies physics and floatable behavior for inventory items
- `MakeItemSocketable_Client` -- client-side socketable component registration
- `MakeHauntable` -- registers ghost interaction behavior

**Components used:**
- `drownable` -- detects drowning state in water
- `inspectable` -- overrides display name to "shadowheart"
- `locomotor` -- sets movement speed to `TUNING.SHADOWHEART_HOP_SPEED`
- `lootdropper` -- drops `shadowheart_infused` on trap starvation
- `sanityaura` -- applies `-TUNING.SANITYAURA_MED` sanity drain
- `socketable` -- set to `SOCKETQUALITY.HIGH`
- `tradable` -- enables trading between players
- `inventoryitem` -- handles pickup/drop with custom `OnDroppedFn`
- `highlightchild` -- attached to shadow FX entity for selection highlighting
- `follower` -- attached to shadow FX entity to follow parent item

**Tags:**
- `canbetrapped` -- added in fn(); enables trap targeting
- `shadowheart` -- added in fn(); identifies entity type for queries
- `FX` -- added to shadow FX child entity; marks as visual effect

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `assets` | table | `{...}` | Array of `Asset(...)` entries; loads `anim/shadowheart_infused.zip` animation bank. |
| `STARVED_ONTRAP_LOOT` | table | `{ "shadowheart_infused" }` | Loot table dropped when trap starves; contains single entry for self-spawn. |

| `inst.beattask` | task | `nil` | Periodic task handle for shadow heart sound playback; cancelled on sleep/limbo. |
| `inst.scrapbook_anim` | string | `"scrapbook"` | Animation name used for scrapbook/collection UI display. |

## Main functions
### `fn()`
* **Description:** Prefab constructor that runs on both client and master. Creates the entity, builds physics, attaches AnimState and SoundEmitter, adds tags, sets up client-side shadow FX, then returns early on client. On master, continues to attach gameplay components (drownable, sanityaura, lootdropper, inventoryitem, locomotor, socketable, tradable, inspectable), sets stategraph and brain, and registers entity lifecycle callbacks.
* **Parameters:** None
* **Returns:** entity instance
* **Error states:** None — engine guarantees valid entity creation.

### `DoBeat(inst)` (local)
* **Description:** Plays the shadow heart sound effect and schedules the next beat via `DoTaskInTime` with random delay between 0.75 and 1.5 seconds. Creates the periodic audio loop while the entity is active.
* **Parameters:** `inst` -- entity instance
* **Returns:** None
* **Error states:** Errors if `inst.SoundEmitter` is nil (no nil guard before PlaySound call).

### `OnEntityWake(inst)` (local)
* **Description:** Called when entity becomes active (player nearby). Cancels any existing `beattask` and restarts the shadow heart sound loop. Also triggered by `exitlimbo` event. Returns early if entity is in limbo or asleep.
* **Parameters:** `inst` -- entity instance
* **Returns:** None
* **Error states:** None — guards against nil `beattask` and checks limbo/sleep state.

### `OnEntitySleep(inst)` (local)
* **Description:** Called when entity goes idle (no players nearby). Cancels the `beattask` to stop sound playback and clears the task handle. Also triggered by `enterlimbo` event.
* **Parameters:** `inst` -- entity instance
* **Returns:** None
* **Error states:** None — guards against nil `beattask` before cancel.

### `OnDropped(inst)` (local)
* **Description:** Callback set on `inventoryitem` component via `SetOnDroppedFn`. Triggers the `stunned` stategraph state when the item is dropped on the ground.
* **Parameters:** `inst` -- entity instance
* **Returns:** None
* **Error states:** Errors if `inst.sg` is nil (no nil guard before GoToState call).

### `OnLanded(inst)` (local)
* **Description:** Called on `on_landed` event. Checks the `drownable` component and calls `CheckDrownable()` to evaluate drowning state after landing in water.
* **Parameters:** `inst` -- entity instance
* **Returns:** None
* **Error states:** None — guards against nil `drownable` component before calling method.

### `CLIENT_AttachShadowFx(inst)` (local)
* **Description:** Client-only function that creates a non-networked shadow FX entity parented to the item. Sets up AnimState with shadow bank/build, plays looping `dark_loop` animation, attaches `highlightchild` and `follower` components, and configures follower to track the `follow_symbol` on the parent item. Returns the FX entity.
* **Parameters:** `inst` -- parent item entity
* **Returns:** shadow FX entity instance
* **Error states:** Errors if `CreateEntity` fails or if parent `inst` has no valid GUID (engine guarantees both).

## Events & listeners
- **Listens to:** `exitlimbo` — triggers `OnEntityWake`; restarts shadow heart sound loop when entity exits limbo state
- **Listens to:** `enterlimbo` — triggers `OnEntitySleep`; cancels shadow heart sound task when entity enters limbo
- **Listens to:** `on_landed` — triggers `OnLanded`; checks drowning state after landing in water