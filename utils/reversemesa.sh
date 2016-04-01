mkdir mesarevert
cd mesarevert
sudo apt-get clean
sudo apt-get update

apt-get download libdrm-freedreno1 libgl1-mesa-dri libegl1-mesa libglapi-mesa libgl1-mesa-glx libgles1-mesa libgles2-mesa libglu1-mesa libwayland-egl1-mesa mesa-utils libgbm1

sudo dpkg -i libdrm-freedreno1_2.4.65-3~bpo8+1_armhf.deb
sudo dpkg -i libegl1-mesa_11.1.0-1+rpi1_armhf.deb
sudo dpkg -i libgbm1_11.1.0-1+rpi1_armhf.deb
sudo dpkg -i libgl1-mesa-dri_11.1.0-1+rpi1_armhf.deb
sudo dpkg -i libgl1-mesa-glx_11.1.0-1+rpi1_armhf.deb
sudo dpkg -i libglapi-mesa_11.1.0-1+rpi1_armhf.deb
sudo dpkg -i libgles1-mesa_11.1.0-1+rpi1_armhf.deb
sudo dpkg -i libgles2-mesa_11.1.0-1+rpi1_armhf.deb
sudo dpkg -i libglu1-mesa_9.0.0-2_armhf.deb
sudo dpkg -i libwayland-egl1-mesa_11.1.0-1+rpi1_armhf.deb
sudo dpkg -i mesa-utils_8.2.0-1_armhf.deb

