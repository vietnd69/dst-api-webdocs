---
id: slingshotammo_container
title: Slingshotammo Container
description: A portable container prefab that stores slingshot ammunition and automatically opens/closes with associated animations and sounds.
tags: [inventory, storage, ui, portable]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: a10e35ee
system_scope: inventory
---

# Slingshotammo Container

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
The `slingshotammo_container` is a portable inventory storage entity designed to hold slingshot ammunition. It integrates with the `container`, `inventoryitem`, and `lootdropper` components to support opening/closing animations, sound effects, tag-based access control, and automatic closure when carried. When opened, it plays an open animation and emits sound; when closed or moved, it transitions to the closed animation and updates its inventory icon accordingly.

## Usage example
```lua
-- The prefab is typically used as-is via CreatePrefab("slingshotammo_container")
-- and does not require direct component manipulation in mod code.
-- Standard usage includes dropping on the ground (auto-drops first item if hauntable)
-- or placing into a player's inventory, where it will auto-close.

local inst = Prefab("slingshotammo_container")
```

## Dependencies & tags
**Components used:** `container`, `inventoryitem`, `inspectable`, `lootdropper`, `soundemitter`, `animstate`, `transform`, `minimapentity`, `network`  
**Tags:** Adds `portablestorage` tag on the entity.

## Properties
No public properties are defined or initialized directly in this file. Container behavior is configured via component properties assigned in the constructor.

## Main functions
### `OnOpen(inst)`
* **Description:** Callback executed when the container is opened. Triggers the open animation, changes the inventory image name, and plays the open sound.
* **Parameters:** `inst` (Entity) — the container instance.
* **Returns:** Nothing.

### `OnClose(inst)`
* **Description:** Callback executed when the container is closed. Plays either the "close" animation (if ownerless) or directly transitions to "closed". Resets the inventory image name and plays the close sound.
* **Parameters:** `inst` (Entity) — the container instance.
* **Returns:** Nothing.

### `OnPutInInventory(inst)`
* **Description:** Callback executed when the container is placed into an inventory. Immediately closes the container and sets the animation to "closed".
* **Parameters:** `inst` (Entity) — the container instance.
* **Returns:** Nothing.

## Events & listeners
This file defines no event listeners (`inst:ListenForEvent`) or custom event pushes (`inst:PushEvent`). It relies on event-driven callbacks registered with the `container` and `inventoryitem` components.

- **Listens to:** None (explicitly defined).
- **Pushes:** None (explicitly defined).