---
id: magician
title: Magician
description: Manages the state and lifecycle of a magician tool currently being used by an entity, including equipping, holding, and dropping behavior.
tags: [inventory, equipment, tool]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: d2bac348
system_scope: inventory
---

# Magician

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Magician` is an entity component that tracks and manages a magician tool currently in use. It coordinates with the `equippable`, `inventory`, `inventoryitem`, `stackable`, and `magiciantool` components to handle tool acquisition, removal from inventory, reuse on stop, and persistence across saves. The component automatically adds the `magician` tag to its entity upon attachment and manages additional runtime tags (`usingmagiciantool`, `usingmagiciantool_wasequipped`) to reflect tool state.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("magician")

local tool = SpawnPrefab("magicwand")
inst.components.magician:StartUsingTool(tool)
-- ... later ...
inst.components.magician:StopUsing()
```

## Dependencies & tags
**Components used:** `equippable`, `inventory`, `inventoryitem`, `magiciantool`, `stackable`
**Tags:** Adds `magician` on creation; manages `usingmagiciantool` and `usingmagiciantool_wasequipped` via callbacks.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `item` | `Entity` or `nil` | `nil` | The current magician tool entity being used. |
| `held` | `boolean` or `nil` | `nil` | Whether the tool was originally held in the inventory (not equipped). |
| `equip` | `boolean` or `nil` | `nil` | Whether the tool was originally equipped (i.e., used via `equippable`). |

## Main functions
### `StartUsingTool(item)`
*   **Description:** Acquires the specified tool for use, removing it from its previous location (inventory/container) and parenting it to the owning entity. Calls `OnStartUsing` on the tool's `magiciantool` component.
*   **Parameters:** `item` (`Entity`) - The tool to start using. Must have the `magiciantool` component.
*   **Returns:** `true` if tool acquisition succeeded; `false` if `item` has no `magiciantool`, a tool is already in use, or the item's owner does not have an open container.
*   **Error states:** Returns `false` if `item.components.magiciantool` is `nil`, or if the tool’s grand owner’s inventory/container is not opened by `self.inst`.

### `StopUsing()`
*   **Description:** Ends use of the current tool, resets internal state, calls `OnStopUsing` on the tool, and returns the tool to its owner (or drops it). Fires the `magicianstopped` event.
*   **Parameters:** None.
*   **Returns:** `true` if a tool was successfully stopped; `false` if no tool was in use.
*   **Error states:** Returns `false` if `self.item` is `nil`.

### `DropToolOnStop()`
*   **Description:** Resets internal state without returning or dropping the tool. Used during cleanup or entity removal.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `OnRemoveFromEntity()`
*   **Description:** Cleans up when the component is removed from its entity. Calls `StopUsing()` and removes all magician-related tags.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `OnSave()`
*   **Description:** Returns a save record for the tool and associated state if a tool is in use.
*   **Parameters:** None.
*   **Returns:** `nil` if no tool is in use; otherwise, a table with keys `item`, `held`, and `equip`.

### `OnLoad(data)`
*   **Description:** Restores the state after load using data returned from `OnSave`.
*   **Parameters:** `data` (`table?`) - Save data containing `item`, `held`, and `equip`.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** `item` (via `inst:ListenForEvent`) - called when item changes; toggles `usingmagiciantool` tag.
- **Listens to:** `equip` (via `inst:ListenForEvent`) - called when equippable state changes; toggles `usingmagiciantool_wasequipped` tag.
- **Pushes:** `magicianstopped` - fired when `StopUsing()` completes successfully.
