---
id: spawnfader
title: Spawnfader
description: Manages visual fade-in and fade-out transitions for an entity during spawning and death using animation color overrides.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: entity
source_hash: 4c69e3f2
---

# Spawnfader

## Overview
The Spawnfader component controls the visual appearance of an entity during its spawn and death phases by smoothly transitioning its opacity via animation color overrides. It supports both server-authoritative (master sim) and client-side fading, integrates with networked state, and ensures consistent visual behavior across clients. It also manages the `NOCLICK` tag to prevent interaction during transitions.

## Dependencies & Tags
- **Component Dependencies:** Requires the entity to have a valid `AnimState` component and `highlightchildren` (optional) for child entity color overrides.
- **Tags Added:** `NOCLICK` (added while fading; removed upon completion on master sim).
- **Tags Removed:** None.
- **Network Events Used:** Listens to `"fadedirty"` and `"death"` events on non-master clients; pushes `"spawnfaderin"` and `"spawnfaderout"` events upon completion.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | `nil` | Reference to the entity the component is attached to. |
| `_fade` | `net_tinybyte` | `net_tinybyte(inst.GUID, "spawnfader._fade", "fadedirty")` | Networked property tracking fade progress (0–7 range). |
| `_fadeout` | `net_bool` | `net_bool(inst.GUID, "spawnfader._fadeout")` | Networked boolean indicating if fading is outgoing (true) or incoming (false). |
| `fadeval` | `number` | `0` | Local normalized fade value (0 = fully visible, 1 = fully hidden). |
| `updating` | `boolean` | `false` | Indicates whether the fade animation is currently running. |

## Main Functions

### `FadeIn()`
* **Description:** Initiates a fade-in animation (opacity increases from 0 to full), hiding the entity during spawn and gradually revealing it. Also adds the `NOCLICK` tag and starts the update loop.
* **Parameters:** None.

### `FadeOut()`
* **Description:** Initiates a fade-out animation (opacity decreases to 0), used during entity death. Adds the `NOCLICK` tag and starts the update loop.
* **Parameters:** None.

### `Cancel()`
* **Description:** Immediately halts the current fade animation and resets visual state to fully visible (unless already complete). Does not remove tags or stop updates automatically.
* **Parameters:** None.

### `OnUpdate(dt)`
* **Description:** Called every frame while fading to update the entity's and its children's color multiplier opacity using a quadratic easing function. Handles cleanup (tag removal, event push) when fade completes.
* **Parameters:**
  * `dt` (`number`): Delta time in seconds since the last frame.

### `OnRemoveFromEntity()`
* **Description:** Cleans up event listeners on non-master sim clients when the component is removed from its entity.
* **Parameters:** None.

## Events & Listeners
- **Listens to:**
  - `"fadedirty"` — Triggers `OnFadeDirty` to sync fade state on non-master sim clients.
  - `"death"` — Triggers `OnDeath`, which calls `Cancel()` to stop any active fade and reset state.
- **Pushes:**
  - `"spawnfaderin"` — Pushed when fade-in completes (`fadeval <= 0` and not fading out).
  - `"spawnfaderout"` — Pushed when fade-out completes (`fadeval <= 0` and fading out).