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

@COS-04
@REQ_LINK=https://docs.google.com/spreadsheets/d/11j8wJ7jR-xv-cc4eK93CsNCQ5zbpYqKz2Vxw8W8AI6o/edit#gid=0&range=A5
Scenario: Login fails with empty username
  Given user is on login page
  When user leaves username empty and enters password
  Then error message "Username is required" should be displayed

@COS-05
@REQ_LINK=https://docs.google.com/spreadsheets/d/11j8wJ7jR-xv-cc4eK93CsNCQ5zbpYqKz2Vxw8W8AI6o/edit#gid=0&range=A6
Scenario: Login fails with empty password
  Given user is on login page
  When user enters username and leaves password empty
  Then error message "Password is required" should be displayed

@COS-06
@REQ_LINK=https://docs.google.com/spreadsheets/d/11j8wJ7jR-xv-cc4eK93CsNCQ5zbpYqKz2Vxw8W8AI6o/edit#gid=0&range=A7
Scenario: Account locks after multiple failed attempts
  Given user is on login page
  When user enters invalid credentials 5 times
  Then account should be locked
  And error message "Account locked. Try again in 15 minutes" should be displayed

@COS-07
@REQ_LINK=https://docs.google.com/spreadsheets/d/11j8wJ7jR-xv-cc4eK93CsNCQ5zbpYqKz2Vxw8W8AI6o/edit#gid=0&range=A8
Scenario: User can reset password via forgot password link
  Given user is on login page
  When user clicks "Forgot Password" link
  And user enters registered email
  Then password reset email should be sent

@COS-08
@REQ_LINK=https://docs.google.com/spreadsheets/d/11j8wJ7jR-xv-cc4eK93CsNCQ5zbpYqKz2Vxw8W8AI6o/edit#gid=0&range=A9
Scenario: Session expires after inactivity
  Given user is logged in
  When user is inactive for 30 minutes
  Then user session should expire
  And user should be redirected to login page

@COS-09
@REQ_LINK=https://docs.google.com/spreadsheets/d/11j8wJ7jR-xv-cc4eK93CsNCQ5zbpYqKz2Vxw8W8AI6o/edit#gid=0&range=A10
Scenario: Remember me keeps user logged in
  Given user is on login page
  When user enters valid credentials
  And user checks "Remember me" checkbox
  And user closes and reopens browser
  Then user should still be logged in

@COS-10
@REQ_LINK=https://docs.google.com/spreadsheets/d/11j8wJ7jR-xv-cc4eK93CsNCQ5zbpYqKz2Vxw8W8AI6o/edit#gid=0&range=A11
Scenario: User can toggle password visibility
  Given user is on login page
  When user enters password in password field
  And user clicks show password icon
  Then password should be visible in plain text
