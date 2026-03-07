--Readme document for Emily Onofrio, eonofrio

1. How many assignment points do you believe you completed (replace the *'s with your numbers)?

10/10
- 1/1 The ability to log overnight sleep
- 1/1 The ability to log sleepiness during the day
- 1/1 The ability to view these two categories of logged data
- 2/2 Either using a native device resource or backing up logged data
- 2/2 Following good principles of mobile design
- 2/2 Creating a compelling app
- 1/1 A readme and demo video which explains how these features were implemented and their design rationale

2. How long, in hours, did it take you to complete this assignment?
    TOTAL = 25 hours

 5 hours - getting code working on home page w/ local saving
 2 hours - spliting it up within pages and getting routerlink to actually let me click things
 2 hours - getting background and headers on all tabs + tab bar working
 5 hours - getting sleep set up (endless amount of bugs)
 2 hours - sleepiness
 7 hours - logs, researching how to implement all the stuff i wanted to do (graphs)
 2 hours - readme and finishing touches
 


3. What online resources did you consult when completing this assignment? (list specific URLs)
https://ionicframework.com/docs/api/datetime-button
https://angular.dev/guide/components
https://www.geeksforgeeks.org/angular-js/standalone-components-in-angular/
https://ionicframework.com/docs/angular/overview
https://ionicframework.com/docs/components
https://www.chartjs.org/docs/
https://www.freecodecamp.org/news/how-to-make-bar-and-line-charts-using-chartjs-in-angular/
https://www.joshmorony.com/adding-responsive-charts-graphs-to-ionic-2-applications/
https://www.freecodecamp.org/news/angular-lifecycle-hooks/
https://ionicframework.com/docs/angular/alerts
https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API
https://www.typescriptlang.org/docs/





4. What classmates or other individuals did you consult as part of this assignment? What did you discuss?
    The only one I talked to was Crystal Louis, 
    I had finshed my project and sent her a photo of my sleep page since she asked if I did any UI stuff.


5. Is there anything special we need to know in order to run your code?
    All it needs is npm start and ionic serve.


--Aim for no more than two sentences for each of the following questions.--


6. Did you design your app with a particular type of user in mind? If so, whom?
    The user I had in mind was me, a college student. Someone who is lazy and doesnt want to 
    click a lot of buttons to log things.


7. Did you design your app specifically for iOS or Android, or both?
    I specifically designed it for iOS, andriod works but it doesnt look as good.


8. How can a person log overnight sleep in your app? Why did you choose to support logging overnight sleep in this way?
    A person logs overnight sleep by selecting the night of sleep, their bedtime, and wake-up time. 
    The bedtime defaults to 8 hours before the current time and the wake time defaults to the current 
    time to make logging quick and easy so users are more likely to log their sleep.

9. How can a person log sleepiness during the day in your app? Why did you choose to support logging sleepiness in this way?
    You can log sleepiness by selecting a number 1-7, when selected the number it will display what that number means, and then you can select the time.
    I chose this so that it was simple to log, and you can easily see what the number means when you select this.

10. How can a person view the data they logged in your app? Why did you choose to support viewing logged data in this way?
A person can view their logged data by going to the logs tab, where all entries are displayed and individual logs can be deleted 
by swiping them. I chose this so that you can easily review your data and quickly remove any incorrect entries.    


11. Which feature choose--using a native device resource, backing up logged data, or both?
    Backing up logged data locally. The stores the sleep and sleepiness logs locally so that 
    users can easily look at old data.


12. If you used a native device resource, what feature did you add? How does this feature change the app's experience for a user?
    N/A - Did backing up data instead


13. If you backed up logged data, where does it back up to?
    The data is stored locally in memory using the sleepservice arrays.
    That way it can show past days in the data/charts/logs.

14. How does your app implement or follow principles of good mobile design?
    My app follows good mobile design by keeping things simple, using large buttons, clear tabs,
    and a card layout so that its easy to navigate. It also includes confirmation alerts for logging all data,
    swipe-to-delete options and a alert to confirm the deletion of data.