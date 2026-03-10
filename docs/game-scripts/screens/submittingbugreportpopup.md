---
id: submittingbugreportpopup
title: Submittingbugreportpopup
description: Displays an animated progress popup while a bug report is being submitted to the backend service.
tags: [ui, bugreport, progress, popup]
sidebar_position: 10

last_updated: 2026-03-09
build_version: 714014
change_status: stable
category_type: screens
source_hash: 2a4b75f0
system_scope: ui
---

# Submittingbugreportpopup

> Based on game build **714014** | Last updated: 2026-03-09

## Overview
`Submittingbugreportpopup` is a screen class that presents a temporary animated UI overlay during bug report submission. It shows a dynamic " Submitting..." message with a pulsing ellipsis and transitions to either a success or failure dialog once submission completes (or fails). This screen is built atop `Screen` and integrates with `TheSystemService` to poll submission status.

## Usage example
```lua
local SubmittingBugReportPopup = require "screens/submittingbugreportpopup"
local popup = SubmittingBugReportPopup()
TheFrontEnd:PushScreen(popup)
-- The screen automatically detects when submission ends via TheSystemService and replaces itself with a final dialog.
```

## Dependencies & tags
**Components used:** None identified (no `inst.components.X` access)
**Tags:** Adds `submittingbugreportpopup` tag to the screen instance (implicitly via screen hierarchy).

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `black` | Image | `nil` | Full-screen darkening overlay (alpha 0.75) |
| `proot` | Widget | `nil` | Root widget for proportional scaling |
| `bg` | Widget | `nil` | Container for the curly window template background |
| `bg.fill` | Image | `nil` | Inner fill texture for background decoration |
| `text` | Text | `nil` | Text widget displaying the status message |
| `time` | number | `0` | Accumulated delta time for ellipsis animation |
| `progress` | number | `0` | Current ellipsis count (1–3) |

## Main functions
### `OnUpdate(dt)`
*   **Description:** Called every frame to update the ellipsis animation and check if bug report submission has finished. Upon completion, replaces itself with a final success/failure dialog screen.
*   **Parameters:** `dt` (number) - time elapsed since last frame in seconds.
*   **Returns:** Nothing.
*   **Error states:** None documented; relies on `TheSystemService` methods returning valid state.

## Events & listeners
*   **Listens to:** None identified
*   **Pushes:** None identified