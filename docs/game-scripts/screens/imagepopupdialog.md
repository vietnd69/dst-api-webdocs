---
id: imagepopupdialog
title: Imagepopupdialog
description: Creates a customizable popup dialog screen that displays an image widget row beneath the standard title and text content.
tags: [ui, dialog, screen]
sidebar_position: 10

last_updated: 2026-03-09
build_version: 714014
change_status: stable
category_type: screens
source_hash: e20582df
system_scope: ui
---

# Imagepopupdialog

> Based on game build **714014** | Last updated: 2026-03-09

## Overview
`ImagePopupDialogScreen` is a specialized UI screen class derived from `PopupDialogScreen`. It extends the base popup dialog with support for a horizontally arranged row of image (or other widget) elements below the main dialog content. It customizes the background layout using `TEMPLATES.CurlyWindow` and adjusts positions of title, text, and menu elements to accommodate the new widget row.

## Usage example
```lua
local ImagePopupDialogScreen = require "screens/imagepopupdialog"

local widgets = {
    AnimButton("images/square.xml", "square.tex"),
    Image("images/character_portraits.xml", "wilson.tex"),
}

local dialog = ImagePopupDialogScreen(
    "My Title",
    widgets,
    64,      -- widget width
    16,      -- spacing between widgets
    "Description text here",
    { { text = "OK", fn = function() dialog:Remove() end } }
)
```

## Dependencies & tags
**Components used:** None (pure UI class; no entity components referenced).
**Tags:** None identified.

## Properties
No public properties.

## Main functions
### `ImagePopupDialogScreen(title, widgets, widget_width, spacing, text, buttons, scale_bg, spacing_override)`
*   **Description:** Constructor that initializes the dialog with a title, list of widgets to display, layout parameters, body text, and button definitions. It replaces the default background with a curly-window style and positions widgets horizontally in a container row.
*   **Parameters:**
    * `title` (string) – Dialog title text.
    * `widgets` (table) – Array of widget instances to be displayed in a horizontal row.
    * `widget_width` (number) – Width used for calculating spacing and positioning of each widget.
    * `spacing` (number) – Horizontal spacing between adjacent widgets.
    * `text` (string) – Body text displayed in the dialog.
    * `buttons` (table) – Array of button definitions (each with `text`, `fn`, and optional `params`).
    * `scale_bg` (optional, boolean) – Controls background scaling behavior (passed to base class).
    * `spacing_override` (optional, number) – Overrides default vertical spacing (passed to base class).
*   **Returns:** A new `ImagePopupDialogScreen` instance.
*   **Error states:** None documented.

## Events & listeners
None identified.