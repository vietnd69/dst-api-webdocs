---
id: SGcritter_eyeofterror
title: Sgcritter Eyeofterror
description: Defines the state graph and behavior for the Eye of Terror critter, including animation states, sound triggers, and flying mechanics.
tags: [ai, animation, sound, stategraph]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: stategraphs
source_hash: 908c9da4
system_scope: entity
---

# Sgcritter Eyeofterror

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`SGcritter_eyeofterror` is a state graph that controls the behavior and animations of the Eye of Terror critter entity. It extends reusable critter states (from `SGcritter_common.lua`) and defines custom state transitions, emotes, and sound effects specific to this creature. Notably, it manages flight mechanics by dynamically adding/removing the `flying` tag during specific animations (e.g., emotes, eating, nuzzling) and fires `on_landed`/`on_no_longer_landed` events accordingly.

## Usage example
This state graph is automatically applied to the Eye of Terror prefab and is not typically added directly by mods. A modder would reference it if extending or overriding critter behavior.

## Dependencies & tags
**Components used:** `soundemitter` (for playing sounds via `inst.SoundEmitter:PlaySound(...)`).
**Tags:** Adds/Removes `flying`; fires `on_landed` and `on_no_longer_landed` events during animation timelines.

## Properties
No public properties.

## Main functions
### `lower_flying_creature(inst)`
*   **Description:** Removes the `flying` tag from the entity and pushes `on_landed`.
*   **Parameters:** `inst` (entity) — the Eye of Terror instance.
*   **Returns:** Nothing.

### `raise_flying_creature(inst)`
*   **Description:** Adds the `flying` tag to the entity and pushes `on_no_longer_landed`.
*   **Parameters:** `inst` (entity) — the Eye of Terror instance.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** `on_landed` (via `on_landed` event push), `on_no_longer_landed` (via `on_no_longer_landed` event push).
- **Pushes:** `on_landed`, `on_no_longer_landed`.