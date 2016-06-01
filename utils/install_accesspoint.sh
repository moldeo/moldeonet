sudo apt-get install isc-dhcp-server

# edit "/etc/dhcp/dhcpd.conf"
# ddns-update-style interim;
# default-lease-time 600;
# max-lease-time 7200;
# authoritative;
# log-facility local7;
# subnet 192.168.1.0 netmask 255.255.255.0 {
#  range 192.168.1.5 192.168.1.150;
# }
sudo nano /etc/dhcp/dhcpd.conf  

# create and edit "/etc/network/interfaces-adhoc"
# auto lo
# iface lo inet loopback
# iface eth0 inet dhcp
#
# auto wlan0
# iface wlan0 inet static
# address 192.168.1.1
# netmask 255.255.255.0
# wireless-channel 1
# wireless-essid RPiwireless
# wireless-mode ad-hoc
sudo nano /etc/network/interfaces-adhoc
#sudo cp interfaces interfaces.bk
#sudo cp /etc/network/interfaces-adhoc interfaces

