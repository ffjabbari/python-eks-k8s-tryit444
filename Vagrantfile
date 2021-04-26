# -*- mode: ruby -*-
# vi: set ft=ruby :

APP_SETUP_SCRIPT = "vagrant_scripts/vmSetup.sh"
TEST_ENV_SETUP_SCRIPT = "vagrant_scripts/vmSetup_testEnv.sh"

Vagrant.configure("2") do |config|
    # Common Provider Settings
    # config.vm.provider "virtualbox" do |v|
        # v.name = "Devops Machine"
        # v.gui = true
        # v.customize ["modifyvm", :id, "--memory", 2048] # Increase the memory limit to ~2GB
    # end

    config.vm.define "master" do |master|
        master.vm.box = "hashicorp/bionic64"
        master.vm.box_version = "1.0.282"
        master.vm.hostname = "master.mkornyev.com"
        master.vm.network "private_network", ip: "10.0.0.200"
        master.vm.provider "virtualbox" do |v|
            v.name = "master"
            # v.gui = true
            # v.memory = 2048
            # v.cpus = 2
        end

        # master.vm.provision :docker
        # master.vm.provision :shell, path: APP_SETUP_SCRIPT
        master.vm.provision :shell, path: TEST_ENV_SETUP_SCRIPT
    end

end
