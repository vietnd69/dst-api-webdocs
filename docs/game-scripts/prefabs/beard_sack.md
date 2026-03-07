---
id: beard_sack
title: Beard Sack
description: A wearable container prefab for Beardlings that opens on equip and closes on unequip, functioning as a special inventory slot in the Beard.
tags: [inventory, container, beard, equipment]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: ff80907d
system_scope: inventory
---

# Beard Sack

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
The Beard Sack is a wearable container used by Beardlings. It is not a standalone component but a prefab definition that attaches the `inventoryitem`, `equippable`, and `container` components to an entity. When equipped, it automatically opens the container for the wearer; when unequipped, it closes the container. It is designed to function as a beard-specific inventory slot (`EQUIPSLOTS.BEARD`) and prevents removal once equipped.

## Usage example
```lua
-- Typically created internally via the prefab system:
local sack = Prefab("beard_sack_1")
local inst = MakeEntityFromPrefab(sack)

-- After assigning to a Beardling:
inst.components.equippable:Equip(sack)
-- This triggers `onequip`, which opens the container for the owner.
```

## Dependencies & tags
**Components used:** `inventoryitem`, `equippable`, `container`  
**Tags:** `beard_sack_1`, `beard_sack_2`, `beard_sack_3` (added conditionally per variant)

## Properties
No public properties are defined or modified in this prefab's scope. Component properties (e.g., `container.skipopensnd`, `equippable.equipslot`) are set directly on the component instances.

## Main functions
The document defines only internal logic callbacks and prefab construction functions—not methods on a custom component class.

### `onequip(inst, owner)`
*   **Description:** Automatically called when the Beard Sack is equipped. Opens the container for the owner.
*   **Parameters:**  
    `inst` (Entity) — the Beard Sack entity.  
    `owner` (Entity) — the entity equipping the sack (typically a Beardling).  
*   **Returns:** Nothing.
*   **Error states:** Assumes `inst.components.container` exists.

### `onunequip(inst, owner)`
*   **Description:** Automatically called when the Beard Sack is unequipped. Closes the container for the owner.
*   **Parameters:**  
    `inst` (Entity) — the Beard Sack entity.  
    `owner` (Entity) — the entity unequipping the sack.  
*   **Returns:** Nothing.
*   **Error states:** Assumes `inst.components.container` exists.

## Events & listeners
- **Listens to:** None.
- **Pushes:** None.  
  (Container open/close events are handled via `container:Open()` and `container:Close()`, which internally push events.)
