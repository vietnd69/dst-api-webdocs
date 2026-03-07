---
id: meteorwarning
title: Meteorwarning
description: Renders a fading shadow FX entity that warns players of an incoming meteor impact during meteor showers.
tags: [fx, weather, warning, entity]
sidebar_position: 10

last_updated: 2026-03-06
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: ce303b2e
system_scope: fx
---

# Meteorwarning

> Based on game build **714014** | Last updated: 2026-03-06

## Overview
`meteorwarning` is a lightweight FX prefab that visually represents an incoming meteor threat by displaying a dynamic shadow. It uses networked properties (`_fade`, `_fadeend`, `_period`) to synchronize fade state across clients and updates the entity's alpha (via `AnimState:OverrideMultColour`) to simulate a pulsing or fading warning effect. The entity is non-interactive (`NOCLICK`), purely decorative (`FX`), and self-destructs after fading completes.

It is instantiated during meteor shower events — specifically when a meteor impact is imminent — and plays a one-time spawn sound (`dontstarve/common/meteor_spawn`).

## Usage example
This component is instantiated internally by the game during meteor events and is not typically added manually by mods. A typical instantiation occurs via `SpawnPrefab("meteorwarning")`, optionally with a custom fade profile:

```lua
local warning = SpawnPrefab("meteorwarning")
if warning and warning.startfn then
    -- Start a 2-second fade from 33% to 100% opacity
    warning.startfn(warning, 2, 0.33, 1.0)
end
```

## Dependencies & tags
**Components used:** `transform`, `animstate`, `soundemitter`, `network`  
**Tags:** Adds `FX`, `NOCLICK`.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `_fade` | `net_smallbyte` | `AlphaToFade(0.33)` | Current fade level (0–63), representing alpha scaled to 8-bit. |
| `_fadeend` | `net_smallbyte` | `AlphaToFade(1.0)` | Target fade level (0–63) to reach before stopping. |
| `_period` | `net_float` | `1.0` | Time interval (seconds) between fade increments. |
| `_task` | `Task` | `nil` | Periodic task used to update fade state on the client. |
| `startfn` | function | `nil` (assigned on master only) | Function reference to manually re-trigger the fade sequence. |

## Main functions
### `startshadow(inst, time, starttint, endtint)`
* **Description:** Configures and initiates the fade animation. Only callable on the master simulation. Does nothing if using default parameters (no-op optimization).
* **Parameters:**
  * `time` (number) — Total duration of the fade in seconds.
  * `starttint` (number) — Starting alpha (0.0–1.0); defaults to `0.33`.
  * `endtint` (number) — Ending alpha (0.0–1.0); defaults to `1.0`.
* **Returns:** Nothing.
* **Error states:** No explicit failure; uses `AlphaToFade` to clamp inputs to valid `byte` range (0–63).

### `PushAlpha(inst)`
* **Description:** Applies the current `_fade` value as the entity’s mult colour alpha. Called during initialization and whenever fade properties change.
* **Parameters:**
  * `inst` (Entity) — The meteorwarning entity instance.
* **Returns:** Nothing.

### `UpdateFade(inst)`
* **Description:** Advances `_fade` by `1` per `_period` interval until `_fade` reaches `_fadeend`. Cancels its own task upon completion.
* **Parameters:**
  * `inst` (Entity) — The meteorwarning entity instance.
* **Returns:** Nothing.

### `OnFadeDirty(inst)`
* **Description:** Restarts the fade update task with the latest `_period`. Called on property changes (networked via `"fadedirty"` event).
* **Parameters:**
  * `inst` (Entity) — The meteorwarning entity instance.
* **Returns:** Nothing.

## Events & listeners
- **Listens to:** `fadedirty` — triggers `OnFadeDirty` on clients to resync the fade loop.
- **Pushes:** None (does not emit events beyond internal task lifecycle).