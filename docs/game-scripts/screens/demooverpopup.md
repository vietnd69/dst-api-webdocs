---
id: demooverpopup
title: Demooverpopup
description: Displays a pop-up screen at the end of a demo period, prompting the user to quit or proceed to the full game.
tags: [ui, demo, screen]
sidebar_position: 10

last_updated: 2026-03-09
build_version: 714014
change_status: stable
category_type: screens
source_hash: 41c1b69f
system_scope: ui
---

# Demooverpopup

> Based on game build **714014** | Last updated: 2026-03-09

## Overview
`DemoOverPopup` is a UI screen that appears when the demo period expires in Don't Starve Together. It presents a styled overlay with promotional artwork, a title, body text, and a quit button. As a subclass of `Screen`, it integrates into the `TheFrontEnd` screen stack and handles its own animation transitions for appearance and dismissal.

## Usage example
```lua
local DemoOverPopup = require "screens/demooverpopup"

DemoOverPopup(function()
    -- Called when popup closes without purchase
    TheFrontEnd:PushScreen("mainmenu")
end)
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** Adds `popup`; adds global `TAB`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `callbackfn` | function | `nil` | Function to invoke when the popup is dismissed without purchase. |
| `closing` | boolean | `false` | Internal flag indicating whether dismissal animation is in progress. |
| `sale_image_time` | number | `nil` | Accumulator used to animate the sale image scale. |

## Main functions
### `GoAway(purchased)`
* **Description:** Initiates the dismissal animation for the popup. If `purchased` is `false`, triggers a fade-out transition and invokes `callbackfn`.  
* **Parameters:**  
  * `purchased` (boolean) – if `true`, skips the fade-out and callback; used when the user proceeds to the full game.  
* **Returns:** Nothing.  
* **Error states:** No-op if `closing` is already `true`.

## Events & listeners
- **Listens to:** `Update` (via `OnUpdate(dt)`) – checks `TheSim:IsDemoExpired()` and animates `sale_image`.
- **Pushes:** None identified.