---
id: boatai
title: Boatai
description: Controls a boat's AI behavior by scanning for nearby sail-raised vessels and adjusting its own sail to follow them.
tags: [ai, boat, locomotion]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: c819e614
system_scope: locomotion
---

# Boatai

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`BoatAI` is a periodic-updating component that enables a boat entity to detect other boats with raised sails within a 200-unit radius and dynamically adjust its own sail direction and raise its sail to mimic their movement. It is intended for AI-controlled boats and relies on the `hull` and `mast` components of the target and owner entities. The component is started automatically upon construction via `StartUpdatingComponent`, which triggers `OnUpdate` each game tick.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("boatai")
-- The component begins updating automatically after construction
-- No further manual calls are required
```

## Dependencies & tags
**Components used:** `hull`, `mast`
**Tags:** None identified.

## Properties
No public properties.

## Main functions
### `OnUpdate(dt)`
* **Description:** Scans the surrounding area for entities within 200 units, identifies those with a non-nil `mast` component and `is_sail_raised = true`, and updates the owning boat's sail direction and raises its sail to match.
* **Parameters:** `dt` (number) - time elapsed since the last update (unused in current implementation).
* **Returns:** Nothing.
* **Error states:** 
  - Skips entities that are the boat itself (`v == self.inst`).
  - Skips entities without a `mast` component or where `is_sail_raised` is false.
  - Assumes `self.inst.components.hull.mast` and `mast.components.mast` exist and are valid (no nil checks on these chains beyond `mast` itself).

## Events & listeners
None identified.
