---
id: halloweenpotion_buffs
title: Halloweenpotion Buffs
description: Creates and manages buff entities that apply periodic health/sanity restoration or bravery effects when attached via the halloween potion items.
tags: [buff, halloween, health, sanity, combat]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 06bc7f3e
system_scope: entity
---

# Halloweenpotion Buffs

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
`halloweenpotion_buffs.lua` defines buff prefabs that are spawned and attached to entities (typically players) upon consumption of specific Halloween potions. Each buff applies periodic effects — health or sanity restoration for "health" and "sanity" potions, or temporary bravery (sanity-based behavior modulation) for "bravery" potions. The component is not a traditional `Component` but rather a factory script that constructs `Prefab` definitions and helper functions for potion-buff generation. It relies on `debuff`, `timer`, and `edible` components to manage effect duration and attach/detach logic.

## Usage example
This script is typically used as a dependency in a mod's `main.lua` or similar initialization file:
```lua
local halloweenpotion_buffs = require "prefabs/halloweenpotion_buffs"
```
After requiring, `halloweenpotion_buffs` contains the list of defined potion and buff prefabs, which are then added to the game's prefab registry:
```lua
assets = JoinArrays(assets, halloweenpotion_buffs)
```

## Dependencies & tags
**Components used:** `debuff`, `timer`, `edible`, `fuel`, `inspectable`, `inventoryitem`, `stackable`  
**Tags added/checked:**  
- Inventory entities: `"potion"`, `"pre-preparedfood"`, `"fooddrink"`  
- Buff entities: `"CLASSIFIED"`  

## Properties
No public properties defined. Configuration is done via `potion_tunings` and constructor arguments.

## Main functions
### `buff_fn(tunings, dodelta_fn)`
* **Description:** Constructs a buff entity that applies periodic effects to the entity it's attached to. The `dodelta_fn` parameter specifies the per-tick healing logic (e.g., `health_dodelta` or `sanity_dodelta`). Used exclusively on the server/master.
* **Parameters:**  
  - `tunings` (table) — Potion-specific tuning table containing `DURATION`, `TICK_RATE`, `TICK_VALUE`, etc.  
  - `dodelta_fn` (function) — Function `(inst, target)` that performs periodic effect delta on the target (e.g., `target.components.health:DoDelta(...)`).  
* **Returns:** Entity (`inst`) configured as a buff.  
* **Error states:** Returns `nil`-equivalent placeholder on client; discards entity with `inst:Remove()` if not mastersim.

### `potion_fn(anim, potion_tunings, buff_id, buff_prefab, nameoverride)`
* **Description:** Constructs the potion item prefab. Sets up visual animation, stackable inventory properties, edible behavior (which spawns and attaches the corresponding buff), and fuel behavior (e.g., for use in campfires).
* **Parameters:**  
  - `anim` (string) — Animation name (e.g., `"health_small"`) used for the `AnimState`.  
  - `potion_tunings` (table) — Tuning entry from `potion_tunings`, defining health/sanity values, fuel, duration, etc.  
  - `buff_id` (string) — Unique string ID used to identify and attach the debuff to the eater.  
  - `buff_prefab` (string) — Prefab name of the buff entity to spawn upon eating.  
  - `nameoverride` (string) — Localization key for the item's name (e.g., `"halloweenpotion_health"`).  
* **Returns:** Entity (`inst`) representing the potion item.

### `AddPotion(potions, name, size, buff_dodelta_fn, nameoverride_postfix)`
* **Description:** Registers both the potion and buff prefabs for a given potion type (e.g., `"health"`, `"bravery"`), size (`"small"`/`"large"`), and optional custom name and effect.
* **Parameters:**  
  - `potions` (table) — Array into which the generated `Prefab` definitions are inserted.  
  - `name` (string) — Base name of the potion (e.g., `"health"`, `"sanity"`, `"bravery"`).  
  - `size` (string) — Size modifier (`"small"` or `"large"`).  
  - `buff_dodelta_fn` (function or `nil`) — Function to call per tick during buff duration. For bravery potions (which do not have per-tick effects), this is `nil`.  
  - `nameoverride_postfix` (string or `nil`) — Optional postfix for the item's localization key.  
* **Returns:** `nil`. Modifies the `potions` array in place.

## Events & listeners
- **Listens to:**  
  - `"death"` on target entity — stops the buff when target dies (via `buff_OnAttached`).  
  - `"timerdone"` for `"regenover"` timer — stops the buff when duration expires (via `buff_OnTimerDone`).  
- **Pushes:** None directly. Relies on debuff/timer events and `edible.oneaten` callback.

### `potion_oneatenfn(inst, eater)`
* **Description:** Called when the potion is eaten. Attaches the corresponding buff entity to the eater and optionally triggers a dialogue line (e.g., for bravery potions).
* **Parameters:**  
  - `inst` (entity) — The potion item.  
  - `eater` (entity) — The entity consuming the potion.  
* **Returns:** `nil`.

### `potion_onputinfire(inst, target)`
* **Description:** Called when the potion is placed into a campfire. Triggers visual puff FX via `PotionCommon.SpawnPuffFx`.
* **Parameters:**  
  - `inst` (entity) — The potion item.  
  - `target` (entity) — The campfire.  
* **Returns:** `nil`.

### `buff_OnAttached(inst, target)`
* **Description:** Attaches the buff entity to the target entity and starts the per-tick task for health/sanity effects.
* **Parameters:**  
  - `inst` (entity) — The buff entity.  
  - `target` (entity) — The entity receiving the buff.  
* **Returns:** `nil`.

### `buff_OnExtended(inst, target)`
* **Description:** Extends the buff duration and restarts the per-tick task if the new duration exceeds the current remaining time.
* **Parameters:**  
  - `inst` (entity) — The buff entity.  
  - `target` (entity) — The entity receiving the buff.  
* **Returns:** `nil`.

### `buff_OnTick(inst, target)`
* **Description:** Periodically executes the effect delta function (`health_dodelta` or `sanity_dodelta`) on the target.
* **Parameters:**  
  - `inst` (entity) — The buff entity.  
  - `target` (entity) — The entity receiving the buff.  
* **Returns:** `nil`. Stops the buff if the target is dead.

### `health_dodelta(inst, target)`
* **Description:** Applies periodic health restoration to the target.
* **Parameters:**  
  - `inst` (entity) — The buff entity.  
  - `target` (entity) — The entity receiving the effect.  
* **Returns:** `nil`.

### `sanity_dodelta(inst, target)`
* **Description:** Applies periodic sanity restoration to the target.
* **Parameters:**  
  - `inst` (entity) — The buff entity.  
  - `target` (entity) — The entity receiving the effect.  
* **Returns:** `nil`.
(End of document)