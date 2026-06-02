---
title: "React Error Boundary"
description: "Use Bugsee's ErrorBoundary component to automatically catch and report JavaScript errors thrown inside a React component tree."
sidebar_position: 10
slug: "/sdk/react_native/errorboundary"
---

The Bugsee React Native SDK exports an error boundary component that provides [React component APIs](https://reactjs.org/docs/error-boundaries.html) to automatically catch and send JavaScript errors from inside a React component tree to Bugsee


```jsx
import React from "react";
import Bugsee from "react-native-bugsee";

<Bugsee.ErrorBoundary fallback={<p>An error has occurred</p>}>
  <SomeElement />
</Bugsee.ErrorBoundary>
```

## Options

Error boundary component exposes several properties that can be passed in for additional configuration.

**fallback** (`React.ReactNode` or `Function`)

<p style="padding-left: 20px;">A React element to render when the error boundary catches an error. Can be an actual React element (i.e. <Fallback />), or a function that returns a React element. If you provide a function, Bugsee will call it with additional info and helpers.</p>

**onError** (`Function`)

<p style="padding-left: 20px;">A function that gets called when the Error Boundary encounters an error. onError is useful if you want to propagate the error into a state management library like Redux, or if you want to check any side effects that could have occurred due to the error.</p>

**onReset** (`Function`)
<p style="padding-left: 20px;">A function that gets called when the Error Boundary is about to reset its state.</p>


## Examples

```jsx
import React from "react";
import Bugsee from "react-native-bugsee";

const DEFAULT_MESSAGE = 'Welcome!';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      message: DEFAULT_MESSAGE,
    };
  }

  render() {
    return (
      <Bugsee.ErrorBoundary
        fallback={({ error, componentStack, resetError }) => (
          <React.Fragment>
            <div>Error encountered</div>
            <div>{error.toString()}</div>
            <div>{componentStack}</div>
            <button onClick={() => {
                this.setState({ message: DEFAULT_MESSAGE });
                {/* When resetError() is called, Fallback component will be removed */}
                {/* and Bugsee ErrorBoundary's children will be rendered in their initial state */}
                resetError();
            }}>Reset</button>
          </React.Fragment>
        )}
      >
        <div>{this.state.message}</div>
        {/* clicking the button below sets an object instead of a string as message prop */}
        {/* which will trigger an error in the component tree */}
        <button onClick={() => this.setState({ message: { this: "is invalid message" } })}>
          Click here to change message!
        </button>
      </Bugsee.ErrorBoundary>
    );
  }
}

export default App;
```