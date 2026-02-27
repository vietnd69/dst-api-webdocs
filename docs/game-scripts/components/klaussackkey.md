---
id: klaussackkey
title: Klaussackkey
description: This component manages a special key item that signals the restoration of Klaus's sack via a global event when marked as the true key.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: world
source_hash: 00bb7a0e
---

# Klaussackkey

## Overview
The `KlausSackKey` component is assigned to aprefab and marks the entity with the `"klaussackkey"` tag. It provides logic to set or unset the "true key" state, which—when enabled during gameplay—immediately triggers the `"ms_restoreklaussackkey"` global event to restore Klaus's sack. If set during world population, it schedules the restoration event for immediate execution after population completes.

## Dependencies & Tags
- Adds the `"klaussackkey"` tag to the entity upon construction.
- Removes the `"klaussackkey"` tag when the component is removed from the entity.
- Uses the `TheWorld:PushEvent` mechanism to emit `"ms_restoreklaussackkey"`.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | — | Reference to the entity the component is attached to. |
| `truekey` | `boolean?` | `nil` | Tracks whether this instance is the designated true key (`true` when set, `nil` otherwise). |
| `task` | `Task?` | `nil` | Stores a scheduled delayed task used to defer the restoration event until after world population completes. |

## Main Functions
### `KlausSackKey:SetTrueKey(truekey)`
* **Description:** Sets or unsets the "true key" status for this item. When set to `true`, it triggers the `"ms_restoreklaussackkey"` event (immediately or post-population, depending on context). When set to `false` (or falsy), it clears the true key state and cancels any pending task.
* **Parameters:**
  - `truekey` (`boolean`): If truthy, marks this instance as the true key and schedules/restores the sack; if falsy, clears the key status.

## Events & Listeners
- Listens for internal scheduling logic via `self.inst:DoTaskInTime(...)` (used during world population).
- Triggers the `"ms_restoreklaussackkey"` event on `TheWorld` when the key is set and conditions allow.
- On component removal, calls `OnRemoveFromEntity()`, which cancels pending tasks and removes the `"klaussackkey"` tag from `inst`.