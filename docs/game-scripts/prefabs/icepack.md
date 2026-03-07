---
id: icepack
title: Icepack
description: A wearable storage container that keeps items cold and provides inventory space, equipped on the body slot.
tags: [inventory, wearable, storage, cooling]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 7b1dbc25
system_scope: inventory
---

# Icepack

> Based on game build **7140014** | Last updated: 2026-03-07

## Overview
The `icepack` prefab is a wearable item that functions as a portable refrigerator: it grants inventory storage capacity, maintains items in a cold state (slowing spoilage), and visually appears on the character's body when equipped. It integrates with the `equippable`, `container`, and `inventoryitem` components, and uses skin-overriding mechanics to display custom textures on the player model.

## Usage example
```lua
local inst = SpawnPrefab("icepack")
if inst ~= nil then
    inst.components.equippable:Equip(player)
    -- After equipping, the container opens automatically
    -- Items can be added/removed via inst.components.container
end
```

## Dependencies & tags
**Components used:** `inspectable`, `inventoryitem`, `equippable`, `container`, `transform`, `animstate`, `soundemitter`, `minimapentity`, `network`, `physics`
**Tags:** Adds `backpack`, `fridge`, `nocool`

## Properties
No public properties are defined directly in this file.

## Main functions
The core behavior of `icepack` is implemented as callback functions passed to the `equippable` component. These are not methods of the `icepack` component itself but rather standalone functions invoked when equipping or unequipping.

### `onequip(inst, owner)`
* **Description:** Called when the icepack is equipped by a character. Overrides visual symbols on the owner's `AnimState` (including skin support), notifies the owner via the `equipskinneditem` event, and automatically opens the container UI for the owner.
* **Parameters:**
  * `inst` (Entity) – the icepack instance being equipped.
  * `owner` (Entity) – the character equipping the item.
* **Returns:** Nothing.
* **Error states:** None identified; relies on `GetSkinBuild()` returning `nil` or a valid string.

### `onunequip(inst, owner)`
* **Description:** Called when the icepack is unequipped. Clears visual overrides on the owner, notifies via `unequipskinneditem` if skinned, and closes the container UI.
* **Parameters:**
  * `inst` (Entity) – the icepack instance being unequipped.
  * `owner` (Entity) – the character unequipping the item.
* **Returns:** Nothing.

### `onequiptomodel(inst, owner)`
* **Description:** Called when the item is equipped to the model (e.g., in preview UI). Closes the container without triggering full UI interaction.
* **Parameters:**
  * `inst` (Entity) – the icepack instance.
  * `owner` (Entity) – the entity (often a dummy model).
* **Returns:** Nothing.

## Events & listeners
- **Listens to:** None (this file defines no event listeners).
- **Pushes:** `equipskinneditem`, `unequipskinneditem` — via `owner:PushEvent(...)`.
- The container emits standard container events (`onopen`, `onclose`) when opened/closed via `inst.components.container:Open/Close(owner)`.
