---
id: monkey
title: Monkey
description: Manages the behavior, state, and lifecycle of the monkey entity, including transformations between normal and nightmare states based on world conditions and external triggers.
tags: [ai, combat, transformation, loot, timer]
sidebar_position: 10

last_updated: 2026-03-06
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 7e06b80e
system_scope: entity
---

# Monkey

> Based on game build **714014** | Last updated: 2026-03-06

## Overview
The `monkey` prefab implements the core behavior of the monkey NPC, including dynamic state transitions between normal and nightmare modes. It coordinates multiple components—such as `combat`, `inventory`, `eater`, `locomotor`, `periodicspawner`, `acidinfusible`, and `sleeper`—to define movement, attacks, loot generation, and transformation logic. Key triggers for transformation include world `nightmarephase`, presence in a `Nightmare`-tagged area, or explicit `ms_forcenightmarestate` events. It also handles loot generation, including conditional nightmare-specific drops, and supports multiplayer coordination via ECS event callbacks.

## Usage example
```lua
local inst = Prefab("monkey", fn)
inst:AddComponent("monkey") -- Not applicable: monkey is a prefab, not a standalone component.
-- Instead, use the prefab as a template:
return MakePrefab("monkey", {
    -- customize options if subclassing
})
```

## Dependencies & tags
**Components used:** `bloomer`, `combat`, `health`, `inventory`, `inspectable`, `thief`, `locomotor`, `lootdropper`, `eater`, `sleeper`, `areaaware`, `acidinfusible`, `knownlocations`, `timer`, `periodicspawner`, `hunger`, `health`, `companion`, `hauntable` (via `MakeHauntablePanic`), `locomotor`, `inventory`, `inventoryitem` (via weapon items), `equippable` (via weapon items), `weapon` (via weapon items), `transform`, `animstate`, `soundemitter`, `dynamicshadow`, `network`.

**Tags added:** `cavedweller`, `monkey`, `animal`, `nightmare`, `shadow_aligned`, `nosteal` (applied to temporary weapon items only).

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `curious` | boolean | `true` | Controls whether the monkey searches for players to follow. Set to `false` in nightmare state. |
| `harassplayer` | entity or `nil` | `nil` | Reference to the player being followed or harassed. Cleared on state change or after timeout. |
| `task` | task or `nil` | `nil` | Task used to forget combat target after ~60 seconds. |
| `FindTargetOfInterestTask` | periodic task | created on init | Repeated task (every 10s) to initiate player following logic. |
| `weaponitems` | table | `{}` | Stores `thrower` and `hitter` weapon entities. |
| `_onharassplayerremoved` | function | lambda | Cleanup callback invoked when the tracked player is removed. |

## Main functions
### `SetNormalMonkey(inst)`
* **Description:** Transitions the monkey to its normal, non-nightmare state: resets tags, appearance, brain, loot table, and multipliers.
* **Parameters:** `inst` (entity) — the monkey entity.
* **Returns:** Nothing.

### `SetNightmareMonkey(inst)`
* **Description:** Transitions the monkey to its nightmare state: adds `nightmare` and `shadow_aligned` tags, changes appearance and brain, disables curiosity, and adjusts acid infusible multipliers.
* **Parameters:** `inst` (entity) — the monkey entity.
* **Returns:** Nothing.

### `SetNightmareMonkeyLoot(inst, forced)`
* **Description:** Configures loot based on whether the nightmare state was forced (e.g., by `shadow_trap`) or natural (e.g., world phase/area).
* **Parameters:** `inst` (entity) — the monkey entity; `forced` (boolean) — if `true`, uses `FORCED_NIGHTMARE_LOOT`; otherwise, falls back to shared `monkey` loot table.
* **Returns:** Nothing.

### `OnForceNightmareState(inst, data)`
* **Description:** Handles explicit request to enter nightmare state (via `ms_forcenightmarestate` event), including timer setup, visual FX, and loot update.
* **Parameters:** `inst` (entity) — the monkey entity; `data` (table or `nil`) — contains `duration` (number, seconds) for forced state.
* **Returns:** Nothing.
* **Error states:** Returns early if the monkey is dead or already in a longer-lasting forced nightmare state.

### `TestNightmarePhase(inst, phase)`
* **Description:** Evaluates world `nightmarephase` and area tags to determine if the monkey should enter/exit nightmare state.
* **Parameters:** `inst` (entity) — the monkey entity; `phase` (string) — current nightmare phase (`"wild"`, `"dawn"`, or `"rest"`).
* **Returns:** Nothing.

### `TestNightmareArea(inst)`
* **Description:** Convenience wrapper calling `TestNightmarePhase` with current world phase.
* **Parameters:** `inst` (entity) — the monkey entity.
* **Returns:** Nothing.

### `EquipWeapons(inst)`
* **Description:** Creates and equips temporary ranged (`monkeyprojectile`) and melee (`0` range) weapon items for the monkey.
* **Parameters:** `inst` (entity) — the monkey entity.
* **Returns:** Nothing.

### `FindTargetOfInterest(inst)`
* **Description:** Periodically scans nearby players; if the monkey is curious and not already targeting or harassing, attempts to select and harass a player (especially if carrying bananas).
* **Parameters:** `inst` (entity) — the monkey entity.
* **Returns:** Nothing.

### `OnAttacked(inst, data)`
* **Description:** On receiving damage, sets the attacker as combat target, stops harassment, cancels forget task, and notifies nearby monkeys.
* **Parameters:** `inst` (entity) — the monkey entity; `data` (table) — includes `attacker`.
* **Returns:** Nothing.

### `SetHarassPlayer(inst, player)`
* **Description:** Assigns or clears a player to be followed/harassed; sets up timeout and removal callbacks.
* **Parameters:** `inst` (entity) — the monkey entity; `player` (entity or `nil`) — the player to harass.
* **Returns:** Nothing.

### `IsForcedNightmare(inst)`
* **Description:** Checks whether the monkey is currently in a forced nightmare state via a running timer.
* **Parameters:** `inst` (entity) — the monkey entity.
* **Returns:** `true` if `forcenightmare` timer exists, otherwise `false`.

### `OnMonkeyDeath(inst, data)`
* **Description:** If killed by a player, drops inventory and triggers home-seeker event after a random delay.
* **Parameters:** `inst` (entity) — the monkey entity; `data` (table) — includes `afflicter`.
* **Returns:** Nothing.

### `OnTimerDone(inst, data)`
* **Description:** Handles timer expiration for forced nightmare state; exits nightmare mode and resets loot if timer ends.
* **Parameters:** `inst` (entity) — the monkey entity; `data` (table) — includes `name` (`"forcenightmare"`).
* **Returns:** Nothing.

### `OnPickup(inst, data)`
* **Description:** Special handling to equip items with `equipslot == HEAD` after `GiveItem` completes.
* **Parameters:** `inst` (entity) — the monkey entity; `data` (table) — includes `item`.
* **Returns:** Nothing.

### `DoFx(inst)`
* **Description:** Plays transformation FX sounds and spawns visual effects (`statue_transition_2`, `statue_transition`) on state change.
* **Parameters:** `inst` (entity) — the monkey entity.
* **Returns:** Nothing.

### `DoForceNightmareFx(inst, isnightmare)`
* **Description:** Plays FX and attaches them to platform when transitioning via external trigger (e.g., `shadow_trap`).
* **Parameters:** `inst` (entity) — the monkey entity; `isnightmare` (boolean) — if `true`, uses `shadow_despawn`; otherwise, uses `statue_transition_2`.
* **Returns:** Nothing.

### `oneat(inst)`
* **Description:** On eating, spawns up to 3 poop items in inventory if space permits.
* **Parameters:** `inst` (entity) — the monkey entity.
* **Returns:** Nothing.

### `onthrow(weapon, inst)`
* **Description:** Consumes a `poop` item when a projectile is launched (ranged attack).
* **Parameters:** `weapon` (entity) — the thrower weapon; `inst` (entity) — the monkey entity.
* **Returns:** Nothing.

### `hasammo(inst)`
* **Description:** Checks if inventory contains at least one `poop`.
* **Parameters:** `inst` (entity) — the monkey entity.
* **Returns:** `true` if ammo present, otherwise `false`.

### `OnSave(inst, data)`
* **Description:** Serializes nightmare state to save data.
* **Parameters:** `inst` (entity) — the monkey entity; `data` (table) — output save table.
* **Returns:** Nothing.

### `OnLoad(inst, data)`
* **Description:** Restores nightmare state during load based on saved data or active forced timer.
* **Parameters:** `inst` (entity) — the monkey entity; `data` (table or `nil`) — loaded data.
* **Returns:** Nothing.

## Events & listeners
- **Listens to:**
  - `onremove` — from tracked `harassplayer`, clears harassment.
  - `entity_death` — from world; triggers `_DropAndGoHome` on monkey death by player.
  - `onpickupitem` — to equip headgear after pickup.
  - `attacked` — to engage target, notify allies, and cancel forget task.
  - `changearea` — to re-evaluate nightmare state on area change.
  - `ms_forcenightmarestate` — to trigger forced nightmare mode.
  - `timerdone` — to exit forced nightmare state.

- **Pushes:** None (does not push custom events).