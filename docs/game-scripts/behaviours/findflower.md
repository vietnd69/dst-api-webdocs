---
id: findflower
title: Findflower
description: Selects the nearest unoccupied flower within sight and plans a pollination action for the entity.
tags: [ai, pollination, locomotion, behavior]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: behaviors
source_hash: ac58c15a
system_scope: brain
---

# Findflower

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Findflower` is a behavior node that selects a nearby flower for pollination and initiates movement toward it. It extends `BehaviourNode` and is typically used within AI brains to enable entities (e.g., bees) to seek and interact with flowers. The behavior interacts closely with the `pollinator` component to determine target validity and the `locomotor` component to execute movement.

## Usage example
```lua
-- Example usage in an AI brain tree (simplified)
local findflower = FindFlower(self.inst)
local pollinate = Pollinate(self.inst)
behaviourtree:PushNode(findflower)
behaviourtree:PushNode(pollinate)
```

## Dependencies & tags
**Components used:** `pollinator`, `locomotor`
**Tags:** Checks `flower` tag on potential targets; uses `pollinator` as a filter tag for entity search.

## Properties
No public properties

## Main functions
### `Visit()`
* **Description:** Executes the core logic of the behavior node: selects a flower target if in `READY` state and attempts to initiate a pollination action. If already `RUNNING`, validates continued viability of the target and updates status accordingly (fails if target is no longer pollinatable, missing, or contested by another pollinator).
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** May set `status` to `FAILED` if target is null, invalid, or contested.

### `PickTarget()`
* **Description:** Locates the closest flower within `SEE_DIST` (30 units) that is eligible for pollination and unoccupied by another pollinator. Updates `self.inst.components.pollinator.target` accordingly.
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** Sets `self.inst.components.pollinator.target` to `nil` if no valid flower is found.

### `DBString()`
* **Description:** Returns a debug-friendly string representation of the current target.
* **Parameters:** None.
* **Returns:** `string` — e.g., `"Go to flower abe_bug_001"`.

## Events & listeners
None identified.
