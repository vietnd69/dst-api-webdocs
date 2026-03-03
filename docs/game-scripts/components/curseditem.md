---
id: curseditem
title: Curseditem
description: Manages cursed inventory item behavior, including pursuit and forced attachment to a player or target when dropped.
tags: [inventory, curse, combat]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: cdca7f42
system_scope: inventory
---

# Curseditem

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Curseditem` enables inventory items to exhibit "cursed" behavior: when dropped or placed in a player's inventory, it will attempt to automatically reattach to a nearby valid target (typically a player), either by moving toward them or by forcing its way into their inventory. It coordinates with the `cursable`, `inventory`, `stackable`, `floater`, `health`, and `talker` components to implement persistent haunting mechanics. The component is typically added to prefabs that should resist removal from a player (e.g., Wickerbottom’s books in certain scenarios, or special cursed items).

## Usage example
```lua
local inst = Prefab("cursed_book")
inst:AddComponent("inventoryitem")
inst:AddComponent("stackable")
inst:AddComponent("curseditem")
inst:AddComponent("floater")
-- Optional: Listen for curse events in code or via tags
inst:AddTag("cursed_inventory_item")
```

## Dependencies & tags
**Components used:** `cursable`, `debuffable`, `floater`, `health`, `inventory`, `inventoryitem`, `stackable`, `talker`

**Tags:**
- Adds `cursed_inventory_item` when `active` becomes true
- Adds `applied_curse` (via `cursable:ApplyCurse`)
- Checks for `INLIMBO`, `nosteal`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `active` | boolean | `true` | Controls whether the `cursed_inventory_item` tag is present; toggled via `onactive` callback. |
| `cursed_target` | Entity or `nil` | `nil` | The entity that currently holds or applied the curse to this item. |
| `target` | Entity or `nil` | `nil` | The nearest valid player target the item is pursuing. |
| `starttime` | number or `nil` | `nil` | Timestamp of when pursuit of `target` began. |
| `startpos` | Vector3 or `nil` | `nil` | World position of the item at start of pursuit. |
| `CopyCursedFields` | function | (internal) | Function reference to copy internal fields during stack merging. |

## Main functions
### `checkplayersinventoryforspace(player)`
*   **Description:** Determines whether the given `player` has inventory space to accept this item, checking for free slots, partial stacks, or items that can be dropped to make room.
*   **Parameters:** `player` (Entity) — the player whose inventory to inspect.
*   **Returns:** `true` if space is available or can be made; `false` otherwise.

### `lookforplayer()`
*   **Description:** Starts a periodic task that searches for the nearest valid player within range (10 units). If a valid player is found with space and who is not protected, `self.target` is set.
*   **Parameters:** None.
*   **Returns:** Nothing.
*   **Error states:** Cancels any existing `findplayertask` before starting a new one.

### `CheckForOwner()`
*   **Description:** Ensures that if the `cursed_target` has died, the curse is removed. If the item is not in limbo or is being held by someone other than `cursed_target`, it forces the item back onto `cursed_target` using `cursable:ForceOntoOwner`.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `OnUpdate(dt)`
*   **Description:** Called each frame during item simulation. Handles pursuit logic: if `target` is set, moves the item toward the player using simple vector-based motion. If attached, enforces ownership. If no target is set, periodically resumes scanning via `lookforplayer`.
*   **Parameters:** `dt` (number) — time since last frame.
*   **Returns:** Nothing.

### `Given(item, data)`
*   **Description:** Event handler for the `onpickup` event. If the item is picked up by a player who has a `cursable` component, it applies the curse. If the item was already cursed and not currently held as `activeitem`, triggers a speech line announcing the curse.
*   **Parameters:**
    - `item` (Entity) — the item entity receiving the pickup event.
    - `data` (table) — includes `data.owner`, the entity that picked up the item.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  - `onpickup` — triggers `Given(item, data)` to handle reapplication of the curse.  
  - `entitysleep` — stops component updates (e.g., during player sleep).  
  - `entitywake` — resumes component updates.

- **Pushes:**  
  - None directly. Relies on `floater:OnLandedServer` / `OnNoLongerLandedServer` for world effects during movement.
