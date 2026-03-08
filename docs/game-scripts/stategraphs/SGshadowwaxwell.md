---
id: SGshadowwaxwell
title: Sgshadowwaxwell
description: Manages the state machine and behavior of Shadow Waxwell (a boss entity) in Don't Starve Together, including combat, movement, tool use, and dynamic scaling based on leader proximity and shadow gear.
tags: [ai, boss, combat, locomotion, stategraph]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: stategraphs
source_hash: 977c5834
system_scope: ai
---

# Sgshadowwaxwell

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`SGshadowwaxwell` is the stategraph for Shadow Waxwell, a boss entity in Don't Starve Together. It orchestrates the entity's behavior through a comprehensive set of states covering idle, movement, attack, tool use (chop, mine, dig), and special abilities like shadow strike (lunge) and teleportation (disappear/appear). It dynamically scales combat stats (attack period, damage, shadowstrike cooldown) based on proximity and activity of its leader—typically Maxwell—and the shadow level of the leader’s equipped items. It integrates closely with components like `combat`, `follower`, `health`, `inventory`, `locomotor`, `timer`, and `workable`.

## Usage example
```lua
-- This stategraph is used internally and not added directly by mods.
-- It is invoked by assigning it to an entity via:
-- inst:AddTag("shadowmaxwell") and assigning the appropriate brain and stategraph.
-- Example integration is found in prefabs like "shadowmaxwell".
```

## Dependencies & tags
**Components used:**
- `combat`: Attack range, damage, target, attack period, external damage multipliers, cancel attack, do attack.
- `follower`: Get leader.
- `health`: Check if dead or invincible.
- `inventory`: Get equipped shadow-level items.
- `locomotor`: Move, stop, manage physics.
- `timer`: Manage shadowstrike cooldown.
- `workable`: Check if target can be worked.
- `searchable`, `pickable`: Determine action duration.

**Tags used/added:**
- Common tags: `busy`, `idle`, `moving`, `running`, `canrotate`, `attack`, `abouttoattack`, `working`, `prechop`, `chopping`, `premine`, `mining`, `predig`, `digging`, `temp_invincible`, `phasing`, `noattack`, `dancing`, `doing`, `nodangle`, `jumping`, `recoil`, `slowaction`.
- State-specific: e.g., `prechop`, `prechop`, `mining`, etc.

## Properties
No public properties are defined in this stategraph. All state-specific data is stored in `inst.sg.statemem`.

## Main functions
### `FixupWorkerCarry(inst, swap)`
* **Description:** Updates animation and symbol overlays for Shadow Worker variants (`prefab == "shadowworker"`) to show/hide held tools. For other prefabs, only hides old carry visuals. Returns `true` if the animation state changed.
* **Parameters:** `swap` (string or nil) — tool symbol name (e.g., `"swap_axe"`) or `nil` to hide.
* **Returns:** `true` if swap changed the visual state; `false` otherwise.
* **Error states:** Deprecated behavior for non-Shadow Worker prefabs.

### `CheckCombatLeader(inst, target)`
* **Description:** Adjusts attack period and shadowstrike cooldown based on leader proximity and activity (attacking same target, being hit, etc.). Score is 0 (inactive) to 4 (most active), interpolated to tune timing values.
* **Parameters:** `target` (Entity or nil) — current combat target.
* **Returns:** Nothing.
* **Error states:** Uses global tuning constants `SHADOWWAXWELL_PROTECTOR_*` and `COMBAT_TIMEOUT` (6s). Assumes leader’s `combat` component exists.

### `CheckLeaderShadowLevel(inst, target)`
* **Description:** Sums shadow levels from leader’s equipped items (if leader is in range) and sets default damage for Shadow Waxwell.
* **Parameters:** `target` (Entity or nil) — current combat target (used only for proximity check).
* **Returns:** Nothing.
* **Error states:** Uses global tuning constants `SHADOWWAXWELL_PROTECTOR_DAMAGE` and `SHADOWWAXWELL_PROTECTOR_DAMAGE_BONUS_PER_LEVEL`.

### `TryRepeatAction(inst, buffaction, right)`
* **Description:** Re-queues a buffered action if its target is still valid and unchanged. Stops movement, clears old buffered action, and pushes the same action again. Returns `true` on success.
* **Parameters:** `buffaction` (ActionTable) — buffered action to repeat; `right` (boolean) — unused but present in action handler context.
* **Returns:** `true` if action was repeated; `false` otherwise.
* **Error states:** Requires `buffaction`, `target`, `workable`, and `action` validity checks.

### `DoDespawnFX(inst)`
* **Description:** Spawns and positions despawn particle effects (`shadow_despawn`, `shadow_glob_fx`), attaching them to current platform if available.
* **Parameters:** None.
* **Returns:** Nothing.

### `TrySplashFX(inst, size)`
* **Description:** Spawns an ocean splash FX at current position if entity is standing in ocean. Returns `true` on splash spawn.
* **Parameters:** `size` (string, optional) — `nil`, `"small"`, etc.
* **Returns:** `true` if splash spawned; `false` otherwise.

### `TryStepSplash(inst)`
* **Description:** Ensures at most one splash every 0.1 seconds by storing last splash time in `sg.statemem.laststepsplash`.
* **Parameters:** None.
* **Returns:** `true` if splash spawned; `false` otherwise.

## Events & listeners
- **Listens to:**
  - `attacked`: Enters `disappear` state (unless dead or invincible).
  - `doattack`: Enters `lunge_pre` or `attack` state based on combat range.
  - `dance`: Enters `dance` state if not already busy/dancing.
  - `animover`, `animqueueover`, `timeout`: State transitions for animations.
  - `locomote`: From `locomotor` component (via `CommonHandlers.OnLocomote`).
  - `onremove`: Detaches FX when platform is removed.

- **Pushes:**
  - `startlongaction`: Triggered on target when starting a long action (e.g., build/dig).
  - Internal sound/physics events via `inst:PushEvent()` are not present in listeners.
  - Events related to `attackerpos`, `target`, or `recoilstate` are stored in memory for internal logic only.
