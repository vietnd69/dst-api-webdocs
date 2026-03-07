---
id: hermithouse_ornament
title: Hermithouse Ornament
description: A decorative inventory item that can be placed on the Hermithouse and emits sound and animation effects when interacted with.
tags: [decoration, sound, inventory, fx]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 9e65fd82
system_scope: inventory
---

# Hermithouse Ornament

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
The `hermithouse_ornament` is a consumable decoration item that can be equipped in a player's inventory and placed on the Hermithouse to enhance its visual appearance. It supports multiple skins via the `skin_build` property and uses a dedicated FX entity (`hermithouse_ornament_fx`) to handle placement animations and sound loops. The component interacts with the `inventoryitem`, `stackable`, and `tradable` systems, and integrates with the Hermithouse's decoration refresh mechanism via the `RefreshDecor` callback.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("inventoryitem")
inst:AddComponent("stackable")
inst:AddComponent("tradable")

-- Use the standard prefab instead of manual creation
local ornament = SpawnPrefab("hermithouse_ornament")
ornament.components.inventoryitem:PutInInventory(player)
ornament.components.stackable.maxsize = TUNING.STACK_SIZE_SMALLITEM
ornament.components.tradable.goldvalue = TUNING.GOLD_VALUES.HERMITHOUSE_ORNAMENT
```

## Dependencies & tags
**Components used:** `inventoryitem`, `stackable`, `tradable`, `inspectable`  
**Tags:** `hermithouse_ornament`, `molebait`, `cattoy`, `FX` (on the FX prefab only)

## Properties
No public properties are defined directly on this prefab's main entity. The `stackable.maxsize` and `tradable.goldvalue` are configured in the constructor via component property access.

## Main functions
### `CloneAsFx(inst)`
* **Description:** Creates and returns a new `hermithouse_ornament_fx` entity using the same skin as the parent ornament, with a path to sound assets derived from the skin build.
* **Parameters:** `inst` (table) — the main `hermithouse_ornament` entity.
* **Returns:** Entity — the created FX prefab instance.
* **Error states:** Returns `nil` if `SpawnPrefab` fails.

### `OnHermitHouseOrnamentSkinChanged(inst, skin_build)`
* **Description:** Triggers a refresh of the Hermithouse's decoration state when the ornament's skin changes.
* **Parameters:**  
  - `inst` (table) — the ornament entity.  
  - `skin_build` (string) — the new skin build name.  
* **Returns:** Nothing.
* **Error states:** Does nothing if the owner lacks a `RefreshDecor` method.

### `AttachToParent(inst, parent)`
* **Description:** Attaches the ornament to a parent entity (e.g., the Hermithouse) using entity hierarchy, sets animation state, plays placement sounds, and registers highlight linking.
* **Parameters:**  
  - `inst` (table) — the ornament entity.  
  - `parent` (table) — the parent entity (e.g., `hermithouse`).  
* **Returns:** `inst` — the modified entity.
* **Error states:** Skips highlight linking on dedicated servers.

### `dosound(inst, soundname, loopid)`
* **Description:** Plays a sound using `SoundEmitter` if `inst.soundpath` is set.
* **Parameters:**  
  - `inst` (table) — the entity instance.  
  - `soundname` (string) — relative sound filename (e.g., `"idle_LP"`).  
  - `loopid` (string) — unique ID for looping control.  
* **Returns:** Nothing.

### `tryplacesound(inst)`
* **Description:** Plays the `place` sound only if the current animation is `"place"`.
* **Parameters:** `inst` (table) — the ornament entity.
* **Returns:** Nothing.

### `dowind(inst)`
* **Description:** Schedules a wind sound and pushes a `"wind"` animation on top of the `"idle_loop"` sequence if currently playing.
* **Parameters:** `inst` (table) — the FX entity.
* **Returns:** Nothing.

## Events & listeners
- **Listens to:** `onplaced`, `onpickup`, `onremove` — indirectly via placement logic in `AttachToParent` and removal hooks like `OnRemoveEntity`.
- **Pushes:** No events are pushed directly by this prefab.

> **Note:** The FX prefab (`hermithouse_ornament_fx`) registers `inst.OnEntityReplicated = OnEntityReplicated` to link highlight groups for client-side rendering.