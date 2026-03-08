---
id: demotimer
title: Demotimer
description: Renders a demo-mode timer and purchase button in the HUD, updating dynamically based on play time.
tags: [ui, demo, hud]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: widgets
source_hash: 78e781bc
system_scope: ui
---

# Demotimer

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`DemoTimer` is a UI widget that displays the remaining demo play time in the Heads-Up Display (HUD) for non-purchased copies of the game. It is responsible for showing a formatted countdown (e.g., `"Demo 25:30"`) and providing a "Buy Now" button that opens the upsell screen. This widget extends `Widget` and does not interact with gameplay systems or entities—it is purely UI-centric.

## Usage example
```lua
-- DemoTimer is typically instantiated as part of the HUD layout.
-- Example minimal instantiation (not meant for direct mod use):
local demo_timer = DemoTimer(owner_widget)
demo_timer:OnUpdate() -- Forces immediate refresh of the display
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified  

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `owner` | widget | `nil` | Parent widget that owns this `DemoTimer` instance. |
| `purchasebutton` | `ImageButton` | `nil` | UI button labeled with `STRINGS.UI.HUD.BUYNOW`; triggers `Purchase()` on click. |
| `text` | `Text` | `nil` | Text element displaying the demo timer string (e.g., `"Demo 15:45"`). |
| `base_scale` | number | `0.5` | Base scaling factor applied to the purchase button. |

## Main functions
### `Purchase()`
* **Description:** Opens the game purchase/upsell screen and clears the demo timer display.
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** None identified.

### `OnUpdate()`
* **Description:** Refreshes the displayed timer text based on the player's accumulated play time and the configured demo duration (`TUNING.DEMO_TIME`). Only updates if the game is not purchased.
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** If `self.owner` is `nil` or `IsGamePurchased()` returns `true`, no update occurs.

## Events & listeners
**None identified.**