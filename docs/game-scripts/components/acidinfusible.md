---
id: acidinfusible
title: Acidinfusible
description: Infuses entities with acid effects during acid rain, applying stat multipliers, visual FX, and custom callbacks based on rain immunity.
sidebar_position: 1

last_updated: 2026-02-13
build_version: 712555
change_status: stable
category_type: component
system_scope: entity
---

# acidinfusible

## Overview
The `acidinfusible` component manages an entity's interaction with acid rain. Its primary responsibility is to track whether the entity should be considered "acid infused" based on the world's `isacidraining` state and the entity's own `rainimmunity` status (if applicable). When an entity becomes infused, it applies configurable stat modifiers (damage, damage taken, speed) and spawns visual effects. Conversely, these effects and modifiers are removed when the entity becomes uninfused. It also provides callbacks for custom logic on state changes.

## Dependencies & Tags
This component relies on or interacts with the following:
*   **World State:** `TheWorld.state.isacidraining`
*   **Other Components:** `inst.components.combat`, `inst.components.locomotor`, `inst.components.rainimmunity` (checked for existence).
*   **Spawned Entity:** `"acidsmoke_fx"`
*   **Internal Modifiers:** Uses `SOURCE_LIST_KEY = "acidinfusion"` for stat modifier management.

## Properties
| Property | Type | Default Value | Description |
| :------- | :--- | :------------ | :---------- |
| `inst` | `Entity` | `n/a` | A reference to the entity this component is attached to. |
| `infused` | `boolean` | `false` | The current infusion state of the entity. `true` if infused, `false` otherwise. |
| `userainimmunity` | `boolean` | `true` | Determines whether the entity's `rainimmunity` component should prevent acid infusion. |
| `fxlevel` | `number` | `1` | The visual level for the spawned `acidsmoke_fx`. |
| `damagemult` | `number` | `nil` | A multiplier applied to the entity's outgoing damage when infused. |
| `damagetakenmult` | `number` | `nil` | A multiplier applied to the entity's incoming damage when infused. |
| `speedmult` | `number` | `nil` | A multiplier applied to the entity's movement speed when infused. |
| `on_infuse_fn` | `function` | `nil` | A callback function executed when the entity becomes infused. It receives `self.inst` as an argument. |
| `on_uninfuse_fn` | `function` | `nil` | A callback function executed when the entity becomes uninfused. It receives `self.inst` as an argument. |
| `_initialize_task` | `task` | `nil` | An internal reference to a one-shot task scheduled during initialization to handle initial state. |
| `_fx` | `Entity` | `nil` | An internal reference to the spawned "acidsmoke_fx" child entity. |

## Main Functions
### `AcidInfusible:OnRemoveFromEntity()`
*   **Description:** Cleans up all event listeners and scheduled tasks when the component is removed from its entity. This prevents memory leaks and ensures proper deinitialization.
*   **Parameters:** None.

### `AcidInfusible:SetDamageMultiplier(n)`
*   **Description:** Sets the multiplier for the entity's outgoing combat damage. If the entity is currently infused, the new multiplier is immediately applied or updated on the `combat` component.
*   **Parameters:**
    *   `n` (`number`, `nil` to clear): The desired damage multiplier.

### `AcidInfusible:SetDamageTakenMultiplier(n)`
*   **Description:** Sets the multiplier for the entity's incoming combat damage. If the entity is currently infused, the new multiplier is immediately applied or updated on the `combat` component.
*   **Parameters:**
    *   `n` (`number`, `nil` to clear): The desired damage taken multiplier.

### `AcidInfusible:SetSpeedMultiplier(n)`
*   **Description:** Sets the multiplier for the entity's movement speed. If the entity is currently infused, the new multiplier is immediately applied or updated on the `locomotor` component.
*   **Parameters:**
    *   `n` (`number`, `nil` to clear): The desired speed multiplier.

### `AcidInfusible:SetMultipliers(tuning)`
*   **Description:** A convenience function to set all three stat multipliers (damage, damage taken, and speed) simultaneously using a table. If no `tuning` table is provided, all multipliers are cleared.
*   **Parameters:**
    *   `tuning` (`table`, optional): A table containing number values for keys `DAMAGE`, `DAMAGE_TAKEN`, and `SPEED`.

### `AcidInfusible:SetOnInfuseFn(fn)`
*   **Description:** Assigns a custom callback function to be executed whenever the entity becomes acid infused.
*   **Parameters:**
    *   `fn` (`function`): The function to be called. It receives `self.inst` as its sole argument.

### `AcidInfusible:SetOnUninfuseFn(fn)`
*   **Description:** Assigns a custom callback function to be executed whenever the entity ceases to be acid infused.
*   **Parameters:**
    *   `fn` (`function`): The function to be called. It receives `self.inst` as its sole argument.

### `AcidInfusible:SetUseRainImmunity(userainimmunity)`
*   **Description:** Configures whether the presence of a `rainimmunity` component on the entity should prevent it from becoming acid infused. Changing this setting immediately re-evaluates the infusion state.
*   **Parameters:**
    *   `userainimmunity` (`boolean`): Set to `true` if rain immunity should prevent infusion, `false` otherwise.

### `AcidInfusible:SetFXLevel(level)`
*   **Description:** Sets the visual effect level for the `acidsmoke_fx`. If the effects are currently active, their level is updated immediately.
*   **Parameters:**
    *   `level` (`number`): The desired visual effect level.

### `AcidInfusible:IsInfused()`
*   **Description:** Returns the current acid infusion status of the entity.
*   **Parameters:** None.
*   **Returns:** `boolean` - `true` if the entity is currently infused, `false` otherwise.

### `AcidInfusible:OnInfuse()`
*   **Description:** Internally called when the entity transitions into an acid-infused state. This function applies all configured stat multipliers (`speedmult`, `damagemult`, `damagetakenmult`), spawns visual effects, and triggers the `on_infuse_fn` callback if set.
*   **Parameters:** None.

### `AcidInfusible:OnUninfuse()`
*   **Description:** Internally called when the entity transitions out of an acid-infused state. This function removes all applied stat multipliers, kills visual effects, and triggers the `on_uninfuse_fn` callback if set.
*   **Parameters:** None.

### `AcidInfusible:OnInfusedDirty(acidraining, hasrainimmunity)`
*   **Description:** The central logic function that determines the entity's acid infusion state. It calculates whether the entity *should* be infused based on the world's acid rain status and the entity's rain immunity (if `userainimmunity` is `true`). If the calculated state differs from the current `self.infused` state, it calls `OnInfuse()` or `OnUninfuse()` accordingly.
*   **Parameters:**
    *   `acidraining` (`boolean`): The current value of `TheWorld.state.isacidraining`.
    *   `hasrainimmunity` (`boolean`): `true` if the entity has a `rainimmunity` component, `false` otherwise.

### `AcidInfusible:SpawnFX()`
*   **Description:** Spawns an "acidsmoke_fx" child entity and sets its level according to `self.fxlevel`. Any previously spawned FX are killed before new ones are created.
*   **Parameters:** None.

### `AcidInfusible:KillFX()`
*   **Description:** Removes the currently active "acidsmoke_fx" child entity. If the FX entity is valid, its removal is scheduled to occur after its current animation sequence finishes.
*   **Parameters:** None.

### `AcidInfusible:GetDebugString()`
*   **Description:** Returns a string detailing the current infusion status, primarily for debugging purposes.
*   **Parameters:** None.
*   **Returns:** `string` - A string indicating the infusion state (e.g., "INFUSED: true").

## Events & Listeners
*   **World State Listener:** Listens to `TheWorld.state.isacidraining` using `self:WatchWorldState("isacidraining", on_is_acid_raining)` to update the infusion status when acid rain starts or stops.
*   **Entity Event Listener:** Listens for `gainrainimmunity` on `self.inst` to react when the entity gains rain immunity.
*   **Entity Event Listener:** Listens for `loserainimmunity` on `self.inst` to react when the entity loses rain immunity.