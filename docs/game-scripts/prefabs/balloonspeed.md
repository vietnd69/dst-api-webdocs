---
id: balloonspeed
title: Balloonspeed
description: Manages the lifecycle, flight physics, and fuel-based speed progression of a floating balloon used as a consumable speed boost item.
tags: [locomotion, inventory, consumable, physics]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: e4b33aba
system_scope: locomotion
---

# Balloonspeed

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
`balloonspeed` is a prefab implementation that creates a floating balloon item which grants increased walk speed to the player while equipped. It uses the `fueled`, `equippable`, `inventoryitem`, `poppable`, and `inspectable` components to manage fuel consumption, equip behavior, inventory interactions, visual state, and status display. When dropped, it floats away with physics and animates deflation as it loses fuel. The balloon’s speed multiplier decreases as its internal fuel depletes across configurable sections.

## Usage example
```lua
-- Typical usage occurs internally when spawning the balloon prefab; modders rarely instantiate it directly.
-- Example of inspecting status:
if ballooninst.components.fueled and not ballooninst.components.fueled:IsEmpty() then
    print("Remaining sections:", ballooninst.components.fueled.sections)
end

-- To manually set helium level (e.g., in a custom crafting recipe):
if ballooninst.components.balloonspeed then
    ballooninst.components.balloonspeed.SetHeliumLevel(ballooninst, 2) -- sets mid-speed level
end
```

## Dependencies & tags
**Components used:** `equippable`, `fueled`, `inventoryitem`, `poppable`, `inspectable`
**Tags:** Adds `nopunch`, `cattoyairborne`, `balloon`, `noepicmusic`; checks `fueldepleted` and `popped`.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `balloon_num` | number | `4` (initially) | Current speed level index (1-based, corresponds to `TUNING.BALLOON_SPEEDS` entries). |
| `flyawaytask` | Task | `nil` | Handle to the periodic task for post-drop flight physics; `nil` if not active or after pickup. |
| `flyaway` | function | `flyoff` closure | Internal function executed on drop that initiates upward motion and deflation timer. |

*Note: `balloon_num` is assigned and updated via `SetHeliumLevel`, but is not a component-level property — it is a local instance variable in the prefab entity.*

## Main functions
### `SetHeliumLevel(inst, level)`
*   **Description:** Updates the balloon’s fuel level by adjusting the internal `balloon_num` index, syncing visual and animation states (e.g., deflation, symbol overrides), and setting the `equippable.walkspeedmult` accordingly.
*   **Parameters:**  
  `level` (number) – 1-based fuel level index; clamped to `[1, #TUNING.BALLOON_SPEEDS]`.  
*   **Returns:** Nothing.
*   **Error states:** No-op if `POPULATING` is true or entity is in limbo/popped; otherwise animates deflation sequence before idle.

### `OnDropped(inst)`
*   **Description:** Handler invoked when the balloon is dropped from inventory. Triggers the flight animation loop via `flyoff` after a short delay if fuel remains.
*   **Parameters:** `inst` (Entity) – the balloon entity instance.
*   **Returns:** Nothing.

### `OnPickup(inst)`
*   **Description:** Handler invoked when the balloon is picked up into inventory. Cancels any active flight task to halt motion.
*   **Parameters:** `inst` (Entity) – the balloon entity instance.
*   **Returns:** Nothing.

### `onfuelsectionchange(newsection, oldsection, inst)`
*   **Description:** Callback set on the `fueled` component, triggered when fuel level crosses a section boundary (e.g., 25%, 50%, 75% depletion). Decrements `balloon_num` and updates speed and visuals.
*   **Parameters:**  
  `newsection` (number) – 0-based current fuel section.  
  `oldsection` (number) – previous fuel section.  
  `inst` (Entity) – the balloon entity instance.  
*   **Returns:** Nothing.

### `DisplayNameFn(inst)`
*   **Description:** Dynamic name function used for inventory display; returns default name only when fuel is depleted.
*   **Parameters:** `inst` (Entity) – the balloon entity instance.
*   **Returns:** `STRINGS.NAMES.BALLOON` if fuel is empty, otherwise `nil`.

### `getstatus(inst)`
*   **Description:** Status callback for `inspectable`, returning `"DEFLATED"` when fuel is fully spent.
*   **Parameters:** `inst` (Entity) – the balloon entity instance.
*   **Returns:** `"DEFLATED"` or `nil`.

## Events & listeners
- **Listens to:**  
  - `imagechange` (implicitly via `inventoryitem`’s `ChangeImageName` update) – triggers visual sync.
- **Pushes:**  
  - `onfueldsectionchanged` – fired via `fueled` when fuel section changes (handled internally by `onfuelsectionchange`).  
  - `imagechange` – triggered when inventory image name updates.