############################
# Creating a New Component #
# rev. March 22, 2023      #
# Benjamin Peters          #
############################

The overall format of the groundstation is 
Main --> Layout --> Components

########### Main ##################

The Main class handles a lot of the top-level code (no, really? so insightful!)
any code which affects more than one Component has to be here.  One difficulty
with React etc. is making one Component (eg. a button) affect the entire state of
the application.

The way we currently handle this is using the fact that React will cascade state
and prop updates automatically.  For any button in a low-level Component, there
is a function in the Main class for that button.  This function is then passed
down into the Component via props/state, and when the function is triggered it
will change the state/props of Main.  React will cascade this change down via 
Layout to every Component, so long as they're being updated properly (see below
re: getDerivedStateFromProps).  This process, however, is asynchronous, so do not
rely on functions in Main to update the state of the original Component, as it can
lead to desyncs between the display and the code or between elements of the display.

############# Layout ###############

Layout handles the positions of all upper-level Components.  This is the only 
file (as of now) that has flexbox-grid enabled, which means you can use Col and
Row elements.  This is recommended, so that everything is properly aligned without
any additional work.  Also, always use vh and vw for sizing (vertically and 
horizontally, respectively).  This makes it so that the screen does not get messed
up depending on screen size & resolution.

############# Component ############

Components are the UI elements that make up the actual interface.  The most important
things in each Component are as follows:

1. getDerivedStateFromProps(current_state, props)

This function is what forces an update of the state of the Component when the props
change.  This is especially important since many legacy Components from 2021-22 especially
tend to use State to handle the 'current' status of a component while props have the
'update'.  Some later Components use props directly, as those are automatically updated
by React (see Main above).

It is important to check to make sure that the props have actually changed before updating,
especially with a Component that is not time-dependent (ie. temperature or pressure readout).
This is typically done with a single if statement:

if(current_state.[some prop] !== props.[some prop] ||
   current_state.[other prop] !== props.[other prop] ....)

2. constructor(props)

This is where we create the props and state for a new Component, usually on app startup.
It's also important to do super(props), but the most important thing is to make sure every
state of the Component is created, otherwise it will cause errors when it tries to create
the Component and render things dependent on state(s) if they do not yet exist.

3. render()

This is where you can put any code that needs to run every time the system updates.  Also,
the actual rendering of the Component is handled in the return() statement of this method.
This will also be where you integrate SVGs into the UI - there should not be SVGs in Layout.