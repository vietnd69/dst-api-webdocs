---
id: slurtlesnailbrain
title: SlurtleSnailbrain
description: Implements AI behavior for the Slurtle Snail entity, including threat avoidance, food seeking, stealing, shield usage, and returning home when hungry.
tags: [ai, brain, combat, inventory, environment]
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: brain
system_scope: brain
source_hash: 2b0151c8
---

# Slurtlesnailbrain

> Based on game build **714014** | Last updated: 2026-02-27

## Overview
This component defines the behavior tree for the Slurtle Snail entity (`snurtle_snail`). It manages autonomous decision-making including threat response (panic, running away, using shield), foraging (eating dropped food or stealing from inventories), and homing (returning to its home location when sufficiently hungry). It extends `Brain` and constructs a prioritized behavior tree on startup via `OnStart`, combining custom actions with reusable behaviors such as `RunAway`, `Wander`, and `DoAction`. It depends on several components (`homeseeker`, `eater`, `inventory`, `burnable`, `knownlocations`) to evaluate conditions and perform actions.

## Usage example
This brain is intended to be attached to the `snurtle_snail` prefab definition. Typical usage involves assigning it during prefab setup as follows:

```lua
inst:AddComponent("brain")
inst.components.brain:SetBrain("slurtlesnailbrain")
```

No additional setup is required in external code; the brain initializes and runs autonomously once assigned.

## Dependencies & tags
**Components used:**
- `homeseeker` (reads `home`, checks validity and burning status)
- `burnable` (checks `IsBurning` state of home)
- `eater` (validates food via `CanEat`)
- `inventory` (finds and retrieves held/dropped food items)
- `container` (reads slots and numslots for stolen food containers)
- `edible` (validates edibility of items)
- `knownlocations` (retrieves `home` location)

**Tags:** No tags are added or removed by this component.

## Properties
The component inherits from `Brain` and does not define additional public properties in the constructor. Internal constants are declared at module scope but are not instance properties:

| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| (none) | - | - | No instance-level public properties are defined in the constructor. |

## Main functions
### `SlurtleSnailBrain:OnStart()`
* **Description:** Initializes the behavior tree for the snurtle_snail. Constructs a prioritized root node sequence that evaluates high-priority threats first (shield usage, panic triggers, running away), then feeding and stealing actions, followed by homing logic, and finally general wandering. The behavior tree is stored in `self.bt`.
* **Parameters:** None.
* **Returns:** None.
* **Error states:** If `homeseeker.home` is invalid or burning, the `GoHomeAction` returns `nil`, causing the "ShouldGoHome" priority branch to be skipped.

### `GoHomeAction(inst)`
* **Description:** Helper action generator that returns a `BufferedAction` to move to the snurtle's home if the home is valid and not burning; otherwise returns `nil`.
* **Parameters:**
  - `inst`: The entity instance (must have `components.homeseeker`).
* **Returns:** `BufferedAction` or `nil`.
* **Error states:** Returns `nil` if `homeseeker` or `home` is missing, `home` is invalid, or `home` is burning.

### `EatFoodAction(inst)`
* **Description:** Generates an eating action. First checks inventory for edible food; if not found, attempts to pick up food from the world. Returns `nil` if no edible food is found or if the state graph has a "busy" tag.
* **Parameters:**
  - `inst`: The entity instance (requires `components.inventory` and `components.eater`).
* **Returns:** `BufferedAction` (for EAT or PICKUP) or `nil`.
* **Error states:** Returns `nil` if no suitable food is found in inventory or world (within 30 units), or if the entity is currently in a "busy" state.

### `StealFoodAction(inst)`
* **Description:** Scans entities within `SEE_FOOD_DIST` (13 units) for inventories (player or container). Finds edible items in those inventories and attempts to steal one. Returns a `BufferedAction(STEAL)` with `validfn` and `attack = true`, or `nil`.
* **Parameters:**
  - `inst`: The entity instance (requires `components.eater` and `components.inventory`).
* **Returns:** `BufferedAction` (for STEAL) or `nil`.
* **Error states:** Returns `nil` if no valid food is found in nearby inventories, or if the entity is in a "busy" state.

## Events & listeners
This component does not register any event listeners or push events directly. Behavior and state transitions are driven entirely by the behavior tree evaluation loop (via `BT`).