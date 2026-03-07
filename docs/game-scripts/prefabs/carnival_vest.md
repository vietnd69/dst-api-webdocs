---
id: carnival_vest
title: Carnival Vest
description: A wearable item that provides seasonal insulation and self-consuming fuel for protection, with dynamic animation overrides while equipped.
tags: [equippable, insulation, fuel, seasonal]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 0106f8af
system_scope: inventory
---

# Carnival Vest

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
The `carnival_vest` is a wearable prefab that grants seasonal insulation (specifically for summer heat protection) and has a built-in fuel mechanism that activates only while equipped. It uses animation override symbols (`"backpack"` and `"swap_body"`) to display a custom visual on the player when worn. When equipped, it begins consuming fuel (via the `fueled` component), and stops when unequipped or rendered as a model (e.g., in inventory or stash). It is self-removing upon fuel depletion.

## Usage example
This component is not used directly via `AddComponent`. Instead, it is instantiated as a prefab via the `MakeVest` factory. Example usage in modding:

```lua
-- Register a new carnival vest (e.g., custom color or insulation)
local MyCustomVest = MakeVest("my_carnival_vest", "my_carnival_vest", TUNING.INSULATION_SMALL)
```

## Dependencies & tags
**Components used:** `equippable`, `fueled`, `insulator`, `fuel`, `inspectable`, `inventoryitem`, `transform`, `animstate`, `network`, `boiler`, `burnable`, `propagator`, `hauntable`
**Tags:** None explicitly added or removed.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `build` | string | `build_bank` argument | Name of the animation bank/build used for visual override. Assigned in the constructor after `TheWorld.ismastersim` check. |

## Main functions
### `common_fn(build_bank, insulation)`
*   **Description:** Factory function that creates and configures the entity for the carnival vest. Sets up animation, physics, components, and behavior hooks. Only runs on the master simulation.
*   **Parameters:**
    *   `build_bank` (string) — Name of the animation bank and build symbol.
    *   `insulation` (number) — Insulation value applied for heat resistance.
*   **Returns:** The fully configured `Entity` instance.

### `onequip(inst, owner)`
*   **Description:** Triggered when the vest is equipped onto a player. Overrides player animation symbols and starts fuel consumption.
*   **Parameters:**
    *   `inst` (Entity) — The vest entity.
    *   `owner` (Entity) — The player entity equipping the vest.
*   **Returns:** Nothing.

### `onunequip(inst, owner)`
*   **Description:** Triggered when the vest is unequipped. Clears animation overrides and stops fuel consumption.
*   **Parameters:**
    *   `inst` (Entity) — The vest entity.
    *   `owner` (Entity) — The player entity unequipping the vest.
*   **Returns:** Nothing.

### `onequiptomodel(inst)`
*   **Description:** Triggered when the vest is placed into a model state (e.g., inventory, stash, or crafting table). Stops fuel consumption.
*   **Parameters:**
    *   `inst` (Entity) — The vest entity.
*   **Returns:** Nothing.

### `MakeVest(prefabname, build_bank, insulation)`
*   **Description:** Factory function that constructs and returns a `Prefab` object for a specific carnival vest variant.
*   **Parameters:**
    *   `prefabname` (string) — Name of the new prefab (e.g., `"carnival_vest_a"`).
    *   `build_bank` (string) — Animation bank and symbol override name.
    *   `insulation` (number) — Insulation value for summer protection.
*   **Returns:** `Prefab` — A fully defined prefab ready for registration.

## Events & listeners
- **Listens to:** None.
- **Pushes:** None directly. However, the underlying `fueled` component fires `"onfueldsectionchanged"` events and `"depleted"` events via `SetDepletedFn`, which calls `inst.Remove` when fuel is exhausted.
