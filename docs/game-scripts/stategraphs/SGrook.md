---
id: SGrook
title: Sgrook
description: Manages the state machine for the Rook boss entity, handling movement (walk/run), attacks (ram/charge), stuns, sleep, death, and environmental interactions.
tags: [ai, boss, locomotion, combat]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: stategraphs
source_hash: 6cd7e4ab
system_scope: entity
---

# Sgrook

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`SGrook` defines the full stategraph for the Rook boss—a large, ramming enemy in DST. It orchestrates movement (walking, running with momentum, skidding to stop), combat (ramming attacks using `DoRamAOE`), stun recovery chains (via `stun_*` states), sleep/wake sequences, and environmental hazards (void fall, sinking, freezing, electrocution). It coordinates closely with `combat`, `health`, `locomotor`, and `sleeper` components, and imports shared utilities from `commonstates` and `clockwork_common`.

## Usage example
The `SGrook` stategraph is registered and used internally by the Rook prefab. Modders typically do not instantiate it directly but may extend or override its states via mod hooks. An example of how it's integrated:

```lua
local inst = CreateEntity()
inst:AddTag("rook")
inst:AddComponent("combat")
inst:AddComponent("health")
inst:AddComponent("locomotor")
inst:AddComponent("sleeper")
inst.sg = StateGraph("rook", inst, states, events, "idle")
inst:PushEvent("death") -- triggers death state if active
```

## Dependencies & tags
**Components used:**  
- `combat` – for attack handling, target checking, cooldowns, and hit range.
- `health` – for death detection and kill calls.
- `locomotor` – for movement control (walk/run/stop/hopping).
- `sleeper` – for sleep/wake transitions.

**Tags added/removed/checks:**  
- State tags: `idle`, `canrotate`, `moving`, `running`, `busy`, `atk_pre`, `runningattack`, `hit`, `stunned`, `nosleep`, `noelectrocute`, `caninterrupt`, `running_collides`, `jumping`.  
- Entity tags: `"smashable"` (checked in RAM logic), `"ChaseAndRam"` (used for hard-turn logic).

## Properties
No public properties are exposed. State memory (`inst.sg.statemem`, `inst.sg.mem`) is used to track transient runtime values like `runcancels`, `lastrunhit`, `hittarget`, `quickattack`, `stunhits`, `nextstate`, and `speed`.

## Main functions
### `CanQuickStartRun(inst)`
*   **Description:** Determines if the Rook can skip run-start animation and go directly to "run" based on cooldown timing.
*   **Parameters:** `inst` (Entity) – the Rook instance.
*   **Returns:** `true` if `GetTime() > (lastrunhit + min_attack_period)`, else `false`.

### `DoRamAOE(inst)`
*   **Description:** Executes the Rook's forward-area charge attack. Finds and damages targets in front within range; destroys `smashable` targets and kills entities with `health` component.
*   **Parameters:** `inst` (Entity) – the Rook instance.
*   **Returns:** Two booleans: `hitany` (true if any target was hit), `hittarget` (true if the combat target was hit).
*   **Error states:** Temporarily sets `combat.ignorehitrange = true`; does not trigger combat cooldown itself.

### `DoShake(inst)`
*   **Description:** Triggers a camera shake effect when the Rook lands from a jump or is stunned.
*   **Parameters:** `inst` (Entity) – source entity (often ignored in favor of `inst` passed in).
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  - `doattack` – initiates `runningattack` or starts movement toward target.  
  - `locomote` – manages transitions between walk/run states based on `WantsToMoveForward` and `WantsToRun`. Handles run cancellations and hard turns.  
  - `animover` – transitions to `idle` after animations complete in several states.  
  - Events from `CommonHandlers` (death, sleep/wake, freeze, electrocution, hop, sink, void fall).

- **Pushes:**  
  - `attackstart` – fired on first entry into `run` state to signal combat start.  
  - `gotosleep` – via `sleeper` component integration.  
  - Internal animation events (e.g., `doattack` during `hit` state).