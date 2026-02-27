---
id: buzzardbrain
title: Buzzardbrain
description: The brain component that defines autonomous behavior for buzzards, including food seeking, corpse defense, threat response, and state-specific movement logic.
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: brain
system_scope: brain
source_hash: 2f32453d
---

# Buzzardbrain

> Based on game build **714014** | Last updated: 2026-02-27

## Overview
The `buzzardbrain` component implements the decision-making logic for buzzard entities in DST. It controls how buzzards locate and consume food (specifically corpses), defend occupied food when attacked, flee from fire, and respond to nearby threats. The behavior differs between standard buzzards and mutated (lunar-aligned) buzzards: standard buzzards are territorial over food and panic when threatened while idle, whereas mutated buzzards are coordinated, lack panic responses, and do not eat non-corpse food items.

This component uses a Behavior Tree (`BT`) structure for state management and integrates with the combat, locomotor, health, and burnable components to execute context-aware actions.

## Dependencies & Tags
- **Components used:**
  - `combat`: `CanTarget`, `GetAttackRange`, `GetHitRange`, `GetLastAttackedTime`, `HasTarget`, `InCooldown`, `SetTarget`, `SuggestTarget`, `TargetIs`
  - `health`: `takingfiredamage`
  - `burnable`: `IsBurning`
  - `locomotor`: `Stop`
- **Tags used:**
  - `buzzard`, `edible_omni`, `edible_meat`, `edible_veggie`, `edible_insect`, `edible_fruit`, `edible_seeds`, `edible_fungi`
  - `lunar_aligned`, `gestaltmutant`, `player`, `monster`, `scarytoprey`, `notarget`, `playerghost`, `NOCLICK`, `INLIMBO`, `outofreach`
  - `creaturecorpse`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `corpse` | Entity or nil | `nil` | Reference to the corpse currently being eaten. |
| `corpse_time` | Number | `GetTime()` at start | Timestamp when corpse ownership was lost. Used for mutated buzzard timeout behavior. |
| `shouldGoAway` | Boolean | `false` | Flag indicating the buzzard should fly away or return home. |
| `threat` | Entity, Boolean, or nil | `false` | Cached threat entity (`nil` = none found, `false` = not yet checked). |
| `_on_corpse_ignite` | Function | `nil` | Event handler for `onignite` on the current corpse. |
| `_on_corpse_chomped` | Function | `nil` | Event handler for `chomped` on the current corpse. |
| `bt` | BehaviorTree | `nil` | The active behavior tree instance. |

## Main Functions
### `BuzzardBrain:OwnCorpse(corpse)`
* **Description:** Assigns a corpse to this buzzard as a food source, registers fire/eating event listeners, and updates internal ownership tracking. Prevents over-booking of large corpses by limiting concurrent eaters based on corpse size.
* **Parameters:**  
  `corpse` (Entity): The corpse entity to claim.
* **Returns:** Nothing.

### `BuzzardBrain:LoseCorpseOwnership()`
* **Description:** Releases ownership of the current corpse, deregisters event listeners, and records the time of loss. This allows other buzzards to claim the corpse later.
* **Parameters:** None.  
* **Returns:** Nothing.

### `BuzzardBrain:ShouldIgnoreCorpse(corpse)`
* **Description:** Determines if this buzzard should be prevented from eating a given corpse due to capacity limits. Checks the global `ignorethese` table, which tracks eater counts per corpse.
* **Parameters:**  
  `corpse` (Entity): The corpse entity to evaluate.  
* **Returns:**  
  `Boolean`: `true` if the buzzard should skip this corpse; otherwise `false`.

### `BuzzardBrain:FindCorpse()`
* **Description:** Scans the area for valid corpses using `FindEntity`, claims the first valid one via `OwnCorpse`, or clears current ownership if none found.
* **Parameters:** None.  
* **Returns:**  
  `Boolean`: `true` if a corpse was found and claimed; `false` otherwise.

### `BuzzardBrain:IsCorpseValid()`
* **Description:** Validates the currently owned corpse, checking existence, burn status (non-mutated buzzards avoid burning corpses), and ownership limits.
* **Parameters:** None.  
* **Returns:**  
  `Boolean`: `true` if `self.corpse` is valid; otherwise `false`.

### `BuzzardBrain:GetCorpsePosition()`
* **Description:** Returns the position of the current corpse if valid, or `nil`.
* **Parameters:** None.  
* **Returns:**  
  `Vector3?`: The world position of the corpse, or `nil`.

### `BuzzardBrain:FindThreat()`
* **Description:** Locates the nearest valid threat within the current perception radius, caching the result. Behavior differs for mutated buzzards (shorter detection range, different validity rules).
* **Parameters:** None.  
* **Returns:**  
  `Entity?`: The threat entity, or `nil` if no threat is found.

### `BuzzardBrain:IsThreatened()`
* **Description:** Checks if a threat exists and the buzzard is not currently occupied (e.g., sleeping, busy, or in flight).
* **Parameters:** None.  
* **Returns:**  
  `Entity?`: The threat entity if present and not busy; otherwise `nil`.

### `BuzzardBrain:DealWithThreat()`
* **Description:** Decides the buzzard’s response to a threat: defend the current food (corpse or edible item) if present, or flee. For mutated buzzards, threats are only suggested (not force-assigned) if another buzzard hasn’t already engaged it.
* **Parameters:** None.  
* **Returns:**  
  `Boolean`: `true` if a defensive or fleeing action was initiated; `false` if the behavior tree should proceed to the next node.

### `BuzzardBrain:DoUpdate()`
* **Description:** Resets the threat cache (`self.threat`) to `false`, indicating that a fresh threat search should be performed on the next cycle.
* **Parameters:** None.  
* **Returns:** Nothing.

### `BuzzardBrain:OnStart()`
* **Description:** Constructs the behavior tree root node, which orchestrates all buzzard behaviors. Includes conditional branches for fire flight, mutated timeout flight, corpse eating, food scanning, threat response, and wandering.
* **Parameters:** None.  
* **Returns:** Nothing.

### `BuzzardBrain:OnStop()`
* **Description:** Releases ownership of the current corpse and deregisters event listeners to prevent leaks.
* **Parameters:** None.  
* **Returns:** Nothing.

## Events & Listeners
- **Listens to:**
  - `onignite`: On the current corpse entity. Triggers threat suggestion against the igniting entity if valid (used to protect food).
  - `chomped`: On the current corpse entity. Triggers threat targeting of any entity eating the same corpse (standard buzzards object to sharing; mutated buzzards object only to non-mutant eaters).
- **Pushes:**
  - `corpse_eat`: Fired immediately before facing and consuming a valid corpse. Carries `{ corpse = corpse }` in the event data.

### External Helper Functions
- **`Buzzard_ShouldIgnoreCorpse(corpse)`**  
  Public wrapper for `BuzzardBrain:ShouldIgnoreCorpse`, used by external manager components to check corpse availability.
  
- **`FindThreat(inst, radius)`**  
  Centralized threat search logic using `FindEntity` with tag filters and validity callbacks, differing based on `lunar_aligned` status.

- **`IsCorpseValid(guy, inst)`**  
  Validates corpses for buzzards, considering burn state, mutation state, gestalt arriving flags, and ownership limits.

- **`Normal_IsValidThreat(guy, inst)`**  
  For standard buzzards: allows threats unless they are buzzards that are not close enough to be defended.

- **`Mutated_IsValidThreat(guy)`**  
  For mutated buzzards: allows all threats with a `combat` component, enabling group targeting.

- **`GetCorpseRadius(corpse)`**  
  Computes a reliable radius for corpse targeting by comparing `GetCombatFxSize` and physics radius.

- **`GetHomePos(inst)`**  
  Returns the buzzard’s current position as the “home” location for wander logic.

- **`GetSeeThreatDist(inst)`**  
  Returns the perception radius for threats: `7.5` for standard, `3` for mutated buzzards.

- **`IsSgBusy(inst)`**  
  Helper that returns `true` if the stategraph has any of `"sleeping"`, `"busy"`, or `"flight"` tags.

- **`CanEat(food)`**  
  Verifies food is on valid ground (`IsOnValidGround`).

- **`EatFoodAction(inst)`**  
  Attempts to eat nearby food within `SEE_FOOD_DIST` (15 units), returning a `BufferedAction` or `nil`.

- **`GoHome(inst)`**  
  Returns a `BufferedAction` to execute `ACTIONS.GOHOME` if `inst.shouldGoAway` is set.

- **`ShouldFlyAwayFromFire(inst)`**  
  Triggers `shouldGoAway` if the buzzard is on fire and taking fire damage (but not currently burning). Applies to standard buzzards only.

- **`Mutated_ShouldFlyAway(inst)`**  
  Triggers `shouldGoAway` if no corpse has been consumed for over `FLY_AWAY_AFTER_NO_CORPSE_TIME` (20 seconds). Applies to mutated buzzards only.

### Global State
- **`ignorethese`**: A shared dictionary mapping `{ corpse = { [buzzard_inst] = true } }` to track which buzzards own each corpse.
- **`SIZE_TO_NUM_OWNERS`**: Maps corpse size strings (`"tiny"`, `"small"`, `"med"`, `"large"`) to maximum allowed concurrent eaters (e.g., `"large"` corpses support 10 buzzards).

### Key Constants
- `FLY_AWAY_AFTER_NO_CORPSE_TIME = 20`
- `SEE_FOOD_DIST = 15`
- `SEE_THREAT_DIST = 7.5`
- `MUTATED_SEE_THREAT_DIST = 3`
- `NO_TAGS = { "FX", "NOCLICK", "DECOR", "INLIMBO", "outofreach" }`
- `FOOD_TAGS = { "edible_omni", "edible_meat", ... }` (derived from `FOODGROUP.OMNI.types`)
- `FINDTHREAT_MUST_TAGS = { "notarget", "playerghost" }`
- `FINDTHREAT_CANT_TAGS = { "player", "monster", "scarytoprey" }`
- `FINDTHREAT_MUTATED_CANT_TAGS = { "notarget", "lunar_aligned", "playerghost" }`
- `FINDTHREAT_MUTATED_ONE_OF_TAGS = { "player", "monster", "scarytoprey" }`
- `UPDATE_RATE = 0.5`

### Behavior Tree Nodes Used
- `PriorityNode`, `WhileNode`, `IfNode`, `ConditionNode`, `ActionNode`, `FailIfSuccessDecorator`, `DoAction`, `Wander`, `StandAndAttack`, `FaceEntity`, `Leash`

### Behavior Logic Summary
1. **Non-flying & non-flamethrowering state** → evaluate sub-tasks.
2. **Standard buzzard** → flee fire if `takingfiredamage`.
3. **Mutated buzzard** → fly away if no corpse consumed for 20 seconds.
4. **Any buzzard** → flee if `shouldGoAway` flag set.
5. **Stand and attack** → engage current target or remain alert.
6. **Threat detection** → defend food or flee.
7. **Mutated-only corpse eating** → find and consume corpse if no target is active.
8. **Food seeking** → hop to and eat nearby food items.
9. **Wander** → resume idle movement.

Note: Mutated buzzards do not perform food seeking (steps 7–8); they rely solely on corpse consumption.