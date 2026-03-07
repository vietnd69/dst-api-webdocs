---
id: molebrain
title: Molebrain
description: Controls AI behavior for mole entities, handling movement, home creation, bait stealing, and environmental avoidance.
tags: [ai, movement, entity, burrowing, environment]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: brain
source_hash: 4ef3d5be
system_scope: brain
---

# Molebrain

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Molebrain` is a behavior tree-based AI controller for mole entities in DST. It manages core behaviors such as digging new molehills when displaced, returning home (especially during acid rain or daylight), stealing bait from nearby entities, and wandering in search of food. It relies heavily on components like `homeseeker`, `inventory`, `knownlocations`, `burnable`, and `bait`, and integrates with the `Brain` and `BT` systems to orchestrate high-priority reactive tasks (e.g., fleeing electric fences) and ongoing behavior patterns.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("homeseeker")
inst:AddComponent("inventory")
inst:AddComponent("knownlocations")
inst:AddBrain("molebrain")
inst.components.homeseeker.home = some_valid_location
inst.components.inventory:AddItem(prefabs.molebait)
```

## Dependencies & tags
**Components used:** `homeseeker`, `inventory`, `knownlocations`, `burnable`, `bait` (via `IsMoleBait` check)  
**Tags:** Checks `molebait` on items; uses internal state tags `trapped`, `busy`, and `inlight`. No tags are added/removed by this brain.

## Properties
No public properties.

## Main functions
### `OnStart()`
*   **Description:** Initializes the root behavior tree with priority-ordered nodes that govern mole behavior, including panic responses, home maintenance, daylight avoidance, and wandering.
*   **Parameters:** None.
*   **Returns:** Nothing.
*   **Error states:** None identified. Assumes all required components are present and valid.

## Events & listeners
- **Listens to:** `gohome` — triggers an immediate `GoHome` action when fired.
- **Pushes:** None identified.
