---
id: SGoceantrawler
title: Sgoceantrawler
description: Manages animation and sound playback states for the ocean trawler entity based on its state (e.g., idle, raised, lowered) and container contents.
tags: [animation, sound, container]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: stategraphs
source_hash: 96fbf000
system_scope: entity
---

# Sgoceantrawler

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`SGoceantrawler` is a `StateGraph` that defines the animation and sound sequence states for the ocean trawler entity (used by the Ocean Trawler boss in *Don't Starve Together*). It selects animations based on the current operational state (idle, lowered, raising, lowering, catching, etc.) and the content level of the attached `container` component (empty, medium, full). It does not contain logic itself but serves as a declarative mapping of states and transitions triggered by events (primarily `animover`).

## Usage example
The stategraph is loaded automatically by the game engine when the ocean trawler entity is instantiated; no manual setup is required. It is referenced internally via the entity’s state graph system.

```lua
-- Internal use only — this stategraph is assigned to the trawler prefab:
-- inst.sg = StateGraph("ocean_trawler", states, events, "idle")
-- Modders typically interact with the trawler by commanding actions (e.g., raising/lowering), which trigger state transitions.
```

## Dependencies & tags
**Components used:** `container` — checked for `:IsFull()`, `:IsEmpty()`, and existence in `onenter` handlers.
**Tags:** `idle`, `busy` — applied per-state in the state graph; no global tags are added/removed by this stategraph itself.

## Properties
No public properties — this is a stategraph definition returning a `StateGraph` object; no instance-level state or configuration is exposed directly.

## Main functions
No custom functions — `SGoceantrawler` defines only `State` blocks with `onenter` handlers and event callbacks. All behavior is executed via state entry logic and `EventHandler` callbacks.

## Events & listeners
- **Listens to:** `animover` — triggers transition back to `idle` state (or next post-overload state) upon animation completion in every state except `idle`.
- **Pushes:** None — this stategraph does not fire custom events. It only reacts to system-provided events like `animover`.