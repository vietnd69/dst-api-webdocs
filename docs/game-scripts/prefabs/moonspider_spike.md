---
id: moonspider_spike
title: Moonspider Spike
description: A temporary attackable ground spike that performs area-of-effect attacks and then destroys itself.
tags: [combat, ai, boss, groundspike, environment]
sidebar_position: 10

last_updated: 2026-03-06
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 527e87aa
system_scope: combat
---

# Moonspider Spike

> Based on game build **714014** | Last updated: 2026-03-06

## Overview
`moonspider_spike` is a transient environmental entity that functions as a boss attack mechanism for Moon Spider encounters. It spawns as a visible spike on the ground, waits briefly, performs an area attack targeting nearby entities (respecting team and PvP rules), and then self-destructs after animation completes. It uses the `combat` component to execute attacks but is not a combat-capable entity on its own — it delegates damage logic to its parent spider (`inst.spider`). The spike is non-interactive (`NOCLICK`, `notarget`) and does not persist across sessions.

## Usage example
```lua
local inst = SpawnPrefab("moonspider_spike")
if inst ~= nil then
    inst.components.combat:SetDefaultDamage(50)
    inst.SetOwner(inst, spider_entity)
    -- The spike will automatically begin its attack lifecycle
end
```

## Dependencies & tags
**Components used:** `combat`
**Tags:** Adds `NOCLICK`, `notarget`, `groundspike`; checks `player`, `spider_moon`, `flying`, `shadow`, `ghost`, `FX`, `NOCLICK`, `DECOR`, `INLIMBO`, `playerghost`.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `spider` | `Entity` or `nil` | `nil` | The Moon Spider that spawned this spike. Used for ownership/team logic. |
| `spider_leader` | `Entity` or `nil` | `nil` | The leader of the spider (e.g., a player). Used to prevent friendly fire. |
| `spider_leader_isplayer` | boolean | `false` | Whether `spider_leader` is a player (only relevant when PvP is disabled). |
| `killed` | boolean | `false` | Flags whether the spike has already been destroyed. |
| `attack_task` | `Task` or `nil` | `nil` | Task handle for scheduled attack start. |
| `lifespan_task` | `Task` or `nil` | `nil` | Task handle for self-destruction timer. |

## Main functions
### `DoAttack(inst)`
*   **Description:** Performs the spike's area-of-effect attack. It temporarily overrides the parent spider's combat settings to fire hits at nearby valid targets within a `ATTACK_RADIUS + 3` zone, respecting team rules and dead state.
*   **Parameters:** `inst` (`Entity`) — the spike entity instance.
*   **Returns:** Nothing.
*   **Error states:** If `inst.spider` is invalid or missing, the spike itself becomes the attacker. Fails silently for invalid or dead targets.

### `KillSpike(inst)`
*   **Description:** Initiates the spike's destruction sequence: cancels scheduled tasks, plays post-anim animation, performs a final attack (if not already killed), and schedules `inst:Remove()` after animation completion.
*   **Parameters:** `inst` (`Entity`) — the spike entity instance.
*   **Returns:** Nothing.
*   **Error states:** Early exit if `inst.killed` is `true` (prevents double-destruction).

### `StartAttack(inst)`
*   **Description:** Begins the spike's attack animation sequence: plays pre-anim, triggers sound, loops animation, and schedules `KillSpike` after a random delay.
*   **Parameters:** `inst` (`Entity`) — the spike entity instance.
*   **Returns:** Nothing.

### `SetOwner(inst, spider)`
*   **Description:** Initializes ownership metadata for the spike. Copies the spider's leader (and whether the leader is a player) for use in `shouldhit`.
*   **Parameters:**  
    `inst` (`Entity`) — the spike entity instance.  
    `spider` (`Entity`) — the Moon Spider that spawned this spike.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** None explicitly (task-based timers only).
- **Pushes:** None explicitly.