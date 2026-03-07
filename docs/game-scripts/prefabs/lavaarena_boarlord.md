---
id: lavaarena_boarlord
title: Lavaarena Boarlord
description: Defines the Lava Arena Boarlord prefab — a boss entity with custom speech UI and talker component behavior for dialogue display.
tags: [boss, dialogue, npc, combat, ui]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 08b4b1f8
system_scope: entity
---

# Lavaarena Boarlord

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
The `lavaarena_boarlord` prefab is a boss entity used in the Lava Arena event. It integrates the `talker` component to manage voice-related dialogue display via a custom on-screen speech root UI. It sets up custom animation banks, scales, and hooks into the talker’s `ontalkfn` and `donetalkingfn` callbacks to control the visual rendering of speech bubbles and head animations during boss interaction.

## Usage example
```lua
-- Not intended for direct user instantiation.
-- This prefab is spawned automatically during the Lava Arena event.
-- Modders should avoid creating copies unless deeply customizing boss dialogue behavior.
```

## Dependencies & tags
**Components used:**  
- `transform`
- `animstate`
- `soundemitter`
- `dynamicshadow`
- `network`
- `talker`

**Tags:**  
- `king`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `speechroot` | widget or nil | `nil` | Reference to the speech UI root widget created on talk. |
| `speech_parent` | widget or nil | `nil` | Parent widget (eventannouncer) used to anchor speech UI. |

## Main functions
### `OnTalk(inst, data)`
* **Description:** Client-side callback invoked on talk start and end. Manages creation, updating, and cleanup of the speech UI overlay (text, head anim, tinting). Clears or schedules the speech root for removal after dialogue.
* **Parameters:**  
  - `inst` (Entity) — The Boarlord instance.  
  - `data` (table or nil) — Contains `message` (string). May be `nil` to indicate end of speech.  
* **Returns:** Nothing.  
* **Error states:** No-op if `ThePlayer` or `ThePlayer.HUD` is invalid, or if `data.message` is `nil` and no speech root exists.

### `SpeechRootKillTask(speechroot_inst, inst)`
* **Description:** Cleanup helper called after a delay to safely kill the speech root widget. Prevents UI leaks after talk finishes.
* **Parameters:**  
  - `speechroot_inst` (Entity) — Speech root entity.  
  - `inst` (Entity) — Boarlord instance (for reference).  
* **Returns:** Nothing. Sets `inst.speechroot` to `nil` and kills the widget if still valid.

### `OnRemoveEntity(inst)`
* **Description:** Cleanup callback triggered when the Boarlord entity is removed. Ensures speech UI resources are released.
* **Parameters:**  
  - `inst` (Entity) — Boarlord instance.  
* **Returns:** Nothing. Kills `speechroot` if present and sets it to `nil`.

## Events & listeners
- **Listens to:**  
  - `onremove` (on speechroot) — Cleans up parent offset and nullifies speechroot references.  
- **Pushes:**  
  - None directly. (Relies on `talker` component to drive talk events.)
