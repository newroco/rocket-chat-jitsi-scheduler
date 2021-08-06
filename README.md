# Jitsi Video Conference Scheduler

Schedule Jitsi video calls by using the **/schedule** slash command.

**Note!** Jitsi does not allow scheduling video calls, this method will only create a meeting link
and will provide some info about the meeting, like the date, time and meeting name which the creator used.
The user cannot select who will participate in the conference and every user in the room will see a
'Participate' button with which they can generate their participation link.

The command requires 2 arguments, the **date** and the **time**, and
has a 3rd optional argument, the **meeting name**. 

If you do provide a meeting name keep in mind that Jitsi uses the meeting name in 
the link of the video call so everyone who has the link can join the call.
For example, if you choose a meeting name like '10AM' and someone else in your organisation
chooses the same meeting name then both of you will have the same link
and will join the same call.

If you don't provide a meeting name then the meeting name will be generated randomly.

Usage: 
`` /schedule DATE TIME MEETING NAME ``

Examples:
- `` /schedule 08/23/2021 02:05PM My Awesome Video Conference ``
- `` /schedule 08/23/2021 09:00AM ``
- `` /schedule Today 5PM ``
