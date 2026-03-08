---
id: SGrabbitking
title: Sgrabbitking
description: Defines the state machine for the Rabbit King character, handling movement, idle behaviors, abilities (summon and dropkick), burrowing, and status effects like stun and stun-locked states.
tags: [ai, boss, locomotion, combat, stategraph]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: stategraphs
source_hash: 239d91f8
system_scope: entity
---

# Sgrabbitking

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`SGrabbitking` is the StateGraph implementation for the Rabbit King entity in DST. It manages all major behavioral states—including idle, movement (walk/hop, run), combat interactions (hit, stunned, trapped), ability usage (summon minions, dropkick), burrowing (in/out), and transformation between passive and aggressive forms. The state machine integrates closely with the `health`, `combat`, `locomotor`, `timer`, `inventoryitem`, `burnable`, and `colouradder` components to synchronize animation, physics, and networked state.

## Usage example
This stategraph is automatically assigned to Rabbit King prefabs during entity construction. Modders do not typically instantiate it directly but can extend or override behavior by referencing the included common states and custom events.

```lua
-- No manual instantiation required; attached by default to the rabbitking prefab
-- Example: To react to dropkick arrival, listen on the entity:
inst:ListenForEvent("dropkickarrive", function(inst, data)
    -- Custom logic when Rabbit King arrives via dropkick
end)
```

## Dependencies & tags
**Components used:**
- `health` (`IsDead`)
- `combat` (`DoAttack`)
- `locomotor` (`WantsToMoveForward`, `WantsToRun`, `Stop`, `EnableGroundSpeedMultiplier`, `RunForward`, `WalkForward`)
- `timer` (`StartTimer`, `StopTimer`)
- `leader` (`CountFollowers`)
- `inventoryitem` (`IsHeld`, `canbepickedup`, `canbepickedupalive`)
- `burnable` (`Extinguish`)
- `colouradder` (`PushColour`, `PopColour`)

**Tags added/removed:**
- Common state tags: `busy`, `idle`, `moving`, `running`, `hopping`, `canrotate`, `ability`, `charge`, `stunned`, `stuck`, `trapped`, `invisble`, `temp_invincible`, `noattack`, `nointerrupt`, `noelectrocute`
- Entity tags: `flying`, `playerghost`, `shadow`, etc. conditionally via state tags or external logic.

## Properties
No public properties defined in this stategraph file.

## Main functions
This file does not define any standalone functions; it defines a state machine. All behavior is expressed through state definitions and their lifecycle handlers (`onenter`, `onexit`, `onupdate`, `ontimeout`, `timeline`, `events`).

### Key behavioral callbacks and transitions
#### `DoKnockback(inst, target)` — local function
*   **Description:** Applies knockback to a target and returns `false` if knockback is prevented by tags.
*   **Parameters:** `inst` (entity), `target` (entity).
*   **Returns:** `boolean` — `true` if knockback was applied; `false` if the target is immune (`epic`, `nopush`).
*   **Error states:** Does not apply knockback to entities with tags `epic` or `nopush`.

## Events & listeners
- **Listens to:**  
  - `attacked` — triggers hit or electrocute state.  
  - `trapped` — enters `trapped` state.  
  - `locomote` — transitions between idle, hop, and run based on movement flags.  
  - `stunbomb`, `dotrade`, `burrowaway`, `burrowto`, `burrowarrive`, `dropkickarrive`, `becameaggressive`, `ability_summon`, `ability_dropkick` — trigger corresponding ability or transition states.  
  - Death-related events: `death`, `corpsechomped`, etc. via `CommonHandlers`.  
  - Animation over (`animover`) — drives transitions out of most animation states.  
  - State timeouts (`ontimeout`) — handles periodic state cycles (e.g., idle → look → idle, stun recovery).  
  - Physics updates (`onupdate`) — dropkick collision detection and terrain collision during fall.

- **Pushes:**  
  - `knockback` — during dropkick hit detection.  
  - `locomote` — via `locomotor:Stop()`, used to retrigger movement state evaluation.  
  - Events are also pushed internally (e.g., `animover`, `ontimeout`) by the stategraph system.
