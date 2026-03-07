---
id: shadowthrall_wings_brain
title: Shadowthrall Wings Brain
description: Controls the AI behavior of the Shadowthrall wings entity, implementing coordinated attack timing with teammates and movement using formation positioning.
tags: [ai, combat, coordination, boss]
sidebar_position: 10

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: brain
system_scope: brain
source_hash: f2675f38
---

# Shadowthrall Wings Brain

> Based on game build **714014** | Last updated: 2026-02-27

## Overview

The `ShadowThrallWingsBrain` component defines the behavior tree for the Shadowthrall wings entity in Don't Starve Together. Its primary responsibility is to manage movement and attack coordination with two teammates (`horns` and `hands`) to ensure attacks occur sequentially rather than simultaneously. It uses formation positioning to maintain relative spacing relative to the target during engagement and defaults to wandering near the spawn point when no target is present.

This brain integrates with several key systems:
- Combat (`combat` component) to track target state and cooldowns
- EntityTracker (`entitytracker` component) to locate teammates by name
- KnownLocations (`knownlocations` component) to retrieve the spawn point for wandering
- Custom behavior implementations for movement (`chaseandattack`, `wander`, `leash`, `faceentity`)

## Usage example

This brain is instantiated automatically as part of the Shadowthrall wings prefab definition. Typical usage within modding is limited, but if needed, it can be attached as follows:

```lua
local inst = TheSim:FindFirstEntityWithTag("shadowthrall_wings")
if inst ~= nil then
    inst:AddComponent("shadowthrall_wings_brain")
end
```

Ensure that the required components are present on the entity before attaching:
- `combat`
- `entitytracker`
- `knownlocations`

## Dependencies & tags

**Components used:**
- `combat`: Accesses `target`, `InCooldown()`, and `TargetIs()`
- `entitytracker`: Uses `GetEntity(name)` to locate `horns` and potentially `hands`
- `knownlocations`: Uses `GetLocation(name)` to retrieve `"spawnpoint"`

**Tags:**
- None identified (this component does not directly modify tags on its instance).

## Properties

| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `formation` | number? | `nil` | Optional angle (in degrees) used to calculate positional offset for coordinated wing positioning. Not initialized in constructor; set externally before `OnStart()` if used. |

## Main functions

### `OnStart()`
* **Description:** Initializes and starts the behavior tree. Builds a `PriorityNode` root that implements coordinated attack sequencing: waits when it's not the wings' turn to attack, moves into formation or chase range, faces the target, and attempts attack via an event push after a 1-second delay if conditions are met. Falls back to wandering near the home spawn point.
* **Parameters:** None.
* **Returns:** None.
* **Error states:** May fail if required components (`combat`, `entitytracker`, `knownlocations`) are missing or behave unexpectedly (e.g., missing spawnpoint). Relies on `TUNING.SHADOWTHRALL_WINGS_ATTACK_RANGE` being defined.

## Events & listeners

- **Listens to:** None (does not register event listeners).
- **Pushes:**
  - `doattack`: Fired with `{ target = self.inst.components.combat.target }` to trigger attack animation/logic when attack conditions are met and timing is correct. This is triggered conditionally after a `WaitNode(1)` delay within the behavior tree.