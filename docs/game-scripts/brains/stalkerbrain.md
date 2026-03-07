---
id: stalkerbrain
title: Stalkerbrain
description: Manages the decision-making and behavior tree logic for Stalker entities, including ability usage, movement, combat, and phase transitions based on health and environmental state.
tags: [ai, boss, combat, behavior-tree]
sidebar_position: 10

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: brain
system_scope: brain
source_hash: 945ddd41
---

# Stalkerbrain

> Based on game build **714014** | Last updated: 2026-02-27

## Overview

The `Stalkerbrain` component implements the AI behavior tree for the Stalker entity in `Don't Starve Together`. It dictates when and how the Stalker uses abilities (e.g., `fossilsnare`, `fossilspikes`, `fossilfeast`, `shadowchannelers`, `fossilminions`, `mindcontrol`), switches between aggressive and defensive behaviors, and responds to environmental conditions such as proximity to a Stargate or Shadow Lures. The component adapts behavior based on the Stalker's current phase (Atrium, Combat-capable, or Non-combat), health status, presence of minions, and timer-based cooldowns.

This brain relies heavily on the `Health`, `Combat`, `Commander`, `EntityTracker`, and `Timer` components to make decisions dynamically.

## Usage example

```lua
-- Typical usage in a Stalker prefab file
local function fn()
    local inst = CreateEntity()
    -- ... (other setup)

    inst:AddComponent("brain")
    inst.brain:SetBrainClass("stalkerbrain")

    -- The brain is automatically initialized by the Brain component on activation.
    return inst
end
```

## Dependencies & tags

**Components used:**
- `combat` — accessed via `inst.components.combat` for target tracking, cooldowns, and attack timing.
- `commander` — accessed via `inst.components.commander` to check minion count (`GetNumSoldiers`).
- `entitytracker` — accessed via `inst.components.entitytracker` to locate `stargate` and `shadowlure` entities (`GetEntity`).
- `health` — accessed via `inst.components.health` for health status (`IsHurt`, `currenthealth`).
- `timer` — accessed via `inst.components.timer` for cooldown management (`StartTimer`, `TimerExists`).

**Tags:**  
- `stalkerminion` — used for minion counting via `FindEntities`.
- `_combat`, `_health`, `fossil`, `playerghost`, `shadow`, `INLIMBO`, `shadowlure` — used for entity filtering (target detection and luring).

## Properties

| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `abilityname` | `string?` | `nil` | Name of the ability to execute; set and cleared each decision cycle. |
| `abilitydata` | `table?` | `nil` | Arguments passed to the ability when `PushEvent` is called. |
| `snaretargets` | `table?` | `nil` | Cache for snare target list (not used after `abilitydata` assignment). |
| `hasfeast` | `boolean?` | `nil` | Cached result of `ShouldFeast`; reset before each `ShouldUseAbility` call. |
| `hasminions` | `boolean?` | `nil` | Whether nearby minions (within 8 radius) are present; updated periodically. |
| `checkminionstime` | `number?` | `nil` | Timestamp for next minion check (to avoid frequent `FindEntities` calls). |
| `wantstospikes` | `boolean?` | `nil` | Indicates whether spiking ability should be prioritized this cycle. |
| `skullachetime` | `number` | Set on non-combat init | Time when next `skullache` event should fire. |
| `fallaparttime` | `number` | Set on non-combat init | Time when next `fallapart` event should fire. |
| `bt` | `BT` | `nil` | Behavior tree instance created in `OnStart`. |

## Main functions

### `StalkerBrain:OnStart()`
* **Description:** Initializes and assigns the root behavior tree node based on the Stalker’s state (`atriumstalker`, `canfight`, or neither). The tree is built using composite and action nodes from the behavior library and is assigned to `self.bt`.
* **Parameters:** None.
* **Returns:** `nil`.
* **Error states:** The logic分支es rely on runtime properties (e.g., `self.inst.atriumstalker`, `self.inst.canfight`) and component presence; missing components will cause runtime errors on behavior execution.

### `GetStargatePos(inst)`
* **Description:** Helper function to retrieve the world position of the Stargate, or `nil` if absent.
* **Parameters:** `inst` — the entity instance.
* **Returns:** `Vector3?` — 3D position of the Stargate, or `nil`.
* **Error states:** Returns `nil` if no `stargate` entity is tracked.

### `GetStargate(inst)`
* **Description:** Returns the Stargate entity instance (if present).
* **Parameters:** `inst` — the entity instance.
* **Returns:** `GEntity?` — the `stargate` entity, or `nil`.

### `IsDefensive(self)`
* **Description:** Determines whether the Stalker is in defensive mode (health below tunable threshold).
* **Parameters:** `self` — the brain instance.
* **Returns:** `boolean` — `true` if `currenthealth < TUNING.STALKER_ATRIUM_PHASE2_HEALTH`.

### `CheckMinions(self)`
* **Description:** Updates `hasminions` flag by querying for `stalkerminion` tagged entities within 8 units of the Stargate or Stalker.
* **Parameters:** `self` — the brain instance.
* **Returns:** `nil`.
* **Error states:** Periodically (every `CHECK_MINIONS_PERIOD = 2` seconds) only; otherwise does nothing.

### `ShouldSnare(self)`
* **Description:** Evaluates whether to use the `fossilsnare` ability (requires no active snare cooldown and viable targets found).
* **Parameters:** `self` — the brain instance.
* **Returns:** `boolean` — `true` if snare ability should be queued.
* **Error states:** If no targets found, starts a cooldown timer (`snare_cd`) before retry.

### `ShouldSpikes(self)`
* **Description:** Evaluates whether to use the `fossilspikes` ability (only when defensive, no minions present, and valid targets exist near the Stargate).
* **Parameters:** `self` — the brain instance.
* **Returns:** `boolean` — `true` if spiking ability should be queued.
* **Error states:** If no valid targets, starts a cooldown timer (`spikes_cd`) before retry.

### `ShouldSummonChannelers(self)`
* **Description:** Evaluates whether to summon shadow channelers (only in defensive state with zero minions and no active cooldown).
* **Parameters:** `self` — the brain instance.
* **Returns:** `boolean` — `true` if channeler summoning should be queued.

### `ShouldSummonMinions(self)`
* **Description:** Evaluates whether to summon minions (only when defensive, no minions present, and no active cooldown).
* **Parameters:** `self` — the brain instance.
* **Returns:** `boolean` — `true` if minion summoning should be queued.

### `ShouldMindControl(self)`
* **Description:** Evaluates whether to use `mindcontrol` (only in defensive state, no active cooldown, and a valid target exists).
* **Parameters:** `self` — the brain instance.
* **Returns:** `boolean` — `true` if mind control should be queued.
* **Error states:** If no target, starts a cooldown timer (`mindcontrol_cd`) before retry.

### `ShouldFeast(self)`
* **Description:** Evaluates whether the Stalker should eat a corpse (feast) to heal — depends on current health and minion count.
* **Parameters:** `self` — the brain instance.
* **Returns:** `boolean` — `true` if feast is needed and possible.
* **Error states:** Caches result in `self.hasfeast` for one decision cycle.

### `ShouldCombatFeast(self)`
* **Description:** A stricter variant of `ShouldFeast`, used *during* combat — only triggers if not in cooldown, not attacking, not shielded, and recently hit.
* **Parameters:** `self` — the brain instance.
* **Returns:** `boolean` — `true` if combat-safe feast should be queued.

### `ShouldUseAbility(self)`
* **Description:** Core decision function that evaluates all ability conditions in priority order and sets `abilityname` and `abilitydata`. Resets flags (`wantstospikes`, `hasfeast`) after evaluation.
* **Parameters:** `self` — the brain instance.
* **Returns:** `boolean` — `true` if an ability is queued.
* **Error states:** If a condition returns `true`, the corresponding ability name is assigned; otherwise returns `nil` (no ability used).

### `GetLoiterStargatePos(inst)`
* **Description:** Calculates a position near the Stargate for loitering (within `LOITER_GATE_DIST = 5.5`, within `LOITER_GATE_RANGE = 1.5` of target radius).
* **Parameters:** `inst` — the entity instance.
* **Returns:** `Vector3?` — loiter position, or `nil` if no Stargate.

### `GetIdleStargate(inst)`
* **Description:** Returns the Stargate and sets `inst.returntogate = true` for idle behavior.
* **Parameters:** `inst` — the entity instance.
* **Returns:** `GEntity?` — the Stargate entity, or `nil`.

### `KeepIdleStargate(inst)`
* **Description:** Helper predicate to keep facing or returning to the Stargate during idle.
* **Parameters:** `inst` — the entity instance.
* **Returns:** `boolean` — always `true`; sets `inst.returntogate = true`.

### `GetShadowLure(inst)`
* **Description:** Finds the nearest `shadowlure` entity within `SAFE_LURE_DIST = 5` units.
* **Parameters:** `inst` — the entity instance.
* **Returns:** `GEntity?` — the closest shadow lure, or `nil`.

### `KeepShadowLure(inst, target)`
* **Description:** Predicate to ensure the Stalker remains within `SAFE_LURE_DIST` of a shadow lure.
* **Parameters:**  
  - `inst` — the entity instance.  
  - `target` — a shadow lure entity.
* **Returns:** `boolean` — `true` if `inst:IsNear(target, SAFE_LURE_DIST)`.

## Events & listeners

This component does not register any event listeners. It *pushes* events to the owning entity (via `inst:PushEvent(...)`) in response to behavior tree nodes.

**Pushes:**
- `fossilsnare`, `fossilspikes`, `fossilfeast`, `shadowchannelers`, `fossilminions`, `mindcontrol`, `flinch`, `skullache`, `fallapart`, `OnLostAtrium`, `SetEngaged`

Event payloads (`self.abilitydata`) are only passed for abilities requiring arguments (e.g., snare targets).