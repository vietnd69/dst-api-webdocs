---
id: dryingrack
title: Dryingrack
description: Manages drying behavior for items placed in a container, handling time-based drying, weather effects (rain/acid rain), and state persistence.
tags: [inventory, weather, drying, persistence]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: f3dc5ab8
system_scope: inventory
---

# Dryingrack

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
The `Dryingrack` component enables and controls the drying process for items placed in a container (typically a drying rack entity). It monitors world state for rain and acid rain, adjusts drying or spoilage behavior accordingly, and manages item transitions (from raw to dried product). It integrates with `preserver`, `rainimmunity`, `perishable`, `moisture`, and `dryable` components to calculate spoilage rates and apply drying logic. It is commonly used on static structures like the Drying Rack and Woby Rack.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("dryingrack")
-- Optionally pass a custom container
local container = inst.components.container or CreateEntity():AddComponent("container")
inst.components.dryingrack = Dryingrack(inst, container)
inst.components.dryingrack:EnableDrying()
```

## Dependencies & tags
**Components used:** `container`, `dryable`, `inventoryitem`, `moisture`, `perishable`, `preserver`, `rainimmunity`, `rideable`, `inventoryitemmoisture`, `sheltered` (indirect via `moisture`).
**Tags:** None added or removed directly; relies on component presence for conditional logic.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `GEntity` | `nil` | Owner entity instance. |
| `container` | `Container` | `inst.components.container` | Container that holds items to be dried. |
| `enabled` | `boolean` | `false` | Whether drying is currently active. |
| `dryingpaused` | `boolean` | `true` | Whether drying is paused (e.g., due to rain). |
| `isinacid` | `boolean` | `false` | Whether the container is exposed to acid rain. |
| `dryinginfo` | `table` | `{}` | Map from item entity to drying state info (`task`, `drytime`, or `build`). |
| `showitemfn` | `function?` | `nil` | Optional callback to display item on rack. |
| `hideitemfn` | `function?` | `nil` | Optional callback to hide item on rack removal. |
| `_rider` | `GEntity?` | `nil` | Rider entity, if the rack is rideable (e.g., Woby Rack). |

## Main functions
### `EnableDrying()`
*   **Description:** Activates drying logic for the container. Enables the `preserver` component, registers weather listeners, and resumes drying tasks if no rain is present.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `DisableDrying()`
*   **Description:** Deactivates drying logic, removes the `preserver` component, and cancels all pending drying tasks. Typically called on destruction.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `GetItemInSlot(slot)`
*   **Description:** Returns the item in the given slot, along with its prefab name and render build file (dried or default).
*   **Parameters:** `slot` (number) - Slot index.
*   **Returns:** `item` (GEntity or `nil`), `prefab` (string), `build` (string, e.g., `"meat_rack_food"` or `dryable` build).
*   **Error states:** Returns `nil, nil, nil` if no item exists in slot.

### `OnGetItem(item, slot)`
*   **Description:** Called when an item is added to the container. Starts a drying task for `dryable` items or records drying info for persistence/resumption.
*   **Parameters:** `item` (GEntity), `slot` (number).
*   **Returns:** Nothing.

### `OnLoseItem(item, slot)`
*   **Description:** Called when an item leaves the container. Cancels drying task, saves remaining dry time for potential resumption, and clears acidizzling state.
*   **Parameters:** `item` (GEntity), `slot` (number).
*   **Returns:** Nothing.

### `OnDoneDrying(inst, item)`
*   **Description:** Internal callback executed when an item finishes drying. Spawns the dried product, transfers moisture/wet state, replaces the item, and updates UI.
*   **Parameters:** `inst` (GEntity, the rack), `item` (GEntity, raw item).
*   **Returns:** `product` (GEntity or `nil`) - the dried item spawned, if successful.

### `PauseDrying()`
*   **Description:** Pauses all active drying tasks, saving remaining time for later resumption.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `ResumeDrying()`
*   **Description:** Resumes drying tasks for paused items using saved remaining time.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `IsExposedToRain()`
*   **Description:** Checks if the rack is currently exposed to rain or acid rain.
*   **Parameters:** None.
*   **Returns:** `boolean` — `true` if exposed, `false` otherwise.

### `HasRainImmunity()`
*   **Description:** Checks if the rack or its rider (if rideable) grants rain immunity to the container.
*   **Parameters:** None.
*   **Returns:** `boolean` — `true` if rain-immune, `false` otherwise.

### `SetContainerIsInAcid(isinacid)`
*   **Description:** Updates the `isinacid` flag and applies acidizzling state to all items in the container.
*   **Parameters:** `isinacid` (boolean).
*   **Returns:** Nothing.

### `OnBurnt()`
*   **Description:** Called when the rack is burnt (e.g., via fire). Instantly dries all items in the container and spawns their products.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `OnSave()`
*   **Description:** Serializes drying state and container contents for persistence.
*   **Parameters:** None.
*   **Returns:** `data`, `refs` — serialized tables (may be `nil` if container empty).

### `OnLoad(data, newents)`
*   **Description:** Loads container contents and defers drying info loading if needed.
*   **Parameters:** `data`, `newents`.
*   **Returns:** Nothing.

### `LoadInfo_Internal(data)`
*   **Description:** Loads drying state (remaining time or build info) for each item in the container.
*   **Parameters:** `data.info` — table mapping slot numbers to drying state.
*   **Returns:** Nothing.

### `GetDryingInfoSnapshot()`
*   **Description:** Returns a snapshot of current drying progress for all items (remaining time, build, or dry time).
*   **Parameters:** None.
*   **Returns:** `info` (table or `nil`) — keys are item entities, values are numbers or strings.

### `ApplyDryingInfoSnapshot(snapshot)`
*   **Description:** Restores drying state from a snapshot (used for sync or preview).
*   **Parameters:** `snapshot` (table).
*   **Returns:** Nothing.

### `OnRemoveFromEntity()`
*   **Description:** Called when the component is removed from the entity. Disables drying, drops all items, and removes container if custom.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `GetContainer()`
*   **Description:** Returns the container associated with this rack.
*   **Parameters:** None.
*   **Returns:** `Container`.

### `SetShowItemFn(fn)`
*   **Description:** Sets the callback function used to show items in the UI (e.g., widget update).
*   **Parameters:** `fn` (function) — signature: `fn(rack, slot, prefab, build)`.
*   **Returns:** Nothing.

### `SetHideItemFn(fn)`
*   **Description:** Sets the callback function used to hide items in the UI.
*   **Parameters:** `fn` (function) — signature: `fn(rack, slot, prefab)`.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:**
  - `itemget` (on container) — triggers `OnGetItem`.
  - `itemlose` (on container) — triggers `OnLoseItem`.
  - `israining` (via `WatchWorldState`) — triggers `OnIsRaining`.
  - `isacidraining` (via `WatchWorldState`) — triggers `OnIsAcidRaining`.
  - `gainrainimmunity` / `loserainimmunity` (on rack or rider) — updates rain immunity status.
  - `riderchanged` (on rideable rack) — updates rider state and rain immunity logic.
- **Pushes:** None (internally uses callbacks and events, but no custom events are pushed).
