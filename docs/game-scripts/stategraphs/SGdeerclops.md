---
id: SGdeerclops
title: Sgdeerclops
description: Manages state transitions, attack logic, FX, and behavior for the Deerclops entity via a custom stategraph.
tags: [entity, combat, fx, ai, stategraph]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: stategraphs
source_hash: 6239cb9a
system_scope: entity
---

# Sgdeerclops

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`SGdeerclops.lua` defines a stategraph component that orchestrates the Deerclops entity's behavior, including movement, combat (ice spikes, lasers, ice lances), ice regeneration (`icegrow`), staggering (from burning or freezing), and responses to status effects (ignition, electrocution, sinking, void fall). It integrates with DST’s common state handlers for shared entity behaviors and dynamically manages tags, light properties, and sound effects based on internal state and combat context.

## Usage example
```lua
local inst = CreateEntity()
inst:AddTag("deerclops")
inst:AddComponent("combat")
inst:AddComponent("light")
inst:AddStateGraph("SGdeerclops")

-- Fire attack sequence
inst:PushEvent("doattack", { target = player })
-- Initiate ice regeneration
inst:PushEvent("doicegrow")
-- Trigger stagger condition (e.g., burning without eye ice)
inst:PushEvent("onignite")
```

## Dependencies & tags
**Components used:**
- `Light` — used for dynamic light intensity/radius/color.
- `Combat` — referenced implicitly via target filtering in AOE logic (`CanAlwaysCombat` check).
- `CommonHandlers` (from `"stategraphs/commonstates"`) — provides handlers for sleep, wake, freeze, electrocute, death, sink, void fall, corpse states, and locomotion.

**Tags:**
- `"idle"`, `"canrotate"`, `"moving"`, `"busy"`, `"caninterrupt"`, `"hit"`, `"attack"`, `"staggered"`, `"noattack"`, `"icegrow"`, `"noelectrocute"`, `"nosleep"`, `"struggle"`, `"dead"` (via `"death"` tag)

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst.sg.mem.doicegrow` | boolean | `false` | Flag indicating ice regeneration is pending or active. |
| `inst.sg.mem.dostagger` | boolean | `false` | Flag indicating stagger condition is pending. |
| `inst.frenzied` | boolean | `false` | Tracks whether Deerclops is in frenzy mode (affects combo and attack period). |
| `inst.combo` | integer | `0` | Counts attacks in current combo; resets on 3rd hit or 50% chance. |
| `inst.attackperiod` | number | `BASE_ATTACK_PERIOD` | Current time between attacks; reduced during frenzy. |

## Main functions
### `SetLightValue(inst, val)`
* **Description:** Sets light intensity, radius, and falloff quadratically based on `val`. Intensity scales as `val^2`, radius and falloff scale linearly.
* **Parameters:** `inst` — entity instance (must have `Light` component); `val` — scalar multiplier for light properties (e.g., 0.5, 1.0, 2.0).
* **Returns:** `nil`

### `SetLightValueAndOverride(inst, val, override)`
* **Description:** Same as `SetLightValue`, plus sets a light override value on `AnimState` for visual consistency during animations.
* **Parameters:** `inst` — entity instance; `val` — light multiplier; `override` — integer passed to `AnimState:SetLightOverride`.
* **Returns:** `nil`

### `SetLightColour(inst, val)`
* **Description:** Sets the light color to monochrome red tint: `(val, 0, 0)`.
* **Parameters:** `inst` — entity instance; `val` — red channel intensity (0–1).
* **Returns:** `nil`

### `DoIceSpikeAOE(inst, target, x, z, data)`
* **Description:** Performs area-of-effect ice spike attacks at `(x,z)`. Filters entities using `TheSim:FindEntities` (excludes `"notarget"`, `"inert"`, `"noncombat"`), attacks those with `combat` and `health`, applies knockback to frozen targets. Tracks hits in `data.targets` map.
* **Parameters:** `inst` — Deerclops instance; `target` — original intended target; `x`, `z` — world coordinates; `data` — mutable table with `targets` (set) and `count` fields.
* **Returns:** `nil`

### `DoSpawnIceSpike(inst, target, rot, info, data, hitdelay, shouldsfx)`
* **Description:** Spawns one ice spike FX entity from pool, positions it, and schedules AOE hit after `hitdelay` frames. Plays sound if `shouldsfx`.
* **Parameters:** `inst` — Deerclops instance; `target` — original target; `rot` — unused rotation angle; `info` — table with `x`, `z`, `radius`, optionally `big` (boolean) and `variation` (string); `data` — AOE tracking table; `hitdelay` — delay before AOE (frames); `shouldsfx` — whether to play sound.
* **Returns:** `nil`

### `SpikeInfoNearToFar(a, b)`
* **Description:** Comparison function for sorting spike info tables by ascending `radius`.
* **Parameters:** `a`, `b` — spike info tables (must have `radius` field).
* **Returns:** `true` if `a.radius < b.radius`

### `SpawnIceFx(inst, target)`
* **Description:** Generates 11–28 ice spikes in a fixed pattern: 3 linear front spikes, 12–17 in a ~35° arc, and 5–8 in a 180° rear arc. Spikes are sorted by distance and spawned with staggered timing. Plays up to `MAX_ICESPIKE_SFX` sounds. Marks big spikes cyclically (every 3rd spike).
* **Parameters:** `inst` — Deerclops instance; `target` — original target.
* **Returns:** `nil`

### `SpawnLaser(inst)`
* **Description:** Spawns a 15-step laser beam FX forward (+90° rotation). Stops early if raycast to `(x,z)` is impassable. Triggers camera shake on first step. Plays step sounds for first 4 steps, then continuous laser sound.
* **Parameters:** `inst` — Deerclops instance.
* **Returns:** `nil`

### `DoIceLanceAOE(inst, pt, targets)`
* **Description:** Performs AOE attack at `pt` with fixed radius `ICE_LANCE_RADIUS`. Attacks valid targets in range, applies knockback if frozen, and tracks hits in `targets` set.
* **Parameters:** `inst` — Deerclops instance; `pt` — `{x,y,z}` or `Vector3` point; `targets` — mutable set table for hit tracking.
* **Returns:** `nil`

### `TryIceGrow(inst)`
* **Description:** Checks if Deerclops should enter `icegrow` state: requires `burning`, missing ice (`sg.mem.icegrow` flags), and combat inactivity. Triggers `icegrow` if needed.
* **Parameters:** `inst` — Deerclops instance.
* **Returns:** `true` if `icegrow` state was triggered; `false` otherwise.

### `TryStagger(inst)`
* **Description:** Conditionally enters `struggle_pre` state if burning, missing eye ice, and not in combat with eye ice. Clears `dostagger` on completion.
* **Parameters:** `inst` — Deerclops instance.
* **Returns:** `true` if `struggle_pre` was triggered; `false` otherwise.

### `ChooseAttack(inst, target)`
* **Description:** Selects next attack: `icelance` (if high health or frenzy), `laserbeam` (if cooldown expired and not frozen), or fallback to `attack`. Uses default combat target if none given.
* **Parameters:** `inst` — Deerclops instance; `target` — optional override target (defaults to `inst.components.combat:GetTarget()`).
* **Returns:** `true`

### `StartAttackCooldown(inst)`
* **Description:** Increments `combo` counter and sets next attack period. Resets `combo` to 0 on 3rd hit or 50% chance.
* **Parameters:** `inst` — Deerclops instance.
* **Returns:** `nil`

### `StartFrenzy(inst)`
* **Description:** Sets `frenzied` flag and initializes `combo` to 0 if `hasfrenzy` flag is true and not already frenzied.
* **Parameters:** `inst` — Deerclops instance.
* **Returns:** `nil`

### `StopFrenzy(inst)`
* **Description:** Clears `frenzied` flag, resets `combo` to 0, and restores base attack period.
* **Parameters:** `inst` — Deerclops instance.
* **Returns:** `nil`

### `DeerclopsFootstep(inst, moving, noice)`
* **Description:** Plays footstep sound and triggers camera shake. Restarts/respawns aura circle FX if `not noice` and circle exists.
* **Parameters:** `inst` — Deerclops instance; `moving` — whether currently moving; `noice` — if true, skip aura circle logic.
* **Returns:** `nil`

### `CommonStates.AddSleepExStates(states, starttimeline, waketimeline, {onsleep, onwake})`
* **Description:** Extends `states` with sleep/wake state logic, including light fade-in/out, stagger handling on wake, and tag management.
* **Parameters:** `states` — state table to mutate; `starttimeline` — event list for sleep entry; `waketimeline` — event list for wake exit; `{onsleep, onwake}` — callbacks for sleep/wake start.
* **Returns:** `nil`

### `CommonStates.AddFrozenStates(states)`
* **Description:** Adds standard frozen state logic (freeze on contact with snow/water, thaw over time, stagger on re-ignition).
* **Parameters:** `states` — state table to mutate.
* **Returns:** `nil`

### `CommonStates.AddElectrocuteStates(states, timeline, anims, fns)`
* **Description:** Adds electrocution behavior, including staggered/non-staggered animations and FX height reset on staggered entry.
* **Parameters:** `states` — state table to mutate; `timeline` — event list (uses defaults if `nil`); `anims` — map: `loop`, `pst`; `fns` — map: `loop_onenter`, `onanimover`.
* **Returns:** `nil`

### `CommonStates.AddSinkAndWashAshoreStates(states)`
* **Description:** Adds states for sinking (on water/lava) and washing ashore.
* **Parameters:** `states` — state table to mutate.
* **Returns:** `nil`

### `CommonStates.AddVoidFallStates(states)`
* **Description:** Adds `voidfall` state for falling into the Void.
* **Parameters:** `states` — state table to mutate.
* **Returns:** `nil`

### `CommonStates.AddCorpseStates(states, nil, {corpseonenter, corpseonerode})`
* **Description:** Adds corpse-specific logic (no charring, optional light spawn for Yule, early extinguish on rodding).
* **Parameters:** `states` — state table to mutate; `{corpseonenter, corpseonerode}` — callbacks.
* **Returns:** `nil`

### `CommonStates.AddLunarRiftMutationStates(states, mutate_timeline, mutatepst_timeline, nil, fns, prefabs)`
* **Description:** Adds lunar rift mutation states (intro, stutter loop, post-mutation).
* **Parameters:** `states` — state table to mutate; `mutate_timeline`, `mutatepst_timeline` — frame event lists; `fns` — callbacks (e.g., `mutate_onenter`); `prefabs` — prefab override map.
* **Returns:** `nil`

### `CommonStates.AddInitState(states, "idle")`
* **Description:** Ensures `"init"` state exists, delegating to `"idle"`.
* **Parameters:** `states` — state table to mutate; `"idle"` — initial target state.
* **Returns:** `nil`

## Events & listeners
- **Listens to `attacked`**: On damage, triggers `hit` state (if not `"staggered"`), or `struggle_pre`/`stagger_hit` based on burn and eye ice status. Checks health for knockback immunity.
- **Listens to `doattack`**: Fires attack selection via `ChooseAttack`; sets attack target in `statemem`; removes `"caninterrupt"` tag.
- **Listens to `doicegrow`**: Sets `sg.mem.doicegrow` flag and may trigger immediate `icegrow` if conditions met.
- **Listens to `onignite`**: Triggers `TryStagger` if burning and eye ice missing.
- **Listens to `animover`**: Transitions on animation end in states: `idle`, `walk_start`, `walk_stop`, `taunt`, `hit`, `death`, `attack`, `laserbeam`, `icelance`, `icegrow`, `icegrow2`, `icegrow_pst`, `struggle_loop`, `struggle_pst`, `stagger_idle`, `stagger_hit`, `stagger_pst`, `sleep`.
- **Listens to `OnLocomote`**:via `CommonHandlers.OnLocomote(false, true)`.
- **Listens to `OnSleepEx`, `OnWakeEx`, `OnFreeze`, `OnElectrocute`, `OnDeath`, `OnSink`, `OnFallInVoid`, `OnCorpseChomped`, `OnCorpseDeathAnimOver`**:via `CommonHandlers.*`.
- **Pushes `knockback`**: When frozen target is hit by AOE (ice spike/lance).
- **Pushes `onmissother`**: When AOE hits zero targets.
- **Pushes `timerdone`**: Triggered in stagger states (e.g., `stagger_pre`, `stagger_hit`) to continue timeline or exit stagger.