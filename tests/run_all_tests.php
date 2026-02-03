<?php
// Main test runner for PHP unit tests

echo "========================================\n";
echo "Running All Unit Tests\n";
echo "========================================\n";

// Run database connection tests
echo "\n1. Testing Database Connection:\n";
include 'unit/ConnTest.php';

// Run registration tests
echo "\n2. Testing Registration Functionality:\n";
include 'unit/RegisterTest.php';

// Run login tests
echo "\n3. Testing Login Functionality:\n";
include 'unit/LoginTest.php';

echo "\n========================================\n";
echo "All tests completed!\n";
echo "========================================\n";
?>