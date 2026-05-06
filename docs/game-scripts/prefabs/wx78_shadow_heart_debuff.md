---
id: wx78_shadow_heart_debuff
title: Wx78 Shadow Heart Debuff
description: Server-only prefab entity that applies a timed debuff to WX-78 players via the skills system, automatically expiring after a configured duration or when the target dies.
tags: [prefab, debuff, wx78, skills]
sidebar_position: 10
last_updated: 2026-05-01
build_version: 722832
change_status: stable
category_type: prefabs
source_hash: 40690347
system_scope: entity
---

# Wx78 Shadow Heart Debuff

> Based on game build **722832** | Last updated: 2026-05-01

## Overview
`wx78_shadow_heart_debuff.lua` registers a server-only prefab entity that applies a timed debuff effect to WX-78 players through the skills system. The entity is immediately removed on clients (not meant for client simulation) and uses the `debuff` component to track attachment state and expiration. The debuff automatically expires after `TUNING.SKILLS.WX78.SHADOWHEART_DEBUFF_TIME` seconds or when the target entity dies.

## Usage example
```lua
-- Spawn the debuff entity on master sim:
if TheWorld.ismastersim then
    local debuff_inst = SpawnPrefab("wx78_shadow_heart_debuff")
    
    -- The debuff component handles attachment via SetAttachedFn
    -- No manual positioning needed - it parents to target automatically
end

-- Access the TUNING constant for duration:
local duration = TUNING.SKILLS.WX78.SHADOWHEART_DEBUFF_TIME
```

## Dependencies & tags
**Components used:**
- `debuff` -- manages debuff lifecycle; `SetAttachedFn`, `SetExtendedFn`, `Stop` methods called

**Tags:**
- `CLASSIFIED` -- added in fn(); hides entity from most targeting and selection systems

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `TUNING.SKILLS.WX78.SHADOWHEART_DEBUFF_TIME` | constant | --- | Duration in seconds before the debuff automatically expires. |

## Main functions
### `expire(inst)` (local)
*   **Description:** Forces the debuff to end by calling `debuff:Stop()` on the instance. Called when the expiration task fires or when the target dies.
*   **Parameters:**
    - `inst` -- the debuff entity instance
*   **Returns:** None
*   **Error states:** None — guards against missing `debuff` component with nil check before calling `Stop()`.

### `buff_OnAttached(inst, target)` (local)
*   **Description:** Callback fired when the debuff is attached to a target entity. Parents the debuff entity to the target, resets position to origin, and registers a death listener on the target to trigger early expiration.
*   **Parameters:**
    - `inst` -- the debuff entity instance
    - `target` -- the entity receiving the debuff effect
*   **Returns:** None
*   **Error states:** None — target is guaranteed valid by the debuff component when this callback fires.

### `buff_OnExtended(inst)` (local)
*   **Description:** Callback fired when the debuff duration is extended (e.g., refreshed). Cancels any existing expiration task and schedules a new one using the TUNING constant. Ensures only one expiration task is active at a time.
*   **Parameters:**
    - `inst` -- the debuff entity instance
*   **Returns:** None
*   **Error states:** None — safely handles nil `expiretask` before cancelling.

### `fn()`
*   **Description:** Prefab constructor. On client, immediately removes the entity (server-only). On master, creates the entity with transform, hides it visually, adds `CLASSIFIED` tag, attaches the `debuff` component with callbacks, and starts the initial expiration timer.
*   **Parameters:** None
*   **Returns:** entity instance (client returns early with removed entity; master returns active debuff entity)
*   **Error states:** None — client-side removal is intentional design, not an error condition.

## Events & listeners
**Listens to:**
- `death` (on target entity) -- triggered in `buff_OnAttached`; calls `expire(inst)` when the debuff target dies, ending the effect early

**Pushes:**
- None identified

**World state watchers:**
- None