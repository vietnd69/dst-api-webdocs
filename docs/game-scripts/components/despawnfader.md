---
id: despawnfader
title: Despawnfader
description: Manages visual fading and removal of an entity when it is marked for despawning.
tags: [fade, despawn, entity, network]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: e7e7c1fe
system_scope: entity
---

# Despawnfader

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`DespawnFader` handles the visual fading-out of an entity and ensures its removal after the fade completes. It supports both master and client simulation, synchronizing the fade progress across the network via `net_tinybyte`. When activated (e.g., via `FadeOut()`), the entity's opacity fades linearly over time, and the entity is either removed on the master or ceases updating on clients once faded.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("despawnfader")
inst.components.despawnfader:FadeOut()
-- The entity will fade out visually and be removed after ~1 second
```

## Dependencies & tags
**Components used:** `AnimState`, `persists`, `replica.despawnfader._fade`
**Tags:** Adds `NOCLICK` during fading; removes the entity entirely when fade completes.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `fadeval` | number | `0` | Current fade progress, ranging from `1` (fully opaque) to `0` (fully transparent). |
| `updating` | boolean | `false` | Whether the component is currently being updated via `StartUpdatingComponent`. |
| `_fade` | net_tinybyte | `net_tinybyte(inst.GUID, ...)` | Networked value representing fade progress, synced as an integer scaled by `7`. |

## Main functions
### `FadeOut()`
* **Description:** Initiates the fade-out sequence: sets fade progress to full, starts updates, disables click interaction, and disables persistence.
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** No-op if already fading (i.e., `updating` is `true`); otherwise begins the fade and transition.

### `OnUpdate(dt)`
* **Description:** Runs each frame during fading; updates opacity based on `fadeval`, syncs progress on master, and removes the entity when fade completes.
* **Parameters:** `dt` (number) — Delta time in seconds since last frame.
* **Returns:** Nothing.
* **Error states:** On clients, stops updating when `fadeval <= 0`; on master, removes the entity instance.

### `OnRemoveFromEntity()`
* **Description:** Cleans up event listeners on the client side when the component is removed.
* **Parameters:** None.
* **Returns:** Nothing.

## Events & listeners
- **Listens to:** `fadedirty` — triggers manual recalculation of `fadeval` on clients when the networked value changes (via `_fade` update).
- **Pushes:** None.
