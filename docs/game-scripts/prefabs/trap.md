---
id: trap
title: Trap
description: Manages trap functionality, including bait detection, capture logic, and finite-usage tracking for mechanical traps in Don't Starve Together.
tags: [trap, combat, inventory, world]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 163c89e1
system_scope: world
---

# Trap

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
The `trap` component is a lightweight logic handler that operates on trap prefabs to detect entities with the `"canbetrapped"` tag, trigger capture logic via state graphs, and manage usage decay. It coordinates with the `inventoryitem` component for item handling and the `finiteuses` component to deplete the trap upon use. The component itself does not define core capture mechanics but serves as the interface between entity detection and gameplay logic implemented in the `SGtrap` state graph.

## Usage example
```lua
local inst = SpawnPrefab("trap")
inst.Transform:SetPosition(x, y, z)
inst.components.trap:SetOnHarvestFn(function(trap) 
    print("Trap triggered!")
end)
```

## Dependencies & tags
**Components used:** `inventoryitem`, `finiteuses`, `inspectable`, `trap` (self), `floater`, `hauntable`, `animstate`, `soundemitter`, `minimapentity`, `transform`, `network`
**Tags:** Adds `"trap"`; interacts with `"canbetrapped"` via `targettag`.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `targettag` | string | `"canbetrapped"` | Tag checked against entities entering the trap’s range to determine if they can be captured. |
| `baitsortorder` | number | `1` | Priority value used when sorting bait items in the trap UI. |
| `onharvest` | function | `nil` | Callback invoked when the trap successfully captures an entity. |

## Main functions
### `SetOnHarvestFn(fn)`
*   **Description:** Sets the callback function invoked when the trap successfully harvests (captures) a target.
*   **Parameters:** `fn` (function) - a function accepting the trap `inst` as its sole argument.
*   **Returns:** Nothing.

### `SetOnHarvestFn(fn)` (alias)
*   **Description:** Internal alias used inprefab definition; same behavior as `SetOnHarvestFn`.
*   **Parameters:** Same as above.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  - `floater_startfloating` → triggers `"side"` animation via `on_float`  
  - `floater_stopfloating` → triggers `"idle"` animation via `on_not_float`  
- **Pushes:** None (event pushing is handled by the state graph `SGtrap`).  
- **Notifies via callback:**  
  - When `finiteuses` completes, `on_usedup` removes the trap from the owner (if applicable) and destroys it.  
  - When harvested, `onharvested` consumes one use and invokes the `onharvest` callback.