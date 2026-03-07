---
id: trunkvest
title: Trunkvest
description: A seasonal armor prefab that provides insulation and waterproofer properties, consuming fuel while equipped to prevent hypothermia or overheating.
tags: [inventory, clothing, insulation, equipment]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 279feee4
system_scope: inventory
---

# Trunkvest

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
`trunkvest` is a seasonal clothing prefab that exists in two variants (`trunkvest_summer` and `trunkvest_winter`). It functions as an insulating armor item that provides temperature regulation by consuming fuel while equipped. When equipped, it overrides the player's body animation symbol and activates its `fueled` component to slowly deplete its fuel reserve. The winter variant includes high insulation and no waterproofer, while the summer variant includes modest insulation and full waterproofer.

## Usage example
```lua
local trunkvest = SpawnPrefab("trunkvest_summer")
if trunkvest ~= nil then
    -- Equip it manually for demonstration
    local player = TheWorld:GetPlayerEntity()
    if player ~= nil and player.components.inventory then
        player.components.inventory:GiveItem(trunkvest)
    end
    -- Fuel is consumed only when equipped via the equippable component's hook
end
```

## Dependencies & tags
**Components used:** `equippable`, `fueled`, `insulator`, `waterproofer`, `tradable`, `inspectable`, `inventoryitem`, `transform`, `animstate`, `network`, `foleysound`, `floatable`, `hauntable`.  
**Tags:** Adds `waterproofer` only to the summer variant (`trunkvest_summer`); no other tags.

## Properties
No public properties are defined directly in the constructor; behavior is configured via component settings (e.g., `inst.components.fueled.fueltype`, `inst.components.equippable.equipslot`). The prefab returns two pre-configured instances (`Prefab` objects), not a reusable component class.

## Main functions
### `create_common(bankandbuild, iswaterproofer)`
*   **Description:** Core constructor used to create the shared base for both trunkvest variants. Initializes animation, transform, network, and inventory components; sets up equippability, insulation, and fueled logic.
*   **Parameters:** `bankandbuild` (string) – animation bank/build name; `iswaterproofer` (boolean) – whether to add `waterproofer` tag and component.
*   **Returns:** The created `inst` entity on the master simulation; a lightweight proxy without components on clients.
*   **Error states:** Returns early on non-master instances (`not TheWorld.ismastersim`), returning only the base entity.

### `create_summer()`
*   **Description:** Constructs and returns the `trunkvest_summer` prefab, configured with `waterproofer`, modest insulation, and summer-specific equip logic.
*   **Parameters:** None.
*   **Returns:** A `Prefab` instance that can be spawned via `SpawnPrefab("trunkvest_summer")`.

### `create_winter()`
*   **Description:** Constructs and returns the `trunkvest_winter` prefab, configured with high insulation and winter-specific equip logic.
*   **Parameters:** None.
*   **Returns:** A `Prefab` instance that can be spawned via `SpawnPrefab("trunkvest_winter")`.

## Events & listeners
- **Listens to:** None (the component does not register any listeners via `inst:ListenForEvent`).
- **Pushes:** `equipskinneditem` (when equipped with a skin); `unequipskinneditem` (when unequipped with a skin).