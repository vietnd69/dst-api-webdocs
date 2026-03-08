---
id: templates
title: Templates
description: Provides reusable UI widget constructors for building menus, dialogs, lists, and HUD elements in the frontend.
tags: [ui, frontend, widget, templates, menu]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: widgets
source_hash: 431a659b
system_scope: ui
---

# Templates

> Based on game build **714014** | Last updated: 2026-03-08

## Overview

The `TEMPLATES` module in `dst-scripts/widgets/redux/templates.lua` is a comprehensive collection of widget factory functions used to construct consistent, themable UI elements for the game's frontend (e.g., main menus, mod managers, character select, server browser, and profile UI). It leverages core widget types like `Widget`, `ImageButton`, `Text`, `Spinner`, `NineSlice`, and `UIAnim`, and supports keyboard/controller navigation, tooltips, localization, and theme-specific visuals (e.g., Quagmire, Boarrior, Clay Warg). Functions are grouped by purpose—backgrounds, buttons, menu systems, list items, counters, badges, and input fields—and often extend or wrap lower-level templates for specialized UI roles.

## Usage example

```lua
local root = TEMPLATES.ScreenRoot("main_menu")
root:AddChild(TEMPLATES.BrightMenuBackground())

local title = TEMPLATES.ScreenTitle(STRINGS.UI.MAINMENU.TITLE, STRINGS.UI.MAINMENU.SUBTITLE)
root:AddChild(title)

local menuitems = {
  { text = STRINGS.UI.MAINMENU.NEW_GAME, onclick = function() ... end },
  { text = STRINGS.UI.MAINMENU.SERVER_LIST, onclick = function() ... end },
}
local menu = TEMPLATES.StandardMenu(menuitems)
root:AddChild(menu)

local back_btn = TEMPLATES.BackButton(function() TheFrontEnd:PopScreen() end)
root:AddChild(back_btn)

return root
```

## Dependencies & tags
**Components used:**
- `AccountItemFrame`, `Button`, `Grid`, `Image`, `ImageButton`, `Menu`, `NineSlice`, `NumericSpinner`, `Spinner`, `Text`, `TextEdit`, `TrueScrollList`, `UIAnim`, `Widget`
- `TEMPLATES.old.BackgroundTint`, `TEMPLATES.old.ForegroundLetterbox`, `TEMPLATES.old.ItemImageText`
- `GetLoaderAtlasAndTex`, `GetSkinName`, `GetInventoryItemAtlas`, `math.clamp`, `wputils.*`
- Localized strings via `STRINGS.UI.*`, `STRINGS.CHARACTER_DETAILS.*`
- Constants: `FRONTEND_PORTAL_COLOUR`, `BRANCH`, `APP_VERSION`, `APP_ARCHITECTURE`, `RESOLUTION_X`, `RESOLUTION_Y`, `PI`, `FRAMES`, `UICOLOURS.*`, `TUNING.*`

**Tags:** None found.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|

## Main functions

### `TEMPLATES.ScreenRoot(name)`
* **Description:** Creates and returns a root widget centered on screen with middle anchors and proportional scale mode.
* **Parameters:** `name` — optional string name for the widget.
* **Returns:** Widget instance.

### `TEMPLATES.LoaderBackground(item_key)`
* **Description:** Creates a full-screen, stretched background image for loader screens with tinting using `FRONTEND_PORTAL_COLOUR`.
* **Parameters:** `item_key` — string key used by `GetLoaderAtlasAndTex`.
* **Returns:** Image widget with stretched fullscreen scale mode and tint applied.

### `TEMPLATES.PlainBackground()`
* **Description:** Returns a background variant identical to `BrightMenuBackground`.
* **Parameters:** None.
* **Returns:** Widget background instance.

### `TEMPLATES.BoarriorBackground()`
* **Description:** Returns a background variant for the "Boarrior" theme using `ReduxBackground` with `"labg"`.
* **Parameters:** None.
* **Returns:** Widget background instance.

### `TEMPLATES.BrightMenuBackground()`
* **Description:** Returns a background variant using `ReduxBackground` with `"dark_right"`.
* **Parameters:** None.
* **Returns:** Widget background instance.

### `TEMPLATES.LeftSideBarBackground()`
* **Description:** Creates a background with a vertical sidebar element on the left side.
* **Parameters:** None.
* **Returns:** Widget background instance with nested `sidebar_root` and `sidebar` Image child.

### `TEMPLATES._CreateBackgroundPlate(image)`
* **Description:** Internal helper that wraps an image in a `Widget` with scale adjusted to screen width (`x-scale = RESOLUTION_X / plate_width`).
* **Parameters:** `image` — Image widget instance.
* **Returns:** Widget root containing the scaled image; stores `root.image = image`.

### `TEMPLATES.BackgroundTint(a, rgb)`
* **Description:** Delegates to `TEMPLATES.old.BackgroundTint(a, rgb)`.
* **Parameters:** `a` — alpha value; `rgb` — color triplet.
* **Returns:** Return value of `TEMPLATES.old.BackgroundTint(a, rgb)`.

### `TEMPLATES.QuagmireAnim()`
* **Description:** Creates a three-layer animated background using `UIAnim` widgets for the Quagmire menu theme.
* **Parameters:** None.
* **Returns:** Widget root containing three `UIAnim` children ("quagmire_menu_bg", "quagmire_menu_mid", "quagmire_menu").

### `TEMPLATES.BoarriorAnim()`
* **Description:** Creates a single `UIAnim` widget for the Boarrior menu animation ("main_menu1") with idle animation playing.
* **Parameters:** None.
* **Returns:** UIAnim instance.

### `TEMPLATES.ClayWargBackground()`
* **Description:** Creates an animated background that fades using per-frame `OnUpdate` logic with a cosine wave.
* **Parameters:** None.
* **Returns:** UIAnim instance with `"ground"` animation and custom `OnUpdate` method; `fadet` and `OnUpdate` attached to instance.

### `TEMPLATES.ClayWargAnim()`
* **Description:** Creates a looping `UIAnim` widget for Clay Warg ("dst_menu_yotv") with `"loop"` animation.
* **Parameters:** None.
* **Returns:** UIAnim instance.

### `TEMPLATES.GetBuildString()`
* **Description:** Returns a formatted build version string (e.g., `"Internal v1.2.3.4 (64-bit)"`, `"Preview v..."`).
* **Parameters:** None.
* **Returns:** String.

### `TEMPLATES.AddBuildString(parent_widget, config)`
* **Description:** Adds a `Text` widget displaying the build string to `parent_widget`.
* **Parameters:** 
  - `parent_widget` — parent widget to which the `Text` is added.
  - `config` — optional table with keys: `font`, `size`, `colour`, `r`, `g`, `b`, `a`, `align`, `w`, `h`, `x`, `y`.
* **Returns:** Text widget instance that displays the build string.

### `TEMPLATES.ScreenTitle(title_text, subtitle_text)`
* **Description:** Creates a screen title widget with optional subtitle in top-left (predefined position `titleX`, `titleY`).
* **Parameters:** 
  - `title_text` — main title string.
  - `subtitle_text` — optional subtitle string.
* **Returns:** Root widget containing `big` (main title Text) and `small` (subtitle Text) as properties.

### `TEMPLATES.ScreenTitle_BesideLeftSideBar(title_text, subtitle_text)`
* **Description:** Wrapper for `ScreenTitle`, positioning it to the right of the left sidebar.
* **Parameters:** Same as `ScreenTitle`.
* **Returns:** Widget returned by `ScreenTitle`, with position overridden.

### `TEMPLATES.StandardMenu(menuitems, offset, horizontal, style, wrap)`
* **Description:** Creates a standard menu at predefined position (`menuX`, `menuY`), with `reverse = true`.
* **Parameters:** All passed to `Menu(...)`; optional params may be omitted.
* **Returns:** Menu instance.

### `TEMPLATES.ScreenTooltip()`
* **Description:** Creates a word-wrapped `Text` widget for tooltips at a fixed position below menu.
* **Parameters:** None.
* **Returns:** Text widget instance.

### `TEMPLATES.MenuButton(text, onclick, tooltip_text, tooltip_widget, style, text_size)`
* **Description:** Creates a menu button with focus/selected/hover states, background area, and customizable style ("wide").
* **Parameters:** 
  - `text` — button label string.
  - `onclick` — click callback.
  - `tooltip_text` — text to display in tooltip.
  - `tooltip_widget` — `Text` widget to update on focus changes.
  - `style` — optional `"wide"` to adjust dimensions.
  - `text_size` — font size override.
* **Returns:** ImageButton instance with `bg`, `text`, `text_shadow`, and event handlers `ongainfocus`, `onlosefocus`.

### `TEMPLATES.TwoLineMenuButton(text, onclick, tooltip_text, tooltip_widget)`
* **Description:** Extends `MenuButton` to support secondary (sub) text beneath primary text.
* **Parameters:** Same as `MenuButton`.
* **Returns:** Modified ImageButton with `secondary_text`, `SetSecondaryText`, `onselect`, `onunselect` handlers.

### `TEMPLATES.WardrobeButton(text, onclick, tooltip_text, tooltip_widget)`
* **Description:** Extends `TwoLineMenuButton` with an `AccountItemFrame` icon and dynamic secondary text from `GetSkinName`/`GetColorForItem`.
* **Parameters:** Same as `TwoLineMenuButton`.
* **Returns:** ImageButton with `icon`, `SetItem(item_id)` method.

### `TEMPLATES.WardrobeButtonMinimal(onclick)`
* **Description:** Minimal wardrobe button (no text) using `AccountItemFrame`, with focus/select visibility toggles.
* **Parameters:** `onclick` — click callback.
* **Returns:** ImageButton with `icon` and `SetItem(item_id)`.

### `TEMPLATES.PortraitIconMenuButton(text, onclick, tooltip_text, tooltip_widget)`
* **Description:** Extends `TwoLineMenuButton` with a character portrait in top-left.
* **Parameters:** Same as `TwoLineMenuButton`.
* **Returns:** ImageButton with `title_portrait`, `SetCharacter(character_atlas, character)` method.

### `TEMPLATES.BackButton(onclick, txt, shadow_offset, scale)`
* **Description:** Back/Cancel button with arrow icon and text, positioned at fixed screen location.
* **Parameters:** 
  - `onclick` — callback.
  - `txt` — optional label (defaults to `STRINGS.UI.SERVERLISTINGSCREEN.BACK`).
  - `shadow_offset` — text shadow offset table.
  - `scale` — scale override.
* **Returns:** ImageButton with `bg`, custom `SetText`, and focus/onclick handlers.

### `TEMPLATES.BackButton_BesideLeftSidebar(onclick, txt, shadow_offset, scale)`
* **Description:** Adjusts `BackButton` position to align beside left sidebar.
* **Parameters:** Same as `BackButton`, but `scale` defaults to `0.8`.
* **Returns:** Adjusted ImageButton.

### `TEMPLATES.StandardButton(onclick, txt, size, icon_data)`
* **Description:** Creates a standard clickable button with scalable textures (`"carny_long"`, `"carny_xlong"`, `"carny_square"`) and optional icon.
* **Parameters:** 
  - `onclick` — callback.
  - `txt` — label text.
  - `size` — optional `{width,height}` to select texture and font size.
  - `icon_data` — optional `{atlas, texture}` to add icon.
* **Returns:** ImageButton with optional `icon` and adjusted text/icon layout.

### `TEMPLATES.IconButton(iconAtlas, iconTexture, labelText, sideLabel, alwaysShowLabel, onclick, textinfo, defaultTexture)`
* **Description:** Creates a square button with an icon and optional label beside or below it (or hover-only).
* **Parameters:** 
  - `iconAtlas`, `iconTexture` — icon image path.
  - `labelText` — optional label.
  - `sideLabel` — boolean: `true` places label to left; `false` checks `alwaysShowLabel`.
  - `alwaysShowLabel` — boolean: `true` places label below button.
  - `onclick` — callback.
  - `textinfo` — optional table with font, size, colour, etc.
  - `defaultTexture` — unused (present in signature but not used).
* **Returns:** ImageButton instance with label logic.

### `TEMPLATES.StandardCheckbox(onclick, size, init_checked, helptext, hovertext_info)`
* **Description:** Creates a checkbox with toggle visuals and optional hover/helptext.
* **Parameters:** 
  - `onclick` — callback returning boolean.
  - `size` — size of checkbox square.
  - `init_checked` — initial state.
  - `helptext` — optional help text.
  - `hovertext_info` — optional hover tooltip config table.
* **Returns:** ImageButton with custom `SetChecked` logic and onclick handler.

### `TEMPLATES.ServerDetailIcon(iconAtlas, iconTexture, bgColor, hoverText, textinfo, imgOffset, scaleX, scaleY)`
* **Description:** Creates an icon widget with optional background and hover text.
* **Parameters:** 
  - `iconAtlas`, `iconTexture` — icon image.
  - `bgColor` — optional background suffix (used with `"bg_..."` texture).
  - `hoverText` — optional tooltip string.
  - `textinfo` — optional hover tooltip style config.
  - `imgOffset`, `scaleX`, `scaleY` — image positioning/scale overrides.
* **Returns:** Widget instance with `bg` and `img` children.

### `TEMPLATES.ListItemBackground(row_width, row_height, onclick_fn)`
* **Description:** Creates a highlightable list row background for click or focus interactions.
* **Parameters:** 
  - `row_width`, `row_height` — dimensions.
  - `onclick_fn` — optional click callback.
* **Returns:** ImageButton with scaled texture based on aspect ratio (uses prefix `listitem_thick` or `serverlist_listitem`).

### `TEMPLATES.ListItemBackground_Static(row_width, row_height)`
* **Description:** Static (non-interactive) list row background using tinted `Image`.
* **Parameters:** `row_width`, `row_height`.
* **Returns:** Image with fixed tint.

### `TEMPLATES.ModListItem(onclick_btn, onclick_checkbox, onclick_setfavorite)`
* **Description:** Creates a mod list item widget with icon, checkbox, favorite star, status label, and out-of-date/configurable indicators.
* **Parameters:** 
  - `onclick_btn`, `onclick_checkbox`, `onclick_setfavorite` — callbacks.
* **Returns:** Widget instance with extensive helper methods: `SetMod`, `SetModStatus`, `SetModEnabled`, `SetModFavorited`, `SetModConfigurable`, `SetModReadOnly`, `Select`, `Unselect`.

### `TEMPLATES.ModListItem_Downloading()`
* **Description:** Creates a mod list item for a mod that is currently downloading.
* **Parameters:** None.
* **Returns:** Widget instance with `name` and `SetMod(mod)` method showing download status string.

### `TEMPLATES.DoodadCounter(number_of_doodads)`
* **Description:** Creates an animated counter widget for "doodads" (e.g., materials).
* **Parameters:** `number_of_doodads` — initial count.
* **Returns:** Widget with `image` (`UIAnim`), `doodad_count` (`Text`), `_CountFn`, `SetCount(new_count, animateDoodad)`.

### `TEMPLATES.KleiPointsCounter(number_of_points)`
* **Description:** Creates a Klei Points counter widget that opens the rewards page on click.
* **Parameters:** `number_of_points`.
* **Returns:** Button with `image` (`UIAnim`), `points_count`, `SetCount`, and onclick handler.

### `TEMPLATES.BoltCounter(number_of_bolts)`
* **Description:** Creates an animated counter widget for bolts of cloth.
* **Parameters:** `number_of_bolts`.
* **Returns:** Widget with `image`, `bolt_count`, `_CountFn`, `SetCount`.

### `TEMPLATES.StandardSingleLineTextEntry(fieldtext, width_field, height, font, font_size, prompt_text)`
* **Description:** Creates a text entry field with background and input handling.
* **Parameters:** 
  - `fieldtext` — initial text.
  - `width_field`, `height`, `font`, `font_size`, `prompt_text` — optional.
* **Returns:** Widget with `textbox_bg`, `textbox`, event handlers, and `GetHelpText`.

### `TEMPLATES.LabelTextbox(labeltext, fieldtext, width_label, width_field, height, spacing, font, font_size, horiz_offset)`
* **Description:** Adds a label to `StandardSingleLineTextEntry`, placing label to left of text input.
* **Parameters:** All optional except `labeltext`, `fieldtext`.
* **Returns:** Widget with `label` and `textbox` positioned relative to label.

### `TEMPLATES.LabelSpinner(labeltext, spinnerdata, width_label, width_spinner, height, spacing, font, font_size, horiz_offset, onchanged_fn, colour, tooltip_text)`
* **Description:** Creates a spinner with a label beside it.
* **Parameters:** 
  - `labeltext`, `spinnerdata` — label text and spinner data list.
  - Other layout/size/behavior parameters.
* **Returns:** Widget with `label` and `spinner` child; `focus_forward` set.

### `TEMPLATES.LabelNumericSpinner(labeltext, min, max, width_label, width_spinner, height, spacing, font, font_size, horiz_offset, tooltip_text)`
* **Description:** Similar to `LabelSpinner` but uses `StandardNumericSpinner`.
* **Parameters:** Same structure as `LabelSpinner`, but takes `min`/`max` instead of `spinnerdata`.
* **Returns:** Widget with label and numeric spinner.

### `TEMPLATES.LabelButton(onclick, labeltext, buttontext, width_label, width_button, height, spacing, font, font_size, horiz_offset)`
* **Description:** Creates a label + `StandardButton` layout.
* **Parameters:** All layout and callback args.
* **Returns:** Widget with `label` and `button` children.

### `TEMPLATES.OptionsLabelCheckbox(onclick, labeltext, checked, width_label, width_button, height, checkbox_size, spacing, font, font_size, horiz_offset, tooltip_text)`
* **Description:** Creates a label + checkbox layout.
* **Parameters:** All layout and callback args.
* **Returns:** Widget with `label` and `button` (a checkbox) children; `tooltip_text` stored.

### `TEMPLATES.LabelCheckbox(onclick, checked, text)`
* **Description:** Creates a standalone checkbox with text label to right.
* **Parameters:** 
  - `onclick` — callback receiving checkbox instance.
  - `checked` — initial boolean.
  - `text` — label string.
* **Returns:** ImageButton with `checked`, `Refresh`, and text offset logic.

### `TEMPLATES.StandardSpinner(spinnerdata, width_spinner, height, font, font_size, onchanged_fn, colour)`
* **Description:** Creates a `Spinner` with custom font, width, height, and onchanged handler.
* **Parameters:** 
  - `spinnerdata` — list of `{text, colour, image, data}` entries.
  - Other layout/behavior args.
* **Returns:** Spinner instance.

### `TEMPLATES.StandardNumericSpinner(min, max, width_spinner, height, font, font_size)`
* **Description:** Creates a `NumericSpinner` with min/max range.
* **Parameters:** `min`, `max`, layout args.
* **Returns:** NumericSpinner instance.

### `TEMPLATES.CharacterSpinner(onchanged_fn, puppet, user_profile)`
* **Description:** Creates a character selection spinner populated by `GetFEVisibleCharacterList`, updates skins via `puppet` and `user_profile`.
* **Parameters:** 
  - `onchanged_fn` — callback `(selected_name, old)`.
  - `puppet`, `user_profile` — for skin updates.
* **Returns:** Spinner with `LoadLastSelectedFromProfile` method.

### `TEMPLATES.ChatFlairBadge()`
* **Description:** Creates a chat flair badge widget with optional festival background and flair icon.
* **Parameters:** None.
* **Returns:** Widget with `bg`, `flair_img`, methods `SetFestivalBackground`, `SetFlair`, `GetFlair`, `SetAlpha`, `GetSize`.

### `TEMPLATES.ChatterMessageBadge()`
* **Description:** Creates a chatter/message flair badge widget with bg icon, flair icon, and alpha toggle.
* **Parameters:** None.
* **Returns:** Widget with `bg`, `flair_img`, methods `SetFlair`, `GetFlair`, `SetBGIcon`, `GetBGIcon`, `SetAlpha`, `GetSize`.

### `TEMPLATES.AnnouncementBadge()`
* **Description:** Creates an announcement badge with circle background and announcement icon.
* **Parameters:** None.
* **Returns:** Widget with `bg`, `announcement_img`, methods `SetAnnouncement`, `GetAnnouncement`, `SetAlpha`, `GetSize`.

### `TEMPLATES.SystemMessageBadge()`
* **Description:** Creates a system message badge (dedicated server icon).
* **Parameters:** None.
* **Returns:** Widget with `bg`, `systemmessage_img`, and `SetAlpha`, `GetSize`.

### `TEMPLATES.RankBadge()`
* **Description:** Creates a rank badge showing profile flair and numeric rank under a festival background.
* **Parameters:** None.
* **Returns:** Widget with `bg`, `flair`, `num`, methods `SetFestivalBackground`, `SetRank`.

### `TEMPLATES.FestivalNumberBadge(festival_key)`
* **Description:** Creates a static image badge with a numeric rank overlay for festivals.
* **Parameters:** `festival_key` — optional (defaults to `WORLD_FESTIVAL_EVENT`).
* **Returns:** Image instance with `num` child and `SetRank(rank_value)`.

### `TEMPLATES.UserProgress(onclick)`
* **Description:** Creates a user profile progress display with username, progress bar, rank badge, and clickable area.
* **Parameters:** `onclick` — callback for click on progress area.
* **Returns:** Widget with `name`, `bar`, `rank`, `btn`, and `UpdateProgress` method.

### `TEMPLATES.LargeScissorProgressBar(name)`
* **Description:** Creates a large progress bar that uses scissor rect on a fill image.
* **Parameters:** `name` — optional widget name.
* **Returns:** Widget with `frame`, `fill` and `SetPercent(percent)` method.

### `TEMPLATES.WxpBar()`
* **Description:** Creates a widget displaying experience progress, including rank badge, next-rank badge, progress bar, and XP value text fields. Handles both direct XP updates and local user profile updates.
* **Parameters:** None.
* **Returns:** `wxpbar` widget (`Widget("Experience")` instance).

### `TEMPLATES.ItemImageText(item_type, item_key, max_width)`
* **Description:** Constructs a widget combining an item icon with descriptive text. Delegates to `TEMPLATES.old.ItemImageText`, then enhances the text label with word wrapping and region sizing.
* **Parameters:**  
  - `item_type`: String, item type identifier  
  - `item_key`: String, item key used to fetch localized name via `GetSkinName`  
  - `max_width`: Optional number, max text width (default: `300`)  
* **Returns:** Enhanced widget `w` with `SetItem` method added.

### `TEMPLATES.ItemImageVerticalText(item_type, item_key, max_width)`
* **Description:** Reuses `TEMPLATES.ItemImageText` but adjusts text alignment and position for vertical layout.
* **Parameters:** Same as `ItemImageText`.
* **Returns:** Modified widget `w` with vertically centered text at position `(0, -80)`.

### `TEMPLATES.CurlyWindow(sizeX, sizeY, title_text, bottom_buttons, button_spacing, body_text)`
* **Description:** Creates a dialog window with ornate curly borders (`NineSlice`), optional title, buttons, and body text. Handles layout adjustments for Japanese language PS4 builds.
* **Parameters:**  
  - `sizeX`, `sizeY`: Optional dimensions; clamped to `[190–1000]`, `[90–500]`  
  - `title_text`: Optional string for title  
  - `bottom_buttons`: Optional list of button widgets/objects for `Menu`  
  - `button_spacing`: Optional spacing; auto-calculated if `nil`  
  - `body_text`: Optional string for body content  
* **Returns:** `w` (`NineSlice`-based dialog widget).

### `TEMPLATES.RectangleWindow(sizeX, sizeY, title_text, bottom_buttons, button_spacing, body_text)`
* **Description:** Similar to `CurlyWindow` but uses rectangular borders. Adds `SetBackgroundTint`, `HideBackground`, and `InsertWidget` methods.
* **Parameters:** Same as `CurlyWindow`.
* **Returns:** `w` (`NineSlice`-based dialog widget with extra methods).

### `TEMPLATES.ControllerFunctionsFromButtons(buttons)`
* **Description:** Generates `OnControl` and `GetHelpText` functions for controller input handling based on a button list. Auto-assigns `CONTROL_CANCEL` to last button if none specified.
* **Parameters:**  
  - `buttons`: List of tables, each with `{text, cb, controller_control}`  
* **Returns:** Two functions:  
  - `OnControl(control, down)` → `true` if handled, else `false`  
  - `GetHelpText()` → concatenated localized input + text string.

### `TEMPLATES.ScrollingGrid(items, opts)`
* **Description:** Builds a scrollable grid of widgets using `TrueScrollList`. Handles peek height calculation, scissor region setup, and widget layout.
* **Parameters:**  
  - `items`: List of data items to populate grid  
  - `opts`: Table with keys:  
    - `peek_height`, `peek_percent`, `force_peek`, `num_visible_rows`, `num_columns`, `widget_width`, `widget_height`  
    - `item_ctor_fn`, `scroll_context`, `apply_fn`, `end_offset`, `allow_bottom_empty_row`  
    - `scissor_pad`, `scrollbar_offset`, `scrollbar_height_offset`, `scroll_per_click`  
* **Returns:** `scroller` (`TrueScrollList` instance).

### `TEMPLATES.LeftColumn()`
* **Description:** Creates a widget positioned on the left side of the screen via `lcol`.
* **Parameters:** None.
* **Returns:** `Widget("left column")` instance at `SetPosition(lcol, 0)`.

### `TEMPLATES.RightColumn()`
* **Description:** Creates a widget positioned on the right side of the screen via `rcol`.
* **Parameters:** None.
* **Returns:** `Widget("right column")` instance at `SetPosition(rcol, 0)`.

### `TEMPLATES.ReduxForeground()`
* **Description:** Creates a foreground widget containing a letterbox overlay. Disables alpha fading.
* **Parameters:** None.
* **Returns:** `fg` widget with `letterbox` child.

### `TEMPLATES.MakeUIStatusBadge(_status_name, c)`
* **Description:** Builds a static UI badge for a status (e.g., health, hunger, sanity) with icon, value image, and numeric text. Supports dynamic character updates.
* **Parameters:**  
  - `_status_name`: String, status type (e.g., `"health"`)  
  - `c`: Optional character string; if provided, initializes badge with that character’s values  
* **Returns:** `status` widget with `ChangeCharacter` method.

### `TEMPLATES.MakeStartingInventoryWidget(c, left_align)`
* **Description:** Builds a widget displaying a character’s starting inventory items as slots/images. Handles empty inventory case and character switching.
* **Parameters:**  
  - `c`: Optional character string; if provided, initializes inventory  
  - `left_align`: Boolean, aligns title and layout left if `true`  
* **Returns:** `root` widget with `ChangeCharacter` method.

## Events & listeners
None found. No `inst:ListenForEvent` or `inst:PushEvent` calls are present across the source file.