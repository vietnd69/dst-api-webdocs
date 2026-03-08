---
id: SGdaywalker2
title: Sgdaywalker2
description: Stategraph component managing Daywalker2 entity behavior, including attack chains (laser, cannon, tackle, pounce), rummaging, throwing junk, taunting, and defeat states.
tags: [entity, combat, stategraph, animation, ai]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: stategraphs
source_hash: 0b9d447b
system_scope: entity
---

# Sgdaywalker2

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
SGdaywalker2 is a stategraph component that controls the Daywalker2 entity's behavioral sequences, including targeted attacks (laser, cannon, tackle, pounce), item-based actions (rummaging, junk throw), environmental interactions (AOE trampling, collapsing workables), and transitions through idle, aggressive, sleeping, and defeated states. It coordinates attack logic, particle effects, sound, and AI state transitions using event-driven callbacks and timeline frame events.

## Usage example
```lua
-- Example: Triggering a cannon attack from the Daywalker2 entity
inst:PushEvent("doattack", { target = enemy_entity })

-- Internally, ChooseAttack will select cannon if conditions are met
-- This transitions into 'laser_pre' → 'cannon' state sequence
-- firing multiple lasers via timeline frame events and handling knockback/damage

-- Example: Handling rummage completion
-- Upon 'rummage' event payload, the 'rummage' state begins
-- When ruminage times out, rummage_ontimeout() decides whether to throw or lift
inst:PushEvent("rummage", { data = { ... } })
```

## Dependencies & tags
**Components used:**
- `combat` (via `inst.components.combat:DoAttack()`)
- `workable` (via `components.workable`)
- `mine` (via `components.mine`)
- `physics` (via `physics`)
- `scare` (via `Scare(5)` call in epic scare component)

**Tags:**
- `"rummaging"` — added during rummaging or rummage hit.
- `"idle"` — active during idle, talk, angry, etc.
- `"canrotate"` — allows facing rotation toward target.
- `"busy"` — blocks interruption (added during most non-idle states).
- `"nosleep"` — prevents sleep transitions during critical actions.
- `"sleeping"` — used internally to track sleep state.
- `"caninterrupt"` — allows interruption (added after attack phases).
- `"notalksound"` — suppresses talk sound during some attacks.
- `"attack"` — marks attack states.
- `"hit"` — active during hit states.
- `"talking"` — active during talk states.
- `"angry"` — active during angry state.
- `"defeated"` — block to prevent reactivation after defeat.
- `"noelectrocute"` — blocks electrocution during emerge/rummage.
- `"stalking"` — conditionally added in idle when stalking.
- `"walk"` — tracked for walking state.
- `"nowake"` — prevents wake transition.
- `"flight"`, `"invisible"`, `"notarget"`, `"noattack"`, `"junk_fence"`, `"INLIMBO"` — used in `AOE_TARGET_CANT_TAGS`.
- `"NPC_workable"`, `"CHOP_workable"`, `"HAMMER_workable"`, `"MINE_workable"` — used in `COLLAPSIBLE_TAGS`.
- `"FX"`, `"DECOR"`, `"blocker"`, `"junk_pile_big"` — used in `NON_COLLAPSIBLE_TAGS`.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| None identified |  |  |  |

## Main functions
### `ChooseAttack(inst)`
* **Description:** Selects and initiates the highest-priority attack based on available abilities (`canswing`, `cancannon`, `cantackle`) and distance to target. Falls back to pounce if rooted or stuck.  
* **Parameters:**  
  - `inst` — the entity instance.  
* **Returns:** `true` if an attack state was initiated, `false` or `nil` otherwise.  
* **Error states:** Relies on `inst.components.combat.target` being valid.

### `hit_recovery_skip_cooldown_fn(inst, last_t, delay)`
* **Description:** Determines whether hit recovery cooldown can be skipped. Skips only when hit recovery equals `DAYWALKER_HIT_RECOVERY`, combat is on cooldown, and state is idle.  
* **Parameters:**  
  - `inst`, `last_t`, `delay` — unused for compatibility.  
* **Returns:** `true` if skip allowed, `false` otherwise.

### `_transfer_statemem_to_electrocute(inst)`
* **Description:** If currently rummaging, stores `inst.sg.statemem.data` into `inst.sg.mem.transfer_data` before electrocution.  
* **Parameters:**  
  - `inst`.  
* **Returns:** `nil`.

### `_AOEAttack(inst, dist, radius, arc, heavymult, mult, forcelanded, targets, overridenontags)`
* **Description:** Performs area-of-effect (AOE) combat attacks on nearby valid targets within given range, angle, and position. Uses combat component to execute attacks and applies knockback.  
* **Parameters:**  
  - `inst`, `dist`, `radius`, `arc` — spatial parameters.  
  - `heavymult`, `mult` — knockback multipliers for heavy vs light armor.  
  - `forcelanded` — passed to knockback event.  
  - `targets` — table tracking already-hit targets.  
  - `overridenontags` — overrides `AOE_TARGET_CANT_TAGS` if truthy.  
* **Returns:** `true` if at least one target hit.

### `_DoAOEWork(inst, dist, radius, arc, targets, canblock, overridenontags, trampledelays)`
* **Description:** Performs AOE work actions (e.g., destroy, work) on collapsible workables. Supports trampling logic with delays.  
* **Parameters:**  
  - `inst`, `dist`, `radius`, `arc`, `targets`, `canblock`, `overridenontags`, `trampledelays`.  
* **Returns:** `hit` (`true` if any workable destroyed), `blocked` (`true` if first blocker hit and `canblock=true`).

### `TossLaunch(inst, launcher, basespeed, startheight)`
* **Description:** Launches an item away from a launcher using physics velocity with slight random angle.  
* **Parameters:**  
  - `inst` — item to launch.  
  - `launcher`, `basespeed`, `startheight`.  
* **Returns:** `nil`.

### `TossItems(inst, dist, radius)`
* **Description:** Finds and tosses nearby items in arc/distance. Deactivates mines first.  
* **Parameters:**  
  - `inst`, `dist`, `radius`.  
* **Returns:** `nil`.

### `DoArcAttack(inst, dist, radius, arc, heavymult, mult, forcelanded, targets)`
* **Description:** Combo of `_DoAOEWork` + `_AOEAttack` for arc-shaped attacks. Resets stuck detection if anything hit.  
* **Parameters:** Same as `_AOEAttack`/`_DoAOEWork`.  
* **Returns:** `true` if either hit or worked.

### `DoAOEAttack(inst, dist, radius, heavymult, mult, forcelanded, targets, canblock, ignoreblock)`
* **Description:** Full AOE attack (no arc). Optionally blocks on front blocker. Resets stuck detection.  
* **Parameters:** Same as `_AOEAttack`/`_DoAOEWork` with `canblock`, `ignoreblock`.  
* **Returns:** `true` if hit or worked, `blocked` (boolean).

### `DoPounceAOEAttack(inst, dist, radius, heavymult, mult, forcelanded, targets)`
* **Description:** Pounce-specific AOE attack. Does *not* reset stuck detection.  
* **Parameters:** Same as `_AOEAttack`.  
* **Returns:** `hit` status (`true` if hit).

### `DoPounceAOEWork(inst, dist, radius, targets)`
* **Description:** Pounce-specific AOE work. Does *not* reset stuck detection.  
* **Parameters:** Same as `_DoAOEWork`.  
* **Returns:** `worked` (boolean), `blocked`.

### `DoFootstepAOE(inst)`
* **Description:** Runs `_DoAOEWork` on footstep radius to enable trampling of small obstacles. Resets stuck detection if worked.  
* **Parameters:** `inst`.  
* **Returns:** `nil`.

### `TryChatter(inst, strtblname, index, ignoredelay, echotochatpriority)`
* **Description:** Wrapper calling `SGDaywalkerCommon.TryChatter` with pre-defined `CHATTER_DELAYS`.  
* **Parameters:** Passed through from call site.  
* **Returns:** `nil`.

### `SpawnDroppedJunk(inst, offset)`
* **Description:** Spawns `junk_break_fx` at Daywalker2’s current facing position.  
* **Parameters:** `inst`, `offset` (unused).  
* **Returns:** `nil`.

### `SpawnSwipeFX(inst, offset, reverse)`
* **Description:** Spawns `daywalker2_swipe_fx`, parents to `inst`, positions offset, optionally reverses animation.  
* **Parameters:** `inst`, `offset`, `reverse`.  
* **Returns:** `nil`. Stores fx in `inst.sg.statemem.fx`.

### `KillSwipeFX(inst)`
* **Description:** Removes `inst.sg.statemem.fx` if valid.  
* **Parameters:** `inst`.  
* **Returns:** `nil`.

### `CalcKnockback(scale)`
* **Description:** Returns knockback multiplier tuple. For `scale ≥ 1`, returns `(nil, Lerp(1, 1.5, scale-1))`. For `scale < 1`, returns `(scale, scale * 1.3, true)`.  
* **Parameters:** `scale`.  
* **Returns:** `knockback mult`, optionally `strengthmult`, and `forcelanded` (boolean) if `scale < 1`.

### `CalcDamage(dist)`
* **Description:** Calculates damage based on distance using `Remap` between min/max tunings, clamped. Returns player damage percent.  
* **Parameters:** `dist`.  
* **Returns:** `damage`, `playerdamagepercent`.

### `SpawnLaserHitOnly(inst, dist, scale, targets)`
* **Description:** Spawns `alterguardian_laserempty` (no visual), calculates damage/knockback, and triggers it.  
* **Parameters:** `inst`, `dist`, `scale`, `targets`.  
* **Returns:** `nil`.

### `SpawnLaser(inst, dist, angle_offset, scale, scorchscale, targets)`
* **Description:** Spawns `alterguardian_laser`, calculates knockback/damage, sets anim scale (flips on alternate use).  
* **Parameters:** `inst`, `dist`, `angle_offset`, `scale`, `scorchscale`, `targets`.  
* **Returns:** `dist + 0.4`.

### `DoFootstep(inst, volume)`
* **Description:** Records timestamp in `inst.sg.mem.lastfootstep` and plays footstep sound.  
* **Parameters:** `inst`, `volume`.  
* **Returns:** `nil`.

### `TurnToTargetFromNoFaced(inst)`
* **Description:** If `canrotate` and `busy` in last tags and target exists, forces facing toward target.  
* **Parameters:** `inst`.  
* **Returns:** `nil`.

### `rummage_ontimeout(inst)`
* **Description:** Handles rummage completion: if loot is "ball", goes to throw; otherwise lifts new item (object/spike/cannon) and supports double rummage.  
* **Parameters:** `inst`.  
* **Returns:** `nil`.

### `CleanupIfSleepInterrupted(inst)`
* **Description:** Helper function: if sleep interrupted, restores four-faced orientation.  
* **Parameters:** `inst`.  
* **Returns:** `nil`.

## Events & listeners
- **Listens to:** `freeze` — transitions to "frozen" state if not defeated.
- **Listens to:** `gotosleep` — sets `sg.mem.sleeping = true`; if not `defeated`, `nosleep`, or `sleeping`, goes to "sleep".
- **Listens to:** `onwakeup` — clears `sg.mem.sleeping`; if sleeping and not `nowake`, sets `continuesleeping = true` and goes to "wake".
- **Listens to:** `ontalk` — if not hostile/busy: goes to "angry_taunt" if `_thieflevel > 2`; else goes to "talk" or "angry". Sets `keepsixfaced` or `keepnofaced`.
- **Listens to:** `doattack` — calls `ChooseAttack` if not busy/defeated.
- **Listens to:** `electrocute` — calls `CommonHandlers.TryElectrocuteOnEvent` with `_transfer_statemem_to_electrocute` callback.
- **Listens to:** `attacked` — tries electrocute, or handles hit/recovery based on state tags; goes to "rummage_hit" if rummaging, otherwise "hit".
- **Listens to:** `roar` — goes to "taunt" with optional target.
- **Listens to:** `minhealth` — if `defeated` and not yet "defeated" state, goes to "defeat".
- **Listens to:** `teleported` — goes to "hit" unless busy/defeated (unless `caninterrupt`).
- **Listens to:** `rummage` — goes to "rummage" with data payload.
- **Listens to:** `tackle` — goes to "tackle_pre" with target if not busy/defeated and target valid.
- **Listens to:** `animover` — triggers state transition upon animation completion for multiple states: `"laser_pre"`, `"cannon"`, `"throw_pre"`, `"throw_loop"`, `"throw"`, `"throw_pst"`, `"tackle_pre"`, `"tackle_loop"`, `"tackle_lift"`, `"tackle_collide"`, `"tackle_pst"`, `"attack_pounce_pre"`, `"attack_pounce"`, `"attack_pounce_pst"`, `"taunt"`, `"defeat"`, `"defeat_idle_pre"`, `"defeat_idle"`.
- **Listens to:** `CommonHandlers.OnLocomote`, `CommonHandlers.OnSink`, `CommonHandlers.OnFallInVoid` — provided via `stategraphs/commonstates`.

> Note: Event names follow DST’s `inst:ListenForEvent()` convention. Events like `ontalk`, `roar`, `tackle`, etc., are typically pushed externally by AI or player interactions.