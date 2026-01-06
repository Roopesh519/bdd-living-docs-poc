@COS-04
@REQ_LINK=https://docs.google.com/spreadsheets/d/19QLnfMQuvunN7Een-3iJswbUSvkt8n8IvOb8XjgNP14/edit?gid=48925672#gid=48925672&range=C5
Feature: Access Privilege
  As a super admin, I want an option to manage privileges while onboarding the admin user to the platform.

  Background:
    Given super admin is logged in
    And super admin is on the admin user privileges page

  Scenario: Super admin has all privileges
    When super admin views the privileges of a super admin user
    Then all privileges should be selected

  Scenario: Selecting Super Admin auto-selects all sub-privileges
    When super admin selects "Super Admin" role
    Then all sub-privileges should be automatically selected

  Scenario: Selecting all privileges auto-selects Super Admin
    When super admin selects all individual privileges
    Then "Super Admin" role should be automatically selected

  Scenario: At least one privilege must be selected
    When super admin deselects all privileges
    And super admin clicks "Save" button
    Then an error message "At least one privilege must be selected" should be displayed

  Scenario: Confirmation prompt when making admin a super admin
    When super admin selects all privileges for an admin user
    Then a confirmation prompt "Are you sure you want to make this admin a Super Admin?" should be displayed

  Scenario: Select all privileges option available
    Then super admin should see a "Select All" option
    When super admin clicks "Select All"
    Then all privileges should be selected

  Scenario: Individual privilege selection available
    When super admin selects a specific privilege
    Then only that privilege should be selected

  Scenario: Selecting privilege auto-selects sub-privileges
    When super admin selects a parent privilege
    Then all sub-privileges under that parent should be automatically selected

  Scenario: Dependent privileges auto-selected
    When super admin selects a privilege that has dependencies
    Then the dependent privileges should also be automatically selected

  Scenario: E-Top up wallet or digital wallet selection
    Then super admin should see options for "E-Top up wallet" and "Digital wallet"
    And super admin should be able to select either option

  Scenario: Success message on admin creation with privileges
    Given super admin has filled all mandatory fields
    And super admin has selected at least one privilege
    When super admin clicks "Save" button
    Then a success message "Admin user added successfully" should be displayed

  Scenario: Confirmation prompt before adding access privilege roles
    Given super admin has selected privileges for the admin user
    When super admin clicks "Save" button
    Then a confirmation prompt should be displayed
    When super admin confirms the action
    Then a success message should be displayed

  Scenario: Confirmation prompt when unselecting Super Admin access
    Given an admin user has Super Admin access
    When super admin unselects the Super Admin access
    Then a confirmation prompt "Are you sure you want to remove Super Admin access?" should be displayed
