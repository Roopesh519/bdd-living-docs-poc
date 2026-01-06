@COS-02
@REQ_LINK=https://docs.google.com/spreadsheets/d/19QLnfMQuvunN7Een-3iJswbUSvkt8n8IvOb8XjgNP14/edit?gid=48925672#gid=48925672&range=C3
Feature: Forgot Password
  As an Admin who forgot the password, I want an option to reset my password so that I can set a new password and log in.

  Background:
    Given user is on the login page
    And user clicks on "Forgot Password" link

  Scenario: Password reset email sent for valid registered email
    When admin enters a valid registered email address
    And admin clicks "Submit" button
    Then admin should receive an email with password reset instructions
    And the email should contain a link to reset the password

  Scenario: Error displayed for invalid email address
    When admin enters an invalid email address
    And admin clicks "Submit" button
    Then an error message "Invalid email address" should be displayed

  Scenario: Error displayed for unregistered email address
    When admin enters an unregistered email address
    And admin clicks "Submit" button
    Then an error message "Email address not registered" should be displayed

  Scenario: Password reset form displays new password and confirm password fields
    Given admin has clicked on the password reset link from email
    Then admin should see "New Password" field
    And admin should see "Confirm Password" field

  Scenario: Password meets complexity requirements
    Given admin is on the password reset page
    When admin enters a new password with less than 6 characters
    Then an error message "Password must be at least 6 characters" should be displayed

  Scenario: Password requires special character and number
    Given admin is on the password reset page
    When admin enters a password without special character or number
    Then an error message "Password must contain one special character and one number" should be displayed

  Scenario: Password mismatch displays error
    Given admin is on the password reset page
    When admin enters "NewPass@1" in new password field
    And admin enters "DiffPass@2" in confirm password field
    And admin clicks "Reset Password" button
    Then an error message "Passwords do not match" should be displayed

  Scenario: Empty password fields display error
    Given admin is on the password reset page
    When admin leaves the password fields empty
    And admin clicks "Reset Password" button
    Then an error message "Password fields are required" should be displayed

  Scenario: Successful password reset allows login with new password
    Given admin is on the password reset page
    When admin enters "NewPass@1" in new password field
    And admin enters "NewPass@1" in confirm password field
    And admin clicks "Reset Password" button
    Then a success message "Password reset successfully" should be displayed
    And admin should be able to login with the new password
