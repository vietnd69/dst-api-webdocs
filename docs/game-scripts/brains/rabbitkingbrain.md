---
id: rabbitkingbrain
title: Rabbitkingbrain
description: AI brain component that defines behavioral patterns for the Rabbit King boss, selecting between passive, aggressive, and lucky states based on game context.
tags: [ai, boss, combat, entity, brain]
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: brain
system_scope: brain
source_hash: 3a3d9abb
---

# Rabbitkingbrain

> Based on game build **714014** | Last updated: 2026-02-27

## Overview
`RabbitKingBrain` is an AI brain component responsible for controlling the behavior of the Rabbit King boss. It extends `Brain` and dynamically selects one of three behavioral trees (`Create_Passive`, `Create_Aggressive`, or `Create_Lucky`) based on the value of `inst.rabbitking_kind`. The component integrates with behaviors like `Wander`, `RunAway`, `Leash`, `FaceEntity`, and `DoAction`, and interacts with components such as `Combat`, `Health`, `Eater`, `HomeSeeker`, `KnownLocations`, `InventoryItem`, and `Timer`. It does not define a constructor `_ctor`; instead, it uses the `Class(Brain, function(self, inst) ... end)` pattern for initialization.

## Usage example
The component is intended to be added to an entity instance (e.g., the Rabbit King) and started automatically when the entity's state graph transitions to a relevant state. A minimal setup involves tagging the entity with `rabbitking` and assigning `rabbitking_kind` before the brain is constructed:

```lua
inst:AddTag("rabbitking")
inst.rabbitking_kind = "aggressive" -- or "passive", "lucky"
inst:AddBrain("rabbitkingbrain")

-- The brain is started via OnStart() automatically when the state graph invokes it.
```

## Dependencies & tags
**Components used:** `combat`, `health`, `eater`, `bait`, `homeseeker`, `knownlocations`, `inventoryitem`, `timer`.

**Tags:** `rabbitking`, `INLIMBO`, `outofreach`, `_combat`, `planted`.  
Note: Tags like `INLIMBO`, `outofreach`, and `planted` are used as filters in entity search (`FindEntity`), not directly added/removed by this brain.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | — | The entity instance the brain controls. |
| `bt` | `BehaviorTree` | `nil` | The active behavior tree instance; set during `OnStart()`. |
| `abilityname` | `string` or `nil` | `nil` | Stores the name of the ability to execute in aggressive mode. |
| `abilitydata` | `Entity` or `nil` | `nil` | Stores target data for ability execution. |
| `rabbitking_kind` | `string` | — | Determines which behavior tree is active: `"passive"`, `"aggressive"`, or `"lucky"`. |

## Main functions
### `Create_Passive()`
* **Description:** Returns a `PriorityNode` behavior tree for the passive Rabbit King state. In this state, the Rabbit King does not chase players but allows trading while avoiding panic triggers (electric fences, etc.). It faces a nearby player, eats accessible bait, and wanders near its home.
* **Parameters:** None.
* **Returns:** `PriorityNode`.
* **Error states:** None. Requires `homeseeker`, `knownlocations`, `eater`, and `bait` components on the entity for correct operation.

### `Create_Aggressive()`
* **Description:** Returns a `PriorityNode` behavior tree for the aggressive Rabbit King state. The Rabbit King chases its combat target, maintains optimal distance, uses abilities (summon minions or dropkick) when possible, avoids other aggressive entities, and wanders when no target is present.
* **Parameters:** None.
* **Returns:** `PriorityNode`.
* **Error states:** None. Relies on `combat.target`, `timer`, `health`, `knownlocations`, and several other components for behavior correctness.

### `Create_Lucky()`
* **Description:** Returns a `PriorityNode` behavior tree for the lucky Rabbit King state. This is a high-aggression flee mode: the Rabbit King runs away from players and environmental threats more aggressively, attempts to return home during specific conditions (e.g., night, spring, or upon `"gohome"` event), eats bait, and wanders.
* **Parameters:** None.
* **Returns:** `PriorityNode`.
* **Error states:** None. Requires `homeseeker`, `knownlocations`, `eater`, `bait`, and `health` components.

### `OnStart()`
* **Description:** Selects and initializes the behavior tree based on `inst.rabbitking_kind`. Constructs the appropriate `PriorityNode` via `Create_Passive`, `Create_Aggressive`, or `Create_Lucky`, assigns it as `self.bt`, and starts the behavior tree.
* **Parameters:** None.
* **Returns:** `nil`.
* **Error states:** If `rabbitking_kind` is not `"passive"`, `"aggressive"`, or `"lucky"`, and the build is not development (`BRANCH == "dev"`), no assertion occurs. In development builds, it asserts with `"Missing rabbitking_kind type..."`.

### `GoHomeAction(inst)`
* **Description:** A helper action function that returns a `BufferedAction` to guide the Rabbit King to its home location, but only if it is not trapped and the home location is valid.
* **Parameters:** `inst` (`Entity`) — the entity instance.
* **Returns:** `BufferedAction` or `nil`.
* **Error states:** Returns `nil` if `homeseeker.home` is missing, invalid, or the entity is trapped.

### `EatFoodAction(inst)`
* **Description:** Searches for an edible, non-planted bait item within range and returns a `BufferedAction` to eat it. Ensures the target is not currently held by another entity.
* **Parameters:** `inst` (`Entity`) — the entity instance.
* **Returns:** `BufferedAction` or `nil`.
* **Error states:** Returns `nil` if no suitable bait is found or the best candidate fails `IsHeld()` check.

### `ShouldUseAbility_Aggressive(self)`
* **Description:** Determines whether the Rabbit King should use a special ability in aggressive mode (summon minions or dropkick). Checks cooldowns, validity of combat target, and distance thresholds.
* **Parameters:** `self` (`RabbitKingBrain`) — the brain instance.
* **Returns:** `boolean` — `true` if an ability should be used.
* **Error states:** Returns `false` if the Rabbit King is dead, on cooldown, has no valid target, or is beyond distance thresholds for abilities.

## Events & listeners
This component does not register event listeners or push events directly via `inst:ListenForEvent` or `inst:PushEvent` in its core logic. It indirectly triggers events (e.g., `"ability_summon"`, `"ability_dropkick"`) by pushing them during behavior execution in `ShouldUseAbility_Aggressive`, but these are handled within the behavior tree nodes rather than via explicit event registration.

---