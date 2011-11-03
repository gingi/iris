#!/usr/bin/env perl
# IMPORTANT: if you delete this file your app will not work as
# expected.  You have been warned.
use inc::Module::Install 1.02;
use Module::Install::Catalyst; # Complain loudly if you don't have
                               # Catalyst::Devel installed or haven't said
                               # 'make dist' to create a standalone tarball.

name 'Kbase';
all_from 'lib/Kbase.pm';

requires 'Catalyst::Runtime' => '5.90006';
requires 'Catalyst::Plugin::ConfigLoader';
requires 'Catalyst::Plugin::Static::Simple';
requires 'Catalyst::Plugin::StatusMessage';
requires 'Catalyst::Plugin::StackTrace';
requires 'Catalyst::Plugin::SubRequest';
requires 'Catalyst::Action::RenderView';
requires 'Catalyst::View::JSON';
requires 'Catalyst::Controller::REST';
requires 'Catalyst::Controller::HTML::FormFu';
requires 'Moose';
requires 'namespace::autoclean';
requires 'Config::General'; # This should reflect the config file format you've chosen
                 # See Catalyst::Plugin::ConfigLoader for supported formats
test_requires 'Test::More' => '0.88';
catalyst;

install_script glob('script/*.pl');
auto_install;
WriteAll;
