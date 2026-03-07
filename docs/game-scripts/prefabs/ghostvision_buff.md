---
id: ghostvision_buff
title: Ghostvision Buff
description: Applies a networked night vision effect to players by manipulating lighting and colour correction, while managing buff lifetime and persistence.
tags: [vision, buff, network, persistence]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 8c82348f
system_scope: player
---

# Ghostvision Buff

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
The `ghostvision_buff` prefab is a temporary buff component that grants forced night vision to the player. It is not a traditional component, but a lightweight entity prefab that is attached to the player as a parented entity. When attached, it uses the `playervision` component to push custom colour cubes and ambient overrides for night vision, and it persists across save/load cycles using custom `OnSave`/`OnLoad` handlers. It also integrates with the `debuff` system to handle lifecycle events like detachment and expiration.

## Usage example
This prefab is typically created and applied as a debuff via the `debuff` component of a player entity:
```lua
local inst = SpawnPrefab("ghostvision_buff")
player:AddDebuff(inst, "ghostvision_buff")
```
The buff automatically manages its lifetime, applying and removing night vision as it is attached/detached.

## Dependencies & tags
**Components used:** `debuff`, `playervision`, `sanity`
**Tags:** Adds `CLASSIFIED` tag.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst._enabled` | `net_bool` | — | Networked boolean controlling whether the effect is active. |
| `inst.task` | `task` | `nil` | Timer handle for triggering expiration after a delay. |

## Main functions
### `buff_OnAttached(inst, target)`
*   **Description:** Called when the buff is attached to a target (typically the player). Attaches the buff entity to the target, sets it to be invisible and persistent, and requests night vision via `playervision:PushForcedNightVision`.
*   **Parameters:** `inst` (Entity) — the buff instance; `target` (Entity) — the entity receiving the buff.
*   **Returns:** Nothing.
*   **Error states:** No explicit error handling; assumes `target.components.playervision` exists if non-nil.

### `buff_OnDetached(inst, target)`
*   **Description:** Called when the buff is removed. Removes forced night vision from the player via `playervision:PopForcedNightVision`, removes sanity modifiers, and schedules delayed removal of the buff entity.
*   **Parameters:** `inst` (Entity) — the buff instance; `target` (Entity) — the entity that lost the buff.
*   **Returns:** Nothing.
*   **Error states:** Safely handles `target == nil`, invalid targets, or missing components.

### `buff_Expire(inst)`
*   **Description:** Triggers debuff removal, effectively ending the effect. Called when the timer completes.
*   **Parameters:** `inst` (Entity) — the buff instance.
*   **Returns:** Nothing.

### `buff_OnExtended(inst)`
*   **Description:** Called when the debuff duration is extended (e.g., re-applied). Cancels the pending expiration timer to prevent early termination.
*   **Parameters:** `inst` (Entity) — the buff instance.
*   **Returns:** Nothing.

### `buff_OnLongUpdate(inst, dt)`
*   **Description:** Adjusts the expiration timer in sync with game time (used on master sim). Handles drift from normal frame-based timing.
*   **Parameters:** `inst` (Entity) — the buff instance; `dt` (number) — elapsed delta time.
*   **Returns:** Nothing.

### `buff_OnEnabledDirty(inst)`
*   **Description:** Client-side handler for `_enabled` boolean changes. Syncs night vision state (on/off) with `playervision` when the effect is toggled.
*   **Parameters:** `inst` (Entity) — the buff instance.
*   **Returns:** Nothing.
*   **Error states:** Only acts if `ThePlayer` exists and is the parent.

## Events & listeners
- **Listens to:** `death` (on target) — stops the debuff when the player dies.
- **Pushes:** None (does not fire custom events).
- **Network events:** Listens to `enableddirty` (client) to handle `_enabled` changes.
