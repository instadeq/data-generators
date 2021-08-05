# data-generators

Repository with scripts to generate data for guides.

## Setup

The objective of this setup is to leave your local computer as is and make sure
you are using the same tools and versions that we use to avoid compatibility
issues.

If you prefer to install packages in your machine follow the instructions in
the section "Installing the tools in your machine".

For all examples we use bash as the shell.

### Using Nix

The easy way to get all the tools needed up and running on your machine is to
use `nix <https://nix.dev/>`_ and just run the following command on the root of
this repository:

```sh
nix-shell shell.nix
```

If will enter a shell with all the tools available without conflicting with
things installed on your machine.

### Using Docker

On this folder run:

```sh
sudo docker build -t instadeq-data-gen .
sudo docker run -it --rm -v $(pwd):/instadeq-data-generators instadeq-data-gen
```

Inside the docker shell run:

```sh
cd /instadeq-data-generators/
nix-shell
su instadeq
```

### Installing the tools in your machine

We don't ensure that the versions you install will be the same used and locked
on this repo.

#### deno tools

* curl
* `deno <https://deno.land/#installation>`_
