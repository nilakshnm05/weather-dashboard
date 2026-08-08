# JavaScript Promises & Async Orchestration

## Weather App learning notes: Promises, async/await,Promise.all(), try/catch/finally, loading UI state, orchestration,and separation of responsibilities.

### 1. Async Functions Return Promises

An async function always returns a Promise.

async function getWeatherData() {
  // asynchronous work
}

const result = getWeatherData();

result is a Promise representing the eventual completion of thefunction, not the final value itself.

async function
      ↓
   Promise
      ↓
 ┌────┴─────┐
 ↓          ↓
fulfilled  rejected

Fulfilled → operation completed successfully.

Rejected → operation failed.

### 2. await

await waits for a Promise inside an async function.

const response = await fetch(url);

Conceptually:

start async operation
        ↓
      await
        ↓
wait for this Promise
        ↓
continue the async function

await pauses the current async function; it does not freeze theentire JavaScript application.

### 3. Sequential vs Concurrent Async Operations

For two independent operations:

await getWeatherData();
await getWeeklyForecast();

the code awaits the first operation before continuing to the second.

When the operations are independent, we can start both and wait forboth:

await Promise.all([
  getWeatherData(),
  getWeeklyForecast(),
]);

Mental model:

Weather ───────────────→ done
Forecast ───────→ done
              ↓
        both complete

This is useful when the tasks do not depend on each other's result.

### 4. Promise.all()

Promise.all() combines multiple Promises into one Promise.

const results = await Promise.all([
  getWeatherData(locationQuery),
  getWeeklyForecast(locationQuery),
]);

Behavior

Fulfills when all input Promises fulfill.

Rejects when any input Promise rejects.

Results are returned in the same order as the input Promises.

The operations can run concurrently rather than waiting for oneanother sequentially.

Example:

const results = await Promise.all([
  getUser(),
  getPosts(),
]);

Then:

results[0] → getUser() result
results[1] → getPosts() result

The result order is based on the input array, not on which requestfinishes first.

### 5. Promise.all() Does Not Require Useful Return Values

An async function can finish without explicitly returning data:

async function task() {
  console.log("Task completed");
}

It still returns a Promise.

Therefore this is valid:

await Promise.all([
  taskA(),
  taskB(),
]);

Sometimes we do not need the results. We only care that all operationshave finished.

In the Weather App

We use:

await Promise.all([
  getWeatherData(locationQuery),
  getWeeklyForecast(locationQuery),
]);

because loadWeather() needs to know when both weather-relatedoperations are complete.

### 6. .then() vs Promise.all()

These solve different problems.

.then()

Attaches a continuation to a Promise:

somePromise.then(() => {
  // runs after this Promise fulfills
});

Mental model:

Promise A
   ↓
fulfilled
   ↓
.then()
   ↓
continue

Promise.all()

Coordinates multiple Promises:

Promise.all([
  promiseA,
  promiseB,
]);

Mental model:

Promise A ──┐
            ├──→ Promise.all()
Promise B ──┘
                  ↓
             both fulfill

.then() and Promise.all() are therefore not interchangeable.

### 7. try, catch, and finally

try {
  // operation that may fail
} catch (error) {
  // handle the error
} finally {
  // cleanup
}

try

Contains the operation being attempted.

catch

Handles an error thrown during the try block.

finally

Runs after the try/catch process regardless of whether it succeedsor fails.

Example:

try {
  await fetchData();
} catch (error) {
  console.error(error);
} finally {
  hideLoadingState();
}

finally is especially useful for cleanup.

### 8. finally Also Runs After return

finally runs even when the try block exits through return.

try {
  if (condition) {
    return;
  }
} finally {
  cleanup();
}

Conceptually:

try
 ↓
return requested
 ↓
finally runs
 ↓
function exits

This is useful when something must happen regardless of which path theoperation takes.

### 9. Loading State Is UI State

A loading spinner represents a state of the interface.

A simplified lifecycle is:

IDLE
 ↓
LOADING
 ↓
SUCCESS

or:

IDLE
 ↓
LOADING
 ↓
ERROR

The loading indicator should represent the lifecycle of the operation itbelongs to.

In our Weather App:

showLoadingState();

activates loading UI.

hideLoadingState();

ends loading UI.

### 10. Why Loading Should Not Belong to One API Function

A weather search requires multiple operations:

Search
 ├── current weather
 └── weekly forecast

If getWeatherData() alone hides the spinner, the spinner coulddisappear while the forecast is still loading.

Therefore:

The function coordinating the complete operation should own theloading state.

That led to the creation of loadWeather().

### 11. Orchestration

Orchestration means coordinating multiple smaller operations tocomplete one higher-level task.

In our project:

             loadWeather()
                  │
          ┌───────┴───────┐
          ↓               ↓
 getWeatherData()  getWeeklyForecast()
          │               │
          └───────┬───────┘
                  ↓
             Promise.all()
                  ↓
             both complete

The individual functions perform their own tasks.

The orchestrator decides how those tasks work together.

Core principle

Individual functions perform focused work; an orchestratorcoordinates that work.

### 12. loadWeather() in Our Project

async function loadWeather(locationQuery) {
  showLoadingState();

  try {
    await Promise.all([
      getWeatherData(locationQuery),
      getWeeklyForecast(locationQuery),
    ]);
  } finally {
    hideLoadingState();
  }
}

Its responsibilities are:

Start the loading state.

Start the weather and forecast operations.

Wait for both operations.

End the loading state.

### 13. Reusing the Orchestrator

Both manual search and geolocation require the same workflow.

handleSearch() ──────┐
                     ↓
                loadWeather()
                     ↑
getLocation() ───────┘

This removes duplicated coordination logic.

The callers provide a location query:

loadWeather(`q=${cityName}`);

or:

loadWeather(`lat=${latitude}&lon=${longitude}`);

loadWeather() does not care where the location came from.

### 14. Separation of Responsibilities

After the refactor:

Function                Responsibility

handleSearch()        Read and validate search inputgetLocation()         Obtain geographic coordinatesloadWeather()         Orchestrate the complete weather-loading processgetWeatherData()      Handle current-weather datagetWeeklyForecast()   Handle forecast datashowLoadingState()    Activate loading UIhideLoadingState()    Remove loading UI

This improves readability, reuse, and maintainability.

### 15. Good Abstraction vs Unnecessary Abstraction

Abstraction is useful when it represents a genuine sharedresponsibility.

Good abstraction

Create one when:

the same responsibility is needed in multiple places

it gives that responsibility a clear name

it removes meaningful duplication

it makes the architecture easier to understand

Unnecessary abstraction

Avoid creating functions merely to:

wrap one trivial line

reduce line count

make code look more professional

follow a rule that everything must be abstracted

We created loadWeather() because both search and geolocation genuinelyneed the same weather + forecast orchestration.

## Weather App Mental Model

                         USER
                           │
              ┌────────────┴────────────┐
              ↓                         ↓
        Manual Search             Geolocation
              │                         │
              └────────────┬────────────┘
                           ↓
                    loadWeather()
                           │
                    showLoadingState()
                           │
                 ┌─────────┴─────────┐
                 ↓                   ↓
          getWeatherData()   getWeeklyForecast()
                 │                   │
                 └─────────┬─────────┘
                           ↓
                      Promise.all()
                           │
                           ↓
                     both complete
                           │
                           ↓
                   hideLoadingState()

## Key Takeaways

- async functions return Promises.

- await waits for a Promise inside an async function.

- Independent async operations can be coordinated withPromise.all().

- Promise.all() fulfills when all input Promises fulfill.

- Promise.all() rejects when any input Promise rejects.

- finally is useful when cleanup must happen regardless of successor failure.

- Loading indicators are UI state.

- The owner of a higher-level operation should coordinate its relatedUI state.

- An orchestrator coordinates multiple focused operations.

- Good abstraction removes genuine duplication and clarifiesresponsibility.

## Revision Question

1. Why is this better than putting loading-state management insidegetWeatherData()?

async function loadWeather(locationQuery) {
  showLoadingState();

  try {
    await Promise.all([
      getWeatherData(locationQuery),
      getWeeklyForecast(locationQuery),
    ]);
  } finally {
    hideLoadingState();
  }
}

- Answer: The spinner represents the complete weather-loadingoperation, which contains multiple asynchronous tasks. loadWeather()owns that higher-level operation, while getWeatherData() isresponsible only for current-weather data

