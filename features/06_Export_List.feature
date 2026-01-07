@COS-06
@REQ_LINK=https://docs.google.com/spreadsheets/d/19QLnfMQuvunN7Een-3iJswbUSvkt8n8IvOb8XjgNP14/edit?gid=48925672#gid=48925672&range=C7
Feature: Export List
  As a super admin, I want an option to export the list of all the admin users on the platform.

  Background:
    Given super admin is logged in
    And super admin is on the "Admin Users" list page

  Scenario: Export option is available
    Then super admin should see an "Export" button

  Scenario: Export format options available
    When super admin clicks on "Export" button
    Then super admin should see export format options
    And the options should include "CSV", "PDF", and "XLSX"

  Scenario: Export list as CSV
    When super admin clicks on "Export" button
    And super admin selects "CSV" format
    Then a confirmation message "Export will be sent to your email" should be displayed

  Scenario: Export list as PDF
    When super admin clicks on "Export" button
    And super admin selects "PDF" format
    Then a confirmation message "Export will be sent to your email" should be displayed

  Scenario: Export list as XLSX
    When super admin clicks on "Export" button
    And super admin selects "XLSX" format
    Then a confirmation message "Export will be sent to your email" should be displayed

  Scenario: Exported list is sent via email
    Given super admin has selected an export format
    When the export is processed
    Then super admin should receive an email with the exported file
    And the email should contain the admin users list in the selected format
