Feature: Search a course
    Scenario: Reserve a place for tomorrow's session from the first available link
        Given I am on the "https://qamid.tmweb.ru/client/index.php" page
        When I navigate to the movie session page
        And I select the first available session time
        And I select the first available place
        And I confirm the reservation
        Then I should see the QR code for the reservation

    Scenario: Reserve a particular cinema hall in a weekend
        Given I am on the "https://qamid.tmweb.ru/client/index.php" page
        When I navigate to the weekend movie session page
        And I select the VIP session
        And I select the first available VIP place
        And I confirm the reservation
        Then I should see the QR code for the reservation

    Scenario: Trying to reserve already taken place
        Given I am on the "https://qamid.tmweb.ru/client/index.php" page
        When I navigate to the movie session page
        And I select the first available session time
        And I select not available place
        Then The submission button should be inactive