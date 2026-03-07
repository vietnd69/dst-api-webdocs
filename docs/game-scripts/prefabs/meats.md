---
id: meats
title: Meats
description: Factory function for creating various meat-based food prefabs with standardized components and behaviors.
tags: [food, crafting, inventory, perishable]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: a90700e7
system_scope: inventory
---

# Meats

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
The `meats.lua` file defines factory functions that construct a wide variety of meat-related food prefabs in DST. These prefabs are used for raw meats, cooked meats, dried meats, and specialized variants (e.g., fish, monster, human, bat wings, barnacles). All prefabs share a common `common()` base function that sets up shared components and behaviors—including `edible`, `perishable`, `dryable`, `cookable`, `stackable`, `tradable`, and `floater`—and apply meat-specific tuning and logic (e.g., sanity and health penalties for raw meats, hauntable behavior, and game-mode-specific extensions like Quagmire). The module is organized to support reuse across many meat prefabs while allowing fine-grained control over properties per variant.

## Usage example
```lua
-- Example: Creating a raw meat prefab instance
local inst = CreateEntity()
-- In a real mod, this would typically use Prefab("meat", raw, ...) from the module
inst:AddComponent("edible")
inst.components.edible.foodtype = FOODTYPE.MEAT
inst.components.edible.ismeat = true
inst.components.edible.healthvalue = TUNING.HEALING_TINY
inst.components.edible.hungervalue = TUNING.CALORIES_MED
inst.components.edible.sanityvalue = -TUNING.SANITY_SMALL
inst:AddComponent("perishable")
inst.components.perishable:SetPerishTime(TUNING.PERISH_FAST)
inst.components.perishable:StartPerishing()
inst:AddComponent("cookable")
inst.components.cookable.product = "cookedmeat"
inst:AddComponent("dryable")
inst.components.dryable:SetProduct("meat_dried")
inst.components.dryable:SetDryTime(TUNING.DRY_MED)
inst:AddComponent("stackable")
inst:AddComponent("tradable")
inst.components.tradable.goldvalue = TUNING.GOLD_VALUES.MEAT
inst:AddComponent("floater")
inst.components.floater:SetVerticalOffset(0.05)
```

## Dependencies & tags
**Components used:** `edible`, `bait`, `inspectable`, `inventoryitem`, `stackable`, `tradable`, `perishable`, `dryable`, `cookable`, `floater`, `hauntable`, `selfstacker`, `snowmandecor`  
**Tags added by `common()`:** `meat`, `dryable`, `cookable`, `lureplant_bait`, and optionally: `rawmeat`, `catfood`, `selfstacker`, `monstermeat`, `drumstick`, `fishmeat`, `batwing`, `barnacle`, `quickeat`  
**Tags added by specific variants:** none beyond the base `common()` logic.

## Properties
No public properties are exposed directly by this module itself. The returned `Prefab` constructors are stateless. All relevant data (e.g., tuning values, product prefabs, build names) are passed as arguments to factory functions (e.g., `raw()`, `cooked()`) or derived internally.

## Main functions
### `common(bank, build, anim, tags, dryable, cookable)`
*   **Description:** Base constructor function that initializes the base entity with shared behavior for all meat prefabs. It sets up transforms, animations, inventory physics, floating behavior, and core components (`edible`, `perishable`, `stackable`, `tradable`, `floater`, `hauntable`, and optional `dryable`, `cookable`). It is called by all meat-specific functions and is the only function exposed as a reusable building block.
*   **Parameters:**
    *   `bank` (string) - Animation bank name.
    *   `build` (string) - Build name for the animstate.
    *   `anim` (string) - Initial animation to play.
    *   `tags` (array or nil) - Additional tags to add to the entity.
    *   `dryable` (table or nil) - If non-nil, enables `dryable` component; expects `product` and `time` keys (and optionally `build`, `dried_build`).
    *   `cookable` (table or nil) - If non-nil, enables `cookable` component; expects `product` key.
*   **Returns:** Entity instance with all shared components added.
*   **Error states:** If `TheWorld.ismastersim` is `false`, returns the partially initialized client-side entity early.

### `raw()`
*   **Description:** Creates the standard raw meat prefab.
*   **Parameters:** None (calls `common()` internally).
*   **Returns:** Entity instance configured with raw meat stats: low health gain, moderate hunger, slight sanity loss, fast perish, hauntable to spawn monster meat.
*   **Error states:** None.

### `cooked()`
*   **Description:** Creates the standard cooked meat prefab.
*   **Parameters:** None.
*   **Returns:** Entity instance with improved stats: medium health gain, moderate hunger, no sanity penalty, medium perish time, hauntable to spawn monster meat.
*   **Error states:** None.

### `driedmeat()`
*   **Description:** Creates the standard dried meat prefab.
*   **Parameters:** None.
*   **Returns:** Entity instance with high health and hunger, positive sanity, preserved perish time.
*   **Error states:** None.

### `smallmeat()`, `cookedsmallmeat()`, `driedsmallmeat()`
*   **Description:** Factory functions for smaller meat variants. Differ from standard meats in size (`stackable.maxsize = TUNING.STACK_SIZE_SMALLITEM`), scaling (via `floater`), and slightly lower values.
*   **Parameters:** None.
*   **Returns:** Entity instances with reduced stats compared to standard meat variants.
*   **Error states:** None.

### `monster()`, `cookedmonster()`, `driedmonster()`
*   **Description:** Factory functions for monster meat variants. They set `edible.secondaryfoodtype = FOODTYPE.MONSTER` and apply negative sanity and health values.
*   **Parameters:** None.
*   **Returns:** Entity instances configured for monster meat consumption effects.
*   **Error states:** None.

### `humanmeat()`, `humanmeat_cooked()`, `humanmeat_dried()`
*   **Description:** Factory functions for human meat variants. All variants set `tradable.goldvalue = 0` (non-tradeable) and apply strong negative sanity and reduced health.
*   **Parameters:** None.
*   **Returns:** Entity instances for human meat with consistent penalties.
*   **Error states:** None.

### `fishmeat_small()`, `fishmeat_small_cooked()`, `fishmeat_small_dried()`
*   **Description:** Factory functions for small fish meats. Feature very fast (`PERISH_SUPERFAST`) or fast perish (cooked/dried) times and often use `onperishreplacement = "spoiled_fish_small"`.
*   **Parameters:** None.
*   **Returns:** Entity instances tuned for aquatic food types.
*   **Error states:** None.

### `fishmeat()`, `fishmeat_cooked()`, `fishmeat_dried()`
*   **Description:** Factory functions for medium fish meats. Use standard perish rates and moderate food stats.
*   **Parameters:** None.
*   **Returns:** Entity instances for fish meat.
*   **Error states:** None.

### `drumstick()`, `drumstick_cooked()`
*   **Description:** Factory functions for drumstick meats. Feature unique animation banks and vertical offsets.
*   **Parameters:** None.
*   **Returns:** Entity instances for drumstick meats.
*   **Error states:** None.

### `batwing()`, `batwing_cooked()`
*   **Description:** Factory functions for bat wing meats. Add the `snowmandecor` component and set larger size and scale via `floater`.
*   **Parameters:** None.
*   **Returns:** Entity instances with specialized floater behavior.
*   **Error states:** None.

### `plantmeat()`, `plantmeat_cooked()`
*   **Description:** Factory functions for plant-based meats. Used primarily as bait or for specific recipes. No dryable component by default in the function call.
*   **Parameters:** None.
*   **Returns:** Entity instances with small stats and negative sanity.
*   **Error states:** None.

### `barnacle()`, `barnacle_cooked()`
*   **Description:** Factory functions for barnacle meats. Add `selfstacker` component and set `goldvalue = 0`.
*   **Parameters:** None.
*   **Returns:** Entity instances for barnacle-specific meat.
*   **Error states:** None.

### `batnose()`, `batnose_cooked()`
*   **Description:** Factory functions for batnose meats (used in cave biomes). Custom `floater` settings and dryable/cookable configuration.
*   **Parameters:** None.
*   **Returns:** Entity instances with batnose-specific stats.
*   **Error states:** None.

### `quagmire_smallmeat()`, `quagmire_cookedsmallmeat()`
*   **Description:** Factory functions for Quagmire game mode-specific meats. Defer Quagmire-specific tuning to `event_server_data("quagmire", "prefabs/meats")`.
*   **Parameters:** None.
*   **Returns:** Entity instances with deferred server-side initialization.
*   **Error states:** None.

## Events & listeners
- **Listens to:** `spawnedfromhaunt` (used to launch the new prefab when hauntable replacement occurs).
- **Pushes:** No events directly from this module. The component logic in `common()` sets up `hauntable` behavior, which fires `spawnedfromhaunt` and `despawnedfromhaunt` on the haunter/hunted entities.
- **Listener function:** `OnSpawnedFromHaunt(inst, data)` calls `Launch(inst, data.haunter, TUNING.LAUNCH_SPEED_SMALL)` on the newly spawned prefab.