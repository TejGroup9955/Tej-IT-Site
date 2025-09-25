# JMeter Testing Guide for Tej IT Site 🧪

This guide explains how to use Apache JMeter to test the Tej IT Solutions website performance.

## 📋 Prerequisites

1. **Install Java** (JMeter requires Java 8 or higher)
   ```bash
   # Check if Java is installed
   java -version
   
   # If not installed, install Java
   sudo apt update
   sudo apt install openjdk-11-jdk
   ```

2. **Download and Install JMeter**
   ```bash
   # Download JMeter
   wget https://downloads.apache.org/jmeter/binaries/apache-jmeter-5.6.3.tgz
   
   # Extract
   tar -xzf apache-jmeter-5.6.3.tgz
   
   # Move to /opt (optional)
   sudo mv apache-jmeter-5.6.3 /opt/jmeter
   
   # Add to PATH
   echo 'export PATH=$PATH:/opt/jmeter/bin' >> ~/.bashrc
   source ~/.bashrc
   ```

## 🚀 How to Run Tests

### Method 1: GUI Mode (For Beginners)

1. **Start JMeter GUI**
   ```bash
   jmeter
   ```

2. **Open Test Plan**
   - File → Open
   - Navigate to `jmeter_tests/tej-it-site-testplan.jmx`
   - Click Open

3. **Configure Test**
   - In the Test Plan, check the variables:
     - `FRONTEND_URL`: http://10.10.50.93:3001
     - `BACKEND_URL`: http://10.10.50.93:5001

4. **Run Different Tests**
   
   **Smoke Test (Quick Check):**
   - Enable only "Smoke Test" thread group
   - Disable other thread groups
   - Click the green "Start" button
   - Watch results in "View Results Tree"
   
   **Load Test (50-200 Users):**
   - Enable "Load Test" thread group
   - Disable other thread groups
   - Click "Start"
   - Monitor "Summary Report" for performance metrics
   
   **Stress Test (500 Users):**
   - Enable "Stress Test" thread group
   - Disable other thread groups
   - Click "Start"
   - Watch for errors and response times

### Method 2: Command Line (For Automation)

1. **Smoke Test**
   ```bash
   jmeter -n -t jmeter_tests/tej-it-site-testplan.jmx -l smoke-results.jtl -e -o smoke-report/
   ```

2. **Load Test**
   ```bash
   jmeter -n -t jmeter_tests/tej-it-site-testplan.jmx -l load-results.jtl -e -o load-report/ -Jtest.type=load
   ```

3. **Stress Test**
   ```bash
   jmeter -n -t jmeter_tests/tej-it-site-testplan.jmx -l stress-results.jtl -e -o stress-report/ -Jtest.type=stress
   ```

## 📊 Understanding Results

### Key Metrics to Watch

1. **Response Time**
   - Good: < 2 seconds
   - Acceptable: 2-5 seconds
   - Poor: > 5 seconds

2. **Throughput**
   - Requests per second the server can handle
   - Higher is better

3. **Error Rate**
   - Should be < 1% for production
   - 0% is ideal

4. **CPU/Memory Usage**
   - Monitor server resources during tests

### Reading the Reports

**Summary Report:**
- Shows average, min, max response times
- Error percentage
- Throughput (requests/sec)

**View Results Tree:**
- Shows individual request/response details
- Useful for debugging failures

**Response Times Over Time:**
- Shows how performance changes during the test
- Helps identify performance degradation

## 🔧 Test Scenarios Explained

### 1. Smoke Test
- **Purpose**: Quick sanity check
- **Users**: 1 user, 1 loop
- **Tests**: Homepage, health check, basic API calls
- **When to use**: After every deployment

### 2. Load Test
- **Purpose**: Normal expected load
- **Users**: 50-200 users over 5 minutes
- **Tests**: All major pages and APIs
- **When to use**: Before major releases

### 3. Stress Test
- **Purpose**: Find breaking point
- **Users**: Up to 500 users over 10 minutes
- **Tests**: Heavy load on all endpoints
- **When to use**: Capacity planning

## 🛠️ Customizing Tests

### Adding New Endpoints

1. **Right-click on Thread Group** → Add → Sampler → HTTP Request
2. **Configure the request:**
   - Server Name: 10.10.50.93
   - Port: 3001 (frontend) or 5001 (backend)
   - Path: /your-new-endpoint
   - Method: GET/POST/etc.

3. **Add Assertions:**
   - Right-click on HTTP Request → Add → Assertions → Response Assertion
   - Set expected response code (200, 404, etc.)

### Modifying User Load

1. **Select Thread Group**
2. **Modify settings:**
   - Number of Threads: How many virtual users
   - Ramp-up Period: How long to reach full load
   - Loop Count: How many times each user repeats

## 🚨 Troubleshooting

### Common Issues

1. **Connection Refused**
   - Check if the application is running
   - Verify ports 3001 and 5001 are accessible
   - Run: `curl http://10.10.50.93:3001`

2. **High Response Times**
   - Check server CPU/memory usage
   - Look for database bottlenecks
   - Consider scaling up resources

3. **Errors in Results**
   - Check "View Results Tree" for error details
   - Look at server logs: `docker-compose logs`
   - Verify API endpoints are working manually

### Performance Benchmarks

**Good Performance Targets:**
- Homepage: < 2 seconds
- API calls: < 1 second
- Error rate: < 0.1%
- Concurrent users: 100+ without degradation

**Warning Signs:**
- Response times > 5 seconds
- Error rate > 1%
- Memory usage > 80%
- CPU usage > 90%

## 📈 Best Practices

1. **Start Small**: Always run smoke tests first
2. **Gradual Increase**: Increase load gradually
3. **Monitor Resources**: Watch server CPU/memory during tests
4. **Test Regularly**: Include performance tests in CI/CD
5. **Document Results**: Keep records of performance over time

## 🔄 Integration with CI/CD

Add to your Jenkins pipeline:
```bash
# Run smoke test after deployment
jmeter -n -t jmeter_tests/tej-it-site-testplan.jmx -l results.jtl

# Check if any failures occurred
if grep -q "false" results.jtl; then
    echo "Performance test failed!"
    exit 1
fi
```

## 📞 Need Help?

If you encounter issues:
1. Check the JMeter logs in `jmeter.log`
2. Verify the application is running: `./deploy.sh status`
3. Check server resources: `htop` or `docker stats`
4. Contact the DevOps team with test results and error logs

---

**Happy Testing! 🎯**