---
id: miasmadebuff
title: Miasmadebuff
description: A non-networked server-side debuff that periodically damages targets lacking Miasma immunity, stopping when the target dies or becomes immune.
tags: [combat, debuff, environment]
sidebar_position: 10

last_updated: 2026-03-06
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 3381d1c4
system_scope: combat
---

# Miasmadebuff

> Based on game build **714014** | Last updated: 2026-03-06

## Overview
`miasmadebuff` is a non-persistent, server-only entity that acts as a debuff instance. It is designed to apply periodic damage to a target entity via the `debuff` component framework. The debuff attaches to a target, begins a periodic task to inflict damage based on `TUNING.MIASMA_DEBUFF_TICK_VALUE`, and stops automatically when the target dies, becomes a ghost, equips Miasma-immune gear, or otherwise becomes invalid. It does not persist across world loads and is hidden from clients.

## Usage example
```lua
local inst = TheWorld:SpawnPrefab("miasmadebuff")
inst.components.debuff:Attach(target)
-- Damage will be applied every MIASMA_DEBUFF_TICK_RATE seconds until stopped
```

## Dependencies & tags
**Components used:** `debuff`, `health`, `inventory`  
**Tags:** Adds `CLASSIFIED` to the debuff entity itself; checks `miasmaimmune` and `playerghost` on the target entity.

## Properties
No public properties

## Main functions
The `miasmadebuff` prefab does not define any custom public methods. Its behavior is driven entirely through the attached `debuff` component (`SetAttachedFn`, `SetDetachedFn`, `Stop`) and internal callbacks.

### `OnAttached(inst, target)`
*   **Description:** Internal callback invoked when the debuff is attached to a target. It parents the debuff entity to the target, resets its position, starts a periodic damage task, and listens for the target's `death` event.
*   **Parameters:** `inst` (Entity) — the debuff instance; `target` (Entity) — the entity being debuffed.
*   **Returns:** Nothing.
*   **Error states:** None; sets up task and listeners unconditionally.

### `OnTick(inst, target)`
*   **Description:** Internal tick callback that applies periodic damage to the target. Damage is skipped if the target is dead, a ghost, or equipped with an item tagged `miasmaimmune`.
*   **Parameters:** `inst` (Entity) — the debuff instance; `target` (Entity) — the entity being debuffed.
*   **Returns:** Nothing.
*   **Error states:** Stops the debuff early via `inst.components.debuff:Stop()` if the target fails health checks or becomes immune.

## Events & listeners
- **Listens to:** `death` — triggered on the target entity; causes the debuff to stop.
- **Pushes:** None; relies entirely on events raised by attached components (`health:DoDelta`, `debuff:Stop`).