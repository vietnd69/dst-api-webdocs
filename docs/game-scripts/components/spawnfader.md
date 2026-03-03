---
id: spawnfader
title: Spawnfader
description: Manages visibility fading for newly spawned entities to reduce abrupt appearance.
tags: [network, fx, entity]
sidebar_position: 1
last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 4c69e3f2
system_scope: fx
---
# Spawnfader

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Spawnfader` controls the fade-in or fade-out animation for an entity’s visual appearance upon spawning. It handles smooth alpha transitions via colour override on the entity's `AnimState`, ensuring entities do not appear suddenly. This component is designed to run only on the client in multiplayer environments, syncing its state via `net_tinybyte` and `net_bool` types. It also manages the `NOCLICK` tag to prevent interaction during fading.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("spawnfader")
-- Fade the entity in upon spawn
inst.components.spawnfader:FadeIn()
-- Or fade it out if it should appear from behind a screen
inst.components.spawnfader:FadeOut()
```

## Dependencies & tags
**Components used:** `AnimState` (via `self.inst.AnimState:OverrideMultColour(...)`), `highlightchildren` (optional entity property)
**Tags:** Adds `NOCLICK` during active fade; removes it upon completion.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `_fade` | `net_tinybyte` | (network variable) | Network variable storing scaled fade progress (0–7), used for replication and sync. |
| `_fadeout` | `net_bool` | (network variable) | Network boolean indicating whether fading out (`true`) or fading in (`false`). |
| `fadeval` | number | `0` | Local alpha progress value: `1.0` initially (fully faded), decreasing over time to `0` (fully visible). |
| `updating` | boolean | `false` | Whether the component is actively updating the fade animation. |

## Main functions
### `FadeIn()`
* **Description:** Starts a fade-in sequence, gradually revealing the entity over time. Also adds the `NOCLICK` tag until fade completes.
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** Safe to call multiple times; re-initiates the fade.

### `FadeOut()`
* **Description:** Starts a fade-out sequence, gradually making the entity invisible over time. Also adds the `NOCLICK` tag until fade completes.
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** Safe to call multiple times; re-initiates the fade.

### `Cancel()`
* **Description:** Immediately stops the fade and sets `fadeval` to zero, causing immediate visibility.
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** Only effective if `updating` is `true`; otherwise has no effect.

### `OnUpdate(dt)`
* **Description:** Called every frame during fading to update the alpha multiplier using a quadratic ease-out curve. Applies colour override to the entity and its highlight children.
* **Parameters:** `dt` (number) — time elapsed since last frame.
* **Returns:** Nothing.
* **Error states:** None; handles zero or negative `fadeval` by halting updates and pushing completion events.

### `OnRemoveFromEntity()`
* **Description:** Cleans up event listeners when the component is removed from an entity.
* **Parameters:** None.
* **Returns:** Nothing.

## Events & listeners
- **Listens to:** `fadedirty` — triggers immediate fade update from network sync (`OnFadeDirty`).
- **Listens to:** `death` — cancels any active fade when the entity dies (`OnDeath`).
- **Pushes:** `spawnfaderin` — fired when fade-in completes (`fadeval <= 0` and `fadingout == false`).
- **Pushes:** `spawnfaderout` — fired when fade-out completes (`fadeval <= 0` and `fadingout == true`).
