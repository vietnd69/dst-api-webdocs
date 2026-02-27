---
id: pigelitebrain
title: Pigelitebrain
description: AI brain controlling Pig Elite behavior during minigames, including gold diving, prop pickup, panic responses, and post-match posing.
tags: [ai, combat, minigame, panic, inventory]
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: brain
system_scope: brain
source_hash: 5ba0f1aa
---

# Pigelitebrain

> Based on game build **714014** | Last updated: 2026-02-27

## Overview
The `pigelitebrain` component implements the behavior tree for Pig Elite entities during minigames such as The Great Pig Mafia War. It coordinates targeting, item interaction (gold and props), panic behavior, and post-match animations. The brain relies heavily on the Entity Component System to track combat targets, inventory state, location memory, and entity relationships (e.g., the Pig King). It integrates with custom behaviors like `ChaseAndAttackAndAvoid`, `LeashAndAvoid`, `PanicAndAvoid`, `Wander`, and `StandStill` to orchestrate complex decision-making.

## Usage example
Typical usage involves adding the component to a Pig Elite entity during prefab construction. The component is initialized automatically via `inst:AddComponent("pigelitebrain")`, and the behavior tree is built upon `OnStart`.

```lua
inst:AddComponent("pigelitebrain")
-- The brain automatically registers behavior tree logic on start
inst:ListenForEvent("matchover", function(inst)
    -- Custom post-match logic
end)
```

## Dependencies & tags
**Components used:**  
- `burnable` (accessed via `components.burnable:IsBurning()`)  
- `combat` (accessed via `components.combat.target`, `components.combat:InCooldown()`)  
- `entitytracker` (accessed via `components.entitytracker:GetEntity("king")`)  
- `hauntable` (accessed via `components.hauntable.panic`)  
- `health` (accessed via `components.health.takingfiredamage`)  
- `inventory` (accessed via `components.inventory:GetEquippedItem(EQUIPSLOTS.HANDS)`)  
- `knownlocations` (accessed via `components.knownlocations:GetLocation("home")`, `components.knownlocations:RememberLocation(...)`)  

**Tags:**  
- Checks `inst:HasTag("propweapon")`, `"minigameitem"`, `"INLIMBO"`, `"NOCLICK"`, `"fire"`, `"knockbackdelayinteraction"`  
- Uses tag lists `FIND_PROP_TAGS` and `FIND_GOLD_TAGS` to filter candidate targets  

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `pickprop` | `Entity` or `nil` | `nil` | Reference to the closest usable prop weapon currently selected for pickup |
| `seekprop` | `Entity` or `nil` | `nil` | Preferred prop weapon to pursue when none is equipped |
| `diveitem` | `Entity` or `nil` | `nil` | Reference to the nearest gold item currently selected for diving |
| `seekitem` | `Entity` or `nil` | `nil` | Preferred gold item to pursue for diving |
| `matchovertime` | `number` or `nil` | `nil` | Timestamp when the match ended, used to trigger the post-match pose transition after 2 seconds |
| `canpanic` | `boolean` | `true` | Enables/disables panic state transitions based on proximity to home |

## Main functions
### `HasProp(inst)`
* **Description:** Checks whether the entity currently holds a prop weapon in the `HANDS` slot.
* **Parameters:**  
  - `inst`: The entity instance.  
* **Returns:** `true` if a prop weapon is equipped; otherwise `false`.  
* **Error states:** None.

### `IsItemTarget(inst, target)`
* **Description:** Determines if the given target is currently the active target for diving (gold item).  
* **Parameters:**  
  - `inst`: The entity instance.  
  - `target`: The entity to check.  
* **Returns:** `true` if `target` equals `inst.brain.seekitem` or `inst.brain.diveitem`; otherwise `false`.

### `IsPropTarget(inst, target)`
* **Description:** Determines if the given target is currently the active target for picking up a prop.  
* **Parameters:**  
  - `inst`: The entity instance.  
  - `target`: The entity to check.  
* **Returns:** `true` if `target` equals `inst.brain.seekprop` or `inst.brain.pickprop`; otherwise `false`.

### `IsValidObj(inst, obj, squadcheckfn)`
* **Description:** Validates whether an object is a viable target, checking validity, burn status, limbo state, and squad contention.  
* **Parameters:**  
  - `inst`: The entity instance.  
  - `obj`: The candidate object entity.  
  - `squadcheckfn`: A function used to determine if the squad is already targeting `obj`.  
* **Returns:** `true` if `obj` is valid and not already claimed by the squad; otherwise `false`.

### `FindObj(inst, dist, tags, squadcheckfn)`
* **Description:** Searches for a valid object within a given distance, filtered by required and forbidden tags.  
* **Parameters:**  
  - `inst`: The entity instance.  
  - `dist`: Maximum search distance.  
  - `tags`: Table with `MUST_TAGS` and `NO_TAGS` arrays.  
  - `squadcheckfn`: Function for squad contention checks.  
* **Returns:** First valid matching entity found, or `nil`.

### `GetSeekObj(inst, old, tags, squadcheckfn)`
* **Description:** Updates or retains the preferred target object (`seekitem` or `seekprop`) using a caching strategy: retains close objects, discards distant ones, and refreshes if a closer alternative exists.  
* **Parameters:**  
  - `inst`: The entity instance.  
  - `old`: Previously tracked target, if any.  
  - `tags`: Tag filters for filtering candidate objects.  
  - `squadcheckfn`: Squad contention check function.  
* **Returns:** New or retained target entity, or `nil`.

### `ShouldPickProp(self)`
* **Description:** Determines whether the entity should attempt to pick up a prop weapon. Automatically locates a candidate if none is cached.  
* **Parameters:**  
  - `self`: The brain instance.  
* **Returns:** `true` if a prop should be picked up now; otherwise `false`.

### `GetSeekPropPos(self)`
* **Description:** Locates the position of the preferred prop weapon to pursue, updating `seekprop`.  
* **Parameters:**  
  - `self`: The brain instance.  
* **Returns:** `Vector3` position of `seekprop`, or `nil` if none is found or already equipped.

### `ShouldDiveItem(self)`
* **Description:** Determines whether the entity should attempt to dive for a gold item. Updates `diveitem` if needed.  
* **Parameters:**  
  - `self`: The brain instance.  
* **Returns:** `true` if diving is appropriate now; otherwise `false`.

### `GetSeekItemPos(self)`
* **Description:** Locates the position of the preferred gold item to pursue, updating `seekitem`.  
* **Parameters:**  
  - `self`: The brain instance.  
* **Returns:** `Vector3` position of `seekitem`, or `nil` if none is found.

### `GetHome(inst)`
* **Description:** Retrieves the remembered "home" location (e.g., Pig King’s throne room entrance).  
* **Parameters:**  
  - `inst`: The entity instance.  
* **Returns:** `Vector3` position, or `nil` if not yet remembered.

### `GetPigKing(inst)`
* **Description:** Retrieves the Pig King entity via the `entitytracker` component.  
* **Parameters:**  
  - `inst`: The entity instance.  
* **Returns:** Pig King entity, or `nil` if not tracked.

### `ShouldPanic(self)`
* **Description:** Determines whether panic behavior should be triggered based on proximity to home. Implements hysteresis to prevent flapping.  
* **Parameters:**  
  - `self`: The brain instance.  
* **Returns:** `true` if panic condition is met; otherwise `false`.

### `IsMatchOver(inst)`
* **Description:** Checks whether the minigame match has ended, either via explicit flag or Pig King state.  
* **Parameters:**  
  - `inst`: The entity instance.  
* **Returns:** `true` if the match is over; otherwise `false`.

### `ShouldMatchOverPose(self)`
* **Description:** Determines whether the post-match pose animation should be triggered. Waits 2 seconds after match end and ensures all Pig Elites are idle or in end pose.  
* **Parameters:**  
  - `self`: The brain instance.  
* **Returns:** `true` if the match-over pose should begin; otherwise `false`.

### `GetMatchOverPos(inst)`
* **Description:** Returns the home position if the match is over; otherwise `nil`. Used for post-match navigation.  
* **Parameters:**  
  - `inst`: The entity instance.  
* **Returns:** `Vector3` position of home, or `nil`.

### `PigEliteBrain:OnStart()`
* **Description:** Builds and initializes the behavior tree with priority-ordered nodes covering all major Pig Elite states (panic, attack, dive, pickup, idle). This is the primary entry point for AI behavior orchestration.  
* **Parameters:** None.  
* **Returns:** None.  
* **Error states:** None.

### `PigEliteBrain:OnInitializationComplete()`
* **Description:** Records the entity’s current position as the "home" location, ensuring a reference point for navigation and panic logic.  
* **Parameters:** None.  
* **Returns:** None.  
* **Error states:** None.

## Events & listeners
- **Listens to:** None (no `inst:ListenForEvent` calls are made directly in this component; event handling is internal to behavior tree actions).  
- **Pushes:**  
  - `"diveitem"` with `{ item = self.diveitem }` — pushed when entering the "Dive" node.  
  - `"pickprop"` with `{ prop = self.pickprop }` — pushed when entering the "PickProp" node.  
  - `"matchover"` — pushed repeatedly in the "MatchOverPose" node loop.