---
id: spider_buffs
title: Spider Buffs
description: Creates temporary debuff prefabs applied to spiders to enforce behaviors like whistle immunity, bedazzlement, and summoning.
tags: [combat, buff, ai]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: f8fe2d32
system_scope: entity
---

# Spider Buffs

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
`spider_buffs.lua` defines three prefabs—`spider_whistle_buff`, `bedazzle_buff`, and `spider_summoned_buff`—that implement temporary debuff effects on spiders. Each debuff is a non-persistent, non-networked entity that applies behavioral modifiers via the `debuff` component. When attached, the debuff modifies target properties (e.g., `defensive`, `no_targeting`, `bedazzled`, `summoned`) and sets up decay timers via `DoTaskInTime`. Detachment restores prior states and cleans up. These prefabs are used by spider-related gameplay mechanics (e.g., Spider Whistle, Wickerbottom's Bedazzlement) to influence spider behavior and AI targeting.

## Usage example
```lua
-- Apply a whistle buff to a spider
local buff = Prefab("spider_whistle_buff"):GenerateEntity()
target:AddComponent("debuff")
target.components.debuff:AddDebuff(buff)

-- Apply a bedazzlement debuff to a spider
local buff = Prefab("bedazzle_buff"):GenerateEntity()
target:AddComponent("debuff")
target.components.debuff:AddDebuff(buff)

-- Apply a summoning debuff to a spider
local buff = Prefab("spider_summoned_buff"):GenerateEntity()
target:AddComponent("debuff")
target.components.debuff:AddDebuff(buff)
```

## Dependencies & tags
**Components used:** `debuff`, `combat`, `follower`, `health`  
**Tags:** Adds `CLASSIFIED` to internal buff entities; does not modify tags on target entities.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `duration` | number | `TUNING.SPIDER_WHISTLE_DURATION`, `TUNING.BEDAZZLEMENT_DURATION`, or `TUNING.SPIDER_SUMMON_TIME + random(0,2)` | Lifetime of the debuff in seconds before automatic removal. |
| `extendedfn` | function | nil (set per prefab) | Callback executed on debuff attach or extension; defines behavioral effects. |
| `detachfn` | function | nil (set per prefab) | Callback executed on debuff detachment; defines state restoration logic. |
| `decaytimer` | Task | nil | Internal timer task used to stop the debuff after `duration` seconds. |

## Main functions
### `OnAttached(inst, target)`
*   **Description:** Initializes and starts the debuff when attached to a target. Calls `OnExtended` and schedules a delayed self-removal via `debuff:Stop()`.
*   **Parameters:** `inst` (Entity) — the debuff instance; `target` (Entity) — the entity receiving the debuff.
*   **Returns:** Nothing.
*   **Error states:** No explicit error handling; assumes valid `target`.

### `OnExtended(inst, target)`
*   **Description:** Resets or extends the debuff timer and executes the `extendedfn` callback. Cancels any existing `decaytimer` before setting a new one.
*   **Parameters:** `inst` (Entity) — the debuff instance; `target` (Entity) — the debuffed entity.
*   **Returns:** Nothing.
*   **Error states:** No explicit error handling; silently does nothing if `extendedfn` or `decaytimer` is `nil`.

### `OnDetached(inst, target)`
*   **Description:** Cleans up the debuff when detached. Cancels the decay timer, executes `detachfn`, and removes the debuff entity.
*   **Parameters:** `inst` (Entity) — the debuff instance; `target` (Entity) — the debuffed entity.
*   **Returns:** Nothing.

### `whistle_fn()`
*   **Description:** Factory function that constructs and configures the `spider_whistle_buff` prefab. Sets `defensive` and `no_targeting` on the target, drops its combat target if present.
*   **Parameters:** None.
*   **Returns:** `inst` (Entity) — the configured debuff entity (not yet added to a target).
*   **Error states:** Returns a dead entity immediately if called on the client (`not TheWorld.ismastersim`).

### `bedazzle_fn()`
*   **Description:** Factory function for `bedazzle_buff`. Applies `bedazzled` state and triggers `hit` state + `SetHappyFace(true)` if not already bedazzled and not following a leader. Restoration logic undoes this on detach.
*   **Parameters:** None.
*   **Returns:** `inst` (Entity) — the configured debuff entity.

### `summon_fn()`
*   **Description:** Factory function for `spider_summoned_buff`. Sets `summoned = true` on the target; sets to `false` on detach.
*   **Parameters:** None.
*   **Returns:** `inst` (Entity) — the configured debuff entity.

## Events & listeners
- **Listens to:** None directly (uses `debuff` component events internally).
- **Pushes:** None directly (event behavior is handled by the `debuff` component callbacks).