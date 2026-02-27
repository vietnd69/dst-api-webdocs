---
id: magician
title: Magician
description: Manages the usage and lifecycle of a magical tool for an entity, including tracking held/equipped state and handling item attachment/detachment.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: entity
source_hash: d2bac348
---

# Magician

## Overview
The `Magician` component enables an entity to temporarily "use" a magical tool by attaching it to the entity's transform, managing its possession state (held vs. in inventory), and coordinating with the tool's own `magiciantool` component during use cycles. It ensures the tool does not persist independently while in use and restores it to its proper location upon stopping.

## Dependencies & Tags
- Adds the `"magician"` tag to the entity on construction.
- Listens to `"item"` and `"equip"` events via event binding in the class definition (via the `item` and `equip` handlers `onitem` and `onequip`).
- Adds/removes tags:
  - `"magician"`
  - `"usingmagiciantool"` (added when an item is in use)
  - `"usingmagiciantool_wasequipped"` (added when the tool was equipped before use)

Also requires the following components on the *target item* (not on the entity itself):
- `magiciantool` (required for `StartUsingTool`)
- Optionally `inventoryitem`, `equippable`, `stackable` (for handling item ownership/state)

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | — | The entity this component is attached to (injected in constructor). |
| `item` | `Entity?` | `nil` | The current magical tool being used; `nil` when no tool is in use. |
| `held` | `boolean?` | `nil` | `true` if the tool was held (in inventory and opened container) when use began; `nil` otherwise. |
| `equip` | `boolean?` | `nil` | `true` if the tool was equipped when use began; `nil` otherwise. |

## Main Functions

### `Magician:StartUsingTool(item)`
* **Description:** Begins using the specified magical tool. Attaches it to the entity, clears persistence, and notifies the tool via its `magiciantool` component. Validates tool eligibility and inventory/container access.
* **Parameters:**
  - `item` (`Entity`): The tool entity to use. Must have a `magiciantool` component.

### `Magician:StopUsing()`
* **Description:** Ends use of the current tool. Detaches it from the entity, restores persistence, returns it to the entity's inventory (or drops it), and notifies the tool component. Emits the `"magicianstopped"` event.
* **Parameters:** None.

### `Magician:DropToolOnStop()`
* **Description:** Clears internal state (`held`, `equip`) without returning or destroying the tool—intended for use cases where tool ownership changes during shutdown (e.g., death).
* **Parameters:** None.

### `Magician:OnRemoveFromEntity()`
* **Description:** Cleans up when the component is removed: stops using the tool (if any), and removes all relevant tags (`"magician"`, `"usingmagiciantool"`, `"usingmagiciantool_wasequipped"`).
* **Parameters:** None.

### `Magician:OnSave()`
* **Description:** Returns a serialized snapshot of the current state if a tool is being used. Used to persist usage state across saves.
* **Parameters:** None.

### `Magician:OnLoad(data)`
* **Description:** Restores usage state from a save record. Spawns the saved tool entity and reinitializes `held` and `equip` flags.
* **Parameters:**
  - `data` (`table?`): Save data, expected to contain `item`, `held`, and `equip` keys.

## Events & Listeners
- Listens to:
  - `"item"` → calls `onitem(self, item)`
  - `"equip"` → calls `onequip(self, equip)`
- Triggers:
  - `"magicianstopped"` (via `self.inst:PushEvent`) when `StopUsing()` completes successfully.