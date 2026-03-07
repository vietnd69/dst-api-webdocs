---
id: rookbrain
title: Rookbrain
description: AI brain for the Rook enemy that orchestrates movement, combat, and navigation behaviors using a behavior tree.
tags: [ai, combat, boss, enemy, navigation]
sidebar_position: 10

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: brain
system_scope: brain
source_hash: 196adfe4
---

# Rookbrain

> Based on game build **714014** | Last updated: 2026-02-27

## Overview
`Rookbrain` is an AI component that controls the behavior of the Rook enemy in Don't Starve Together. It defines a behavior tree (`BT`) that governs how the Rook responds to threats, pursues targets, dodges attacks, returns to a home position, and faces entities. It integrates with `BrainCommon` utilities and `clockwork_common` functions to coordinate behavior, especially for home-point management. The brain relies on the `combat` component for targeting and cooldown logic and the `follower` component for leader tracking.

## Usage example
This component is intended to be assigned to a Rook entity during its prefab construction, typically via `inst:AddComponent("brain")` and setting `inst.components.brain:SetBrain(RookBrain)`. It is not meant to be instantiated directly by modders.

```lua
-- Example (not modder-facing — internal usage only)
local RookBrain = require("brains/rookbrain")
inst:AddComponent("brain")
inst.components.brain:SetBrain(RookBrain)
```

## Dependencies & tags
**Components used:**
- `combat` — accessed via `inst.components.combat:HasTarget()`, `inst.components.combat:InCooldown()`, and `inst.components.combat.target`.
- `follower` — accessed via `inst.components.follower:GetLeader()`.

**Tags:**
- `notarget` — checked on potential face targets to prevent targeting entities marked with this tag.

## Properties
No public instance properties are initialized or used in the constructor. Behavior configuration is handled through local constants and function references.

## Main functions
### `RookBrain:OnStart()`
* **Description:** Initializes and sets the behavior tree for the Rook. Constructs a priority-based behavior tree with multiple concurrently evaluated branches that handle panic, trading wait, ramming, dodging, returning home, following, facing, and idle states.
* **Parameters:** None.
* **Returns:** None.
* **Error states:** None documented. Behavior tree construction assumes required components (`combat`, `follower`, `brain`) are attached.

## Events & listeners
No event listeners or events pushed are defined or used directly by this component. It operates solely via the behavior tree evaluation loop.