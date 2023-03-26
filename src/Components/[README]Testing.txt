##################################
# Testing & Merging Proceedures  #
# rev. 25 March 2023             #
# Ben Peters                     #
##################################

Any and all changes made to the HPRC-Groundstation frontend, backend, or other code
MUST be made in a separate branch.  This should ideally be named something describing
what feature you're working on at the time, though it is not necessarily a requirement
as often one branch just becomes one person's testing branch.  

While any changes are being developed (ie. before any pull requests have been made), the 
package.json file should contain an ALPHA tag.  For example, this file was introduced in 
version 1.0.1-ALPHA.  Once a pull request has been submitted, that tag should be changed
to -BETA.  It is not necessary to change it back to ALPHA if changes need to be made 
after the pull request is submitted.  This is so that anyone downloading the exe / deb 
file from Slack, Sharepoint, etc. knows whether they are getting a fully tested, release 
version.

Once you are confident in your changes, submit a pull request via GitHub.  Please notify
your subteam software lead when this is done, and they will review it as soon as possible.
Before any pull request is submitted, you should test, using the simulator backend
(groundstation-backend-java/simulation-testing branch), any available data files since
September 1, 2022.  At the time of this writing, the only available file is (14-55-22)-
telemetry_raw.csv, which can be found in the Ground Station Sharepoint.  This corresponds
to the March 18, 2023 test launch, which encounted a mid-flight reboot of the board, making
it valuable for edge-case testing.

Upon completion of code review by your software lead, the master branch will be updated to 
include your commits.  Congratulations!  Your changes are now live, and will be used at the 
next launch (excepting specific cases such as hardware/software failure).  At this time, the 
-BETA tag will be removed, and the exe and deb files will be uploaded to the Sharepoint.

############## Version Naming Conventions ###################
x.y.1 --> either a fix or an update with no new features
x.1.0 --> an update with at least one new feature (not just fixes)
1.0.0 --> special case, to be decided by software lead