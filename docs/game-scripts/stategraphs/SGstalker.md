---
id: SGstalker
title: Sgstalker
description: Manages the stalker entity's state machine, including movement, combat, summoned actions, mind control, and death, with integrated audiovisual feedback and networkable behavior.
tags: [entity, combat, ai, animation, audio]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: stategraphs
source_hash: 89195dbb
system_scope: entity
---

# Sgstalker

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
SGstalker is the stategraph responsible for controlling the stalker's behavior in Don't Starve Together. It orchestrates transitions between states based on internal flags, incoming events (e.g., attacks, summons, roars), and game state. It handles unique stalker abilities such as spawning shields, summoning minions and channelers, activating mind control, executing taunts, and managing visual/audio effects—including camera shakes, emissive blinking, sound fading, and visual trails. The stategraph integrates with core systems like locomotion, physics, health, entity tracking, and epicscare, and maintains state tags to coordinate interruptibility, busy status, and interaction permissions during complex animations.

## Usage example
```lua
-- Example: Triggering a roar that may initiate the taunt state
if not inst.sg:HasStateTag("busy") and not inst.sg:HasStateTag("roar") then
    inst.sg:GoToState("taunt")
end

-- Example: Setting blink intensity based on threat level
if threat_level > 0.8 then
    BlinkHigh(inst)
elseif threat_level > 0.3 then
    BlinkMed(inst)
else
    BlinkLow(inst)
end
```

## Dependencies & tags
**Components used:**  
- `CommonHandlers` — for `OnLocomote`, `OnSink`, `OnFallInVoid`, and `HitRecoveryDelay`  
- `TUNING.STALKER_HIT_RECOVERY` — hit recovery timeout constant  
- `TUNING.STALKER_SPEED` — walk speed reset constant  
- `TUNING.ATRIUM_GATE_DESTABILIZE_DELAY` — used in death3_pst timeline  
- `locomotor` — used to halt movement (`:StopMoving()`) in gate states  
- `AnimState` — for animation control (`:PlayAnimation`, `:PushAnimation`, `:AnimDone`, `:GetCurrentAnimationLength`)  
- `SoundEmitter` — for sound playback and fading (`:PlaySound`)  
- `sg` — stategraph interface (`:GoToState`, `:AddStateTag`, `:RemoveStateTag`, `:SetTimeout`)  
- `components.health` — to check `:IsDead()` in `flinch_loop`, `fallapart`  
- `components.epicscare` — for scare effect (`:Scare(5)`) in `eat_loop`, `mindcontrol_loop`  
- `components.entitytracker` — for retrieving stargate entity (`:GetEntity("stargate")`)  
- `inst.Physics` — for stopping physics (`:Stop()`) in gate states  
- `inst.Transform` — for facing control (`:SetSixFaced`, `:SetFourFaced`, `:ForceFacePoint`)  

**Tags:**  
- `INLIMBO`, `notarget`, `invisible`, `noattack`, `flight`, `playerghost`, `shadow`, `shadowchesspiece`, `shadowcreature`, `shadow` — part of `AREAATTACK_EXCLUDETAGS`  
- `busy`, `idle`, `canrotate`, `moving`, `hit`, `attack`, `snare`, `spikes`, `summoning`, `feasting`, `roar`, `movingdeath`, `delaydeath`, `caninterrupt`, `usinggate`, `flinching`, `hasshield`, `attacked`, `attacker`, `NOCLICK`, `skullache`, `fallapart`, `mindcontrol`  
- Direct manipulation:  
  - `NOCLICK` added in `death{,2,3}_enter`, removed on `exit`  
  - `busy` added in `eat_loop`, `eat_pst`, `mindcontrol_pre`, `mindcontrol_loop`, `mindcontrol_pst`, `flinch`, `flinch_loop`, `skullache`, `fallapart`, `idle_gate`, `idle_gate_loop`, `idle_gate_pst`; removed in `eat_pst`, `mindcontrol_pst`, `idle_gate_pst`  
  - `feasting` added in `eat_loop`  
  - `mindcontrol` added in `mindcontrol_pre`, `mindcontrol_loop`, `mindcontrol_pst`  
  - `flinch` added in `flinch`, `flinch_loop`  
  - `delaydeath` added in `flinch`, `flinch_loop`, `skullache`, `fallapart`  
  - `usinggate` added in `idle_gate`, `idle_gate_loop`  
  - `caninterrupt` added in `idle_gate`, `idle_gate_loop`, `idle_gate_pst`  
  - `skullache` added in `skullache`  
  - `fallapart` added in `fallapart`  
- Instance properties (no direct tag ops): `returntogate`, `atriumstalker`, `foreststalker`, `persists`, `mindcontrolsoundtask`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `returntogate` | boolean | false | Indicates whether the stalker should return to gate behavior |
| `foreststalker` | boolean | false | Determines if visual trail effect should be applied |
| `atriumstalker` | boolean | false | Likely used to distinguish Atrium variant behavior |
| `persists` | boolean | false | Entity persistence flag |
| `hasshield` | boolean | false | Flag indicating active shield state |
| `wantstoroar` | boolean | false | Temporary flag indicating pending roar intent |
| `wantstoflinch` | boolean | false | Temporary flag indicating pending flinch intent |
| `wantstoskullache` | boolean | false | Temporary flag indicating pending skullache intent |
| `wantstofallapart` | boolean | false | Temporary flag indicating pending fallapart intent |
| `mindcontrolsoundtask` | Task | nil | Task handle for sound fade-out scheduling |

## Main functions
### `ShakeIfClose(inst)`
* **Description:** Triggers a full-screen camera shake with parameters tuned for proximity; activated when the stalker is near players.  
* **Parameters:** `inst` — the stalker entity instance.  
* **Returns:** `nil`

### `ShakeRoar(inst)`
* **Description:** Triggers a stronger and longer full-screen camera shake during roar or taunt actions.  
* **Parameters:** `inst` — the stalker entity instance.  
* **Returns:** `nil`

### `ShakeSummonRoar(inst)`
* **Description:** Triggers a moderate full-screen camera shake used during minion or channeler summoning roars.  
* **Parameters:** `inst` — the stalker entity instance.  
* **Returns:** `nil`

### `ShakeSummon(inst)`
* **Description:** Triggers a vertical-only camera shake during minion summoning.  
* **Parameters:** `inst` — the stalker entity instance.  
* **Returns:** `nil`

### `ShakePound(inst)`
* **Description:** Triggers a vertical-only camera shake during ground-pound attacks (e.g., snare or spikes).  
* **Parameters:** `inst` — the stalker entity instance.  
* **Returns:** `nil`

### `ShakeMindControl(inst)`
* **Description:** Triggers a strong full-screen camera shake when mind control activates.  
* **Parameters:** `inst` — the stalker entity instance.  
* **Returns:** `nil`

### `ShakeDeath(inst)`
* **Description:** Triggers a vertical-only camera shake during death animations.  
* **Parameters:** `inst` — the stalker entity instance.  
* **Returns:** `nil`

### `SetBlinkLevel(inst, level)`
* **Description:** Adjusts the stalker’s emissive tint via `SetAddColour` and dynamic light intensity via `SetLightOverride`, based on the `level` (0.0 to 1.0).  
* **Parameters:**  
  - `inst` — the stalker entity instance.  
  - `level` — float value from `0` (off) to `1` (full intensity).  
* **Returns:** `nil`

### `BlinkHigh(inst)`
* **Description:** Sets the blink level to `1`.  
* **Parameters:** `inst` — the stalker entity instance.  
* **Returns:** `nil`

### `BlinkMed(inst)`
* **Description:** Sets the blink level to `0.3`.  
* **Parameters:** `inst` — the stalker entity instance.  
* **Returns:** `nil`

### `BlinkLow(inst)`
* **Description:** Sets the blink level to `0.2`.  
* **Parameters:** `inst` — the stalker entity instance.  
* **Returns:** `nil`

### `BlinkOff(inst)`
* **Description:** Sets the blink level to `0`.  
* **Parameters:** `inst` — the stalker entity instance.  
* **Returns:** `nil`

### `DoTrail(inst)`
* **Description:** Calls `inst:DoTrail()` only if `inst.foreststalker` is `true`; creates a visual trail effect for forest variant.  
* **Parameters:** `inst` — the stalker entity instance.  
* **Returns:** `nil`

### `PickShield(inst)`
* **Description:** Determines which shield variant (1, 2, 3, or 4) to spawn. Prioritizes main shields (3/4) if cooldown `MAIN_SHIELD_CD = 1.2` has elapsed.  
* **Parameters:** `inst` — the stalker entity instance.  
* **Returns:** Integer `1`, `2`, `3`, or `4`, or `nil` if no shield is selected (e.g., shield is still on cooldown).  
* **Error states:** Returns `nil` silently on cooldown.

### `StartMindControlSound(inst)`
* **Description:** Ensures the mind control looping sound is playing; cancels any pending fade-out task and restarts playback if not already playing.  
* **Parameters:** `inst` — the stalker entity instance.  
* **Returns:** `nil`

### `OnMindControlSoundFaded(inst)`
* **Description:** Called after a 10-second fade-out; resets `mindcontrolsoundtask` and kills the sound.  
* **Parameters:** `inst` — the stalker entity instance.  
* **Returns:** `nil`

### `StopMindControlSound(inst)`
* **Description:** Initiates a 10-second fade-out of the mind control sound (volume ramped to 0) and schedules `OnMindControlSoundFaded`.  
* **Parameters:** `inst` — the stalker entity instance.  
* **Returns:** `nil`

### `ShouldReturnToGate(inst)`
* **Description:** Checks if the stalker should return to gate behavior: returns `true` only if `inst.returntogate` is `true` and it has no combat target.  
* **Parameters:** `inst` — the stalker entity instance.  
* **Returns:** `boolean` — `true` if returning to gate is valid; `false` otherwise.

## Events & listeners
### Listened events:
- `death`: transitions to appropriate death state, except those with `delaydeath` tag.  
- `doattack`: if not `busy`/`dead`, transitions to `attack`.  
- `fossilsnare`: if not `busy`/`dead`, passes `data.targets` to `snare`.  
- `fossilspikes`: if not `busy`/`dead`, transitions to `spikes`.  
- `shadowchannelers`: if not `busy`/`dead`, transitions to `summon_channelers_pre`.  
- `fossilminions`: if not `busy`/`dead`, transitions to `summon_minions_pre`.  
- `fossilfeast`: if not `busy`/`dead`, transitions to `eat_pre`.  
- `mindcontrol`: if not `busy`/`dead`, transitions to `mindcontrol_pre`.  
- `attacked`: handles shield spawn, hit recovery, and interrupt logic; transitions to `hit` unless blocked. Also decrements `data.resist` in `eat_loop` when no shield is present.  
- `roar`: transitions to `taunt` if possible; otherwise sets `wantstoroar`.  
- `flinch`: sets `wantstoflinch` and transitions to `flinch` if possible.  
- `skullache`: transitions to `skullache` immediately or sets `wantstoskullache`.  
- `fallapart`: transitions to `fallapart` immediately or sets `wantstofallapart`.  
- `animover`: triggers state transitions when main animation ends in `eat_loop`, `eat_pst`, `mindcontrol_pre`, `mindcontrol_loop`, `flinch`, `idle_gate`, `idle_gate_loop`, `fallapart`.  
- `animqueueover`: triggers transitions when animation queue ends in `flinch_loop`, `skullache`.

### Pushed events:
- None identified.