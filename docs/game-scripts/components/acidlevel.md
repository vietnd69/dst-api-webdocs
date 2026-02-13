---
id: acidlevel
title: Acidlevel
description: Tracks an entity's acid exposure level and applies acid rain damage, rot, and sizzling effects to the entity and its items.
sidebar_position: 1

last_updated: 2026-02-13
build_version: 712555
change_status: stable
category_type: component
system_scope: entity
---

# acidlevel

## Overview
The `acidlevel` component is responsible for managing an entity's interaction with acid rain and regular rain effects in Don't Starve Together. It tracks an internal "acid level" and applies various environmental effects such as damage to health and equipped items (armor, fueled items), and rot to perishable inventory items when the entity is exposed to acid rain. It also manages visual "sizzling" effects for affected items and players. The component provides extensive hooks for mods to customize or override its default behavior related to acid rain damage and effects. It listens to world state changes for `isacidraining` and `israining` to start or stop its periodic effect application.

## Dependencies & Tags
This component relies on or interacts with the following other components and tags:

*   **Components:**
    *   `health`: To apply damage to the entity.
    *   `armor`: To apply damage to equipped armor.
    *   `fueled`: To reduce fuel of equipped fueled items (specifically `FUELTYPE.USAGE`).
    *   `perishable`: To accelerate rot on inventory items.
    *   `inventory`: To iterate through equipped and inventory items for effects.
    *   `inventoryitem`: To manage the `isacidsizzling` state for items.
    *   `waterproofer`: To calculate and apply damage absorption from equipped waterproof items.
    *   `moisture`: To determine rain rate for some effects.
    *   `rainimmunity`: To check if an entity is immune to rain/acid rain effects.
    *   `player_classified`: (For players) To set the `isacidsizzling` state remotely.
*   **Tags:**
    *   `acidrainimmune`: Entities or items with this tag are immune to acid rain effects.

## Properties
| Property                     | Type       | Default Value | Description                                                                                                                                                             |
| :--------------------------- | :--------- | :------------ | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `inst`                       | `Entity`   | (assigned)    | A reference to the entity that owns this component.                                                                                                                     |
| `max`                        | `number`   | `100`         | The maximum value for the internal acid level.                                                                                                                          |
| `current`                    | `number`   | `0`           | The current value of the internal acid level.                                                                                                                           |
| `DoAcidRainDamageOnEquipped` | `function` | (assigned)    | A reference to the `DoAcidRainDamageOnEquipped` function, which applies damage to equipped armor/fueled items. Can be overridden by mods.                               |
| `DoAcidRainRotOnAllItems`    | `function` | (assigned)    | A reference to the `DoAcidRainRotOnAllItems` function, which applies rot to perishable items. Can be overridden by mods.                                                |
| `DoAcidRainDamageOnHealth`   | `function` | (assigned)    | A reference to the `DoAcidRainDamageOnHealth` function, which applies damage to the entity's health. Can be overridden by mods.                                           |
| `ignoreacidrainticks`        | `boolean`  | `nil`         | If `true`, the component will not apply periodic acid rain effects, even if acid raining. Controlled by `SetIgnoreAcidRainTicks`.                                     |
| `overrideacidraintick`       | `function` | `nil`         | A moddable callback function that, if set, will be called during `DoAcidRainTick` to potentially modify or skip the default damage application.                        |
| `onstartisacidrainingfn`     | `function` | `nil`         | A moddable callback function invoked when the entity starts being affected by acid rain (e.g., `isacidraining` becomes true).                                            |
| `onstopisacidrainingfn`      | `function` | `nil`         | A moddable callback function invoked when the entity stops being affected by acid rain.                                                                                 |
| `onstartisrainingfn`         | `function` | `nil`         | A moddable callback function invoked when the entity starts being affected by regular rain (e.g., `israining` becomes true).                                              |
| `onstopisrainingfn`          | `function` | `nil`         | A moddable callback function invoked when the entity stops being affected by regular rain.                                                                              |
| `inst.acidlevel_acid_task`   | `task`     | `nil`         | The periodic task handle for `DoAcidRainTick` when acid rain is active. Stored directly on the instance.                                                                |
| `inst.acidlevel_rain_task`   | `task`     | `nil`         | The periodic task handle for `DoRainTick` when regular rain is active. Stored directly on the instance.                                                                 |

## Main Functions

### `StopSizzle(item)`
*   **Description:** Cancels any ongoing sizzling timer for an item, clears its `_acidsizzlingtimer` property, removes the "onputininventory" callback, and sets `item.components.inventoryitem.isacidsizzling` to `false`.
*   **Parameters:**
    *   `item`: (`Entity`) The item entity to stop sizzling.

### `MakeSizzle(item)`
*   **Description:** Initiates a sizzling effect for an item. Sets `item.components.inventoryitem.isacidsizzling` to `true`, listens for the "onputininventory" event to stop sizzling if moved, and schedules a delayed task to stop sizzling after a short duration.
*   **Parameters:**
    *   `item`: (`Entity`) The item entity to make sizzle.

### `StopSizzlePlayer(player)`
*   **Description:** Clears the player's internal sizzling timer and sets the `isacidsizzling` flag on the player's classified data to `false`, effectively stopping the visual/networked sizzling effect for the player.
*   **Parameters:**
    *   `player`: (`Entity`) The player entity to stop sizzling.

### `MakeSizzlePlayer(player)`
*   **Description:** Initiates a sizzling effect for a player. Sets the `isacidsizzling` flag on the player's classified data to `true` and schedules a delayed task to stop sizzling after a short duration.
*   **Parameters:**
    *   `player`: (`Entity`) The player entity to make sizzle.

### `DoAcidRainDamageOnEquipped(item, damage)`
*   **Description:** Applies acid rain damage to an equipped item's armor component or reduces fuel for fueled items of `FUELTYPE.USAGE`. Triggers `MakeSizzle` if damage is applied. This function is exposed as `self.DoAcidRainDamageOnEquipped` and can be overridden by mods.
*   **Parameters:**
    *   `item`: (`Entity`) The equipped item to affect.
    *   `damage`: (`number`) The amount of damage to apply.

### `DoAcidRainRotOnAllItems(item, percent)`
*   **Description:** Applies a percentage reduction to the item's perishable component, effectively accelerating rot. Triggers `MakeSizzle` if rot is applied. This function is exposed as `self.DoAcidRainRotOnAllItems` and can be overridden by mods.
*   **Parameters:**
    *   `item`: (`Entity`) The item to affect.
    *   `percent`: (`number`) The percentage by which to reduce perishability.

### `DoAcidRainDamageOnHealth(inst, damage)`
*   **Description:** Applies damage to the entity's health component. If the entity is a player and takes damage, `MakeSizzlePlayer` is triggered. This function is exposed as `self.DoAcidRainDamageOnHealth` and can be overridden by mods.
*   **Parameters:**
    *   `inst`: (`Entity`) The entity whose health to affect.
    *   `damage`: (`number`) The amount of damage to apply.

### `AcidLevel:SetIgnoreAcidRainTicks(ignoreacidrainticks)`
*   **Description:** Sets whether the component should ignore periodic acid rain effects. If the acid rain task is currently active, it will call `onstopisacidrainingfn` or `onstartisacidrainingfn` callbacks depending on the change.
*   **Parameters:**
    *   `ignoreacidrainticks`: (`boolean`) `true` to ignore acid rain effects, `false` to allow them.

### `DoAcidRainTick(inst, self)`
*   **Description:** A private helper function called periodically when `TheWorld.state.isacidraining` is `true`. It calculates acid rain damage, applies it to equipped waterproofers, inventory items (rot), and the entity's health. It also calls the `overrideacidraintick` function if set. This function is the core logic for applying acid rain effects.
*   **Parameters:**
    *   `inst`: (`Entity`) The entity instance (context for `DoPeriodicTask`).
    *   `self`: (`AcidLevel`) The `acidlevel` component instance.

### `DoRainTick(inst, self)`
*   **Description:** A private helper function called periodically when `TheWorld.state.israining` is `true`. It reduces the entity's `current` acid level based on the rain rate, simulating washing off acid.
*   **Parameters:**
    *   `inst`: (`Entity`) The entity instance (context for `DoPeriodicTask`).
    *   `self`: (`AcidLevel`) The `acidlevel` component instance.

### `AcidLevel:SetOverrideAcidRainTickFn(fn)`
*   **Description:** Sets a callback function that will be executed during the `DoAcidRainTick` cycle, allowing mods to customize or override the default acid rain damage application. The callback receives the entity and the calculated damage, and can return a new damage value or `0` to prevent default damage.
*   **Parameters:**
    *   `fn`: (`function` or `nil`) The function to call, or `nil` to remove the override. Signature: `fn(inst, damage) -> number`.

### `AcidLevel:GetOverrideAcidRainTickFn()`
*   **Description:** Returns the currently set override function for acid rain ticks.
*   **Parameters:** None.

### `AcidLevel:OnIsAcidRaining(isacidraining)`
*   **Description:** Callback function triggered when the world state `isacidraining` changes. If acid raining starts, it initiates the periodic `DoAcidRainTick` task; if it stops, it cancels the task. It also invokes `onstartisacidrainingfn` or `onstopisacidrainingfn` if they are set.
*   **Parameters:**
    *   `isacidraining`: (`boolean`) `true` if acid raining, `false` otherwise.

### `AcidLevel:OnIsRaining(israining)`
*   **Description:** Callback function triggered when the world state `israining` changes. If raining starts, it initiates the periodic `DoRainTick` task; if it stops, it cancels the task. It also invokes `onstartisrainingfn` or `onstopisrainingfn` if they are set.
*   **Parameters:**
    *   `israining`: (`boolean`) `true` if raining, `false` otherwise.

### `AcidLevel:SetOnStartIsAcidRainingFn(fn)`
*   **Description:** Sets a callback function to be invoked when `isacidraining` becomes `true` for the entity.
*   **Parameters:**
    *   `fn`: (`function` or `nil`) The function to call. Signature: `fn(inst)`.

### `AcidLevel:SetOnStopIsAcidRainingFn(fn)`
*   **Description:** Sets a callback function to be invoked when `isacidraining` becomes `false` for the entity.
*   **Parameters:**
    *   `fn`: (`function` or `nil`) The function to call. Signature: `fn(inst)`.

### `AcidLevel:SetOnStartIsRainingFn(fn)`
*   **Description:** Sets a callback function to be invoked when `israining` becomes `true` for the entity.
*   **Parameters:**
    *   `fn`: (`function` or `nil`) The function to call. Signature: `fn(inst)`.

### `AcidLevel:SetOnStopIsRainingFn(fn)`
*   **Description:** Sets a callback function to be invoked when `israining` becomes `false` for the entity.
*   **Parameters:**
    *   `fn`: (`function` or `nil`) The function to call. Signature: `fn(inst)`.

### `AcidLevel:DoDelta(delta)`
*   **Description:** Modifies the `current` acid level by `delta`, clamping it between `0` and `max`. Pushes an "acidleveldelta" event with the old and new percentage values.
*   **Parameters:**
    *   `delta`: (`number`) The amount to add to `current`.

### `AcidLevel:GetPercent()`
*   **Description:** Returns the current acid level as a percentage of the maximum.
*   **Parameters:** None.

### `AcidLevel:SetPercent(percent)`
*   **Description:** Sets the `current` acid level to a specific percentage of the maximum.
*   **Parameters:**
    *   `percent`: (`number`) The target percentage (0.0 to 1.0).

### `AcidLevel:OnSave()`
*   **Description:** Returns the save data for the component, currently only the `current` acid level.
*   **Parameters:** None.

### `AcidLevel:OnLoad(data)`
*   **Description:** Loads the component's state from save data, specifically setting the `current` acid level if available.
*   **Parameters:**
    *   `data`: (`table`) The table containing saved component data.

### `AcidLevel:GetDebugString()`
*   **Description:** Returns a formatted string representing the current and maximum acid levels for debugging purposes.
*   **Parameters:** None.

## Events & Listeners

*   **Listens For (World State):**
    *   `"isacidraining"`: Triggers `self:OnIsAcidRaining()`.
    *   `"israining"`: Triggers `self:OnIsRaining()`.
*   **Listens For (Entity Event - Internal/Helper):**
    *   `"onputininventory"`: Listened to by `MakeSizzle` to stop an item's sizzling effect when moved.
*   **Pushes/Triggers:**
    *   `"acidleveldelta"`: Triggered by `self:DoDelta()` when the acid level changes, containing `oldpercent` and `newpercent`.