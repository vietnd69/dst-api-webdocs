---
id: seedpouch
title: Seedpouch
description: Acts as a wearable body-slot container that opens automatically when equipped and preserves items inside it.
tags: [inventory, container, wearable]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: f705b88e
system_scope: inventory
---

# Seedpouch

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
The `seedpouch` prefab functions as a wearable body-slot container. When equipped, it opens the container UI for the owner and visually overrides the character's backpack and swap_body symbols to display the pouch. It disables inventory stacking (via `cangoincontainer = false`) and applies a custom perish rate multiplier to items stored inside using the `preserver` component. It integrates with the `equippable` and `container` components to manage state transitions (open/closed) and visual appearance.

## Usage example
```lua
local inst = Prefab("seedpouch", fn, assets, prefabs)
-- The prefab is instantiated automatically by the game when needed.
-- Typical usage is via player equipping: player:PushEvent("equipto", {item = seedpouch})
-- The container opens on equip and closes on unequip automatically.
```

## Dependencies & tags
**Components used:** `inspectable`, `inventoryitem`, `equippable`, `container`, `preserver`, `transform`, `animstate`, `soundemitter`, `network`  
**Tags:** Adds `backpack`.

## Properties
No public properties.

## Main functions
### `onequip(inst, owner)`
*   **Description:** Handler called when the seedpouch is equipped. Opens the container UI for the owner and applies visual overrides for the backpack and swap_body symbols. If the item has a skin, it applies skin-specific overrides; otherwise, it applies default symbol overrides.
*   **Parameters:**  
    - `inst` (Entity) - The seedpouch instance being equipped.  
    - `owner` (Entity) - The entity equipping the seedpouch.  
*   **Returns:** Nothing.
*   **Error states:** None documented; relies on owner having `AnimState` and `HUD` components.

### `onunequip(inst, owner)`
*   **Description:** Handler called when the seedpouch is unequipped. Clears the backpack and swap_body symbol overrides and closes the container UI for the owner.
*   **Parameters:**  
    - `inst` (Entity) - The seedpouch instance being unequipped.  
    - `owner` (Entity) - The entity unequipping the seedpouch.  
*   **Returns:** Nothing.

### `onequiptomodel(inst, owner)`
*   **Description:** Handler called when the seedpouch is equipped to a model (e.g., preview or non-interactive context). Closes the container without opening it.
*   **Parameters:**  
    - `inst` (Entity) - The seedpouch instance.  
    - `owner` (Entity) - The entity that would be the owner.  
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** None directly (event handlers are callbacks via `equippable` component hooks).
- **Pushes:**  
  - `equipskinneditem` (via owner) — fired during equip if a skin is present.  
  - Container-related events via `inst:PushEvent("onopen", ...)` and `inst:PushEvent("onclose", ...)` — handled by `container` component internal logic when opened/closed.