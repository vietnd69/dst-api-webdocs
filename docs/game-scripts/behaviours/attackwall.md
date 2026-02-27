---
id: attackwall
title: Attackwall
description: A behaviour node that instructs an entity to attack the nearest wall-like target within a narrow frontal cone.
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: behaviour
system_scope: combat
source_hash: 97074dc3
---

# Attackwall

## Overview
`AttackWall` is a `BehaviourNode` implementation that enables an entity to locate and attack the nearest valid wall target. It operates as part of the entity's behaviour tree, evaluating potential targets in front of the entity within a narrow angular range (±30 degrees) and a short radius (1.5 units plus the entity's physics radius). If a valid wall target is found, the entity halts movement and attempts to attack it via the `combat` component. This node is typically used for enemies or AI entities that must destroy environmental obstacles such as walls, barricades, or structures.

Key relationships:
- Uses `combat:CanTarget()` and `combat:TryAttack()` to validate and execute attacks.
- Uses `locomotor:Stop()` to halt movement during the attack sequence.
- Relies on `health:IsDead()` to verify if the target remains viable.

## Dependencies & Tags
- **Components used:**  
  - `combat` (for `CanTarget`, `TryAttack`)  
  - `health` (for `IsDead`)  
  - `locomotor` (for `Stop`)  
  - `Transform` (for rotation and world position queries)
- **Tags:**  
  - Internally defined constant `ATTACKWALL_MUST_TAGS = { "wall" }` — only entities tagged `"wall"` are considered valid targets.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `target` | `Entity?` | `nil` | Reference to the currently targeted wall entity. Updated during `Visit()` calls. May become `nil` if target is invalid or destroyed. |
| `done` | `boolean` | `false` | Internal flag set during status change to `RUNNING`; likely intended for extension or debugging (unused in current implementation). |
| `status` | `string` (inherited) | `READY` | State of the behaviour node (`READY`, `RUNNING`, `SUCCESS`, `FAILED`). Managed by `Visit()` and parent behaviour tree. |

## Main Functions
### `AttackWall:Visit()`
* **Description:** Executes the core logic of the node. If `status` is `READY`, scans for a valid wall target in front of the entity using angular and tag filters. If found, transitions to `RUNNING`, stops movement, and initializes the attack sequence. While `RUNNING`, attempts to attack the target; succeeds on successful attack, fails if the target is missing or dead.
* **Parameters:** None.
* **Returns:** `void` (modifies `self.status` and internal state; does not return a value).

## Events & Listeners
None identified. This component does not register or dispatch any events.