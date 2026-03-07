---
id: treasurechest
title: Treasurechest
description: Implements a modular chest prefab factory with variant-specific behavior for treasure storage, looting, upgrading, and special interactions.
tags: [container, looting, upgrade, scenario]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: e51226fc
system_scope: entity
---

# Treasurechest

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
`treasurechest.lua` is a centralized prefab factory and variant initializer for various chest types in DST. It defines a shared `MakeChest` factory function that constructs generic chest entities with core components (container, lootdropper, workable, burnable, hauntable, etc.), then customizes each chest variant via variant-specific postinitialization functions (`regular_master_postinit`, `pandora_master_postinit`, `minotaur_master_postinit`, etc.). Key responsibilities include handling hammering, burning, deconstruction, upgrading, submersion, and scenario-based logic (e.g., Pandora’s Chest resetting or transforming into a mimic).

## Usage example
```lua
-- Creating a standard upgraded treasure chest
local chest = SpawnPrefab("treasurechest")
chest.Transform:SetPosition(x, y, z)

-- Upgrading the chest to enable infinite stack size
chest.components.upgradeable.numupgrades = 1
chest.components.upgradeable:SetOnUpgradeFn(OnUpgrade)(chest, player, false)

-- Hammering the chest to collapse it (if overstacked)
chest.components.workable:SetWorkLeft(2)
chest.components.workable:GetWorkAction()(chest, player)
```

## Dependencies & tags
**Components used:** `burnable`, `container`, `equippable`, `hauntable`, `heavyobstaclephysics`, `inspectable`, `inventoryitem`, `lootdropper`, `riftspawner`, `scenariorunner`, `shadowthrall_mimics`, `stackable`, `submersible`, `symbolswapdata`, `upgradeable`, `workable`.

**Tags:** Adds `structure`, `chest` to all chests. Variants may add `heavy`, `NOBLOCK`, `outofreach`, `FX`, or `CLASSIFIED`. `"burnt"` is conditionally applied during burn state tracking.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `sounds` | table | `{open, close, built}` | Per-chest sound event keys (default paths or custom via skins/scenarios). |
| `_chestupgrade_stacksize` | boolean | `false` | Internal flag indicating if the chest is upgraded for infinite stack size. |
| `fx` | entity | `nil` | References an attached FX entity for visual effects (e.g., Terrarium chest shimmer). |
| `no_delete_on_deconstruct` | boolean | `nil` | Override flag used during deconstruction to prevent deletion. |

## Main functions
### `MakeChest(name, bank, build, indestructible, master_postinit, prefabs, assets, common_postinit, force_non_burnable)`
*   **Description:** Factory function that creates a new chest prefab. Sets up basic structure, components (container, burnable, lootdropper, workable, hauntable, etc.), and event callbacks. The `master_postinit` parameter allows variants to inject customized behavior.
*   **Parameters:**
    *   `name` (string) - Unique prefab name (e.g., `"treasurechest"`, `"pandoraschest"`).
    *   `bank` (string) - Anim bank name (e.g., `"chest"`, `"pandoras_chest"`).
    *   `build` (string) - Build asset name (e.g., `"treasure_chest"`).
    *   `indestructible` (boolean) - If true, omits burnable, workable, and lootdropper components.
    *   `master_postinit` (function or `nil`) - Variant-specific post-init function attached to the `OnLoad` event and used to configure variant-specific components and events.
    *   `prefabs` (table or `nil`) - Prefab dependencies for the lootdropper.
    *   `assets` (table or `nil`) - Additional ANIM assets.
    *   `common_postinit` (function or `nil`) - Shared post-init applied to all chests (e.g., deploy radius).
    *   `force_non_burnable` (boolean or `nil`) - If true, skips burnable setup even if `indestructible` is false.
*   **Returns:** A Prefab definition (the `fn` passed to `Prefab()`).
*   **Error states:** None documented.

### `OnUpgrade(inst, performer, upgraded_from_item)`
*   **Description:** Handles the upgrade of a chest to enable infinite stack size. Applies visual updates (anim bank/build), spawns upgrade FX if triggered via item, and configures loot (e.g., `"alterguardianhatshard"`).
*   **Parameters:**
    *   `inst` (entity) - The chest instance being upgraded.
    *   `performer` (entity or `nil`) - The player or item performing the upgrade.
    *   `upgraded_from_item` (boolean) - True if upgrade originated from an item (e.g., hammering an upgraded chest item).
*   **Returns:** Nothing.
*   **Error states:** If `numupgrades` is not `1`, only the upgrade type is cleared and callbacks are reassigned.

### `regular_Upgrade_OnHammered(inst, worker)`
*   **Description:** Custom hammer callback for upgraded chests. Checks for "overstacks" (items exceeding base stack limits) and may collapse the chest or drop items instead of full destruction. Falls back to `onhammered` if no collapse conditions are met.
*   **Parameters:**
    *   `inst` (entity) - The chest being hammered.
    *   `worker` (entity) - The hammering actor (usually player).
*   **Returns:** Nothing.
*   **Error states:** If the chest is in an impassable location (e.g., sunken), drops items up to a threshold and destroys the chest directly.

### `regular_ConvertToCollapsed(inst, droploot, burnt)`
*   **Description:** Converts a chest into a `collapsed_treasurechest`, dropping loot as needed and handling burnt state.
*   **Parameters:**
    *   `inst` (entity) - The current chest to collapse.
    *   `droploot` (boolean) - Whether to drop loot (including FX for collapse).
    *   `burnt` (boolean) - If true, applies burnt loot modifiers and marks the new collapsed chest.
*   **Returns:** Nothing.
*   **Error states:** None documented.

### `regular_ShouldCollapse(inst)`
*   **Description:** Calculates whether a chest has excess item stacks that exceed `TUNING.COLLAPSED_CHEST_EXCESS_STACKS_THRESHOLD`. Used to trigger collapse behavior for upgraded chests.
*   **Parameters:**
    *   `inst` (entity) - The chest instance to evaluate.
*   **Returns:** `true` if the calculated overstacks exceed the threshold, otherwise `false`.
*   **Error states:** Returns `false` if no container or stackable components exist.

### `sunken_OnEquip(inst, owner)` and `sunken_OnUnequip(inst, owner)`
*   **Description:** Controls visual representation of the Sunken Chest when equipped as body armor. Sets or clears an override symbol (`swap_sunken_treasurechest`).
*   **Parameters:** `inst` (entity), `owner` (entity). Returns nothing.
*   **Error states:** None documented.

### `terrarium_GetStatus(inst)`
*   **Description:** Returns the status string for inspectable UI. May return `"SHIMMER"` (FX active), `"BURNT"` (burnt flag set), or `nil`.
*   **Parameters:** `inst` (entity). Returns a string or `nil`.
*   **Error states:** None documented.

### `sunken_GetStatus(inst)`
*   **Description:** Returns `"LOCKED"` if the chest is not `canbeopened` (e.g., underwater), otherwise `nil`.
*   **Parameters:** `inst` (entity). Returns a string or `nil`.
*   **Error states:** None documented.

## Events & listeners
- **Listens to:** `onbuilt` (plays build animation/sound), `onhammered` (custom hammer logic per variant), `onhit` (hit animation), `ondeconstructstructure` (deconstruction logic), `restoredfromcollapsed` (revive from collapse), `onburnt` (burnt loot behavior), `resetruins` (Pandora/Minotaur reset), `ms_riftaddedtopool` (Pandora mimic transformation), `on_submerge` (Sunken Chest close on submerge), `onopen`, `onclose` (UI/sound coordination).
- **Pushes:** None directly; relies on components (`container`, `lootdropper`, `workable`) to push events.