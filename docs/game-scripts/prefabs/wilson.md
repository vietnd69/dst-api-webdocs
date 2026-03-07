---
id: wilson
title: Wilson
description: Wilson is the default scientist character prefab that manages his beard growth progression, inventory interactions, and specialized torch-tossing mechanics.
tags: [player, beard, combat, inventory]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 9e922222
system_scope: player
---

# Wilson

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
Wilson is the canonical scientist character prefab constructed via `MakePlayerCharacter`. It implements beard progression mechanics (short → medium → long) triggered on specific in-game days, and enables a special torch-toss action when the corresponding skill is activated. The prefab integrates with the `beard`, `reticule`, `foodaffinity`, `inventory`, `playeractionpicker`, and `skilltreeupdater` components to manage appearance, combat actions, and inventory behavior.

## Usage example
```lua
-- Wilson is typically instantiated by the game engine as the default character.
-- For modding reference, here's how the beard callbacks are registered:
inst.components.beard:AddCallback(4, OnGrowShortBeard)
inst.components.beard:AddCallback(8, OnGrowMediumBeard)
inst.components.beard:AddCallback(16, OnGrowLongBeard)

-- The special torch toss is enabled via the playeractionpicker:
inst.components.playeractionpicker.pointspecialactionsfn = GetPointSpecialActions
```

## Dependencies & tags
**Components used:** `beard`, `reticule`, `foodaffinity`, `inventory`, `playeractionpicker`, `skilltreeupdater`, `container`
**Tags:** Adds `bearded`, `scientist`; conditionally adds `quagmire_foodie`, `quagmire_potmaster`, `quagmire_shopper` in Quagmire mode.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `customidleanim` | string | `"idle_wilson"` | Override for the default idle animation, updated during beard growth stages. |
| `EmptyBeard` | function | `EmptyBeard(inst)` | Public method to drop all items from the equipped beard sack on the ground. |

## Main functions
### `GetPointSpecialActions(inst, pos, useitem, right)`
* **Description:** Determines available special actions (e.g., `ACTIONS.TOSS`) for Wilson when holding a torch and having the skill `wilson_torch_7` activated. Used by `playeractionpicker` to populate the context menu.
* **Parameters:**  
  - `inst` (Entity) — Wilson’s entity instance.  
  - `pos` (Vector3) — Target position.  
  - `useitem` (Entity or `nil`) — Currently equipped item; if `nil`, defaults to the item in `EQUIPSLOTS.HANDS`.  
  - `right` (boolean) — Indicates a right-click or equivalent input.
* **Returns:** Table `{ ACTIONS.TOSS }` if conditions are met; otherwise `{}`.
* **Error states:** No errors; returns empty table if `right` is `false`, `useitem` is not a tossable torch, or the skill is not activated.

### `ReticuleTargetFn()`
* **Description:** Computes a valid ground target position for Wilson’s torch toss, scanning outward up to range `8` to find a passable, unblocked spot.
* **Parameters:** None.
* **Returns:** `Vector3` — Target position on the ground; defaults to player’s current position if no valid spot is found.

### `OnSetOwner(inst)`
* **Description:** Called when the entity’s owner changes (e.g., network owner assignment). Assigns `GetPointSpecialActions` as the special actions callback for `playeractionpicker`.
* **Parameters:** `inst` (Entity) — The entity whose owner has been set.
* **Returns:** Nothing.

### `common_postinit(inst)`
* **Description:** Initializes shared logic for both server and client. Sets up reticule behavior and tags for specific game modes.
* **Parameters:** `inst` (Entity) — Wilson’s entity instance.
* **Returns:** Nothing.

### `master_postinit(inst)`
* **Description:** Server-only initialization logic. Configures starting inventory, beard growth callbacks, and food affinity. Registers death/shave listeners.
* **Parameters:** `inst` (Entity) — Wilson’s entity instance.
* **Returns:** Nothing.

### `OnGrowShortBeard(inst, skinname)`, `OnGrowMediumBeard(inst, skinname)`, `OnGrowLongBeard(inst, skinname)`
* **Description:** Callbacks triggered by the `beard` component when beard length thresholds are reached. Updates animation symbols, beard bits value, and idle animation.
* **Parameters:**  
  - `inst` (Entity) — Wilson’s entity instance.  
  - `skinname` (string or `nil`) — Optional character skin name.
* **Returns:** Nothing.

### `OnResetBeard(inst)`
* **Description:** Resets beard animation override on respawn or reset.
* **Parameters:** `inst` (Entity).
* **Returns:** Nothing.

### `OnShaved(inst)`
* **Description:** Resets idle animation to non-bearded state when Wilson is shaved.
* **Parameters:** `inst` (Entity).
* **Returns:** Nothing.

### `EmptyBeard(inst)`
* **Description:** Drops all items from the equipped beard sack container onto the ground and removes the sack entity.
* **Parameters:** `inst` (Entity).
* **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  - `setowner` — Triggers `OnSetOwner`.  
  - `death` — Triggers `EmptyBeard`.  
  - `shaved` — Triggers `OnShaved`.
- **Pushes:** None.