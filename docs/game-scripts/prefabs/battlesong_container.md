---
id: battlesong_container
title: Battlesong Container
description: A portable container prefab that functions as storage with burnable behavior, custom open/close sounds, and inventory integration for Wigfrid's battlesong-themed items.
tags: [inventory, container, storage, burnable]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: b164ff1d
system_scope: inventory
---

# Battlesong Container

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
The `battlesong_container` prefab implements a portable storage container designed for Wigfrid. It uses the `container` component for inventory storage, the `inventoryitem` component for placement in inventories, and the `burnable` component for fire interaction. The container supports custom sound effects for opening/closing, visual state updates (animation and inventory icon), and integrates with the save/load system to preserve burn state.

## Usage example
```lua
-- Create and configure a battlesong container instance
local inst = CreateEntity()
inst.entity:AddTransform()
inst.entity:AddAnimState()
inst.entity:AddSoundEmitter()
inst.entity:AddMiniMapEntity()
inst.entity:AddNetwork()

inst:AddTag("portablestorage")

-- Add container and configure
inst:AddComponent("container")
inst.components.container:WidgetSetup("battlesong_container")
inst.components.container.restrictedtag = "battlesongcontaineruser"
inst.components.container.skipclosesnd = true
inst.components.container.skipopensnd = true

-- Add inventory item behavior
inst:AddComponent("inventoryitem")
```

## Dependencies & tags
**Components used:** `container`, `inventoryitem`, `burnable`, `inspectable`, `lootdropper`  
**Tags:** Adds `portablestorage`  
**Flags:** Uses `skipclosesnd`, `skipopensnd`, `droponopen` on container; sets `restrictedtag = "battlesongcontaineruser"`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst._sounds` | table | `{ open = "meta3/wigfrid/battlesong_container_open", close = "meta3/wigfrid/battlesong_container_close" }` | Custom sound paths for open/close events. |
| `inst.components.container.restrictedtag` | string | `"battlesongcontaineruser"` | Tag restriction for container access. |
| `inst.components.container.skipclosesnd` | boolean | `true` | Disables default container close sound (uses custom sound instead). |
| `inst.components.container.skipopensnd` | boolean | `true` | Disables default container open sound (uses custom sound instead). |
| `inst.components.container.droponopen` | boolean | `true` | Drops container contents when opened. |

## Main functions
### `OnOpen(inst)`
*   **Description:** Triggered when the container is opened. Plays the "open" animation, changes inventory image name to `"battlesong_container_open"`, and plays the custom open sound. Does nothing if the container is burnt.
*   **Parameters:** `inst` (Entity) — the container entity instance.
*   **Returns:** Nothing.

### `OnClose(inst)`
*   **Description:** Triggered when the container is closed. Plays the "close" animation, resets inventory image name, and plays the custom close sound. Does nothing if the container is burnt.
*   **Parameters:** `inst` (Entity) — the container entity instance.
*   **Returns:** Nothing.

### `OnPutInInventory(inst)`
*   **Description:** Called when the container is placed into an inventory. Ensures the container is closed, then plays the "closed" animation.
*   **Parameters:** `inst` (Entity) — the container entity instance.
*   **Returns:** Nothing.

### `OnBurnt(inst)`
*   **Description:** Handles burn completion: drops all container contents and applies default burnt state via `DefaultBurntFn`.
*   **Parameters:** `inst` (Entity) — the container entity instance.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** None explicitly via `inst:ListenForEvent`; callbacks are assigned directly to component fields.
- **Pushes:** `inst.OnSave` and `inst.OnLoad` hooks for save/load compatibility. Does not push generic events itself.

### Save/Load hooks
- `inst.OnSave(inst, data)` — sets `data.burnt = true` if the container is burning or burnt.
- `inst.OnLoad(inst, data)` — triggers `burnable.onburnt` on load if `data.burnt` is present.