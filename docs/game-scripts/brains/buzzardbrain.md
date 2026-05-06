---
id: buzzardbrain
title: Buzzardbrain
description: AI behaviour tree for buzzards, managing corpse eating, food consumption, threat response, and fire avoidance based on mutation state.
tags: [brain, ai, creature, behaviour-tree]
sidebar_position: 10

last_updated: 2026-04-26
build_version: 722832
change_status: stable
category_type: brains
source_hash: deca599f
system_scope: brain
---

# Buzzardbrain

> Based on game build **722832** | Last updated: 2026-04-26

## Overview
`BuzzardBrain` is the AI behaviour tree for the `buzzard` prefab. It controls corpse consumption (with ownership tracking to limit multiple buzzards per corpse), ground food eating, threat detection and response, and fire avoidance. Mutated buzzards (`lunar_aligned` tag) exhibit different behaviour: they do not eat normal food, can eat corpses even while burning, do not panic from fire, and are more confident in combat. Brains are paused when the entity is far from any player and resume automatically on player proximity. Brain trees are attached via `RunBrain(inst, BuzzardBrain)` or `inst:SetBrain(BuzzardBrain)`.

## Usage example
```lua
-- Brains are attached during prefab construction:
local brain = require("brains/buzzardbrain")
inst:SetBrain(brain)

-- The framework calls OnStart() to obtain the behaviour tree.
-- Manual access to the running tree:
if inst.brain ~= nil and inst.brain.bt ~= nil then
    -- inspect or reset the running behaviour tree
end

-- External systems can query corpse ownership:
if Buzzard_ShouldIgnoreCorpse(corpse) then
    -- This corpse is at capacity for buzzard eaters
end
```

## Dependencies & tags
**External dependencies:**
- `stategraphs/commonstates` -- common state definitions referenced by behaviour nodes
- `behaviours/standandattack` -- StandAndAttack behaviour node factory
- `behaviours/wander` -- Wander behaviour node factory

**Components used:**
- `combat` -- target management via `CanTarget`, `SuggestTarget`, `SetTarget`, `HasTarget`, `GetLastAttackedTime`, `InCooldown`, `GetAttackRange`, `GetHitRange`
- `health` -- fire damage check via `takingfiredamage`
- `burnable` -- burning state check via `IsBurning()`
- `locomotor` -- movement control via `Stop()`

**Tags:**
- `lunar_aligned` -- checked to determine mutated buzzard behaviour branch
- `buzzard` -- used in threat validation to distinguish fellow buzzards
- `gestaltmutant` -- checked for mutated buzzard threat targeting
- `creaturecorpse` -- required tag for valid corpse targets
- `flight`, `flamethrowering`, `sleeping`, `busy` -- stategraph tags checked to determine if entity is busy

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `FLY_AWAY_AFTER_NO_CORPSE_TIME` | constant (local) | `20` | Time in seconds after corpse loss before mutated buzzard flies away. |
| `SEE_FOOD_DIST` | constant (local) | `15` | Search radius for finding food or corpses to eat. |
| `SEE_THREAT_DIST` | constant (local) | `7.5` | Threat detection radius for normal buzzards. |
| `MUTATED_SEE_THREAT_DIST` | constant (local) | `3` | Threat detection radius for mutated buzzards (shorter, more confident). |
| `UPDATE_RATE` | constant (local) | `0.5` | Behaviour tree update interval in seconds. |
| `SIZE_TO_NUM_OWNERS` | constant (local) | table | Maps corpse size (`tiny`, `small`, `med`, `large`) to maximum buzzard owners allowed. |
| `ignorethese` | constant (local) | table | Tracks corpse ownership: maps corpse entity to table of buzzard instances currently eating it. Used by `ShouldIgnoreCorpse()` to enforce capacity limits. |
| `corpse` | instance property | `nil` | Current corpse entity this buzzard is eating. Set by `OwnCorpse()`. |
| `corpse_time` | instance property | `0` | Timestamp when the buzzard last lost corpse ownership. Used for mutated fly-away logic. |
| `threat` | instance property | `false` | Cached threat entity. `nil` means no threat found; `false` means cache needs refresh. |
| `shouldGoAway` | instance property | `nil` | Flag set by threat/fire logic to trigger the GoHome action. |
| `_on_corpse_ignite` | instance property | `nil` | Event callback handler for corpse ignite events. |
| `_on_corpse_chomped` | instance property | `nil` | Event callback handler for corpse chomped events. |
| `NO_TAGS` | constant (local) | table | Exclusion tags for food search: FX, NOCLICK, DECOR, INLIMBO, outofreach. |
| `FOOD_TAGS` (dynamic) | table | --- | Generated from FOODGROUP.OMNI.types via loop. Contains edible_* tags (e.g., edible_meat, edible_veggie) used for food entity filtering. |
| `FINDTHREAT_MUST_TAGS` | constant (local) | table | CANT_TAGS for normal buzzard threat search: notarget, playerghost. |
| `FINDTHREAT_CANT_TAGS` | constant (local) | table | ONE_OF_TAGS for normal buzzard threat search: player, monster, scarytoprey. |
| `FINDTHREAT_MUTATED_CANT_TAGS` | constant (local) | table | CANT_TAGS for mutated buzzard threat search: notarget, lunar_aligned, playerghost. |
| `FINDTHREAT_MUTATED_ONE_OF_TAGS` | constant (local) | table | ONE_OF_TAGS for mutated buzzard threat search: player, monster, scarytoprey. |
| `CORPSE_MUST_TAGS` | constant (local) | table | Required tags for corpse search: creaturecorpse. |
| `CORPSE_NO_TAGS` | constant (local) | table | Exclusion tags for corpse search: NOCLICK. |

## Main functions
### `OnStart()`
* **Description:** Constructs the root PriorityNode of the behaviour tree. Prioritises fire avoidance (normal buzzards only), mutated fly-away logic, go-home actions, combat, threat response, corpse eating (mutated only), ground food eating, and wandering. Sets up initial `corpse_time` and caches mutation state. Called once when the brain is attached and on resume after pause.
* **Parameters:** None (implicit `self` via method syntax)
* **Returns:** None (assigns `self.bt` with the behaviour tree)
* **Error states:** Errors if `self.inst` is nil at the moment OnStart fires (engine guarantees non-nil; included for completeness).

### `OnStop()`
* **Description:** Cleans up corpse ownership when the brain is stopped or paused. Calls `LoseCorpseOwnership()` to remove event listeners and clear the `corpse` reference.
* **Parameters:** None
* **Returns:** None
* **Error states:** None.

### `OwnCorpse(corpse)`
* **Description:** Claims ownership of a corpse for eating. Registers event listeners for `onignite` and `chomped` events on the corpse. Sets up combat targeting when the corpse is ignited by another entity or when another buzzard eats from it (non-mutated buzzards defend exclusively; mutated buzzards only attack non-mutants). Adds this buzzard to the global `ignorethese` tracking table.
* **Parameters:**
  - `corpse` -- corpse entity to claim ownership of
* **Returns:** None
* **Error states:** Errors if `corpse` is nil or invalid (no guard present before accessing `corpse` in event listener setup).

### `LoseCorpseOwnership()`
* **Description:** Releases ownership of the current corpse. Removes event listeners from the corpse, clears the `ignorethese` tracking entry, sets `corpse` to nil, and records `corpse_time` for mutated fly-away timing logic.
* **Parameters:** None
* **Returns:** None
* **Error states:** None — guards `if self.corpse` before accessing corpse methods.

### `ShouldIgnoreCorpse(corpse)`
* **Description:** Determines if this buzzard should skip eating a specific corpse based on ownership capacity. Returns false if the corpse has no owners yet, or if there is still room based on `SIZE_TO_NUM_OWNERS` for the corpse's size. Returns true only if the corpse is at capacity and this buzzard is not already an owner.
* **Parameters:**
  - `corpse` -- corpse entity to check
* **Returns:** boolean — `true` if this buzzard should ignore the corpse, `false` if it can eat
* **Error states:** None — guards `if not owners` before accessing owner table.

### `FindCorpse()`
* **Description:** Searches for a valid corpse within `SEE_FOOD_DIST` using `IsCorpseValid` criteria. If found, calls `OwnCorpse()` to claim it and returns `true`. If not found, calls `LoseCorpseOwnership()` to clear any existing ownership. Mutated buzzards can eat burning corpses; normal buzzards cannot.
* **Parameters:** None
* **Returns:** boolean — `true` if a corpse was found and claimed, `false` otherwise
* **Error states:** None — `FindEntity` handles nil results gracefully.

### `IsCorpseValid()`
* **Description:** Validates the currently owned corpse is still a valid eating target. Checks that the corpse exists, is valid, is not mutating, has the `creaturecorpse` tag, and passes `ShouldIgnoreCorpse()` check. Mutated buzzards can eat burning corpses; normal buzzards cannot.
* **Parameters:** None
* **Returns:** boolean — `true` if the current corpse is valid, `false` otherwise
* **Error states:** None — guards `self.corpse` access internally via `IsCorpseValid` helper.

### `GetCorpsePosition()`
* **Description:** Returns the world position of the currently owned corpse if it is valid. Returns `nil` if no corpse is owned or the corpse is invalid.
* **Parameters:** None
* **Returns:** Vector3 position table or `nil`
* **Error states:** None — guards via `IsCorpseValid()` before accessing `corpse:GetPosition()`.

### `FindThreat()`
* **Description:** Finds and caches a threat entity within the appropriate threat detection radius (based on mutation state). Uses cached result if already found (`self.threat ~= false`). Returns `nil` if no threat exists, or the threat entity if found. Sets `self.threat = false` initially to indicate cache needs refresh.
* **Parameters:** None
* **Returns:** Entity instance or `nil` if no threat found
* **Error states:** None — `FindThreat` helper guards against nil results.

### `IsThreatened()`
* **Description:** Checks if the buzzard is currently threatened by another entity. Returns `nil` if the stategraph is busy (sleeping, busy, or flight states) or if no threat is found. Returns the threat entity if threatened.
* **Parameters:** None
* **Returns:** Entity instance or `nil`
* **Error states:** None — guards `IsSgBusy()` check before calling `FindThreat()`.

### `DealWithThreat()`
* **Description:** Determines how to respond to a detected threat. If the buzzard has food nearby (within 1.5 tiles) or is mutated with a corpse, it defends the food by setting combat target. If the threat is unreachable (not on valid ground), sets `shouldGoAway = true`. For mutated buzzards, uses `SuggestTarget()` to check if other buzzards are already attacking; if so, stops movement and clears buffered action. For normal buzzards, directly sets the target. If no food is present, sets `shouldGoAway = true` to flee.
* **Parameters:** None
* **Returns:** boolean — `true` if threat was handled, `false` to pass to next behaviour node
* **Error states:** Errors if `inst.components.combat` is nil (no guard present before `CanTarget`, `SuggestTarget`, `SetTarget` calls).

### `DoUpdate()`
* **Description:** Resets the threat cache by setting `self.threat = false`, forcing `FindThreat()` to search again on the next call. Called periodically by the behaviour tree framework.
* **Parameters:** None
* **Returns:** None
* **Error states:** None.

### `GetSeeThreatDist(inst)` (local)
* **Description:** Returns the appropriate threat detection radius based on mutation state. Returns `MUTATED_SEE_THREAT_DIST` (3) for mutated buzzards, `SEE_THREAT_DIST` (7.5) for normal buzzards.
* **Parameters:**
  - `inst` -- buzzard entity
* **Returns:** number — threat detection radius in tiles
* **Error states:** None.

### `FindThreat(inst, radius)` (local)
* **Description:** Searches for threat entities within the given radius using tag-based filtering. Mutated buzzards use different tag sets (`FINDTHREAT_MUTATED_CANT_TAGS`, `FINDTHREAT_MUTATED_ONE_OF_TAGS`) than normal buzzards. Normal buzzards validate threats via `Normal_IsValidThreat()` which excludes fellow buzzards unless they are very close.
* **Parameters:**
  - `inst` -- buzzard entity
  - `radius` -- search radius in tiles
* **Returns:** Entity instance or `nil`
* **Error states:** None — `FindEntity` handles nil results gracefully.

### `Normal_IsValidThreat(guy, inst)` (local)
* **Description:** Validates if a candidate entity is a valid threat for a normal buzzard. Returns false if the entity is another buzzard unless it is within combat attack range plus physics radius (prevents buzzards from fighting each other over distant targets).
* **Parameters:**
  - `guy` -- candidate threat entity
  - `inst` -- buzzard entity
* **Returns:** boolean
* **Error states:** Errors if `guy` or `inst` is nil (no guard before `HasTag` or `IsNear` calls). Errors if `inst.components.combat` is nil (no guard before `GetAttackRange()`).

### `Mutated_IsValidThreat(guy)` (local)
* **Description:** Validates if a candidate entity is a valid threat for a mutated buzzard. Only requires the entity to have a combat component (prevents targeting entities that cannot fight back).
* **Parameters:**
  - `guy` -- candidate threat entity
* **Returns:** boolean
* **Error states:** None — guards `guy.components.combat ~= nil` access.

### `IsSgBusy(inst)` (local)
* **Description:** Checks if the buzzard's stategraph has any busy-state tags that should prevent action initiation.
* **Parameters:**
  - `inst` -- buzzard entity
* **Returns:** boolean — `true` if stategraph has `sleeping`, `busy`, or `flight` tags
* **Error states:** Errors if `inst.sg` is nil (no guard before `HasAnyStateTag` call).

### `CanEat(food)` (local)
* **Description:** Validates if a food item is on valid ground and can be eaten.
* **Parameters:**
  - `food` -- food entity
* **Returns:** boolean
* **Error states:** Errors if `food` is nil (no guard before `IsOnValidGround` call).

### `FindFood(inst, radius)` (local)
* **Description:** Searches for edible food items on the ground within the given radius. Mutated buzzards return `nil` immediately (they do not eat normal food). Uses `FOOD_TAGS` derived from `FOODGROUP.OMNI.types` to identify valid food.
* **Parameters:**
  - `inst` -- buzzard entity
  - `radius` -- search radius in tiles
* **Returns:** Entity instance or `nil`
* **Error states:** None — `FindEntity` handles nil results gracefully.

### `EatFoodAction(inst)` (local)
* **Description:** Creates a buffered `ACTIONS.EAT` action for the nearest food item within `SEE_FOOD_DIST`. Returns `nil` if the stategraph is busy or no food is found.
* **Parameters:**
  - `inst` -- buzzard entity
* **Returns:** `BufferedAction` instance or `nil`
* **Error states:** Errors if `inst.sg` is nil (no guard before `HasStateTag` call).

### `GoHome(inst)` (local)
* **Description:** Creates a buffered `ACTIONS.GOHOME` action if `inst.shouldGoAway` is set. Used for fire avoidance and threat fleeing.
* **Parameters:**
  - `inst` -- buzzard entity
* **Returns:** `BufferedAction` instance or `nil`
* **Error states:** None.

### `ShouldFlyAwayFromFire(inst)` (local)
* **Description:** Checks if a normal buzzard should flee due to fire damage. Returns `true` if the stategraph is not busy, the buzzard is taking fire damage, and is not already burning. Sets `inst.shouldGoAway = true` when triggered.
* **Parameters:**
  - `inst` -- buzzard entity
* **Returns:** boolean
* **Error states:** Errors if `inst.sg` is nil (no guard before `IsSgBusy`). Errors if `inst.components.health` or `inst.components.burnable` is nil (partial guard present for burnable).

### `Mutated_ShouldFlyAway(inst)` (local)
* **Description:** Checks if a mutated buzzard should fly away due to corpse loss. Returns `true` if the stategraph is not busy, no corpse is owned, and `FLY_AWAY_AFTER_NO_CORPSE_TIME` seconds have passed since `corpse_time`. Sets `inst.shouldGoAway = true` when triggered.
* **Parameters:**
  - `inst` -- buzzard entity
* **Returns:** boolean
* **Error states:** Errors if `inst.sg` is nil (no guard before `IsSgBusy`). Errors if `inst.brain` is nil (no guard before `corpse` access).

### `GetHomePos(inst)` (local)
* **Description:** Returns the buzzard's current position as its home point for wandering behaviour. This causes wandering to center around the current location rather than a fixed spawn point.
* **Parameters:**
  - `inst` -- buzzard entity
* **Returns:** Vector3 position table
* **Error states:** None.

### `IsNotBurning(inst)` (local)
* **Description:** Checks if an entity is not currently burning. Returns `true` if the entity has no burnable component or is not burning.
* **Parameters:**
  - `inst` -- entity to check
* **Returns:** boolean
* **Error states:** None — guards `inst.components.burnable` access.

### `IsCorpseValid(guy, inst)` (local)
* **Description:** Comprehensive corpse validation for search queries. Checks entity validity, mutation state, burning status (normal buzzards only), mutation state, gestalt arrival status, ownership capacity, and `creaturecorpse` tag.
* **Parameters:**
  - `guy` -- candidate corpse entity
  - `inst` -- buzzard entity
* **Returns:** boolean
* **Error states:** Errors if `guy` or `inst` is nil (no guard before method calls). Errors if `inst.brain` is nil (no guard before `ShouldIgnoreCorpse` call).

### `GetCorpseRadius(corpse)` (local)
* **Description:** Returns the larger of the corpse's combat FX radius or physics radius. Used for leashing distance calculations during corpse eating.
* **Parameters:**
  - `corpse` -- corpse entity
* **Returns:** number — radius in world units
* **Error states:** Errors if `corpse` is nil (no guard before `GetCombatFxSize` or `GetPhysicsRadius` calls).

### `Buzzard_ShouldIgnoreCorpse(corpse)`
* **Description:** Standalone function for external systems (e.g., manager components) to query corpse ownership capacity without requiring a brain instance. Uses the same logic as `ShouldIgnoreCorpse()` but operates on the global `ignorethese` table directly.
* **Parameters:**
  - `corpse` -- corpse entity to check
* **Returns:** boolean — `true` if the corpse is at capacity, `false` if there is room
* **Error states:** None — guards `if not owners` before accessing owner table.

## Events & listeners
**Listens to:**
- `onignite` (on corpse) -- triggers combat targeting when the corpse is ignited by another entity
- `chomped` (on corpse) -- triggers combat targeting when another entity eats from the claimed corpse

**Pushes:**
- `corpse_eat` (immediate) -- fired when the buzzard begins eating a corpse, includes `{ corpse = self.corpse }` data