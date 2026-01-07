@COS-08
@REQ_LINK=https://docs.google.com/spreadsheets/d/19QLnfMQuvunN7Een-3iJswbUSvkt8n8IvOb8XjgNP14/edit?gid=48925672#gid=48925672&range=C9
Feature: Update Admin
  As a super admin, I want an option to update an existing admin user so that I can modify their details on the platform.

  Background:
    Given super admin is logged in
    And super admin navigates to "Update Admin" page for an existing admin

  Scenario: All mandatory fields must be filled
    When super admin clears mandatory fields
    And super admin clicks "Update" button
    Then error messages should be displayed for each mandatory field

  Scenario: Email verification with OTP
    When super admin updates the email address
    And super admin clicks "Verify Email" button
    Then a 6-digit OTP should be sent to the entered email address

  Scenario: Phone number verification with OTP
    When super admin updates the phone number
    And super admin clicks "Verify Phone" button
    Then a 6-digit OTP should be sent to the entered phone number

  Scenario: OTP is valid for 2 minutes
    Given super admin has received OTP for verification
    When super admin waits for more than 2 minutes
    And super admin enters the OTP
    Then an error message "OTP has expired" should be displayed

  Scenario: Resend OTP option available up to 3 times
    Given super admin has received OTP for verification
    When super admin requests to resend OTP 3 times
    Then the "Resend OTP" option should be disabled

  Scenario: Email or phone saved only after correct OTP
    Given super admin has received OTP for email verification
    When super admin enters the correct OTP
    Then the email address should be marked as verified
    And the updated email address should be saved

  Scenario: Email domain must be zood-pay.com
    When super admin enters email with non-zoodpay domain
    And super admin clicks "Verify Email" button
    Then an error message "Only zood-pay.com email domain is allowed" should be displayed

  Scenario: Country selection enables province list
    When super admin selects a country
    Then a list of provinces for that country should be displayed

  Scenario: Province selection auto-populates region
    When super admin selects a province
    Then the region should be auto-populated

  Scenario: District selection mandatory for Afghanistan
    Given super admin has selected "Afghanistan" as country
    When super admin leaves district field empty
    And super admin clicks "Update" button
    Then an error message "District is mandatory for Afghanistan" should be displayed

  Scenario: District is optional for non-Afghanistan countries
    Given super admin has selected a country other than "Afghanistan"
    When super admin leaves district field empty
    And super admin fills all other mandatory fields
    And super admin clicks "Update" button
    Then the admin user should be updated successfully

  Scenario: Postal code auto-populated for Afghanistan
    When super admin selects "Afghanistan" as country
    And super admin selects province and district
    Then postal code should be auto-populated

  Scenario: Postal code required for non-Afghanistan countries
    Given super admin has selected a country other than "Afghanistan"
    When super admin leaves postal code field empty
    And super admin clicks "Update" button
    Then an error message "Postal code is required" should be displayed

  Scenario: City selection from predefined list for Afghanistan
    Given super admin has selected "Afghanistan" as country
    Then super admin should be able to search and select city from predefined list

  Scenario: City name entry for non-Afghanistan countries
    Given super admin has selected a country other than "Afghanistan"
    Then super admin should be able to manually enter the city name

  Scenario: Country must be selected first
    When super admin tries to select province without selecting country
    Then an error message "Please select a country first" should be displayed

  Scenario: Invalid location data displays error
    When super admin enters country, province, region or district not in predefined list
    Then an appropriate error message should be displayed

  Scenario: Updated admin receives notification email
    Given super admin has updated admin details
    When super admin clicks "Update" button
    And the admin user is updated successfully
    Then the admin should receive an email notification about the changes
