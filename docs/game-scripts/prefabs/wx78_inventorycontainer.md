---
id: wx78_inventorycontainer
title: Wx78 Inventorycontainer
description: WX-78 character-specific inventory container prefab that provides a collapsible storage unit with power state toggling and rummage-style picking behavior.
tags: [prefab, inventory, wx78, storage]
sidebar_position: 10
last_updated: 2026-05-01
build_version: 722832
change_status: stable
category_type: prefabs
source_hash: c45d5256
system_scope: inventory
---

# Wx78 Inventorycontainer

> Based on game build **722832** | Last updated: 2026-05-01

## Overview
`wx78_inventorycontainer.lua` registers a spawnable inventory container entity designed for the WX-78 character. The prefab combines `container`, `inventoryitem`, `inspectable`, and `pickable` components to create a storage unit that can be powered on/off, collapses when overstacked, and supports rummage-style random item retrieval when picked. The `fn()` constructor builds the entity on both client and server, with gameplay components attached only on the master simulation.

## Usage example
```lua
-- Spawn the container at world origin:
local inst = SpawnPrefab("wx78_inventorycontainer")
inst.Transform:SetPosition(0, 0, 0)

-- Toggle power state (master only):
if TheWorld.ismastersim then
    inst.SetPowered(inst, true)  -- Enable opening
    inst.SetPowered(inst, false) -- Disable opening
end

-- Reference assets at load time:
local assets = {
    Asset("ANIM", "anim/wx78_inventorycontainer.zip"),
    Asset("INV_IMAGE", "wx78_inventorycontainer_open"),
    Asset("INV_IMAGE", "wx78_inventorycontainer_powered"),
    Asset("ANIM", "anim/ui_wx78_inventorycontainer_1x1.zip"),
}
```

## Dependencies & tags
**External dependencies:**
- `MakeInventoryPhysics` -- applies physics and floatable behavior for inventory items
- `MakeInventoryFloatable` -- configures floating behavior when dropped in water
- `MakeHauntableLaunchAndDropFirstItem` -- registers ghost interaction behavior
- `SpawnPrefab` -- spawns FX prefabs (collapse_small)
- `TUNING.COLLAPSED_CHEST_EXCESS_STACKS_THRESHOLD` -- threshold for collapse trigger
- `TUNING.COLLAPSED_CHEST_MAX_EXCESS_STACKS_DROPS` -- max stacks dropped on collapse

**Components used:**
- `container` -- manages storage slots, open/close state, and item dropping
- `inventoryitem` -- handles ownership, slot locking, and drop/put callbacks
- `inspectable` -- provides status text when examined
- `pickable` -- enables rummage-style random item retrieval
- `stackable` -- accessed on contained items for stack size calculations

**Tags:**
- `nosteal` -- added in fn(); prevents theft actions
- `pickable_rummage_str` -- added in fn(); enables rummage picking behavior
- `no_container_store` -- added in fn(); prevents storage in other containers

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `assets` | table | --- | Array of `Asset(...)` entries listing animation and inventory image files loaded with this prefab. |
| `FLOATER_SWAP_DATA` | constant (local) | `{ bank = "wx78_inventorycontainer", anim = "dropped_idle" }` | Table configuring floatable animation swap data for `MakeInventoryFloatable`. |
| `TUNING.COLLAPSED_CHEST_EXCESS_STACKS_THRESHOLD` | constant | --- | Number of overstacks that triggers container collapse. |
| `TUNING.COLLAPSED_CHEST_MAX_EXCESS_STACKS_DROPS` | constant | --- | Maximum stacks dropped when container collapses. |

## Main functions
### `fn()`
* **Description:** Prefab constructor that creates the entity, attaches base components (Transform, AnimState, SoundEmitter, Network), sets up physics and floatable behavior, adds tags, and attaches gameplay components on the master simulation. Returns `inst` for the prefab framework.
* **Parameters:** None
* **Returns:** entity instance
* **Error states:** None — runs on every host; master-only components are guarded by `TheWorld.ismastersim`.

### `ShouldCollapse(inst)` (local)
* **Description:** Checks if the container should collapse by counting overstacked items. Iterates through all slots, calculates ceiling of stack size divided by max size, and returns true if threshold is exceeded.
* **Parameters:** `inst` -- container entity instance
* **Returns:** `true` if overstacks >= threshold, `false` otherwise
* **Error states:** Errors if `inst.components.container` is nil or if any slot item lacks `stackable` component (nil dereference on `v.components.stackable`).

### `OnPutInInventory(inst)` (local)
* **Description:** Callback fired when container is placed in a player's inventory. Removes `no_container_store` tag and locks the item to its slot to prevent movement.
* **Parameters:** `inst` -- container entity instance
* **Returns:** None
* **Error states:** Errors if `inst.components.inventoryitem` is nil (no guard present).

### `OnDropped(inst)` (local)
* **Description:** Callback fired when container is dropped from inventory. Adds `no_container_store` tag, checks collapse condition, and either drops excess stacks or all items before removing the entity if empty.
* **Parameters:** `inst` -- container entity instance
* **Returns:** None
* **Error states:** Errors if `inst.components.container` is nil (no guard present).

### `OnPicked(inst, picker, loot)` (local)
* **Description:** Callback fired when container is picked (rummage behavior). Plays sound, selects random item from container, transfers to picker's inventory or drops at position, then plays drop animation or removes entity if empty.
* **Parameters:**
  - `inst` -- container entity instance
  - `picker` -- entity performing the pick action (may be nil)
  - `loot` -- unused parameter (present for pickable callback signature)
* **Returns:** None
* **Error states:** Errors if `inst.components.container` is nil (no guard present).

### `RefreshIcon(inst)` (local)
* **Description:** Updates the inventory item image based on container open state and power state. Uses skin name if available, otherwise defaults to wx78_inventorycontainer with `_open` or `_powered` suffix.
* **Parameters:** `inst` -- container entity instance
* **Returns:** None
* **Error states:** Errors if `inst.components.inventoryitem` is nil (no guard present).

### `OnOpen(inst)` (local)
* **Description:** Callback fired when container is opened. Calls `RefreshIcon` to update the inventory image to the open state.
* **Parameters:** `inst` -- container entity instance
* **Returns:** None
* **Error states:** Errors if `inst.components.inventoryitem` is nil (RefreshIcon has no nil guard before component access).

### `OnClose(inst)` (local)
* **Description:** Callback fired when container is closed. Calls `RefreshIcon` to update the inventory image to the closed/powered state.
* **Parameters:** `inst` -- container entity instance
* **Returns:** None
* **Error states:** Errors if `inst.components.inventoryitem` is nil (RefreshIcon has no nil guard before component access).

### `SetPowered(inst, powered)` (local)
* **Description:** Toggles the container's power state by setting `container.canbeopened`. If powering off while open, closes the container. Otherwise refreshes the icon.
* **Parameters:**
  - `inst` -- container entity instance
  - `powered` -- boolean; true enables opening, false disables
* **Returns:** None
* **Error states:** Errors if `inst.components.container` is nil (no guard present).

### `ValidateOnLoad(inst)` (local)
* **Description:** Validates container slot position on world load. Checks if owner exists, calculates valid slot range based on stacksize modules, and drops the item if positioned in an invalid slot.
* **Parameters:** `inst` -- container entity instance
* **Returns:** None (early return if valid)
* **Error states:** Errors if `inst.components.inventoryitem` is nil. Errors if owner entity lacks both `inventory` and `container` components (nil dereference on `inventory:GetNumSlots()`).

### `OnLoad(inst)` (local)
* **Description:** Schedules `ValidateOnLoad` to run after 0 ticks on world load. Ensures validation occurs after all entities are restored.
* **Parameters:** `inst` -- container entity instance
* **Returns:** None
* **Error states:** None — `DoTaskInTime` handles nil inst gracefully.

### `GetStatus(inst)` (local)
* **Description:** Returns status string for inspectable component. Returns "HELD" if held and powered, "NOPOWER" if held but unpowered, or nil if not held.
* **Parameters:** `inst` -- container entity instance
* **Returns:** String ("HELD" or "NOPOWER") or `nil`
* **Error states:** Errors if `inst.components.inventoryitem` or `inst.components.container` is nil (no guards present).

### `DisplayNameFn(inst)` (local)
* **Description:** Returns localized display name based on held state. Uses `STRINGS.NAMES.WX78_INVENTORYCONTAINER_HELD` when held, otherwise `STRINGS.NAMES.WX78_INVENTORYCONTAINER`.
* **Parameters:** `inst` -- container entity instance
* **Returns:** Localized string from STRINGS table
* **Error states:** None

## Events & listeners
**None.**