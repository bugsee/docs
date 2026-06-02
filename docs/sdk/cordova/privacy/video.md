---
title: "Privacy and video"
description: "How to pause recording, mark views as protected, hide screen regions by coordinates, and suppress keyboard capture in the Bugsee Cordova SDK."
sidebar_position: 1
slug: "/sdk/cordova/privacy/video"
---

# Going dark

In some rare cases you might want to conceal the whole screen and stop recording events completely. The following APIs will come in handy, no data is being gathered between the calls to pause and resume.

```javascript
// To stop video recording use   
Bugsee.pause();

// And to continue
Bugsee.resume();
```

### Marking view as protected in code

You can mark any view as protected and in this case it will be covered with black box automatically. Use `Bugsee.toggleProtected()` method to achieve this. It accepts two parameters: `component` and `state`. First should be a reference to the component you want to hide/show and second is a boolean value of `protected` flag (either `true` or `false`).

```jsx
<TextInput
    style={{height: 40, borderColor: 'gray', borderWidth: 1}}
    onChangeText={(text) => this.setState({text})}
    value={this.state.text} ref={comp => Bugsee.toggleProtected(comp, true)}
/>
```


### Protecting by coordinates

Bugsee allows hiding screen area by absolute coordinates as well. Notice that iOS and Android approaches to hiding specific area differ a bit.

```javascript
// Values are: X, Y, Width, Height
Bugsee.addSecureRect:(10, 10, 400, 600);
```

You also need to be aware of the orientation that can be changed during application work. Recreate rectangle after orientation change, if 'black box' on video does not cover all secure fields and elements.

Other methods of secure rectangles:

```javascript
// Remove rect
Bugsee.removeSecureRect(10, 10, 100, 100);

// Get all rectangles
const rectangles = await Bugsee.getAllSecureRects();

// Remove all rectangles
Bugsee.removeAllSecureRects();
```


## Hiding keyboard (iOS only)

In some cases you might want to prevent keyboard to be captured on video (as well as touches). You can use the following method to achieve the desired effect.

```javascript
// To let us capture keyboard
Bugsee.setKeyboardVisibility(true);

// To prevent keyboard from being captured
Bugsee.setKeyboardVisibility(false);
```