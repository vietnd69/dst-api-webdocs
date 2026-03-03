---
id: brightmare_gestaltinvaderbrain
title: Brightmare Gestaltinvaderbrain
description: AI brain for the Brightmare Gestalt invader entity, managing aggression, pursuit, projectile spitting, and structural interaction during invasion behavior.
tags: [ai, brain, combat, boss]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: brain
source_hash: 516ac6ae
system_scope: brain
---

# Brightmare Gestaltinvaderbrain

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`MoonBeastBrain` is an AI behavior tree implementation for the Brightmare Gestalt invader entity. It orchestrates behavior sequences including identification and pursuit of the invasion target, spitting attacks when triggered, breaking nearby skeletons, and falling back when the target is lost. It integrates with the `combat`, `health`, and `entitytracker` components and relies on behavior modules like `chaseandattack`, `panic`, `attackwall`, and `leash`.

## Usage example
This brain is typically instantiated and attached to a prefab in its `master_postinit` or as part of a larger brain composition:
```lua
inst:AddBrain("brightmare_gestaltinvaderbrain")
```
The entity must have the `entitytracker`, `combat`, and `health` components attached for correct operation.

## Dependencies & tags
**Components used:** `combat`, `health`, `entitytracker`, `timer`, `workable`
**Tags:** Checks `gestalt_invader_spitter`, `wagstaff_npc`, `playerskeleton`, `HAMMER_workable`; uses `BEHAVIOUR_TAG` internally via behavior modules.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `_losttime` | number or nil | `nil` | Timestamp when the invader first loses sight of the target; used to calculate `LOST_TIME` timeout. |
| `_petrifytime` | number or nil | `nil` | Timestamp after which the brain exits petrify state and resumes normal behavior. |

## Main functions
### `MoonBeastBrain:OnStart()`
* **Description:** Initializes the behavior tree (`BT`) with a root `PriorityNode`. Executes once when the brain takes control of the entity.
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** Assumes all required components and behaviors are available; failure may occur if `combat`, `health`, or `entitytracker` components are missing.

## Events & listeners
* **Listens to:** None explicitly — the behavior tree re-evaluates continuously via tree polling and component callbacks (e.g., `combat` state changes).
* **Pushes:** None — event firing is handled indirectly by component behaviors (e.g., `AttackWall`, `chaseandattack`).
