---
id: SGboatbumper
title: Sgboatbumper
description: Manages the visual states and animation lifecycle of boat bumper entities during placement, impact, and degradation.
tags: [physics, fx, animation, entity]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: stategraphs
source_hash: 22adafe8
system_scope: physics
---

# Sgboatbumper

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`SGboatbumper` is a stategraph responsible for driving the visual behavior of boat bumper entities—handling transitions between idle, placement, hit (impact), grade change (upgrade/downgrade), and death states. It works with animation playback (`AnimState`), sound effects (via prefab spawning), and state timers to provide clear feedback during entity interactions. This stategraph does not contain logic for collision or gameplay rules; it solely governs rendering and state transitions.

## Usage example
This stategraph is referenced by the game engine when the `boatbumper` entity is initialized. Modders do not directly instantiate or manipulate this stategraph; instead, they interact with the `boatbumper` prefab, which applies this stategraph via `inst:AddStateGraph("boatbumper", "SGboatbumper")`.

## Dependencies & tags
**Components used:** None identified  
**Tags:** Uses internal state tags `idle`, `busy`, and `dead` to control animation flow and integration with the game’s state system.

## Properties
No public properties are defined in this stategraph.

## Main functions
This file does not define any public functions; it returns a `StateGraph` definition. All logic resides within state hooks (`onenter`, `ontimeout`, `events`) and helper functions (`PlayHitFX`).

## Events & listeners
- **Listens to:** 
  - `animover` — triggers state transition back to `idle` after animation completes (used in `place`, `hit`, and `changegrade` states).
  - Timers (`ontimeout`) — transitions from `changegrade` to `idle` after animation duration elapses.
- **Pushes:** None identified