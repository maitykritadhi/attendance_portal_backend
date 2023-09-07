#  https://pynative.com/python-generate-random-string/  ->site ..

import random
import string

# importing the requests library
import requests

# defining the api-endpoint
API_ENDPOINT = "http://localhost:3000/api/students/signup"

def get_random_string(length):
    # choose from all lowercase letter
    letters = string.ascii_lowercase
    result_str = ''.join(random.choice(letters) for i in range(length))
    print("Random string of length", length, "is:", result_str)
    return result_str
    
    
# Start   
n = 30
size = 8

while (n>0):
    name = get_random_string(size)
    print(name)
    password = name + "123"
    mail = name + "@gmail.com"
    y = "{0:02d}".format(n)
    roll = "1901bb" + str(y)
    n-=1
    
    # data to be sent to api
    data = {
        "name" : name,
        "roll" : roll,
        "mail" : mail,
        "password" : password
    }
    
    # sending post request and saving response as response object
    r = requests.post(url=API_ENDPOINT, data=data)
    print(r)



# get_random_string(8)
# get_random_string(6)
# get_random_string(4)




