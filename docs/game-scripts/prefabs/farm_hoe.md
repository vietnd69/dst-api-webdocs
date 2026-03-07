---
id: farm_hoe
title: Farm Hoe
description: A tool prefab that enables tilling soil, dealing damage, and providing floating buoyancy; its durability is managed by finite uses.
tags: [combat, environment, inventory, tool]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: ed95ba4a
system_scope: environment
---

# Farm Hoe

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
The `farm_hoe` is a reusable tool prefab responsible for tilling soil in the game. It is implemented via two variants: the standard `farm_hoe` and the durable `golden_farm_hoe`. The component integrates with the ECS via multiple components: `equippable` (handles animation overrides and equip/unequip behavior), `finiteuses` (manages tool durability), `weapon` (provides combat capability), `floater` (enables buoyancy effects), and `farmtiller` (enables soil tilling). It is primarily instantiated as a `Prefab`, not used as a standalone component class.

## Usage example
```lua
-- Standard farm hoe instantiation
local hoe = GetPrefab("farm_hoe")

-- The tool is typically spawned as a world item or given to a player via inventory
-- When equipped, it overrides the player's "swap_object" symbol and plays equip sound for golden variant
-- When used to till soil, it consumes 1 use (or 1 / TUNING.GOLDENTOOLFACTOR for golden)
```

## Dependencies & tags
**Components used:** `equippable`, `finiteuses`, `floater`, `inventoryitem`, `weapon`, `farmtiller`, `inspectable`  
**Tags:** `sharp`, `weapon` (added during initialization); `usesdepleted` (added when `finiteuses` reaches zero via `SetUses`)

## Properties
No public properties are initialized or exposed directly by the `farm_hoe` prefab itself. Interaction occurs via component methods (e.g., `inst.components.finiteuses:SetUses`).

## Main functions
### `common_fn(build)`
*   **Description:** Shared factory function for creating both `farm_hoe` and `golden_farm_hoe` prefabs. Initializes core entity components, sets animation bank/build, adds tags, and configures durability, weapon damage, and equip/unequip logic for the non-golden variant.
*   **Parameters:** `build` (string) – the animation bank/build name (e.g., `"quagmire_hoe"` or `"goldenhoe"`).
*   **Returns:** `inst` (Entity) – the initialized entity instance.
*   **Error states:** Returns early on the client (when `TheWorld.ismastersim == false`) with minimal setup.

### `fn()`
*   **Description:** Factory function for the standard `farm_hoe`. Calls `common_fn("quagmire_hoe")` and configures floating behavior.
*   **Parameters:** None.
*   **Returns:** `inst` (Entity) – the fully initialized `farm_hoe` instance.
*   **Error states:** None documented beyond early client return.

### `golden()`
*   **Description:** Factory function for the `golden_farm_hoe`. Calls `common_fn("goldenhoe")` and adjusts durability consumption and weapon wear rates using `TUNING.GOLDENTOOLFACTOR`.
*   **Parameters:** None.
*   **Returns:** `inst` (Entity) – the fully initialized `golden_farm_hoe` instance.
*   **Error states:** None documented beyond early client return.

### `onequip(inst, owner)`
*   **Description:** Equip handler that overrides the player's `swap_object` symbol for animation sync and shows the carry pose.
*   **Parameters:**  
    `inst` (Entity) – the hoe entity.  
    `owner` (Entity) – the player equipping the hoe.
*   **Returns:** Nothing.

### `onunequip(inst, owner)`
*   **Description:** Unequip handler that restores the player's idle animation pose.
*   **Parameters:**  
    `inst` (Entity) – the hoe entity.  
    `owner` (Entity) – the player unequipping the hoe.
*   **Returns:** Nothing.

### `onequipgold(inst, owner)`
*   **Description:** Variant of `onequip` used for the golden hoe; plays an equip sound and uses a different animation bank/symbol.
*   **Parameters:**  
    `inst` (Entity) – the golden hoe entity.  
    `owner` (Entity) – the player equipping the golden hoe.
*   **Returns:** Nothing.

### `onfiniteusesfinished(inst)`
*   **Description:** Callback invoked when the tool's uses are exhausted. Notifies the owner (if present) of tool breakage and removes the entity.
*   **Parameters:** `inst` (Entity) – the hoe entity.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  - `equipskinneditem` – pushed by the tool during `onequip` when a skin build is present (handled via `owner:PushEvent`).  
  - `toolbroke` – pushed by `onfiniteusesfinished` to notify the owner when the tool breaks.  
  - `percentusedchange` – pushed internally by `finiteuses:SetUses` (indirect listening via `owner`).
- **Pushes:**  
  - `equipskinneditem` – with `{ skin_name }`.  
  - `toolbroke` – with `{ tool = inst }`.  
  - `percentusedchange` – via `finiteuses` component when `current` changes (e.g., `percent` value passed in `data`).

