---
id: mushgnomebrain
title: Mushgnomebrain
description: AI brain component that governs the behavior of the Mushgnome enemy, managing combat, panic responses, and wandering actions through a behavior tree.
tags: [ai, combat, enemy, brain]
sidebar_position: 10

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: brain
system_scope: brain
source_hash: 23cc2bd9
---

# Mushgnomebrain

> Based on game build **714014** | Last updated: 2026-02-27

## Overview

The `MushGnomeBrain` component implements the artificial intelligence for the Mushgnome enemy entity in Don't Starve Together. It is a specialized brain that defines a behavior tree (`BT`) to orchestrate core actions: aggressive spore spraying when a combat target is engaged, panic responses to threats like electric fences or nearby combatants, fleeing from dangerous entities, and passive wandering when no threats or targets are present. This brain relies on external behavior modules (`StandStill`, `StandAndAttack`, `RunAway`, `Wander`) and shared utilities from `BrainCommon`, and interacts with the `Combat` component to evaluate current engagement status and cooldowns.

## Usage example

This component is typically added to an enemy entity (e.g., the Mushgnome prefab) via the entity definition file, not manually instantiated by modders in normal modding workflows. Typical usage in a prefab definition looks like:

```lua
inst:AddBrain("MushGnomeBrain")
inst:AddComponent("combat")
-- Additional setup such as tags, health, attack stats, etc., is performed elsewhere.
```

The `OnStart` method of the brain is automatically invoked by the game when the brain component is initialized, which constructs and activates the behavior tree. Modders usually do not call `OnStart` directly or modify internal state after initialization.

## Dependencies & tags

**Components used:**  
- `inst.components.combat` — to query: `HasTarget()`, `InCooldown()`, and `TargetIs(target)`.

**Tags:**  
- The `THREAT_PARAMS` filter checks for entities with the `_combat` tag.
- Entities with tags `"DECOR"`, `"FX"`, or `"INLIMBO"` are explicitly excluded as threats.

## Properties

| Property | Type   | Default Value | Description |
|----------|--------|---------------|-------------|
| `inst`   | `Entity` | `nil` (inherited) | The entity instance this brain controls, assigned by `Brain._ctor`. |

*Note:* This brain does not define any additional instance properties beyond those inherited from `Brain`.

## Main functions

### `OnStart()`
* **Description:** Initializes and activates the behavior tree by building a priority-based node structure that governs the Mushgnome's decision-making flow. This method is called automatically during brain initialization.
* **Parameters:** None.
* **Returns:** `nil`.
* **Error states:** None documented; assumes the `Combat` component and required behavior modules are properly attached and initialized.

## Events & listeners

No explicit event listeners or event pushes are defined in this component. Behavior transitions and state changes are handled entirely by the internal behavior tree and its condition nodes.