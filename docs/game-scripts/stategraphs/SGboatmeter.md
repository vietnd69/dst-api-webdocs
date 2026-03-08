---
id: SGboatmeter
title: Sgboatmeter
description: Manages the visual state and animation sequence for the boat meter UI widget in DST.
tags: [ui, animation, widget]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: stategraphs
source_hash: b4f443db
system_scope: ui
---

# Sgboatmeter

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`SGboatmeter` is a stategraph that controls the display and animation of the boat meter UI widget — a visual indicator used in the game to show boat-related status (e.g., leak level). It defines transitions between states such as `closed`, `open_pre`, `open`, and `close_pre`/`close_pst`, coordinating the visibility and animation of the widget's subcomponents (`backing`, `badge`, `icon`, `leak_anim`). It is typically attached to an entity that hosts the boat meter widget, and responds to external events (`open_meter`, `close_meter`) to drive state transitions.

## Usage example
```lua
-- Attach the stategraph to an entity that has a `widget` component
local inst = CreateEntity()
inst:AddComponent("widget") -- assumed to have backing, badge, icon, leak_anim
inst.sg = StateGraph("boatmeter", inst)
inst.sg:GoToState("closed")
-- Trigger opening via event
inst:PushEvent("open_meter")
-- Trigger closing
inst:PushEvent("close_meter", { instant = true })
```

## Dependencies & tags
**Components used:** `widget` — accessed via `inst.widget` (expects properties: `backing`, `badge`, `icon`, `leak_anim`, and methods `Show`, `Hide`, `UpdateLeak`, `anim` with `GetAnimState().PlayAnimation`).
**Tags:** None identified.

## Properties
No public properties.

## Main functions
Not applicable.

## Events & listeners
- **Listens to:**
  - `open_meter` — triggers `open_pre` state.
  - `close_meter` — triggers either `closed` (if `data.instant` is true) or `close_pre` state.
- **Pushes:** None identified.