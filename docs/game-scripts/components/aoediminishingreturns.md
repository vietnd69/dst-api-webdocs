---
id: aoediminishingreturns
title: Aoediminishingreturns
description: Tracks diminishing return multipliers for area-of-effect damage using SourceModifierList.
tags: [combat, damage, aoe]
sidebar_position: 10
last_updated: 2026-04-28
build_version: 722832
change_status: stable
category_type: components
source_hash: 689c7f10
system_scope: combat
---

# Aoediminishingreturns

> Based on game build **722832** | Last updated: 2026-04-28

## Overview
`Aoediminishingreturns` manages diminishing return multipliers for area-of-effect (AOE) damage calculations. It wraps the `SourceModifierList` utility to track per-source modifiers that combine multiplicatively. This component is typically added to entities that deal AOE damage to prevent stacking exploits from multiple sources.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("aoediminishingreturns")

-- Add a modifier from a specific source entity
inst.components.aoediminishingreturns.mult:SetModifier(source_entity, 0.5, "fire_damage")

-- Get the combined multiplier value
local effective_mult = inst.components.aoediminishingreturns.mult:Get()

-- Modifiers are automatically reset when component is removed
inst:RemoveComponent("aoediminishingreturns")
```

## Dependencies & tags
**External dependencies:**
- `util/sourcemodifierlist` -- provides the SourceModifierList class for tracking per-source modifiers

**Components used:**
- None identified

**Tags:**
- None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | entity | --- | The owning entity instance. Used for SourceModifierList initialization. |
| `mult` | SourceModifierList | base `1` | Tracks per-source AOE damage multipliers; combined via multiplication. Call `Get()` for effective value. |

## Main functions
### `OnRemoveFromEntity()`
* **Description:** Cleanup function called when the component is removed from its entity. Resets all modifiers in the SourceModifierList to prevent stale data persistence.
* **Parameters:** None
* **Returns:** nil
* **Error states:** None

## Events & listeners
None identified.