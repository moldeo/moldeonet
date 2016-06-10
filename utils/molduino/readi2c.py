
import smbus
import time

bus = smbus.SMBus(1)
address = 0x08

bus.write_i2c_block_data( address, 87, [] )
time.sleep(0.2)
Register = bus.read_i2c_block_data( address, 87, 14 )


for v in range(7): 
	val = Register[v*2]
	val2 = Register[v*2+1]
	if (val2<255):
		val = val + val2*256
	print val

