# JMeter GUI Testing Guide

This guide explains how to run the performance tests for the Smart Personnel Allocation application using Apache JMeter's GUI.

## Prerequisites
- **Apache JMeter**: Ensure JMeter is installed. You can install it via Homebrew on macOS:
  ```bash
  brew install jmeter
  ```
- **Backend Running**: The FastAPI backend must be running locally.
  ```bash
  ./run_local.sh
  ```

## Opening the Test Plan

1. Open a terminal.
2. Navigate to the project directory:
   ```bash
   cd /Users/ponk6745/Desktop/SELab
   ```
3. Launch JMeter with the test plan:
   ```bash
   jmeter -t tests/performance/test_plan.jmx
   ```
   *Alternatively, open JMeter first (`jmeter`), then go to **File > Open** and select `tests/performance/test_plan.jmx`.*

## Test Plan Structure
The test plan "Smart Personnel Allocation Test Plan" contains:
- **Thread Group**: "API Load Test" (configured for 50 users).
- **HTTP Request Defaults**: Sets the base URL (`localhost:8000`).
- **Requests**:
  - `Get People`: `GET /people/`
  - `Get Projects`: `GET /projects/`
  - `Create Allocation`: `POST /allocations/` (Uses `effort_percentage: 0` to avoid availability depletion)
- **Listeners**:
  - `View Results Tree`: Shows detailed request/response data (useful for debugging).
  - `Summary Report`: Shows aggregate metrics like Throughput and Average Response Time.

## Running the Test

1. In the JMeter GUI, look at the top toolbar.
2. Click the green **Start** button (play icon) to run the test.
3. Observe the execution. The numbers in the top right corner indicate active threads (users).

## Viewing Results

### Debugging Individual Requests
1. In the left panel, select **View Results Tree**.
2. Click on any sample (e.g., "Create Allocation") in the list to see:
   - **Sampler result**: Response code and message.
   - **Request**: The actual data sent.
   - **Response data**: The JSON returned by the server.

### Performance Metrics
1. Select **Summary Report**.
2. Monitor key metrics:
   - **# Samples**: Total requests made.
   - **Average**: Average response time in milliseconds.
   - **Min/Max**: Minimum and maximum response times.
   - **Throughput**: Requests per second.
   - **Error %**: Should strictly be 0.00%.

## Troubleshooting
- **Connection Refused**: Ensure the backend is running on `localhost:8000`.
- **404 Not Found**: Check if the endpoints in the test plan match the backend code.
- **timestamp errors**: If you see errors about "Person or Project not found", ensure your database has initial data. You may need to run the app once or use a script to seed data.
