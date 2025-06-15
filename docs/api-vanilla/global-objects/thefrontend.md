---
id: thefrontend
title: TheFrontEnd
sidebar_position: 9
last_updated: 2023-07-06
---

# TheFrontEnd

TheFrontEnd is the global object that controls the game's user interface and screens in Don't Starve Together. It handles screen transitions, UI state management, popups, and other interface-related functionality.

## Basic Usage

```lua
-- Get the current screen
local current_screen = TheFrontEnd:GetActiveScreen()

-- Get the screen below the current one
local previous_screen = TheFrontEnd:GetScreenUnderTop()

-- Check if a specific screen is active
local is_character_select = TheFrontEnd:GetActiveScreen().name == "CharacterSelectScreen"

-- Check if a popup is currently displayed
local has_popup = TheFrontEnd:IsDisplayingPopup()
```

## Screen Management

```lua
-- Push a new screen onto the screen stack
local new_screen = MyCoolScreen()
TheFrontEnd:PushScreen(new_screen)

-- Pop the top screen off the stack
TheFrontEnd:PopScreen()

-- Pop all screens until you reach the main menu
TheFrontEnd:PopAllScreens()

-- Replace the current screen with a new one
TheFrontEnd:ReplaceScreenWithOneOf({new_screen})

-- Quickly transition to a new screen
TheFrontEnd:GoToScreen(new_screen)

-- Get the number of screens in the stack
local screen_count = TheFrontEnd:GetScreenStackSize()

-- Hide all screens (keeps them in the stack but doesn't render them)
TheFrontEnd:HideAllScreens()

-- Show all screens after hiding them
TheFrontEnd:ShowAllScreens()
```

## Popup Management

```lua
-- Show a basic popup
local popup = PopupDialogScreen(title, body_text, button_callbacks)
TheFrontEnd:PushScreen(popup)

-- Display a custom confirmation dialog
local dialog = PopupDialogScreen(
    "Confirm Action", 
    "Are you sure you want to do this?",
    {
        {text="YES", cb = function() print("User confirmed") end},
        {text="NO", cb = function() print("User declined") end}
    }
)
TheFrontEnd:PushScreen(dialog)

-- Show a message that automatically fades
TheFrontEnd:DisplayAchievement("achievement_name")
TheFrontEnd:DisplayTemporaryText("Text to display", "big", 5)
```

## Menu Navigation

```lua
-- Navigate to the main menu
TheFrontEnd:SetScreensToShow("MainMenu")

-- Show the character select screen
TheFrontEnd:SetScreensToShow("CharacterSelect")

-- Go to the options menu
TheFrontEnd:SetScreensToShow("OptionsMenu")

-- Show the credits
TheFrontEnd:SetScreensToShow("Credits")

-- Get the last used menu screen
local last_screen = TheFrontEnd:GetLastUsedScreenName()
```

## UI Components and Widgets

```lua
-- Get a reference to the HUD
local hud = TheFrontEnd:GetHUD()

-- Control UI visibility
TheFrontEnd:HideStatusNumbers(hide)
TheFrontEnd:HidePlayerStatus(hide)

-- Set text scale
TheFrontEnd:SetTextScale(scale)
local current_scale = TheFrontEnd:GetTextScale()

-- Enable/disable help text
TheFrontEnd:EnableHelpText(enable)
```

## Fade Effects and Transitions

```lua
-- Fade screen in/out
TheFrontEnd:FadeIn(time)
TheFrontEnd:FadeOut(time)

-- Set up a black fade effect
TheFrontEnd:SetFadeLevel(level) -- 0 is fully visible, 1 is black

-- Check if a fade is in progress
local is_fading = TheFrontEnd:GetFadeLevel() > 0

-- Perform a cross-fade between screens
TheFrontEnd:CrossFadeScreen(new_screen)
```

## Event Handling

```lua
-- Add a screen change handler
TheFrontEnd:AddScreenChangedHandler(function(screen)
    print("Screen changed to: " .. screen.name)
end)

-- Add a globally active keyboard handler
TheFrontEnd:AddGlobalKeyHandler(function(key, down)
    if key == KEY_ESCAPE and down then
        -- Do something when ESC is pressed
        return true -- Returning true consumes the event
    end
    return false -- Let other handlers process this key event
end)

-- Add a widget input handler
TheFrontEnd:AddWidgetInputHandler(widget, function(key, down)
    -- Handle input for a specific widget
end)
```

## Important Considerations

1. **Client-Side Only**: TheFrontEnd only exists on the client, not on dedicated servers
2. **Performance Impact**: Creating complex UI screens can impact performance - keep UI elements minimal
3. **Input Handlers**: Be careful with global input handlers as they could interfere with game controls
4. **Screen Stack**: Be mindful of the screen stack - always pop screens you push to avoid memory issues
5. **Focus Management**: Screens at the top of the stack receive input focus - use it appropriately

## Integration with Other Global Objects

TheFrontEnd often works with other global objects:

- **[TheInput](/docs/api-vanilla/global-objects/theinput)**: For handling user input
- **[ThePlayer](/docs/api-vanilla/global-objects/theplayer)**: For accessing player data to display
- **[TheInventory](/docs/api-vanilla/global-objects/theinventory)**: For displaying inventory items and skins

## Common Use Cases

- **Custom Menus**: Creating mod configuration screens
- **Information Displays**: Showing additional game information or tooltips
- **Notifications**: Creating custom notifications for mod events
- **Custom HUD Elements**: Adding new elements to the game's HUD
- **Interactive UIs**: Building interactive interfaces for mod features 
