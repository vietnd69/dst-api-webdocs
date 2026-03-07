---
id: shadowthrall_hands_brain
title: Shadowthrall Hands Brain
description: Controls the AI behavior for shadow thrall hands, managing attack timing, movement, and coordination with allies (horns and wings) during boss encounters.
tags: [ai, combat, boss, coordination, locomotion]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: brain
source_hash: 85b4a6b0
system_scope: brain
---

# Shadowthrall Hands Brain

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`ShadowthrallHandsBrain` implements the behavior tree for shadow thrall hands, a boss-minion entity in DST. It coordinates movement and attack timing relative to a home position and a target (either directly assigned via combat component or indirectly via horn entity state). A key feature is turn-based attack sequencing: it avoids overlapping attacks with its teammates (`horns` and `wings`) by checking their `lastattack` timestamps. The brain uses a `PriorityNode` root to prioritize waiting for attack turns, closing in on targets, and wandering when idle.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("entitytracker")
inst:AddComponent("knownlocations")
inst:AddComponent("combat")
inst:AddTag("shadowthrall_hands")
inst.brain = ShadowThrallHandsBrain(inst)
inst.brain:OnStart()
```

## Dependencies & tags
**Components used:**  
- `combat` — retrieves `target`, checks `InCooldown()` and `TargetIs()`.  
- `entitytracker` — fetches related entities (`horns`).  
- `knownlocations` — retrieves spawn point for wandering baseline.  
**Tags:** Checks `running` and `attack` state tags via `self.inst.sg:HasStateTag()`.  
**Entity relationships:** References `horns` and `wings` entities via `entitytracker`, and assumes `formation` and `sg.mem.lastattack` properties exist on the instance.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `bt` | `BT` | `nil` (set in `OnStart`) | Behavior tree instance used to drive AI behavior. |
| `inst` | `Entity` | (inherited from `Brain`) | The entity instance this brain controls. |
| `formation` | number (degrees) | `nil` (external) | Optional rotation offset (in degrees) used to compute formation position around target. |

## Main functions
### `OnStart()`
* **Description:** Initializes the behavior tree with a hierarchical priority structure. It creates a `PriorityNode` root with three branches: wait-for-turn logic, combat execution, and wandering — in that order of priority.
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** None documented. Assumes `GetTarget`, `GetHome`, `GetFormationPos` functions are valid and entities referenced via `entitytracker` exist during runtime.

## Events & listeners
- **Pushes:**  
  - `doattack` — fired during the combat branch when the entity's turn arrives and it is not currently attacking, passing `{ target = self.inst.components.combat.target }`.
- **Listens to:** None. (Event listening is handled internally by components like `combat`, `stategraph`, and the behavior tree, not directly on `self.inst`.)
