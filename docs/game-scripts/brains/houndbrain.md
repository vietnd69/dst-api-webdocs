---
id: houndbrain
title: Houndbrain
description: Brain component that defines the decision-making logic for hounds, including pursuit, combat, following, eating, and state transitions such as becoming or returning from a statue.
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: brain
system_scope: brain
source_hash: 2d2fda3c
---

# Houndbrain

> Based on game build **714014** | Last updated: 2026-02-27

## Overview

The `houndbrain` component implements the behavior tree for hounds, governing their movement, combat, and social interactions. It dynamically selects behaviors based on hound type (`pet_hound`, `clay`, or `lunar_aligned`), presence of a leader, home location, and current game state (day/night, statue status). It relies heavily on external behavior nodes (e.g., `Wander`, `ChaseAndAttack`, `Leash`) and integrates with combat, follower, homeseeker, eater, and burnable components to make context-aware decisions.

## Dependencies & Tags
- **Components used:**
  - `burnable` (`IsBurning`)
  - `combat` (`GetHitRange`, `GetLastAttackedTime`, `HasTarget`, `InCooldown`, `target`)
  - `eater` (`CanEat`, `GetEdibleTags`)
  - `follower` (`GetLeader`)
  - `homeseeker` (`home`)
- **Tags:**
  - `pet_hound` – identifies tamed hounds; affects aggression, home seeking, and waiting behavior.
  - `clay` – clay hounds (e.g., from the Ruins); triggers special statue-related behavior.
  - `lunar_aligned` – mutated hounds; disables carcass-eating behavior.
  - `INLIMBO`, `outofreach` – excluded tags when searching for food.
  - `creaturecorpse`, `NOCLICK`, `fire` – used when selecting carcasses.
  - `statue` – checked to detect if a leader is petrified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `reanimatetime` | `number?` / `boolean?` | `nil` | Timestamp or flag indicating when to reanimate a leader or the hound itself after being a statue. Used in both `clay` and pet hound logic. |
| `carcass` | `Entity?` | `nil` | Stores the current valid carcass target selected by `SelectCarcass()`. Cleared or updated on subsequent ticks. |

## Main Functions

### `HoundBrain:OnStart()`
* **Description:** Initializes the brain’s behavior tree (BT) at startup. Constructs a priority-based behavior tree whose top-level structure differs significantly for `clay` hounds versus other hounds. Selects behavior nodes based on dynamic conditions (e.g., `GetLeader()`, `GetHome()`, `IsPet`, `ismutated`). The BT root is assigned to `self.bt`.
* **Parameters:** None.
* **Returns:** `nil`

### `HoundBrain:SelectCarcass()`
* **Description:** Searches within `SEE_DIST` (`30`) units for a valid creature corpse (ignoring `NOCLICK` and `fire` tags), and stores the result in `self.carcass`. Does *not* check if the carcass is burning or mutating.
* **Parameters:** None.
* **Returns:** `boolean` — `true` if a carcass is found, `false` otherwise.

### `HoundBrain:CheckCarcass()`
* **Description:** Validates the currently selected `carcass`: ensures it is not burning (via `burnable:IsBurning()`), is valid, still a `creaturecorpse`, and not mutating.
* **Parameters:** None.
* **Returns:** `boolean` — `true` if `self.carcass` meets all validity criteria.

### `HoundBrain:GetCarcassPos()`
* **Description:** Returns the world position of the valid `carcass`, or `nil` if invalid.
* **Parameters:** None.
* **Returns:** `Vector3?` — Position of the carcass, or `nil`.

### Helper Functions (Internal Use)

#### `IsFoodValid(item, inst)`
* **Description:** Predicate used when searching for food. Returns `true` if the item is edible *and* located on a passable point.
* **Parameters:**
  - `item` (`Entity`) — Candidate food item.
  - `inst` (`Entity`) — The hound entity.
* **Returns:** `boolean`

#### `EatFoodAction(inst)`
* **Description:** Called by `DoAction` to propose an EAT action toward nearby edible food. Aborts if the hound is already `busy` without a `wantstoeat` state tag.
* **Parameters:** `inst` (`Entity`)
* **Returns:** `BufferedAction?` — Action object if food is found, `nil` otherwise.

#### `GetLeader(inst)`, `GetHome(inst)`, `GetHomePos(inst)`
* **Description:** Convenience wrappers to access the leader (via `follower`) and home position (via `homeseeker`). Returns `nil` if the component or respective value is missing.
* **Parameters:** `inst` (`Entity`)
* **Returns:** `Entity?` (leader) or `Vector3?` (home position)

#### `GetNoLeaderLeashPos(inst)`
* **Description:** Returns the home position only if the hound currently has *no* leader (i.e., leash logic should use home as the anchor).
* **Parameters:** `inst` (`Entity`)
* **Returns:** `Vector3?` — Home position if leader is `nil`; otherwise `nil`.

#### `GetWanderPoint(inst)`
* **Description:** Returns the position of the leader or nearest player (if no leader) as the point to wander around.
* **Parameters:** `inst` (`Entity`)
* **Returns:** `Vector3?` — Position to use as wander target.

#### `ShouldStandStill(inst)`
* **Description:** Determines if a pet hound should stand still: only if it is nighttime, has no leader, no combat target, and is within `SIT_BOY_DIST` (`10`) of home.
* **Parameters:** `inst` (`Entity`)
* **Returns:** `boolean`

#### `TryReanimate(self)`
* **Description:** Orchestrates reanimation logic for hounds waiting for a leader or while unclaimed. Uses `reanimatetime` as a timer/flag: sets initial delay (`random() * .5` or `3`), then switches to `true`, finally triggering `"reanimate"` event with the target.
* **Parameters:** `self` (`HoundBrain`) — The brain instance (for state persistence).
* **Returns:** `nil`

#### `ShouldBecomeStatue(inst)`
* **Description:** Returns `true` if the hound should initiate statue state: leader must be within `10` units *and* in a `"statue"` state.
* **Parameters:** `inst` (`Entity`)
* **Returns:** `boolean`

#### `GetClayLeaderLeashPos(inst)`
* **Description:** Computes a relative position around the leader using `inst.leader_offset` (for `clay` hounds). Returns `nil` if leader or offset is missing.
* **Parameters:** `inst` (`Entity`)
* **Returns:** `Vector3?`

#### `FaceFormation(inst)`
* **Description:** Aligns the hound’s rotation with its leader’s if the current state allows rotation (`canrotate` state tag).
* **Parameters:** `inst` (`Entity`)
* **Returns:** `nil`

## Events & Listeners

- **Listens to:**
  - (Internal — behavior nodes handle most state transitions; no explicit `inst:ListenForEvent` calls exist in this file.)

- **Pushes:**
  - `"becomestatue"` — Triggered repeatedly in a loop (every `3` seconds) when `ShouldBecomeStatue` or `GetLeader == nil` in clay/abandoned behavior paths.
  - `"reanimate"` — Fired once the `reanimatetime` timer completes (set to `true`). Payload: `{ target = Entity }` — the leader or nearest player to face upon reanimation.
  - `"chomp"` — Fired immediately when hound is ready to eat a valid, non-burning, non-mutating carcass and is not in combat cooldown. Payload: `{ target = Entity }`.

> Note: Event pushes are performed via `inst:PushEvent` and `inst:PushEventImmediate` — no event registration is defined in this component.