---
id: shadowedtext
title: Shadowedtext
description: Renders a text label with a subtle shadow effect by layering two Text widgets.
tags: [ui, text]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: widgets
source_hash: 9045a87e
system_scope: ui
---

# Shadowedtext

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`ShadowedText` is a UI widget that displays text with a visual shadow effect for improved legibility against varied backgrounds. It is implemented by composing two `Text` widgets: one for the shadow (offset downward and to the right) and one for the primary text. It extends the `Widget` base class and inherits UI layout and rendering capabilities.

## Usage example
```lua
local ShadowedText = require("widgets/redux/shadowedtext")
local inst = TheFrontEnd:AddChild(ShadowedText("largefont", 40, "Hello World", {1,1,1,1}))
inst:SetPosition(100, 100, 0)
```

## Dependencies & tags
**Components used:** `Text` (via internal composition; no component access via `inst.components.X`)
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `shadow` | Widget | — | Child `Text` widget used for the shadow layer, offset by `(2, -2)`. |
| `text` | Widget | — | Child `Text` widget used for the main text content. |

## Main functions
### `SetColour(r, g, b, a)`
* **Description:** Sets the colour and optional alpha of the main text; the shadow retains a fixed dark grey colour with matching alpha.
* **Parameters:** `r`, `g`, `b`, `a` (numbers) — RGB and alpha components (0–1 range).
* **Returns:** Nothing.

### `...` (inherited methods)
* **Description:** Methods from the `Text` class are automatically forwarded to both the `text` and `shadow` child widgets via runtime metaprogramming (a `for` loop in the constructor). This includes all public `Text` methods such as `SetText`, `SetPosition`, `SetScale`, etc.
* **Parameters & Returns:** Vary by the underlying `Text` method invoked.

## Events & listeners
None identified.