---
id: bundle
title: Bundle
description: Manages the creation and behavior of bundle and gift prefabs, which can hold items for storage or gifting, with support for wrapping/unwrapping logic, moisture inheritance, and dynamic loot tables.
tags: [inventory, crafting, loot, fx]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 81e4c0c6
system_scope: inventory
---

# Bundle

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
`bundle.lua` defines a collection of prefabs used for wrapping, storing, and delivering items in the game. It provides two mainPrefab families: `bundle` (for simple storage wrapping) and `gift` (which supports animated jiggles and cannot be peeked), plus variant-specific red pouches and seed packets. Each bundle uses the `unwrappable` component for item containment and release, integrates with `stackable`, `fuel`, `burnable`, and `inventoryitem` components for durability and UI behavior, and supports master-side initialization with dynamic loot generation. The prefabs are created via factory functions `MakeBundle`, `MakeWrap`, and `MakeContainer`.

## Usage example
```lua
-- Example: Spawn a gift bundle with variation support and enable jiggles
local inst = SpawnPrefab("gift")
inst:MakeJiggle() -- Enables jiggle animation and unwrap delay logic
inst.components.unwrappable:WrapItems({ "stick", "flint" })
-- Later, unwrap it to release contents
inst.components.unwrappable:Unwrap(player, false)
```

## Dependencies & tags
**Components used:** `bundlemaker`, `burnable`, `container`, `fuel`, `inventoryitem`, `inspectable`, `propagator`, `stackable`, `unwrappable`, `inventoryitemmoisture`, `builder`.
**Tags:** `bundle`, `unwrappable`, `canpeek` (only when `setupdata.peekcontainer` is true).

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `jiggle` | boolean | `nil` | Whether the bundle supports animated jiggles when wrapped. |
| `suffix` | string | `nil` | Current animation suffix (`_small`, `_medium`, `_large`, `_onesize`, or `..variation`). |
| `variation` | number | `nil` | Random variant index (if `variations` > 0). |
| `burnt` | boolean | `false` | Set to `true` when the bundle is burnt and triggers ash spawn on unwrap. |
| `pendingunwrap` | boolean | `nil` | Temporary state during delayed unwrap of large bundles. |

## Main functions
### `MakeBundle(name, numsizes, variations, loot, tossloot, setupdata, bank, build, inventoryimage)`
* **Description:** Factory function that returns a `Prefab` for a bundle item (e.g., `bundle`, `gift`, `redpouch`). Supports multiple sizes, random variations, custom loot tables, and per-variant post-inits. Handles both common (pre-init) and master-specific logic.
* **Parameters:**  
  `name` (string) - Prefab base name.  
  `numsizes` (number) - Number of distinct sizes (`1`, `2`, or `3`).  
  `variations` (number or `nil`) - Number of visual variants (e.g., `2` for red/blue gift wraps).  
  `loot` (table or `nil`) - Static list of prefabs to drop on unwrap.  
  `tossloot` (boolean or `nil`) - Whether loot items are auto-dropped with velocity.  
  `setupdata` (table) - Options table; keys may include `peekcontainer` (bool), `lootfn`, `common_postinit`, and `master_postinit`.  
  `bank`, `build`, `inventoryimage` (strings) - Optional overrides for anim bank, build, and inventory image name.  
* **Returns:** Prefab instance.

### `MakeWrap(name, containerprefab, tag, cheapfuel)`
* **Description:** Factory function that returns a `Prefab` for a wrapping sheet (e.g., `bundlewrap`) used to wrap bundles. Primarily used in crafting recipes.
* **Parameters:**  
  `name` (string) - Prefab name (e.g., `"bundle"`).  
  `containerprefab` (string) - Name of the associated bundle container prefab.  
  `tag` (string or `nil`) - Optional tag to add.  
  `cheapfuel` (boolean) - If `true`, sets fuel value to `TUNING.TINY_FUEL`; otherwise `TUNING.MED_FUEL`.  
* **Returns:** Prefab instance.

### `MakeContainer(name, build, tag)`
* **Description:** Factory function that returns a `Prefab` for an invisible container used for bundling or construction. Always placed in the world but does not persist (`persists = false`).
* **Parameters:**  
  `name` (string) - Prefab name (e.g., `"bundle_container"`).  
  `build` (string) - UI animation build name.  
  `tag` (string or `nil`) - Optional tag (e.g., `"repairconstructionsite"`).  
* **Returns:** Prefab instance.

### `MakeJiggle(inst)`
* **Description:** Enables jiggle animation support on the bundle instance (e.g., for gifts). Must be called *after* the bundle is created and *before* it is wrapped. Attaches `UnwrapDelay` to `unwrappable`, sets event callbacks for animation state, and manages the `jiggletask`.
* **Parameters:**  
  `inst` (Entity) - The bundle instance.  
* **Returns:** Nothing.

### `UpdateInventoryImage(inst)`
* **Description:** Updates the inventory item’s image name based on current size suffix and variation. Called automatically during wrapping and post-load.
* **Parameters:**  
  `inst` (Entity) - The bundle instance.  
* **Returns:** Nothing.

### `UnwrapDelay(inst, doer)`
* **Description:** Returns a delay (in seconds) before the bundle unwrap is performed. Used specifically for large bundles with `variation` set to create an animated unwrap delay (e.g., shaking before opening).
* **Parameters:**  
  `inst` (Entity) - The bundle instance.  
  `doer` (Entity or `nil`) - The entity unwrapping the bundle.  
* **Returns:** Number — delay in seconds, or `nil` if no delay. Returns `0.5` for large bundles with animations.

## Events & listeners
- **Listens to:**  
  `unwrappeditem` — fires on loot items when they are spawned from unwrap (via `item:PushEvent`).  
  `wrappeditem` — fires on the bundle when items are added via `WrapItems` (via `inst.components.unwrappable:WrapItems`).  
- **Pushes:**  
  `unwrapped` — fired when the bundle is fully unwrapped (includes `doer` in data).  
  `wrapped` — fired after wrapping completes (handled by `OnWrapped` callback, which plays sound and triggers jiggles).  
  `imagechange` — pushed via `inventoryitem:ChangeImageName`.  
  `ondropped`, `onownerdropped`, `unwrappeditem`, `wrappeditem` — propagated to child items or parent inventory.
