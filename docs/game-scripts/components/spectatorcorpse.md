---
id: spectatorcorpse
title: Spectatorcorpse
description: This component enables a player entity to automatically track and focus on a nearby living player while spectating as a corpse, adjusting focus range and target priority dynamically.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: world
source_hash: 127e611c
---

# Spectatorcorpse

## Overview
The `spectatorcorpse` component manages automated camera focus behavior for a player entity that has become a corpse and is spectating (e.g., after dying and before respawning). While active (i.e., the player is spectating), it periodically scans for the nearest valid living, visible player within range and directs the world focal point to track that target using a smooth approach behavior. It responds to player activation/deactivation lifecycle events and synchronization of spectating state across the network.

## Dependencies & Tags
- Relies on the `focalpoint` component (used via `TheFocalPoint.components.focalpoint`) to manage camera focus.
- Requires `TheFocalPoint` global to exist.
- Does not explicitly add or remove entity tags.
- Relies on the `AllPlayers` global list and `IsEntityDeadOrGhost` utility function.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | — | Reference to the entity this component is attached to. |
| `lasttarget` | `Entity?` | `nil` | The most recently selected spectating target player (to prioritize stickiness). |
| `str` | `number` | `0` | Current approach strength ( interpolated toward `maxrange` while updating). |
| `maxrange` | `number` | `40` | Maximum distance (squared threshold calculation uses this linear value) within which a player is considered a candidate target. |
| `startspeed` | `number` | `0.5` | Rate at which `str` increases toward `maxrange` per update. |
| `priority` | `number` | `1` | Priority level used when starting focus; higher values may override lower-priority sources. |
| `active` | `boolean` | `false` | Indicates whether the component has been activated via the player’s `playeractivated` event. |
| `updating` | `boolean` | `false` | Whether the `OnUpdate` loop is currently running. |
| `_isspectating` | `net_bool` | — | Networked boolean property representing whether the entity is currently spectating (i.e., is a ghost corpse). Triggers state changes via `"isspectatingdirty"` events. |

## Main Functions

### `SpectatorCorpse:OnUpdate()`
* **Description:** Runs periodically while `updating` is true (i.e., when the entity is spectating and active). Computes the nearest living, visible player within range, adjusting for a small proximity bonus for the previously selected target. If a target is found, it starts a focus source called `"CorpseCam"` targeting that player; otherwise, it stops focus. It also smoothly increases `str` (approach strength) toward `maxrange`.
* **Parameters:** None (called internally by the ECS update loop).

## Events & Listeners
- **Listens for:**
  - `"playeractivated"` → triggers `OnPlayerActivated`
  - `"playerdeactivated"` → triggers `OnPlayerDeactivated`
  - `"isspectatingdirty"` → triggers `OnIsSpectatingDirty` (client-only registration)
  - `"ms_becameghost"` → triggers `OnBecameCorpse` (server-only)
  - `"ms_respawnedfromghost"` → triggers `OnRezFromCorpse` (server-only)

- **Triggers / pushes:**
  - `"isspectatingdirty"` (implicitly via `net_bool` sync — no explicit push; state changes are signaled through `set()` and the network layer)