---
id: moonglass
title: Moonglass
description: Creates and configures moonglass and charged moonglass prefabs with edible, stackable, and perishable properties.
tags: [inventory, item, food, network]
sidebar_position: 10

last_updated: 2026-03-06
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: b56ab148
system_scope: inventory
---

# Moonglass

> Based on game build **714014** | Last updated: 2026-03-06

## Overview
The `moonglass.lua` file defines two prefabs: `moonglass` (a standard lunar shard) and `moonglass_charged` (a perishable, glowing variant). It uses `CreateEntity` and attaches multiple components — `stackable`, `inventoryitem`, `edible`, `bait`, `inspectable`, and `tradable` — to make the item usable in inventories, consumable as food, and compatible with lighting and world interactions. Charged moonglass includes additional behavior such as light emission, perishability, and event-based lighting control (turns off when held, on when dropped). The `set_glass_type` function handles random animation selection from `f1`, `f2`, and `f3` frames.

## Usage example
```lua
-- Create a charged moonglass instance (commonly used in modding)
local charged_glass = Prefab("moonglass_charged", ...)
-- or instantiate directly via the returned Prefab function:
local glass = CreatePrefabInstance("moonglass", "moonglass")
-- or for charged variant:
local charged = CreatePrefabInstance("moonglass_charged", "moonglass_charged")
```

## Dependencies & tags
**Components used:** `stackable`, `inventoryitem`, `edible`, `bait`, `inspectable`, `tradable`, `perishable` (only for `moonglass_charged`), `snowmandecor` (only for `moonglass`)
**Tags:** Adds `moonglass_piece`, `lunarhaildebris`, `quakedebris` to all instances; `show_spoilage`, `infusedshard` only to charged variant.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `glassname` | string | `nil` | Name of the animation frame (`f1`, `f2`, or `f3`) used for visual variety; set during init via `set_glass_type`. |

## Main functions
### `set_glass_type(inst, name)`
*   **Description:** Sets the animation frame for the moonglass entity. If `name` is `nil` or differs from current, it picks a random frame from `GLASS_NAMES` and plays it.
*   **Parameters:** `inst` (entity), `name` (string or `nil`) — optional override for animation frame.
*   **Returns:** Nothing.
*   **Error states:** No failure modes; falls back to random frame if `name` is `nil`.

### `onground`/`ondropped` (event handlers)
*   **Description:** Light control handlers: `ondropped` enables the light, `onpickup` disables it. Attached only to `moonglass_charged`.
*   **Parameters:** `inst` (entity) — the item instance.
*   **Returns:** Nothing.

### `displayadjectivefn(inst)`
*   **Description:** Returns a localization string (`STRINGS.UI.HUD.STALE_POWER` or `STRINGS.UI.HUD.SPOILED_POWER`) if the item is stale or spoiled, respectively; otherwise `nil`.
*   **Parameters:** `inst` (entity).
*   **Returns:** string or `nil`.
*   **Error states:** Returns `nil` if not stale/spoiled.

### `createglass(name, preinit, postinit)`
*   **Description:** Main factory function. Constructs the prefab definition with assets, components, and lifecycle hooks. Returns a `Prefab` instance.
*   **Parameters:** `name` (string) — e.g., `"moonglass"` or `"moonglass_charged"`, `preinit` (function) — customization hook before component initialization, `postinit` (function) — customization hook after initialization.
*   **Returns:** `Prefab` — A function that instantiates the prefab when called.
*   **Error states:** None known; handles pristine/non-mastersim worlds correctly.

## Events & listeners
- **Listens to:**  
  - `onputininventory` → calls `onpickup(inst)`  
  - `ondropped` → calls `ondropped(inst)`  
  (only attached to `moonglass_charged`)
- **Pushes:** None.