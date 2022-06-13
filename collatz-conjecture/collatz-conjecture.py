def collatz(n): # making the collatz function
    while n != 1: # this tells the code to keep running until it reaches 1
        if n % 2: # if the number is odd, run code below
            n = n*3 + 1
        else: # else, if the number is even, run code below
            n = n / 2
        print(n) # output number onto screen

num = int(input("Enter a number to test: ")) # this allows you to put in a different number while running the code instead of having to change the code each time
collatz(num) # run the collatz function with the number you type in
input() # this is there to let you read the output, but otherwise useless to the code