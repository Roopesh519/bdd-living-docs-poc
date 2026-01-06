@COS-05
@REQ_LINK=https://docs.google.com/spreadsheets/d/19QLnfMQuvunN7Een-3iJswbUSvkt8n8IvOb8XjgNP14/edit?gid=48925672#gid=48925672&range=C6
Feature: List Admin
  As a super admin, I want to view a list of admin users so that I can manage them.

  Background:
    Given super admin is logged in
    And super admin navigates to "Admin Users" list page

  Scenario: Users listed in chronological order by default
    When the admin users list is displayed
    Then users should be sorted by creation date in descending order

  Scenario: Search admin by name
    When super admin enters a name in the search field
    And super admin clicks "Search" button
    Then only admin users matching the name should be displayed

  Scenario: Search admin by user code
    When super admin enters a user code in the search field
    And super admin clicks "Search" button
    Then only admin users matching the user code should be displayed

  Scenario: Filter by active status
    When super admin selects "Active" status filter
    Then only active admin users should be displayed

  Scenario: Filter by inactive status
    When super admin selects "Inactive" status filter
    Then only inactive admin users should be displayed

  Scenario: Filter by date range
    When super admin selects a start date and end date
    And super admin applies the filter
    Then only admin users created within that date range should be displayed

  Scenario: Pagination with more than 10 users
    Given there are more than 10 admin users in the system
    When the admin users list is displayed
    Then pagination controls should be visible
    And only 10 users should be displayed per page

  Scenario: Sort by name
    When super admin clicks on "Name" column header
    Then admin users should be sorted alphabetically by name

  Scenario: Sort by created date
    When super admin clicks on "Created Date" column header
    Then admin users should be sorted by creation date

  Scenario: Empty state when no users exist
    Given there are no admin users in the system
    When the admin users list page loads
    Then an empty screen should be displayed
    And a message "No admin users found" should be shown

  Scenario: No results found for filter
    When super admin applies a filter with no matching results
    Then a message "No results found for the applied filter" should be displayed

  Scenario: Start date greater than end date shows error
    When super admin selects a start date greater than end date
    And super admin applies the filter
    Then an error message "Start date cannot be greater than end date" should be displayed
