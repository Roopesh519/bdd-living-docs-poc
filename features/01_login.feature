@COS-01
@REQ_LINK=https://docs.google.com/spreadsheets/d/19QLnfMQuvunN7Een-3iJswbUSvkt8n8IvOb8XjgNP14/edit?gid=48925672#gid=48925672&range=C2
Feature: Login
  As an Admin, I want an option to login so that I can access the application.

  Background:
    Given user is on the login page

  Scenario: Successful login with valid credentials
    When admin enters valid registered email address
    And admin enters valid password
    And admin clicks the login button
    Then admin should receive a 6-digit OTP on registered email
    And admin should be redirected to OTP verification page

  Scenario: Login fails with invalid email
    When admin enters invalid email address
    And admin enters a password
    And admin clicks the login button
    Then an error message "Invalid email address" should be displayed

  Scenario: Login fails with invalid password
    When admin enters valid registered email address
    And admin enters invalid password
    And admin clicks the login button
    Then an error message "Invalid password" should be displayed

  Scenario: Login fails with non-zoodpay email domain
    When admin enters email with non-zoodpay domain
    And admin enters a password
    And admin clicks the login button
    Then an error message "Only zood-pay.com email IDs are allowed" should be displayed

  Scenario: OTP is 6 digits in length
    Given admin has entered valid credentials
    When admin receives the OTP
    Then the OTP should be exactly 6 digits

  Scenario: OTP expires after 2 minutes
    Given admin has received the OTP
    When admin waits for more than 2 minutes
    And admin enters the OTP
    Then an error message "OTP has expired" should be displayed

  Scenario: Invalid OTP displays error message
    Given admin has received the OTP
    When admin enters an invalid OTP
    Then an error message "Invalid OTP" should be displayed

  Scenario: Resend OTP option available after 30 seconds
    Given admin has received the OTP
    When admin waits for 30 seconds
    Then the "Resend OTP" option should be enabled

  Scenario: Successful login redirects to Dashboard
    Given admin has entered valid credentials
    And admin has received the OTP
    When admin enters valid OTP within 2 minutes
    Then admin should be redirected to the Dashboard
