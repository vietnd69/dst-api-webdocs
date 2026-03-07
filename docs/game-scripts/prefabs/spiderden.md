---
id: spiderden
title: Spiderden
description: Manages the lifecycle, spawning, and combat behavior of spider dens, including growth stages, spider release, queen transformation, and interaction with environment mechanics like burning, freezing, and bedazzlement.
tags: [combat, ai, boss, environment, entity]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 2215f2b3
system_scope: environment
---

# Spiderden

> Based on game build **714004** | Last updated: 2026-03-07

## Overview
The `spiderden` prefab implements a multi-stage structure that spawns spiders over time, evolves through growth stages (small → medium → large → queen), and integrates with multiple game systems including combat, child spawner, burning, freezing, upgradeable, growth, hauntable, and bedazzlement. It serves as a dynamic encounter generator in both Forest and Cave biomes, spawning spiders on a schedule and responding to player actions (e.g., hammering, haunting, shaving). Key responsibilities include managing spider release queues, handling stage transitions, supporting queen birth under specific conditions, and coordinating state changes via sound and animation triggers.

## Usage example
```lua
-- Example of spawning a spiderden and inspecting its state
local den = SpawnPrefab("spiderden")
den.Transform:SetPosition(0, 0, 0)

-- Trigger a queen transformation check (if conditions are met)
if den.components.growable and den.components.growable:GetStage() == 3 then
    den.components.growable:DoGrowth()
end

-- Summons all currently held spiders
den.components.spiderden.SummonChildren()
```

## Dependencies & tags
**Components used:**  
`health`, `childspawner`, `lootdropper`, `burnable`, `freezable`, `upgradeable`, `growable`, `inspectable`, `workable`, `hauntable`, `shaveable`, `bedazzlement`, `sleepingbag`, `knownlocations`, `temperature`, `inventory`

**Tags added:**  
`cavedweller`, `structure`, `lifedrainable`, `beaverchewable`, `hostile`, `spiderden`, `bedazzleable`, `hive`, `NPC_workable`, `tent` (conditionally added when stage ≥ 3)

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `anims` | table | `ANIM_DATA.SMALL` | Stores animation names for current stage (e.g., `init`, `idle`, `hit`, `bedazzle`). Updated on stage change. |
| `data.stage` | number | `1` | Current stage (1–3 or queen). Used as fallback when growable component is removed (e.g., during burning). |
| `sleep_tasks` | table | `nil` | List of periodic sound tasks for sleeping loop sound. Cleared on wake or removal. |
| `shaving` | boolean | `nil` | Set during shaving to prevent immediate bedazzlement removal. |

## Main functions
### `SetStage(inst, stage, skip_anim)`
* **Description:** Updates the spiderden to the specified growth stage (`1`, `2`, or `3`). Updates health, max children, creep radius, minimap icon, and plays growth animations (unless skipped). Called during initial setup, growth, and upgrading. Skipped animation flag prevents redundant animation play.
* **Parameters:**  
  `stage` (number) — Target stage: `1` (small), `2` (medium), or `3` (large).  
  `skip_anim` (boolean) — If `true`, skips playing stage transition animation and idle loop.
* **Returns:** Nothing.
* **Error states:** Does nothing if `stage > 3` (i.e., queen stage handled separately via `SetLarge` or `AttemptMakeQueen`).

### `AttemptMakeQueen(inst)`
* **Description:** Evaluates and triggers queen transformation if conditions are met: `SPAWN_SPIDERQUEEN` is enabled, stage is `3`, den is not bedazzled, not in use as a sleeping bag, within `30` units of a player, and fewer dens exist than `SPIDERDEN_QUEEN_CAP`. Transforms the den into a `spiderqueen` prefab and removes this instance unless cap allows duplication. Resets den to stage `1` before re-growing.
* **Parameters:** None (uses `inst` from closure).
* **Returns:** `true` if queen transformation is initiated; otherwise `nil`.
* **Error states:** Returns early if `components.growable == nil`, stage < `3`, `SPAWN_SPIDERQUEEN` disabled, bedazzled, sleeping, or not near player.

### `SpawnDefenders(inst, attacker)`
* **Description:** On hit or burn, spawns `spider` or `spider_warrior` defenders (up to per-stage cap). Reduces count by existing defenders and attackers, and blanks attacker animation time on spawned spiders.
* **Parameters:**  
  `attacker` (EntityRef?) — The entity that triggered the hit (e.g., player).
* **Returns:** Nothing.
* **Error states:** Does nothing if den is dead, frozen, or childspawner is missing.

### `SpawnInvestigators(inst, data)`
* **Description:** Spawns spiders that remember the target position (`data.target:GetPosition()`) as an "investigate" location. Used via `creepactivate` event. Limits count per stage and subtracts investigators already active.
* **Parameters:**  
  `data` (table?) — Contains optional `target` entity.
* **Returns:** Nothing.
* **Error states:** Does nothing if den is dead, frozen, or childspawner is missing.

### `SummonChildren(inst, data)`
* **Description:** Releases all children stored inside the den and applies the `spider_summoned_buff` debuff to them. Resets den animation and play sound. If bedazzled, calls `bedazzlement:PacifySpiders()` to calm them.
* **Parameters:** None (uses `data` for potential targeting, though unused in this implementation).
* **Returns:** Nothing.

### `OnHit(inst, attacker)`
* **Description:** Handles damage receipt: triggers `SpawnDefenders`, wakes any sleeper, and stops bedazzlement after a delay (`bedazzle_drop_timing`) if applicable.
* **Parameters:**  
  `attacker` (EntityRef) — Entity that dealt the damage.
* **Returns:** Nothing.

### `OnWork(inst, worker, workleft, numworks)`
* **Description:** Handles hammering/work actions: reduces health, sets workable work left, triggers hit behavior, but stops before killing if last hit would exceed current health (leaves `1` hp).
* **Parameters:**  
  `worker` (EntityRef) — Performing the work.  
  `workleft` (number) — Unused.  
  `numworks` (number) — Number of work actions.
* **Returns:** Nothing.
* **Error states:** Does nothing if den is dead.

### `CanShave(inst, shaver, shaving_implement)`
* **Description:** Validator for shaving the den. Must be spiderwhisperer, den not dead, not burning, and not frozen.
* **Parameters:**  
  `shaver` (EntityRef) — Attempting to shave.  
  `shaving_implement` (EntityRef?) — Tool used (e.g., razor).
* **Returns:** `true` if shaving allowed; `false, "BEDAZZLED"` if bedazzled and not shaving.

### `OnShaved(inst, shaver, shaving_implement)`
* **Description:** Handles successful shave: kills den if stage `1`, otherwise downgrades by one stage (small→medium, medium→large). Removes sleeping bag if downgraded below `3`. Resets upgradeable upgrades and plays downgrade animation and sound. Removes bedazzlement after delay if applicable.
* **Parameters:**  
  `shaver` (EntityRef) — The shaver entity.  
  `shaving_implement` (EntityRef?) — Tool used.
* **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  `death` — Triggers `OnKilled` to drop loot and clean up.  
  `freeze` — Calls `OnFreeze` to freeze state and pause growth/spawning.  
  `onthaw` — Calls `OnThaw`.  
  `unfreeze` — Calls `OnUnFreeze` to resume state.  
  `creepactivate` — Triggers `SpawnInvestigators` with provided data.  
  `healthdelta` — Internally via `health` component; not handled directly here.

- **Pushes:**  
  None directly (relies on components like `health` to push `death`, `healthdelta`, etc.).