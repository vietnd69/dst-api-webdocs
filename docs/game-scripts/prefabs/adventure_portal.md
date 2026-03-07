---
id: adventure_portal
title: Adventure Portal
description: Spawns a portal that triggers an adventure mode confirmation dialog when activated by the player.
tags: [portal, adventure, ui, activation]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 595e1590
system_scope: world
---

# Adventure Portal

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
`adventure_portal` is a server-side-only prefab that provides a visual and interactive portal for entering Adventure mode in Don't Starve Together. It uses the `playerprox` and `activatable` components to detect nearby players and present a confirmation dialog upon activation. When activated, it pauses the game, prompts the player with a popup, and proceeds to start a new adventure instance after saving the current progress.

The portal is only fully initialized and functional on the server (`TheWorld.ismastersim`); the client instance is immediately removed after creation to prevent duplicate logic.

## Usage example
The prefab is typically spawned via level generation or world generation tasksets (e.g., in `static_layouts/` or `tasksets/caves.lua`) and does not require manual instantiation by mods.

## Dependencies & tags
**Components used:** `inspectable`, `playerprox`, `activatable`  
**Tags:** None identified.

## Properties
No public properties are exposed directly. State is managed internally through component properties:

| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst.components.activatable.inactive` | boolean | `true` | Controls whether the portal can be activated. Set to `false` only after player interaction in the `onnear` handler. |
| `inst.components.activatable.quickaction` | boolean | `true` | Enables quick-action UI (e.g., contextual action button). |

## Main functions
### `OnActivate(inst)`
* **Description:** Handles activation of the portal. Pauses the game, displays a confirmation popup (A/B tested), and initiates the adventure sequence if accepted.
* **Parameters:** `inst` (Entity) — the portal entity instance.
* **Returns:** Nothing.
* **Error states:** None documented. State transitions depend on user selection (`startadventure` or `rejectadventure`).

## Events & listeners
- **Listens to:** `onnear` (via `playerprox.onnear`) — triggers portal activation sequence (animation, sound, UI readiness).  
- **Pushes:** None documented. Relies on UI callbacks and internal state changes.