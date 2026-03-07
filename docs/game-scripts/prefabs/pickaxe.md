---
id: pickaxe
title: Pickaxe
description: A tool-and-weapon prefab providing mining and combat functionality with finite durability, equipped with visual, inventory, and network support.
tags: [tool, weapon, inventory, combat, durability]
sidebar_position: 10

last_updated: 2026-03-06
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 1ed33f2b
system_scope: inventory
---

# Pickaxe

> Based on game build **714014** | Last updated: 2026-03-06

## Overview
`pickaxe.lua` defines two prefabs: the standard `pickaxe` and the `goldenpickaxe`. It assembles a reusable `common_fn` constructor to instantiate the base entity with transform, animation, sound, and network components, then adds functionality through components: `tool` (for mining actions), `finiteuses` (for durability tracking), `weapon` (for combat damage), `equippable` (for visual and sound hooks on equip/unequip), and supporting components like `floater`, `inspectable`, and `inventoryitem`. The golden version modifies use rate, damage wear, and equip sound using tuning constants.

## Usage example
```lua
-- Example: creating a pickaxe and inspecting its durability
local inst = Prefab("pickaxe", "common_fn")  -- typically constructed via return value
if inst.components.finiteuses then
    print("Remaining uses:", inst.components.finiteuses:GetPercent())
end
```

## Dependencies & tags
**Components used:** `tool`, `finiteuses`, `weapon`, `equippable`, `floater`, `inspectable`, `inventoryitem`  
**Tags added:** `sharp`, `tool`, `weapon`  
**Tags removed/checks:** None identified.

## Properties
No public properties are initialized in the constructor. Component state is accessed via `inst.components.*`.

## Main functions
### `common_fn(bank, build)`
*   **Description:** Shared constructor for both pickaxe variants. Sets up entity, animation, tags, and core components (`tool`, `finiteuses`, `weapon`, `equippable`, `floater`, etc.). Only executes server-side logic (`TheWorld.ismastersim`) on the master simulation.
*   **Parameters:**  
  - `bank` (string) – anim bank name (e.g., `"pickaxe"` or `"goldenpickaxe"`)  
  - `build` (string) – build name for animations/symbols (e.g., `"pickaxe"` or `"goldenpickaxe"`)  
*   **Returns:** `inst` – the fully configured entity instance. Returns early on clients if not master.

### `onequip(inst, owner)`
*   **Description:** Equip handler for standard pickaxe. Swaps the swap symbol to `"swap_pickaxe"` and updates owner animation and skin overrides if present.
*   **Parameters:**  
  - `inst` (Entity) – the pickaxe being equipped  
  - `owner` (Entity) – the entity equipping the item  
*   **Returns:** Nothing.

### `onunequip(inst, owner)`
*   **Description:** Unequip handler for standard pickaxe. Restores the owner’s animation and removes skin overrides if present.
*   **Parameters:**  
  - `inst` (Entity) – the pickaxe being unequipped  
  - `owner` (Entity) – the entity unequipping the item  
*   **Returns:** Nothing.

### `onequipgold(inst, owner)`
*   **Description:** Equip handler for golden pickaxe. Same as `onequip`, but with a custom sound ("dontstarve/wilson/equip_item_gold") and `swap_goldenpickaxe` symbol override.
*   **Parameters:** Same as `onequip`.
*   **Returns:** Nothing.

### `normal()`
*   **Description:** Constructor for the standard pickaxe. Calls `common_fn("pickaxe", "pickaxe")` and configures floater banking.
*   **Parameters:** None.
*   **Returns:** `inst` – fully constructed standard pickaxe entity.

### `golden()`
*   **Description:** Constructor for the golden pickaxe. Calls `common_fn("goldenpickaxe", "goldenpickaxe")`, adjusts use rate and attack wear via `TUNING.GOLDENTOOLFACTOR`, sets golden equip sound, and updates floater banking.
*   **Parameters:** None.
*   **Returns:** `inst` – fully constructed golden pickaxe entity.

## Events & listeners
- **Listens to:** None identified.
- **Pushes:**  
  - `equipskinneditem` (with `{inst:GetSkinName()}`) — fired during equip when a skin build exists (both variants).  
  - `unequipskinneditem` (with `{inst:GetSkinName()}`) — fired during unequip when a skin build exists (both variants).  
  - `percentusedchange` — internally via `finiteuses:SetUses` (see `FiniteUses` component behavior).  
  - On finished uses (e.g., durability exhausted), `finiteuses.onfinished` is called, which invokes `inst.Remove` to delete the item.