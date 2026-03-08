---
id: SGeyeofterror
title: Sgeyeofterror
description: Manages the state machine for the Eye of Terror boss, handling movement, attacks, minion spawning, transformation, and lifecycle events.
tags: [ai, boss, combat, stategraph]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: stategraphs
source_hash: 4be9042c
system_scope: entity
---

# Sgeyeofterror

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`Sgeyeofterror` is a state graph for the Eye of Terror boss entity. It orchestrates the entity's behavior through states such as `idle`, `charge`, `chomp`, `spawnminieyes`, `transform`, `flyaway`, and `death`. It integrates closely with components like `combat`, `locomotor`, `commander`, `health`, `freezable`, `sleeper`, `epicscare`, `stuckdetection`, `knownlocations`, and `timer`. State transitions are triggered by both internal timers/events (e.g., animation completion) and external events (e.g., `chomp`, `charge`, `spawnminieyes`). The SG supports two forms: normal and transformed (`mouth` variant), and manages state-specific tags for blocking actions (e.g., `busy`, `nosleep`, `nofreeze`, `flight`).

## Usage example
```lua
-- Typically used internally by the Eye of Terror prefab.
-- The StateGraph is registered and used as the entity's SG.
return StateGraph("eyeofterror", states, events, "init")
```

## Dependencies & tags
**Components used:**  
`combat`, `locomotor`, `commander`, `health`, `freezable`, `sleeper`, `epicscare`, `stuckdetection`, `knownlocations`, `timer`, `complexprojectile`

**Tags added/removed by states:**  
- `busy`, `idle`, `canrotate`, `charge`, `focustarget`, `spawnminieyes`, `nosleep`, `nofreeze`, `noelectrocute`, `nostun`, `noaoestun`, `noattack`, `flight`, `leaving`

## Properties
No public properties. This is a state graph definition returning a `StateGraph` object; configuration is done via prefab-specific `_cooldowns`, `_chargedata`, `_chompdamage`, and `_mouthspawncount` fields attached to `inst`.

## Main functions
No top-level public functions. All behavior is encapsulated within state definitions and event handlers.

## Events & listeners
- **Listens to:**  
  `doattack`, `spawnminieyes`, `chomp`, `charge`, `focustarget`, `health_transform`, `leave`, `arrive`, `flyback`, `animover`, `doattack`, `on_landed`, `on_no_longer_landed`, `epicscare`, `forgetme`, `finished_leaving`, `turnoff_terrarium`  
  (also via `CommonHandlers.OnLocomote`, `OnSleepEx`, `OnWakeEx`, `OnFreeze`, `OnElectrocute`, `OnAttacked`, `OnDeath`, `OnCorpseChomped`, `OnNoSleepTimeEvent`, `OnNoSleepAnimOver`, `OnNoSleepFrameEvent`)

- **Pushes:**  
  `on_landed`, `on_no_longer_landed`, `finished_leaving`, `forgetme`, `turnoff_terrarium`  
  (and standard common-state events: `locomote`, `sleep`, `wake`, `freeze`, `electrocute`, `attacked`, `death`, `corpse_chomped`, `gotcommander`, `soldierschanged`, etc.)