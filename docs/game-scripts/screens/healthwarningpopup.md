---
id: healthwarningpopup
title: Healthwarningpopup
description: Displays a temporary health warning overlay screen that automatically fades out and closes after 7.75 seconds.
tags: [ui, screen, fade]
sidebar_position: 10

last_updated: 2026-03-09
build_version: 714014
change_status: stable
category_type: screens
source_hash: 3d21b685
system_scope: ui
---

# Healthwarningpopup

> Based on game build **714014** | Last updated: 2026-03-09

## Overview
`HealthWarningPopup` is a UI screen that presents a visual health warning to the player, likely triggered during low-health scenarios. It extends the base `Screen` class and renders a background image (`health_warning.tex`) that fills the screen. The screen is self-contained and automatically closes itself after a fixed delay of 7.75 seconds by triggering a fade-out, popping itself from the screen stack, and fading back in.

## Usage example
```lua
TheFrontEnd:PushScreen("HealthWarningPopup")
```

## Dependencies & tags
**Components used:** None identified.  
**Tags:** None identified.

## Properties
No public properties.

## Main functions
### `HealthWarningPopup(inst)`
*   **Description:** Constructor for the `HealthWarningPopup` screen. Initializes the UI by adding a full-screen background image (`health_warning.tex`) and schedules automatic closure after 7.75 seconds.
*   **Parameters:** `inst` (Entity) — the entity instance this screen is attached to (typically the player entity).
*   **Returns:** Nothing.
*   **Error states:** None. The constructor always succeeds and schedules cleanup unconditionally.

## Events & listeners
- **Pushes:** None.  
- **Listens to:** None.  
