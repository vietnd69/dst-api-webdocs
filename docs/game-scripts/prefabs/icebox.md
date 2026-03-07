---
id: icebox
title: Icebox
description: A storage container with refrigeration properties that accepts loot on hammering and drops its contents when destroyed.
tags: [storage, loot, structure]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 853c8006
system_scope: inventory
---

# Icebox

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
The `icebox` is a pre-assembled storage structure with an integrated `container` component and `workable` behavior. It functions as a portable fridge that can be built by players, stores items via its container, and yields loot (including its internal contents) when hammered. It plays a supporting role in the crafting and inventory systems, often used for food preservation and transport.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("container")
inst.components.container:WidgetSetup("icebox")
inst:AddComponent("workable")
inst.components.workable:SetWorkAction(ACTIONS.HAMMER)
inst.components.workable:SetWorkLeft(2)
inst.components.workable:SetOnFinishCallback(function(...) --[[ implement drop logic ]] end)
inst:AddTag("structure")
inst:AddTag("fridge")
```

## Dependencies & tags
**Components used:** `container`, `lootdropper`, `workable`, `inspectable`, `soundemitter`, `animstate`, `transform`, `minimapentity`, `network`
**Tags:** Adds `fridge`, `structure`.

## Properties
No public properties.

## Main functions
### `onopen(inst)`
*   **Description:** Plays the icebox's open animation and sound when a player opens the container.
*   **Parameters:** `inst` (Entity) - the icebox entity instance.
*   **Returns:** Nothing.

### `onclose(inst)`
*   **Description:** Plays the icebox's close animation and sound when a player closes the container.
*   **Parameters:** `inst` (Entity) - the icebox entity instance.
*   **Returns:** Nothing.

### `onhammered(inst, worker)`
*   **Description:** Triggered when the icebox is fully hammered; drops all internal items and loot, spawns a collapse FX, and removes the entity.
*   **Parameters:**  
    - `inst` (Entity) - the icebox entity instance.  
    - `worker` (Entity) - the entity performing the hammer action.  
*   **Returns:** Nothing.

### `onhit(inst, worker)`
*   **Description:** Triggered on partial hammer hits; plays the hit animation, drops items, and returns to the closed animation state.
*   **Parameters:**  
    - `inst` (Entity) - the icebox entity instance.  
    - `worker` (Entity) - the entity performing the hammer action.  
*   **Returns:** Nothing.

### `onbuilt(inst)`
*   **Description:** Triggered on initial construction; plays the placement animation and sound, then reverts to the closed animation.
*   **Parameters:** `inst` (Entity) - the icebox entity instance.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** `onbuilt` - fires `onbuilt` function to handle post-build animation and sound.
- **Pushes:** None (uses shared component events like `onopen`, `onclose` through the `container` component, but does not directly fire events).