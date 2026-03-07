---
id: costumes
title: Costumes
description: Factory function for creating costume prefabs with equippable body armor and visual skin overrides.
tags: [inventory, equipment, visual, armor]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: e786fd28
system_scope: inventory
---

# Costumes

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
The `costumes.lua` file defines a reusable factory function `makecostume()` that generates prefabs for wearable costumes in DST. These prefabs function as body armor items equipped in the `BODY` slot. When equipped, they apply visual skin overrides to the wearer (via `AnimState`), trigger skin-related events (`equipskinneditem`/`unequipskinneditem`), and optionally grant armor stats, set bonuses, and burn behavior. The file exports several specific costume prefabs (e.g., `costume_doll_body`, `costume_princess_body`).

## Usage example
```lua
-- Example: Create and spawn a costume prefab
local inst = Prefab("costume_princess_body")
if inst ~= nil then
    TheWorld:SpawnPrefab(inst)
end

-- Example: Equip the costume and trigger visual changes
local player = GetPlayer()
if player ~= nil and inst ~= nil then
    player.components.inventory:Equip(inst)
end
```

## Dependencies & tags
**Components used:** `transform`, `animstate`, `network`, `inventoryitem`, `equippable`, `inspectable`, `armor`, `setbonus`, `smallburnable`, `smallpropagator`, `hauntablelaunch`
**Tags:** Adds `metal`, `hardarmor`, `unluckysource` (conditionally for the princess costume)

## Properties
No public properties are defined on the component itself. The returned prefabs are standard inventory items with properties defined by attached components (e.g., `inst.components.equippable`, `inst.components.armor.condition`).

## Main functions
### `makecostume(name, common_postinit, master_postinit, data)`
* **Description:** Factory function that returns a `Prefab` for a costume. It sets up the entity structure (transform, animstate, network), configures inventory physics, floating behavior, and equippability, and conditionally applies armor, burn, and set bonus behaviors on the master instance.
* **Parameters:**  
  - `name` (string) – The build and animation bank name used for assets and override paths (e.g., `"costume_princess_body"`).  
  - `common_postinit` (function, optional) – A callback run on both client and server after basic entity setup, before `entity:SetPristine()`.  
  - `master_postinit` (function, optional) – A callback run only on the master instance after add-on components are attached.  
  - `data` (table, optional) – Configuration with optional `noburn` (boolean) and `foleysound` (string) keys.
* **Returns:** A `Prefab` instance ready for spawning.
* **Error states:** None.

### `onequip(inst, owner)`
* **Description:** Internal equipping callback. Applies the costume’s visual skin override to the owner’s `swap_body` symbol via `AnimState`, and fires the `equipskinneditem` event if the costume has a skin build.
* **Parameters:**  
  - `inst` (Entity) – The costume entity being equipped.  
  - `owner` (Entity) – The player receiving the costume.
* **Returns:** Nothing.
* **Error states:** Silent fallback if `GetSkinBuild()` returns `nil`.

### `onunequip(inst, owner)`
* **Description:** Internal unequipping callback. Clears the `swap_body` symbol override and fires the `unequipskinneditem` event with the costume’s skin name.
* **Parameters:**  
  - `inst` (Entity) – The costume entity being unequipped.  
  - `owner` (Entity) – The player losing the costume.
* **Returns:** Nothing.

### `princess_common_postinit(inst)`
* **Description:** Post-init hook specific to the princess costume. Adds the `metal` and `hardarmor` tags to the costume entity.
* **Parameters:**  
  - `inst` (Entity) – The princess costume entity.
* **Returns:** Nothing.

### `princess_onsetbonus_enabled(inst)`
* **Description:** Sets the `unluckysource` tag when the princess set bonus is active.
* **Parameters:**  
  - `inst` (Entity) – The princess costume entity.
* **Returns:** Nothing.

### `princess_onsetbonus_disabled(inst)`
* **Description:** Removes the `unluckysource` tag when the princess set bonus is disabled.
* **Parameters:**  
  - `inst` (Entity) – The princess costume entity.
* **Returns:** Nothing.

### `princess_master_postinit(inst)`
* **Description:** Initializes armor stats and set bonus functionality for the princess costume on the master instance.
* **Parameters:**  
  - `inst` (Entity) – The princess costume entity.
* **Returns:** Nothing.

## Events & listeners
- **Listens to:** None (no `ListenForEvent` calls).
- **Pushes:** `equipskinneditem`, `unequipskinneditem` (only if `GetSkinBuild()` returns non-nil).