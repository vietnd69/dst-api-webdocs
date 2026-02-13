---
id: aoeweapon_base
title: Aoeweapon Base
description: Provides shared interaction logic for area-of-effect weapons, handling work actions, picking, combat hits, and physics-based tosses.
sidebar_position: 1

last_updated: 2026-02_13
build_version: 712555
change_status: stable
category_type: component
system_scope: entity
---

# aoeweapon_base

## Overview
The `aoeweapon_base` component serves as a versatile base for entities (typically weapons or tools) that need to interact with various types of targets in an Area-of-Effect (AOE) or general interaction manner. It centralizes logic for performing work actions (chopping, mining, hammering), picking items, and engaging in combat. It also provides customizable callbacks for pre-hit, hit, and miss events, and handles the physics-based tossing of entities.

## Dependencies & Tags
This component interacts with and expects the following components on other entities:
*   `target.components.workable`
*   `target.components.pickable`
*   `doer.components.combat`
*   `target.components.mine`
*   `target.components.inventoryitem`
*   `target.Physics` (Physics component)

**Tags Set/Used by this Component:**
*   **Initial `self.tags`**: `{"_combat", "pickable", "NPC_workable"}`
*   **`self.notags`**: `{"FX", "DECOR", "INLIMBO"}`
*   **Generated `self.combinedtags`**: This table dynamically combines `self.tags` with tags derived from `self.workactions` (e.g., `ACTIONS.CHOP` adds "CHOP_workable" to `combinedtags`).

## Properties
| Property         | Type                           | Default Value                       | Description                                                                                             |
| :--------------- | :----------------------------- | :---------------------------------- | :------------------------------------------------------------------------------------------------------ |
| `inst`           | `Entity`                       | The component's owning entity       | A reference to the entity this component is attached to.                                                |
| `damage`         | `number`                       | `10`                                | The base damage value inflicted when attacking a combat target.                                           |
| `onprehitfn`     | `function`                     | `nil`                               | A callback function executed before the main `OnHit` logic. Signature: `(weapon_inst, doer, target)`.   |
| `onhitfn`        | `function`                     | `nil`                               | A callback function executed after a successful interaction (work, pick, or combat hit) in `OnHit`. Signature: `(weapon_inst, doer, target)`. |
| `onmissfn`       | `function`                     | `nil`                               | A callback function executed if no successful interaction occurs during `OnHit`. Signature: `(weapon_inst, doer, target)`. |
| `canpick`        | `boolean`                      | `nil`                               | If `true`, the weapon can attempt to pick `pickable` targets via `OnHit`.                               |
| `stimuli`        | `string`                       | `nil`                               | An optional string representing a combat stimulus (e.g., "POISON") to be applied during attacks.        |
| `tags`           | `table` (of strings)           | `{"_combat", "pickable", "NPC_workable"}` | A list of general tags associated with the weapon's interaction capabilities, used in `_CombineTags`.   |
| `notags`         | `table` (of strings)           | `{"FX", "DECOR", "INLIMBO"}`        | A list of tags that targets *must not* possess for certain interactions to proceed.                       |
| `combinedtags`   | `table` (of strings)           | `nil` (dynamically generated)       | A unique, combined list of `tags` and dynamically generated tags based on `workactions` (e.g., "CHOP_workable"). |
| `workactions`    | `table` (indexed by `ACTIONS`) | `nil` (initially `ACTIONS.CHOP`, `ACTIONS.HAMMER`, `ACTIONS.MINE`, `ACTIONS.DIG`) | A lookup table (`[ACTION_CONSTANT] = true`) indicating which `ACTIONS` this weapon can perform on `workable` targets. |

## Main Functions
### `AOEWeapon_Base:SetDamage(dmg)`
*   **Description:** Sets the base damage value for this weapon.
*   **Parameters:** `dmg` (`number`) - The new damage value.

### `AOEWeapon_Base:SetStimuli(stimuli)`
*   **Description:** Sets the combat stimulus string to be applied by this weapon during attacks.
*   **Parameters:** `stimuli` (`string`) - The stimulus string (e.g., "POISON").

### `AOEWeapon_Base:SetWorkActions(...)`
*   **Description:** Configures the specific types of work actions (e.g., chopping, mining) this weapon can perform on `workable` targets. This method automatically updates the `combinedtags` property.
*   **Parameters:** `...` (`ACTIONS` constants) - One or more `ACTIONS` constants (e.g., `ACTIONS.CHOP`, `ACTIONS.HAMMER`).

### `AOEWeapon_Base:SetTags(...)`
*   **Description:** Sets a list of general tags associated with this weapon. These tags are incorporated into the `combinedtags` property.
*   **Parameters:** `...` (`string`) - One or more string tags.

### `AOEWeapon_Base:_CombineTags()`
*   **Description:** An internal helper function responsible for generating the `self.combinedtags` table. It collects unique tags from `self.tags` and dynamically generates tags based on `self.workactions` (e.g., `ACTIONS.CHOP` results in "CHOP_workable"). This combined list can be useful for target filtering and interaction logic.
*   **Parameters:** None.

### `AOEWeapon_Base:SetNoTags(...)`
*   **Description:** Sets a list of tags that targets *must not* possess for certain interactions to be considered valid (e.g., for picking).
*   **Parameters:** `...` (`string`) - One or more string tags.

### `AOEWeapon_Base:SetOnPreHitFn(fn)`
*   **Description:** Sets a callback function that will be executed *before* the main interaction logic in `AOEWeapon_Base:OnHit`.
*   **Parameters:** `fn` (`function`) - The function to call. It receives `(weapon_inst, doer, target)` as arguments.

### `AOEWeapon_Base:SetOnHitFn(fn)`
*   **Description:** Sets a callback function that will be executed *after* a successful interaction (working, picking, or combat hit) within `AOEWeapon_Base:OnHit`.
*   **Parameters:** `fn` (`function`) - The function to call. It receives `(weapon_inst, doer, target)` as arguments.

### `AOEWeapon_Base:SetOnMissFn(fn)`
*   **Description:** Sets a callback function that will be executed if `AOEWeapon_Base:OnHit` fails to perform any valid interaction.
*   **Parameters:** `fn` (`function`) - The function to call. It receives `(weapon_inst, doer, target)` as arguments.

### `AOEWeapon_Base:OnHit(doer, target)`
*   **Description:** This is the core interaction method. It attempts to interact with the `target` based on its components and tags, following a priority order: `workable` > `pickable` > `combat`.
    1.  If `self.onprehitfn` is set, it is called.
    2.  It checks if the `target` is `workable` and if this weapon has a matching `workaction` for it.
        *   Special handling for `NPC_workable` (e.g., campfires).
        *   For `ACTIONS.DIG`, it ensures the target is not a spawner.
        *   If workable, `target.components.workable:Destroy(doer)` is called. If the target remains valid and gains the "stump" tag (e.g., after chopping a tree), it is immediately removed.
    3.  If not workable, it then checks if `self.canpick` is `true`, and if the `target` is `pickable` and not `intense`. If so, `target.components.pickable:Pick(self.inst)` is called.
    4.  If neither workable nor pickable, it checks if `doer.components.combat` can target the `target` and if they are not allies. If so, `doer.components.combat:DoAttack(target, nil, nil, self.stimuli)` is performed.
    5.  Finally, if any interaction was successful, `self.onhitfn` is called; otherwise, `self.onmissfn` is called.
*   **Parameters:**
    *   `doer` (`Entity`) - The entity performing the action (e.g., the player wielding the weapon).
    *   `target` (`Entity`) - The entity being interacted with.

### `AOEWeapon_Base:OnToss(doer, target, sourceposition, basespeed, startradius)`
*   **Description:** Simulates the physical tossing of the `target` entity from the `doer`. It deactivates `mine` components on the target if present, ensures the target has active `Physics`, and calculates a trajectory. It includes logic to prevent tossing objects out of the world boundaries by adjusting the initial angle.
*   **Parameters:**
    *   `doer` (`Entity`) - The entity initiating the toss.
    *   `target` (`Entity`) - The entity to be tossed.
    *   `sourceposition` (`Vector3`, optional) - The explicit starting position for the toss. If `nil`, the `doer`'s world position is used.
    *   `basespeed` (`number`, optional) - The base linear speed applied during the toss. Defaults to `1`.
    *   `startradius` (`number`, optional) - The initial distance from the `sourceposition` at which to place the `target` before applying velocity. Defaults to `0`, but is set to at least the combined physics radii of `doer` and `target` to prevent clipping.

## Events & Listeners
None identified.