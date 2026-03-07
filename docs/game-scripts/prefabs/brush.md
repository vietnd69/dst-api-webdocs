---
id: brush
title: Brush
description: A consumable tool that allows players to groom Beefalo, restoring sanity and providing temporary speed and warmth bonuses.
tags: [grooming, consumable, cosmetic]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 0e7dcf7e
system_scope: inventory
---

# Brush

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
The `brush` prefab is a handheld tool used primarily for grooming Beefalo. It functions as a consumable item with finite uses, integrates with the equippable system to manage visual animation states on the player, and interacts with the weapon component to perform grooming actions. It is typically added to player or Beefalo interaction prefabs and supports network synchronization via `inventoryitem`, `inspectable`, and networked `finiteuses` components.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("brush")
inst.components.finiteuses:SetUses(10)
inst.components.equippable:SetOnEquip(function(inst, owner) 
    -- custom equip logic
end)
```

## Dependencies & tags
**Components used:** `weapon`, `brush`, `finiteuses`, `inspectable`, `inventoryitem`, `equippable`
**Tags:** Adds `weapon` during construction (for optimization), and potentially `usesdepleted` via `finiteuses`.

## Properties
No public properties.

## Main functions
### `fn()`
*   **Description:** Constructor function that creates and configures the Brush entity instance. Called automatically when the prefab is instantiated.
*   **Parameters:** None.
*   **Returns:** `inst` (Entity) — the fully configured Brush entity.
*   **Error states:** Returns early on non-master clients (only the master simulates the brush logic).

## Events & listeners
- **Listens to:** None identified.
- **Pushes:** 
  - `percentusedchange` — via `finiteuses:SetUses()` when remaining uses change.
  - `brushaction` — implicitly triggered via grooming interactions (handled by `brush` component logic elsewhere in the codebase, but the prefab supports it).