---
id: wilson
title: Wilson
description: Defines Wilson’s default player character, including beard mechanics, special actions, reticule behavior, and game-mode-specific tags.
tags: [player, character, beard, events, inventory]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 9e922222
system_scope: player
---

# Wilson

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
Wilson is the base player character prefab, implemented via `MakePlayerCharacter` and extended with domain-specific behavior for beard progression, special torch toss actions, reticule targeting, and game-mode tagging. It integrates heavily with the `beard`, `inventory`, `foodaffinity`, `reticule`, and `playeractionpicker` components to deliver core gameplay identity.

## Usage example
```lua
local wilson = MakePlayerCharacter("wilson", prefabs, assets, common_postinit, master_postinit)
-- Wilson is automatically instantiated by the game for new players using default settings.
-- Modders typically extend or override via post-init hooks rather than direct instantiation.
```

## Dependencies & tags
**Components used:** `beard`, `inventory`, `foodaffinity`, `reticule`, `playeractionpicker`, `skilltreeupdater`, `container`, `playercommon`
**Tags:** Adds `bearded`, `scientist`, and conditionally `quagmire_foodie`, `quagmire_potmaster`, `quagmire_shopper` (Quagmire mode only).

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `start_inv` | table | Dynamic (TUNING.GAMEMODE_STARTING_ITEMS) | Starting inventory items keyed by game mode. |
| `BEARD_DAYS` | table | `{4, 8, 16}` | Beard growth thresholds (in days). |
| `BEARD_BITS` | table | `TUNING.WILSON_BEARD_BITS` | Bitmask values assigned to beard levels 1–3. |
| `customidleanim` | string | `"idle_wilson"` or `"idle_wilson_beard"` | Active idle animation name (changed by beard state). |
| `EmptyBeard` | function | Defined locally | Event callback to clear and remove beard sack on death. |

## Main functions
### `GetPointSpecialActions(inst, pos, useitem, right)`
*   **Description:** Determines special actions available at the reticule target point (e.g., Toss for特长 torch when skill activated). Used by `playeractionpicker`.
*   **Parameters:**  
  - `inst` (Entity) – The player entity.  
  - `pos` (Vector) – Target position (unused, for signature compatibility).  
  - `useitem` (Entity or `nil`) – Currently equipped hands item (if `nil`, inventory is queried).  
  - `right` (boolean) – Whether this is the right-hand control (e.g., mouse right-click).  
*   **Returns:** `{ACTIONS.TOSS}` if all conditions match (torch, skill `wilson_torch_7` active, tag `special_action_toss`), otherwise `{}`.

### `ReticuleTargetFn()`
*   **Description:** Computes the ground target point for reticule interactions, using a radial search to find the first passable and unblocked point out to 8 units.
*   **Parameters:** None.
*   **Returns:** `Vector3` – World position of the reticule target. Falls back to player’s world position if no valid point found.

### `OnSetOwner(inst)`
*   **Description:** Attaches the `GetPointSpecialActions` handler to `playeractionpicker.pointspecialactionsfn` when the entity gains a network owner.
*   **Parameters:** `inst` (Entity) – The player instance.
*   **Returns:** Nothing.

### `OnResetBeard(inst)`
*   **Description:** Clears beard animation override on entity reset.
*   **Parameters:** `inst` (Entity).
*   **Returns:** Nothing.

### `OnGrowShortBeard(inst, skinname)`
*   **Description:** Applies short beard visual override, sets beard bitmask, and updates idle animation.
*   **Parameters:**  
  - `inst` (Entity).  
  - `skinname` (string or `nil`) – Optional skin override identifier.  
*   **Returns:** Nothing.

### `OnGrowMediumBeard(inst, skinname)`
*   **Description:** Applies medium beard visual override, sets beard bitmask, and updates idle animation.
*   **Parameters:** Same as `OnGrowShortBeard`.
*   **Returns:** Nothing.

### `OnGrowLongBeard(inst, skinname)`
*   **Description:** Applies long beard visual override, sets beard bitmask, and updates idle animation.
*   **Parameters:** Same as `OnGrowShortBeard`.
*   **Returns:** Nothing.

### `EmptyBeard(inst)`
*   **Description:** Drops all items from the equipped beard sack (if any) and removes the sack entity.
*   **Parameters:** `inst` (Entity).
*   **Returns:** Nothing.

### `common_postinit(inst)`
*   **Description:** Applies common initialization steps: game-mode tags, beard tag (for optimization), reticule component configuration, and event listener registration.
*   **Parameters:** `inst` (Entity).
*   **Returns:** Nothing.

### `master_postinit(inst)`
*   **Description:** Performs server-side initialization: sets starting inventory, food affinity, beard component configuration (callbacks, prize, skinnability), death hook, and optional Lava Arena extension.
*   **Parameters:** `inst` (Entity).
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  - `setowner` – Triggers `OnSetOwner(inst)`.  
  - `death` – Triggers `EmptyBeard(inst)`.  
  - `shaved` – Triggers `OnShaved(inst)`.  
- **Pushes:** None (this file does not fire events; only listens for them).