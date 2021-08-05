
```sh
let hook_url = CHANGE_ME_FOR_A_HOOK_URL

post $hook_url (ps | to csv)

post $hook_url (sys | get disks | to csv)

post $hook_url (sys | get mem | to csv)

post $hook_url (sys | get net | to csv)
```
