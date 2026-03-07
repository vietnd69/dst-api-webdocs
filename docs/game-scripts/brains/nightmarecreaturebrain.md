---
id: nightmarecreaturebrain
title: Nightmarecreaturebrain
description: AI brain component for Nightmare Creatures that manages combat, harassment, and loiter behaviors, including conditional battle cries and shadow dominance submissions.
tags: [ai, combat, boss]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: brain
source_hash: d433bfcb
system_scope: brain
---

# Nightmarecreaturebrain

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`NightmareCreatureBrain` implements the behavior tree logic for Nightmare Creatures, enabling dynamic combat responses including enemy submission to shadow-dominant targets, harassment with battle cries, and loitering patterns. It integrates with the `combat`, `shadowsubmissive`, `locomotor`, `knownlocations`, and `behaviour` systems to orchestrate attack, chase, taunt, and wander actions.

## Usage example
```lua
local inst = CreateEntity()
inst:AddTag("nightmarecreature")
inst:AddComponent("combat")
inst:AddComponent("shadowsubmissive")
inst:AddComponent("locomotor")
inst:AddComponent("knownlocations")
inst:AddComponent("talker")
inst.brain = NightmareCreatureBrain(inst)
inst.brain:OnStart()
```

## Dependencies & tags
**Components used:** `combat`, `shadowsubmissive`, `locomotor`, `knownlocations`, `talker`, `behaviour`
**Tags:** Checks `shadowdominance` (via `shadowsubmissive:ShouldSubmitToTarget`)

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `_harasstarget` | `Entity` or `nil` | `nil` | Stores the target for harassment (set when shadow submission occurs). |

## Main functions
### `OnStart()`
* **Description:** Initializes the behavior tree for the Nightmare Creature with priority-ordered branches: panic, attack, harass, loiter, and basic wander.
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** Requires the `combat`, `shadowsubmissive`, `locomotor`, and `knownlocations` components to be present on `self.inst`; otherwise the conditional checks may fail or return incorrect results.

## Events & listeners
*None identified.*
