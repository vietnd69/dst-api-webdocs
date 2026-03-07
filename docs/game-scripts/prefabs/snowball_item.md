---
id: snowball_item
title: Snowball Item
description: Represents an ice-based consumable item that can be thrown, equipped, used as a water source, or built into a snowman, with melting and frost effects.
tags: [inventory, combat, environment, physics, crafting]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: af421b0e
system_scope: inventory
---

# Snowball Item

> Based on game build **7140014** | Last updated: 2026-03-07

## Overview
The `snowball_item` prefab implements a multi-functional frozen consumable used for combat, environmental interaction, and crafting. It integrates several components to enable throwing, equipping, extinguishing heat sources, melting over time, and assembling into a snowman via pushing. When thrown, it travels as a projectile and applies a small radius cold splash effect upon impact. When melted or consumed, it releases moisture and can extinguish nearby heat sources via the `wateryprotection` component.

## Usage example
```lua
local snowball = SpawnPrefab("snowball_item")
snowball.Transform:SetPosition(x, y, z)
snowball.components.equippable:Equip(owner)
-- When thrown:
snowball.components.projectile:OnThrown({ owner = owner })
-- When used as water source (e.g., in a cauldron):
snowball.components.watersource:onusefn(snowball)
```

## Dependencies & tags
**Components used:** `equippable`, `farming_manager`, `inventoryitem`, `moisture`, `perishable`, `projectile`, `pushable`, `sleeper`, `snowballmelting`, `snowmandecoratable`, `stackable`, `watersource`, `wateryprotection`, `weapon`, `tradable`, `smotherer`, `inspectable`, `hauntable`

**Tags added:** `frozen`, `icebox_valid`, `extinguisher`, `show_spoilage`, `pushing_roll`, `watersource`, `weapon`, `projectile`

**Tags checked:** `NOCLICK`, `debris`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `persists` | boolean | `false` (set on throw) | Whether the snowball remains in the world after being thrown or dropped. |
| `snowaccum` | mixed | `nil` | Snow accumulation data passed to snowman when built. |
| `perishable.perishremainingtime` | number | `TUNING.PERISH_TWO_DAY` | Remaining time before the snowball melts (if not in inventory). |
| `stackable.maxsize` | number | `TUNING.STACK_SIZE_SMALLITEM` | Maximum stack size for snowballs. |

## Main functions
### `OnHit(inst, attacker, target)`
*   **Description:** Handles what happens when the snowball hits a target during projectile flight. Wakes up sleeping entities, applies frost effects via `wateryprotection`, and spawns a splash effect. The snowball is then removed.
*   **Parameters:** 
    *   `inst` (Entity) - The snowball item.
    *   `attacker` (Entity) - The entity that threw the snowball.
    *   `target` (Entity) - The entity hit by the snowball.
*   **Returns:** Nothing.
*   **Error states:** Returns early if `target` is invalid.

### `OnThrown(inst, data)`
*   **Description:** Initializes physics and visual state when the snowball is thrown. Sets non-persistent state, plays spin animation, configures physics for projectile motion, hides visibility for the first 2 frames (delayed), and plays a sound.
*   **Parameters:** 
    *   `inst` (Entity) - The snowball item.
    *   `data` (table) - Contains thrower and other throw context (unused directly in this function).
*   **Returns:** Nothing.

### `OnPerish(inst)`
*   **Description:** Called when the snowball melts due to time passing. If held by an owner, it transfers moisture to them (or their inventory); otherwise, it adds moisture to the ground. Removes the item after melting.
*   **Parameters:** `inst` (Entity) - The snowball item.
*   **Returns:** Nothing.

### `OnStartPushing(inst, doer)`
*   **Description:** Builds a snowman from the snowball when pushed. Removes the snowball, spawns a `snowman` prefab, transfers snow accumulation metadata, and starts pushing the new snowman entity.
*   **Parameters:** 
    *   `inst` (Entity) - The snowball item.
    *   `doer` (Entity) - The entity pushing the snowball (e.g., a player).
*   **Returns:** Nothing.

### `OnDoMeltAction(inst)`
*   **Description:** Spawns a shatter effect and removes the snowball when manually melted (e.g., via right-click in warm areas).
*   **Parameters:** `inst` (Entity) - The snowball item.
*   **Returns:** Nothing.

### `OnPutInInventory(inst)`
*   **Description:** Called when the snowball is placed in inventory. Stops melting behavior and disables fire-melt awareness.
*   **Parameters:** `inst` (Entity) - The snowball item.
*   **Returns:** Nothing.

### `OnDropped(inst)`
*   **Description:** Called when the snowball is dropped. Re-enables melting via `snowballmelting` component.
*   **Parameters:** `inst` (Entity) - The snowball item.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:**
    *   `firemelt` - Triggers `OnFireMelt` to mark the item as immune to fire-based melting acceleration.
    *   `stopfiremelt` - Triggers `OnStopFireMelt` to re-enable fire-based melting acceleration.
    *   `onputininventory` - Triggers `OnPutInInventory` to stop melting.
    *   `ondropped` - Triggers `OnDropped` to resume melting.
- **Pushes:** None (the component itself does not fire custom events).