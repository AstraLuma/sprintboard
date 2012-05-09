This is a backend for disk usage from a remote machine.

Properly setting up this module is somewhat complex. It goes approximately like this:

1. Set up a user on the remote machine
2. Set up public/private keys so that SprintBoard can log in to the remote without user intervention
3. On the remote box, set a cron job to save the output of `du` to a file SprintBoard can access
4. Configure remote-df for all this

This is meant to allow security and permissions to be maintained.