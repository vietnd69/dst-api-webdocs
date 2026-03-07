---
id: elixir_container
title: Elixir Container
description: A portable storage container with three inventory slots, designed to hold items while being carried or opened by the player.
tags: [inventory, portable, container, cooking]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 8d5714c2
system_scope: inventory
---

# Elixir Container

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
The `elixir_container` prefab implements a 3-slot portable storage item used primarily for storing ingredients (especially elixir components) before cooking. It integrates tightly with the `container`, `inventoryitem`, and `burnable` components. When opened, it plays an animation and sound; when closed or moved, it resets its state and reverts to the closed animation. It also supports being burnt, which empties its contents.

## Usage example
```lua
local inst = SpawnPrefab("elixir_container")
inst.components.container:PutItemInSlot(slot, item)
inst.components.container:Open(player)
-- ... player takes item ...
inst.components.container:Close(player)
```

## Dependencies & tags
**Components used:** `container`, `inventoryitem`, `burnable`, `inspectable`, `lootdropper`  
**Tags added:** `portablestorage`, `elixircontaineruser` (used via `restrictedtag` on container)  
**Tags checked:** `burnt`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `_sounds.open` | string | `"meta5/wendy/basket_open"` | Sound event played when opened. |
| `_sounds.close` | string | `"meta5/wendy/basket_close"` | Sound event played when closed. |

## Main functions
This file does not define public methods beyond standard component callbacks. It configures behavior via callbacks attached to components.

### `OnOpen(inst)`
* **Description:** Handles logic when the container is opened — plays the open animation, changes the inventory image, and emits sound. Skips if the container is already burnt.
* **Parameters:** `inst` (Entity) — the elixir container entity.
* **Returns:** Nothing.
* **Error states:** No-op if `inst:HasTag("burnt")` is true.

### `OnClose(inst)`
* **Description:** Handles logic when the container is closed — plays the close animation, resets the inventory image, and emits sound. Skips if burnt.
* **Parameters:** `inst` (Entity) — the elixir container entity.
* **Returns:** Nothing.
* **Error states:** No-op if `inst:HasTag("burnt")` is true.

### `OnPutInInventory(inst)`
* **Description:** Ensures the container is closed when picked up into an inventory.
* **Parameters:** `inst` (Entity) — the elixir container entity.
* **Returns:** Nothing.

### `OnBurnt(inst)`
* **Description:** Clears the container’s contents when burnt, then calls `DefaultBurntFn` to update the entity’s state.
* **Parameters:** `inst` (Entity) — the elixir container entity.
* **Returns:** Nothing.

### `OnSave(inst, data)`
* **Description:** Saves whether the container is currently burning or burnt.
* **Parameters:**  
  * `inst` (Entity) — the elixir container entity.  
  * `data` (table) — the save table to populate.  
* **Returns:** Nothing.

### `OnLoad(inst, data)`
* **Description:** Restores the burnt state upon load if applicable.
* **Parameters:**  
  * `inst` (Entity) — the elixir container entity.  
  * `data` (table or nil) — the loaded save data.  
* **Returns:** Nothing.
* **Error states:** No-op if `data` is nil or `data.burnt` is false/absent.

## Events & listeners
- **Listens to:**  
  * `OnSave` (via `inst.OnSave = OnSave`) — saves state.  
  * `OnLoad` (via `inst.OnLoad = OnLoad`) — restores state.  
  * `burnable.onburnt` (via `SetOnBurntFn`) — triggers emptying.  
  * `container.onopenfn` (set to `OnOpen`) — handles opening logic.  
  * `container.onclosefn` (set to `OnClose`) — handles closing logic.  
  * `inventoryitem.onputininventoryfn` (set to `OnPutInInventory`) — ensures closure when picked up.

- **Pushes:**  
  * `imagechange` (via `ChangeImageName`) — via `inventoryitem` component.  
  * `onclose`, `onopen` — via `container` component (handled internally).  
  * `refreshcrafting` — triggered by `container.Close` when a player closes the container.
