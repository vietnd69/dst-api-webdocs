---
id: wobybig
title: Wobybig
description: Manages the behavior, transformation, mounting, and skill-based mechanics of Woby, the large companion pet in DST.
tags: [pet, transformation, mount, hunger, skills]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 34c06ade
system_scope: entity
---

# Wobybig

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
The `wobybig.lua` file defines the `wobybig` prefab—a large companion pet that serves as a customizable mount and foraging assistant. It handles transformation into `wobysmall` when hunger drops critically, mounts/dismounts with rider synchronization, hunger-based movement speed adjustments, sprinting and dashing mechanics (with lunar/shadow alignment dependencies), skill-based upgrades via the player's skill tree, and a drying rack system for items. The component integrates with many systems: `follower`, `rideable`, `hunger`, `eater`, `locomotor`, `sleeper`, `container`, and `wobyrack`. It is designed to transform and reattach to a new `wobysmall` instance upon starvation or rider dismount while transformation is pending.

## Usage example
```lua
local woby = SpawnPrefab("wobybig")
woby.Transform:SetPosition(x, y, z)
woby:SetSkinBuild("woby_big_build")
woby:LinkToPlayer(player)
-- Later, if player activates skills:
-- woby.SetSprinting(woby, true, false)
-- woby.TriggerTransformation(woby)
```

## Dependencies & tags
**Components used:**  
`spawnfader`, `eater`, `inspectable`, `timer`, `follower`, `rideable`, `sleeper`, `hunger`, `locomotor`, `container`, `embarker`, `drownable`, `colourtweener`, `colouradder`, `wobyrack`

**Tags added:**  
`animal`, `largecreature`, `woby`, `handfed`, `fedbyall`, `dogrider_only`, `peacefulmount`, `companion`, `NOBLOCK`, `_hunger` (internal optimization tag)

**Tags checked/removed:**  
`NOCLICK` (added during transformation), `sleeping` (via leader), `cave` (via `TheWorld`)

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `_playerlink` | `Entity` or `nil` | `nil` | Reference to the linked player (owner). Set via `LinkToPlayer()`. |
| `_isincave` | `boolean` | `nil` (set once on master only) | `true` if the current world has the `"cave"` tag. Cached because it cannot change. |
| `_canbelunarpowered` | `boolean` | `nil` | Whether this entity should respond to lunar power states. |
| `_issprinting` | `boolean` | `false` | Whether currently sprinting. |
| `_isturbo` | `boolean` | `false` | Whether currently using turbo sprint (requires `walter_woby_sprint_turbo` skill). |
| `alignment` | `"lunar"` / `"shadow"` / `nil` | `nil` | Current alignment build based on player skill activation. |
| `_hassmallbuild` | `boolean` | `nil` | Internal flag indicating if small build override is applied (used during transform state). |
| `pet_hunger_classified` | `Prefab` or `nil` | `nil` | UI classified component for hunger status display. |
| `woby_commands_classified` | `Prefab` or `nil` | `nil` | UI classified component for command and lock state. |
| `_forager_targets` | `table` | `{}` | List of queued foraging targets. Max `5`. |
| `_forager_timeout_tasks` | `table` | `{}` | Tasks mapping targets to their timeout cancelers. |

## Main functions
### `LinkToPlayer(inst, player, containerrestrictedoverride)`
* **Description:** Links the Woby instance to a specific player (owner), sets up leader/follower, attaches classifieds (`pet_hunger_classified`, `woby_commands_classified`), configures container restrictions, and subscribes to skill activation/deactivation events. Must be called only on master simulation.
* **Parameters:**  
  - `player` (`Entity`): The player to link to.  
  - `containerrestrictedoverride` (`boolean` or `nil`): Optional override for container restriction (if `nil`, uses `woby_commands_classified:ShouldLockBag()`).
* **Returns:** Nothing.
* **Error states:** Asserts that classifieds are correctly attached if they already exist.

### `SetSprinting(inst, issprinting, isturbo)`
* **Description:** Enables or disables sprinting. Updates hunger burn rate modifiers and run speed. Supports normal sprint and turbo sprint. Must be called on master simulation.
* **Parameters:**  
  - `issprinting` (`boolean`): Enable or disable sprinting.  
  - `isturbo` (`boolean`, optional): If `true` and `issprinting` is true, sets turbo sprint mode (requires skill).
* **Returns:** Nothing.
* **Error states:** If `isturbo` is `true` but skill not active, turbo behavior may be incorrect.

### `TriggerTransformation(inst)`
* **Description:** Initiates transformation from `wobybig` to `wobysmall`. Cancels riding, closes containers, and pushes a `"transform"` event (if not being ridden), or waits for dismount if ridden. Must be called on master simulation.
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** Early returns if already transforming or in `"transform"` state.

### `FinishTransformation(inst)`
* **Description:** Performs the full transformation logic: transfers items, hunger percentage, classifieds, and spawns a new `wobysmall` prefab, then removes `wobybig`. Must be called on master simulation.
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** None noted; assumes valid `inst` state.

### `EnableRack(inst, enable, showanim)`
* **Description:** Adds/activates or removes/destroys the `wobyrack` component and associated visual FX (`rackfx1`, `rackfx2`). Handles mounting/dismounting and rack FX parenting.
* **Parameters:**  
  - `enable` (`boolean`): `true` to enable rack, `false` to disable.  
  - `showanim` (`boolean`, optional): If `true`, triggers `"showrack"` or `"woby_showrack"` SG event on self or rider.
* **Returns:** Nothing.

### `SetAlignmentBuild(inst, alignment, showfx)`
* **Description:** Updates Woby’s alignment (e.g., `"lunar"`, `"shadow"`) and triggers a re-skin and visual FX. Must be called on master simulation.
* **Parameters:**  
  - `alignment` (`string` or `nil`): Target alignment (`"lunar"`, `"shadow"`, or `nil`).  
  - `showfx` (`boolean`): If `true`, plays alignment change FX and sends `"showalignmentchange"` event.
* **Returns:** Nothing.

### `QueueForagerTarget(inst, target)`
* **Description:** Adds a target to the foraging queue (max 5) and starts a timeout task. Targets older than `FORAGE_TARGET_TIMEOUT` (15 seconds) are dropped. Must be called on master simulation.
* **Parameters:**  
  - `target` (`Entity`): The targetable food source (`Pickable`).
* **Returns:** Nothing.

### `GetForagerTarget(inst)`
* **Description:** Returns the first valid foraging target in queue that is within `FORAGER_MAX_DISTANCE` (from player). Removes and drops out-of-range targets.
* **Parameters:** None.
* **Returns:** `Entity` or `nil`: The first in-range target, or `nil` if none.

### `UpdateOwnerNewStateListener(inst, player)`
* **Description:** Subscribes or unsubscribes to player `"newstate"` events based on skill activation (`walter_woby_foraging`) and riding state. Must be called on master simulation.
* **Parameters:**  
  - `player` (`Entity` or `nil`): The owner player.
* **Returns:** Nothing.

### `IsLunarPowered(inst)`
* **Description:** Returns `true` if Woby is currently powered by lunar energy: either night is active in the world (and not new moon) or player is in Lunacy Mode (if in caves). Must be called on master simulation.
* **Parameters:** None.
* **Returns:** `boolean`.

### `HasEndurance(inst)`
* **Description:** Returns `true` if the linked player has activated the `"walter_woby_endurance"` skill.
* **Parameters:** None.
* **Returns:** `boolean`.

## Events & listeners
- **Listens to:**  
  - `"riderchanged"` → `OnRiderChanged`  
  - `"hungerdelta"` → `OnHungerDelta`  
  - `"ridersleep"` → `OnRiderSleep`  
  - `"ondash_woby"` → `OnDash`  
  - `"onactivateskill_server"` (on player) → `_onskillrefresh`  
  - `"ondeactivateskill_server"` (on player) → `_onskillrefresh`  
  - `"ms_skilltreeinitialized"` (on player) → `_onskilltreeinitialized`  
  - `"newstate"` (on player) → `_onplayernewstate`  
  - `"onremove"` (on player or target) → `_onlostplayerlink`, `_onforagertargetremoved`

- **Pushes:**  
  - `"transform"` (before transformation)  
  - `"showalignmentchange"` (during alignment change)  
  - `"showrack"` / `"woby_showrack"` (on self or rider SG)  
  - `"playernewstate"` (to observers)  
  - `"praisewoby"` (via `OnEat` or `_onsuccessfulpraisableaction`)  
  - `"refreshcrafting"` (on player, during container close)  
  - `"ondropped"` (on contained items)