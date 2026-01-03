Feature: Login

@COS-01
@REQ_LINK=https://docs.google.com/spreadsheets/d/11j8wJ7jR-xv-cc4eK93CsNCQ5zbpYqKz2Vxw8W8AI6o/edit#gid=0&range=A2
Scenario: Successful login with valid credentials
  Given user is on login page
  When user enters valid credentials
  Then user should be logged in

@COS-02
@REQ_LINK=https://docs.google.com/spreadsheets/d/11j8wJ7jR-xv-cc4eK93CsNCQ5zbpYqKz2Vxw8W8AI6o/edit#gid=0&range=A3
Scenario: Login fails with invalid credentials
  Given user is on login page
  When user enters invalid credentials
  Then error message should be displayed

@COS-03
@REQ_LINK=https://docs.google.com/spreadsheets/d/11j8wJ7jR-xv-cc4eK93CsNCQ5zbpYqKz2Vxw8W8AI6o/edit#gid=0&range=A4
Scenario: User logs out successfully
  Given user is logged in
  When user clicks logout
  Then user should be logged out
