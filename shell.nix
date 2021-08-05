{ pkgs ? import (fetchTarball "https://github.com/NixOS/nixpkgs/archive/nixos-21.05.tar.gz") {} }:
with pkgs;

mkShell {
  LOCALE_ARCHIVE_2_27 = "${glibcLocales}/lib/locale/locale-archive";
  buildInputs = [
    glibcLocales
    gnumake
    python39
    python39Packages.pylint
    pkgs.nodejs-14_x
    deno
    curl
    bat
  ];
  shellHook = ''
    export LC_ALL=en_US.UTF-8
    export PATH=$PWD/node_modules/.bin:$PATH
  '';
}
