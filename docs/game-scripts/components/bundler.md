---
id: bundler
title: Bundler
description: Manages the bundling workflow for items, including spawning bundling containers, wrapping items, and persisting state across saves.
tags: [inventory, crafting, persistence]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 708f6d44
system_scope: inventory
---

# Bundler

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Bundler` orchestrates the item bundling process in DST. It is attached to entities (typically players or mobs) that perform bundling actions. The component handles lifecycle stages: initiating a bundling session using a `bundlemaker`-enabled item, opening a temporary container for insertion, and converting the bundled contents into a wrapped item via `unwrappable.WrapItems`. It also supports save/load persistence by serializing intermediate bundling state.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("bundler")

-- Assuming 'item_with_bundlemaker' is an item with a bundlemaker component:
local success = inst.components.bundler:StartBundling(item_with_bundlemaker)
if success then
    -- User inserts items into the opened container...
    -- Then call FinishBundling when done:
    inst.components.bundler:FinishBundling()
end
```

## Dependencies & tags
**Components used:** `bundlemaker`, `container`, `inventory`, `inventoryitem`, `unwrappable`  
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `bundlinginst` | `Entity` or `nil` | `nil` | Temporary container entity spawned during bundling. |
| `itemprefab` | `string` or `nil` | `nil` | Prefab name of the original bundling item (e.g., "paperbag"). |
| `wrappedprefab` | `string` or `nil` | `nil` | Prefab name of the resulting wrapped item (e.g., "wrapped_fish"). |
| `itemskinname` | `string` or `nil` | `nil` | Skin name used for the original bundling item. |
| `wrappedskinname` | `string` or `nil` | `nil` | Skin name for the final wrapped item. |
| `wrappedskin_id` | `number` or `nil` | `nil` | Numeric skin ID for the final wrapped item. |

## Main functions
### `CanStartBundling()`
*   **Description:** Checks if the entity is allowed to begin a new bundling operation. Requires the current state to be `"bundle"` and no bundling in progress.
*   **Parameters:** None.
*   **Returns:** `boolean` — `true` if bundling can start, otherwise `false`.

### `IsBundling(bundlinginst)`
*   **Description:** Verifies if the entity is actively bundling *and* the provided entity matches the current bundling container.
*   **Parameters:** `bundlinginst` (`Entity` or `nil`) — the candidate bundling container.
*   **Returns:** `boolean` — `true` if actively bundling with the given container.

### `StartBundling(item)`
*   **Description:** Starts a bundling session using the provided item. Spawns a temporary container, opens it for the owner, and transitions the stategraph to `"bundling"`.
*   **Parameters:** `item` (`Entity` or `nil`) — an item with a functional `bundlemaker` component.
*   **Returns:** `boolean` — `true` on success, `false` otherwise.
*   **Error states:** Returns `false` if the item lacks a `bundlemaker` component, missing bundling/wrapped prefab data, or if the spawned container fails to open.

### `StopBundling()`
*   **Description:** Cancels or aborts the current bundling session. Returns all items in the bundling container to the owner's inventory (or drops them if no inventory), and respawns the original bundling item.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `FinishBundling()`
*   **Description:** Transitions the stategraph to `"bundle_pst"` after confirming the bundling container is not empty. Does *not* create the wrapped item—this is deferred to `OnFinishBundling`.
*   **Parameters:** None.
*   **Returns:** `boolean` — `true` if the state transition succeeded, `false` otherwise.

### `OnFinishBundling()`
*   **Description:** Finalizes bundling: spawns the wrapped item, inserts all items from the bundling container into it via `unwrappable.WrapItems`, removes the bundling container, and gives the wrapped item to the owner.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `OnSave()`
*   **Description:** Serializes the current bundling state, including the bundling container (if non-empty), and pending item/wrapped prefabs.
*   **Parameters:** None.
*   **Returns:** `table` or `nil` — save data if bundling is in progress, otherwise `nil`.

### `OnLoad(data)`
*   **Description:** Loads a previously saved bundling state. Re-creates the bundling container and restores all pending state.
*   **Parameters:** `data` (`table`) — save data from `OnSave`.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** None identified (no `inst:ListenForEvent` calls in `bundler.lua`).
- **Pushes:** None identified (no `inst:PushEvent` calls in `bundler.lua`).  
  *(Note: The component indirectly triggers events by calling methods on other components like `container:Open`, `unwrappable:WrapItems`, etc., but does not fire custom events itself.)*
