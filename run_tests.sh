#!/bin/bash

echo "🚀 Running JMeter Load Test..."

# Create results directory
rm -rf tests/performance/results
mkdir -p tests/performance/results

# Run JMeter in non-GUI mode
jmeter -n \
    -t tests/performance/test_plan.jmx \
    -l tests/performance/results/results.jtl \
    -e -o tests/performance/results/dashboard

echo "✅ Test complete!"
echo "📊 Dashboard: tests/performance/results/dashboard/index.html"
